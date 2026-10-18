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

document.addEventListener('DOMContentLoaded', () => {
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
 * Continuous Scroll-Driven RGB Interpolation
 * Seamlessly transitions through all colors in between (Red -> Magenta -> Purple -> Blue -> Green -> Orange -> Stealth)
 */
function initGradualColorScroll() {
  const sections = Array.from(document.querySelectorAll('.runway-section'));
  const dots = Array.from(document.querySelectorAll('.runway-dot'));
  if (sections.length < 2) return;

  // Cache static elements
  cachedRootEl = document.documentElement;
  cachedOrb1El = document.querySelector('.glow-orb-primary');
  cachedOrb2El = document.querySelector('.glow-orb-secondary');

  // Pre-calculate positions once
  cacheSectionPositions(sections);

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateColorsContinuous(sections, dots);
        ticking = false;
      });
      ticking = true;
    }
  }

  // Bind passive listeners
  window.addEventListener('scroll', onScroll, { passive: true });

  // Recalculate cached offsets only when viewport geometry changes
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

  // Initial run
  updateColorsContinuous(sections, dots);

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

function updateColorsContinuous(sections, dots) {
  if (sections.length < 2) return;

  // Fallback if cache not initialized
  if (!cachedSectionCenters || cachedSectionCenters.length !== sections.length) {
    cacheSectionPositions(sections);
  }

  const scrollY = window.scrollY || window.pageYOffset || 0;
  const vh = window.innerHeight || 800;
  const currentCenter = scrollY + vh / 2;

  // Use pre-computed static document center offsets without calling getBoundingClientRect()
  const sectionCenters = cachedSectionCenters;

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

  const closestIndex = t < 0.5 ? indexA : Math.min(indexA + 1, COLOR_STOPS.length - 1);
  // ---------------------------------------------------------------------------
  // SILKY-SMOOTH CONTINUOUS COLOR TRANSITION (DESKTOP & MOBILE)
  // Continuous smoothstep interpolation between colorway stops.
  // Leverages registered CSS @property variables for hardware-accelerated color blending.
  // ---------------------------------------------------------------------------
  const easeT = t * t * (3 - 2 * t);

  const stopA = COLOR_STOPS[indexA] || COLOR_STOPS[0];
  const stopB = COLOR_STOPS[indexA + 1] || COLOR_STOPS[COLOR_STOPS.length - 1];

  const lerp = (a, b, factor) => Math.round(a + (b - a) * factor);

  const r = lerp(stopA.primary[0], stopB.primary[0], easeT);
  const g = lerp(stopA.primary[1], stopB.primary[1], easeT);
  const b = lerp(stopA.primary[2], stopB.primary[2], easeT);

  const sr = lerp(stopA.secondary[0], stopB.secondary[0], easeT);
  const sg = lerp(stopA.secondary[1], stopB.secondary[1], easeT);
  const sb = lerp(stopA.secondary[2], stopB.secondary[2], easeT);

  const dr = Math.abs(r - lastAppliedTheme.r);
  const dg = Math.abs(g - lastAppliedTheme.g);
  const db = Math.abs(b - lastAppliedTheme.b);
  const isEdge = (t === 0 || t === 1);

  // Micro-step threshold of 2 RGB units guarantees imperceptible gradient stepping
  if (dr >= 2 || dg >= 2 || db >= 2 || isEdge) {
    lastAppliedTheme.r = r;
    lastAppliedTheme.g = g;
    lastAppliedTheme.b = b;
    lastAppliedTheme.sr = sr;
    lastAppliedTheme.sg = sg;
    lastAppliedTheme.sb = sb;

    const root = cachedRootEl || (cachedRootEl = document.documentElement);
    root.style.setProperty('--theme-primary', `rgb(${r}, ${g}, ${b})`);
    root.style.setProperty('--theme-secondary', `rgb(${sr}, ${sg}, ${sb})`);
    root.style.setProperty('--theme-glow', `rgba(${r}, ${g}, ${b}, 0.5)`);
    root.style.setProperty('--theme-glow-soft', `rgba(${r}, ${g}, ${b}, 0.16)`);
    root.style.setProperty('--theme-surface-glow', `rgba(${r}, ${g}, ${b}, 0.08)`);
    root.style.setProperty('--theme-card-border', `rgba(${r}, ${g}, ${b}, 0.35)`);
  }

  // Highlight active dot without redundant DOM mutations
  dots.forEach((dot, idx) => {
    const shouldBeActive = (idx === closestIndex);
    if (dot.classList.contains('active') !== shouldBeActive) {
      dot.classList.toggle('active', shouldBeActive);
    }
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

// Audio Toggle Button UI
function initSoundButton() {
  const btn = document.getElementById('btn-sound-toggle');
  if (!btn) return;

  if (window.soundEngine && window.soundEngine.enabled) {
    btn.classList.add('playing');
  }

  btn.addEventListener('click', () => {
    const isEnabled = window.soundEngine.toggle();
    if (isEnabled) {
      btn.classList.add('playing');
      showToast('Sound Effects Enabled 🔊');
    } else {
      btn.classList.remove('playing');
      showToast('Sound Effects Muted 🔇');
    }
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
}

window.initHamburgerMenu = initHamburgerMenu;
window.openNFCScanner = openNFCScanner;
window.closeNFCModal = closeNFCModal;

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
    if (runway) runway.style.display = 'none';
    if (squareGrid) squareGrid.classList.add('active');
    if (dots) dots.style.display = 'none';
    if (btnRunway) btnRunway.classList.remove('active');
    if (btnGrid) btnGrid.classList.add('active');
    if (drawerRunway) drawerRunway.classList.remove('active');
    if (drawerGrid) drawerGrid.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof showToast === 'function') showToast('Switched to Square Grid View ⊞');
  } else {
    if (runway) runway.style.display = '';
    if (squareGrid) squareGrid.classList.remove('active');
    if (dots) dots.style.display = '';
    if (btnRunway) btnRunway.classList.add('active');
    if (btnGrid) btnGrid.classList.remove('active');
    if (drawerRunway) drawerRunway.classList.add('active');
    if (drawerGrid) drawerGrid.classList.remove('active');
    if (typeof showToast === 'function') showToast('Switched to Color Runway View ☰');
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

