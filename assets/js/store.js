/**
 * AETHER KICKS - Runway Color Transitions & Storefront Logic
 * Features Continuous Scroll RGB Interpolation & 3D Sneaker Levitation Physics
 */

// Continuous Colorway Stops for Gradual Scroll Interpolation
const COLOR_STOPS = [
  {
    id: 'chicago',
    primary: [220, 38, 38],       // #dc2626 (Varsity Red)
    secondary: [153, 27, 27],     // #991b1b
    glow: 'rgba(220, 38, 38, 0.5)',
    bg: [12, 5, 8]                // Deep crimson noir
  },
  {
    id: 'purple',
    primary: [147, 51, 234],      // #9333ea (Court Purple)
    secondary: [107, 33, 168],    // #6b21a8
    glow: 'rgba(147, 51, 234, 0.5)',
    bg: [9, 3, 16]                // Deep violet noir
  },
  {
    id: 'blue',
    primary: [2, 132, 199],       // #0284c7 (University Blue)
    secondary: [3, 105, 161],     // #0369a1
    glow: 'rgba(2, 132, 199, 0.5)',
    bg: [3, 9, 20]                // Deep sky navy
  },
  {
    id: 'green',
    primary: [22, 163, 74],       // #16a34a (Pine Green)
    secondary: [21, 128, 61],     // #15803d
    glow: 'rgba(22, 163, 74, 0.5)',
    bg: [3, 13, 6]                // Deep emerald noir
  },
  {
    id: 'orange',
    primary: [234, 88, 12],       // #ea580c (Shattered Backboard Orange)
    secondary: [194, 65, 12],     // #c2410c
    glow: 'rgba(234, 88, 12, 0.5)',
    bg: [18, 7, 2]                // Deep amber noir
  },
  {
    id: 'shadow',
    primary: [161, 161, 170],     // #a1a1aa (Stealth Black Cat Titanium)
    secondary: [63, 63, 70],      // #3f3f46
    glow: 'rgba(161, 161, 170, 0.4)',
    bg: [8, 8, 10]                // Deep onyx noir
  }
];

// State & Layout Cache for Zero-Thrashing Continuous Color Transitions
let ticking = false;
let cachedSectionCenters = [];
let cachedRootEl = null;
let cachedOrb1El = null;
let cachedOrb2El = null;
let activeSectionIndex = -1;
let lastAppliedTheme = {
  r: -999,
  g: -999,
  b: -999,
  sr: -999,
  sg: -999,
  sb: -999
};

function isMobileDevice() {
  return window.innerWidth <= 768 || (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches);
}

/**
 * Cache section centers once to eliminate forced synchronous reflow (getBoundingClientRect)
 * during high-frequency mobile and desktop touch/wheel scroll events.
 */
function cacheSectionPositions(sections) {
  if (!sections || sections.length === 0) return;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  cachedSectionCenters = sections.map(sec => {
    const rect = sec.getBoundingClientRect();
    return scrollY + rect.top + rect.height / 2;
  });
}

// =============================================================================
// PERFORMANCE MODE MANAGER (Mode 1: 60/120fps Locked vs Mode 2: Silky Continuous RGB)
// =============================================================================
class PerformanceModeManager {
  constructor() {
    this.storageKey = 'aether_perf_mode';
    let saved = null;
    try {
      saved = localStorage.getItem(this.storageKey);
    } catch (e) {}
    // Default to 'on' as requested by the user
    this.mode = (saved === 'off') ? 'off' : 'on';
  }

  init() {
    this.applyMode(this.mode, false);
    this.bindButtons();
    window.addEventListener('aether:languageChange', () => {
      this.applyMode(this.mode, false);
    });
  }

  isEnabled() {
    return this.mode === 'on';
  }

  setMode(newMode, notify = true) {
    if (newMode !== 'on' && newMode !== 'off') return;
    this.mode = newMode;
    try {
      localStorage.setItem(this.storageKey, newMode);
    } catch (e) {}
    this.applyMode(newMode, notify);
  }

  toggle() {
    const nextMode = (this.mode === 'on') ? 'off' : 'on';
    this.setMode(nextMode, true);
    return this.mode;
  }

  bindButtons() {
    const btns = document.querySelectorAll('.btn-perf-toggle, #btn-perf-toggle, #drawer-btn-perf-toggle');
    btns.forEach(btn => {
      btn.onclick = (e) => {
        if (e) e.preventDefault();
        this.toggle();
      };
    });
  }

  applyMode(mode, notify = true) {
    const isPerfOn = (mode === 'on');
    const root = document.documentElement;
    root.setAttribute('data-perf-mode', mode);
    if (document.body) {
      document.body.setAttribute('data-perf-mode', mode);
    }

    // When switching to Performance Mode ON, clean up inline continuous overrides so GPU backdrops take over
    if (isPerfOn) {
      if (typeof window.stopChaserLoop === 'function') {
        window.stopChaserLoop();
      }
      if (document.body) {
        document.body.style.backgroundColor = '';
        document.body.style.background = '';
      }
      const orbs = document.querySelectorAll('.ambient-glow-layer .glow-orb-primary, .ambient-glow-layer .glow-orb-secondary');
      orbs.forEach(o => o.style.background = '');
      const halos = document.querySelectorAll('.shoe-runway-halo');
      halos.forEach(h => {
        h.style.background = '';
        h.style.boxShadow = '';
      });
    }

    // Update UI toggle buttons
    const btns = document.querySelectorAll('.btn-perf-toggle, #btn-perf-toggle, #drawer-btn-perf-toggle');
    btns.forEach(btn => {
      btn.classList.toggle('active', isPerfOn);
      btn.setAttribute('aria-pressed', isPerfOn ? 'true' : 'false');

      const textSpan = btn.querySelector('.perf-text');
      if (textSpan) {
        textSpan.setAttribute('data-i18n', isPerfOn ? 'nav_perf_on' : 'nav_perf_off');
        if (window.i18n && typeof window.i18n.t === 'function') {
          textSpan.textContent = window.i18n.t(isPerfOn ? 'nav_perf_on' : 'nav_perf_off');
        } else {
          textSpan.textContent = isPerfOn ? 'PERF: ON' : 'PERF: OFF';
        }
      }

      const title = isPerfOn
        ? (window.i18n ? window.i18n.t('toast_perf_on') : 'Modo Desempenho: Ligado ⚡ (60-120 FPS)')
        : (window.i18n ? window.i18n.t('toast_perf_off') : 'Modo Desempenho: Desligado 🎨 (Cores Suaves)');
      btn.setAttribute('title', title);
      btn.setAttribute('aria-label', title);
    });

    // Notify active theme coordinator to switch runtime behavior immediately
    if (typeof window.refreshThemeCoordinator === 'function') {
      window.refreshThemeCoordinator(mode);
    }

    if (notify) {
      if (window.soundEngine && typeof window.soundEngine.playSwitch === 'function') {
        window.soundEngine.playSwitch();
      } else if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
        window.soundEngine.playClick();
      }

      if (typeof window.showToast === 'function') {
        const toastMsg = isPerfOn
          ? (window.i18n ? window.i18n.t('toast_perf_on') : 'Modo Desempenho: Ligado ⚡ (60-120 FPS)')
          : (window.i18n ? window.i18n.t('toast_perf_off') : 'Modo Desempenho: Desligado 🎨 (Cores Suaves)');
        window.showToast(toastMsg);
      }
    }

    window.dispatchEvent(new CustomEvent('aether:perfModeChange', { detail: { mode: mode, isPerfOn: isPerfOn } }));
  }
}

window.perfManager = new PerformanceModeManager();
window.togglePerformanceMode = function() {
  return window.perfManager ? window.perfManager.toggle() : null;
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.perfManager) window.perfManager.init();
  initGradualColorScroll();
  initRefinedSneakerParallax();
  initStageControls();
  initCatalogFilters();
  initAuthUI();
  initSoundButton();
  initHamburgerMenu();

  // Handle URL hash direct linking for square grid view or NFC modal
  if (window.location.hash === '#square-grid-vault' || window.location.hash === '#grid') {
    if (typeof setCatalogLayout === 'function') setCatalogLayout('grid');
  } else if (window.location.hash === '#nfc-modal' || window.location.hash === '#nfc') {
    setTimeout(() => {
      if (typeof openNFCScanner === 'function') openNFCScanner();
    }, 250);
  }
});

/**
 * Dual-Mode Runway Theme Coordinator
 * Mode 1 (ON): Section-snapped theme updates, GPU-composited backdrops, 0 DOM thrashing.
 * Mode 2 (OFF): Silky smoothstep continuous RGB interpolation across color stops.
 */
function initGradualColorScroll() {
  const sections = Array.from(document.querySelectorAll('.runway-section'));
  const dots = Array.from(document.querySelectorAll('.runway-dot'));
  const backdrops = Array.from(document.querySelectorAll('.ambient-glow-layer .glow-backdrop'));
  if (sections.length < 2) return;

  cachedRootEl = document.documentElement;
  cacheSectionPositions(sections);

  // ---------------------------------------------------------------------------
  // MODE 1: SECTION-SNAPPED THEME COORDINATOR (Locked 60/120 FPS)
  // ---------------------------------------------------------------------------
  function setActiveThemeIndex(newIndex) {
    if (newIndex === activeSectionIndex || newIndex < 0 || newIndex >= sections.length) return;
    activeSectionIndex = newIndex;

    const activeSection = sections[newIndex];
    const themeId = activeSection ? activeSection.dataset.theme : 'chicago';
    const stop = COLOR_STOPS[newIndex] || COLOR_STOPS[0];
    const [r, g, b] = stop.primary;
    const [sr, sg, sb] = stop.secondary;
    const [bgr, bgg, bgb] = stop.bg;

    // 1. Set scoped active theme attribute
    document.documentElement.setAttribute('data-active-theme', themeId);

    // 2. Set root CSS custom properties ONCE on section crossing
    const root = cachedRootEl || (cachedRootEl = document.documentElement);
    root.style.setProperty('--theme-primary', `rgb(${r}, ${g}, ${b})`);
    root.style.setProperty('--theme-secondary', `rgb(${sr}, ${sg}, ${sb})`);
    root.style.setProperty('--theme-glow', `rgba(${r}, ${g}, ${b}, 0.5)`);
    root.style.setProperty('--theme-glow-soft', `rgba(${r}, ${g}, ${b}, 0.16)`);
    root.style.setProperty('--theme-surface-glow', `rgba(${r}, ${g}, ${b}, 0.08)`);
    root.style.setProperty('--theme-card-border', `rgba(${r}, ${g}, ${b}, 0.35)`);
    root.style.setProperty('--theme-bg-base', `rgb(${bgr}, ${bgg}, ${bgb})`);

    // 3. Cross-fade GPU-composited ambient backdrops via opacity
    if (backdrops.length > 0) {
      backdrops.forEach((bd, idx) => {
        bd.classList.toggle('active', idx === newIndex);
      });
    }

    // 4. Update sidebar active dot navigation
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === newIndex);
    });
  }

  function checkActiveSection() {
    if (window.currentCatalogLayout === 'grid') return;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const vh = window.innerHeight || 800;
    const currentCenter = scrollY + vh / 2;

    if (!cachedSectionCenters || cachedSectionCenters.length !== sections.length) {
      cacheSectionPositions(sections);
    }

    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < cachedSectionCenters.length; i++) {
      const dist = Math.abs(currentCenter - cachedSectionCenters[i]);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }

    setActiveThemeIndex(closestIndex);
  }

  // ---------------------------------------------------------------------------
  // MODE 2: KINETIC DAMPED CONTINUOUS RGB INTERPOLATION (Performance Mode OFF)
  // Continuous smooth chaser loop powered by requestAnimationFrame physics dampening.
  // Blends like liquid silk even across discrete mousewheel ticks and touch flings.
  // ---------------------------------------------------------------------------
  let chaserRafId = null;
  let isChaserRunning = false;

  // The interpolated current floating-point colors
  const currentColor = {
    r: 220, g: 38, b: 38,
    sr: 185, sg: 28, sb: 28,
    bgr: 15, bgg: 2, bgb: 2
  };

  // The target colors computed from the runway scroll position
  const targetColor = {
    r: 220, g: 38, b: 38,
    sr: 185, sg: 28, sb: 28,
    bgr: 15, bgg: 2, bgb: 2,
    activeDotIndex: 0,
    themeId: 'chicago'
  };

  function computeTargetColors() {
    if (sections.length < 2) return;
    if (window.currentCatalogLayout === 'grid') return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const vh = window.innerHeight || 800;
    const currentCenter = scrollY + vh / 2;

    // Calculate the vertical center of each runway section live (exact 795b7c7 math)
    const sectionCenters = sections.map(sec => {
      const rect = sec.getBoundingClientRect();
      return scrollY + rect.top + rect.height / 2;
    });

    let indexA = 0;
    let t = 0;

    if (currentCenter <= sectionCenters[0]) {
      indexA = 0;
      t = 0;
    } else if (currentCenter >= sectionCenters[sectionCenters.length - 1]) {
      indexA = sectionCenters.length - 2;
      t = 1;
    } else {
      for (let i = 0; i < sectionCenters.length - 1; i++) {
        if (currentCenter >= sectionCenters[i] && currentCenter <= sectionCenters[i + 1]) {
          indexA = i;
          const distance = sectionCenters[i + 1] - sectionCenters[i];
          t = distance > 0 ? (currentCenter - sectionCenters[i]) / distance : 0;
          break;
        }
      }
    }

    // Smoothstep easing for silky-smooth distribution curve (exact 795b7c7)
    const easeT = t * t * (3 - 2 * t);

    const stopA = COLOR_STOPS[indexA] || COLOR_STOPS[0];
    const stopB = COLOR_STOPS[indexA + 1] || COLOR_STOPS[COLOR_STOPS.length - 1];

    const lerp = (a, b, factor) => a + (b - a) * factor;

    targetColor.r = lerp(stopA.primary[0], stopB.primary[0], easeT);
    targetColor.g = lerp(stopA.primary[1], stopB.primary[1], easeT);
    targetColor.b = lerp(stopA.primary[2], stopB.primary[2], easeT);

    targetColor.sr = lerp(stopA.secondary[0], stopB.secondary[0], easeT);
    targetColor.sg = lerp(stopA.secondary[1], stopB.secondary[1], easeT);
    targetColor.sb = lerp(stopA.secondary[2], stopB.secondary[2], easeT);

    targetColor.bgr = lerp(stopA.bg[0], stopB.bg[0], easeT);
    targetColor.bgg = lerp(stopA.bg[1], stopB.bg[1], easeT);
    targetColor.bgb = lerp(stopA.bg[2], stopB.bg[2], easeT);

    const closestIndex = t < 0.5 ? indexA : indexA + 1;
    targetColor.activeDotIndex = closestIndex;
    const activeSection = sections[closestIndex];
    targetColor.themeId = activeSection ? activeSection.dataset.theme : 'chicago';
  }

  function applyColorsToDOM(r, g, b, sr, sg, sb, bgr, bgg, bgb, themeId, dotIdx) {
    const root = cachedRootEl || (cachedRootEl = document.documentElement);
    root.style.setProperty('--theme-primary', `rgb(${r}, ${g}, ${b})`);
    root.style.setProperty('--theme-secondary', `rgb(${sr}, ${sg}, ${sb})`);
    root.style.setProperty('--theme-glow', `rgba(${r}, ${g}, ${b}, 0.5)`);
    root.style.setProperty('--theme-glow-soft', `rgba(${r}, ${g}, ${b}, 0.16)`);
    root.style.setProperty('--theme-surface-glow', `rgba(${r}, ${g}, ${b}, 0.08)`);
    root.style.setProperty('--theme-card-border', `rgba(${r}, ${g}, ${b}, 0.35)`);
    root.style.setProperty('--theme-bg-base', `rgb(${bgr}, ${bgg}, ${bgb})`);

    if (document.body) {
      document.body.style.backgroundColor = `rgb(${bgr}, ${bgg}, ${bgb})`;
    }

    const orb1 = document.querySelector('.glow-backdrop .glow-orb-primary');
    const orb2 = document.querySelector('.glow-backdrop .glow-orb-secondary');
    if (orb1) orb1.style.background = `radial-gradient(circle, rgba(${r}, ${g}, ${b}, 0.5) 0%, transparent 70%)`;
    if (orb2) orb2.style.background = `radial-gradient(circle, rgba(${sr}, ${sg}, ${sb}, 0.22) 0%, transparent 70%)`;

    if (dots && dots.length) {
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === dotIdx);
      });
    }

    if (themeId && document.documentElement.getAttribute('data-active-theme') !== themeId) {
      document.documentElement.setAttribute('data-active-theme', themeId);
    }
  }

  function chaserTick() {
    if (window.currentCatalogLayout === 'grid' || (window.perfManager && window.perfManager.isEnabled())) {
      isChaserRunning = false;
      chaserRafId = null;
      return;
    }

    // Liquid damping coefficient: 0.085 provides velvety, molten glass deceleration
    const damping = 0.085;

    currentColor.r += (targetColor.r - currentColor.r) * damping;
    currentColor.g += (targetColor.g - currentColor.g) * damping;
    currentColor.b += (targetColor.b - currentColor.b) * damping;

    currentColor.sr += (targetColor.sr - currentColor.sr) * damping;
    currentColor.sg += (targetColor.sg - currentColor.sg) * damping;
    currentColor.sb += (targetColor.sb - currentColor.sb) * damping;

    currentColor.bgr += (targetColor.bgr - currentColor.bgr) * damping;
    currentColor.bgg += (targetColor.bgg - currentColor.bgg) * damping;
    currentColor.bgb += (targetColor.bgb - currentColor.bgb) * damping;

    const ir = Math.round(currentColor.r);
    const ig = Math.round(currentColor.g);
    const ib = Math.round(currentColor.b);

    const isr = Math.round(currentColor.sr);
    const isg = Math.round(currentColor.sg);
    const isb = Math.round(currentColor.sb);

    const ibgr = Math.round(currentColor.bgr);
    const ibgg = Math.round(currentColor.bgg);
    const ibgb = Math.round(currentColor.bgb);

    applyColorsToDOM(ir, ig, ib, isr, isg, isb, ibgr, ibgg, ibgb, targetColor.themeId, targetColor.activeDotIndex);

    // Continue running until currentColor has converged smoothly to target
    const delta = Math.abs(targetColor.r - currentColor.r) +
                  Math.abs(targetColor.g - currentColor.g) +
                  Math.abs(targetColor.b - currentColor.b) +
                  Math.abs(targetColor.bgr - currentColor.bgr) +
                  Math.abs(targetColor.bgg - currentColor.bgg) +
                  Math.abs(targetColor.bgb - currentColor.bgb);

    if (delta > 0.3) {
      chaserRafId = window.requestAnimationFrame(chaserTick);
    } else {
      currentColor.r = targetColor.r;
      currentColor.g = targetColor.g;
      currentColor.b = targetColor.b;
      currentColor.sr = targetColor.sr;
      currentColor.sg = targetColor.sg;
      currentColor.sb = targetColor.sb;
      currentColor.bgr = targetColor.bgr;
      currentColor.bgg = targetColor.bgg;
      currentColor.bgb = targetColor.bgb;

      applyColorsToDOM(
        Math.round(targetColor.r), Math.round(targetColor.g), Math.round(targetColor.b),
        Math.round(targetColor.sr), Math.round(targetColor.sg), Math.round(targetColor.sb),
        Math.round(targetColor.bgr), Math.round(targetColor.bgg), Math.round(targetColor.bgb),
        targetColor.themeId, targetColor.activeDotIndex
      );
      isChaserRunning = false;
      chaserRafId = null;
    }
  }

  function startChaserLoop() {
    if (window.currentCatalogLayout === 'grid') return;
    if (window.perfManager && window.perfManager.isEnabled()) return;

    computeTargetColors();
    if (!isChaserRunning) {
      isChaserRunning = true;
      chaserRafId = window.requestAnimationFrame(chaserTick);
    }
  }

  window.stopChaserLoop = function() {
    if (chaserRafId) {
      window.cancelAnimationFrame(chaserRafId);
      chaserRafId = null;
    }
    isChaserRunning = false;
  };

  // Unified Scroll Dispatcher
  function onScroll() {
    if (window.currentCatalogLayout === 'grid') return;

    if (window.perfManager && window.perfManager.isEnabled()) {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.currentCatalogLayout !== 'grid') {
            checkActiveSection();
          }
          ticking = false;
        });
        ticking = true;
      }
    } else {
      startChaserLoop();
    }
  }

  // Seamless Mode Switcher (Zero Reload Required)
  window.refreshThemeCoordinator = function(mode) {
    if (window.currentCatalogLayout === 'grid') return;
    activeSectionIndex = -1;
    lastAppliedTheme = { r: -999, g: -999, b: -999, sr: -999, sg: -999, sb: -999 };
    cacheSectionPositions(sections);

    if (mode === 'on') {
      window.stopChaserLoop();
      checkActiveSection();
    } else {
      computeTargetColors();
      currentColor.r = targetColor.r;
      currentColor.g = targetColor.g;
      currentColor.b = targetColor.b;
      currentColor.sr = targetColor.sr;
      currentColor.sg = targetColor.sg;
      currentColor.sb = targetColor.sb;
      currentColor.bgr = targetColor.bgr;
      currentColor.bgg = targetColor.bgg;
      currentColor.bgb = targetColor.bgb;

      applyColorsToDOM(
        Math.round(targetColor.r), Math.round(targetColor.g), Math.round(targetColor.b),
        Math.round(targetColor.sr), Math.round(targetColor.sg), Math.round(targetColor.sb),
        Math.round(targetColor.bgr), Math.round(targetColor.bgg), Math.round(targetColor.bgb),
        targetColor.themeId, targetColor.activeDotIndex
      );
      startChaserLoop();
    }
  };

  // Passive Event Listeners
  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('resize', () => {
    activeSectionIndex = -1;
    lastAppliedTheme = { r: -999, g: -999, b: -999, sr: -999, sg: -999, sb: -999 };
    cacheSectionPositions(sections);
    onScroll();
  }, { passive: true });

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      activeSectionIndex = -1;
      lastAppliedTheme = { r: -999, g: -999, b: -999, sr: -999, sg: -999, sb: -999 };
      cacheSectionPositions(sections);
      onScroll();
    }, 150);
  }, { passive: true });

  window.addEventListener('load', () => {
    cacheSectionPositions(sections);
    onScroll();
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      cacheSectionPositions(sections);
      onScroll();
    });
  }

  // Initial trigger
  if (window.perfManager && window.perfManager.isEnabled()) {
    checkActiveSection();
  } else {
    computeTargetColors();
    currentColor.r = targetColor.r;
    currentColor.g = targetColor.g;
    currentColor.b = targetColor.b;
    currentColor.sr = targetColor.sr;
    currentColor.sg = targetColor.sg;
    currentColor.sb = targetColor.sb;
    currentColor.bgr = targetColor.bgr;
    currentColor.bgg = targetColor.bgg;
    currentColor.bgb = targetColor.bgb;

    applyColorsToDOM(
      Math.round(targetColor.r), Math.round(targetColor.g), Math.round(targetColor.b),
      Math.round(targetColor.sr), Math.round(targetColor.sg), Math.round(targetColor.sb),
      Math.round(targetColor.bgr), Math.round(targetColor.bgg), Math.round(targetColor.bgb),
      targetColor.themeId, targetColor.activeDotIndex
    );
  }

  // Dot Navigation Click
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetId = dot.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        if (window.soundEngine) window.soundEngine.playClick();
      }
    });
  });
}

/**
 * Refined 3D Sneaker Parallax & Levitation Physics (Matching Register & Exceeding It)
 */
function initRefinedSneakerParallax() {
  const stages = document.querySelectorAll('.floating-sneaker-stage:not(.stage-col-shoe)');

  stages.forEach(stage => {
    const wrap = stage.querySelector('.stage-shoe-interactive-wrap, .floating-shoe-wrap');
    const shadow = stage.querySelector('.stage-shoe-shadow, .floating-shoe-shadow');
    const halo = stage.querySelector('.shoe-runway-halo, .shoe-halo-glow');
    if (!wrap) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    let animationFrameId = null;

    function renderParallax() {
      if (isHovering) {
        // Smooth dampening
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;

        const tiltX = -currentY * 26;
        const tiltY = currentX * 30;
        const rotZ = -12 + currentX * 8;

        wrap.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${rotZ}deg) scale3d(1.04, 1.04, 1.04)`;

        if (shadow) {
          const shadowOffsetX = currentX * 36;
          const shadowScale = 1 - Math.abs(currentY) * 0.18;
          shadow.style.transform = `translateX(${shadowOffsetX}px) scale(${shadowScale})`;
        }

        if (halo) {
          halo.style.transform = `translate(calc(-50% + ${currentX * 25}px), calc(-50% + ${currentY * 25}px)) scale(1.15)`;
        }

        animationFrameId = requestAnimationFrame(renderParallax);
      } else {
        // Reset smoothly
        currentX += (0 - currentX) * 0.1;
        currentY += (0 - currentY) * 0.1;

        if (Math.abs(currentX) > 0.001 || Math.abs(currentY) > 0.001) {
          const tiltX = -currentY * 26;
          const tiltY = currentX * 30;
          wrap.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${-12 + currentX * 8}deg)`;
          animationFrameId = requestAnimationFrame(renderParallax);
        } else {
          wrap.style.transform = '';
          if (shadow) shadow.style.transform = '';
          if (halo) halo.style.transform = '';
          cancelAnimationFrame(animationFrameId);
        }
      }
    }

    stage.addEventListener('mouseenter', () => {
      isHovering = true;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(renderParallax);
    });

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) - 0.5;
      targetY = ((e.clientY - rect.top) / rect.height) - 0.5;
    });

    stage.addEventListener('mouseleave', () => {
      isHovering = false;
    });
  });
}

// Portuguese / EU Sneaker Sizing Master System for Storefront
let globalStoreUnit = localStorage.getItem('aether_size_unit') || 'EU';

window.setGlobalStoreUnit = function(unit) {
  globalStoreUnit = unit;
  localStorage.setItem('aether_size_unit', unit);

  // Sync all unit switcher pills on index
  document.querySelectorAll('.stage-unit-switcher, #modal-unit-switcher, #customizer-unit-switcher, #raffle-unit-switcher').forEach(switcher => {
    switcher.querySelectorAll('.unit-toggle-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.unit === unit);
    });
  });

  // Update Runway Hero size pills
  document.querySelectorAll('.runway-section').forEach(section => {
    updateRunwaySectionSizes(section, unit);
  });

  // Update Buy Modal if open
  if (window.cartManager && window.cartManager.activeShoeForModal) {
    window.cartManager.activeSizeUnit = unit;
    window.cartManager.renderModalSizes();
  }

  // Update Customizer if loaded
  if (window.sneakerCustomizer && typeof window.sneakerCustomizer.renderCustomizerSizes === 'function') {
    window.sneakerCustomizer.renderCustomizerSizes(unit);
  }

  // Update Raffle Drop select
  updateRaffleSizeOptions(unit);
};

function updateRunwaySectionSizes(section, unit) {
  const selectedBtn = section.querySelector('.btn-stage-size.selected');
  const selectedEu = selectedBtn ? (selectedBtn.dataset.eu || '42') : (section.dataset.selectedEu || '42');

  section.querySelectorAll('.btn-stage-size').forEach(btn => {
    const eu = btn.dataset.eu;
    const entry = window.findSizeEntry ? window.findSizeEntry(eu, 'eu') : { eu: eu, us: btn.dataset.us || '8.5', uk: btn.dataset.uk || '7.5', cm: btn.dataset.cm || '26.5' };
    
    let main = '';
    let sub = '';
    if (unit === 'EU') {
      main = entry.eu;
      sub = `US ${entry.us}`;
    } else if (unit === 'US') {
      main = `US ${entry.us}`;
      sub = `EU ${entry.eu}`;
    } else if (unit === 'UK') {
      main = `UK ${entry.uk}`;
      sub = `EU ${entry.eu}`;
    } else if (unit === 'CM') {
      main = `${entry.cm} cm`;
      sub = `EU ${entry.eu}`;
    }

    const mainEl = btn.querySelector('.size-main');
    const subEl = btn.querySelector('.size-sub');
    if (mainEl && subEl) {
      mainEl.textContent = main;
      subEl.textContent = sub;
    } else {
      btn.innerHTML = `<span class="size-main">${main}</span><small class="size-sub">${sub}</small>`;
    }
  });

  // Update selection badge
  const badge = section.querySelector('.buy-size-selected-badge');
  const activeEntry = window.findSizeEntry ? window.findSizeEntry(selectedEu, 'eu') : { eu: '42', us: '8.5' };
  if (badge) {
    badge.textContent = `Selected: EU ${activeEntry.eu} (US ${activeEntry.us})`;
  }
  section._selectedSize = `EU ${activeEntry.eu} (US ${activeEntry.us})`;
  section.dataset.selectedEu = activeEntry.eu;
}

function updateRaffleSizeOptions(unit) {
  const select = document.getElementById('raffle-size-select');
  if (!select) return;

  Array.from(select.options).forEach(opt => {
    const eu = opt.dataset.eu;
    if (!eu) return;
    const entry = window.findSizeEntry ? window.findSizeEntry(eu, 'eu') : { eu: eu, us: opt.dataset.us, uk: opt.dataset.uk };
    if (unit === 'EU') {
      opt.textContent = `EU ${entry.eu} (US ${entry.us} • UK ${entry.uk}) - Grail PT`;
    } else if (unit === 'US') {
      opt.textContent = `US ${entry.us} (EU ${entry.eu} • UK ${entry.uk})`;
    } else if (unit === 'UK') {
      opt.textContent = `UK ${entry.uk} (EU ${entry.eu} • US ${entry.us})`;
    }
  });
}

// Stage Buy Controls (Size selection, Instant Buy, Add to Bag)
function initStageControls() {
  document.querySelectorAll('.runway-section').forEach(section => {
    const shoeId = section.dataset.shoeId;
    section.dataset.selectedEu = '42'; // Default Portugal grail size
    section._selectedSize = 'EU 42 (US 8.5)';

    // Unit Switcher in Stage
    const switcher = section.querySelector('.stage-unit-switcher');
    if (switcher) {
      switcher.querySelectorAll('.unit-toggle-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === globalStoreUnit);
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.setGlobalStoreUnit(btn.dataset.unit);
          if (window.soundEngine) window.soundEngine.playClick();
        });
      });
    }

    // Size Pills
    section.querySelectorAll('.btn-stage-size').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        section.querySelectorAll('.btn-stage-size').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        const eu = btn.dataset.eu || '42';
        const entry = window.findSizeEntry ? window.findSizeEntry(eu, 'eu') : { eu: eu, us: btn.dataset.us || '8.5' };
        section.dataset.selectedEu = entry.eu;
        section._selectedSize = `EU ${entry.eu} (US ${entry.us})`;

        const badge = section.querySelector('.buy-size-selected-badge');
        if (badge) {
          badge.textContent = `Selected: EU ${entry.eu} (US ${entry.us})`;
        }
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });

    // Initial label refresh according to globalStoreUnit
    updateRunwaySectionSizes(section, globalStoreUnit);

    // Add To Bag Button
    const addBagBtn = section.querySelector('.btn-stage-add-bag');
    if (addBagBtn) {
      addBagBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const size = section._selectedSize || 'EU 42 (US 8.5)';
        if (window.cartManager) {
          window.cartManager.addItem(shoeId, size, 'deadstock');
        }
      });
    }

    // Instant Buy Button
    const instantBuyBtn = section.querySelector('.btn-stage-instant-buy');
    if (instantBuyBtn) {
      instantBuyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const size = section._selectedSize || 'EU 42 (US 8.5)';
        if (window.cartManager) {
          window.cartManager.addItem(shoeId, size, 'deadstock');
          window.cartManager.openCheckoutModal();
        }
      });
    }

    // Quick Inspect Modal trigger
    const inspectBtn = section.querySelector('.btn-stage-inspect');
    if (inspectBtn) {
      inspectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.cartManager) {
          window.cartManager.openBuyModal(shoeId);
        }
      });
    }
  });

  // Setup Raffle Unit Switcher if present
  const raffleSwitcher = document.getElementById('raffle-unit-switcher');
  if (raffleSwitcher) {
    raffleSwitcher.querySelectorAll('.unit-toggle-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.unit === globalStoreUnit);
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.setGlobalStoreUnit(btn.dataset.unit);
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });
  }

  // Global delegation fallback
  document.addEventListener('click', (e) => {
    const addBagBtn = e.target.closest('.btn-stage-add-bag');
    if (addBagBtn) {
      const section = addBagBtn.closest('.runway-section');
      if (section && window.cartManager) {
        const shoeId = section.dataset.shoeId;
        const size = section._selectedSize || 'EU 42 (US 8.5)';
        window.cartManager.addItem(shoeId, size, 'deadstock');
      }
      return;
    }

    const instantBuyBtn = e.target.closest('.btn-stage-instant-buy');
    if (instantBuyBtn) {
      const section = instantBuyBtn.closest('.runway-section');
      if (section && window.cartManager) {
        const shoeId = section.dataset.shoeId;
        const size = section._selectedSize || 'EU 42 (US 8.5)';
        window.cartManager.addItem(shoeId, size, 'deadstock');
        window.cartManager.openCheckoutModal();
      }
      return;
    }

    const inspectBtn = e.target.closest('.btn-stage-inspect');
    if (inspectBtn) {
      const section = inspectBtn.closest('.runway-section');
      if (section && window.cartManager) {
        const shoeId = section.dataset.shoeId;
        window.cartManager.openBuyModal(shoeId);
      }
      return;
    }
  });
}

// Catalog Filter & Quick Add
function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.btn-filter-pill');
  const cards = document.querySelectorAll('.sneaker-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      if (window.soundEngine) window.soundEngine.playClick();

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.animate([{ opacity: 0, transform: 'scale(0.96)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 300 });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// NFC Simulator Modal
function openNFCScanner() {
  const modal = document.getElementById('nfc-modal');
  const backdrop = document.getElementById('modal-backdrop');
  if (modal && backdrop) {
    modal.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.soundEngine) window.soundEngine.playSwoosh();

    const resultBox = document.getElementById('nfc-result-box');
    const scanningBox = document.getElementById('nfc-scanning-box');
    if (resultBox && scanningBox) {
      resultBox.style.display = 'none';
      scanningBox.style.display = 'block';

      setTimeout(() => {
        scanningBox.style.display = 'none';
        resultBox.style.display = 'block';
        if (window.soundEngine) window.soundEngine.playSuccess();
      }, 2000);
    }
  }
}

function closeNFCModal() {
  const modal = document.getElementById('nfc-modal');
  const backdrop = document.getElementById('modal-backdrop');
  if (modal && backdrop) {
    modal.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    if (window.soundEngine) window.soundEngine.playClick();
  }
}

// Recognize Logged-in User
function initAuthUI() {
  const rawUser = localStorage.getItem('aether_user');
  const navAuth = document.querySelector('.nav-auth-group');
  if (rawUser && navAuth) {
    try {
      const user = JSON.parse(rawUser);
      navAuth.innerHTML = `
        <div class="user-pill-logged" style="display: flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(255, 255, 255, 0.08); border-radius: 999px; border: 1px solid var(--theme-primary);">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e;"></span>
          <span style="font-size: 0.82rem; font-weight: 700; font-family: var(--font-mono); color: #fff;">${user.name}</span>
          <button onclick="localStorage.removeItem('aether_user'); window.location.reload();" title="Sign Out" style="color: var(--text-muted); font-size: 0.75rem; margin-left: 4px;">✕</button>
        </div>
      `;
    } catch(e) {}
  }
}

// Audio Toggle Button UI (Supports both Top Bar and Drawer)
function initSoundButton() {
  const btns = document.querySelectorAll('.btn-sound-toggle, #btn-sound-toggle, #drawer-btn-sound-toggle');
  if (btns.length === 0) return;

  function syncSoundUI(enabled) {
    btns.forEach(b => b.classList.toggle('playing', !!enabled));
  }

  if (window.soundEngine) {
    syncSoundUI(window.soundEngine.enabled);
  }

  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!window.soundEngine) return;
      const isEnabled = window.soundEngine.toggle();
      syncSoundUI(isEnabled);
      const msg = isEnabled
        ? (window.i18n && typeof window.i18n.t === 'function' && window.i18n.t('toast_sound_on') ? window.i18n.t('toast_sound_on') : 'Efeitos Sonoros Ativados 🔊 / Sound Effects Enabled')
        : (window.i18n && typeof window.i18n.t === 'function' && window.i18n.t('toast_sound_off') ? window.i18n.t('toast_sound_off') : 'Efeitos Sonoros Silenciados 🔇 / Sound Effects Muted');
      if (typeof showToast === 'function') showToast(msg);
    });
  });
}

// Hamburger Menu Drawer Controller
function initHamburgerMenu() {
  const btn = document.getElementById('btn-hamburger-toggle');
  const drawer = document.getElementById('hamburger-drawer');
  const backdrop = document.getElementById('hamburger-backdrop');
  if (!btn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.toggle('active');
    btn.classList.toggle('is-open', isOpen);
    if (backdrop) backdrop.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (window.soundEngine) window.soundEngine.playSwitch();
  }

  function closeMenu() {
    drawer.classList.remove('active');
    btn.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', toggleMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  const closeBtns = drawer.querySelectorAll('.btn-close-modal, .btn-close-drawer, #btn-close-hamburger, .btn-close-hamburger');
  closeBtns.forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
    });
  });

  drawer.querySelectorAll('.hamburger-menu-link, a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  window.closeHamburgerMenu = closeMenu;
  window.toggleHamburgerMenu = toggleMenu;
}

window.initHamburgerMenu = initHamburgerMenu;
window.openNFCScanner = openNFCScanner;
window.closeNFCModal = closeNFCModal;

// Global tracking of current catalog presentation layout
window.currentCatalogLayout = 'runway';

// Layout View Switcher: Runway Mode vs Square Grid Mode
function setCatalogLayout(mode) {
  const runway = document.querySelector('.runway-container');
  const squareGrid = document.getElementById('square-grid-vault');
  const dots = document.querySelector('.runway-sidebar-dots');
  const btnRunway = document.getElementById('btn-toggle-runway');
  const btnGrid = document.getElementById('btn-toggle-grid');
  const drawerRunway = document.getElementById('drawer-btn-runway');
  const drawerGrid = document.getElementById('drawer-btn-grid');

  if (mode === 'grid') {
    window.currentCatalogLayout = 'grid';
    document.documentElement.setAttribute('data-catalog-layout', 'grid');
    if (typeof window.stopChaserLoop === 'function') {
      window.stopChaserLoop();
    }

    if (runway) runway.style.display = 'none';
    if (squareGrid) squareGrid.classList.add('active');
    if (dots) dots.style.display = 'none';
    if (btnRunway) btnRunway.classList.remove('active');
    if (btnGrid) btnGrid.classList.add('active');
    if (drawerRunway) drawerRunway.classList.remove('active');
    if (drawerGrid) drawerGrid.classList.add('active');

    // Freeze theme on a steady, elegant default (chicago) and stop all scroll-triggered morphing
    document.documentElement.setAttribute('data-active-theme', 'chicago');
    const stop = COLOR_STOPS[0];
    const [r, g, b] = stop.primary;
    const [sr, sg, sb] = stop.secondary;
    const [bgr, bgg, bgb] = stop.bg;
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', `rgb(${r}, ${g}, ${b})`);
    root.style.setProperty('--theme-secondary', `rgb(${sr}, ${sg}, ${sb})`);
    root.style.setProperty('--theme-glow', `rgba(${r}, ${g}, ${b}, 0.5)`);
    root.style.setProperty('--theme-glow-soft', `rgba(${r}, ${g}, ${b}, 0.16)`);
    root.style.setProperty('--theme-surface-glow', `rgba(${r}, ${g}, ${b}, 0.08)`);
    root.style.setProperty('--theme-card-border', `rgba(${r}, ${g}, ${b}, 0.35)`);
    root.style.setProperty('--theme-bg-base', `rgb(${bgr}, ${bgg}, ${bgb})`);

    if (document.body) {
      document.body.style.backgroundColor = '';
      document.body.style.background = '';
    }

    const orbs = document.querySelectorAll('.ambient-glow-layer .glow-orb-primary, .ambient-glow-layer .glow-orb-secondary');
    orbs.forEach(o => { o.style.background = ''; });

    const backdrops = document.querySelectorAll('.ambient-glow-layer .glow-backdrop');
    backdrops.forEach((bd, idx) => bd.classList.toggle('active', idx === 0));

    window.scrollTo({ top: 0, behavior: 'smooth' });
    const toastMsg = window.i18n && typeof window.i18n.t === 'function' && window.i18n.t('toast_grid')
      ? window.i18n.t('toast_grid')
      : 'Modo Grade Ativado ⊞ / Grid Mode Activated';
    if (typeof showToast === 'function') showToast(toastMsg);
  } else {
    window.currentCatalogLayout = 'runway';
    document.documentElement.setAttribute('data-catalog-layout', 'runway');

    if (runway) runway.style.display = '';
    if (squareGrid) squareGrid.classList.remove('active');
    if (dots) dots.style.display = '';
    if (btnRunway) btnRunway.classList.add('active');
    if (btnGrid) btnGrid.classList.remove('active');
    if (drawerRunway) drawerRunway.classList.add('active');
    if (drawerGrid) drawerGrid.classList.remove('active');

    // Immediately re-coordinate theme to the current scroll position
    if (typeof window.refreshThemeCoordinator === 'function') {
      window.refreshThemeCoordinator(window.perfManager && window.perfManager.isEnabled() ? 'on' : 'off');
    }

    const toastMsg = window.i18n && typeof window.i18n.t === 'function' && window.i18n.t('toast_runway')
      ? window.i18n.t('toast_runway')
      : 'Modo Passarela Ativado ☰ / Runway Mode Activated';
    if (typeof showToast === 'function') showToast(toastMsg);
  }
  if (window.soundEngine) window.soundEngine.playSwitch();
}

function jumpToRunwayShoe(sectionId) {
  setCatalogLayout('runway');
  setTimeout(() => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

window.setCatalogLayout = setCatalogLayout;
window.jumpToRunwayShoe = jumpToRunwayShoe;

