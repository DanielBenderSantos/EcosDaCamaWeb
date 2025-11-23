// middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token ausente." });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token inválido." });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id }; // adapte conforme payload
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido." });
  }
};
