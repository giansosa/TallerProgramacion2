const express = require('express');
const cors = require('cors');
const config = require('./config');
const RepositoryFactory = require('./repository');
const ProductoController = require('./controllers/productoController');
const AuthController = require('./controllers/authController');
const createProductoRoutes = require('./routes/productoRoutes');
const createAuthRoutes = require('./routes/authRoutes');

/**
 * Configura y crea la aplicación Express
 */
function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Crear repositorios y controladores
  const productoRepository = RepositoryFactory.createProductoRepository();
  const usuarioRepository = RepositoryFactory.createUsuarioRepository();
  const productoController = new ProductoController(productoRepository);
  const authController = new AuthController(usuarioRepository);

  // Rutas
  app.use('/api/v1/auth', createAuthRoutes(authController));
  app.use('/api/v1/productos', createProductoRoutes(productoController));

  // Ruta de health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      dbProvider: config.dbProvider,
      authMethod: config.authMethod,
      timestamp: new Date().toISOString(),
    });
  });

  // Manejo de rutas no encontradas
  app.use((req, res) => {
    res.status(404).json({
      statusCode: 404,
      error: 'Ruta no encontrada',
    });
  });

  // Manejo de errores global
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      statusCode,
      error: err.message || 'Error interno del servidor',
    });
  });

  return app;
}

module.exports = createApp;
