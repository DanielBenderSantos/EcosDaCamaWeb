// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const dreamsRoutes = require("./routes/dreams.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
app.use(cors()); 
app.use(express.json());

// rotas
app.use("/dreams", dreamsRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
