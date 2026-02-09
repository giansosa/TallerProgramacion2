const mongoose = require('mongoose');
const Usuario = require('../models/usuario');

// Definir el esquema de Mongoose para Usuario
const usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Crear el modelo de Mongoose
const UsuarioModel = mongoose.model('Usuario', usuarioSchema);

class UsuarioRepositoryMongo {
  constructor() {
    this.model = UsuarioModel;
  }

  /**
   * Crea un nuevo usuario
   * @param {Usuario} usuario
   * @returns {Usuario}
   */
  async create(usuario) {
    const validation = usuario.validate();
    if (!validation.valid) {
      const error = new Error(validation.errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    // Verificar si el username ya existe
    const existingUser = await this.model.findOne({ username: usuario.username });
    if (existingUser) {
      const error = new Error('El nombre de usuario ya existe');
      error.statusCode = 409;
      throw error;
    }

    const newUsuario = new this.model({
      username: usuario.username,
      password: usuario.password,
    });

    const saved = await newUsuario.save();

    return Usuario.fromJSON({
      id: saved._id.toString(),
      username: saved.username,
      createdAt: saved.createdAt,
    });
  }

  /**
   * Busca un usuario por username
   * @param {string} username
   * @returns {Usuario|null}
   */
  async findByUsername(username) {
    const usuario = await this.model.findOne({ username });
    if (!usuario) return null;

    return Usuario.fromJSON({
      id: usuario._id.toString(),
      username: usuario.username,
      password: usuario.password,
      createdAt: usuario.createdAt,
    });
  }

  /**
   * Busca un usuario por ID
   * @param {string} id
   * @returns {Usuario|null}
   */
  async findById(id) {
    try {
      const usuario = await this.model.findById(id);
      if (!usuario) return null;

      return Usuario.fromJSON({
        id: usuario._id.toString(),
        username: usuario.username,
        createdAt: usuario.createdAt,
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Verifica las credenciales de un usuario
   * @param {string} username
   * @param {string} password
   * @returns {Usuario|null}
   */
  async verifyCredentials(username, password) {
    const usuario = await this.model.findOne({ username });
    if (!usuario) return null;

    // La comparación de password se hará en el servicio/controlador
    // Aquí solo devolvemos el usuario con el password hasheado
    return Usuario.fromJSON({
      id: usuario._id.toString(),
      username: usuario.username,
      password: usuario.password,
      createdAt: usuario.createdAt,
    });
  }
}

module.exports = UsuarioRepositoryMongo;
