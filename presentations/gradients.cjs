/**
 * Gradient rasterization for the deck.
 *
 * PowerPoint's own gradient fills top out at simple two-stop shapes and cannot
 * fill text at all, so the site's three-stop purple→green→lime ramp is rendered
 * to PNG here (via sharp's SVG pipeline) and placed as an image. That keeps the
 * ramp pixel-matched to the site at the cost of the text no longer being
 * editable in PowerPoint — a deliberate trade.
 */
const sharp = require('sharp');

const cache = new Map();

/** CSS gradient angles are clockwise from "up"; SVG wants a unit vector. */
function vector(angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const dx = Math.cos(rad), dy = Math.sin(rad);
  return {
    x1: (0.5 - dx / 2).toFixed(4), y1: (0.5 - dy / 2).toFixed(4),
    x2: (0.5 + dx / 2).toFixed(4), y2: (0.5 + dy / 2).toFixed(4),
  };
}

function defs(id, angle, stops) {
  const v = vector(angle);
  const s = stops.map(([o, hex]) => `<stop offset="${o * 100}%" stop-color="#${hex}"/>`).join('');
  return `<linearGradient id="${id}" x1="${v.x1}" y1="${v.y1}" x2="${v.x2}" y2="${v.y2}">${s}</linearGradient>`;
}

async function render(key, svg, trim) {
  if (cache.has(key)) return cache.get(key);
  // No `density` override: the SVG viewports below are already sized in target
  // pixels, and scaling them up again quadruples the embedded PNG for no gain.
  let img = sharp(Buffer.from(svg));
  if (trim) img = img.trim({ threshold: 0 });
  const buf = await img.png().toBuffer();
  const meta = await sharp(buf).metadata();
  const out = { data: 'image/png;base64,' + buf.toString('base64'), ratio: meta.height / meta.width };
  cache.set(key, out);
  return out;
}

/**
 * Gradient-filled text, trimmed tight to the glyphs.
 * Returns { data, ratio } — ratio is height/width of the trimmed art, so the
 * caller can size it on the slide without distorting it.
 */
async function gradientText(text, opts = {}) {
  const { size = 200, weight = 800, font = 'Arial', gradient } = opts;
  const key = ['t', text, size, weight, font, gradient.angle, JSON.stringify(gradient.stops)].join('|');
  // Canvas is generously oversized; trim() crops to the ink so descenders and
  // trailing punctuation are never clipped.
  const w = Math.ceil(text.length * size * 0.85) + size * 2;
  const h = Math.ceil(size * 2.2);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
    `<defs>${defs('g', gradient.angle, gradient.stops)}</defs>` +
    `<text x="${size * 0.5}" y="${size * 1.35}" font-family="${font}" font-size="${size}" ` +
    `font-weight="${weight}" letter-spacing="${-size * 0.03}" fill="url(#g)">${escapeXml(text)}</text>` +
    `</svg>`;
  return render(key, svg, true);
}

/** A gradient bar — the header underline / social-card rule, as an image. */
async function gradientBar(gradient, opts = {}) {
  const { w = 2000, h = 12, radius = 0 } = opts;
  const key = ['b', w, h, radius, gradient.angle, JSON.stringify(gradient.stops)].join('|');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
    `<defs>${defs('g', gradient.angle, gradient.stops)}</defs>` +
    `<rect x="0" y="0" width="${w}" height="${h}" rx="${radius}" ry="${radius}" fill="url(#g)"/>` +
    `</svg>`;
  return render(key, svg, false);
}

/** A rounded gradient plate, for chips and tiles that need the real ramp. */
async function gradientPlate(gradient, opts = {}) {
  const { w = 600, h = 600, radius = 96 } = opts;
  return gradientBar(gradient, { w, h, radius });
}

/** A soft radial glow, echoing the hero's scan field and the card's washes. */
async function radialGlow(hex, opts = {}) {
  const { d = 900, opacity = 0.5 } = opts;
  const key = ['r', hex, d, opacity].join('|');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${d}">` +
    `<defs><radialGradient id="g"><stop offset="0%" stop-color="#${hex}" stop-opacity="${opacity}"/>` +
    `<stop offset="100%" stop-color="#${hex}" stop-opacity="0"/></radialGradient></defs>` +
    `<circle cx="${d / 2}" cy="${d / 2}" r="${d / 2}" fill="url(#g)"/></svg>`;
  return render(key, svg, false);
}

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

module.exports = { gradientText, gradientBar, gradientPlate, radialGlow };
