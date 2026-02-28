const REQUEST_START_NS = Symbol("requestStartNs");
const REQUEST_TIMESTAMP = Symbol("requestTimestamp");

async function requestLoggerPlugin(fastify) {
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
  });
}

module.exports = requestLoggerPlugin;
