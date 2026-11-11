/**
 * Fake Social Media Profile Detection and Reporting System (FPDS)
 * Dashboard Controller & Forensics Operations Engine
 * ASD Capstone Project
 */

(function () {
  'use strict';

  // Local state
  let currentFilter = 'all';
  let searchQuery = '';
  let selectedInvestigationId = null;

  /**
   * Initialize Dashboard
   */
  function initDashboard() {
    renderSystemMetrics();
    renderInvestigationsTable();
    renderActivityFeed();
    renderMethodologyContent();
    setupDashboardEventHandlers();

    // Select the first investigation by default for the inspector
    if (FPDS_MOCK_DATA && FPDS_MOCK_DATA.investigations.length > 0) {
      selectInvestigation(FPDS_MOCK_DATA.investigations[0].id);
    }
  }

  /**
   * Render Metrics with number formatting
   */
  function renderSystemMetrics() {
    const data = FPDS_MOCK_DATA.systemOverview.metrics;

    animateMetricNumber('statTotalScanned', data.totalScanned);
    animateMetricNumber('statHighRisk', data.highRiskDetected);
    animateMetricNumber('statBotClusters', data.botClustersIdentified);
    
    const confidenceEl = document.getElementById('statConfidence');
    if (confidenceEl) {
      confidenceEl.textContent = `${data.avgDetectionConfidence}%`;
    }
  }

  function animateMetricNumber(elementId, targetValue) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOutProgress * targetValue);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = targetValue.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  }

  /**
   * Render Investigations Table
   */
  function renderInvestigationsTable() {
    const tbody = document.getElementById('investigationsTableBody');
    if (!tbody) return;

    const list = FPDS_MOCK_DATA.investigations.filter(item => {
      // Filter tab
      if (currentFilter === 'critical-high' && !['critical', 'high'].includes(item.riskLevel)) return false;
      if (currentFilter === 'medium' && item.riskLevel !== 'medium') return false;
      if (currentFilter === 'cleared' && item.riskLevel !== 'low') return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = item.handle.toLowerCase().includes(q) ||
                      item.displayName.toLowerCase().includes(q) ||
                      item.platformName.toLowerCase().includes(q) ||
                      item.threatCategory.toLowerCase().includes(q) ||
                      item.id.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            <i data-lucide="search-x" style="width: 32px; height: 32px; margin: 0 auto 0.5rem; display: block; opacity: 0.5;"></i>
            No forensic records matched the current filter criteria.
          </td>
        </tr>
      `;
      refreshLucideIcons();
      return;
    }

    tbody.innerHTML = list.map(inv => {
      const isSelected = inv.id === selectedInvestigationId;
      const riskBadgeClass = inv.riskLevel === 'critical' ? 'critical' :
                             inv.riskLevel === 'high' ? 'high' :
                             inv.riskLevel === 'medium' ? 'medium' : 'cleared';

      return `
        <tr class="${isSelected ? 'selected' : ''}" data-id="${inv.id}">
          <td><span class="id-badge">${inv.id}</span></td>
          <td>
            <div class="profile-cell">
              <div class="profile-avatar">${inv.avatarInitials}</div>
              <div class="profile-names">
                <span class="profile-display-name">${escapeHTML(inv.displayName)}</span>
                <span class="profile-handle">${escapeHTML(inv.handle)}</span>
              </div>
            </div>
          </td>
          <td>
            <span class="platform-tag">
              ${escapeHTML(inv.platformName)}
            </span>
          </td>
          <td>
            <span class="risk-badge ${riskBadgeClass}">
              <span class="risk-badge-dot"></span>
              ${inv.riskScore}/100 • ${inv.riskLevel}
            </span>
          </td>
          <td>
            <span style="font-size: 0.8125rem; color: var(--text-secondary);">${escapeHTML(inv.threatCategory)}</span>
          </td>
          <td style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${inv.timestamp}</td>
          <td style="text-align: right;">
            <button class="btn btn-sm btn-secondary inspect-btn" data-id="${inv.id}" title="Inspect Profile">
              <span>Inspect</span>
              <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row click events
    tbody.querySelectorAll('tr[data-id]').forEach(row => {
      row.addEventListener('click', (e) => {
        const id = row.getAttribute('data-id');
        selectInvestigation(id);
      });
    });

    refreshLucideIcons();
  }

  /**
   * Select and populate Forensic Profile Inspector
   */
  function selectInvestigation(id) {
    selectedInvestigationId = id;
    const inv = FPDS_MOCK_DATA.investigations.find(item => item.id === id);
    if (!inv) return;

    // Highlight row in table
    document.querySelectorAll('#investigationsTableBody tr').forEach(r => {
      r.classList.toggle('selected', r.getAttribute('data-id') === id);
    });

    // Populate Inspector panel
    const avatarEl = document.getElementById('inspectorAvatar');
    const nameEl = document.getElementById('inspectorDisplayName');
    const handleEl = document.getElementById('inspectorHandle');
    const platformEl = document.getElementById('inspectorPlatform');
    const scoreNumEl = document.getElementById('inspectorScoreNum');
    const scoreBadgeEl = document.getElementById('inspectorScoreBadge');
    const scoreProgressEl = document.getElementById('inspectorScoreProgress');
    const accountAgeEl = document.getElementById('inspectorAccountAge');
    const followersEl = document.getElementById('inspectorFollowers');
    const signalsListEl = document.getElementById('inspectorSignalsList');

    if (avatarEl) avatarEl.textContent = inv.avatarInitials;
    if (nameEl) nameEl.textContent = inv.displayName;
    if (handleEl) handleEl.textContent = inv.handle;
    if (platformEl) platformEl.textContent = inv.platformName;

    if (accountAgeEl) accountAgeEl.textContent = inv.accountAge;
    if (followersEl) followersEl.textContent = `${inv.followers.toLocaleString()} / ${inv.following.toLocaleString()}`;

    // Score & classification
    if (scoreNumEl) {
      scoreNumEl.textContent = inv.riskScore;
      scoreNumEl.className = `threat-score-large ${inv.riskLevel}`;
    }

    if (scoreBadgeEl) {
      scoreBadgeEl.textContent = inv.threatCategory;
      scoreBadgeEl.className = `risk-badge ${inv.riskLevel}`;
    }

    if (scoreProgressEl) {
      scoreProgressEl.style.width = `${inv.riskScore}%`;
      scoreProgressEl.className = `progress-fill ${inv.riskLevel}`;
    }

    // Breakdown Factor bars
    setFactorBar('factorMetadata', inv.breakdown.metadataAnomaly);
    setFactorBar('factorBurst', inv.breakdown.behavioralBurstRate);
    setFactorBar('factorNetwork', inv.breakdown.networkClusterDensity);
    setFactorBar('factorScripting', inv.breakdown.linguisticScripting);
    setFactorBar('factorAvatar', inv.breakdown.avatarAuthenticity, true); // true = inverted (lower is fake)

    // Signals
    if (signalsListEl) {
      signalsListEl.innerHTML = inv.signals.map(signal => `
        <li class="signal-item">
          <i data-lucide="alert-triangle" class="signal-icon" style="width: 14px; height: 14px;"></i>
          <span>${escapeHTML(signal)}</span>
        </li>
      `).join('');
    }

    refreshLucideIcons();
  }

  function setFactorBar(idPrefix, value, isInverted = false) {
    const valEl = document.getElementById(`${idPrefix}Value`);
    const barEl = document.getElementById(`${idPrefix}Bar`);

    if (valEl) valEl.textContent = `${value}%`;
    if (barEl) {
      barEl.style.width = `${value}%`;

      if (isInverted) {
        // Lower authenticity = higher danger
        barEl.className = value < 30 ? 'progress-fill critical' : value < 60 ? 'progress-fill high' : 'progress-fill low';
      } else {
        barEl.className = value >= 80 ? 'progress-fill critical' : value >= 50 ? 'progress-fill high' : 'progress-fill low';
      }
    }
  }

  /**
   * Render Live Threat Activity Feed
   */
  function renderActivityFeed() {
    const container = document.getElementById('threatFeedContainer');
    if (!container) return;

    const stream = FPDS_MOCK_DATA.activityStream;
    container.innerHTML = stream.map(item => {
      const iconName = item.type === 'alert' ? 'alert-octagon' :
                        item.type === 'scan' ? 'radar' :
                        item.type === 'report' ? 'file-check-2' : 'check-circle-2';

      return `
        <div class="feed-item">
          <div class="feed-icon-box ${item.type}">
            <i data-lucide="${iconName}" style="width: 16px; height: 16px;"></i>
          </div>
          <div class="feed-body">
            <div class="feed-header-row">
              <span class="feed-title">${escapeHTML(item.title)}</span>
              <span class="feed-time">${item.time}</span>
            </div>
            <p class="feed-desc">${escapeHTML(item.description)}</p>
          </div>
        </div>
      `;
    }).join('');

    refreshLucideIcons();
  }

  /**
   * Render Methodology Content inside Modal & Accordion
   */
  function renderMethodologyContent() {
    const container = document.getElementById('methodologyContainer');
    if (!container) return;

    const steps = FPDS_MOCK_DATA.methodologySteps;
    container.innerHTML = steps.map(step => `
      <div class="methodology-step-card">
        <div class="step-num-badge">0${step.step}</div>
        <div class="step-content">
          <div class="step-header">
            <h4 class="step-title">${escapeHTML(step.title)}</h4>
            <span class="step-code">${step.code}</span>
          </div>
          <p class="step-desc">${escapeHTML(step.description)}</p>
        </div>
      </div>
    `).join('');

    refreshLucideIcons();
  }

  /**
   * Dashboard Event Handlers
   */
  function setupDashboardEventHandlers() {
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        filterTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter || 'all';
        renderInvestigationsTable();
      });
    });

    // Table search input
    const tableSearchInput = document.getElementById('tableSearchInput');
    if (tableSearchInput) {
      tableSearchInput.addEventListener('input', function (e) {
        searchQuery = e.target.value.trim();
        renderInvestigationsTable();
      });
    }

    // Quick Scan Form Submission (Interactive Simulation)
    const quickScanForm = document.getElementById('quickScanForm');
    if (quickScanForm) {
      quickScanForm.addEventListener('submit', handleQuickScanSubmit);
    }

    // Modal Close Triggers
    document.querySelectorAll('.modal-close-btn, .modal-cancel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      });
    });

    // Export Dossier Action
    const exportBtn = document.getElementById('exportDossierBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (window.FPDS_APP && typeof window.FPDS_APP.showToast === 'function') {
          window.FPDS_APP.showToast(
            'Forensic Dossier Compiled',
            `Investigation dossier for #${selectedInvestigationId || 'TARGET'} generated and cached in client memory.`,
            'success'
          );
        }
      });
    }

    // Flag Network Action
    const flagBtn = document.getElementById('flagNetworkBtn');
    if (flagBtn) {
      flagBtn.addEventListener('click', () => {
        if (window.FPDS_APP && typeof window.FPDS_APP.showToast === 'function') {
          window.FPDS_APP.showToast(
            'Threat Marker Applied',
            `Target #${selectedInvestigationId || 'TARGET'} flagged in Coordinated Bot Syndicate Watchlist.`,
            'alert'
          );
        }
      });
    }
  }

  /**
   * Handle Quick Scan submission
   */
  function handleQuickScanSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('quickScanInput');
    const platformSelect = document.getElementById('platformSelect');
    const submitBtn = document.getElementById('scanSubmitBtn');

    if (!input || !input.value.trim()) {
      if (window.FPDS_APP) window.FPDS_APP.showToast('Input Required', 'Please enter a target username or social profile link.', 'alert');
      return;
    }

    const targetQuery = input.value.trim();
    const platform = platformSelect ? platformSelect.value : 'twitter';
    const originalText = submitBtn.innerHTML;

    // Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <i data-lucide="loader-2" class="spin-icon" style="width: 16px; height: 16px;"></i>
      <span>Analyzing Telemetry...</span>
    `;
    refreshLucideIcons();

    // Simulate forensic execution delay
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      refreshLucideIcons();

      // Synthesize new investigation entry
      const randomScore = Math.floor(Math.random() * 40) + 60; // 60 - 99
      const newInv = {
        id: `INV-2026-${Math.floor(Math.random() * 8999 + 1000)}`,
        platform: platform,
        platformName: platform.charAt(0).toUpperCase() + platform.slice(1),
        handle: targetQuery.startsWith('@') ? targetQuery : `@${targetQuery.replace(/https?:\/\/[^/]+\//, '')}`,
        displayName: targetQuery.replace(/[@/]/g, ' ').toUpperCase(),
        avatarInitials: targetQuery.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || 'TX',
        riskScore: randomScore,
        riskLevel: randomScore >= 80 ? 'critical' : randomScore >= 60 ? 'high' : 'medium',
        threatCategory: 'Coordinated Astroturfing Bot',
        accountAge: '18 days',
        followers: Math.floor(Math.random() * 500),
        following: Math.floor(Math.random() * 4000) + 1200,
        postsCount: 520,
        status: 'Flagged High Risk',
        timestamp: 'Just now',
        investigator: 'Analyst #Current',
        signals: [
          'High burst rate of automated retweets across identical clusters',
          'AI-synthesized facial features detected in profile avatar',
          'Linguistic token entropy below typical human baseline'
        ],
        breakdown: {
          avatarAuthenticity: 15,
          metadataAnomaly: 88,
          behavioralBurstRate: 91,
          networkClusterDensity: 84,
          linguisticScripting: 79
        }
      };

      // Add to beginning of mock list
      FPDS_MOCK_DATA.investigations.unshift(newInv);
      renderInvestigationsTable();
      selectInvestigation(newInv.id);

      input.value = '';

      if (window.FPDS_APP && typeof window.FPDS_APP.showToast === 'function') {
        window.FPDS_APP.showToast(
          'Analysis Complete',
          `Forensic scan for ${newInv.handle} completed with Threat Index: ${newInv.riskScore}/100.`,
          newInv.riskLevel === 'critical' ? 'alert' : 'info'
        );
      }
    }, 1200);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  function refreshLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }
})();

