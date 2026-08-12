/* ============================================
   GLASS.JS — Cursor Edge Lighting
   Haryana Roadways · Liquid Glass
   ============================================ */

(function () {
  'use strict';

  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  const glassElements = document.querySelectorAll('.glass-edge-light');
  if (!glassElements.length) return;

  let rafId = null;
  let pendingUpdates = new Map();

  function updateEdgeLight(el, clientX, clientY) {
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    // Clamp values
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    el.style.setProperty('--edge-x', clampedX + '%');
    el.style.setProperty('--edge-y', clampedY + '%');
  }

  function processUpdates() {
    pendingUpdates.forEach((coords, el) => {
      updateEdgeLight(el, coords.x, coords.y);
    });
    pendingUpdates.clear();
    rafId = null;
  }

  document.addEventListener('mousemove', (e) => {
    glassElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const padding = 100; // detect mouse within padding of element

      if (
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding
      ) {
        pendingUpdates.set(el, { x: e.clientX, y: e.clientY });
      }
    });

    if (!rafId) {
      rafId = requestAnimationFrame(processUpdates);
    }
  }, { passive: true });

})();
