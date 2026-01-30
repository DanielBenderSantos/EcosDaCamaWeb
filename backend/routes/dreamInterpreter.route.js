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
Você é um guia motivacional dos sonhos. Extraia símbolos como aprendizados e transforme-os em mensagens positivas e práticas para fortalecer o dia da pessoa.
Forneça os símbolos e possíveis significados do sonho; tema central e emoções. 
No final coloque perguntas de auto reflexão. E uma ação simples pra hoje.
e no final com base no sonho gere numeros da sorte para Lotofácil,Mega-Sena diga o Dia de Sorte e coloque  Obs.: apenas diversão; sem garantia de resultados

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
