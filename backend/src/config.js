const DEFAULT_PORT = 3000;
const DEFAULT_DATABASE_URL = "postgres://postgres:postgres@localhost:5432/todo_app";
const DEFAULT_JWT_SECRET = "change-me";

function parsePort(rawPort) {
  if (!rawPort) {
    return DEFAULT_PORT;
  }

  const port = Number.parseInt(rawPort, 10);
  if (Number.isNaN(port) || port <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return port;
}

function readConfig(env = process.env) {
  const port = parsePort(env.PORT);
  const databaseUrl = env.DATABASE_URL || DEFAULT_DATABASE_URL;
  const jwtSecret = env.JWT_SECRET || DEFAULT_JWT_SECRET;
  const nodeEnv = env.NODE_ENV || "development";
  const allowDebugEndpoints = env.ALLOW_DEBUG_ENDPOINTS === "1";

  if (nodeEnv === "production") {
    if (!env.JWT_SECRET) {
      throw new Error("JWT_SECRET is required in production");
    }

    if (jwtSecret === DEFAULT_JWT_SECRET) {
      throw new Error("JWT_SECRET must be changed in production");
    }
  }

  return {
    nodeEnv,
    port,
    databaseUrl,
    jwtSecret,
    allowDebugEndpoints,
  };
}

module.exports = {
  readConfig,
};
