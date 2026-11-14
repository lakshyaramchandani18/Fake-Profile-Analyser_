/**
 * FPDS - Fake Profile Detection System
 * Methodology View Controller
 * Interactive Heuristic Calculator & Rule Explanations
 */

(function () {
  'use strict';

  function initMethodology() {
    setupSimulator();
  }

  /**
   * Interactive Rule-Based Scoring Simulator
   */
  function setupSimulator() {
    const ageSelect = document.getElementById('simAge');
    const postsSelect = document.getElementById('simPosts');
    const picSelect = document.getElementById('simPic');
    const ratioSelect = document.getElementById('simRatio');
    const followersSelect = document.getElementById('simFollowers');
    const usernameSelect = document.getElementById('simUsername');
    const activitySelect = document.getElementById('simActivity');

    const inputs = [ageSelect, postsSelect, picSelect, ratioSelect, followersSelect, usernameSelect, activitySelect];
    inputs.forEach(input => {
      if (input) {
        input.addEventListener('change', updateSimulationScore);
      }
    });

    updateSimulationScore();
  }

  function updateSimulationScore() {
    const ageSelect = document.getElementById('simAge');
    const postsSelect = document.getElementById('simPosts');
    const picSelect = document.getElementById('simPic');
    const ratioSelect = document.getElementById('simRatio');
    const followersSelect = document.getElementById('simFollowers');
    const usernameSelect = document.getElementById('simUsername');
    const activitySelect = document.getElementById('simActivity');

    let total = 0;

    // 1. Age
    if (ageSelect) total += Number(ageSelect.value);
    // 2. Posts
    if (postsSelect) total += Number(postsSelect.value);
    // 3. Pic
    if (picSelect) total += Number(picSelect.value);
    // 4. Ratio
    if (ratioSelect) total += Number(ratioSelect.value);
    // 5. Followers
    if (followersSelect) total += Number(followersSelect.value);
    // 6. Username
    if (usernameSelect) total += Number(usernameSelect.value);
    // 7. Activity
    if (activitySelect) total += Number(activitySelect.value);

    total = Math.min(100, total);

    let level = 'LOW';
    let riskClass = 'low';

    if (total >= 75) {
      level = 'CRITICAL';
      riskClass = 'critical';
    } else if (total >= 50) {
      level = 'HIGH';
      riskClass = 'high';
    } else if (total >= 25) {
      level = 'MEDIUM';
      riskClass = 'medium';
    }

    const scoreNumEl = document.getElementById('simScoreValue');
    const scoreBadgeEl = document.getElementById('simScoreBadge');
    const scoreBarEl = document.getElementById('simScoreBar');

    if (scoreNumEl) {
      scoreNumEl.textContent = total;
      scoreNumEl.className = `score-large-val ${riskClass}`;
    }

    if (scoreBadgeEl) {
      scoreBadgeEl.textContent = `${level} RISK`;
      scoreBadgeEl.className = `risk-badge ${riskClass}`;
    }

    if (scoreBarEl) {
      scoreBarEl.style.width = `${total}%`;
      scoreBarEl.className = `progress-fill ${riskClass}`;
    }
  }

  document.addEventListener('DOMContentLoaded', initMethodology);
})();
