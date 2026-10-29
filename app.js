/* ==========================================================================
   ZOLV™ BRAND & PACKAGING INTERACTIVE APPLICATION LOGIC
   Next-Gen Sublingual Oral Bio-Films DTC Engine
   ========================================================================== */

// --- Product Data for the 4 SKUs ---
const SKU_DATA = {
  energy: {
    id: "energy",
    name: "ZOLV ENERGY",
    subtitle: "SKU 01 // BOOST",
    flavor: "Solar Citrus Mint",
    price: 24.00,
    subPrice: 19.20,
    color: "#FF5500",
    colorSecondary: "#FFAA00",
    actives: [
      "50mg Clean Bio-Caffeine",
      "Taurine + L-Theanine (1:1)",
      "100% DV Methylcobalamin B12"
    ],
    cartonHue: "#FF5500",
    stripColor: "rgba(255, 85, 0, 0.85)",
    filmParticles: "#FFAA00",
    tagline: "Instant, jitter-free energy rush without stomach crash."
  },
  sleep: {
    id: "sleep",
    name: "ZOLV SLEEP",
    subtitle: "SKU 02 // RESTORE",
    flavor: "Midnight Blackberry Lavender",
    price: 24.00,
    subPrice: 19.20,
    color: "#8B5CF6",
    colorSecondary: "#A78BFA",
    actives: [
      "3mg Pure Sublingual Melatonin",
      "100mg GABA + 5-HTP Matrix",
      "Organic Tart Cherry & L-Theanine"
    ],
    cartonHue: "#8B5CF6",
    stripColor: "rgba(139, 92, 246, 0.85)",
    filmParticles: "#C4B5FD",
    tagline: "Shuts down midnight cognitive noise in 10 minutes."
  },
  focus: {
    id: "focus",
    name: "ZOLV FOCUS",
    subtitle: "SKU 03 // CLARITY",
    flavor: "Cyber Alpine Matcha",
    price: 24.00,
    subPrice: 19.20,
    color: "#00F59B",
    colorSecondary: "#34D399",
    actives: [
      "150mg Lion's Mane 10:1 Extract",
      "100mg Alpha-GPC (99% Purity)",
      "Bacopa Monnieri & Tyrosine"
    ],
    cartonHue: "#00F59B",
    stripColor: "rgba(0, 245, 155, 0.85)",
    filmParticles: "#6EE7B7",
    tagline: "Laser flow state for deep creative work, coding, & gaming."
  },
  nad: {
    id: "nad",
    name: "ZOLV NAD+",
    subtitle: "SKU 04 // LONGEVITY",
    flavor: "Glacial Arctic Yuzu",
    price: 29.00,
    subPrice: 23.20,
    color: "#00D4FF",
    colorSecondary: "#7DD3FC",
    actives: [
      "150mg Liposomal β-NMN",
      "50mg Micronized Resveratrol",
      "PQQ Mitochondria Generator"
    ],
    cartonHue: "#00D4FF",
    stripColor: "rgba(0, 212, 255, 0.85)",
    filmParticles: "#BAE6FD",
    tagline: "Cellular rejuvenation bypassing destructive gut enzymes."
  }
};

// --- Application State ---
let currentSKU = "energy";
let currentPackView = "carton"; // "carton" | "open" | "sachet"
let soundEnabled = true;
let cart = [];
let bundleSlots = [null, null, null, null];
let audioCtx = null;

// --- Sound Synthesizer (Web Audio API - No external files needed) ---
function playHapticSound(type = "click") {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "dissolve") {
      // Gentle white noise swoosh
      const bufferSize = audioCtx.sampleRate * 0.4;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.linearRampToValueAtTime(300, now + 0.4);
      filter.Q.value = 3.0;

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.15, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.4);
    } else if (type === "success") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {
    // Audio context may be restricted by autoplay policy before user gesture
  }
}

// --- Dynamic Packaging SVG Generator ---
function generateCartonSVG(skuKey, viewMode) {
  const sku = SKU_DATA[skuKey];
  const primary = sku.color;
  const secondary = sku.colorSecondary;
  const skuLabel = sku.name.replace("ZOLV ", "");

  if (viewMode === "carton") {
    // 1. Closed Flip-Top Pocket Dispenser
    return `
      <svg class="pack-svg-root" viewBox="0 0 320 440" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="boxGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#242432"/>
            <stop offset="100%" stop-color="#0A0A0F"/>
          </radialGradient>
          <linearGradient id="foilGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${primary}"/>
            <stop offset="100%" stop-color="${secondary}"/>
          </linearGradient>
          <linearGradient id="edgeSheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(255,255,255,0.4)"/>
            <stop offset="15%" stop-color="rgba(255,255,255,0.05)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
          </linearGradient>
          <filter id="packShadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="25" stdDeviation="20" flood-color="rgba(0,0,0,0.85)"/>
          </filter>
        </defs>

        <!-- Drop shadow base -->
        <g filter="url(#packShadow)">
          <!-- Main Carton Body (Pocket Flip-Top Box: 75mm x 45mm x 12mm aspect) -->
          <rect x="50" y="30" width="220" height="380" rx="14" fill="url(#boxGlow)" stroke="#2D2D3C" stroke-width="2"/>
          <rect x="50" y="30" width="220" height="380" rx="14" fill="url(#edgeSheen)"/>

          <!-- Flip-Top Seam Line (indicates the lid opening cut) -->
          <line x1="50" y1="110" x2="270" y2="110" stroke="#101016" stroke-width="4"/>
          <line x1="50" y1="111" x2="270" y2="111" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>

          <!-- Lid Thumb Notch (finger groove to flip open lid) -->
          <path d="M135 110 C145 122, 175 122, 185 110 Z" fill="#0A0A0E" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>

          <!-- Top Brand Wordmark on Lid (Gloss Spot UV) -->
          <g transform="translate(100, 52) scale(0.7)">
            <path d="M4 8.5H38.5V15.5L16.2 33H39V40H4V33L26.5 15.5H4V8.5Z" fill="#FFFFFF"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M57.5 8C47.8 8 40 15.2 40 24.2C40 33.3 47.8 40.5 57.5 40.5C67.2 40.5 75 33.3 75 24.2C75 15.2 67.2 8 57.5 8ZM57.5 15.8C52.8 15.8 49 19.5 49 24.2C49 28.9 52.8 32.7 57.5 32.7C62.2 32.7 66 28.9 66 24.2C66 19.5 62.2 15.8 57.5 15.8Z" fill="#FFFFFF"/>
            <path d="M82 8.5H91V33H112V40H82V8.5Z" fill="#FFFFFF"/>
            <path d="M117 8.5H126.5L138.5 34.5L150.5 8.5H160L143 40H134L117 8.5Z" fill="#FFFFFF"/>
            <!-- Dissolve particles -->
            <circle cx="166" cy="10" r="2.2" fill="${primary}"/>
            <circle cx="172" cy="14" r="1.6" fill="${primary}"/>
          </g>

          <!-- SKU Foil Border & Accent Band -->
          <rect x="70" y="145" width="180" height="6" rx="3" fill="url(#foilGrad)"/>

          <!-- Large SKU Bold Typography -->
          <text x="160" y="210" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="34" letter-spacing="3" text-anchor="middle">
            ${skuLabel}
          </text>

          <!-- Micro-Text Specs -->
          <text x="160" y="240" fill="${primary}" font-family="system-ui, sans-serif" font-weight="800" font-size="12" letter-spacing="2" text-anchor="middle">
            SUBLINGUAL ORAL FILM
          </text>
          <text x="160" y="260" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="10.5" font-weight="600" text-anchor="middle">
            ${sku.flavor.toUpperCase()}
          </text>

          <!-- Pocket Pack Pill Dosage Graphic -->
          <g transform="translate(85, 290)">
            <rect x="0" y="0" width="150" height="38" rx="6" fill="#14141E" stroke="rgba(255,255,255,0.08)"/>
            <circle cx="20" cy="19" r="6" fill="${primary}"/>
            <text x="35" y="17" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="700">30 ORAL FILMS</text>
            <text x="35" y="28" fill="#6B7280" font-family="sans-serif" font-size="8.5">FAST DISSOLVE • 0 SUGAR</text>
          </g>

          <!-- Bottom Geometric Tech Barcode & QR Accent -->
          <g transform="translate(70, 360)">
            <rect x="0" y="0" width="2" height="18" fill="#4B5563"/>
            <rect x="5" y="0" width="4" height="18" fill="#4B5563"/>
            <rect x="12" y="0" width="1" height="18" fill="#4B5563"/>
            <rect x="16" y="0" width="3" height="18" fill="#4B5563"/>
            <rect x="23" y="0" width="2" height="18" fill="#4B5563"/>
            <rect x="28" y="0" width="4" height="18" fill="#4B5563"/>
            <rect x="36" y="0" width="1" height="18" fill="#4B5563"/>
            <text x="180" y="14" fill="#9CA3AF" font-family="monospace" font-size="9" text-anchor="end">LOT #ZLV-2026</text>
          </g>
        </g>
      </svg>
    `;
  } else if (viewMode === "open") {
    // 2. Flip-Top Opened View revealing the 30 individual foil sachets inside
    return `
      <svg class="pack-svg-root" viewBox="0 0 320 440" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sachetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#22222E"/>
            <stop offset="100%" stop-color="#121218"/>
          </linearGradient>
          <linearGradient id="foilGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${primary}"/>
            <stop offset="100%" stop-color="${secondary}"/>
          </linearGradient>
        </defs>

        <!-- Tilted Opened Lid (Folded back revealing client's signature yellow interior and 'YOU IN?') -->
        <g transform="translate(0, -25)">
          <path d="M50 85 L80 15 L240 15 L270 85 Z" fill="#FACC15" stroke="#EAB308" stroke-width="2"/>
          <!-- Bold handwritten style YOU IN? signature -->
          <text x="160" y="58" fill="#000000" font-family="system-ui, sans-serif" font-size="28" font-weight="900" font-style="italic" text-anchor="middle" letter-spacing="1">
            YOU IN?
          </text>
          <text x="160" y="76" fill="#000000" font-family="monospace" font-size="9" font-weight="800" text-anchor="middle">
            PEEL. PLACE. ZOLV.
          </text>
        </g>

        <!-- Internal Tray Depth Cavity -->
        <rect x="58" y="65" width="204" height="70" rx="4" fill="#050508"/>

        <!-- 30 Individual Sachets Stacked Neatly Inside (layered edges) -->
        <rect x="68" y="70" width="184" height="25" rx="3" fill="url(#sachetGrad)" stroke="#374151" stroke-width="0.75"/>
        <line x1="75" y1="74" x2="245" y2="74" stroke="${primary}" stroke-width="2"/>

        <rect x="68" y="80" width="184" height="25" rx="3" fill="url(#sachetGrad)" stroke="#374151" stroke-width="0.75"/>
        <line x1="75" y1="84" x2="245" y2="84" stroke="${primary}" stroke-width="2"/>

        <!-- Front Active Sachet Slightly Popping Out -->
        <g transform="translate(0, -12)">
          <rect x="74" y="90" width="172" height="60" rx="4" fill="#1E1E2A" stroke="${primary}" stroke-width="1.5"/>
          <circle cx="95" cy="115" r="4" fill="${primary}"/>
          <text x="110" y="119" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="13">ZOLV</text>
          <text x="160" y="119" fill="${primary}" font-family="monospace" font-weight="800" font-size="11">${skuLabel}</text>
          <text x="95" y="136" fill="#9CA3AF" font-family="monospace" font-size="8.5">PEEL. PLACE. ZOLV.</text>
        </g>

        <!-- Main Lower Carton Body -->
        <rect x="50" y="135" width="220" height="280" rx="14" fill="#14141E" stroke="#2D2D3C" stroke-width="2"/>

        <!-- Side Callout Text on Carton Spine -->
        <text x="56" y="270" fill="#6B7280" font-family="monospace" font-size="8" font-weight="700" transform="rotate(-90 56,270)">
          PEEL. PLACE. ZOLV.
        </text>

        <!-- Accent Line -->
        <rect x="70" y="170" width="180" height="5" rx="2.5" fill="url(#foilGrad)"/>

        <!-- Product Name -->
        <text x="160" y="235" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="30" letter-spacing="2" text-anchor="middle">
          ${skuLabel}
        </text>
        <text x="160" y="265" fill="${primary}" font-family="sans-serif" font-weight="800" font-size="12" letter-spacing="1.5" text-anchor="middle">
          30 SEALED STRIPS INSIDE
        </text>

        <!-- Specs Badge -->
        <rect x="80" y="295" width="160" height="55" rx="8" fill="#0C0C12" stroke="rgba(255,255,255,0.06)"/>
        <text x="160" y="318" fill="#E5E7EB" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">
          SMALL STRIP. BIG PLANS.
        </text>
        <text x="160" y="337" fill="#6B7280" font-family="sans-serif" font-size="9" text-anchor="middle">
          30 INDIVIDUALLY WRAPPED SACHETS
        </text>
      </svg>
    `;
  } else if (viewMode === "sachet") {
    // 3. Foil Sachet + Extracted Oral Thin Film Strip View
    return `
      <svg class="pack-svg-root" viewBox="0 0 320 440" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="foilMatte" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#252535"/>
            <stop offset="50%" stop-color="#14141C"/>
            <stop offset="100%" stop-color="#0A0A0F"/>
          </linearGradient>
          <linearGradient id="stripGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${primary}" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="${secondary}" stop-opacity="0.8"/>
          </linearGradient>
        </defs>

        <!-- Sachet Foil Pouch (40mm x 30mm pocket ratio) -->
        <g transform="translate(45, 60)">
          <!-- Hermetic Crimp Edges -->
          <rect x="0" y="0" width="230" height="150" rx="8" fill="url(#foilMatte)" stroke="#374151" stroke-width="1.5"/>
          <line x1="0" y1="12" x2="230" y2="12" stroke="rgba(255,255,255,0.12)" stroke-width="2" stroke-dasharray="2,2"/>
          <line x1="0" y1="138" x2="230" y2="138" stroke="rgba(255,255,255,0.12)" stroke-width="2" stroke-dasharray="2,2"/>

          <!-- Easy-Tear Notch -->
          <path d="M0 25 L8 28 L0 31 Z" fill="#0A0A0E"/>
          <text x="18" y="31" fill="#6B7280" font-family="monospace" font-size="8">TEAR HERE ➔</text>

          <!-- Sachet Branding -->
          <text x="35" y="70" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="22" letter-spacing="1">ZOLV</text>
          <text x="110" y="70" fill="${primary}" font-family="monospace" font-weight="900" font-size="16">${skuLabel}</text>
          <text x="35" y="94" fill="#9CA3AF" font-family="sans-serif" font-size="10" font-weight="600">RAPID DISSOLVING ORAL FILM</text>
          <text x="35" y="115" fill="${primary}" font-family="monospace" font-size="10.5" font-weight="800" letter-spacing="1">PEEL. PLACE. ZOLV.</text>
          <circle cx="205" cy="72" r="8" fill="${primary}" fill-opacity="0.2" stroke="${primary}"/>
          <text x="205" y="76" fill="${primary}" font-family="monospace" font-weight="900" font-size="10" text-anchor="middle">1x</text>
        </g>

        <!-- Dynamic Floating Oral Strip Film (Extracted & dissolving into particles) -->
        <g transform="translate(75, 250)">
          <!-- The Ultra-Thin Translucent Film (0.05mm caliper) -->
          <rect x="0" y="0" width="170" height="85" rx="6" fill="url(#stripGlow)" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" filter="drop-shadow(0 15px 25px ${primary}40)"/>

          <!-- Micro-Embossed Z Logo on Film Surface -->
          <text x="85" y="52" fill="#FFFFFF" fill-opacity="0.8" font-family="system-ui, sans-serif" font-weight="900" font-size="28" letter-spacing="4" text-anchor="middle">
            ZOLV
          </text>
          <text x="85" y="70" fill="#FFFFFF" fill-opacity="0.9" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">
            0.05MM BIO-MATRIX
          </text>

          <!-- Dissolving Micro-Droplets / Sublingual Particles -->
          <circle cx="178" cy="15" r="4" fill="${primary}"/>
          <circle cx="190" cy="28" r="3" fill="${secondary}"/>
          <circle cx="182" cy="48" r="2.5" fill="${primary}"/>
          <circle cx="195" cy="62" r="2" fill="${secondary}"/>
          <circle cx="178" cy="75" r="3" fill="${primary}"/>
        </g>

        <!-- Strip Spec Caption -->
        <text x="160" y="380" fill="#9CA3AF" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">
          MELTSTIME: 3.0 SECONDS ON TONGUE
        </text>
        <text x="160" y="400" fill="#6B7280" font-family="sans-serif" font-size="9.5" text-anchor="middle">
          NO WATER • NO SWALLOWING • DIRECT BUCCAL ABSORPTION
        </text>
      </svg>
    `;
  }
}

// --- Switch Current SKU & Re-render ---
function switchSKU(skuKey) {
  if (!SKU_DATA[skuKey]) return;
  currentSKU = skuKey;

  playHapticSound("click");

  // Update Body Theme Class
  document.body.className = `theme-${skuKey}`;
  document.body.setAttribute("data-current-sku", skuKey);

  // Update SKU Selector Pills in Hero
  document.querySelectorAll(".sku-pill").forEach(pill => {
    if (pill.dataset.sku === skuKey) {
      pill.classList.add("active");
    } else {
      pill.classList.remove("active");
    }
  });

  // Re-render packaging graphic
  renderHeroPackaging();

  // Update Floating Spec Card
  const sku = SKU_DATA[skuKey];
  const specCard = document.getElementById("sku-spec-card");
  if (specCard) {
    document.getElementById("sku-spec-badge").textContent = `${sku.name} // ${sku.subtitle.split("//")[1].trim()}`;
    document.getElementById("sku-spec-flavor").innerHTML = `Flavor: <strong>${sku.flavor}</strong>`;

    const activesContainer = document.getElementById("sku-spec-actives");
    activesContainer.innerHTML = sku.actives.map(act => `<div class="act-item">${act}</div>`).join("");
  }

  // Update Hero Button Label
  const heroBtn = document.getElementById("hero-add-to-cart-btn");
  if (heroBtn) {
    heroBtn.querySelector(".btn-text").textContent = `Add to Cart — $${sku.price.toFixed(2)}`;
  }

  // Update Sticky CTA bar
  const stickyName = document.getElementById("sticky-sku-name");
  const stickyPrice = document.getElementById("sticky-sku-price");
  if (stickyName && stickyPrice) {
    stickyName.textContent = sku.name;
    stickyPrice.textContent = `$${sku.price.toFixed(2)}`;
  }

  // Update Sim Strip Color if present
  const simStrip = document.getElementById("sim-strip");
  if (simStrip) {
    simStrip.style.background = `linear-gradient(135deg, ${sku.color} 0%, ${sku.colorSecondary} 100%)`;
    simStrip.style.boxShadow = `0 4px 25px ${sku.color}80`;
  }
}

// --- Set Packaging View Mode (Carton / Open / Sachet) ---
function setPackView(viewMode) {
  currentPackView = viewMode;
  playHapticSound("click");

  // Update buttons state
  document.querySelectorAll(".pack-ctrl-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  if (viewMode === "carton") document.getElementById("btn-view-carton")?.classList.add("active");
  if (viewMode === "open") document.getElementById("btn-view-open")?.classList.add("active");
  if (viewMode === "sachet") document.getElementById("btn-view-sachet")?.classList.add("active");

  renderHeroPackaging();
}

function renderHeroPackaging() {
  const container = document.getElementById("packaging-mockup-graphic");
  if (container) {
    container.innerHTML = generateCartonSVG(currentSKU, currentPackView);
  }
}

// --- Render 4 Static Product Card Thumbnails ---
function renderProductGridThumbs() {
  ["energy", "sleep", "focus", "nad"].forEach(key => {
    const el = document.getElementById(`thumb-${key}`);
    if (el) {
      el.innerHTML = generateCartonSVG(key, "carton");
    }
  });

  // Big packaging section carton
  const bigCartonWrap = document.getElementById("big-carton-svg-wrap");
  if (bigCartonWrap) {
    bigCartonWrap.innerHTML = generateCartonSVG("energy", "carton");
  }
}

// --- Quickview Handler for Grid Cards ---
function openProductQuickview(skuKey) {
  switchSKU(skuKey);
  // Scroll up smoothly to hero packaging visualizer
  document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
}

// --- Cart System Management ---
function addToCart(skuKey, qty = 1, isSub = false) {
  playHapticSound("success");
  const sku = SKU_DATA[skuKey];
  const price = isSub ? sku.subPrice : sku.price;

  const existingIndex = cart.findIndex(item => item.id === skuKey && item.isSub === isSub);
  if (existingIndex > -1) {
    cart[existingIndex].qty += qty;
  } else {
    cart.push({
      id: sku.id,
      name: sku.name,
      flavor: sku.flavor,
      price: price,
      isSub: isSub,
      qty: qty,
      color: sku.color
    });
  }

  updateCartUI();
  openCart();
}

function addCurrentSkuToCart() {
  addToCart(currentSKU, 1, false);
}

function subscribeAndSave(skuKey) {
  addToCart(skuKey, 1, true);
}

function addRecommendedItem() {
  addToCart("energy", 1, false);
}

function updateCartUI() {
  const badge = document.getElementById("cart-badge-count");
  const drawerCount = document.getElementById("cart-item-count");
  const container = document.getElementById("cart-items-container");
  const subtotalEl = document.getElementById("cart-subtotal");
  const shippingProgress = document.getElementById("shipping-progress-fill");
  const shippingStatus = document.getElementById("shipping-status-text");

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (badge) badge.textContent = totalItems;
  if (drawerCount) drawerCount.textContent = totalItems;
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

  // Shipping progress calculation ($45 threshold)
  const freeThreshold = 45.00;
  if (subtotal >= freeThreshold) {
    shippingProgress.style.width = "100%";
    shippingStatus.innerHTML = "🎉 <strong>CONGRATS!</strong> You unlocked <strong>FREE WORLDWIDE SHIPPING</strong>";
  } else {
    const diff = freeThreshold - subtotal;
    const pct = Math.min(100, Math.max(10, (subtotal / freeThreshold) * 100));
    shippingProgress.style.width = `${pct}%`;
    shippingStatus.innerHTML = `Add <strong>$${diff.toFixed(2)}</strong> more to unlock <strong>FREE WORLDWIDE SHIPPING</strong>`;
  }

  // Render items
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-state" id="empty-cart-state">
        <div class="empty-cart-icon">📦</div>
        <p>Your pocket pack is empty.</p>
        <button class="btn btn-outline btn-sm" onclick="addRecommendedItem()">Add Energy Pack ($24)</button>
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item-row">
      <div class="cart-item-thumb">
        <svg viewBox="0 0 100 120" style="height: 50px;">
          <rect x="10" y="10" width="80" height="100" rx="8" fill="#181824" stroke="${item.color}" stroke-width="2"/>
          <text x="50" y="65" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="12" text-anchor="middle">ZOLV</text>
        </svg>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-meta">${item.flavor} ${item.isSub ? "• Monthly Subscription (-20%)" : "• 30 Strips"}</div>
        <div class="cart-item-controls">
          <div class="qty-btn-group">
            <button class="qty-btn" onclick="changeCartQty(${index}, -1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeCartQty(${index}, 1)">+</button>
          </div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
      </div>
      <button class="slot-remove-btn" onclick="removeCartItem(${index})" title="Remove item">✕</button>
    </div>
  `).join("");
}

function changeCartQty(index, delta) {
  playHapticSound("click");
  if (cart[index]) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
  }
  updateCartUI();
}

function removeCartItem(index) {
  playHapticSound("click");
  cart.splice(index, 1);
  updateCartUI();
}

function openCart() {
  document.getElementById("cart-drawer")?.classList.add("active");
  document.getElementById("cart-drawer-overlay")?.classList.add("active");
}

function closeCart() {
  document.getElementById("cart-drawer")?.classList.remove("active");
  document.getElementById("cart-drawer-overlay")?.classList.remove("active");
}

function simulateCheckout() {
  if (cart.length === 0) {
    alert("Please add items to your cart first.");
    return;
  }
  playHapticSound("success");
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  alert(`⚡ ORDER INITIATED FOR ZOLV™ BIO-FILMS\nTotal: $${subtotal.toFixed(2)}\nIncludes 30-Day Peak State Guarantee & Express Packaging.`);
  cart = [];
  updateCartUI();
  closeCart();
}

// --- Bundle Builder Engine ---
function addSkuToBundle(skuKey) {
  playHapticSound("click");
  // Find first empty slot
  const emptyIndex = bundleSlots.findIndex(slot => slot === null);
  if (emptyIndex === -1) {
    // If all full, replace slot 0
    bundleSlots[0] = skuKey;
  } else {
    bundleSlots[emptyIndex] = skuKey;
  }
  renderBundleSlots();
}

function removeSlot(index, e) {
  e.stopPropagation();
  playHapticSound("click");
  bundleSlots[index] = null;
  renderBundleSlots();
}

function focusSlot(slotNum) {
  // Rotate sku on click
  const keys = ["energy", "sleep", "focus", "nad"];
  const current = bundleSlots[slotNum - 1];
  const next = keys[(keys.indexOf(current) + 1) % keys.length];
  bundleSlots[slotNum - 1] = next;
  playHapticSound("click");
  renderBundleSlots();
}

function fillRecommendedBundle() {
  playHapticSound("success");
  bundleSlots = ["energy", "focus", "sleep", "nad"];
  renderBundleSlots();
}

function renderBundleSlots() {
  bundleSlots.forEach((skuKey, i) => {
    const slotEl = document.getElementById(`slot-${i + 1}`);
    const contentEl = document.getElementById(`slot-${i + 1}-content`);
    if (!slotEl || !contentEl) return;

    if (skuKey && SKU_DATA[skuKey]) {
      const sku = SKU_DATA[skuKey];
      slotEl.classList.add("filled");
      slotEl.style.setProperty("--slot-color", sku.color);
      contentEl.innerHTML = `
        <div class="slot-filled-card">
          <span style="font-size: 1.5rem;">⚡</span>
          <span class="slot-sku-title" style="color: ${sku.color};">${sku.name}</span>
          <span class="slot-sku-flavor">${sku.flavor}</span>
        </div>
        <button class="slot-remove-btn" onclick="removeSlot(${i}, event)">✕</button>
      `;
    } else {
      slotEl.classList.remove("filled");
      contentEl.innerHTML = `<span class="slot-empty">+ Choose SKU</span>`;
    }
  });

  // Calculate pricing
  const filledCount = bundleSlots.filter(s => s !== null).length;
  let basePrice = 0;
  bundleSlots.forEach(key => {
    if (key && SKU_DATA[key]) basePrice += SKU_DATA[key].price;
    else basePrice += 24.00;
  });

  const finalPrice = basePrice * 0.75; // 25% discount
  document.getElementById("bundle-orig-price").textContent = `$${basePrice.toFixed(2)}`;
  document.getElementById("bundle-final-price").textContent = `$${finalPrice.toFixed(2)}`;

  const addBtn = document.getElementById("add-bundle-to-cart-btn");
  if (addBtn) {
    if (filledCount === 4) {
      addBtn.innerHTML = `<span>Add 4-Pack to Cart ($${finalPrice.toFixed(2)}) & Free Travel Tin</span> <span class="arrow">→</span>`;
    } else {
      addBtn.innerHTML = `<span>Select ${4 - filledCount} More to Complete 4-Pack</span>`;
    }
  }
}

function addBundleToCart() {
  // If some slots empty, fill with default protocol
  bundleSlots.forEach((slot, i) => {
    if (!slot) {
      const keys = ["energy", "sleep", "focus", "nad"];
      bundleSlots[i] = keys[i];
    }
  });
  renderBundleSlots();

  playHapticSound("success");
  bundleSlots.forEach(skuKey => {
    const sku = SKU_DATA[skuKey];
    cart.push({
      id: sku.id,
      name: `${sku.name} (Bundle Pack)`,
      flavor: sku.flavor,
      price: sku.price * 0.75,
      isSub: false,
      qty: 1,
      color: sku.color
    });
  });

  updateCartUI();
  openCart();
}

// --- Dissolve Simulation Modal Logic ---
let dissolveTimer = null;
let dissolveSeconds = 0;

function triggerDissolveModal() {
  playHapticSound("click");
  document.getElementById("dissolve-modal")?.classList.add("active");
  resetDissolveSimulation();
}

function closeDissolveModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains("close-modal-btn")) return;
  document.getElementById("dissolve-modal")?.classList.remove("active");
  resetDissolveSimulation();
}

function resetDissolveSimulation() {
  if (dissolveTimer) clearInterval(dissolveTimer);
  dissolveSeconds = 0;
  document.getElementById("sim-timer").textContent = "0.00s";
  document.getElementById("sim-status").textContent = "Ready to place on tongue";

  const strip = document.getElementById("sim-strip");
  if (strip) {
    strip.style.opacity = "1";
    strip.style.transform = "scale(1) rotate(0deg)";
    strip.style.filter = "none";
  }

  const container = document.getElementById("sim-particles");
  if (container) container.innerHTML = "";

  const startBtn = document.getElementById("start-sim-btn");
  if (startBtn) startBtn.disabled = false;
}

function runDissolveSimulation() {
  playHapticSound("dissolve");
  const startBtn = document.getElementById("start-sim-btn");
  if (startBtn) startBtn.disabled = true;

  const timerEl = document.getElementById("sim-timer");
  const statusEl = document.getElementById("sim-status");
  const strip = document.getElementById("sim-strip");
  const particles = document.getElementById("sim-particles");

  statusEl.textContent = "Salivary contact initiated... Film hydrating";
  let elapsed = 0;
  const target = 3000; // 3.00 seconds

  dissolveTimer = setInterval(() => {
    elapsed += 50;
    const sec = (elapsed / 1000).toFixed(2);
    timerEl.textContent = `${sec}s`;

    const progress = Math.min(1, elapsed / target);

    // Fade and shrink strip
    if (strip) {
      strip.style.opacity = (1 - progress * 0.95).toString();
      strip.style.transform = `scale(${1 - progress * 0.4}) rotate(${progress * 5}deg)`;
      strip.style.filter = `blur(${progress * 8}px)`;
    }

    if (elapsed >= 1000 && elapsed < 2000) {
      statusEl.textContent = "Capillary diffusion in progress... Bypassing gut";
    }

    if (elapsed >= 3000) {
      clearInterval(dissolveTimer);
      timerEl.textContent = "3.00s";
      statusEl.innerHTML = "✅ <strong>100% DISSOLVED.</strong> Bioactives entered bloodstream directly!";
      playHapticSound("success");
    }
  }, 50);
}

// --- Logo Redesign Modal ---
function closeLogoModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains("close-modal-btn")) return;
  document.getElementById("logo-modal")?.classList.remove("active");
}

// --- Cinematic Video Modal Handlers ---
function openVideoModal() {
  playHapticSound("click");
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("full-investor-video");
  if (modal) {
    modal.classList.add("active");
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }
}

function closeVideoModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains("close-modal-btn")) return;
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("full-investor-video");
  if (modal) {
    modal.classList.remove("active");
    if (video) {
      video.pause();
    }
  }
}

// --- DOM Event Listeners Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  // Initialize SKU & Packaging
  switchSKU("energy");
  renderProductGridThumbs();
  fillRecommendedBundle();

  // Logo Redesign Modal Button
  document.getElementById("open-logo-modal-btn")?.addEventListener("click", () => {
    playHapticSound("click");
    document.getElementById("logo-modal")?.classList.add("active");
  });

  // Sound Toggle
  document.getElementById("sound-toggle")?.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById("sound-toggle");
    if (btn) {
      btn.style.opacity = soundEnabled ? "1" : "0.4";
      btn.title = soundEnabled ? "Sound FX: ON" : "Sound FX: MUTED";
    }
    if (soundEnabled) playHapticSound("click");
  });

  // Cart Drawer Trigger
  document.getElementById("cart-trigger")?.addEventListener("click", () => {
    playHapticSound("click");
    openCart();
  });

  // Sticky CTA Bar Scroll Detection
  const stickyBar = document.getElementById("sticky-bar");
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY;
    if (scrollPos > 600) {
      stickyBar?.classList.add("visible");
    } else {
      stickyBar?.classList.remove("visible");
    }
  });

  // FAQ Accordions
  document.querySelectorAll(".faq-item").forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    questionBtn?.addEventListener("click", () => {
      playHapticSound("click");
      const isActive = item.classList.contains("active");
      document.querySelectorAll(".faq-item").forEach(f => f.classList.remove("active"));
      if (!isActive) item.classList.add("active");
    });
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const mainNav = document.getElementById("main-nav");
  mobileToggle?.addEventListener("click", () => {
    playHapticSound("click");
    if (mainNav.style.display === "flex") {
      mainNav.style.display = "none";
    } else {
      mainNav.style.display = "flex";
      mainNav.style.position = "absolute";
      mainNav.style.top = "72px";
      mainNav.style.left = "0";
      mainNav.style.width = "100%";
      mainNav.style.background = "#0A0A0E";
      mainNav.style.padding = "2rem";
      mainNav.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
    }
  });
});
