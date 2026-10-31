/**
 * NutriGen-CDS Backend: CDS Rule Engine (Server-Side)
 * Ported dari js/engine/rule_engine.js untuk dijalankan di Node.js.
 * Bertanggung jawab mengevaluasi genotype + biomarker -> menghasilkan rekomendasi klinis.
 */

const DOMAIN_MAP = {
  methylation:    { name: '🔬 Methylation & One-Carbon Cycle', rsids: ['rs1801133', 'rs1801131', 'rs1805087'] },
  inflammation:   { name: '🔥 Inflammatory & Omega Balance', rsids: ['rs174537', 'rs3197999', 'rs2227564'] },
  fatabolism:     { name: '🫀 Fat Metabolism & Cardiovascular', rsids: ['rs429358', 'rs7412', 'rs1800562'] },
  glucoseMetab:   { name: '🍬 Glucose Metabolism & Insulin', rsids: ['rs7903146', 'rs5219', 'rs13266634'] },
  vitaminMetab:   { name: '☀️ Vitamin Metabolism', rsids: ['rs2228570', 'rs12785878', 'rs1544410'] }
};

const RISK_WEIGHT = { high: 50, moderate: 25, low: 10 };

/**
 * Evaluasi pasien berdasarkan genotypes dan biomarkers.
 * @param {object} patient - Data pasien { genotypes, biomarkers, weight, height, age, gender }
 * @param {object} knowledgeBase - NUTRIGENOMICS_KB
 */
function evaluatePatient(patient, knowledgeBase) {
  const genotypes = patient.genotypes || {};
  const biomarkers = patient.biomarkers || {};
  const domainAssessments = {};
  const supplementFormulary = [];
  const concordanceAlerts = [];
  const safetyAlerts = [];

  // --- DOMAIN RISK SCORING ---
  for (const [domainKey, domain] of Object.entries(DOMAIN_MAP)) {
    const snpResults = [];
    let rawScore = 0;

    for (const rsid of domain.rsids) {
      const kbEntry = knowledgeBase[rsid];
      const patientGT = genotypes[rsid];
      if (!kbEntry || !patientGT) continue;

      const genotypeData = kbEntry.genotypes?.[patientGT.genotype];
      if (!genotypeData) continue;

      const riskLevel = genotypeData.riskLevel || 'low';
      rawScore += RISK_WEIGHT[riskLevel] || 0;

      snpResults.push({
        rsid,
        gene: kbEntry.gene,
        genotype: patientGT.genotype,
        phenotype: genotypeData.phenotype || 'No effect',
        riskLevel,
        evidenceTier: kbEntry.evidenceTier,
        dietaryGuidance: genotypeData.dietaryGuidance || null
      });
    }

    const maxPossibleScore = domain.rsids.length * RISK_WEIGHT.high;
    const percentageScore = maxPossibleScore > 0 ? Math.min(Math.round((rawScore / maxPossibleScore) * 100), 100) : 0;

    let category, badgeClass;
    if (percentageScore >= 70) { category = 'High Risk'; badgeClass = 'badge-high'; }
    else if (percentageScore >= 40) { category = 'Moderate Risk'; badgeClass = 'badge-moderate'; }
    else { category = 'Optimal'; badgeClass = 'badge-optimal'; }

    domainAssessments[domainKey] = { name: domain.name, percentageScore, category, badgeClass, snpResults };
  }

  // --- CONCORDANCE: Biomarker vs Genotype ---
  const mthfr = genotypes['rs1801133'];
  if (mthfr && biomarkers.homocysteine) {
    const hcy = biomarkers.homocysteine.value;
    const risk = mthfr.genotype === 'TT' || mthfr.genotype === 'CT';
    if (risk && hcy >= 15) {
      concordanceAlerts.push({
        id: 'CONC_MTHFR_HCY_SEVERE',
        priority: 'URGENT',
        title: 'Hiperhomosisteinemia Aktif Concordant dengan Defek MTHFR',
        biomarker: `Homocysteine plasma: ${hcy} µmol/L (Target: < 9.0)`,
        genotype: `MTHFR ${mthfr.genotype}`,
        clinicalSignificance: 'Kadar homocysteine yang sangat tinggi dengan MTHFR risk merusak endotel vaskular.',
        actionDirective: 'Berikan L-5-MTHF 1000mcg/hari + Methyl-B12 1000mcg. Ulangi tes dalam 8-10 minggu.'
      });
    } else if (risk && hcy >= 10) {
      concordanceAlerts.push({
        id: 'CONC_MTHFR_HCY_MILD',
        priority: 'HIGH',
        title: 'Clearance Metilasi Suboptimal: Homocysteine Meningkat',
        biomarker: `Homocysteine: ${hcy} µmol/L`,
        genotype: `MTHFR ${mthfr.genotype}`,
        clinicalSignificance: 'Asupan folat tidak cukup untuk mengatasi reduksi enzimatik MTHFR.',
        actionDirective: 'Resepkan L-5-MTHF 600-800 mcg/hari. Tingkatkan folat dan kolin dari makanan.'
      });
    }
  }

  const vdr = genotypes['rs2228570'];
  if (vdr && biomarkers.vitaminD) {
    const vitD = biomarkers.vitaminD.value;
    const risk = vdr.genotype === 'TT' || vdr.genotype === 'CT';
    if (risk && vitD < 25) {
      concordanceAlerts.push({
        id: 'CONC_VDR_VITD_DEFICIENT',
        priority: 'HIGH',
        title: 'Defisiensi Vitamin D & Resistensi Reseptor VDR',
        biomarker: `25(OH)D: ${vitD} ng/mL (Target: 50-70)`,
        genotype: `VDR FokI ${vdr.genotype}`,
        clinicalSignificance: 'Level rendah + reseptor VDR hypo-responsif = penyerapan kalsium sangat terganggu.',
        actionDirective: 'Vitamin D3 5000 IU/hari + K2 (MK-7) 200mcg + Magnesium glisinasi 300mg.'
      });
    }
  }

  const apoe = genotypes['rs429358'];
  if (apoe && biomarkers.ldlCholesterol) {
    const ldl = biomarkers.ldlCholesterol.value;
    const risk = apoe.genotype === 'CT' || apoe.genotype === 'CC';
    if (risk && ldl >= 140) {
      concordanceAlerts.push({
        id: 'CONC_APOE4_LDL',
        priority: 'HIGH',
        title: 'Dislipidemia Aterogenik pada Carrier APOE4',
        biomarker: `LDL-C: ${ldl} mg/dL`,
        genotype: `APOE ${apoe.genotype} (E4 Carrier)`,
        clinicalSignificance: 'APOE4 carrier sangat sensitif terhadap lemak jenuh, mendorong LDL tinggi.',
        actionDirective: 'Batasi saturated fat < 6% kalori. Tambahkan 2g/hari EPA/DHA dari minyak ikan.'
      });
    }
  }

  // --- SUPPLEMENT FORMULARY ---
  if (mthfr && (mthfr.genotype === 'TT' || mthfr.genotype === 'CT')) {
    supplementFormulary.push({
      nutrient: 'Folat Aktif (5-MTHF)',
      form: 'L-5-Methyltetrahydrofolate (Quatrefolic®)',
      dosage: '800–1000 mcg/hari',
      timing: 'Pagi hari bersama makan',
      rationale: 'Melewati blokade enzimatik MTHFR C677T langsung ke metabolit aktif.',
      evidenceTier: 'Tier A'
    });
  }
  if (vdr && (vdr.genotype === 'TT' || vdr.genotype === 'CT')) {
    supplementFormulary.push({
      nutrient: 'Vitamin D3',
      form: 'Cholecalciferol + K2 MK-7',
      dosage: '3000–5000 IU/hari',
      timing: 'Bersama makanan berlemak',
      rationale: 'Mengatasi penurunan efisiensi transkripsi reseptor VDR FokI.',
      evidenceTier: 'Tier A'
    });
  }

  // --- MACRONUTRIENT PRESCRIPTION ---
  const weight = patient.weight || 75;
  const age = patient.age || 40;
  const isMale = patient.gender === 'male';
  const bmr = isMale
    ? Math.round(88.362 + (13.397 * weight) + (4.799 * (patient.height || 175)) - (5.677 * age))
    : Math.round(447.593 + (9.247 * weight) + (3.098 * (patient.height || 165)) - (4.330 * age));
  const dailyCalories = Math.round(bmr * 1.4);

  const macronutrientRx = {
    bmr,
    dailyCalories,
    distribution: {
      carbohydrate: { grams: Math.round((dailyCalories * 0.35) / 4), percentage: 35, focus: 'Low-GI, serat tinggi' },
      protein: { grams: Math.round((dailyCalories * 0.30) / 4), percentage: 30, focus: 'Ikan, unggas, legum' },
      fat: { grams: Math.round((dailyCalories * 0.35) / 9), percentage: 35, focus: 'EVOO, Alpukat, Omega-3' },
      saturatedFatCeiling: `Max ${Math.round((dailyCalories * 0.06) / 9)}g lemak jenuh/hari`
    }
  };

  const overallScore = Object.values(domainAssessments).reduce((sum, d) => sum + d.percentageScore, 0) /
    Object.keys(domainAssessments).length;
  let overallRiskStatus;
  if (overallScore >= 65) overallRiskStatus = { level: 'High Risk', class: 'risk-high' };
  else if (overallScore >= 35) overallRiskStatus = { level: 'Moderate Risk', class: 'risk-moderate' };
  else overallRiskStatus = { level: 'Optimal', class: 'risk-optimal' };

  return {
    patientId: patient.id,
    generatedAt: new Date().toISOString(),
    overallRiskStatus,
    domainAssessments,
    concordanceAlerts,
    safetyAlerts,
    supplementFormulary,
    macronutrientRx
  };
}

module.exports = { evaluatePatient };
