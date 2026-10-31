/**
 * NutriGen-CDS: Drug-Gene-Nutrient Interactions & Depletions Database
 * Clinical safety rules, nutrient depletion alerts, and contraindications.
 */

const DRUG_NUTRIENT_DATABASE = {
  // ==========================================
  // 1. MEDICATION-INDUCED NUTRIENT DEPLETIONS
  // ==========================================
  medicationDepletions: [
    {
      drugClass: "Metformin (Biguanides)",
      medications: ["metformin", "glucophage", "fortamet"],
      depletedNutrients: ["Vitamin B12", "CoQ10"],
      mechanism: "Antagonizes calcium-dependent ileal membrane binding of intrinsic factor-B12 complex. Long-term use (>2-3 years) induces clinical B12 deficiency in 10-30% of patients.",
      clinicalAction: "Mandatory annual serum B12 and methylmalonic acid (MMA) screening. Prescribe oral Vitamin B12 (1000 mcg/day methylcobalamin or sublingual form) and ensure adequate dietary calcium.",
      severity: "high",
      relevanceGene: "MTHFR",
      geneSynergy: "If MTHFR C677T (TT) or A1298C is present, B12 depletion accelerates hyperhomocysteinemia and peripheral neuropathy."
    },
    {
      drugClass: "HMG-CoA Reductase Inhibitors (Statins)",
      medications: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lipitor", "crestor"],
      depletedNutrients: ["Coenzyme Q10 (Ubiquinone)", "Vitamin D"],
      mechanism: "Inhibits HMG-CoA reductase upstream of mevalonate, depleting both cholesterol and downstream endogenous CoQ10 synthesis in skeletal and cardiac muscle.",
      clinicalAction: "Co-prescribe CoQ10 (Ubiquinol 100-200 mg/day) to prevent statin-associated muscle symptoms (SAMS) and mitochondrial myopathy.",
      severity: "moderate",
      relevanceGene: "APOE",
      geneSynergy: "APOE4 carriers taking statins frequently exhibit higher myopathy incidence and benefit markedly from targeted CoQ10 support."
    },
    {
      drugClass: "Proton Pump Inhibitors (PPIs)",
      medications: ["omeprazole", "pantoprazole", "esomeprazole", "lansoprazole", "prilosec", "nexium"],
      depletedNutrients: ["Magnesium", "Vitamin B12", "Calcium", "Iron", "Zinc"],
      mechanism: "Hypochlorhydria impairs ionization and proteolytic cleavage of B12 and minerals from dietary protein matrices. Disrupts TRPM6 intestinal magnesium transporters.",
      clinicalAction: "Supplement Magnesium glycinate (200-300 mg/day) and bioavailable sublingual B12. Monitor serum magnesium and ferritin.",
      severity: "high",
      relevanceGene: "VDR",
      geneSynergy: "Patients with VDR (FokI/BsmI) variants taking PPIs have synergistic degradation of intestinal calcium absorption and accelerated bone loss."
    },
    {
      drugClass: "Oral Anticoagulants (Vitamin K Antagonists)",
      medications: ["warfarin", "coumadin", "jantoven"],
      depletedNutrients: ["Vitamin K (Functional antagonism)"],
      mechanism: "Inhibits VKORC1, preventing regeneration of Vitamin K hydroquinone required for gamma-glutamyl carboxylation of clotting factors II, VII, IX, X and osteocalcin.",
      clinicalAction: "CRITICAL: Maintain consistent day-to-day dietary Vitamin K intake. Strictly avoid episodic binge eating of high-K greens or abrupt initiation of Vitamin K supplements without INR monitoring.",
      severity: "critical",
      relevanceGene: "VDR",
      geneSynergy: "Interferes with bone matrix protein carboxylation. Requires stable dietary planning."
    },
    {
      drugClass: "Oral Contraceptives / HRT",
      medications: ["ethinyl estradiol", "oral contraceptives", "birth control", "estrogen"],
      depletedNutrients: ["Vitamin B6 (P5P)", "Folate", "Vitamin B12", "Magnesium", "Zinc"],
      mechanism: "Estrogen enhances tryptophan catabolism via pyrrolase enzyme, exhausting Vitamin B6 cofactors. Alters folate-binding proteins.",
      clinicalAction: "Recommend active B-complex (P-5-P 25 mg, L-5-MTHF 400 mcg, Methyl-B12) and Magnesium.",
      severity: "moderate",
      relevanceGene: "COMT",
      geneSynergy: "In Slow COMT (Met/Met) genotypes, estrogen clearance is reduced, intensifying mood lability and B6 requirements."
    },
    {
      drugClass: "Loop & Thiazide Diuretics",
      medications: ["furosemide", "lasix", "hydrochlorothiazide", "hctz", "chlorthalidone"],
      depletedNutrients: ["Potassium", "Magnesium", "Zinc", "Thiamine (B1)"],
      mechanism: "Inhibits tubular reabsorption of electrolytes in Henle's loop and distal convoluted tubule, driving excessive urinary excretion.",
      clinicalAction: "Regular electrolyte monitoring. Supplement Potassium and Magnesium taurate/glycinate (200-400 mg/day). Ensure Thiamine repletion in cardiac patients.",
      severity: "high",
      relevanceGene: "AGT",
      geneSynergy: "In AGT salt-sensitive genotypes, diuretic-induced potassium/magnesium wasting exacerbates arterial vasoconstriction."
    }
  ],

  // ==========================================
  // 2. CLINICAL CONTRAINDICATIONS & SAFETY ALERTS
  // ==========================================
  contraindications: [
    {
      id: "CONTRA_HFE_IRON",
      title: "CRITICAL CONTRAINDICATION: Supplemental Iron in HFE Carrier/Homozygote",
      severity: "critical",
      condition: (patient, genotypes) => {
        const hfe = genotypes["rs1800562"]; // HFE C282Y
        const hasRisk = hfe && (hfe.genotype === "AA" || hfe.genotype === "GA");
        const takingIron = (patient.supplements || []).some(s => s.toLowerCase().includes("iron") || s.toLowerCase().includes("ferrous"));
        return { triggered: hasRisk && takingIron, hasRisk, takingIron };
      },
      alertText: "Patient carries the HFE C282Y risk allele predisposing to iron overload/hemochromatosis, yet is reported taking iron supplements.",
      clinicalDirective: "ABSOLUTELY DISCONTINUE ALL SUPPLEMENTAL IRON AND MULTIVITAMINS WITH IRON. Intestinal hepcidin regulation is compromised, risking toxic parenchymal iron deposition in liver, heart, and pancreas.",
      citations: "EASL Guidelines on Hemochromatosis (PMID: 20621644)"
    },
    {
      id: "ALERT_WARFARIN_VIT_K",
      title: "SAFETY ALERT: Vitamin K Supplementation with Warfarin Therapy",
      severity: "critical",
      condition: (patient) => {
        const meds = (patient.medications || []).map(m => m.toLowerCase());
        const hasWarfarin = meds.some(m => m.includes("warfarin") || m.includes("coumadin"));
        const sups = (patient.supplements || []).map(s => s.toLowerCase());
        const hasVitK = sups.some(s => s.includes("vitamin k") || s.includes("k2") || s.includes("mk-7"));
        return { triggered: hasWarfarin && hasVitK, hasWarfarin, hasVitK };
      },
      alertText: "Concurrent prescription of Warfarin and high-dose Vitamin K / K2 supplementation detected.",
      clinicalDirective: "Vitamin K directly antagonizes warfarin mechanism of action, precipitating sub-therapeutic INR and acute thrombotic risk. Discontinue unmonitored Vitamin K supplements immediately; maintain strictly consistent dietary intake.",
      citations: "Chest Antithrombotic Therapy Guidelines"
    },
    {
      id: "ALERT_COMT_METHYLFOLATE",
      title: "CLINICAL CAUTION: High-Dose Methyl Donors in Slow COMT (Met/Met)",
      severity: "warning",
      condition: (patient, genotypes) => {
        const comt = genotypes["rs4680"]; // COMT Val158Met
        const isSlowComt = comt && comt.genotype === "AA";
        const sups = (patient.supplements || []).map(s => s.toLowerCase());
        const takingHighMethyl = sups.some(s => 
          s.includes("same") || 
          s.includes("s-adenosyl") || 
          s.includes("high methylfolate") || 
          s.includes("deplin")
        );
        return { triggered: isSlowComt && takingHighMethyl, isSlowComt, takingHighMethyl };
      },
      alertText: "Patient has Slow COMT (Met/Met) genotype and is receiving high-potency methyl-donor supplements (SAMe or high-dose methylfolate).",
      clinicalDirective: "Slow COMT metabolizes catecholamines 3-4x slower. Flooding the methylation pathway with high methyl donors can elevate catecholamines, triggering severe anxiety, agitation, tachycardia, or sleep fragmentation. Switch to unmethylated folinic acid (calcium folinate) or start methylfolate at ultra-low dose (100-200 mcg) titrated under observation.",
      citations: "PMID: 17008817, PMID: 15729272"
    },
    {
      id: "ALERT_CYP1A2_CAFFEINE",
      title: "CARDIOVASCULAR WARNING: High Caffeine Intake in CYP1A2 Slow Metabolizer",
      severity: "warning",
      condition: (patient, genotypes) => {
        const cyp = genotypes["rs762551"];
        const isSlow = cyp && (cyp.genotype === "CC" || cyp.genotype === "AC");
        const highCaffeine = patient.dailyCaffeineCups >= 3 || (patient.dailyCaffeineMg || 0) >= 300;
        return { triggered: isSlow && highCaffeine, isSlow, highCaffeine };
      },
      alertText: "Patient is a slow caffeine metabolizer (CYP1A2*1F carrier) consuming >=3 cups of coffee/day (>300 mg caffeine).",
      clinicalDirective: "In slow metabolizers, prolonged half-life of caffeine increases circulating catecholamines and vasoconstriction, tripling the risk of hypertension and doubling myocardial infarction risk. Recommend tapering caffeine to <100-150 mg/day or switching to decaffeinated/herbal alternatives.",
      citations: "JAMA 2006 (PMID: 16522833)"
    }
  ]
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DRUG_NUTRIENT_DATABASE };
} else if (typeof window !== 'undefined') {
  window.DRUG_NUTRIENT_DATABASE = DRUG_NUTRIENT_DATABASE;
}
