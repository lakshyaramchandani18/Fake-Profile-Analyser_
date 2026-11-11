/**
 * Fake Social Media Profile Detection and Reporting System (FPDS)
 * Navigation & Sidebar Controller
 * ASD Capstone Project
 */

(function () {
  'use strict';

  // State
  let isSidebarOpen = false;

  /**
   * Initialize Navigation System
   */
  function initNavigation() {
    setupMobileSidebar();
    setupActiveStates();
    setupNavClickHandlers();
    setupKeyboardShortcuts();
  }

  /**
   * Setup Mobile Sidebar drawer toggle and backdrop
   */
  function setupMobileSidebar() {
    const mobileMenuBtn = document.getElementById('mobileMenuToggle');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const backdrop = document.getElementById('sidebarBackdrop');

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', toggleSidebar);
    }

    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener('click', closeSidebar);
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeSidebar);
    }
  }

  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
    if (isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }

  function closeSidebar() {
    isSidebarOpen = false;
    document.body.classList.remove('sidebar-open');
  }

  /**
   * Determine and highlight active navigation item
   */
  function setupActiveStates() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');

    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (!href) return;

      // Reset
      item.classList.remove('active');

      // Check hash or path match
      if (currentHash && href.includes(currentHash)) {
        item.classList.add('active');
      } else if (!currentHash && (href.endsWith('dashboard.html') || href === 'dashboard.html')) {
        if (currentPath.includes('dashboard.html') || currentPath.endsWith('/') || currentPath.includes('index.html')) {
          item.classList.add('active');
        }
      }
    });
  }

  /**
   * Attach click handlers to navigation items for seamless in-page routing & modals
   */
  function setupNavClickHandlers() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');

    navItems.forEach(item => {
      item.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const action = this.dataset.action;

        // Set active appearance
        navItems.forEach(n => n.classList.remove('active'));
        this.classList.add('active');

        // Close mobile drawer on navigation
        if (window.innerWidth <= 1024) {
          closeSidebar();
        }

        // Handle specific modal or anchor actions
        if (action === 'new-investigation' || href === '#new-investigation') {
          e.preventDefault();
          handleNewInvestigationTrigger();
        } else if (action === 'methodology' || href === '#methodology') {
          e.preventDefault();
          handleMethodologyTrigger();
        } else if (action === 'reports' || href === '#reports') {
          e.preventDefault();
          handleReportsTrigger();
        } else if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetEl = document.querySelector(href);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.location.hash = href;
          }
        }
      });
    });
  }

  /**
   * Triggers for specialized views
   */
  function handleNewInvestigationTrigger() {
    const newInvModal = document.getElementById('newInvestigationModal');
    if (newInvModal) {
      newInvModal.classList.add('active');
    } else {
      // Focus the on-page quick scanner if modal not present
      const scannerInput = document.getElementById('quickScanInput');
      if (scannerInput) {
        scannerInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        scannerInput.focus();
        scannerInput.classList.add('scanner-highlight');
        setTimeout(() => scannerInput.classList.remove('scanner-highlight'), 1200);
      }
    }
  }

  function handleMethodologyTrigger() {
    const methodologyModal = document.getElementById('methodologyModal');
    if (methodologyModal) {
      methodologyModal.classList.add('active');
    } else {
      const section = document.getElementById('methodology');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function handleReportsTrigger() {
    const reportsModal = document.getElementById('reportsModal');
    if (reportsModal) {
      reportsModal.classList.add('active');
    } else {
      if (window.FPDS_APP && typeof window.FPDS_APP.showToast === 'function') {
        window.FPDS_APP.showToast('Reports Dossier', 'University ASD Forensic Reports archive ready for export.', 'info');
      }
    }
  }

  /**
   * Keyboard shortcuts
   */
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Close sidebar or modals on Escape
      if (e.key === 'Escape') {
        closeSidebar();
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      }

      // Quick search focus on / or Ctrl+K / Cmd+K
      if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        const topSearch = document.getElementById('topSearchInput') || document.getElementById('quickScanInput');
        if (topSearch) topSearch.focus();
      }
    });
  }

  // Expose Navigation API
  window.FPDS_NAV = {
    toggleSidebar,
    closeSidebar,
    handleNewInvestigationTrigger,
    handleMethodologyTrigger,
    handleReportsTrigger
  };

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();

