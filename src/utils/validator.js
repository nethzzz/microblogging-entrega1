function validateFields(data, requiredFields) {
    const missing = requiredFields.filter(field => !data[field]);
    if (missing.length > 0) {
      throw new Error(`Campos obrigatórios ausentes: ${missing.join(', ')}`);
    }
  }
  
  module.exports = { validateFields };
  