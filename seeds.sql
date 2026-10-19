-- ==============================================================================
-- AETHER KICKS - VAULT SEED DATA & AUTHENTICATED GRAILS
-- Production Seed Records for PostgreSQL, SQLite & In-Memory Engines
-- Version: 1.0.0 (Production Release 2026)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SEED USERS
-- Default Credentials:
-- Admin:    admin@aetherkicks.com     / aether2026
-- VIP:      collector@aetherkicks.com / grailpass
-- ------------------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, full_name, role, preferred_size, address, city, postal_code, country, phone, created_at, updated_at)
VALUES 
('usr_admin_001', 'admin@aetherkicks.com', '$2a$12$e7kK4zWv3V9Q4q1gJtLeReR3K2LyF0QzJ3yF5qGq2n1w8vX70e', 'Atelier Vault Master', 'admin', 'EU 42 (US 8.5)', 'Avenida da Liberdade 210', 'Lisboa', '1250-142', 'Portugal', '+351 912 345 678', '2026-01-01 00:00:00', '2026-01-01 00:00:00'),
('usr_vip_002', 'collector@aetherkicks.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Matheus Silva VIP', 'vip_member', 'EU 43 (US 9.5)', 'Rua de Santa Catarina 45', 'Porto', '4000-441', 'Portugal', '+351 934 567 890', '2026-01-10 12:30:00', '2026-01-10 12:30:00')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. SEED SHOES (AUTHENTICATED LUXURY GRAILS)
-- ------------------------------------------------------------------------------
INSERT INTO shoes (id, name, silhouette, colorway, style_code, retail_price, vault_price, market_trend_pct, year, story, image_url, theme_color, glow_color, category, condition_grade, nfc_token, is_active, created_at, updated_at)
VALUES
(
    'chicago',
    'Air Jordan 1 Retro High OG',
    'High',
    'Chicago (Varsity Red)',
    '555088-101',
    180.00,
    480.00,
    '+14.8%',
    '1985 / 2026',
    'The shoe that ignited sneaker culture. Banned by the NBA in 1985, reborn with museum-grade full-grain Italian calfskin, archival stitch density, and authentic high-cut collar proportions.',
    'assets/images/jordan-chicago.png',
    '#dc2626',
    'rgba(220, 38, 38, 0.45)',
    'runway',
    'Deadstock Grade A+',
    'NFC-AETH-8501-CHI',
    1,
    '2026-01-01 10:00:00',
    '2026-01-01 10:00:00'
),
(
    'purple',
    'Air Jordan 1 Retro High OG',
    'High',
    'Court Purple 2.0',
    '555088-500',
    170.00,
    365.00,
    '+8.2%',
    '2020 / 2026',
    'Regal intensity. Clean optical-white quarter panels balanced with rich royal amethyst tumbled leather overlays, pitch-black collar padding, and forensic colorway certification.',
    'assets/images/jordan-purple.png',
    '#9333ea',
    'rgba(147, 51, 234, 0.45)',
    'grid',
    'Deadstock Grade A+',
    'NFC-AETH-5002-PUR',
    1,
    '2026-01-02 10:00:00',
    '2026-01-02 10:00:00'
),
(
    'blue',
    'Air Jordan 1 Retro High OG',
    'High',
    'University Blue / Obsidian',
    '555088-134',
    170.00,
    395.00,
    '+11.4%',
    '2021 / 2026',
    'Paying homage to MJ alma mater. Sumptuous micro-brushed suede enveloped in signature Tar Heel sky blue, paired with tumbled sail underlays and midnight obsidian swoosh contours.',
    'assets/images/jordan-blue.png',
    '#0284c7',
    'rgba(2, 132, 199, 0.45)',
    'grid',
    'Deadstock Grade A+',
    'NFC-AETH-1343-UNC',
    1,
    '2026-01-03 10:00:00',
    '2026-01-03 10:00:00'
),
(
    'green',
    'Air Jordan 1 Retro High OG',
    'High',
    'Pine Green 2.0',
    '555088-030',
    170.00,
    340.00,
    '+5.7%',
    '2020 / 2026',
    'Bold emerald swagger with gym red embroidered leather tongue tabs on pitch black grain leather. Hand-finished edge dyeing and pristine archival box packaging.',
    'assets/images/jordan-green.png',
    '#16a34a',
    'rgba(22, 163, 74, 0.45)',
    'grid',
    'Deadstock Grade A',
    'NFC-AETH-0304-PNE',
    1,
    '2026-01-04 10:00:00',
    '2026-01-04 10:00:00'
),
(
    'orange',
    'Air Jordan 1 Retro High OG',
    'High',
    'Reverse Shattered Backboard',
    '555088-113',
    160.00,
    620.00,
    '+22.3%',
    '2016 / 2026',
    'Commemorating the 1985 exhibition game in Trieste, Italy where MJ broke the plexiglass backboard into shards. Renowned for possessing the butter-soft tumbled leather benchmark in AJ1 lore.',
    'assets/images/jordan-orange.png',
    '#ea580c',
    'rgba(234, 88, 12, 0.45)',
    'grid',
    'Deadstock Grade A+',
    'NFC-AETH-1135-SBB',
    1,
    '2026-01-05 10:00:00',
    '2026-01-05 10:00:00'
),
(
    'shadow',
    'Air Jordan 4 Retro',
    'AJ4',
    'Black Cat (Triple Black)',
    'CU1110-010',
    190.00,
    740.00,
    '+31.2%',
    '2006 / 2020',
    'The stealth icon inspired by MJ predatory nickname. Sumptuous triple-black nubuck, molded TPU eyestay wings, graphite Jumpman heel badge, and visible Air cushioning.',
    'assets/images/jordan-shadow.png',
    '#71717a',
    'rgba(113, 113, 122, 0.45)',
    'grid',
    'Deadstock Grade A+',
    'NFC-AETH-0106-CAT',
    1,
    '2026-01-06 10:00:00',
    '2026-01-06 10:00:00'
),
(
    'travis-fragment',
    'Travis Scott x Fragment Design AJ1 Low',
    'Low',
    'Military Blue / Sail / Obsidian',
    'DM7866-140',
    150.00,
    1450.00,
    '+48.6%',
    '2021 / 2026',
    'The pinnacle collaboration uniting Cactus Jack and Hiroshi Fujiwara. Features reverse oversized leather swoosh, yellowed vintage sail midsole, and dual debossed Cactus Jack and Fragment bolt insignia.',
    'assets/images/jordan-blue.png',
    '#1d4ed8',
    'rgba(29, 78, 216, 0.45)',
    'drop',
    'Deadstock Grade A+',
    'NFC-AETH-7866-FRG',
    1,
    '2026-01-07 10:00:00',
    '2026-01-07 10:00:00'
),
(
    'dior-high',
    'Air Jordan 1 Retro High Dior',
    'High',
    'Dior Grey / Cream White',
    'CN8607-002',
    2000.00,
    5800.00,
    '+19.5%',
    '2020 / 2026',
    'Handcrafted in Italy by Dior atelier artisans using Dior grey calfskin, jacquard Dior Oblique monogram woven swooshes, hand-painted leather edges, and translucent ice outsoles with dual co-branding.',
    'assets/images/jordan-shadow.png',
    '#94a3b8',
    'rgba(148, 163, 184, 0.45)',
    'runway',
    'Deadstock Grade A+',
    'NFC-AETH-8607-DIO',
    1,
    '2026-01-08 10:00:00',
    '2026-01-08 10:00:00'
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. SEED SHOE INVENTORY (EU 38 to 46 for all 8 grails)
-- Sizing Standard: European / Portuguese (EU/PT) Master Standard with US Conversion
-- ------------------------------------------------------------------------------
INSERT INTO shoe_inventory (id, shoe_id, size_eu, size_us, quantity, reserved_quantity)
VALUES
-- Chicago 1985
('inv_chi_38',   'chicago', '38',   '5.5',  3, 0),
('inv_chi_385',  'chicago', '38.5', '6',    4, 0),
('inv_chi_39',   'chicago', '39',   '6.5',  5, 0),
('inv_chi_40',   'chicago', '40',   '7',    8, 1),
('inv_chi_405',  'chicago', '40.5', '7.5',  7, 0),
('inv_chi_41',   'chicago', '41',   '8',   12, 1),
('inv_chi_42',   'chicago', '42',   '8.5', 15, 2),
('inv_chi_425',  'chicago', '42.5', '9',   10, 0),
('inv_chi_43',   'chicago', '43',   '9.5', 14, 1),
('inv_chi_44',   'chicago', '44',   '10',   9, 0),
('inv_chi_445',  'chicago', '44.5', '10.5', 6, 0),
('inv_chi_45',   'chicago', '45',   '11',   8, 0),
('inv_chi_46',   'chicago', '46',   '12',   4, 0),

-- Court Purple 2.0
('inv_pur_38',   'purple', '38',   '5.5',  2, 0),
('inv_pur_39',   'purple', '39',   '6.5',  4, 0),
('inv_pur_40',   'purple', '40',   '7',    6, 0),
('inv_pur_405',  'purple', '40.5', '7.5',  5, 0),
('inv_pur_41',   'purple', '41',   '8',    8, 0),
('inv_pur_42',   'purple', '42',   '8.5', 11, 1),
('inv_pur_425',  'purple', '42.5', '9',    7, 0),
('inv_pur_43',   'purple', '43',   '9.5',  9, 0),
('inv_pur_44',   'purple', '44',   '10',   6, 0),
('inv_pur_45',   'purple', '45',   '11',   5, 0),
('inv_pur_46',   'purple', '46',   '12',   2, 0),

-- University Blue
('inv_blu_38',   'blue', '38',   '5.5',  3, 0),
('inv_blu_39',   'blue', '39',   '6.5',  5, 0),
('inv_blu_40',   'blue', '40',   '7',    7, 0),
('inv_blu_405',  'blue', '40.5', '7.5',  6, 0),
('inv_blu_41',   'blue', '41',   '8',   10, 1),
('inv_blu_42',   'blue', '42',   '8.5', 12, 1),
('inv_blu_425',  'blue', '42.5', '9',    8, 0),
('inv_blu_43',   'blue', '43',   '9.5', 10, 0),
('inv_blu_44',   'blue', '44',   '10',   7, 0),
('inv_blu_45',   'blue', '45',   '11',   6, 0),
('inv_blu_46',   'blue', '46',   '12',   3, 0),

-- Pine Green 2.0
('inv_grn_39',   'green', '39',   '6.5',  3, 0),
('inv_grn_40',   'green', '40',   '7',    5, 0),
('inv_grn_41',   'green', '41',   '8',    8, 0),
('inv_grn_42',   'green', '42',   '8.5', 10, 0),
('inv_grn_425',  'green', '42.5', '9',    6, 0),
('inv_grn_43',   'green', '43',   '9.5',  8, 0),
('inv_grn_44',   'green', '44',   '10',   5, 0),
('inv_grn_45',   'green', '45',   '11',   4, 0),

-- Reverse Shattered Backboard
('inv_ora_38',   'orange', '38',   '5.5',  2, 0),
('inv_ora_39',   'orange', '39',   '6.5',  3, 0),
('inv_ora_40',   'orange', '40',   '7',    5, 0),
('inv_ora_405',  'orange', '40.5', '7.5',  4, 0),
('inv_ora_41',   'orange', '41',   '8',    6, 1),
('inv_ora_42',   'orange', '42',   '8.5',  8, 0),
('inv_ora_425',  'orange', '42.5', '9',    5, 0),
('inv_ora_43',   'orange', '43',   '9.5',  7, 0),
('inv_ora_44',   'orange', '44',   '10',   4, 0),
('inv_ora_45',   'orange', '45',   '11',   3, 0),

-- Black Cat 4
('inv_cat_39',   'shadow', '39',   '6.5',  3, 0),
('inv_cat_40',   'shadow', '40',   '7',    6, 0),
('inv_cat_405',  'shadow', '40.5', '7.5',  5, 0),
('inv_cat_41',   'shadow', '41',   '8',    9, 0),
('inv_cat_42',   'shadow', '42',   '8.5', 12, 1),
('inv_cat_425',  'shadow', '42.5', '9',    7, 0),
('inv_cat_43',   'shadow', '43',   '9.5', 10, 0),
('inv_cat_44',   'shadow', '44',   '10',   7, 0),
('inv_cat_45',   'shadow', '45',   '11',   5, 0),
('inv_cat_46',   'shadow', '46',   '12',   2, 0),

-- Travis Scott x Fragment Low
('inv_frg_38',   'travis-fragment', '38',   '5.5',  2, 0),
('inv_frg_39',   'travis-fragment', '39',   '6.5',  3, 0),
('inv_frg_40',   'travis-fragment', '40',   '7',    4, 0),
('inv_frg_41',   'travis-fragment', '41',   '8',    5, 0),
('inv_frg_42',   'travis-fragment', '42',   '8.5',  6, 1),
('inv_frg_425',  'travis-fragment', '42.5', '9',    4, 0),
('inv_frg_43',   'travis-fragment', '43',   '9.5',  5, 0),
('inv_frg_44',   'travis-fragment', '44',   '10',   3, 0),
('inv_frg_45',   'travis-fragment', '45',   '11',   2, 0),

-- Air Jordan 1 Retro High Dior
('inv_dio_40',   'dior-high', '40',   '7',    1, 0),
('inv_dio_41',   'dior-high', '41',   '8',    2, 0),
('inv_dio_42',   'dior-high', '42',   '8.5',  3, 0),
('inv_dio_43',   'dior-high', '43',   '9.5',  2, 0),
('inv_dio_44',   'dior-high', '44',   '10',   1, 0)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. SEED SAMPLE PAST ORDERS (CRYPTOGRAPHICALLY AUTHENTICATED)
-- ------------------------------------------------------------------------------
INSERT INTO orders (id, user_id, customer_name, customer_email, shipping_address, payment_method, promo_code, subtotal, discount, total, status, tracking_number, nfc_certificate_id, created_at)
VALUES
(
    'ORD-2026-8812',
    'usr_vip_002',
    'Matheus Silva',
    'collector@aetherkicks.com',
    'Rua de Santa Catarina 45, 4000-441 Porto, Portugal',
    'Apple Pay',
    'GRAIL20',
    480.00,
    96.00,
    384.00,
    'delivered',
    'AETH-FEDEX-99210-PT',
    'NFC-AETH-8501-VERIFIED',
    '2026-02-14 14:22:00'
),
(
    'ORD-2026-9045',
    'usr_vip_002',
    'Matheus Silva',
    'collector@aetherkicks.com',
    'Rua de Santa Catarina 45, 4000-441 Porto, Portugal',
    'MB WAY',
    NULL,
    1450.00,
    0.00,
    1450.00,
    'dispatched',
    'AETH-DHL-44819-LUX',
    'NFC-AETH-9045-VERIFIED',
    '2026-03-01 18:05:00'
),
(
    'ORD-2026-9128',
    'usr_vip_002',
    'Matheus Silva',
    'collector@aetherkicks.com',
    'Rua de Santa Catarina 45, 4000-441 Porto, Portugal',
    'Credit Card (Stripe)',
    'VIPACCESS',
    620.00,
    62.00,
    558.00,
    'forensic_check',
    'AETH-SECURE-3312-INSP',
    'NFC-AETH-9128-PENDING',
    '2026-03-15 09:40:00'
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 5. SEED ORDER ITEMS
-- ------------------------------------------------------------------------------
INSERT INTO order_items (id, order_id, shoe_id, size_eu, size_us, unit_price, quantity)
VALUES
('item_8812_1', 'ORD-2026-8812', 'chicago', '42', '8.5', 480.00, 1),
('item_9045_1', 'ORD-2026-9045', 'travis-fragment', '43', '9.5', 1450.00, 1),
('item_9128_1', 'ORD-2026-9128', 'orange', '41', '8', 620.00, 1)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 6. SEED ACTIVE HYPE DROP
-- ------------------------------------------------------------------------------
INSERT INTO hype_drops (id, shoe_id, title, drop_time, price, stock_allocated, status)
VALUES
(
    'drop_travis_frag_2026',
    'travis-fragment',
    'Travis Scott x Fragment AJ1 Low - Midnight Vault Drop',
    '2026-04-01 23:00:00',
    1450.00,
    25,
    'live'
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 7. SEED BESPOKE 3D ATELIER COMMISSION
-- ------------------------------------------------------------------------------
INSERT INTO bespoke_commissions (id, user_id, client_name, email, base_silhouette, base_leather_color, swoosh_color, laces_color, custom_engraving, status, created_at)
VALUES
(
    'BESPOKE-2026-001',
    'usr_vip_002',
    'Matheus Silva',
    'collector@aetherkicks.com',
    'Air Jordan 1 High OG',
    '#111827',
    '#eab308',
    '#000000',
    'MEMENTO VIVERE',
    'in_crafting',
    '2026-03-10 16:30:00'
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 8. SEED AUDIT LOGS
-- ------------------------------------------------------------------------------
INSERT INTO audit_logs (id, admin_id, action, entity, entity_id, details_json, created_at)
VALUES
(
    'log_boot_001',
    'usr_admin_001',
    'VAULT_GENESIS',
    'SYSTEM',
    'ROOT',
    '{"message": "Aether Kicks Relational Engine initialized with 8 authenticated grails."}',
    '2026-01-01 00:00:00'
),
(
    'log_nfc_002',
    'usr_admin_001',
    'NFC_PAIRING',
    'shoes',
    'chicago',
    '{"nfc_token": "NFC-AETH-8501-CHI", "hardware": "NTAG216 Cryptotag Verified"}',
    '2026-01-01 10:05:00'
),
(
    'log_drop_003',
    'usr_admin_001',
    'DROP_ACTIVATED',
    'hype_drops',
    'drop_travis_frag_2026',
    '{"stock_allocated": 25, "tier": "VIP_COLLECTOR_FIRST_ACCESS"}',
    '2026-03-31 23:59:00'
)
ON CONFLICT (id) DO NOTHING;
