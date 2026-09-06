# Presentations

Generated slide decks about Shiny. Not part of the Astro build — nothing in this
folder is published to shinylib.net.

## Shiny.NET-Overview.pptx

A 27-slide overview of the whole library suite, generated from the catalog on the
docs home page (`src/content/docs/index.mdx`). Structure:

| Slides | Content |
| :----- | :------ |
| 1–4    | Title, the three burdens Shiny takes on, the nine-group catalog, platform reach |
| 5–8    | **Foundation** — the libraries, Mediator spotlight, `UseShiny()` walkthrough |
| 9–11   | **Hardware & Device Data** — radios and sensors, OS-owned data stores |
| 12–14  | **AI & Intelligence** — the intelligence libraries, AI tools across the suite |
| 15–17  | **Background, Delivery & MAUI** — jobs, transfers, notifications, app plumbing |
| 18–20  | **UI Controls** — the 67 controls by group, the Office document stack |
| 21–25  | **Data, Server & Cloud** — Document DB and its backends, HTTP server, Aspire |
| 26–27  | Customer quotes, and how to get started |

Every slide carries speaker notes. Screenshots and customer logos are pulled from
`public/images/`, so the deck stays in step with the assets the site uses.

## Regenerating

The generator reads the same copy the home page does — when the catalog changes,
update `deck.cjs` and rebuild:

```bash
npm install --no-save pptxgenjs sharp react-icons react react-dom
node presentations/deck.cjs
```

`deck.cjs` builds the slides; `icons.cjs` rasterizes Font Awesome glyphs to PNG
(PowerPoint won't render the SVG directly). Neither is wired into `npm run build`
— the dependencies are deliberately kept out of `package.json` so the site build
stays untouched.
