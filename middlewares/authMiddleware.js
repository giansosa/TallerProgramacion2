const { verifyToken } = require('../utils/jwtUtils');
const { verifyApiKey } = require('../utils/apiKeyUtils');
const config = require('../config');

/**
 * Middleware de autenticación flexible
 * Soporta x-api-key y JWT según la configuración
 */
function authMiddleware(req, res, next) {
  try {
    const authMethod = config.authMethod.toLowerCase();

    if (authMethod === 'api-key') {
      return authenticateWithApiKey(req, res, next);
    } else if (authMethod === 'jwt') {
      return authenticateWithJwt(req, res, next);
    } else if (authMethod === 'both') {
      return authenticateWithBoth(req, res, next);
    } else {
      return res.status(500).json({
        statusCode: 500,
        error: `Método de autenticación no válido: ${authMethod}`,
      });
    }
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      error: error.message || 'No autorizado',
    });
  }
}

/**
 * Autenticación usando x-api-key
 */
function authenticateWithApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Se requiere el header x-api-key',
    });
  }

  if (!verifyApiKey(apiKey)) {
    return res.status(403).json({
      statusCode: 403,
      error: 'API Key inválida',
    });
  }

  // Agregar información de autenticación al request
  req.auth = {
    method: 'api-key',
    apiKey: apiKey,
  };

  next();
}

/**
 * Autenticación usando JWT
 */
function authenticateWithJwt(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Se requiere el header Authorization',
    });
  }

  // Verificar formato "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      statusCode: 401,
      error: 'Formato de Authorization inválido. Debe ser: Bearer <token>',
    });
  }

  const token = parts[1];

  try {
    const decoded = verifyToken(token);

    // Agregar información de autenticación al request
    req.auth = {
      method: 'jwt',
      userId: decoded.userId,
      username: decoded.username,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      error: error.message || 'Token inválido',
    });
  }
}

/**
 * Autenticación usando ambos métodos (api-key o jwt)
 */
function authenticateWithBoth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const authHeader = req.headers['authorization'];

  // Intentar con API Key primero
  if (apiKey) {
    if (verifyApiKey(apiKey)) {
      req.auth = {
        method: 'api-key',
        apiKey: apiKey,
      };
      return next();
    } else {
      return res.status(403).json({
        statusCode: 403,
        error: 'API Key inválida',
      });
    }
  }

  // Intentar con JWT
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const token = parts[1];
      try {
        const decoded = verifyToken(token);
        req.auth = {
          method: 'jwt',
          userId: decoded.userId,
          username: decoded.username,
        };
        return next();
      } catch (error) {
        return res.status(401).json({
          statusCode: 401,
          error: error.message || 'Token inválido',
        });
      }
    }
  }

  // Ningún método de autenticación proporcionado
  return res.status(401).json({
    statusCode: 401,
    error: 'Se requiere autenticación. Proporciona x-api-key o Authorization: Bearer <token>',
  });
}

module.exports = authMiddleware;
