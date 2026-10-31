/**
 * NutriGen-CDS: Clinical Report & Care Plan Renderer
 * Renders Clinician SOAP note, Patient Action Plan, and interactive FHIR JSON viewer.
 */

const ReportView = {
  /**
   * Render Clinician SOAP consultation summary
   */
  renderSoapReport: function(patient, evaluation) {
    const macro = evaluation.macronutrientRx || {};
    const domains = evaluation.domainAssessments || {};
    const epistasis = evaluation.epistasisAlerts || [];
    const safety = evaluation.safetyAlerts || [];
    const concordance = evaluation.concordanceAlerts || [];
    const supplements = evaluation.supplementFormulary || [];
    const monitoring = evaluation.monitoringSchedule || [];

    return `
      <div class="clinical-soap-document">
        <header class="soap-header">
          <div class="soap-header-main">
            <h2>Clinical Nutrigenomic Consultation & Decision Support Summary</h2>
            <div class="soap-subtitle">Standardized Precision Medicine Documentation | HL7 FHIR Interoperable</div>
          </div>
          <div class="soap-meta-grid">
            <div><strong>Patient:</strong> ${patient.name} (${patient.id})</div>
            <div><strong>Date of Evaluation:</strong> ${new Date().toLocaleDateString()}</div>
            <div><strong>Age / Gender:</strong> ${patient.age} y.o. | ${patient.gender.toUpperCase()}</div>
            <div><strong>Clinical BMI / BP:</strong> ${patient.bmi} kg/m² | ${patient.bloodPressure || 'N/A'} mmHg</div>
          </div>
        </header>

        <!-- S: SUBJECTIVE -->
        <section class="soap-section">
          <h3 class="soap-section-title">1. S - Subjective</h3>
          <div class="soap-content">
            <p><strong>Baseline Dietary Pattern:</strong> ${patient.dietPattern || 'Omnivore'}</p>
            <p><strong>Chief Complaints & Symptoms:</strong> ${(patient.symptoms || []).join('; ') || 'None reported'}</p>
            <p><strong>Primary Health Goals:</strong> ${(patient.primaryGoals || []).join('; ') || 'Optimization'}</p>
            <p><strong>Current Lifestyle Exposures:</strong> Caffeine: ${patient.dailyCaffeineCups || 0} cups/day | Alcohol: ${patient.dailyAlcoholDrinks || 0} drinks/day</p>
            <p><strong>Reported Medications:</strong> ${(patient.medications || []).join(', ') || 'None'}</p>
            <p><strong>Current Supplements:</strong> ${(patient.supplements || []).join(', ') || 'None'}</p>
          </div>
        </section>

        <!-- O: OBJECTIVE -->
        <section class="soap-section">
          <h3 class="soap-section-title">2. O - Objective (Genomics & Biomarkers)</h3>
          <div class="soap-content">
            <h4>A. Clinical Laboratory Biomarkers</h4>
            <div class="table-responsive">
              <table class="clinical-table">
                <thead>
                  <tr>
                    <th>Biomarker</th>
                    <th>Measured Value</th>
                    <th>Reference Range</th>
                    <th>Clinical Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(patient.biomarkers || {}).map(([k, lab]) => `
                    <tr>
                      <td><strong>${k}</strong></td>
                      <td>${lab.value} ${lab.unit}</td>
                      <td>${lab.reference}</td>
                      <td><span class="badge ${lab.status && lab.status.includes('elevated') ? 'badge-high' : (lab.status && lab.status.includes('deficient') ? 'badge-high' : 'badge-optimal')}">${lab.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <h4 style="margin-top: 1rem;">B. Selected Nutrigenomic Variants (Actionable SNVs)</h4>
            <div class="table-responsive">
              <table class="clinical-table">
                <thead>
                  <tr>
                    <th>Gene</th>
                    <th>Variant (rsID)</th>
                    <th>Genotype</th>
                    <th>Domain</th>
                    <th>Evidence Tier</th>
                    <th>Phenotype Implication</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.values(domains).flatMap(d => d.snpResults).map(snp => `
                    <tr>
                      <td><strong>${snp.gene}</strong></td>
                      <td>${snp.variantName} (${snp.rsid})</td>
                      <td><code class="genotype-tag">${snp.genotype}</code></td>
                      <td>${snp.gene}</td>
                      <td><span class="tier-pill ${snp.evidenceTier.toLowerCase().replace(' ', '-')}">${snp.evidenceTier}</span></td>
                      <td>${snp.phenotype}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- A: ASSESSMENT -->
        <section class="soap-section">
          <h3 class="soap-section-title">3. A - Assessment (CDS Syntheses & Epistasis)</h3>
          <div class="soap-content">
            <div class="overall-risk-banner ${evaluation.overallRiskStatus.class}">
              <strong>OVERALL CLINICAL RISK STATUS:</strong> ${evaluation.overallRiskStatus.level}
            </div>

            ${safety.length > 0 ? `
              <div class="safety-alerts-box" style="margin-top: 1rem;">
                <h4 style="color: #b91c1c;">Critical Safety Warnings & Contraindications:</h4>
                ${safety.map(s => `
                  <div class="alert-item alert-${s.severity}">
                    <strong>${s.title}</strong>
                    <p>${s.alertText || s.mechanism}</p>
                    <p class="action-highlight"><strong>Clinical Directive:</strong> ${s.clinicalDirective}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${concordance.length > 0 ? `
              <div class="concordance-box" style="margin-top: 1rem;">
                <h4 style="color: #0369a1;">Biomarker-Genotype Concordance Evaluations:</h4>
                ${concordance.map(c => `
                  <div class="concordance-item priority-${c.priority.toLowerCase()}">
                    <div class="conc-header">
                      <strong>${c.title}</strong>
                      <span class="badge badge-${c.priority.toLowerCase()}">${c.priority}</span>
                    </div>
                    <p><em>${c.biomarker} | ${c.genotype}</em></p>
                    <p>${c.clinicalSignificance}</p>
                    <p class="action-highlight"><strong>Action:</strong> ${c.actionDirective}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${epistasis.length > 0 ? `
              <div class="epistasis-box" style="margin-top: 1rem;">
                <h4 style="color: #7c3aed;">Multi-Gene Epistasis & Synergistic Interactions:</h4>
                ${epistasis.map(e => `
                  <div class="epistasis-item">
                    <strong>${e.title} [${e.evidenceTier}]</strong>
                    <p>${e.mechanism}</p>
                    <p class="action-highlight"><strong>Directive:</strong> ${e.clinicalDirective}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </section>

        <!-- P: PLAN -->
        <section class="soap-section">
          <h3 class="soap-section-title">4. P - Plan (Precision Nutrition & Surveillance)</h3>
          <div class="soap-content">
            <h4>A. Macronutrient & Caloric Target Distribution</h4>
            <div class="macro-grid">
              <div class="macro-card">
                <span class="macro-label">Target Energy</span>
                <span class="macro-val">${macro.dailyCalories} kcal/d</span>
                <span class="macro-sub">BMR: ~${macro.bmr} kcal</span>
              </div>
              <div class="macro-card">
                <span class="macro-label">Carbohydrate</span>
                <span class="macro-val">${macro.distribution ? macro.distribution.carbohydrate.grams : 0}g (${macro.distribution ? macro.distribution.carbohydrate.percentage : 0}%)</span>
                <span class="macro-sub">${macro.distribution ? macro.distribution.carbohydrate.focus : ''}</span>
              </div>
              <div class="macro-card">
                <span class="macro-label">Protein</span>
                <span class="macro-val">${macro.distribution ? macro.distribution.protein.grams : 0}g (${macro.distribution ? macro.distribution.protein.percentage : 0}%)</span>
                <span class="macro-sub">${macro.distribution ? macro.distribution.protein.focus : ''}</span>
              </div>
              <div class="macro-card">
                <span class="macro-label">Fat & Saturated Cap</span>
                <span class="macro-val">${macro.distribution ? macro.distribution.fat.grams : 0}g (${macro.distribution ? macro.distribution.fat.percentage : 0}%)</span>
                <span class="macro-sub">${macro.distribution ? macro.distribution.saturatedFatCeiling : ''}</span>
              </div>
            </div>

            <h4 style="margin-top: 1.5rem;">B. Precision Micronutrient & Supplement Formulary</h4>
            <div class="table-responsive">
              <table class="clinical-table">
                <thead>
                  <tr>
                    <th>Nutrient / Target</th>
                    <th>Specific Form</th>
                    <th>Dosage & Timing</th>
                    <th>Clinical Rationale & Evidence</th>
                    <th>Monitoring Goal</th>
                  </tr>
                </thead>
                <tbody>
                  ${supplements.map(sup => `
                    <tr>
                      <td><strong>${sup.nutrient}</strong></td>
                      <td>${sup.form}</td>
                      <td>${sup.dosage}<br/><small class="text-muted">${sup.timing}</small></td>
                      <td>${sup.rationale} <span class="tier-pill ${sup.evidenceTier.toLowerCase().replace(' ', '-')}">${sup.evidenceTier}</span></td>
                      <td>${sup.monitoring}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <h4 style="margin-top: 1.5rem;">C. 8-12 Week Laboratory Follow-Up Schedule</h4>
            <ul>
              ${monitoring.map(m => `
                <li><strong>${m.biomarker} (${m.interval}):</strong> Target: ${m.targetGoal}. <em>${m.clinicalRationale}</em></li>
              `).join('')}
            </ul>
          </div>
        </section>
      </div>
    `;
  },

  /**
   * Render Patient-Facing Nutrition Action Plan
   */
  renderPatientPlan: function(patient, evaluation) {
    const macro = evaluation.macronutrientRx || {};
    const supplements = evaluation.supplementFormulary || [];
    const food = evaluation.foodGuidance || { prioritize: [], restrictOrAvoid: [] };
    const domains = evaluation.domainAssessments || {};
    const monitoring = evaluation.monitoringSchedule || [];

    // Helper for traffic light badges
    const getStatusPill = (pct) => {
      if (pct >= 65) return `<span class="badge badge-high">Priority Focus</span>`;
      if (pct >= 35) return `<span class="badge badge-moderate">Moderate Attention</span>`;
      return `<span class="badge badge-optimal">Optimal / Balanced</span>`;
    };

    return `
      <div class="patient-action-plan">
        
        <!-- Header -->
        <header class="patient-header">
          <div class="badge badge-fhir" style="margin-bottom: 0.5rem; font-size: 0.85rem;">Personalized Genomic Nutrition Plan</div>
          <h2>Your Personal Nutrigenomic Health & Nutrition Blueprint</h2>
          <p class="patient-lead">
            Prepared for <strong>${patient.name}</strong> (ID: ${patient.id}) &bull; Date: ${new Date().toLocaleDateString()}
          </p>
          <p style="max-width: 750px; margin: 0.5rem auto 0; font-size: 0.95rem; color: var(--text-secondary);">
            Your DNA provides the unique biological blueprint for how your body processes nutrients, burns fats, balances energy, and clears metabolic byproducts. This guide translates your genetics into practical daily choices.
          </p>
        </header>

        <!-- 1. Executive Summary: What Your DNA Tells Us -->
        <div class="plan-card">
          <h3 style="color: var(--primary-hover);">&#128161; 1. Executive Overview: What Your DNA Means For You</h3>
          <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
            Based on your genetic markers, your metabolic system has distinct strengths and areas requiring targeted nutritional support:
          </p>
          <div class="patient-scorecard-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
            ${Object.entries(domains).map(([k, d]) => `
              <div class="scorecard-item" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <strong style="font-size: 0.9rem;">${d.name}</strong>
                  ${getStatusPill(d.percentageScore)}
                </div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">
                  ${d.percentageScore >= 65 ? 'Requires daily targeted nutritional adjustment and specific active vitamin forms.' : (d.percentageScore >= 35 ? 'Moderate genetic variations; responsive to healthy dietary habits.' : 'Standard genetic efficiency; maintain balanced whole foods.')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 2. Your Daily Macro Blueprint -->
        <div class="plan-card">
          <h3 style="color: var(--primary-hover);">&#9878; 2. Your Daily Nutritional Blueprint</h3>
          <p style="font-size: 0.95rem;">
            Your genes influence your satiety hormones (ghrelin/leptin) and how your liver handles fats. Here is your genetically optimized daily macronutrient target:
          </p>
          
          <div class="patient-macro-boxes">
            <div class="p-box">
              <div class="p-box-title">Daily Energy</div>
              <div class="p-box-val">${macro.dailyCalories} kcal</div>
              <div class="p-box-desc">Calibrated for your goals and metabolism</div>
            </div>
            <div class="p-box">
              <div class="p-box-title">Carbohydrates (${macro.distribution ? macro.distribution.carbohydrate.percentage : 0}%)</div>
              <div class="p-box-val">${macro.distribution ? macro.distribution.carbohydrate.grams : 0}g</div>
              <div class="p-box-desc">Choose low-glycemic, fiber-rich whole carbs</div>
            </div>
            <div class="p-box">
              <div class="p-box-title">Protein (${macro.distribution ? macro.distribution.protein.percentage : 0}%)</div>
              <div class="p-box-val">${macro.distribution ? macro.distribution.protein.grams : 0}g</div>
              <div class="p-box-desc">Helps manage post-meal fullness & preserves muscle</div>
            </div>
            <div class="p-box">
              <div class="p-box-title">Healthy Fats (${macro.distribution ? macro.distribution.fat.percentage : 0}%)</div>
              <div class="p-box-val">${macro.distribution ? macro.distribution.fat.grams : 0}g</div>
              <div class="p-box-desc">${macro.distribution ? macro.distribution.saturatedFatCeiling : 'High MUFA / Olive Oil'}</div>
            </div>
          </div>

          ${macro.rationale && macro.rationale.length > 0 ? `
            <div style="margin-top: 1.25rem; background: #f0fdf4; border-left: 4px solid #16a34a; padding: 0.85rem 1rem; border-radius: 4px; font-size: 0.875rem;">
              <strong>Why this breakdown was chosen for you:</strong>
              <ul style="margin: 0.5rem 0 0 1.25rem;">
                ${macro.rationale.map(r => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- 3. Sample 1-Day Precision Meal Plan -->
        <div class="plan-card">
          <h3 style="color: var(--primary-hover);">&#127829; 3. A Day on Your Plate: Sample Precision Meal Plan</h3>
          <p style="font-size: 0.95rem; margin-bottom: 1rem;">
            Here is an example of how your tailored nutrients fit seamlessly into real, delicious meals:
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            
            <div style="background: var(--bg-surface); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-weight: 700; color: #0369a1; font-size: 0.9rem; margin-bottom: 0.4rem;">&#127749; Breakfast</div>
              <strong style="font-size: 0.95rem; display: block;">Pasture Eggs & Greens Sauté</strong>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.35rem;">
                2 eggs poached or scrambled with steamed spinach (folate), 1/4 avocado (MUFA), on a slice of sprouted grain bread with green tea.
              </p>
              <div style="font-size: 0.75rem; color: #047857; margin-top: 0.5rem; font-weight: 600;">Supports: Folate, Choline & Insulin Stability</div>
            </div>

            <div style="background: var(--bg-surface); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-weight: 700; color: #0369a1; font-size: 0.9rem; margin-bottom: 0.4rem;">&#127774; Lunch</div>
              <strong style="font-size: 0.95rem; display: block;">Mediterranean Salmon Bowl</strong>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.35rem;">
                Wild-caught salmon or lentil patty, mixed leafy greens (arugula, romaine), cucumbers, kalamata olives, dressed generously with extra virgin olive oil and lemon.
              </p>
              <div style="font-size: 0.75rem; color: #047857; margin-top: 0.5rem; font-weight: 600;">Supports: Omega-3 EPA/DHA & Polyphenols</div>
            </div>

            <div style="background: var(--bg-surface); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-weight: 700; color: #0369a1; font-size: 0.9rem; margin-bottom: 0.4rem;">&#127769; Dinner</div>
              <strong style="font-size: 0.95rem; display: block;">Herb-Roasted Chicken & Broccoli</strong>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.35rem;">
                Skinless chicken breast or tempeh roasted with garlic and rosemary, alongside steamed broccoli florets (sulforaphane) and 1/2 roasted sweet potato.
              </p>
              <div style="font-size: 0.75rem; color: #047857; margin-top: 0.5rem; font-weight: 600;">Supports: GSTP1 Glutathione & Satiety</div>
            </div>

            <div style="background: var(--bg-surface); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-weight: 700; color: #0369a1; font-size: 0.9rem; margin-bottom: 0.4rem;">&#127822; Smart Snack</div>
              <strong style="font-size: 0.95rem; display: block;">Pumpkin Seeds & Berries</strong>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.35rem;">
                A handful of raw pumpkin seeds (magnesium rich) with 1/2 cup fresh wild blueberries. Herbal chamomile or rooibos tea.
              </p>
              <div style="font-size: 0.75rem; color: #047857; margin-top: 0.5rem; font-weight: 600;">Supports: Magnesium & Antioxidant Balance</div>
            </div>

          </div>
        </div>

        <!-- 4. Food Swaps & Kitchen Guide -->
        <div class="plan-card">
          <h3 style="color: var(--primary-hover);">&#128722; 4. "Swap This for That" Kitchen & Grocery Guide</h3>
          <div class="food-columns">
            <div class="food-col prioritize-col">
              <h4>&#9989; Stock Your Kitchen With These (Prioritize)</h4>
              <ul class="food-list">
                ${food.prioritize.map(f => `
                  <li>
                    <strong>${f.food}</strong>
                    <div class="food-sub">${f.reason}</div>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="food-col avoid-col">
              <h4>&#10060; Minimize or Swap Out (Avoid)</h4>
              <ul class="food-list">
                ${food.restrictOrAvoid.map(f => `
                  <li>
                    <strong>${f.food}</strong>
                    <div class="food-sub">${f.reason}</div>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>

        <!-- 5. Daily Precision Supplement Checklist -->
        <div class="plan-card">
          <h3 style="color: var(--primary-hover);">&#128138; 5. Your Daily Precision Supplement Routine</h3>
          <p style="font-size: 0.95rem; margin-bottom: 1rem;">
            Because of your enzyme activity, standard drugstore vitamins (like synthetic folic acid or cyanocobalamin) are not recommended. Use these active, bioavailable formulations:
          </p>
          <div class="supplement-schedule-grid">
            ${supplements.map(sup => `
              <div class="sup-card">
                <div class="sup-header">
                  <span class="sup-name">${sup.nutrient}</span>
                  <span class="sup-time">${sup.timing}</span>
                </div>
                <div class="sup-body">
                  <div class="sup-dose"><strong>Prescribed Form:</strong> ${sup.form}</div>
                  <div style="font-size: 0.9rem; font-weight: 700; color: #0f172a; margin: 0.2rem 0;">Dosage: ${sup.dosage}</div>
                  <div class="sup-why"><strong>Why this helps your DNA:</strong> ${sup.rationale}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">
                    <strong>Evidence:</strong> ${sup.evidenceTier} &bull; <strong>Re-test:</strong> ${sup.monitoring}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 6. Next Steps & Lab Follow-up -->
        <div class="plan-card reminder-card" style="background: #f8fafc; border-left: 5px solid var(--primary);">
          <h3 style="color: var(--primary);">&#128197; 6. Next Steps & Laboratory Follow-Up Schedule</h3>
          <p style="font-size: 0.95rem; margin-bottom: 0.75rem;">
            Nutrigenomics works best when combined with real-time feedback. Bring this checklist to your doctor or lab in <strong>8 to 12 weeks</strong> to measure your progress:
          </p>
          <ul style="margin-left: 1.5rem; font-size: 0.9rem; line-height: 1.6;">
            ${monitoring.map(m => `
              <li style="margin-bottom: 0.4rem;">
                <strong>${m.biomarker}:</strong> Target goal is <em>${m.targetGoal}</em> (${m.interval}). 
                <span style="color: var(--text-secondary);">${m.clinicalRationale}</span>
              </li>
            `).join('')}
          </ul>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 1rem;">
            * This personalized report is intended for educational and clinical guidance in consultation with your qualified physician, dietitian, or healthcare provider.
          </p>
        </div>

      </div>
    `;
  },

  /**
   * Render FHIR JSON Viewer with Copy & Download controls
   */
  renderFhirViewer: function(fhirBundle) {
    const jsonString = JSON.stringify(fhirBundle, null, 2);

    return `
      <div class="fhir-viewer-container">
        <div class="fhir-toolbar">
          <div class="fhir-title">
            <span class="fhir-icon">&#9877;</span>
            <strong>HL7 FHIR R4 Bundle (GenomicReport + NutritionOrder)</strong>
            <span class="badge badge-fhir">FHIR R4 Compliant</span>
          </div>
          <div class="fhir-actions">
            <button id="btnCopyFhir" class="btn btn-secondary btn-sm" onclick="ReportView.copyFhirToClipboard()">
              Copy JSON
            </button>
            <button id="btnDownloadFhir" class="btn btn-primary btn-sm" onclick="ReportView.downloadFhirJson()">
              Download FHIR Bundle (.json)
            </button>
          </div>
        </div>
        <pre class="fhir-code-block"><code id="fhirCodeDisplay">${this.escapeHtml(jsonString)}</code></pre>
      </div>
    `;
  },

  escapeHtml: function(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  copyFhirToClipboard: function() {
    const code = document.getElementById("fhirCodeDisplay");
    if (!code) return;
    navigator.clipboard.writeText(code.innerText).then(() => {
      const btn = document.getElementById("btnCopyFhir");
      if (btn) {
        const orig = btn.innerText;
        btn.innerText = "Copied!";
        setTimeout(() => { btn.innerText = orig; }, 2000);
      }
    });
  },

  downloadFhirJson: function() {
    const code = document.getElementById("fhirCodeDisplay");
    if (!code) return;
    const blob = new Blob([code.innerText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FHIR_NutriGen_Bundle_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ReportView };
} else if (typeof window !== 'undefined') {
  window.ReportView = ReportView;
}
