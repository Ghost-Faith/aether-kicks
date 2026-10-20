/**
 * AETHER KICKS - Runway Color Transitions & Storefront Logic
 * Features Continuous Scroll RGB Interpolation & 3D Sneaker Levitation Physics
 */

// Continuous Colorway Stops for Gradual Scroll Interpolation (RGB + Chromatic HSL coordinates)
const COLOR_STOPS = [
  {
    id: 'chicago',
    primary: [220, 38, 38],       // #dc2626 (Varsity Red)
    secondary: [153, 27, 27],     // #991b1b
    glow: 'rgba(220, 38, 38, 0.55)',
    bg: [12, 5, 8],               // Deep crimson noir
    h: 358, s: 86, l: 50,
    secS: 78, secL: 38,
    bgS: 45, bgL: 3.5
  },
  {
    id: 'purple',
    primary: [147, 51, 234],      // #9333ea (Court Purple)
    secondary: [107, 33, 168],    // #6b21a8
    glow: 'rgba(147, 51, 234, 0.55)',
    bg: [9, 3, 16],               // Deep violet noir
    h: 275, s: 82, l: 56,
    secS: 75, secL: 44,
    bgS: 50, bgL: 4.0
  },
  {
    id: 'blue',
    primary: [2, 132, 199],       // #0284c7 (University Blue)
    secondary: [3, 105, 161],     // #0369a1
    glow: 'rgba(2, 132, 199, 0.55)',
    bg: [3, 9, 20],               // Deep sky navy
    h: 202, s: 98, l: 42,
    secS: 88, secL: 32,
    bgS: 55, bgL: 3.8
  },
  {
    id: 'green',
    primary: [22, 163, 74],       // #16a34a (Pine Green)
    secondary: [21, 128, 61],     // #15803d
    glow: 'rgba(22, 163, 74, 0.55)',
    bg: [3, 13, 6],               // Deep emerald noir
    h: 142, s: 76, l: 38,
    secS: 70, secL: 28,
    bgS: 50, bgL: 3.2
  },
  {
    id: 'orange',
    primary: [234, 88, 12],       // #ea580c (Shattered Backboard Orange)
    secondary: [194, 65, 12],     // #c2410c
    glow: 'rgba(234, 88, 12, 0.55)',
    bg: [18, 7, 2],               // Deep amber noir
    h: 22, s: 92, l: 48,
    secS: 86, secL: 38,
    bgS: 55, bgL: 3.8
  },
  {
    id: 'shadow',
    primary: [161, 161, 170],     // #a1a1aa (Stealth Black Cat Titanium)
    secondary: [63, 63, 70],      // #3f3f46
    glow: 'rgba(161, 161, 170, 0.45)',
    bg: [8, 8, 10],               // Deep onyx noir
    h: 220, s: 6, l: 65,
    secS: 6, secL: 35,
    bgS: 10, bgL: 3.5
  }
];

// State & Layout Cache for Zero-Thrashing Continuous Color Transitions
let ticking = false;
let cachedSectionCenters = [];
let cachedRootEl = null;
let cachedOrb1El = null;
let cachedOrb2El = null;
let activeSectionIndex = -1;
let lastActiveDotIdx = -1;
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
    // Default to 'off' (Continuous Silky Color Shift) for all devices, preserving user choice if set
    this.mode = (saved === 'on') ? 'on' : 'off';
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
  if (typeof window.initAnalyticsChart === 'function') window.initAnalyticsChart();
  if (typeof window.updateStorefrontStockBadges === 'function') window.updateStorefrontStockBadges();

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

    lastAppliedTheme.r = r;
    lastAppliedTheme.g = g;
    lastAppliedTheme.b = b;
    lastAppliedTheme.sr = sr;
    lastAppliedTheme.sg = sg;
    lastAppliedTheme.sb = sb;

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
    if (dots && dots.length && newIndex !== lastActiveDotIdx) {
      lastActiveDotIdx = newIndex;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === newIndex);
      });
    }
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
  // MODE 2: DIRECT 1:1 SCROLL-TO-COLOR MAPPING (Performance Mode OFF)
  // Direct instantaneous scroll-to-color interpolation with zero damping lag.
  // Calculates linear scroll progress directly against section positions,
  // interpolating hue/saturation/lightness and applying to the DOM on the very same frame.
  // ---------------------------------------------------------------------------

  // Fast In-Browser HSL to RGB conversion
  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  }

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function applyColorsToDOM(r, g, b, sr, sg, sb, bgr, bgg, bgb, themeId, dotIdx, force = false) {
    const dr = Math.abs(r - lastAppliedTheme.r);
    const dg = Math.abs(g - lastAppliedTheme.g);
    const db = Math.abs(b - lastAppliedTheme.b);
    const dsr = Math.abs(sr - lastAppliedTheme.sr);
    const dsg = Math.abs(sg - lastAppliedTheme.sg);
    const dsb = Math.abs(sb - lastAppliedTheme.sb);

    // Filter imperceptible 2-unit color noise to prevent document-wide style recalculation thrashing
    const threshold = isMobileDevice() ? 3 : 2.0;
    const shouldUpdateColors = force || dr >= threshold || dg >= threshold || db >= threshold ||
                               dsr >= threshold || dsg >= threshold || dsb >= threshold;

    if (shouldUpdateColors) {
      lastAppliedTheme.r = r;
      lastAppliedTheme.g = g;
      lastAppliedTheme.b = b;
      lastAppliedTheme.sr = sr;
      lastAppliedTheme.sg = sg;
      lastAppliedTheme.sb = sb;

      const root = cachedRootEl || (cachedRootEl = document.documentElement);
      root.style.setProperty('--theme-primary', `rgb(${r}, ${g}, ${b})`);
      root.style.setProperty('--theme-secondary', `rgb(${sr}, ${sg}, ${sb})`);
      root.style.setProperty('--theme-glow', `rgba(${r}, ${g}, ${b}, 0.55)`);
      root.style.setProperty('--theme-glow-soft', `rgba(${r}, ${g}, ${b}, 0.18)`);
      root.style.setProperty('--theme-surface-glow', `rgba(${r}, ${g}, ${b}, 0.08)`);
      root.style.setProperty('--theme-card-border', `rgba(${r}, ${g}, ${b}, 0.38)`);
      root.style.setProperty('--theme-bg-base', `rgb(${bgr}, ${bgg}, ${bgb})`);

      if (document.body) {
        document.body.style.backgroundColor = `rgb(${bgr}, ${bgg}, ${bgb})`;
      }

      const orb1 = cachedOrb1El || (cachedOrb1El = document.querySelector('.glow-backdrop .glow-orb-primary'));
      const orb2 = cachedOrb2El || (cachedOrb2El = document.querySelector('.glow-backdrop .glow-orb-secondary'));
      if (orb1) {
        orb1.style.background = `radial-gradient(circle, rgba(${r}, ${g}, ${b}, 0.55) 0%, rgba(${r}, ${g}, ${b}, 0.35) 24%, rgba(${r}, ${g}, ${b}, 0.14) 46%, rgba(${r}, ${g}, ${b}, 0.02) 64%, transparent 72%)`;
      }
      if (orb2) {
        orb2.style.background = `radial-gradient(circle, rgba(${sr}, ${sg}, ${sb}, 0.28) 0%, rgba(${sr}, ${sg}, ${sb}, 0.16) 25%, rgba(${sr}, ${sg}, ${sb}, 0.05) 50%, transparent 70%)`;
      }
    }

    if (dots && dots.length && dotIdx !== lastActiveDotIdx) {
      lastActiveDotIdx = dotIdx;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === dotIdx);
      });
    }

    if (themeId && document.documentElement.getAttribute('data-active-theme') !== themeId) {
      document.documentElement.setAttribute('data-active-theme', themeId);
    }
  }

  /**
   * Direct 1:1 scroll-to-color mapping without damping lag or artificial smoothing curves.
   * Calculates progress directly based on section center positions relative to viewport center,
   * interpolates linearly between adjacent color stops, and applies to the DOM on the very same frame.
   */
  function updateColorsContinuous() {
    if (sections.length < 2) return;
    if (window.currentCatalogLayout === 'grid') return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const vh = window.innerHeight || 800;
    const viewportCenter = scrollY + vh / 2;

    if (!cachedSectionCenters || cachedSectionCenters.length !== sections.length) {
      cacheSectionPositions(sections);
    }
    const sectionCenters = cachedSectionCenters;

    let indexA = 0;
    let t = 0;

    if (viewportCenter <= sectionCenters[0]) {
      indexA = 0;
      t = 0;
    } else if (viewportCenter >= sectionCenters[sectionCenters.length - 1]) {
      indexA = sectionCenters.length - 2;
      t = 1;
    } else {
      for (let i = 0; i < sectionCenters.length - 1; i++) {
        if (viewportCenter >= sectionCenters[i] && viewportCenter <= sectionCenters[i + 1]) {
          indexA = i;
          const distance = sectionCenters[i + 1] - sectionCenters[i];
          t = distance > 0 ? clamp01((viewportCenter - sectionCenters[i]) / distance) : 0;
          break;
        }
      }
    }

    const stopA = COLOR_STOPS[indexA] || COLOR_STOPS[0];
    const stopB = COLOR_STOPS[indexA + 1] || COLOR_STOPS[COLOR_STOPS.length - 1];

    // Linear HSL interpolation along shortest angular path for hue
    let hDiff = (stopB.h - stopA.h) % 360;
    if (hDiff > 180) hDiff -= 360;
    if (hDiff < -180) hDiff += 360;

    const currentH = ((stopA.h + hDiff * t) % 360 + 360) % 360;
    const currentS = stopA.s + (stopB.s - stopA.s) * t;
    const currentL = stopA.l + (stopB.l - stopA.l) * t;
    const [r, g, b] = hslToRgb(currentH, currentS, currentL);

    const secS = stopA.secS + (stopB.secS - stopA.secS) * t;
    const secL = stopA.secL + (stopB.secL - stopA.secL) * t;
    const [sr, sg, sb] = hslToRgb(currentH, secS, secL);

    const bgS = stopA.bgS + (stopB.bgS - stopA.bgS) * t;
    const bgL = stopA.bgL + (stopB.bgL - stopA.bgL) * t;
    const [bgr, bgg, bgb] = hslToRgb(currentH, bgS, bgL);

    const closestIndex = t < 0.5 ? indexA : indexA + 1;
    const activeSection = sections[closestIndex];
    const themeId = activeSection ? activeSection.dataset.theme : 'chicago';

    applyColorsToDOM(r, g, b, sr, sg, sb, bgr, bgg, bgb, themeId, closestIndex);
  }

  window.stopChaserLoop = function() {
    // Retained for backward-compatibility with external callers
  };

  let lastScrollY = window.scrollY || window.pageYOffset || 0;
  let lastScrollTime = performance.now();
  let scrollVelocity = 0;
  let scrollEndTimer = null;

  // Unified Scroll Dispatcher with single-frame RAF throttle and mobile fast-fling protection
  function onScroll() {
    if (window.currentCatalogLayout === 'grid') return;

    const now = performance.now();
    const currentY = window.scrollY || window.pageYOffset || 0;
    const dt = Math.max(1, now - lastScrollTime);
    const dy = Math.abs(currentY - lastScrollY);
    scrollVelocity = (dy / dt) * 16.67; // Normalized scroll speed (pixels per 60fps frame)
    lastScrollY = currentY;
    lastScrollTime = now;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.currentCatalogLayout !== 'grid') {
          const isMobile = isMobileDevice();
          const isPerfOn = window.perfManager && window.perfManager.isEnabled();

          // On mobile during high-velocity flings (> 18px/frame), avoid continuous 60fps
          // CSS root variable writes across the entire DOM tree which cause mobile GPU tile drops.
          // Instead, snap cleanly to the active section stop.
          if (isPerfOn || (isMobile && scrollVelocity > 18)) {
            checkActiveSection();
          } else {
            updateColorsContinuous();
          }
        }
        ticking = false;
      });
      ticking = true;
    }

    // When fast scrolling on mobile decelerates or settles, coordinate exact continuous colors
    if (isMobileDevice()) {
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        scrollVelocity = 0;
        if (window.currentCatalogLayout !== 'grid') {
          if (window.perfManager && window.perfManager.isEnabled()) {
            checkActiveSection();
          } else {
            updateColorsContinuous();
          }
        }
      }, 100);
    }
  }

  // Seamless Mode Switcher (Zero Reload Required)
  window.refreshThemeCoordinator = function(mode) {
    if (window.currentCatalogLayout === 'grid') return;
    activeSectionIndex = -1;
    lastActiveDotIdx = -1;
    lastAppliedTheme = { r: -999, g: -999, b: -999, sr: -999, sg: -999, sb: -999 };
    cacheSectionPositions(sections);

    if (mode === 'on') {
      window.stopChaserLoop();
      checkActiveSection();
    } else {
      updateColorsContinuous();
    }
  };

  // Passive Event Listeners
  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('resize', () => {
    activeSectionIndex = -1;
    lastActiveDotIdx = -1;
    lastAppliedTheme = { r: -999, g: -999, b: -999, sr: -999, sg: -999, sb: -999 };
    cacheSectionPositions(sections);
    onScroll();
  }, { passive: true });

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      activeSectionIndex = -1;
      lastActiveDotIdx = -1;
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
    updateColorsContinuous();
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
      const esc = (typeof window !== 'undefined' && window.escapeHTML)
        ? window.escapeHTML
        : (s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
      const displayName = esc(user.name || user.full_name || 'Colecionador');
      const isProfilePage = window.location.pathname.endsWith('profile.html') || window.location.href.includes('profile.html');

      navAuth.innerHTML = `
        <a href="profile.html" class="user-pill-logged ${isProfilePage ? 'active' : ''}" title="Ver Perfil de Colecionador" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; cursor: pointer; padding: 6px 14px; background: rgba(255, 255, 255, 0.08); border-radius: 999px; border: 1px solid var(--theme-primary, #dc2626); transition: all 0.2s ease;">
          <span class="user-status-dot" style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px rgba(34, 197, 94, 0.6); display: inline-block;"></span>
          <span class="user-name-text" style="font-size: 0.82rem; font-weight: 700; font-family: var(--font-mono, monospace); color: #fff;">${displayName}</span>
          <button type="button" class="btn-signout-mini" title="Terminar Sessão" onclick="event.stopPropagation(); event.preventDefault(); localStorage.removeItem('aether_user'); localStorage.removeItem('aether_user_session'); window.location.reload();" style="background: none; border: none; color: #a1a1aa; font-size: 0.75rem; cursor: pointer; padding: 0 2px; margin-left: 4px; line-height: 1; transition: color 0.15s ease;">✕</button>
        </a>
      `;
    } catch(e) {}
  }
}
window.initAuthUI = initAuthUI;

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

/**
 * Dynamic Square Grid Catalog Synchronization
 * Ensures any sneaker created, edited, or deleted in Admin (via window.AetherDB or SNEAKERS_DB)
 * is dynamically reflected in the .square-cards-grid on index.html!
 */
window.syncSquareGridCatalog = async function() {
  const grid = document.querySelector('.square-cards-grid');
  if (!grid) return;

  let shoes = [];
  if (window.AetherDB && typeof window.AetherDB.getShoes === 'function') {
    try {
      shoes = await window.AetherDB.getShoes();
    } catch(e) {}
  }

  if (!shoes || shoes.length === 0) {
    if (window.SNEAKERS_DB) {
      shoes = Object.values(window.SNEAKERS_DB);
    }
  }

  if (!shoes || shoes.length === 0) return;

  // Build lookup of current active shoes
  const shoesMap = new Map();
  shoes.forEach(s => shoesMap.set(s.id, s));

  // Track existing shoe IDs rendered, update prices, and remove decommissioned items
  const existingCards = grid.querySelectorAll('.square-sneaker-card');
  const renderedIds = new Set();
  existingCards.forEach(c => {
    let shoeId = null;
    const wishBtn = c.querySelector('.btn-card-wishlist');
    if (wishBtn && wishBtn.dataset.wishlistId) {
      shoeId = wishBtn.dataset.wishlistId;
    } else {
      const buyBtn = c.querySelector('.btn-card-buy');
      if (buyBtn) {
        const onclickStr = buyBtn.getAttribute('onclick') || '';
        const match = onclickStr.match(/openBuyModal\(['"]([^'"]+)['"]\)/);
        if (match) shoeId = match[1];
      }
    }

    if (shoeId) {
      if (shoesMap.has(shoeId)) {
        renderedIds.add(shoeId);
        // Reactive price update
        const currentData = shoesMap.get(shoeId);
        const priceEl = c.querySelector('.square-card-price');
        const priceVal = currentData.vault_price !== undefined ? currentData.vault_price : (currentData.price || 400);
        if (priceEl) priceEl.textContent = `$${priceVal}`;
      } else if (c.classList.contains('dynamic-grail-card')) {
        // Remove card if it was decommissioned from database
        c.remove();
      }
    }
  });

  // For any shoe in database not in DOM, create card
  shoes.forEach(shoe => {
    const id = shoe.id;
    const price = shoe.vault_price !== undefined ? shoe.vault_price : (shoe.price || 400);
    const name = shoe.name || 'Air Jordan 1 Retro';
    const colorway = (shoe.colorway || id).toUpperCase();
    const year = shoe.year || '2026';
    const theme = shoe.theme_color || shoe.theme || '#dc2626';
    const glow = shoe.glow_color || shoe.glow || 'rgba(220, 38, 38, 0.4)';
    const img = shoe.image_url || shoe.image || 'assets/images/jordan-chicago.png';

    if (!renderedIds.has(id)) {
      const card = document.createElement('article');
      card.className = 'square-sneaker-card dynamic-grail-card';
      card.setAttribute('style', `--card-color: ${theme}; --card-glow: ${glow};`);
      card.innerHTML = `
        <div class="square-card-top">
          <span class="square-card-badge">VAULT GRAIL • DEADSTOCK</span>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="square-card-year">${year}</span>
            <button type="button" class="btn-card-wishlist" data-wishlist-id="${id}" title="Guardar na Wishlist" data-i18n-title="save_wishlist">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>
        <div class="square-card-image-box" onclick="window.cartManager.openBuyModal('${id}')" style="cursor: pointer;" title="Comprar Par">
          <img src="${img}" alt="${name} ${colorway}" class="square-card-img" loading="lazy" onerror="this.src='assets/images/jordan-chicago.png'">
        </div>
        <div class="square-card-info">
          <h3 class="square-card-title">${name}</h3>
          <div class="square-card-colorway">${colorway}</div>
        </div>
        <div class="square-card-footer">
          <div class="square-card-price-row">
            <div>
              <span style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); display: block;" data-i18n="ask_price">ASK PRICE</span>
              <span class="square-card-price">$${price}</span>
            </div>
            <span style="font-size: 0.75rem; color: #22c55e; font-family: var(--font-mono);" data-i18n="in_stock">IN STOCK</span>
          </div>
          <div class="square-card-actions">
            <button class="btn-card-buy" onclick="window.cartManager.openBuyModal('${id}')" data-i18n="instant_buy">Instant Buy</button>
            <button class="btn-card-inspect" onclick="window.cartManager.openBuyModal('${id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              <span>Instant Buy</span>
            </button>
          </div>
        </div>
      `;
      grid.appendChild(card);
      renderedIds.add(id);
    }
  });

  if (window.wishlistManager && typeof window.wishlistManager.syncHeartButtons === 'function') {
    window.wishlistManager.syncHeartButtons();
  }

  if (typeof window.updateStorefrontStockBadges === 'function') {
    window.updateStorefrontStockBadges();
  }
};

/**
 * Live Database Stock Correlation for Storefront
 * Reflects live database inventory across Runway sections & Square Grid cards.
 */
window.updateStorefrontStockBadges = async function() {
  if (!window.AetherDB || typeof window.AetherDB.getInventory !== 'function') return;

  try {
    const allInventory = await window.AetherDB.getInventory();
    if (!allInventory || allInventory.length === 0) return;

    // Group inventory by shoeId
    const stockByShoe = new Map();
    const stockBySize = new Map(); // key: `${shoeId}_${sizeEu}` -> qty

    allInventory.forEach(item => {
      const shoeId = item.shoe_id;
      const sizeEu = String(item.size_eu);
      const qty = parseInt(item.quantity, 10) || 0;

      stockByShoe.set(shoeId, (stockByShoe.get(shoeId) || 0) + qty);
      stockBySize.set(`${shoeId}_${sizeEu}`, qty);
    });

    // 1. Correlate Runway Sections (#section-chicago, #section-purple, etc.)
    const runwaySections = document.querySelectorAll('.runway-section');
    runwaySections.forEach(section => {
      const shoeId = section.dataset.shoeId || section.id.replace('section-', '');
      const totalStock = stockByShoe.has(shoeId) ? stockByShoe.get(shoeId) : 0;

      // Update or insert Vault Stock badge in .buy-card
      const buyCard = section.querySelector('.buy-card');
      if (buyCard) {
        let badge = buyCard.querySelector('.card-vault-stock');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'card-vault-stock';
          const priceRow = buyCard.querySelector('.buy-price-row');
          if (priceRow && priceRow.nextSibling) {
            buyCard.insertBefore(badge, priceRow.nextSibling);
          } else {
            buyCard.prepend(badge);
          }
        }

        if (totalStock === 0) {
          badge.className = 'card-vault-stock stock-out';
          badge.innerHTML = `<span class="pulse-stock-dot dot-red"></span> ARCHIVE VAULT: <strong>SOLD OUT</strong>`;
        } else if (totalStock <= 2) {
          badge.className = 'card-vault-stock stock-low';
          badge.innerHTML = `<span class="pulse-stock-dot dot-red"></span> ⚡ ONLY <strong>${totalStock} PAIRS LEFT IN VAULT</strong>`;
        } else {
          badge.className = 'card-vault-stock';
          badge.innerHTML = `<span class="pulse-stock-dot"></span> VAULT STOCK: <strong>${totalStock} PAIRS</strong>`;
        }
      }

      // Update Runway Size Pills (.buy-sizes-scroll button)
      const sizeButtons = section.querySelectorAll('.buy-sizes-scroll .btn-stage-size');
      sizeButtons.forEach(btn => {
        const eu = btn.dataset.eu;
        const key = `${shoeId}_${eu}`;
        const qty = stockBySize.has(key) ? stockBySize.get(key) : null;

        if (qty !== null) {
          if (qty === 0) {
            btn.classList.add('out-of-stock', 'disabled');
            btn.setAttribute('title', 'Esgotado / Out of Stock');
          } else {
            btn.classList.remove('out-of-stock', 'disabled');
            btn.removeAttribute('title');
          }
        }
      });
    });

    // 2. Correlate Square Grid Cards (#square-cards-grid or .square-cards-grid)
    const squareCards = document.querySelectorAll('.square-sneaker-card');
    squareCards.forEach(card => {
      let shoeId = null;
      const wishBtn = card.querySelector('.btn-card-wishlist');
      if (wishBtn && wishBtn.dataset.wishlistId) {
        shoeId = wishBtn.dataset.wishlistId;
      } else {
        const buyBtn = card.querySelector('.btn-card-buy');
        if (buyBtn) {
          const onclickStr = buyBtn.getAttribute('onclick') || '';
          const match = onclickStr.match(/openBuyModal\(['"]([^'"]+)['"]\)/);
          if (match) shoeId = match[1];
        }
      }

      if (!shoeId) return;

      const totalStock = stockByShoe.has(shoeId) ? stockByShoe.get(shoeId) : 0;
      const footer = card.querySelector('.square-card-footer');
      if (footer) {
        let badge = footer.querySelector('.card-vault-stock');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'card-vault-stock';
          const priceRow = footer.querySelector('.square-card-price-row');
          if (priceRow && priceRow.nextSibling) {
            footer.insertBefore(badge, priceRow.nextSibling);
          } else {
            footer.prepend(badge);
          }
        }

        if (totalStock === 0) {
          badge.className = 'card-vault-stock stock-out';
          badge.innerHTML = `<span class="pulse-stock-dot dot-red"></span> <strong>SOLD OUT</strong>`;
        } else if (totalStock <= 2) {
          badge.className = 'card-vault-stock stock-low';
          badge.innerHTML = `<span class="pulse-stock-dot dot-red"></span> ⚡ ONLY <strong>${totalStock} LEFT</strong>`;
        } else {
          badge.className = 'card-vault-stock';
          badge.innerHTML = `<span class="pulse-stock-dot"></span> VAULT STOCK: <strong>${totalStock} PAIRS</strong>`;
        }
      }
    });

  } catch(err) {
    console.warn('[Aether Storefront] Error updating stock correlation badges:', err);
  }
};

// Auto-run synchronization on boot and reactive database updates
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof window.syncSquareGridCatalog === 'function') window.syncSquareGridCatalog();
    if (typeof window.updateStorefrontStockBadges === 'function') window.updateStorefrontStockBadges();
  }, 120);
});

window.addEventListener('aether:db:updated', () => {
  if (typeof window.syncSquareGridCatalog === 'function') window.syncSquareGridCatalog();
  if (typeof window.updateStorefrontStockBadges === 'function') window.updateStorefrontStockBadges();
});

window.addEventListener('sneakers:db:synced', () => {
  if (typeof window.syncSquareGridCatalog === 'function') window.syncSquareGridCatalog();
  if (typeof window.updateStorefrontStockBadges === 'function') window.updateStorefrontStockBadges();
});

