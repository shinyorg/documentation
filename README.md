# shinylib.net documentation

Astro + Starlight site for [shinylib.net](https://www.shinylib.net), deployed to GitHub Pages.

## Project structure

```
.
├── .github/workflows/deploy.yml     CI: builds the site and deploys to Pages
├── astro.config.mjs                 Astro + Starlight config, redirects
├── package.json
├── public/                          Static assets copied verbatim into dist/
│   └── playground/index.html        Landing page linking out to the six
│                                    per-library demo deployments
└── src/
    ├── assets/
    ├── components/                  Custom Starlight component overrides
    ├── content/docs/                Documentation pages (.md / .mdx)
    ├── sidebar-topics.mjs           Shared sidebar topic config
    └── styles/
```

## Commands

| Command           | Action                                              |
| :---------------- | :-------------------------------------------------- |
| `npm install`     | Install dependencies                                |
| `npm run dev`     | Start the Astro dev server                          |
| `npm run build`   | Build the production site to `dist/`                |
| `npm run preview` | Preview the built site locally                      |
| `npm run astro …` | Run Astro CLI commands directly                     |

## Blazor playground demos

Each library demo lives in its own sibling repo and deploys to its own GitHub Pages site. This docs repo links out to them — it does not build or host them.

| Library            | URL                                            | Source repo                                     |
| :----------------- | :--------------------------------------------- | :---------------------------------------------- |
| AI Conversation    | https://shinyorg.github.io/aiconversation/     | [shinyorg/aiconversation][r-ai]                 |
| Controls           | https://shinyorg.github.io/controls/           | [shinyorg/controls][r-ctl]                      |
| DocumentDb         | https://shinyorg.github.io/DocumentDb/         | [shinyorg/DocumentDb][r-db]                     |
| Mediator           | https://shinyorg.github.io/mediator/           | [shinyorg/mediator][r-med]                      |
| Shiny Core         | https://shinyorg.github.io/shiny/              | [shinyorg/shiny][r-sh]                          |
| Speech             | https://shinyorg.github.io/speech/             | [shinyorg/speech][r-sp]                         |

[r-ai]: https://github.com/shinyorg/aiconversation/tree/main/samples/Sample.Blazor
[r-ctl]: https://github.com/shinyorg/controls/tree/main/samples/Sample.Blazor
[r-db]:  https://github.com/shinyorg/DocumentDb/tree/v6/samples/Sample.Blazor
[r-med]: https://github.com/shinyorg/mediator/tree/main/samples/Sample.Blazor
[r-sh]:  https://github.com/shinyorg/shiny/tree/v5/samples/Sample.Blazor
[r-sp]:  https://github.com/shinyorg/speech/tree/v2/samples/BlazorSample

`public/playground/index.html` is a static landing page on this site that cards out to those URLs — kept so old `/playground/` bookmarks still resolve. Each library's sidebar in Starlight also has a direct "Blazor Playground" link to the corresponding external URL.

Each demo is deployed by its own `.github/workflows/deploy-blazor-sample.yml` in the sibling repo: triggers on push to that repo's active branch (paths-scoped to the sample + relevant src), publishes the WASM app, rewrites `<base href>` to `/<repo-name>/`, and uploads to GitHub Pages.

## CI/CD

`.github/workflows/deploy.yml`:

1. `actions/checkout@v6`
2. `withastro/action@v6` — runs `npm ci && npm run build` and uploads `dist/` as the Pages artifact
3. `actions/deploy-pages@v4` — pushes the artifact to GitHub Pages

Builds run on every push to `main` and `dev`; only `main` deploys.

## Reference

- [Starlight docs](https://starlight.astro.build/)
- [Astro docs](https://docs.astro.build)
