// src/middleware/auth.js

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

function auth(req, res, next) {
  // 1. Pega o token do header da requisição
  const token = req.header('Authorization');

  // 2. Verifica se o token não foi enviado
  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  // O token geralmente vem no formato "Bearer <token>"
  // Nós precisamos extrair apenas a parte do token
  const tokenPart = token.split(' ')[1];
    
  if (!tokenPart) {
      return res.status(401).json({ error: 'Token malformatado.' });
  }

  try {
    // 3. Verifica se o token é válido
    const decoded = jwt.verify(tokenPart, process.env.JWT_SECRET);

    // 4. Anexa os dados do usuário decodificados à requisição
    req.user = decoded.user;

    // 5. Continua para a próxima função (a rota principal)
    next();

  } catch (error) {
    logger.error('Token inválido: ' + error.message);
    res.status(401).json({ error: 'Token inválido.' });
  }
}

module.exports = auth;