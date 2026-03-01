const Fastify = require("fastify");

const { readConfig } = require("./config");
const dbPlugin = require("./plugins/db");
const jwtPlugin = require("./plugins/jwt");
const rateLimitPlugin = require("./plugins/rate-limit");
const requestLoggerPlugin = require("./plugins/request-logger");
const securityHeadersPlugin = require("./plugins/security-headers");
const serveFrontendAssetsPlugin = require("./plugins/serve-frontend-assets");
const authRoutes = require("./v1/routes/auth/auth.routes");
const debugRoutes = require("./v1/routes/debug/debug.routes");
const meRoutes = require("./v1/routes/me/me.routes");
const tasksRoutes = require("./v1/routes/tasks/tasks.routes");
const taskSharingRoutes = require("./v1/routes/tasks/task-sharing.routes");
const usersRoutes = require("./v1/routes/users/users.routes");

function toErrorCode(error, statusCode) {
  // Routes/plugins can set `error.errorCode` to force a stable contract code
  // (e.g. PLAN_LIMIT_REACHED) without relying on status-code guessing.
  if (error && typeof error.errorCode === "string") {
    return error.errorCode;
  }

  if (error.validation) {
    return "VALIDATION_ERROR";
  }

  if (statusCode === 401) {
    return "UNAUTHORIZED";
  }

  if (statusCode === 403) {
    return "FORBIDDEN";
  }

  if (statusCode === 404) {
    return "NOT_FOUND";
  }

  if (statusCode === 429) {
    return "RATE_LIMITED";
  }

  if (statusCode === 409) {
    return "CONFLICT";
  }

  if (statusCode === 400) {
    return "BAD_REQUEST";
  }

  return "INTERNAL_SERVER_ERROR";
}

function toErrorMessage(error, statusCode) {
  if (error.validation) {
    return "Invalid request payload";
  }

  if (statusCode >= 500) {
    return "Internal server error";
  }

  return error.message || "Request failed";
}

async function buildApp(options = {}) {
  const config = options.config || readConfig();

  const app = Fastify({
    logger: true,
    disableRequestLogging: true,
  });

  await dbPlugin(app, {
    databaseUrl: config.databaseUrl,
  });

  await jwtPlugin(app, {
    jwtSecret: config.jwtSecret,
  });

  await rateLimitPlugin(app);

  await requestLoggerPlugin(app);

  await securityHeadersPlugin(app);

  app.get("/v1/health", async () => {
    return { ok: true };
  });

  app.register(authRoutes, {
    prefix: "/v1/auth",
  });

  if (config.allowDebugEndpoints) {
    app.register(debugRoutes, {
      prefix: "/v1/debug",
    });
  }

  app.register(meRoutes, {
    prefix: "/v1",
  });

  app.register(usersRoutes, {
    prefix: "/v1/users",
  });

  app.register(tasksRoutes, {
    prefix: "/v1/tasks",
  });

  app.register(taskSharingRoutes, {
    prefix: "/v1/tasks",
  });

  await serveFrontendAssetsPlugin(app);

  app.setNotFoundHandler(async (request, reply) => {
    reply.status(404).send({
      error: {
        code: "NOT_FOUND",
        message: `Route ${request.method} ${request.url} not found`,
      },
    });
  });

  app.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;

    if (statusCode >= 500) {
      request.log.error(error);
    }

    reply.status(statusCode).send({
      error: {
        code: toErrorCode(error, statusCode),
        message: toErrorMessage(error, statusCode),
      },
    });
  });

  return app;
}

module.exports = {
  buildApp,
};
