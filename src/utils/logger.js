// src/utils/logger.js

const fs = require('fs');
const path = require('path');

// Cria um caminho absoluto para o arquivo de log, garantindo que funcione de qualquer lugar
const logFilePath = path.join(__dirname, '..', 'logs', 'errors.log');

// Função para garantir que o diretório de logs exista antes de tentar escrever nele
const ensureLogDirExists = () => {
  const logDir = path.dirname(logFilePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

// Objeto que vamos exportar, contendo os métodos de log
const logger = {
  /**
   * Grava uma mensagem de erro no arquivo de log.
   * @param {string} message - A mensagem de erro a ser gravada.
   */
  error: (message) => {
    try {
      ensureLogDirExists(); // Garante que a pasta /logs exista
      const timestamp = new Date().toISOString();
      const logMessage = `${timestamp} - ERROR: ${message}\n`;
      fs.appendFileSync(logFilePath, logMessage, 'utf8');
    } catch (err) {
      console.error('Falha ao gravar no arquivo de log:', err);
    }
  },

  /**
   * Grava uma mensagem informativa no arquivo de log (exemplo para uso futuro).
   * @param {string} message - A mensagem informativa a ser gravada.
   */
  info: (message) => {
    try {
      ensureLogDirExists();
      const timestamp = new Date().toISOString();
      const logMessage = `${timestamp} - INFO: ${message}\n`;
      fs.appendFileSync(logFilePath, logMessage, 'utf8');
    } catch (err) {
      console.error('Falha ao gravar no arquivo de log:', err);
    }
  }
};

// Exporta o objeto logger completo
module.exports = logger;