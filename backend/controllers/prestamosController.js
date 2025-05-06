const Prestamo = require('../models/Prestamo');
const Libro = require('../models/Libro');
const Usuario = require('../models/Usuario');

exports.getPrestamos = async (req, res) => {
  const prestamos = await Prestamo.findAll({ include: [Libro, Usuario] });
  res.json(prestamos);
};

exports.getPrestamo = async (req, res) => {
  const prestamo = await Prestamo.findByPk(req.params.id);
  if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
  res.json(prestamo);
};

exports.createPrestamo = async (req, res) => {
  const nuevo = await Prestamo.create(req.body);
  res.json(nuevo);
};

exports.updatePrestamo = async (req, res) => {
  const prestamo = await Prestamo.findByPk(req.params.id);
  if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
  await prestamo.update(req.body);
  res.json(prestamo);
};

exports.deletePrestamo = async (req, res) => {
  const prestamo = await Prestamo.findByPk(req.params.id);
  if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
  await prestamo.destroy();
  res.json({ message: 'Préstamo eliminado' });
};
