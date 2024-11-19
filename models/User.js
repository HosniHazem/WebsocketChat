const pool = require("../config/db");

async function createUser(email, password) {
  const [result] = await pool.execute(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password]
  );
  return result.insertId;
}

async function getUserByEmail(email) {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

module.exports = { createUser, getUserByEmail };
