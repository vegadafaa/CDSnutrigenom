const { evaluatePatient } = require('../engine/cdsRuleEngine');
const { NUTRIGENOMICS_KB } = require('../engine/knowledgeBase');

// --- IN-MEMORY DATABASE (Placeholder sebelum integrasi PostgreSQL/MongoDB) ---
// Pada production, ini diganti dengan query ke database sungguhan.

const patientDB = {
  'P-1001': {
    id: 'P-1001', name: 'Arthur Pendelton', age: 47, gender: 'male',
    weight: 88, height: 178, bmi: 27.8,
    bloodPressure: '138/88 mmHg', dietPattern: 'Western/Omnivore',
    primaryGoals: ['Reduce cardiovascular risk', 'Optimize cognition'],
    genotypes: {
      rs1801133: { rsid: 'rs1801133', gene: 'MTHFR', genotype: 'TT', variantName: 'MTHFR C677T' },
      rs429358:  { rsid: 'rs429358',  gene: 'APOE',  genotype: 'CT', variantName: 'APOE ε4' },
      rs2228570: { rsid: 'rs2228570', gene: 'VDR',   genotype: 'CC', variantName: 'VDR FokI' },
      rs7903146: { rsid: 'rs7903146', gene: 'TCF7L2', genotype: 'CT', variantName: 'TCF7L2 T2D' }
    },
    biomarkers: {
      homocysteine:   { value: 14.2, unit: 'µmol/L',  reference: '< 9.0',     status: 'Elevated' },
      vitaminD:       { value: 22,   unit: 'ng/mL',   reference: '30-100',    status: 'Deficient' },
      ldlCholesterol: { value: 148,  unit: 'mg/dL',   reference: '< 100',     status: 'Elevated' },
      hba1c:          { value: 5.7,  unit: '%',        reference: '< 5.7',     status: 'Pre-diabetic' }
    }
  },
  'P-1002': {
    id: 'P-1002', name: 'Priya Sharma', age: 35, gender: 'female',
    weight: 59, height: 162, bmi: 22.5,
    bloodPressure: '118/74 mmHg', dietPattern: 'Vegetarian',
    primaryGoals: ['Optimize fertility markers', 'Correct nutritional deficiencies'],
    genotypes: {
      rs1801133: { rsid: 'rs1801133', gene: 'MTHFR', genotype: 'CT', variantName: 'MTHFR C677T' },
      rs174537:  { rsid: 'rs174537',  gene: 'FADS1', genotype: 'TT', variantName: 'FADS1 Omega-3' },
      rs2228570: { rsid: 'rs2228570', gene: 'VDR',   genotype: 'CT', variantName: 'VDR FokI' }
    },
    biomarkers: {
      vitaminD: { value: 18, unit: 'ng/mL', reference: '30-100', status: 'Deficient' }
    }
  }
};

// In-memory lab samples
const labSamples = [
  { id: 'SMP-1092', patientId: 'P-1001', patientName: 'Arthur Pendelton', type: 'Blood Plasma', status: 'Received',    receivedAt: '2026-10-09T08:00:00Z' },
  { id: 'SMP-1093', patientId: 'P-1001', patientName: 'Arthur Pendelton', type: 'Saliva / Buccal', status: 'Processing', receivedAt: '2026-10-09T08:05:00Z' },
  { id: 'SMP-1094', patientId: 'P-1002', patientName: 'Priya Sharma',     type: 'Blood Serum', status: 'Analyzing',   receivedAt: '2026-10-09T09:30:00Z' }
];

// In-memory report cache (di production disimpan ke DB)
const reportCache = {};

/**
 * POST /api/cds/evaluate
 * Body: { patientId, genotypes?, biomarkers? } (opsional override dari dokter)
 */
exports.evaluate = (req, res) => {
  const { patientId, genotypes, biomarkers } = req.body;

  const patient = patientDB[patientId];
  if (!patient) return res.status(404).json({ message: `Pasien ID ${patientId} tidak ditemukan.` });

  // Merge optional overrides from request
  const mergedPatient = {
    ...patient,
    genotypes: { ...patient.genotypes, ...(genotypes || {}) },
    biomarkers: { ...patient.biomarkers, ...(biomarkers || {}) }
  };

  const evaluation = evaluatePatient(mergedPatient, NUTRIGENOMICS_KB);

  // Cache report
  reportCache[patientId] = { evaluation, patient: mergedPatient, generatedBy: req.user.username };

  res.json({
    message: 'Evaluasi CDS berhasil dijalankan.',
    patientId,
    evaluation
  });
};

/**
 * GET /api/cds/report/:patientId
 * Pasien atau dokter mengambil laporan yang sudah digenerate.
 */
exports.getReport = (req, res) => {
  const { patientId } = req.params;

  // Pastikan pasien hanya bisa mengakses laporannya sendiri
  if (req.user.role === 'patient') {
    const linkedPatientId = req.user.patientId || 'P-1001'; // Di production ambil dari DB user
    if (patientId !== linkedPatientId) {
      return res.status(403).json({ message: 'Akses ditolak: Anda hanya dapat mengakses laporan Anda sendiri.' });
    }
  }

  // Cek cache dulu, kalau belum ada generate baru
  if (!reportCache[patientId]) {
    const patient = patientDB[patientId];
    if (!patient) return res.status(404).json({ message: 'Pasien tidak ditemukan.' });
    const evaluation = evaluatePatient(patient, NUTRIGENOMICS_KB);
    reportCache[patientId] = { evaluation, patient };
  }

  const cached = reportCache[patientId];

  res.json({
    patient: {
      id: cached.patient.id,
      name: cached.patient.name,
      age: cached.patient.age,
      gender: cached.patient.gender,
      primaryGoals: cached.patient.primaryGoals
    },
    evaluation: cached.evaluation
  });
};

/**
 * GET /api/cds/samples
 * Mengembalikan daftar sampel lab aktif.
 */
exports.getLabSamples = (req, res) => {
  res.json({ samples: labSamples });
};

/**
 * PUT /api/cds/samples/:sampleId/status
 * Body: { status: "Processing" | "Analyzing" | "Completed" }
 */
exports.updateSampleStatus = (req, res) => {
  const { sampleId } = req.params;
  const { status } = req.body;

  const validStatuses = ['Received', 'Processing', 'Analyzing', 'Completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `Status tidak valid. Pilih: ${validStatuses.join(', ')}` });
  }

  const sample = labSamples.find(s => s.id === sampleId);
  if (!sample) return res.status(404).json({ message: `Sampel ID ${sampleId} tidak ditemukan.` });

  sample.status = status;
  sample.updatedAt = new Date().toISOString();
  sample.updatedBy = req.user.username;

  res.json({ message: `Status sampel ${sampleId} berhasil diperbarui ke "${status}".`, sample });
};
