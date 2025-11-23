// routes/user.routes.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  findUserById,
} = require("../backend/models/userModel");
const { authMiddleware } = require("../backend/middlewares/auth.middleware");
require("dotenv").config();

const router = express.Router();

// POST /users/register
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Email já está registrado" });
    }

    const password_hash = await bcrypt.hash(senha, 10);

    const user = await createUser({ nome, email, password_hash });

    return res.status(201).json({
      message: "Usuário criado com sucesso",
      user,
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
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(senha, user.password_hash);
    if (!senhaValida) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
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

// GET /users/me  (rota protegida – só pra testar o token)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json({ user });
  } catch (err) {
    console.error("Erro em /me:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
