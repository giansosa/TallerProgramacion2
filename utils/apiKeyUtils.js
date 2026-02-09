const config = require('../config');

/**
 * Verifica una API Key
 * @param {string} apiKey - API Key a verificar
 * @returns {boolean} True si la API Key es válida
 */
function verifyApiKey(apiKey) {
  if (!config.apiKey) {
    throw new Error('API Key no configurada en el servidor');
  }
  return apiKey === config.apiKey;
}

module.exports = {
  verifyApiKey,
};
