# CLAUDE.md

Documentation site for [shinylib.net](https://www.shinylib.net) — an **Astro + Starlight** static site deployed to GitHub Pages. This repo hosts docs only; the Blazor playground demos and library source live in sibling `shinyorg/*` repos.

See `README.md` for deeper detail on giscus comments, the playground demos, and CI/CD.

## Commands

| Command           | Action                                  |
| :---------------- | :-------------------------------------- |
| `npm install`     | Install dependencies                    |
| `npm run dev`     | Start the Astro dev server              |
| `npm run build`   | Build the production site to `dist/`    |
| `npm run preview` | Preview the built site locally          |

Always run `npm run build` after non-trivial content/config changes — MDX errors only surface at build time.

## Layout

- `src/content/docs/` — all documentation pages (`.md` / `.mdx`), one folder per library/topic
- `src/content/docs/blog/<year>/<month>/` — blog posts
- `src/components/` — custom Starlight component overrides and reusable `.astro`/`.tsx` components (e.g. `AppShowcase`, `ReleaseNote`, `PlatformSupport`, `NugetBadge`, `Giscus`)
- `src/content.config.ts` — content collection schema (extra frontmatter fields like `comments` are declared here)
- `src/sidebar-topics.mjs` — shared sidebar topic config consumed by `astro.config.mjs`
- `src/pages/llms.txt.ts`, `llms-full.txt.ts` — generated LLM-facing text endpoints
- `astro.config.mjs` — Astro + Starlight config, redirects, giscus, analytics
- `public/` — static assets copied verbatim into `dist/`
- `scripts/extract-templates.mjs` — build-support script

`dist/`, `.astro/`, and `node_modules/` are generated — never edit by hand.

## Conventions

- Each doc page starts with frontmatter (`title:` required). Add `comments: true` to opt a page into the giscus widget.
- `.mdx` is used when a page needs components; plain `.md` otherwise.
- Release-note `<RN>` entries that contain a code fence need their opening/closing tags on their own lines, or the MDX build fails.
- This is a docs repo, not the library source — when documenting Shiny APIs, verify against the real library/sample code in the sibling `shinyorg/*` repos rather than inventing API surface.

## How to update

### Bump NuGet versions in the App / Lib / Template builders

Update every package version surfaced by the three builders. **Rule: use the latest _stable_ version for every package — EXCEPT Shiny packages (`Shiny.*`), which take the latest _beta_/prerelease.**

Version strings live in three places, all of which must be kept in sync:

1. **`src/consts.ts`** — App Builder + Lib Builder. `DEFAULT_VERSION` (shared by the core Shiny client libs) plus each component's `version` and `additionalNugets[].version`.
2. **`src/components/TemplateBuilder/templateData.ts`** — the `VERSIONS` map (single source of truth for the Template Builder UI).
3. **`src/components/TemplateBuilder/templateFiles.*.ts`** — version strings are **also hardcoded literally** inside the generated `.csproj` content (e.g. `<MudBlazor Version="9.5.0" />`, `<MicrosoftVersion>10.0.8</MicrosoftVersion>`, Orleans, etc.). These do **not** interpolate `VERSIONS`, so update them too.

Look up latest versions from the NuGet flat-container API (`index.json` lists all versions, prerelease included):

```
https://api.nuget.org/v3-flatcontainer/<package-id-lowercased>/index.json
```

- Non-Shiny → highest version without a prerelease tag.
- `Shiny.*` → highest version (prefer the newest prerelease/`-beta`).
- Keep `Microsoft.*` / `.NET` framework packages (the `MicrosoftVersion` property) on the same major as the project TFM — take the latest patch within that major, not a different major.

After editing, run `npm run build` to confirm nothing broke.

### Sync the `dotnet new` templates with the Template Builder

The real `dotnet new` templates live in the **sibling repo `~/Desktop/dev/templates`** (`ProjectTemplates/ShinyApp`, `ShinyAspNet`, `ShinyBlazor`). **Those are the source of truth** — the builder's `templateFiles.<id>.ts` files are AUTO-GENERATED from them by `scripts/extract-templates.mjs` (templates → builder). `XplatLib` and the `ItemTemplates/*` are **not** part of the builder, so leave them out of any builder-sync work.

So "update the templates from the builder" really means: apply the same edits (e.g. the version bumps above) to the template `.csproj` files, then **regenerate the builder so the two stay in sync**:

1. Edit `~/Desktop/dev/templates/ProjectTemplates/{ShinyApp,ShinyAspNet,ShinyBlazor}/*.csproj`. Match by MSBuild property name (`<ShinyVersion>…`) or `PackageReference Include="…"` and set the target value — the templates can drift from the builder (e.g. an older `ShinyDocumentDbVersion`), so match by name, not by old value.
2. From this repo, run `node scripts/extract-templates.mjs` to regenerate all three `templateFiles.<id>.ts`.
3. `npm run build` here to confirm, and `git diff` both repos to review.
