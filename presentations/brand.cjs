/**
 * The Shiny.NET brand system, as the site actually defines it.
 *
 * Mirrors `src/styles/custom.css` (tokens + gradients), `scripts/og-image.html`
 * (the social card) and `src/components/HomeHero.astro` (the homepage slogans).
 * `deck.cjs` styles every slide from this file AND renders the brand-reference
 * slides from it, so the reference can't drift from what the deck itself uses.
 *
 * When the site's palette or copy changes, change it here.
 */

// ── Colour ────────────────────────────────────────────────────────────────
// The three logo hues, in the three variants the site ships.
const COLOR = {
  // Straight off the logo. Pastel — washes out on light backgrounds, which is
  // why the vivid variants exist.
  logo: [
    { name: 'Purple', hex: '9A81EA', token: '--shiny-purple' },
    { name: 'Green', hex: '91F5AD', token: '--shiny-green' },
    { name: 'Lime', hex: 'CFFA12', token: '--shiny-lime' },
  ],
  // Saturated, higher-contrast. Used for gradients and accents on light.
  vividLight: [
    { name: 'Purple Vivid', hex: '6A3DF0', token: '--shiny-purple-vivid' },
    { name: 'Green Vivid', hex: '0FBF7A', token: '--shiny-green-vivid' },
    { name: 'Lime Vivid', hex: 'A6D900', token: '--shiny-lime-vivid' },
  ],
  // The same tokens, brightened so they stay luminous on dark. The deck is
  // dark, so these are the ones it draws with.
  vividDark: [
    { name: 'Purple Vivid', hex: '9B7BFF', token: '--shiny-purple-vivid' },
    { name: 'Green Vivid', hex: '2BE5A0', token: '--shiny-green-vivid' },
    { name: 'Lime Vivid', hex: 'CFFA12', token: '--shiny-lime-vivid' },
  ],
  // Dark-canvas surfaces and type. The social card and this deck share them.
  surface: [
    { name: 'Ink', hex: '0B0918', note: 'Slide / card ground' },
    { name: 'Card', hex: '19143C', note: 'Panel on ink' },
    { name: 'Card raised', hex: '221A52', note: 'Lifted panel' },
    { name: 'Hairline', hex: '2E2665', note: 'Borders' },
    { name: 'Deep', hex: '2A1580', note: 'Section divider ground' },
    { name: 'Muted', hex: 'AFA8CE', note: 'Body copy on ink' },
  ],
};

// Shorthands for the hues the deck paints with.
const PURPLE = '9B7BFF';
const GREEN = '2BE5A0';
const LIME = 'CFFA12';

// ── Gradient ──────────────────────────────────────────────────────────────
// Every gradient the site uses, with the angle and stops it uses them at.
// `stops` are [offset 0-1, hex] so both the rasterizer and the reference
// slide read from the same numbers.
const GRADIENT = {
  // The signature. Header underline, homepage headline, social-card hairline.
  brandRamp: {
    name: 'Brand ramp',
    angle: 110,
    stops: [[0, PURPLE], [0.55, GREEN], [1, LIME]],
    where: 'Site title, header underline, hero headline, social card rule',
  },
  // The social card renders the same ramp a touch warmer.
  headline: {
    name: 'Headline ramp',
    angle: 96,
    stops: [[0, PURPLE], [0.62, GREEN], [1, LIME]],
    where: 'Social-card headline ("already solved.")',
  },
  // Two-stop. The mobile menu disc — the only way into the nav on a phone.
  menuButton: {
    name: 'Menu button',
    angle: 118,
    stops: [[0, '7C4DFF'], [1, GREEN]],
    where: 'Mobile menu button (dark); 6A3DF0 → 0FBF7A on light',
  },
  // The primary call to action.
  cta: {
    name: 'Primary CTA',
    angle: 112,
    stops: [[0, '6A3DF0'], [0.78, '0FBF7A'], [1, 'A6D900']],
    where: 'Primary buttons',
  },
  // Purple straight to lime, skipping green.
  appBuilder: {
    name: 'Purple → lime',
    angle: 135,
    stops: [[0, PURPLE], [1, LIME]],
    where: 'App Builder quick-nav tile',
  },
};

// ── Logo ──────────────────────────────────────────────────────────────────
// `file` is the artwork to place, relative to `public/images/`. `dark: true`
// means the artwork is dark-on-transparent and needs a white plate to read on
// ink. Note the Shiny mark renders from the PNG, not the SVG: librsvg drops the
// SVG's gradients and rasterizes a washed-out mark, so the PNG is the safe
// source anywhere outside a browser.
const LOGO = [
  { file: 'logo-mark.png', name: 'Shiny mark', src: 'logo.svg · logo-mark.png', use: 'Primary. Use the SVG on the web; the PNG everywhere else.', dark: false },
  { file: 'shinysoft-mark.png', name: 'ShinySoft mark', src: 'shinysoft-mark.png', use: 'The company behind Shiny, without the wordmark.', dark: false },
  { file: 'shinysoft-logo-light.png', name: 'ShinySoft lockup', src: 'shinysoft-logo-light.png', use: 'Full wordmark. Dark artwork — for light grounds.', dark: true },
  { file: 'shinysoft-logo-dark.png', name: 'ShinySoft lockup — dark', src: 'shinysoft-logo-dark.png', use: 'Full wordmark, reversed out for dark grounds.', dark: false },
];

// logo.mp4 is the animated mark — used on the site, no still equivalent.
const LOGO_NOTE = 'logo.mp4 is the animated mark used on the site. logo.svg is the vector source, but only browsers render its gradients correctly — use logo-mark.png anywhere else.';

// ── Voice ─────────────────────────────────────────────────────────────────
const SLOGAN = {
  // The headline. Set in two weights, the second half carrying the brand ramp.
  headline: { plain: 'The hard parts of your app,', gradient: 'already solved.' },

  // The lede. Deliberately open-ended — the named libraries are examples, not
  // the catalogue, so it does not go stale as libraries are added.
  lede:
    'Everything the platform makes hard: Bluetooth, background jobs, push, location, ' +
    'a document database, speech and AI, an HTTP server that runs inside your MAUI app, ' +
    '70+ UI controls, and plenty more.',

  // The second half of the homepage lede — the value proposition.
  promise:
    'Thirty-plus libraries that own the platform code, the permissions and the ' +
    'background execution — so your time goes to the app your users actually asked for.',

  // Short lines used as eyebrows, pills and footers.
  lines: [
    { text: '.NET libraries for mobile, desktop, web & server', where: 'Positioning line — social card eyebrow' },
    { text: 'From back end to front end', where: 'Homepage platform rail' },
    { text: 'Free & open source', where: 'Social card pill' },
    { text: 'MIT licensed', where: 'Social card footer' },
    { text: 'A suite of powerful .NET libraries for mobile, desktop, and server applications', where: 'Meta description' },
    { text: 'shinylib.net · built and maintained by ShinySoft Technologies', where: 'Deck footer' },
  ],
};

// The platforms, back end to front end — the homepage rail.
const PLATFORMS = ['Windows', 'macOS', 'Linux', 'iOS', 'Android', 'Web'];

module.exports = { COLOR, GRADIENT, LOGO, LOGO_NOTE, SLOGAN, PLATFORMS, PURPLE, GREEN, LIME };
