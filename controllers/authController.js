const Usuario = require('../models/usuario');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');

class AuthController {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  /**
   * Registra un nuevo usuario
   * @param {Request} req
   * @param {Response} res
   */
  async register(req, res) {
    try {
      const { username, password } = req.body;

      // Validar que se proporcionen username y password
      if (!username || !password) {
        return res.status(400).json({
          statusCode: 400,
          error: 'Los campos "username" y "password" son requeridos',
        });
      }

      // Crear usuario
      const newUsuario = new Usuario({
        username,
        password,
      });

      // Validar usuario
      const validation = newUsuario.validate();
      if (!validation.valid) {
        return res.status(400).json({
          statusCode: 400,
          error: validation.errors.join(', '),
        });
      }

      // Hashear password
      newUsuario.password = await hashPassword(password);

      // Guardar usuario
      const saved = await this.usuarioRepository.create(newUsuario);

      return res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: saved.toJSON(),
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        statusCode,
        error: error.message || 'Error al registrar el usuario',
      });
    }
  }

  /**
   * Inicia sesión y genera un token JWT
   * @param {Request} req
   * @param {Response} res
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validar que se proporcionen username y password
      if (!username || !password) {
        return res.status(400).json({
          statusCode: 400,
          error: 'Los campos "username" y "password" son requeridos',
        });
      }

      // Verificar credenciales
      const usuario = await this.usuarioRepository.verifyCredentials(username, password);

      if (!usuario) {
        return res.status(401).json({
          statusCode: 401,
          error: 'Credenciales inválidas',
        });
      }

      // Comparar password
      const isPasswordValid = await comparePassword(password, usuario.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          statusCode: 401,
          error: 'Credenciales inválidas',
        });
      }

      // Generar token JWT
      const token = generateToken({
        userId: usuario.id,
        username: usuario.username,
      });

      return res.status(200).json({
        message: 'Login exitoso',
        token,
        user: {
          id: usuario.id,
          username: usuario.username,
          createdAt: usuario.createdAt,
        },
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        statusCode,
        error: error.message || 'Error al iniciar sesión',
      });
    }
  }
}

module.exports = AuthController;
