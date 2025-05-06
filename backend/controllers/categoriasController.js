const Categoria = require('../models/Categoria');
const axios = require('axios');

// Función para buscar imagen de categoría
const buscarImagenCategoria = async (nombreCategoria) => {
  try {
    // 1. Primero intentamos con Unsplash (si tenemos API key)
    if (process.env.UNSPLASH_API_KEY) {
      const unsplashResponse = await axios.get(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(nombreCategoria)}&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}`
          }
        }
      );
      if (unsplashResponse.data.results?.length > 0) {
        return unsplashResponse.data.results[0].urls.small;
      }
    }

    // 2. Si no hay en Unsplash, probamos con placeholder temático
    const colores = {
      'novela': '8e44ad',
      'poesía': '3498db',
      'ciencia ficción': '16a085',
      'historia': 'e74c3c',
      // ... otros colores para categorías
    };
    const color = colores[nombreCategoria.toLowerCase()] || '3498db';
    const iniciales = nombreCategoria.split(' ').map(w => w[0]).join('').toUpperCase();
    return `https://via.placeholder.com/300x200/${color}/ffffff?text=${iniciales}`;
    
  } catch (error) {
    console.error("Error buscando imagen:", error);
    const iniciales = nombreCategoria.split(' ').map(w => w[0]).join('').toUpperCase();
    return `https://via.placeholder.com/300x200/3498db/ffffff?text=${iniciales}`;
  }
};

exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createCategoria = async (req, res) => {
  try {
    // Buscar imagen automáticamente al crear
    const imagen_url = await buscarImagenCategoria(req.body.nombre_categoria);
    const categoria = await Categoria.create({
      ...req.body,
      imagen_url
    });
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCategoria = async (req, res) => {
  try {
    const [updated] = await Categoria.update(req.body, {
      where: { id_categoria: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: 'Categoría no encontrada' });
    const categoriaActualizada = await Categoria.findByPk(req.params.id);
    res.json(categoriaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCategoria = async (req, res) => {
  try {
    const deleted = await Categoria.destroy({
      where: { id_categoria: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};