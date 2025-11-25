// routes/dreamInterpreter.route.js

const express = require("express");
// No Node 18+ (Render usa Node 22), o fetch já é global. Não precisa de node-fetch.
const router = express.Router();

router.post("/interpretar", async (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ error: "Texto do sonho é obrigatório." });
  }

  try {
    const response = await fetch("https://api.dreaminterpreter.app/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dream: texto }),
    });

    const data = await response.json();

    return res.json({
      interpretacao: data?.interpretation || "Sem interpretação disponível.",
    });
  } catch (error) {
    console.error("Erro ao chamar API externa de interpretação:", error);
    return res.status(500).json({ error: "Erro ao interpretar o sonho." });
  }
});

module.exports = router;
