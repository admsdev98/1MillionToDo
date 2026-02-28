async function getUserById(db, userId) {
  const result = await db.query(
    `SELECT id, email, plan
     FROM users
     WHERE id = $1`,
    [userId]
  );

  return result.rows[0] || null;
}

async function getUserByEmail(db, email) {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await db.query(
    `SELECT id, email, plan
     FROM users
     WHERE email = $1`,
    [normalizedEmail]
  );

  return result.rows[0] || null;
}

module.exports = {
  getUserById,
  getUserByEmail,
};
