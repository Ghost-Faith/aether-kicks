-- ==============================================================================
-- AETHER KICKS - RELATIONAL DATABASE SCHEMA
-- Production-grade schema compatible with PostgreSQL, SQLite, & Supabase
-- Target System: Luxury Sneakerhead Archive, 3D Atelier, & Vault Authentication
-- Version: 1.0.0 (Production Release 2026)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. USERS & COLLECTORS
-- VIP Member Tiers, Authentication, and Sizing Profiles
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'collector' CHECK (role IN ('admin', 'collector', 'vip_member')),
    preferred_size VARCHAR(32) DEFAULT 'EU 42 (US 8.5)',
    address VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(32),
    country VARCHAR(100) DEFAULT 'Portugal',
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. SHOES / PRODUCTS (ARCHIVE & RUNWAY CATALOG)
-- Authenticated Deadstock Grails with Holographic Lighting & NFC Tokens
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shoes (
    id VARCHAR(64) PRIMARY KEY, -- Slug identifier: 'chicago', 'travis-fragment', etc.
    name VARCHAR(255) NOT NULL,
    silhouette VARCHAR(64) NOT NULL CHECK (silhouette IN ('High', 'Low', 'Mid', 'AJ4')),
    colorway VARCHAR(255) NOT NULL,
    style_code VARCHAR(64) NOT NULL UNIQUE,
    retail_price DECIMAL(10,2) NOT NULL,
    vault_price DECIMAL(10,2) NOT NULL,
    market_trend_pct VARCHAR(32) DEFAULT '+0.0%',
    year VARCHAR(32) NOT NULL,
    story TEXT,
    image_url VARCHAR(500) NOT NULL,
    theme_color VARCHAR(32) NOT NULL,
    glow_color VARCHAR(64) NOT NULL,
    category VARCHAR(32) NOT NULL CHECK (category IN ('runway', 'grid', 'drop', 'bespoke')),
    condition_grade VARCHAR(64) NOT NULL DEFAULT 'Deadstock Grade A+' CHECK (condition_grade IN ('Deadstock Grade A+', 'Deadstock Grade A', 'Near Mint')),
    nfc_token VARCHAR(128) UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transparent view mapping 'products' to 'shoes'
CREATE VIEW IF NOT EXISTS products AS 
SELECT * FROM shoes;

-- ------------------------------------------------------------------------------
-- 3. SHOE INVENTORY
-- Granular European (EU/PT) & US Size Stock with Reservation Locks
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shoe_inventory (
    id VARCHAR(64) PRIMARY KEY,
    shoe_id VARCHAR(64) NOT NULL REFERENCES shoes(id) ON DELETE CASCADE,
    size_eu VARCHAR(10) NOT NULL,
    size_us VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    CONSTRAINT uq_shoe_size UNIQUE (shoe_id, size_eu)
);

-- ------------------------------------------------------------------------------
-- 4. ORDERS
-- Cryptographically Verified Orders with Forensic Check Lifecycle
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY, -- Formatted: ORD-2026-XXXX
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(64) NOT NULL,
    promo_code VARCHAR(64),
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'forensic_check', 'authenticated', 'dispatched', 'delivered')),
    tracking_number VARCHAR(128) UNIQUE,
    nfc_certificate_id VARCHAR(128) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 5. ORDER ITEMS
-- Line Items Linked to Grails and Physical Sizes
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    shoe_id VARCHAR(64) NOT NULL REFERENCES shoes(id),
    size_eu VARCHAR(10) NOT NULL,
    size_us VARCHAR(10) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0)
);

-- ------------------------------------------------------------------------------
-- 6. HYPE DROPS
-- High-Speed Countdown Drops with Allocated Vault Stock
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hype_drops (
    id VARCHAR(64) PRIMARY KEY,
    shoe_id VARCHAR(64) NOT NULL REFERENCES shoes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    drop_time TIMESTAMP NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_allocated INTEGER NOT NULL CHECK (stock_allocated >= 0),
    status VARCHAR(32) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended'))
);

-- ------------------------------------------------------------------------------
-- 7. BESPOKE COMMISSIONS
-- Customizer 3D Atelier Crafting Orders & Leather Specs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bespoke_commissions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    base_silhouette VARCHAR(64) NOT NULL,
    base_leather_color VARCHAR(32) NOT NULL,
    swoosh_color VARCHAR(32) NOT NULL,
    laces_color VARCHAR(32) NOT NULL,
    custom_engraving VARCHAR(128),
    status VARCHAR(32) NOT NULL DEFAULT 'in_crafting' CHECK (status IN ('requested', 'in_crafting', 'quality_inspection', 'completed', 'delivered')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 8. AUDIT LOGS
-- Immutable Security & Vault Modification Trail
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    admin_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(128) NOT NULL,
    entity VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64),
    details_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR HIGH-PERFORMANCE VAULT RETRIEVAL
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_shoes_silhouette ON shoes(silhouette);
CREATE INDEX IF NOT EXISTS idx_shoes_category ON shoes(category);
CREATE INDEX IF NOT EXISTS idx_shoes_is_active ON shoes(is_active);
CREATE INDEX IF NOT EXISTS idx_inventory_shoe_id ON shoe_inventory(shoe_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_shoe_id ON order_items(shoe_id);
CREATE INDEX IF NOT EXISTS idx_hype_drops_status ON hype_drops(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
