/* ============================================
   SCROLL.JS — Scroll Animations & Parallax
   Haryana Roadways · Liquid Glass
   ============================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── Section Reveal via IntersectionObserver ── */

  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  if (revealElements.length && !prefersReducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Reduced motion: show everything immediately
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* ── Parallax on Hero Image ───────────────── */

  if (!prefersReducedMotion.matches) {
    const heroMedia = document.querySelector('.hero__media img');
    const busMedia = document.querySelector('.bus-section__bg img');
    let parallaxTicking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (heroMedia && scrollY < vh * 1.5) {
        const offset = scrollY * 0.3;
        heroMedia.style.transform = `scale(${1 + scrollY * 0.0001}) translateY(${offset}px)`;
      }

      if (busMedia) {
        const busSection = busMedia.closest('.section');
        if (busSection) {
          const rect = busSection.getBoundingClientRect();
          if (rect.top < vh && rect.bottom > 0) {
            const sectionProgress = (vh - rect.top) / (vh + rect.height);
            const offset = (sectionProgress - 0.5) * 80;
            busMedia.style.transform = `translateY(${offset}px)`;
          }
        }
      }

      parallaxTicking = false;
    }

    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  /* ── Scroll Cue Fade ──────────────────────── */

  const scrollCue = document.querySelector('.scroll-cue');
  if (scrollCue) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollCue.style.opacity = '0';
        scrollCue.style.pointerEvents = 'none';
      } else {
        scrollCue.style.opacity = '';
        scrollCue.style.pointerEvents = '';
      }
    }, { passive: true });
  }

})();
