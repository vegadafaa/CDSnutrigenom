# Materi Presentasi PowerPoint: NutriGen-CDS

## Slide 1: Judul Presentasi
* **Judul**: NutriGen-CDS: Clinical Decision Support for Evidence-Based Nutrigenomics
* **Sub-judul**: Integrasi Varian Genetik (SNPs) & Biomarker Laboratorium Menuju Nutrisi Presisi Terstandarisasi HL7 FHIR
* **Presenter/Tim**: Tim Pengembang Clinical Decision Support System (CDSS)
* **Konteks**: Sistem Pendukung Keputusan Klinis untuk Kedokteran Metabolik dan Nutrisi Presisi

---

## Slide 2: Latar Belakang & Urgensi (Background)
* **Tantangan Nutrisi Konvensional**: Pendekatan *"one-size-fits-all"* sering kali tidak efektif atau bahkan berisiko bagi pasien dengan predisposisi genetik tertentu.
* **Kompleksitas Data Genomik**: Hasil tes DNA (23andMe, VCF) menghasilkan ratusan ribu varian yang sulit diinterpretasikan secara langsung oleh dokter/ahli gizi tanpa alat bantu klinis.
* **Kebutuhan Biomarker-Genotype Concordance**: Adanya varian genetik tidak selalu berarti penyakit aktif. Perlu sinkronisasi antara kerentanan genetik dengan biomarker lab terkini (fenotipe aktual).
* **Solusi**: NutriGen-CDS hadir sebagai jembatan cerdas antara data genomik, lab darah, dan panduan klinis berbasis bukti (*evidence-based guidelines*).

---

## Slide 3: Tujuan Proyek (Project Objectives)
1. **Menerjemahkan Varian Genetik Kompleks**: Mengonversi varian genetik (SNPs) ke dalam rekomendasi nutrisi presisi dan formulasi suplemen terapeutik.
2. **Keamanan Pasien (Clinical Safety & Guardrails)**: Mencegah toksisitas dan kontraindikasi kritis (seperti kelebihan zat besi pada *HFE C282Y* atau interaksi *Warfarin - Vitamin K*).
3. **Mendeteksi Interaksi Gen-Gen (Synergistic Epistasis)**: Mengidentifikasi interaksi multi-gen (misal *MTHFR + COMT* atau *APOE4 + FTO + TCF7L2*) yang memerlukan pendekatan nutrisi terpadu.
4. **Menghubungkan Genotipe dan Fenotipe**: Evaluasi konkordansi antara risiko genetik dan hasil lab aktif (misal *MTHFR 677TT* + Homosistein tinggi).
5. **Interoperabilitas Standar Rumah Sakit**: Menghasilkan data terstruktur sesuai standar rekam medis elektronik global (**HL7 FHIR R4**).

---

## Slide 4: Arsitektur & Domain Analisis Sistem
* **Domain 1: Methylation & 1-Carbon Metabolism**
  * Gen: `MTHFR` (C677T, A1298C), `COMT` (Val158Met).
  * Fokus: Remetilasi homosistein, neurotransmiter, aktif L-5-MTHF vs asam folat sintetis.
* **Domain 2: Cardiometabolic & Lipid Dynamics**
  * Gen: `APOE` (E2/E3/E4), `FTO`, `TCF7L2`.
  * Fokus: Sensitivitas lemak jenuh, regulasi ghrelin/rasa kenyang, sensitivitas insulin.
* **Domain 3: Micronutrient Homeostasis & Transport**
  * Gen: `VDR` (Vitamin D), `HFE` (Zat Besi), `FADS1` (Omega-3), `BCMO1` (Beta-karoten).
* **Domain 4: Food Intolerances & Metabolic Sensitivities**
  * Gen: `LCT/MCM6` (Laktosa), `CYP1A2` (Kafein), `ALDH2` (Alkohol/Acetaldehyde), `AGT` (Sensitivitas Garam).
* **Domain 5: Detoxification & Antioxidant Defense**
  * Gen: `GSTP1` (Glutathione Fase II), `SOD2` (Superoxide Dismutase).

---

## Slide 5: Alur Kerja & Mesin Inferensi (Workflow)
1. **Input Data**:
   * File Genomik: VCF v4.2, raw data 23andMe, atau profil JSON.
   * Biomarker Lab: Homosistein, Ferritin, 25(OH)D, LDL-C, Glukosa Puasa, dll.
   * Riwayat Obat: Metformin, Statin, PPI, Warfarin.
2. **Rule Engine & CDS Processing**:
   * Parsing genomik & validasi HGVS / rsID.
   * Deteksi penipisan nutrisi akibat obat (*drug-nutrient depletion tracker*).
   * Evaluasi konkordansi biomarker-genotipe & analisis risiko epistasis.
3. **Generasi Rekomendasi**:
   * Pola diet makronutrien (karbohidrat, protein, lemak, ambang batas lemak jenuh).
   * Formulasi suplemen presisi dengan dosis terapeutik dan bentuk bioaktif.

---

## Slide 6: Output Aplikasi (Application Outputs)
Aplikasi NutriGen-CDS menghasilkan output komprehensif bagi berbagai pemangku kepentingan:
* **1. Interactive Clinical Dashboard**:
  * Visualisasi *Metabolic Domain Radar Chart* (SVG).
  * Kartu skor risiko domain (Low, Moderate, High Risk).
  * Banner peringatan klinis kritis (*High-Priority Clinical Alerts*).
* **2. Clinician SOAP Note**:
  * Ringkasan terstruktur untuk dokter: *Subjective, Objective, Assessment, Plan*.
  * Justifikasi ilmiah lengkap dengan referensi pedoman nutrisi.
* **3. Personalized Patient Care Plan**:
  * Panduan bahasa ramah pasien: makanan yang dianjurkan vs dihindari.
  * Jadwal suplementasi harian presisi (pagi, siang, malam).
* **4. Standard HL7 FHIR R4 Bundle**:
  * `Patient`, `Observation` (SNPs HGVS & Lab LOINC-coded).
  * `DiagnosticReport` (Profil Genomics Reporting).
  * `NutritionOrder` (Perintah diet & suplemen berkode SNOMED CT).

---

## Slide 7: Contoh Kasus Klinis (Clinical Case Study)
* **Pasien Contoh**: Arthur Pendelton (52 tahun, Pria)
* **Temuan Genomik & Lab**:
  * `MTHFR 677TT` (Homosigot) + Homosistein: **18.2 µmol/L** (Tinggi &rarr; *Active Pathologic Hyperhomocysteinemia*).
  * `COMT Val158Met` (Met/Met - Slow): Metabolisme katekolamin lambat.
  * `APOE4` Carrier: Peningkatan risiko aterosklerosis terhadap lemak jenuh.
  * Terapi Rutin: *Metformin* 1000mg (menghambat absorpsi B12).
* **Intervensi NutriGen-CDS**:
  * Peringatan: Hindari asam folat sintetis, titrasi L-5-MTHF bertahap + Magnesium.
  * Terapi B12 aktif (Methylcobalamin) untuk mengatasi deplesi metformin.
  * Diet Mediterania Rendah Lemak Jenuh (<6% total kalori).

---

## Slide 8: Keunggulan & Diferensiasi Sistem
* **Zero External Dependencies**: Berjalan langsung di browser web modern secara aman dan cepat tanpa instalasi rumit.
* **Privacy-by-Design (Client-side Analysis)**: Data genomik pasien tidak harus dikirim ke server pihak ketiga yang tidak terverifikasi.
* **Dua Mode Eksekusi**: Dashboard GUI interaktif untuk klinisi & Standalone Python CLI (`cds_engine.py`) untuk analisis batch/pipeline riset.
* **Siap Integrasi SIMRS / EHR**: Format HL7 FHIR R4 memungkinkan integrasi instan ke sistem informasi rumah sakit modern.

---

## Slide 9: Kesimpulan & Rencana Pengembangan
* **Kesimpulan**: NutriGen-CDS berhasil membuktikan bahwa data genomik dan biomarker lab dapat diintegrasikan secara presisi, aman, dan terstandarisasi untuk mendukung keputusan klinis nutrisi.
* **Rencana Mendatang**:
  * Integrasi Polygenic Risk Scores (PRS) untuk penyakit kardiometabolik.
  * Koneksi API FHIR langsung ke Hospital Information System (HIS).
  * Dukungan varian farmakogenomik tambahan untuk interaksi obat-nutrisi yang lebih luas.

