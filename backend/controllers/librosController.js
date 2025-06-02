// controllers/librosController.js
const { Libro, Autor, Categoria } = require('../models');
const axios = require('axios');
const { validationResult } = require('express-validator');
const sequelize = require('../config/db');

// Obtener todos los libros con portadas automáticas
exports.getLibros = async (req, res) => {
  try {
    const libros = await Libro.findAll({
      include: [
        {
          model: Autor,
          as: 'autor',
          attributes: ['id_autor', 'nombre', 'apellido']
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'nombre_categoria']
        }
      ],
      attributes: [
        'id_libro',
        'titulo',
        'portada_url',
        'anio_publicacion',
        'cantidad_disponible',
        [sequelize.literal(`CONCAT(
          'https://covers.openlibrary.org/b/title/',
          REPLACE(REPLACE(REPLACE(titulo, ' ', '+'), ':', '%3A'), '/', '%2F'),
          '-M.jpg'
        )`),
          'portada_generada']
      ]
    });

    const librosConPortadas = await Promise.all(libros.map(async libro => {
      const libroPlain = libro.get({ plain: true });

      if (!libroPlain.portada_url) {
        try {
          const openLibResponse = await axios.get(
            `https://openlibrary.org/search.json?title=${encodeURIComponent(libroPlain.titulo)}&limit=1`
          );

          if (openLibResponse.data.docs?.[0]?.cover_i) {
            libroPlain.portada_url = `https://covers.openlibrary.org/b/id/${openLibResponse.data.docs[0].cover_i}-M.jpg`;
          }
        } catch (error) {
          console.error("Error buscando portada:", error);
        }
      }

      return {
        ...libroPlain,
        portada_url: libroPlain.portada_url || libroPlain.portada_generada
      };
    }));

    res.json(librosConPortadas);
  } catch (error) {
    console.error('Error en getLibros:', error);
    res.status(500).json({
      message: 'Error al obtener libros',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener un libro por ID
exports.getLibro = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id, {
      include: [
        {
          model: Autor,
          as: 'autor',
          attributes: ['id_autor', 'nombre', 'apellido']
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'nombre_categoria']
        }
      ]
    });

    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    // Buscar portada alternativa si no existe
    if (!libro.portada_url) {
      try {
        // Intento con OpenLibrary
        const response = await axios.get(
          `https://openlibrary.org/search.json?title=${encodeURIComponent(libro.titulo)}&limit=1`
        );

        if (response.data.docs?.[0]?.cover_i) {
          libro.portada_url = `https://covers.openlibrary.org/b/id/${response.data.docs[0].cover_i}-M.jpg`;
          await libro.save();
        }
      } catch (error) {
        console.error("Error buscando portada:", error);
      }
    }

    res.json(libro);
  } catch (error) {
    console.error('Error en getLibro:', error);
    res.status(500).json({
      message: 'Error al obtener el libro',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Crear un nuevo libro
exports.createLibro = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { titulo, id_autor, id_categoria, anio_publicacion, cantidad_disponible, portada_url } = req.body;

    const nuevoLibro = await Libro.create({
      titulo,
      id_autor: id_autor || null,
      id_categoria: id_categoria || null,
      anio_publicacion,
      cantidad_disponible: cantidad_disponible || 0,
      portada_url
    });

    res.status(201).json(nuevoLibro);
  } catch (error) {
    console.error('Error en createLibro:', error);
    res.status(500).json({
      message: 'Error al crear el libro',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Actualizar un libro existente

exports.updateLibro = async (req, res) => {
  try {
    console.log('Datos recibidos para actualizar:', req.body);

    if (!req.body.titulo) {
      return res.status(400).json({ message: 'El título es requerido' });
    }

    const libro = await Libro.findByPk(req.params.id);
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    const updates = {
      titulo: req.body.titulo,
      id_autor: req.body.id_autor ? Number(req.body.id_autor) : null,
      id_categoria: req.body.id_categoria ? Number(req.body.id_categoria) : null,
      anio_publicacion: req.body.anio_publicacion ? Number(req.body.anio_publicacion) : null,
      cantidad_disponible: req.body.cantidad_disponible ? Number(req.body.cantidad_disponible) : 0,
      portada_url: req.body.portada_url || null
    };

    if (updates.id_autor !== null) {
      const autorExists = await Autor.findByPk(updates.id_autor);
      if (!autorExists) {
        return res.status(400).json({ message: 'El autor especificado no existe' });
      }
    }

    if (updates.id_categoria !== null) {
      const categoriaExists = await Categoria.findByPk(updates.id_categoria);
      if (!categoriaExists) {
        return res.status(400).json({ message: 'La categoría especificada no existe' });
      }
    }

    await libro.update(updates);

    try {
      const updatedLibro = await Libro.findByPk(req.params.id, {
        include: [
          { model: Autor, as: 'autor' },
          { model: Categoria, as: 'categoria' }
        ]
      });
      return res.json(updatedLibro);
    } catch (errorObtenerLibro) {
      console.error('Error al obtener el libro actualizado con relaciones:', errorObtenerLibro);
      return res.status(500).json({
        message: 'Error al obtener el libro actualizado',
        error: process.env.NODE_ENV === 'development' ? errorObtenerLibro.message : undefined
      });
    }

  } catch (error) {
    console.error('Error en updateLibro:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        message: 'Error de referencia',
        detail: 'El autor o categoría no existe'
      });
    }

    return res.status(500).json({
      message: 'Error al actualizar el libro',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Eliminar un libro
exports.deleteLibro = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    await libro.destroy();
    res.json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteLibro:', error);
    res.status(500).json({
      message: 'Error al eliminar el libro',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};