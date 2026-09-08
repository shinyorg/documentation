# Presentations

Generated slide decks about Shiny. Not part of the Astro build — nothing in this
folder is published to shinylib.net.

## Shiny.NET-Overview.pptx

A 31-slide overview of the whole library suite, generated from the catalog on the
docs home page (`src/content/docs/index.mdx`). Structure:

| Slides | Content |
| :----- | :------ |
| 1–4    | Title, the three burdens Shiny takes on, the nine-group catalog, platform reach |
| 5–8    | **Foundation** — the libraries, Mediator spotlight, `UseShiny()` walkthrough |
| 9–11   | **Hardware & Device Data** — radios and sensors, OS-owned data stores |
| 12–14  | **AI & Intelligence** — the intelligence libraries, AI tools across the suite |
| 15–17  | **Background, Delivery & MAUI** — jobs, transfers, notifications, app plumbing |
| 18–20  | **UI Controls** — the 70+ controls by group, the Office document stack |
| 21–25  | **Data, Server & Cloud** — Document DB and its backends, HTTP server, Aspire |
| 26–27  | Customer quotes, and how to get started |
| 28–31  | **Brand reference** — palette, gradients, marks, slogans |

Every slide carries speaker notes. Screenshots and customer logos are pulled from
`public/images/`, so the deck stays in step with the assets the site uses.

## Brand system

`brand.cjs` is the deck's single source of truth for identity — the palette, the
gradients (angle and stops), the logo files and the slogans. It mirrors
`src/styles/custom.css`, `scripts/og-image.html` and `src/components/HomeHero.astro`;
**when the site's colours or copy change, change them there**.

Every slide is styled from that file *and* the brand-reference slides (28–31) are
rendered from it, so the reference cannot drift from what the deck itself uses.

`gradients.cjs` rasterizes the gradients. PowerPoint's own gradient fills are
two-stop and cannot fill text at all, so the three-stop purple→green→lime ramp is
rendered to PNG via sharp and placed as art — pixel-matched to the site, at the
cost of that text not being editable in PowerPoint.

Two gotchas worth keeping:

- Rasterize the Shiny mark from `logo-mark.png`, never `logo.svg` — librsvg drops
  the SVG's gradients and produces a washed-out mark outside a browser.
- Do not pass a `density` override to sharp for the gradient art. The SVG
  viewports are already sized in target pixels; scaling them again quadrupled the
  embedded PNGs and took the file from 3 MB to 12 MB.

## Regenerating

The generator reads the same copy the home page does — when the catalog changes,
update `deck.cjs` and rebuild:

```bash
npm install --no-save pptxgenjs sharp react-icons react react-dom
node presentations/deck.cjs
```

`deck.cjs` builds the slides; `brand.cjs` holds the identity; `gradients.cjs`
rasterizes the brand gradients; `icons.cjs` rasterizes Font Awesome glyphs to PNG
(PowerPoint won't render the SVG directly). None of it is wired into
`npm run build` — the dependencies are deliberately kept out of `package.json` so
the site build stays untouched.
