// backend/routes/user.routes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  findUserById,
} = require("../models/userModel");
require("dotenv").config();

const router = express.Router();

// POST /users/register
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Nome, email e senha são obrigatórios" });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Email já está registrado" });
    }

    const password_hash = await bcrypt.hash(senha, 10);

    const user = await createUser({ nome, email, password_hash });

    return res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /users/login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ error: "Email e senha são obrigatórios" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(senha, user.password_hash);
    if (!senhaValida) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    // gera token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "segredo_dev", // ideal: definir JWT_SECRET no .env
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    return res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// (opcional) GET /users/me – para testar o token depois
router.get("/me", async (req, res) => {
  return res.status(501).json({ error: "Endpoint /me ainda não implementado" });
});

module.exports = router;
