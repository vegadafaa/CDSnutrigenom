/**
 * NutriGen-CDS: Clinical Decision Support Orchestrator
 * Main application controller managing reactive state, UI tab routing,
 * ingestion events, and real-time clinical evaluations.
 */

const App = {
  currentPatient: null,
  currentEvaluation: null,
  currentFhirBundle: null,
  
  mockLabSamples: [
    { id: "SMP-1092", patientId: "P-1001", type: "Blood Plasma", status: "Received" },
    { id: "SMP-1093", patientId: "P-1001", type: "Saliva / Buccal", status: "Processing" }
  ],

  init: function() {
    this.populatePatientSelector();
    this.bindEvents();
    
    // Load default patient (Arthur Pendelton)
    if (typeof SAMPLE_PATIENTS !== 'undefined' && SAMPLE_PATIENTS.length > 0) {
      this.loadPatient(SAMPLE_PATIENTS[0].id);
    }

    this.renderKnowledgeBaseTable();

    // Restore session jika sudah login sebelumnya (reload page)
    if (typeof API !== 'undefined' && API.restoreSession()) {
      const overlay = document.getElementById("loginOverlay");
      if (overlay) overlay.style.display = "none";
      this.currentUserRole = API.currentUser.role;
      this.renderUserBadge(API.currentUser);
      this.applyRoleRestrictions();
    }
  },

  populatePatientSelector: function() {
    const selector = document.getElementById("patientSelector");
    if (!selector || typeof SAMPLE_PATIENTS === 'undefined') return;

    selector.innerHTML = SAMPLE_PATIENTS.map(p => `
      <option value="${p.id}">${p.name} (${p.id}) - ${p.primaryGoals[0] || 'Clinical Case'}</option>
    `).join('');
  },

  bindEvents: function() {
    // Patient dropdown change
    const selector = document.getElementById("patientSelector");
    if (selector) {
      selector.addEventListener("change", (e) => {
        this.loadPatient(e.target.value);
      });
    }

    // Tab buttons
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-tab");
        this.switchTab(targetId);
      });
    });

    // File Dropzone / Upload for Genomics
    const fileInput = document.getElementById("genomicFileInput");
    const dropzone = document.getElementById("dropzoneArea");

    if (dropzone && fileInput) {
      dropzone.addEventListener("click", () => fileInput.click());
      
      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      });

      dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
      });

      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) {
          this.handleFileUpload(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
          this.handleFileUpload(e.target.files[0]);
        }
      });
    }

    // File Dropzone / Upload for Labs
    const labInput = document.getElementById("labFileInput");
    const labDropzone = document.getElementById("labDropzoneArea");

    if (labDropzone && labInput) {
      labDropzone.addEventListener("click", () => labInput.click());
      
      labDropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        labDropzone.classList.add("dragover");
      });

      labDropzone.addEventListener("dragleave", () => {
        labDropzone.classList.remove("dragover");
      });

      labDropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        labDropzone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) {
          this.handleLabFileUpload(e.dataTransfer.files[0]);
        }
      });

      labInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
          this.handleLabFileUpload(e.target.files[0]);
        }
      });
    }

    // Knowledge base search
    const kbSearch = document.getElementById("kbSearchInput");
    if (kbSearch) {
      kbSearch.addEventListener("input", (e) => {
        this.renderKnowledgeBaseTable(e.target.value);
      });
    }

    // Print button
    const printBtn = document.getElementById("btnPrintReport");
    if (printBtn) {
      printBtn.addEventListener("click", () => window.print());
    }
  },

  handleLogin: async function() {
    const roleSelect = document.getElementById("userRole");
    const usernameEl = document.getElementById("username");
    const passwordEl = document.getElementById("password");
    const loginError = document.getElementById("loginError");
    const btnLogin = document.getElementById("btnLogin");

    if (!roleSelect) return;

    const username = usernameEl ? usernameEl.value.trim() : '';
    const password = passwordEl ? passwordEl.value.trim() : '';

    // --- MODE BACKEND: jika username diisi, coba autentikasi ke server ---
    if (typeof API !== 'undefined' && username) {
      if (btnLogin) { btnLogin.textContent = 'Menghubungkan...'; btnLogin.disabled = true; }
      if (loginError) loginError.style.display = 'none';

      try {
        const data = await API.login(username, password);
        this.currentUserRole = data.user.role;

        const overlay = document.getElementById("loginOverlay");
        if (overlay) overlay.style.display = "none";
        this.renderUserBadge(data.user);
        this.applyRoleRestrictions();
        return;

      } catch (err) {
        // Jika error adalah network (Failed to fetch = server tidak jalan)
        const isNetworkError = err.message.toLowerCase().includes('fetch') ||
                               err.message.toLowerCase().includes('network') ||
                               err.message.toLowerCase().includes('load');

        if (isNetworkError) {
          // Auto-fallback ke demo mode dengan role dari dropdown
          if (loginError) {
            loginError.innerHTML = `
              <strong>⚠️ Backend server tidak aktif.</strong><br>
              Melanjutkan dalam <strong>Demo Mode</strong> dengan role yang dipilih di bawah.
            `;
            loginError.style.background = '#fefce8';
            loginError.style.color = '#92400e';
            loginError.style.display = 'block';
          }
          // Lanjut ke demo mode setelah 1.5 detik
          setTimeout(() => {
            this.currentUserRole = roleSelect.value;
            const overlay = document.getElementById("loginOverlay");
            if (overlay) overlay.style.display = "none";
            this.applyRoleRestrictions();
          }, 1500);
        } else {
          // Error lain = salah password / user tidak ditemukan
          if (loginError) {
            loginError.innerHTML = `❌ ${err.message}`;
            loginError.style.background = '#fef2f2';
            loginError.style.color = '#b91c1c';
            loginError.style.display = 'block';
          }
        }

        if (btnLogin) { btnLogin.textContent = 'Login'; btnLogin.disabled = false; }
        return;
      }
    }

    // --- MODE DEMO: username kosong → langsung pakai role dari dropdown ---
    this.currentUserRole = roleSelect.value;
    const overlay = document.getElementById("loginOverlay");
    if (overlay) overlay.style.display = "none";
    this.applyRoleRestrictions();
  },

  // Dipanggil oleh tombol "Masuk Demo Mode" di halaman login
  loginDemoMode: function() {
    const roleSelect = document.getElementById("userRole");
    this.currentUserRole = roleSelect ? roleSelect.value : "physician";
    const overlay = document.getElementById("loginOverlay");
    if (overlay) overlay.style.display = "none";

    // Tampilkan badge demo di header
    this.renderUserBadge({
      username: this.currentUserRole === 'physician' ? 'dr_demo'
               : this.currentUserRole === 'lab' ? 'lab_demo'
               : 'patient_demo',
      role: this.currentUserRole
    });

    this.applyRoleRestrictions();
  },

  renderUserBadge: function(user) {
    const headerRight = document.querySelector('.app-header > div:last-child');
    if (!headerRight) return;
    
    const roleLabels = { physician: '👨‍⚕️ Physician', lab: '🔬 Lab Staff', patient: '👤 Patient' };
    const badge = document.createElement('div');
    badge.id = 'userBadge';
    badge.style.cssText = 'display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;color:var(--text-muted);';
    badge.innerHTML = `
      <span style="font-weight:600;color:var(--text-secondary);">${user.username}</span>
      <span class="badge badge-fhir">${roleLabels[user.role] || user.role}</span>
      <button onclick="App.handleLogout()" class="btn btn-secondary btn-sm" style="font-size:0.7rem;padding:0.2rem 0.5rem;">Logout</button>
    `;
    headerRight.prepend(badge);
  },

  handleLogout: function() {
    if (typeof API !== 'undefined') API.logout();
    location.reload();
  },

  applyRoleRestrictions: function() {
    const isLab = this.currentUserRole === "lab";
    const isPatient = this.currentUserRole === "patient";
    
    // Define tabs to hide based on role
    let restrictedTabs = [];
    if (isLab) {
      restrictedTabs = ["tab-risk", "tab-nutrition", "tab-safety", "tab-reports", "tab-fhir", "tab-intake", "tab-kb"];
    } else if (isPatient) {
      restrictedTabs = ["tab-intake", "tab-risk", "tab-nutrition", "tab-safety", "tab-fhir", "tab-lab", "tab-kb"];
    }
    
    document.querySelectorAll(".tab-btn").forEach(btn => {
      const target = btn.getAttribute("data-tab");
      if (restrictedTabs.includes(target)) {
        btn.classList.add("hidden-by-role");
      } else {
        btn.classList.remove("hidden-by-role");
      }
    });

    const labTabBtn = document.getElementById("navLabTab");
    if (labTabBtn) {
      labTabBtn.style.display = isLab ? "flex" : "none";
    }

    // Adjust UI elements for patient
    const reportToggles = document.getElementById("reportViewToggles");
    const patientPicker = document.querySelector(".header-patient-picker");
    const vitalsBar = document.getElementById("patientVitalsBar");
    
    if (isPatient) {
      if (reportToggles) reportToggles.classList.add("hidden-by-role");
      if (patientPicker) patientPicker.style.display = "none";
      if (vitalsBar) vitalsBar.style.display = "none";
      
      const reportsTabBtn = document.querySelector('.tab-btn[data-tab="tab-reports"]');
      if (reportsTabBtn) reportsTabBtn.innerHTML = `<span>👤</span> My Health Report`;

      this.toggleReportView("patient");
    } else {
      if (reportToggles) reportToggles.classList.remove("hidden-by-role");
      if (patientPicker) patientPicker.style.display = "block";
      if (vitalsBar) vitalsBar.style.display = "flex";

      const reportsTabBtn = document.querySelector('.tab-btn[data-tab="tab-reports"]');
      if (reportsTabBtn) reportsTabBtn.innerHTML = `<span>📝</span> Clinical Documentation (SOAP)`;
    }

    // Reset view based on role
    if (isLab) {
      this.switchTab("tab-lab");
      this.renderLabWorkflow();
    } else if (isPatient) {
      this.switchTab("tab-reports");
    } else {
      this.switchTab("tab-intake");
    }
  },

  switchTab: function(tabId) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const activePane = document.getElementById(tabId);

    if (activeBtn) activeBtn.classList.add("active");
    if (activePane) activePane.classList.add("active");

    // If switching to risk matrix, ensure radar chart redraws
    if (tabId === "tab-risk" && this.currentEvaluation) {
      SVGRadarChart.render("#radarChartContainer", this.currentEvaluation.domainAssessments);
    }
  },

  loadPatient: function(patientId) {
    const found = SAMPLE_PATIENTS.find(p => p.id === patientId);
    if (!found) return;

    // Deep clone to allow safe local modification
    this.currentPatient = JSON.parse(JSON.stringify(found));
    this.runEvaluation();
  },

  handleFileUpload: function(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const parsedGenotypes = GenomicParsers.autoParse(content, NUTRIGENOMICS_KB);

      const parsedCount = Object.keys(parsedGenotypes).length;
      if (parsedCount === 0) {
        alert("No recognized nutrigenomic variants found in this file. Please verify format (VCF, 23andMe, or JSON).");
        return;
      }

      // Merge into current patient
      this.currentPatient.genotypes = {
        ...(this.currentPatient.genotypes || {}),
        ...parsedGenotypes
      };

      const statusEl = document.getElementById("uploadStatusMessage");
      if (statusEl) {
        statusEl.innerHTML = `<span style="color: #059669; font-weight: 600;">Successfully parsed ${parsedCount} nutrigenomic variants from ${file.name}!</span>`;
      }
      
      const labStatusEl = document.getElementById("labGlobalStatusMessage");
      if (labStatusEl && this.currentUserRole === "lab") {
        labStatusEl.innerHTML = `<span style="color: #059669; font-weight: 600;">✔ Successfully forwarded ${parsedCount} variants to CDS from ${file.name}</span>`;
      }

      this.runEvaluation();
    };
    reader.readAsText(file);
  },

  handleLabFileUpload: function(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const parsedLabs = GenomicParsers.parseLabData(content);

      const parsedCount = Object.keys(parsedLabs).length;
      if (parsedCount === 0) {
        alert("No recognized lab biomarkers found in this file. Please verify format (JSON/CSV).");
        return;
      }

      // Merge into current patient biomarkers
      this.currentPatient.biomarkers = {
        ...(this.currentPatient.biomarkers || {}),
        ...parsedLabs
      };

      const statusEl = document.getElementById("labUploadStatusMessage");
      if (statusEl) {
        statusEl.innerHTML = `<span style="color: #059669; font-weight: 600;">Successfully parsed ${parsedCount} lab biomarkers from ${file.name}!</span>`;
      }
      
      const labStatusEl = document.getElementById("labGlobalStatusMessage");
      if (labStatusEl && this.currentUserRole === "lab") {
        labStatusEl.innerHTML = `<span style="color: #059669; font-weight: 600;">✔ Successfully forwarded ${parsedCount} lab biomarkers to CDS from ${file.name}</span>`;
      }

      this.runEvaluation();
    };
    reader.readAsText(file);
  },

  runEvaluation: function() {
    if (!this.currentPatient) return;

    // 1. Run CDS Rule Engine
    this.currentEvaluation = CDSRuleEngine.evaluatePatient(this.currentPatient, NUTRIGENOMICS_KB);

    // 2. Generate HL7 FHIR Bundle
    this.currentFhirBundle = FHIRExporter.exportToFHIRBundle(this.currentPatient, this.currentEvaluation);

    // 3. Update UI views
    this.updatePatientVitalsBar();
    this.renderIntakeView();
    this.renderRiskMatrixView();
    this.renderNutritionRxView();
    this.renderSafetyView();
    this.renderReportsView();
    this.renderFhirView();
    this.updateNotificationBadges();
  },

  updatePatientVitalsBar: function() {
    const p = this.currentPatient;
    const bar = document.getElementById("patientVitalsBar");
    if (!bar || !p) return;

    bar.innerHTML = `
      <div class="pt-demographics">
        <div class="pt-avatar">${p.name.charAt(0)}</div>
        <div class="pt-name-id">
          <h3>${p.name}</h3>
          <span>ID: ${p.id} | Age: ${p.age} y.o. | ${p.gender.toUpperCase()}</span>
        </div>
      </div>
      <div class="pt-vitals-strip">
        <div class="vital-metric">
          <span class="metric-name">BMI</span>
          <span class="metric-value">${p.bmi} kg/m²</span>
        </div>
        <div class="vital-metric">
          <span class="metric-name">Blood Pressure</span>
          <span class="metric-value">${p.bloodPressure || 'N/A'}</span>
        </div>
        <div class="vital-metric">
          <span class="metric-name">Diet Baseline</span>
          <span class="metric-value">${p.dietPattern || 'Omnivore'}</span>
        </div>
        <div class="vital-metric">
          <span class="metric-name">Overall Status</span>
          <span class="metric-value"><span class="badge ${this.currentEvaluation.overallRiskStatus.class.replace('risk-', 'badge-')}">${this.currentEvaluation.overallRiskStatus.level}</span></span>
        </div>
      </div>
    `;
  },

  renderIntakeView: function() {
    const p = this.currentPatient;
    const tableBody = document.getElementById("intakeGenotypesTableBody");
    if (!tableBody) return;

    const genotypes = p.genotypes || {};
    const rows = Object.entries(genotypes).map(([rsid, call]) => {
      const kbEntry = NUTRIGENOMICS_KB[rsid];
      const gtData = kbEntry && kbEntry.genotypes ? kbEntry.genotypes[call.genotype] : null;

      return `
        <tr>
          <td><strong>${call.gene}</strong></td>
          <td>${call.variantName || rsid}</td>
          <td><code>${rsid}</code></td>
          <td><code class="genotype-tag">${call.genotype}</code></td>
          <td>${gtData ? gtData.phenotype : 'Genotype identified'}</td>
          <td><span class="tier-pill ${kbEntry ? kbEntry.evidenceTier.toLowerCase().replace(' ', '-') : 'tier-c'}">${kbEntry ? kbEntry.evidenceTier : 'Tier B'}</span></td>
        </tr>
      `;
    }).join('');

    tableBody.innerHTML = rows || `<tr><td colspan="6" class="text-muted text-center">No genomic data loaded.</td></tr>`;

    // Labs table
    const labsBody = document.getElementById("intakeBiomarkersTableBody");
    if (labsBody && p.biomarkers) {
      labsBody.innerHTML = Object.entries(p.biomarkers).map(([key, lab]) => `
        <tr>
          <td><strong>${key}</strong></td>
          <td><strong>${lab.value}</strong> ${lab.unit}</td>
          <td>${lab.reference}</td>
          <td><span class="badge ${lab.status && lab.status.includes('elevated') ? 'badge-high' : (lab.status && lab.status.includes('deficient') ? 'badge-high' : 'badge-optimal')}">${lab.status}</span></td>
        </tr>
      `).join('');
    }
  },

  renderRiskMatrixView: function() {
    if (!this.currentEvaluation) return;
    const domains = this.currentEvaluation.domainAssessments;

    // Render SVG Radar
    SVGRadarChart.render("#radarChartContainer", domains);

    // Render Domain Cards
    const container = document.getElementById("domainCardsContainer");
    if (!container) return;

    container.innerHTML = Object.entries(domains).map(([key, d]) => `
      <div class="card" style="margin-bottom: 1rem;">
        <div class="card-header">
          <div class="card-title">
            <span>${d.name}</span>
          </div>
          <span class="badge ${d.badgeClass}">${d.category} (${d.percentageScore}%)</span>
        </div>
        <div class="table-responsive">
          <table class="clinical-table">
            <thead>
              <tr>
                <th>Gene</th>
                <th>Genotype</th>
                <th>Evidence</th>
                <th>Phenotypic Impact & Guidance</th>
              </tr>
            </thead>
            <tbody>
              ${d.snpResults.map(snp => `
                <tr>
                  <td><strong>${snp.gene}</strong><br/><small class="text-muted">${snp.rsid}</small></td>
                  <td><code class="genotype-tag">${snp.genotype}</code></td>
                  <td><span class="tier-pill ${snp.evidenceTier.toLowerCase().replace(' ', '-')}">${snp.evidenceTier}</span></td>
                  <td>
                    <div>${snp.phenotype}</div>
                    ${snp.dietaryGuidance ? `<small style="color: #0369a1; display: block; margin-top: 0.25rem;"><strong>Dietary Action:</strong> ${snp.dietaryGuidance}</small>` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('');
  },

  renderNutritionRxView: function() {
    if (!this.currentEvaluation) return;
    const macro = this.currentEvaluation.macronutrientRx || {};
    const formulary = this.currentEvaluation.supplementFormulary || [];
    const food = this.currentEvaluation.foodGuidance || { prioritize: [], restrictOrAvoid: [] };

    // Macronutrient cards
    const macroContainer = document.getElementById("macroTargetContainer");
    if (macroContainer) {
      macroContainer.innerHTML = `
        <div class="macro-card">
          <span class="macro-label">Prescribed Energy</span>
          <span class="macro-val">${macro.dailyCalories} kcal/d</span>
          <span class="macro-sub">Estimated BMR: ~${macro.bmr} kcal/d</span>
        </div>
        <div class="macro-card">
          <span class="macro-label">Carbohydrate</span>
          <span class="macro-val">${macro.distribution ? macro.distribution.carbohydrate.grams : 0}g (${macro.distribution ? macro.distribution.carbohydrate.percentage : 0}%)</span>
          <span class="macro-sub">${macro.distribution ? macro.distribution.carbohydrate.focus : ''}</span>
        </div>
        <div class="macro-card">
          <span class="macro-label">Protein Target</span>
          <span class="macro-val">${macro.distribution ? macro.distribution.protein.grams : 0}g (${macro.distribution ? macro.distribution.protein.percentage : 0}%)</span>
          <span class="macro-sub">${macro.distribution ? macro.distribution.protein.focus : ''}</span>
        </div>
        <div class="macro-card">
          <span class="macro-label">Fat & Saturated Ceiling</span>
          <span class="macro-val">${macro.distribution ? macro.distribution.fat.grams : 0}g (${macro.distribution ? macro.distribution.fat.percentage : 0}%)</span>
          <span class="macro-sub">${macro.distribution ? macro.distribution.saturatedFatCeiling : ''}</span>
        </div>
      `;
    }

    // Formulary table
    const formularyBody = document.getElementById("supplementFormularyTableBody");
    if (formularyBody) {
      formularyBody.innerHTML = formulary.map(sup => `
        <tr>
          <td><strong>${sup.nutrient}</strong></td>
          <td>${sup.form}</td>
          <td><strong>${sup.dosage}</strong><br/><small class="text-muted">${sup.timing}</small></td>
          <td>${sup.rationale} <span class="tier-pill ${sup.evidenceTier.toLowerCase().replace(' ', '-')}">${sup.evidenceTier}</span></td>
          <td><small>${sup.monitoring}</small></td>
        </tr>
      `).join('');
    }

    // Food list
    const foodPrioritize = document.getElementById("foodPrioritizeList");
    const foodAvoid = document.getElementById("foodAvoidList");

    if (foodPrioritize) {
      foodPrioritize.innerHTML = food.prioritize.map(f => `
        <li>
          <strong>${f.food}</strong>
          <div class="food-sub">${f.reason}</div>
        </li>
      `).join('');
    }

    if (foodAvoid) {
      foodAvoid.innerHTML = food.restrictOrAvoid.map(f => `
        <li>
          <strong>${f.food}</strong>
          <div class="food-sub">${f.reason}</div>
        </li>
      `).join('');
    }
  },

  renderSafetyView: function() {
    if (!this.currentEvaluation) return;
    const safety = this.currentEvaluation.safetyAlerts || [];
    const concordance = this.currentEvaluation.concordanceAlerts || [];
    const epistasis = this.currentEvaluation.epistasisAlerts || [];

    const container = document.getElementById("safetyAlertsContainer");
    if (!container) return;

    let html = '';

    // Safety & Contraindications
    if (safety.length > 0) {
      html += `
        <div class="card">
          <div class="card-title" style="color: #b91c1c; margin-bottom: 1rem;">
            &#9888; Drug-Gene-Nutrient Safety Warnings & Depletions (${safety.length})
          </div>
          ${safety.map(s => `
            <div class="alert-item alert-${s.severity}">
              <strong>${s.title}</strong>
              <p>${s.alertText || s.mechanism}</p>
              <p class="action-highlight"><strong>Directive:</strong> ${s.clinicalDirective}</p>
              ${s.geneSynergy ? `<small style="display:block; margin-top:0.3rem; color: #7c2d12;"><strong>Gene Synergy:</strong> ${s.geneSynergy}</small>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    // Concordance
    if (concordance.length > 0) {
      html += `
        <div class="card">
          <div class="card-title" style="color: #0369a1; margin-bottom: 1rem;">
            &#9745; Lab Biomarker vs. Genotype Concordance Findings (${concordance.length})
          </div>
          ${concordance.map(c => `
            <div class="concordance-item priority-${c.priority.toLowerCase()}">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong>${c.title}</strong>
                <span class="badge badge-${c.priority.toLowerCase()}">${c.priority}</span>
              </div>
              <p><em>${c.biomarker} | ${c.genotype}</em></p>
              <p>${c.clinicalSignificance}</p>
              <p class="action-highlight"><strong>Clinical Action:</strong> ${c.actionDirective}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Epistasis
    if (epistasis.length > 0) {
      html += `
        <div class="card">
          <div class="card-title" style="color: #7c3aed; margin-bottom: 1rem;">
            &#9776; Multi-Gene Epistasis & Synergistic Vulnerabilities (${epistasis.length})
          </div>
          ${epistasis.map(e => `
            <div class="epistasis-item">
              <strong>${e.title} [${e.evidenceTier}]</strong>
              <p>${e.mechanism}</p>
              <p class="action-highlight"><strong>Prescription Directive:</strong> ${e.clinicalDirective}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (!html) {
      html = `<div class="card"><p class="text-muted">No safety contraindications or active epistasis flags triggered for this patient profile.</p></div>`;
    }

    container.innerHTML = html;
  },

  renderReportsView: function() {
    if (!this.currentPatient || !this.currentEvaluation) return;

    const soapContainer = document.getElementById("soapReportContainer");
    const patientPlanContainer = document.getElementById("patientCarePlanContainer");

    if (soapContainer) {
      soapContainer.innerHTML = ReportView.renderSoapReport(this.currentPatient, this.currentEvaluation);
    }

    if (patientPlanContainer) {
      patientPlanContainer.innerHTML = ReportView.renderPatientPlan(this.currentPatient, this.currentEvaluation);
    }
  },

  toggleReportView: function(viewType) {
    const soapContainer = document.getElementById("soapReportContainer");
    const patientPlanContainer = document.getElementById("patientCarePlanContainer");
    const btnPatient = document.getElementById("btnViewPatientPlan");
    const btnSoap = document.getElementById("btnViewSoap");

    if (viewType === 'soap') {
      if (soapContainer) soapContainer.style.display = 'block';
      if (patientPlanContainer) patientPlanContainer.style.display = 'none';
      if (btnSoap) { btnSoap.className = "btn btn-primary btn-sm"; }
      if (btnPatient) { btnPatient.className = "btn btn-secondary btn-sm"; }
    } else {
      if (soapContainer) soapContainer.style.display = 'none';
      if (patientPlanContainer) patientPlanContainer.style.display = 'block';
      if (btnPatient) { btnPatient.className = "btn btn-primary btn-sm"; }
      if (btnSoap) { btnSoap.className = "btn btn-secondary btn-sm"; }
    }
  },

  renderFhirView: function() {
    if (!this.currentFhirBundle) return;
    const container = document.getElementById("fhirViewerContainer");
    if (container) {
      container.innerHTML = ReportView.renderFhirViewer(this.currentFhirBundle);
    }
  },

  updateNotificationBadges: function() {
    if (!this.currentEvaluation) return;
    const safetyCount = (this.currentEvaluation.safetyAlerts || []).length;
    const epistasisCount = (this.currentEvaluation.epistasisAlerts || []).length;
    const totalAlerts = safetyCount + epistasisCount;

    const badge = document.getElementById("safetyTabBadge");
    if (badge) {
      badge.innerText = totalAlerts;
      badge.style.display = totalAlerts > 0 ? "inline-block" : "none";
      if (safetyCount > 0) {
        badge.className = "tab-count badge-high";
      } else {
        badge.className = "tab-count";
      }
    }
  },

  renderKnowledgeBaseTable: function(searchTerm = "") {
    const tableBody = document.getElementById("knowledgeBaseTableBody");
    if (!tableBody || typeof NUTRIGENOMICS_KB === 'undefined') return;

    const term = searchTerm.toLowerCase();
    const rows = Object.values(NUTRIGENOMICS_KB).filter(entry => {
      if (!term) return true;
      return (
        entry.gene.toLowerCase().includes(term) ||
        entry.rsid.toLowerCase().includes(term) ||
        entry.variantName.toLowerCase().includes(term) ||
        entry.domain.toLowerCase().includes(term) ||
        entry.clinicalSummary.toLowerCase().includes(term)
      );
    }).map(entry => `
      <tr>
        <td><strong>${entry.gene}</strong></td>
        <td><code>${entry.rsid}</code></td>
        <td>${entry.variantName}</td>
        <td>Chr ${entry.chromosome}:${entry.position}</td>
        <td>${entry.domainLabel}</td>
        <td><span class="tier-pill ${entry.evidenceTier.toLowerCase().replace(' ', '-')}">${entry.evidenceTier}</span></td>
        <td>
          <small>${entry.clinicalSummary}</small>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
            Refs: ${entry.references.join(', ')}
          </div>
        </td>
      </tr>
    `).join('');

    tableBody.innerHTML = rows;
  },

  renderLabWorkflow: function() {
    const tableBody = document.getElementById("labWorkflowTableBody");
    if (!tableBody) return;

    this.renderLabStatsBar();

    const patientDropdown = document.getElementById("labNewSamplePatient");
    if (patientDropdown && typeof SAMPLE_PATIENTS !== 'undefined' && patientDropdown.children.length === 0) {
      patientDropdown.innerHTML = SAMPLE_PATIENTS.map(p =>
        `<option value="${p.id}">${p.name} (${p.id})</option>`
      ).join('');
    }

    const searchTerm = (document.getElementById("labSampleSearch")?.value || "").toLowerCase();
    const statusFilter = document.getElementById("labStatusFilter")?.value || "";

    const filtered = this.mockLabSamples.filter(s => {
      const name = (SAMPLE_PATIENTS?.find(p => p.id === s.patientId)?.name || "").toLowerCase();
      const matchSearch = !searchTerm || s.id.toLowerCase().includes(searchTerm) || name.includes(searchTerm);
      const matchStatus = !statusFilter || s.status === statusFilter;
      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:1.5rem;">Tidak ada sampel yang sesuai filter.</td></tr>`;
    } else {
      const statusConfig = {
        Received:   { color: '#0284c7', icon: '📥' },
        Processing: { color: '#d97706', icon: '⚙️' },
        Analyzing:  { color: '#7c3aed', icon: '🔬' },
        Completed:  { color: '#059669', icon: '✅' }
      };
      tableBody.innerHTML = filtered.map(sample => {
        const idx = this.mockLabSamples.indexOf(sample);
        const patientName = SAMPLE_PATIENTS?.find(p => p.id === sample.patientId)?.name || "Unknown";
        const sc = statusConfig[sample.status] || { color: '#64748b', icon: '•' };
        const receivedTime = sample.receivedAt
          ? new Date(sample.receivedAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
          : '—';
        const statuses = ["Received", "Processing", "Analyzing", "Completed"];
        const statusSelect = `<select class="form-control" style="width:auto;font-size:0.8rem;padding:0.25rem 0.5rem;" onchange="App.updateLabSampleStatus(${idx}, this.value)">${statuses.map(s => `<option value="${s}" ${s === sample.status ? 'selected' : ''}>${sc.icon} ${s}</option>`).join('')}</select>`;
        let actionHtml = `<span style="color:var(--text-muted);font-size:0.8rem;">Tunggu selesai</span>`;
        if (sample.status === "Completed") {
          actionHtml = `<div style="display:flex;gap:0.35rem;flex-wrap:wrap;"><button class="btn btn-primary btn-sm" onclick="App.selectSampleForEntry('${sample.id}')" style="font-size:0.75rem;">✏️ Input Hasil</button><button class="btn btn-secondary btn-sm" onclick="App.openQcForSample('${sample.id}')" style="font-size:0.75rem;">✅ QC</button></div>`;
        }
        return `<tr>
          <td><strong style="font-family:monospace;">${sample.id}</strong>${sample.notes ? `<br><small style="color:var(--text-muted);">${sample.notes}</small>` : ''}</td>
          <td><strong>${patientName}</strong><br><small style="color:var(--text-muted);">${sample.patientId}</small></td>
          <td><span style="font-size:0.8rem;">${sample.type}</span></td>
          <td><span style="font-size:0.78rem;color:var(--text-muted);">${receivedTime}</span></td>
          <td>${statusSelect}</td>
          <td>${actionHtml}</td>
        </tr>`;
      }).join('');
    }

    this.refreshCompletedSampleDropdown();

    const bioFields = document.getElementById("labBiomarkerFields");
    if (bioFields && bioFields.children.length === 0) {
      this.addBiomarkerRow();
      this.addBiomarkerRow();
    }

    this.renderQcChecklist();
  },

  renderLabStatsBar: function() {
    const bar = document.getElementById("labStatsBar");
    if (!bar) return;
    const total = this.mockLabSamples.length;
    const counts = { Received: 0, Processing: 0, Analyzing: 0, Completed: 0 };
    this.mockLabSamples.forEach(s => { if (counts[s.status] !== undefined) counts[s.status]++; });
    bar.innerHTML = `
      <div class="lab-stat-card" style="border-left:4px solid var(--primary);">
        <span class="lab-stat-num">${total}</span><span class="lab-stat-label">Total Sampel</span>
      </div>
      <div class="lab-stat-card" style="border-left:4px solid #0284c7;">
        <span class="lab-stat-num">${counts.Received}</span><span class="lab-stat-label">📥 Received</span>
      </div>
      <div class="lab-stat-card" style="border-left:4px solid #d97706;">
        <span class="lab-stat-num">${counts.Processing}</span><span class="lab-stat-label">⚙️ Processing</span>
      </div>
      <div class="lab-stat-card" style="border-left:4px solid #7c3aed;">
        <span class="lab-stat-num">${counts.Analyzing}</span><span class="lab-stat-label">🔬 Analyzing</span>
      </div>
      <div class="lab-stat-card" style="border-left:4px solid #059669;">
        <span class="lab-stat-num">${counts.Completed}</span><span class="lab-stat-label">✅ Completed</span>
      </div>`;
  },

  refreshCompletedSampleDropdown: function() {
    const sel = document.getElementById("labResultTargetSample");
    if (!sel) return;
    const completed = this.mockLabSamples.filter(s => s.status === "Completed");
    const current = sel.value;
    sel.innerHTML = `<option value="">— Pilih Sampel Completed —</option>` +
      completed.map(s => {
        const name = SAMPLE_PATIENTS?.find(p => p.id === s.patientId)?.name || s.patientId;
        return `<option value="${s.id}" ${s.id === current ? 'selected' : ''}>${s.id} — ${name} (${s.type})</option>`;
      }).join('');
  },

  addLabSample: function() {
    const patientEl = document.getElementById("labNewSamplePatient");
    const typeEl = document.getElementById("labNewSampleType");
    const notesEl = document.getElementById("labNewSampleNotes");
    const statusEl = document.getElementById("labAddSampleStatus");
    if (!patientEl?.value) {
      if (statusEl) statusEl.innerHTML = `<span style="color:#b91c1c;">⚠️ Pilih pasien terlebih dahulu.</span>`;
      return;
    }
    const newId = `SMP-${1094 + this.mockLabSamples.length}`;
    this.mockLabSamples.push({
      id: newId, patientId: patientEl.value, type: typeEl.value,
      status: "Received", notes: notesEl.value || "", receivedAt: new Date().toISOString()
    });
    if (notesEl) notesEl.value = "";
    if (statusEl) statusEl.innerHTML = `<span style="color:#059669;">✔ Sampel <strong>${newId}</strong> berhasil didaftarkan.</span>`;
    this.renderLabWorkflow();
  },

  updateLabSampleStatus: function(index, newStatus) {
    if (this.mockLabSamples[index]) {
      this.mockLabSamples[index].status = newStatus;
      this.renderLabWorkflow();
    }
  },

  selectSampleForEntry: function(sampleId) {
    const sel = document.getElementById("labResultTargetSample");
    if (sel) { sel.value = sampleId; }
    document.getElementById("labBiomarkerFields")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  openQcForSample: function(sampleId) {
    document.getElementById("labQcChecklist")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  addBiomarkerRow: function() {
    const container = document.getElementById("labBiomarkerFields");
    if (!container) return;
    const commonUnits = { homocysteine:'µmol/L', vitaminD:'ng/mL', ldlCholesterol:'mg/dL', ferritin:'ng/mL',
      fastingGlucose:'mg/dL', hba1c:'%', triglycerides:'mg/dL', hdlCholesterol:'mg/dL',
      crp:'mg/L', vitaminB12:'pg/mL', folate:'ng/mL', tsh:'µIU/mL' };
    const biomarkers = Object.keys(commonUnits);
    const row = document.createElement('div');
    row.className = 'biomarker-entry-row';
    row.style.cssText = 'display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:0.4rem;align-items:center;';
    row.innerHTML = `
      <select class="form-control bm-name" style="font-size:0.8rem;" onchange="(function(el){el.closest('.biomarker-entry-row').querySelector('.bm-unit').value=(${JSON.stringify(commonUnits)})[el.value]||''})(this)">
        <option value="">— Pilih Biomarker —</option>
        ${biomarkers.map(b => `<option value="${b}">${b}</option>`).join('')}
        <option value="__custom__">Lainnya (ketik manual)</option>
      </select>
      <input type="number" class="form-control bm-value" placeholder="Nilai" step="0.01" style="font-size:0.8rem;">
      <input type="text" class="form-control bm-unit" placeholder="Unit" style="font-size:0.8rem;">
      <button class="btn btn-secondary btn-sm" onclick="this.parentElement.remove()" style="font-size:0.75rem;padding:0.3rem 0.5rem;">✕</button>`;
    container.appendChild(row);
  },

  submitBiomarkerResults: function() {
    const sampleId = document.getElementById("labResultTargetSample")?.value;
    const statusEl = document.getElementById("labBiomarkerStatus");
    if (!sampleId) {
      if (statusEl) statusEl.innerHTML = `<span style="color:#b91c1c;">⚠️ Pilih sampel target terlebih dahulu.</span>`;
      return;
    }
    const rows = document.querySelectorAll(".biomarker-entry-row");
    const newBiomarkers = {};
    let count = 0;
    rows.forEach(row => {
      let name = row.querySelector('.bm-name')?.value;
      const value = parseFloat(row.querySelector('.bm-value')?.value);
      const unit = row.querySelector('.bm-unit')?.value || '';
      if (name === '__custom__') name = row.querySelector('.bm-unit')?.dataset?.name || '';
      if (name && name !== '__custom__' && !isNaN(value)) {
        newBiomarkers[name] = { value, unit, reference: '—', status: 'Pending Review' };
        count++;
      }
    });
    if (count === 0) {
      if (statusEl) statusEl.innerHTML = `<span style="color:#b91c1c;">⚠️ Isi minimal satu biomarker terlebih dahulu.</span>`;
      return;
    }
    if (this.currentPatient) {
      this.currentPatient.biomarkers = { ...(this.currentPatient.biomarkers || {}), ...newBiomarkers };
      this.runEvaluation();
    }
    const labMsg = document.getElementById("labGlobalStatusMessage");
    if (statusEl) statusEl.innerHTML = `<span style="color:#059669;">✔ ${count} biomarker berhasil disimpan & dikirim ke CDS untuk sampel <strong>${sampleId}</strong>.</span>`;
    if (labMsg) labMsg.innerHTML = `<span style="color:#059669;">✔ Data dari sampel <strong>${sampleId}</strong> telah diteruskan ke sistem analisis CDS.</span>`;
  },

  renderQcChecklist: function() {
    const container = document.getElementById("labQcChecklist");
    if (!container || container.children.length > 0) return;
    const checks = [
      'Identitas sampel telah diverifikasi (label, ID, nama pasien)',
      'Kondisi kontainer: tidak bocor, tidak hemolisis, tidak lipemik',
      'Volume sampel mencukupi untuk semua pemeriksaan yang diminta',
      'Suhu penyimpanan sesuai protokol selama transit ke lab',
      'Reagent kontrol (QC material) telah dijalankan dan passed',
      'Instrumen/alat telah dikalibrasi pada hari ini',
      'Hasil telah direview oleh supervisor atau senior analis',
    ];
    container.innerHTML = checks.map((label, i) => `
      <label style="display:flex;align-items:flex-start;gap:0.6rem;padding:0.45rem 0;border-bottom:1px solid var(--border-color);font-size:0.83rem;cursor:pointer;">
        <input type="checkbox" id="qc${i}" style="margin-top:0.15rem;flex-shrink:0;">
        <span>${label}</span>
      </label>`).join('');
  },

  submitQcChecklist: function() {
    const checks = document.querySelectorAll("#labQcChecklist input[type=checkbox]");
    const allChecked = Array.from(checks).every(c => c.checked);
    const statusEl = document.getElementById("labQcStatus");
    if (!allChecked) {
      if (statusEl) statusEl.innerHTML = `<span style="color:#b91c1c;">⚠️ Semua poin QC checklist harus dicentang sebelum finalisasi.</span>`;
      return;
    }
    const targetIdx = this.mockLabSamples.findIndex(s => s.status === "Analyzing");
    if (targetIdx !== -1) {
      this.mockLabSamples[targetIdx].status = "Completed";
      this.mockLabSamples[targetIdx].completedAt = new Date().toISOString();
      const sid = this.mockLabSamples[targetIdx].id;
      if (statusEl) statusEl.innerHTML = `<span style="color:#059669;">✔ QC selesai. Sampel <strong>${sid}</strong> di-set ke <strong>Completed</strong> dan siap diteruskan ke dokter.</span>`;
      this.renderLabWorkflow();
    } else {
      if (statusEl) statusEl.innerHTML = `<span style="color:#0284c7;">ℹ️ Tidak ada sampel berstatus Analyzing untuk diselesaikan saat ini.</span>`;
    }
  }
};

// Start application
document.addEventListener("DOMContentLoaded", () => App.init());
