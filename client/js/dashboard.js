/**
 * FPDS - Fake Profile Detection System
 * Dashboard Page Controller
 * Charts, KPI Counters, Recent Investigations Table, and Priority Cases
 */

(function () {
  'use strict';

  let riskDoughnutChart = null;
  let activityLineChart = null;

  async function initDashboard() {
    await renderStatsAndCharts();
    await renderRecentInvestigationsTable();
    await renderPriorityInvestigations();
  }

  /**
   * 1. Render Statistic Cards & Chart.js Visualizations
   */
  async function renderStatsAndCharts() {
    const statsData = await window.FPDS_API.getDashboardStats();

    // Render Stat Cards
    setElementText('statTotalAnalyzed', statsData.totalAnalyzed.toLocaleString());
    setElementText('statLowRisk', statsData.lowRisk.toLocaleString());
    setElementText('statMediumRisk', statsData.mediumRisk.toLocaleString());
    setElementText('statHighRisk', statsData.highRisk.toLocaleString());
    setElementText('statCriticalRisk', statsData.criticalRisk.toLocaleString());

    // Render Chart.js Risk Distribution Doughnut Chart
    renderRiskDoughnut(statsData.riskDistribution);

    // Render Chart.js 7-Day Activity Chart
    renderActivityChart(statsData.activity7Days);
  }

  function setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  /**
   * Risk Distribution Doughnut Chart
   */
  function renderRiskDoughnut(dist) {
    const ctx = document.getElementById('riskDoughnutCanvas');
    if (!ctx) return;

    if (riskDoughnutChart) {
      riskDoughnutChart.destroy();
    }

    if (typeof Chart === 'undefined') {
      console.warn('[FPDS] Chart.js not loaded. Skipping chart rendering.');
      return;
    }

    riskDoughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: dist.labels,
        datasets: [{
          data: dist.data,
          backgroundColor: dist.colors,
          borderColor: '#172033',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94A3B8',
              font: { family: "'Inter', sans-serif", size: 12 },
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#111827',
            titleColor: '#F8FAFC',
            bodyColor: '#94A3B8',
            borderColor: '#263247',
            borderWidth: 1,
            padding: 10,
            boxPadding: 4,
            callbacks: {
              label: function (context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const val = context.raw;
                const pct = Math.round((val / total) * 100);
                return ` ${context.label}: ${val} (${pct}%)`;
              }
            }
          }
        },
        cutout: '72%'
      }
    });
  }

  /**
   * 7-Day Activity Chart
   */
  function renderActivityChart(act) {
    const ctx = document.getElementById('activityChartCanvas');
    if (!ctx) return;

    if (activityLineChart) {
      activityLineChart.destroy();
    }

    if (typeof Chart === 'undefined') return;

    activityLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: act.labels,
        datasets: [{
          label: 'Investigations Conducted',
          data: act.values,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.12)',
          borderWidth: 2.5,
          pointBackgroundColor: '#3B82F6',
          pointBorderColor: '#0B1120',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: '#64748B',
              font: { family: "'JetBrains Mono', monospace", size: 11 }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#94A3B8',
              font: { family: "'Inter', sans-serif", size: 12 }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#111827',
            titleColor: '#F8FAFC',
            bodyColor: '#94A3B8',
            borderColor: '#263247',
            borderWidth: 1,
            padding: 10
          }
        }
      }
    });
  }

  /**
   * 2. Render Recent Investigations Table (5 records)
   */
  async function renderRecentInvestigationsTable() {
    const tbody = document.getElementById('recentInvestigationsBody');
    if (!tbody) return;

    const allProfiles = await window.FPDS_API.getProfiles();
    const recent = allProfiles.slice(0, 5);

    tbody.innerHTML = recent.map(p => {
      const riskClass = getRiskClass(p.riskLevel);
      return `
        <tr>
          <td>
            <div class="table-user-cell">
              <span class="platform-icon-pill ${p.platform.toLowerCase()}">${p.platform}</span>
              <span class="table-username">@${window.FPDS_APP.escapeHTML(p.username)}</span>
            </div>
          </td>
          <td><span class="platform-name">${window.FPDS_APP.escapeHTML(p.platform)}</span></td>
          <td>
            <span class="score-pill ${riskClass}">
              ${p.riskScore} <span class="score-denom">/ 100</span>
            </span>
          </td>
          <td>
            <span class="risk-badge ${riskClass}">
              <span class="risk-badge-dot"></span>
              ${p.riskLevel}
            </span>
          </td>
          <td class="date-cell">${p.investigationDate}</td>
          <td style="text-align: right;">
            <a href="analysis.html?id=${p.id}" class="btn btn-sm btn-secondary">
              <span>View Details</span>
              <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
            </a>
          </td>
        </tr>
      `;
    }).join('');

    window.FPDS_APP.initIcons();
  }

  /**
   * 3. Render Priority Investigations (3 High or Critical Profiles)
   */
  async function renderPriorityInvestigations() {
    const container = document.getElementById('priorityInvestigationsContainer');
    if (!container) return;

    const allProfiles = await window.FPDS_API.getProfiles();
    const priority = allProfiles.filter(p => p.riskLevel === 'CRITICAL' || p.riskLevel === 'HIGH').slice(0, 3);

    container.innerHTML = priority.map(p => {
      const riskClass = getRiskClass(p.riskLevel);
      return `
        <div class="priority-case-card ${riskClass}">
          <div class="priority-case-header">
            <div>
              <span class="priority-platform-tag">${p.platform}</span>
              <h4 class="priority-username">@${window.FPDS_APP.escapeHTML(p.username)}</h4>
            </div>
            <span class="risk-badge ${riskClass}">
              <span class="risk-badge-dot"></span>
              ${p.riskLevel}
            </span>
          </div>
          <div class="priority-case-body">
            <div class="priority-score-row">
              <span class="priority-score-label">Risk Assessment:</span>
              <span class="priority-score-value ${riskClass}">${p.riskScore} / 100</span>
            </div>
            <p class="priority-notes">${window.FPDS_APP.escapeHTML(p.investigatorNotes || 'Suspicious behavioral markers detected.')}</p>
          </div>
          <div class="priority-case-footer">
            <a href="analysis.html?id=${p.id}" class="btn btn-sm btn-primary w-full">
              <i data-lucide="crosshair" style="width: 14px; height: 14px;"></i>
              <span>View Investigation</span>
            </a>
          </div>
        </div>
      `;
    }).join('');

    window.FPDS_APP.initIcons();
  }

  function getRiskClass(level) {
    if (level === 'CRITICAL') return 'critical';
    if (level === 'HIGH') return 'high';
    if (level === 'MEDIUM') return 'medium';
    return 'low';
  }

  document.addEventListener('DOMContentLoaded', initDashboard);
})();
