/* ============================================
   NAV.JS — Navigation Behavior
   Haryana Roadways · Liquid Glass
   ============================================
   - Scroll-based opacity/class adaptation
   - Active section tracking
   - Smooth scroll to sections
   ============================================ */

(function () {
  'use strict';

  const nav = document.querySelector('.nav');
  if (!nav) return;

  const links = nav.querySelectorAll('.nav__link[data-section]');
  const brand = nav.querySelector('.nav__brand');
  const sections = document.querySelectorAll('[data-section-id]');

  let lastScrollY = 0;
  let ticking = false;
  let scrollDirection = 'up';

  /* ── Smooth Scroll to Section ─────────────── */

  function scrollToSection(sectionId) {
    const target = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (!target) return;

    const navHeight = nav.offsetHeight + 32;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });
  }

  // Nav link clicks
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.dataset.section;
      scrollToSection(sectionId);
    });
  });

  // Brand click → scroll to top
  if (brand) {
    brand.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Active Section Tracking ──────────────── */

  function updateActiveSection() {
    const navHeight = nav.offsetHeight + 100;
    let currentSection = null;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= navHeight && rect.bottom > navHeight) {
        currentSection = section.dataset.sectionId;
      }
    });

    links.forEach(link => {
      if (link.dataset.section === currentSection) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  /* ── Scroll Adaptation ────────────────────── */

  function onScroll() {
    const currentScrollY = window.scrollY;
    scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

    // Add scrolled class after passing hero
    if (currentScrollY > 100) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    // Update active section
    updateActiveSection();

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ── Keyboard Support ─────────────────────── */

  nav.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const focused = document.activeElement;
      if (focused && focused.dataset.section) {
        e.preventDefault();
        scrollToSection(focused.dataset.section);
      }
    }
  });

  /* ── Initial State ────────────────────────── */
  
  updateActiveSection();

})();
