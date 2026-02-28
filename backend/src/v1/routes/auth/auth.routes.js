const { hashPassword, verifyPassword } = require("../../../lib/password-scrypt");
const passwordResetRoutes = require("./password-reset.routes");
const { toHttpError } = require("../../../lib/http-error");

const MIN_PASSWORD_LENGTH = 8;

const credentialsSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email", "password"],
  properties: {
    email: { type: "string", format: "email", maxLength: 320 },
    password: { type: "string", minLength: MIN_PASSWORD_LENGTH, maxLength: 256 },
  },
};

const tokenResponseSchema = {
  type: "object",
  required: ["token"],
  properties: {
    token: { type: "string" },
  },
};

function toTokenPayload(user) {
  return {
    sub: user.id,
    userId: user.id,
    plan: user.plan,
    email: user.email,
  };
}

async function authRoutes(fastify) {
  fastify.post(
    "/register",
    {
      preHandler: [fastify.rateLimitUnauthenticated],
      schema: {
        body: credentialsSchema,
        response: {
          201: tokenResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const email = request.body.email.trim().toLowerCase();
      const password = request.body.password;
      const { passwordHash, passwordSalt } = await hashPassword(password);

      let user;
      try {
        const result = await fastify.db.query(
          `INSERT INTO users (email, password_hash, password_salt)
           VALUES ($1, $2, $3)
           RETURNING id, email, plan`,
          [email, passwordHash, passwordSalt]
        );

        user = result.rows[0];
      } catch (error) {
        if (error.code === "23505") {
          throw toHttpError(409, "Email already registered");
        }

        throw error;
      }

      const token = fastify.jwt.sign(toTokenPayload(user));
      return reply.status(201).send({ token });
    }
  );

  fastify.post(
    "/login",
    {
      preHandler: [fastify.rateLimitUnauthenticated],
      schema: {
        body: credentialsSchema,
        response: {
          200: tokenResponseSchema,
        },
      },
    },
    async (request) => {
      const email = request.body.email.trim().toLowerCase();
      const password = request.body.password;

      const result = await fastify.db.query(
        `SELECT id, email, plan, password_hash, password_salt
         FROM users
         WHERE email = $1`,
        [email]
      );

      const user = result.rows[0];
      if (!user) {
        throw toHttpError(401, "Invalid credentials");
      }

      const isPasswordValid = await verifyPassword(password, user.password_hash, user.password_salt);
      if (!isPasswordValid) {
        throw toHttpError(401, "Invalid credentials");
      }

      const token = fastify.jwt.sign(toTokenPayload(user));
      return { token };
    }
  );

  // Demo password reset flow (token returned in response).
  fastify.register(passwordResetRoutes);
}

module.exports = authRoutes;
