// backend/models/userModel.js
const pool = require("../db");

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
  // Agora traz todas as colunas, inclusive password_hash
  const query = "SELECT * FROM users WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

async function updateUser({ id, nome, email, password_hash }) {
  const query = `
    UPDATE users
    SET nome = $1,
        email = $2,
        password_hash = $3
    WHERE id = $4
    RETURNING id, nome, email, created_at
  `;
  const values = [nome, email, password_hash, id];

  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
};
