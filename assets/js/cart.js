/**
 * AETHER KICKS - Cart, Wishlist & Checkout Management
 */

// Global Sneaker Database for quick lookup
var SNEAKERS_DB = window.SNEAKERS_DB || {
  'chicago': {
    id: 'chicago',
    name: 'Air Jordan 1 Retro High OG',
    colorway: 'Chicago (Varsity Red)',
    styleCode: '555088-101',
    price: 480,
    retailPrice: 180,
    image: 'assets/images/jordan-chicago.png',
    theme: '#dc2626',
    glow: 'rgba(220, 38, 38, 0.45)',
    year: '1985 / 2026',
    story: 'The shoe that started the revolution. Banned by the NBA, embraced by culture forever.',
    sizes: ['US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12']
  },
  'purple': {
    id: 'purple',
    name: 'Air Jordan 1 Retro High OG',
    colorway: 'Court Purple 2.0',
    styleCode: '555088-500',
    price: 365,
    retailPrice: 170,
    image: 'assets/images/jordan-purple.png',
    theme: '#9333ea',
    glow: 'rgba(147, 51, 234, 0.45)',
    year: '2020 / 2026',
    story: 'Regal intensity. Clean white quarter panels balanced with rich amethyst tumbled leather.',
    sizes: ['US 7', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 11.5']
  },
  'blue': {
    id: 'blue',
    name: 'Air Jordan 1 Retro High OG',
    colorway: 'University Blue / Obsidian',
    styleCode: '555088-134',
    price: 395,
    retailPrice: 170,
    image: 'assets/images/jordan-blue.png',
    theme: '#0284c7',
    glow: 'rgba(2, 132, 199, 0.45)',
    year: '2021 / 2026',
    story: 'Paying homage to MJ alma mater. Soft nubuck leather enveloped in Tar Heel sky blue.',
    sizes: ['US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12']
  },
  'green': {
    id: 'green',
    name: 'Air Jordan 1 Retro High OG',
    colorway: 'Pine Green 2.0',
    styleCode: '555088-030',
    price: 340,
    retailPrice: 170,
    image: 'assets/images/jordan-green.png',
    theme: '#16a34a',
    glow: 'rgba(22, 163, 74, 0.45)',
    year: '2020 / 2026',
    story: 'Bold emerald swagger with gym red tongue tab accents on pitch black grain leather.',
    sizes: ['US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11']
  },
  'orange': {
    id: 'orange',
    name: 'Air Jordan 1 Retro High OG',
    colorway: 'Reverse Shattered Backboard',
    styleCode: '555088-113',
    price: 620,
    retailPrice: 160,
    image: 'assets/images/jordan-orange.png',
    theme: '#ea580c',
    glow: 'rgba(234, 88, 12, 0.45)',
    year: '2016 / 2026',
    story: 'Inspired by the 1985 exhibition game in Italy where MJ broke the backboard glass into shards.',
    sizes: ['US 8', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 11.5', 'US 12']
  },
  'shadow': {
    id: 'shadow',
    name: 'Air Jordan 4 Retro',
    colorway: 'Black Cat (Triple Black)',
    styleCode: 'CU1110-010',
    price: 740,
    retailPrice: 190,
    image: 'assets/images/jordan-shadow.png',
    theme: '#71717a',
    glow: 'rgba(113, 113, 122, 0.45)',
    year: '2006 / 2020',
    story: 'The stealth icon inspired by MJ fierce nickname. Crafted with rich black nubuck, matte netting, and blacked-out hardware.',
    sizes: ['US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12']
  }
};
window.SNEAKERS_DB = SNEAKERS_DB;

class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.discountPercent = 0;
    this.promoCodeApplied = null;
    this.activeShoeForModal = null;
    this.selectedSize = null;
    this.selectedCondition = 'deadstock';

    this.initDOM();
  }

  loadCart() {
    try {
      const stored = localStorage.getItem('aether_cart_items');
      return stored ? JSON.parse(stored) : [];
    } catch(e) {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem('aether_cart_items', JSON.stringify(this.items));
    this.updateCartBadge();
    this.renderCartItems();
  }

  addItem(shoeId, size, condition = 'deadstock') {
    const shoe = SNEAKERS_DB[shoeId];
    if (!shoe) return;

    const existingIndex = this.items.findIndex(
      item => item.id === shoeId && item.size === size && item.condition === condition
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += 1;
    } else {
      this.items.push({
        id: shoeId,
        name: shoe.name,
        colorway: shoe.colorway,
        price: shoe.price,
        image: shoe.image,
        theme: shoe.theme,
        size: size,
        condition: condition,
        quantity: 1
      });
    }

    this.saveCart();
    if (window.soundEngine) window.soundEngine.playSuccess();
    showToast(`Added ${shoe.name} (${shoe.colorway}) to Bag!`);
    this.openCart();
  }

  removeItem(index) {
    if (this.items[index]) {
      const removed = this.items.splice(index, 1)[0];
      this.saveCart();
      if (window.soundEngine) window.soundEngine.playClick();
      showToast(`Removed ${removed.colorway} from Bag`);
    }
  }

  updateQuantity(index, delta) {
    if (this.items[index]) {
      this.items[index].quantity += delta;
      if (this.items[index].quantity <= 0) {
        this.removeItem(index);
        return;
      }
      this.saveCart();
      if (window.soundEngine) window.soundEngine.playClick();
    }
  }

  applyPromoCode(code) {
    const clean = code.trim().toUpperCase();
    if (clean === 'GRAIL20' || clean === 'KICKS20') {
      this.discountPercent = 0.20;
      this.promoCodeApplied = clean;
      this.renderCartItems();
      if (window.soundEngine) window.soundEngine.playSuccess();
      showToast('Promo code applied: 20% OFF Grail discount!');
      return true;
    } else {
      showToast('Invalid promo code. Try "GRAIL20"');
      return false;
    }
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getTotal() {
    const sub = this.getSubtotal();
    const discount = sub * this.discountPercent;
    return Math.max(0, sub - discount);
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateCartBadge() {
    const count = this.getItemCount();
    document.querySelectorAll('.cart-badge-count').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  openCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-backdrop');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.renderCartItems();
      if (window.soundEngine) window.soundEngine.playSwoosh();
    }
  }

  closeCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-backdrop');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      if (window.soundEngine) window.soundEngine.playClick();
    }
  }

  async openBuyModal(shoeId) {
    let shoe = (window.SNEAKERS_DB && window.SNEAKERS_DB[shoeId]) ? window.SNEAKERS_DB[shoeId] : null;
    if (!shoe && window.AetherDB && typeof window.AetherDB.getShoes === 'function') {
      try {
        const allShoes = await window.AetherDB.getShoes();
        shoe = allShoes.find(s => s.id === shoeId);
      } catch(e) {}
    }
    if (!shoe) return;

    this.activeShoeForModal = shoe;
    this.activeSizeUnit = localStorage.getItem('aether_size_unit') || 'EU';
    this.selectedEu = this.selectedEu || '42'; // Pre-selected Portugal grail size 42

    // Load inventory for active shoe from AetherDB
    this.activeModalInventory = [];
    if (window.AetherDB && typeof window.AetherDB.getInventory === 'function') {
      try {
        this.activeModalInventory = await window.AetherDB.getInventory(shoeId);
      } catch(e) {}
    }

    const initialEntry = window.findSizeEntry ? window.findSizeEntry(this.selectedEu, 'eu') : { eu: '42', us: '8.5' };
    this.selectedSize = `EU ${initialEntry.eu} (US ${initialEntry.us})`;
    this.selectedCondition = 'deadstock';

    const modal = document.getElementById('buy-modal');
    if (!modal) return;

    // Populate modal info
    const priceVal = shoe.vault_price !== undefined ? shoe.vault_price : (shoe.price || 400);
    const retailVal = shoe.retail_price !== undefined ? shoe.retail_price : (shoe.retailPrice || 180);
    const nameVal = shoe.name || 'Air Jordan 1 Retro High OG';
    const colorwayVal = shoe.colorway || 'Grail Edition';
    const styleVal = shoe.styleCode || shoe.style_code || '555088-000';
    const yearVal = shoe.year || '2026';
    const imgVal = shoe.image_url || shoe.image || 'assets/images/jordan-chicago.png';
    const storyVal = shoe.story || 'Physical authentication verified across 14 checkpoints.';

    const titleEl = document.getElementById('modal-shoe-title');
    if (titleEl) titleEl.textContent = nameVal;
    const colorEl = document.getElementById('modal-shoe-colorway');
    if (colorEl) colorEl.textContent = colorwayVal;
    const styleEl = document.getElementById('modal-shoe-style');
    if (styleEl) styleEl.textContent = `Style: ${styleVal} • ${yearVal}`;
    const priceEl = document.getElementById('modal-shoe-price');
    if (priceEl) priceEl.textContent = `$${priceVal}`;
    const retailEl = document.getElementById('modal-shoe-retail');
    if (retailEl) retailEl.textContent = `Est. Retail $${retailVal}`;
    const imgEl = document.getElementById('modal-shoe-img');
    if (imgEl) {
      imgEl.src = imgVal;
      imgEl.alt = nameVal;
    }
    const storyEl = document.getElementById('modal-shoe-story');
    if (storyEl) storyEl.textContent = storyVal;

    // Setup Unit Switcher in Modal
    const unitSwitcher = document.getElementById('modal-unit-switcher');
    if (unitSwitcher) {
      unitSwitcher.querySelectorAll('.unit-toggle-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === this.activeSizeUnit);
        btn.onclick = (e) => {
          e.preventDefault();
          this.activeSizeUnit = btn.dataset.unit;
          unitSwitcher.querySelectorAll('.unit-toggle-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          localStorage.setItem('aether_size_unit', this.activeSizeUnit);
          if (typeof window.setGlobalStoreUnit === 'function') {
            window.setGlobalStoreUnit(this.activeSizeUnit);
          } else {
            this.renderModalSizes();
          }
          if (window.soundEngine) window.soundEngine.playClick();
        };
      });
    }

    // Render sizes with live stock correlation
    this.renderModalSizes();

    // Sync modal wishlist button
    const modalWishlistBtn = document.getElementById('modal-wishlist-btn');
    if (modalWishlistBtn) {
      modalWishlistBtn.setAttribute('data-wishlist-id', shoeId);
      if (window.wishlistManager) {
        window.wishlistManager.syncHeartButtons();
      }
    }

    // Theme modal glow
    const themeVal = shoe.theme_color || shoe.theme || '#dc2626';
    const glowVal = shoe.glow_color || shoe.glow || 'rgba(220, 38, 38, 0.4)';
    modal.style.setProperty('--modal-accent', themeVal);
    modal.style.setProperty('--modal-glow', glowVal);

    modal.classList.add('active');
    document.getElementById('modal-backdrop').classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.soundEngine) window.soundEngine.playSwoosh();
  }

  renderModalSizes() {
    const sizeContainer = document.getElementById('modal-sizes-grid') || document.getElementById('modal-size-grid');
    if (!sizeContainer || !this.activeShoeForModal) return;
    sizeContainer.innerHTML = '';

    // Standard list of sizes (EU 38 to 46)
    const standardSizes = ['38', '38.5', '39', '40', '40.5', '41', '42', '42.5', '43', '44', '45', '46'];
    const sizesList = (this.activeShoeForModal.sizes && this.activeShoeForModal.sizes.length > 0)
      ? this.activeShoeForModal.sizes
      : standardSizes;

    // Create lookup map for inventory stock
    const invMap = new Map();
    if (Array.isArray(this.activeModalInventory)) {
      this.activeModalInventory.forEach(item => {
        invMap.set(String(item.size_eu), parseInt(item.quantity, 10) || 0);
      });
    }

    // Check if the selected size is in stock
    const currentSelectedStock = invMap.has(String(this.selectedEu))
      ? invMap.get(String(this.selectedEu))
      : (invMap.size > 0 ? 0 : 5);

    // If current selected size has 0 stock, see if we should auto-select the first in-stock size
    if (currentSelectedStock === 0 && invMap.size > 0) {
      const firstInStock = sizesList.find(sz => (invMap.get(String(sz)) || 0) > 0);
      if (firstInStock) {
        this.selectedEu = firstInStock;
        const entry = window.findSizeEntry ? window.findSizeEntry(firstInStock, 'eu') : { eu: firstInStock, us: '8.5' };
        this.selectedSize = `EU ${entry.eu} (US ${entry.us})`;
      }
    }

    let selectedSizeInStock = true;

    sizesList.forEach((sz) => {
      const entry = window.findSizeEntry ? window.findSizeEntry(sz, 'eu') : { eu: sz, us: '8.5', uk: '7.5', cm: '26.5' };
      const isSelected = String(entry.eu) === String(this.selectedEu);
      const stock = invMap.has(String(sz)) ? invMap.get(String(sz)) : (invMap.size > 0 ? 0 : 5);
      const isOutOfStock = stock === 0 && invMap.size > 0;

      if (isSelected && isOutOfStock) {
        selectedSizeInStock = false;
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `size-pill size-pill-btn ${isSelected ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock disabled' : ''}`;
      if (isOutOfStock) {
        btn.setAttribute('title', 'Esgotado / Out of Stock');
      }

      let mainVal = '';
      let subVal = '';
      if (this.activeSizeUnit === 'EU') {
        mainVal = isOutOfStock ? `${entry.eu} (0)` : `${entry.eu} (${stock} left)`;
        subVal = isOutOfStock ? 'Esgotado / Out of Stock' : `US ${entry.us} • ${entry.cm}cm`;
      } else if (this.activeSizeUnit === 'US') {
        mainVal = isOutOfStock ? `US ${entry.us} (0)` : `US ${entry.us} (${stock} left)`;
        subVal = isOutOfStock ? 'Out of Stock' : `EU ${entry.eu} • UK ${entry.uk}`;
      } else if (this.activeSizeUnit === 'UK') {
        mainVal = isOutOfStock ? `UK ${entry.uk} (0)` : `UK ${entry.uk} (${stock} left)`;
        subVal = isOutOfStock ? 'Out of Stock' : `EU ${entry.eu} • US ${entry.us}`;
      } else if (this.activeSizeUnit === 'CM') {
        mainVal = isOutOfStock ? `${entry.cm}cm (0)` : `${entry.cm} cm (${stock} left)`;
        subVal = isOutOfStock ? 'Out of Stock' : `EU ${entry.eu}`;
      }

      btn.innerHTML = `<span class="size-main">${mainVal}</span><small class="size-sub">${subVal}</small>`;

      btn.addEventListener('click', () => {
        this.selectedEu = entry.eu;
        this.selectedSize = `EU ${entry.eu} (US ${entry.us})`;
        sizeContainer.querySelectorAll('.size-pill-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        const callout = document.getElementById('modal-selected-size-callout');
        if (callout) {
          callout.textContent = `Selected: EU ${entry.eu} (US ${entry.us}) • ${stock > 0 ? stock + ' pairs in vault' : 'Esgotado'}`;
        }

        // Toggle Add to Bag button disabled state
        this.updateModalAddButtonState(!isOutOfStock);

        if (window.soundEngine) window.soundEngine.playClick();
      });

      sizeContainer.appendChild(btn);
    });

    const callout = document.getElementById('modal-selected-size-callout');
    if (callout) {
      const activeEntry = window.findSizeEntry ? window.findSizeEntry(this.selectedEu, 'eu') : { eu: '42', us: '8.5' };
      const curStock = invMap.has(String(this.selectedEu)) ? invMap.get(String(this.selectedEu)) : (invMap.size > 0 ? 0 : 5);
      callout.textContent = `Selected: EU ${activeEntry.eu} (US ${activeEntry.us}) • ${curStock > 0 ? curStock + ' in vault' : 'Esgotado'}`;
    }

    this.updateModalAddButtonState(selectedSizeInStock);
  }

  updateModalAddButtonState(isInStock) {
    const addBagBtns = document.querySelectorAll('#buy-modal .btn-primary, #modal-btn-add-bag');
    addBagBtns.forEach(btn => {
      if (!isInStock) {
        btn.disabled = true;
        btn.style.opacity = '0.45';
        btn.style.cursor = 'not-allowed';
        btn.innerHTML = '<span>Esgotado / Out of Stock</span>';
      } else {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.innerHTML = '<span data-i18n="add_to_bag">Add Pair to Bag</span>';
      }
    });
  }

  async refreshModalStock() {
    const modal = document.getElementById('buy-modal');
    if (!modal || !modal.classList.contains('active') || !this.activeShoeForModal) return;
    if (window.AetherDB && typeof window.AetherDB.getInventory === 'function') {
      try {
        this.activeModalInventory = await window.AetherDB.getInventory(this.activeShoeForModal.id);
        this.renderModalSizes();
      } catch(e) {}
    }
  }

  closeBuyModal() {
    const modal = document.getElementById('buy-modal');
    const backdrop = document.getElementById('modal-backdrop');
    if (modal && backdrop) {
      modal.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      if (window.soundEngine) window.soundEngine.playClick();
    }
  }

  addCurrentModalItem() {
    if (!this.activeShoeForModal) return;
    // Verify real-time stock
    if (Array.isArray(this.activeModalInventory) && this.activeModalInventory.length > 0) {
      const match = this.activeModalInventory.find(i => String(i.size_eu) === String(this.selectedEu));
      if (match && match.quantity <= 0) {
        if (typeof showToast === 'function') showToast('⚡ Tamanho esgotado no cofre! / Size currently out of stock.');
        return;
      }
    }
    const size = this.selectedSize || 'EU 42 (US 8.5)';
    this.addItem(this.activeShoeForModal.id, size, 'deadstock');
    this.closeBuyModal();
  }

  openCheckoutModal() {
    if (this.items.length === 0) {
      showToast('Your bag is empty! Add a grail to checkout.');
      return;
    }
    this.closeCart();
    const modal = document.getElementById('checkout-modal');
    const backdrop = document.getElementById('checkout-backdrop');
    if (modal && backdrop) {
      // populate summary
      const sub = this.getSubtotal();
      const tot = this.getTotal();
      document.getElementById('chk-subtotal').textContent = `$${sub.toFixed(2)}`;
      document.getElementById('chk-discount').textContent = `-$${(sub - tot).toFixed(2)}`;
      document.getElementById('chk-total').textContent = `$${tot.toFixed(2)}`;

      modal.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.soundEngine) window.soundEngine.playSwoosh();
    }
  }

  closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    const backdrop = document.getElementById('checkout-backdrop');
    if (modal && backdrop) {
      modal.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      if (window.soundEngine) window.soundEngine.playClick();
    }
  }

  processOrder() {
    const btn = document.getElementById('btn-confirm-order');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-inline"></span> Encrypting & Securing Pair...`;
    }

    if (window.soundEngine) window.soundEngine.playSwoosh();

    const activeItems = (this.items && this.items.length > 0) ? this.items.slice() : [];
    const subtotal = this.getSubtotal();
    const total = this.getTotal();
    const discount = subtotal * (this.discountPercent || 0);

    let buyerName = 'Marcus Collector';
    let buyerEmail = 'collector@aetherkicks.com';
    let shippingAddr = '23 Championship Blvd, Suite 1985, Chicago, IL 60601';

    try {
      const storedProfile = localStorage.getItem('aether_profile') || localStorage.getItem('aether_user');
      if (storedProfile) {
        const p = JSON.parse(storedProfile);
        if (p.name) buyerName = p.name;
        if (p.email) buyerEmail = p.email;
        if (p.address) shippingAddr = `${p.address}, ${p.postal || p.postal_code || ''} ${p.city || 'Lisboa'}, ${p.country || 'Portugal'}`;
      }
    } catch (e) {}

    const orderNum = 'AK-' + Math.floor(100000 + Math.random() * 900000);
    const trackingCode = 'AETH-PT-' + Math.floor(100000 + Math.random() * 900000);
    const nfcToken = '0x' + Math.random().toString(16).substr(2, 8).toUpperCase() + Math.random().toString(16).substr(2, 8).toUpperCase();

    const orderRecord = {
      id: orderNum,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      created_at: new Date().toISOString(),
      customer_name: buyerName,
      customer_email: buyerEmail,
      collector: buyerName,
      email: buyerEmail,
      tier: 'VIP Vault Member',
      shipping_address: shippingAddr,
      destination: shippingAddr,
      payment_method: 'Apple Pay / Vault Express',
      promo_code: this.promoCodeApplied || null,
      subtotal: subtotal,
      discount: discount,
      total: total,
      price: total,
      status: 'pending_verification',
      tracking_number: trackingCode,
      tracking: trackingCode,
      nfc_certificate_id: nfcToken,
      nfcHash: nfcToken,
      items: activeItems.map(it => ({
        shoe_id: it.id,
        shoe_name: it.name,
        shoeName: it.name,
        colorway: it.colorway,
        size_eu: it.size ? String(it.size).replace(/[^0-9.]/g, '') : '42',
        size_us: '8.5',
        size: it.size,
        unit_price: it.price,
        price: it.price,
        quantity: it.quantity,
        image: it.image
      }))
    };

    // Save order into localStorage
    try {
      const rawOrders = localStorage.getItem('aether_orders');
      const ordersList = rawOrders ? JSON.parse(rawOrders) : [];
      ordersList.unshift(orderRecord);
      localStorage.setItem('aether_orders', JSON.stringify(ordersList));
    } catch (e) {}

    // Save order into AetherDB relational engine
    if (window.AetherDB && typeof window.AetherDB.addOrder === 'function') {
      window.AetherDB.addOrder(orderRecord).catch(err => console.warn('[Cart] AetherDB order add warning:', err));
    }

    setTimeout(() => {
      this.items = [];
      this.saveCart();

      const modal = document.getElementById('checkout-modal');
      if (modal) {
        modal.innerHTML = `
          <div class="checkout-success-pane">
            <div class="success-icon-wrap">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2>Grail Secured!</h2>
            <p class="order-code">Order Number: <strong>${orderNum}</strong></p>
            <p class="order-note">100% Verified Deadstock. Your pair has been locked in vault custody and is queued for authenticated 2-Day Air Express dispatch.</p>
            <div class="tamper-seal-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>NFC Cryptographic Anti-Counterfeit Seal Active: <strong>${trackingCode}</strong></span>
            </div>
            <button class="btn-primary" onclick="window.cartManager.closeCheckoutModal(); window.location.reload();">
              Back to Showroom
            </button>
          </div>
        `;
      }

      if (window.soundEngine) window.soundEngine.playSuccess();
      launchConfetti();
    }, 1400);
  }

  exploreShowcase() {
    this.closeCart();
    const isStorefront = !!(document.getElementById('section-chicago') || document.getElementById('square-grid-vault'));
    if (isStorefront) {
      if (typeof window.setCatalogLayout === 'function') {
        window.setCatalogLayout('runway');
      }
      const target = document.getElementById('section-chicago') || document.getElementById('square-grid-vault');
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    } else {
      window.location.href = 'index.html#section-chicago';
    }
    if (window.soundEngine) window.soundEngine.playClick();
  }

  renderCartItems() {
    const list = document.getElementById('cart-items-list');
    if (!list) return;

    if (this.items.length === 0) {
      list.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-icon">👟</div>
          <h4 data-i18n="cart_empty_title">Your bag is currently empty</h4>
          <p data-i18n="cart_empty_desc">Explore the color runway and lock down your preferred grail.</p>
          <button class="btn-secondary" onclick="window.cartManager.exploreShowcase();" data-i18n="cart_explore_showcase">Explore Showcase</button>
        </div>
      `;
      document.getElementById('cart-subtotal').textContent = '$0.00';
      document.getElementById('cart-total').textContent = '$0.00';
      if (window.i18n && typeof window.i18n.translateElement === 'function') {
        window.i18n.translateElement(list);
      }
      return;
    }

    const esc = (typeof window !== 'undefined' && window.escapeHTML) ? window.escapeHTML : (s => s);
    list.innerHTML = this.items.map((item, idx) => `
      <div class="cart-item-card">
        <div class="cart-item-thumb">
          <img src="${esc(item.image)}" alt="${esc(item.colorway)}" />
        </div>
        <div class="cart-item-info">
          <h5 class="cart-item-name">${esc(item.name)}</h5>
          <p class="cart-item-colorway" style="color: ${esc(item.theme)};">${esc(item.colorway)}</p>
          <div class="cart-item-specs">
            <span class="badge-pill">${esc(item.size)}</span>
            <span class="badge-pill">${item.condition === 'deadstock' ? 'DS New' : 'Collector'}</span>
          </div>
          <div class="cart-item-bottom">
            <span class="cart-item-price">$${Number(item.price * item.quantity)}</span>
            <div class="cart-item-qty">
              <button onclick="window.cartManager.updateQuantity(${idx}, -1)">-</button>
              <span>${Number(item.quantity)}</span>
              <button onclick="window.cartManager.updateQuantity(${idx}, 1)">+</button>
            </div>
            <button class="btn-remove-item" onclick="window.cartManager.removeItem(${idx})" title="Remove">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    const sub = this.getSubtotal();
    const tot = this.getTotal();
    document.getElementById('cart-subtotal').textContent = `$${sub.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${tot.toFixed(2)}`;

    const discountRow = document.getElementById('cart-discount-row');
    if (discountRow) {
      if (this.discountPercent > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('cart-discount-val').textContent = `-$${(sub * this.discountPercent).toFixed(2)} (20% OFF)`;
      } else {
        discountRow.style.display = 'none';
      }
    }
  }

  initDOM() {
    this.updateCartBadge();
  }
}

// Global Toast System
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-dot" style="width: 8px; height: 8px; border-radius: 50%; background: var(--theme-primary); display: inline-block;"></span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Celebration Confetti
function launchConfetti() {
  const count = 75;
  const colors = ['#dc2626', '#9333ea', '#0284c7', '#16a34a', '#ea580c', '#ffffff', '#ffd700'];
  
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '-20px';
    el.style.width = Math.random() * 8 + 6 + 'px';
    el.style.height = Math.random() * 14 + 8 + 'px';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.zIndex = '999999';
    el.style.pointerEvents = 'none';
    el.style.borderRadius = '2px';
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(el);

    const fallDuration = Math.random() * 2.5 + 1.8;
    const sway = (Math.random() - 0.5) * 200;

    el.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${sway}px, 105vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], {
      duration: fallDuration * 1000,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }).onfinish = () => el.remove();
  }
}

// Listen for real-time database updates to refresh modal stock
window.addEventListener('aether:db:updated', () => {
  if (window.cartManager && typeof window.cartManager.refreshModalStock === 'function') {
    window.cartManager.refreshModalStock();
  }
});


window.cartManager = new CartManager();
window.showToast = showToast;
