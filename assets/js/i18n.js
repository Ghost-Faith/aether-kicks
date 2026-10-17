/**
 * AETHER KICKS - High-Performance Luxury Internationalization (i18n) Engine
 * Seamlessly manages Portuguese (PT) & English (EN) translations across all pages
 * Persists user preference via localStorage and updates the DOM with zero page reloads
 */

(function () {
  'use strict';

  var translations = {
    pt: {
      // Navigation
      nav_runway: 'Passarela',
      nav_grid: 'Grade',
      nav_lab: 'Bespoke Lab',
      nav_drops: 'Drops',
      nav_analytics: 'Estatísticas',
      nav_about: 'Sobre Nós',
      nav_audio: 'ÁUDIO',
      nav_wishlist: 'WISHLIST',
      nav_bag: 'SACO',
      nav_profile: 'Perfil',
      nav_signin: 'Iniciar Sessão',
      nav_join_vault: 'Juntar ao Vault',
      nav_menu_title: 'Menu do Arquivo',
      presentation_mode: 'Modo de Apresentação',
      
      // Hamburger Menu Links
      menu_01: 'Arquivo Passarela',
      menu_02: 'O Cofre de Grails',
      menu_03: 'Laboratório Bespoke',
      menu_04: 'Lançamentos Ao Vivo',
      menu_05: 'Análise de Mercado',
      menu_06: 'Sobre Nós',
      menu_07: 'A Tua Wishlist',
      menu_08: 'Perfil de Colecionador',
      menu_09: 'Verificação NFC',
      menu_footer_auth: 'ARQUIVO SNEAKERHEAD AUTENTICADO © 2026',

      // Bag / Cart Drawer
      cart_title: 'Saco de Colecionador',
      cart_empty_title: 'O teu saco está atualmente vazio',
      cart_empty_desc: 'Explora a passarela e assegura o teu grail favorito.',
      cart_explore_showcase: 'Explorar Coleção',
      cart_subtotal: 'Subtotal',
      cart_shipping: 'Envio Expresso Assegurado',
      cart_shipping_free: 'Gratuito',
      cart_total: 'Total Estimado',
      cart_checkout: 'Avançar para Checkout',
      cart_promo_placeholder: 'Código Promo (ex: GRAIL20)',
      cart_promo_apply: 'Aplicar',

      // Product / Showcase / Catalog
      ask_price: 'PREÇO DE PEDIDO',
      in_stock: 'EM STOCK',
      instant_buy: 'Comprar Já',
      add_to_bag: 'Adicionar ao Saco',
      view_runway: 'Ver Passarela',
      deadstock_badge: 'ARQUIVO DEADSTOCK',
      catalog_title: 'O COFRE DE GRAILS',
      catalog_desc: 'Explora a linhagem autenticada em formato de grade ou volta à passarela imersiva a qualquer momento.',
      turntable_auto: 'Auto 360°',
      turntable_pause: 'Pausar 360°',
      turntable_side: 'Lateral',
      turntable_34: 'Vista 3/4',
      turntable_aerial: 'Aérea',
      turntable_heel: 'Calcanhar',
      turntable_sole: 'Sola',

      // Bespoke Lab & Studio
      lab_title: 'LABORATÓRIO BESPOKE',
      lab_desc: 'Personaliza painéis de couro em 3D em tempo real ou visualiza esquemas técnicos.',
      lab_mode_studio: 'Estúdio 3D',
      lab_mode_blueprint: 'Esquema Técnico',

      // Drops & Analytics
      drops_title: 'LANÇAMENTOS DO VAULT',
      analytics_title: 'ÍNDICE DE VALORIZAÇÃO',

      // NFC Verification
      nfc_title: 'Verificação de Chip Físico NFC',
      nfc_desc: 'Aproxima o leitor ou smartphone da etiqueta criptográfica da língua.',

      // Profile & Wishlist
      profile_title: 'Perfil de Colecionador & Estado do Vault',
      wishlist_title: 'A Tua Wishlist Autenticada',
      wishlist_hero_badge: 'COFRE PESSOAL DE SNEAKERS · LISTA DE GRAILS',
      wishlist_hero_title: 'A Tua Wishlist de Grails',
      wishlist_hero_desc: 'Os pares mais cobiçados do mundo preservados no teu radar. Reserva, compra instantaneamente ou personaliza no nosso Atelier Bespoke.',
      profile_hero_badge: 'CENTRO DE GESTÃO DO COLECIONADOR · LISBON ATELIER',
      profile_hero_title: 'Configurações do Perfil',
      profile_hero_desc: 'Gere os teus dados de envio em Portugal, tamanho de calçado padrão, morada para entregas prioritárias e histórico de encomendas autenticadas.',

      // About Page
      about_hero_badge: 'ARQUIVO HISTÓRICO & ATELIER BESPOKE · EST. 2026',
      about_hero_title: 'O Manifesto AETHER KICKS',
      about_hero_desc: 'Onde o artesanato de sapataria de alta precisão se cruza com a validação forense e a preservação deadstock.',

      // Auth (Login & Register)
      auth_chicago_badge: 'ACESSO CHICAGO RETRO 1985',
      auth_purple_badge: 'REGISTO COURT PURPLE 2020',
      login_title: 'Bem-vindo de Volta',
      login_subtitle: 'Inicia sessão para desbloquear lançamentos exclusivos, licitações privadas e grails autenticados.',
      login_email_label: 'Email ou Tag do Colecionador',
      login_password_label: 'Palavra-passe',
      login_remember_me: 'Lembrar sessão neste dispositivo',
      login_submit_btn: 'Aceder ao Cofre Privado',
      login_no_account: 'Novo colecionador no arquivo?',
      login_register_link: 'Criar Registo Deadstock →',
      register_title: 'Junta-te ao Arquivo',
      register_subtitle: 'Cria a tua identidade de colecionador para garantir alocação prioritária e lançamentos privados.',
      register_fullname_label: 'Nome Completo do Colecionador',
      register_email_label: 'Endereço de Email Oficial',
      register_password_label: 'Criar Palavra-passe',
      register_size_label: 'Tamanho Preferido de Calçado',
      register_terms_label: 'Concordo com os Termos de Autenticação Forense e Regras do Cofre',
      register_submit_btn: 'Criar Conta de Colecionador',
      register_already_registered: 'Já estás registado no cofre?',
      register_login_link: 'Iniciar Sessão Aqui →',
      back_storefront: 'Voltar à Loja'
    },
    en: {
      // Navigation
      nav_runway: 'Runway',
      nav_grid: 'Grid',
      nav_lab: 'Bespoke Lab',
      nav_drops: 'Drops',
      nav_analytics: 'Analytics',
      nav_about: 'About Us',
      nav_audio: 'AUDIO',
      nav_wishlist: 'WISHLIST',
      nav_bag: 'BAG',
      nav_profile: 'Profile',
      nav_signin: 'Sign In',
      nav_join_vault: 'Join Vault',
      nav_menu_title: 'Archive Menu',
      presentation_mode: 'Presentation Mode',

      // Hamburger Menu Links
      menu_01: 'Runway Archive',
      menu_02: 'The Grail Vault',
      menu_03: 'Bespoke Lab',
      menu_04: 'Live Drops',
      menu_05: 'Market Analytics',
      menu_06: 'About Us',
      menu_07: 'Your Wishlist',
      menu_08: 'Collector Profile',
      menu_09: 'NFC Verification',
      menu_footer_auth: 'AUTHENTICATED SNEAKERHEAD ARCHIVE © 2026',

      // Bag / Cart Drawer
      cart_title: 'Collector Bag',
      cart_empty_title: 'Your bag is currently empty',
      cart_empty_desc: 'Explore the color runway and lock down your preferred grail.',
      cart_explore_showcase: 'Explore Showcase',
      cart_subtotal: 'Subtotal',
      cart_shipping: 'Insured Express Delivery',
      cart_shipping_free: 'Complimentary',
      cart_total: 'Estimated Total',
      cart_checkout: 'Proceed to Checkout',
      cart_promo_placeholder: 'Promo Code (e.g. GRAIL20)',
      cart_promo_apply: 'Apply',

      // Product / Showcase / Catalog
      ask_price: 'ASK PRICE',
      in_stock: 'IN STOCK',
      instant_buy: 'Instant Buy',
      add_to_bag: 'Add to Bag',
      view_runway: 'View Runway',
      deadstock_badge: 'DEADSTOCK ARCHIVE',
      catalog_title: 'THE GRAIL VAULT',
      catalog_desc: 'Explore our authenticated high-top lineage in a clean square grid format or switch back to the immersive colorway runway anytime.',
      turntable_auto: 'Auto 360°',
      turntable_pause: 'Pause 360°',
      turntable_side: 'Side',
      turntable_34: '3/4 View',
      turntable_aerial: 'Aerial',
      turntable_heel: 'Heel',
      turntable_sole: 'Sole',

      // Bespoke Lab & Studio
      lab_title: 'BESPOKE COLOR LAB',
      lab_desc: 'Customize leather panels in real-time 3D or preview technical blueprints.',
      lab_mode_studio: '3D Studio',
      lab_mode_blueprint: 'Blueprint',

      // Drops & Analytics
      drops_title: 'LIVE VAULT DROPS',
      analytics_title: 'MARKET VALUATION INDEX',

      // NFC Verification
      nfc_title: 'Physical NFC Chip Verification',
      nfc_desc: 'Hold your phone or reader against the tongue crypto-tag.',

      // Profile & Wishlist
      profile_title: 'Collector Profile & Vault Status',
      wishlist_title: 'Your Authenticated Wishlist',
      wishlist_hero_badge: 'PERSONAL SNEAKER VAULT · GRAIL LIST',
      wishlist_hero_title: 'Your Grail Wishlist',
      wishlist_hero_desc: 'The world\'s most coveted pairs locked on your radar. Reserve, instantly purchase, or customize at our Bespoke Atelier.',
      profile_hero_badge: 'COLLECTOR MANAGEMENT CENTER · LISBON ATELIER',
      profile_hero_title: 'Profile Settings',
      profile_hero_desc: 'Manage your priority shipping details, standard shoe size, delivery address, and authenticated order history.',

      // About Page
      about_hero_badge: 'HISTORIC ARCHIVE & BESPOKE ATELIER · EST. 2026',
      about_hero_title: 'The AETHER KICKS Manifesto',
      about_hero_desc: 'Where high-precision footwear craftsmanship intersects forensic validation and deadstock preservation.',

      // Auth (Login & Register)
      auth_chicago_badge: 'CHICAGO RETRO 1985 ACCESS',
      auth_purple_badge: 'COURT PURPLE 2020 REGISTRATION',
      login_title: 'Welcome Back',
      login_subtitle: 'Sign in to unlock verified collector drops, private bidding, and guaranteed authentic grails.',
      login_email_label: 'Sneakerhead Email or Tag',
      login_password_label: 'Password',
      login_remember_me: 'Remember me on this device',
      login_submit_btn: 'Unlock Private Vault',
      login_no_account: 'New collector to the archive?',
      login_register_link: 'Create Deadstock Account →',
      register_title: 'Join The Archive',
      register_subtitle: 'Create your collector identity to secure priority allocation and private drops.',
      register_fullname_label: 'Collector Full Name',
      register_email_label: 'Official Email Address',
      register_password_label: 'Create Password',
      register_size_label: 'Preferred Shoe Size',
      register_terms_label: 'I agree to the Forensic Authentication Terms and Vault Protocol',
      register_submit_btn: 'Create Collector Account',
      register_already_registered: 'Already registered in the vault?',
      register_login_link: 'Sign In Here →',
      back_storefront: 'Back to Storefront'
    }
  };

  class I18nManager {
    constructor() {
      // Determine initial language from localStorage or default to 'pt'
      var stored = localStorage.getItem('aether_language');
      if (stored === 'en' || stored === 'pt') {
        this.currentLang = stored;
      } else {
        // Detect browser language if Portuguese, else default to Portuguese as requested
        var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        this.currentLang = browserLang.startsWith('en') ? 'en' : 'pt';
      }
    }

    init() {
      this.applyTranslations(this.currentLang);
      this.updateSwitcherUI();
    }

    t(key) {
      var dict = translations[this.currentLang] || translations.pt;
      return dict[key] || (translations.en[key] || key);
    }

    setLanguage(lang) {
      if (lang !== 'pt' && lang !== 'en') return;
      this.currentLang = lang;
      localStorage.setItem('aether_language', lang);
      document.documentElement.lang = lang;
      this.applyTranslations(lang);
      this.updateSwitcherUI();

      if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
        window.soundEngine.playClick();
      }

      // Re-render empty cart or modal if open
      if (window.cartManager && typeof window.cartManager.renderCartItems === 'function') {
        window.cartManager.renderCartItems();
      }
    }

    toggleLanguage() {
      var next = this.currentLang === 'pt' ? 'en' : 'pt';
      this.setLanguage(next);
      if (typeof window.showToast === 'function') {
        window.showToast(next === 'pt' ? 'Idioma: Português' : 'Language: English');
      }
    }

    updateSwitcherUI() {
      var btns = document.querySelectorAll('.btn-lang-toggle');
      var lang = this.currentLang;
      btns.forEach(function (btn) {
        var ptSpan = btn.querySelector('[data-lang="pt"]');
        var enSpan = btn.querySelector('[data-lang="en"]');
        if (ptSpan) ptSpan.classList.toggle('active', lang === 'pt');
        if (enSpan) enSpan.classList.toggle('active', lang === 'en');
        btn.setAttribute('aria-label', lang === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese');
        btn.setAttribute('title', lang === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese');
      });
    }

    translateElement(rootEl) {
      if (!rootEl) return;
      var dict = translations[this.currentLang] || translations.pt;

      var elements = rootEl.querySelectorAll('[data-i18n]');
      if (rootEl.hasAttribute && rootEl.hasAttribute('data-i18n')) {
        var key = rootEl.getAttribute('data-i18n');
        if (dict[key]) rootEl.textContent = dict[key];
      }

      elements.forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key]) {
          el.textContent = dict[key];
        }
      });

      var placeholders = rootEl.querySelectorAll('[data-i18n-placeholder]');
      placeholders.forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.placeholder = dict[key];
      });

      var titles = rootEl.querySelectorAll('[data-i18n-title]');
      titles.forEach(function (el) {
        var key = el.getAttribute('data-i18n-title');
        if (dict[key]) el.title = dict[key];
      });
    }

    applyTranslations(lang) {
      var dict = translations[lang] || translations.pt;
      document.documentElement.lang = lang;

      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key]) {
          el.textContent = dict[key];
        }
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
          el.placeholder = dict[key];
        }
      });

      document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-title');
        if (dict[key]) {
          el.title = dict[key];
        }
      });
    }
  }

  window.i18n = new I18nManager();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.i18n.init();
    });
  } else {
    window.i18n.init();
  }
})();
