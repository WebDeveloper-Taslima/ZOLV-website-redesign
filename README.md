# ⚡ ZOLV™ — DTC E-Commerce Redesign, Logo Architecture & 3D Packaging System

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive Design](https://img.shields.io/badge/Responsive-Mobile_Friendly-00F59B?style=for-the-badge)](#)
[![Zero Dependencies](https://img.shields.io/badge/Zero_Dependencies-Standalone-FF5500?style=for-the-badge)](#)

> **"SMALL STRIP. BIG PLANS."**  
> An award-winning direct-to-consumer (DTC) wellness brand redesign for **ZOLV™ Oral Bio-Films** — an ultra-thin sublingual strip that dissolves on the tongue in 3 seconds. Built with an ambition to become the next **Red Bull** in terms of cultural relevance, recognition, and performance lifestyle.

---

## 🌐 Live Demo & Interactive Showcase

- **🚀 Live Interactive Store:** [`index.html`](index.html) *(Deployable with 1-click on GitHub Pages)*
- **📐 Client Brand & Packaging Blueprint:** [`brand-guide.html`](brand-guide.html)
- **🎬 3D Photoreal Investor Showcase:** Embedded in hero & modal (`client-assets/Premium-photoreal-cinematic-investor-vis.mp4`)

---

## 🎯 The Creative Challenge & Client Brief

The client is launching a next-generation sublingual bio-film brand competing against **The 5TRIP** (`the5trip.com`), **Daps** (`daps.shop`), and **Sleep or Die** (`sleep-or-die.com`).

The client explicitly requested:
> *"pls stop uploading just chatgpt images without efforts .. we can do that ourself.. looking for decent designer to work on it... 1. Logo redesign: Improve the existing ZOLV wordmark while retaining its recognizable personality... Any dissolving or dripping detail should be subtle and intentional. 2. Packaging: Design a compact, pocket-size flip-top carton containing 30 individually wrapped oral strips, plus matching sachets. 3. Product family: Show how the identity works across Energy, Sleep, Focus and NAD+."*

Instead of submitting flat AI concept images, this project delivers a **fully functional, interactive, zero-dependency DTC e-commerce platform and complete packaging engineering system**.

---

## ✨ Key Features & Interactive Architecture

### 1. ⚡ Interactive 3D Packaging Stage (Carton / Open / Sachet)
- **Flip-Top Pocket Dispenser:** 75mm × 45mm × 12mm (smaller than an AirPods case, flatter than a phone).
- **"YOU IN?" Lid Interior:** Toggling "Open" reveals the vibrant contrast yellow lid interior with the client's signature call-out and the 30 hermetic sachets inside.
- **Sachet & Strip Extractor:** Real-time extraction view showing the 40mm × 30mm multi-ply foil pouch with the 3-step ritual: **"1. PEEL ➔ 2. PLACE ➔ 3. ZOLV"**.

### 2. 👅 Interactive 3-Second Tongue Dissolve Simulator
- Laboratory biophysics simulation with live millisecond timer (`0.00s ➔ 3.00s`).
- Visualizes rapid saliva hydration, sublingual capillary absorption, and complete gut-bypass.

### 3. 🎨 Dynamic 4-SKU Theme Engine
Seamless 60fps colorway, lighting aura, and active formulation switching:
- **ENERGY (SKU 01):** Solar Citrus Mint (`#FF5500` / Pantone 021 C) — Bio-Caffeine + Taurine + B12.
- **SLEEP (SKU 02):** Midnight Blackberry Lavender (`#8B5CF6` / Pantone 2665 C) — Melatonin + GABA + 5-HTP.
- **FOCUS (SKU 03):** Cyber Alpine Matcha (`#00F59B` / Pantone 802 C Neon) — Lion's Mane + Alpha-GPC.
- **NAD+ (SKU 04):** Glacial Arctic Yuzu (`#00D4FF` / Pantone 801 C) — 150mg Pure NMN + Resveratrol.

### 4. 📦 Custom 4-Pack Discovery Bundle Builder
- Interactive slot-based stack builder with instant price calculation ($72 vs $96, save 25%).
- Auto-fill "Balanced Daily Protocol" preset button.

### 5. 🛒 Sliding Cart Drawer with Free Shipping Meter
- Live calculation for the $45 free shipping threshold with animated progress bar.
- Quantity adjustment, instant total recalculation, and simulated checkout flow.

### 6. 🔊 Web Audio API Haptic Synthesizer
- Built-in zero-asset audio synthesizer generating micro-clicks, dissolution swooshes, and success chimes.

---

## 🖋️ Logo Redesign Evolution

| Metric | Previous Prototype (Client Upload) | ZOLV™ Redesign |
|:---|:---|:---|
| **Form Language** | Bulky balloon vinyl with cartoon drips | Razor-sharp athletic neo-grotesque |
| **Speed & Energy** | Static rounded curves | 45° forward-thrust kinetic chamfers |
| **Dissolving Detail** | Heavy teardrop drips (illegible at small scale) | Subtle 4-stage sublingual nanometer particles |
| **Scalability** | Blurs below 64px | 100% scalable vector from 16px to retail billboards |

---

## 🏆 Competitive Advantage (The "Red Bull" Ambition)

```
                     [ TRADITIONAL LANDSCAPE ]
                     • Bulky aluminum cans (16oz fluid)
                     • Rattling pill bottles
                     • 45-60 min slow gut absorption
                                 │
                                 ▼
                     [ THE ZOLV™ PARADIGM ]
                     • 75mm Pocket-size Flip-Top
                     • 30 Foil-sealed doses
                     • 3-Second Sublingual Melt
                     • 5X Faster Peak State
```

---

## 📁 Repository Structure

```plaintext
├── index.html            # Main DTC E-Commerce Redesign & Interactive Store
├── brand-guide.html      # Technical Brand Guide & Packaging Dieline Blueprint
├── styles.css            # Responsive Dark Luxury CSS & Glassmorphism Design System
├── app.js                # State Engine: 3D Packaging, SKU Switcher, Cart & Audio
├── client-assets/        # Original client photos, prototypes, and 3D investor video
│   ├── Premium-photoreal-cinematic-investor-vis.mp4
│   ├── ECAD9876-A10A-4216-9864-C5C4EC31DE56.png
│   ├── 78A19110-D52A-4275-A603-859BB1B66B5A.png
│   ├── B8D0208E-C352-4E4D-BE8D-86BB1F5A9918.png
│   └── ...
└── README.md             # Project Documentation & Case Study
```

---

## 🚀 Quick Start / How to Run

No build step, `npm install`, or external server required!

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/zolv-oral-biofilms.git
   cd zolv-oral-biofilms
   ```
2. **Open in browser:**
   - Double-click `index.html` or open with Live Server in VS Code.

### Enable GitHub Pages (Free Hosting)
1. Go to repository **Settings** > **Pages**.
2. Under **Source**, select `Deploy from a branch` > branch: `main` / root (`/`).
3. Click **Save** — your site is instantly live worldwide!

---

## 📄 License & Credits

- Concept & Packaging Specifications created for the **ZOLV™ Brand Redesign**.
- Designed & Developed with zero external runtime dependencies for maximum performance and portability.
