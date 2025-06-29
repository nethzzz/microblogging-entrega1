const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'logs', 'errors.log');


const ensureLogDirExists = () => {
  const logDir = path.dirname(logFilePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

const logger = {
  /**
   * Grava uma mensagem de erro no arquivo de log.
   * @param {string} message - A mensagem de erro a ser gravada.
   */
  error: (message) => {
    try {
      ensureLogDirExists(); 
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

module.exports = logger;