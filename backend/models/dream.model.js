// models/dream.model.js
const db = require("../db");

module.exports = {
  async create({ user_id, title, description, mood }) {
    const q = `
      INSERT INTO dreams (user_id, title, description, mood)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [user_id, title, description, mood];
    const res = await db.query(q, values);
    return res.rows[0];
  },

  async list(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const q = `SELECT * FROM dreams ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
    const res = await db.query(q, [limit, offset]);
    return res.rows;
  },

  async findById(id) {
    const res = await db.query(`SELECT * FROM dreams WHERE id = $1`, [id]);
    return res.rows[0];
  },

  async remove(id) {
    await db.query(`DELETE FROM dreams WHERE id = $1`, [id]);
  }
};
