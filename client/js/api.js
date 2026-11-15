/**
 * FPDS - Fake Profile Detection System
 * Centralized API Integration Client
 * Pre-configured for future Express / PostgreSQL Backend Connection
 */

const API_BASE_URL = "http://localhost:3000/api";

// Toggle between Backend API and Local Mock Engine (Defaults to mock mode for frontend phase)
const USE_MOCK_FALLBACK = true;

const FPDS_API = {
  baseUrl: API_BASE_URL,

  /**
   * Safe fetch wrapper with timeout and fallback
   */
  async request(endpoint, options = {}) {
    if (USE_MOCK_FALLBACK) {
      // Backend not yet running; return null to immediately engage client-side mock provider
      return null;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.warn(`[FPDS API] Backend unreachable at ${endpoint}. Using client mock data. Reason:`, err.message);
      return null;
    }
  },

  /**
   * 1. Get Dashboard Overview Metrics
   */
  async getDashboardStats() {
    const remoteData = await this.request('/dashboard/stats');
    if (remoteData && remoteData.success) {
      return remoteData.data;
    }

    // Dynamic mock aggregation based on stored profiles
    const profiles = window.FPDS_MOCK.getAllProfiles();
    let low = 0, med = 0, high = 0, crit = 0;

    profiles.forEach(p => {
      if (p.riskLevel === 'CRITICAL') crit++;
      else if (p.riskLevel === 'HIGH') high++;
      else if (p.riskLevel === 'MEDIUM') med++;
      else low++;
    });

    return {
      totalAnalyzed: profiles.length >= 248 ? profiles.length : 248 + (profiles.length - 7),
      lowRisk: 102 + (low - 2),
      mediumRisk: 76 + (med - 1),
      highRisk: 48 + (high - 2),
      criticalRisk: 22 + (crit - 2),
      activity7Days: window.FPDS_MOCK.data.activity7Days,
      riskDistribution: window.FPDS_MOCK.data.riskDistribution
    };
  },

  /**
   * 2. Get Profiles List
   */
  async getProfiles() {
    const remoteData = await this.request('/profiles');
    if (remoteData && remoteData.success) {
      return remoteData.data;
    }
    return window.FPDS_MOCK.getAllProfiles();
  },

  /**
   * 3. Create a New Profile Record
   */
  async createProfile(profileData) {
    const remoteData = await this.request('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });

    if (remoteData && remoteData.success) {
      return remoteData.data;
    }

    // Local Storage Mock Persistence
    return window.FPDS_MOCK.saveNewProfile(profileData);
  },

  /**
   * 4. Analyze Profile by ID
   */
  async analyzeProfile(profileId) {
    const remoteData = await this.request(`/profiles/${profileId}/analyze`);
    if (remoteData && remoteData.success) {
      return remoteData.data;
    }

    const profile = window.FPDS_MOCK.getProfileById(profileId);
    if (!profile) return null;

    const evaluation = window.FPDS_MOCK.calculateProfileRisk(profile);
    return {
      profile,
      evaluation
    };
  },

  /**
   * 5. Get Investigation History
   */
  async getAnalysisHistory() {
    const remoteData = await this.request('/investigations');
    if (remoteData && remoteData.success) {
      return remoteData.data;
    }
    return window.FPDS_MOCK.getAllProfiles();
  },

  /**
   * 6. Get Report Archives
   */
  async getReports() {
    const remoteData = await this.request('/reports');
    if (remoteData && remoteData.success) {
      return remoteData.data;
    }
    return window.FPDS_MOCK.getAllReports();
  },

  /**
   * 7. Download PDF Report (Placeholder for backend PDF service)
   */
  async downloadReport(reportId) {
    const remoteData = await this.request(`/reports/${reportId}/download`);
    if (remoteData && remoteData.success) {
      return remoteData.data;
    }
    return {
      success: false,
      isPendingBackend: true,
      message: "PDF generation is an Express/Puppeteer backend feature that will be connected in Phase 2."
    };
  }
};

window.FPDS_API = FPDS_API;
