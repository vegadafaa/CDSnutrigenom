const jwt = require('jsonwebtoken');

// Secret key simulasi (di production, gunakan variabel environment dari .env)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_nutrigen_key_123';

// Mock users database
const users = [
  { id: 1, username: 'dr_vega', role: 'physician', password: 'password123' },
  { id: 2, username: 'lab_staff_1', role: 'lab', password: 'password123' },
  { id: 3, username: 'patient_arthur', role: 'patient', password: 'password123' }
];

exports.login = (req, res) => {
  const { username, password } = req.body;

  // Cari user (seharusnya query ke DB dan bandingkan hash dengan bcrypt)
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Kredensial tidak valid. Silakan coba lagi.' });
  }

  // Buat JWT Token
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    message: 'Login berhasil',
    token: token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
};
