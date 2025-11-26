// routes/dreamInterpreter.route.js

const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/interpretar", async (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ error: "Texto do sonho é obrigatório." });
  }

  try {
   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });


    const prompt = `d
Você é um intérprete de sonhos empático.
Interprete o seguinte sonho em português, em 2–4 parágrafos curtos.
Foque em simbolismo emocional, possíveis significados psicológicos e mensagens positivas.

Sonho: "${texto}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const interpretacao = response.text();

    return res.json({ interpretacao });
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return res.status(500).json({ error: "Erro ao interpretar o sonho." });
  }
});

module.exports = router;
