# shinylib.net documentation

Astro + Starlight site for [shinylib.net](https://www.shinylib.net), deployed to GitHub Pages.

## Project structure

```
.
├── .github/workflows/deploy.yml     CI: builds the site and deploys to Pages
├── astro.config.mjs                 Astro + Starlight config, redirects
├── package.json                     npm scripts (incl. playground hooks)
├── public/                          Static assets copied verbatim into dist/
│   └── playground/                  Built Blazor apps land here (gitignored)
│       └── index.html               Hand-written 3-card landing page
├── scripts/
│   └── build-playground.mjs         Publishes Blazor WASM samples
├── src/
│   ├── assets/
│   ├── components/                  Custom Starlight component overrides
│   ├── content/docs/                Documentation pages (.md / .mdx)
│   ├── sidebar-topics.mjs           Shared sidebar topic config
│   └── styles/
└── playground/                      Self-contained Blazor WASM samples
    ├── Directory.Build.props
    ├── nuget.config                 Clears parent feeds, only uses nuget.org
    ├── Shiny.Playground.slnx
    ├── CLAUDE.md                    AI-agent guidance for updating samples
    ├── AiConversation/              Shiny.AiConversation chat / Aura / Settings
    ├── Controls/                    Shiny.Blazor.Controls gallery
    ├── DocumentDb/                  Shiny.DocumentDb (IndexedDB + SQLite)
    ├── Mediator/                    Shiny.Mediator demos
    ├── Shiny/                       Shiny core: BLE, Push, HttpTransfers, GPS, Battery, Connectivity
    └── Speech/                      Shiny.Speech (Web Speech API)
```

## Commands

| Command                          | Action                                                                |
| :------------------------------- | :-------------------------------------------------------------------- |
| `npm install`                    | Install dependencies                                                  |
| `npm run dev`                    | Publish playground (Debug) then start the Astro dev server            |
| `npm run build`                  | Publish playground (Release) then build the production site to `dist/` |
| `npm run preview`                | Preview the built site locally                                        |
| `npm run build:playground`       | Publish the playground only, Release config                           |
| `npm run build:playground:debug` | Publish the playground only, Debug config                             |
| `npm run astro ...`              | Run Astro CLI commands directly                                       |

To skip the playground rebuild when iterating on docs content, run `npx astro dev` directly — the previously published `public/playground/*` from your last run will still serve.

## Playground

Six Blazor WebAssembly samples that ship as part of the docs site, accessible at:

- `/playground/` — landing page (`public/playground/index.html`)
- `/playground/aiconversation/` — Shiny.AiConversation (needs an OpenAI key for live chat)
- `/playground/controls/` — Shiny.Blazor.Controls gallery
- `/playground/documentdb/` — DocumentDb (IndexedDB + in-memory SQLite)
- `/playground/mediator/` — Shiny.Mediator demos
- `/playground/shiny/` — Shiny core (BLE, Push w/ VAPID, HttpTransfers, GPS, Battery, Connectivity)
- `/playground/speech/` — Shiny.Speech (Web Speech API)

### How it's wired

1. `scripts/build-playground.mjs` runs `dotnet publish` on each csproj under `playground/`, then copies the resulting `wwwroot` into `public/playground/<slug>/`.
2. Astro copies `public/` verbatim into `dist/` during its own build.
3. Each sample's `wwwroot/index.html` has its `<base href>` pinned to `/playground/<slug>/` so asset and route resolution work under the sub-path.
4. The hand-written `public/playground/index.html` landing page is committed to git; the three built sub-apps are `.gitignore`d and regenerated on every build.
5. A small `playground-dev-rewrites` integration in `astro.config.mjs` adds a Vite dev middleware that rewrites directory requests under `/playground/...` to their `index.html`. Required because Starlight's catch-all route otherwise intercepts those paths and 404s before Astro falls through to `public/`. Production GitHub Pages handles directory index resolution natively, so the middleware is dev-only.

The script triggers automatically via npm lifecycle hooks:

- `predev` and `prestart` → `--debug` (skips trimming and `.br`/`.gz` precompression — roughly halves publish time)
- `prebuild` → Release (production-equivalent output)

### Prerequisites

- .NET 10 SDK on PATH (`dotnet --version` should report `10.0.x`)
- The `wasm-tools` workload — needed by the DocumentDb sample's native SQLite compilation. Install locally with:
  ```
  dotnet workload install wasm-tools
  ```
  CI installs this automatically via `actions/setup-dotnet@v5`'s `workloads:` input.

### Why a local `playground/nuget.config`

It `<clear />`s parent NuGet sources and only uses nuget.org. Without this, machines with private feeds configured at the user or machine level (Azure DevOps, GitHub Packages, etc.) will fail restore here with `NU1301: Unauthorized`, since none of those feeds host the Shiny packages.

### Updating package versions

Versions are pinned directly in each csproj — no Central Package Management, no floating versions. To upgrade:

1. Edit the `<PackageReference ... Version="..." />` in `playground/<App>/<App>.csproj`.
2. Run `npm run build:playground` to confirm the build still works.

Current pins:

| Package family            | Version           | csproj                     |
| :------------------------ | :---------------- | :------------------------- |
| `Shiny.AiConversation.*`  | `1.0.0-beta-0047` | `AiConversation.csproj`    |
| `Shiny.Blazor.Controls.*` | `1.0.1-beta-0079` | `Controls.csproj`          |
| `Shiny.DocumentDb.*`      | `5.1.0`           | `DocumentDb.csproj`        |
| `Shiny.Mediator.*`        | `6.4.0`           | `Mediator.csproj`          |
| `Shiny.*.Blazor` (core)   | `5.0.0-beta-0071` | `Shiny.csproj`             |
| `Shiny.Speech`            | `2.1.0`           | `Speech.csproj`            |
| `Microsoft.Extensions.AI.OpenAI` | `10.6.0`   | `AiConversation.csproj`    |

### Iterating on a sample

The npm lifecycle hooks are convenient for "docs developer who wants the playground link to work" but a poor loop for "Blazor developer iterating on the sample itself." For the latter, run `dotnet watch` directly in the sample folder:

```
cd playground/Controls
dotnet watch
```

That uses `Microsoft.AspNetCore.Components.WebAssembly.DevServer` (referenced in every csproj) and gives you hot reload against the sample's own dev server.

### Adding a new playground app

1. Create `playground/<Name>/` with a `<Name>.csproj` using `Microsoft.NET.Sdk.BlazorWebAssembly`, a `Program.cs`, `App.razor`, `_Imports.razor`, and a `wwwroot/index.html` with `<base href="/playground/<slug>/" />`.
2. Add the project to `playground/Shiny.Playground.slnx`.
3. Add `{ dir: '<Name>', slug: '<slug>', csproj: '<Name>.csproj' }` to the `apps` array in `scripts/build-playground.mjs`.
4. Add a card to `public/playground/index.html`.
5. Append `public/playground/<slug>/` to `.gitignore`.

## CI/CD

`.github/workflows/deploy.yml`:

1. `actions/checkout@v6`
2. `actions/setup-dotnet@v5` with `dotnet-version: 10.0.x` and `workloads: wasm-tools`
3. `withastro/action@v6` — runs `npm ci && npm run build`, which triggers `prebuild` (publishes Blazor apps) before `astro build`, and uploads `dist/` as the Pages artifact
4. `actions/deploy-pages@v4` — pushes the artifact to GitHub Pages

Builds run on every push to `main` and `dev`; only `main` deploys.

## Reference

- [Starlight docs](https://starlight.astro.build/)
- [Astro docs](https://docs.astro.build)
