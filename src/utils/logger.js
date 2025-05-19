const fs = require('fs');
const path = require('path');

function logError(error) {
  const logDir = path.resolve(__dirname, '../logs');
  const logPath = path.join(logDir, 'errors.log');
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] ${error.stack || error}\n`;

  fs.appendFileSync(logPath, message, { encoding: 'utf8' });
}

module.exports = { logError };
