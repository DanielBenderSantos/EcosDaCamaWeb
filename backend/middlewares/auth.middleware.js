// backend/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

function authMiddleware(req, res, next) {
  // Espera o token no header Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ error: "Token mal formatado" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Erro ao verificar token:", err);
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    // guarda os dados do usuário no req para usar nas rotas
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    return next();
  });
}

module.exports = {
  authMiddleware,
};
