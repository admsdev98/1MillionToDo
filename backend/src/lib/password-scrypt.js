const { randomBytes, scrypt, timingSafeEqual } = require("node:crypto");
const { promisify } = require("node:util");

const scryptAsync = promisify(scrypt);
const SALT_SIZE_BYTES = 16;
const KEY_LENGTH_BYTES = 64;

async function hashPassword(plainPassword) {
  const salt = randomBytes(SALT_SIZE_BYTES).toString("hex");
  const hashBuffer = await scryptAsync(plainPassword, salt, KEY_LENGTH_BYTES);

  return {
    passwordHash: hashBuffer.toString("hex"),
    passwordSalt: salt,
  };
}

async function verifyPassword(plainPassword, storedHash, storedSalt) {
  const candidateHashBuffer = await scryptAsync(plainPassword, storedSalt, KEY_LENGTH_BYTES);
  const storedHashBuffer = Buffer.from(storedHash, "hex");

  if (candidateHashBuffer.length !== storedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateHashBuffer, storedHashBuffer);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
