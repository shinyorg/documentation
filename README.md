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
| AI Conversation    | https://shinyorg.github.io/speech/             | [shinyorg/speech][r-ai]                         |
| Controls           | https://shinyorg.github.io/controls/           | [shinyorg/controls][r-ctl]                      |
| DocumentDb         | https://shinyorg.github.io/DocumentDb/         | [shinyorg/DocumentDb][r-db]                     |
| Mediator           | https://shinyorg.github.io/mediator/           | [shinyorg/mediator][r-med]                      |
| Shiny Core         | https://shinyorg.github.io/shiny/              | [shinyorg/shiny][r-sh]                          |
| Speech             | https://shinyorg.github.io/speech/             | [shinyorg/speech][r-sp]                         |

[r-ai]: https://github.com/shinyorg/speech/tree/v2/samples/BlazorSample
[r-ctl]: https://github.com/shinyorg/controls/tree/main/samples/Sample.Blazor
[r-db]:  https://github.com/shinyorg/DocumentDb/tree/v6/samples/Sample.Blazor
[r-med]: https://github.com/shinyorg/mediator/tree/main/samples/Sample.Blazor
[r-sh]:  https://github.com/shinyorg/shiny/tree/v5/samples/Sample.Blazor
[r-sp]:  https://github.com/shinyorg/speech/tree/v2/samples/BlazorSample

`public/playground/index.html` is a static landing page on this site that cards out to those URLs — kept so old `/playground/` bookmarks still resolve. Each library's sidebar in Starlight also has a direct "Blazor Playground" link to the corresponding external URL.

Each demo is deployed by its own `.github/workflows/deploy-blazor-sample.yml` in the sibling repo: triggers on push to that repo's active branch (paths-scoped to the sample + relevant src), publishes the WASM app, rewrites `<base href>` to `/<repo-name>/`, and uploads to GitHub Pages.

## Comments (giscus)

Blog posts get a [giscus](https://giscus.app) comment widget rendered after the article body. Any docs page can opt in by adding `comments: true` to its frontmatter.

The widget is wired through three pieces:

- `giscusConfig` in `astro.config.mjs` — repo, repo-id, category, category-id, etc., exposed to components via `import.meta.env.GISCUS`.
- `src/components/Giscus.astro` — loads `giscus.app/client.js` and syncs the iframe theme with Starlight's light/dark toggle.
- `src/components/MarkdownContent.astro` — Starlight override that injects `<Giscus />` after page content when the entry lives under `blog/` or has `comments: true`.

### First-time setup

1. **Install the giscus GitHub App** on the `shinyorg/documentation` repo: <https://github.com/apps/giscus>. Grant it access to that repo only.
2. **Enable Discussions** on the repo: Settings → General → Features → check **Discussions**.
3. **Create (or pick) a Discussion category** for comments. The default `Announcements` works, but a dedicated `Comments` category with the **Announcement** format is recommended so only maintainers can start threads (giscus creates them on demand).
4. Visit <https://giscus.app>, fill in:
   - **Repository**: `shinyorg/documentation`
   - **Page ↔ Discussions Mapping**: `pathname` (matches the default in `astro.config.mjs`)
   - **Discussion Category**: the one created above
5. Scroll to the **Enable giscus** snippet at the bottom of giscus.app and copy the four `data-*` values:
   - `data-repo-id` → `giscusConfig.repoId`
   - `data-category` → `giscusConfig.category`
   - `data-category-id` → `giscusConfig.categoryId`
   - (`data-repo` should already match)
6. Paste them into `giscusConfig` in `astro.config.mjs`, replacing the `REPLACE_WITH_*` placeholders.
7. `npm run build && npm run preview`, open any blog post, and confirm the widget loads.

### Enabling comments on a docs page

Add `comments: true` to the page's frontmatter:

```yaml
---
title: My page
comments: true
---
```

The `comments` field is declared on the docs schema in `src/content.config.ts`, so unknown-field warnings won't fire.

## CI/CD

`.github/workflows/deploy.yml`:

1. `actions/checkout@v6`
2. `withastro/action@v6` — runs `npm ci && npm run build` and uploads `dist/` as the Pages artifact
3. `actions/deploy-pages@v4` — pushes the artifact to GitHub Pages

Builds run on every push to `main` and `dev`; only `main` deploys.

## Reference

- [Starlight docs](https://starlight.astro.build/)
- [Astro docs](https://docs.astro.build)
