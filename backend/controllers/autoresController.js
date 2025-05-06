const db = require('../models/index');
const Autor = db.Autor;

exports.getAutores = async (req, res) => {
  try {
    const autores = await Autor.findAll();
    res.json(autores);
  } catch (error) {
    console.error('Error obteniendo autores:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAutor = async (req, res) => {
  try {
    const autor = await Autor.findByPk(req.params.id);
    if (!autor) {
      return res.status(404).json({ message: 'Autor no encontrado' });
    }
    res.json(autor);
  } catch (error) {
    console.error('Error obteniendo autor:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.createAutor = async (req, res) => {
  try {
    const nuevoAutor = await Autor.create(req.body);
    res.status(201).json(nuevoAutor);
  } catch (error) {
    console.error('Error creando autor:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateAutor = async (req, res) => {
  try {
    const [updated] = await Autor.update(req.body, {
      where: { id_autor: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Autor no encontrado' });
    }
    const autorActualizado = await Autor.findByPk(req.params.id);
    res.json(autorActualizado);
  } catch (error) {
    console.error('Error actualizando autor:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAutor = async (req, res) => {
  try {
    const deleted = await Autor.destroy({
      where: { id_autor: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Autor no encontrado' });
    }
    res.status(204).json();
  } catch (error) {
    console.error('Error eliminando autor:', error);
    res.status(500).json({ message: error.message });
  }
};