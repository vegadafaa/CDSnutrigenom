/**
 * NutriGen-CDS: Clinical Nutrigenomics Knowledge Base
 * Curated gene-nutrient interactions, evidence tiers, and clinical guidelines.
 * Evidence Tiers:
 *  - Tier A: Established clinical guidelines / systematic reviews / multi-center RCTs
 *  - Tier B: Replicated GWAS / well-powered prospective cohort studies
 *  - Tier C: Mechanistic / preliminary observational evidence
 */

const NUTRIGENOMICS_KB = {
  // ==========================================
  // DOMAIN 1: METHYLATION & 1-CARBON METABOLISM
  // ==========================================
  "rs1801133": {
    gene: "MTHFR",
    variantName: "C677T (Ala222Val)",
    rsid: "rs1801133",
    chromosome: "1",
    position: 11856378,
    refAllele: "G", // forward/reverse strand normalization handled
    altAllele: "A", // In standard plus strand: C > T
    riskAllele: "T",
    domain: "Methylation",
    domainLabel: "Methylation & 1-Carbon Metabolism",
    evidenceTier: "Tier A",
    clinicalSummary: "MTHFR converts 5,10-methylenetetrahydrofolate to 5-methyltetrahydrofolate (5-MTHF), the primary circulating form of folate and essential methyl donor for homocysteine remethylation to methionine.",
    genotypes: {
      "CC": {
        riskLevel: "normal",
        riskScore: 0,
        phenotype: "Normal MTHFR enzyme activity (~100%). Baseline homocysteine clearance efficiency.",
        dietaryGuidance: "Maintain standard dietary folate intake (400 mcg DFE/day from leafy greens, legumes, and whole foods).",
        supplements: "Standard multivitamin or dietary folate is adequate.",
        foodsToPrioritize: ["Spinach", "Lentils", "Asparagus", "Broccoli", "Avocado"],
        foodsToAvoid: []
      },
      "CT": {
        riskLevel: "moderate",
        riskScore: 50,
        phenotype: "Heterozygous carrier; ~65% residual enzyme activity. Mildly reduced folate metabolism capacity.",
        dietaryGuidance: "Prioritize natural food folates. Moderate synthetic folic acid intake from highly fortified processed foods.",
        supplements: "Consider bioavailable L-5-methyltetrahydrofolate (L-5-MTHF) 400-600 mcg/day, paired with Vitamin B12 and B6.",
        foodsToPrioritize: ["Dark leafy greens", "Black beans", "Edamame", "Liver", "Eggs (choline)"],
        foodsToAvoid: ["Excessive synthetic folic acid fortified cereals (>800 mcg/day)"]
      },
      "TT": {
        riskLevel: "high",
        riskScore: 90,
        phenotype: "Homozygous risk; ~30-35% residual enzyme activity. Thermolabile enzyme, elevated risk of hyperhomocysteinemia, especially when folate intake is marginal.",
        dietaryGuidance: "Strictly emphasize folate-rich whole foods and dietary choline/betaine to support alternative remethylation via BHMT. Restrict synthetic folic acid (unmetabolized folic acid accumulation).",
        supplements: "Bioavailable L-5-MTHF (800-1000 mcg/day) + Methylcobalamin (B12: 500-1000 mcg/day) + Pyridoxal-5-Phosphate (P5P/B6: 25-50 mg/day) + Choline/Betaine (300-500 mg).",
        foodsToPrioritize: ["Spinach", "Romaine", "Beef liver", "Pasture-raised eggs (choline)", "Beets (betaine)", "Lentils"],
        foodsToAvoid: ["Synthetic folic acid fortified energy drinks", "Highly fortified processed flours", "Excessive alcohol (impairs folate absorption)"]
      }
    },
    biomarkers: ["Homocysteine", "Serum Folate", "RBC Folate", "Vitamin B12"],
    monitoringProtocol: "Measure plasma homocysteine and RBC folate at baseline; re-evaluate at 10-12 weeks post-supplementation.",
    references: ["PMID: 15308734 (Botto et al.)", "PMID: 25474342 (Tsang et al.)", "ACMG Practice Guidelines"]
  },

  "rs1801131": {
    gene: "MTHFR",
    variantName: "A1298C (Glu429Ala)",
    rsid: "rs1801131",
    chromosome: "1",
    position: 11854476,
    riskAllele: "G", // standard C allele
    domain: "Methylation",
    domainLabel: "Methylation & 1-Carbon Metabolism",
    evidenceTier: "Tier A",
    clinicalSummary: "A1298C affects the C-terminal regulatory domain of MTHFR, impacting tetrahydrobiopterin (BH4) recycling and nitric oxide synthesis, synergizing with C677T when compound heterozygous.",
    genotypes: {
      "AA": {
        riskLevel: "normal",
        riskScore: 0,
        phenotype: "Normal regulatory function (~100% activity).",
        dietaryGuidance: "Standard balanced dietary folate and antioxidant intake.",
        supplements: "None required beyond RDA.",
        foodsToPrioritize: ["Leafy greens", "Citrus fruits", "Nuts"],
        foodsToAvoid: []
      },
      "AC": {
        riskLevel: "mild",
        riskScore: 30,
        phenotype: "Mildly decreased enzyme stability (~80% activity). Clinically significant primarily in compound heterozygosity with C677T.",
        dietaryGuidance: "Ensure adequate dietary folate and antioxidant cofactors.",
        supplements: "L-5-MTHF (400 mcg/day) if homocysteine is elevated or paired with C677T.",
        foodsToPrioritize: ["Kale", "Legumes", "Sunflower seeds"],
        foodsToAvoid: []
      },
      "CC": {
        riskLevel: "moderate",
        riskScore: 60,
        phenotype: "Moderately reduced activity (~60%). May affect BH4 synthesis, dopamine/serotonin synthesis, and cardiovascular endothelial nitric oxide balance.",
        dietaryGuidance: "Support nitric oxide pathways (dietary nitrates) and methyl donor supply.",
        supplements: "L-5-MTHF 400-800 mcg/day + Ascorbic acid and dietary polyphenols to protect BH4 uncoupling.",
        foodsToPrioritize: ["Beetroot (nitrates)", "Arugula", "Dark berries", "Green tea"],
        foodsToAvoid: ["Refined sugars", "Excessive oxidative stressors"]
      }
    },
    biomarkers: ["Homocysteine", "hs-CRP"],
    references: ["PMID: 9634518 (van der Put et al.)"]
  },

  "rs4680": {
    gene: "COMT",
    variantName: "Val158Met",
    rsid: "rs4680",
    chromosome: "22",
    position: 19951271,
    riskAllele: "A", // Met allele (slow)
    domain: "Methylation",
    domainLabel: "Methylation & 1-Carbon Metabolism",
    evidenceTier: "Tier A",
    clinicalSummary: "Catechol-O-methyltransferase degrades catecholamines (dopamine, epinephrine, norepinephrine) and catechol estrogens using S-adenosylmethionine (SAMe) as a methyl donor. The Met allele causes 3-4 fold lower enzyme activity.",
    genotypes: {
      "GG": { // Val/Val
        riskLevel: "normal",
        riskScore: 10,
        phenotype: "Val/Val (Fast COMT). High enzyme activity; rapid clearance of catecholamines. High resilience to stress, potential lower executive focus in calm conditions. High tolerance to methyl-donor supplements.",
        dietaryGuidance: "Standard nutrient intake. Can tolerate full-dose methyl donors without overmethylation symptoms.",
        supplements: "Tolerates standard methylated B-complex and SAMe well.",
        foodsToPrioritize: ["Green tea (EGCG)", "Cruciferous vegetables", "High-protein foods"],
        foodsToAvoid: []
      },
      "AG": { // Val/Met
        riskLevel: "mild",
        riskScore: 30,
        phenotype: "Val/Met (Intermediate COMT). Balanced clearance of catecholamines and estrogen metabolites.",
        dietaryGuidance: "Balanced intake of methyl donors and dietary polyphenols.",
        supplements: "Moderate doses of methylated vitamins tolerated.",
        foodsToPrioritize: ["Berries", "Broccoli", "Lean poultry", "Quinoa"],
        foodsToAvoid: []
      },
      "AA": { // Met/Met
        riskLevel: "high",
        riskScore: 80,
        phenotype: "Met/Met (Slow COMT). 3-4x reduced enzyme clearance rate. Enhanced focus/working memory, but prone to anxiety, sleep disturbances, and hypersensitivity to high-dose methyl donors (SAMe, high methylfolate). Slow estrogen clearance.",
        dietaryGuidance: "Avoid excessive stimulatory agents (caffeine, high-dose methyl donors). Emphasize magnesium and vitamin B6. Use unmethylated folate (folinic acid / calcium folinate) or low-dose methylfolate titrated cautiously.",
        supplements: "Magnesium glycinate (300-400 mg/d), Vitamin B6 (P5P), Folinic acid (calcium folinate) preferred over high-dose methylfolate. Hydroxocobalamin or Adenosylcobalamin preferred over high methyl-B12 if anxious.",
        foodsToPrioritize: ["Pumpkin seeds (magnesium)", "Swiss chard", "Wild salmon", "Chamomile"],
        foodsToAvoid: ["High caffeine beverages", "Energy drinks with mega-dose methylcobalamin/folate", "Excessive catecholamine triggers"]
      }
    },
    biomarkers: ["Serum Magnesium", "Homocysteine"],
    references: ["PMID: 15729272 (Tunbridge et al.)", "PMID: 17008817 (Chen et al.)"]
  },

  // ==========================================
  // DOMAIN 2: CARDIOMETABOLIC & LIPID DYNAMICS
  // ==========================================
  "rs429358": {
    gene: "APOE",
    variantName: "Cys112Arg (determines E4 allele)",
    rsid: "rs429358",
    chromosome: "19",
    position: 45411941,
    riskAllele: "C", // C encodes Arg at 112 -> E4 marker
    domain: "Cardiometabolic",
    domainLabel: "Cardiometabolic & Lipid Metabolism",
    evidenceTier: "Tier A",
    clinicalSummary: "APOE mediates hepatic uptake of triglyceride-rich lipoprotein remnants and LDL particles. The E4 allele induces profound hyper-responsiveness to dietary saturated fatty acids and elevated atherogenic particle counts (ApoB/LDL-C).",
    genotypes: {
      "TT": { // Non-E4 (E3/E3 or E2/E3 when combined with rs7412 CC)
        riskLevel: "normal",
        riskScore: 10,
        phenotype: "Non-E4 carrier (likely APOE ε3/ε3). Normal LDL receptor affinity and standard lipid clearance.",
        dietaryGuidance: "Follow standard healthy dietary guidelines; moderate saturated fat tolerance.",
        supplements: "Omega-3 EPA/DHA (1000 mg/day) for cardiometabolic protection.",
        foodsToPrioritize: ["Extra virgin olive oil", "Oats", "Legumes", "Fatty fish"],
        foodsToAvoid: ["Industrial trans fats", "Excessive refined carbohydrates"]
      },
      "CT": { // Heterozygous E4 (E3/E4 or E2/E4)
        riskLevel: "moderate",
        riskScore: 70,
        phenotype: "APOE ε4 heterozygous carrier. High sensitivity to saturated fats; marked elevation of LDL-C and small dense LDL particles upon saturated fat intake; heightened neuro-inflammatory and cardiovascular risk.",
        dietaryGuidance: "Strict restriction of dietary saturated fat (<7% of total daily energy). Replace butter, coconut oil, and fatty meats with monounsaturated fats (extra virgin olive oil, avocado) and soluble fiber. Follow a strict Mediterranean diet.",
        supplements: "High-quality Omega-3 DHA/EPA (1500-2000 mg/day), Curcumin (phytosome formulation for neuroprotection), CoQ10 (100-200 mg/d).",
        foodsToPrioritize: ["Extra virgin olive oil", "Wild-caught salmon", "Walnuts", "Artichokes", "Psyllium husk", "Flaxseed"],
        foodsToAvoid: ["Butter / Ghee", "Coconut oil / MCT oil", "Palm oil", "Heavy cream", "Processed red meat"]
      },
      "CC": { // Homozygous E4 (E4/E4)
        riskLevel: "high",
        riskScore: 95,
        phenotype: "APOE ε4/ε4 homozygous. Extreme hyper-responsiveness to dietary saturated fat and cholesterol. High risk of premature atherosclerotic vascular disease and cognitive decline.",
        dietaryGuidance: "Stringent low-saturated fat (<5-6% of calories), high-polyphenol Mediterranean-Pesco diet. Avoid ketogenic or high-animal-fat diets entirely. Alcohol abstinence or strict limitation.",
        supplements: "Pharmaceutical-grade Omega-3 EPA/DHA (2000 mg/day, monitor lipid panel), Vitamin E mixed tocopherols/tocotrienols, Resveratrol.",
        foodsToPrioritize: ["Leafy vegetables", "Cold-water fatty fish", "Blueberries", "Raw almonds", "Chia seeds", "Legumes"],
        foodsToAvoid: ["Ketogenic high-fat foods", "Bulletproof coffee", "Lard", "Fatty beef", "Cheese/full-fat dairy", "Binge alcohol"]
      }
    },
    biomarkers: ["ApoB", "LDL-C", "Total Cholesterol", "HDL-C", "Triglycerides", "hs-CRP"],
    monitoringProtocol: "Perform complete lipid panel + ApoB at baseline; re-evaluate 8 weeks following saturated fat modification.",
    references: ["PMID: 28404561 (Corella et al., Atherosclerosis)", "PMID: 15159333 (Minihane et al.)"]
  },

  "rs9939609": {
    gene: "FTO",
    variantName: "intron 1 (T>A)",
    rsid: "rs9939609",
    chromosome: "16",
    position: 53820527,
    riskAllele: "A",
    domain: "Cardiometabolic",
    domainLabel: "Satiety & Energy Balance",
    evidenceTier: "Tier A",
    clinicalSummary: "FTO influences ghrelin expression, central nervous system satiety signaling, and fat storage. The A risk allele is linked to impaired postprandial satiety and increased carbohydrate cravings.",
    genotypes: {
      "TT": {
        riskLevel: "normal",
        riskScore: 0,
        phenotype: "Normal satiety signaling and typical energy balance response.",
        dietaryGuidance: "Standard balanced macronutrient distribution (45-55% carb, 20-25% protein, 25-30% fat).",
        supplements: "None specific required.",
        foodsToPrioritize: ["Whole grains", "Vegetables", "Lean proteins"],
        foodsToAvoid: []
      },
      "TA": {
        riskLevel: "mild",
        riskScore: 40,
        phenotype: "Heterozygous carrier; intermediate satiety signaling. Higher response to higher-protein and higher-fiber diets for weight maintenance.",
        dietaryGuidance: "Target higher protein density (25-30% of total calories) and high prebiotic fiber to enhance GLP-1/PYY satiety peptides.",
        supplements: "Glucomannan or soluble fiber before meals if satiety is blunted.",
        foodsToPrioritize: ["Chicken breast", "Lentils", "Greek yogurt", "Vegetables", "Chia seeds"],
        foodsToAvoid: ["Liquid carbohydrates (soda, fruit juices)", "Ultra-processed snack foods"]
      },
      "AA": {
        riskLevel: "moderate",
        riskScore: 75,
        phenotype: "Homozygous risk; blunted ghrelin suppression post-meal, increased predilection for energy-dense, hyper-palatable foods. Significant weight loss advantage shown with high-protein, lower-glycemic diets.",
        dietaryGuidance: "High protein intake (1.4-1.8 g/kg body weight; ~30% total daily energy) to suppress postprandial ghrelin. Low glycemic index/load. Structured meal timing (avoid grazing).",
        supplements: "Protein supplementation (Whey isolate / Pea protein), Chromium picolinate (200 mcg), Berberine (if insulin resistant).",
        foodsToPrioritize: ["Lean poultry", "Tempeh", "Fish", "Cruciferous vegetables", "Apples with skin", "Black beans"],
        foodsToAvoid: ["Refined sugars", "White bread", "Sweetened beverages", "High-fat/high-sugar snack foods"]
      }
    },
    biomarkers: ["Fasting Glucose", "HbA1c", "BMI", "Waist Circumference"],
    references: ["PMID: 23853163 (Karra et al., J Clin Invest)", "PMID: 22896500 (Zhang et al.)"]
  },

  "rs7903146": {
    gene: "TCF7L2",
    variantName: "intron 3 (C>T)",
    rsid: "rs7903146",
    chromosome: "10",
    position: 114758349,
    riskAllele: "T",
    domain: "Cardiometabolic",
    domainLabel: "Glycemic Regulation & Insulin Sensitivity",
    evidenceTier: "Tier A",
    clinicalSummary: "TCF7L2 regulates proglucagon gene expression and incretin-mediated insulin secretion in pancreatic beta-cells. The T allele is the strongest common genetic risk factor for Type 2 Diabetes.",
    genotypes: {
      "CC": {
        riskLevel: "normal",
        riskScore: 0,
        phenotype: "Normal incretin sensitivity and glucose-stimulated insulin secretion.",
        dietaryGuidance: "Standard whole food diet with balanced carbohydrates.",
        supplements: "None specific.",
        foodsToPrioritize: ["Legumes", "Quinoa", "Berries"],
        foodsToAvoid: ["Excess refined sugars"]
      },
      "CT": {
        riskLevel: "moderate",
        riskScore: 60,
        phenotype: "Impaired GLP-1 stimulated insulin release; elevated susceptibility to glycemic spikes on high-glycemic-load diets. Strong clinical evidence for Mediterranean diet mitigating risk.",
        dietaryGuidance: "Mediterranean dietary pattern rich in monounsaturated fats (EVOO) and low glycemic index carbohydrates (<40% total energy).",
        supplements: "Alpha-lipoic acid (300 mg/d), Magnesium citrate/glycinate (300 mg/d).",
        foodsToPrioritize: ["Extra virgin olive oil", "Lentils", "Avocado", "Barley", "Nuts"],
        foodsToAvoid: ["Refined grain flours", "High fructose corn syrup", "Mashed potatoes", "Sugary drinks"]
      },
      "TT": {
        riskLevel: "high",
        riskScore: 85,
        phenotype: "Markedly reduced insulin secretion and enhanced hepatic glucose output. High vulnerability to rapid diabetes progression on standard Western diets.",
        dietaryGuidance: "Strict low glycemic load diet (<100g net carbs/day or structured Mediterranean/Low-GI). High intake of polyphenols and soluble fibers (oat beta-glucan). Meal sequencing (fiber/protein first, carbs last).",
        supplements: "Magnesium (400 mg/d), Inositol (Myo-inositol 2g/d), Berberine (500 mg before carb meals).",
        foodsToPrioritize: ["Arugula", "Olive oil", "Walnuts", "Chickpeas", "Fatty fish", "Cinnamon"],
        foodsToAvoid: ["All sugary drinks", "White rice", "Pastries", "Processed snacks", "Fruit juices"]
      }
    },
    biomarkers: ["Fasting Blood Glucose", "HbA1c", "Fasting Insulin", "HOMA-IR"],
    references: ["PMID: 22896500 (Corella et al., Diabetes Care)", "PMID: 16415884 (Grant et al.)"]
  },

  // ==========================================
  // DOMAIN 3: MICRONUTRIENT & VITAMIN HOMEOSTASIS
  // ==========================================
  "rs2228570": {
    gene: "VDR",
    variantName: "FokI (C>T)",
    rsid: "rs2228570",
    chromosome: "12",
    position: 48272895,
    riskAllele: "T", // 'f' allele (shorter protein, lower transcriptional activity)
    domain: "Micronutrients",
    domainLabel: "Micronutrient Absorption & Utilization",
    evidenceTier: "Tier A",
    clinicalSummary: "VDR encodes the nuclear Vitamin D Receptor regulating calcium, phosphorus, immune balance, and bone metabolism. The 'f' (T) allele generates a longer, less transcriptionally active receptor isoform.",
    genotypes: {
      "CC": { // FF (wildtype)
        riskLevel: "normal",
        riskScore: 0,
        phenotype: "Efficient VDR transcriptional activation and normal calcium absorption.",
        dietaryGuidance: "Standard dietary Vitamin D (600-800 IU) and Calcium (1000 mg) intake.",
        supplements: "Maintenance Vitamin D3 (1000 IU/day) during low sun exposure.",
        foodsToPrioritize: ["Sardines", "Egg yolks", "Fortified dairy/plant milk", "Mushrooms"],
        foodsToAvoid: []
      },
      "CT": { // Ff
        riskLevel: "mild",
        riskScore: 40,
        phenotype: "Intermediate VDR transcriptional efficiency; moderate requirement for circulating 25-hydroxyvitamin D.",
        dietaryGuidance: "Ensure adequate calcium intake paired with dietary vitamin D and magnesium.",
        supplements: "Vitamin D3 (2000-3000 IU/day) + Vitamin K2 (MK-7 100 mcg) to optimize bone mineralization.",
        foodsToPrioritize: ["Wild salmon", "Mackerel", "Fortified foods", "Leafy greens (calcium)"],
        foodsToAvoid: []
      },
      "TT": { // ff
        riskLevel: "moderate",
        riskScore: 75,
        phenotype: "Reduced receptor responsiveness. Requires higher circulating serum 25(OH)D concentrations (>40-50 ng/mL or 100-125 nmol/L) to achieve optimal target gene transcription.",
        dietaryGuidance: "High dietary calcium and magnesium to support PTH balance. Avoid phytate-heavy meals concurrent with calcium.",
        supplements: "Vitamin D3 (4000-5000 IU/day titrated to serum 25(OH)D) co-administered with Vitamin K2 (MK-7 100-200 mcg) and Magnesium (300-400 mg).",
        foodsToPrioritize: ["Canned salmon with bones", "Sardines", "Sesame seeds / Tahini", "Collard greens", "Almonds"],
        foodsToAvoid: ["Excessive phosphoric acid (colas)", "Unsoaked grains high in phytic acid"]
      }
    },
    biomarkers: ["Serum 25(OH)D", "Ionized Calcium", "PTH", "Alkaline Phosphatase"],
    monitoringProtocol: "Measure 25(OH)D and serum calcium at baseline; re-check at 12 weeks.",
    references: ["PMID: 15001613 (Arai et al.)", "PMID: 24705574"]
  },

  "rs1800562": {
    gene: "HFE",
    variantName: "C282Y (G>A)",
    rsid: "rs1800562",
    chromosome: "6",
    position: 26093141,
    riskAllele: "A",
    domain: "Micronutrients",
    domainLabel: "Iron Homeostasis & Safety",
    evidenceTier: "Tier A",
    clinicalSummary: "HFE modulates hepcidin expression and iron absorption. C282Y disrupts disulfide bond formation, causing uninhibited gastrointestinal iron hyperabsorption and hereditary hemochromatosis risk.",
    genotypes: {
      "GG": {
        riskLevel: "normal",
        riskScore: 0,
        phenotype: "Normal hepcidin regulation and physiologic iron absorption.",
        dietaryGuidance: "Standard balanced dietary iron intake.",
        supplements: "Standard iron supplementation if clinically indicated for iron deficiency.",
        foodsToPrioritize: ["Lean beef", "Lentils", "Spinach"],
        foodsToAvoid: []
      },
      "GA": {
        riskLevel: "moderate",
        riskScore: 60,
        phenotype: "C282Y carrier; increased intestinal iron absorption. Mildly elevated risk of iron overload, especially in men and postmenopausal women.",
        dietaryGuidance: "Avoid supplemental iron. Moderate consumption of heme iron (red meat). Do not consume high-dose vitamin C (>500 mg) alongside iron-rich meals.",
        supplements: "Strictly avoid non-indicated iron supplements. Drink black tea or coffee with meals (tannins inhibit iron absorption).",
        foodsToPrioritize: ["Plant-based proteins", "Green tea", "Whole grains"],
        foodsToAvoid: ["Iron-fortified breakfast cereals", "Supplemental iron pills", "Raw shellfish (Vibrio risk in iron overload)"]
      },
      "AA": {
        riskLevel: "high",
        riskScore: 100,
        phenotype: "C282Y/C282Y homozygous; classic Hereditary Hemochromatosis genotype. Severe risk of progressive hepatic, cardiac, and endocrine iron deposition.",
        dietaryGuidance: "Strict avoidance of supplemental iron, iron-fortified foods, and raw shellfish (Vibrio vulnificus susceptibility). Restrict red meat and alcohol. Separate high-vitamin C foods from meals.",
        supplements: "ABSOLUTELY CONTRAINDICATED: Iron supplements, multivitamins with iron. Consider calcium and polyphenols (tannins, green tea catechins) during meals to blunt absorption.",
        foodsToPrioritize: ["Vegetables", "Legumes", "Poultry in moderation", "Tea with meals"],
        foodsToAvoid: ["Supplemental iron", "Cast-iron cookware", "Raw oysters / clams", "Red meat >1x/week", "High alcohol"]
      }
    },
    biomarkers: ["Serum Ferritin", "Transferrin Saturation", "Serum Iron", "TIBC", "Liver Enzymes (ALT/AST)"],
    monitoringProtocol: "Emergency alert: If Ferritin > 300 ng/mL or Transferrin Saturation > 45-50%, immediate clinical referral for phlebotomy/hematology evaluation.",
    references: ["PMID: 8696333 (Feder et al.)", "EASL Clinical Practice Guidelines on Hemochromatosis"]
  },

  "rs174537": {
    gene: "FADS1",
    variantName: "intron 1 (G>T)",
    rsid: "rs174537",
    chromosome: "11",
    position: 61570783,
    riskAllele: "T",
    domain: "Micronutrients",
    domainLabel: "Essential Fatty Acid Desaturation",
    evidenceTier: "Tier A",
    clinicalSummary: "FADS1 encodes delta-5 desaturase, the rate-limiting enzyme in synthesizing long-chain polyunsaturated fatty acids (EPA/DHA and AA) from short-chain precursors (ALA and LA).",
    genotypes: {
      "GG": {
        riskLevel: "normal",
        riskScore: 0,
        phenotype: "Efficient endogenous conversion of plant-based ALA (flax, walnuts, chia) to EPA and DHA.",
        dietaryGuidance: "Can maintain adequate long-chain omega-3 status from a combination of plant ALA and dietary fish.",
        supplements: "Standard omega-3 maintenance (500-1000 mg EPA/DHA).",
        foodsToPrioritize: ["Flaxseeds", "Walnuts", "Chia seeds", "Fish"],
        foodsToAvoid: []
      },
      "GT": {
        riskLevel: "mild",
        riskScore: 40,
        phenotype: "Moderately reduced delta-5 desaturase activity (~30% reduction). Moderate conversion of ALA to EPA/DHA.",
        dietaryGuidance: "Do not rely exclusively on plant sources (ALA) for omega-3 needs.",
        supplements: "Direct marine or microalgal EPA + DHA (1000 mg/day).",
        foodsToPrioritize: ["Salmon", "Sardines", "Algal oil", "Hemp seeds"],
        foodsToAvoid: ["Excess industrial omega-6 seed oils (corn, soybean) which compete for desaturase"]
      },
      "TT": {
        riskLevel: "moderate",
        riskScore: 80,
        phenotype: "Severely impaired delta-5 desaturase activity (~60-70% reduction). Minimal conversion of alpha-linolenic acid (ALA) to active EPA and DHA. High risk of low Omega-3 Index on plant-only diets.",
        dietaryGuidance: "Mandatory dietary or supplemental direct preformed long-chain EPA/DHA. Strict reduction of excessive dietary linoleic acid (LA) which competitively depletes remaining enzyme activity.",
        supplements: "High-dose preformed EPA/DHA (1500-2000 mg/day; algal DHA/EPA for vegans).",
        foodsToPrioritize: ["Fatty cold-water fish (mackerel, herring, salmon)", "Algal oil supplements", "Extra virgin olive oil"],
        foodsToAvoid: ["High linoleic acid oils (soybean oil, corn oil, cottonseed oil)"]
      }
    },
    biomarkers: ["Omega-3 Index (RBC EPA+DHA)", "Arachidonic Acid / EPA Ratio"],
    references: ["PMID: 22442407 (Ameur et al., Nat Genet)", "PMID: 25149870"]
  },

  "rs12934922": {
    gene: "BCMO1",
    variantName: "R267S (A>T)",
    rsid: "rs12934922",
    chromosome: "16",
    position: 81260714,
    riskAllele: "T",
    domain: "Micronutrients",
    domainLabel: "Beta-Carotene to Retinol Cleavage",
    evidenceTier: "Tier B",
    clinicalSummary: "Beta-carotene 15,15'-monooxygenase converts provitamin A carotenoids into active retinol. The T allele causes ~32-57% reduction in conversion efficiency.",
    genotypes: {
      "AA": {
        riskLevel: "normal",
        riskScore: 0,
        phenotype: "Normal carotenoid cleavage into active Vitamin A.",
        dietaryGuidance: "Plant carotenoids (carrots, sweet potatoes) adequately meet Vitamin A requirements.",
        supplements: "None specific.",
        foodsToPrioritize: ["Carrots", "Sweet potatoes", "Pumpkin", "Spinach"],
        foodsToAvoid: []
      },
      "AT": {
        riskLevel: "mild",
        riskScore: 35,
        phenotype: "Mild-to-moderate reduction in beta-carotene conversion efficiency (~32% lower).",
        dietaryGuidance: "Combine rich carotenoid sources with dietary fats for absorption; include preformed vitamin A sources.",
        supplements: "Retinyl palmitate (700-900 mcg RAE) if plant-exclusive and serum retinol is low.",
        foodsToPrioritize: ["Pasture-raised eggs", "Ghee", "Cooked carrots with olive oil"],
        foodsToAvoid: []
      },
      "TT": {
        riskLevel: "moderate",
        riskScore: 70,
        phenotype: "Markedly diminished beta-carotene to retinol conversion (~57% lower). High vulnerability to subclinical Vitamin A deficiency if relying solely on plant provitamin A (carotenodermia/orange skin palms with low retinol).",
        dietaryGuidance: "Include preformed Vitamin A (retinol/retinyl esters) from animal sources or vegan retinyl palmitate. Do not rely on carrots/sweet potatoes alone.",
        supplements: "Preformed Vitamin A (Retinyl palmitate 1000-1500 mcg RAE / 3000-5000 IU/day). Avoid beta-carotene single supplements.",
        foodsToPrioritize: ["Egg yolks", "Grass-fed dairy", "Cod liver oil", "Liver (moderate)", "Fortified plant milk"],
        foodsToAvoid: ["Solely relying on beta-carotene supplements"]
      }
    },
    biomarkers: ["Serum Retinol", "Serum Beta-Carotene"],
    references: ["PMID: 19103647 (Leung et al., FASEB J)"]
  },

  // ==========================================
  // DOMAIN 4: FOOD INTOLERANCES & METABOLIC SENSITIVITIES
  // ==========================================
  "rs4988235": {
    gene: "MCM6 / LCT",
    variantName: "-13910 C>T (Lactase Persistence)",
    rsid: "rs4988235",
    chromosome: "2",
    position: 136608646,
    riskAllele: "C", // C is the ancestral lactase non-persistence allele
    domain: "Intolerances",
    domainLabel: "Food Intolerances & Metabolic Sensitivities",
    evidenceTier: "Tier A",
    clinicalSummary: "MCM6 regulatory enhancer drives intestinal lactase (LCT) transcription past childhood. The ancestral CC genotype causes primary adult hypolactasia (lactose intolerance).",
    genotypes: {
      "TT": {
        riskLevel: "normal",
        riskScore: 0,
        phenotype: "Lactase persistent (LP). Persistent high intestinal lactase into adulthood. Full capacity to digest fresh dairy lactose.",
        dietaryGuidance: "Dairy products well tolerated. Good source of dietary calcium, iodine, and bioavailable protein.",
        supplements: "None required.",
        foodsToPrioritize: ["Fermented yogurt", "Kefir", "Cottage cheese", "Milk"],
        foodsToAvoid: []
      },
      "CT": {
        riskLevel: "mild",
        riskScore: 20,
        phenotype: "Lactase persistent. Sufficient intestinal lactase for standard dietary dairy portions, though individual threshold variations exist.",
        dietaryGuidance: "Standard dairy generally tolerated; moderate single large milk boluses if sensitive.",
        supplements: "Optional lactase enzyme for heavy dairy feasts.",
        foodsToPrioritize: ["Aged cheeses", "Yogurt", "Milk"],
        foodsToAvoid: []
      },
      "CC": {
        riskLevel: "high",
        riskScore: 90,
        phenotype: "Primary Adult Lactase Non-Persistence (Lactose Intolerance). Substantial down-regulation of intestinal brush border lactase. Ingestion of unfermented dairy leads to osmotic diarrhea, cramping, bloating, and gas.",
        dietaryGuidance: "Exclude unfermented milk, cream, and high-lactose dairy. Choose lactose-free dairy or fortified plant milks (almond, oat, soy). Hard aged cheeses (Parmigiano, Cheddar) and fermented kefirs have minimal lactose and may be tolerated.",
        supplements: "Supplemental Lactase enzyme (9000 FCC units) when consuming dairy meals. Ensure alternative Calcium (1000 mg/d) and Vitamin D3.",
        foodsToPrioritize: ["Lactose-free milk", "Aged Parmesan", "Unsweetened fortified plant milk", "Bok choy (calcium)", "Canned sardines with bones"],
        foodsToAvoid: ["Fresh cow's milk", "Soft unripened cheese (Ricotta, Mozzarella)", "Heavy cream", "Ice cream", "Whey concentrate"]
      }
    },
    biomarkers: ["Hydrogen Breath Test", "Serum Calcium"],
    references: ["PMID: 11788828 (Enattah et al., Nat Genet)", "PMID: 19139049"]
  },

  "rs762551": {
    gene: "CYP1A2",
    variantName: "*1F (-163A>C)",
    rsid: "rs762551",
    chromosome: "15",
    position: 75042617,
    riskAllele: "C", // C is slow metabolizer allele
    domain: "Intolerances",
    domainLabel: "Food Intolerances & Metabolic Sensitivities",
    evidenceTier: "Tier A",
    clinicalSummary: "CYP1A2 metabolizes >95% of ingested caffeine. The *1F 'A' allele confers high inducibility (fast clearance), whereas 'C' carriers are slow caffeine metabolizers.",
    genotypes: {
      "AA": {
        riskLevel: "normal",
        riskScore: 0,
        phenotype: "Fast Caffeine Metabolizer (*1A/*1A). Rapid hepatic clearance of caffeine. Moderate to high coffee intake (2-4 cups/day) is cardioprotective with reduced risk of myocardial infarction.",
        dietaryGuidance: "Coffee and tea consumption up to 400 mg caffeine/day (~3-4 cups) is safe and provides antioxidant polyphenolic benefits.",
        supplements: "None specific.",
        foodsToPrioritize: ["Black coffee", "Green tea", "Yerba mate"],
        foodsToAvoid: []
      },
      "AC": {
        riskLevel: "moderate",
        riskScore: 60,
        phenotype: "Slow Caffeine Metabolizer (*1A/*1F). Prolonged caffeine half-life. High caffeine intake (>200 mg/day) is associated with increased risk of hypertension, arterial stiffness, and acute myocardial infarction.",
        dietaryGuidance: "Limit caffeine to <200 mg/day (~1 cup of coffee). Cease all caffeine intake after 12:00 PM to protect sleep architecture and adenosine receptors.",
        supplements: "L-Theanine (100-200 mg) if consuming caffeine to mitigate sympathomimetic vasoconstriction.",
        foodsToPrioritize: ["Decaffeinated coffee", "Herbal infusions (rooibos, peppermint)", "Matcha (lower caffeine, high theanine)"],
        foodsToAvoid: ["Energy drinks (Monster, Red Bull)", "Pre-workout stimulant powders", "Multiple espresso shots", "Caffeine tablets"]
      },
      "CC": {
        riskLevel: "high",
        riskScore: 85,
        phenotype: "Slow Caffeine Metabolizer (*1F/*1F). Very slow caffeine clearance. Heavy coffee intake (>2 cups/day) significantly multiplies the odds ratio of non-fatal myocardial infarction and sustained hypertension.",
        dietaryGuidance: "Strict caffeine restriction (<100 mg/day) or complete elimination. Transition to herbal teas or decaffeinated beverages. Eliminate pre-workout caffeine stimulants.",
        supplements: "Magnesium glycinate (300 mg), Ashwagandha, L-Theanine.",
        foodsToPrioritize: ["Herbal tea (chamomile, ginger, rooibos)", "Chicory root coffee alternative", "Golden milk (turmeric latte)"],
        foodsToAvoid: ["Drip coffee >1 cup", "Cold brew (very high caffeine)", "Energy drinks", "Pre-workout formulas", "Dark chocolate in the evening"]
      }
    },
    biomarkers: ["Systolic/Diastolic Blood Pressure", "Resting Heart Rate"],
    references: ["PMID: 16522833 (Cornelis et al., JAMA)", "PMID: 19578137 (Palatini et al.)"]
  },

  "rs671": {
    gene: "ALDH2",
    variantName: "Glu504Lys (*2)",
    rsid: "rs671",
    chromosome: "12",
    position: 112241766,
    riskAllele: "A", // Encodes Lys -> inactive enzyme
    domain: "Intolerances",
    domainLabel: "Food Intolerances & Metabolic Sensitivities",
    evidenceTier: "Tier A",
    clinicalSummary: "Mitochondrial aldehyde dehydrogenase 2 detoxifies acetaldehyde, a carcinogenic intermediate of ethanol metabolism. The *2 allele causes near-total loss of enzyme activity.",
    genotypes: {
      "GG": {
        riskLevel: "normal",
        riskScore: 0,
        phenotype: "Active ALDH2 (*1/*1). Normal clearance of acetaldehyde.",
        dietaryGuidance: "Standard public health guidance: moderation if consuming alcohol.",
        supplements: "None specific.",
        foodsToPrioritize: ["Balanced whole foods"],
        foodsToAvoid: ["Excessive alcohol"]
      },
      "GA": {
        riskLevel: "high",
        riskScore: 90,
        phenotype: "Heterozygous ALDH2*2 (*1/*2). ~60-80% loss of ALDH2 activity. Pronounced alcohol flush reaction (facial flushing, tachycardia, headache, nausea). Acetaldehyde accumulates 6-10x higher. Severe 6-10x increased risk of esophageal and upper aerodigestive tract squamous cell carcinoma with drinking.",
        dietaryGuidance: "STRICT ALCOHOL RESTRICTION OR TOTAL ABSTINENCE. Avoid the use of H2-blockers/antihistamines taken to suppress flushing (does not prevent acetaldehyde mutagenesis).",
        supplements: "N-Acetylcysteine (NAC 600 mg) and Vitamin C if inadvertent exposure occurs. High dietary antioxidants.",
        foodsToPrioritize: ["Green tea (polyphenols)", "Cruciferous vegetables", "Berries", "Fresh fruit mocktails"],
        foodsToAvoid: ["Beer", "Wine", "Liquor", "Alcoholic cocktails", "Foods cooked with unboiled wine/spirits"]
      },
      "AA": {
        riskLevel: "high",
        riskScore: 100,
        phenotype: "Homozygous ALDH2*2 (*2/*2). Complete absence of ALDH2 enzymatic activity. Severe toxic symptoms even from trace alcohol (mouthwash, extracts, vinegar).",
        dietaryGuidance: "MANDATORY ABSOLUTE ALCOHOL ABSTINENCE. Check food labels for culinary wines, flavor extracts, and fermented sauces containing residual ethanol.",
        supplements: "Glutathione / NAC, Milk Thistle (silymarin).",
        foodsToPrioritize: ["Non-alcoholic whole food beverages", "Electrolyte water", "Vegetable juices"],
        foodsToAvoid: ["ALL alcohol", "Vanilla extract with alcohol base", "Kombucha with >0.5% ABV", "Alcoholic confectioneries"]
      }
    },
    biomarkers: ["Liver Enzymes (ALT, AST, GGT)", "MCV"],
    references: ["PMID: 19323596 (Brooks et al., PLoS Med)", "IARC Monographs Vol 100E"]
  },

  "rs699": {
    gene: "AGT",
    variantName: "M235T (T>C)",
    rsid: "rs699",
    chromosome: "1",
    position: 230844358,
    riskAllele: "C", // Encodes Threonine at 235
    domain: "Intolerances",
    domainLabel: "Salt Sensitivity & Vascular Tone",
    evidenceTier: "Tier A",
    clinicalSummary: "Angiotensinogen is the precursor to angiotensin II in the renin-angiotensin-aldosterone system (RAAS). The 235T (C) variant elevates plasma AGT levels, predisposing to salt-sensitive hypertension.",
    genotypes: {
      "TT": {
        riskLevel: "normal",
        riskScore: 0,
        phenotype: "Normal baseline angiotensinogen levels. Standard blood pressure response to sodium.",
        dietaryGuidance: "Maintain balanced sodium (<2300 mg/day) and potassium intake.",
        supplements: "None specific.",
        foodsToPrioritize: ["Vegetables", "Fruits", "Legumes"],
        foodsToAvoid: ["Extreme sodium excess"]
      },
      "TC": {
        riskLevel: "moderate",
        riskScore: 50,
        phenotype: "Moderate salt sensitivity. Elevated baseline angiotensinogen. Significant blood pressure reduction observed with dietary sodium restriction.",
        dietaryGuidance: "Adopt DASH (Dietary Approaches to Stop Hypertension) diet. Target sodium <1500-1800 mg/day. Increase potassium-rich foods (ratio K:Na > 3:1).",
        supplements: "Potassium citrate (food-first preferred), Magnesium taurate (200-400 mg/d).",
        foodsToPrioritize: ["Spinach", "Avocado", "Sweet potato", "Pomegranate", "Beets"],
        foodsToAvoid: ["Processed deli meats", "Canned soups", "Cured snacks", "Soy sauce"]
      },
      "CC": {
        riskLevel: "high",
        riskScore: 85,
        phenotype: "Pronounced salt sensitivity. Marked elevation of circulating AGT. High susceptibility to arterial stiffening and systolic hypertension on standard sodium intakes.",
        dietaryGuidance: "Strict sodium restriction (<1500 mg/day). Follow strict DASH eating plan. Maintain high potassium intake (>3500 mg/day from whole foods). Replace table salt with potassium chloride or herbs/spices.",
        supplements: "Magnesium taurate (300-400 mg/day), CoQ10, Hawthorn berry extract.",
        foodsToPrioritize: ["Swiss chard", "Bananas", "Wild salmon", "Garlic", "Lemon juice as salt alternative"],
        foodsToAvoid: ["Table salt / Sea salt", "Pickled foods", "Fast food", "Processed cheeses", "Frozen ready meals"]
      }
    },
    biomarkers: ["Systolic & Diastolic Blood Pressure", "Serum Electrolytes (Na+, K+)"],
    references: ["PMID: 15308734", "PMID: 9459528 (Hunt et al., Hypertension)"]
  },

  // ==========================================
  // DOMAIN 5: DETOXIFICATION & ANTIOXIDANT DEFENSE
  // ==========================================
  "rs1695": {
    gene: "GSTP1",
    variantName: "Ile105Val (A>G)",
    rsid: "rs1695",
    chromosome: "11",
    position: 67353504,
    riskAllele: "G", // Valine allele (lower catalytic stability)
    domain: "Detoxification",
    domainLabel: "Detoxification & Antioxidant Defense",
    evidenceTier: "Tier B",
    clinicalSummary: "Glutathione S-transferase P1 conjugates reduced glutathione to reactive electrophiles, xenobiotics, and lipid peroxides. The 105Val (G) variant has altered catalytic efficiency and thermal stability.",
    genotypes: {
      "AA": { // Ile/Ile
        riskLevel: "normal",
        riskScore: 0,
        phenotype: "Normal Phase II GSTP1 conjugation activity.",
        dietaryGuidance: "Standard intake of dietary antioxidants and cruciferous vegetables.",
        supplements: "Standard antioxidant support.",
        foodsToPrioritize: ["Broccoli", "Cabbage", "Berries"],
        foodsToAvoid: []
      },
      "AG": { // Ile/Val
        riskLevel: "mild",
        riskScore: 40,
        phenotype: "Intermediate Phase II conjugation efficiency. Highly responsive to sulforaphane induction.",
        dietaryGuidance: "Include cruciferous vegetables (broccoli sprouts, kale) daily to stimulate Nrf2-mediated Phase II enzyme upregulation.",
        supplements: "Broccoli sprout extract (standardized sulforaphane 20-30 mg/day).",
        foodsToPrioritize: ["Broccoli sprouts", "Watercress", "Radishes", "Garlic", "Onions"],
        foodsToAvoid: ["Charred / well-done meats (heterocyclic amines)"]
      },
      "GG": { // Val/Val
        riskLevel: "moderate",
        riskScore: 75,
        phenotype: "Altered glutathione conjugation; reduced detoxification of reactive electrophiles, cigarette smoke byproducts, and oxidized lipids. Elevated requirement for endogenous glutathione synthesis precursors.",
        dietaryGuidance: "High dietary intake of sulfur-rich foods (alliaceous and brassica vegetables) and dietary polyphenols. Avoid deep-fried foods and charred barbecued meats.",
        supplements: "N-Acetylcysteine (NAC 600-1200 mg/day) + Alpha-Lipoic Acid (300 mg/d) + Liposomal Glutathione (250-500 mg/d).",
        foodsToPrioritize: ["Raw broccoli sprouts", "Arugula", "Brussels sprouts", "Shallots", "Glutathione-rich asparagus"],
        foodsToAvoid: ["Charred/blackened grilled meats", "Deep-fried foods", "High exposure to environmental smoke"]
      }
    },
    biomarkers: ["GGT", "hs-CRP", "Oxidized LDL"],
    references: ["PMID: 9067711 (Zimniak et al.)", "PMID: 15638708"]
  },

  "rs4880": {
    gene: "SOD2",
    variantName: "Ala16Val (T>C)",
    rsid: "rs4880",
    chromosome: "6",
    position: 160085800,
    riskAllele: "C", // Encodes Ala -> more efficient mitochondrial import, but Val (T) causes trapping in membrane
    domain: "Detoxification",
    domainLabel: "Detoxification & Antioxidant Defense",
    evidenceTier: "Tier B",
    clinicalSummary: "Mitochondrial Superoxide Dismutase 2 dismutates superoxide radicals into hydrogen peroxide in mitochondria. The variant modulates mitochondrial targeting sequence processing.",
    genotypes: {
      "TT": { // Val/Val
        riskLevel: "moderate",
        riskScore: 60,
        phenotype: "Val/Val: Lower mitochondrial SOD2 import and lower superoxide clearance capacity inside mitochondria. Prone to mitochondrial oxidative stress.",
        dietaryGuidance: "High dietary antioxidant intake (anthocyanins, polyphenols, vitamin E). Moderate ultra-endurance training without adequate recovery.",
        supplements: "CoQ10 / Ubiquinol (100-200 mg/d), PQQ (Pyrroloquinoline quinone 10-20 mg), Astaxanthin (4-8 mg/d).",
        foodsToPrioritize: ["Wild blueberries", "Dark chocolate (>85%)", "Pomegranate", "Green tea", "Rosemary"],
        foodsToAvoid: ["Excessive oxidized vegetable oils", "High-stress exhaustive exercise without recovery"]
      },
      "TC": { // Ala/Val
        riskLevel: "mild",
        riskScore: 30,
        phenotype: "Ala/Val: Balanced mitochondrial transport and steady-state radical scavenging.",
        dietaryGuidance: "Balanced antioxidant whole-food intake.",
        supplements: "CoQ10 (100 mg/day).",
        foodsToPrioritize: ["Colored berries", "Leafy greens", "Nuts"],
        foodsToAvoid: []
      },
      "CC": { // Ala/Ala
        riskLevel: "mild",
        riskScore: 40,
        phenotype: "Ala/Ala: High mitochondrial import and rapid generation of H2O2 from superoxide. Requires sufficient downstream catalase and glutathione peroxidase to handle peroxide.",
        dietaryGuidance: "Ensure adequate selenium and iron cofactors for glutathione peroxidase and catalase.",
        supplements: "Selenium (100-200 mcg from Brazil nuts or selenomethionine) + Vitamin C.",
        foodsToPrioritize: ["Brazil nuts (1-2 per day for selenium)", "Crimini mushrooms", "Sunflower seeds"],
        foodsToAvoid: ["High iron overload conditions"]
      }
    },
    biomarkers: ["Oxidized LDL", "F2-Isoprostanes (if available)"],
    references: ["PMID: 8878438 (Shimoda-Matsubayashi et al.)", "PMID: 15308734"]
  }
};

// Export for ES modules and browser window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NUTRIGENOMICS_KB };
} else if (typeof window !== 'undefined') {
  window.NUTRIGENOMICS_KB = NUTRIGENOMICS_KB;
}
