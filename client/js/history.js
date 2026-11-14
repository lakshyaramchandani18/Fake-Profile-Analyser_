/**
 * FPDS - Fake Profile Detection System
 * Investigation History Controller
 * Search, Platform filter, Risk Level filter, Date & Score Sorting, and Empty States
 */

(function () {
  'use strict';

  let allInvestigations = [];
  let searchQuery = '';
  let platformFilter = 'all';
  let riskFilter = 'all';
  let sortBy = 'date-desc';

  async function initHistory() {
    allInvestigations = await window.FPDS_API.getAnalysisHistory();
    setupFiltersAndListeners();
    renderHistoryTable();
  }

  function setupFiltersAndListeners() {
    const searchInput = document.getElementById('historySearchInput');
    const platformSelect = document.getElementById('filterPlatform');
    const riskSelect = document.getElementById('filterRiskLevel');
    const sortSelect = document.getElementById('sortOrder');
    const resetFiltersBtn = document.getElementById('resetHistoryFiltersBtn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderHistoryTable();
      });
    }

    if (platformSelect) {
      platformSelect.addEventListener('change', (e) => {
        platformFilter = e.target.value.toLowerCase();
        renderHistoryTable();
      });
    }

    if (riskSelect) {
      riskSelect.addEventListener('change', (e) => {
        riskFilter = e.target.value.toUpperCase();
        renderHistoryTable();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        renderHistoryTable();
      });
    }

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        searchQuery = '';
        platformFilter = 'all';
        riskFilter = 'all';
        sortBy = 'date-desc';

        if (searchInput) searchInput.value = '';
        if (platformSelect) platformSelect.value = 'all';
        if (riskSelect) riskSelect.value = 'all';
        if (sortSelect) sortSelect.value = 'date-desc';

        renderHistoryTable();
      });
    }
  }

  function renderHistoryTable() {
    const tbody = document.getElementById('historyTableBody');
    const emptyState = document.getElementById('historyEmptyState');
    const countBadge = document.getElementById('historyCountBadge');
    if (!tbody) return;

    // Filter logic
    let filtered = allInvestigations.filter(item => {
      // 1. Search Query (username or ID)
      if (searchQuery) {
        const matchUser = item.username.toLowerCase().includes(searchQuery);
        const matchId = item.id.toLowerCase().includes(searchQuery);
        if (!matchUser && !matchId) return false;
      }

      // 2. Platform Filter
      if (platformFilter !== 'all' && item.platform.toLowerCase() !== platformFilter) {
        return false;
      }

      // 3. Risk Level Filter
      if (riskFilter !== 'ALL' && item.riskLevel.toUpperCase() !== riskFilter) {
        return false;
      }

      return true;
    });

    // Sort logic
    filtered.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.investigationDate) - new Date(a.investigationDate);
      } else if (sortBy === 'date-asc') {
        return new Date(a.investigationDate) - new Date(b.investigationDate);
      } else if (sortBy === 'score-desc') {
        return b.riskScore - a.riskScore;
      } else if (sortBy === 'score-asc') {
        return a.riskScore - b.riskScore;
      }
      return 0;
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Case Records`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = filtered.map(item => {
      const riskClass = item.riskLevel.toLowerCase();
      return `
        <tr>
          <td><span class="id-badge">${item.id}</span></td>
          <td>
            <div class="table-user-cell">
              <span class="platform-icon-pill ${item.platform.toLowerCase()}">${item.platform}</span>
              <span class="table-username">@${window.FPDS_APP.escapeHTML(item.username)}</span>
            </div>
          </td>
          <td><span class="platform-name">${window.FPDS_APP.escapeHTML(item.platform)}</span></td>
          <td>
            <span class="score-pill ${riskClass}">
              ${item.riskScore} <span class="score-denom">/ 100</span>
            </span>
          </td>
          <td>
            <span class="risk-badge ${riskClass}">
              <span class="risk-badge-dot"></span>
              ${item.riskLevel}
            </span>
          </td>
          <td class="date-cell">${item.investigationDate}</td>
          <td style="text-align: right;">
            <a href="analysis.html?id=${item.id}" class="btn btn-sm btn-secondary" title="View Detailed Forensic Assessment">
              <span>View Details</span>
              <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
            </a>
          </td>
        </tr>
      `;
    }).join('');

    window.FPDS_APP.initIcons();
  }

  document.addEventListener('DOMContentLoaded', initHistory);
})();
