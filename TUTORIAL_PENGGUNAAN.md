# Panduan Lengkap Penggunaan Aplikasi NutriGen-CDS
*(Clinical Decision Support for Evidence-Based Precision Nutrigenomics)*

Dokumen ini merupakan panduan langkah-demi-langkah bagi klinisi (dokter/ahli gizi), staf laboratorium, maupun pasien dalam mengoperasikan aplikasi **NutriGen-CDS**.

---

## Daftar Isi
1. [Cara Membuka Aplikasi](#1-cara-membuka-aplikasi)
2. [Pilihan Bahasa (English & Bahasa Indonesia)](#2-pilihan-bahasa-english--bahasa-indonesia)
3. [Alur Masuk (Login & Mode Demo)](#3-alur-masuk-login--mode-demo)
4. [Panduan Penggunaan Berdasarkan Peran (Role)](#4-panduan-penggunaan-berdasarkan-peran-role)
   - [A. Peran Dokter / Klinisi (Physician)](#a-peran-dokter--klinisi-physician)
   - [B. Peran Staf Laboratorium (Lab User)](#b-peran-staf-laboratorium-lab-user)
   - [C. Peran Pasien (Patient Portal)](#c-peran-pasien-patient-portal)
5. [Eksplorasi Fitur Klinis & Output Sistem](#5-eksplorasi-fitur-klinis--output-sistem)
   - [Penerimaan Data Genomik & Lab (Intake & Ingestion)](#tab-1-penerimaan-data-genomik--lab)
   - [Matriks Risiko Metabolik (Risk Matrix & SVG Radar)](#tab-2-matriks-risiko-metabolik)
   - [Preskripsi Nutrisi Presisi (Nutrition Rx)](#tab-3-preskripsi-nutrisi-presisi)
   - [Keamanan & Interaksi Obat (Safety & Depletions)](#tab-4-keamanan--interaksi-obat)
   - [Dokumentasi Klinis SOAP & Rencana Pasien](#tab-5-dokumentasi-klinis-soap--rencana-pasien)
   - [Ekspor Interoperabilitas HL7 FHIR R4](#tab-6-ekspor-interoperabilitas-hl7-fhir-r4)
   - [Basis Pengetahuan Ilmiah (Knowledge Base)](#tab-7-basis-pengetahuan-ilmiah)
6. [Tanya Jawab & Pemecahan Masalah (FAQ & Troubleshooting)](#6-faq--troubleshooting)

---

## 1. Cara Membuka Aplikasi

Aplikasi NutriGen-CDS dirancang secara mandiri (*self-contained / client-side*), sehingga tidak memerlukan dependensi instalasi yang rumit:

1. Buka folder proyek: `nutrigenomic_cds/`.
2. Klik ganda file **`index.html`** untuk langsung membukanya di browser web favorit Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, atau Safari).
3. *(Opsional)* Jika Anda ingin menjalankan server lokal:
   ```powershell
   # Menggunakan Python (jika tersedia):
   python -m http.server 8080
   # Lalu buka di browser: http://localhost:8080/index.html
   ```

---

## 2. Pilihan Bahasa (English & Bahasa Indonesia)

Di sudut kanan atas navigasi header, terdapat selector bahasa dengan ikon bola dunia 🌐:
* **English (EN)**: Tampilan antarmuka berbahasa Inggris standar internasional.
* **Bahasa Indonesia (ID)**: Tampilan antarmuka diterjemahkan penuh ke dalam Bahasa Indonesia.

Pilihan bahasa Anda akan disimpan secara otomatis di browser (*localStorage*), sehingga bahasa yang dipilih tetap aktif saat halaman disegarkan (*refresh*).

---

## 3. Alur Masuk (Login & Mode Demo)

Saat membuka aplikasi, Anda akan disambut oleh layar autentikasi:

### Opsi A: Mode Demo (Offline / Tanpa Server) - *Direkomendasikan untuk uji coba cepat*
1. Pada bagian bawah panel login, lihat bagian **"Pilih Role Demo"**:
   * **👨‍⚕️ Physician / Clinician**: Akses penuh ke seluruh fitur evaluasi klinis.
   * **🔬 Laboratory User**: Akses ke antrean sampel lab, input hasil, dan checklist QC.
   * **👤 Patient Portal**: Akses langsung ke laporan nutrisi dan panduan pasien pribadi.
2. Klik tombol abu-abu **"Masuk Demo Mode (Offline)"**.
3. Sistem akan langsung membuka dashboard sesuai hak akses peran yang dipilih.

### Opsi B: Login dengan Server Backend (Jika server Express aktif)
1. Masukkan **Username** dan **Password**:
   * Dokter: `dr_vega` / `password123`
   * Lab: `lab_staff_1` / `password123`
   * Pasien: `patient_arthur` / `password123`
2. Klik tombol **"Login dengan Backend"**.

---

## 4. Panduan Penggunaan Berdasarkan Peran (Role)

### A. Peran Dokter / Klinisi (Physician)
Sebagai dokter atau ahli gizi:
1. **Memilih Persona Pasien**:
   Gunakan dropdown di header (*"Pilih Profil Pasien"*) untuk berpindah kasus uji klinis:
   * **Arthur Pendelton**: Sindrom metabolik, `MTHFR 677TT`, konsumsi Metformin & Statin, homosistein tinggi.
   * **Brenda Vance**: Keluhan pencernaan & cemas, `COMT Slow` + `MTHFR`, intoleransi laktosa.
   * **Carlos Mendez**: Pria 45 tahun, risiko hemokromatosis (*HFE C282Y*), peringatan zat besi.
   * **Dana Kowalski**: Atlet vegan, gangguan konversi omega-3 (*FADS1*) dan vitamin A (*BCMO1*).
2. **Meninjau Dashboard Klinis**:
   * Evaluasi vitals pasien di strip atas (IMT, Tekanan Darah, Status Risiko Global).
   * Buka tab **Metabolic Risk Matrix** untuk melihat visualisasi diagram radar 5 domain metabolik.
   * Buka tab **Precision Nutrition Rx** untuk melihat rekomendasi target makronutrien dan resep suplemen bioaktif.
   * Buka tab **Safety & Depletions** untuk mengecek kontraindikasi obat dan peringatan interaksi multi-gen (epistasis).
3. **Mencetak / Ekspor Laporan**:
   * Buka tab **Clinical Documentation (SOAP)**.
   * Pilih tombol **Clinician SOAP View** atau **Patient Care Plan View**.
   * Klik tombol **Print / PDF** atau unduh file **.docx**.

---

### B. Peran Staf Laboratorium (Lab User)
Jika masuk sebagai staf laboratorium, aplikasi akan otomatis membuka tab khusus **Lab Tracking & Workflow**:
1. **Mendaftarkan Sampel Masuk**:
   * Pada kartu *Tambah Sampel Baru*, pilih Pasien, Tipe Sampel (cth: *Blood Plasma*, *Saliva*), dan catatan pengantar.
   * Klik **+ Daftarkan Sampel Baru**.
2. **Memperbarui Status Sampel**:
   * Pada tabel sampel, ubah status dari *Received* &rarr; *Processing* &rarr; *Analyzing* &rarr; *Completed*.
3. **Memasukkan Hasil Biomarker**:
   * Pada panel kanan, pilih sampel yang sudah *Completed*.
   * Tambahkan parameter biomarker (misal Homosistein, Vitamin D, Ferritin) beserta nilai terukur.
   * Klik **Simpan & Kirim ke CDS**.
4. **Verifikasi Quality Control (QC)**:
   * Centang seluruh daftar periksa pada *QC Checklist Pra-Analisis* (kalibrasi instrumen, integritas sampel, dll).
   * Klik **Konfirmasi QC & Selesaikan Sampel**. Hasil otomatis siap dianalisis oleh dokter.

---

### C. Peran Pasien (Patient Portal)
Jika login sebagai pasien:
1. Sistem menyembunyikan tabel teknis yang rumit dan langsung menampilkan **Laporan Kesehatan Saya (My Health Report)**.
2. Pasien dapat membaca dengan mudah:
   * **Makanan yang Dianjurkan vs Makanan yang Dibatasi**: Panduan bahan makanan nyata sehari-hari.
   * **Jadwal Konsumsi Suplemen**: Kapan suplemen diminum (pagi/siang/malam), sebelum atau sesudah makan, serta dosisnya.
   * **Target Pemantauan**: Kapan harus kembali periksa darah ulang ke laboratorium (misal evaluasi kadar homosistein dalam 8-12 minggu).
3. Pasien dapat menekan tombol **Print / Save PDF** untuk menyimpan atau mencetak rencana diet tersebut.

---

## 5. Eksplorasi Fitur Klinis & Output Sistem

### [Tab 1] Penerimaan Data Genomik & Lab (Intake & Ingestion)
* **Drag & Drop File Genomik**: Anda dapat mengunggah file DNA langsung (`.vcf`, hasil raw data 23andMe `.txt`, atau sesi `.json`).
* **Tabel Analisis Varian**: Menampilkan daftar gen (seperti `MTHFR`, `APOE`, `VDR`, `COMT`), genotipe hasil sekuensing, dampak fungsional, dan bukti ilmiah (*Evidence Tier*).
* **Biomarker Fenotipe**: Menampilkan status lab aktual (normal, elevated, deficient) yang menentukan apakah risiko genetik aktif.

### [Tab 2] Matriks Risiko Metabolik (Risk Matrix)
* **Diagram Radar Poligenik (SVG)**: Visualisasi grafis 5 domain metabolik:
  1. *Methylation & 1-Carbon Metabolism*
  2. *Cardiometabolic & Lipid Dynamics*
  3. *Micronutrient Homeostasis & Transport*
  4. *Food Intolerances & Clearance*
  5. *Detoxification & Antioxidant Defense*
* **Rincian Skor Domain**: Menjelaskan interpretasi genetik dan saran tindakan diet untuk masing-masing domain.

### [Tab 3] Preskripsi Nutrisi Presisi (Nutrition Rx)
* **Target Kalori & Makronutrien**: Menghitung kebutuhan harian (Kkal), persentase serta gramasi Karbohidrat, Protein, dan Batas Lemak Jenuh (disesuaikan dengan status varian kardiometabolik seperti `APOE4` dan `FTO`).
* **Formularium Suplemen Presisi**: Meresepkan senyawa bioaktif aktif (misal *L-5-MTHF* bukan asam folat biasa, *Methylcobalamin* bukan cyanocobalamin) lengkap dengan dosis dan waktu konsumsi.
* **Protokol Pola Makan "Food-First"**: Rekomendasi bahan pangan utuh yang dianjurkan versus yang harus diminimalkan.

### [Tab 4] Keamanan & Interaksi Obat (Safety & Depletions)
* **Peringatan Keamanan Kritis (Critical Guardrails)**:
  * Peringatan toksisitas besi jika pasien memiliki mutasi *HFE C282Y*.
  * Peringatan interaksi antikoagulan jika pasien meminum *Warfarin* bersamaan dengan Vitamin K.
* **Interaksi Multi-Gen (Sinergi Epistasis)**:
  * Deteksi kombinasi `MTHFR 677TT` + `COMT Met/Met` (membutuhkan titrasi asam folat secara perlahan + Magnesium guna menghindari kecemasan).
* **Pelacak Deplesi Nutrisi Akibat Obat**:
  * Mengingatkan bahwa konsumsi *Metformin* menguras Vitamin B12, atau konsumsi *Statin* menguras CoQ10.

### [Tab 5] Dokumentasi Klinis SOAP & Rencana Pasien
* **Tampilan SOAP**: Format ringkasan rekam medis lengkap untuk tenaga medis:
  * *S (Subjective)*: Keluhan utama, riwayat diet, konsumsi kafein/alkohol, obat-obatan.
  * *O (Objective)*: Hasil biomarker darah dan varian genomik.
  * *A (Assessment)*: Evaluasi risiko terintegrasi dan korelasi fenotipe.
  * *P (Plan)*: Preskripsi diet, suplemen presisi, dan jadwal kontrol lab.
* **Tampilan Rencana Pasien**: Panduan praktis dengan bahasa awam yang mudah dipahami oleh pasien.

### [Tab 6] Ekspor Interoperabilitas HL7 FHIR R4
* Menyediakan data terstandarisasi industri rumah sakit internasional:
  * Format bundel JSON **HL7 FHIR R4**.
  * Termasuk `Patient`, `Observation` (berkode LOINC & HGVS), `DiagnosticReport` (Genomics profile), dan `NutritionOrder` (berkode SNOMED CT).
  * Siap diintegrasikan ke Sistem Informasi Manajemen Rumah Sakit (SIMRS / EHR).

### [Tab 7] Basis Pengetahuan Ilmiah (Knowledge Base)
* Modul referensi ilmiah terkurasi yang mencakup seluruh varian SNP, frekuensi alel risiko, mekanisme biologis, pedoman klinis, dan tautan publikasi ilmiah PubMed (PMID).
* Dilengkapi kotak pencarian instan berdasarkan nama gen, rsID, atau topik klinis.

---

## 6. FAQ & Troubleshooting

**Q: Apakah data genetik pasien aman saat dianalisis di aplikasi ini?**  
*A: Sangat aman. Seluruh algoritma inferensi, pembacaan VCF, dan penyusunan rekomendasi diproses secara lokal langsung di browser pengguna (Client-side / Privacy-by-Design). Tidak ada data genomik yang dikirim ke server pihak ketiga tanpa persetujuan Anda.*

**Q: Bagaimana cara mencetak laporan hasil konsultasi?**  
*A: Anda cukup menekan tombol "Print / PDF" di header aplikasi atau di tab Clinical Documentation. Anda juga dapat memilih opsi "Save as PDF" pada jendela cetak browser.*

**Q: Bagaimana cara berpindah bahasa jika saya ingin kembali ke Bahasa Inggris?**  
*A: Cukup pilih kembali "English (EN)" pada menu dropdown di pojok kanan atas.*

---

*NutriGen-CDS — Memberdayakan Keputusan Klinis Berbasis Bukti Melalui Nutrisi Presisi Terstandarisasi.*
