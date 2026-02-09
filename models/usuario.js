/**
 * Modelo de Usuario
 * Esquema/DTO para la entidad Usuario
 */

class Usuario {
  constructor(data) {
    this.id = data.id || null;
    this.username = data.username || '';
    this.password = data.password || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  /**
   * Valida los datos del usuario
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    // Validar username
    if (!this.username || typeof this.username !== 'string' || this.username.trim() === '') {
      errors.push('El campo "username" es requerido y no puede estar vacío');
    }

    if (this.username && this.username.length < 3) {
      errors.push('El campo "username" debe tener al menos 3 caracteres');
    }

    // Validar password
    if (!this.password || typeof this.password !== 'string' || this.password.trim() === '') {
      errors.push('El campo "password" es requerido y no puede estar vacío');
    }

    if (this.password && this.password.length < 6) {
      errors.push('El campo "password" debe tener al menos 6 caracteres');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convierte el usuario a formato plano (para JSON)
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      createdAt: this.createdAt,
    };
  }

  /**
   * Crea un usuario desde un objeto plano
   * @param {Object} data
   * @returns {Usuario}
   */
  static fromJSON(data) {
    return new Usuario(data);
  }
}

module.exports = Usuario;
