/**
 * FPDS - Fake Profile Detection System
 * Profile Analysis View Controller
 * Visual Risk Meter, Evidence Indicators, and Report Trigger Placeholder
 */

(function () {
  'use strict';

  async function initProfileAnalysis() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');

    const result = await window.FPDS_API.analyzeProfile(profileId || 'INV-2026-001');

    if (!result || !result.profile) {
      window.FPDS_APP.showToast('Profile Not Found', 'Could not locate the requested profile record.', 'error');
      return;
    }

    renderProfileHeader(result.profile);
    renderRiskScoreMeter(result.evaluation);
    renderEvidenceIndicators(result.evaluation.indicators);
    setupActionButtons(result.profile);
  }

  /**
   * 1. Populate Target Profile Metadata Header
   */
  function renderProfileHeader(profile) {
    const usernameEl = document.getElementById('analysisUsername');
    const platformEl = document.getElementById('analysisPlatform');
    const caseIdEl = document.getElementById('analysisCaseId');
    const dateEl = document.getElementById('analysisDate');
    const ageEl = document.getElementById('metaAccountAge');
    const postsEl = document.getElementById('metaPosts');
    const followersEl = document.getElementById('metaFollowers');
    const followingEl = document.getElementById('metaFollowing');
    const picStatusEl = document.getElementById('metaPicStatus');
    const notesEl = document.getElementById('metaNotes');

    if (usernameEl) usernameEl.textContent = `@${profile.username}`;
    if (platformEl) {
      platformEl.textContent = profile.platform;
      platformEl.className = `platform-icon-pill ${profile.platform.toLowerCase()}`;
    }
    if (caseIdEl) caseIdEl.textContent = profile.id;
    if (dateEl) dateEl.textContent = profile.investigationDate;

    if (ageEl) ageEl.textContent = `${profile.accountAgeDays} Days`;
    if (postsEl) postsEl.textContent = Number(profile.postsCount).toLocaleString();
    if (followersEl) followersEl.textContent = Number(profile.followersCount).toLocaleString();
    if (followingEl) followingEl.textContent = Number(profile.followingCount).toLocaleString();
    if (picStatusEl) {
      picStatusEl.textContent = profile.hasProfilePic ? 'Custom Photo Active' : 'Default / Missing Avatar';
      picStatusEl.style.color = profile.hasProfilePic ? 'var(--color-green)' : 'var(--color-red)';
    }
    if (notesEl) {
      notesEl.textContent = profile.investigatorNotes || 'No additional investigative notes logged.';
    }
  }

  /**
   * 2. Visual Risk Score Gauge & Classification
   */
  function renderRiskScoreMeter(evaluation) {
    const scoreNumEl = document.getElementById('riskScoreNumber');
    const scoreLevelEl = document.getElementById('riskScoreLevel');
    const progressBarEl = document.getElementById('riskScoreProgressBar');
    const meterBoxEl = document.getElementById('riskMeterBox');

    const score = evaluation.score;
    const level = evaluation.level;
    const riskClass = level.toLowerCase();

    if (scoreNumEl) {
      scoreNumEl.textContent = score;
      scoreNumEl.className = `score-large-val ${riskClass}`;
    }

    if (scoreLevelEl) {
      scoreLevelEl.textContent = `${level} RISK`;
      scoreLevelEl.className = `risk-badge ${riskClass} btn-lg`;
    }

    if (progressBarEl) {
      progressBarEl.style.width = `${score}%`;
      progressBarEl.className = `progress-fill ${riskClass}`;
    }

    if (meterBoxEl) {
      meterBoxEl.className = `risk-score-hero-box ${riskClass}`;
    }
  }

  /**
   * 3. Render Suspicious Evidence Indicator Cards
   */
  function renderEvidenceIndicators(indicators) {
    const container = document.getElementById('evidenceCardsContainer');
    if (!container) return;

    if (!indicators || indicators.length === 0) {
      container.innerHTML = '<p class="text-secondary">No specific heuristic flags triggered.</p>';
      return;
    }

    container.innerHTML = indicators.map(ind => {
      const isFlagged = ind.status === 'FLAGGED';
      const badgeClass = isFlagged ? 'critical' : 'cleared';
      const iconName = isFlagged ? 'alert-triangle' : 'check-circle-2';

      return `
        <div class="evidence-card ${isFlagged ? 'flagged' : 'clean'}">
          <div class="evidence-card-header">
            <div class="evidence-title-row">
              <span class="evidence-icon-wrap ${isFlagged ? 'flagged' : 'clean'}">
                <i data-lucide="${iconName}" style="width: 18px; height: 18px;"></i>
              </span>
              <h4 class="evidence-name">${window.FPDS_APP.escapeHTML(ind.name)}</h4>
            </div>
            <div class="evidence-badges-row">
              <span class="points-badge ${isFlagged ? 'flagged' : 'clean'}">${ind.points} Pts</span>
              <span class="risk-badge ${badgeClass}">${ind.status}</span>
            </div>
          </div>
          <p class="evidence-explanation">${window.FPDS_APP.escapeHTML(ind.explanation)}</p>
        </div>
      `;
    }).join('');

    window.FPDS_APP.initIcons();
  }

  /**
   * 4. Setup Action Buttons & Generate Report Placeholder
   */
  function setupActionButtons(profile) {
    const reportBtn = document.getElementById('generateReportBtn');
    const modal = document.getElementById('reportNoticeModal');
    const modalCloseBtn = document.getElementById('closeReportNoticeModal');

    if (reportBtn) {
      reportBtn.addEventListener('click', () => {
        if (modal) {
          modal.classList.add('active');
        } else {
          window.FPDS_APP.showToast(
            'Backend Integration Pending',
            `Forensic report for @${profile.username} will be compiled once the Express PDF backend service is connected.`,
            'warning'
          );
        }
      });
    }

    if (modalCloseBtn && modal) {
      modalCloseBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initProfileAnalysis);
})();
