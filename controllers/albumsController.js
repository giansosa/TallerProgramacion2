const AlbumsService = require('../services/albumsService');
const CsvService = require('../services/csvService');

class AlbumsController {
  constructor() {
    this.albumsService = new AlbumsService();
    this.csvService = new CsvService();
  }

  /**
   * Obtiene los primeros 15 albums, genera un CSV y lo devuelve
   * @param {Request} req
   * @param {Response} res
   */
  async getAlbumsCSV(req, res) {
    try {
      // Obtener los primeros 15 albums desde la API externa
      const albums = await this.albumsService.getFirst15Albums();

      // Definir columnas a incluir en el CSV
      const columns = ['userId', 'id', 'title'];

      // Generar y guardar el CSV
      const csvPath = await this.csvService.generateAndSaveCSV(albums, columns);

      // Leer el contenido del CSV
      const csvContent = await this.csvService.readCSV();

      // Devolver el CSV con el Content-Type apropiado
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="albums_15.csv"');
      return res.status(200).send(csvContent);
    } catch (error) {
      console.error('Error en getAlbumsCSV:', error);
      return res.status(500).json({
        statusCode: 500,
        error: error.message || 'Error al generar el CSV de albums',
      });
    }
  }
}

module.exports = AlbumsController;
