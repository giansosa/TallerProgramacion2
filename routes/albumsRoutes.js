const express = require('express');
const router = express.Router();

/**
 * Crea las rutas de albums
 * @param {AlbumsController} albumsController
 * @returns {Router}
 */
function createAlbumsRoutes(albumsController) {
  // GET /api/v1/albums/csv - Obtener albums en CSV (sin auth por defecto)
  router.get('/csv', (req, res) => albumsController.getAlbumsCSV(req, res));

  return router;
}

module.exports = createAlbumsRoutes;
