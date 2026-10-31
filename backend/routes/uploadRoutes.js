const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const uploadController = require('../controllers/uploadController');

// Konfigurasi Multer untuk menyimpan file ke memori (buffer) atau disk sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint upload lab (hanya untuk Lab User atau Physician)
router.post('/lab', verifyToken, requireRole(['lab', 'physician']), upload.single('labData'), uploadController.uploadLabData);

// Endpoint upload genomik (VCF) (hanya untuk Physician)
router.post('/genomic', verifyToken, requireRole(['physician']), upload.single('genomicData'), uploadController.uploadGenomicData);

module.exports = router;
