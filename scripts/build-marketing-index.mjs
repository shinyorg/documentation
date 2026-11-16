#!/usr/bin/env node
// Writes public/marketing/index.html: one page listing every file in the folders under it, each with a preview
// and a download link, with the colour palette at the bottom. The pages are unlisted - nothing on the site links to them and they carry noindex - the link is
// forwarded to people who need the logos.
//
// It also writes color-palette.svg / .png at the root from PALETTE below, so the palette image and the swatches on
// the page never drift apart. Keep PALETTE in step with the tokens in shinysoft.biz's styles.css and this site's
// custom.css.
//
// Re-run after adding or removing files:
//   node scripts/build-marketing-index.mjs                     # this repo's public/marketing
//   node scripts/build-marketing-index.mjs <path/to/marketing> # e.g. the shinysoft.biz copy in bizsites
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = process.argv[2] ?? fileURLToPath(new URL('../public/marketing', import.meta.url));

const PALETTE = [
    {
        group: 'Brand',
        colors: [
            { name: 'Shiny Purple', hex: '#9A81EA' },
            { name: 'Deep Purple', hex: '#523593' },
            { name: 'Shiny Green', hex: '#91F5AD' },
            { name: 'Shiny Lime', hex: '#CFFA12' },
        ],
    },
    {
        group: 'Surfaces',
        colors: [
            { name: 'Night', hex: '#0A0F1A' },
            { name: 'Violet Night', hex: '#1E1633' },
            { name: 'Teal Night', hex: '#0C1B29' },
        ],
    },
    {
        group: 'Logo mark',
        colors: [
            { name: 'Disc Pink', hex: '#FF6088' },
            { name: 'Disc Magenta', hex: '#C83FCB' },
            { name: 'Disc Violet', hex: '#8228F8' },
            { name: 'Ring', hex: '#7E46FF' },
            { name: 'Core Lime', hex: '#A2FF44' },
            { name: 'Core Green', hex: '#36DE48' },
            { name: 'Sun', hex: '#FFD91D' },
            { name: 'Star', hex: '#FC8D26' },
        ],
    },
];

const titles = {
    '': 'Shiny Brand Assets',
    shiny: 'Shiny Logos',
    shinysoft: 'ShinySoft Technologies Logos',
};

const descriptions = {
    '': 'Logos, marks and colours for Shiny (shinylib.net) and ShinySoft Technologies. Click any image to open it full size, or use Download.',
    shiny: 'The Shiny mark used across the Shiny libraries and shinylib.net.',
    shinysoft: 'The ShinySoft Technologies logo. "dark" files are for dark backgrounds (light lettering on transparent), "light" files are for light backgrounds, and "purple" files sit on the brand purple.',
};

const imageTypes = new Set(['.png', '.svg', '.jpg', '.jpeg', '.webp', '.gif']);
const videoTypes = new Set(['.mp4', '.webm']);
const formatOrder = ['.svg', '.ai', '.pdf', '.eps', '.png', '.webp', '.jpg', '.jpeg', '.gif', '.mp4', '.webm'];

const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Dark lettering on light swatches, light lettering on dark ones.
function inkFor(hex) {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5 ? '#14101f' : '#ffffff';
}

function paletteSvg() {
    const width = 1600;
    const pad = 48;
    const gap = 16;
    const rowHeight = 220;
    const labelHeight = 40;
    let y = pad;
    const rows = PALETTE.map(({ group, colors }) => {
        const swatchWidth = (width - pad * 2 - gap * (colors.length - 1)) / colors.length;
        const swatches = colors
            .map(({ name, hex }, i) => {
                const x = pad + i * (swatchWidth + gap);
                const ink = inkFor(hex);
                const top = y + labelHeight;
                return `<rect x="${x}" y="${top}" width="${swatchWidth}" height="${rowHeight}" rx="16" fill="${hex}" stroke="#ffffff" stroke-opacity="0.14" stroke-width="2"/>
<text x="${x + 20}" y="${top + rowHeight - 52}" fill="${ink}" font-size="${colors.length > 4 ? 22 : 30}" font-weight="700">${hex}</text>
<text x="${x + 20}" y="${top + rowHeight - 22}" fill="${ink}" fill-opacity="0.75" font-size="${colors.length > 4 ? 16 : 20}">${escape(name)}</text>`;
            })
            .join('\n');
        const row = `<text x="${pad}" y="${y + 24}" fill="#ece9f7" font-size="20" font-weight="600" letter-spacing="3">${escape(group.toUpperCase())}</text>\n${swatches}`;
        y += labelHeight + rowHeight + pad;
        return row;
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${y}" viewBox="0 0 ${width} ${y}" font-family="Inter, Helvetica Neue, Helvetica, Arial, sans-serif">
<rect width="100%" height="100%" fill="#0A0F1A"/>
${rows.join('\n')}
</svg>
`;
}

async function writePalette() {
    const svg = paletteSvg();
    writeFileSync(join(root, 'color-palette.svg'), svg);
    await sharp(Buffer.from(svg)).png().toFile(join(root, 'color-palette.png'));
    console.log(`wrote ${join(root, 'color-palette.svg')} and .png`);
}

function paletteSection() {
    const groups = PALETTE.map(
        ({ group, colors }) => `<h3>${escape(group)}</h3>
<div class="swatches">
${colors.map(({ name, hex }) => `<div class="swatch"><div class="chip" style="background:${hex}"></div><strong>${hex}</strong><span>${escape(name)}</span></div>`).join('\n')}
</div>`
    ).join('\n');
    return `<section class="palette">
<h2>Colour palette</h2>
<p class="lead">Download as <a href="color-palette.svg" download>SVG</a> or <a href="color-palette.png" download>PNG</a>.</p>
${groups}
</section>`;
}

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function dimensions(path, ext) {
    if (ext === '.png') {
        const header = readFileSync(path).subarray(16, 24);
        return `${header.readUInt32BE(0)} × ${header.readUInt32BE(4)}`;
    }
    if (ext === '.svg') {
        const viewBox = /viewBox="[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)"/.exec(readFileSync(path, 'utf8'));
        return viewBox ? `vector · ${viewBox[1]} × ${viewBox[2]}` : 'vector';
    }
    return '';
}

// Logos meant for dark backgrounds get a dark tile so the light lettering is visible.
function tileClass(name) {
    if (/(^|[-_])dark([-_.]|$)|black/.test(name)) return 'tile tile-dark';
    return 'tile';
}

function preview(src, name, ext) {
    if (imageTypes.has(ext)) return `<img src="${src}" alt="${escape(name)}" loading="lazy">`;
    if (videoTypes.has(ext)) return `<video src="${src}" muted loop autoplay playsinline></video>`;
    return `<span class="badge">${escape(ext.slice(1).toUpperCase())}</span>`;
}

function sortFiles(a, b) {
    const rank = (f) => {
        const i = formatOrder.indexOf(extname(f));
        return i === -1 ? formatOrder.length : i;
    };
    return rank(a) - rank(b) || a.localeCompare(b, undefined, { numeric: true });
}

function card(dir, f) {
    const path = join(dir, f);
    const href = encodeURIComponent(f);
    const src = relative(root, path).split('/').map(encodeURIComponent).join('/');
    const ext = extname(f).toLowerCase();
    const meta = [ext.slice(1).toUpperCase(), dimensions(path, ext), formatSize(statSync(path).size)].filter(Boolean).join(' · ');
    return `<figure class="card">
  <a class="${tileClass(f)}" href="${src}">${preview(src, f, ext)}</a>
  <figcaption><span class="name">${escape(f)}</span><span class="meta">${escape(meta)}</span><a class="download" href="${src}" download="${href}">Download</a></figcaption>
</figure>`;
}

const listFiles = (dir) =>
    readdirSync(dir)
        .filter((f) => !f.startsWith('.') && f !== 'index.html' && statSync(join(dir, f)).isFile())
        .sort(sortFiles);

function section(folder) {
    const dir = join(root, folder);
    return `<section>
<h2>${escape(titles[folder] ?? folder)}</h2>
<p class="lead">${escape(descriptions[folder] ?? '')}</p>
<div class="grid">
${listFiles(dir).map((f) => card(dir, f)).join('\n')}
</div>
</section>`;
}

// One page for everything: a section per folder, any loose files, then the palette last.
function render() {
    const folders = readdirSync(root)
        .filter((f) => !f.startsWith('.') && statSync(join(root, f)).isDirectory())
        .sort();
    const looseFiles = listFiles(root).filter((f) => !f.startsWith('color-palette.'));

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escape(titles[''])}</title>
<style>
:root { --bg: #f7f6fb; --surface: #ffffff; --text: #1c1830; --muted: #6b6782; --border: #e3e0ee; --accent: #6d4fd8; --checker: #ecebf2; --tile-dark: #14101f; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #0e0c16; --surface: #18152a; --text: #ece9f7; --muted: #9b96b3; --border: #2a2640; --accent: #a58cf5; --checker: #221e36; } }
:root[data-theme="dark"] { --bg: #0e0c16; --surface: #18152a; --text: #ece9f7; --muted: #9b96b3; --border: #2a2640; --accent: #a58cf5; --checker: #221e36; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
main { max-width: 1120px; margin: 0 auto; padding: 40px 16px 64px; }
a { color: var(--accent); }
h1 { margin: 0 0 8px; font-size: 28px; }
h2 { margin: 48px 0 6px; font-size: 21px; }
p.lead { margin: 0 0 20px; color: var(--muted); max-width: 70ch; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.card { margin: 0; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
.tile { display: flex; align-items: center; justify-content: center; height: 170px; padding: 16px; background-color: var(--checker); background-image: linear-gradient(45deg, rgba(128,128,128,.08) 25%, transparent 25%, transparent 75%, rgba(128,128,128,.08) 75%), linear-gradient(45deg, rgba(128,128,128,.08) 25%, transparent 25%, transparent 75%, rgba(128,128,128,.08) 75%); background-size: 16px 16px; background-position: 0 0, 8px 8px; }
.tile-dark { background-color: var(--tile-dark); }
.tile img, .tile video { max-width: 100%; max-height: 100%; object-fit: contain; }
.badge { font-weight: 700; font-size: 22px; letter-spacing: .08em; color: var(--muted); border: 2px solid var(--border); border-radius: 8px; padding: 10px 16px; }
figcaption { display: flex; flex-direction: column; gap: 2px; padding: 12px 14px 14px; }
.name { font-weight: 600; font-size: 13px; word-break: break-all; }
.meta { color: var(--muted); font-size: 12px; }
.download { margin-top: 6px; font-size: 13px; font-weight: 600; }
.palette h3 { margin: 24px 0 12px; font-size: 13px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
.swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }
.swatch { display: flex; flex-direction: column; gap: 2px; font-size: 13px; }
.swatch span { color: var(--muted); font-size: 12px; }
.chip { height: 72px; border-radius: 10px; border: 1px solid var(--border); margin-bottom: 6px; }
</style>
</head>
<body>
<main>
<h1>${escape(titles[''])}</h1>
<p class="lead">${escape(descriptions[''])}</p>
${folders.map(section).join('\n')}
${looseFiles.length ? `<section>\n<h2>Other files</h2>\n<div class="grid">\n${looseFiles.map((f) => card(root, f)).join('\n')}\n</div>\n</section>` : ''}
${paletteSection()}
</main>
</body>
</html>
`;
}

await writePalette();
writeFileSync(join(root, 'index.html'), render());
console.log(`wrote ${join(root, 'index.html')}`);
