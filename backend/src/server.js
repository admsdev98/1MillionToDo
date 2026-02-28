const { buildApp } = require("./app");
const { readConfig } = require("./config");

async function startServer() {
  const config = readConfig();
  const app = await buildApp({ config });

  let isClosing = false;

  const closeServer = async (signal) => {
    if (isClosing) {
      return;
    }

    isClosing = true;
    app.log.info({ signal }, "shutdown signal received");

    try {
      await app.close();
      process.exit(0);
    } catch (error) {
      app.log.error(error, "failed to close server cleanly");
      process.exit(1);
    }
  };

  process.on("SIGINT", () => {
    void closeServer("SIGINT");
  });

  process.on("SIGTERM", () => {
    void closeServer("SIGTERM");
  });

  try {
    await app.listen({
      host: "0.0.0.0",
      port: config.port,
    });

    app.log.info({ port: config.port }, "server listening");
  } catch (error) {
    app.log.error(error, "failed to start server");
    process.exit(1);
  }
}

if (require.main === module) {
  void startServer();
}

module.exports = {
  startServer,
};
