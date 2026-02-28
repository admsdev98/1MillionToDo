const { getRateLimitPerMinuteForPlan } = require("../lib/plan-limits");
const { getUserById } = require("../lib/users");
const { toHttpError } = require("../lib/http-error");

const WINDOW_MS = 60 * 1000;

function nowMs() {
  return Date.now();
}

function getClientIp(request) {
  // Fastify sets request.ip; keep this simple for local + Docker.
  return request.ip || "unknown";
}

function makeLimiter() {
  const buckets = new Map();

  function consume(key, limitPerMinute) {
    const current = nowMs();
    const bucket = buckets.get(key);

    if (!bucket || current >= bucket.resetAtMs) {
      buckets.set(key, {
        used: 1,
        resetAtMs: current + WINDOW_MS,
      });

      return { allowed: true, remaining: Math.max(0, limitPerMinute - 1), resetAtMs: current + WINDOW_MS };
    }

    if (bucket.used >= limitPerMinute) {
      return { allowed: false, remaining: 0, resetAtMs: bucket.resetAtMs };
    }

    bucket.used += 1;
    return {
      allowed: true,
      remaining: Math.max(0, limitPerMinute - bucket.used),
      resetAtMs: bucket.resetAtMs,
    };
  }

  return {
    consume,
  };
}

async function rateLimitPlugin(fastify) {
  const limiter = makeLimiter();

  fastify.decorate("rateLimitUnauthenticated", async function rateLimitUnauthenticated(request, reply) {
    const ip = getClientIp(request);
    const key = `ip:${ip}`;

    // Use the free plan budget for unauth endpoints.
    const limitPerMinute = getRateLimitPerMinuteForPlan("free");
    const result = limiter.consume(key, limitPerMinute);

    if (!result.allowed) {
      const retryAfterSeconds = Math.max(1, Math.ceil((result.resetAtMs - nowMs()) / 1000));
      reply.header("retry-after", String(retryAfterSeconds));
      throw toHttpError(429, "Rate limit exceeded", "RATE_LIMITED");
    }
  });

  fastify.decorate("rateLimitAuthenticated", async function rateLimitAuthenticated(request, reply) {
    const userId = request.user && (request.user.userId || request.user.sub);
    if (!userId) {
      // If a route calls this without authentication, treat it as unauth.
      return fastify.rateLimitUnauthenticated(request, reply);
    }

    const user = await getUserById(fastify.db, userId);
    // If a token references a missing user, behave as unauthorized.
    if (!user) {
      throw toHttpError(401, "Authentication required", "UNAUTHORIZED");
    }

    const limitPerMinute = getRateLimitPerMinuteForPlan(user.plan);
    const key = `user:${user.id}`;
    const result = limiter.consume(key, limitPerMinute);

    if (!result.allowed) {
      const retryAfterSeconds = Math.max(1, Math.ceil((result.resetAtMs - nowMs()) / 1000));
      reply.header("retry-after", String(retryAfterSeconds));
      throw toHttpError(429, "Rate limit exceeded", "RATE_LIMITED");
    }
  });
}

module.exports = rateLimitPlugin;
