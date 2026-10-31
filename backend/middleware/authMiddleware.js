const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_nutrigen_key_123';

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ message: 'Token otorisasi diperlukan.' });

  const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token tidak valid atau telah kedaluwarsa.' });
    
    // Simpan payload token di request object untuk diakses controller selanjutnya
    req.user = decoded;
    next();
  });
};

exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak: Peran tidak mencukupi.' });
    }
    next();
  };
};
