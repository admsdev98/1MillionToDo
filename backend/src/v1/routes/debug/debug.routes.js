const { hashPassword } = require("../../../lib/password-scrypt");

const DEMO_USERS = [
  { email: "demo-free@example.com", plan: "free" },
  { email: "demo-premium@example.com", plan: "premium" },
  { email: "demo-enterprise@example.com", plan: "enterprise" },
];

const DEMO_PASSWORD = "demo-password-123";

async function ensureDemoUsersExist(fastify) {
  // Approach chosen: seed demo users only when debug endpoints are enabled.
  // This keeps the main app behavior clean while supporting a guided UI demo.
  // Alternative (discarded): seed users from SQL init scripts (cannot hash with scrypt there).
  for (const demo of DEMO_USERS) {
    const existing = await fastify.db.query(
      `SELECT id
       FROM users
       WHERE email = $1`,
      [demo.email]
    );

    if (existing.rows[0]) {
      continue;
    }

    const { passwordHash, passwordSalt } = await hashPassword(DEMO_PASSWORD);
    await fastify.db.query(
      `INSERT INTO users (email, password_hash, password_salt, plan)
       VALUES ($1, $2, $3, $4)`,
      [demo.email, passwordHash, passwordSalt, demo.plan]
    );
  }
}

const debugUserSchema = {
  type: "object",
  required: ["id", "email", "plan", "created_at", "updated_at"],
  properties: {
    id: { type: "string", format: "uuid" },
    email: { type: "string", format: "email" },
    plan: { type: "string" },
    created_at: { type: "string" },
    updated_at: { type: "string" },
  },
};

async function debugRoutes(fastify) {
  await ensureDemoUsersExist(fastify);

  fastify.get(
    "/users",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: debugUserSchema,
          },
        },
      },
    },
    async () => {
      const result = await fastify.db.query(
        `SELECT id, email, plan, created_at, updated_at
         FROM users
         ORDER BY created_at DESC
         LIMIT 50`
      );

      return result.rows;
    }
  );
}

module.exports = debugRoutes;
