/**
 * Shiny.NET — "Everything Shiny has to offer" overview deck.
 * Content is taken verbatim-in-spirit from src/content/docs/index.mdx (the central catalog).
 */
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const path = require('path');
const { icon } = require('./icons.cjs');

const REPO = path.resolve(__dirname, '..');
const IMG = (p) => path.join(REPO, 'public/images', p);
// moultrie.svg is rasterized at build time — PowerPoint won't take an SVG.
const MOULTRIE_PNG = path.join(__dirname, '.moultrie.png');

// ── Palette ───────────────────────────────────────────────────────────────
const INK = '0B0918';       // dominant background
const CARD = '19143C';      // card fill on ink
const CARD_HI = '221A52';   // raised card
const LINE = '2E2665';      // hairline
const DEEP = '2A1580';      // section divider ground
const DEEP_CARD = '3C22A6';
const PURPLE = '9B7BFF';
const GREEN = '2BE5A0';
const LIME = 'CFFA12';
const WHITE = 'FFFFFF';
const MUTED = 'AFA8CE';
const DIM = '8079A8';

const HEAD = 'Arial';
const BODY = 'Calibri';
const MONO = 'Courier New';

const W = 13.333, H = 7.5, M = 0.62;
const CW = W - M * 2;

const sh = (o = {}) => Object.assign({ type: 'outer', angle: 90, blur: 14, offset: 4, color: '000000', opacity: 0.45 }, o);

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'Shiny.NET';
pres.company = 'ShinySoft Technologies';
pres.title = 'Shiny.NET — The hard parts of your app, already solved';

// ── Primitives ────────────────────────────────────────────────────────────
function slide(bg = INK) {
  const s = pres.addSlide();
  s.background = { color: bg };
  return s;
}

function txt(s, text, o) {
  s.addText(text, Object.assign({ isTextBox: true, margin: 0, fontFace: BODY, color: WHITE }, o));
}

function card(s, x, y, w, h, o = {}) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.07,
    fill: { color: o.fill || CARD },
    line: { color: o.line || LINE, width: 1 },
    shadow: o.shadow === false ? undefined : sh({ blur: 12, offset: 3, opacity: 0.35 }),
  });
}

async function chip(s, x, y, d, color, iconName, glyphColor) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w: d, h: d, rectRadius: 0.28, fill: { color }, line: { color, width: 0 },
  });
  const pad = d * 0.26;
  s.addImage({ data: await icon(iconName, glyphColor || INK), x: x + pad, y: y + pad, w: d - pad * 2, h: d - pad * 2 });
}

function eyebrow(s, text, color = LIME, y = 0.42) {
  txt(s, text.toUpperCase(), { x: M, y, w: CW, h: 0.24, fontSize: 10.5, bold: true, color, charSpacing: 2.4 });
}

function heading(s, title, sub, opts = {}) {
  txt(s, title, { x: M, y: opts.y || 0.66, w: opts.w || CW, h: 0.62, fontSize: opts.size || 32, bold: true, color: WHITE, fontFace: HEAD });
  if (sub) txt(s, sub, { x: M, y: (opts.y || 0.66) + 0.66, w: opts.subW || CW - 1.2, h: 0.5, fontSize: 13.5, color: MUTED, lineSpacing: 18 });
}

async function photo(s, file, o) {
  const p = file.startsWith('/') ? file : IMG(file);
  const meta = await sharp(p).metadata();
  const ratio = meta.height / meta.width;
  const w = o.w, h = o.h || w * ratio;
  s.addImage(Object.assign({ path: p }, o, { w, h }));
  return h;
}

/**
 * Two of the three customer logos are dark artwork, so they sit on a white
 * plate rather than directly on the card — same treatment for all three.
 */
async function logoPlate(s, file, x, y, pw, ph) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w: pw, h: ph, rectRadius: 0.12, fill: { color: WHITE }, line: { color: WHITE, width: 0 } });
  const p = file.startsWith('/') ? file : IMG(file);
  const meta = await sharp(p).metadata();
  const ar = meta.width / meta.height;
  const maxW = pw - 0.34, maxH = ph - 0.26;
  let w = maxW, h = w / ar;
  if (h > maxH) { h = maxH; w = h * ar; }
  s.addImage({ path: p, x: x + (pw - w) / 2, y: y + (ph - h) / 2, w, h });
}

// Grid of icon cards.
async function cardGrid(s, items, cfg) {
  const { x = M, y, w, h, cols, gapX = 0.26, gapY = 0.26 } = cfg;
  const cw = (w - gapX * (cols - 1)) / cols;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const cx = x + (i % cols) * (cw + gapX);
    const cy = y + Math.floor(i / cols) * (h + gapY);
    card(s, cx, cy, cw, h, { fill: it.fill || CARD });
    const d = cfg.chip || 0.42;
    await chip(s, cx + 0.26, cy + 0.24, d, it.color || PURPLE, it.icon);
    txt(s, it.title, {
      x: cx + 0.26 + d + 0.18, y: cy + 0.24 + (d - 0.26) / 2, w: cw - (0.26 + d + 0.18) - 0.2, h: 0.28,
      fontSize: cfg.titleSize || 13.5, bold: true, color: WHITE,
    });
    txt(s, it.desc, {
      x: cx + 0.26, y: cy + 0.24 + d + 0.16, w: cw - 0.52, h: h - (0.24 + d + 0.16) - 0.16,
      fontSize: cfg.descSize || 10.5, color: MUTED, lineSpacing: cfg.lead || 14, valign: 'top',
    });
  }
}

// Small pill (text only).
function pill(s, text, x, y, w, o = {}) {
  const h = o.h || 0.34;
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.16,
    fill: { color: o.fill || CARD_HI }, line: { color: o.line || LINE, width: 1 },
  });
  txt(s, text, { x, y, w, h, fontSize: o.size || 10.5, color: o.color || MUTED, align: 'center', valign: 'middle', bold: o.bold });
}

// ── Section divider ───────────────────────────────────────────────────────
async function divider(n, title, sub, topics, iconName, notes) {
  const s = slide(DEEP);
  await chip(s, M, 1.9, 0.92, LIME, iconName);
  txt(s, `SECTION ${n}`, { x: M, y: 3.12, w: 5, h: 0.26, fontSize: 11, bold: true, color: LIME, charSpacing: 2.6 });
  txt(s, title, { x: M, y: 3.42, w: 6.6, h: 1.0, fontSize: 40, bold: true, color: WHITE, fontFace: HEAD });
  txt(s, sub, { x: M, y: 4.52, w: 6.2, h: 0.9, fontSize: 14, color: 'D6CCFF', lineSpacing: 20 });

  const bx = 7.55, bw = W - bx - M;
  let by = 1.9;
  for (const t of topics) {
    s.addShape(pres.ShapeType.roundRect, {
      x: bx, y: by, w: bw, h: 0.52, rectRadius: 0.14,
      fill: { color: DEEP_CARD }, line: { color: '5335C9', width: 1 },
    });
    txt(s, t, { x: bx + 0.34, y: by, w: bw - 0.6, h: 0.52, fontSize: 12.5, color: WHITE, valign: 'middle' });
    by += 0.66;
  }
  if (notes) s.addNotes(notes);
  return s;
}

// ── Content ───────────────────────────────────────────────────────────────
async function build() {

  // 1 ── Title ────────────────────────────────────────────────────────────
  {
    const s = slide(INK);
    txt(s, 'SHINY.NET', { x: M, y: 0.9, w: 4, h: 0.3, fontSize: 12, bold: true, color: LIME, charSpacing: 3.2 });
    txt(s, 'The hard parts\nof your app,\nalready solved.', {
      x: M, y: 1.3, w: 7.4, h: 2.35, fontSize: 42, bold: true, color: WHITE, fontFace: HEAD, lineSpacing: 50,
    });
    txt(s, 'Bluetooth LE, background jobs, geofencing, push, an HTTP server that runs inside your MAUI app, a document database, 67 UI controls. Thirty-plus libraries that own the platform code, the permissions and the background execution — so your time goes to the app your users actually asked for.', {
      x: M, y: 3.72, w: 7.3, h: 1.2, fontSize: 13, color: MUTED, lineSpacing: 19,
    });

    const facts = [
      { v: '40M+', l: 'NuGet downloads', c: LIME },
      { v: '30+', l: 'libraries', c: GREEN },
      { v: '67', l: 'UI controls', c: PURPLE },
      { v: 'AOT', l: 'trim-clean', c: WHITE },
    ];
    facts.forEach((f, i) => {
      const x = M + i * 1.86;
      txt(s, f.v, { x, y: 4.92, w: 1.7, h: 0.62, fontSize: 32, bold: true, color: f.c, fontFace: HEAD });
      txt(s, f.l, { x, y: 5.55, w: 1.7, h: 0.28, fontSize: 10.5, color: DIM });
    });

    txt(s, 'shinylib.net  ·  built and maintained by ShinySoft Technologies', {
      x: M, y: 6.5, w: 7, h: 0.3, fontSize: 11, color: DIM,
    });

    await photo(s, 'tableview/s1.png', { x: 8.55, y: 0.62, w: 2.05, shadow: sh({ blur: 26, offset: 8, opacity: 0.6 }) });
    await photo(s, 'chatview/s1.png', { x: 10.78, y: 1.42, w: 1.85, shadow: sh({ blur: 26, offset: 8, opacity: 0.6 }) });
    s.addNotes('Shiny is a suite of 30+ independent .NET libraries. The pitch in one line: the platform-specific plumbing every app needs is already written, tested and shipping in production apps with 40M+ NuGet downloads. Everything here runs on .NET 9+, is AOT and trimming clean, and is MIT licensed.');
  }

  // 2 ── Why Shiny ────────────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Why Shiny');
    heading(s, 'Three things you stop writing', 'Every Shiny library owns the same three burdens end to end, on every platform it supports — so the same C# you write once behaves the same everywhere.');
    await cardGrid(s, [
      { icon: 'FaPlug', color: PURPLE, title: 'The platform code', desc: 'One C# API over CoreBluetooth and Android BluetoothGatt, HealthKit and Health Connect, EventKit and the Android calendar provider. No #if ANDROID ladders in your view models.' },
      { icon: 'FaShieldHalved', color: GREEN, title: 'The permissions', desc: 'Runtime prompts, Info.plist keys and manifest entries handled for you — declared once in your .csproj and generated at build, surfaced at runtime as a single AccessState.' },
      { icon: 'FaClock', color: LIME, title: 'Background execution', desc: 'Jobs, transfers, GPS and geofences that keep running when the app is off screen, using each platform’s real background APIs and surviving restarts.' },
    ], { y: 2.35, w: CW, h: 2.5, cols: 3, titleSize: 15, descSize: 12, lead: 16, chip: 0.5 });

    card(s, M, 5.35, CW, 1.05, { fill: CARD_HI });
    txt(s, 'Everything runs on .NET 9 and later, is AOT and trimming clean, and ships as independent NuGet packages — take one library or take the suite.', {
      x: M + 0.4, y: 5.35, w: CW - 0.8, h: 1.05, fontSize: 14, color: WHITE, valign: 'middle', italic: true,
    });
    s.addNotes('This is the through-line for the whole deck. Every library in the catalog earns its place by taking on the same three burdens. If a team is writing #if ANDROID blocks, hand-editing Info.plist, or fighting WorkManager and BGTaskScheduler, that is the work Shiny removes.');
  }

  // 3 ── The map ──────────────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'The catalog');
    heading(s, 'Thirty-plus packages, nine problem areas', 'Grouped by the problem they solve, not by the platform they run on.');
    await cardGrid(s, [
      { icon: 'FaBook', color: PURPLE, title: 'Foundation', desc: 'Architecture, hosting, Mediator, DI, source generators' },
      { icon: 'FaBluetooth', color: GREEN, title: 'Hardware & Connectivity', desc: 'BLE, GPS, OBD, discovery, Wi-Fi, screen capture' },
      { icon: 'FaMobileScreenButton', color: PURPLE, title: 'Device Data', desc: 'Music, health, contacts, calendars' },
      { icon: 'FaBrain', color: LIME, title: 'AI & Intelligence', desc: 'Conversation, speech, face, voice, documents' },
      { icon: 'FaBell', color: PURPLE, title: 'Background & Delivery', desc: 'Jobs, transfers, local and push notifications' },
      { icon: 'FaRocket', color: GREEN, title: 'MAUI App', desc: 'Shell navigation, hosting, config, permissions' },
      { icon: 'FaPalette', color: PURPLE, title: 'UI Controls', desc: '67 controls for MAUI and Blazor, one theme contract' },
      { icon: 'FaDatabase', color: GREEN, title: 'Data & Storage', desc: 'Document DB, spatial, data sync, key/value stores' },
      { icon: 'FaCloud', color: PURPLE, title: 'Server & Cloud', desc: 'Embeddable HTTP server, push dispatch, Aspire' },
    ], { y: 2.3, w: CW, h: 1.45, cols: 3, gapY: 0.28, titleSize: 13.5, descSize: 10.5, chip: 0.4 });
    s.addNotes('The agenda for the rest of the deck. Nine groups, walked in this order. Nothing here is all-or-nothing — each group is a set of separate NuGet packages, so a team can adopt exactly one and never see the rest.');
  }

  // 4 ── Reach ────────────────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Reach');
    heading(s, 'One suite, every .NET target', 'The same packages run on the phone in a pocket, the desktop on a bench, the browser tab and the server rack.');

    const targets = ['iOS', 'Android', 'Mac Catalyst', 'macOS', 'Windows', 'Linux', 'Blazor WASM', 'ASP.NET Core'];
    targets.forEach((t, i) => {
      pill(s, t, M + (i % 4) * 3.06, 2.5 + Math.floor(i / 4) * 0.68, 2.8, { h: 0.54, size: 12.5, color: WHITE, bold: true, fill: CARD_HI });
    });

    await cardGrid(s, [
      { icon: 'FaBolt', color: LIME, title: 'AOT & trimming clean', desc: 'Source generators replace reflection, so a route or a contract that cannot bind fails your build rather than your deployment.' },
      { icon: 'FaCubes', color: PURPLE, title: 'Independent packages', desc: 'Reference only what you use. No god-package, no transitive surprises, no framework lock-in.' },
      { icon: 'FaCode', color: GREEN, title: 'Open source', desc: 'MIT-licensed on GitHub, maintained by the same people who ship production apps on it every day.' },
    ], { y: 4.28, w: CW, h: 2.15, cols: 3, titleSize: 14, descSize: 11.5, lead: 15, chip: 0.46 });

    txt(s, 'Not every library supports every target — but where a platform has the capability, Shiny exposes it through the same interface.', {
      x: M, y: 6.68, w: CW, h: 0.32, fontSize: 11, color: DIM, italic: true,
    });
    s.addNotes('Worth stressing that this is not a mobile-only suite. Mediator, Document DB, serialization and the HTTP server all run server-side, which means the same contracts and the same storage API on both ends of a system.');
  }

  // 5 ── Divider: Foundation ──────────────────────────────────────────────
  await divider('01', 'Foundation', 'The concepts, tooling and cross-cutting libraries every Shiny app is built on — whatever it targets.',
    ['App Builder & templates', 'Architecture: services, delegates, observables', 'Hosting models — MAUI, native, manual', 'Mediator', 'Dependency Injection & Reflector', 'Serialization & Localization generators'], 'FaBook',
    'Section one. Everything in Foundation is optional on its own but assumed by everything else — this is where the hosting model and the source generators live.');

  // 6 ── Foundation ───────────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Section 01 · Foundation');
    heading(s, 'Start here', 'Source generation instead of reflection, one hosting call instead of platform boilerplate.');
    await cardGrid(s, [
      { icon: 'FaWandMagicSparkles', color: LIME, title: 'App Builder', desc: 'An interactive wizard that generates the boilerplate, packages and configuration for your project.' },
      { icon: 'FaSitemap', color: PURPLE, title: 'Architecture', desc: 'Services, delegates and observables — the core concepts underpinning the whole ecosystem.' },
      { icon: 'FaRocket', color: GREEN, title: 'Hosting Models', desc: 'MAUI, native or manual hosting. One call wires lifecycle, DI and background services.' },
      { icon: 'FaCircleNodes', color: PURPLE, title: 'Mediator', desc: 'The mediator pattern for every .NET app — source-generated, AOT-ready, middleware-driven.' },
      { icon: 'FaGear', color: GREEN, title: 'Dependency Injection', desc: 'Attribute-driven registration with source generation. Tag your classes, generate your registrations.' },
      { icon: 'FaBolt', color: PURPLE, title: 'Reflector', desc: 'Source-generated property access that eliminates reflection for AOT-safe, high-performance code.' },
      { icon: 'FaFileLines', color: PURPLE, title: 'Serialization', desc: 'Every JsonSerializerContext behind one AOT-safe ISerializer. Mark it, and it auto-registers.' },
      { icon: 'FaLanguage', color: GREEN, title: 'Localization Generator', desc: 'Strongly-typed classes generated from your .resx files. No more typo-prone string lookups.' },
    ], { y: 2.22, w: CW, h: 1.85, cols: 4, gapX: 0.24, gapY: 0.24, titleSize: 12.5, descSize: 10, lead: 13, chip: 0.4 });

    card(s, M, 6.42, CW, 0.66, { fill: CARD_HI });
    txt(s, 'AI Skills  ·  every Shiny library ships an AI coding-assistant skill for Claude Code and GitHub Copilot', {
      x: M + 0.4, y: 6.42, w: CW - 0.8, h: 0.66, fontSize: 12.5, color: WHITE, valign: 'middle',
    });
    s.addNotes('Foundation is the part people underestimate. The source generators (DI, Reflector, Serialization, LocalizeGen) are what make the rest of the suite AOT-safe — no reflection at runtime means no trimming surprises when you flip on full AOT for an iOS release build.');
  }

  // 7 ── Mediator spotlight ───────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Spotlight');
    heading(s, 'Mediator', 'A mediator built for all .NET apps — mobile, desktop and server. Add offline support, caching, validation or resiliency with a single attribute.');

    // pipeline flow
    const flowY = 2.62;
    const nodes = [
      { t: 'Request', c: LIME },
      { t: 'Middleware', c: PURPLE },
      { t: 'Handler', c: GREEN },
    ];
    let fx = M;
    nodes.forEach((n, i) => {
      const w = 1.72;
      s.addShape(pres.ShapeType.roundRect, { x: fx, y: flowY, w, h: 0.62, rectRadius: 0.15, fill: { color: n.c }, line: { color: n.c, width: 0 } });
      txt(s, n.t, { x: fx, y: flowY, w, h: 0.62, fontSize: 12.5, bold: true, color: INK, align: 'center', valign: 'middle' });
      fx += w;
      if (i < nodes.length - 1) {
        s.addShape(pres.ShapeType.line, { x: fx + 0.1, y: flowY + 0.31, w: 0.5, h: 0, line: { color: DIM, width: 1.75, endArrowType: 'triangle' } });
        fx += 0.7;
      }
    });

    txt(s, 'Attributes on the contract — the handler never knows the middleware is there.', {
      x: M, y: 3.42, w: 6.4, h: 0.32, fontSize: 11.5, color: DIM, italic: true,
    });

    const mws = ['Offline caching', 'Memory & storage cache', 'Validation', 'Resiliency & retry', 'Timed & performance logging', 'Replay streams', 'User error handling', 'Refresh timers'];
    mws.forEach((m, i) => {
      pill(s, m, M + (i % 2) * 3.3, 3.95 + Math.floor(i / 2) * 0.5, 3.1, { size: 10.5, color: WHITE });
    });

    card(s, 7.3, 2.4, W - 7.3 - M, 4.35, { fill: CARD_HI });
    txt(s, 'Works where you already are', { x: 7.62, y: 2.62, w: 4.9, h: 0.34, fontSize: 15, bold: true, color: WHITE });
    const hosts = [
      ['.NET MAUI & Blazor', 'View-model wiring, connectivity broadcasts and lifecycle-aware handlers.'],
      ['ASP.NET Core', 'Contracts published straight out as HTTP endpoints, with OpenAPI.'],
      ['Uno Platform & Prism', 'The same contracts across every client shell you ship.'],
      ['Microsoft.Extensions.AI', 'Requests and commands exposed as AI-callable tools with generated schemas.'],
      ['Dapper & DocumentDb', 'Data access handlers without a repository layer to maintain.'],
    ];
    let hy = 3.1;
    for (const [t, d] of hosts) {
      txt(s, t, { x: 7.62, y: hy, w: 4.9, h: 0.26, fontSize: 12, bold: true, color: GREEN });
      txt(s, d, { x: 7.62, y: hy + 0.26, w: 4.9, h: 0.42, fontSize: 10.5, color: MUTED, lineSpacing: 13 });
      hy += 0.72;
    }
    s.addNotes('Mediator is the piece that most often becomes the backbone of an app. The key idea: middleware is declared as attributes on the contract, so offline caching or retry policy is a one-line change on a request type and the handler stays untouched. Source-generated, so it works under full AOT.');
  }

  // 8 ── Code ─────────────────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Getting started');
    heading(s, 'One line wires the whole thing up', 'UseShiny() handles every Android lifecycle callback, iOS delegate method and Windows integration. No platform-specific boilerplate.');

    const cx = M, cy = 2.35, cwv = 7.5, chv = 4.45;
    card(s, cx, cy, cwv, chv, { fill: '0F0B26', line: '332A6B' });
    const K = 'C792EA', T = '82AAFF', S = 'C3E88D', C = '6B6494', P = 'E6E1FF';
    const code = [
      [[K, 'public static class '], [T, 'MauiProgram']],
      [[P, '{']],
      [[P, '    '], [K, 'public static '], [T, 'MauiApp '], [P, 'CreateMauiApp'], [P, '() =>']],
      [[P, '        MauiApp.CreateBuilder()']],
      [[P, '            .UseMauiApp<'], [T, 'App'], [P, '>()']],
      [[P, '            .'], [S, 'UseShiny'], [P, '()          '], [C, '// all lifecycle, all platforms']],
      [[P, '            .ConfigureServices(svc =>']],
      [[P, '            {']],
      [[P, '                svc.'], [S, 'AddGps'], [P, '<'], [T, 'MyGpsDelegate'], [P, '>();']],
      [[P, '                svc.'], [S, 'AddJob'], [P, '('], [K, 'typeof'], [P, '('], [T, 'SyncJob'], [P, '));']],
      [[P, '                svc.'], [S, 'AddBluetoothLE'], [P, '();']],
      [[P, '                svc.'], [S, 'AddNotifications'], [P, '<'], [T, 'MyDelegate'], [P, '>();']],
      [[P, '            })']],
      [[P, '            .Build();']],
      [[P, '}']],
    ];
    const runs = [];
    code.forEach((line, li) => {
      line.forEach((r, ri) => {
        runs.push({ text: r[1], options: { color: r[0], breakLine: ri === line.length - 1 && li < code.length - 1 } });
      });
    });
    s.addText(runs, { isTextBox: true, x: cx + 0.34, y: cy + 0.28, w: cwv - 0.68, h: chv - 0.56, fontFace: MONO, fontSize: 11.5, lineSpacing: 17, margin: 0, valign: 'top' });

    await cardGrid(s, [
      { icon: 'FaCheck', color: GREEN, title: 'No #if platform ladders', desc: 'Register services once. Shiny resolves the native implementation per target.' },
      { icon: 'FaShieldHalved', color: PURPLE, title: 'Permissions declared once', desc: 'MSBuild generates the Android manifest and iOS Info.plist entries from your .csproj.' },
      { icon: 'FaBolt', color: LIME, title: 'Delegates, not callbacks', desc: 'Background events resolve a DI-injected delegate class — even after a cold start.' },
    ], { x: 8.4, y: 2.35, w: W - 8.4 - M, h: 1.4, cols: 1, gapY: 0.23, titleSize: 12.5, descSize: 10, lead: 13, chip: 0.38 });
    s.addNotes('Demo point: this is the entire integration surface for most apps. UseShiny() is the only platform wiring; everything after it is ordinary service registration. Each Add* call brings its own background handling, permission requirements and platform implementations with it.');
  }

  // 9 ── Divider: Hardware & Device Data ──────────────────────────────────
  await divider('02', 'Hardware & Device Data', 'Talk to the radios, sensors and local network — and to the data stores the OS already owns.',
    ['Bluetooth LE, client and peripheral', 'GPS, geofencing and OBD', 'mDNS, SSDP and WS-Discovery', 'Wi-Fi and screen recording', 'Music, health, contacts and calendars'], 'FaBluetooth',
    'Section two. Two related groups: the radios and sensors on one side, the OS-owned data stores on the other. Both are places where the native APIs differ wildly between platforms.');

  // 10 ── Hardware ────────────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Section 02 · Hardware & Connectivity');
    heading(s, 'Radios, sensors and the local network', 'One API across iOS, Android, Windows, macOS and beyond.');
    await cardGrid(s, [
      { icon: 'FaBluetooth', color: PURPLE, title: 'Bluetooth LE', desc: 'Full BLE client — scanning, connection management, GATT services and background operations.' },
      { icon: 'FaTowerBroadcast', color: GREEN, title: 'BLE Hosting', desc: 'Advertise your device as a BLE peripheral with custom GATT services.' },
      { icon: 'FaLocationDot', color: LIME, title: 'GPS & Geofencing', desc: 'Foreground and background location tracking with geofence monitoring.' },
      { icon: 'FaCarOn', color: PURPLE, title: 'OBD', desc: 'On-board diagnostics over BLE with extensible commands and custom transports.' },
      { icon: 'FaMagnifyingGlass', color: GREEN, title: 'Network Discovery', desc: 'mDNS/DNS-SD, SSDP/UPnP and WS-Discovery — find printers, cameras, IoT and your own app.' },
      { icon: 'FaWifi', color: PURPLE, title: 'Wi-Fi', desc: 'Enumerate and connect to networks, manage known networks, control the device hotspot.' },
      { icon: 'FaVideo', color: GREEN, title: 'Screen Recording', desc: 'Capture the device screen with the platform’s native recorder.' },
    ], { y: 2.3, w: CW, h: 2.05, cols: 4, gapX: 0.24, gapY: 0.26, titleSize: 12.5, descSize: 10, lead: 13, chip: 0.42 });

    card(s, M + (CW - 0.24 * 3) / 4 * 3 + 0.24 * 3, 4.61, (CW - 0.24 * 3) / 4, 2.05, { fill: CARD_HI });
    txt(s, 'Battery-aware by design', { x: M + ((CW - 0.72) / 4 + 0.24) * 3 + 0.26, y: 4.85, w: (CW - 0.72) / 4 - 0.52, h: 0.5, fontSize: 12.5, bold: true, color: LIME });
    txt(s, 'Scanning, tracking and background work use each platform’s power-managed APIs and restore themselves after a reboot or an app kill.', {
      x: M + ((CW - 0.72) / 4 + 0.24) * 3 + 0.26, y: 5.35, w: (CW - 0.72) / 4 - 0.52, h: 1.1, fontSize: 10.5, color: MUTED, lineSpacing: 13,
    });
    s.addNotes('BLE is the library Shiny is best known for — a full client with proper connection state management, plus BLE Hosting to act as a peripheral. Network Discovery covers all three protocols that matter in practice, which is why it turns up in printer, casting and ONVIF camera integrations.');
  }

  // 11 ── Device Data ─────────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Section 02 · Device Data');
    heading(s, 'The data the OS already owns', 'Music, health, contacts and calendars behind one cross-platform API — with permissions handled for you.');
    await cardGrid(s, [
      { icon: 'FaMusic', color: PURPLE, title: 'Music Library', desc: 'Query tracks, browse by genre, decade or playlist, and play music straight from the device library.' },
      { icon: 'FaHeartPulse', color: GREEN, title: 'Health Data', desc: 'Apple HealthKit and Android Health Connect unified — 12 metrics including steps, heart rate, blood pressure and sleep.' },
      { icon: 'FaAddressBook', color: LIME, title: 'Contact Store', desc: 'Device contacts with full CRUD, LINQ queries translated to native predicates, and MAUI permission classes.' },
      { icon: 'FaCalendarDays', color: PURPLE, title: 'Calendar Store', desc: 'Calendars and events on iOS, Mac Catalyst, macOS, Android and Windows. IQueryable<CalendarEvent> pushes the calendar id and date window into the native fetch; attendees, reminders, availability and iOS 17 write-only access included.' },
    ], { y: 2.35, w: CW, h: 1.95, cols: 2, gapX: 0.3, gapY: 0.28, titleSize: 15, descSize: 12, lead: 16, chip: 0.5 });

    card(s, M, 6.72, CW, 0.52, { fill: CARD_HI, shadow: false });
    txt(s, 'All four expose Shiny’s AccessState permission model, and all four are available as AI tools.', {
      x: M + 0.4, y: 6.72, w: CW - 0.8, h: 0.52, fontSize: 11.5, color: WHITE, valign: 'middle',
    });
    s.addNotes('These four wrap the OS data stores that are otherwise painful: HealthKit vs Health Connect have completely different shapes, and EventKit vs the Android calendar provider even more so. The LINQ providers matter — a query is translated into the native fetch rather than pulling everything into memory and filtering in C#.');
  }

  // 12 ── Divider: AI ─────────────────────────────────────────────────────
  await divider('03', 'AI & Intelligence', 'Conversation, speech and on-device recognition — with the heavy lifting kept off the UI thread.',
    ['AI Conversations — chat, voice, hands-free', 'Speech-to-text and text-to-speech', 'Face and speaker recognition', 'Document scanning and extraction', 'AI tools across the whole suite'], 'FaBrain',
    'Section three. Two halves: the intelligence libraries themselves, then the AI tool generation that runs across the entire suite.');

  // 13 ── AI & Intelligence ───────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Section 03 · AI & Intelligence');
    heading(s, 'The intelligence layer', 'On-device where it matters, pluggable providers where it helps.');
    await cardGrid(s, [
      { icon: 'FaComments', color: LIME, title: 'AI Conversations', desc: 'Microsoft.Extensions.AI chat completions plus speech recognition, text-to-speech, wake word and audio feedback — text, voice and hands-free behind one IAiConversationService.' },
      { icon: 'FaMicrophone', color: PURPLE, title: 'Speech', desc: 'Speech-to-text, text-to-speech, audio capture and playback with pluggable cloud providers — Azure AI Speech and ElevenLabs.' },
      { icon: 'FaFaceSmile', color: GREEN, title: 'Face Intelligence', desc: 'ArcFace embeddings with nearest-neighbour vector search. A dependency-free core, swappable ONNX embedder and vector stores, plus MAUI controls for live recognition and guided enrollment.' },
      { icon: 'FaWaveSquare', color: PURPLE, title: 'Voice Intelligence', desc: 'Speaker recognition on the same architecture: ECAPA/CAM++ voiceprints, cosine-distance matching and enrollment that checks level, clipping, SNR and agreement before storing.' },
      { icon: 'FaIdCard', color: GREEN, title: 'Document Intelligence', desc: 'VisionKit, ML Kit and Vision behind one IDocumentScanner — plus on-device extraction of receipts, invoices, AAMVA licences, ICAO passports and Luhn-validated cards.' },
    ], { y: 2.35, w: CW, h: 2.15, cols: 3, gapX: 0.26, gapY: 0.26, titleSize: 13.5, descSize: 11, lead: 14.5, chip: 0.46 });

    card(s, M + ((CW - 0.52) / 3 + 0.26) * 2, 4.76, (CW - 0.52) / 3, 2.15, { fill: CARD_HI });
    const px = M + ((CW - 0.52) / 3 + 0.26) * 2 + 0.26, pw = (CW - 0.52) / 3 - 0.52;
    txt(s, 'Privacy by default', { x: px, y: 5.0, w: pw, h: 0.3, fontSize: 13.5, bold: true, color: LIME });
    txt(s, 'Face and voice biometrics, card numbers and document fields are processed on the device. Capture stays inside your app, so it works with any audio or camera pipeline you already have — and CVVs are never read, PANs never logged.', {
      x: px, y: 5.36, w: pw, h: 1.4, fontSize: 11, color: MUTED, lineSpacing: 14.5,
    });
    s.addNotes('Face and Voice Intelligence share one architecture: a dependency-free core with swappable ONNX models and vector stores, so you can start with the bundled models and replace them without touching your code. The enrollment wizards refuse bad samples up front, which is what makes recognition accuracy usable in the field.');
  }

  // 14 ── AI tools ────────────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Powered by Microsoft.Extensions.AI');
    heading(s, 'Your app, callable by an agent', 'Turn contracts, services, routes and data into AI-callable tools — source-generated, AOT-safe function calling across mobile, desktop, web and server.');

    const tools = [
      ['FaComments', 'AI Conversations', 'Chat, speech and wake word behind one interface.'],
      ['FaRocket', 'Shell Navigation', 'Generated AITools let an agent discover and hit your routes.'],
      ['FaPuzzlePiece', 'Mediator', 'Requests and commands as AIFunctions with generated schemas.'],
      ['FaGear', 'Dependency Injection', 'Tag a service interface, get reflection-free tools registered.'],
      ['FaDatabase', 'Document DB', 'Vector search, structured filters and auto-embed on insert.'],
      ['FaHeartPulse', 'Health', 'Read steps, heart rate and sleep; log workouts on opt-in.'],
      ['FaAddressBook', 'Contacts', 'Search the address book; create and update on write opt-in.'],
      ['FaCalendarDays', 'Calendar', 'List calendars and search events in a date window.'],
      ['FaBell', 'Reminders', 'List pending reminders, schedule and cancel them.'],
      ['FaLocationDot', 'Location', 'Read-only GPS awareness, distance and travel estimates.'],
      ['FaMusic', 'Music', 'Search the library, control playback, manage playlists.'],
    ];
    const cols = 4, gx = 0.26, gy = 0.26, cwv = (CW - gx * (cols - 1)) / cols, chv = 1.22, gyTop = 2.62;
    for (let i = 0; i < tools.length; i++) {
      const [ic, t, d] = tools[i];
      const x = M + (i % cols) * (cwv + gx), y = gyTop + Math.floor(i / cols) * (chv + gy);
      card(s, x, y, cwv, chv);
      await chip(s, x + 0.24, y + 0.24, 0.36, i % 3 === 2 ? GREEN : PURPLE, ic);
      txt(s, t, { x: x + 0.68, y: y + 0.27, w: cwv - 0.9, h: 0.3, fontSize: 12, bold: true, color: WHITE });
      txt(s, d, { x: x + 0.24, y: y + 0.68, w: cwv - 0.48, h: 0.45, fontSize: 9.5, color: MUTED, lineSpacing: 12 });
    }
    card(s, M + 3 * (cwv + gx), gyTop + 2 * (chv + gy), cwv, chv, { fill: CARD_HI });
    txt(s, 'Read-only by default.\nWrites are opt-in, per operation.', {
      x: M + 3 * (cwv + gx) + 0.24, y: gyTop + 2 * (chv + gy), w: cwv - 0.48, h: chv, fontSize: 11.5, color: LIME, valign: 'middle', bold: true, lineSpacing: 16,
    });
    s.addNotes('This is the slide to linger on for an AI-curious audience. The tools are generated from code you already wrote — attributes on a Mediator contract, a tagged service interface, a Shell route — so there is no separate tool-definition layer to keep in sync. Everything is AOT-safe, and device-data tools are read-only until you opt in per operation.');
  }

  // 15 ── Divider: Background & MAUI ──────────────────────────────────────
  await divider('04', 'Background, Delivery & MAUI', 'Work that keeps running when your app is off screen, and the plumbing that holds a MAUI app together.',
    ['Background jobs that survive restarts', 'Resumable HTTP transfers', 'Local and push notifications', 'Shell navigation and MAUI hosting', 'Configuration and MSBuild permissions'], 'FaClock',
    'Section four. The two groups most MAUI teams reach for first: work that outlives the foreground, and the app scaffolding around it.');

  // 16 ── Background & Delivery ───────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Section 04 · Background & Delivery');
    heading(s, 'When the app is not on screen', 'Scheduled work, transfers and the notifications that bring users back.');
    await cardGrid(s, [
      { icon: 'FaClock', color: PURPLE, title: 'Background Jobs', desc: 'Periodic and one-shot tasks that survive app restarts, with platform-aware scheduling and battery optimization.' },
      { icon: 'FaArrowRightArrowLeft', color: GREEN, title: 'HTTP Transfers', desc: 'Resumable background uploads and downloads with progress monitoring, Azure Blob Storage support and foreground service integration.' },
      { icon: 'FaBell', color: LIME, title: 'Local Notifications', desc: 'Rich local notifications with channels, scheduling triggers and platform-specific customization.' },
      { icon: 'FaPaperPlane', color: PURPLE, title: 'Push Notifications', desc: 'Native, Firebase and Azure Notification Hub providers behind one delegate model on the device.' },
    ], { y: 2.42, w: CW, h: 2.35, cols: 4, gapX: 0.26, titleSize: 13.5, descSize: 11, lead: 14.5, chip: 0.46 });

    card(s, M, 5.15, CW, 1.6, { fill: CARD_HI });
    txt(s, 'Delegates, not callbacks', { x: M + 0.4, y: 5.4, w: 4.6, h: 0.3, fontSize: 14, bold: true, color: LIME });
    txt(s, 'Every background event resolves a DI-injected delegate class, so your handler gets its dependencies even when the OS starts the app cold, minutes after the user closed it. Sending from a backend is covered separately by Shiny Push (Server) — APNs, FCM and Web Push through one API.', {
      x: M + 0.4, y: 5.76, w: CW - 0.8, h: 0.85, fontSize: 12, color: MUTED, lineSpacing: 16,
    });
    s.addNotes('Background work is where cross-platform frameworks usually break down, because iOS and Android disagree about almost everything. Shiny normalises the scheduling model and, critically, handles the cold-start case: the OS can launch your process just to deliver a geofence crossing or a completed download, and your delegate still gets constructor-injected dependencies.');
  }

  // 17 ── MAUI app ────────────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Section 04 · MAUI App');
    heading(s, 'The plumbing that holds an app together', 'Navigation, hosting, configuration and permissions — without the magic strings.');
    await cardGrid(s, [
      { icon: 'FaCompass', color: PURPLE, title: 'Shell Navigation', desc: 'Opinionated Shell navigation with source-generated routes, strongly-typed parameters and proper ViewModel lifecycle management.' },
      { icon: 'FaLayerGroup', color: GREEN, title: 'MAUI Hosting', desc: 'Modular app configuration with IMauiModule, static service access and platform lifecycle dispatch.' },
      { icon: 'FaSliders', color: PURPLE, title: 'Configuration', desc: 'Platform preference bundles, JSON configuration and remote configuration built for mobile apps.' },
      { icon: 'FaShieldHalved', color: LIME, title: 'MSBuild Permissions', desc: 'Declare permissions once in your project file; MSBuild generates the Android manifest and iOS Info.plist entries.' },
    ], { x: M, y: 2.42, w: 8.2, h: 2.1, cols: 2, gapX: 0.28, gapY: 0.28, titleSize: 13.5, descSize: 11, lead: 14.5, chip: 0.46 });

    card(s, 9.15, 2.42, W - 9.15 - M, 4.48, { fill: CARD_HI });
    txt(s, 'No more magic strings', { x: 9.45, y: 2.7, w: 3.0, h: 0.36, fontSize: 15, bold: true, color: WHITE });
    txt(s, 'Routes, parameters and permissions are all generated at build time from what you declared. A renamed page or a missing manifest entry becomes a compiler error, not a crash report from a customer.', {
      x: 9.45, y: 3.14, w: 3.05, h: 1.5, fontSize: 11.5, color: MUTED, lineSpacing: 15,
    });
    txt(s, 'Already have a project?', { x: 9.45, y: 5.3, w: 3.05, h: 0.3, fontSize: 12, bold: true, color: GREEN });
    txt(s, 'The App Builder generates the packages, hosting call and registrations for what you pick — paste it into an existing app.', {
      x: 9.45, y: 5.64, w: 3.05, h: 1.0, fontSize: 11, color: MUTED, lineSpacing: 14,
    });
    s.addNotes('Shell navigation is the standout: routes and their parameters are source-generated, so navigating to a page is a typed call rather than a string URL, and ViewModel lifecycle events actually fire when you expect them to. Those same generated routes are what the AI navigation tools are built from.');
  }

  // 18 ── Divider: Controls ───────────────────────────────────────────────
  await divider('05', 'UI Controls', '67 native controls for .NET MAUI and Blazor out of one design system — no WebViews, no per-platform forks.',
    ['Flagship: TableView, Scheduler, ChatView, DataGrid', 'Office: real .xlsx, .docx and .pptx editing', 'Collections, layout, input and media', 'Status, feedback and desktop controls', 'One shared theme token contract'], 'FaPalette',
    'Section five. The largest single group by package count, and the easiest to demo — the docs site has a live gallery for every control shown here.');

  // 19 ── Controls ────────────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Section 05 · UI Controls');
    heading(s, '67 controls, two hosts, one theme contract', 'Native .NET MAUI and Blazor components out of the same design system.', { subW: 8.0 });

    const groups = [
      ['FaStar', 'Flagship', 'TableView · Scheduler · ChatView · DataGrid · ImageEditor · CameraView', LIME],
      ['FaFileExcel', 'Office', 'Spreadsheet · Document & Slide viewers and editors · Notebook', GREEN],
      ['FaTableCells', 'Collections & Grids', 'DataGrid · TreeDataGrid · VirtualizedGrid · StaggeredGrid · Carousel', PURPLE],
      ['FaBoxesStacked', 'Layout & Overlays', 'AppLayout · Flyout · Modal · Sheet · Wizard · Timeline · Ribbon · FAB', PURPLE],
      ['FaPenRuler', 'Input', 'TextEntry · AutoComplete · Pickers · Sliders · SecurityPin · SignaturePad', GREEN],
      ['FaVideo', 'Display & Media', 'CameraView · MediaElement · Markdown · Mermaid · Barcodes · Keyframe', PURPLE],
      ['FaSquarePollVertical', 'Status & Feedback', 'Toast · Dialogs · Progress · Skeleton · Splash · Badge · Feedback', PURPLE],
      ['FaDesktop', 'Desktop', 'Tray icon · Docking · File drop · On-screen keyboard', GREEN],
    ];
    for (let i = 0; i < groups.length; i++) {
      const [ic, t, d, c] = groups[i];
      const y = 2.34 + i * 0.575;
      card(s, M, y, 8.15, 0.5, { fill: i % 2 ? CARD : CARD_HI, shadow: false });
      await chip(s, M + 0.16, y + 0.07, 0.36, c, ic);
      txt(s, t, { x: M + 0.64, y, w: 2.05, h: 0.5, fontSize: 12, bold: true, color: WHITE, valign: 'middle' });
      txt(s, d, { x: M + 2.72, y, w: 5.3, h: 0.5, fontSize: 10, color: MUTED, valign: 'middle' });
    }

    await photo(s, 'scheduler/s1.png', { x: 9.05, y: 1.55, w: 1.85, shadow: sh({ blur: 22, offset: 7, opacity: 0.55 }) });
    await photo(s, 'datagrid/s1.png', { x: 11.05, y: 2.35, w: 1.68, shadow: sh({ blur: 22, offset: 7, opacity: 0.55 }) });
    txt(s, 'Theming — a shared token contract with Basic, Ocean, Material, Terminal and Aurora packs, plus a Theme Creator.', {
      x: 9.05, y: 6.3, w: 3.68, h: 0.9, fontSize: 10.5, color: MUTED, lineSpacing: 14,
    });
    s.addNotes('One package per host — Shiny.Controls.Maui and Shiny.Controls.Blazor — but one design system and one set of theme tokens across both. Nothing is a WebView wrapper: the MAUI controls are native handlers, the Blazor ones are real components. The screenshots here are the same Scheduler and DataGrid rendered on iOS.');
  }

  // 20 ── Office ──────────────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Section 05 · Office documents');
    heading(s, 'Open, render and edit real Office files', 'A virtualized SkiaSharp surface shared verbatim by both hosts, over a document kernel with a transactional undo stack and a formula engine. Edits are surgical on the OOXML — an untouched file saves byte-identical.');
    await cardGrid(s, [
      { icon: 'FaFileExcel', color: GREEN, title: 'Spreadsheet', desc: 'Real .xlsx with a formula engine, virtualized rendering and cell-level editing.' },
      { icon: 'FaFileLines', color: PURPLE, title: 'Document Viewer', desc: 'Render .docx faithfully on MAUI and Blazor from the same kernel.' },
      { icon: 'FaSquarePollVertical', color: PURPLE, title: 'Slide Viewer', desc: 'Render .pptx decks, slide by slide, with the shared drawing surface.' },
      { icon: 'FaPenRuler', color: LIME, title: 'Document Editor', desc: 'Edit .docx with a transactional undo stack and surgical OOXML writes.' },
      { icon: 'FaPalette', color: PURPLE, title: 'Slide Editor', desc: 'Author and edit .pptx slides on the same document kernel.' },
      { icon: 'FaBook', color: GREEN, title: 'Notebook', desc: 'A OneNote-style unbounded page you write anywhere on, with a pressure-sensitive pen.' },
    ], { y: 2.72, w: CW, h: 1.95, cols: 3, gapX: 0.28, gapY: 0.3, titleSize: 14, descSize: 11, lead: 14.5, chip: 0.46 });
    s.addNotes('This is not an Office interop wrapper and it does not shell out to anything — it is a document kernel plus a SkiaSharp rendering surface, so it works offline, on device, on every target. The byte-identical round-trip matters for regulated workflows: opening a file and saving it without edits does not rewrite the OOXML.');
  }

  // 21 ── Divider: Data, Server & Cloud ───────────────────────────────────
  await divider('06', 'Data, Server & Cloud', 'Lightweight data libraries that run everywhere .NET does — and server-side .NET that runs inside a phone.',
    ['Document DB across 11 backends', 'Spatial queries and bidirectional sync', 'An embeddable HTTP/1.1, 2 & 3 server', 'Tunnelling, gRPC, MCP and WebDAV', 'Backend push and .NET Aspire'], 'FaDatabase',
    'Section six. This is where the suite stops being a mobile story — the same libraries run in the services behind the app.');

  // 22 ── Data & Storage ──────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Section 06 · Data & Storage');
    heading(s, 'No ORM, no overhead', 'AOT-compatible data libraries that run everywhere .NET does.');

    card(s, M, 2.35, 6.3, 4.4, { fill: CARD_HI });
    await chip(s, M + 0.34, 2.62, 0.52, LIME, 'FaDatabase');
    txt(s, 'Document DB', { x: M + 1.02, y: 2.66, w: 4.4, h: 0.42, fontSize: 19, bold: true, color: WHITE, fontFace: HEAD });
    txt(s, 'Store and query .NET objects as JSON documents — full CRUD, LINQ-style querying, projections, aggregates, composite JSON indexes and transactions.', {
      x: M + 0.34, y: 3.28, w: 5.6, h: 0.85, fontSize: 12, color: MUTED, lineSpacing: 16,
    });
    const ddb = ['Vector / ANN search with auto-embed', 'Temporal history & point-in-time reads', 'Orleans grain persistence & reminders', 'Spatial and geo queries', 'Multi-tenancy & global query filters', 'Change feeds and AI tool integration'];
    ddb.forEach((d, i) => {
      pill(s, d, M + 0.34 + (i % 2) * 2.87, 4.24 + Math.floor(i / 2) * 0.5, 2.72, { size: 9.5, color: WHITE, fill: CARD });
    });
    txt(s, 'Full AOT and trimming support.', { x: M + 0.34, y: 5.9, w: 5.6, h: 0.3, fontSize: 11, color: GREEN, italic: true });

    await cardGrid(s, [
      { icon: 'FaMapLocationDot', color: PURPLE, title: 'Spatial', desc: 'A dependency-free spatial database on SQLite R*Tree indexing with custom geometry algorithms. Ship pre-built datasets or build your own geospatial queries.' },
      { icon: 'FaArrowsRotate', color: GREEN, title: 'Data Sync', desc: 'Bidirectional JSON record sync — a persistent outbox, cursor-based inbox deltas, coalesced batching, tombstones, conflict resolution and platform-tier transports.' },
      { icon: 'FaKey', color: PURPLE, title: 'Stores', desc: 'A cross-platform key/value abstraction over Preferences, Secure Storage and Local/Session Storage.' },
    ], { x: 7.2, y: 2.35, w: W - 7.2 - M, h: 1.4, cols: 1, gapY: 0.25, titleSize: 13.5, descSize: 10.5, lead: 13.5, chip: 0.4 });
    s.addNotes('Document DB is the flagship here: a JSON document store with one API over eleven backends, so the same model and query code runs against SQLite on a phone and PostgreSQL on a server. Data Sync sits on top for offline-first apps — outbox, inbox, conflict resolution — using each platform\'s real background transport.');
  }

  // 23 ── DocumentDB backends ─────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Section 06 · Document DB');
    heading(s, 'One API, eleven backends', 'The same documents, queries and indexes whether they live on a phone, in a browser tab or in a managed cluster.');

    const backends = [
      ['SQLite', 'Embedded, everywhere'], ['SQLCipher', 'Encrypted at rest'], ['LiteDB', 'Pure .NET, embedded'],
      ['IndexedDB', 'Blazor WebAssembly'], ['DuckDB', 'Analytics & vss vectors'], ['CosmosDB', 'Azure, DiskANN vectors'],
      ['MongoDB', 'Atlas vector search'], ['SQL Server', '2025 native vectors'], ['PostgreSQL', 'pgvector'],
      ['MySQL', 'Managed or self-hosted'], ['Oracle', 'Enterprise estates'],
    ];
    const cols = 4, gx = 0.26, gy = 0.24, cwv = (CW - gx * (cols - 1)) / cols, chv = 0.86;
    backends.forEach((b, i) => {
      const x = M + (i % cols) * (cwv + gx), y = 2.4 + Math.floor(i / cols) * (chv + gy);
      card(s, x, y, cwv, chv, { fill: i % 2 ? CARD : CARD_HI });
      txt(s, b[0], { x: x + 0.26, y: y + 0.14, w: cwv - 0.5, h: 0.3, fontSize: 14, bold: true, color: WHITE });
      txt(s, b[1], { x: x + 0.26, y: y + 0.46, w: cwv - 0.5, h: 0.26, fontSize: 10, color: MUTED });
    });
    const lx = M + 3 * (cwv + gx), ly = 2.4 + 2 * (chv + gy);
    card(s, lx, ly, cwv, chv, { fill: DEEP_CARD, line: '5335C9' });
    txt(s, 'Same code on all of them', { x: lx + 0.26, y: ly, w: cwv - 0.5, h: chv, fontSize: 11.5, bold: true, color: LIME, valign: 'middle' });

    card(s, M, 5.72, CW, 1.15, { fill: CARD_HI });
    txt(s, 'Vector / ANN search across pgvector, SQL Server 2025, Cosmos DiskANN, Mongo Atlas, DuckDB vss and sqlite-vec — with LLM-callable tool functions, structured filters and auto-embed on insert through Microsoft.Extensions.AI.', {
      x: M + 0.4, y: 5.72, w: CW - 0.8, h: 1.15, fontSize: 12.5, color: WHITE, valign: 'middle', lineSpacing: 17,
    });
    s.addNotes('The practical value is migration and tiering: prototype on SQLite, move to PostgreSQL or Cosmos without rewriting data access, or run SQLite on device and the same schema on the server. Vector search is provider-native where the backend supports it, rather than a bolt-on index Shiny maintains itself.');
  }

  // 24 ── Server & Cloud ──────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Section 06 · Server & Cloud');
    heading(s, 'A web server that fits inside a phone app', 'ASP.NET Core is heavyweight and does not run on .NET MAUI. This does.');

    card(s, M, 2.35, 6.3, 4.4, { fill: CARD_HI });
    await chip(s, M + 0.34, 2.62, 0.52, GREEN, 'FaServer');
    txt(s, 'HTTP Server', { x: M + 1.02, y: 2.66, w: 4.4, h: 0.42, fontSize: 19, bold: true, color: WHITE, fontFace: HEAD });
    txt(s, 'A dependency-light, fully AOT/trim-clean HTTP/1.1, HTTP/2 and HTTP/3 server. Nothing is discovered by reflection, so a route that cannot bind fails your build rather than your deployment.', {
      x: M + 0.34, y: 3.28, w: 5.6, h: 0.9, fontSize: 12, color: MUTED, lineSpacing: 16,
    });
    const feats = ['Routing & middleware', 'DI scopes', 'Typed endpoints', 'Static files', 'WebSockets', 'Server-Sent Events', 'Sessions & OpenAPI', 'CORS, rate limiting, IP filters'];
    feats.forEach((f, i) => {
      pill(s, f, M + 0.34 + (i % 2) * 2.87, 4.3 + Math.floor(i / 2) * 0.5, 2.72, { size: 9.5, color: WHITE, fill: CARD });
    });
    txt(s, 'Runs on MAUI, desktop, server and container alike.', { x: M + 0.34, y: 6.3, w: 5.6, h: 0.3, fontSize: 11, color: GREEN, italic: true });

    await cardGrid(s, [
      { icon: 'FaNetworkWired', color: PURPLE, title: 'Tunnelling', desc: 'Reach a server embedded in a phone app from the internet — SSH remote forwarding, zero-account quick tunnels, or Azure Relay.' },
      { icon: 'FaPuzzlePiece', color: LIME, title: 'Protocol add-ons', desc: 'gRPC & gRPC-Web, Model Context Protocol and WebDAV — plus Mediator handlers and DocumentDb types as endpoints.' },
      { icon: 'FaGlobe', color: PURPLE, title: 'Web & Blazor Hosting', desc: 'ASP.NET infrastructure modules for common server-side patterns, and the Blazor equivalent.' },
      { icon: 'FaPaperPlane', color: GREEN, title: 'Push (Server)', desc: 'Send to APNs (.p8/ES256), FCM and Web Push (VAPID) through one API — targeting, topics and dead-token pruning.' },
    ], { x: 7.2, y: 2.32, w: W - 7.2 - M, h: 1.12, cols: 1, gapY: 0.12, titleSize: 12.5, descSize: 9.5, lead: 12, chip: 0.36 });
    s.addNotes('The HTTP server is the most surprising library in the suite. It is a real HTTP/1.1, HTTP/2 and HTTP/3 stack small enough to embed in a MAUI app — used for on-device APIs, local device pairing, MCP servers and offline-first sync endpoints. Because endpoints are generated at compile time, an unbindable route is a build error.');
  }

  // 25 ── Aspire ──────────────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Section 06 · .NET Aspire');
    heading(s, 'First-class Aspire integrations', 'Model the awkward parts of a distributed app as ordinary Aspire resources.');
    await cardGrid(s, [
      { icon: 'FaCircleNodes', color: PURPLE, title: 'Orleans', desc: 'Simplified Orleans hosting — streamlined AppHost configuration, Silo setup and client wiring. A fully orchestrated cluster in minimal code, with Document DB available as grain storage, reminders, clustering and grain directory.' },
      { icon: 'FaLock', color: GREEN, title: 'Gluetun VPN', desc: 'Model a Gluetun VPN container as a first-class Aspire resource, then route other containers through the tunnel with a single method call — with full Docker Compose publish support.' },
      { icon: 'FaNetworkWired', color: LIME, title: 'Tunnelling', desc: 'Give a project or container a public address for webhooks, OAuth redirects and demos — quick tunnels with no account, SSH, the Shiny relay, Azure Relay, Cloudflare or ngrok, surfaced as a connection string.' },
    ], { y: 2.42, w: CW, h: 2.7, cols: 3, gapX: 0.3, titleSize: 16, descSize: 12, lead: 16.5, chip: 0.52 });

    card(s, M, 5.5, CW, 1.1, { fill: CARD_HI });
    txt(s, 'The same Shiny libraries your mobile app uses — Mediator contracts, Document DB, serialization — run unchanged in the services behind it.', {
      x: M + 0.4, y: 5.5, w: CW - 0.8, h: 1.1, fontSize: 13.5, color: WHITE, valign: 'middle', italic: true,
    });
    s.addNotes('These are quality-of-life integrations for teams already on Aspire. The tunnelling one solves a daily annoyance — getting a webhook or OAuth redirect back to a local machine — and the URL arrives as an ordinary connection string, so nothing downstream knows it is a tunnel.');
  }

  // 26 ── Production ──────────────────────────────────────────────────────
  {
    const s = slide(INK);
    eyebrow(s, 'Trusted in production');
    heading(s, 'Shipping in real apps, for years', 'Three of the teams building products on Shiny today.');

    const stories = [
      { logo: 'sponsors/speedydock-dark.png', what: 'Boat launch scheduling for drystack marinas — iOS, Android and web since 2016', quote: '“Shiny isn’t just a tool for SpeedyDock; it’s a cornerstone of our mobile app development.”', who: 'Travis Wolfe · CEO, SpeedyDock', color: PURPLE },
      { logo: 'sponsors/poolmath.png', what: 'Pool care for hundreds of thousands of pool owners', quote: '“If you’re building a .NET MAUI app and you’re not using Shiny, you’re making your life harder than it needs to be.”', who: 'Jonathan Dick · CEO PoolMath, Principal Manager, Microsoft .NET MAUI', color: GREEN },
      { logo: MOULTRIE_PNG, what: 'Cellular trail cameras, feeders and land management tools', quote: '“What would have been months of platform-specific work across iOS and Android gets reduced to clean, shared code we can build on with confidence.”', who: 'Tommy Baggett · Principal Software Architect, Moultrie', color: LIME },
    ];
    const gx = 0.3, cwv = (CW - gx * 2) / 3;
    for (let i = 0; i < stories.length; i++) {
      const st = stories[i];
      const x = M + i * (cwv + gx);
      card(s, x, 2.28, cwv, 4.35, { fill: i === 1 ? CARD_HI : CARD });
      await logoPlate(s, st.logo, x + 0.32, 2.55, 2.3, 0.9);
      txt(s, st.what, { x: x + 0.32, y: 3.66, w: cwv - 0.64, h: 0.6, fontSize: 10.5, color: st.color, lineSpacing: 13.5 });
      txt(s, st.quote, { x: x + 0.32, y: 4.34, w: cwv - 0.64, h: 1.55, fontSize: 12.5, color: WHITE, italic: true, lineSpacing: 17 });
      txt(s, st.who, { x: x + 0.32, y: 5.95, w: cwv - 0.64, h: 0.55, fontSize: 10, color: DIM, lineSpacing: 13 });
    }
    txt(s, '40M+ NuGet downloads and counting — built and maintained by ShinySoft Technologies, the consulting shop that ships on it.', {
      x: M, y: 6.92, w: CW, h: 0.32, fontSize: 11, color: DIM,
    });
    s.addNotes('Worth naming the maintenance story: Shiny is the open-source foundation of ShinySoft\'s consulting work, so the people who maintain the libraries also ship production apps on them. Bugs get fixed by the maintainer rather than filed into a queue.');
  }

  // 27 ── Get started ─────────────────────────────────────────────────────
  {
    const s = slide(DEEP);
    txt(s, 'GET STARTED', { x: M, y: 1.05, w: 6, h: 0.3, fontSize: 12, bold: true, color: LIME, charSpacing: 3.2 });
    txt(s, 'Pick a library.\nOr take the whole suite.', {
      x: M, y: 1.5, w: 7.2, h: 1.7, fontSize: 40, bold: true, color: WHITE, fontFace: HEAD, lineSpacing: 48,
    });
    txt(s, 'Every package is independent, MIT-licensed and on NuGet. Start with the App Builder to generate a project, or drop a single library into the app you already have.', {
      x: M, y: 3.35, w: 6.6, h: 1.0, fontSize: 14, color: 'D6CCFF', lineSpacing: 20,
    });

    const steps = [
      ['FaWandMagicSparkles', 'App Builder', 'Pick your libraries; get the packages, hosting call and registrations generated for you.'],
      ['FaCubes', 'Shiny.Templates', 'dotnet new templates for MAUI, ASP.NET and Blazor projects, pre-wired.'],
      ['FaBrain', 'AI Skills', 'Install the skill for each library so Claude Code or Copilot writes it correctly.'],
      ['FaBook', 'shinylib.net', 'Full documentation, samples, release notes and the interactive control gallery.'],
    ];
    for (let i = 0; i < steps.length; i++) {
      const [ic, t, d] = steps[i];
      const y = 1.55 + i * 1.24;
      s.addShape(pres.ShapeType.roundRect, { x: 7.7, y, w: W - 7.7 - M, h: 1.06, rectRadius: 0.1, fill: { color: DEEP_CARD }, line: { color: '5335C9', width: 1 } });
      await chip(s, 7.98, y + 0.19, 0.42, i === 0 ? LIME : (i === 2 ? GREEN : WHITE), ic);
      txt(s, t, { x: 8.56, y: y + 0.18, w: 4.0, h: 0.3, fontSize: 13.5, bold: true, color: WHITE });
      txt(s, d, { x: 8.56, y: y + 0.5, w: 4.1, h: 0.5, fontSize: 10, color: 'CBC0FF', lineSpacing: 12.5 });
    }

    txt(s, 'shinylib.net   ·   github.com/shinyorg   ·   shinysoft.biz', {
      x: M, y: 6.5, w: 7, h: 0.34, fontSize: 13, bold: true, color: LIME,
    });
    s.addNotes('Close on the low-commitment path: the App Builder produces a working configuration in a couple of minutes, and every library is a separate package so trying one costs nothing. The AI skills are the fastest way for a team already using Claude Code or Copilot to get idiomatic Shiny code from day one.');
  }

  const out = process.argv[2] || path.join(__dirname, 'Shiny.NET-Overview.pptx');
  await pres.writeFile({ fileName: out });
  console.log('written ' + out);
}

// The one customer logo that ships as SVG has to be rasterized before use.
async function rasterizeLogos() {
  await sharp(IMG('sponsors/moultrie.svg'), { density: 600 })
    .resize({ width: 900 }).png().toFile(MOULTRIE_PNG);
}

rasterizeLogos().then(build).catch((e) => { console.error(e); process.exit(1); });
