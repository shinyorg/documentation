# Plan: live Blazor demos inside docs pages

**Status:** proposed, not started
**Written:** 2026-08-24
**Revised:** 2026-09-04 — Step 0 measured, framing verified live, route map re-diffed
against both repos. See [Revision — 2026-09-04](#revision--2026-09-04) at the bottom for
what changed; the inline text below is corrected to match.

## Goal

Replace (or augment) the static screenshots on control doc pages with the real, running
Blazor control — so `/controls/datagrid/` shows a DataGrid you can sort, group and page,
not a PNG of one.

## Answer: yes, and mostly with what already exists

Three facts make this cheap:

1. `shinyorg/controls` → `samples/Sample.Blazor` is **one WASM app with 75 routes**
   (`/datagrid`, `/button`, `/treeview`, …), already deployed to
   `https://shinyorg.github.io/controls/` by that repo's `deploy-blazor-sample.yml`.
2. One app means **one runtime download serves every embed on the whole site**, cached
   across doc pages — not a fresh multi-MB payload per control.
3. **47 of the 75 `src/content/docs/controls/*` folders already match a sample route by
   name**, and 18 more resolve through the explicit map — **65 of 75 doc pages can carry a
   demo**. The remaining 10 are 9 MAUI-only pages plus `speech-addins` (see the map below).

## Approach chosen: lazy deep-linked iframe

A `<BlazorDemo>` component renders the existing screenshot as a poster with a
**"Run it live ▶"** button. Clicking swaps in an `<iframe>` pointed at the deployed
sample's route in embed mode.

Nothing new to host, no .NET in this repo's CI, and the WASM cost is paid only by readers
who ask for it.

### Alternatives rejected

**Vendor the published WASM into `public/`.** Same UX but same-origin — easier theming
and unpartitioned `localStorage`. Costs a .NET SDK + workload restore in the docs CI
(~4 min per build), tens of MB of build artifact, and version skew between the docs repo
and the library. Revisit only if cross-origin friction actually bites.

**True inline — Blazor custom elements mounted in the Astro page.** Technically real
(`RootComponents.RegisterCustomElement`, then `<shiny-datagrid-demo>` in MDX), and wrong
for a docs site: the Shiny theme CSS and Starlight's cascade would fight in the same
document permanently, Astro client nav would need the runtime torn down and re-inited per
page, and the payload lands on page load rather than behind a click. Do not do this.

---

## Step 0 — ANSWERED 2026-09-04

The whole plan hinged on one number nobody had: **what does the deployed playground actually
cost to load?**

Measured on `https://shinyorg.github.io/controls/datagrid`, cold, via `PerformanceResourceTiming`
(`encodedBodySize`, so cache hits still count):

| | |
| :-- | :-- |
| **Over the wire** | **8.95 MB** (gzip; GitHub Pages compresses on the fly) |
| Decoded | 26.1 MB |
| Requests | 105 — **84 of them `.wasm` assemblies** |
| Network complete | ~1.7 s on a fast desktop connection |
| Largest single asset | `dotnet.native.wasm` — 2.9 MB gzip / 7.5 MB raw |
| Second largest | `DocumentFormat.OpenXml.wasm` — 1.35 MB gzip / 5.6 MB raw |

**Verdict: heavy. The click-to-load gate is non-negotiable.** Do not auto-load on
`IntersectionObserver`, not even for the first demo on a page — 9 MB and 105 requests is a
cost a reader must opt into. Everything else in this plan stands.

Two findings that came out of the same measurement:

- **Nothing is lazy-loaded.** `Sample.Blazor.csproj` sets no `BlazorWebAssemblyLazyLoad`, so
  `DocumentFormat.OpenXml` — 1.35 MB gzip, needed only by `/spreadsheet`, `/document-*`,
  `/slide-*` and `/notebook` — is downloaded by a reader who clicked a Button demo. Lazy-loading
  the Office assemblies would cut ~15% off every non-Office embed. Worth doing in the controls
  repo, independent of this plan.
- **GitHub Pages sends `cache-control: max-age=600`.** Fact 2 above ("one runtime download
  serves every embed on the whole site") holds inside a 10-minute window; past it the browser
  revalidates. Fingerprinted filenames mean that is 105 cheap 304s rather than 9 MB again — but
  it is not the free ride the framing suggested, and it is not something this repo can change.

### Framing verified live

Also settled on 2026-09-04, and previously untested: an `<iframe src="https://shinyorg.github.io/controls/datagrid">`
injected into the real `https://shinylib.net/controls/datagrid/` page **loads and renders the
DataGrid demo**. Neither origin sends `X-Frame-Options` or a CSP `frame-ancestors`, and neither
sends a `Permissions-Policy` that would block the `allow="camera; microphone"` delegation. There
is no blocker here.

Two things that test also showed:

- At 900 x 600 the un-embedded gallery gives up roughly a quarter of the frame to the nav panel
  (`CollapseBelow="820"`, so at 900 px the panel is *showing*). Embed mode is what makes this
  usable, and `BlazorDemo`'s default frame width should sit **below 820** so that even a
  regression in embed mode degrades to the collapsed layout rather than the full shell.
- The publish-from-this-machine blocker in the original Step 0 is understood now: it is the
  emscripten wrapper choking on the space in the SDK path, plus the missing `wasm-tools`
  workload. CI is unaffected — `deploy-blazor-sample.yml` installs `wasm-tools` explicitly.
  None of this plan requires a local publish anyway.

---

## Work in `shinyorg/controls`

### 1. Embed mode in the sample

`samples/Sample.Blazor/Layout/MainLayout.razor` renders the full gallery shell — a 260px
`AppLayoutPanel` nav and a 64px branded `ShinyToolbar`. In an 800x500 iframe that is mostly
chrome.

Add an `?embed=1` query flag, read via the already-injected `NavigationManager`, that drops
the nav panel and the header and renders just the routed page. Same app, same deployment,
one conditional — no second build target.

`MainLayout` has grown since this was written. Under `?embed=1` it must also drop:

- **`<SourceCodePanel />`** (added ~2026-08-27) — it renders under `@Body` on *every* page and
  shows the demo's own `.razor` through `MarkdownView`. In a docs page that already prints the
  usage code it is pure duplication, and it drags `MarkdownView` into the frame.
- **`<SplashScreenHost Until="StartupAsync" />`** — `StartupAsync` is a scripted ~660 ms fake
  boot narration. Behind a click-to-load gate that is 660 ms of splash over a demo the reader
  just asked for, and it delays `shiny-demo:ready`.

Everything else in that block must **stay**: `ToastHost`, `ProgressLineHost`, `DialogHost`,
`QuickEntryHost` and `FileDropHost` are what the toast, progressline, dialogs, quickentry and
filedrop demos actually render into — drop them and those five embeds do nothing at all.

**Theme must be settable at first paint, not only by message.** `ThemeSwitcher` holds `dark`
in `MainLayout` state, defaults to light, and persists nothing — so an embed inside a dark docs
page flashes light until the parent's `shiny-demo:theme` message lands. Accept `?theme=dark`
(and, cheaply, `?pack=ocean|material|terminal|aurora`, which the switcher already resolves to a
stylesheet href) on the initial URL, and keep the message for later changes. `?pack=` is close
to free and is the thing that would make an embed on `controls/theming` worth having.

Keep `ThemeSwitcher` reachable in embed mode (or drive it from the parent, below).

### 2. postMessage contract

Also in the sample, so it ships with the app rather than being bolted on from the docs side.
Both directions use an explicit `targetOrigin` — never `*`.

**child → parent** (`https://shinylib.net` — the **apex**; `www.shinylib.net` 301s to it, so
a `targetOrigin` of `https://www.shinylib.net` would be silently dropped. `astro.config.mjs`
still declares `site: 'https://www.shinylib.net'` — that is stale, do not copy it):

```js
{ type: 'shiny-demo:height', height: <px> }   // on ResizeObserver, so the iframe self-sizes
{ type: 'shiny-demo:ready' }                  // app started; parent can drop the poster
```

**parent → child** (`https://shinyorg.github.io`):

```js
{ type: 'shiny-demo:theme', theme: 'dark' | 'light' }
```

Theme handling is nearly free — `MainLayout` already toggles a `shiny-theme-dark` class on
`.page`.

### 3. Speech / Mediator / Shiny Core samples

Same two changes, same contract, when the rollout reaches them. Do not start here.

---

## Work in this repo

### 4. `src/components/BlazorDemo.astro`

```astro
<BlazorDemo lib="controls" route="datagrid" poster="/images/datagrid/blazor-s1.png" />
```

Requirements:

- **Click-to-load.** Render the poster `<img>` + a play button; only inject the `<iframe>`
  on click. No iframe in the initial HTML.
- `loading="lazy"` on the iframe once injected.
- `allow="camera; microphone; clipboard-write"` — the camera, barcode and speech demos
  need it, and an iframe without it fails silently.
- An **"open in new tab"** escape hatch to the non-embed URL, always visible.
- `class="not-content"` on the root. Starlight's markdown sibling rule otherwise adds
  `margin-top: 16px` to every button after the first (see the `starlight-not-content` note
  in memory).
- Caption line: **"Live demo — tracks `main`"**. See the version-skew risk below.
- Height driven by the `shiny-demo:height` message, with a sane `min-height` fallback for
  the case where the message never arrives.

Multi-route support is worth building in from the start: several doc pages map to more than
one gallery route (`toolbar-tabbar` → `/toolbar` + `/tabbar`, `scheduler` → `/agenda` +
`/agendalist` + `/calendar`). Accept an array and render them as tabs.

### 5. Route map

New `src/blazor-demos.mjs`, alongside `sidebar-topics.mjs`. Convention (folder name ==
route) covers 35 pages; the rest are explicit:

| doc folder                 | sample route(s)                        |
| :------------------------- | :------------------------------------- |
| `addressentry`             | `/countryaddress`                      |
| `countrypicker`            | `/countryaddress`                      |
| `cameraview`               | `/camera`                              |
| `carousel-gallery`         | `/carousel-advanced`                   |
| `chatview`                 | `/chat`                                |
| `colorpicker`              | `/colorpicker` (`/pickers` is an alias)|
| `document-viewer`          | `/document-viewer`, `/slide-viewer`    |
| `file-drop`                | `/filedrop`                            |
| `media-picker-button`      | `/mediapicker`                         |
| `mermaid-diagrams`         | `/mermaid`                             |
| `motion-icons`             | `/motionicons`                         |
| `onscreen-keyboard`        | `/onscreenkeyboard`                    |
| `parallax-collection-view` | `/parallaxlist`                        |
| `pillview`                 | `/pills`                               |
| `quick-entry`              | `/quickentry`                          |
| `scheduler`                | `/agenda`, `/agendalist`, `/calendar`  |
| `sheetview`                | `/sheet`                               |
| `staggered-grid`           | `/staggeredgrid`                       |
| `toolbar-tabbar`           | `/toolbar`, `/tabbar`                  |
| `virtualized-grid`         | `/virtualizedgrid`                     |

**Intentionally no demo — MAUI-only** (confirmed 2026-09-04 via each page's
`<PlatformSupport frameworks={["maui"]} />`): `durationpicker`, `feedback`, `floatingpanel`,
**`flyout`**, `fontpicker`, `keyframe`, **`navigationpage`**, **`tabbedpage`**, `trayicon`.
The three in bold are new since this plan was written.

**Unresolved:** `speech-addins` is documented as `["maui", "blazor"]` and the sample
references `Shiny.Blazor.Controls.SpeechAddins`, but there is no `@page` route for it in the
gallery. Either add a gallery page in the controls repo or leave the doc page demo-less.

**Gallery routes with no doc folder** — candidates to attach to an existing page rather than
leave stranded: `/cells` (→ `tableview`?), `/fab-menu` (→ `fab`?), `/markdown-editor`
(→ `markdown`?), `/qrcode` (→ `barcodes`?), `/kitchensink` (→ `controls/index.mdx`).

`/pickers` is **not** stranded — it is a second `@page` on `ColorPickerPage.razor`.

`/slide-viewer` is **not** stranded either — it belongs to `document-viewer`, whose page is
titled *"Document & Slide Viewers"* and documents `DocumentView` and `SlideView` together (with
`presenting.mdx` beside it for the full-screen show). It is a second route on that page, listed
in the map above.

### 6. Build-time validation

Two asserts, so drift in the sibling repo breaks the docs build instead of shipping a dead
embed:

1. Every route in the map must exist in the deployed app. Cheapest robust check: have the
   controls repo's deploy workflow emit a `routes.json` next to `index.html`, and fetch it
   at docs build time.
2. A doc page may only declare a demo if its `<PlatformSupport>` includes `blazor`.

   **Caveat:** `controls/theming/index.mdx` has no `<PlatformSupport>` block at all, and it is
   on the pilot list below. Either exempt it explicitly or treat "no PlatformSupport" as
   permissive — do not let the assert silently kill the one page where a live theme-pack
   switcher is the whole point.

Run `npm run build` after — MDX errors only surface at build time.

---

## Rollout

1. ~~Step 0 measurement.~~ **Done 2026-09-04** — see above.
2. Embed mode + postMessage in `shinyorg/controls`; confirm on the deployed URL. This is now
   the first real step, and the bigger half of the work: `?embed=1` has to drop the nav, the
   header, `SourceCodePanel` and `SplashScreenHost` while keeping the five service hosts, and
   `?theme=` / `?pack=` have to apply at first render.
3. `BlazorDemo.astro` + route map + validation here.
4. **Pilot on 5 pages** — `datagrid`, `button`, `treeview`, `theming`, `markdown`. Live with
   it for a bit.
5. Sweep the remaining 60 Blazor-capable control pages (65 demo-able, minus the 5 pilots).
6. Extend to Mediator, Shiny Core, and Speech playgrounds — the component already takes
   `lib`, so this is a base-URL lookup plus the same two sample-side changes.

Keep the existing screenshots. They are the poster frame, they are what search engines and
the LLM text endpoints (`llms.txt`, `llms-full.txt`) see, and they are the fallback when the
playground is down.

---

## Known risks

**Version skew.** Docs describe the latest Shiny *beta*; the playground deploys from `main`.
An embedded demo can lag the API documented on the same page. Mitigated by the caption, not
solved. If it becomes a real problem, that is the argument for vendoring (option B).

**Storage partitioning.** The sample persists dock layouts and nav state to `localStorage`
(`LocalStorageDockLayoutStore`, `PersistKey="sample-nav"`). In a cross-origin iframe that is
a separate storage partition from the standalone playground — it works, it just does not
share state. Option B removes this.

**Playground availability.** An embed is a hard dependency on `shinyorg.github.io` being up.
The poster-first design degrades gracefully: if the iframe never loads, the reader still has
the screenshot and the new-tab link.

**Permission prompts.** The camera, media-picker and speech demos will prompt inside the
iframe. Acceptable behind click-to-load; would be hostile on auto-load.

---

## Revision — 2026-09-04

Re-checked against `shinyorg/controls@v1` and this repo. The approach is unchanged and still
right. What moved:

**Answered**

- **Step 0 is done** — 8.95 MB / 105 requests cold. Click-to-load stays mandatory; drop the
  "consider auto-loading on IntersectionObserver" idea.
- **Cross-origin framing works** from the real docs origin to the real playground origin. No
  `X-Frame-Options`, no CSP, no `Permissions-Policy` in the way.
- **`/pickers` is not a stranded route** — it is a second `@page` on `ColorPickerPage.razor`.

**Corrections**

- **`targetOrigin` is `https://shinylib.net`, not `https://www.shinylib.net`.** The `www` host
  301s to the apex. The plan's contract would have failed silently in both directions — the
  single most expensive error in the document. (`astro.config.mjs` `site:` is stale in the same
  way; unrelated to this plan, but worth a separate fix.)
- The sample has grown from ~60 to **75 routes**; the docs from 59 to **75 control folders**.
- The MAUI-only exclusion list grew from 6 to **9** — `flyout`, `navigationpage` and
  `tabbedpage` all shipped MAUI-only since this was written.
- `file-drop` → `/filedrop` is a **new** explicit map entry (the control did not exist in
  August).
- Coverage is now **65 of 75** doc pages demo-able (47 by convention, 18 by explicit map).

**New concerns**

- **`MainLayout` gained `SourceCodePanel` and `SplashScreenHost`.** Embed mode must drop both,
  and must *keep* the five service hosts. Written up in §1 above. This is the single biggest
  change to the implementation work since the plan was written.
- **Theme has to be a query param, not only a message**, or every embed flashes light inside a
  dark docs page. `?pack=` for the theme packs is nearly free and is what would make a demo on
  `controls/theming` actually worth embedding.
- **The pilot list includes `theming`, which has no `<PlatformSupport>` block** — the §6
  validation assert would reject the page it most wants to show. Decide the exemption before
  writing the assert.
- **`routes.json` has a better source than a razor grep: `samples/Sample.Blazor/Catalog.cs`.**
  It is already the single source of truth behind both the nav and the gallery home page, and
  it carries a label and a one-line blurb per route that `BlazorDemo` could use for its caption
  and tab labels. It covers 74 of the 75 routes (only the `/pickers` alias is absent). Emit
  `routes.json` from it in the deploy workflow.

**Still unresolved (unchanged since August)**

- `speech-addins` is documented as `["maui", "blazor"]`, and `Sample.Blazor.csproj` still
  references `Shiny.Blazor.Controls.SpeechAddins`, but **there is still no `@page` for it** in
  the gallery. Add a gallery page in the controls repo, or leave that doc page demo-less.

**Found while re-checking, out of scope for this plan**

- **Discoverability, not coverage:** `SlideView` is fully documented, but only inside
  `controls/document-viewer/` — the page is titled *"Document & Slide Viewers"* and the sidebar
  label for it is just **"Viewers"**. Meanwhile `SlideEditor` has its own top-level
  `controls/slide-editor/` node. A reader looking for the PowerPoint *viewer* has no entry
  point carrying the word "Slide" or "PowerPoint", which is why the gallery's `/slide-viewer`
  route looks unmatched at first glance. Worth either relabelling that sidebar node or
  splitting the page — an editorial call, not a demo-embedding one.
