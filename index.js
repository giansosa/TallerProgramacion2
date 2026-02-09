const config = require('./config');
const RepositoryFactory = require('./repository');
const createApp = require('./app');

/**
 * Inicializa y arranca el servidor
 */
async function startServer() {
  try {
    console.log('Iniciando servidor...');
    console.log(`DB_PROVIDER: ${config.dbProvider}`);
    console.log(`AUTH_METHOD: ${config.authMethod}`);

    // Inicializar repositorios según el proveedor
    const productoRepository = RepositoryFactory.createProductoRepository();
    const usuarioRepository = RepositoryFactory.createUsuarioRepository();

    if (config.dbProvider === 'mongo') {
      // Conectar a MongoDB
      await productoRepository.connect(config.mongoUri);
    } else if (config.dbProvider === 'json') {
      // Inicializar base de datos JSON
      await productoRepository.initialize();
      await usuarioRepository.initialize();
    }

    // Crear aplicación Express
    const app = createApp();

    // Iniciar servidor
    const server = app.listen(config.port, () => {
      console.log(`Servidor corriendo en http://localhost:${config.port}`);
      console.log(`API disponible en http://localhost:${config.port}/api/v1`);
      console.log(`Health check: http://localhost:${config.port}/health`);
    });

    // Manejo de cierre graceful
    process.on('SIGTERM', async () => {
      console.log('SIGTERM recibido, cerrando servidor...');
      server.close(async () => {
        if (config.dbProvider === 'mongo') {
          await productoRepository.disconnect();
        }
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('\nSIGINT recibido, cerrando servidor...');
      server.close(async () => {
        if (config.dbProvider === 'mongo') {
          await productoRepository.disconnect();
        }
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();
