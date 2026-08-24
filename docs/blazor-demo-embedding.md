# Plan: live Blazor demos inside docs pages

**Status:** proposed, not started
**Written:** 2026-08-24

## Goal

Replace (or augment) the static screenshots on control doc pages with the real, running
Blazor control — so `/controls/datagrid/` shows a DataGrid you can sort, group and page,
not a PNG of one.

## Answer: yes, and mostly with what already exists

Three facts make this cheap:

1. `shinyorg/controls` → `samples/Sample.Blazor` is **one WASM app with ~60 routes**
   (`/datagrid`, `/button`, `/treeview`, …), already deployed to
   `https://shinyorg.github.io/controls/` by that repo's `deploy-blazor-sample.yml`.
2. One app means **one runtime download serves every embed on the whole site**, cached
   across doc pages — not a fresh multi-MB payload per control.
3. **35 of the 59 `src/content/docs/controls/*` folders already match a sample route by
   name.** The rest are either a rename or MAUI-only (see the map below).

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

## Step 0 — measure before committing

The whole plan hinges on one number nobody has: **what does the deployed playground
actually cost to load?**

Open `https://shinyorg.github.io/controls/` with devtools and record total transfer size
and time-to-interactive on a cold cache.

Two notes for whoever does this:

- A local `dotnet publish` of the sample currently **fails on this machine** — the
  emscripten toolchain is broken (`Microsoft.NET.Runtime.Emscripten.3.1.56.Sdk.osx-arm64`
  → `clang-19: No such file or directory`). Either fix the workload or take the number
  from the deployed site / CI.
- The deployed boot manifest is fingerprinted, so you can't sum it with `curl` —
  `_framework/dotnet.boot.js` 404s and the real name is only resolved at runtime.

If the cold load is heavy, the click-to-load gate below is doing real work and should stay
non-negotiable. If it's light, consider auto-loading on `IntersectionObserver` for the
first demo on a page.

---

## Work in `shinyorg/controls`

### 1. Embed mode in the sample

`samples/Sample.Blazor/Layout/MainLayout.razor` renders the full gallery shell — a 260px
`AppLayoutPanel` nav and a 64px branded `ShinyToolbar`. In an 800x500 iframe that is mostly
chrome.

Add an `?embed=1` query flag, read via the already-injected `NavigationManager`, that drops
the nav panel and the header and renders just the routed page. Same app, same deployment,
one conditional — no second build target.

Keep `ThemeSwitcher` reachable in embed mode (or drive it from the parent, below).

### 2. postMessage contract

Also in the sample, so it ships with the app rather than being bolted on from the docs side.
Both directions use an explicit `targetOrigin` — never `*`.

**child → parent** (`https://www.shinylib.net`):

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

**Intentionally no demo — MAUI-only** (confirmed via each page's
`<PlatformSupport frameworks={["maui"]} />`): `durationpicker`, `feedback`,
`floatingpanel`, `fontpicker`, `keyframe`, `trayicon`.

**Unresolved:** `speech-addins` is documented as `["maui", "blazor"]` and the sample
references `Shiny.Blazor.Controls.SpeechAddins`, but there is no `@page` route for it in the
gallery. Either add a gallery page in the controls repo or leave the doc page demo-less.

**Gallery routes with no doc folder** — candidates to attach to an existing page rather than
leave stranded: `/cells` (→ `tableview`?), `/fab-menu` (→ `fab`?), `/markdown-editor`
(→ `markdown`?), `/qrcode` (→ `barcodes`?), `/kitchensink` (→ `controls/index.mdx`).

### 6. Build-time validation

Two asserts, so drift in the sibling repo breaks the docs build instead of shipping a dead
embed:

1. Every route in the map must exist in the deployed app. Cheapest robust check: have the
   controls repo's deploy workflow emit a `routes.json` next to `index.html`, and fetch it
   at docs build time.
2. A doc page may only declare a demo if its `<PlatformSupport>` includes `blazor`.

Run `npm run build` after — MDX errors only surface at build time.

---

## Rollout

1. Step 0 measurement.
2. Embed mode + postMessage in `shinyorg/controls`; confirm on the deployed URL.
3. `BlazorDemo.astro` + route map + validation here.
4. **Pilot on 5 pages** — `datagrid`, `button`, `treeview`, `theming`, `markdown`. Live with
   it for a bit.
5. Sweep the remaining ~48 Blazor-capable control pages.
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
