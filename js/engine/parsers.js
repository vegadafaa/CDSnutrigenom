/**
 * NutriGen-CDS: Genomic Data Ingestion & Parser Engine
 * Robust parsers for VCF v4.2, 23andMe/Ancestry raw data text, and JSON profiles.
 */

const GenomicParsers = {
  /**
   * Parse standard VCF (Variant Call Format) text
   * @param {string} vcfText - Full VCF file content
   * @param {object} knowledgeBase - Reference KB to match rsids and positions
   * @returns {object} Extracted and normalized genotypes
   */
  parseVCF: function(vcfText, knowledgeBase = (typeof NUTRIGENOMICS_KB !== 'undefined' ? NUTRIGENOMICS_KB : {})) {
    const lines = vcfText.split(/\r?\n/);
    const parsedGenotypes = {};
    let sampleColumnIndex = 9; // Default 10th column in VCF is first sample

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Header handling
      if (line.startsWith("##")) continue;
      if (line.startsWith("#CHROM")) {
        const headerCols = line.split(/\t/);
        if (headerCols.length > 9) {
          sampleColumnIndex = 9;
        }
        continue;
      }

      // Data line: CHROM POS ID REF ALT QUAL FILTER INFO FORMAT SAMPLE
      const cols = line.split(/\t/);
      if (cols.length < 5) continue;

      const chrom = cols[0].replace(/^chr/i, "");
      const pos = parseInt(cols[1], 10);
      const id = cols[2];
      const ref = cols[3];
      const alt = cols[4];
      const format = cols[8] || "GT";
      const sample = cols[sampleColumnIndex] || "0/0";

      // Match either by rsID or by Chromosome:Position against knowledge base
      let matchedKbEntry = null;
      let targetRsid = id;

      if (id && knowledgeBase[id]) {
        matchedKbEntry = knowledgeBase[id];
        targetRsid = id;
      } else {
        // Search by chrom & position
        for (const [rs, entry] of Object.entries(knowledgeBase)) {
          if (entry.chromosome === chrom && Math.abs(entry.position - pos) <= 1) {
            matchedKbEntry = entry;
            targetRsid = rs;
            break;
          }
        }
      }

      if (!matchedKbEntry) continue;

      // Extract GT genotype call
      const formatFields = format.split(":");
      const sampleFields = sample.split(":");
      const gtIdx = formatFields.indexOf("GT");
      const gtString = gtIdx !== -1 && sampleFields[gtIdx] ? sampleFields[gtIdx] : sampleFields[0] || "0/0";

      // Parse allele indices (e.g. 0/1, 1/1, 0|1)
      const alleleIndices = gtString.split(/[/|]/).map(idx => parseInt(idx, 10));
      const allelesList = [ref, ...alt.split(",")];

      let callAlleles = [];
      for (const idx of alleleIndices) {
        if (!isNaN(idx) && allelesList[idx] !== undefined) {
          callAlleles.push(allelesList[idx]);
        }
      }

      if (callAlleles.length === 1) {
        callAlleles.push(callAlleles[0]); // homozygous
      }

      let genotype = callAlleles.sort().join("").toUpperCase();
      genotype = this.normalizeGenotype(targetRsid, genotype, matchedKbEntry);

      parsedGenotypes[targetRsid] = {
        rsid: targetRsid,
        gene: matchedKbEntry.gene,
        variantName: matchedKbEntry.variantName,
        genotype: genotype,
        rawCall: gtString,
        source: "VCF"
      };
    }

    return parsedGenotypes;
  },

  /**
   * Parse 23andMe / AncestryDNA raw genotype text format
   * Format: # rsid chromosome position genotype (e.g. rs1801133 1 11856378 TT)
   */
  parse23andMe: function(rawText, knowledgeBase = (typeof NUTRIGENOMICS_KB !== 'undefined' ? NUTRIGENOMICS_KB : {})) {
    const lines = rawText.split(/\r?\n/);
    const parsedGenotypes = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith("#")) continue;

      // Tab or whitespace delimited
      const parts = line.split(/\s+/);
      if (parts.length < 4) continue;

      const rsid = parts[0];
      const chrom = parts[1].replace(/^chr/i, "");
      const pos = parseInt(parts[2], 10);
      let rawGenotype = parts[3].toUpperCase();

      // Check if known in KB
      const kbEntry = knowledgeBase[rsid];
      if (kbEntry) {
        if (rawGenotype.length === 1 && rawGenotype !== "-" && rawGenotype !== "D" && rawGenotype !== "I") {
          rawGenotype = rawGenotype + rawGenotype; // e.g. T -> TT
        }

        const normalizedGt = this.normalizeGenotype(rsid, rawGenotype, kbEntry);
        parsedGenotypes[rsid] = {
          rsid: rsid,
          gene: kbEntry.gene,
          variantName: kbEntry.variantName,
          genotype: normalizedGt,
          rawCall: rawGenotype,
          source: "23andMe/Ancestry"
        };
      }
    }

    return parsedGenotypes;
  },

  /**
   * Normalize genotype alleles handling forward/reverse complement if needed
   */
  normalizeGenotype: function(rsid, genotype, kbEntry) {
    if (!genotype || genotype === "--" || genotype === "??") return "UNKNOWN";
    
    // Sort letters alphabetically (e.g. TC -> CT, GA -> AG)
    const sorted = genotype.split("").sort().join("");
    
    // If exact match in KB entry genotypes, return it
    if (kbEntry && kbEntry.genotypes && kbEntry.genotypes[sorted]) {
      return sorted;
    }

    // Check complement (A<->T, C<->G)
    const complementMap = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
    const complemented = sorted.split("").map(b => complementMap[b] || b).sort().join("");
    if (kbEntry && kbEntry.genotypes && kbEntry.genotypes[complemented]) {
      return complemented;
    }

    return sorted;
  },

  /**
   * Automatically detect format (VCF vs 23andMe vs JSON) and parse
   */
  autoParse: function(fileContent, knowledgeBase) {
    const trimmed = fileContent.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        const json = JSON.parse(trimmed);
        if (json.genotypes) return json.genotypes;
        return json;
      } catch (e) {
        console.error("JSON parse error", e);
      }
    }

    if (trimmed.includes("##fileformat=VCF") || trimmed.includes("#CHROM\tPOS\tID")) {
      return this.parseVCF(trimmed, knowledgeBase);
    }

    return this.parse23andMe(trimmed, knowledgeBase);
  },

  /**
   * Parse lab data from JSON or simple CSV and return a normalized object
   */
  parseLabData: function(fileContent) {
    const trimmed = fileContent.trim();
    let labs = {};
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        const json = JSON.parse(trimmed);
        if (json.biomarkers) return json.biomarkers;
        return json;
      } catch (e) {
        console.error("JSON parse error for lab data", e);
      }
    } else {
      // Very basic CSV parsing (Key,Value,Unit)
      const lines = trimmed.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith("Biomarker") || line.startsWith("Key")) continue;
        const parts = line.split(",");
        if (parts.length >= 2) {
          labs[parts[0].trim()] = { value: parseFloat(parts[1].trim()), unit: parts[2] ? parts[2].trim() : "", status: "Pending" };
        }
      }
      return labs;
    }
    return labs;
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GenomicParsers };
} else if (typeof window !== 'undefined') {
  window.GenomicParsers = GenomicParsers;
}
