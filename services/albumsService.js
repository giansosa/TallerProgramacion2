const axios = require('axios');

class AlbumsService {
  constructor() {
    this.apiUrl = 'https://jsonplaceholder.typicode.com/albums';
  }

  /**
   * Obtiene los primeros 15 albums desde la API externa
   * @returns {Promise<Array>} Array de albums
   */
  async getFirst15Albums() {
    try {
      const response = await axios.get(this.apiUrl);
      const albums = response.data;

      // Tomar solo los primeros 15
      const first15 = albums.slice(0, 15);

      return first15;
    } catch (error) {
      console.error('Error al obtener albums:', error.message);
      throw new Error('Error al obtener albums desde la API externa');
    }
  }
}

module.exports = AlbumsService;
