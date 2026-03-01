const usersSearchQuerySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    q: { type: "string", minLength: 1, maxLength: 80 },
  },
};

const usersSearchResultSchema = {
  type: "object",
  required: ["id", "email", "name"],
  properties: {
    id: { type: "string", format: "uuid" },
    email: { type: "string", format: "email" },
    name: { type: "string" },
  },
};

function escapeLikePattern(value) {
  return value.replace(/([%_\\])/g, "\\$1");
}

async function usersRoutes(fastify) {
  fastify.get(
    "/search",
    {
      preHandler: [fastify.authenticate, fastify.rateLimitAuthenticated],
      schema: {
        querystring: usersSearchQuerySchema,
        response: {
          200: {
            type: "array",
            items: usersSearchResultSchema,
          },
        },
      },
    },
    async (request) => {
      const userId = request.user.userId || request.user.sub;
      const query = request.query && request.query.q ? request.query.q.trim() : "";

      // Approach chosen: derive a friendly `name` from the email local-part.
      // Why: it enables searchable user selection without changing DB schema.
      // Alternative rejected: add a `display_name` migration in this extra task.
      const values = [userId];
      let searchSql = "";
      if (query) {
        values.push(`%${escapeLikePattern(query)}%`);
        searchSql = `
          AND (
            split_part(email, '@', 1) ILIKE $2 ESCAPE '\\'
            OR email ILIKE $2 ESCAPE '\\'
          )
        `;
      }

      const result = await fastify.db.query(
        `SELECT id, email, split_part(email, '@', 1) AS name
         FROM users
         WHERE id <> $1
         ${searchSql}
         ORDER BY created_at DESC
         LIMIT 20`,
        values
      );

      return result.rows;
    }
  );
}

module.exports = usersRoutes;
