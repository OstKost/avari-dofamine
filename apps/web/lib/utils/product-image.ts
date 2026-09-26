/**
 * Deterministic product image generator (ADR-012).
 * Generates beautiful, responsive, offline-ready SVG gradients and product silhouettes
 * based on product seed and category, eliminating external third-party CDN 403/downtime issues.
 */

const PALETTES = [
  { bg1: "#071828", bg2: "#0A283B", glow: "#54ACBF", accent: "#FFD37A" }, // Deep Midnight Teal
  { bg1: "#101B2E", bg2: "#192B45", glow: "#3B82F6", accent: "#93C5FD" }, // Deep Cyber Navy
  { bg1: "#1A1728", bg2: "#2A2042", glow: "#8B5CF6", accent: "#F472B6" }, // Deep Cyber Violet
  { bg1: "#201217", bg2: "#351A25", glow: "#F43F5E", accent: "#FDA4AF" }, // Street Rose & Crimson
  { bg1: "#0C1F1D", bg2: "#133835", glow: "#10B981", accent: "#6EE7B7" }, // Deep Emerald Tech
  { bg1: "#1F1A0E", bg2: "#352B14", glow: "#F2B84B", accent: "#FFD37A" }, // Deep Amber Gold / Luxury
  { bg1: "#24160E", bg2: "#3B2214", glow: "#F97316", accent: "#FDBA74" }, // Warm Grill / Food Orange
  { bg1: "#18132B", bg2: "#271E47", glow: "#A855F7", accent: "#E9D5FF" }, // Premium Purple & Crystals
];

function detectIcon(name?: string, category?: string): string {
  const combined = `${name || ""} ${category || ""}`.toLowerCase();

  // 1. Food & Restaurants 🍕🍖🍣🍔
  if (combined.includes("шашлык") || combined.includes("мясо") || combined.includes("стейк") || combined.includes("гриль")) return "🍖";
  if (combined.includes("пицц")) return "🍕";
  if (combined.includes("суши") || combined.includes("ролл") || combined.includes("сет")) return "🍣";
  if (combined.includes("бургер") || combined.includes("чизбургер") || combined.includes("воппер")) return "🍔";
  if (combined.includes("чипс") || combined.includes("картош") || combined.includes("фри") || combined.includes("снек")) return "🍟";
  if (combined.includes("донат") || combined.includes("пончик")) return "🍩";
  if (combined.includes("морожен") || combined.includes("пломбир")) return "🍦";
  if (combined.includes("шоколад") || combined.includes("конфет")) return "🍫";
  if (combined.includes("кола") || combined.includes("газиров") || combined.includes("пепси")) return "🥤";
  if (combined.includes("кофе") || combined.includes("капучино") || combined.includes("латте")) return "☕";
  if (combined.includes("сок") || combined.includes("лимонад") || combined.includes("смузи")) return "🧃";
  if (combined.includes("чай") || combined.includes("матча")) return "🍵";
  if (combined.includes("выпечк") || combined.includes("круассан")) return "🥐";
  if (combined.includes("ягод") || combined.includes("фрукт")) return "🍓";

  // 2. Clothes & Streetwear 👕👟🧥
  if (combined.includes("кроссовк") || combined.includes("сникер") || combined.includes("nikey") || combined.includes("кеды") || combined.includes("обувь")) return "👟";
  if (combined.includes("худи") || combined.includes("толстовк") || combined.includes("свитшот")) return "🧥";
  if (combined.includes("футболк") || combined.includes("джерси") || combined.includes("поло") || combined.includes("adibas") || combined.includes("одежд") || combined.includes("стритвир")) return "👕";
  if (combined.includes("куртк") || combined.includes("пуховик") || combined.includes("бомбер") || combined.includes("ветровк")) return "🧥";
  if (combined.includes("кепк") || combined.includes("бейсболк") || combined.includes("шапк")) return "🧢";
  if (combined.includes("джинс") || combined.includes("брюк") || combined.includes("штаны") || combined.includes("карго")) return "👖";
  if (combined.includes("носк")) return "🧦";

  // 3. Brands & Luxury 👑💎
  if (combined.includes("balenciago") || combined.includes("луи") || combined.includes("гуччи") || combined.includes("люкс") || combined.includes("премиум") || combined.includes("статус")) return "👑";
  if (combined.includes("бриллиант") || combined.includes("алмаз") || combined.includes("кольцо") || combined.includes("ювелир")) return "💎";
  if (combined.includes("часы") || combined.includes("ролекс") || combined.includes("chronometer") || combined.includes("pileson")) return "⌚";
  if (combined.includes("очки") || combined.includes("rayban") || combined.includes("солнцезащитн")) return "🕶️";
  if (combined.includes("сумк") || combined.includes("рюкзак") || combined.includes("клатч") || combined.includes("кошелек")) return "👜";
  if (combined.includes("духи") || combined.includes("парфюм") || combined.includes("аромат")) return "✨";

  // 4. Computers & Hardware 💻🖥️⚡
  if (combined.includes("ноутбук") || combined.includes("laptop") || combined.includes("макбук") || combined.includes("компьютер") || combined.includes("пк") || combined.includes("железо")) return "💻";
  if (combined.includes("видеокарт") || combined.includes("rtx") || combined.includes("geforce") || combined.includes("gpu")) return "⚡";
  if (combined.includes("процессор") || combined.includes("intel") || combined.includes("ryzen") || combined.includes("cpu")) return "🧠";
  if (combined.includes("клавиатур") || combined.includes("механик")) return "⌨️";
  if (combined.includes("мышь") || combined.includes("мышка") || combined.includes("mouse")) return "🖱️";
  if (combined.includes("монитор") || combined.includes("дисплей") || combined.includes("screen")) return "🖥️";

  // 5. Electronics & Gadgets 📱🎧🎮
  if (combined.includes("pineapple") || combined.includes("айфон") || combined.includes("iphone") || combined.includes("смартфон") || combined.includes("телефон")) return "📱";
  if (combined.includes("наушник") || combined.includes("airpods") || combined.includes("аудио") || combined.includes("звук") || combined.includes("колонк")) return "🎧";
  if (combined.includes("геймпад") || combined.includes("playstation") || combined.includes("xbox") || combined.includes("консоль") || combined.includes("джойстик")) return "🎮";
  if (combined.includes("часы") || combined.includes("smartwatch") || combined.includes("браслет")) return "⌚";
  if (combined.includes("камер") || combined.includes("фото") || combined.includes("дрон")) return "📷";

  // 6. Dopamine & Toys 🎪🧸🎁
  if (combined.includes("допамин") || combined.includes("бокс") || combined.includes("сюрприз") || combined.includes("mystery") || combined.includes("подарок")) return "🎁";
  if (combined.includes("игрушк") || combined.includes("мишка") || combined.includes("дакимакура") || combined.includes("плюш")) return "🧸";
  if (combined.includes("антистресс") || combined.includes("попит") || combined.includes("сквиш") || combined.includes("спиннер")) return "🔮";
  if (combined.includes("кубик") || combined.includes("настолк") || combined.includes("кости") || combined.includes("игра")) return "🎲";
  if (combined.includes("свеч") || combined.includes("лампа") || combined.includes("ночник")) return "🕯️";
  if (combined.includes("книг") || combined.includes("блокнот") || combined.includes("комикс") || combined.includes("манга")) return "📖";

  return "✨";
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getProductImageUrl(seed: string, name?: string, category?: string): string {
  const cleanSeed = seed || "dopamine-item";
  const hash = hashString(cleanSeed);
  const palette = PALETTES[hash % PALETTES.length];
  const icon = detectIcon(name, category);
  const title = name ? (name.length > 26 ? name.slice(0, 24) + "…" : name) : "Dopamine Item";
  const cat = category || "Синтетический маркет";

  // Escape special XML characters
  const escapeXml = (unsafe: string) =>
    unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const safeTitle = escapeXml(title);
  const safeCategory = escapeXml(cat);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <linearGradient id="bgGrad-${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bg1}" />
      <stop offset="100%" stop-color="${palette.bg2}" />
    </linearGradient>
    <radialGradient id="ambientGlow-${hash}" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.35" />
      <stop offset="70%" stop-color="${palette.glow}" stop-opacity="0.05" />
      <stop offset="100%" stop-color="${palette.glow}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFD37A" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#F2B84B" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background Base -->
  <rect width="400" height="300" fill="url(#bgGrad-${hash})" />
  <rect width="400" height="300" fill="url(#ambientGlow-${hash})" />

  <!-- Ambient star particles -->
  <circle cx="65" cy="45" r="1.5" fill="#FFD37A" opacity="0.7" />
  <circle cx="330" cy="70" r="2" fill="#54ACBF" opacity="0.8" />
  <circle cx="345" cy="220" r="1.5" fill="#FFD37A" opacity="0.6" />
  <circle cx="45" cy="235" r="2" fill="#A7EBF2" opacity="0.7" />
  <polygon points="320,40 323,45 328,45 324,48 326,53 320,50 314,53 316,48 312,45 317,45" fill="#FFD37A" opacity="0.4" />

  <!-- Main Center Icon Platter with layered golden halo -->
  <g transform="translate(200, 115)">
    <circle cx="0" cy="0" r="62" fill="#050B14" fill-opacity="0.6" />
    <circle cx="0" cy="0" r="54" fill="#0B1622" stroke="${palette.glow}" stroke-width="1.5" stroke-opacity="0.4" />
    <circle cx="0" cy="0" r="46" fill="${palette.glow}" fill-opacity="0.12" />
    
    <!-- Central Icon -->
    <text x="0" y="19" font-size="46" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${icon}</text>
    
    <!-- Star sparkle on top right of platter -->
    <g transform="translate(38, -32) scale(0.7)">
      <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#FFD37A" />
    </g>
  </g>

  <!-- Card Border outline -->
  <rect x="1" y="1" width="398" height="298" rx="16" fill="none" stroke="#1E3A50" stroke-width="1.5" stroke-opacity="0.6" />

  <!-- Category Badge Pill -->
  <g transform="translate(200, 218)">
    <text x="0" y="0" fill="#9FB3C4" font-size="12" font-weight="600" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" letter-spacing="0.5">${safeCategory}</text>
  </g>

  <!-- Product Name Title -->
  <g transform="translate(200, 246)">
    <text x="0" y="0" fill="#F4F1E8" font-size="16" font-weight="800" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${safeTitle}</text>
  </g>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
