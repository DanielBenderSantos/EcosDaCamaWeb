// controllers/dreams.controller.js
const Dream = require("../models/dream.model");

module.exports = {
  async create(req, res) {
    try {
      const { title, description, mood } = req.body;
      // se usar autenticação, pegue user id do req.user
      const user_id = req.user ? req.user.id : null;

      if (!title || !description || !mood) {
        return res.status(400).json({ error: "Campos obrigatórios faltando." });
      }

      const dream = await Dream.create({ user_id, title, description, mood });
      res.status(201).json({ success: true, dream });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao salvar sonho." });
    }
  },

  async list(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const dreams = await Dream.list(page, 10);
      res.json(dreams);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao listar sonhos." });
    }
  },

  async getOne(req, res) {
    try {
      const id = Number(req.params.id);
      const dream = await Dream.findById(id);
      if (!dream) return res.status(404).json({ error: "Não encontrado." });
      res.json(dream);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao carregar sonho." });
    }
  },

  async remove(req, res) {
    try {
      const id = Number(req.params.id);
      await Dream.remove(id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao remover sonho." });
    }
  }
};
