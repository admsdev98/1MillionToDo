const { createHash, randomBytes } = require("node:crypto");

const { hashPassword } = require("../../../lib/password-scrypt");
const { getUserByEmail } = require("../../../lib/users");
const { toHttpError } = require("../../../lib/http-error");

const RESET_TOKEN_TTL_MINUTES = 15;
const RESET_TOKEN_BYTES = 32;
const MIN_PASSWORD_LENGTH = 8;

const requestSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email"],
  properties: {
    email: { type: "string", format: "email", maxLength: 320 },
  },
};

const requestResponseSchema = {
  type: "object",
  required: ["reset_token"],
  properties: {
    reset_token: { type: "string" },
  },
};

const resetSchema = {
  type: "object",
  additionalProperties: false,
  required: ["reset_token", "new_password"],
  properties: {
    reset_token: { type: "string", minLength: 20, maxLength: 256 },
    new_password: { type: "string", minLength: MIN_PASSWORD_LENGTH, maxLength: 256 },
  },
};

const resetResponseSchema = {
  type: "object",
  required: ["ok"],
  properties: {
    ok: { type: "boolean" },
  },
};

function hashResetToken(rawToken) {
  return createHash("sha256").update(rawToken).digest("hex");
}

function generateResetToken() {
  return randomBytes(RESET_TOKEN_BYTES).toString("hex");
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

async function passwordResetRoutes(fastify) {
  fastify.post(
    "/request-password-reset",
    {
      preHandler: [fastify.rateLimitUnauthenticated],
      schema: {
        body: requestSchema,
        response: {
          200: requestResponseSchema,
        },
      },
    },
    async (request) => {
      const email = request.body.email;

      // Anti-enumeration: always return 200 + a reset_token-looking value.
      const rawToken = generateResetToken();
      const tokenHash = hashResetToken(rawToken);

      const user = await getUserByEmail(fastify.db, email);
      if (user) {
        const expiresAt = addMinutes(new Date(), RESET_TOKEN_TTL_MINUTES);
        await fastify.db.query(
          `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
           VALUES ($1, $2, $3)`,
          [user.id, tokenHash, expiresAt]
        );
      }

      return { reset_token: rawToken };
    }
  );

  fastify.post(
    "/reset-password",
    {
      preHandler: [fastify.rateLimitUnauthenticated],
      schema: {
        body: resetSchema,
        response: {
          200: resetResponseSchema,
        },
      },
    },
    async (request) => {
      const { reset_token: rawToken, new_password: newPassword } = request.body;
      const tokenHash = hashResetToken(rawToken);

      const client = await fastify.db.connect();
      try {
        await client.query("BEGIN");

        const tokenResult = await client.query(
          `SELECT id, user_id, expires_at, used_at
           FROM password_reset_tokens
           WHERE token_hash = $1
           FOR UPDATE`,
          [tokenHash]
        );

        const tokenRow = tokenResult.rows[0];
        if (!tokenRow) {
          throw toHttpError(400, "Invalid reset token", "RESET_TOKEN_INVALID");
        }

        if (tokenRow.used_at) {
          throw toHttpError(409, "Reset token already used", "RESET_TOKEN_ALREADY_USED");
        }

        const now = new Date();
        if (new Date(tokenRow.expires_at) <= now) {
          throw toHttpError(410, "Reset token expired", "RESET_TOKEN_EXPIRED");
        }

        const { passwordHash, passwordSalt } = await hashPassword(newPassword);

        await client.query(
          `UPDATE users
           SET password_hash = $1, password_salt = $2, updated_at = now()
           WHERE id = $3`,
          [passwordHash, passwordSalt, tokenRow.user_id]
        );

        await client.query(
          `UPDATE password_reset_tokens
           SET used_at = now()
           WHERE id = $1`,
          [tokenRow.id]
        );

        await client.query("COMMIT");
        return { ok: true };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    }
  );
}

module.exports = passwordResetRoutes;
