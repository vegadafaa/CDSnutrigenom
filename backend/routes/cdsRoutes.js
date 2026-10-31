const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const cdsController = require('../controllers/cdsController');

// POST /api/cds/evaluate — Physician runs CDS analysis for a patient
router.post('/evaluate', verifyToken, requireRole(['physician']), cdsController.evaluate);

// GET /api/cds/report/:patientId — Patient retrieves their own report
router.get('/report/:patientId', verifyToken, requireRole(['physician', 'patient']), cdsController.getReport);

// GET /api/cds/samples — Lab user retrieves sample list
router.get('/samples', verifyToken, requireRole(['lab', 'physician']), cdsController.getLabSamples);

// PUT /api/cds/samples/:sampleId/status — Lab user updates sample status
router.put('/samples/:sampleId/status', verifyToken, requireRole(['lab', 'physician']), cdsController.updateSampleStatus);

module.exports = router;
