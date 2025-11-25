import express from "express";
import fetch from "node-fetch";

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
      body: JSON.stringify({ dream: texto })
    });

    const data = await response.json();

    res.json({
      interpretacao: data?.interpretation || "Sem interpretação disponível."
    });

  } catch (error) {
    console.error("Erro ao chamar a API externa:", error);
    res.status(500).json({ error: "Erro ao interpretar o sonho." });
  }
});

export default router;
