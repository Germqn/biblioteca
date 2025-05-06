const Usuario = require('../models/Usuario');

exports.getUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
};

exports.getUsuario = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(usuario);
};

exports.createUsuario = async (req, res) => {
  const nuevo = await Usuario.create(req.body);
  res.json(nuevo);
};

exports.updateUsuario = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
  await usuario.update(req.body);
  res.json(usuario);
};

exports.deleteUsuario = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
  await usuario.destroy();
  res.json({ message: 'Usuario eliminado' });
};
