/**
 * NutriGen-CDS: Internationalization (i18n) Dictionary
 * Supports English ('en') and Bahasa Indonesia ('id')
 */

const I18N = {
  currentLang: localStorage.getItem('nutrigen_lang') || 'en',

  translations: {
    en: {
      // Header & Brand
      appTitle: "NutriGen-",
      appSubtitle: "Clinical Decision Support for Evidence-Based Precision Nutrigenomics",
      selectPatient: "Select Patient Persona:",
      printPdf: "Print / PDF",
      langLabel: "Bahasa:",

      // Navigation Tabs
      tabIntake: "Intake & Ingestion",
      tabLab: "Lab Tracking & Workflow",
      tabRisk: "Metabolic Risk Matrix",
      tabNutrition: "Precision Nutrition Rx",
      tabSafety: "Safety & Depletions",
      tabReports: "Clinical Documentation (SOAP)",
      tabPatientReport: "My Health Report",
      tabFhir: "HL7 FHIR Interoperability",
      tabKb: "Evidence Knowledge Base",

      // Patient Vitals Bar
      vitalAgeGender: "Age / Gender",
      vitalBmi: "BMI",
      vitalBp: "Blood Pressure",
      vitalDiet: "Diet Baseline",
      vitalStatus: "Overall Status",

      // Intake Tab
      genomicIngestionTitle: "Genomic Ingestion Engine",
      dropzoneTitle: "Drag & Drop Genomic File Here",
      dropzoneDesc: "Supports standard .vcf files, 23andMe/Ancestry tab-separated text files, or exported JSON sessions.",
      browseFiles: "Browse Files...",
      analyzedVariantsTitle: "Currently Analyzed Genomic Variants",
      thGene: "Gene",
      thVariant: "Variant",
      thRsid: "rsID",
      thGenotype: "Genotype",
      thImpact: "Functional Impact",
      thEvidence: "Evidence",
      phenotypicBiomarkersTitle: "Phenotypic & Lab Biomarkers",
      phenotypicBiomarkersDesc: "Biomarkers evaluate whether genetic predispositions are actively expressing clinical pathology (e.g. elevated homocysteine with MTHFR, ferritin with HFE).",
      uploadLabTitle: "Upload Lab Results (JSON/CSV)",
      browseLabs: "Browse Labs...",
      thBiomarker: "Biomarker",
      thValue: "Value",
      thReference: "Reference",
      thStatus: "Status",
      noGenomicData: "No genomic data loaded.",

      // Risk Matrix Tab
      radarTitle: "Polygenic Metabolic Domain Profile",
      radarBadge: "Normalized 0-100% Risk",
      radarDesc: "Aggregates genetic variant weights and clinical evidence tiers across 5 major metabolic domains.",
      thPhenotypeImpact: "Phenotypic Impact & Guidance",
      dietaryAction: "Dietary Action:",

      // Nutrition Rx Tab
      macroTitle: "Precision Macronutrient & Caloric Target Distribution",
      macroBadge: "Genotype & Phenotype Adjusted",
      prescribedEnergy: "Prescribed Energy",
      estBmr: "Estimated BMR:",
      carbohydrate: "Carbohydrate",
      proteinTarget: "Protein Target",
      fatCeiling: "Fat & Saturated Ceiling",
      supplementTitle: "Precision Micronutrient & Supplement Formulary",
      supplementBadge: "Targeted Active Forms & Dosages",
      supplementDesc: "Avoids synthetic forms with poor genetic conversion (e.g. synthetic folic acid in MTHFR; carotenoids in BCMO1; plant ALA in FADS1).",
      thNutrientGoal: "Nutrient / Goal",
      thActiveForm: "Prescribed Active Chemical Form",
      thDosageTiming: "Dosage & Timing",
      thMechanismEvidence: "Clinical Mechanism & Evidence",
      thMonitoringProtocol: "Monitoring Protocol",
      foodStrategyTitle: "\"Food-First\" Dietary Protocol",
      foodStrategyBadge: "Tailored Foods",
      foodsToPrioritize: "Foods to Prioritize",
      foodsToAvoid: "Foods to Minimize / Avoid",

      // Safety Tab
      safetyAlertsHeading: "Clinical Safety & Guardrail Alerts",
      noSafetyAlerts: "No active safety contraindications or drug-gene depletions detected for this patient profile.",

      // Reports Tab
      patientCarePlanBtn: "Patient Care Plan View",
      clinicianSoapBtn: "Clinician SOAP View",
      downloadDocx: "Download .docx",
      standaloneView: "Standalone View",
      printSavePdf: "Print / Save PDF",

      // FHIR Tab
      fhirTitle: "HL7 FHIR R4 Clinical Interoperability Export",
      fhirBadge: "GenomicReport & NutritionOrder Bundle",
      fhirDesc: "Standards-compliant FHIR R4 Bundle containing Patient, Observation (genomic variants with HGVS and lab biomarkers with LOINC codes), DiagnosticReport (Genomics Reporting profile), and NutritionOrder (oral diet, macronutrient targets, and dietary supplements with SNOMED CT coding).",

      // Knowledge Base Tab
      kbTitle: "Curated Clinical Nutrigenomics Knowledge Base",
      kbSearchPlaceholder: "Search by gene (e.g. MTHFR, APOE, VDR), rsID, metabolic domain, or clinical topic...",
      thVariantName: "Variant Name",
      thLocus: "Genomic Locus",
      thDomain: "Metabolic Domain",
      thSummaryCitations: "Biological Summary & Citations",

      // Roles & Login
      loginWithBackend: "Login with Backend",
      orWithoutServer: "or without server",
      selectDemoRole: "Select Demo Role:",
      enterDemoMode: "Enter Demo Mode (Offline)",
      rolePhysician: "Physician / Clinician",
      roleLab: "Laboratory User",
      rolePatient: "Patient Portal",
      logout: "Logout",
      demoBadge: "Demo"
    },

    id: {
      // Header & Brand
      appTitle: "NutriGen-",
      appSubtitle: "Sistem Pendukung Keputusan Klinis untuk Nutrigenomik Presisi Berbasis Bukti",
      selectPatient: "Pilih Profil Pasien:",
      printPdf: "Cetak / PDF",
      langLabel: "Bahasa:",

      // Navigation Tabs
      tabIntake: "Penerimaan & Data Genomik",
      tabLab: "Pelacakan Lab & Alur Kerja",
      tabRisk: "Matriks Risiko Metabolik",
      tabNutrition: "Preskripsi Nutrisi Presisi",
      tabSafety: "Keamanan & Interaksi Obat",
      tabReports: "Dokumentasi Klinis (SOAP)",
      tabPatientReport: "Laporan Kesehatan Saya",
      tabFhir: "Interoperabilitas HL7 FHIR",
      tabKb: "Basis Pengetahuan Ilmiah",

      // Patient Vitals Bar
      vitalAgeGender: "Usia / Gender",
      vitalBmi: "IMT (BMI)",
      vitalBp: "Tekanan Darah",
      vitalDiet: "Pola Makan Awal",
      vitalStatus: "Status Risiko Global",

      // Intake Tab
      genomicIngestionTitle: "Mesin Penerimaan Data Genomik",
      dropzoneTitle: "Tarik & Lepas File Genomik di Sini",
      dropzoneDesc: "Mendukung file standar .vcf, file tab-separated 23andMe / AncestryDNA, atau sesi ekspor JSON.",
      browseFiles: "Pilih File...",
      analyzedVariantsTitle: "Varian Genomik yang Sedang Dianalisis",
      thGene: "Gen",
      thVariant: "Varian",
      thRsid: "rsID",
      thGenotype: "Genotipe",
      thImpact: "Dampak Fungsional",
      thEvidence: "Tingkat Bukti",
      phenotypicBiomarkersTitle: "Biomarker Laboratorium & Fenotipe",
      phenotypicBiomarkersDesc: "Biomarker mengevaluasi apakah kerentanan genetik aktif menimbulkan patologi klinis nyata (cth: homosistein tinggi pada MTHFR, ferritin tinggi pada HFE).",
      uploadLabTitle: "Unggah Hasil Lab (JSON/CSV)",
      browseLabs: "Pilih Hasil Lab...",
      thBiomarker: "Biomarker",
      thValue: "Nilai",
      thReference: "Nilai Rujukan",
      thStatus: "Status",
      noGenomicData: "Belum ada data genomik yang dimuat.",

      // Risk Matrix Tab
      radarTitle: "Profil Poligenik Domain Metabolik",
      radarBadge: "Risiko Ternormalisasi 0-100%",
      radarDesc: "Menggabungkan bobot varian genetik dan bukti klinis di 5 domain metabolik utama.",
      thPhenotypeImpact: "Dampak Fenotipe & Tindakan",
      dietaryAction: "Tindakan Diet:",

      // Nutrition Rx Tab
      macroTitle: "Distribusi Target Makronutrien & Kalori Presisi",
      macroBadge: "Disesuaikan Genotipe & Fenotipe",
      prescribedEnergy: "Target Energi Harian",
      estBmr: "Estimasi BMR:",
      carbohydrate: "Karbohidrat",
      proteinTarget: "Target Protein",
      fatCeiling: "Batas Lemak & Lemak Jenuh",
      supplementTitle: "Formularium Mikronutrien & Suplemen Presisi",
      supplementBadge: "Bentuk Aktif & Dosis Terarah",
      supplementDesc: "Menghindari bentuk sintetis dengan konversi genetik buruk (cth: asam folat sintetis pada MTHFR; beta-karoten nabati pada BCMO1; ALA nabati pada FADS1).",
      thNutrientGoal: "Nutrien / Tujuan",
      thActiveForm: "Bentuk Kimiawi Aktif Diresepkan",
      thDosageTiming: "Dosis & Waktu Konsumsi",
      thMechanismEvidence: "Mekanisme Klinis & Bukti",
      thMonitoringProtocol: "Protokol Pemantauan",
      foodStrategyTitle: "Protokol Pola Makan \"Food-First\"",
      foodStrategyBadge: "Pilihan Makanan",
      foodsToPrioritize: "Makanan yang Dianjurkan",
      foodsToAvoid: "Makanan yang Dibatasi / Dihindari",

      // Safety Tab
      safetyAlertsHeading: "Peringatan Keamanan Klinis & Guardrails",
      noSafetyAlerts: "Tidak ditemukan kontraindikasi keamanan aktif atau penipisan nutrisi akibat obat pada profil pasien ini.",

      // Reports Tab
      patientCarePlanBtn: "Tampilan Rencana Pasien",
      clinicianSoapBtn: "Tampilan SOAP Klinisi",
      downloadDocx: "Unduh .docx",
      standaloneView: "Buka Halaman Mandiri",
      printSavePdf: "Cetak / Simpan PDF",

      // FHIR Tab
      fhirTitle: "Ekspor Interoperabilitas Klinis HL7 FHIR R4",
      fhirBadge: "Bundel GenomicReport & NutritionOrder",
      fhirDesc: "Bundel FHIR R4 sesuai standar berisi Patient, Observation (varian genetik HGVS dan biomarker lab berkode LOINC), DiagnosticReport (profil Genomics Reporting), dan NutritionOrder (diet oral, target makronutrien, dan suplemen berkode SNOMED CT).",

      // Knowledge Base Tab
      kbTitle: "Basis Pengetahuan Nutrigenomik Klinis Berbasis Bukti",
      kbSearchPlaceholder: "Cari berdasarkan gen (misal MTHFR, APOE, VDR), rsID, domain metabolik, atau topik klinis...",
      thVariantName: "Nama Varian",
      thLocus: "Lokus Genomik",
      thDomain: "Domain Metabolik",
      thSummaryCitations: "Ringkasan Biologis & Sitasi",

      // Roles & Login
      loginWithBackend: "Masuk dengan Server Backend",
      orWithoutServer: "atau tanpa server",
      selectDemoRole: "Pilih Peran Demo:",
      enterDemoMode: "Masuk Mode Demo (Offline)",
      rolePhysician: "Dokter / Klinisi",
      roleLab: "Pengguna Laboratorium",
      rolePatient: "Portal Pasien",
      logout: "Keluar",
      demoBadge: "Demo"
    }
  },

  t: function(key) {
    const lang = this.translations[this.currentLang] || this.translations.en;
    return lang[key] || this.translations.en[key] || key;
  },

  setLanguage: function(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('nutrigen_lang', lang);
      this.updateDOM();
      if (window.App) {
        if (App.currentPatient) {
          App.renderPatientVitals();
          App.renderIntakeView();
          App.renderRiskMatrixView();
          App.renderNutritionRxView();
          App.renderSafetyView();
          App.renderReportsView();
        }
        App.renderKnowledgeBaseTable();
      }
    }
  },

  updateDOM: function() {
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      if (translation) {
        el.setAttribute('placeholder', translation);
      }
    });

    // Update language select dropdown if present
    const langSelector = document.getElementById('languageSelector');
    if (langSelector) {
      langSelector.value = this.currentLang;
    }
  }
};

