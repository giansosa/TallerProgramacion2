const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * Crea las rutas de productos
 * @param {ProductoController} productoController
 * @returns {Router}
 */
function createProductoRoutes(productoController) {
  // POST /api/v1/productos - Crear producto (sin auth)
  router.post('/', (req, res) => productoController.create(req, res));

  // GET /api/v1/productos - Listar productos (sin auth)
  router.get('/', (req, res) => productoController.findAll(req, res));

  // GET /api/v1/productos/:id - Obtener producto por ID (sin auth)
  router.get('/:id', (req, res) => productoController.findById(req, res));

  // PUT /api/v1/productos/:id - Editar producto (REQUIERE autenticación)
  router.put('/:id', authMiddleware, (req, res) => productoController.update(req, res));

  // DELETE /api/v1/productos/:id - Eliminar producto (REQUIERE autenticación)
  router.delete('/:id', authMiddleware, (req, res) => productoController.delete(req, res));

  return router;
}

module.exports = createProductoRoutes;
