// backend/routes/user.routes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
} = require("../models/userModel");
const { authMiddleware } = require("../middlewares/auth.middleware");
require("dotenv").config();

const router = express.Router();

/**
 * POST /users/register
 * Criação de usuário
 */
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

/**
 * POST /users/login
 * Login e geração de token JWT
 */
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

    // ⚠ Usa o MESMO segredo do authMiddleware
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET não definido no .env");
      return res.status(500).json({ error: "Erro de configuração do servidor" });
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

/**
 * GET /users/me
 * Retorna dados do usuário logado
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // vindo do middleware: req.user = { id, email }
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
    });
  } catch (err) {
    console.error("Erro ao buscar /me:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/**
 * PUT /users/me
 * Atualiza dados do usuário logado (nome, email, e opcionalmente senha)
 */
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { nome, email, senhaAtual, novaSenha } = req.body;

    if (!nome || !email) {
      return res
        .status(400)
        .json({ error: "Nome e email são obrigatórios" });
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Se email mudou, verifica se já não existe outro usuário com esse email
    if (email !== user.email) {
      const existing = await findUserByEmail(email);
      if (existing && existing.id !== user.id) {
        return res
          .status(400)
          .json({ error: "Email já está em uso por outro usuário" });
      }
    }

    let password_hash = user.password_hash;

    // Se quiser mudar senha, valida senhaAtual e gera novo hash
    if (novaSenha) {
      if (!senhaAtual) {
        return res
          .status(400)
          .json({ error: "Senha atual é obrigatória para alterar a senha" });
      }

      const senhaValida = await bcrypt.compare(senhaAtual, user.password_hash);
      if (!senhaValida) {
        return res.status(400).json({ error: "Senha atual incorreta" });
      }

      password_hash = await bcrypt.hash(novaSenha, 10);
    }

    const updated = await updateUser({
      id: user.id,
      nome,
      email,
      password_hash,
    });

    return res.json({
      message: "Usuário atualizado com sucesso",
      user: {
        id: updated.id,
        nome: updated.nome,
        email: updated.email,
      },
    });
  } catch (err) {
    console.error("Erro ao atualizar /me:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
