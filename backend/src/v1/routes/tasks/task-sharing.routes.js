const { toHttpError } = require("../../../lib/http-error");
const { getUserByEmail } = require("../../../lib/users");

const shareBodySchema = {
  type: "object",
  additionalProperties: false,
  required: ["email"],
  properties: {
    email: { type: "string", format: "email", maxLength: 320 },
  },
};

const shareParamsSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", format: "uuid" },
  },
};

const unshareParamsSchema = {
  type: "object",
  required: ["id", "userId"],
  properties: {
    id: { type: "string", format: "uuid" },
    userId: { type: "string", format: "uuid" },
  },
};

const shareResponseSchema = {
  type: "object",
  required: ["task_id", "user_id"],
  properties: {
    task_id: { type: "string", format: "uuid" },
    user_id: { type: "string", format: "uuid" },
  },
};

async function taskSharingRoutes(fastify) {
  fastify.post(
    "/:id/share",
    {
      preHandler: [fastify.authenticate, fastify.rateLimitAuthenticated],
      schema: {
        params: shareParamsSchema,
        body: shareBodySchema,
        response: {
          201: shareResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const ownerUserId = request.user.userId || request.user.sub;
      const taskId = request.params.id;
      const recipientEmail = request.body.email;

      const taskResult = await fastify.db.query(
        `SELECT id
         FROM tasks
         WHERE id = $1 AND owner_user_id = $2`,
        [taskId, ownerUserId]
      );

      if (!taskResult.rows[0]) {
        throw toHttpError(404, "Task not found");
      }

      const recipient = await getUserByEmail(fastify.db, recipientEmail);
      if (!recipient) {
        throw toHttpError(404, "Recipient not found", "NOT_FOUND");
      }

      if (recipient.id === ownerUserId) {
        throw toHttpError(400, "Cannot share a task with yourself", "BAD_REQUEST");
      }

      try {
        await fastify.db.query(
          `INSERT INTO task_shares (task_id, user_id)
           VALUES ($1, $2)`,
          [taskId, recipient.id]
        );
      } catch (error) {
        // Ignore duplicate shares to keep the endpoint idempotent.
        if (error.code !== "23505") {
          throw error;
        }
      }

      return reply.status(201).send({ task_id: taskId, user_id: recipient.id });
    }
  );

  fastify.delete(
    "/:id/share/:userId",
    {
      preHandler: [fastify.authenticate, fastify.rateLimitAuthenticated],
      schema: {
        params: unshareParamsSchema,
      },
    },
    async (request, reply) => {
      const ownerUserId = request.user.userId || request.user.sub;
      const taskId = request.params.id;
      const recipientUserId = request.params.userId;

      const taskResult = await fastify.db.query(
        `SELECT id
         FROM tasks
         WHERE id = $1 AND owner_user_id = $2`,
        [taskId, ownerUserId]
      );

      if (!taskResult.rows[0]) {
        throw toHttpError(404, "Task not found");
      }

      await fastify.db.query(
        `DELETE FROM task_shares
         WHERE task_id = $1 AND user_id = $2`,
        [taskId, recipientUserId]
      );

      return reply.status(204).send();
    }
  );
}

module.exports = taskSharingRoutes;
