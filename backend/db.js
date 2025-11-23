// backend/db.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Render/Postgres geralmente precisa disso
  },
});

module.exports = pool;
