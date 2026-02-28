const REQUEST_START_NS = Symbol("requestStartNs");
const REQUEST_TIMESTAMP = Symbol("requestTimestamp");

const MAX_LOGS_PER_USER = 50;

function ensureUserBucket(map, userId) {
  let bucket = map.get(userId);
  if (!bucket) {
    bucket = [];
    map.set(userId, bucket);
  }
  return bucket;
}

async function requestLoggerPlugin(fastify) {
  const logsByUserId = new Map();

  fastify.decorate("requestLogs", {
    list(userId) {
      return logsByUserId.get(userId) || [];
    },
  });

  fastify.addHook("onRequest", async (request) => {
    request[REQUEST_START_NS] = process.hrtime.bigint();
    request[REQUEST_TIMESTAMP] = new Date().toISOString();
  });

  fastify.addHook("onResponse", async (request, reply) => {
    const startNs = request[REQUEST_START_NS] || process.hrtime.bigint();
    const elapsedNs = process.hrtime.bigint() - startNs;
    const durationMs = Number(elapsedNs) / 1_000_000;

    fastify.log.info(
      {
        reqId: request.id,
        method: request.method,
        url: request.url,
        timestamp: request[REQUEST_TIMESTAMP],
        executionTimeMs: Number(durationMs.toFixed(2)),
        statusCode: reply.statusCode,
      },
      "request-log"
    );

    // Store a small in-memory log history per authenticated user.
    // Approach chosen: keep it in memory to support a settings UI without adding DB tables.
    // Alternative (discarded): store logs in Postgres (too heavy for an MVP).
    if (request.url.startsWith("/v1/") && request.user && (request.user.userId || request.user.sub)) {
      const userId = request.user.userId || request.user.sub;
      const bucket = ensureUserBucket(logsByUserId, userId);
      bucket.unshift({
        timestamp: request[REQUEST_TIMESTAMP],
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        executionTimeMs: Number(durationMs.toFixed(2)),
      });

      if (bucket.length > MAX_LOGS_PER_USER) {
        bucket.length = MAX_LOGS_PER_USER;
      }
    }
  });
}

module.exports = requestLoggerPlugin;
