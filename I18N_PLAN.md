# Plan: English + French (multilingual) shinylib.net

## Context
Add French to the site while keeping English as the default and all current URLs unchanged. Decisions so far:
- **Scope:** every docs page (~644 pages, ~650k words of prose).
- **Method:** a repo script translates with an LLM, then a person reviews.
- **English-only:** release notes (32 files, ~150k words), the blog, `llms.txt`/`llms-full.txt` and the App/Lib/Template Builder UIs.


## Status
**Phases 1–2 infrastructure is done, English only.** French is not switched on yet. The only locale is English at the root, so Starlight renders no language picker, and the built pages have the same visible content as before.
- **Locales:** `src/i18n/locales.mjs` is the one place a language is added. `astro.config.mjs` reads `defaultLocale`/`locales` from it, and the `llms*` endpoints exclude every extra language.
- **Schema:** `src/content.config.ts` has the `i18n` collection (`i18nLoader` + `i18nSchema`) and `translatedFrom` on the docs schema.
- **UI strings:** about 170 component UI strings are in `src/content/i18n/en.json`. Components read them with `Astro.locals.t`.
  - Interpolated values use single-brace `{name}` tokens that the component replaces, not i18next `{{ }}`.
  - Client scripts get their strings through `data-*` attributes.
- **Sidebar labels:** `cleanTopicsForStarlight` merges `i18n/sidebar.<lang>.json` (loaded by `src/i18n/sidebarLabels.mjs`) into topic label records and item `translations`. `localizedLabel` (`src/i18n/label.ts`) uses the same dictionaries for HomepageNav, JumpTo, LibraryExplorer and LibraryCatalog.
- **Links:** internal hrefs in components go through `localeHref` (`src/i18n/url.ts`).
- **Banner and Giscus:** announcements accept `{ en, fr }` records, and Giscus takes `lang` from the route.

**Still open when French is added:**
- The Phase 1 "things to check" (blog fallback, topic link prefixes, forked sidebar, language picker).
- The finder's `/playground/index.html` topic link would get a `/fr` prefix but is a static file.
- Marketing copy in `src/data/libraryCatalog.ts` and `NugetCatalogTable.tsx` strings are still English.
- `RecentPostsBanner` formats dates with `en-US`.
- `featuredInHomenav` notes are looked up in the sidebar dictionary, so include them in `sidebar.<lang>.json`.
- Phases 3–5 have not started.

## Phase 1: Enable Starlight i18n (English at root, French under `/fr/`)
- `astro.config.mjs`: add `defaultLocale: 'root'` and `locales: { root: { label: 'English', lang: 'en' }, fr: { label: 'Français', lang: 'fr' } }` to `starlight({...})`.
  - English stays at `/`, so none of the ~290 redirects change.
  - Pages without a French file fall back to English at `/fr/...` with Starlight's "not translated" notice. That covers release notes and the blog automatically.
- `src/content.config.ts`: turn on the commented-out `i18n` collection (`docsLoader` + `i18nSchema()`) for UI strings. Add optional `translatedFrom: z.string().optional()` (the source hash) to the docs schema.
- The embargo loader (`embargoedDocsLoader`) keys on `entry.id`, so `fr/blog/...` ids need no change. There are no French blog posts anyway.
- **Giscus** (`src/components/Giscus.astro` / `MarkdownContent.astro`): set `lang` from `Astro.locals.starlightRoute.locale`. `mapping: 'pathname'` gives French pages their own comment threads, which is fine.
- **llms endpoints** (`src/pages/llms.txt.ts`, `llms-full.txt.ts`): add `/^fr\//` to `EXCLUDE_PATTERNS`.
- **Things to check once enabled:**
  - `starlight-blog` 0.30 supports locales (`libs/content.ts` loops `getLocales()`). Check that `/fr/blog/` either renders the English fallback or has a redirect to `/blog/`. If neither works, add a `/fr/blog/` → `/blog/` redirect.
  - `starlight-sidebar-topics` 0.9 plus the dropdown: check that topic `link: '/foundation/appbuilder/'` values get the `/fr` prefix on French pages. If they don't, prefix them in `cleanTopicsForStarlight`.
  - Custom `Sidebar.astro` / `SidebarSublist.astro`: check that the locale reaches the forked sublist.
  - Language picker: Starlight shows it in the header automatically. Check that `Header.astro` still renders `LanguageSelect`, and add it back if the override dropped it.

## Phase 2: Localize the site chrome (not page content)
- **Sidebar labels** (`src/sidebar-topics.mjs`, ~780 labels): leave the English `label` as it is and add a sibling `translations: { fr: '…' }`, which Starlight's sidebar supports natively.
  - Write a one-off script, `scripts/i18n/sidebar-labels.mjs`, that collects every label, translates the unique set with the LLM, and writes `i18n/sidebar.fr.json` (label → French).
  - Have `cleanTopicsForStarlight` merge that JSON into `translations`. The 1,487-line file stays readable, and labels that are already translated are reused.
- **Components that read `sidebarTopics` directly** (`HomepageNav.astro`, `JumpTo.astro`, `LibraryExplorer.astro`, `src/data/libraryCatalog.ts`, `src/consts.ts`): add a helper `src/i18n/label.ts` → `localizedLabel(item, locale)` using the same JSON.
- **Hardcoded UI strings** in `.astro` components (HomeHero, HomepageNav, JumpTo, ThemeSelect, Banner, SupportChannels, PlatformSupport, AppShowcase, LibraryCatalog, NugetCatalog, Testimonials, AiSkill, etc.):
  - Move them to `src/content/i18n/en.json` and `fr.json` and read them with `Astro.locals.t('key')`.
  - The React builders (`Boilerplate/*.tsx`, `TemplateBuilder/*`) stay English.
- **Hardcoded internal links** (HomeHero, HomepageNav, ThemeSelect, JumpTo, ControlsMarquee, AndroidForegroundService): add a helper `src/i18n/url.ts` → `localeHref(path, locale)` that prepends `/fr` when needed. Use it for the ~20 absolute `href="/..."` in components.
- **Announcement banner** (`announcementConfig` in `astro.config.mjs`): allow `title`/`description`/`cta` to be either a string or `{ en, fr }`.

## Phase 3: Translation pipeline (`scripts/i18n/translate.mjs`)
Written in Node like `scripts/extract-templates.mjs`, and calls the Anthropic SDK. Check the current model ID with the `claude-api` skill when implementing.
- **Input:** the English files under `src/content/docs/**`, excluding `blog/**`, `fr/**` and `**/release-notes.mdx`.
- **Output:** the same relative path under `src/content/docs/fr/`.
- **What gets protected** (by placeholder masking before the LLM call, then restored and verified afterwards):
  - Code fences and inline code are never translated.
  - MDX `import` lines, JSX/component tags and their props are kept verbatim.
  - In frontmatter, only `title`, `description`, `hero.tagline` and `hero.actions[].text` are translated. Other keys are copied unchanged.
- **Links:** internal links matching `](/x...)` and `href="/x"` are rewritten to `/fr/x...`. This is always safe because English fallbacks exist under `/fr/` for untranslated pages. External links and anchors are left alone.
- **Glossary:** `i18n/glossary.fr.json` lists product and API names that are never translated (Shiny, Mediator, DocumentDb, BLE, geofence, AOT, etc.) plus preferred French terms. It goes in the system prompt.
- **Staleness tracking:** the script writes `translatedFrom: <sha256 of English source>` into the French frontmatter.
  - `--check` mode lists French pages whose English source hash has changed, or that are missing.
  - `--stale` retranslates only those pages.
  - `--path controls/` restricts a run to a subtree.
  - The script runs with limited concurrency and can resume: pages that are already current are skipped.
- **Validation per file:** the restored placeholders must match the originals exactly (same number of code fences and same component tags), or the file is marked failed and skipped.

## Phase 4: Bulk translation and review
- Translate one library folder at a time: foundation → client → mediator → controls → documentdb → … (the folders are listed in `src/content/docs/`). After each batch, run `npm run build`, since MDX errors only surface at build time.
- Review each batch by spot-reading the rendered `/fr/` pages. Check terminology, text inside MDX components (e.g. `<Aside>` bodies) and that links resolve. Fix issues in the glossary and rerun rather than hand-editing where possible.
- Commit one batch per library so reviews stay manageable.

## Phase 5: Keeping French in sync
- `.github/workflows/deploy.yml`: add a non-blocking step, `node scripts/i18n/translate.mjs --check`, that writes a staleness summary to the job summary.
  - Optional follow-up: a scheduled workflow runs `--stale` and opens a PR. This needs an Anthropic API key as a repo secret.
- `CLAUDE.md`: add a "How to update → French translations" section covering the `--check`/`--stale` workflow, the glossary, the English-only areas, and the rule that French files are generated and fixed through the glossary or a rerun.

## Critical files
`astro.config.mjs`, `src/content.config.ts`, `src/sidebar-topics.mjs`, `src/components/{Header,Sidebar,SidebarSublist,HomeHero,HomepageNav,JumpTo,LibraryExplorer,ThemeSelect,Banner,MarkdownContent,Giscus}.astro`, `src/pages/llms*.ts`, `.github/workflows/deploy.yml`, `CLAUDE.md`.
New: `src/content/i18n/{en,fr}.json`, `src/i18n/{label,url}.ts`, `i18n/{glossary,sidebar}.fr.json`, `scripts/i18n/{translate,sidebar-labels}.mjs`, `src/content/docs/fr/**`.

## Verification
1. After Phase 1 and 2:
   - `npm run build` passes, with no French content yet.
   - With `npm run preview`, `/` and `/fr/` both render, and the language picker switches between them.
   - `/fr/client/core/` shows English with the fallback notice.
   - The sidebar and homepage nav show French labels on `/fr/`.
   - `/fr/blog/` and English URLs are unaffected. Spot-check old redirects.
2. Translate `foundation/` as a pilot, then:
   - The build passes.
   - Code blocks match the English byte-for-byte (diff fences between the English and French files).
   - Internal links in `/fr/` pages stay under `/fr/`.
   - Pagefind search on `/fr/` returns French results.
   - `llms.txt` has no `/fr/` entries.
3. Edit one English page and confirm `--check` flags its French copy. `--stale` refreshes it.
4. Run the full batch translation, a final `npm run build`, and spot-check pages from every library.

## Effort estimate
- Phases 1–3: about 4–6 working days.
- Phase 4: LLM translation takes 1–2 days of machine time. Human review of about 650k words is the long pole, at roughly 150–200 hours.
- Phase 5: about half a day.
