// backend/models/userModel.js
const pool = require("../../configs/db");

async function createUser({ nome, email, password_hash }) {
  const query = `
    INSERT INTO users (nome, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, nome, email, created_at
  `;
  const values = [nome, email, password_hash];

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function findUserByEmail(email) {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);
  return result.rows[0];
}

async function findUserById(id) {
  const query = "SELECT id, nome, email, created_at FROM users WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
