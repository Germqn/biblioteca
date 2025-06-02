const { Prestamo, Libro, Usuario } = require('../models');

exports.getPrestamos = async (req, res) => {
  try {
    const prestamos = await Prestamo.findAll({
      include: [
        {
          model: Libro,
          as: 'libro'
        },
        {
          model: Usuario,
          as: 'usuario'
        }
      ]
    });
    res.json(prestamos);
  } catch (error) {
    console.error('Error al obtener préstamos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getPrestamo = async (req, res) => {
  try {
    const prestamo = await Prestamo.findByPk(req.params.id, {
      include: [
        {
          model: Libro,
          as: 'libro'
        },
        {
          model: Usuario,
          as: 'usuario'
        }
      ]
    });
    if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
    res.json(prestamo);
  } catch (error) {
    console.error('Error al obtener préstamo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createPrestamo = async (req, res) => {
  try {
    const nuevo = await Prestamo.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear préstamo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.updatePrestamo = async (req, res) => {
  try {
    const prestamo = await Prestamo.findByPk(req.params.id);
    if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
    await prestamo.update(req.body);
    res.json(prestamo);
  } catch (error) {
    console.error('Error al actualizar préstamo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deletePrestamo = async (req, res) => {
  try {
    const prestamo = await Prestamo.findByPk(req.params.id);
    if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
    await prestamo.destroy();
    res.json({ message: 'Préstamo eliminado' });
  } catch (error) {
    console.error('Error al eliminar préstamo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};