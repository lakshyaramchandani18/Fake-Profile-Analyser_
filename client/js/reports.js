/**
 * FPDS - Fake Profile Detection System
 * Reports View Controller
 * Audit log management, report viewer modal, and backend PDF download disclaimer
 */

(function () {
  'use strict';

  let allReports = [];
  let searchQuery = '';
  let riskFilter = 'ALL';

  async function initReports() {
    allReports = await window.FPDS_API.getReports();
    setupReportFilters();
    renderReportsTable();
  }

  function setupReportFilters() {
    const searchInput = document.getElementById('reportSearchInput');
    const riskSelect = document.getElementById('reportFilterRisk');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderReportsTable();
      });
    }

    if (riskSelect) {
      riskSelect.addEventListener('change', (e) => {
        riskFilter = e.target.value.toUpperCase();
        renderReportsTable();
      });
    }

    // Modal Close
    const modalCloseBtn = document.getElementById('closeReportViewModal');
    const modal = document.getElementById('reportViewModal');
    if (modalCloseBtn && modal) {
      modalCloseBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
  }

  function renderReportsTable() {
    const tbody = document.getElementById('reportsTableBody');
    const emptyState = document.getElementById('reportsEmptyState');
    if (!tbody) return;

    const filtered = allReports.filter(rep => {
      if (searchQuery) {
        const matchUser = (rep.username || '').toLowerCase().includes(searchQuery);
        const matchId = (rep.reportId || '').toLowerCase().includes(searchQuery);
        if (!matchUser && !matchId) return false;
      }
      if (riskFilter.toUpperCase() !== 'ALL' && (rep.riskLevel || '').toUpperCase() !== riskFilter.toUpperCase()) {
        return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = filtered.map(rep => {
      const riskClass = rep.riskLevel.toLowerCase();
      return `
        <tr>
          <td><span class="id-badge">${rep.reportId}</span></td>
          <td>
            <div class="table-user-cell">
              <span class="platform-icon-pill ${rep.platform.toLowerCase()}">${rep.platform}</span>
              <span class="table-username">@${window.FPDS_APP.escapeHTML(rep.username)}</span>
            </div>
          </td>
          <td>
            <span class="risk-badge ${riskClass}">
              <span class="risk-badge-dot"></span>
              ${rep.riskLevel} (${rep.riskScore}/100)
            </span>
          </td>
          <td class="date-cell">${rep.generatedDate}</td>
          <td>
            <span class="status-chip ${rep.status === 'Generated' ? 'active' : 'neutral'}">
              ${rep.status}
            </span>
          </td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 0.5rem;">
              <button class="btn btn-sm btn-secondary view-report-btn" data-id="${rep.reportId}" title="Preview Forensic Dossier">
                <i data-lucide="file-text" style="width: 14px; height: 14px;"></i>
                <span>View</span>
              </button>
              <button class="btn btn-sm btn-secondary download-report-btn" data-id="${rep.reportId}" title="Download Signed PDF Dossier">
                <i data-lucide="download" style="width: 14px; height: 14px;"></i>
                <span>Download</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Action Handlers
    tbody.querySelectorAll('.view-report-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const reportId = btn.getAttribute('data-id');
        openReportModal(reportId);
      });
    });

    tbody.querySelectorAll('.download-report-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const reportId = btn.getAttribute('data-id');
        handleReportDownloadNotice(reportId);
      });
    });

    window.FPDS_APP.initIcons();
  }

  function openReportModal(reportId) {
    const report = allReports.find(r => r.reportId === reportId);
    if (!report) return;

    const modal = document.getElementById('reportViewModal');
    if (!modal) return;

    document.getElementById('modalReportId').textContent = report.reportId;
    document.getElementById('modalReportTarget').textContent = `@${report.username} (${report.platform})`;
    document.getElementById('modalReportDate').textContent = report.generatedDate;
    document.getElementById('modalReportInvestigator').textContent = report.investigator || 'Det. Assigned (Cyber Cell)';
    document.getElementById('modalReportScore').textContent = `${report.riskScore}/100 [${report.riskLevel}]`;
    document.getElementById('modalReportSummary').textContent = report.summary;

    modal.classList.add('active');
  }

  async function handleReportDownloadNotice(reportId) {
    const result = await window.FPDS_API.downloadReport(reportId);
    window.FPDS_APP.showToast(
      'PDF Service Pending Backend',
      `Report #${reportId} is ready for export. Actual PDF generation requires the Express/Puppeteer backend service to be connected.`,
      'warning'
    );
  }

  document.addEventListener('DOMContentLoaded', initReports);
})();
