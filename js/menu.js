/* ============================================
   MENU.JS — Fullscreen Glass Menu
   Haryana Roadways · Liquid Glass
   ============================================ */

(function () {
  'use strict';

  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const menu = document.getElementById('fullscreen-menu');
  if (!menuToggle || !menu) return;

  const menuItems = menu.querySelectorAll('.menu__item');
  let previousFocus = null;
  let isOpen = false;

  function openMenu() {
    previousFocus = document.activeElement;
    menu.hidden = false;

    // Force reflow before adding class for transition
    void menu.offsetHeight;

    menu.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    isOpen = true;

    // Focus the close button
    setTimeout(() => {
      if (menuClose) menuClose.focus();
    }, 100);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    isOpen = false;

    // Wait for transition to finish
    setTimeout(() => {
      menu.hidden = true;
    }, 500);

    // Restore body scroll
    document.body.style.overflow = '';

    // Return focus
    if (previousFocus) {
      previousFocus.focus();
    }
  }

  // Toggle
  menuToggle.addEventListener('click', () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close button
  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  // Menu item clicks
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = item.dataset.menuSection;
      closeMenu();

      // Scroll to section after menu close animation
      setTimeout(() => {
        const target = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (target) {
          const navHeight = 80;
          const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      }, 300);
    });
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });

  // Focus trap
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !isOpen) return;

    const focusable = menu.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Click outside menu content to close
  menu.addEventListener('click', (e) => {
    if (e.target === menu) {
      closeMenu();
    }
  });

})();
