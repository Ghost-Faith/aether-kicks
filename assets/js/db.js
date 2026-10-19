/**
 * ==============================================================================
 * AETHER KICKS - UNIVERSAL SNEAKER DATABASE & SIZING ARCHITECTURE
 * Synchronized with AetherRelationalClient (IndexedDB / LocalStorage Engine)
 * Centrally shared across Cart, 3D Canvas, Wishlist, Storefront & Admin
 * Version: 2.0.0 (Relational Upgrade 2026)
 * ==============================================================================
 */

// Baseline Sneaker Vault Memory Store (8 Authenticated Grails)
window.SNEAKERS_DB = window.SNEAKERS_DB || {
  'chicago': {
    id: 'chicago',
    name: 'Air Jordan 1 Retro High OG',
    silhouette: 'High',
    colorway: 'Chicago (Varsity Red)',
    styleCode: '555088-101',
    style_code: '555088-101',
    price: 480,
    vault_price: 480,
    retailPrice: 180,
    retail_price: 180,
    image: 'assets/images/jordan-chicago.png',
    image_url: 'assets/images/jordan-chicago.png',
    theme: '#dc2626',
    theme_color: '#dc2626',
    glow: 'rgba(220, 38, 38, 0.45)',
    glow_color: 'rgba(220, 38, 38, 0.45)',
    year: '1985 / 2026',
    story: 'The shoe that ignited sneaker culture. Banned by the NBA in 1985, reborn with museum-grade full-grain Italian calfskin, archival stitch density, and authentic high-cut collar proportions.',
    category: 'runway',
    condition_grade: 'Deadstock Grade A+',
    market_trend_pct: '+14.8%',
    nfc_token: 'NFC-AETH-8501-CHI',
    is_active: 1,
    sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45']
  },
  'purple': {
    id: 'purple',
    name: 'Air Jordan 1 Retro High OG',
    silhouette: 'High',
    colorway: 'Court Purple 2.0',
    styleCode: '555088-500',
    style_code: '555088-500',
    price: 365,
    vault_price: 365,
    retailPrice: 170,
    retail_price: 170,
    image: 'assets/images/jordan-purple.png',
    image_url: 'assets/images/jordan-purple.png',
    theme: '#9333ea',
    theme_color: '#9333ea',
    glow: 'rgba(147, 51, 234, 0.45)',
    glow_color: 'rgba(147, 51, 234, 0.45)',
    year: '2020 / 2026',
    story: 'Regal intensity. Clean optical-white quarter panels balanced with rich royal amethyst tumbled leather overlays, pitch-black collar padding, and forensic colorway certification.',
    category: 'grid',
    condition_grade: 'Deadstock Grade A+',
    market_trend_pct: '+8.2%',
    nfc_token: 'NFC-AETH-5002-PUR',
    is_active: 1,
    sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45']
  },
  'blue': {
    id: 'blue',
    name: 'Air Jordan 1 Retro High OG',
    silhouette: 'High',
    colorway: 'University Blue / Obsidian',
    styleCode: '555088-134',
    style_code: '555088-134',
    price: 395,
    vault_price: 395,
    retailPrice: 170,
    retail_price: 170,
    image: 'assets/images/jordan-blue.png',
    image_url: 'assets/images/jordan-blue.png',
    theme: '#0284c7',
    theme_color: '#0284c7',
    glow: 'rgba(2, 132, 199, 0.45)',
    glow_color: 'rgba(2, 132, 199, 0.45)',
    year: '2021 / 2026',
    story: 'Paying homage to MJ alma mater. Sumptuous micro-brushed suede enveloped in signature Tar Heel sky blue, paired with tumbled sail underlays and midnight obsidian swoosh contours.',
    category: 'grid',
    condition_grade: 'Deadstock Grade A+',
    market_trend_pct: '+11.4%',
    nfc_token: 'NFC-AETH-1343-UNC',
    is_active: 1,
    sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45']
  },
  'green': {
    id: 'green',
    name: 'Air Jordan 1 Retro High OG',
    silhouette: 'High',
    colorway: 'Pine Green 2.0',
    styleCode: '555088-030',
    style_code: '555088-030',
    price: 340,
    vault_price: 340,
    retailPrice: 170,
    retail_price: 170,
    image: 'assets/images/jordan-green.png',
    image_url: 'assets/images/jordan-green.png',
    theme: '#16a34a',
    theme_color: '#16a34a',
    glow: 'rgba(22, 163, 74, 0.45)',
    glow_color: 'rgba(22, 163, 74, 0.45)',
    year: '2020 / 2026',
    story: 'Bold emerald swagger with gym red embroidered leather tongue tabs on pitch black grain leather. Hand-finished edge dyeing and pristine archival box packaging.',
    category: 'grid',
    condition_grade: 'Deadstock Grade A',
    market_trend_pct: '+5.7%',
    nfc_token: 'NFC-AETH-0304-PNE',
    is_active: 1,
    sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45']
  },
  'orange': {
    id: 'orange',
    name: 'Air Jordan 1 Retro High OG',
    silhouette: 'High',
    colorway: 'Reverse Shattered Backboard',
    styleCode: '555088-113',
    style_code: '555088-113',
    price: 620,
    vault_price: 620,
    retailPrice: 160,
    retail_price: 160,
    image: 'assets/images/jordan-orange.png',
    image_url: 'assets/images/jordan-orange.png',
    theme: '#ea580c',
    theme_color: '#ea580c',
    glow: 'rgba(234, 88, 12, 0.45)',
    glow_color: 'rgba(234, 88, 12, 0.45)',
    year: '2016 / 2026',
    story: 'Commemorating the 1985 exhibition game in Trieste, Italy where MJ broke the plexiglass backboard into shards. Renowned for possessing the butter-soft tumbled leather benchmark in AJ1 lore.',
    category: 'grid',
    condition_grade: 'Deadstock Grade A+',
    market_trend_pct: '+22.3%',
    nfc_token: 'NFC-AETH-1135-SBB',
    is_active: 1,
    sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45']
  },
  'shadow': {
    id: 'shadow',
    name: 'Air Jordan 4 Retro',
    silhouette: 'AJ4',
    colorway: 'Black Cat (Triple Black)',
    styleCode: 'CU1110-010',
    style_code: 'CU1110-010',
    price: 740,
    vault_price: 740,
    retailPrice: 190,
    retail_price: 190,
    image: 'assets/images/jordan-shadow.png',
    image_url: 'assets/images/jordan-shadow.png',
    theme: '#71717a',
    theme_color: '#71717a',
    glow: 'rgba(113, 113, 122, 0.45)',
    glow_color: 'rgba(113, 113, 122, 0.45)',
    year: '2006 / 2020',
    story: 'The stealth icon inspired by MJ predatory nickname. Sumptuous triple-black nubuck, molded TPU eyestay wings, graphite Jumpman heel badge, and visible Air cushioning.',
    category: 'grid',
    condition_grade: 'Deadstock Grade A+',
    market_trend_pct: '+31.2%',
    nfc_token: 'NFC-AETH-0106-CAT',
    is_active: 1,
    sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45']
  },
  'travis-fragment': {
    id: 'travis-fragment',
    name: 'Travis Scott x Fragment Design AJ1 Low',
    silhouette: 'Low',
    colorway: 'Military Blue / Sail / Obsidian',
    styleCode: 'DM7866-140',
    style_code: 'DM7866-140',
    price: 1450,
    vault_price: 1450,
    retailPrice: 150,
    retail_price: 150,
    image: 'assets/images/jordan-blue.png',
    image_url: 'assets/images/jordan-blue.png',
    theme: '#1d4ed8',
    theme_color: '#1d4ed8',
    glow: 'rgba(29, 78, 216, 0.45)',
    glow_color: 'rgba(29, 78, 216, 0.45)',
    year: '2021 / 2026',
    story: 'The pinnacle collaboration uniting Cactus Jack and Hiroshi Fujiwara. Features reverse oversized leather swoosh, yellowed vintage sail midsole, and dual debossed Cactus Jack and Fragment bolt insignia.',
    category: 'drop',
    condition_grade: 'Deadstock Grade A+',
    market_trend_pct: '+48.6%',
    nfc_token: 'NFC-AETH-7866-FRG',
    is_active: 1,
    sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45']
  },
  'dior-high': {
    id: 'dior-high',
    name: 'Air Jordan 1 Retro High Dior',
    silhouette: 'High',
    colorway: 'Dior Grey / Cream White',
    styleCode: 'CN8607-002',
    style_code: 'CN8607-002',
    price: 5800,
    vault_price: 5800,
    retailPrice: 2000,
    retail_price: 2000,
    image: 'assets/images/jordan-shadow.png',
    image_url: 'assets/images/jordan-shadow.png',
    theme: '#94a3b8',
    theme_color: '#94a3b8',
    glow: 'rgba(148, 163, 184, 0.45)',
    glow_color: 'rgba(148, 163, 184, 0.45)',
    year: '2020 / 2026',
    story: 'Handcrafted in Italy by Dior atelier artisans using Dior grey calfskin, jacquard Dior Oblique monogram woven swooshes, hand-painted leather edges, and translucent ice outsoles with dual co-branding.',
    category: 'runway',
    condition_grade: 'Deadstock Grade A+',
    market_trend_pct: '+19.5%',
    nfc_token: 'NFC-AETH-8607-DIO',
    is_active: 1,
    sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45']
  }
};

// Global shorthand pointer
var SNEAKERS_DB = window.SNEAKERS_DB;

// ==============================================================================
// SYNCHRONIZATION WITH AETHER DATABASE ENGINE
// ==============================================================================

async function syncWithAetherDB() {
  if (window.AetherDB && typeof window.AetherDB.getShoes === 'function') {
    try {
      const shoes = await window.AetherDB.getShoes();
      if (shoes && shoes.length > 0) {
        shoes.forEach(shoe => {
          // Normalize properties to support legacy camelCase and relational snake_case
          shoe.price = shoe.vault_price !== undefined ? shoe.vault_price : shoe.price;
          shoe.vault_price = shoe.price;
          shoe.retailPrice = shoe.retail_price !== undefined ? shoe.retail_price : shoe.retailPrice;
          shoe.retail_price = shoe.retailPrice;
          shoe.image = shoe.image_url || shoe.image;
          shoe.image_url = shoe.image;
          shoe.theme = shoe.theme_color || shoe.theme;
          shoe.theme_color = shoe.theme;
          shoe.glow = shoe.glow_color || shoe.glow;
          shoe.glow_color = shoe.glow;
          shoe.styleCode = shoe.style_code || shoe.styleCode;
          shoe.style_code = shoe.styleCode;
          shoe.sizes = shoe.sizes || ['40', '40.5', '41', '42', '42.5', '43', '44', '45'];

          window.SNEAKERS_DB[shoe.id] = shoe;
        });
        window.dispatchEvent(new CustomEvent('sneakers:db:synced', { detail: { count: shoes.length } }));
      }
    } catch (err) {
      console.warn('[db.js] Error synchronizing with AetherDB:', err);
    }
  }
}

// Initial Sync attempt
if (typeof window !== 'undefined') {
  if (window.AetherDB) {
    syncWithAetherDB();
  } else if (typeof document !== 'undefined') {
    // Dynamic fallback load if database.js was not explicitly included
    const script = document.createElement('script');
    script.src = 'assets/js/database.js';
    script.async = true;
    script.onload = () => syncWithAetherDB();
    document.head.appendChild(script);
  }

  // Listen for real-time updates dispatched by AetherDB
  window.addEventListener('aether:db:updated', (e) => {
    if (e.detail && (e.detail.store === 'shoes' || e.detail.store === 'inventory' || e.detail.store === 'all')) {
      syncWithAetherDB();
    }
  });

  // Ensure sync occurs once DOM is ready if script tags are loaded asynchronously
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncWithAetherDB);
  }
}

// ==============================================================================
// AETHER SNEAKER SIZING & CONVERSION ENGINE
// European / Portuguese sizing (EU/PT) master standard with US, UK, and CM conversions
// ==============================================================================
window.AETHER_SIZING_TABLE = [
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

// Helper to look up a size entry by EU, US, UK, or CM value
window.findSizeEntry = function (value, preferredUnit = 'eu') {
  if (!value) return window.AETHER_SIZING_TABLE.find(s => s.eu === '42');
  if (typeof value === 'object' && value.eu) return value;

  const clean = String(value).replace(/^(EU|US|UK)\s*/i, '').replace(/\s*cm$/i, '').trim();
  const u = (preferredUnit || 'eu').toLowerCase();

  let match = window.AETHER_SIZING_TABLE.find(s => s[u] === clean);
  if (!match) {
    match = window.AETHER_SIZING_TABLE.find(s => s.eu === clean || s.us === clean || s.uk === clean || s.cm === clean);
  }
  return match || window.AETHER_SIZING_TABLE.find(s => s.eu === '42');
};

// Helper to format a size label for display in given unit
window.formatSizeForUnit = function (entry, unit = 'EU') {
  if (!entry) return '';
  const u = (unit || 'EU').toUpperCase();
  if (u === 'EU' || u === 'PT' || u === 'EU / PT') return `EU ${entry.eu}`;
  if (u === 'US') return `US ${entry.us}`;
  if (u === 'UK') return `UK ${entry.uk}`;
  if (u === 'CM') return `${entry.cm} cm`;
  return `EU ${entry.eu}`;
};

// Helper to get secondary conversion info
window.formatSecondarySize = function (entry, unit = 'EU') {
  if (!entry) return '';
  const u = (unit || 'EU').toUpperCase();
  if (u === 'EU' || u === 'PT' || u === 'EU / PT') return `US ${entry.us}`;
  if (u === 'US') return `EU ${entry.eu}`;
  if (u === 'UK') return `EU ${entry.eu}`;
  if (u === 'CM') return `EU ${entry.eu}`;
  return `US ${entry.us}`;
};

// Helper to format complete multi-standard size label
window.formatFullSizeString = function (entry) {
  if (!entry) return 'EU 42 (US 8.5 • UK 7.5 • 26.5 cm)';
  return `EU ${entry.eu} (US ${entry.us} • UK ${entry.uk} • ${entry.cm} cm)`;
};
