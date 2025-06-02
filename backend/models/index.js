const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

// Importar todos los modelos
fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js';
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    const modelName = file.charAt(0).toUpperCase() + file.slice(1, -3);
    db[modelName] = model;
  });

// Configurar las asociaciones después de cargar todos los modelos
if (db.Libro && db.Autor) {
  db.Libro.belongsTo(db.Autor, { foreignKey: 'id_autor', as: 'autor' });
  db.Autor.hasMany(db.Libro, { foreignKey: 'id_autor', as: 'libros' });
}

if (db.Libro && db.Categoria) {
  db.Libro.belongsTo(db.Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
  db.Categoria.hasMany(db.Libro, { foreignKey: 'id_categoria', as: 'libros' });
}

if (db.Prestamo && db.Libro) {
  db.Prestamo.belongsTo(db.Libro, { foreignKey: 'id_libro', as: 'libro' });
  db.Libro.hasMany(db.Prestamo, { foreignKey: 'id_libro', as: 'prestamos' });
}

if (db.Prestamo && db.Usuario) {
  db.Prestamo.belongsTo(db.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
  db.Usuario.hasMany(db.Prestamo, { foreignKey: 'id_usuario', as: 'prestamos' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;