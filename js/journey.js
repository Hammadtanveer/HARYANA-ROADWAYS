/* ============================================
   JOURNEY.JS — Route Animation on Scroll
   Haryana Roadways · Liquid Glass
   ============================================ */

(function () {
  'use strict';

  const journeySection = document.querySelector('.journey-section');
  const marker = document.getElementById('journey-marker');
  const markerGlow = document.getElementById('journey-marker-glow');
  const progressLine = document.getElementById('journey-progress');
  const stops = document.querySelectorAll('.journey__stop');

  if (!journeySection || !marker) return;

  const stopPositions = [40, 213, 386, 560];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateJourney() {
    const rect = journeySection.getBoundingClientRect();
    const vh = window.innerHeight;

    // Calculate progress through the section (0 to 1)
    const sectionStart = rect.top;
    const sectionHeight = rect.height;
    const progress = Math.max(0, Math.min(1, (vh - sectionStart) / (vh + sectionHeight)));

    // Map progress to x position along route
    const startX = stopPositions[0];
    const endX = stopPositions[stopPositions.length - 1];
    const currentX = startX + (endX - startX) * progress;

    // Update marker position
    marker.setAttribute('cx', currentX);
    markerGlow.setAttribute('cx', currentX);

    // Update progress line
    progressLine.setAttribute('x2', currentX);

    // Update stop states
    stops.forEach((stop, i) => {
      if (currentX >= stopPositions[i]) {
        stop.classList.add('is-passed');
        stop.setAttribute('fill', '#1B6B3A');
        stop.setAttribute('stroke', '#2D9B58');
      } else {
        stop.classList.remove('is-passed');
        stop.setAttribute('fill', 'rgba(255,255,255,0.1)');
        stop.setAttribute('stroke', 'rgba(255,255,255,0.2)');
      }
    });
  }

  if (!prefersReducedMotion.matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateJourney();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Initial state
  updateJourney();

})();
