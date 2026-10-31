#!/usr/bin/env python3
"""
NutriGen-CDS: Standalone Python Clinical Decision Support Engine
Translates VCF/23andMe genomic data and clinical biomarkers into:
  1. Clinical SOAP Consultation Report
  2. HL7 FHIR R4 Bundle (GenomicReport + NutritionOrder)

Uses only Python standard library (no third-party dependencies required).
"""

import sys
import os
import re
import json
import argparse
from datetime import datetime

# ==============================================================================
# 1. KNOWLEDGE BASE & CLINICAL RULES
# ==============================================================================

KB = {
    "rs1801133": {
        "gene": "MTHFR",
        "variant": "C677T (Ala222Val)",
        "domain": "Methylation",
        "tier": "Tier A",
        "genotypes": {
            "CC": {"score": 0, "phenotype": "Normal MTHFR enzyme activity (~100%). Baseline remethylation.", "folate": "Standard 400 mcg DFE dietary folate."},
            "CT": {"score": 50, "phenotype": "Heterozygous carrier; ~65% residual enzyme activity.", "folate": "Bioavailable L-5-MTHF 400-600 mcg/day; avoid excessive synthetic folic acid."},
            "TT": {"score": 90, "phenotype": "Homozygous risk; ~30-35% residual enzyme activity. Elevated hyperhomocysteinemia risk.", "folate": "Therapeutic L-5-MTHF (800-1000 mcg/day) + Methyl-B12 + P5P."}
        }
    },
    "rs4680": {
        "gene": "COMT",
        "variant": "Val158Met",
        "domain": "Methylation",
        "tier": "Tier A",
        "genotypes": {
            "GG": {"score": 10, "phenotype": "Val/Val (Fast COMT). Rapid catecholamine clearance. Tolerates methyl donors well."},
            "AG": {"score": 30, "phenotype": "Val/Met (Intermediate COMT). Balanced clearance."},
            "AA": {"score": 80, "phenotype": "Met/Met (Slow COMT). Reduced catecholamine clearance; sensitive to high-dose methyl donors and anxiety."}
        }
    },
    "rs429358": {
        "gene": "APOE",
        "variant": "Cys112Arg (determines E4)",
        "domain": "Cardiometabolic",
        "tier": "Tier A",
        "genotypes": {
            "TT": {"score": 10, "phenotype": "Non-E4 carrier (likely APOE e3/e3). Standard lipid clearance.", "diet": "Standard Mediterranean pattern."},
            "CT": {"score": 70, "phenotype": "APOE e4 carrier. Hyper-responsive to dietary saturated fats; elevated LDL-P and ApoB.", "diet": "Strict saturated fat restriction (<6% total energy); high MUFA/EVOO."},
            "CC": {"score": 95, "phenotype": "APOE e4/e4 homozygous. Extreme saturated fat sensitivity.", "diet": "Strict low saturated fat Mediterranean-Pesco diet; marine Omega-3."}
        }
    },
    "rs9939609": {
        "gene": "FTO",
        "variant": "intron 1 (T>A)",
        "domain": "Cardiometabolic",
        "tier": "Tier A",
        "genotypes": {
            "TT": {"score": 0, "phenotype": "Normal postprandial satiety response."},
            "TA": {"score": 40, "phenotype": "Intermediate satiety blunting; benefits from higher protein density."},
            "AA": {"score": 75, "phenotype": "Blunted postprandial ghrelin suppression; enhanced weight loss on higher protein diet (25-30% energy)."}
        }
    },
    "rs7903146": {
        "gene": "TCF7L2",
        "variant": "intron 3 (C>T)",
        "domain": "Cardiometabolic",
        "tier": "Tier A",
        "genotypes": {
            "CC": {"score": 0, "phenotype": "Normal incretin-mediated insulin secretion."},
            "CT": {"score": 60, "phenotype": "Impaired GLP-1 response; vulnerability to glycemic spikes on high-GL diets."},
            "TT": {"score": 85, "phenotype": "Markedly reduced insulin secretion. Prescribe low glycemic load (<90g net carbs/day)."}
        }
    },
    "rs2228570": {
        "gene": "VDR",
        "variant": "FokI (C>T)",
        "domain": "Micronutrients",
        "tier": "Tier A",
        "genotypes": {
            "CC": {"score": 0, "phenotype": "Normal VDR transcriptional responsiveness."},
            "CT": {"score": 40, "phenotype": "Intermediate receptor responsiveness; target 25(OH)D > 40 ng/mL."},
            "TT": {"score": 75, "phenotype": "Reduced VDR affinity (ff). High-dose D3 (4000-5000 IU) + K2 MK-7 + Magnesium required."}
        }
    },
    "rs1800562": {
        "gene": "HFE",
        "variant": "C282Y (G>A)",
        "domain": "Micronutrients",
        "tier": "Tier A",
        "genotypes": {
            "GG": {"score": 0, "phenotype": "Normal physiologic iron homeostasis."},
            "GA": {"score": 60, "phenotype": "C282Y carrier; increased iron absorption. Avoid iron supplements."},
            "AA": {"score": 100, "phenotype": "Homozygous C282Y Hemochromatosis genotype. Severe risk of iron overload. Strict iron contraindication."}
        }
    },
    "rs174537": {
        "gene": "FADS1",
        "variant": "intron 1 (G>T)",
        "domain": "Micronutrients",
        "tier": "Tier A",
        "genotypes": {
            "GG": {"score": 0, "phenotype": "Efficient conversion of plant ALA to EPA/DHA."},
            "GT": {"score": 40, "phenotype": "Intermediate delta-5 desaturase activity."},
            "TT": {"score": 80, "phenotype": "Severely impaired delta-5 desaturase. Minimal ALA -> EPA/DHA conversion. Direct EPA+DHA required."}
        }
    },
    "rs4988235": {
        "gene": "MCM6 / LCT",
        "variant": "-13910 C>T",
        "domain": "Intolerances",
        "tier": "Tier A",
        "genotypes": {
            "TT": {"score": 0, "phenotype": "Lactase persistent (LP). Full lactose tolerance."},
            "CT": {"score": 20, "phenotype": "Lactase persistent; typical lactose tolerance."},
            "CC": {"score": 90, "phenotype": "Primary adult lactase non-persistence (Lactose Intolerance). Exclude fresh milk; choose lactose-free/plant milk."}
        }
    },
    "rs762551": {
        "gene": "CYP1A2",
        "variant": "*1F (-163A>C)",
        "domain": "Intolerances",
        "tier": "Tier A",
        "genotypes": {
            "AA": {"score": 0, "phenotype": "Fast caffeine metabolizer. Coffee cardioprotective up to 3-4 cups/day."},
            "AC": {"score": 60, "phenotype": "Slow caffeine metabolizer. Limit caffeine <200 mg/day."},
            "CC": {"score": 85, "phenotype": "Slow caffeine metabolizer. Limit caffeine <100 mg/day to avoid hypertension and MI risk."}
        }
    }
}

# ==============================================================================
# 2. PARSER FUNCTIONS
# ==============================================================================

def parse_vcf(file_path):
    """Parse VCF file and return dictionary of genotypes for known SNPs."""
    genotypes = {}
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("##"):
                continue
            if line.startswith("#CHROM"):
                continue

            cols = line.split("\t")
            if len(cols) < 10:
                continue

            rsid = cols[2]
            ref = cols[3]
            alt = cols[4]
            format_str = cols[8]
            sample_str = cols[9]

            if rsid in KB:
                fmt_fields = format_str.split(":")
                smp_fields = sample_str.split(":")
                gt_idx = fmt_fields.index("GT") if "GT" in fmt_fields else 0
                gt_val = smp_fields[gt_idx]

                alleles = [ref] + alt.split(",")
                indices = re.split(r"[/|]", gt_val)
                called = []
                for idx_str in indices:
                    try:
                        idx = int(idx_str)
                        if idx < len(alleles):
                            called.append(alleles[idx])
                    except ValueError:
                        pass
                
                if len(called) == 1:
                    called.append(called[0])

                gt_str = "".join(sorted(called)).upper()
                # Strand normalization check
                if gt_str not in KB[rsid]["genotypes"]:
                    comp = {"A": "T", "T": "A", "C": "G", "G": "C"}
                    complemented = "".join(sorted([comp.get(b, b) for b in gt_str]))
                    if complemented in KB[rsid]["genotypes"]:
                        gt_str = complemented

                genotypes[rsid] = {
                    "rsid": rsid,
                    "gene": KB[rsid]["gene"],
                    "variant": KB[rsid]["variant"],
                    "genotype": gt_str,
                    "raw": gt_val
                }

    return genotypes

# ==============================================================================
# 3. CLINICAL INFERENCE & RULE ENGINE
# ==============================================================================

def evaluate_patient(patient_profile, genotypes):
    """Evaluate patient data against clinical rules and knowledge base."""
    domain_scores = {
        "Methylation": {"total": 0, "max": 0, "snps": []},
        "Cardiometabolic": {"total": 0, "max": 0, "snps": []},
        "Micronutrients": {"total": 0, "max": 0, "snps": []},
        "Intolerances": {"total": 0, "max": 0, "snps": []}
    }

    for rsid, entry in KB.items():
        domain = entry["domain"]
        if domain not in domain_scores:
            continue

        call = genotypes.get(rsid)
        gt = call["genotype"] if call else None
        gt_info = entry["genotypes"].get(gt, {}) if gt else {}

        score = gt_info.get("score", 0)
        domain_scores[domain]["total"] += score
        domain_scores[domain]["max"] += 100

        domain_scores[domain]["snps"].append({
            "gene": entry["gene"],
            "rsid": rsid,
            "variant": entry["variant"],
            "genotype": gt or "Not Genotyped",
            "tier": entry["tier"],
            "score": score,
            "phenotype": gt_info.get("phenotype", "Untested")
        })

    # Normalized percentages
    domain_summary = {}
    for dom, data in domain_scores.items():
        pct = round((data["total"] / data["max"]) * 100) if data["max"] > 0 else 0
        domain_summary[dom] = {
            "score": pct,
            "category": "High Priority" if pct >= 65 else ("Moderate" if pct >= 35 else "Optimal"),
            "snps": data["snps"]
        }

    # Safety checks
    safety_alerts = []
    hfe = genotypes.get("rs1800562")
    sups = [s.lower() for s in patient_profile.get("supplements", [])]
    if hfe and hfe["genotype"] in ["AA", "GA"]:
        if any("iron" in s or "ferrous" in s for s in sups):
            safety_alerts.append({
                "severity": "CRITICAL",
                "title": "Contraindicated Iron Supplementation in HFE Variant",
                "directive": "Discontinue all supplemental iron immediately to prevent hepatic/cardiac toxic accumulation."
            })

    # Epistasis
    epistasis_alerts = []
    mthfr = genotypes.get("rs1801133")
    comt = genotypes.get("rs4680")
    if mthfr and mthfr["genotype"] == "TT" and comt and comt["genotype"] == "AA":
        epistasis_alerts.append({
            "severity": "WARNING",
            "title": "MTHFR 677TT + Slow COMT Epistasis",
            "directive": "Avoid high-dose methylfolate/SAMe; titrate folinic acid cautiously with magnesium."
        })

    # Prescriptions
    supplements = []
    if mthfr and mthfr["genotype"] in ["TT", "CT"]:
        supplements.append({
            "nutrient": "Active Folate",
            "form": "L-5-Methyltetrahydrofolate (L-5-MTHF)",
            "dosage": "800 mcg daily" if mthfr["genotype"] == "TT" else "400 mcg daily",
            "timing": "Morning with breakfast",
            "evidence": "Tier A"
        })
        supplements.append({
            "nutrient": "Vitamin B12",
            "form": "Methylcobalamin (sublingual)",
            "dosage": "1000 mcg daily",
            "timing": "Morning",
            "evidence": "Tier A"
        })

    vdr = genotypes.get("rs2228570")
    if vdr and vdr["genotype"] in ["TT", "CT"]:
        supplements.append({
            "nutrient": "Vitamin D3 + K2 (MK-7)",
            "form": "Cholecalciferol + MK-7",
            "dosage": "4,000 IU D3 + 100 mcg K2",
            "timing": "With main fat-containing meal",
            "evidence": "Tier A"
        })

    apoe = genotypes.get("rs429358")
    if apoe and apoe["genotype"] in ["CT", "CC"]:
        supplements.append({
            "nutrient": "Omega-3 (EPA/DHA)",
            "form": "High-potency marine or algal oil",
            "dosage": "1,500 mg EPA+DHA",
            "timing": "With dinner",
            "evidence": "Tier A"
        })

    # Macronutrients
    calories = 2000
    carb_pct = 40
    prot_pct = 25
    fat_pct = 35
    sat_fat_cap = "Strictly < 6% daily energy"

    return {
        "domain_summary": domain_summary,
        "safety_alerts": safety_alerts,
        "epistasis_alerts": epistasis_alerts,
        "supplements": supplements,
        "macronutrients": {
            "calories": calories,
            "carbohydrates_pct": carb_pct,
            "protein_pct": prot_pct,
            "fat_pct": fat_pct,
            "saturated_fat_cap": sat_fat_cap
        }
    }

# ==============================================================================
# 4. FHIR R4 EXPORTER (GenomicReport + NutritionOrder)
# ==============================================================================

def export_fhir(patient_profile, genotypes, evaluation):
    """Build HL7 FHIR R4 collection bundle with GenomicReport and NutritionOrder."""
    patient_id = patient_profile.get("id", "PT-001")
    timestamp = datetime.utcnow().isoformat() + "Z"

    bundle = {
        "resourceType": "Bundle",
        "id": f"bundle-nutrigen-{patient_id}",
        "type": "collection",
        "timestamp": timestamp,
        "entry": []
    }

    # 1. Patient
    patient_res = {
        "resourceType": "Patient",
        "id": patient_id,
        "name": [{"text": patient_profile.get("name", "Unknown Patient")}],
        "gender": patient_profile.get("gender", "unknown")
    }
    bundle["entry"].append({"fullUrl": f"urn:uuid:{patient_id}", "resource": patient_res})

    obs_refs = []
    # 2. Observations
    for rsid, call in genotypes.items():
        obs_id = f"obs-{rsid}-{patient_id}"
        obs_res = {
            "resourceType": "Observation",
            "id": obs_id,
            "status": "final",
            "category": [{"coding": [{"system": "http://terminology.hl7.org/CodeSystem/observation-category", "code": "laboratory"}]}],
            "code": {"coding": [{"system": "http://loinc.org", "code": "69548-6", "display": "Genetic variant assessment"}], "text": f"{call['gene']} ({rsid})"},
            "subject": {"reference": f"Patient/{patient_id}"},
            "valueCodeableConcept": {"text": call["genotype"]}
        }
        bundle["entry"].append({"fullUrl": f"urn:uuid:{obs_id}", "resource": obs_res})
        obs_refs.append({"reference": f"Observation/{obs_id}", "display": f"{call['gene']} ({call['genotype']})"})

    # 3. DiagnosticReport (Genomics Profile)
    report_res = {
        "resourceType": "DiagnosticReport",
        "id": f"report-genomic-{patient_id}",
        "meta": {"profile": ["http://hl7.org/fhir/uv/genomics-reporting/StructureDefinition/genomics-report"]},
        "status": "final",
        "category": [{"coding": [{"system": "http://terminology.hl7.org/CodeSystem/v2-0074", "code": "GE", "display": "Genetics"}]}],
        "code": {"coding": [{"system": "http://loinc.org", "code": "81247-9", "display": "Master HL7 genetic variant reporting panel"}]},
        "subject": {"reference": f"Patient/{patient_id}"},
        "effectiveDateTime": timestamp,
        "result": obs_refs,
        "conclusion": "NutriGen-CDS precision nutrigenomic analysis completed."
    }
    bundle["entry"].append({"fullUrl": f"urn:uuid:report-genomic-{patient_id}", "resource": report_res})

    # 4. NutritionOrder
    macro = evaluation["macronutrients"]
    nutrition_order = {
        "resourceType": "NutritionOrder",
        "id": f"nutrition-order-{patient_id}",
        "status": "active",
        "intent": "order",
        "patient": {"reference": f"Patient/{patient_id}"},
        "dateTime": timestamp,
        "oralDiet": {
            "type": [{"coding": [{"system": "http://snomed.info/sct", "code": "435671000124103", "display": "Nutrigenomic personalized diet"}]}],
            "nutrient": [
                {"modifier": {"text": "Energy"}, "amount": {"value": macro["calories"], "unit": "kcal/d"}},
                {"modifier": {"text": "Carbohydrate"}, "amount": {"value": macro["carbohydrates_pct"], "unit": "% energy"}},
                {"modifier": {"text": "Protein"}, "amount": {"value": macro["protein_pct"], "unit": "% energy"}},
                {"modifier": {"text": "Fat"}, "amount": {"value": macro["fat_pct"], "unit": "% energy"}}
            ],
            "instruction": f"Saturated fat restriction: {macro['saturated_fat_cap']}."
        },
        "supplement": [
            {
                "type": {"text": sup["nutrient"]},
                "productName": f"{sup['form']} ({sup['dosage']})",
                "instruction": f"Evidence {sup['evidence']}; Timing: {sup['timing']}."
            } for sup in evaluation["supplements"]
        ]
    }
    bundle["entry"].append({"fullUrl": f"urn:uuid:nutrition-order-{patient_id}", "resource": nutrition_order})

    return bundle

# ==============================================================================
# 5. CLI INTERFACE
# ==============================================================================

def main():
    parser = argparse.ArgumentParser(description="NutriGen-CDS: Clinical Decision Support for Nutrigenomics")
    parser.add_argument("--vcf", required=True, help="Path to input VCF file")
    parser.add_argument("--patient-name", default="Arthur Pendelton", help="Patient name")
    parser.add_argument("--patient-id", default="PT-10492", help="Patient ID")
    parser.add_argument("--output-fhir", help="Optional path to output FHIR Bundle JSON")
    parser.add_argument("--output-soap", help="Optional path to output SOAP consultation text")

    args = parser.parse_args()

    patient_profile = {
        "id": args.patient_id,
        "name": args.patient_name,
        "gender": "male",
        "supplements": ["Centrum Multivitamin"],
        "medications": ["Metformin 1000mg"]
    }

    print(f"[*] Parsing VCF input: {args.vcf}")
    genotypes = parse_vcf(args.vcf)
    print(f"[*] Identified {len(genotypes)} actionable nutrigenomic variants.")

    print("[*] Running Clinical Decision Support Rule Engine...")
    evaluation = evaluate_patient(patient_profile, genotypes)

    # Print Summary to Console
    print("\n" + "="*60)
    print(f" CLINICAL NUTRIGENOMIC EVALUATION: {patient_profile['name']}")
    print("="*60)
    for dom, data in evaluation["domain_summary"].items():
        print(f" - {dom:18}: {data['score']:3}% [{data['category']}]")

    if evaluation["safety_alerts"]:
        print("\n[!] CRITICAL SAFETY ALERTS:")
        for alert in evaluation["safety_alerts"]:
            print(f"   * {alert['title']}: {alert['directive']}")

    if evaluation["epistasis_alerts"]:
        print("\n[~] EPISTASIS SYNERGIES:")
        for alert in evaluation["epistasis_alerts"]:
            print(f"   * {alert['title']}: {alert['directive']}")

    print("\n[+] PRECISION SUPPLEMENT FORMULARY:")
    for sup in evaluation["supplements"]:
        print(f"   * {sup['nutrient']}: {sup['form']} ({sup['dosage']}) - {sup['timing']}")

    # FHIR Output
    fhir_bundle = export_fhir(patient_profile, genotypes, evaluation)
    if args.output_fhir:
        with open(args.output_fhir, "w", encoding="utf-8") as f:
            json.dump(fhir_bundle, f, indent=2)
        print(f"\n[+] HL7 FHIR Bundle written to: {args.output_fhir}")

    # SOAP Output
    if args.output_soap:
        with open(args.output_soap, "w", encoding="utf-8") as f:
            f.write(f"CLINICAL SOAP CONSULTATION REPORT\nPatient: {patient_profile['name']} ({patient_profile['id']})\n")
            f.write(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
            f.write("A. ASSESSMENT:\n")
            for dom, data in evaluation["domain_summary"].items():
                f.write(f"- {dom}: {data['score']}% ({data['category']})\n")
            f.write("\nP. PLAN & NUTRITION ORDER:\n")
            for sup in evaluation["supplements"]:
                f.write(f"- {sup['nutrient']}: {sup['form']} {sup['dosage']} ({sup['timing']})\n")
        print(f"[+] SOAP Report written to: {args.output_soap}")

    print("\n[*] Evaluation finished successfully.")

if __name__ == "__main__":
    main()
