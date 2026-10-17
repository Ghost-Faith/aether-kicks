/**
 * AETHER KICKS - Luxury Magnetic Cursor Experience
 * Smooth, non-blocking hardware-accelerated cursor
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip touch devices

  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';
  cursorDot.style.pointerEvents = 'none';

  const cursorRing = document.createElement('div');
  cursorRing.className = 'custom-cursor-ring';
  cursorRing.style.pointerEvents = 'none';

  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isHovered = false;
  let isRingAnimating = false;
  let ringAnimId = null;

  function scheduleRing() {
    if (!isRingAnimating) {
      isRingAnimating = true;
      ringAnimId = requestAnimationFrame(renderRing);
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    scheduleRing();
  }, { passive: true });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${isHovered ? 1.6 : 1})`;

    if (Math.abs(mouseX - ringX) > 0.15 || Math.abs(mouseY - ringY) > 0.15) {
      ringAnimId = requestAnimationFrame(renderRing);
    } else {
      isRingAnimating = false;
      ringAnimId = null;
    }
  }
  scheduleRing();

  // Delegation: Hover expansion works on all current and future buttons/links
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('button, a, input, select, .stage-shoe-interactive-wrap, .floating-shoe-wrap, .sneaker-card, .btn-angle-preset, .turntable-hud-bar')) {
      isHovered = true;
      cursorRing.classList.add('cursor-hover');
      scheduleRing();
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('button, a, input, select, .stage-shoe-interactive-wrap, .floating-shoe-wrap, .sneaker-card, .btn-angle-preset, .turntable-hud-bar')) {
      isHovered = false;
      cursorRing.classList.remove('cursor-hover');
      scheduleRing();
    }
  }, { passive: true });
});
