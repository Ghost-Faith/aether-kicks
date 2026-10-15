/**
 * AETHER KICKS - Authentic Air Jordan 1 Bespoke Atelier Engine
 * Dual-Mode Engine:
 *   Mode A: Photorealistic Studio (Bespoke Independent 6-Layer Mask Engine + Multiply Shading + Interactive Hotspots)
 *   Mode B: Technical Blueprint (Factory CAD Schematic with Authentic Callouts)
 */

class SneakerCustomizer {
  constructor() {
    // True independent component palette (Chicago '85 baseline)
    this.parts = {
      overlay: '#dc2626',
      base: '#ffffff',
      swoosh: '#09090b',
      collar: '#09090b',
      sole: '#ffffff',
      laces: '#09090b'
    };

    this.activePart = 'overlay';
    this.currentMode = 'studio'; // 'studio' | 'blueprint'
    this.activePresetKey = 'chicago';

    // Official Authentic Grail Presets
    this.presets = {
      chicago: {
        id: 'chicago',
        name: "AIR JORDAN 1 HIGH 'CHICAGO 1985 BESPOKE'",
        colorway: "Chicago (Varsity Red)",
        image: 'assets/images/jordan-chicago.png',
        theme: '#dc2626',
        price: 520,
        parts: {
          overlay: '#dc2626',
          base: '#ffffff',
          swoosh: '#09090b',
          collar: '#09090b',
          sole: '#ffffff',
          laces: '#09090b'
        }
      },
      purple: {
        id: 'purple',
        name: "AIR JORDAN 1 HIGH 'COURT PURPLE BESPOKE'",
        colorway: "Court Purple 2.0",
        image: 'assets/images/jordan-purple.png',
        theme: '#9333ea',
        price: 520,
        parts: {
          overlay: '#9333ea',
          base: '#ffffff',
          swoosh: '#09090b',
          collar: '#09090b',
          sole: '#ffffff',
          laces: '#9333ea'
        }
      },
      blue: {
        id: 'blue',
        name: "AIR JORDAN 1 HIGH 'UNIVERSITY BLUE BESPOKE'",
        colorway: "University Blue / Obsidian",
        image: 'assets/images/jordan-blue.png',
        theme: '#0284c7',
        price: 520,
        parts: {
          overlay: '#0284c7',
          base: '#ffffff',
          swoosh: '#09090b',
          collar: '#09090b',
          sole: '#ffffff',
          laces: '#0284c7'
        }
      },
      green: {
        id: 'green',
        name: "AIR JORDAN 1 HIGH 'PINE GREEN BESPOKE'",
        colorway: "Pine Green 2.0",
        image: 'assets/images/jordan-green.png',
        theme: '#16a34a',
        price: 520,
        parts: {
          overlay: '#16a34a',
          base: '#ffffff',
          swoosh: '#09090b',
          collar: '#09090b',
          sole: '#ffffff',
          laces: '#16a34a'
        }
      },
      shattered: {
        id: 'shattered',
        name: "AIR JORDAN 1 HIGH 'REVERSE SHATTERED BESPOKE'",
        colorway: "Reverse Shattered Backboard",
        image: 'assets/images/jordan-orange.png',
        theme: '#ea580c',
        price: 520,
        parts: {
          overlay: '#ea580c',
          base: '#fef3c7',
          swoosh: '#09090b',
          collar: '#09090b',
          sole: '#fef3c7',
          laces: '#09090b'
        }
      },
      orange: {
        id: 'orange',
        name: "AIR JORDAN 1 HIGH 'REVERSE SHATTERED BESPOKE'",
        colorway: "Reverse Shattered Backboard",
        image: 'assets/images/jordan-orange.png',
        theme: '#ea580c',
        price: 520,
        parts: {
          overlay: '#ea580c',
          base: '#fef3c7',
          swoosh: '#09090b',
          collar: '#09090b',
          sole: '#fef3c7',
          laces: '#09090b'
        }
      },
      blackcat: {
        id: 'blackcat',
        name: "AIR JORDAN 1 RETRO 'BLACK CAT STEALTH BESPOKE'",
        colorway: "Black Cat / Shadow Noir",
        image: 'assets/images/jordan-shadow.png',
        theme: '#18181b',
        price: 520,
        parts: {
          overlay: '#18181b',
          base: '#27272a',
          swoosh: '#09090b',
          collar: '#18181b',
          sole: '#18181b',
          laces: '#09090b'
        }
      },
      shadow: {
        id: 'shadow',
        name: "AIR JORDAN 1 RETRO 'BLACK CAT STEALTH BESPOKE'",
        colorway: "Black Cat / Shadow Noir",
        image: 'assets/images/jordan-shadow.png',
        theme: '#18181b',
        price: 520,
        parts: {
          overlay: '#18181b',
          base: '#27272a',
          swoosh: '#09090b',
          collar: '#18181b',
          sole: '#18181b',
          laces: '#09090b'
        }
      },
      travis: {
        id: 'travis',
        name: "AIR JORDAN 1 HIGH 'TRAVIS MOCHA BESPOKE'",
        colorway: "Dark Mocha / Sail",
        image: 'assets/images/jordan-chicago.png',
        theme: '#451a03',
        price: 520,
        parts: {
          overlay: '#451a03',
          base: '#fef3c7',
          swoosh: '#09090b',
          collar: '#1c1917',
          sole: '#fef3c7',
          laces: '#f472b6'
        }
      }
    };

    // Curated Heritage Color Palette
    this.swatches = [
      { name: 'Varsity Red', hex: '#dc2626' },
      { name: 'Court Purple', hex: '#9333ea' },
      { name: 'University Blue', hex: '#0284c7' },
      { name: 'Pine Green', hex: '#16a34a' },
      { name: 'Starfish Orange', hex: '#ea580c' },
      { name: 'Triple Black', hex: '#09090b' },
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Sail Cream', hex: '#fef3c7' },
      { name: 'Metallic Gold', hex: '#eab308' },
      { name: 'Neon Cyber', hex: '#a855f7' }
    ];

    // Preload mask & texture assets for zero-latency dynamic canvas thumbnail generation
    this.maskImages = {};
    ['sole', 'base', 'collar', 'overlay', 'swoosh', 'laces'].forEach(part => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = `assets/images/jordan-mask-${part}.png`;
      this.maskImages[part] = img;
    });

    this.textureImage = new Image();
    this.textureImage.crossOrigin = 'anonymous';
    this.textureImage.src = 'assets/images/jordan-texture.png';
  }

  init() {
    this.ensureStageElements();
    this.setupHotspots();
    this.updateAllLayers();
    this.updatePartColorDots();
    this.renderSwatches();
    this.bindEvents();
    this.bindHotspotEvents();

    // Initialize baseline silhouette and styling
    const initialPreset = this.presets[this.activePresetKey] || this.presets['chicago'];
    if (initialPreset) {
      const nameInput = document.getElementById('custom-shoe-name');
      if (nameInput && initialPreset.name) {
        nameInput.value = initialPreset.name;
      }
      this.updateGlow(initialPreset.theme);
      this.updatePresetPills(this.activePresetKey);
    }

    this.selectPart(this.activePart, false);
  }

  ensureStageElements() {
    const wrap = document.getElementById('customizer-stage-wrap');
    if (!wrap) return;

    let stage = document.getElementById('bespoke-shoe-stage');
    if (!stage) {
      stage = document.createElement('div');
      stage.id = 'bespoke-shoe-stage';
      stage.className = 'bespoke-shoe-stage';
      stage.innerHTML = `
        <div id="layer-sole" class="custom-shoe-layer layer-sole" style="background-color: ${this.parts.sole};"></div>
        <div id="layer-base" class="custom-shoe-layer layer-base" style="background-color: ${this.parts.base};"></div>
        <div id="layer-collar" class="custom-shoe-layer layer-collar" style="background-color: ${this.parts.collar};"></div>
        <div id="layer-overlay" class="custom-shoe-layer layer-overlay" style="background-color: ${this.parts.overlay};"></div>
        <div id="layer-swoosh" class="custom-shoe-layer layer-swoosh" style="background-color: ${this.parts.swoosh};"></div>
        <div id="layer-laces" class="custom-shoe-layer layer-laces" style="background-color: ${this.parts.laces};"></div>
        <img id="shoe-texture-overlay" src="assets/images/jordan-texture.png" alt="Air Jordan 1 Leather Texture" class="shoe-texture-overlay" draggable="false">
      `;

      const blueprint = document.getElementById('blueprint-overlay');
      if (blueprint && blueprint.parentNode === wrap) {
        wrap.insertBefore(stage, blueprint);
      } else {
        wrap.appendChild(stage);
      }
    }

    // Hide fallback static image and canvas so the interactive mask stage renders with full fidelity
    const oldImg = document.getElementById('customizer-shoe-img');
    if (oldImg) {
      oldImg.style.display = 'none';
    }
    const oldCanvas = document.getElementById('customizer-canvas');
    if (oldCanvas) {
      oldCanvas.style.display = 'none';
    }
  }

  setupHotspots() {
    const stage = document.getElementById('bespoke-shoe-stage');
    if (!stage) return;

    let svg = document.getElementById('customizer-hotspot-svg');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('id', 'customizer-hotspot-svg');
      svg.setAttribute('class', 'customizer-hotspot-svg');
      svg.setAttribute('viewBox', '0 0 860 560');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.setAttribute('aria-label', 'Interactive Sneaker Component Selection');
      svg.innerHTML = `
        <!-- Midsole & Sole Hotspot -->
        <g class="shoe-hotspot" data-part="sole" data-label="Midsole / Sole" title="Midsole / Sole">
          <polygon class="hotspot-shape" points="48,415 120,410 240,415 360,425 480,435 600,435 720,425 805,420 816,445 805,475 730,495 500,500 280,498 120,495 50,475 46,435" />
        </g>
        <!-- Base Leather: Midfoot Quarter & Toe Vamp -->
        <g class="shoe-hotspot" data-part="base" data-label="Base Leather (Toe Vamp & Midfoot)" title="Base Leather">
          <!-- Toe Vamp -->
          <polygon class="hotspot-shape" points="565,320 660,312 745,335 750,375 670,375 580,365 565,330" />
          <!-- Midfoot Quarter Panel -->
          <polygon class="hotspot-shape" points="220,250 310,240 420,235 480,265 470,350 400,380 270,365 220,310" />
        </g>
        <!-- Overlays / Mudguard: Toe Mudguard & Heel Counter -->
        <g class="shoe-hotspot" data-part="overlay" data-label="Overlays (Mudguard & Heel Counter)" title="Overlays / Mudguard">
          <!-- Toe Mudguard -->
          <polygon class="hotspot-shape" points="560,335 630,325 720,335 780,355 805,385 795,420 740,425 670,425 590,425 560,400 560,345" />
          <!-- Heel Counter -->
          <polygon class="hotspot-shape" points="52,200 95,150 150,240 170,320 160,415 50,420 50,260" />
          <!-- Ankle Wing Strap -->
          <polygon class="hotspot-shape" points="230,135 340,65 380,120 360,220 300,240 230,170" />
        </g>
        <!-- Collar & Tongue -->
        <g class="shoe-hotspot" data-part="collar" data-label="Collar & Tongue" title="Collar & Tongue">
          <polygon class="hotspot-shape" points="92,105 130,85 190,75 255,65 345,65 380,120 375,180 340,180 310,225 240,250 160,240 100,150 92,115" />
        </g>
        <!-- Swoosh -->
        <g class="shoe-hotspot" data-part="swoosh" data-label="Swoosh" title="Swoosh">
          <path class="hotspot-shape" d="M 80,265 C 130,285 190,320 250,345 C 310,365 370,360 412,275 C 375,325 315,340 260,325 C 200,305 140,280 80,265 Z" />
        </g>
        <!-- Laces & Eyestay -->
        <g class="shoe-hotspot" data-part="laces" data-label="Laces & Eyestay" title="Laces">
          <polygon class="hotspot-shape" points="335,140 405,135 465,225 540,290 585,310 585,375 530,375 440,300 370,225 335,160" />
        </g>
      `;
      stage.appendChild(svg);
    }

    let pill = document.getElementById('hotspot-indicator-pill');
    if (!pill) {
      pill = document.createElement('div');
      pill.id = 'hotspot-indicator-pill';
      pill.className = 'hotspot-indicator-pill';
      pill.innerHTML = `<span class="indicator-dot"></span><span class="indicator-text">Interactive Hotspots</span>`;
      stage.appendChild(pill);
    }
  }

  updateAllLayers() {
    Object.keys(this.parts).forEach(part => {
      const layer = document.getElementById('layer-' + part);
      if (layer) {
        layer.style.backgroundColor = this.parts[part];
      }
    });
  }

  updatePartColorDots() {
    document.querySelectorAll('.custom-part-tab').forEach(tab => {
      const part = tab.dataset.part;
      if (!part) return;

      let dot = tab.querySelector('.part-color-dot');
      if (!dot) {
        dot = document.createElement('span');
        dot.className = 'part-color-dot';
        dot.setAttribute('data-part-dot', part);
        tab.prepend(dot);
      }

      const color = this.parts[part] || '#ffffff';
      dot.style.backgroundColor = color;

      // Adjust border & contrast for pure white / sail cream colors
      const lower = color.toLowerCase().trim();
      if (lower === '#ffffff' || lower === '#fff' || lower === '#fef3c7') {
        dot.style.borderColor = 'rgba(255, 255, 255, 0.9)';
        dot.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.75), inset 0 0 2px rgba(0, 0, 0, 0.35)';
      } else {
        dot.style.borderColor = 'rgba(255, 255, 255, 0.45)';
        dot.style.boxShadow = `0 0 8px ${color}88`;
      }
    });
  }

  selectPart(part, playSound = true) {
    if (!part || !this.parts.hasOwnProperty(part)) return;
    this.activePart = part;

    // 1. Update component tabs active class
    document.querySelectorAll('.custom-part-tab').forEach(tab => {
      if (tab.dataset.part === part) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // 2. Update active class on SVG hotspots
    document.querySelectorAll('.shoe-hotspot').forEach(g => {
      if (g.dataset.part === part) {
        g.classList.add('active-part');
      } else {
        g.classList.remove('active-part');
      }
    });

    // 3. Update active color picker value
    const picker = document.getElementById('custom-color-picker');
    if (picker) {
      picker.value = this.parts[part] || '#ffffff';
    }

    // 4. Update swatches grid
    this.renderSwatches();

    // 5. Audio feedback
    if (playSound && window.soundEngine && typeof window.soundEngine.playSwitch === 'function') {
      window.soundEngine.playSwitch();
    }
  }

  setColor(part, hex) {
    if (!part) part = this.activePart || 'overlay';
    this.parts[part] = hex;

    // Directly update the layer element
    const layer = document.getElementById('layer-' + part);
    if (layer) {
      layer.style.backgroundColor = hex;
    }

    // Update live color dots on component tabs
    this.updatePartColorDots();

    // If the modified part is overlay, update #custom-preview-glow with that color!
    if (part === 'overlay') {
      this.updateGlow(hex);
    }

    // Update active swatch highlight in #customizer-swatches
    const swatchesContainer = document.getElementById('customizer-swatches');
    if (swatchesContainer) {
      let isCurated = false;
      swatchesContainer.querySelectorAll('.swatch-btn:not(.custom-color-swatch)').forEach(btn => {
        const btnHex = (btn.dataset.hex || '').toLowerCase().trim();
        if (btnHex === (hex || '').toLowerCase().trim()) {
          btn.classList.add('active');
          isCurated = true;
        } else {
          btn.classList.remove('active');
        }
      });

      const customSwatch = swatchesContainer.querySelector('.custom-color-swatch');
      if (customSwatch) {
        if (!isCurated) {
          customSwatch.classList.add('active');
        } else {
          customSwatch.classList.remove('active');
        }
      }
    }

    // Keep native color picker value synced
    const picker = document.getElementById('custom-color-picker');
    if (picker && picker.value.toLowerCase() !== hex.toLowerCase()) {
      picker.value = hex;
    }

    // Check if the current combination matches any official preset
    this.checkPresetMatch();

    // If custom 1-of-1, update title in #custom-shoe-name to reflect custom creation
    const nameInput = document.getElementById('custom-shoe-name');
    if (nameInput) {
      if (this.activePresetKey && this.presets[this.activePresetKey]) {
        nameInput.value = this.presets[this.activePresetKey].name;
      } else {
        nameInput.value = "AIR JORDAN 1 HIGH 'BESPOKE 1-OF-1'";
      }
    }

    // Play click audio
    if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
      window.soundEngine.playClick();
    }
  }

  checkPresetMatch() {
    let matchedKey = null;
    const currentKeys = Object.keys(this.parts);

    Object.keys(this.presets).forEach(key => {
      if (matchedKey) return;
      const p = this.presets[key];
      if (!p || !p.parts) return;
      const isMatch = currentKeys.every(k => {
        const pVal = (p.parts[k] || '').toLowerCase().trim();
        const curVal = (this.parts[k] || '').toLowerCase().trim();
        return pVal === curVal;
      });
      if (isMatch) matchedKey = key;
    });

    this.activePresetKey = matchedKey;
    this.updatePresetPills(matchedKey);
  }

  applyPreset(presetName) {
    const key = (presetName || '').toLowerCase().trim();
    const preset = this.presets[key];
    if (!preset) return;

    this.activePresetKey = key;

    // Set all 6 parts from preset definition
    this.parts = {
      overlay: preset.parts.overlay,
      base: preset.parts.base,
      swoosh: preset.parts.swoosh,
      collar: preset.parts.collar,
      sole: preset.parts.sole,
      laces: preset.parts.laces
    };

    // Update every #layer-[part] element's style.backgroundColor!
    this.updateAllLayers();

    // Update live color dots on tabs
    this.updatePartColorDots();

    // Update glow
    this.updateGlow(preset.theme || this.parts.overlay);

    // Update title
    const nameInput = document.getElementById('custom-shoe-name');
    if (nameInput && preset.name) {
      nameInput.value = preset.name;
    }

    // Update preset button active state
    this.updatePresetPills(key);

    // Update active swatch highlight in swatches panel
    this.renderSwatches();

    // Sync Bespoke Wishlist button
    const customWishlistBtn = document.getElementById('customizer-wishlist-btn');
    if (customWishlistBtn) {
      const dbId = key === 'shattered' ? 'orange' : (key === 'blackcat' ? 'shadow' : key);
      customWishlistBtn.setAttribute('data-wishlist-id', dbId);
      if (window.wishlistManager) {
        window.wishlistManager.syncHeartButtons();
      }
    }

    // Audio feedback
    if (window.soundEngine && typeof window.soundEngine.playSwoosh === 'function') {
      window.soundEngine.playSwoosh();
    }

    if (typeof showToast === 'function') {
      showToast(`Loaded ${preset.colorway || preset.name} preset`);
    }
  }

  updatePresetPills(activeKey) {
    const pills = document.querySelectorAll('.btn-preset-pill');
    pills.forEach(pill => {
      const onclickAttr = pill.getAttribute('onclick') || '';
      const dataPreset = pill.dataset.preset || '';
      const text = (pill.textContent || '').toLowerCase();

      const isMatch = !!activeKey && (
        (dataPreset && dataPreset.toLowerCase() === activeKey.toLowerCase()) ||
        onclickAttr.toLowerCase().includes(`'${activeKey.toLowerCase()}'`) ||
        onclickAttr.toLowerCase().includes(`"${activeKey.toLowerCase()}"`) ||
        (activeKey === 'chicago' && text.includes('chicago')) ||
        (activeKey === 'purple' && text.includes('purple')) ||
        (activeKey === 'blue' && text.includes('blue')) ||
        (activeKey === 'green' && text.includes('green')) ||
        (activeKey === 'shattered' && text.includes('shattered')) ||
        (activeKey === 'blackcat' && (text.includes('black') || text.includes('cat')))
      );

      if (isMatch) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  updateGlow(hex) {
    const glowBack = document.getElementById('custom-preview-glow');
    if (glowBack && hex) {
      glowBack.style.background = `radial-gradient(circle, ${hex}66 0%, ${hex}20 45%, transparent 72%)`;
      glowBack.style.boxShadow = `0 0 100px 30px ${hex}33`;
    }
  }

  setStudioMode(mode) {
    this.currentMode = mode;
    const studioBtn = document.getElementById('btn-mode-studio');
    const blueprintBtn = document.getElementById('btn-mode-blueprint');
    const blueprintOverlay = document.getElementById('blueprint-overlay');
    const stageWrap = document.getElementById('customizer-stage-wrap');

    if (mode === 'blueprint') {
      if (studioBtn) studioBtn.classList.remove('active');
      if (blueprintBtn) blueprintBtn.classList.add('active');
      if (blueprintOverlay) {
        blueprintOverlay.classList.add('active');
        blueprintOverlay.setAttribute('aria-hidden', 'false');
      }
      if (stageWrap) stageWrap.classList.add('blueprint-mode');
      this.updateGlow('#38bdf8');
    } else {
      if (blueprintBtn) blueprintBtn.classList.remove('active');
      if (studioBtn) studioBtn.classList.add('active');
      if (blueprintOverlay) {
        blueprintOverlay.classList.remove('active');
        blueprintOverlay.setAttribute('aria-hidden', 'true');
      }
      if (stageWrap) stageWrap.classList.remove('blueprint-mode');
      const activeColor = (this.presets[this.activePresetKey] && this.presets[this.activePresetKey].theme) || this.parts.overlay || '#dc2626';
      this.updateGlow(activeColor);
    }

    if (window.soundEngine && typeof window.soundEngine.playSwitch === 'function') {
      window.soundEngine.playSwitch();
    }
  }

  renderSwatches() {
    const container = document.getElementById('customizer-swatches');
    if (!container) return;

    const currentPartColor = (this.parts[this.activePart] || '').toLowerCase().trim();
    let isCuratedMatch = false;

    const swatchesHtml = this.swatches.map(sw => {
      const isSelected = currentPartColor === sw.hex.toLowerCase().trim();
      if (isSelected) isCuratedMatch = true;
      return `
        <button type="button" class="swatch-btn ${isSelected ? 'active' : ''}" 
                data-hex="${sw.hex}" 
                style="background-color: ${sw.hex};" 
                title="${sw.name}"
                aria-label="Color ${sw.name}">
        </button>
      `;
    }).join('');

    const isCustomActive = !isCuratedMatch && currentPartColor !== '';

    container.innerHTML = swatchesHtml + `
      <label class="swatch-btn custom-color-swatch ${isCustomActive ? 'active' : ''}" title="Custom Color Palette Wheel" aria-label="Custom Bespoke Color">
        <input type="color" id="custom-color-picker" class="custom-color-input" value="${currentPartColor.startsWith('#') ? currentPartColor : '#dc2626'}">
        <span class="custom-color-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.5 4.5-4 5.5V17a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2.5C6.5 13.5 5 11.5 5 9a7 7 0 0 1 7-7z"/></svg>
        </span>
      </label>
    `;

    container.querySelectorAll('.swatch-btn:not(.custom-color-swatch)').forEach(btn => {
      btn.addEventListener('click', () => {
        const hex = btn.dataset.hex;
        this.setColor(this.activePart, hex);
        container.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    const picker = document.getElementById('custom-color-picker');
    if (picker) {
      const handleCustomColor = (e) => {
        const hex = e.target.value;
        this.setColor(this.activePart, hex);
        container.querySelectorAll('.swatch-btn:not(.custom-color-swatch)').forEach(b => b.classList.remove('active'));
        const customSwatch = container.querySelector('.custom-color-swatch');
        if (customSwatch) customSwatch.classList.add('active');
      };
      picker.addEventListener('input', handleCustomColor);
      picker.addEventListener('change', handleCustomColor);
    }
  }

  hitTestCoordinates(x, y) {
    // 860x560 coordinate space fallback hit-tester
    // 1. Sole / Midsole: runs along entire bottom silhouette
    if (y >= 405 && x >= 40 && x <= 820) return 'sole';

    // 2. Swoosh: arcs from heel to midfoot
    if (x >= 75 && x <= 425 && y >= 255 && y <= 375) {
      const swooshY = 265 + (x - 80) * 0.28 + Math.sin((x - 80) / 100) * 20;
      if (Math.abs(y - swooshY) <= 42) {
        return 'swoosh';
      }
    }

    // 3. Laces & Eyestay: diagonal column from high throat to lower vamp
    if (x >= 320 && x <= 590 && y >= 130 && y <= 380) {
      const expectedY = 140 + ((x - 370) / 190) * 220;
      if (Math.abs(y - expectedY) <= 48) {
        return 'laces';
      }
    }

    // 4. Collar & Tongue (high top ankle flap)
    if (y <= 245 && x >= 85 && x <= 390) {
      return 'collar';
    }

    // 5. Toe area: vamp (base) vs mudguard (overlay)
    if (x >= 550 && y >= 300 && y <= 430) {
      if (x >= 760 || y >= 385 || (x <= 585 && y >= 375)) {
        return 'overlay';
      }
      return 'base';
    }

    // 6. Heel Counter: overlay
    if (x <= 220 && y >= 180 && y <= 415) {
      return 'overlay';
    }

    // 7. Quarter panel: base leather
    if (x >= 220 && x <= 500 && y >= 235 && y <= 420) {
      return 'base';
    }

    return null;
  }

  bindHotspotEvents() {
    const stage = document.getElementById('bespoke-shoe-stage');
    const pill = document.getElementById('hotspot-indicator-pill');
    if (!stage) return;

    const partLabels = {
      swoosh: 'Swoosh',
      laces: 'Laces & Eyestay',
      overlay: 'Overlays (Mudguard & Heel Counter)',
      base: 'Base Leather (Toe Vamp & Midfoot)',
      collar: 'Collar & Tongue',
      sole: 'Midsole / Sole'
    };

    // Hotspot group clicks & hovers
    stage.querySelectorAll('.shoe-hotspot').forEach(hotspot => {
      const part = hotspot.dataset.part;
      const label = hotspot.dataset.label || partLabels[part] || part;

      hotspot.addEventListener('mouseenter', () => {
        if (pill) {
          const color = this.parts[part] || '#ffffff';
          pill.innerHTML = `<span class="indicator-dot" style="background-color: ${color};"></span><span class="indicator-text">${label}</span>`;
          pill.classList.add('active');
        }
      });

      hotspot.addEventListener('mouseleave', () => {
        if (pill) {
          pill.classList.remove('active');
        }
      });

      hotspot.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectPart(part);
        if (pill) {
          const color = this.parts[part] || '#ffffff';
          pill.innerHTML = `<span class="indicator-dot" style="background-color: ${color};"></span><span class="indicator-text">Selected: ${label}</span>`;
          pill.classList.add('active');
          setTimeout(() => {
            if (pill) pill.classList.remove('active');
          }, 1400);
        }
      });
    });

    // Fallback coordinate hit-testing on stage click
    stage.addEventListener('click', (e) => {
      if (e.target.closest('.shoe-hotspot')) return;

      const rect = stage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 860;
      const y = ((e.clientY - rect.top) / rect.height) * 560;

      const detectedPart = this.hitTestCoordinates(x, y);
      if (detectedPart) {
        this.selectPart(detectedPart);
        if (pill) {
          const label = partLabels[detectedPart] || detectedPart;
          const color = this.parts[detectedPart] || '#ffffff';
          pill.innerHTML = `<span class="indicator-dot" style="background-color: ${color};"></span><span class="indicator-text">Selected: ${label}</span>`;
          pill.classList.add('active');
          setTimeout(() => {
            if (pill) pill.classList.remove('active');
          }, 1400);
        }
      }
    });

    // Stage mousemove to show real-time hover feedback
    stage.addEventListener('mousemove', (e) => {
      if (e.target.closest('.shoe-hotspot')) return;
      const rect = stage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 860;
      const y = ((e.clientY - rect.top) / rect.height) * 560;

      const detectedPart = this.hitTestCoordinates(x, y);
      if (detectedPart && pill) {
        const label = partLabels[detectedPart] || detectedPart;
        const color = this.parts[detectedPart] || '#ffffff';
        pill.innerHTML = `<span class="indicator-dot" style="background-color: ${color};"></span><span class="indicator-text">${label}</span>`;
        pill.classList.add('active');
      } else if (!e.target.closest('.shoe-hotspot') && pill) {
        pill.classList.remove('active');
      }
    });

    stage.addEventListener('mouseleave', () => {
      if (pill) pill.classList.remove('active');
    });
  }

  generateShoeThumbnail() {
    try {
      const width = 860;
      const height = 560;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return (this.activePresetKey && this.presets[this.activePresetKey]?.image) || 'assets/images/jordan-chicago.png';
      }

      // Offscreen scratch canvas for alpha mask clipping
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');

      const layerOrder = ['sole', 'base', 'collar', 'overlay', 'swoosh', 'laces'];
      let renderedLayers = 0;

      for (const part of layerOrder) {
        const maskImg = this.maskImages[part];
        if (maskImg && maskImg.complete && maskImg.naturalWidth > 0) {
          tempCtx.clearRect(0, 0, width, height);
          tempCtx.globalCompositeOperation = 'source-over';
          tempCtx.fillStyle = this.parts[part] || '#ffffff';
          tempCtx.fillRect(0, 0, width, height);

          // Mask color to shape of authentic Jordan 1 component
          tempCtx.globalCompositeOperation = 'destination-in';
          tempCtx.drawImage(maskImg, 0, 0, width, height);

          // Composite onto master canvas
          ctx.drawImage(tempCanvas, 0, 0);
          renderedLayers++;
        }
      }

      // Multiply realistic Air Jordan 1 leather texture & shading overlay
      const texImg = this.textureImage;
      if (texImg && texImg.complete && texImg.naturalWidth > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(texImg, 0, 0, width, height);
        ctx.restore();
      }

      if (renderedLayers > 0) {
        return canvas.toDataURL('image/png');
      }
    } catch (err) {
      console.warn('[Customizer] Offscreen canvas thumbnail render exception:', err);
    }

    return (this.activePresetKey && this.presets[this.activePresetKey]?.image) || 'assets/images/jordan-chicago.png';
  }

  bindEvents() {
    // Component Selector Tabs
    document.querySelectorAll('.custom-part-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const part = tab.dataset.part;
        this.selectPart(part);
      });
    });

    // Reset Customizer to Chicago Baseline
    const resetBtn = document.getElementById('btn-reset-custom');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.applyPreset('chicago');
        if (typeof showToast === 'function') {
          showToast('Custom palette reset to Chicago baseline');
        }
      });
    }

    // Mode Switch Buttons
    const btnStudio = document.getElementById('btn-mode-studio');
    if (btnStudio) {
      btnStudio.addEventListener('click', () => this.setStudioMode('studio'));
    }

    const btnBlueprint = document.getElementById('btn-mode-blueprint');
    if (btnBlueprint) {
      btnBlueprint.addEventListener('click', () => this.setStudioMode('blueprint'));
    }

    // Blueprint Callout Interaction Audio
    document.querySelectorAll('.spec-callout-pill').forEach(pill => {
      pill.addEventListener('mouseenter', () => {
        if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
          window.soundEngine.playClick();
        }
      });
    });

    // Bespoke Sneaker Sizing Initialization
    this.selectedEu = '42';
    this.selectedSize = 'EU 42 (US 8.5)';
    this.initCustomizerSizing();

    // Add Custom 1-of-1 to Bag with Dynamic Exact Thumbnail
    const addCustomBtn = document.getElementById('btn-add-custom-bag');
    if (addCustomBtn) {
      addCustomBtn.addEventListener('click', () => {
        const customName = document.getElementById('custom-shoe-name')?.value || "AIR JORDAN 1 HIGH 'BESPOKE 1-OF-1'";
        const customPrice = 520;
        
        // Generate authentic 1-of-1 rendered thumbnail composite
        const shoeImage = this.generateShoeThumbnail();
        const colorwaySummary = `Overlay: ${this.parts.overlay} | Swoosh: ${this.parts.swoosh} | Base: ${this.parts.base} | Sole: ${this.parts.sole}`;

        if (window.cartManager) {
          window.cartManager.items.push({
            id: 'custom-' + Date.now(),
            name: customName,
            colorway: colorwaySummary,
            price: customPrice,
            image: shoeImage,
            theme: this.parts.overlay || '#dc2626',
            parts: { ...this.parts },
            size: this.selectedSize || 'EU 42 (US 8.5)',
            condition: 'deadstock',
            quantity: 1,
            isBespoke: true
          });

          window.cartManager.saveCart();

          if (window.soundEngine && typeof window.soundEngine.playSuccess === 'function') {
            window.soundEngine.playSuccess();
          }

          if (typeof showToast === 'function') {
            showToast(`Secured 1-of-1 Bespoke (${customName}) into Bag!`);
          }

          if (typeof window.cartManager.openCart === 'function') {
            window.cartManager.openCart();
          }
        }
      });
    }
  }

  initCustomizerSizing() {
    const switcher = document.getElementById('customizer-unit-switcher');
    const currentUnit = localStorage.getItem('aether_size_unit') || 'EU';

    if (switcher) {
      switcher.querySelectorAll('.unit-toggle-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === currentUnit);
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (typeof window.setGlobalStoreUnit === 'function') {
            window.setGlobalStoreUnit(btn.dataset.unit);
          } else {
            this.renderCustomizerSizes(btn.dataset.unit);
          }
          if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
            window.soundEngine.playClick();
          }
        });
      });
    }

    this.renderCustomizerSizes(currentUnit);
  }

  renderCustomizerSizes(unit = 'EU') {
    const grid = document.getElementById('customizer-sizes-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const sizes = ['40', '40.5', '41', '42', '42.5', '43', '44', '45'];
    sizes.forEach(sz => {
      const entry = window.findSizeEntry ? window.findSizeEntry(sz, 'eu') : { eu: sz, us: '8.5' };
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn-customizer-size ${entry.eu === this.selectedEu ? 'selected' : ''}`;
      btn.dataset.eu = entry.eu;

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
      }

      btn.innerHTML = `<span class="size-main">${main}</span><small class="size-sub">${sub}</small>`;
      btn.addEventListener('click', () => {
        this.selectedEu = entry.eu;
        this.selectedSize = `EU ${entry.eu} (US ${entry.us})`;
        grid.querySelectorAll('.btn-customizer-size').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        const display = document.getElementById('customizer-size-display');
        if (display) {
          display.textContent = `Selected: EU ${entry.eu} (US ${entry.us})`;
        }
        if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
          window.soundEngine.playClick();
        }
      });
      grid.appendChild(btn);
    });

    const display = document.getElementById('customizer-size-display');
    if (display) {
      const active = window.findSizeEntry ? window.findSizeEntry(this.selectedEu, 'eu') : { eu: '42', us: '8.5' };
      display.textContent = `Selected: EU ${active.eu} (US ${active.us})`;
    }
  }
}

// Global initialization
window.sneakerCustomizer = new SneakerCustomizer();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.sneakerCustomizer.init();
  });
} else {
  window.sneakerCustomizer.init();
}
