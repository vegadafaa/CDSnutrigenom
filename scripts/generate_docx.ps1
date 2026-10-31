param (
    [string]$OutputPath = "..\Arthur_Pendelton_Nutrigenomic_Patient_Report.docx"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not [System.IO.Path]::IsPathRooted($OutputPath)) {
    $OutputPath = Join-Path $scriptDir $OutputPath
}

$tempDir = Join-Path $env:TEMP "nutrigen_docx_$(Get-Random)"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "_rels") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "word") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "word\_rels") -Force | Out-Null

function Write-Utf8File($path, $content) {
    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
}

# 1. [Content_Types].xml
$contentTypes = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>
'@
Write-Utf8File (Join-Path $tempDir "[Content_Types].xml") $contentTypes

# 2. _rels/.rels
$rootRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
'@
Write-Utf8File (Join-Path $tempDir "_rels\.rels") $rootRels

# 3. word/_rels/document.xml.rels
$docRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
'@
Write-Utf8File (Join-Path $tempDir "word\_rels\document.xml.rels") $docRels

# 4. word/styles.xml
$styles = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="22"/>
        <w:color w:val="0F172A"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="276" w:lineRule="auto" w:after="160"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>

  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr>
      <w:spacing w:before="360" w:after="140"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:b/>
      <w:sz w:val="34"/>
      <w:color w:val="0284C7"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr>
      <w:spacing w:before="240" w:after="100"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:b/>
      <w:sz w:val="26"/>
      <w:color w:val="0369A1"/>
    </w:rPr>
  </w:style>
</w:styles>
'@
Write-Utf8File (Join-Path $tempDir "word\styles.xml") $styles

# 5. word/document.xml
$document = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>

    <!-- Header Badge -->
    <w:p>
      <w:pPr><w:jc w:val="left"/><w:spacing w:after="60"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="18"/>
          <w:color w:val="0284C7"/>
        </w:rPr>
        <w:t>NUTRIGEN-CDS PRECISION METABOLIC MEDICINE</w:t>
      </w:r>
    </w:p>

    <!-- Main Title -->
    <w:p>
      <w:pPr><w:jc w:val="left"/><w:spacing w:after="140"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="44"/>
          <w:color w:val="0F172A"/>
        </w:rPr>
        <w:t>Personalized Nutrigenomic Health Blueprint</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr><w:spacing w:after="240"/></w:pPr>
      <w:r>
        <w:rPr><w:i/><w:color w:val="64748B"/><w:sz w:val="22"/></w:rPr>
        <w:t>Translating genetic variants and clinical biomarkers into precision dietary prescriptions.</w:t>
      </w:r>
    </w:p>

    <!-- Patient Metadata Table -->
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9400" w:type="dxa"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
          <w:left w:val="none"/><w:right w:val="none"/><w:insideV w:val="none"/>
        </w:tblBorders>
        <w:tblCellMar>
          <w:top w:w="120" w:type="dxa"/>
          <w:bottom w:w="120" w:type="dxa"/>
          <w:left w:w="160" w:type="dxa"/>
          <w:right w:w="160" w:type="dxa"/>
        </w:tblCellMar>
      </w:tblPr>

      <!-- Row 1 -->
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="4700" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Patient Name: </w:t></w:r><w:r><w:t>Arthur Pendelton</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4700" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Patient ID: </w:t></w:r><w:r><w:t>PT-10492</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <!-- Row 2 -->
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="4700" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Age / Gender: </w:t></w:r><w:r><w:t>54 y.o. | Male</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4700" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Date of Evaluation: </w:t></w:r><w:r><w:t>October 2, 2026</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <!-- Row 3 -->
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="4700" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Clinical BMI / BP: </w:t></w:r><w:r><w:t>28.1 kg/m2 | 138/88 mmHg</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4700" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Primary Goal: </w:t></w:r><w:r><w:t>Cardiovascular Longevity &amp; Energy</w:t></w:r></w:p>
        </w:tc>
      </w:tr>
    </w:tbl>

    <w:p><w:pPr><w:spacing w:before="240" w:after="160"/></w:pPr></w:p>

    <!-- SECTION 1 -->
    <w:p>
      <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
      <w:r><w:t>1. Executive Overview: What Your DNA Means For You</w:t></w:r>
    </w:p>

    <w:p>
      <w:r>
        <w:t>Your genetic test analyzed actionable single nucleotide polymorphisms across five core metabolic domains. Your profile shows specific biochemical points where targeted food and supplement choices produce immediate improvements in cardiovascular defense, cellular vitality, and metabolic health:</w:t>
      </w:r>
    </w:p>

    <!-- Scorecard 1 -->
    <w:p>
      <w:pPr><w:spacing w:before="120" w:after="60"/></w:pPr>
      <w:r><w:b/><w:color w:val="DC2626"/><w:t>[PRIORITY ACTION] Cellular Methylation &amp; Homocysteine Clearance</w:t></w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>You carry the homozygous MTHFR C677T (TT) genotype. Your MTHFR enzyme converts folate at only 30-35% of typical capacity. Combined with your baseline plasma homocysteine of 17.8 umol/L (optimal is &lt;9.0), your vascular lining is experiencing active metabolic strain. Synthetic folic acid (from fortified cereals, energy drinks, and cheap multivitamins) cannot be properly processed by your body. You require bioavailable L-5-methyltetrahydrofolate (L-5-MTHF) paired with Vitamin B12 to bypass this bottleneck.</w:t>
      </w:r>
    </w:p>

    <!-- Scorecard 2 -->
    <w:p>
      <w:pPr><w:spacing w:before="120" w:after="60"/></w:pPr>
      <w:r><w:b/><w:color w:val="DC2626"/><w:t>[PRIORITY ACTION] Cardiovascular &amp; Saturated Fat Sensitivity (APOE4)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>You are an APOE e4 carrier (CT genotype). Individuals with APOE4 down-regulate liver LDL receptors when exposed to saturated fats (butter, coconut oil, heavy cream, fatty beef). Saturated fats cause a sharp elevation in atherogenic LDL particles and ApoB. In contrast, your system is a "super-responder" to monounsaturated fats (extra virgin olive oil, avocado) and cold-water marine omega-3s.</w:t>
      </w:r>
    </w:p>

    <!-- Scorecard 3 -->
    <w:p>
      <w:pPr><w:spacing w:before="120" w:after="60"/></w:pPr>
      <w:r><w:b/><w:color w:val="D97706"/><w:t>[MODERATE ATTENTION] Satiety Regulation &amp; Carbohydrate Handling</w:t></w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>Your FTO (AA) and TCF7L2 (CT) variants blunt postprandial ghrelin suppression and reduce incretin-stimulated insulin release. Snacking on refined carbohydrates leads to rapid hunger return and blood sugar swings. A higher-protein (28%), lower-glycemic Mediterranean plan preserves satiety and stabilizes glucose.</w:t>
      </w:r>
    </w:p>

    <!-- Scorecard 4 -->
    <w:p>
      <w:pPr><w:spacing w:before="120" w:after="60"/></w:pPr>
      <w:r><w:b/><w:color w:val="D97706"/><w:t>[MODERATE ATTENTION] Slow Caffeine Metabolism (CYP1A2)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>You are a slow caffeine metabolizer (CYP1A2 *1F carrier). Consuming greater than 2 cups of coffee per day significantly extends caffeine half-life in your bloodstream, elevating daytime blood pressure and disturbing restorative sleep. Limit coffee to 1 cup before 10:00 AM.</w:t>
      </w:r>
    </w:p>

    <w:p><w:pPr><w:spacing w:before="240" w:after="160"/></w:pPr></w:p>

    <!-- SECTION 2 -->
    <w:p>
      <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
      <w:r><w:t>2. Your Daily Precision Nutritional Blueprint</w:t></w:r>
    </w:p>

    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9400" w:type="dxa"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="0284C7"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="0284C7"/>
          <w:left w:val="single" w:sz="6" w:space="0" w:color="0284C7"/>
          <w:right w:val="single" w:sz="6" w:space="0" w:color="0284C7"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
        </w:tblBorders>
        <w:tblCellMar>
          <w:top w:w="140" w:type="dxa"/><w:bottom w:w="140" w:type="dxa"/>
          <w:left w:w="160" w:type="dxa"/><w:right w:w="160" w:type="dxa"/>
        </w:tblCellMar>
      </w:tblPr>

      <w:tr>
        <w:tc><w:tcPr><w:tcW w:w="2350" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="E0F2FE"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Daily Caloric Target</w:t></w:r></w:p>
        </w:tc>
        <w:tc><w:tcPr><w:tcW w:w="2350" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="E0F2FE"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Carbohydrates (35%)</w:t></w:r></w:p>
        </w:tc>
        <w:tc><w:tcPr><w:tcW w:w="2350" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="E0F2FE"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Protein Target (28%)</w:t></w:r></w:p>
        </w:tc>
        <w:tc><w:tcPr><w:tcW w:w="2350" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="E0F2FE"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Healthy Fats (37%)</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <w:tr>
        <w:tc><w:tcPr><w:tcW w:w="2350" w:type="dxa"/></w:tcPr>
          <w:p><w:r><w:b/><w:sz w:val="28"/><w:color w:val="0284C7"/><w:t>1,850 kcal/day</w:t></w:r></w:p>
          <w:p><w:r><w:sz w:val="18"/><w:color w:val="64748B"/><w:t>Calibrated for metabolic rejuvenation</w:t></w:r></w:p>
        </w:tc>
        <w:tc><w:tcPr><w:tcW w:w="2350" w:type="dxa"/></w:tcPr>
          <w:p><w:r><w:b/><w:sz w:val="28"/><w:color w:val="0284C7"/><w:t>160 grams</w:t></w:r></w:p>
          <w:p><w:r><w:sz w:val="18"/><w:color w:val="64748B"/><w:t>Low-glycemic: lentils, berries, greens</w:t></w:r></w:p>
        </w:tc>
        <w:tc><w:tcPr><w:tcW w:w="2350" w:type="dxa"/></w:tcPr>
          <w:p><w:r><w:b/><w:sz w:val="28"/><w:color w:val="0284C7"/><w:t>130 grams</w:t></w:r></w:p>
          <w:p><w:r><w:sz w:val="18"/><w:color w:val="64748B"/><w:t>1.4-1.5g/kg to trigger satiety peptides</w:t></w:r></w:p>
        </w:tc>
        <w:tc><w:tcPr><w:tcW w:w="2350" w:type="dxa"/></w:tcPr>
          <w:p><w:r><w:b/><w:sz w:val="28"/><w:color w:val="0284C7"/><w:t>75 grams</w:t></w:r></w:p>
          <w:p><w:r><w:sz w:val="18"/><w:color w:val="DC2626"/><w:t>Saturated fat &lt;6% (&lt;12g/day)</w:t></w:r></w:p>
        </w:tc>
      </w:tr>
    </w:tbl>

    <w:p><w:pPr><w:spacing w:before="240" w:after="160"/></w:pPr></w:p>

    <!-- SECTION 3 -->
    <w:p>
      <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
      <w:r><w:t>3. Sample 1-Day Precision Meal Plan</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:spacing w:before="100" w:after="40"/></w:pPr>
      <w:r><w:b/><w:color w:val="0284C7"/><w:t>Breakfast (8:00 AM) - Pasture Eggs &amp; Spinach Saute</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>2 pasture-raised eggs scrambled in 1 tsp olive oil with 2 cups baby spinach (natural food folates &amp; choline), 1/4 sliced avocado (MUFA), 1 slice toasted sprouted grain sourdough, and 1 cup sencha green tea.</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:spacing w:before="100" w:after="40"/></w:pPr>
      <w:r><w:b/><w:color w:val="0284C7"/><w:t>Lunch (12:30 PM) - Mediterranean Wild Salmon &amp; Arugula Bowl</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>5 oz grilled wild Alaskan sockeye salmon, mixed arugula and romaine, sliced cucumbers, 1 tbsp raw walnuts, dressed generously with 1.5 tbsp extra virgin olive oil and fresh lemon juice.</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:spacing w:before="100" w:after="40"/></w:pPr>
      <w:r><w:b/><w:color w:val="0284C7"/><w:t>Afternoon Snack (4:00 PM) - Metabolic Power Snack</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>A small handful of raw pumpkin seeds (rich in magnesium to support vascular relaxation) with 1/2 cup fresh wild blueberries and herbal peppermint tea.</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:spacing w:before="100" w:after="40"/></w:pPr>
      <w:r><w:b/><w:color w:val="0284C7"/><w:t>Dinner (7:00 PM) - Rosemary Chicken &amp; Steamed Brassica</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>6 oz skinless chicken breast baked with fresh rosemary and minced garlic, accompanied by 2 cups steamed broccoli florets (sulforaphane for Phase II GSTP1 detox) and 1/2 roasted sweet potato.</w:t></w:r>
    </w:p>

    <w:p><w:pPr><w:spacing w:before="240" w:after="160"/></w:pPr></w:p>

    <!-- SECTION 4 -->
    <w:p>
      <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
      <w:r><w:t>4. Kitchen &amp; Grocery "Swap This for That" Guide</w:t></w:r>
    </w:p>

    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9400" w:type="dxa"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
        </w:tblBorders>
        <w:tblCellMar>
          <w:top w:w="120" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/>
          <w:left w:w="160" w:type="dxa"/><w:right w:w="160" w:type="dxa"/>
        </w:tblCellMar>
      </w:tblPr>

      <w:tr>
        <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="DCFCE7"/></w:tcPr>
          <w:p><w:r><w:b/><w:color w:val="166534"/><w:t>PRIORITIZE (Stock in Pantry &amp; Fridge)</w:t></w:r></w:p>
        </w:tc>
        <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="FEE2E2"/></w:tcPr>
          <w:p><w:r><w:b/><w:color w:val="991B1B"/><w:t>AVOID / SWAP OUT (Leave on the Shelf)</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <w:tr>
        <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Extra Virgin Olive Oil &amp; Avocado</w:t></w:r></w:p>
          <w:p><w:r><w:sz w:val="18"/><w:t>Provides MUFAs that preserve LDL receptor sensitivity in APOE4.</w:t></w:r></w:p>
        </w:tc>
        <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Butter, Ghee, Coconut Oil, &amp; Heavy Cream</w:t></w:r></w:p>
          <w:p><w:r><w:sz w:val="18"/><w:t>Saturated fat dramatically spikes atherogenic ApoB and LDL-P particles.</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <w:tr>
        <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Dark Leafy Greens (Spinach, Romaine, Arugula)</w:t></w:r></w:p>
          <w:p><w:r><w:sz w:val="18"/><w:t>Abundant natural dietary folate to bypass MTHFR block.</w:t></w:r></w:p>
        </w:tc>
        <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Synthetic Folic Acid Fortified Flours &amp; Cereals</w:t></w:r></w:p>
          <w:p><w:r><w:sz w:val="18"/><w:t>Unmetabolized synthetic folic acid accumulates in MTHFR TT genotype.</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <w:tr>
        <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Wild Alaskan Salmon, Sardines, &amp; Mackerel</w:t></w:r></w:p>
          <w:p><w:r><w:sz w:val="18"/><w:t>Direct preformed EPA/DHA to bypass FADS1 desaturase limitations.</w:t></w:r></w:p>
        </w:tc>
        <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Industrial Seed Oils (Corn, Soybean, Cottonseed)</w:t></w:r></w:p>
          <w:p><w:r><w:sz w:val="18"/><w:t>Excess linoleic acid competitively exhausts remaining desaturase enzymes.</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <w:tr>
        <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Morning Green Tea or Single Small Drip Coffee</w:t></w:r></w:p>
          <w:p><w:r><w:sz w:val="18"/><w:t>Cardioprotective polyphenols without excessive afternoon caffeine.</w:t></w:r></w:p>
        </w:tc>
        <w:tc><w:tcPr><w:tcW w:w="4700" w:type="dxa"/></w:tcPr>
          <w:p><w:r><w:b/><w:t>Afternoon Energy Drinks, Cold Brews, &amp; Double Espressos</w:t></w:r></w:p>
          <w:p><w:r><w:sz w:val="18"/><w:t>Slow CYP1A2 clearance causes prolonged nocturnal vasoconstriction.</w:t></w:r></w:p>
        </w:tc>
      </w:tr>
    </w:tbl>

    <w:p><w:pPr><w:spacing w:before="240" w:after="160"/></w:pPr></w:p>

    <!-- SECTION 5 -->
    <w:p>
      <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
      <w:r><w:t>5. Daily Precision Supplement Protocol</w:t></w:r>
    </w:p>

    <w:p>
      <w:r>
        <w:t>Because of your genetic enzyme variations and current medications (Metformin and Atorvastatin), standard drugstore multivitamins are ineffective or missing crucial active forms. The following protocol provides active, bioavailable nutrients:</w:t>
      </w:r>
    </w:p>

    <!-- Supplement 1 -->
    <w:p>
      <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
      <w:r><w:b/><w:color w:val="0284C7"/><w:t>1. Active Methylfolate (L-5-MTHF / Quatrefolic) - 800 to 1,000 mcg daily</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:i/><w:t>Timing: Morning with breakfast. </w:t></w:r>
      <w:r><w:t>Directly supplies the active methylated folate required by methionine synthase, bypassing the MTHFR C677T block to lower your plasma homocysteine.</w:t></w:r>
    </w:p>

    <!-- Supplement 2 -->
    <w:p>
      <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
      <w:r><w:b/><w:color w:val="0284C7"/><w:t>2. Active Vitamin B12 (Methylcobalamin) - 1,000 mcg sublingual daily</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:i/><w:t>Timing: Morning with breakfast. </w:t></w:r>
      <w:r><w:t>Compensates for Metformin-induced ileal B12 malabsorption and works in tandem with L-5-MTHF to clear homocysteine.</w:t></w:r>
    </w:p>

    <!-- Supplement 3 -->
    <w:p>
      <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
      <w:r><w:b/><w:color w:val="0284C7"/><w:t>3. Vitamin D3 + K2 (all-trans MK-7) - 4,000 IU D3 + 100 mcg K2 daily</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:i/><w:t>Timing: With meal containing healthy fats. </w:t></w:r>
      <w:r><w:t>Overcomes your VDR FokI (ff) lower receptor affinity and corrects your baseline 25(OH)D level (22.4 ng/mL) to the therapeutic 50-70 ng/mL range.</w:t></w:r>
    </w:p>

    <!-- Supplement 4 -->
    <w:p>
      <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
      <w:r><w:b/><w:color w:val="0284C7"/><w:t>4. High-Potency Omega-3 (EPA/DHA) - 1,500 to 2,000 mg daily</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:i/><w:t>Timing: Evening with dinner. </w:t></w:r>
      <w:r><w:t>Provides neurovascular and endothelial anti-inflammatory protection for your APOE4 carrier status.</w:t></w:r>
    </w:p>

    <!-- Supplement 5 -->
    <w:p>
      <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
      <w:r><w:b/><w:color w:val="0284C7"/><w:t>5. Ubiquinol (Active CoQ10) - 100 to 200 mg daily</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:i/><w:t>Timing: Morning with breakfast. </w:t></w:r>
      <w:r><w:t>Replenishes muscle mitochondrial CoQ10 depleted by daily Atorvastatin therapy, preventing muscle fatigue.</w:t></w:r>
    </w:p>

    <!-- Supplement 6 -->
    <w:p>
      <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
      <w:r><w:b/><w:color w:val="0284C7"/><w:t>6. Magnesium Bisglycinate - 300 to 400 mg daily</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:i/><w:t>Timing: 1 hour before sleep. </w:t></w:r>
      <w:r><w:t>Supports restorative deep sleep, smooth vascular muscle relaxation, and serves as an essential cofactor for over 300 cellular enzymes.</w:t></w:r>
    </w:p>

    <w:p><w:pPr><w:spacing w:before="240" w:after="160"/></w:pPr></w:p>

    <!-- SECTION 6 -->
    <w:p>
      <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
      <w:r><w:t>6. Laboratory Surveillance Schedule (10 to 12 Weeks)</w:t></w:r>
    </w:p>

    <w:p>
      <w:r>
        <w:t>Bring this checklist to your primary care physician or laboratory in 10-12 weeks to monitor your metabolic response:</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:r><w:b/><w:t>• Plasma Homocysteine: </w:t></w:r>
      <w:r><w:t>Baseline was 17.8 umol/L. Target goal is &lt; 9.0 umol/L on active L-5-MTHF therapy.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:b/><w:t>• Serum 25-Hydroxyvitamin D [25(OH)D]: </w:t></w:r>
      <w:r><w:t>Baseline was 22.4 ng/mL. Target therapeutic goal is 50 - 70 ng/mL.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:b/><w:t>• Advanced Lipid Panel + ApoB: </w:t></w:r>
      <w:r><w:t>Monitor atherogenic particle response to dietary saturated fat restriction.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:b/><w:t>• Serum B12 &amp; Methylmalonic Acid (MMA): </w:t></w:r>
      <w:r><w:t>Confirm cellular B12 sufficiency while continuing Metformin.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:b/><w:t>• Fasting Glucose &amp; HbA1c: </w:t></w:r>
      <w:r><w:t>Assess glycemic stability on the higher-protein, low-glycemic dietary prescription.</w:t></w:r>
    </w:p>

    <w:p><w:pPr><w:spacing w:before="360" w:after="120"/></w:pPr></w:p>
    <w:p>
      <w:r>
        <w:rPr><w:i/><w:sz w:val="18"/><w:color w:val="94A3B8"/></w:rPr>
        <w:t>Notice: This personalized report was generated by NutriGen-CDS. Clinical recommendations should be reviewed in partnership with your treating physician or licensed dietitian.</w:t>
      </w:r>
    </w:p>

  </w:body>
</w:document>
'@
Write-Utf8File (Join-Path $tempDir "word\document.xml") $document

# 6. Compress directory to .zip first, then rename to .docx
$zipPath = Join-Path $env:TEMP "nutrigen_temp_$(Get-Random).zip"
if (Test-Path $zipPath) { Remove-Item -Path $zipPath -Force }
if (Test-Path $OutputPath) { Remove-Item -Path $OutputPath -Force }

$outputParent = Split-Path $OutputPath
if (-not (Test-Path $outputParent)) {
    New-Item -ItemType Directory -Path $outputParent -Force | Out-Null
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force
Move-Item -Path $zipPath -Destination $OutputPath -Force
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Successfully generated native Word (.docx) document: $OutputPath"
