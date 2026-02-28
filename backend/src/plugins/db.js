const { Pool } = require("pg");

const CONNECT_MAX_ATTEMPTS = 20;
const CONNECT_RETRY_DELAY_MS = 1000;

function wait(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

async function waitForDatabase(fastify, pool) {
  for (let attempt = 1; attempt <= CONNECT_MAX_ATTEMPTS; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch (error) {
      if (attempt === CONNECT_MAX_ATTEMPTS) {
        throw error;
      }

      fastify.log.warn(
        {
          attempt,
          maxAttempts: CONNECT_MAX_ATTEMPTS,
          message: error.message,
        },
        "database is not ready yet, retrying"
      );

      await wait(CONNECT_RETRY_DELAY_MS);
    }
  }
}

async function dbPlugin(fastify, options) {
  const pool = new Pool({
    connectionString: options.databaseUrl,
  });

  await waitForDatabase(fastify, pool);
  fastify.decorate("db", pool);

  fastify.addHook("onClose", async () => {
    await pool.end();
  });
}

module.exports = dbPlugin;
