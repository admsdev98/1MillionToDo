// Minimal security headers without extra dependencies.
// Approach chosen: set a small, safe set of headers for every response.
// Alternative (discarded): adding @fastify/helmet (not allowed by the locked stack / avoid deps).

async function securityHeadersPlugin(fastify) {
  fastify.addHook("onSend", async (request, reply, payload) => {
    // Avoid overwriting if a route/plugin set a stricter policy.
    if (!reply.hasHeader("x-content-type-options")) {
      reply.header("x-content-type-options", "nosniff");
    }

    if (!reply.hasHeader("referrer-policy")) {
      reply.header("referrer-policy", "no-referrer");
    }

    if (!reply.hasHeader("x-frame-options")) {
      reply.header("x-frame-options", "DENY");
    }

    // Keep this permissive because the project serves static assets and a minimal frontend.
    // A strict CSP is valuable but can break UI quickly if not tested across routes.
    if (!reply.hasHeader("content-security-policy")) {
      reply.header("content-security-policy", "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'");
    }

    return payload;
  });
}

module.exports = securityHeadersPlugin;
