const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Autor = sequelize.define('Autor', {
  id_autor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'autores',
  timestamps: false,
  getterMethods: {
    imagen() {
      // Genera una URL de avatar basada en el nombre
      const nombreCompleto = `${this.nombre}+${this.apellido}`;
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreCompleto)}&background=random&size=150`;
    }
  }
});

module.exports = Autor;