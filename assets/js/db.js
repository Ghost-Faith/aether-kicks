/**
 * AETHER KICKS - Universal Sneaker Database
 * Centrally shared across Cart, 3D Engines, and Storefront
 */

window.SNEAKERS_DB = window.SNEAKERS_DB || {
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
    story: 'The shoe that started the revolution. Banned by the NBA in 1985, embraced by culture forever.',
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
    story: 'Regal intensity. Clean white quarter panels balanced with rich royal amethyst tumbled leather.',
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
    story: 'Paying homage to MJ alma mater. Soft nubuck leather enveloped in signature Tar Heel sky blue.',
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
    glow: 'rgba(220, 38, 38, 0.45)',
    year: '2020 / 2026',
    story: 'Bold emerald swagger with gym red embroidered tongue tab accents on pitch black grain leather.',
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
    story: 'The stealth icon inspired by MJ predatory nickname. Sumptuous black nubuck and graphite Jumpman.',
    sizes: ['40', '40.5', '41', '42', '42.5', '43', '44', '45']
  }
};

// Update all shoes in SNEAKERS_DB to have standard Portuguese EU sizes
Object.values(window.SNEAKERS_DB).forEach(shoe => {
  shoe.sizes = ['40', '40.5', '41', '42', '42.5', '43', '44', '45'];
});

var SNEAKERS_DB = window.SNEAKERS_DB;

/**
 * AETHER SNEAKER SIZING & CONVERSION ENGINE
 * European / Portuguese sizing (EU/PT) master standard with US, UK, and CM conversions
 */
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
window.findSizeEntry = function(value, preferredUnit = 'eu') {
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
window.formatSizeForUnit = function(entry, unit = 'EU') {
  if (!entry) return '';
  const u = (unit || 'EU').toUpperCase();
  if (u === 'EU' || u === 'PT' || u === 'EU / PT') return `EU ${entry.eu}`;
  if (u === 'US') return `US ${entry.us}`;
  if (u === 'UK') return `UK ${entry.uk}`;
  if (u === 'CM') return `${entry.cm} cm`;
  return `EU ${entry.eu}`;
};

// Helper to get secondary conversion info
window.formatSecondarySize = function(entry, unit = 'EU') {
  if (!entry) return '';
  const u = (unit || 'EU').toUpperCase();
  if (u === 'EU' || u === 'PT' || u === 'EU / PT') return `US ${entry.us}`;
  if (u === 'US') return `EU ${entry.eu}`;
  if (u === 'UK') return `EU ${entry.eu}`;
  if (u === 'CM') return `EU ${entry.eu}`;
  return `US ${entry.us}`;
};

// Helper to format complete multi-standard size label
window.formatFullSizeString = function(entry) {
  if (!entry) return 'EU 42 (US 8.5 • UK 7.5 • 26.5 cm)';
  return `EU ${entry.eu} (US ${entry.us} • UK ${entry.uk} • ${entry.cm} cm)`;
};

