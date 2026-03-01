const { getTaskCapForPlan } = require("../../../lib/plan-limits");
const { getUserById } = require("../../../lib/users");
const { toHttpError } = require("../../../lib/http-error");

const taskSchema = {
  type: "object",
  required: ["id", "owner_user_id", "title", "is_completed", "created_at", "updated_at", "access"],
  properties: {
    id: { type: "string", format: "uuid" },
    owner_user_id: { type: "string", format: "uuid" },
    title: { type: "string" },
    description: { anyOf: [{ type: "string" }, { type: "null" }] },
    is_completed: { type: "boolean" },
    due_date: { anyOf: [{ type: "string", format: "date" }, { type: "null" }] },
    tag: { anyOf: [{ type: "string" }, { type: "null" }] },
    created_at: { type: "string" },
    updated_at: { type: "string" },
    access: { type: "string", enum: ["owner", "shared"] },
  },
};

const taskBodySchema = {
  type: "object",
  additionalProperties: false,
  required: ["title"],
  properties: {
    title: { type: "string", minLength: 1, maxLength: 200 },
    description: { anyOf: [{ type: "string", maxLength: 4000 }, { type: "null" }] },
    due_date: { anyOf: [{ type: "string", format: "date" }, { type: "null" }] },
    tag: { anyOf: [{ type: "string", maxLength: 60 }, { type: "null" }] },
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
    due_date: { anyOf: [{ type: "string", format: "date" }, { type: "null" }] },
    tag: { anyOf: [{ type: "string", maxLength: 60 }, { type: "null" }] },
  },
};

const paramsSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", format: "uuid" },
  },
};

const listTasksQuerySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    due_from: { type: "string", format: "date" },
    due_to: { type: "string", format: "date" },
  },
};

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

  if (Object.prototype.hasOwnProperty.call(body, "due_date")) {
    updates.push({ column: "due_date", value: body.due_date });
  }

  if (Object.prototype.hasOwnProperty.call(body, "tag")) {
    updates.push({ column: "tag", value: body.tag });
  }

  const assignments = updates.map((item, index) => `${item.column} = $${index + 1}`);
  const values = updates.map((item) => item.value);

  return {
    setClause: assignments.join(", "),
    values,
  };
}

async function getTaskForUser(fastify, taskId, userId) {
  const result = await fastify.db.query(
    `SELECT id, owner_user_id, title, description, is_completed, due_date, tag, created_at, updated_at,
            CASE WHEN owner_user_id = $2 THEN 'owner' ELSE 'shared' END AS access
     FROM tasks
     WHERE id = $1
       AND (
         owner_user_id = $2
         OR EXISTS (
           SELECT 1
           FROM task_shares
           WHERE task_shares.task_id = tasks.id
             AND task_shares.user_id = $2
         )
       )`,
    [taskId, userId]
  );

  return result.rows[0] || null;
}

async function tasksRoutes(fastify) {
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate, fastify.rateLimitAuthenticated],
      schema: {
        querystring: listTasksQuerySchema,
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

       const dueFrom = request.query && request.query.due_from ? request.query.due_from : null;
       const dueTo = request.query && request.query.due_to ? request.query.due_to : null;

       if (dueFrom && dueTo && dueFrom > dueTo) {
         throw toHttpError(400, "Invalid due date range", "DUE_DATE_RANGE_INVALID");
       }

       const values = [ownerUserId];
       const filters = [];

       if (dueFrom || dueTo) {
         filters.push("tasks.due_date IS NOT NULL");
       }

       if (dueFrom) {
         values.push(dueFrom);
         filters.push(`tasks.due_date >= $${values.length}`);
       }

       if (dueTo) {
         values.push(dueTo);
         filters.push(`tasks.due_date <= $${values.length}`);
       }

       const filterSql = filters.length ? `AND ${filters.join(" AND ")}` : "";

       const result = await fastify.db.query(
         `SELECT id, owner_user_id, title, description, is_completed, due_date, tag, created_at, updated_at,
                 CASE WHEN owner_user_id = $1 THEN 'owner' ELSE 'shared' END AS access
          FROM tasks
          WHERE (
            owner_user_id = $1
            OR EXISTS (
              SELECT 1
              FROM task_shares
              WHERE task_shares.task_id = tasks.id
                AND task_shares.user_id = $1
            )
          )
          ${filterSql}
          ORDER BY created_at DESC`,
         values
       );

       return result.rows;
     }
  );

  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate, fastify.rateLimitAuthenticated],
      schema: {
        body: taskBodySchema,
        response: {
          201: taskSchema,
        },
      },
    },
    async (request, reply) => {
      const ownerUserId = getAuthenticatedUserId(request);
      const {
        title,
        description = null,
        due_date: dueDate = null,
        tag = null,
      } = request.body;

      // Plan enforcement is resolved from DB, not from JWT claims.
      const user = await getUserById(fastify.db, ownerUserId);
      if (!user) {
        throw toHttpError(401, "Authentication required", "UNAUTHORIZED");
      }

      const cap = getTaskCapForPlan(user.plan);
      const countResult = await fastify.db.query(
        `SELECT COUNT(*)::int AS count
         FROM tasks
         WHERE owner_user_id = $1`,
        [ownerUserId]
      );

      const ownedCount = countResult.rows[0].count;
      if (ownedCount >= cap) {
        throw toHttpError(403, `Task cap reached for plan ${user.plan}`, "PLAN_LIMIT_REACHED");
      }

      const result = await fastify.db.query(
        `INSERT INTO tasks (owner_user_id, title, description, due_date, tag)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, owner_user_id, title, description, is_completed, due_date, tag, created_at, updated_at`,
        [ownerUserId, title, description, dueDate, tag]
      );

      return reply.status(201).send({ ...result.rows[0], access: "owner" });
    }
  );

  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate, fastify.rateLimitAuthenticated],
      schema: {
        params: paramsSchema,
        response: {
          200: taskSchema,
        },
      },
    },
    async (request) => {
      const ownerUserId = getAuthenticatedUserId(request);
      const task = await getTaskForUser(fastify, request.params.id, ownerUserId);
      if (!task) {
        throw toHttpError(404, "Task not found");
      }

      return task;
    }
  );

  fastify.patch(
    "/:id",
    {
      preHandler: [fastify.authenticate, fastify.rateLimitAuthenticated],
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
      const existing = await getTaskForUser(fastify, request.params.id, ownerUserId);
      if (!existing) {
        throw toHttpError(404, "Task not found");
      }

      if (existing.access === "shared") {
        throw toHttpError(403, "Shared tasks are read-only", "TASK_SHARED_READ_ONLY");
      }

      const { setClause, values } = buildPatchStatement(request.body);

      if (!setClause) {
        throw toHttpError(400, "At least one field must be provided");
      }

      const result = await fastify.db.query(
        `UPDATE tasks
         SET ${setClause}, updated_at = now()
         WHERE id = $${values.length + 1} AND owner_user_id = $${values.length + 2}
         RETURNING id, owner_user_id, title, description, is_completed, due_date, tag, created_at, updated_at`,
        [...values, request.params.id, ownerUserId]
      );

      const task = result.rows[0];
      if (!task) {
        throw toHttpError(404, "Task not found");
      }

      return { ...task, access: "owner" };
    }
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate, fastify.rateLimitAuthenticated],
      schema: {
        params: paramsSchema,
      },
    },
    async (request, reply) => {
      const ownerUserId = getAuthenticatedUserId(request);

      const existing = await getTaskForUser(fastify, request.params.id, ownerUserId);
      if (!existing) {
        throw toHttpError(404, "Task not found");
      }

      if (existing.access === "shared") {
        throw toHttpError(403, "Shared tasks are read-only", "TASK_SHARED_READ_ONLY");
      }

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
