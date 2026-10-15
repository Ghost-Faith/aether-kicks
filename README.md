# AETHER KICKS - Luxury Sneakerhead 3D E-Commerce & Runway Experience

An ultra-premium, interactive e-commerce web platform engineered with **HTML5, CSS3, Modern Vanilla JavaScript, and Three.js (r128 WebGL)**. Built to Awwwards / Nike SNKRS / GOAT standards with high-fidelity visual design, 3D interactivity, and smooth chromatic transitions.

---

## 🌟 Key Features & Expansions

### 1. 🧊 Full WebGL 3D Sneaker Studio (Three.js & OrbitControls)
- **Interactive 360° Orbit Inspection**: Freely rotate, pan, and zoom around high-detail 3D procedural sneaker silhouettes.
- **Display Modes**:
  - `Realistic`: PBR materials, leather grain, gloss accents, and dynamic cast shadows.
  - `Wireframe`: High-tech CAD wireframe structure highlighting geometry vertices.
  - `Hologram`: Glowing neon holographic mesh with chromatic aberration.
  - `X-Ray`: Semi-transparent spectral scan of inner sneaker cushioning and air pockets.
- **Lighting Studio Presets**:
  - `Daylight`: Studio neutral key lighting.
  - `Cyber Neon`: Dual cyan & magenta neon cyber stage.
  - `Chicago Flare`: High-energy crimson stadium spotlights.
  - `Golden Hour`: Warm amber sunset rim lighting.
- **4K Snapshot Exporter**: Directly capture and download high-resolution PNG renders with one click.
- **Available Across All Pages**: Accessible from every shoe on the runway (`index.html`), in the Chicago login pane (`login.html`), and in the Court Purple register pane (`register.html`).

---

### 2. 🌈 Continuous Mathematical Scroll Interpolation (Smooth RGB Lerping)
- **Gradual Color Shift**: Rather than abrupt discrete background jumps, the runway mathematically computes scroll progress ($t \in [0, 1]$) between adjacent shoe stops using smoothstep interpolation ($t^2(3-2t)$):
  - **Red (Chicago)** $\rightarrow$ **Magenta** $\rightarrow$ **Purple (Court Purple)** $\rightarrow$ **Indigo** $\rightarrow$ **Blue (University Blue)** $\rightarrow$ **Green (Pine Green)** $\rightarrow$ **Orange (Shattered)** $\rightarrow$ **Stealth Onyx (Black Cat 4)**.
- **Synchronized Ambience**: Every CSS variable (`--theme-primary`, `--theme-glow`, `--theme-bg`) smoothly glides along intermediate hues, adapting halos, borders, button gradients, and drop shadows in real-time.

---

### 3. 👟 Image Correction: Authentic Air Jordan 4 "Black Cat"
- **Fixed Image Bug**: Replaced the previous mismatched board game box image (`jordan-shadow.png`) with an authentic, high-resolution, transparent PNG of the **Air Jordan 4 Retro "Black Cat" (Triple Black)**.
- Clean transparent silhouette with velvety nubuck, matte netting, graphite Jumpman emblems, and visible heel Air cushioning.

---

### 4. 🎨 Aether Bespoke Customizer Lab (1-of-1 Atelier)
- **Interactive Design Studio**: Choose between six sneaker components:
  - *Overlays / Heel*
  - *Base Leather*
  - *Swoosh*
  - *Ankle Collar*
  - *Midsole*
  - *Laces*
- **Curated Heritage Palette**: 10 distinct colorways (Varsity Red, Court Purple, University Blue, Pine Green, Starfish Orange, Triple Black, Pure White, Sail Cream, Metallic Gold, Neon Cyber).
- **Instant Bag Integration**: Directly mints and adds the custom 1-of-1 pair to the shopping bag ($520 USD).

---

### 5. ⏱️ Live Drop Countdown & Cryptographic Raffle Simulator
- **High-Precision Timer**: Real-time drop countdown displaying hours, minutes, seconds, and live running milliseconds (`ms`).
- **Cryptographic Raffle Ballot**: Interactive entry form that calculates SHA-256 entropy ticket IDs (e.g. `RAF-74921-SNKRS`), registers entries on the simulated drop ledger, and celebrates with confetti effects.

---

### 6. 📈 Secondary Market Valuation Index & Interactive Chart
- **Historical Price Tracker**: Visualizes 12-month appreciation trends for grails (e.g., Air Jordan 1 Chicago from $420 to $540 ATH).
- **Interactive SVG Chart**: Interactive data nodes with real-time hover tooltips displaying exact monthly trade values, accompanied by 30-day liquidity volume and volatility grade metrics.

---

### 7. 🖱️ Luxury Magnetic Cursor & UI Audio Engine
- **Lagging Dual-Ring Cursor**: Physics-based magnetic dot and lagging glass ring that expands upon hovering interactive elements, dynamically colored to match active sneaker palettes.
- **Web Audio Synthesizer**: Built-in sound effects (mechanical clicks, aerodynamic swooshes, success chimes) toggleable on/off from the navigation bar.

---

## 📄 Pages Architecture

1. **`index.html`** — Main Runway, 3D Studio, Bespoke Lab, Live Drops, Market Trends, Vault Catalog, Slide-Over Bag Drawer, Express Checkout, and NFC Authenticity Scanner Simulator.
2. **`login.html`** — Split screen (Left: Full login options, social sign-in; Right: Floating Air Jordan 1 "Chicago" sneaker with dynamic 3D tilt, halo, and 3D Studio inspect button).
3. **`register.html`** — Inverted split screen (Left: Floating Air Jordan 1 "Court Purple" sneaker with 3D tilt and 3D Studio inspect; Right: Full collector registration with preferred shoe size selector).

---

## 🚀 How to Run

No build step, Node.js, or bundling required. Pure native modern web technologies:
1. Double click any HTML file or open it in your favorite modern browser:
   - `index.html`
   - `login.html`
   - `register.html`
2. Enjoy the full 3D and street-luxury experience!
