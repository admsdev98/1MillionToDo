const { isValidPlan } = require("../../../lib/plan-limits");
const { getUserById } = require("../../../lib/users");
const { toHttpError } = require("../../../lib/http-error");

const planPatchSchema = {
  type: "object",
  additionalProperties: false,
  required: ["plan"],
  properties: {
    plan: { type: "string", enum: ["free", "premium", "enterprise"] },
  },
};

const meResponseSchema = {
  type: "object",
  required: ["id", "email", "plan"],
  properties: {
    id: { type: "string", format: "uuid" },
    email: { type: "string", format: "email" },
    plan: { type: "string" },
  },
};

const requestLogSchema = {
  type: "object",
  required: ["timestamp", "method", "url", "statusCode", "executionTimeMs"],
  properties: {
    timestamp: { type: "string" },
    method: { type: "string" },
    url: { type: "string" },
    statusCode: { type: "integer" },
    executionTimeMs: { type: "number" },
  },
};

async function meRoutes(fastify) {
  fastify.get(
    "/me",
    {
      preHandler: [fastify.authenticate, fastify.rateLimitAuthenticated],
      schema: {
        response: {
          200: meResponseSchema,
        },
      },
    },
    async (request) => {
      const userId = request.user.userId || request.user.sub;
      const user = await getUserById(fastify.db, userId);

      if (!user) {
        throw toHttpError(401, "Authentication required", "UNAUTHORIZED");
      }

      return user;
    }
  );

  fastify.patch(
    "/me/plan",
    {
      preHandler: [fastify.authenticate, fastify.rateLimitAuthenticated],
      schema: {
        body: planPatchSchema,
        response: {
          200: meResponseSchema,
        },
      },
    },
    async (request) => {
      const userId = request.user.userId || request.user.sub;
      const { plan } = request.body;

      if (!isValidPlan(plan)) {
        throw toHttpError(400, "Invalid plan", "VALIDATION_ERROR");
      }

      const result = await fastify.db.query(
        `UPDATE users
         SET plan = $1, updated_at = now()
         WHERE id = $2
         RETURNING id, email, plan`,
        [plan, userId]
      );

      const updated = result.rows[0];
      if (!updated) {
        throw toHttpError(401, "Authentication required", "UNAUTHORIZED");
      }

      return updated;
    }
  );

  fastify.get(
    "/me/request-logs",
    {
      preHandler: [fastify.authenticate, fastify.rateLimitAuthenticated],
      schema: {
        response: {
          200: {
            type: "array",
            items: requestLogSchema,
          },
        },
      },
    },
    async (request) => {
      const userId = request.user.userId || request.user.sub;
      return fastify.requestLogs.list(userId);
    }
  );
}

module.exports = meRoutes;
