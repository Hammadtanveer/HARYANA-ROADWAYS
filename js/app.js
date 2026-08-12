/* ============================================
   APP.JS — Main Initialization
   Haryana Roadways · Liquid Glass
   ============================================ */

(function () {
  'use strict';

  // Log init
  console.log('%c HARYANA ROADWAYS ', 'background: #1B6B3A; color: #F5E6C8; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
  console.log('%c Raste. Raftaar. Haryana. ', 'color: #A3A3A3; font-size: 11px;');

  // Feature detection
  const supportsBackdrop = CSS.supports('backdrop-filter', 'blur(1px)');
  if (!supportsBackdrop) {
    document.body.classList.add('no-backdrop');
    console.warn('backdrop-filter not supported — using fallback styles');
  }

  // Smooth scroll for CTA buttons with data-section
  document.querySelectorAll('[data-section]').forEach(el => {
    if (el.closest('.nav')) return; // nav.js handles these
    
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = el.dataset.section;
      const target = document.querySelector(`[data-section-id="${sectionId}"]`);
      if (target) {
        const navHeight = 80;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

})();
