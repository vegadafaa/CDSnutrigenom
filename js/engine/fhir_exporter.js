/**
 * NutriGen-CDS: HL7 FHIR Interoperability Exporter
 * Generates standards-compliant FHIR R4 Bundle containing:
 *  - Patient
 *  - DiagnosticReport (GenomicReport profile)
 *  - Observation (Genomics & Clinical Biomarkers with LOINC)
 *  - NutritionOrder (Precision Macro Targets & Supplement Formulary)
 */

const FHIRExporter = {
  /**
   * Export complete evaluation as FHIR R4 JSON Bundle
   * @param {object} patient - Patient clinical profile
   * @param {object} evaluation - CDSRuleEngine evaluation result
   * @returns {object} HL7 FHIR R4 Bundle
   */
  exportToFHIRBundle: function(patient, evaluation) {
    const timestamp = new Date().toISOString();
    const patientRef = `Patient/${patient.id}`;

    const bundle = {
      resourceType: "Bundle",
      id: `bundle-nutrigen-${patient.id}-${Date.now()}`,
      type: "collection",
      timestamp: timestamp,
      meta: {
        profile: [
          "http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/genomics-reporting-bundle"
        ]
      },
      entry: []
    };

    // 1. Patient Resource
    const patientResource = {
      resourceType: "Patient",
      id: patient.id,
      identifier: [
        {
          use: "usual",
          type: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0203", code: "MR", display: "Medical Record Number" }] },
          value: patient.id
        }
      ],
      active: true,
      name: [{ use: "official", text: patient.name }],
      gender: patient.gender || "unknown",
      extension: [
        { url: "http://hl7.org/fhir/StructureDefinition/patient-bmi", valueDecimal: patient.bmi || 24.0 },
        { url: "http://hl7.org/fhir/StructureDefinition/patient-dietary-pattern", valueString: patient.dietPattern || "Standard" }
      ]
    };
    bundle.entry.push({ fullUrl: `urn:uuid:${patient.id}`, resource: patientResource });

    const observationRefs = [];

    // 2. Observations: Genomic Variants
    for (const [rsid, call] of Object.entries(patient.genotypes || {})) {
      const obsId = `obs-snp-${rsid}-${patient.id}`;
      const obsResource = {
        resourceType: "Observation",
        id: obsId,
        status: "final",
        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/observation-category",
                code: "laboratory",
                display: "Laboratory"
              }
            ]
          }
        ],
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "69548-6",
              display: "Genetic variant assessment"
            }
          ],
          text: `Nutrigenomic SNP: ${call.gene} (${rsid})`
        },
        subject: { reference: patientRef, display: patient.name },
        effectiveDateTime: timestamp,
        component: [
          {
            code: {
              coding: [{ system: "http://loinc.org", code: "48018-6", display: "Gene studied [ID]" }]
            },
            valueCodeableConcept: {
              coding: [{ system: "http://www.genenames.org", code: call.gene, display: call.gene }],
              text: call.gene
            }
          },
          {
            code: {
              coding: [{ system: "http://loinc.org", code: "81258-6", display: "Associated phenotype" }]
            },
            valueString: call.variantName || rsid
          },
          {
            code: {
              coding: [{ system: "http://loinc.org", code: "53034-5", display: "Allelic state" }]
            },
            valueCodeableConcept: {
              text: call.genotype
            }
          },
          {
            code: {
              coding: [{ system: "http://loinc.org", code: "48005-3", display: "Amino acid change (pHGVS)" }]
            },
            valueString: rsid
          }
        ]
      };

      bundle.entry.push({ fullUrl: `urn:uuid:${obsId}`, resource: obsResource });
      observationRefs.push({ reference: `Observation/${obsId}`, display: `${call.gene} (${call.genotype})` });
    }

    // 3. Observations: Clinical Biomarkers with LOINC codes
    const loincMap = {
      homocysteine: { code: "13965-9", display: "Homocysteine [Moles/volume] in Serum or Plasma", unit: "umol/L" },
      vitaminD: { code: "62292-8", display: "25-Hydroxyvitamin D3 + 25-Hydroxyvitamin D2 [Mass/volume] in Serum or Plasma", unit: "ng/mL" },
      ferritin: { code: "2276-4", display: "Ferritin [Mass/volume] in Serum or Plasma", unit: "ng/mL" },
      fastingGlucose: { code: "1558-6", display: "Fasting Glucose [Mass/volume] in Serum or Plasma", unit: "mg/dL" },
      hba1c: { code: "4548-4", display: "Hemoglobin A1c/Hemoglobin.total in Blood", unit: "%" },
      totalCholesterol: { code: "2093-3", display: "Cholesterol [Mass/volume] in Serum or Plasma", unit: "mg/dL" },
      ldlCholesterol: { code: "2089-1", display: "Cholesterol in LDL [Mass/volume] in Serum or Plasma", unit: "mg/dL" },
      hdlCholesterol: { code: "2085-9", display: "Cholesterol in HDL [Mass/volume] in Serum or Plasma", unit: "mg/dL" },
      triglycerides: { code: "2571-8", display: "Triglyceride [Mass/volume] in Serum or Plasma", unit: "mg/dL" },
      hsCrp: { code: "30522-7", display: "C reactive protein [Mass/volume] in Serum or Plasma by High sensitivity method", unit: "mg/L" }
    };

    for (const [key, lab] of Object.entries(patient.biomarkers || {})) {
      const mapping = loincMap[key];
      if (!mapping) continue;

      const obsId = `obs-lab-${key}-${patient.id}`;
      const obsResource = {
        resourceType: "Observation",
        id: obsId,
        status: "final",
        category: [
          {
            coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "laboratory" }]
          }
        ],
        code: {
          coding: [{ system: "http://loinc.org", code: mapping.code, display: mapping.display }],
          text: mapping.display
        },
        subject: { reference: patientRef, display: patient.name },
        effectiveDateTime: timestamp,
        valueQuantity: {
          value: lab.value,
          unit: lab.unit,
          system: "http://unitsofmeasure.org",
          code: mapping.unit
        },
        interpretation: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                code: lab.status && lab.status.includes("elevated") ? "H" : (lab.status && lab.status.includes("deficient") ? "L" : "N"),
                display: lab.status || "Normal"
              }
            ]
          }
        ]
      };

      bundle.entry.push({ fullUrl: `urn:uuid:${obsId}`, resource: obsResource });
      observationRefs.push({ reference: `Observation/${obsId}`, display: `${key}: ${lab.value} ${lab.unit}` });
    }

    // 4. DiagnosticReport: GenomicReport Profile
    const reportId = `report-genomic-${patient.id}`;
    const diagnosticReport = {
      resourceType: "DiagnosticReport",
      id: reportId,
      meta: {
        profile: [
          "http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/genomics-report"
        ]
      },
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0074",
              code: "GE",
              display: "Genetics"
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "81247-9",
            display: "Master HL7 genetic variant reporting panel"
          }
        ],
        text: "NutriGen-CDS Comprehensive Clinical Nutrigenomic Evaluation"
      },
      subject: { reference: patientRef, display: patient.name },
      effectiveDateTime: timestamp,
      issued: timestamp,
      result: observationRefs,
      conclusion: `Clinical Nutrigenomic Assessment: Overall Risk Status: ${evaluation.overallRiskStatus.level}. Evaluated across 5 metabolic domains with personalized gene-nutrient recommendations.`,
      presentedForm: [
        {
          contentType: "application/json",
          title: "NutriGen-CDS Full Clinical Evaluation Payload"
        }
      ]
    };
    bundle.entry.push({ fullUrl: `urn:uuid:${reportId}`, resource: diagnosticReport });

    // 5. NutritionOrder Resource
    const nutritionOrderId = `nutrition-order-${patient.id}`;
    const macro = evaluation.macronutrientRx || {};
    const supplements = evaluation.supplementFormulary || [];
    const foodGuidance = evaluation.foodGuidance || { prioritize: [], restrictOrAvoid: [] };

    const nutritionOrder = {
      resourceType: "NutritionOrder",
      id: nutritionOrderId,
      status: "active",
      intent: "order",
      patient: { reference: patientRef, display: patient.name },
      dateTime: timestamp,
      orderer: {
        display: "NutriGen-CDS Precision Nutrition Clinical Engine"
      },
      oralDiet: {
        type: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "435671000124103",
                display: "Nutrigenomic personalized diet"
              }
            ],
            text: "Genetically Personalized Precision Nutrition Care Plan"
          }
        ],
        schedule: {
          timing: [{ code: { text: "Daily structured meals" } }]
        },
        nutrient: [
          {
            modifier: {
              coding: [{ system: "http://snomed.info/sct", code: "702786008", display: "Energy" }]
            },
            amount: {
              value: macro.dailyCalories || 2000,
              unit: "kcal/day",
              system: "http://unitsofmeasure.org",
              code: "kcal/d"
            }
          },
          {
            modifier: {
              coding: [{ system: "http://snomed.info/sct", code: "226355009", display: "Carbohydrate" }]
            },
            amount: {
              value: macro.distribution && macro.distribution.carbohydrate ? macro.distribution.carbohydrate.grams : 225,
              unit: "grams/day",
              system: "http://unitsofmeasure.org",
              code: "g/d"
            }
          },
          {
            modifier: {
              coding: [{ system: "http://snomed.info/sct", code: "226369009", display: "Protein" }]
            },
            amount: {
              value: macro.distribution && macro.distribution.protein ? macro.distribution.protein.grams : 100,
              unit: "grams/day",
              system: "http://unitsofmeasure.org",
              code: "g/d"
            }
          },
          {
            modifier: {
              coding: [{ system: "http://snomed.info/sct", code: "226388009", display: "Fat" }]
            },
            amount: {
              value: macro.distribution && macro.distribution.fat ? macro.distribution.fat.grams : 70,
              unit: "grams/day",
              system: "http://unitsofmeasure.org",
              code: "g/d"
            }
          }
        ],
        instruction: `Daily Targets: Calories: ${macro.dailyCalories} kcal. Saturated Fat Ceiling: ${macro.distribution ? macro.distribution.saturatedFatCeiling : "Strict"}. Priority Foods: ${foodGuidance.prioritize.slice(0, 5).map(f => f.food).join(", ")}. Foods to Restrict: ${foodGuidance.restrictOrAvoid.slice(0, 5).map(f => f.food).join(", ")}.`
      },
      supplement: supplements.map((sup, idx) => ({
        type: {
          coding: [{ system: "http://snomed.info/sct", code: "373444002", display: "Dietary supplement" }],
          text: sup.nutrient
        },
        productName: `${sup.form} (${sup.dosage})`,
        schedule: {
          timing: [{ code: { text: sup.timing } }]
        },
        quantity: {
          value: parseFloat(sup.dosage) || 1,
          unit: sup.dosage
        },
        instruction: `${sup.rationale} [Evidence Tier: ${sup.evidenceTier}; Monitoring: ${sup.monitoring}]`
      }))
    };
    bundle.entry.push({ fullUrl: `urn:uuid:${nutritionOrderId}`, resource: nutritionOrder });

    return bundle;
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FHIRExporter };
} else if (typeof window !== 'undefined') {
  window.FHIRExporter = FHIRExporter;
}
