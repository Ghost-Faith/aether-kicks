/**
 * AETHER KICKS - Interactive Logo Particle Spark Engine
 * Emits glowing stardust & neon energy sparks whenever the cursor moves around the brand logo
 * Dynamically adapts to the active website theme state (Chicago Red, Court Purple, University Blue, etc.)
 */

class LogoParticleSystem {
  constructor() {
    this.logos = [];
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.cursorX = -9999;
    this.cursorY = -9999;
    this.isNearLogo = false;
    this.animId = null;

    this.init();
  }

  init() {
    // Find all logo elements on the page (storefront or auth)
    this.logos = Array.from(document.querySelectorAll('.nav-brand, .auth-brand'));

    // Create fullscreen hardware-accelerated particle canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'logo-particle-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => {
      this.resize();
      this.updateCachedRects();
    }, { passive: true });

    window.addEventListener('scroll', () => {
      this.updateCachedRects();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });

    // Direct hover/tap on logo elements for immediate spark burst
    this.logos.forEach(logo => {
      logo.addEventListener('mouseenter', () => {
        const rect = logo.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        for (let i = 0; i < 8; i++) {
          const px = rect.left + Math.random() * rect.width;
          const py = rect.top + Math.random() * rect.height;
          this.spawnParticle(px, py);
        }
        if (!this.animId) {
          this.loop();
        }
      });
    });
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Dynamically detect active theme colors based on page context and CSS variables
   * - register.html / theme-purple: Vibrant Court Purple (#a855f7, #c084fc)
   * - login.html / theme-chicago: Iconic Varsity Red (#ef4444, #f87171)
   * - index.html / storefront: Real-time dynamic shoe runway colorway from --theme-primary
   */
  getThemeColors() {
    // 1. Explicit Court Purple check (Register page or .theme-purple)
    const isRegister = (typeof window !== 'undefined' && window.location.pathname.toLowerCase().includes('register')) ||
                       (document.body && document.body.classList.contains('theme-purple')) ||
                       document.querySelector('.theme-purple') !== null;

    if (isRegister) {
      return {
        primary: '#a855f7',
        secondary: '#c084fc',
        highlight: '#f3e8ff',
        glow: 'rgba(168, 85, 247, 0.85)'
      };
    }

    // 2. Explicit Chicago Red check (Login page or .theme-chicago)
    const isLogin = (typeof window !== 'undefined' && window.location.pathname.toLowerCase().includes('login')) ||
                    (document.body && document.body.classList.contains('theme-chicago')) ||
                    document.querySelector('.theme-chicago') !== null;

    if (isLogin) {
      return {
        primary: '#ef4444',
        secondary: '#f87171',
        highlight: '#fee2e2',
        glow: 'rgba(239, 68, 68, 0.85)'
      };
    }

    // 3. Auth page variable fallback
    if (document.body) {
      const authAccent = getComputedStyle(document.body).getPropertyValue('--auth-accent').trim();
      if (authAccent) {
        return {
          primary: authAccent,
          secondary: authAccent,
          highlight: '#ffffff',
          glow: authAccent
        };
      }
    }

    // 4. Dynamic storefront theme (--theme-primary continuously updated by store.js)
    let docPrimary = '';
    let docSecondary = '';
    let docGlow = '';

    if (document.documentElement) {
      docPrimary = document.documentElement.style.getPropertyValue('--theme-primary').trim() ||
                   getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim();
      docSecondary = document.documentElement.style.getPropertyValue('--theme-secondary').trim() ||
                     getComputedStyle(document.documentElement).getPropertyValue('--theme-secondary').trim();
      docGlow = document.documentElement.style.getPropertyValue('--theme-glow').trim() ||
                getComputedStyle(document.documentElement).getPropertyValue('--theme-glow').trim();
    }

    if (docPrimary) {
      return {
        primary: docPrimary,
        secondary: docSecondary || docPrimary,
        highlight: '#ffffff',
        glow: docGlow || docPrimary
      };
    }

    // Default fallback
    return {
      primary: '#ef4444',
      secondary: '#f87171',
      highlight: '#ffffff',
      glow: 'rgba(239, 68, 68, 0.85)'
    };
  }

  updateCachedRects() {
    if (!this.logos || this.logos.length === 0) {
      this.logos = Array.from(document.querySelectorAll('.nav-brand, .auth-brand'));
    }
    this.cachedRects = this.logos.map(logo => {
      const rect = logo.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      };
    }).filter(r => r.width > 0 && r.height > 0);
  }

  onMouseMove(e) {
    this.cursorX = e.clientX;
    this.cursorY = e.clientY;

    if (!this.cachedRects || this.cachedRects.length === 0) {
      this.updateCachedRects();
    }

    let nearAny = false;
    const padding = 15;

    for (let i = 0; i < this.cachedRects.length; i++) {
      const rect = this.cachedRects[i];
      if (
        this.cursorX >= rect.left - padding &&
        this.cursorX <= rect.right + padding &&
        this.cursorY >= rect.top - padding &&
        this.cursorY <= rect.bottom + padding
      ) {
        nearAny = true;
        const count = Math.floor(Math.random() * 2) + 1;
        for (let j = 0; j < count; j++) {
          const spawnX = rect.left + Math.random() * rect.width;
          const spawnY = rect.top + Math.random() * rect.height;
          this.spawnParticle(spawnX, spawnY);
        }
      }
    }

    if (nearAny && !this.isNearLogo) {
      this.isNearLogo = true;
      if (!this.animId) {
        this.loop();
      }
    }
  }

  spawnParticle(x, y) {
    if (this.particles.length > 80) return; // Cap maximum active particles

    const colors = this.getThemeColors();

    // Select color variant for magical stardust effect
    const rand = Math.random();
    let pColor = colors.primary;
    if (rand < 0.35) {
      pColor = colors.secondary;
    } else if (rand < 0.55) {
      pColor = colors.highlight;
    }

    // Upward and outward drift physics - strictly never fall downward below logo
    const vx = (Math.random() - 0.5) * 2.2;
    const vy = -Math.random() * 2.0 - 0.5; // Always upward drift

    this.particles.push({
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      size: Math.random() * 2.8 + 1.2,
      alpha: 1,
      decay: Math.random() * 0.02 + 0.025, // Brisk decay between 0.025 and 0.045
      color: pColor,
      glowColor: colors.glow || pColor,
      sparkle: Math.random() > 0.35
    });
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.92; // Air resistance
      p.vy *= 0.92; // Gentle air damping upward, NO gravity pulling downward
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      // Glowing outer halo without CPU-blocking shadowBlur
      this.ctx.globalAlpha = Math.max(0, p.alpha * 0.28);
      this.ctx.fillStyle = p.glowColor;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * p.alpha * 2.4, 0, Math.PI * 2);
      this.ctx.fill();

      // Particle body
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.sparkle && Math.random() > 0.5 ? '#ffffff' : p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.animId = null;
      this.isNearLogo = false;
    }
  }
}

// Robust auto-initialization that works whether script is in head or body
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.logoParticleSystem = new LogoParticleSystem();
  });
} else {
  window.logoParticleSystem = new LogoParticleSystem();
}
