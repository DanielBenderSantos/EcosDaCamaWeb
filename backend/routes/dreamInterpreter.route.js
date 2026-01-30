const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/interpretar", async (req, res) => {
  const { texto } = req.body;

  if (!texto || !texto.trim()) {
    return res.status(400).json({ error: "Texto do sonho é obrigatório." });
  }

  try {
    // O modelo exato que FUNCIONA na sua chave:
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite-preview-09-2025",
    });

    const prompt = `
Você é um intérprete de sonhos sensível e acolhedor.

Interprete o seguinte sonho em português, explicando:

- o simbolismo emocional,
- o possível significado psicológico,
- e uma mensagem positiva ou de reflexão.

Seja claro, empático e use 2 a 4 parágrafos.

Sonho: "${texto}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const interpretacao = response.text();

    res.json({ interpretacao });
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    res.status(500).json({ error: "Erro ao interpretar o sonho." });
  }
});

module.exports = router;
