# AETHER KICKS // ATELIER VAULT OS

> **High-Fidelity Luxury Sneakerhead Marketplace, Forensic Authentication House & 3D WebGL Archive**

[![Production Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel)](https://aether-kicks.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20ES6%2B%20%7C%20Three.js-black?style=for-the-badge)](https://github.com/Ghost-Faith/aether-kicks)
[![Database](https://img.shields.io/badge/Database-IndexedDB%20%2B%20Relational%20Store-black?style=for-the-badge)](https://github.com/Ghost-Faith/aether-kicks)
[![Security Standard](https://img.shields.io/badge/Security-Cryptographic%20Passkey%20%7C%20CSP%20%7C%20Anti--XSS-black?style=for-the-badge)](https://github.com/Ghost-Faith/aether-kicks)

---

## 🏛️ Executive Overview

**AETHER KICKS** is an enterprise-grade digital flagship and archival marketplace engineered for rare sneakers, deadstock grails, and bespoke footwear. Built to international design standards (Awwwards, Nike SNKRS, GOAT, Sotheby's Luxury), the platform bridges haute couture aesthetics with forensic custody tracking, 3D WebGL hardware-accelerated visualization, and client-side relational data architecture.

The entire ecosystem operates without heavy backend dependencies, executing high-performance relational storage, dynamic ambient lighting, and interactive trading analytics natively in the browser.

---

## 💎 Core Architecture & Feature Matrix

### 1. The Runway Archive & Chromatic Ambient Engine (`index.html`)
* **Continuous Scroll Colorway Interpolation**: Computes mathematical transitions between iconic sneaker stops, smoothly adapting ambient halos, glass borders, and typography gradients in real time.
* **Featured Grail Runway**: Showcases authenticated deadstock grails including:
  * Air Jordan 1 Retro High OG "Chicago" (1985 Heritage)
  * Air Jordan 1 Retro High OG "Court Purple 2.0"
  * Air Jordan 1 Retro High OG "University Blue"
  * Air Jordan 1 Retro High OG "Pine Green 2.0"
  * Air Jordan 1 Retro High OG "Reverse Shattered Backboard"
  * Air Jordan 4 Retro "Black Cat" (Triple Black Nubuck)
* **Live Database Stock Badges**: Real-time inventory queries correlate available pairs directly onto runway cards, displaying active deadstock availability and scarcity alerts.

### 2. The Grail Vault (Square Grid Catalog)
* **Real-Time Search & Silhouette Filtering**: Instant client-side filtering across High OG, Low OG, Retro 4, and Bespoke silhouettes.
* **Quick-Buy Product Inspector**: Slide-up modal featuring multi-angle imagery, style codes (SKU), market appreciation rates, condition grading, and a dynamic sizing matrix (EU 38 to 46).
* **Inventory Scarcity Enforcement**: Sizes with zero stock are automatically flagged and disabled, preventing out-of-stock orders.

### 3. WebGL 3D Interactive Sneaker Studio (Three.js)
* **360° Orbit Inspection**: Hardware-accelerated 3D inspection with rotation, panning, and zoom controls.
* **Shader Material Modes**:
  * `Realistic`: Physically-Based Rendering (PBR) with leather grain and gloss finishes.
  * `Wireframe`: High-tech CAD wireframe structure highlighting model vertices.
  * `Hologram`: Glowing cybernetic mesh with chromatic aberration.
  * `X-Ray`: Semi-transparent scan visualizing internal cushioning units.
* **Studio Lighting Presets**: Switchable between Studio Neutral, Cyber Neon, Chicago Flare, and Sunset Amber.
* **4K Snapshot Exporter**: Single-click high-resolution PNG render generator.

### 4. Aether Bespoke Customizer Lab
* **Atelier 1-of-1 Configurator**: Dynamic customization of leather panels, Swoosh overlays, lace accents, and custom laser engravings.
* **Curated Heritage Palette**: 10 curated archival colorways with instant visual preview and bag integration.

### 5. Live Drops & Secondary Market Analytics
* **Live Drop Countdown HUD**: Precision countdown timer with millisecond telemetry for limited releases.
* **Cryptographic Raffle Simulator**: Interactive ballot submission generating verified ticket identifiers.
* **Historical Valuation Index**: Interactive SVG trading chart tracking secondary market appreciation over time, complete with acoustic feedback and floating data tooltips.

### 6. Collector Ecosystem & Authenticity Custody
* **Collector Profile Hub (`profile.html`)**: Personal vault containing transaction history, custody tracking numbers, and account preferences.
* **Wishlist Engine (`wishlist.html`)**: Instant heart toggle across Runway cards, Grid items, and Quick-Buy modals, synchronized with the global navigation badge and persistent across sessions.
* **Collector Bag & Express Checkout**: Slide-over drawer with real-time subtotal calculation, promo code validation (`GRAIL20`), verified shipping policies, and simulated order placement.
* **Forensic Authenticity Framework**: 14-point physical verification protocol and NFC Cryptoseal verification simulation.

---

## 🛡️ Enterprise Atelier Vault OS (Admin Panel)

Accessible at `admin.html`, the administrative control center provides full custody management and marketplace governance:

* **Cryptographic Passkey Security Gate**:
  * Strictly gated access requiring an authorized administrative passkey.
  * **Brute-Force Rate Limiting**: 3 consecutive failed attempts trigger an automated 10-minute terminal lockout with a live countdown timer.
  * **Session Timeout**: Auto-locks after 30 minutes of inactivity.
* **Overview HUD & Sales Analytics**:
  * Real-time calculation of total inventory value, custody pairs, and gross volume.
  * **Interactive Sales Velocity Chart**: Filterable by `30D`, `7D`, and `24H` intervals with interactive crosshair tooltips.
* **Sneaker Inventory Controller**:
  * Add, edit, and archive sneakers without manual code changes.
  * **Custom Color Personalization**: Dual-mode color picker featuring preset swatches, native color wheel, and direct HEX input.
  * **Size-Level Stock Matrix**: Granular inventory quantity management for sizes EU 38 through 46.
* **Order Custody & Dispatch Hub**:
  * Multi-stage order status tracker (`Pending Verification`, `Forensic Check`, `Authenticated`, `Dispatched`, `Delivered`).
  * Automatic generation of logistics tracking codes and digital NFC certificates.
  * **Printable Archival Certificate**: Dedicated `@media print` stylesheet formatting custody dossiers into museum-grade physical or PDF Certificates of Authenticity.
* **Team & Credential Governance**:
  * Interface to provision new administrators with Role-Based Access Control (RBAC).
  * Cryptographic SHA-256 passkey hashing via native Web Crypto API.
* **Relational Database Console**:
  * Live state inspector, executable SQL DDL/seeds export, and JSON backup/restore utilities.

---

## 🗄️ Database Architecture (`AetherDB`)

The application integrates an asynchronous relational client-side database engine located in `assets/js/database.js`:

```
┌────────────────────────────────────────────────────────┐
│                   AetherDatabase                       │
│      (IndexedDB: AetherKicksDB + Storage Fallback)     │
└──────────────┬───────────────────────────┬─────────────┘
               │                           │
       ┌───────┴───────┐           ┌───────┴───────┐
       ▼               ▼           ▼               ▼
   [shoes]        [inventory]   [users]         [orders]
   Catalog Data   Size Stocks   Collector/Admin  Custody Records
```

* **Object Stores**: `shoes`, `inventory`, `users`, `orders`, `drops`, `bespoke`, `auditLogs`.
* **Reactive Data Flow**: Dispatches custom DOM events (`aether:db:updated`) whenever catalog or stock data changes, triggering real-time UI synchronization without page refreshes.
* **Relational Reference Files**: SQL schema definition and seed data are maintained in `schema.sql` and `seeds.sql`.

---

## 🔒 Security Posture & Hardening

* **Content Security Policy & HTTP Headers (`vercel.json`)**:
  * `X-Frame-Options: DENY` (Clickjacking mitigation)
  * `X-Content-Type-Options: nosniff` (MIME-sniffing prevention)
  * `Referrer-Policy: strict-origin-when-cross-origin`
  * `Permissions-Policy: camera=(), microphone=(), geolocation=()`
* **Cross-Site Scripting (XSS) Prevention**: All dynamic user-supplied data is sanitized using strict HTML entity encoding before DOM insertion.
* **SQL Injection Mitigation**: Data export utilities apply strict string sanitization and character escaping.
* **Zero Credential Exposure**: Sensitive administrative passkeys and tokens are protected and never disclosed in client-facing assets.

---

## 📂 Project Directory Structure

```
aether-kicks/
├── index.html                   # Flagship Storefront, Runway, 3D Studio & Market HUD
├── about.html                   # Atelier Manifesto, Standards & Authentication Specs
├── profile.html                 # Collector Profile, Orders & Custody Vault
├── wishlist.html                # Saved Grails & Instant Checkout Gateway
├── login.html                   # Collector Authentication Terminal
├── register.html                # VIP Membership Registration Terminal
├── admin.html                   # Atelier Vault OS Administrative Dashboard
├── schema.sql                   # Relational Database Schema (DDL)
├── seeds.sql                    # Production Seed Records
├── vercel.json                  # Production Routing & HTTP Security Headers
├── assets/
│   ├── css/
│   │   ├── global.css           # Design Tokens, CSS Variables, Reset & Themed Selects
│   │   ├── store.css            # Storefront, Runway, Modals, Cart & HUD Styling
│   │   ├── admin.css            # Obsidian Admin Glassmorphism, Print Engine & Forms
│   │   ├── auth.css             # Login & Registration Split-Screen Layouts
│   │   └── profile-wishlist.css # Collector Hub & Wishlist Grid Layouts
│   ├── js/
│   │   ├── database.js          # AetherDB Relational Engine (IndexedDB + Storage)
│   │   ├── store.js             # Runway Navigation, Scroll Lerp & Stock Sync
│   │   ├── admin.js             # Vault OS Controller, Charts, RBAC & Stock Matrix
│   │   ├── cart.js              # Cart Drawer Manager & Quick-Buy Size Logic
│   │   ├── wishlist.js          # Wishlist Persistence & Global Counter
│   │   ├── analytics.js         # Interactive Valuation Index Chart & Tooltips
│   │   ├── three-scene.js       # Three.js 3D WebGL Sneaker Studio
│   │   ├── auth.js              # Client Session & Form Validation
│   │   └── db.js                # Sizing Tables & Catalog Helpers
│   └── images/                  # High-Resolution Transparent Footwear Renders
```

---

## ⚡ Deployment & Local Execution

The project requires no Node.js compilation, npm build steps, or external package managers.

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/Ghost-Faith/aether-kicks.git
   cd aether-kicks
   ```
2. Serve using any standard local web server (to permit WebGL assets and Web Workers to load cleanly):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node npx
   npx serve .
   ```
3. Open `http://localhost:8000` in any modern web browser.

### Production
Live deployments are hosted on Vercel with automatic continuous integration from the `main` branch.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information. Engineered for archival preservation and educational study of advanced web interface engineering.
