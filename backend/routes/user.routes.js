// backend/routes/user.routes.js
const express = require("express");
const bcrypt = require("bcryptjs"); // ou bcrypt, se estiver usando ele
const {
  createUser,
  findUserByEmail,
  findUserById,
} = require("../models/userModel"); // 👈 AQUI É ../models, não ../backend/models

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

module.exports = router;
