/* ============================================
   GALLERY.JS — Cinematic Gallery Navigation
   Haryana Roadways · Liquid Glass
   ============================================ */

(function () {
  'use strict';

  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  const slides = gallery.querySelectorAll('.gallery__slide');
  const prevBtn = gallery.querySelector('.gallery__btn--prev');
  const nextBtn = gallery.querySelector('.gallery__btn--next');
  const counter = document.getElementById('gallery-counter');

  let currentSlide = 0;
  const totalSlides = slides.length;

  function updateGallery() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === currentSlide);
    });

    const num = (currentSlide + 1).toString().padStart(2, '0');
    const total = totalSlides.toString().padStart(2, '0');
    counter.textContent = `${num} / ${total}`;
  }

  function goToSlide(index) {
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    updateGallery();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Button clicks
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Keyboard
  document.addEventListener('keydown', (e) => {
    // Only respond if gallery is in viewport
    const rect = gallery.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // Touch swipe
  let touchStartX = 0;
  let touchEndX = 0;

  gallery.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  gallery.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  // Initial state
  updateGallery();

})();
