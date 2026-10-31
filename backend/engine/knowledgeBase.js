/**
 * NutriGen-CDS Backend: Knowledge Base
 * Ekstrak dari js/data/knowledge_base.js — berisi SNP & genotype data klinis.
 */
const NUTRIGENOMICS_KB = {
  rs1801133: {
    gene: 'MTHFR', rsid: 'rs1801133', chromosome: '1', position: 11856378,
    variantName: 'MTHFR C677T', domain: 'methylation', domainLabel: 'Methylation',
    evidenceTier: 'Tier A',
    clinicalSummary: 'Varian paling dipelajari dalam nutrigenomik. Mengurangi aktivitas enzim MTHFR 30-70%, mengganggu konversi folat ke bentuk aktif.',
    references: ['PMID: 9463314', 'PMID: 16263211'],
    genotypes: {
      CC: { phenotype: 'Normal Enzyme Activity (100%)', riskLevel: 'low', dietaryGuidance: 'Folat standar makanan sudah cukup.' },
      CT: { phenotype: 'Reduced Activity (65%)', riskLevel: 'moderate', dietaryGuidance: 'Prioritaskan folat aktif dari sayuran hijau; hindari asam folat sintetis.' },
      TT: { phenotype: 'Severely Reduced Activity (30%)', riskLevel: 'high', dietaryGuidance: 'Wajib suplemen L-5-MTHF. Hindari suplementasi asam folat sintetis.' }
    }
  },
  rs429358: {
    gene: 'APOE', rsid: 'rs429358', chromosome: '19', position: 45411941,
    variantName: 'APOE ε4 allele', domain: 'fatabolism', domainLabel: 'Fat Metabolism',
    evidenceTier: 'Tier A',
    clinicalSummary: 'Alel ε4 dikaitkan dengan risiko dislipidemia, Alzheimer, dan penyakit kardiovaskular.',
    references: ['PMID: 20028737', 'PMID: 16049006'],
    genotypes: {
      TT: { phenotype: 'APOE ε3/ε3 (Normal)', riskLevel: 'low', dietaryGuidance: 'Diet Mediterania standar.' },
      CT: { phenotype: 'APOE ε3/ε4 Carrier', riskLevel: 'high', dietaryGuidance: 'Batasi lemak jenuh < 7%, ganti dengan EVOO & Omega-3.' },
      CC: { phenotype: 'APOE ε4/ε4 Homozygous', riskLevel: 'high', dietaryGuidance: 'Restriksi ketat lemak jenuh. Pertimbangkan statin berbasis genetik.' }
    }
  },
  rs2228570: {
    gene: 'VDR', rsid: 'rs2228570', chromosome: '12', position: 47879112,
    variantName: 'VDR FokI', domain: 'vitaminMetab', domainLabel: 'Vitamin Metabolism',
    evidenceTier: 'Tier B',
    clinicalSummary: 'Polimorfisme FokI memengaruhi panjang protein reseptor VDR dan efisiensi transkripsi gen respons-Vitamin D.',
    references: ['PMID: 11034462', 'PMID: 19563450'],
    genotypes: {
      CC: { phenotype: 'Longer VDR protein (Lower transcriptional efficiency)', riskLevel: 'high', dietaryGuidance: 'Supplementasi D3 dosis tinggi (3000-5000 IU) + K2 diperlukan.' },
      CT: { phenotype: 'Intermediate VDR efficiency', riskLevel: 'moderate', dietaryGuidance: 'Monitor 25(OH)D secara rutin. Suplemen D3 1000-2000 IU.' },
      TT: { phenotype: 'Shorter VDR protein (Higher transcriptional efficiency)', riskLevel: 'low', dietaryGuidance: 'Paparan sinar matahari teratur cukup pada sebagian besar kasus.' }
    }
  },
  rs7903146: {
    gene: 'TCF7L2', rsid: 'rs7903146', chromosome: '10', position: 112998590,
    variantName: 'TCF7L2 T2D Risk', domain: 'glucoseMetab', domainLabel: 'Glucose Metabolism',
    evidenceTier: 'Tier A',
    clinicalSummary: 'Asosiasi terkuat genetik dengan risiko Diabetes Tipe 2. Mengurangi sekresi insulin yang distimulasi GLP-1.',
    references: ['PMID: 16415884', 'PMID: 17463246'],
    genotypes: {
      CC: { phenotype: 'Normal incretin-insulin axis', riskLevel: 'low', dietaryGuidance: 'Diet seimbang standar.' },
      CT: { phenotype: 'Moderate T2D risk (~1.4x OR)', riskLevel: 'moderate', dietaryGuidance: 'Kurangi karbohidrat GI tinggi. Batasi gula tambahan.' },
      TT: { phenotype: 'High T2D risk (~2.0x OR)', riskLevel: 'high', dietaryGuidance: 'Diet very low-glycemic. Pertimbangkan Myo-Inositol 2g/hari. Monitor HbA1c per 6 bulan.' }
    }
  },
  rs174537: {
    gene: 'FADS1', rsid: 'rs174537', chromosome: '11', position: 61552680,
    variantName: 'FADS1 Delta-5 Desaturase', domain: 'inflammation', domainLabel: 'Inflammation',
    evidenceTier: 'Tier B',
    clinicalSummary: 'Mengatur konversi asam lemak esensial. Carrier T mengalami penurunan konversi ALA → EPA/DHA.',
    references: ['PMID: 19164557'],
    genotypes: {
      GG: { phenotype: 'Efficient ALA conversion to EPA/DHA', riskLevel: 'low', dietaryGuidance: 'Sumber ALA (biji rami, kenari) cukup.' },
      GT: { phenotype: 'Partial FADS1 efficiency reduction', riskLevel: 'moderate', dietaryGuidance: 'Tambahkan minyak ikan (500mg EPA+DHA/hari).' },
      TT: { phenotype: 'Poor ALA-to-EPA/DHA conversion', riskLevel: 'high', dietaryGuidance: 'Wajib suplemen EPA/DHA langsung 1-2g/hari. Hindari mengandalkan sumber nabati saja.' }
    }
  },
  rs1800562: {
    gene: 'HFE', rsid: 'rs1800562', chromosome: '6', position: 26093141,
    variantName: 'HFE C282Y Hemochromatosis', domain: 'fatabolism', domainLabel: 'Iron Metabolism',
    evidenceTier: 'Tier A',
    clinicalSummary: 'Mutasi utama penyebab hemokromatosis herediter. Mengimpair regulasi hepsidin, menyebabkan akumulasi besi berlebih.',
    references: ['PMID: 9140397'],
    genotypes: {
      GG: { phenotype: 'Normal HFE function', riskLevel: 'low', dietaryGuidance: 'Diet normal.' },
      GA: { phenotype: 'HFE Carrier (1 copy C282Y)', riskLevel: 'moderate', dietaryGuidance: 'Monitor ferritin tahunan. Batasi suplemen besi.' },
      AA: { phenotype: 'HFE Homozygous (Iron overload risk high)', riskLevel: 'high', dietaryGuidance: 'Hindari suplemen besi & vitamin C bersamaan. Pertimbangkan flebotomi terapeutik jika ferritin > 200.' }
    }
  }
};

module.exports = { NUTRIGENOMICS_KB };
