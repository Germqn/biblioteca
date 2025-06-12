// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

// REGISTRO DE USUARIO
exports.register = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    // Validaciones
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({
        message: 'Por favor, completa todos los campos'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Ya existe un usuario con este correo electrónico'
      });
    }

    // Encriptar contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear nuevo usuario
    const newUser = await Usuario.create({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    // Generar JWT token
    const token = jwt.sign(
      {
        id: newUser.id_usuario,
        email: newUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respuesta exitosa (sin enviar la contraseña)
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser.id_usuario,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

// LOGIN DE USUARIO (Tu función actualizada)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        message: 'Por favor, ingresa email y contraseña'
      });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({
      where: { email: email.toLowerCase() }
    });

    if (!usuario) {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respuesta exitosa
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

// VERIFICAR TOKEN
exports.verifyToken = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Usuario.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({ message: 'Token inválido' });
  }
};

// OBTENER PERFIL DE USUARIO
exports.getProfile = async (req, res) => {
  try {
    const userId = req.usuarioId;

    const user = await Usuario.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};