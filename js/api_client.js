/**
 * NutriGen-CDS Frontend: API Client
 * Menggantikan logika langsung di app.js yang menghitung di browser.
 * Kini menghubungkan ke backend server via fetch() untuk autentikasi, evaluasi, dan laporan.
 */

const API = {
  BASE_URL: 'http://localhost:3000/api',
  token: null,
  currentUser: null,

  // === AUTENTIKASI ===

  login: async function(username, password) {
    const res = await fetch(`${this.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login gagal.');
    }

    const data = await res.json();
    this.token = data.token;
    this.currentUser = data.user;

    // Simpan token ke sessionStorage agar bertahan saat refresh halaman
    sessionStorage.setItem('nutrigen_token', data.token);
    sessionStorage.setItem('nutrigen_user', JSON.stringify(data.user));

    return data;
  },

  logout: function() {
    this.token = null;
    this.currentUser = null;
    sessionStorage.removeItem('nutrigen_token');
    sessionStorage.removeItem('nutrigen_user');
  },

  restoreSession: function() {
    const storedToken = sessionStorage.getItem('nutrigen_token');
    const storedUser = sessionStorage.getItem('nutrigen_user');
    if (storedToken && storedUser) {
      this.token = storedToken;
      this.currentUser = JSON.parse(storedUser);
      return true;
    }
    return false;
  },

  // === HEADER HELPER ===

  _headers: function() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  },

  // === CDS EVALUASI ===

  /**
   * Dokter memanggil evaluasi CDS untuk pasien tertentu
   */
  evaluate: async function(patientId, genotypesOverride, biomarkersOverride) {
    const res = await fetch(`${this.BASE_URL}/cds/evaluate`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({
        patientId,
        genotypes: genotypesOverride || null,
        biomarkers: biomarkersOverride || null
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Evaluasi CDS gagal.');
    }

    return await res.json();
  },

  /**
   * Mengambil laporan yang sudah digenerate (untuk dokter & pasien)
   */
  getReport: async function(patientId) {
    const res = await fetch(`${this.BASE_URL}/cds/report/${patientId}`, {
      headers: this._headers()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Gagal mengambil laporan.');
    }

    return await res.json();
  },

  // === LAB SAMPLES ===

  getLabSamples: async function() {
    const res = await fetch(`${this.BASE_URL}/cds/samples`, {
      headers: this._headers()
    });

    if (!res.ok) throw new Error('Gagal mengambil daftar sampel.');
    return await res.json();
  },

  updateSampleStatus: async function(sampleId, status) {
    const res = await fetch(`${this.BASE_URL}/cds/samples/${sampleId}/status`, {
      method: 'PUT',
      headers: this._headers(),
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Gagal memperbarui status sampel.');
    }

    return await res.json();
  },

  // === UPLOAD FILE ===

  uploadLabFile: async function(file) {
    const formData = new FormData();
    formData.append('labData', file);

    const res = await fetch(`${this.BASE_URL}/upload/lab`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Upload gagal.');
    }

    return await res.json();
  },

  uploadGenomicFile: async function(file) {
    const formData = new FormData();
    formData.append('genomicData', file);

    const res = await fetch(`${this.BASE_URL}/upload/genomic`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Upload gagal.');
    }

    return await res.json();
  }
};

// Auto-restore session saat halaman dimuat
if (typeof window !== 'undefined') {
  window.API = API;
}
