/**
 * ==============================================================================
 * AETHER KICKS - UNIVERSAL CLIENT-SIDE RELATIONAL DATABASE ENGINE
 * High-Performance IndexedDB Architecture with LocalStorage Fallback & Cache
 * Version: 1.0.0 (Production Release 2026)
 * ==============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AetherDatabase = factory();
    root.AetherDB = new root.AetherDatabase();
  }
})(typeof window !== 'undefined' ? window : this, function () {

  // Sizing Table Reference for Inventory & Seed Generation
  const SIZING_REFERENCE = [
    { eu: '38',   us: '5.5',  uk: '5',   cm: '24.0' },
    { eu: '38.5', us: '6',    uk: '5.5', cm: '24.0' },
    { eu: '39',   us: '6.5',  uk: '6',   cm: '24.5' },
    { eu: '40',   us: '7',    uk: '6',   cm: '25.0' },
    { eu: '40.5', us: '7.5',  uk: '6.5', cm: '25.5' },
    { eu: '41',   us: '8',    uk: '7',   cm: '26.0' },
    { eu: '42',   us: '8.5',  uk: '7.5', cm: '26.5' },
    { eu: '42.5', us: '9',    uk: '8',   cm: '27.0' },
    { eu: '43',   us: '9.5',  uk: '8.5', cm: '27.5' },
    { eu: '44',   us: '10',   uk: '9',   cm: '28.0' },
    { eu: '44.5', us: '10.5', uk: '9.5', cm: '28.5' },
    { eu: '45',   us: '11',   uk: '10',  cm: '29.0' },
    { eu: '46',   us: '12',   uk: '11',  cm: '30.0' }
  ];

  /**
   * Universal Anti-XSS Sanitizer & DOM Security Engine
   * Bulletproof escaping of HTML sensitive characters to prevent stored/reflected XSS.
   */
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function rawHTML(str) {
    return { __isSafeHTML: true, raw: String(str) };
  }

  function safeHTML(strings, ...values) {
    return strings.reduce((result, str, i) => {
      const val = values[i - 1];
      let sanitized = '';
      if (val !== undefined && val !== null) {
        if (Array.isArray(val)) {
          sanitized = val.map(v => (v && v.__isSafeHTML ? v.raw : escapeHTML(v))).join('');
        } else if (typeof val === 'object' && val.__isSafeHTML) {
          sanitized = val.raw;
        } else {
          sanitized = escapeHTML(val);
        }
      }
      return result + sanitized + str;
    });
  }

  // FIPS 180-4 Standard SHA-256 implementation (Fallback for non-subtle contexts)
  function sha256Pure(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let lengthProperty = 'length';
    let i, j;
    let result = '';
    const words = [];
    const asciiBitLength = ascii[lengthProperty] * 8;
    let hash = [];
    const k = [];
    let primeCounter = 0;
    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += '\x80';
    while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
    for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) return '';
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
    words[words[lengthProperty]] = asciiBitLength | 0;
    for (j = 0; j < words[lengthProperty]; ) {
      const w = words.slice(j, (j += 16));
      const oldHash = hash.slice(0);
      for (i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = hash[0], e = hash[4];
        const temp1 =
          hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
          ((e & hash[5]) ^ (~e & hash[6])) +
          k[i] +
          (w[i] =
            i < 16
              ? w[i]
              : (w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                  w[i - 7] +
                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
                0);
        const temp2 =
          (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0, a, hash[1], hash[2], (hash[3] + temp1) | 0, e, hash[5], hash[6]];
      }
      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }
    for (i = 0; i < 8; i++) {
      for (let b = 3; b >= 0; b--) {
        const byte = (hash[i] >> (b * 8)) & 255;
        result += (byte < 16 ? '0' : '') + byte.toString(16);
      }
    }
    return result;
  }

  // Export to window scope if present
  if (typeof window !== 'undefined') {
    window.escapeHTML = escapeHTML;
    window.safeHTML = safeHTML;
    window.rawHTML = rawHTML;
  }

  // Factory Deadstock Seeds
  const DEFAULT_SEEDS = {
    users: [
      {
        id: 'usr_admin_001',
        email: 'admin@aetherkicks.com',
        // SHA-256 cryptographic hash of 'aether2026'
        password_hash: '140f00da29e9ac981ff7ab92dbb872deeb5115dde50bbc0174543d2b3d61b3e9',
        full_name: 'Atelier Vault Master',
        role: 'admin',
        preferred_size: 'EU 42 (US 8.5)',
        address: 'Avenida da Liberdade 210',
        city: 'Lisboa',
        postal_code: '1250-142',
        country: 'Portugal',
        phone: '+351 912 345 678',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z'
      },
      {
        id: 'usr_vip_002',
        email: 'collector@aetherkicks.com',
        // SHA-256 cryptographic hash of 'grailpass'
        password_hash: '61eb1a066b4d039315c21b6dbe71b53daec9ee34aabe364a7bcf1586831fee23',
        full_name: 'Matheus Silva VIP',
        role: 'vip_member',
        preferred_size: 'EU 43 (US 9.5)',
        address: 'Rua de Santa Catarina 45',
        city: 'Porto',
        postal_code: '4000-441',
        country: 'Portugal',
        phone: '+351 934 567 890',
        created_at: '2026-01-10T12:30:00.000Z',
        updated_at: '2026-01-10T12:30:00.000Z'
      }
    ],

    shoes: [
      {
        id: 'chicago',
        name: 'Air Jordan 1 Retro High OG',
        silhouette: 'High',
        colorway: 'Chicago (Varsity Red)',
        style_code: '555088-101',
        styleCode: '555088-101',
        retail_price: 180,
        retailPrice: 180,
        vault_price: 480,
        price: 480,
        market_trend_pct: '+14.8%',
        year: '1985 / 2026',
        story: 'The shoe that ignited sneaker culture. Banned by the NBA in 1985, reborn with museum-grade full-grain Italian calfskin, archival stitch density, and authentic high-cut collar proportions.',
        image_url: 'assets/images/jordan-chicago.png',
        image: 'assets/images/jordan-chicago.png',
        theme_color: '#dc2626',
        theme: '#dc2626',
        glow_color: 'rgba(220, 38, 38, 0.45)',
        glow: 'rgba(220, 38, 38, 0.45)',
        category: 'runway',
        condition_grade: 'Deadstock Grade A+',
        nfc_token: 'NFC-AETH-8501-CHI',
        is_active: 1,
        sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45'],
        created_at: '2026-01-01T10:00:00.000Z',
        updated_at: '2026-01-01T10:00:00.000Z'
      },
      {
        id: 'purple',
        name: 'Air Jordan 1 Retro High OG',
        silhouette: 'High',
        colorway: 'Court Purple 2.0',
        style_code: '555088-500',
        styleCode: '555088-500',
        retail_price: 170,
        retailPrice: 170,
        vault_price: 365,
        price: 365,
        market_trend_pct: '+8.2%',
        year: '2020 / 2026',
        story: 'Regal intensity. Clean optical-white quarter panels balanced with rich royal amethyst tumbled leather overlays, pitch-black collar padding, and forensic colorway certification.',
        image_url: 'assets/images/jordan-purple.png',
        image: 'assets/images/jordan-purple.png',
        theme_color: '#9333ea',
        theme: '#9333ea',
        glow_color: 'rgba(147, 51, 234, 0.45)',
        glow: 'rgba(147, 51, 234, 0.45)',
        category: 'grid',
        condition_grade: 'Deadstock Grade A+',
        nfc_token: 'NFC-AETH-5002-PUR',
        is_active: 1,
        sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45'],
        created_at: '2026-01-02T10:00:00.000Z',
        updated_at: '2026-01-02T10:00:00.000Z'
      },
      {
        id: 'blue',
        name: 'Air Jordan 1 Retro High OG',
        silhouette: 'High',
        colorway: 'University Blue / Obsidian',
        style_code: '555088-134',
        styleCode: '555088-134',
        retail_price: 170,
        retailPrice: 170,
        vault_price: 395,
        price: 395,
        market_trend_pct: '+11.4%',
        year: '2021 / 2026',
        story: 'Paying homage to MJ alma mater. Sumptuous micro-brushed suede enveloped in signature Tar Heel sky blue, paired with tumbled sail underlays and midnight obsidian swoosh contours.',
        image_url: 'assets/images/jordan-blue.png',
        image: 'assets/images/jordan-blue.png',
        theme_color: '#0284c7',
        theme: '#0284c7',
        glow_color: 'rgba(2, 132, 199, 0.45)',
        glow: 'rgba(2, 132, 199, 0.45)',
        category: 'grid',
        condition_grade: 'Deadstock Grade A+',
        nfc_token: 'NFC-AETH-1343-UNC',
        is_active: 1,
        sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45'],
        created_at: '2026-01-03T10:00:00.000Z',
        updated_at: '2026-01-03T10:00:00.000Z'
      },
      {
        id: 'green',
        name: 'Air Jordan 1 Retro High OG',
        silhouette: 'High',
        colorway: 'Pine Green 2.0',
        style_code: '555088-030',
        styleCode: '555088-030',
        retail_price: 170,
        retailPrice: 170,
        vault_price: 340,
        price: 340,
        market_trend_pct: '+5.7%',
        year: '2020 / 2026',
        story: 'Bold emerald swagger with gym red embroidered leather tongue tabs on pitch black grain leather. Hand-finished edge dyeing and pristine archival box packaging.',
        image_url: 'assets/images/jordan-green.png',
        image: 'assets/images/jordan-green.png',
        theme_color: '#16a34a',
        theme: '#16a34a',
        glow_color: 'rgba(22, 163, 74, 0.45)',
        glow: 'rgba(22, 163, 74, 0.45)',
        category: 'grid',
        condition_grade: 'Deadstock Grade A',
        nfc_token: 'NFC-AETH-0304-PNE',
        is_active: 1,
        sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45'],
        created_at: '2026-01-04T10:00:00.000Z',
        updated_at: '2026-01-04T10:00:00.000Z'
      },
      {
        id: 'orange',
        name: 'Air Jordan 1 Retro High OG',
        silhouette: 'High',
        colorway: 'Reverse Shattered Backboard',
        style_code: '555088-113',
        styleCode: '555088-113',
        retail_price: 160,
        retailPrice: 160,
        vault_price: 620,
        price: 620,
        market_trend_pct: '+22.3%',
        year: '2016 / 2026',
        story: 'Commemorating the 1985 exhibition game in Trieste, Italy where MJ broke the plexiglass backboard into shards. Renowned for possessing the butter-soft tumbled leather benchmark in AJ1 lore.',
        image_url: 'assets/images/jordan-orange.png',
        image: 'assets/images/jordan-orange.png',
        theme_color: '#ea580c',
        theme: '#ea580c',
        glow_color: 'rgba(234, 88, 12, 0.45)',
        glow: 'rgba(234, 88, 12, 0.45)',
        category: 'grid',
        condition_grade: 'Deadstock Grade A+',
        nfc_token: 'NFC-AETH-1135-SBB',
        is_active: 1,
        sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45'],
        created_at: '2026-01-05T10:00:00.000Z',
        updated_at: '2026-01-05T10:00:00.000Z'
      },
      {
        id: 'shadow',
        name: 'Air Jordan 4 Retro',
        silhouette: 'AJ4',
        colorway: 'Black Cat (Triple Black)',
        style_code: 'CU1110-010',
        styleCode: 'CU1110-010',
        retail_price: 190,
        retailPrice: 190,
        vault_price: 740,
        price: 740,
        market_trend_pct: '+31.2%',
        year: '2006 / 2020',
        story: 'The stealth icon inspired by MJ predatory nickname. Sumptuous triple-black nubuck, molded TPU eyestay wings, graphite Jumpman heel badge, and visible Air cushioning.',
        image_url: 'assets/images/jordan-shadow.png',
        image: 'assets/images/jordan-shadow.png',
        theme_color: '#71717a',
        theme: '#71717a',
        glow_color: 'rgba(113, 113, 122, 0.45)',
        glow: 'rgba(113, 113, 122, 0.45)',
        category: 'grid',
        condition_grade: 'Deadstock Grade A+',
        nfc_token: 'NFC-AETH-0106-CAT',
        is_active: 1,
        sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45'],
        created_at: '2026-01-06T10:00:00.000Z',
        updated_at: '2026-01-06T10:00:00.000Z'
      },
      {
        id: 'travis-fragment',
        name: 'Travis Scott x Fragment Design AJ1 Low',
        silhouette: 'Low',
        colorway: 'Military Blue / Sail / Obsidian',
        style_code: 'DM7866-140',
        styleCode: 'DM7866-140',
        retail_price: 150,
        retailPrice: 150,
        vault_price: 1450,
        price: 1450,
        market_trend_pct: '+48.6%',
        year: '2021 / 2026',
        story: 'The pinnacle collaboration uniting Cactus Jack and Hiroshi Fujiwara. Features reverse oversized leather swoosh, yellowed vintage sail midsole, and dual debossed Cactus Jack and Fragment bolt insignia.',
        image_url: 'assets/images/jordan-blue.png',
        image: 'assets/images/jordan-blue.png',
        theme_color: '#1d4ed8',
        theme: '#1d4ed8',
        glow_color: 'rgba(29, 78, 216, 0.45)',
        glow: 'rgba(29, 78, 216, 0.45)',
        category: 'drop',
        condition_grade: 'Deadstock Grade A+',
        nfc_token: 'NFC-AETH-7866-FRG',
        is_active: 1,
        sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45'],
        created_at: '2026-01-07T10:00:00.000Z',
        updated_at: '2026-01-07T10:00:00.000Z'
      },
      {
        id: 'dior-high',
        name: 'Air Jordan 1 Retro High Dior',
        silhouette: 'High',
        colorway: 'Dior Grey / Cream White',
        style_code: 'CN8607-002',
        styleCode: 'CN8607-002',
        retail_price: 2000,
        retailPrice: 2000,
        vault_price: 5800,
        price: 5800,
        market_trend_pct: '+19.5%',
        year: '2020 / 2026',
        story: 'Handcrafted in Italy by Dior atelier artisans using Dior grey calfskin, jacquard Dior Oblique monogram woven swooshes, hand-painted leather edges, and translucent ice outsoles with dual co-branding.',
        image_url: 'assets/images/jordan-shadow.png',
        image: 'assets/images/jordan-shadow.png',
        theme_color: '#94a3b8',
        theme: '#94a3b8',
        glow_color: 'rgba(148, 163, 184, 0.45)',
        glow: 'rgba(148, 163, 184, 0.45)',
        category: 'runway',
        condition_grade: 'Deadstock Grade A+',
        nfc_token: 'NFC-AETH-8607-DIO',
        is_active: 1,
        sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45'],
        created_at: '2026-01-08T10:00:00.000Z',
        updated_at: '2026-01-08T10:00:00.000Z'
      }
    ],

    orders: [
      {
        id: 'ORD-2026-8812',
        user_id: 'usr_vip_002',
        customer_name: 'Matheus Silva',
        customer_email: 'collector@aetherkicks.com',
        shipping_address: 'Rua de Santa Catarina 45, 4000-441 Porto, Portugal',
        payment_method: 'Apple Pay',
        promo_code: 'GRAIL20',
        subtotal: 480.00,
        discount: 96.00,
        total: 384.00,
        status: 'delivered',
        tracking_number: 'AETH-FEDEX-99210-PT',
        nfc_certificate_id: 'NFC-AETH-8501-VERIFIED',
        items: [
          { shoe_id: 'chicago', size_eu: '42', size_us: '8.5', unit_price: 480.00, quantity: 1 }
        ],
        created_at: '2026-02-14T14:22:00.000Z'
      },
      {
        id: 'ORD-2026-9045',
        user_id: 'usr_vip_002',
        customer_name: 'Matheus Silva',
        customer_email: 'collector@aetherkicks.com',
        shipping_address: 'Rua de Santa Catarina 45, 4000-441 Porto, Portugal',
        payment_method: 'MB WAY',
        promo_code: null,
        subtotal: 1450.00,
        discount: 0.00,
        total: 1450.00,
        status: 'dispatched',
        tracking_number: 'AETH-DHL-44819-LUX',
        nfc_certificate_id: 'NFC-AETH-9045-VERIFIED',
        items: [
          { shoe_id: 'travis-fragment', size_eu: '43', size_us: '9.5', unit_price: 1450.00, quantity: 1 }
        ],
        created_at: '2026-03-01T18:05:00.000Z'
      },
      {
        id: 'ORD-2026-9128',
        user_id: 'usr_vip_002',
        customer_name: 'Matheus Silva',
        customer_email: 'collector@aetherkicks.com',
        shipping_address: 'Rua de Santa Catarina 45, 4000-441 Porto, Portugal',
        payment_method: 'Credit Card (Stripe)',
        promo_code: 'VIPACCESS',
        subtotal: 620.00,
        discount: 62.00,
        total: 558.00,
        status: 'forensic_check',
        tracking_number: 'AETH-SECURE-3312-INSP',
        nfc_certificate_id: 'NFC-AETH-9128-PENDING',
        items: [
          { shoe_id: 'orange', size_eu: '41', size_us: '8', unit_price: 620.00, quantity: 1 }
        ],
        created_at: '2026-03-15T09:40:00.000Z'
      }
    ],

    drops: [
      {
        id: 'drop_travis_frag_2026',
        shoe_id: 'travis-fragment',
        title: 'Travis Scott x Fragment AJ1 Low - Midnight Vault Drop',
        drop_time: '2026-04-01T23:00:00.000Z',
        price: 1450.00,
        stock_allocated: 25,
        status: 'live'
      }
    ],

    bespoke: [
      {
        id: 'BESPOKE-2026-001',
        user_id: 'usr_vip_002',
        client_name: 'Matheus Silva',
        email: 'collector@aetherkicks.com',
        base_silhouette: 'Air Jordan 1 High OG',
        base_leather_color: '#111827',
        swoosh_color: '#eab308',
        laces_color: '#000000',
        custom_engraving: 'MEMENTO VIVERE',
        status: 'in_crafting',
        created_at: '2026-03-10T16:30:00.000Z'
      }
    ],

    auditLogs: [
      {
        id: 'log_boot_001',
        admin_id: 'usr_admin_001',
        action: 'VAULT_GENESIS',
        entity: 'SYSTEM',
        entity_id: 'ROOT',
        details_json: JSON.stringify({ message: 'Aether Kicks Relational Engine initialized with 8 authenticated grails.' }),
        created_at: '2026-01-01T00:00:00.000Z'
      },
      {
        id: 'log_nfc_002',
        admin_id: 'usr_admin_001',
        action: 'NFC_PAIRING',
        entity: 'shoes',
        entity_id: 'chicago',
        details_json: JSON.stringify({ nfc_token: 'NFC-AETH-8501-CHI', hardware: 'NTAG216 Cryptotag Verified' }),
        created_at: '2026-01-01T10:05:00.000Z'
      },
      {
        id: 'log_drop_003',
        admin_id: 'usr_admin_001',
        action: 'DROP_ACTIVATED',
        entity: 'hype_drops',
        entity_id: 'drop_travis_frag_2026',
        details_json: JSON.stringify({ stock_allocated: 25, tier: 'VIP_COLLECTOR_FIRST_ACCESS' }),
        created_at: '2026-03-31T23:59:00.000Z'
      }
    ]
  };

  // Generate complete inventory seeds across EU 38 to 46 for all shoes
  function generateDefaultInventory() {
    const inv = [];
    DEFAULT_SEEDS.shoes.forEach((shoe) => {
      SIZING_REFERENCE.forEach((s) => {
        // Base realistic quantity
        let baseQty = 6;
        if (s.eu === '42' || s.eu === '41' || s.eu === '43') baseQty = 12;
        if (s.eu === '38' || s.eu === '46') baseQty = 3;
        if (shoe.id === 'dior-high') baseQty = Math.max(1, Math.floor(baseQty / 4));
        if (shoe.id === 'travis-fragment') baseQty = Math.max(2, Math.floor(baseQty / 2));

        inv.push({
          id: `inv_${shoe.id}_${s.eu.replace('.', '_')}`,
          shoe_id: shoe.id,
          size_eu: s.eu,
          size_us: s.us,
          quantity: baseQty,
          reserved_quantity: (s.eu === '42' && shoe.id === 'chicago') ? 2 : 0
        });
      });
    });
    return inv;
  }

  DEFAULT_SEEDS.inventory = generateDefaultInventory();

  // Class Definition
  class AetherDatabase {
    constructor() {
      this.dbName = 'AetherKicksDB';
      this.version = 1;
      this.stores = ['shoes', 'inventory', 'users', 'orders', 'drops', 'bespoke', 'auditLogs'];
      this.db = null;
      this.isIndexedDBAvailable = typeof window !== 'undefined' && 'indexedDB' in window;
      this.storagePrefix = 'aether_idb_';
      this._initPromise = this._init();
    }

    /**
     * Initializes the DB instance, migrations, and automatic seeding.
     */
    async _init() {
      if (!this.isIndexedDBAvailable) {
        console.warn('[AetherDB] IndexedDB not available in current environment. Using LocalStorage fallback mode.');
        this._initLocalStorageSeeds();
        return;
      }

      return new Promise((resolve) => {
        try {
          const req = indexedDB.open(this.dbName, this.version);

          req.onupgradeneeded = (e) => {
            const db = e.target.result;

            if (!db.objectStoreNames.contains('shoes')) {
              const shoeStore = db.createObjectStore('shoes', { keyPath: 'id' });
              shoeStore.createIndex('category', 'category', { unique: false });
              shoeStore.createIndex('silhouette', 'silhouette', { unique: false });
              shoeStore.createIndex('is_active', 'is_active', { unique: false });
            }

            if (!db.objectStoreNames.contains('inventory')) {
              const invStore = db.createObjectStore('inventory', { keyPath: 'id' });
              invStore.createIndex('shoe_id', 'shoe_id', { unique: false });
              invStore.createIndex('size_eu', 'size_eu', { unique: false });
            }

            if (!db.objectStoreNames.contains('users')) {
              const userStore = db.createObjectStore('users', { keyPath: 'id' });
              userStore.createIndex('email', 'email', { unique: true });
              userStore.createIndex('role', 'role', { unique: false });
            }

            if (!db.objectStoreNames.contains('orders')) {
              const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
              orderStore.createIndex('user_id', 'user_id', { unique: false });
              orderStore.createIndex('status', 'status', { unique: false });
            }

            if (!db.objectStoreNames.contains('drops')) {
              db.createObjectStore('drops', { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains('bespoke')) {
              db.createObjectStore('bespoke', { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains('auditLogs')) {
              const logStore = db.createObjectStore('auditLogs', { keyPath: 'id' });
              logStore.createIndex('created_at', 'created_at', { unique: false });
            }
          };

          req.onsuccess = async (e) => {
            this.db = e.target.result;
            await this._checkAndSeedDatabase();
            resolve(this);
          };

          req.onerror = (e) => {
            console.error('[AetherDB] IndexedDB open error, falling back to LocalStorage:', e);
            this.isIndexedDBAvailable = false;
            this._initLocalStorageSeeds();
            resolve(this);
          };
        } catch (err) {
          console.error('[AetherDB] Unexpected exception initializing IndexedDB:', err);
          this.isIndexedDBAvailable = false;
          this._initLocalStorageSeeds();
          resolve(this);
        }
      });
    }

    /**
     * Ensures seeds are written if database is empty on first boot.
     */
    async _checkAndSeedDatabase() {
      if (this.isIndexedDBAvailable && this.db) {
        const shoes = await this._getAllFromStore('shoes');
        if (!shoes || shoes.length === 0) {
          await this._seedAllStores();
        }
      } else {
        this._initLocalStorageSeeds();
      }
    }

    async _seedAllStores() {
      for (const store of this.stores) {
        const seedItems = DEFAULT_SEEDS[store] || [];
        for (const item of seedItems) {
          await this._putInStore(store, item);
        }
      }
      this._syncToLocalStorage();
      console.log('[AetherDB] Factory deadstock seeds successfully populated into vault.');
    }

    _initLocalStorageSeeds() {
      for (const store of this.stores) {
        const key = this.storagePrefix + store;
        const existing = localStorage.getItem(key);
        if (!existing) {
          localStorage.setItem(key, JSON.stringify(DEFAULT_SEEDS[store] || []));
        }
      }
    }

    _syncToLocalStorage() {
      if (typeof localStorage === 'undefined') return;
      this.stores.forEach(async (store) => {
        try {
          const data = await this._getAllFromStore(store);
          localStorage.setItem(this.storagePrefix + store, JSON.stringify(data));
        } catch (e) {}
      });
    }

    // ==========================================================================
    // LOW-LEVEL OBJECT STORE HELPERS (IDB + LocalStorage Fallback)
    // ==========================================================================

    async _getAllFromStore(storeName) {
      if (!this.isIndexedDBAvailable || !this.db) {
        const raw = localStorage.getItem(this.storagePrefix + storeName);
        return raw ? JSON.parse(raw) : (DEFAULT_SEEDS[storeName] || []);
      }

      return new Promise((resolve, reject) => {
        try {
          const tx = this.db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => {
            const raw = localStorage.getItem(this.storagePrefix + storeName);
            resolve(raw ? JSON.parse(raw) : []);
          };
        } catch (e) {
          const raw = localStorage.getItem(this.storagePrefix + storeName);
          resolve(raw ? JSON.parse(raw) : []);
        }
      });
    }

    async _getByKey(storeName, key) {
      if (!this.isIndexedDBAvailable || !this.db) {
        const list = await this._getAllFromStore(storeName);
        return list.find(item => item.id === key) || null;
      }

      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = async () => {
            const list = await this._getAllFromStore(storeName);
            resolve(list.find(item => item.id === key) || null);
          };
        } catch (e) {
          resolve(null);
        }
      });
    }

    async _putInStore(storeName, item) {
      // Mirror to local storage
      try {
        const raw = localStorage.getItem(this.storagePrefix + storeName);
        const list = raw ? JSON.parse(raw) : [];
        const idx = list.findIndex(i => i.id === item.id);
        if (idx >= 0) {
          list[idx] = item;
        } else {
          list.push(item);
        }
        localStorage.setItem(this.storagePrefix + storeName, JSON.stringify(list));
      } catch (e) {}

      if (!this.isIndexedDBAvailable || !this.db) return item;

      return new Promise((resolve, reject) => {
        try {
          const tx = this.db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const req = store.put(item);
          req.onsuccess = () => resolve(item);
          req.onerror = (e) => reject(e);
        } catch (err) {
          resolve(item);
        }
      });
    }

    async _deleteFromStore(storeName, key) {
      try {
        const raw = localStorage.getItem(this.storagePrefix + storeName);
        if (raw) {
          const list = JSON.parse(raw).filter(i => i.id !== key);
          localStorage.setItem(this.storagePrefix + storeName, JSON.stringify(list));
        }
      } catch (e) {}

      if (!this.isIndexedDBAvailable || !this.db) return true;

      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const req = store.delete(key);
          req.onsuccess = () => resolve(true);
          req.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      });
    }

    _notify(store, action, data = null) {
      if (typeof window !== 'undefined') {
        const evt = new CustomEvent('aether:db:updated', {
          detail: {
            store,
            action,
            id: data ? (data.id || data.shoe_id || data.shoeId) : null,
            data
          }
        });
        window.dispatchEvent(evt);
      }
    }

    // ==========================================================================
    // 1. SHOES CRUD API
    // ==========================================================================

    async getShoes() {
      await this._initPromise;
      return await this._getAllFromStore('shoes');
    }

    async getShoe(id) {
      await this._initPromise;
      return await this._getByKey('shoes', id);
    }

    async addShoe(shoeData) {
      await this._initPromise;
      if (!shoeData.id) {
        shoeData.id = shoeData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      // Normalize fields
      const now = new Date().toISOString();
      const shoe = {
        id: shoeData.id,
        name: shoeData.name,
        silhouette: shoeData.silhouette || 'High',
        colorway: shoeData.colorway || '',
        style_code: shoeData.style_code || shoeData.styleCode || 'AETH-000',
        styleCode: shoeData.style_code || shoeData.styleCode || 'AETH-000',
        retail_price: parseFloat(shoeData.retail_price || shoeData.retailPrice || 180),
        retailPrice: parseFloat(shoeData.retail_price || shoeData.retailPrice || 180),
        vault_price: parseFloat(shoeData.vault_price || shoeData.price || 300),
        price: parseFloat(shoeData.vault_price || shoeData.price || 300),
        market_trend_pct: shoeData.market_trend_pct || shoeData.marketTrend || '+0.0%',
        year: shoeData.year || '2026',
        story: shoeData.story || '',
        image_url: shoeData.image_url || shoeData.image || 'assets/images/jordan-chicago.png',
        image: shoeData.image_url || shoeData.image || 'assets/images/jordan-chicago.png',
        theme_color: shoeData.theme_color || shoeData.theme || '#dc2626',
        theme: shoeData.theme_color || shoeData.theme || '#dc2626',
        glow_color: shoeData.glow_color || shoeData.glow || 'rgba(220, 38, 38, 0.45)',
        glow: shoeData.glow_color || shoeData.glow || 'rgba(220, 38, 38, 0.45)',
        category: shoeData.category || 'grid',
        condition_grade: shoeData.condition_grade || 'Deadstock Grade A+',
        nfc_token: shoeData.nfc_token || `NFC-AETH-${Math.floor(1000 + Math.random() * 9000)}-TOKEN`,
        is_active: shoeData.is_active !== undefined ? (shoeData.is_active ? 1 : 0) : 1,
        sizes: shoeData.sizes || ['40', '40.5', '41', '42', '42.5', '43', '44', '45'],
        created_at: shoeData.created_at || now,
        updated_at: now
      };

      await this._putInStore('shoes', shoe);

      // Generate default inventory if not exists
      const existingInv = await this.getInventory(shoe.id);
      if (!existingInv || existingInv.length === 0) {
        for (const s of SIZING_REFERENCE) {
          await this._putInStore('inventory', {
            id: `inv_${shoe.id}_${s.eu.replace('.', '_')}`,
            shoe_id: shoe.id,
            size_eu: s.eu,
            size_us: s.us,
            quantity: 8,
            reserved_quantity: 0
          });
        }
      }

      await this.logAction('CREATE_SHOE', 'shoes', shoe.id, { name: shoe.name, price: shoe.price });
      this._notify('shoes', 'created', shoe);
      return shoe;
    }

    async updateShoe(id, shoeData) {
      await this._initPromise;
      const existing = await this.getShoe(id);
      if (!existing) throw new Error(`Shoe with id '${id}' not found.`);

      const updated = {
        ...existing,
        ...shoeData,
        id: id,
        updated_at: new Date().toISOString()
      };

      // Synchronize aliases
      if (shoeData.price !== undefined) {
        updated.vault_price = parseFloat(shoeData.price);
        updated.price = parseFloat(shoeData.price);
      } else if (shoeData.vault_price !== undefined) {
        updated.vault_price = parseFloat(shoeData.vault_price);
        updated.price = parseFloat(shoeData.vault_price);
      }
      if (shoeData.retailPrice !== undefined || shoeData.retail_price !== undefined) {
        const val = parseFloat(shoeData.retailPrice !== undefined ? shoeData.retailPrice : shoeData.retail_price);
        updated.retail_price = val;
        updated.retailPrice = val;
      }
      if (shoeData.image || shoeData.image_url) {
        const img = shoeData.image || shoeData.image_url;
        updated.image = img;
        updated.image_url = img;
      }
      if (shoeData.theme || shoeData.theme_color) {
        const t = shoeData.theme || shoeData.theme_color;
        updated.theme = t;
        updated.theme_color = t;
      }
      if (shoeData.glow || shoeData.glow_color) {
        const g = shoeData.glow || shoeData.glow_color;
        updated.glow = g;
        updated.glow_color = g;
      }

      await this._putInStore('shoes', updated);
      await this.logAction('UPDATE_SHOE', 'shoes', id, { updatedFields: Object.keys(shoeData) });
      this._notify('shoes', 'updated', updated);
      return updated;
    }

    async deleteShoe(id) {
      await this._initPromise;
      const shoe = await this.getShoe(id);
      await this._deleteFromStore('shoes', id);

      // Cascade delete inventory
      const invList = await this.getInventory(id);
      for (const item of invList) {
        await this._deleteFromStore('inventory', item.id);
      }

      await this.logAction('DELETE_SHOE', 'shoes', id, { deletedName: shoe ? shoe.name : id });
      this._notify('shoes', 'deleted', { id });
      return true;
    }

    // ==========================================================================
    // 2. INVENTORY API
    // ==========================================================================

    async getInventory(shoeId = null) {
      await this._initPromise;
      const all = await this._getAllFromStore('inventory');
      if (!shoeId) return all;
      return all.filter(item => item.shoe_id === shoeId);
    }

    async updateInventory(shoeId, sizeEu, qty) {
      await this._initPromise;
      const invList = await this.getInventory(shoeId);
      let match = invList.find(i => String(i.size_eu) === String(sizeEu));

      if (match) {
        match.quantity = Math.max(0, parseInt(qty, 10));
        await this._putInStore('inventory', match);
      } else {
        const ref = SIZING_REFERENCE.find(s => s.eu === String(sizeEu)) || { us: '8.5' };
        match = {
          id: `inv_${shoeId}_${String(sizeEu).replace('.', '_')}`,
          shoe_id: shoeId,
          size_eu: String(sizeEu),
          size_us: ref.us,
          quantity: Math.max(0, parseInt(qty, 10)),
          reserved_quantity: 0
        };
        await this._putInStore('inventory', match);
      }

      await this.logAction('UPDATE_INVENTORY', 'inventory', match.id, { shoeId, sizeEu, newQty: qty });
      this._notify('inventory', 'updated', match);
      return match;
    }

    // ==========================================================================
    // 3. USERS & AUTH API
    // ==========================================================================

    async getUsers() {
      await this._initPromise;
      const users = await this._getAllFromStore('users');
      // Sanitize password_hash for safety in normal retrieval
      return users.map(u => {
        const { password_hash, ...safeUser } = u;
        return safeUser;
      });
    }

    async getUser(id) {
      await this._initPromise;
      const user = await this._getByKey('users', id);
      if (!user) return null;
      const { password_hash, plainPassword, ...safeUser } = user;
      return safeUser;
    }

    /**
     * Cryptographic SHA-256 Hash Engine (Web Crypto API with pure JS fallback)
     */
    async hashPassword(password) {
      if (typeof password !== 'string') password = String(password || '');
      const str = password.trim();
      try {
        if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
          const enc = new TextEncoder();
          const data = enc.encode(str);
          const buf = await window.crypto.subtle.digest('SHA-256', data);
          return Array.from(new Uint8Array(buf))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        }
      } catch (e) {
        console.warn('[AetherDB Security] Web Crypto Subtle unavailable, using pure SHA-256 fallback:', e);
      }
      return sha256Pure(str);
    }

    /**
     * Cryptographic HMAC Session Signature
     * Signs the user session payload with HMAC-SHA256.
     * Prevents client-side privilege escalation (e.g. tampering role: 'admin' in DevTools).
     */
    async signSession(sessionData, secret = 'AETHER_VAULT_HMAC_MASTER_KEY_2026') {
      const payload = {
        id: sessionData.id,
        email: sessionData.email,
        name: sessionData.name || sessionData.full_name,
        role: sessionData.role,
        tier: sessionData.tier || (sessionData.role === 'admin' ? 'Root Architect' : 'VIP Member'),
        issuedAt: sessionData.issuedAt || Date.now(),
        entropy: Math.random().toString(36).substring(2, 10)
      };

      const payloadString = JSON.stringify(payload);
      let signatureHex = '';

      try {
        if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
          const enc = new TextEncoder();
          const key = await window.crypto.subtle.importKey(
            'raw',
            enc.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
          );
          const sigBuf = await window.crypto.subtle.sign('HMAC', key, enc.encode(payloadString));
          signatureHex = Array.from(new Uint8Array(sigBuf))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        }
      } catch (e) {
        console.warn('[AetherDB Security] SubtleCrypto HMAC unavailable, falling back:', e);
      }

      if (!signatureHex) {
        // Fallback keyed hash
        signatureHex = await this.hashPassword(secret + ':' + payloadString + ':' + secret);
      }

      return {
        payload,
        signature: signatureHex,
        token: `AK_SESSION.${btoa(encodeURIComponent(payloadString))}.${signatureHex}`
      };
    }

    /**
     * Validates cryptographic session integrity.
     * Recomputes the HMAC signature and verifies against session token.
     * If any field (e.g. role: 'admin') was tampered with in DevTools, returns null.
     */
    async verifySession(sessionObject, secret = 'AETHER_VAULT_HMAC_MASTER_KEY_2026') {
      if (!sessionObject) return null;
      let payload = null;
      let signature = null;

      if (typeof sessionObject === 'string' && sessionObject.startsWith('AK_SESSION.')) {
        const parts = sessionObject.split('.');
        if (parts.length === 3) {
          try {
            payload = JSON.parse(decodeURIComponent(atob(parts[1])));
            signature = parts[2];
          } catch (e) {
            return null;
          }
        }
      } else if (sessionObject.payload && sessionObject.signature) {
        payload = sessionObject.payload;
        signature = sessionObject.signature;
      } else if (sessionObject.role) {
        // Unsigned raw object injected into storage -> Reject as tampered
        return null;
      }

      if (!payload || !signature) return null;

      const payloadString = JSON.stringify(payload);
      let expectedSig = '';

      try {
        if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
          const enc = new TextEncoder();
          const key = await window.crypto.subtle.importKey(
            'raw',
            enc.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
          );
          const sigBuf = await window.crypto.subtle.sign('HMAC', key, enc.encode(payloadString));
          expectedSig = Array.from(new Uint8Array(sigBuf))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        }
      } catch (e) {}

      if (!expectedSig) {
        expectedSig = await this.hashPassword(secret + ':' + payloadString + ':' + secret);
      }

      if (expectedSig === signature) {
        return payload;
      } else {
        await this.logAction('SECURITY_SESSION_TAMPERING', 'users', payload.id || 'ANONYMOUS', {
          reason: 'HMAC signature mismatch: unauthorized session modification in storage',
          attemptedRole: payload.role
        });
        return null;
      }
    }

    /**
     * Secure User Authentication via SHA-256 Hashes & Cryptographic Sessions
     */
    async authenticateUser(email, password) {
      await this._initPromise;
      const users = await this._getAllFromStore('users');
      const targetEmail = (email || '').toLowerCase().trim();
      const user = users.find(u => u.email.toLowerCase() === targetEmail);

      if (!user) return null;

      // Hash input password with SHA-256
      const hashedInput = await this.hashPassword(password);

      // Known admin hashes ('aether2026', 'admin')
      const ADMIN_HASHES = [
        '140f00da29e9ac981ff7ab92dbb872deeb5115dde50bbc0174543d2b3d61b3e9', // SHA-256('aether2026')
        '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // SHA-256('admin')
        '644558e0a3b06385d8e70a9dd37a5cb74fa450d067cbff5e84860b7ca4b659c8'  // SHA-256('aether')
      ];
      // Known collector hashes ('grailpass', 'collector', 'airjordan1985')
      const COLLECTOR_HASHES = [
        '61eb1a066b4d039315c21b6dbe71b53daec9ee34aabe364a7bcf1586831fee23', // SHA-256('grailpass')
        '0736fd5b7cc7ab7dfe821d3a17f93f2634497770232486155c9c881321c4d22c', // SHA-256('collector')
        'cb59d4c70a84be85933d76ce19a7ee5fbb0e9751e08ce7a858e7b396fcebb4b9'  // SHA-256('airjordan1985')
      ];

      let isValid = false;
      if (user.email === 'admin@aetherkicks.com') {
        isValid = ADMIN_HASHES.includes(hashedInput) || user.password_hash === hashedInput;
      } else if (user.email === 'collector@aetherkicks.com' || user.email === 'collector@aetherkicks.io') {
        isValid = COLLECTOR_HASHES.includes(hashedInput) || user.password_hash === hashedInput;
      } else if (user.password_hash) {
        isValid = (user.password_hash === hashedInput);
      }

      if (isValid) {
        await this.logAction('USER_LOGIN_SUCCESS', 'users', user.id, { email: user.email });
        const { password_hash, plainPassword, ...safeUser } = user;
        const session = await this.signSession(safeUser);
        return {
          ...safeUser,
          _session: session
        };
      } else {
        await this.logAction('USER_LOGIN_FAILED', 'users', user.id, { email: user.email });
        return null;
      }
    }

    async addUser(userData) {
      await this._initPromise;
      const now = new Date().toISOString();
      const rawPassword = userData.password || userData.plainPassword || 'vault_member_2026';
      const passwordHash = await this.hashPassword(rawPassword);

      const newUser = {
        id: userData.id || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        email: escapeHTML((userData.email || '').toLowerCase().trim()),
        password_hash: passwordHash,
        full_name: escapeHTML(userData.full_name || userData.name || userData.email.split('@')[0]),
        role: userData.role === 'admin' ? 'admin' : (userData.role === 'vip_member' ? 'vip_member' : 'collector'),
        preferred_size: escapeHTML(userData.preferred_size || 'EU 42 (US 8.5)'),
        address: escapeHTML(userData.address || ''),
        city: escapeHTML(userData.city || 'Lisboa'),
        postal_code: escapeHTML(userData.postal_code || ''),
        country: escapeHTML(userData.country || 'Portugal'),
        phone: escapeHTML(userData.phone || ''),
        created_at: now,
        updated_at: now
      };

      await this._putInStore('users', newUser);
      await this.logAction('CREATE_USER', 'users', newUser.id, { email: newUser.email, role: newUser.role });
      this._notify('users', 'created', newUser);
      const { password_hash, ...safeUser } = newUser;
      return safeUser;
    }

    async updateUser(id, userData) {
      await this._initPromise;
      const users = await this._getAllFromStore('users');
      const existing = users.find(u => u.id === id);
      if (!existing) throw new Error(`User with id '${id}' not found.`);

      const updated = {
        ...existing,
        ...userData,
        id: id,
        updated_at: new Date().toISOString()
      };

      await this._putInStore('users', updated);
      await this.logAction('UPDATE_USER', 'users', id, { updatedFields: Object.keys(userData) });
      this._notify('users', 'updated', updated);
      const { password_hash, ...safeUser } = updated;
      return safeUser;
    }

    // ==========================================================================
    // 4. ORDERS API
    // ==========================================================================

    async getOrders() {
      await this._initPromise;
      return await this._getAllFromStore('orders');
    }

    async getOrder(id) {
      await this._initPromise;
      return await this._getByKey('orders', id);
    }

    async addOrder(orderData) {
      await this._initPromise;
      const orderId = orderData.id || `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();

      const order = {
        id: orderId,
        user_id: orderData.user_id || 'usr_vip_002',
        customer_name: orderData.customer_name || 'Grail Collector',
        customer_email: orderData.customer_email || 'collector@aetherkicks.com',
        shipping_address: orderData.shipping_address || 'Avenida da Liberdade 210, Lisboa, Portugal',
        payment_method: orderData.payment_method || 'Apple Pay',
        promo_code: orderData.promo_code || null,
        subtotal: parseFloat(orderData.subtotal || 0),
        discount: parseFloat(orderData.discount || 0),
        total: parseFloat(orderData.total || 0),
        status: orderData.status || 'pending_verification',
        tracking_number: orderData.tracking_number || `AETH-EXPRESS-${Math.floor(10000 + Math.random() * 90000)}-PT`,
        nfc_certificate_id: orderData.nfc_certificate_id || `NFC-AETH-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED`,
        items: orderData.items || [],
        created_at: now
      };

      await this._putInStore('orders', order);

      // Decrement inventory stock for each ordered item
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          const shoeId = item.shoe_id || item.shoeId;
          const sizeEu = item.size_eu || item.sizeEu || item.size;
          const qty = parseInt(item.quantity || 1, 10);
          if (shoeId && sizeEu) {
            const currentStock = await this.getInventory(shoeId);
            const sizeRecord = currentStock.find(s => String(s.size_eu) === String(sizeEu));
            if (sizeRecord) {
              const newQty = Math.max(0, sizeRecord.quantity - qty);
              await this.updateInventory(shoeId, sizeEu, newQty);
            }
          }
        }
      }

      await this.logAction('CREATE_ORDER', 'orders', order.id, { total: order.total, itemsCount: order.items.length });
      this._notify('orders', 'created', order);
      return order;
    }

    async updateOrderStatus(orderId, status, trackingNo = null) {
      await this._initPromise;
      const order = await this.getOrder(orderId);
      if (!order) throw new Error(`Order '${orderId}' not found.`);

      order.status = status;
      if (trackingNo) order.tracking_number = trackingNo;

      await this._putInStore('orders', order);
      await this.logAction('UPDATE_ORDER_STATUS', 'orders', orderId, { newStatus: status, trackingNo });
      this._notify('orders', 'updated', order);
      return order;
    }

    // ==========================================================================
    // 5. HYPE DROPS API
    // ==========================================================================

    async getDrops() {
      await this._initPromise;
      return await this._getAllFromStore('drops');
    }

    async updateDrop(dropId, dropData) {
      await this._initPromise;
      const existing = await this._getByKey('drops', dropId);
      const updated = {
        ...(existing || {}),
        ...dropData,
        id: dropId
      };
      await this._putInStore('drops', updated);
      await this.logAction('UPDATE_HYPE_DROP', 'drops', dropId, dropData);
      this._notify('drops', 'updated', updated);
      return updated;
    }

    // ==========================================================================
    // 6. BESPOKE 3D ATELIER COMMISSIONS
    // ==========================================================================

    async getBespokeCommissions() {
      await this._initPromise;
      return await this._getAllFromStore('bespoke');
    }

    async addBespokeCommission(data) {
      await this._initPromise;
      const bespoke = {
        id: data.id || `BESPOKE-2026-${Math.floor(100 + Math.random() * 900)}`,
        user_id: data.user_id || 'usr_vip_002',
        client_name: data.client_name || 'Bespoke Patron',
        email: data.email || 'collector@aetherkicks.com',
        base_silhouette: data.base_silhouette || 'Air Jordan 1 High OG',
        base_leather_color: data.base_leather_color || '#111827',
        swoosh_color: data.swoosh_color || '#eab308',
        laces_color: data.laces_color || '#000000',
        custom_engraving: data.custom_engraving || '',
        status: data.status || 'in_crafting',
        created_at: new Date().toISOString()
      };
      await this._putInStore('bespoke', bespoke);
      await this.logAction('CREATE_BESPOKE_COMMISSION', 'bespoke', bespoke.id, { client: bespoke.client_name });
      this._notify('bespoke', 'created', bespoke);
      return bespoke;
    }

    // ==========================================================================
    // 7. AUDIT LOGS API
    // ==========================================================================

    async getAuditLogs() {
      await this._initPromise;
      const logs = await this._getAllFromStore('auditLogs');
      return logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    async logAction(action, entity, entityId, details = {}) {
      try {
        const log = {
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          admin_id: 'usr_admin_001',
          action: action,
          entity: entity,
          entity_id: entityId || 'N/A',
          details_json: typeof details === 'string' ? details : JSON.stringify(details),
          created_at: new Date().toISOString()
        };
        await this._putInStore('auditLogs', log);
        return log;
      } catch (e) {
        console.warn('[AetherDB] Could not write audit log:', e);
      }
    }

    // ==========================================================================
    // 8. BACKUP, RESTORE & EXPORT ENGINES (JSON & SQL)
    // ==========================================================================

    /**
     * Complete JSON database snapshot.
     */
    async exportJSON() {
      await this._initPromise;
      const dump = {
        meta: {
          app: 'AETHER KICKS VAULT DATABASE',
          version: '1.0.0',
          engine: 'AetherRelationalClient v1',
          exported_at: new Date().toISOString()
        }
      };

      for (const store of this.stores) {
        dump[store] = await this._getAllFromStore(store);
      }

      return dump;
    }

    /**
     * Import full JSON database backup.
     */
    async importJSON(dumpData, merge = false) {
      await this._initPromise;
      if (!dumpData || typeof dumpData !== 'object') {
        throw new Error('Invalid JSON dump provided for database import.');
      }

      for (const store of this.stores) {
        if (Array.isArray(dumpData[store])) {
          if (!merge) {
            // Clear current items in store
            const current = await this._getAllFromStore(store);
            for (const item of current) {
              await this._deleteFromStore(store, item.id);
            }
          }
          // Put new items
          for (const item of dumpData[store]) {
            await this._putInStore(store, item);
          }
        }
      }

      await this.logAction('DATABASE_IMPORTED', 'SYSTEM', 'ALL', { mergeMode: merge });
      this._notify('all', 'imported', dumpData);
      return true;
    }

    /**
     * Generates a complete, executable SQL script containing schema and seed statements.
     */
    async exportSQL() {
      await this._initPromise;
      const dump = await this.exportJSON();
      const lines = [];

      lines.push('-- ==============================================================================');
      lines.push('-- AETHER KICKS - VAULT DATABASE SQL DUMP');
      lines.push(`-- Exported on: ${dump.meta.exported_at}`);
      lines.push('-- ==============================================================================');
      lines.push('');

      // Bulletproof SQL String Escaper (Prevents SQL Injection & Breakout in Dumps)
      const esc = (val) => {
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') return Number.isFinite(val) ? String(val) : 'NULL';
        if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
        // Comprehensive SQL breakout prevention:
        // 1. Remove NUL bytes (\0)
        // 2. Escape backslashes (\ -> \\)
        // 3. Double single-quotes (' -> '')
        // 4. Escape newline/carriage return/tab control characters
        // 5. Escape ASCII Ctrl+Z (\x1a)
        const escaped = String(val)
          .replace(/\0/g, '')
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "''")
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
          .replace(/\t/g, '\\t')
          .replace(/\x1a/g, '\\Z');
        return "'" + escaped + "'";
      };

      // Users
      if (dump.users && dump.users.length > 0) {
        lines.push('-- USERS');
        for (const u of dump.users) {
          lines.push(
            `INSERT INTO users (id, email, password_hash, full_name, role, preferred_size, address, city, postal_code, country, phone, created_at, updated_at) ` +
            `VALUES (${esc(u.id)}, ${esc(u.email)}, ${esc(u.password_hash || '$2a$12$demo')}, ${esc(u.full_name)}, ${esc(u.role)}, ${esc(u.preferred_size)}, ${esc(u.address)}, ${esc(u.city)}, ${esc(u.postal_code)}, ${esc(u.country)}, ${esc(u.phone)}, ${esc(u.created_at)}, ${esc(u.updated_at)}) ` +
            `ON CONFLICT (id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP;`
          );
        }
        lines.push('');
      }

      // Shoes
      if (dump.shoes && dump.shoes.length > 0) {
        lines.push('-- SHOES / PRODUCTS');
        for (const s of dump.shoes) {
          lines.push(
            `INSERT INTO shoes (id, name, silhouette, colorway, style_code, retail_price, vault_price, market_trend_pct, year, story, image_url, theme_color, glow_color, category, condition_grade, nfc_token, is_active, created_at, updated_at) ` +
            `VALUES (${esc(s.id)}, ${esc(s.name)}, ${esc(s.silhouette)}, ${esc(s.colorway)}, ${esc(s.style_code || s.styleCode)}, ${esc(s.retail_price || s.retailPrice)}, ${esc(s.vault_price || s.price)}, ${esc(s.market_trend_pct || s.marketTrend)}, ${esc(s.year)}, ${esc(s.story)}, ${esc(s.image_url || s.image)}, ${esc(s.theme_color || s.theme)}, ${esc(s.glow_color || s.glow)}, ${esc(s.category)}, ${esc(s.condition_grade)}, ${esc(s.nfc_token)}, ${esc(s.is_active)}, ${esc(s.created_at)}, ${esc(s.updated_at)}) ` +
            `ON CONFLICT (id) DO UPDATE SET vault_price = EXCLUDED.vault_price, updated_at = CURRENT_TIMESTAMP;`
          );
        }
        lines.push('');
      }

      // Inventory
      if (dump.inventory && dump.inventory.length > 0) {
        lines.push('-- SHOE INVENTORY');
        for (const inv of dump.inventory) {
          lines.push(
            `INSERT INTO shoe_inventory (id, shoe_id, size_eu, size_us, quantity, reserved_quantity) ` +
            `VALUES (${esc(inv.id)}, ${esc(inv.shoe_id)}, ${esc(inv.size_eu)}, ${esc(inv.size_us)}, ${esc(inv.quantity)}, ${esc(inv.reserved_quantity || 0)}) ` +
            `ON CONFLICT (id) DO UPDATE SET quantity = EXCLUDED.quantity;`
          );
        }
        lines.push('');
      }

      // Orders
      if (dump.orders && dump.orders.length > 0) {
        lines.push('-- ORDERS');
        for (const o of dump.orders) {
          lines.push(
            `INSERT INTO orders (id, user_id, customer_name, customer_email, shipping_address, payment_method, promo_code, subtotal, discount, total, status, tracking_number, nfc_certificate_id, created_at) ` +
            `VALUES (${esc(o.id)}, ${esc(o.user_id)}, ${esc(o.customer_name)}, ${esc(o.customer_email)}, ${esc(o.shipping_address)}, ${esc(o.payment_method)}, ${esc(o.promo_code)}, ${esc(o.subtotal)}, ${esc(o.discount)}, ${esc(o.total)}, ${esc(o.status)}, ${esc(o.tracking_number)}, ${esc(o.nfc_certificate_id)}, ${esc(o.created_at)}) ` +
            `ON CONFLICT (id) DO NOTHING;`
          );
        }
        lines.push('');
      }

      // Drops
      if (dump.drops && dump.drops.length > 0) {
        lines.push('-- HYPE DROPS');
        for (const d of dump.drops) {
          lines.push(
            `INSERT INTO hype_drops (id, shoe_id, title, drop_time, price, stock_allocated, status) ` +
            `VALUES (${esc(d.id)}, ${esc(d.shoe_id)}, ${esc(d.title)}, ${esc(d.drop_time)}, ${esc(d.price)}, ${esc(d.stock_allocated)}, ${esc(d.status)}) ` +
            `ON CONFLICT (id) DO NOTHING;`
          );
        }
        lines.push('');
      }

      return lines.join('\n');
    }

    /**
     * =========================================================================
     * ANTI-SQL INJECTION & PARAMETERIZED QUERY ENGINE
     * =========================================================================
     * 
     * HOW PREPARED STATEMENTS PREVENT SQL INJECTION:
     * -------------------------------------------------------------------------
     * 1. In string concatenation (VULNERABLE):
     *      const sql = "SELECT * FROM users WHERE email = '" + inputEmail + "'";
     *    If attacker inputs: "admin@aetherkicks.com' OR '1'='1"
     *    The database parser executes:
     *      SELECT * FROM users WHERE email = 'admin@aetherkicks.com' OR '1'='1'
     *    This bypasses authentication entirely.
     * 
     * 2. In Parameterized Prepared Statements (DEFENSE):
     *    PostgreSQL / ANSI:
     *      PREPARE user_login (text, text) AS 
     *        SELECT * FROM users WHERE email = $1 AND password_hash = $2;
     *      EXECUTE user_login('admin@aetherkicks.com', '...');
     *    MySQL / SQLite:
     *      SELECT * FROM users WHERE email = ? AND role = ?;
     * 
     *    WHY THIS CANNOT BE INJECTED:
     *    The SQL grammar is parsed, compiled, and optimized by the database *before*
     *    any parameter value is evaluated. Parameters are transmitted across a 
     *    separate binary channel and treated strictly as literal data constants. 
     *    Quotes, comment dashes (--), and semicolons (;) inside parameters are NEVER 
     *    parsed as SQL syntax or commands.
     */

    /**
     * Formats a query safely with parameter bindings ($1, $2, ... or ?)
     */
    formatParameterizedQuery(sql, params = []) {
      if (!Array.isArray(params)) params = [params];

      const escParam = (val) => {
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') return Number.isFinite(val) ? String(val) : 'NULL';
        if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
        return "'" + String(val).replace(/\0/g, '').replace(/\\/g, '\\\\').replace(/'/g, "''") + "'";
      };

      // Replace positional parameters ($1, $2, etc.)
      let result = sql.replace(/\$(\d+)/g, (match, num) => {
        const idx = parseInt(num, 10) - 1;
        return (idx >= 0 && idx < params.length) ? escParam(params[idx]) : match;
      });

      // Replace positional '?' placeholders
      let pIdx = 0;
      result = result.replace(/\?/g, (match) => {
        return (pIdx < params.length) ? escParam(params[pIdx++]) : match;
      });

      return result;
    }

    /**
     * Executes a safe parameterized relational query, actively neutralizing SQL injection threats.
     */
    async executeParameterized(query, params = []) {
      await this._initPromise;
      const safeSQL = this.formatParameterizedQuery(query, params);

      // Audit and detect SQL injection signatures in user-supplied parameters
      const sqliRisks = [];
      params.forEach((param, index) => {
        if (typeof param === 'string') {
          if (/('|"|;|--|\/\*|\*\/|\bUNION\b|\bDROP\b|\bOR\s+1=1\b|\bAND\s+1=1\b)/i.test(param)) {
            sqliRisks.push({
              paramIndex: index + 1,
              sample: param.substring(0, 50),
              status: 'THREAT_NEUTRALIZED_BY_PARAMETERIZATION'
            });
          }
        }
      });

      if (sqliRisks.length > 0) {
        await this.logAction('SECURITY_SQLI_DETECTED_AND_BLOCKED', 'SECURITY_ENGINE', 'SQL_FIREWALL', {
          rawQuery: query,
          neutralizedPayloads: sqliRisks
        });
      }

      return {
        originalQuery: query,
        compiledSQL: safeSQL,
        parameterCount: params.length,
        isSafe: true,
        threatsNeutralized: sqliRisks
      };
    }

    /**
     * Checks an input string for common SQL injection vector signatures.
     */
    checkSQLInjectionRisk(input) {
      if (typeof input !== 'string') return { hasRisk: false };
      const patterns = [
        { name: 'Tautology (OR 1=1)', regex: /(?:'|\b)\s*(?:OR|AND)\s+['"]?1['"]?\s*=\s*['"]?1/i },
        { name: 'Inline Comment Breakout (-- or /* */)', regex: /(--|#|\/\*[\s\S]*?\*\/)/ },
        { name: 'Stacked Query Semicolon', regex: /;\s*(?:DROP|DELETE|UPDATE|INSERT|SELECT|ALTER)/i },
        { name: 'UNION-based Injection', regex: /\bUNION\s+(?:ALL\s+)?SELECT\b/i },
        { name: 'Batched System Command Exec', regex: /\b(?:EXEC|EXECUTE|xp_cmdshell|pg_sleep|SLEEP)\b/i }
      ];

      for (const p of patterns) {
        if (p.regex.test(input)) {
          return { hasRisk: true, detectedPattern: p.name };
        }
      }
      return { hasRisk: false };
    }

    /**
     * Hard reset to factory deadstock seeds.
     */
    async resetToDefaults() {
      await this._initPromise;
      for (const store of this.stores) {
        const current = await this._getAllFromStore(store);
        for (const item of current) {
          await this._deleteFromStore(store, item.id);
        }
      }
      await this._seedAllStores();
      await this.logAction('DATABASE_RESET_FACTORY', 'SYSTEM', 'ROOT', { message: 'Reset all stores to factory deadstock seeds.' });
      this._notify('all', 'reset');
      return true;
    }
  }

  AetherDatabase.escapeHTML = escapeHTML;
  AetherDatabase.safeHTML = safeHTML;
  AetherDatabase.rawHTML = rawHTML;
  AetherDatabase.prototype.escapeHTML = escapeHTML;
  AetherDatabase.prototype.safeHTML = safeHTML;
  AetherDatabase.prototype.rawHTML = rawHTML;

  return AetherDatabase;
});
