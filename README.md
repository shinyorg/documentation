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

Each library demo lives in its own sibling repo and deploys to its own GitHub Pages site — except DocumentDb, which is a hosted ShinyDocDbMyAdmin container (see below). This docs repo links out to them — it does not build or host them.

| Library            | URL                                            | Source repo                                     |
| :----------------- | :--------------------------------------------- | :---------------------------------------------- |
| AI Conversation    | https://shinyorg.github.io/speech/             | [shinyorg/speech][r-ai]                         |
| Controls           | https://shinyorg.github.io/controls/           | [shinyorg/controls][r-ctl]                      |
| DocumentDb         | https://docdbmyadmin.acrhome.ca/               | [shinyorg/DocumentDb][r-db]                     |
| Mediator           | https://shinyorg.github.io/mediator/           | [shinyorg/mediator][r-med]                      |
| Shiny Core         | https://shinyorg.github.io/shiny/              | [shinyorg/shiny][r-sh]                          |
| Speech             | https://shinyorg.github.io/speech/             | [shinyorg/speech][r-sp]                         |

[r-ai]: https://github.com/shinyorg/speech/tree/v2/samples/BlazorSample
[r-ctl]: https://github.com/shinyorg/controls/tree/main/samples/Sample.Blazor
[r-db]:  https://github.com/shinyorg/DocumentDb/tree/v12/src/ShinyDocDbMyAdmin
[r-med]: https://github.com/shinyorg/mediator/tree/main/samples/Sample.Blazor
[r-sh]:  https://github.com/shinyorg/shiny/tree/v5/samples/Sample.Blazor
[r-sp]:  https://github.com/shinyorg/speech/tree/v2/samples/BlazorSample

`public/playground/index.html` is a static landing page on this site that cards out to those URLs — kept so old `/playground/` bookmarks still resolve. Each library's sidebar in Starlight also has a direct "Blazor Playground" link to the corresponding external URL.

Each WASM demo is deployed by its own `.github/workflows/deploy-blazor-sample.yml` in the sibling repo: triggers on push to that repo's active branch (paths-scoped to the sample + relevant src), publishes the WASM app, rewrites `<base href>` to `/<repo-name>/`, and uploads to GitHub Pages. DocumentDb is the exception — its GitHub Pages site is retired and the playground is the `shinyorg/ShinyDocDbMyAdmin:demo` container, deployed from the DocumentDb repo's `admin-image.yml`.

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

## Cloudflare (free tier)

The site is served directly by GitHub Pages. Putting Cloudflare's free plan in front of
it adds a CDN edge, per-request analytics, bot controls, rate limiting, and a WAF — none
of which GitHub Pages provides on its own.

### Current DNS

| Record  | Name           | Value                                                            |
| :------ | :------------- | :--------------------------------------------------------------- |
| `A`     | `shinylib.net` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| `CNAME` | `www`          | `shinyorg.github.io`                                              |

Nameservers are currently Google Cloud DNS (`ns-cloud-e{1..4}.googledomains.com`).

### Setup

1. **Add the site.** Cloudflare dashboard → *Add a site* → `shinylib.net` → **Free** plan.

2. **Check the imported records.** Cloudflare scans existing DNS on import. Confirm all
   four apex `A` records and the `www` `CNAME` came across exactly as above, and that any
   `TXT` (domain verification) and `MX` (mail) records survived. Import misses records
   more often than you'd expect — compare against `dig` output before continuing:

   ```bash
   dig +short shinylib.net A
   dig +short www.shinylib.net
   dig +short shinylib.net TXT
   ```

3. **Leave the proxy OFF for now.** Set the apex and `www` records to **DNS only** (grey
   cloud) for the initial cutover. See step 5 for why.

4. **Move the nameservers.** In Google Cloud DNS, replace the four `googledomains.com`
   nameservers with the two Cloudflare assigns. Propagation is usually well under an hour;
   Cloudflare emails you when the zone goes active.

5. **Let GitHub issue the TLS certificate, then enable the proxy.** GitHub Pages
   provisions its Let's Encrypt cert by reaching the domain directly, which fails while
   Cloudflare is proxying. So: with the records still grey-clouded, go to the repo's
   *Settings → Pages*, confirm the custom domain is `shinylib.net` and wait for
   **Enforce HTTPS** to become available and checked. Once it is, flip the apex and `www`
   records to the **orange cloud** (Proxied).

   Skipping this ordering is the most common way to end up with a broken cert.

6. **SSL/TLS → Overview → Full.**
   - *Flexible* causes an infinite redirect loop — GitHub Pages already redirects HTTP to
     HTTPS.
   - *Full (strict)* fails validation — the GitHub Pages origin cert doesn't match the
     custom domain.
   - **Full** is the correct setting.

7. **SSL/TLS → Edge Certificates.** Enable **Always Use HTTPS** and **Automatic HTTPS
   Rewrites**.

### Recommended settings

Once the zone is active and proxying:

**Security → Bots**
- **Bot Fight Mode** → on.
- **Block AI Scrapers and Crawlers** → on, if you want to exclude AI training crawlers at
  the edge. Note this is broader than `public/robots.txt`, which deliberately allows
  several AI assistants so `/llms.txt` and `/llms-full.txt` remain reachable. Turning this
  on overrides that intent.

**Security → WAF → Rate limiting rules**

Free plan allows one rule. A reasonable starting point:

| Field       | Value                     |
| :---------- | :------------------------ |
| Requests    | `200`                     |
| Period      | `1 minute`                |
| Counting by | IP                        |
| Action      | **Managed Challenge**     |
| Duration    | `10 seconds`              |

Start with Managed Challenge rather than Block — a hard block catches real users sharing
an IP behind corporate or carrier NAT. Tune the threshold against Cloudflare's own traffic
data rather than guessing.

**Caching → Configuration**
- Browser Cache TTL → *Respect Existing Headers*.
- The site is fully static, so the default Cloudflare cache behaviour (static assets
  cached, HTML passed through) works without further configuration.

**Speed → Optimization** — leave Auto Minify off. Astro already minifies at build time,
and double-minification occasionally breaks inline scripts.

### After deploys

Cloudflare does not cache HTML by default, so deploys are visible immediately and no cache
purge is needed. If you later add a *Cache Everything* page rule, add a purge step to
`.github/workflows/deploy.yml` or content will go stale.

### Analytics

Once proxying, **Analytics → Traffic** gives per-ASN, per-user-agent, and per-country
request breakdowns — data Google Analytics does not expose, since it only counts requests
that execute JavaScript.

### Scope

This covers `shinylib.net` only. The Blazor playground demos are served from separate
GitHub Pages sites on the `shinyorg/*` repos (`shinyorg.github.io/{speech,controls,mediator,shiny}`),
plus the self-hosted DocumentDb admin demo at `docdbmyadmin.acrhome.ca`, and are unaffected by
anything configured here. Each would need its own Cloudflare zone.

GitHub Pages' soft bandwidth limit is 100 GB/month per site.

## Reference

- [Starlight docs](https://starlight.astro.build/)
- [Astro docs](https://docs.astro.build)
