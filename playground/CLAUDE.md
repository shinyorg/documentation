# Playground — AI agent guidance

Six self-contained Blazor WebAssembly samples that ship with the docs site at `/playground/<slug>/`. Each sample was originally seeded from a sibling Shiny library repo's `samples/Sample.Blazor` (or equivalent) folder and now lives independently here — drift from the upstream sample is expected, but the upstream is still the source of truth for sample logic. Pull updates back periodically (see "Pulling upstream updates" below).

## What lives where

```
playground/
├── Directory.Build.props        Shared: TargetFramework=net10.0, RootNamespace=Sample.Blazor,
│                                AssemblyName=Sample.Blazor, AOT off, InvariantGlobalization=false
├── nuget.config                 <clear /> + nuget.org only — DO NOT DELETE
├── Shiny.Playground.slnx
├── AiConversation/              ← seeded from ~/Desktop/dev/aiconversation/samples/Sample.Blazor
├── Controls/                    ← seeded from ~/Desktop/dev/controls/samples/Sample.Blazor
├── DocumentDb/                  ← seeded from ~/Desktop/dev/DocumentDb/samples/Sample.Blazor
├── Mediator/                    ← seeded from ~/Desktop/dev/mediator/samples/Sample.Blazor
├── Shiny/                       ← seeded from ~/Desktop/dev/shiny/samples/Sample.Blazor
└── Speech/                      ← seeded from ~/Desktop/dev/speech/samples/BlazorSample
```

Sibling-repo paths are only present on the maintainer's machine. CI and contributors without those repos build purely from NuGet `<PackageReference>`s in each csproj. Do not introduce `<ProjectReference>`s back to sibling repos.

## How the build hangs together

`scripts/build-playground.mjs` (in the repo root) iterates the `apps` array and:
1. `dotnet publish <csproj> -c {Release|Debug}` into `tmp-playground/<slug>/`
2. Copies the resulting `wwwroot/` into `public/playground/<slug>/`

Astro then copies `public/` verbatim into `dist/`. The Vite middleware `playground-dev-rewrites` in `astro.config.mjs` is what makes directory URLs work in `npm run dev` — Starlight's catch-all would otherwise intercept `/playground/.../` and 404. Don't remove it.

`prebuild` (Release) and `predev`/`prestart` (Debug) hooks in `package.json` trigger the script via npm lifecycle.

## Bumping package versions

Versions are pinned directly in each csproj's `<PackageReference Version="..." />`. No Central Package Management, no floating versions — bumping is a deliberate act.

```
# After editing versions in any csproj:
npm run build:playground         # Release — what CI runs
npm run build:playground:debug   # Debug — faster, skips trimming and .br/.gz
```

If the bump breaks a sample (API change, breaking refactor), fix the sample source. The samples are owned by this repo now, not by the upstream library.

When a package family has multiple csproj-pinned versions (e.g. `Shiny.AiConversation` + `Shiny.AiConversation.OpenAi`), bump them together to the same version — they're co-released.

## Pulling upstream updates

When an upstream sample has been improved (bug fix, new page, refactor), pull the changes back with the same rsync pattern used to seed it originally. The exclusions preserve everything this repo owns: the rewritten `.csproj`, build outputs, and IDE files.

```bash
# From repo root. Replace <Name>, <repo>, <SampleFolder> with the right values.
rsync -av --delete \
  --exclude='bin' --exclude='obj' --exclude='*.csproj' --exclude='Properties' \
  ~/Desktop/dev/<repo>/samples/<SampleFolder>/ playground/<Name>/
```

Source mappings (the same paths as the "What lives where" tree):

| Local folder        | Upstream source                                              |
| :------------------ | :----------------------------------------------------------- |
| `AiConversation/`   | `~/Desktop/dev/aiconversation/samples/Sample.Blazor/`        |
| `Controls/`         | `~/Desktop/dev/controls/samples/Sample.Blazor/`              |
| `DocumentDb/`       | `~/Desktop/dev/DocumentDb/samples/Sample.Blazor/`            |
| `Mediator/`         | `~/Desktop/dev/mediator/samples/Sample.Blazor/`              |
| `Shiny/`            | `~/Desktop/dev/shiny/samples/Sample.Blazor/`                 |
| `Speech/`           | `~/Desktop/dev/speech/samples/BlazorSample/`                 |

After every rsync, **re-patch `wwwroot/index.html`'s `<base href>`** back to `/playground/<slug>/` — the upstream value is `/` and rsync will overwrite the local edit. Then:

```bash
npm run build:playground:debug   # verify the updated sample still publishes
```

If the upstream added new namespaces or moved files, double-check the per-sample gotchas below — for example, a sample that previously used the `Sample.Blazor` namespace might switch to something else and need a `<RootNamespace>` override in its csproj.

If the upstream bumped library versions (i.e. a corresponding NuGet package release also happened), bump the matching `<PackageReference Version="...">` in the local csproj at the same time.

**Diff the upstream csproj after each rsync.** The rsync intentionally excludes `*.csproj` because the local csproj differs (NuGet refs, `StaticWebAssetBasePath`, etc.) — but that means upstream csproj changes are silently missed. They sometimes carry runtime-critical settings, not just package versions. After every rsync:

```bash
diff ~/Desktop/dev/<repo>/samples/<SampleFolder>/<UpstreamName>.csproj \
     playground/<Name>/<Name>.csproj
```

Review every property the upstream sets and decide whether to mirror it in the local csproj. The build succeeding does NOT mean the runtime will work — a missing property here breaks at first render, not at compile time.

**The DocumentDb library is AOT/reflection-free; the sample csproj is pragmatic.** Library code (everything under `~/Desktop/dev/DocumentDb/src/`) and sample user code must never depend on reflection — fix issues via `JsonSerializerContext` source-gen, `[JSImport]`, or call-site changes. The app-level csproj is allowed to have `JsonSerializerIsReflectionEnabledByDefault=true` (the default) when Blazor framework components like `HeadOutlet` need it. Read the runtime exception stack: if the failing frame is inside Shiny code, fix the library/sample; if it's inside `Microsoft.AspNetCore.Components.*` or `Microsoft.JSInterop.JSRuntime`, accept reflection at the app level.

## Per-sample gotchas

- **Every `wwwroot/index.html` has `<base href="/playground/<slug>/" />`** (not `/`). Browser asset resolution + Blazor routing both depend on this. If you seed a new sample, patch this before publishing or asset URLs will 404 in production.
- **`Speech/Speech.csproj` overrides `<RootNamespace>BlazorSample</RootNamespace>`** locally. The Speech sample's Program.cs and `_Imports.razor` reference the `BlazorSample` namespace; the shared `Sample.Blazor` default in `Directory.Build.props` would break it. Other samples either already use `Sample.Blazor` or qualify explicitly.
- **`DocumentDb/DocumentDb.csproj` keeps `EnableAotAnalyzer`/`EnableTrimAnalyzer` on.** The native SQLite still gets compiled through emscripten — that's expected and needs the `wasm-tools` workload.
- **The DocumentDb sample does NOT set `JsonSerializerIsReflectionEnabledByDefault=false`.** That setting blocks Blazor framework components (`HeadOutlet`, others) which use `IJSRuntime` with `Object[]` arg envelopes that need reflection. The library itself (`Shiny.DocumentDb.IndexedDb` 5.1.x+) is reflection-free — it uses `[JSImport]` from `System.Runtime.InteropServices.JavaScript` for JS interop — so apps that don't use `HeadOutlet` or similar may opt into `false`, but the playground keeps reflection on so the framework works. **Never re-introduce `=false` here as a "tighten AOT" change without verifying every framework component the sample uses.**
- **`AiConversation/Program.cs` has a placeholder OpenAI key** (`"YOUR API KEY HERE"`). Chat won't work in the deployed playground. UI/wiring still demonstrates fine. If you wire up runtime key entry, do it in `AiConversation/` only — don't generalize to other samples.
- **`Shiny/Shiny.csproj` sets `<OverrideHtmlAssetPlaceholders>true</OverrideHtmlAssetPlaceholders>`** because the upstream `wwwroot/index.html` uses Blazor's asset-fingerprint placeholders (`<link rel="preload" id="webassembly" />` and `_framework/blazor.webassembly#[.{fingerprint}].js`). The Razor SDK rewrites those during publish; without this flag the page would 404 on the script tag.
- **`Shiny/Program.cs` has a placeholder VAPID push key** (`"BNbxGYNMhEIi9zrneh7mqV4oUanjLUK3m-REPLACE-ME"`). Web Push won't work in the deployed playground without a real key bound to a real push backend. BLE/GPS/HTTP/Battery/Connectivity pages work without any config.
- **AOT is off globally** via `<RunAOTCompilation>false</RunAOTCompilation>` in `Directory.Build.props`. Don't turn it on per-sample — CI build time scales linearly and AOT adds 5–10 min per app.

## The local `nuget.config`

```xml
<packageSources>
  <clear />
  <add key="nuget.org" value="https://api.nuget.org/v3/index.json" protocolVersion="3" />
</packageSources>
```

This exists because contributors with private feeds configured at the user/machine level (Azure DevOps, GitHub Packages) get `NU1301: Unauthorized` on restore — those feeds don't host Shiny packages but get tried anyway. The `<clear />` scopes restore to nuget.org. Do not delete; if you must add an additional feed, keep nuget.org and only add the new feed below it.

## Adding a new sample

1. Create `playground/<Name>/` and seed source from the upstream repo's Blazor sample folder. Rsync excluding `bin/`, `obj/`, `Properties/`, and the upstream `*.csproj`:
   ```
   rsync -a --exclude='bin' --exclude='obj' --exclude='*.csproj' --exclude='Properties' \
     ~/Desktop/dev/<repo>/samples/<SampleBlazor>/ playground/<Name>/
   ```
2. Write `playground/<Name>/<Name>.csproj` using `Microsoft.NET.Sdk.BlazorWebAssembly` with pinned `<PackageReference>`s. Mirror the structure of the existing csprojs.
3. If the upstream sample's `_Imports.razor` or `Program.cs` references a namespace other than `Sample.Blazor`, add `<RootNamespace>...</RootNamespace>` to the new csproj (see `Speech.csproj`).
4. Patch `playground/<Name>/wwwroot/index.html`'s `<base href>` to `/playground/<slug>/`.
5. Add the project to `playground/Shiny.Playground.slnx`.
6. Add `{ dir: '<Name>', slug: '<slug>', csproj: '<Name>.csproj' }` to the `apps` array in `scripts/build-playground.mjs` (keep alphabetical by `dir`).
7. Append `public/playground/<slug>/` to the repo-root `.gitignore`.
8. Add a card to `public/playground/index.html`.
9. Update the README "Playground" section (URL list + versions table) and this file's "What lives where" tree + "Pulling upstream updates" source-mapping table.
10. Update `src/sidebar-topics.mjs`:
    - Add the new sample to the "Blazor Playground" group inside the Foundation topic (keep alphabetical).
    - Add a `{ label: 'Blazor Playground', link: '/playground/<slug>/', attrs: { target: '_blank' } }` item to each library section in the sidebar that the sample demonstrates, placed **immediately before "Release Notes"** (or at the end of items if there is no Release Notes entry).
11. Run `npm run build:playground:debug` to verify the sample publishes, then `npx astro build` to verify the sidebar config still validates.

## Things not to do

- Don't introduce `<ProjectReference>`s across repos. Samples are self-contained.
- Don't enable Central Package Management (CPM). The user wants explicit per-csproj pins.
- Don't enable AOT or `<RunAOTCompilation>true</RunAOTCompilation>` on any sample.
- Don't remove `playground/nuget.config`.
- Don't remove the `playground-dev-rewrites` integration in `astro.config.mjs`.
- Don't add per-sample `.gitignore` files — output exclusions live in the repo-root `.gitignore`.
- Don't commit anything under `public/playground/<slug>/` (the built apps). The landing `public/playground/index.html` IS committed.
- Don't change `<AssemblyName>Sample.Blazor</AssemblyName>` — `index.html` references `Sample.Blazor.styles.css` which is the auto-generated scoped-CSS bundle keyed off the assembly name. Each sample lives in its own subdirectory so there's no collision.

## Verifying changes

Before declaring success after touching a sample or csproj:

```
npm run build:playground:debug
```

If the change is risky (new package, package upgrade, csproj refactor), also run `npm run build` to confirm the Release publish still works — Release exercises trimming and may catch issues Debug misses.
