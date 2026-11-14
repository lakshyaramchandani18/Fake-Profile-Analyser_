/**
 * FPDS - Fake Profile Detection System
 * Navigation & Sidebar Controller
 * Multi-page active route detection, mobile drawer toggle, and keyboard shortcuts
 */

(function () {
  'use strict';

  function initNavigation() {
    highlightActivePage();
    setupMobileDrawer();
    setupKeyboardShortcuts();
  }

  /**
   * Highlights the active sidebar navigation item based on current HTML file
   */
  function highlightActivePage() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'dashboard.html';

    const navLinks = document.querySelectorAll('.sidebar-nav .nav-item');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.remove('active');

      if (!href) return;

      // Direct filename match or index/root fallback to dashboard
      if (href === pageName) {
        link.classList.add('active');
      } else if ((pageName === '' || pageName === 'index.html') && href === 'dashboard.html') {
        // If on index or root, highlight Dashboard if not specifically on a subpage
        link.classList.add('active');
      }
    });
  }

  /**
   * Mobile Sidebar Drawer and Backdrop Setup
   */
  function setupMobileDrawer() {
    const menuBtn = document.getElementById('mobileMenuToggle');
    const closeBtn = document.getElementById('sidebarCloseBtn');
    const backdrop = document.getElementById('sidebarBackdrop');

    if (menuBtn) {
      menuBtn.addEventListener('click', toggleSidebar);
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', closeSidebar);
    }
    if (backdrop) {
      backdrop.addEventListener('click', closeSidebar);
    }
  }

  function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
  }

  function closeSidebar() {
    document.body.classList.remove('sidebar-open');
  }

  /**
   * Keyboard Accessibility
   */
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeSidebar();
        // Close any open modals
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      }
    });
  }

  window.FPDS_NAV = {
    toggleSidebar,
    closeSidebar,
    highlightActivePage
  };

  document.addEventListener('DOMContentLoaded', initNavigation);
})();
