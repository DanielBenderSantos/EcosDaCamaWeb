// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const dreamsRoutes = require("./routes/dreams.routes");

const app = express();
app.use(cors()); // opcional: configurar origem do seu frontend
// Se quiser restringir CORS para seu GitHub Pages: 
// app.use(cors({ origin: "https://seu-usuario.github.io" }));
app.use(express.json());

app.use("/dreams", dreamsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
