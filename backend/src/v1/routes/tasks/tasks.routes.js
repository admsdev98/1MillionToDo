const taskSchema = {
  type: "object",
  required: ["id", "owner_user_id", "title", "is_completed", "created_at", "updated_at"],
  properties: {
    id: { type: "string", format: "uuid" },
    owner_user_id: { type: "string", format: "uuid" },
    title: { type: "string" },
    description: { anyOf: [{ type: "string" }, { type: "null" }] },
    is_completed: { type: "boolean" },
    created_at: { type: "string" },
    updated_at: { type: "string" },
  },
};

const taskBodySchema = {
  type: "object",
  additionalProperties: false,
  required: ["title"],
  properties: {
    title: { type: "string", minLength: 1, maxLength: 200 },
    description: { anyOf: [{ type: "string", maxLength: 4000 }, { type: "null" }] },
  },
};

const taskPatchBodySchema = {
  type: "object",
  additionalProperties: false,
  minProperties: 1,
  properties: {
    title: { type: "string", minLength: 1, maxLength: 200 },
    description: { anyOf: [{ type: "string", maxLength: 4000 }, { type: "null" }] },
    is_completed: { type: "boolean" },
  },
};

const paramsSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", format: "uuid" },
  },
};

function toHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getAuthenticatedUserId(request) {
  const userId = request.user.userId || request.user.sub;
  if (!userId) {
    throw toHttpError(401, "Authentication required");
  }

  return userId;
}

function buildPatchStatement(body) {
  const updates = [];

  if (Object.prototype.hasOwnProperty.call(body, "title")) {
    updates.push({ column: "title", value: body.title });
  }

  if (Object.prototype.hasOwnProperty.call(body, "description")) {
    updates.push({ column: "description", value: body.description });
  }

  if (Object.prototype.hasOwnProperty.call(body, "is_completed")) {
    updates.push({ column: "is_completed", value: body.is_completed });
  }

  const assignments = updates.map((item, index) => `${item.column} = $${index + 1}`);
  const values = updates.map((item) => item.value);

  return {
    setClause: assignments.join(", "),
    values,
  };
}

async function tasksRoutes(fastify) {
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
      schema: {
        response: {
          200: {
            type: "array",
            items: taskSchema,
          },
        },
      },
    },
    async (request) => {
      const ownerUserId = getAuthenticatedUserId(request);

      const result = await fastify.db.query(
        `SELECT id, owner_user_id, title, description, is_completed, created_at, updated_at
         FROM tasks
         WHERE owner_user_id = $1
         ORDER BY created_at DESC`,
        [ownerUserId]
      );

      return result.rows;
    }
  );

  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: taskBodySchema,
        response: {
          201: taskSchema,
        },
      },
    },
    async (request, reply) => {
      const ownerUserId = getAuthenticatedUserId(request);
      const { title, description = null } = request.body;

      const result = await fastify.db.query(
        `INSERT INTO tasks (owner_user_id, title, description)
         VALUES ($1, $2, $3)
         RETURNING id, owner_user_id, title, description, is_completed, created_at, updated_at`,
        [ownerUserId, title, description]
      );

      return reply.status(201).send(result.rows[0]);
    }
  );

  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
      schema: {
        params: paramsSchema,
        response: {
          200: taskSchema,
        },
      },
    },
    async (request) => {
      const ownerUserId = getAuthenticatedUserId(request);
      const result = await fastify.db.query(
        `SELECT id, owner_user_id, title, description, is_completed, created_at, updated_at
         FROM tasks
         WHERE id = $1 AND owner_user_id = $2`,
        [request.params.id, ownerUserId]
      );

      const task = result.rows[0];
      if (!task) {
        throw toHttpError(404, "Task not found");
      }

      return task;
    }
  );

  fastify.patch(
    "/:id",
    {
      preHandler: [fastify.authenticate],
      schema: {
        params: paramsSchema,
        body: taskPatchBodySchema,
        response: {
          200: taskSchema,
        },
      },
    },
    async (request) => {
      const ownerUserId = getAuthenticatedUserId(request);
      const { setClause, values } = buildPatchStatement(request.body);

      if (!setClause) {
        throw toHttpError(400, "At least one field must be provided");
      }

      const result = await fastify.db.query(
        `UPDATE tasks
         SET ${setClause}, updated_at = now()
         WHERE id = $${values.length + 1} AND owner_user_id = $${values.length + 2}
         RETURNING id, owner_user_id, title, description, is_completed, created_at, updated_at`,
        [...values, request.params.id, ownerUserId]
      );

      const task = result.rows[0];
      if (!task) {
        throw toHttpError(404, "Task not found");
      }

      return task;
    }
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
      schema: {
        params: paramsSchema,
      },
    },
    async (request, reply) => {
      const ownerUserId = getAuthenticatedUserId(request);

      const result = await fastify.db.query(
        `DELETE FROM tasks
         WHERE id = $1 AND owner_user_id = $2
         RETURNING id`,
        [request.params.id, ownerUserId]
      );

      if (result.rowCount === 0) {
        throw toHttpError(404, "Task not found");
      }

      return reply.status(204).send();
    }
  );
}

module.exports = tasksRoutes;
