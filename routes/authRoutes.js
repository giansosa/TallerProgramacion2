const express = require('express');
const router = express.Router();

/**
 * Crea las rutas de autenticación
 * @param {AuthController} authController
 * @returns {Router}
 */
function createAuthRoutes(authController) {
  // POST /api/v1/auth/register - Registrar nuevo usuario (sin auth)
  router.post('/register', (req, res) => authController.register(req, res));

  // POST /api/v1/auth/login - Iniciar sesión y obtener token JWT (sin auth)
  router.post('/login', (req, res) => authController.login(req, res));

  return router;
}

module.exports = createAuthRoutes;
