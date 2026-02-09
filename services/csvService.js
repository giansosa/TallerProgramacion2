const fs = require('fs').promises;
const path = require('path');

class CsvService {
  constructor() {
    this.csvPath = path.join(__dirname, '../database/albums_15.csv');
  }

  /**
   * Convierte un array de objetos a formato CSV
   * @param {Array} data - Array de objetos
   * @param {Array} columns - Columnas a incluir
   * @returns {string} CSV string
   */
  convertToCSV(data, columns) {
    if (!data || data.length === 0) {
      return '';
    }

    // Crear header
    const header = columns.join(',');

    // Crear filas
    const rows = data.map(item => {
      return columns.map(col => {
        const value = item[col] !== undefined && item[col] !== null ? item[col] : '';
        // Escapar comas y comillas si es necesario
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    });

    return [header, ...rows].join('\n');
  }

  /**
   * Guarda el contenido CSV en un archivo
   * @param {string} csvContent - Contenido CSV
   * @returns {Promise<string>} Ruta del archivo guardado
   */
  async saveCSV(csvContent) {
    try {
      const dir = path.dirname(this.csvPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(this.csvPath, csvContent, 'utf8');
      return this.csvPath;
    } catch (error) {
      console.error('Error al guardar CSV:', error.message);
      throw new Error('Error al guardar el archivo CSV');
    }
  }

  /**
   * Lee el contenido de un archivo CSV
   * @returns {Promise<string>} Contenido del archivo CSV
   */
  async readCSV() {
    try {
      const content = await fs.readFile(this.csvPath, 'utf8');
      return content;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('El archivo CSV no existe');
      }
      throw error;
    }
  }

  /**
   * Genera y guarda un CSV desde un array de objetos
   * @param {Array} data - Array de objetos
   * @param {Array} columns - Columnas a incluir
   * @returns {Promise<string>} Ruta del archivo guardado
   */
  async generateAndSaveCSV(data, columns) {
    const csvContent = this.convertToCSV(data, columns);
    return await this.saveCSV(csvContent);
  }
}

module.exports = CsvService;
