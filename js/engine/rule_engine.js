/**
 * NutriGen-CDS: Clinical Decision Support Rule & Inference Engine
 * Multi-domain scoring, epistasis/gene-gene synergies, personalized macro/micronutrient formulation.
 */

const CDSRuleEngine = {
  /**
   * Run comprehensive clinical decision evaluation on patient profile
   */
  evaluatePatient: function(patient, knowledgeBase = NUTRIGENOMICS_KB) {
    const genotypes = patient.genotypes || {};
    const biomarkers = patient.biomarkers || {};
    const medications = patient.medications || [];
    const supplements = patient.supplements || [];

    // 1. Domain evaluations
    const domainAssessments = this.assessDomains(genotypes, knowledgeBase);

    // 2. Epistasis & multi-gene interaction rules
    const epistasisAlerts = this.evaluateEpistasis(genotypes, patient);

    // 3. Biomarker-Genotype Concordance checks
    const concordanceAlerts = (typeof BiomarkerConcordance !== 'undefined') 
      ? BiomarkerConcordance.evaluate(patient, genotypes) 
      : [];

    // 4. Drug-Gene-Nutrient safety checks
    const safetyAlerts = this.evaluateSafety(patient, genotypes);

    // 5. Precision Macronutrient prescription
    const macronutrientRx = this.calculateMacronutrients(patient, genotypes);

    // 6. Micronutrient & Supplement Formulary
    const supplementFormulary = this.generateSupplementFormulary(patient, genotypes, knowledgeBase, safetyAlerts);

    // 7. Food-first dietary guidelines
    const foodGuidance = this.compileFoodGuidance(genotypes, knowledgeBase);

    // 8. Follow-up biomarker monitoring schedule
    const monitoringSchedule = this.generateMonitoringSchedule(genotypes, biomarkers, knowledgeBase);

    return {
      patientId: patient.id,
      patientName: patient.name,
      timestamp: new Date().toISOString(),
      domainAssessments,
      epistasisAlerts,
      concordanceAlerts,
      safetyAlerts,
      macronutrientRx,
      supplementFormulary,
      foodGuidance,
      monitoringSchedule,
      overallRiskStatus: this.determineOverallRisk(domainAssessments, safetyAlerts, concordanceAlerts)
    };
  },

  /**
   * Assess risk scores and phenotypes for each metabolic domain
   */
  assessDomains: function(genotypes, kb) {
    const domains = {
      "Methylation": { name: "Methylation & 1-Carbon Metabolism", totalScore: 0, maxPossible: 0, snpResults: [] },
      "Cardiometabolic": { name: "Cardiometabolic & Lipid Dynamics", totalScore: 0, maxPossible: 0, snpResults: [] },
      "Micronutrients": { name: "Micronutrient Absorption & Utilization", totalScore: 0, maxPossible: 0, snpResults: [] },
      "Intolerances": { name: "Food Intolerances & Sensitivities", totalScore: 0, maxPossible: 0, snpResults: [] },
      "Detoxification": { name: "Detoxification & Antioxidant Defense", totalScore: 0, maxPossible: 0, snpResults: [] }
    };

    for (const [rsid, kbEntry] of Object.entries(kb)) {
      const domainKey = kbEntry.domain;
      if (!domains[domainKey]) continue;

      const patientCall = genotypes[rsid];
      const gt = patientCall ? patientCall.genotype : null;
      const gtData = (gt && kbEntry.genotypes[gt]) ? kbEntry.genotypes[gt] : null;

      const score = gtData ? gtData.riskScore : 0;
      domains[domainKey].totalScore += score;
      domains[domainKey].maxPossible += 100;

      domains[domainKey].snpResults.push({
        rsid,
        gene: kbEntry.gene,
        variantName: kbEntry.variantName,
        genotype: gt || "Not Genotyped",
        riskLevel: gtData ? gtData.riskLevel : "unknown",
        riskScore: score,
        evidenceTier: kbEntry.evidenceTier,
        phenotype: gtData ? gtData.phenotype : "Variant not tested or inconclusive",
        dietaryGuidance: gtData ? gtData.dietaryGuidance : "",
        supplements: gtData ? gtData.supplements : "",
        foodsToPrioritize: gtData ? gtData.foodsToPrioritize : [],
        foodsToAvoid: gtData ? gtData.foodsToAvoid : []
      });
    }

    // Normalize domain scores to 0-100%
    const normalized = {};
    for (const [key, d] of Object.entries(domains)) {
      const percentage = d.maxPossible > 0 ? Math.round((d.totalScore / d.maxPossible) * 100) : 0;
      let category = "Low / Optimal";
      let badgeClass = "badge-optimal";
      if (percentage >= 65) {
        category = "High Clinical Priority";
        badgeClass = "badge-high";
      } else if (percentage >= 35) {
        category = "Moderate / Elevated";
        badgeClass = "badge-moderate";
      }

      normalized[key] = {
        name: d.name,
        percentageScore: percentage,
        category,
        badgeClass,
        snpResults: d.snpResults
      };
    }

    return normalized;
  },

  /**
   * Evaluate multi-gene epistasis and synergistic genetic interactions
   */
  evaluateEpistasis: function(genotypes, patient) {
    const alerts = [];

    // Interaction 1: MTHFR (677TT) + COMT (Met/Met rs4680 AA)
    const mthfr677 = genotypes["rs1801133"];
    const comt = genotypes["rs4680"];
    if (mthfr677 && mthfr677.genotype === "TT" && comt && comt.genotype === "AA") {
      alerts.push({
        id: "EPI_MTHFR_COMT",
        title: "Synergistic Epistasis: MTHFR 677TT + Slow COMT (Met/Met)",
        severity: "warning",
        category: "Methylation / Neurotransmitter Synergy",
        mechanism: "MTHFR 677TT compromises folate remethylation, while Slow COMT drastically reduces catecholamine degradation rate. Standard high-potency methyl donors (e.g. 1000+ mcg methylfolate or SAMe) can flood the catecholamine pathway, precipitating severe anxiety, irritability, sleep onset latency, or palpitations.",
        clinicalDirective: "Avoid rapid titration of methylated vitamins. Initiate bioavailable folate as folinic acid (calcium folinate) or ultra-low dose L-methylfolate (200 mcg/day) co-administered with Magnesium glycinate (300-400 mg) and Pyridoxal-5-Phosphate (P5P).",
        evidenceTier: "Tier A"
      });
    }

    // Interaction 2: APOE4 + FTO AA + TCF7L2 TT
    const apoe = genotypes["rs429358"];
    const fto = genotypes["rs9939609"];
    const tcf = genotypes["rs7903146"];
    const hasApoe4 = apoe && (apoe.genotype === "CT" || apoe.genotype === "CC");
    const hasFtoRisk = fto && (fto.genotype === "AA" || fto.genotype === "TA");
    const hasTcfRisk = tcf && (tcf.genotype === "CT" || tcf.genotype === "TT");

    if (hasApoe4 && hasFtoRisk && hasTcfRisk) {
      alerts.push({
        id: "EPI_CARDIOMETABOLIC_TRIAD",
        title: "High-Risk Cardiometabolic Triad: APOE4 + FTO + TCF7L2",
        severity: "critical",
        category: "Cardiometabolic & Diabesity Epistasis",
        mechanism: "Patient possesses simultaneous genetic predispositions to saturated-fat-induced atherogenic LDL-P elevation (APOE4), impaired ghrelin postprandial satiety suppression (FTO), and compromised pancreatic beta-cell incretin response (TCF7L2). High saturated fat diets or high refined carb diets are particularly deleterious.",
        clinicalDirective: "Prescribe an strict Mediterranean-Pesco dietary pattern. Keep saturated fatty acids strictly <6% of daily energy; replace with extra virgin olive oil (MUFA) and soluble viscous fiber. Target protein at 25-30% of energy to stimulate satiety peptides while maintaining low glycemic load (<90g net carbs/day).",
        evidenceTier: "Tier A"
      });
    }

    // Interaction 3: FADS1 TT + BCMO1 TT (Plant-Based Conversion Deficiency)
    const fads1 = genotypes["rs174537"];
    const bcmo1 = genotypes["rs12934922"];
    if (fads1 && fads1.genotype === "TT" && bcmo1 && bcmo1.genotype === "TT") {
      alerts.push({
        id: "EPI_VEGAN_CONVERSION_BLOCK",
        title: "Dual Conversion Block: FADS1 TT + BCMO1 TT",
        severity: "warning",
        category: "Essential Micronutrient Activation",
        mechanism: "FADS1 TT causes ~70% reduction in conversion of alpha-linolenic acid (ALA) to EPA/DHA, and BCMO1 TT causes ~57% reduction in conversion of provitamin A carotenoids to active retinol. If patient adheres to a plant-based diet, severe subclinical deficiencies of EPA/DHA and Vitamin A will develop despite abundant plant intake.",
        clinicalDirective: "Mandate direct preformed long-chain EPA + DHA (1500 mg/day from algal oil or fish oil) and preformed Vitamin A (retinyl palmitate 1000 mcg RAE/day). Do not rely on flaxseed or carrots alone.",
        evidenceTier: "Tier B"
      });
    }

    // Interaction 4: HFE (AA/GA) + AGT (CC) (Vascular Stiffening & Iron Toxicity)
    const hfe = genotypes["rs1800562"];
    const agt = genotypes["rs699"];
    if (hfe && (hfe.genotype === "AA" || hfe.genotype === "GA") && agt && agt.genotype === "CC") {
      alerts.push({
        id: "EPI_IRON_VASCULAR_STRAIN",
        title: "Vascular Endothelial Risk: HFE Iron Hyperabsorption + AGT Salt Sensitivity",
        severity: "warning",
        category: "Endothelial & Oxidative Stress Synergy",
        mechanism: "Non-transferrin-bound free iron from HFE mutation catalyzes Fenton reaction hydroxyl radicals, exacerbating endothelial dysfunction in an already salt-sensitive, vasoconstricted arterial system (AGT 235T homozygote).",
        clinicalDirective: "Strict sodium restriction (<1500 mg/day; DASH diet), complete iron supplement avoidance, and antioxidant endothelial protection with magnesium taurate and dietary polyphenols.",
        evidenceTier: "Tier B"
      });
    }

    return alerts;
  },

  /**
   * Evaluate Drug-Gene-Nutrient safety and clinical contraindications
   */
  evaluateSafety: function(patient, genotypes) {
    const alerts = [];
    const db = (typeof DRUG_NUTRIENT_DATABASE !== 'undefined') ? DRUG_NUTRIENT_DATABASE : null;
    if (!db) return alerts;

    // Check medication depletions
    const patientMeds = (patient.medications || []).map(m => m.toLowerCase());
    for (const dep of db.medicationDepletions) {
      const match = dep.medications.some(medName => 
        patientMeds.some(pMed => pMed.includes(medName))
      );
      if (match) {
        alerts.push({
          id: `DEP_${dep.drugClass.replace(/[^a-zA-Z0-9]/g, '_')}`,
          title: `Medication Nutrient Depletion: ${dep.drugClass}`,
          severity: dep.severity,
          type: "Depletion",
          depletedNutrients: dep.depletedNutrients,
          mechanism: dep.mechanism,
          clinicalDirective: dep.clinicalAction,
          geneSynergy: dep.geneSynergy
        });
      }
    }

    // Check contraindications
    for (const contra of db.contraindications) {
      const result = contra.condition(patient, genotypes);
      if (result.triggered) {
        alerts.push({
          id: contra.id,
          title: contra.title,
          severity: contra.severity,
          type: "Contraindication",
          alertText: contra.alertText,
          clinicalDirective: contra.clinicalDirective,
          citations: contra.citations
        });
      }
    }

    return alerts;
  },

  /**
   * Calculate individualized macronutrient targets based on FTO, TCF7L2, APOE, and clinical BMI
   */
  calculateMacronutrients: function(patient, genotypes) {
    const fto = genotypes["rs9939609"];
    const tcf = genotypes["rs7903146"];
    const apoe = genotypes["rs429358"];
    const bmi = patient.bmi || 24;

    // Base targets: 45% Carb, 20% Protein, 35% Fat
    let carbPct = 45;
    let proteinPct = 20;
    let fatPct = 35;
    let satFatCapPct = 7;
    let rationale = [];

    // FTO adjustment (Higher protein suppresses blunted ghrelin)
    if (fto && (fto.genotype === "AA" || fto.genotype === "TA")) {
      proteinPct += 7;
      carbPct -= 7;
      rationale.push("Elevated protein target (1.4-1.6 g/kg) indicated by FTO risk allele to overcome blunted postprandial ghrelin suppression and preserve lean mass.");
    }

    // TCF7L2 adjustment (Lower carb glycemic load protects beta cells)
    if (tcf && (tcf.genotype === "CT" || tcf.genotype === "TT")) {
      carbPct -= 8;
      fatPct += 5;
      proteinPct += 3;
      rationale.push("Restricted carbohydrate target with low glycemic load (<100g net) indicated by TCF7L2 impaired incretin/insulin secretion.");
    }

    // APOE4 adjustment (Strict saturated fat restriction)
    if (apoe && (apoe.genotype === "CT" || apoe.genotype === "CC")) {
      satFatCapPct = 5;
      rationale.push("APOE4 allele carrier requires strict dietary saturated fat ceiling (<5-6% total energy) with substitution for extra virgin olive oil (MUFA) to prevent atherogenic LDL-P elevation.");
    }

    // Ensure sum = 100%
    const total = carbPct + proteinPct + fatPct;
    if (total !== 100) {
      const diff = 100 - total;
      carbPct += diff;
    }

    // Daily calorie baseline calculation (Mifflin-St Jeor estimate)
    const weight = patient.weightKg || 70;
    const height = patient.heightCm || 170;
    const age = patient.age || 40;
    const isMale = patient.gender === "male";
    
    let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (isMale ? 5 : -161);
    let tdee = Math.round(bmr * 1.375); // Light-moderate activity
    let targetCalories = tdee;
    if (bmi >= 27) {
      targetCalories -= 400; // Moderate caloric deficit for weight loss
    }

    return {
      dailyCalories: targetCalories,
      bmr: Math.round(bmr),
      distribution: {
        carbohydrate: { percentage: carbPct, grams: Math.round((targetCalories * (carbPct / 100)) / 4), focus: "Low Glycemic Index, Prebiotic Fiber (>35g/day)" },
        protein: { percentage: proteinPct, grams: Math.round((targetCalories * (proteinPct / 100)) / 4), focus: "Lean Poultry, Wild Fish, Plant Legumes, Collagen" },
        fat: { percentage: fatPct, grams: Math.round((targetCalories * (fatPct / 100)) / 9), focus: "Extra Virgin Olive Oil (MUFA), Avocado, Nuts" },
        saturatedFatCeiling: `${satFatCapPct}% of total daily energy (< ${Math.round((targetCalories * (satFatCapPct / 100)) / 9)}g/day)`
      },
      rationale
    };
  },

  /**
   * Generate prioritized precision micronutrient & supplement formulary
   */
  generateSupplementFormulary: function(patient, genotypes, kb, safetyAlerts) {
    const formulary = [];
    const addedNutrients = new Set();

    // Check HFE contraindication
    const hasHfeRisk = safetyAlerts.some(a => a.id === "CONTRA_HFE_IRON");

    // 1. Methylation: MTHFR
    const mthfr = genotypes["rs1801133"];
    const comt = genotypes["rs4680"];
    const isSlowComt = comt && comt.genotype === "AA";

    if (mthfr && (mthfr.genotype === "TT" || mthfr.genotype === "CT")) {
      const dose = mthfr.genotype === "TT" ? (isSlowComt ? "200-400 mcg" : "800-1000 mcg") : "400-600 mcg";
      const form = isSlowComt 
        ? "Folinic Acid (Calcium Folinate) or Low-Dose L-5-MTHF" 
        : "L-5-Methyltetrahydrofolate (L-5-MTHF / Quatrefolic)";
      
      formulary.push({
        nutrient: "Active Folate",
        form: form,
        dosage: `${dose} daily`,
        timing: "Morning with meal",
        rationale: `Compensates for ~${mthfr.genotype === "TT" ? "65-70%" : "35%"} reduction in MTHFR enzymatic activity to optimize homocysteine clearance.`,
        evidenceTier: "Tier A",
        monitoring: "Serum Homocysteine & RBC Folate at 10-12 weeks"
      });
      addedNutrients.add("Active Folate");

      // B12 synergy
      formulary.push({
        nutrient: "Vitamin B12",
        form: isSlowComt ? "Adenosylcobalamin + Hydroxocobalamin" : "Methylcobalamin (Bioavailable)",
        dosage: "500 - 1000 mcg sublingual daily",
        timing: "Morning with breakfast",
        rationale: "Essential cofactor for methionine synthase (MTR); prevents functional methyl trapping.",
        evidenceTier: "Tier A",
        monitoring: "Serum B12 & Methylmalonic Acid (MMA)"
      });
      addedNutrients.add("Vitamin B12");
    }

    // 2. Vitamin D & VDR
    const vdr = genotypes["rs2228570"];
    const vitDVal = patient.biomarkers && patient.biomarkers.vitaminD ? patient.biomarkers.vitaminD.value : 30;
    if ((vdr && (vdr.genotype === "TT" || vdr.genotype === "CT")) || vitDVal < 30) {
      const dose = (vdr && vdr.genotype === "TT") || vitDVal < 20 ? "4,000 - 5,000 IU" : "2,000 - 3,000 IU";
      formulary.push({
        nutrient: "Vitamin D3 + K2 (MK-7)",
        form: "Cholecalciferol + Menaquinone-7 (all-trans MK-7)",
        dosage: `${dose} D3 + 100-200 mcg K2 MK-7`,
        timing: "With largest fat-containing meal",
        rationale: "Compensates for reduced VDR transcriptional affinity (FokI ff) and elevates circulating 25(OH)D to therapeutic range (50-70 ng/mL). K2 directs calcium to bone matrix.",
        evidenceTier: "Tier A",
        monitoring: "Serum 25(OH)D, Calcium, and PTH at 12 weeks"
      });
      addedNutrients.add("Vitamin D3 + K2");
    }

    // 3. Omega-3 & FADS1 / APOE4
    const fads1 = genotypes["rs174537"];
    const apoe = genotypes["rs429358"];
    if ((fads1 && (fads1.genotype === "TT" || fads1.genotype === "GT")) || (apoe && (apoe.genotype === "CT" || apoe.genotype === "CC"))) {
      const dose = (fads1 && fads1.genotype === "TT") ? "1,500 - 2,000 mg" : "1,000 - 1,500 mg";
      formulary.push({
        nutrient: "Preformed Omega-3 (EPA/DHA)",
        form: "Triglyceride form Fish Oil or High-Concentration Algal Oil (DHA-rich)",
        dosage: `${dose} combined EPA + DHA (min 800mg DHA)`,
        timing: "With dinner meal",
        rationale: "Bypasses delta-5 desaturase genetic conversion bottleneck (FADS1) and provides neurovascular anti-inflammatory protection for APOE4 carriers.",
        evidenceTier: "Tier A",
        monitoring: "RBC Omega-3 Index at 12 weeks"
      });
      addedNutrients.add("Preformed Omega-3");
    }

    // 4. Vitamin A & BCMO1
    const bcmo1 = genotypes["rs12934922"];
    if (bcmo1 && (bcmo1.genotype === "TT" || bcmo1.genotype === "AT")) {
      formulary.push({
        nutrient: "Preformed Vitamin A",
        form: "Retinyl Palmitate (Preformed active Vitamin A)",
        dosage: "750 - 1000 mcg RAE (2,500 - 3,300 IU)",
        timing: "With meal containing healthy fats",
        rationale: "Compensates for impaired central cleavage of plant carotenoids into retinal/retinol (BCMO1 R267S).",
        evidenceTier: "Tier B",
        monitoring: "Annual serum Retinol"
      });
      addedNutrients.add("Preformed Vitamin A");
    }

    // 5. Magnesium (COMT slow, AGT salt sensitive, or PPI use)
    const agt = genotypes["rs699"];
    const isPpiUser = (patient.medications || []).some(m => m.toLowerCase().includes("prazole") || m.toLowerCase().includes("nexium") || m.toLowerCase().includes("prilosec"));
    if (isSlowComt || (agt && (agt.genotype === "CC" || agt.genotype === "TC")) || isPpiUser) {
      formulary.push({
        nutrient: "Magnesium Chelate",
        form: (agt && agt.genotype === "CC") ? "Magnesium Taurate (Cardiovascular focus)" : "Magnesium Bisglycinate (Neuro-relaxant)",
        dosage: "300 - 400 mg elemental magnesium daily",
        timing: "Divided dose or 1 hour prior to sleep",
        rationale: "Essential cofactor for COMT catecholamine clearance, blunts RAAS-mediated vascular vasoconstriction in salt-sensitive genotypes, and compensates for PPI-induced intestinal magnesium wasting.",
        evidenceTier: "Tier A",
        monitoring: "RBC Magnesium / Serum Magnesium"
      });
      addedNutrients.add("Magnesium Chelate");
    }

    // 6. Antioxidants: GSTP1 & SOD2
    const gstp1 = genotypes["rs1695"];
    const sod2 = genotypes["rs4880"];
    if ((gstp1 && gstp1.genotype === "GG") || (sod2 && sod2.genotype === "TT")) {
      formulary.push({
        nutrient: "Glutathione & Mitochondrial Support",
        form: "N-Acetylcysteine (NAC) + Ubiquinol CoQ10",
        dosage: "NAC 600 mg BID + Ubiquinol 100 mg daily",
        timing: "Between meals (NAC) and with morning meal (Ubiquinol)",
        rationale: "Replenishes intracellular glutathione pools for impaired GSTP1 Phase II conjugation and supports mitochondrial electron transport chain in SOD2 Val/Val variants.",
        evidenceTier: "Tier B",
        monitoring: "hs-CRP and Liver Enzymes"
      });
      addedNutrients.add("Glutathione Support");
    }

    // Safety filter: ensure no iron is in formulary if HFE risk
    return formulary.filter(item => {
      if (hasHfeRisk && item.nutrient.toLowerCase().includes("iron")) {
        return false;
      }
      return true;
    });
  },

  /**
   * Compile food-first guidance table
   */
  compileFoodGuidance: function(genotypes, kb) {
    const prioritySet = new Map();
    const avoidSet = new Map();

    for (const [rsid, call] of Object.entries(genotypes)) {
      const kbEntry = kb[rsid];
      if (!kbEntry) continue;
      const gtData = kbEntry.genotypes[call.genotype];
      if (!gtData) continue;

      (gtData.foodsToPrioritize || []).forEach(food => {
        if (!prioritySet.has(food)) {
          prioritySet.set(food, { food, reason: `${kbEntry.gene} (${call.genotype}): ${gtData.phenotype}` });
        }
      });

      (gtData.foodsToAvoid || []).forEach(food => {
        if (!avoidSet.has(food)) {
          avoidSet.set(food, { food, reason: `${kbEntry.gene} (${call.genotype}): ${gtData.phenotype}` });
        }
      });
    }

    return {
      prioritize: Array.from(prioritySet.values()),
      restrictOrAvoid: Array.from(avoidSet.values())
    };
  },

  /**
   * Generate 8-12 week follow-up lab monitoring schedule
   */
  generateMonitoringSchedule: function(genotypes, biomarkers, kb) {
    const schedule = [];

    // Methylation monitoring
    const mthfr = genotypes["rs1801133"];
    if (mthfr && (mthfr.genotype === "TT" || mthfr.genotype === "CT")) {
      schedule.push({
        biomarker: "Plasma Homocysteine & RBC Folate",
        interval: "10 - 12 Weeks",
        targetGoal: "< 8.0 - 9.0 µmol/L",
        clinicalRationale: "Verify therapeutic efficacy of active L-5-MTHF / folinic acid supplementation in down-regulating vascular endothelial stress."
      });
    }

    // Vitamin D monitoring
    const vdr = genotypes["rs2228570"];
    if (vdr || (biomarkers.vitaminD && biomarkers.vitaminD.value < 30)) {
      schedule.push({
        biomarker: "Serum 25-Hydroxyvitamin D [25(OH)D] & Serum Calcium",
        interval: "12 Weeks",
        targetGoal: "50 - 70 ng/mL (125 - 175 nmol/L)",
        clinicalRationale: "Ensure target circulating 25(OH)D sufficiency while screening for hypercalcemia during high-dose D3 + K2 therapy."
      });
    }

    // Lipid & APOE monitoring
    const apoe = genotypes["rs429358"];
    if (apoe && (apoe.genotype === "CT" || apoe.genotype === "CC")) {
      schedule.push({
        biomarker: "Advanced Lipid Panel (ApoB, LDL-P, LDL-C, Triglycerides)",
        interval: "8 - 10 Weeks",
        targetGoal: "ApoB < 70-80 mg/dL, LDL-C < 90 mg/dL",
        clinicalRationale: "Confirm that dietary saturated fat restriction has reversed the atherogenic particle elevation characteristic of the APOE4 phenotype."
      });
    }

    // Iron & HFE monitoring
    const hfe = genotypes["rs1800562"];
    if (hfe && (hfe.genotype === "AA" || hfe.genotype === "GA")) {
      schedule.push({
        biomarker: "Serum Ferritin & Transferrin Saturation (%)",
        interval: "12 Weeks (or immediate if >300 ng/mL)",
        targetGoal: "Ferritin 50 - 150 ng/mL; Transferrin Saturation < 45%",
        clinicalRationale: "Monitor progressive iron storage accumulation; determine requirement for therapeutic phlebotomy referral."
      });
    }

    // Glycemic & TCF7L2 monitoring
    const tcf = genotypes["rs7903146"];
    if (tcf && (tcf.genotype === "CT" || tcf.genotype === "TT")) {
      schedule.push({
        biomarker: "Fasting Insulin, Fasting Glucose, & HbA1c",
        interval: "12 Weeks",
        targetGoal: "HbA1c < 5.4%, HOMA-IR < 1.5",
        clinicalRationale: "Evaluate beta-cell glycemic stability and insulin sensitivity on low glycemic load dietary prescription."
      });
    }

    return schedule;
  },

  determineOverallRisk: function(domainAssessments, safetyAlerts, concordanceAlerts) {
    if (safetyAlerts.some(a => a.severity === "critical") || concordanceAlerts.some(a => a.priority === "URGENT")) {
      return { level: "CRITICAL ACTION REQUIRED", class: "risk-critical" };
    }
    const highDomains = Object.values(domainAssessments).filter(d => d.percentageScore >= 65).length;
    if (highDomains >= 2) {
      return { level: "HIGH CLINICAL PRIORITY", class: "risk-high" };
    }
    if (highDomains >= 1 || Object.values(domainAssessments).some(d => d.percentageScore >= 40)) {
      return { level: "MODERATE ATTENTION", class: "risk-moderate" };
    }
    return { level: "OPTIMAL / LOW RISK", class: "risk-optimal" };
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CDSRuleEngine };
} else if (typeof window !== 'undefined') {
  window.CDSRuleEngine = CDSRuleEngine;
}
