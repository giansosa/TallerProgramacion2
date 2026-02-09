const fs = require('fs').promises;
const path = require('path');
const Usuario = require('../models/usuario');

class UsuarioRepositoryJson {
  constructor() {
    this.dbPath = path.join(__dirname, '../database/database.json');
    this.data = { productos: [], usuarios: [] };
  }

  /**
   * Inicializa el archivo de base de datos
   */
  async initialize() {
    try {
      const data = await fs.readFile(this.dbPath, 'utf8');
      this.data = JSON.parse(data);
      if (!this.data.usuarios) {
        this.data.usuarios = [];
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Crear el archivo si no existe
        await this.save();
      } else {
        console.error('Error al cargar base de datos JSON:', error.message);
        throw error;
      }
    }
  }

  /**
   * Guarda los datos en el archivo
   */
  async save() {
    try {
      const dir = path.dirname(this.dbPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error al guardar base de datos JSON:', error.message);
      throw error;
    }
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
    const existingUser = this.data.usuarios.find(u => u.username === usuario.username);
    if (existingUser) {
      const error = new Error('El nombre de usuario ya existe');
      error.statusCode = 409;
      throw error;
    }

    // Generar ID único
    const id = this.generateId();
    usuario.id = id;

    this.data.usuarios.push({
      id: usuario.id,
      username: usuario.username,
      password: usuario.password,
      createdAt: usuario.createdAt,
    });

    await this.save();

    return Usuario.fromJSON({
      id: usuario.id,
      username: usuario.username,
      createdAt: usuario.createdAt,
    });
  }

  /**
   * Busca un usuario por username
   * @param {string} username
   * @returns {Usuario|null}
   */
  async findByUsername(username) {
    const usuario = this.data.usuarios.find(u => u.username === username);
    if (!usuario) return null;

    return Usuario.fromJSON({
      id: usuario.id,
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
    const usuario = this.data.usuarios.find(u => u.id === id);
    if (!usuario) return null;

    return Usuario.fromJSON({
      id: usuario.id,
      username: usuario.username,
      createdAt: usuario.createdAt,
    });
  }

  /**
   * Verifica las credenciales de un usuario
   * @param {string} username
   * @param {string} password
   * @returns {Usuario|null}
   */
  async verifyCredentials(username, password) {
    const usuario = this.data.usuarios.find(u => u.username === username);
    if (!usuario) return null;

    // La comparación de password se hará en el servicio/controlador
    // Aquí solo devolvemos el usuario con el password hasheado
    return Usuario.fromJSON({
      id: usuario.id,
      username: usuario.username,
      password: usuario.password,
      createdAt: usuario.createdAt,
    });
  }

  /**
   * Genera un ID único
   * @returns {string}
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = UsuarioRepositoryJson;
