const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(403).json({ message: 'Token requerido' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(401).json({ message: 'Token inválido' });
  }
};
