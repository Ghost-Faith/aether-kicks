/**
 * AETHER KICKS - Wishlist Management System
 * LocalStorage sync, UI badges, responsive grid & interaction hooks
 */

class WishlistManager {
  constructor() {
    this.storageKey = 'aether_wishlist_items';
    this.items = this.loadWishlist();
    this.init();
  }

  loadWishlist() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse wishlist from localStorage', e);
    }
    // Default curated starter grails for pristine initial experience
    return ['chicago', 'orange'];
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Failed to save wishlist', e);
    }
    this.updateBadges();
    this.syncHeartButtons();
  }

  getItems() {
    return this.items;
  }

  has(shoeId) {
    return this.items.includes(shoeId);
  }

  toggle(shoeId) {
    const idx = this.items.indexOf(shoeId);
    const db = window.SNEAKERS_DB || {};
    const shoe = db[shoeId];
    const shoeName = shoe ? `${shoe.name} (${shoe.colorway})` : 'Sneaker Grail';

    if (idx > -1) {
      this.items.splice(idx, 1);
      this.saveWishlist();
      if (window.soundEngine) window.soundEngine.playClick();
      if (typeof showToast === 'function') {
        const isEn = window.i18n && window.i18n.currentLang === 'en';
        showToast(isEn ? `Removed from Wishlist: ${shoeName}` : `Removido da Wishlist: ${shoeName}`);
      }
    } else {
      this.items.unshift(shoeId);
      this.saveWishlist();
      if (window.soundEngine) window.soundEngine.playSuccess();
      if (typeof showToast === 'function') {
        const isEn = window.i18n && window.i18n.currentLang === 'en';
        showToast(isEn ? `❤️ Saved to Wishlist: ${shoeName}!` : `❤️ Guardado na Wishlist: ${shoeName}!`);
      }
    }

    if (document.getElementById('wishlist-grid')) {
      this.renderWishlistPage();
    }
  }

  remove(shoeId) {
    const idx = this.items.indexOf(shoeId);
    if (idx > -1) {
      this.items.splice(idx, 1);
      this.saveWishlist();
      if (window.soundEngine) window.soundEngine.playClick();
      if (document.getElementById('wishlist-grid')) {
        this.renderWishlistPage();
      }
      if (typeof showToast === 'function') {
        const isEn = window.i18n && window.i18n.currentLang === 'en';
        showToast(isEn ? 'Grail removed from Wishlist.' : 'Grail removido da Wishlist.');
      }
    }
  }

  moveToBag(shoeId) {
    if (window.cartManager) {
      window.cartManager.openBuyModal(shoeId);
    } else {
      window.location.href = `index.html#section-${shoeId}`;
    }
  }

  updateBadges() {
    const count = this.items.length;
    document.querySelectorAll('.wishlist-badge-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  syncHeartButtons() {
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      const id = btn.getAttribute('data-wishlist-id');
      const isSaved = this.has(id);
      btn.classList.toggle('active', isSaved);
      btn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
      btn.title = isSaved ? 'Remover da Wishlist' : 'Adicionar à Wishlist';
      
      const icon = btn.querySelector('svg');
      if (icon) {
        if (isSaved) {
          icon.setAttribute('fill', '#ef4444');
          icon.setAttribute('stroke', '#ef4444');
        } else {
          icon.setAttribute('fill', 'none');
          icon.setAttribute('stroke', 'currentColor');
        }
      }

      const textSpan = btn.querySelector('span');
      if (textSpan && btn.classList.contains('modal-btn-wishlist')) {
        textSpan.textContent = isSaved ? 'Saved' : 'Wishlist';
      }
    });
  }

  renderWishlistPage() {
    const grid = document.getElementById('wishlist-grid');
    const emptyState = document.getElementById('wishlist-empty-state');
    const countDisplay = document.getElementById('wishlist-total-count');

    if (!grid) return;

    const db = window.SNEAKERS_DB || {};
    const count = this.items.length;

    if (countDisplay) {
      var singleWord = window.i18n ? window.i18n.t('wishlist_saved_single') : 'Grail Guardado';
      var pluralWord = window.i18n ? window.i18n.t('wishlist_saved_plural') : 'Grails Guardados';
      countDisplay.textContent = `${count} ${count === 1 ? singleWord : pluralWord}`;
    }

    if (count === 0) {
      grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    grid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = this.items.map(shoeId => {
      const shoe = db[shoeId];
      if (!shoe) return '';

      return `
        <article class="wishlist-card" style="--card-theme: ${shoe.theme}; --card-glow: ${shoe.glow};">
          <div class="wishlist-card-thumb">
            <img src="${shoe.image}" alt="${shoe.name} ${shoe.colorway}" loading="lazy">
            <span class="badge-pill wishlist-card-badge" style="background: rgba(255,255,255,0.06); border-color: ${shoe.theme}; color: ${shoe.theme};">
              ${shoe.year || 'OG LINEAGE'}
            </span>
            <button class="wishlist-btn-remove" onclick="window.wishlistManager.remove('${shoe.id}')" title="Remover da Wishlist" data-i18n-title="wishlist_remove_title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="wishlist-card-body">
            <span class="wishlist-style-code">${shoe.styleCode}</span>
            <h3 class="wishlist-card-name">${shoe.name}</h3>
            <p class="wishlist-card-colorway" style="color: ${shoe.theme};">${shoe.colorway}</p>
            <p class="wishlist-card-story">${shoe.story || 'Autêntico grail verificado com chip NFC em câmara de conservação deadstock.'}</p>
          </div>

          <div class="wishlist-card-footer">
            <div class="wishlist-card-pricing">
              <span class="wishlist-price-label" data-i18n="badge_deadstock">DEADSTOCK VAULT</span>
              <span class="wishlist-price-val">$${shoe.price}</span>
            </div>

            <div class="wishlist-card-actions">
              <button class="btn-primary wishlist-btn-buy" style="background: linear-gradient(135deg, ${shoe.theme}, #09090b); box-shadow: 0 4px 16px ${shoe.glow};" onclick="window.wishlistManager.moveToBag('${shoe.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span data-i18n="buy_now">Buy Now</span>
              </button>
              <a href="index.html#customizer-lab" class="btn-secondary wishlist-btn-atelier" title="Personalizar no Atelier Bespoke">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <span data-i18n="nav_lab">Atelier</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    if (window.i18n && typeof window.i18n.translateElement === 'function') {
      window.i18n.translateElement(grid);
    }
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.updateBadges();
      this.syncHeartButtons();
      if (document.getElementById('wishlist-grid')) {
        this.renderWishlistPage();
      }

      // Delegate clicks for wishlist buttons
      document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-wishlist-id]');
        if (btn) {
          e.preventDefault();
          e.stopPropagation();
          const id = btn.getAttribute('data-wishlist-id');
          this.toggle(id);
        }
      });
    });

    window.addEventListener('aether:languageChange', () => {
      if (document.getElementById('wishlist-grid')) {
        this.renderWishlistPage();
      }
    });
  }
}

window.wishlistManager = new WishlistManager();
