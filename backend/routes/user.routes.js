// routes/user.routes.js
const express = require("express");
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../backend/models/userModel");

const router = express.Router();

// Registrar usuário
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Email já existe" });
    }

    const password_hash = await bcrypt.hash(senha, 10);

    const user = await createUser({
      nome,
      email,
      password_hash,
    });

    return res.status(201).json({
      message: "Usuário criado com sucesso",
      user
    });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

module.exports = router;
