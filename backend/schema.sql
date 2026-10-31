/**
 * NutriGen-CDS Backend: Database Schema (PostgreSQL)
 * Jalankan file ini menggunakan psql atau tools seperti DBeaver untuk membuat skema.
 * 
 * Prasyarat: Install PostgreSQL di server, buat database baru bernama "nutrigen_cds"
 *   > createdb nutrigen_cds
 *   > psql -d nutrigen_cds -f schema.sql
 */

-- ========================
-- TABEL USERS (Autentikasi)
-- ========================
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,            -- Disimpan sebagai hash bcrypt, BUKAN plaintext
  role        VARCHAR(20) NOT NULL CHECK (role IN ('physician', 'lab', 'patient')),
  full_name   VARCHAR(100),
  email       VARCHAR(100) UNIQUE,
  patient_id  VARCHAR(20) REFERENCES patients(id) ON DELETE SET NULL,  -- Link ke pasien jika role = patient
  created_at  TIMESTAMP DEFAULT NOW(),
  last_login  TIMESTAMP
);

-- ========================
-- TABEL PATIENTS (Data Klinis)
-- ========================
CREATE TABLE IF NOT EXISTS patients (
  id          VARCHAR(20) PRIMARY KEY,  -- e.g. P-1001
  name        VARCHAR(100) NOT NULL,
  age         INT,
  gender      VARCHAR(10),
  weight_kg   DECIMAL(5,2),
  height_cm   DECIMAL(5,1),
  bmi         DECIMAL(4,1),
  blood_pressure  VARCHAR(20),
  diet_pattern    VARCHAR(50),
  primary_goals   TEXT[],  -- Array of strings
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- ========================
-- TABEL GENOMIC_DATA (Data DNA/VCF Pasien)
-- ========================
CREATE TABLE IF NOT EXISTS genomic_data (
  id          SERIAL PRIMARY KEY,
  patient_id  VARCHAR(20) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  rsid        VARCHAR(20) NOT NULL,
  gene        VARCHAR(30) NOT NULL,
  genotype    VARCHAR(10) NOT NULL,
  variant_name VARCHAR(100),
  source      VARCHAR(30),              -- e.g. VCF, 23andMe, Manual
  uploaded_by INT REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(patient_id, rsid)              -- Satu pasien, satu rsid
);

-- ========================
-- TABEL LAB_RESULTS (Data Biomarker Lab Pasien)
-- ========================
CREATE TABLE IF NOT EXISTS lab_results (
  id          SERIAL PRIMARY KEY,
  patient_id  VARCHAR(20) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  sample_id   VARCHAR(20) REFERENCES lab_samples(id),
  biomarker   VARCHAR(50) NOT NULL,     -- e.g. homocysteine, vitaminD
  value       DECIMAL(10,3) NOT NULL,
  unit        VARCHAR(20),              -- e.g. ng/mL, µmol/L
  reference   VARCHAR(50),             -- e.g. "< 9.0"
  status      VARCHAR(30),             -- e.g. Elevated, Normal, Deficient
  tested_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  uploaded_by INT REFERENCES users(id)
);

-- ========================
-- TABEL LAB_SAMPLES (Pelacakan Sampel)
-- ========================
CREATE TABLE IF NOT EXISTS lab_samples (
  id          VARCHAR(20) PRIMARY KEY,   -- e.g. SMP-1092
  patient_id  VARCHAR(20) NOT NULL REFERENCES patients(id),
  type        VARCHAR(50) NOT NULL,     -- e.g. Blood Plasma, Saliva
  status      VARCHAR(20) NOT NULL DEFAULT 'Received' CHECK (status IN ('Received','Processing','Analyzing','Completed','Rejected')),
  received_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  notes       TEXT,
  updated_by  INT REFERENCES users(id),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- ========================
-- TABEL CLINICAL_REPORTS (Laporan CDS yang Digenerate)
-- ========================
CREATE TABLE IF NOT EXISTS clinical_reports (
  id              SERIAL PRIMARY KEY,
  patient_id      VARCHAR(20) NOT NULL REFERENCES patients(id),
  report_type     VARCHAR(20) DEFAULT 'nutrigenomic',
  evaluation_json JSONB NOT NULL,          -- Hasil evaluasi CDS lengkap disimpan sebagai JSON
  generated_by    INT REFERENCES users(id),
  generated_at    TIMESTAMP DEFAULT NOW()
);

-- ========================
-- INDEX untuk performa query
-- ========================
CREATE INDEX IF NOT EXISTS idx_genomic_patient ON genomic_data(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_patient ON lab_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_patient ON clinical_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_samples_patient ON lab_samples(patient_id);
