// backend/routes/dreams.routes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const router = express.Router();

// Middleware de autenticação simples
function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (!/^Bearer$/i.test(scheme) || !token) {
    return res.status(401).json({ error: "Token mal formatado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "segredo_dev");
    req.user = decoded; // { id, email }
    return next();
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

// POST /dreams  → salvar novo sonho
router.post("/", auth, async (req, res) => {
  try {
    const { titulo, descricao, sentimento } = req.body;

    if (!titulo || !descricao) {
      return res
        .status(400)
        .json({ error: "Título e descrição são obrigatórios" });
    }

    const fk_usuario = req.user.id;

    const query = `
      INSERT INTO dreams (fk_usuario, titulo, descricao, humor, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *;
    `;

    const values = [fk_usuario, titulo, descricao, sentimento || null];

    const result = await pool.query(query, values);

    return res.status(201).json({
      message: "Sonho salvo com sucesso",
      sonho: result.rows[0],
    });
  } catch (err) {
    console.error("Erro ao salvar sonho:", err);
    return res.status(500).json({ error: "Erro interno ao salvar sonho" });
  }
});

// GET /dreams  → listar sonhos do usuário logado
router.get("/", auth, async (req, res) => {
  try {
    const fk_usuario = req.user.id;

    const query = `
      SELECT id, fk_usuario, titulo, descricao, humor, data, hora, created_at, updated_at
      FROM dreams
      WHERE fk_usuario = $1
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [fk_usuario]);

    return res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar sonhos:", err);
    return res.status(500).json({ error: "Erro interno ao listar sonhos" });
  }
});

module.exports = router;
