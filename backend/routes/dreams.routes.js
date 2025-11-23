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
      INSERT INTO dreams (fk_usuario, titulo, descricao, humor, ativo, created_at, updated_at)
      VALUES ($1, $2, $3, $4, TRUE, NOW(), NOW())
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

// GET /dreams  → listar sonhos ATIVOS do usuário logado
router.get("/", auth, async (req, res) => {
  try {
    const fk_usuario = req.user.id;

    const query = `
      SELECT id, fk_usuario, titulo, descricao, humor, data, hora, created_at, updated_at
      FROM dreams
      WHERE fk_usuario = $1
        AND ativo = TRUE
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [fk_usuario]);

    return res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar sonhos:", err);
    return res.status(500).json({ error: "Erro interno ao listar sonhos" });
  }
});

// GET /dreams/:id  → buscar um sonho específico do usuário logado
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const fk_usuario = req.user.id;

    const query = `
      SELECT id, fk_usuario, titulo, descricao, humor, data, hora, created_at, updated_at
      FROM dreams
      WHERE id = $1
        AND fk_usuario = $2
        AND ativo = TRUE;
    `;

    const result = await pool.query(query, [id, fk_usuario]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Sonho não encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar sonho:", err);
    return res.status(500).json({ error: "Erro interno ao buscar sonho" });
  }
});
// PUT /dreams/:id  → editar sonho (somente do dono e ativo)
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, sentimento } = req.body;
    const fk_usuario = req.user.id;

    if (!titulo || !descricao) {
      return res
        .status(400)
        .json({ error: "Título e descrição são obrigatórios" });
    }

    const query = `
      UPDATE dreams
      SET titulo = $1,
          descricao = $2,
          humor = $3,
          updated_at = NOW()
      WHERE id = $4
        AND fk_usuario = $5
        AND ativo = TRUE
      RETURNING *;
    `;

    const values = [titulo, descricao, sentimento || null, id, fk_usuario];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Sonho não encontrado" });
    }

    return res.json({
      message: "Sonho atualizado com sucesso",
      sonho: result.rows[0],
    });
  } catch (err) {
    console.error("Erro ao editar sonho:", err);
    return res.status(500).json({ error: "Erro interno ao editar sonho" });
  }
});

// DELETE /dreams/:id  → soft delete (marca ativo = FALSE)
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const fk_usuario = req.user.id;

    const query = `
      UPDATE dreams
      SET ativo = FALSE,
          updated_at = NOW()
      WHERE id = $1
        AND fk_usuario = $2
        AND ativo = TRUE
      RETURNING id;
    `;

    const result = await pool.query(query, [id, fk_usuario]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Sonho não encontrado" });
    }

    return res.json({ message: "Sonho removido com sucesso" });
  } catch (err) {
    console.error("Erro ao remover sonho:", err);
    return res.status(500).json({ error: "Erro interno ao remover sonho" });
  }
});

module.exports = router;
