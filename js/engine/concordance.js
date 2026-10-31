/**
 * NutriGen-CDS: Biomarker-Genotype Concordance Engine
 * Evaluates real-time patient lab values against genetic predispositions.
 */

const BiomarkerConcordance = {
  /**
   * Evaluate biomarker concordance against patient genotypes
   */
  evaluate: function(patient, genotypes) {
    const alerts = [];
    const labs = patient.biomarkers || {};

    // 1. MTHFR + Homocysteine
    const mthfr = genotypes["rs1801133"];
    if (mthfr && labs.homocysteine) {
      const hcy = labs.homocysteine.value;
      const isMthfrRisk = mthfr.genotype === "TT" || mthfr.genotype === "CT";

      if (isMthfrRisk && hcy >= 15.0) {
        alerts.push({
          id: "CONC_MTHFR_HCY_SEVERE",
          priority: "URGENT",
          title: "Phenotypic Hyperhomocysteinemia Concordant with MTHFR Defect",
          biomarker: `Plasma Homocysteine: ${hcy} µmol/L (Severely elevated; Target < 9.0)`,
          genotype: `MTHFR ${mthfr.genotype} (${mthfr.variantName})`,
          concordanceStatus: "Active Pathologic Expression",
          clinicalSignificance: "Elevated plasma homocysteine directly damages vascular endothelial cells, promotes LDL oxidation, and inhibits nitric oxide synthase. Genetic MTHFR impairment is driving active metabolic failure of remethylation.",
          actionDirective: "Initiate therapeutic bioavailable L-5-MTHF (1000 mcg/day) co-administered with Methyl-B12 (1000 mcg) and P-5-P (50 mg). Re-test homocysteine in 8-10 weeks."
        });
      } else if (isMthfrRisk && hcy >= 10.0) {
        alerts.push({
          id: "CONC_MTHFR_HCY_MILD",
          priority: "HIGH",
          title: "Suboptimal Methylation Clearance: Elevated Homocysteine",
          biomarker: `Plasma Homocysteine: ${hcy} µmol/L (Suboptimal; Target < 9.0)`,
          genotype: `MTHFR ${mthfr.genotype}`,
          concordanceStatus: "Active Expression",
          clinicalSignificance: "Mild elevation indicates that dietary folate intake is insufficient to overcome the genetic enzymatic reduction of MTHFR.",
          actionDirective: "Prescribe active L-5-MTHF (600-800 mcg/day) and increase dietary folate/choline intake."
        });
      } else if (isMthfrRisk && hcy < 10.0) {
        alerts.push({
          id: "CONC_MTHFR_HCY_COMPENSATED",
          priority: "INFO",
          title: "Genotypic MTHFR Risk Compensated (Normal Homocysteine)",
          biomarker: `Plasma Homocysteine: ${hcy} µmol/L (Optimal)`,
          genotype: `MTHFR ${mthfr.genotype}`,
          concordanceStatus: "Compensated / Low Current Expression",
          clinicalSignificance: "Despite genetic vulnerability, current dietary habits, gut microbiota synthesis, or hepatic choline/betaine pathways are successfully maintaining normal homocysteine clearance.",
          actionDirective: "Maintain current nutrient support; avoid sudden shifts to high synthetic folic acid intake."
        });
      }
    }

    // 2. HFE + Serum Ferritin
    const hfe = genotypes["rs1800562"];
    if (hfe && labs.ferritin) {
      const ferritin = labs.ferritin.value;
      const isHfeRisk = hfe.genotype === "AA" || hfe.genotype === "GA";

      if (isHfeRisk && ferritin >= 500) {
        alerts.push({
          id: "CONC_HFE_FERRITIN_CRITICAL",
          priority: "URGENT",
          title: "CRITICAL: Severe Phenotypic Iron Overload in HFE Genotype",
          biomarker: `Serum Ferritin: ${ferritin} ng/mL (Severely elevated; Reference 30-300)`,
          genotype: `HFE C282Y ${hfe.genotype}`,
          concordanceStatus: "Active Overt Hemochromatosis",
          clinicalSignificance: "Profound iron overload with saturation of hepatic and reticuloendothelial storage capacity. High imminent risk of cirrhosis, cardiomyopathy, arthritis, and diabetes (bronze diabetes).",
          actionDirective: "URGENT MEDICAL ACTION: Immediate referral to Hematology for therapeutic phlebotomy protocol. Cease ALL supplemental iron, avoid vitamin C with meals, and eliminate raw seafood."
        });
      } else if (isHfeRisk && ferritin >= 300) {
        alerts.push({
          id: "CONC_HFE_FERRITIN_MODERATE",
          priority: "HIGH",
          title: "Emerging Iron Overload in HFE Carrier/Homozygote",
          biomarker: `Serum Ferritin: ${ferritin} ng/mL (Elevated)`,
          genotype: `HFE C282Y ${hfe.genotype}`,
          concordanceStatus: "Progressive Iron Accumulation",
          clinicalSignificance: "Iron stores are exceeding physiological thresholds due to impaired hepcidin-mediated intestinal downregulation.",
          actionDirective: "Order Transferrin Saturation (%) and Liver Function Panel. Discontinue all supplemental iron; restrict dietary red meat."
        });
      }
    }

    // 3. VDR + Serum 25(OH)D
    const vdr = genotypes["rs2228570"];
    if (vdr && labs.vitaminD) {
      const vitD = labs.vitaminD.value;
      const isVdrRisk = vdr.genotype === "TT" || vdr.genotype === "CT";

      if (isVdrRisk && vitD < 25) {
        alerts.push({
          id: "CONC_VDR_VITD_DEFICIENT",
          priority: "HIGH",
          title: "Compounded Vitamin D Deficiency & Receptor Resistance",
          biomarker: `Serum 25(OH)D: ${vitD} ng/mL (Deficient; Optimal 50-70)`,
          genotype: `VDR FokI ${vdr.genotype} (Reduced receptor transcriptional efficiency)`,
          concordanceStatus: "Dual Ligand-Receptor Deficit",
          clinicalSignificance: "Having low circulating vitamin D combined with a hypo-responsive VDR receptor severely dampens intestinal calcium absorption and immune gene modulation.",
          actionDirective: "Prescribe high-dose Vitamin D3 (5,000 IU/day) paired with Vitamin K2 (MK-7 100-200 mcg) and Magnesium glycinate (300 mg). Target serum 25(OH)D of 50-70 ng/mL."
        });
      }
    }

    // 4. APOE4 + Lipid Profile (LDL-C / Triglycerides)
    const apoe = genotypes["rs429358"];
    if (apoe && labs.ldlCholesterol) {
      const ldl = labs.ldlCholesterol.value;
      const isApoe4 = apoe.genotype === "CT" || apoe.genotype === "CC";

      if (isApoe4 && ldl >= 140) {
        alerts.push({
          id: "CONC_APOE4_LDL_ELEVATED",
          priority: "HIGH",
          title: "Atherogenic Dyslipidemia in APOE4 Carrier",
          biomarker: `LDL-C: ${ldl} mg/dL (Elevated)`,
          genotype: `APOE ${apoe.genotype} (E4 Carrier)`,
          concordanceStatus: "Active Atherogenic Expression",
          clinicalSignificance: "APOE4 carriers down-regulate LDL receptors rapidly in response to dietary saturated fats. This phenotypic elevation indicates high circulating atherogenic particle count.",
          actionDirective: "Implement strict restriction of saturated fatty acids (<6% of calories). Replace butter/coconut/lard with extra virgin olive oil and avocado. Add 2g/day marine Omega-3 EPA/DHA."
        });
      }
    }

    // 5. TCF7L2 + Fasting Glucose / HbA1c
    const tcf = genotypes["rs7903146"];
    if (tcf && (labs.fastingGlucose || labs.hba1c)) {
      const glu = labs.fastingGlucose ? labs.fastingGlucose.value : null;
      const a1c = labs.hba1c ? labs.hba1c.value : null;
      const isTcfRisk = tcf.genotype === "CT" || tcf.genotype === "TT";

      if (isTcfRisk && ((glu && glu >= 105) || (a1c && a1c >= 5.8))) {
        alerts.push({
          id: "CONC_TCF7L2_GLUCOSE_IMPAIRED",
          priority: "HIGH",
          title: "Impaired Glucose Homeostasis Concordant with TCF7L2 Risk",
          biomarker: `Fasting Glucose: ${glu || "N/A"} mg/dL | HbA1c: ${a1c || "N/A"}%`,
          genotype: `TCF7L2 ${tcf.genotype}`,
          concordanceStatus: "Pre-diabetic / Dysglycemic Expression",
          clinicalSignificance: "Genetic blunting of incretin-stimulated insulin release is actively manifesting as impaired glycemic regulation.",
          actionDirective: "Prescribe low-glycemic Mediterranean dietary protocol (<90g net carbs/d). Add Myo-Inositol (2g/d) and Magnesium (400 mg/d)."
        });
      }
    }

    return alerts;
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BiomarkerConcordance };
} else if (typeof window !== 'undefined') {
  window.BiomarkerConcordance = BiomarkerConcordance;
}
