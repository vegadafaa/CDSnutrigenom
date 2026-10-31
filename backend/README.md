# NutriGen-CDS Backend

Backend API server untuk Clinical Decision Support System Nutrigenomik.
Dibangun dengan **Node.js + Express**, menggunakan arsitektur MVC (Model-View-Controller).

---

## 📁 Struktur Direktori

```
backend/
├── server.js               # Entry point server
├── package.json            # Dependensi Node.js
├── .env.example            # Template environment variable
├── schema.sql              # Skema database PostgreSQL
│
├── routes/
│   ├── authRoutes.js       # POST /api/auth/login
│   ├── uploadRoutes.js     # POST /api/upload/lab & /genomic
│   └── cdsRoutes.js        # CDS evaluate, report, lab samples
│
├── controllers/
│   ├── authController.js   # Login & JWT generation
│   ├── uploadController.js # File upload processing
│   └── cdsController.js    # CDS evaluation & report
│
├── middleware/
│   └── authMiddleware.js   # JWT verification & role guard
│
└── engine/
    ├── cdsRuleEngine.js    # Rule engine (server-side)
    └── knowledgeBase.js    # Nutrigenomik SNP knowledge base
```

---

## 🔐 Demo User Credentials

| Username          | Password    | Role       |
|-------------------|-------------|------------|
| dr_vega           | password123 | physician  |
| lab_staff_1       | password123 | lab        |
| patient_arthur    | password123 | patient    |

---

## 🚀 Cara Menjalankan Backend

### 1. Install Node.js
Download dari https://nodejs.org/ (versi LTS disarankan)

### 2. Install dependensi
```bash
cd backend
npm install
```

### 3. Konfigurasi environment
```bash
copy .env.example .env
# Edit .env jika perlu mengubah PORT atau JWT_SECRET
```

### 4. Jalankan server
```bash
npm start
```
> Server akan berjalan di http://localhost:3000

---

## 📡 API Endpoints

| Method | URL                                | Role           | Deskripsi                          |
|--------|------------------------------------|----------------|------------------------------------|
| POST   | /api/auth/login                    | All            | Login dan mendapatkan JWT Token    |
| POST   | /api/upload/lab                    | lab, physician | Upload file hasil lab (JSON/CSV)   |
| POST   | /api/upload/genomic                | physician      | Upload file genomik (VCF)          |
| POST   | /api/cds/evaluate                  | physician      | Jalankan evaluasi CDS untuk pasien |
| GET    | /api/cds/report/:patientId         | physician, patient | Ambil laporan pasien            |
| GET    | /api/cds/samples                   | lab, physician | Lihat daftar sampel lab            |
| PUT    | /api/cds/samples/:sampleId/status  | lab, physician | Update status sampel               |

---

## 🗃️ Database (Production)

Untuk production, install PostgreSQL dan jalankan:
```bash
createdb nutrigen_cds
psql -d nutrigen_cds -f schema.sql
```

Kemudian integrasikan `pg` (node-postgres) di controller untuk query nyata ke database.

---

## 🔗 Integrasi Frontend

Frontend (`js/api_client.js`) sudah dikonfigurasi untuk menghubungkan ke `http://localhost:3000/api`.
Login menggunakan username (contoh: `dr_vega`) dengan password akan mengautentikasi ke backend.
Jika username dikosongkan, sistem berjalan dalam **Demo Mode** (offline) tanpa backend.
