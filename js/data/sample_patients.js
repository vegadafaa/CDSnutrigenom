/**
 * NutriGen-CDS: Sample Patient Clinical Personas
 * Realistic test cases validating multi-domain CDS rules, biomarker concordance, and drug interactions.
 */

const SAMPLE_PATIENTS = [
  {
    id: "PT-10492",
    name: "Arthur Pendelton",
    age: 54,
    gender: "male",
    heightCm: 178,
    weightKg: 89,
    bmi: 28.1,
    bloodPressure: "138/88",
    dietPattern: "Omnivore / Western",
    dailyCaffeineCups: 4,
    dailyAlcoholDrinks: 1,
    symptoms: ["Fatigue", "Postprandial lethargy", "Mild memory fog"],
    primaryGoals: ["Cardiovascular prevention", "Weight management", "Optimize energy"],
    medications: ["Metformin 1000mg BID", "Atorvastatin 20mg daily"],
    supplements: ["Centrum Men Multivitamin"],
    biomarkers: {
      homocysteine: { value: 17.8, unit: "µmol/L", reference: "< 10.0", status: "elevated" },
      vitaminD: { value: 22.4, unit: "ng/mL", reference: "30 - 80", status: "insufficient" },
      ferritin: { value: 142, unit: "ng/mL", reference: "30 - 300", status: "normal" },
      fastingGlucose: { value: 112, unit: "mg/dL", reference: "70 - 99", status: "elevated" },
      hba1c: { value: 6.1, unit: "%", reference: "< 5.7", status: "elevated" },
      totalCholesterol: { value: 228, unit: "mg/dL", reference: "< 200", status: "elevated" },
      ldlCholesterol: { value: 148, unit: "mg/dL", reference: "< 100", status: "elevated" },
      hdlCholesterol: { value: 42, unit: "mg/dL", reference: "> 40", status: "normal" },
      triglycerides: { value: 195, unit: "mg/dL", reference: "< 150", status: "elevated" },
      hsCrp: { value: 2.8, unit: "mg/L", reference: "< 1.0", status: "elevated" }
    },
    genotypes: {
      "rs1801133": { rsid: "rs1801133", gene: "MTHFR", genotype: "TT", variantName: "C677T" },
      "rs1801131": { rsid: "rs1801131", gene: "MTHFR", genotype: "AA", variantName: "A1298C" },
      "rs4680": { rsid: "rs4680", gene: "COMT", genotype: "GG", variantName: "Val158Met (Val/Val)" },
      "rs429358": { rsid: "rs429358", gene: "APOE", genotype: "CT", variantName: "Cys112Arg (E3/E4 carrier)" },
      "rs9939609": { rsid: "rs9939609", gene: "FTO", genotype: "AA", variantName: "intron 1" },
      "rs7903146": { rsid: "rs7903146", gene: "TCF7L2", genotype: "CT", variantName: "intron 3" },
      "rs2228570": { rsid: "rs2228570", gene: "VDR", genotype: "TT", variantName: "FokI (ff)" },
      "rs1800562": { rsid: "rs1800562", gene: "HFE", genotype: "GG", variantName: "C282Y (Normal)" },
      "rs174537": { rsid: "rs174537", gene: "FADS1", genotype: "GT", variantName: "intron 1" },
      "rs12934922": { rsid: "rs12934922", gene: "BCMO1", genotype: "AA", variantName: "R267S" },
      "rs4988235": { rsid: "rs4988235", gene: "MCM6 / LCT", genotype: "CT", variantName: "-13910 C>T" },
      "rs762551": { rsid: "rs762551", gene: "CYP1A2", genotype: "AC", variantName: "*1F (Slow)" },
      "rs671": { rsid: "rs671", gene: "ALDH2", genotype: "GG", variantName: "Glu504Lys (Active)" },
      "rs699": { rsid: "rs699", gene: "AGT", genotype: "TC", variantName: "M235T" },
      "rs1695": { rsid: "rs1695", gene: "GSTP1", genotype: "AG", variantName: "Ile105Val" },
      "rs4880": { rsid: "rs4880", gene: "SOD2", genotype: "TT", variantName: "Ala16Val (Val/Val)" }
    }
  },

  {
    id: "PT-20831",
    name: "Elena Rostova",
    age: 38,
    gender: "female",
    heightCm: 165,
    weightKg: 58,
    bmi: 21.3,
    bloodPressure: "116/74",
    dietPattern: "Mediterranean / High Dairy",
    dailyCaffeineCups: 3,
    dailyAlcoholDrinks: 1,
    symptoms: ["Severe abdominal bloating", "Episodic palpitations", "Anxiety", "Insomnia"],
    primaryGoals: ["Resolve gut distress", "Improve sleep", "Manage anxiety naturally"],
    medications: ["Omeprazole 20mg daily (for GERD)", "Ethinyl Estradiol oral contraceptive"],
    supplements: ["SAM-e 400mg daily", "Vitamin B-Complex"],
    biomarkers: {
      homocysteine: { value: 8.2, unit: "µmol/L", reference: "< 10.0", status: "normal" },
      vitaminD: { value: 27.1, unit: "ng/mL", reference: "30 - 80", status: "insufficient" },
      ferritin: { value: 22, unit: "ng/mL", reference: "15 - 150", status: "low-normal" },
      fastingGlucose: { value: 88, unit: "mg/dL", reference: "70 - 99", status: "normal" },
      hba1c: { value: 5.2, unit: "%", reference: "< 5.7", status: "normal" },
      totalCholesterol: { value: 185, unit: "mg/dL", reference: "< 200", status: "normal" },
      ldlCholesterol: { value: 104, unit: "mg/dL", reference: "< 100", status: "borderline" },
      hdlCholesterol: { value: 58, unit: "mg/dL", reference: "> 50", status: "normal" },
      triglycerides: { value: 110, unit: "mg/dL", reference: "< 150", status: "normal" },
      hsCrp: { value: 1.1, unit: "mg/L", reference: "< 1.0", status: "borderline" }
    },
    genotypes: {
      "rs1801133": { rsid: "rs1801133", gene: "MTHFR", genotype: "CC", variantName: "C677T" },
      "rs1801131": { rsid: "rs1801131", gene: "MTHFR", genotype: "AC", variantName: "A1298C" },
      "rs4680": { rsid: "rs4680", gene: "COMT", genotype: "AA", variantName: "Val158Met (Met/Met - Slow)" },
      "rs429358": { rsid: "rs429358", gene: "APOE", genotype: "TT", variantName: "Cys112Arg (E3/E3)" },
      "rs9939609": { rsid: "rs9939609", gene: "FTO", genotype: "TT", variantName: "intron 1" },
      "rs7903146": { rsid: "rs7903146", gene: "TCF7L2", genotype: "CC", variantName: "intron 3" },
      "rs2228570": { rsid: "rs2228570", gene: "VDR", genotype: "CT", variantName: "FokI" },
      "rs1800562": { rsid: "rs1800562", gene: "HFE", genotype: "GG", variantName: "C282Y" },
      "rs174537": { rsid: "rs174537", gene: "FADS1", genotype: "GG", variantName: "intron 1" },
      "rs12934922": { rsid: "rs12934922", gene: "BCMO1", genotype: "AA", variantName: "R267S" },
      "rs4988235": { rsid: "rs4988235", gene: "MCM6 / LCT", genotype: "CC", variantName: "-13910 C>T (Non-persistent)" },
      "rs762551": { rsid: "rs762551", gene: "CYP1A2", genotype: "CC", variantName: "*1F (Slow)" },
      "rs671": { rsid: "rs671", gene: "ALDH2", genotype: "GA", variantName: "Glu504Lys (Flush Risk)" },
      "rs699": { rsid: "rs699", gene: "AGT", genotype: "TT", variantName: "M235T" },
      "rs1695": { rsid: "rs1695", gene: "GSTP1", genotype: "AA", variantName: "Ile105Val" },
      "rs4880": { rsid: "rs4880", gene: "SOD2", genotype: "TC", variantName: "Ala16Val" }
    }
  },

  {
    id: "PT-31054",
    name: "Marcus Vance",
    age: 49,
    gender: "male",
    heightCm: 182,
    weightKg: 85,
    bmi: 25.7,
    bloodPressure: "148/94",
    dietPattern: "High Protein / Red Meat Heavy",
    dailyCaffeineCups: 2,
    dailyAlcoholDrinks: 2,
    symptoms: ["Joint arthralgia (hands/knees)", "Hypertension", "Skin hyperpigmentation"],
    primaryGoals: ["Lower blood pressure", "Joint relief", "Cardiovascular longevity"],
    medications: ["Lisinopril 10mg daily"],
    supplements: ["Iron Energy Complex (with 25mg Iron & 500mg Vitamin C)"],
    biomarkers: {
      homocysteine: { value: 9.4, unit: "µmol/L", reference: "< 10.0", status: "normal" },
      vitaminD: { value: 34.0, unit: "ng/mL", reference: "30 - 80", status: "normal" },
      ferritin: { value: 620, unit: "ng/mL", reference: "30 - 300", status: "severely elevated" },
      fastingGlucose: { value: 96, unit: "mg/dL", reference: "70 - 99", status: "normal" },
      hba1c: { value: 5.4, unit: "%", reference: "< 5.7", status: "normal" },
      totalCholesterol: { value: 195, unit: "mg/dL", reference: "< 200", status: "normal" },
      ldlCholesterol: { value: 118, unit: "mg/dL", reference: "< 100", status: "borderline" },
      hdlCholesterol: { value: 46, unit: "mg/dL", reference: "> 40", status: "normal" },
      triglycerides: { value: 155, unit: "mg/dL", reference: "< 150", status: "borderline" },
      hsCrp: { value: 3.4, unit: "mg/L", reference: "< 1.0", status: "elevated" }
    },
    genotypes: {
      "rs1801133": { rsid: "rs1801133", gene: "MTHFR", genotype: "CC", variantName: "C677T" },
      "rs1801131": { rsid: "rs1801131", gene: "MTHFR", genotype: "AA", variantName: "A1298C" },
      "rs4680": { rsid: "rs4680", gene: "COMT", genotype: "AG", variantName: "Val158Met" },
      "rs429358": { rsid: "rs429358", gene: "APOE", genotype: "TT", variantName: "Cys112Arg (E3/E3)" },
      "rs9939609": { rsid: "rs9939609", gene: "FTO", genotype: "TA", variantName: "intron 1" },
      "rs7903146": { rsid: "rs7903146", gene: "TCF7L2", genotype: "CC", variantName: "intron 3" },
      "rs2228570": { rsid: "rs2228570", gene: "VDR", genotype: "CC", variantName: "FokI" },
      "rs1800562": { rsid: "rs1800562", gene: "HFE", genotype: "AA", variantName: "C282Y (Homozygous Risk)" },
      "rs174537": { rsid: "rs174537", gene: "FADS1", genotype: "GG", variantName: "intron 1" },
      "rs12934922": { rsid: "rs12934922", gene: "BCMO1", genotype: "AA", variantName: "R267S" },
      "rs4988235": { rsid: "rs4988235", gene: "MCM6 / LCT", genotype: "TT", variantName: "-13910 C>T" },
      "rs762551": { rsid: "rs762551", gene: "CYP1A2", genotype: "AA", variantName: "*1F (Fast)" },
      "rs671": { rsid: "rs671", gene: "ALDH2", genotype: "GG", variantName: "Glu504Lys" },
      "rs699": { rsid: "rs699", gene: "AGT", genotype: "CC", variantName: "M235T (Salt Sensitive)" },
      "rs1695": { rsid: "rs1695", gene: "GSTP1", genotype: "GG", variantName: "Ile105Val (Val/Val)" },
      "rs4880": { rsid: "rs4880", gene: "SOD2", genotype: "TT", variantName: "Ala16Val (Val/Val)" }
    }
  },

  {
    id: "PT-42190",
    name: "Sarah Jenkins",
    age: 29,
    gender: "female",
    heightCm: 170,
    weightKg: 59,
    bmi: 20.4,
    bloodPressure: "108/68",
    dietPattern: "Strict Vegan (4 years)",
    dailyCaffeineCups: 1,
    dailyAlcoholDrinks: 0,
    symptoms: ["Dry eyes and xerosis", "Prolonged delayed onset muscle soreness", "Recurrent viral infections"],
    primaryGoals: ["Athletic recovery", "Support vegan health", "Immune optimization"],
    medications: [],
    supplements: ["Vegan Multivitamin (without preformed A or EPA/DHA)"],
    biomarkers: {
      homocysteine: { value: 11.2, unit: "µmol/L", reference: "< 10.0", status: "mildly elevated" },
      vitaminD: { value: 18.5, unit: "ng/mL", reference: "30 - 80", status: "deficient" },
      ferritin: { value: 18, unit: "ng/mL", reference: "15 - 150", status: "low-normal" },
      fastingGlucose: { value: 84, unit: "mg/dL", reference: "70 - 99", status: "normal" },
      hba1c: { value: 4.9, unit: "%", reference: "< 5.7", status: "normal" },
      totalCholesterol: { value: 142, unit: "mg/dL", reference: "< 200", status: "low" },
      ldlCholesterol: { value: 72, unit: "mg/dL", reference: "< 100", status: "optimal" },
      hdlCholesterol: { value: 52, unit: "mg/dL", reference: "> 50", status: "normal" },
      triglycerides: { value: 88, unit: "mg/dL", reference: "< 150", status: "optimal" },
      hsCrp: { value: 0.6, unit: "mg/L", reference: "< 1.0", status: "optimal" }
    },
    genotypes: {
      "rs1801133": { rsid: "rs1801133", gene: "MTHFR", genotype: "CT", variantName: "C677T" },
      "rs1801131": { rsid: "rs1801131", gene: "MTHFR", genotype: "AA", variantName: "A1298C" },
      "rs4680": { rsid: "rs4680", gene: "COMT", genotype: "GG", variantName: "Val158Met (Fast)" },
      "rs429358": { rsid: "rs429358", gene: "APOE", genotype: "TT", variantName: "Cys112Arg (E3/E3)" },
      "rs9939609": { rsid: "rs9939609", gene: "FTO", genotype: "TT", variantName: "intron 1" },
      "rs7903146": { rsid: "rs7903146", gene: "TCF7L2", genotype: "CC", variantName: "intron 3" },
      "rs2228570": { rsid: "rs2228570", gene: "VDR", genotype: "TT", variantName: "FokI (ff)" },
      "rs1800562": { rsid: "rs1800562", gene: "HFE", genotype: "GG", variantName: "C282Y" },
      "rs174537": { rsid: "rs174537", gene: "FADS1", genotype: "TT", variantName: "intron 1 (Impaired Desaturase)" },
      "rs12934922": { rsid: "rs12934922", gene: "BCMO1", genotype: "TT", variantName: "R267S (Impaired Retinol Cleavage)" },
      "rs4988235": { rsid: "rs4988235", gene: "MCM6 / LCT", genotype: "CT", variantName: "-13910 C>T" },
      "rs762551": { rsid: "rs762551", gene: "CYP1A2", genotype: "AA", variantName: "*1F (Fast)" },
      "rs671": { rsid: "rs671", gene: "ALDH2", genotype: "GG", variantName: "Glu504Lys" },
      "rs699": { rsid: "rs699", gene: "AGT", genotype: "TT", variantName: "M235T" },
      "rs1695": { rsid: "rs1695", gene: "GSTP1", genotype: "AG", variantName: "Ile105Val" },
      "rs4880": { rsid: "rs4880", gene: "SOD2", genotype: "TC", variantName: "Ala16Val" }
    }
  }
];

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SAMPLE_PATIENTS };
} else if (typeof window !== 'undefined') {
  window.SAMPLE_PATIENTS = SAMPLE_PATIENTS;
}
