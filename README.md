# NutriGen-CDS: Clinical Decision Support for Evidence-Based Nutrigenomics

A specialized Clinical Decision Support System (CDSS) for precision nutrition and metabolic medicine. NutriGen-CDS translates complex genetic variants (SNPs) and clinical laboratory biomarkers into personalized, actionable dietary recommendations, precision supplement formulations, and interoperable Electronic Health Record (EHR) standards (**HL7 FHIR R4**).

---

## Key Clinical Capabilities

### 1. Multi-Domain Metabolic Panel & Evidence Tiers
- **Methylation & 1-Carbon Metabolism**: `MTHFR` (C677T rs1801133, A1298C rs1801131), `COMT` (Val158Met rs4680). Homocysteine remethylation, neurotransmitter clearance, active folate (L-5-MTHF) vs. synthetic folic acid avoidance.
- **Cardiometabolic & Lipid Dynamics**: `APOE` (rs429358 / rs7412 -> E2, E3, E4 alleles), `FTO` (rs9939609), `TCF7L2` (rs7903146). Saturated fat hyper-responsiveness, postprandial ghrelin satiety blunting, incretin-mediated insulin sensitivity.
- **Micronutrient Homeostasis & Transport**: `VDR` (FokI rs2228570), `HFE` (C282Y rs1800562), `FADS1` (rs174537 delta-5 desaturase), `BCMO1` (rs12934922 beta-carotene cleavage). Targeted therapeutic Vitamin D3+K2 dosing, plant-to-active conversion blocks, and iron overload prevention.
- **Food Intolerances & Metabolic Sensitivities**: `LCT / MCM6` (rs4988235 - lactase persistence vs. adult hypolactasia), `CYP1A2` (*1F rs762551 - caffeine clearance), `ALDH2` (rs671 - toxic acetaldehyde accumulation and alcohol flush), `AGT` (rs699 M235T - salt-sensitive hypertension).
- **Detoxification & Antioxidant Defense**: `GSTP1` (rs1695 - Phase II glutathione conjugation), `SOD2` (rs4880 - mitochondrial superoxide dismutase).

### 2. Clinical Safety Guardrails & Drug-Nutrient Depletions
- **Critical Contraindications**:
  - `HFE C282Y` + Supplemental Iron: Blocks toxic hepatic/cardiac parenchymal iron deposition.
  - `Warfarin` + Vitamin K: Flags destabilizing anticoagulant antagonism.
- **Synergistic Epistasis Alerts**:
  - `MTHFR 677TT` + `Slow COMT (Met/Met)`: Down-regulated catecholamine clearance coupled with impaired methylation requires slow titration of folinic acid / unmethylated folates with magnesium to avoid acute anxiety or sleep disruption.
  - `APOE4` + `FTO AA` + `TCF7L2 TT`: Cardiometabolic triad requiring strict Mediterranean-Pesco diet with saturated fat <6% of daily energy and low glycemic load.
- **Medication Nutrient Depletion Tracker**:
  - *Metformin* &rarr; Vitamin B12 malabsorption (compounds MTHFR risk).
  - *Statins* &rarr; CoQ10 depletion and myopathy.
  - *Proton Pump Inhibitors (PPIs)* &rarr; Magnesium, B12, and Calcium impairment.

### 3. Real-Time Biomarker-Genotype Concordance
Evaluates whether a genetic vulnerability has transitioned into active phenotypic pathology:
- `MTHFR TT` + Plasma Homocysteine > 15 µmol/L &rarr; **Active Pathologic Hyperhomocysteinemia** requiring urgent therapeutic remethylation protocol.
- `HFE AA` + Serum Ferritin > 500 ng/mL &rarr; **Emergency Hematology Referral** for phlebotomy protocol.
- `VDR ff` + 25(OH)D < 25 ng/mL &rarr; **Compounded Ligand-Receptor Deficit** requiring therapeutic D3 + K2.

### 4. Standards-Compliant Interoperability: HL7 FHIR R4
Generates a complete FHIR R4 Bundle containing:
- `Patient`: Demographics, BMI, and dietary pattern.
- `Observation`: Genomic variants coded with HGVS and rsIDs, and clinical laboratory biomarkers coded with **LOINC** (`13965-9` for Homocysteine, `62292-8` for 25(OH)D, `2276-4` for Ferritin, `2089-1` for LDL-C).
- `DiagnosticReport`: Conforms to the HL7 Genomics Reporting profile (`genomics-report`), category `GE` (Genetics).
- `NutritionOrder`: Conforms to FHIR R4 `NutritionOrder`, including personalized oral diet (daily calories, carbohydrate %, protein %, fat %, and saturated fat ceiling) and precision dietary supplements (`supplement` list with SNOMED CT coding).

---

## Directory Structure

```
nutrigenomic_cds/
├── index.html                  # Main Clinical Decision Support Dashboard
├── css/
│   └── styles.css              # Responsive clinical design system & print stylesheet
├── js/
│   ├── app.js                  # Main controller, tab routing, and reactive state
│   ├── data/
│   │   ├── knowledge_base.js   # 16 curated nutrigenomic variants, evidence tiers, and guidelines
│   │   ├── drug_interactions.js# Drug-gene-nutrient depletions and safety contraindications
│   │   └── sample_patients.js  # 4 clinical personas (Metabolic, GI/Anxiety, Hemochromatosis, Vegan Athlete)
│   ├── engine/
│   │   ├── parsers.js          # Ingestion parsers for VCF v4.2, 23andMe, and JSON
│   │   ├── rule_engine.js      # CDS inference, domain risk scoring, and formulary generator
│   │   ├── concordance.js      # Biomarker vs. genotype concordance evaluation
│   │   └── fhir_exporter.js    # HL7 FHIR R4 Bundle generator (GenomicReport + NutritionOrder)
│   └── ui/
│       ├── radar_chart.js      # Pure SVG metabolic domain radar visualizer
│       └── report_view.js      # Clinician SOAP note and Patient Care Plan renderer
├── tests/
│   ├── test_suite.html         # In-browser automated unit test runner
│   └── cds_tests.js            # Automated unit tests for parsers, rules, and FHIR export
├── python_cds/
│   ├── cds_engine.py           # Standalone Python CLI and batch analytics module
│   └── sample_input.vcf        # Synthetic validation VCF with canonical nutrigenomic SNPs
└── README.md                   # System documentation
```

---

## Getting Started

### 1. Launch the Clinical Web Application
The web dashboard is completely self-contained with **zero external dependencies**:
- Simply double-click `index.html` or open it in any modern browser (Chrome, Edge, Firefox, Safari).
- Alternatively, serve via any local static server:
  ```powershell
  # If Python is available:
  python -m http.server 8080
  # Navigate to http://localhost:8080/index.html
  ```

### 2. Run Automated Verification Tests
- Open `tests/test_suite.html` in your browser.
- The test suite executes automated tests verifying:
  - VCF v4.2 and 23andMe ingestion parsing.
  - Epistasis synergy detection (MTHFR + COMT, APOE4 + FTO + TCF7L2).
  - Safety contraindications (HFE Iron warning, Warfarin + Vitamin K).
  - Biomarker concordance alert triggers.
  - HL7 FHIR R4 schema compliance (`Bundle`, `DiagnosticReport`, `NutritionOrder`).

### 3. Run Standalone Python Engine
When running in command-line or data science environments:
```bash
python python_cds/cds_engine.py --vcf python_cds/sample_input.vcf --output-fhir fhir_report.json --output-soap soap_report.txt
```

---

## Interoperability Schema: FHIR R4 Mapping

| Clinical Concept | FHIR Resource | Code System / Identifier |
| :--- | :--- | :--- |
| Patient Clinical Demographics | `Patient` | Medical Record Number (`MR`) |
| Genomic SNVs / Genotypes | `Observation` | LOINC `69548-6` (Genetic variant assessment) |
| Serum Homocysteine | `Observation` | LOINC `13965-9` |
| Serum 25-Hydroxyvitamin D | `Observation` | LOINC `62292-8` |
| Serum Ferritin | `Observation` | LOINC `2276-4` |
| LDL Cholesterol | `Observation` | LOINC `2089-1` |
| Fasting Glucose | `Observation` | LOINC `1558-6` |
| Hemoglobin A1c | `Observation` | LOINC `4548-4` |
| Clinical Genomics Report | `DiagnosticReport` | Category `GE` (Genetics), LOINC `81247-9` |
| Precision Dietary Prescription | `NutritionOrder` | SNOMED CT `435671000124103` (Nutrigenomic diet) |
| Dietary Supplements Order | `NutritionOrder.supplement` | SNOMED CT `373444002` (Dietary supplement) |

---

## Evidence Tiers
- **Tier A (Strong Clinical Evidence)**: Replicated multi-center clinical trials, systematic reviews, and consensus clinical practice guidelines (e.g. ACMQ, EASL, AHA).
- **Tier B (Moderate / Replicated GWAS)**: Consistent observational cohorts and replicated gene-diet interaction studies.
- **Tier C (Preliminary / Mechanistic)**: Preclinical biochemical pathways and exploratory nutritional associations.
