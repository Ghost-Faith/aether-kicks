/**
 * AETHER KICKS - Interactive 3D Sneaker Turntable & Perspective Engine
 * Gives sneaker images genuine 3D interactivity directly on the page (like high-end fashion sites):
 * - 360° Drag-to-Spin Turntable with inertial damping
 * - 360° Auto-Rotate Turntable Toggle
 * - 3D Perspective Card Tilt & Parallax Z-Depth
 * - Dynamic Specular Light Sheen Reflection
 * - Angle Preset Selectors (Side, 3/4 Perspective, Aerial, Heel)
 */

class Interactive3DSneaker {
  constructor(containerEl, shoeId) {
    this.container = containerEl;
    this.shoeId = shoeId;
    this.wrap = containerEl.querySelector('.stage-shoe-interactive-wrap, .floating-shoe-wrap');
    this.img = containerEl.querySelector('.stage-shoe-img, .floating-shoe-img');
    this.shadow = containerEl.querySelector('.stage-shoe-shadow, .floating-shoe-shadow');
    this.halo = containerEl.querySelector('.shoe-runway-halo, .shoe-halo-glow');

    // Rotation state
    this.currentAngle = -12; // Initial resting angle
    this.targetAngle = -12;
    this.isDragging = false;
    this.startX = 0;
    this.dragStartAngle = 0;
    this.velocity = 0;
    this.isAutoSpinning = false;
    this.autoSpinSpeed = 0.75; // deg per frame

    // Perspective Tilt
    this.tiltX = 0;
    this.tiltY = 0;
    this.targetTiltX = 0;
    this.targetTiltY = 0;
    this.isHovering = false;

    // HUD Elements (if present)
    this.angleBadge = containerEl.querySelector('.turntable-angle-badge');
    this.autoSpinBtn = containerEl.querySelector('.btn-auto-spin-3d');
    this.scrubberInput = containerEl.querySelector('.turntable-scrubber');

    // Performance & Lifecycle
    this.isVisible = true;
    this.isAnimating = false;
    this.animId = null;

    this.init();
  }

  init() {
    if (!this.wrap || !this.img) return;

    // Add specular reflection sheen overlay to the shoe wrap if missing
    if (!this.wrap.querySelector('.sneaker-3d-sheen')) {
      const sheen = document.createElement('div');
      sheen.className = 'sneaker-3d-sheen';
      this.wrap.appendChild(sheen);
      this.sheen = sheen;
    } else {
      this.sheen = this.wrap.querySelector('.sneaker-3d-sheen');
    }

    this.bindMouseDrag();
    this.bindTouchDrag();
    this.bindHoverTilt();
    this.bindHUDControls();

    // IntersectionObserver to sleep render loop when off-screen
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible) {
            this.requestRender();
          } else {
            this.stopRender();
          }
        });
      }, { rootMargin: '120px 0px 120px 0px', threshold: 0.01 });
      this.observer.observe(this.container);
    }

    // Initial render pass
    this.requestRender();
  }

  requestRender() {
    if (!this.isVisible && 'IntersectionObserver' in window) return;
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.animId = requestAnimationFrame(() => this.render());
    }
  }

  stopRender() {
    this.isAnimating = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  bindMouseDrag() {
    this.wrap.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.startX = e.clientX;
      this.dragStartAngle = this.targetAngle;
      this.velocity = 0;
      this.wrap.style.cursor = 'grabbing';
      if (this.isAutoSpinning) this.toggleAutoSpin(false);
      this.requestRender();
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.startX;
      // Sensitivity: 1px drag = ~0.85 deg
      const newAngle = this.dragStartAngle + deltaX * 0.85;
      this.velocity = (newAngle - this.targetAngle) * 0.3;
      this.targetAngle = newAngle;
      this.requestRender();
    }, { passive: true });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.wrap.style.cursor = 'grab';
        this.requestRender();
      }
    });
  }

  bindTouchDrag() {
    this.wrap.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.startX = e.touches[0].clientX;
        this.dragStartAngle = this.targetAngle;
        this.velocity = 0;
        if (this.isAutoSpinning) this.toggleAutoSpin(false);
        this.requestRender();
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.startX;
      const newAngle = this.dragStartAngle + deltaX * 0.85;
      this.velocity = (newAngle - this.targetAngle) * 0.3;
      this.targetAngle = newAngle;
      this.requestRender();
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.requestRender();
      }
    });
  }

  bindHoverTilt() {
    this.container.addEventListener('mouseenter', () => {
      this.isHovering = true;
      this.requestRender();
    });

    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) - 0.5;
      const normY = ((e.clientY - rect.top) / rect.height) - 0.5;
      this.targetTiltX = -normY * 20; // Pitch
      this.targetTiltY = normX * 18;  // Yaw bias
      this.requestRender();
    }, { passive: true });

    this.container.addEventListener('mouseleave', () => {
      this.isHovering = false;
      this.targetTiltX = 0;
      this.targetTiltY = 0;
      this.requestRender();
    });
  }

  bindHUDControls() {
    // Auto-spin button
    if (this.autoSpinBtn) {
      this.autoSpinBtn.addEventListener('click', () => {
        this.toggleAutoSpin(!this.isAutoSpinning);
        if (window.soundEngine) window.soundEngine.playSwitch();
      });
    }

    // Scrubber range input
    if (this.scrubberInput) {
      this.scrubberInput.addEventListener('input', (e) => {
        this.targetAngle = parseFloat(e.target.value);
        if (this.isAutoSpinning) this.toggleAutoSpin(false);
      });
    }

    // Angle Preset Buttons
    this.container.querySelectorAll('.btn-angle-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const deg = parseFloat(btn.dataset.angle || 0);
        this.setAnglePreset(deg);
        this.container.querySelectorAll('.btn-angle-preset').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });
  }

  setAnglePreset(targetDeg) {
    if (this.isAutoSpinning) this.toggleAutoSpin(false);
    // Smooth transition to target angle
    this.targetAngle = targetDeg;
    this.requestRender();
  }

  toggleAutoSpin(forceState) {
    this.isAutoSpinning = typeof forceState === 'boolean' ? forceState : !this.isAutoSpinning;
    if (this.autoSpinBtn) {
      this.autoSpinBtn.classList.toggle('active', this.isAutoSpinning);
      const textSpan = this.autoSpinBtn.querySelector('span');
      if (textSpan) {
        textSpan.textContent = this.isAutoSpinning ? 'Pause 360°' : 'Auto 360°';
      }
    }
    if (this.isAutoSpinning) {
      this.requestRender();
    }
  }

  render() {
    // Auto-spin increment
    if (this.isAutoSpinning) {
      this.targetAngle += this.autoSpinSpeed;
    } else if (!this.isDragging) {
      // Apply momentum decay
      this.targetAngle += this.velocity;
      this.velocity *= 0.88;
      if (Math.abs(this.velocity) < 0.01) this.velocity = 0;
    }

    // Smooth angle lerp
    this.currentAngle += (this.targetAngle - this.currentAngle) * 0.12;

    // Smooth tilt lerp
    this.tiltX += (this.targetTiltX - this.tiltX) * 0.1;
    this.tiltY += (this.targetTiltY - this.tiltY) * 0.1;

    // Detect if motion has reached settled equilibrium
    const angleDelta = Math.abs(this.targetAngle - this.currentAngle);
    const tiltXDelta = Math.abs(this.targetTiltX - this.tiltX);
    const tiltYDelta = Math.abs(this.targetTiltY - this.tiltY);
    const hasActiveMotion = this.isAutoSpinning || this.isDragging || this.isHovering ||
                            Math.abs(this.velocity) > 0.01 ||
                            angleDelta > 0.02 || tiltXDelta > 0.02 || tiltYDelta > 0.02;

    if (!hasActiveMotion) {
      this.currentAngle = this.targetAngle;
      this.tiltX = this.targetTiltX;
      this.tiltY = this.targetTiltY;
    }

    // Normalized display angle (0 to 360)
    let displayDeg = Math.round(this.currentAngle % 360);
    if (displayDeg < 0) displayDeg += 360;

    // Update HUD display
    if (this.angleBadge) {
      this.angleBadge.textContent = `⟳ ${displayDeg}° 3D`;
    }
    if (this.scrubberInput && !this.isDragging) {
      this.scrubberInput.value = displayDeg;
    }

    // 3D Perspective Matrix applied to wrap
    const rotY = this.currentAngle;
    const finalTiltX = this.tiltX;
    const scale = this.isDragging ? 1.06 : 1.02;

    this.wrap.style.transform = `perspective(1200px) rotateX(${finalTiltX}deg) rotateY(${rotY}deg) scale3d(${scale}, ${scale}, ${scale})`;

    // Dynamic ground shadow reacts to 3D rotation
    if (this.shadow) {
      const rad = (this.currentAngle * Math.PI) / 180;
      const shadowSkew = Math.sin(rad) * 22;
      const shadowScale = 0.85 + Math.abs(Math.cos(rad)) * 0.25;
      this.shadow.style.transform = `translateX(${shadowSkew}px) scaleX(${shadowScale})`;
    }

    // Specular sheen shine glides across the sneaker body as it rotates
    if (this.sheen) {
      const sheenPos = ((this.currentAngle % 360) / 360) * 200 - 50;
      this.sheen.style.transform = `translateX(${sheenPos}%) rotate(35deg)`;
      this.sheen.style.opacity = Math.abs(Math.sin((this.currentAngle * Math.PI) / 180)) * 0.65;
    }

    // Continue loop only if active motion continues and container is in viewport
    if (hasActiveMotion && this.isVisible) {
      this.animId = requestAnimationFrame(() => this.render());
    } else {
      this.isAnimating = false;
      this.animId = null;
    }
  }
}

// Global registry of 3D sneakers on the page
window.aether3DSneakers = {};

function initAll3DSneakers() {
  // Only initialize 3D turntable on storefront product showcase sections, NOT on auth pages
  document.querySelectorAll('.stage-col-shoe').forEach((col, idx) => {
    const section = col.closest('.runway-section');
    const shoeId = section ? (section.dataset.shoeId || 'chicago') : 'chicago';
    
    // Inject 3D turntable controls if not present
    if (!col.querySelector('.turntable-hud-bar')) {
      const hud = document.createElement('div');
      hud.className = 'turntable-hud-bar';
      hud.innerHTML = `
        <div class="turntable-hud-top">
          <span class="turntable-angle-badge">⟳ 0° 3D</span>
          <button type="button" class="btn-auto-spin-3d" title="Toggle Auto 360° Rotation">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span>Auto 360°</span>
          </button>
        </div>
        <div class="turntable-scrubber-wrap">
          <input type="range" class="turntable-scrubber" min="0" max="360" value="0" aria-label="360 Degree Turntable Angle">
        </div>
        <div class="turntable-presets-row">
          <button type="button" class="btn-angle-preset active" data-angle="0">Side</button>
          <button type="button" class="btn-angle-preset" data-angle="45">3/4 View</button>
          <button type="button" class="btn-angle-preset" data-angle="90">Aerial</button>
          <button type="button" class="btn-angle-preset" data-angle="180">Heel</button>
          <button type="button" class="btn-angle-preset" data-angle="270">Sole</button>
        </div>
      `;
      col.appendChild(hud);
    }

    const instance = new Interactive3DSneaker(col, shoeId);
    window.aether3DSneakers[`shoe_${idx}_${shoeId}`] = instance;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAll3DSneakers();
});

window.initAll3DSneakers = initAll3DSneakers;
