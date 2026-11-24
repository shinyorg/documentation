/**
 * WebMCP tools for shinylib.net: read-only tools an AI agent in the browser can
 * call to search these docs, read a page, and find the Shiny AI skills and
 * libraries. Loaded by `src/components/WebMcp.astro` only where the browser
 * exposes `document.modelContext` (today: Chrome / Edge with
 * `#enable-webmcp-testing`).
 *
 * Data: /webmcp/index.json (src/pages/webmcp/index.json.ts), fetched on the
 * first tool call, plus Starlight's Pagefind index for full-text search.
 *
 * Every tool returns JSON text: `{ ok: true, ... }` or
 * `{ ok: false, error: { code, message } }`. Lists take `limit` (default 5,
 * max 10) and `offset`, and report `hasMore` / `nextOffset`. Responses are
 * held under MAX_CHARS, dropping list items (and flagging `trimmed`) if needed.
 */

type Json = Record<string, unknown>;
type Schema = { type: string; description?: string; enum?: string[]; minimum?: number; maximum?: number };

interface Catalog {
  site: string;
  install: Json;
  skills: { name: string; description: string; category: string; library?: string; docs?: string; helpsWith?: string; skillUrl: string; rawUrl: string; keywords: string[] }[];
  libraries: { name: string; category: string; tagline: string; summary: string; docs: string; packages: string[] }[];
  pages: { path: string; title: string; description: string; section: string; date?: string; tags?: string[] }[];
}

interface ModelContext {
  registerTool(tool: Json, options?: { signal?: AbortSignal }): unknown;
  unregisterTool?(name: string): void;
}

const MAX_CHARS = 4000;
const PAGE_CHUNK = 3000;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 10;

class ToolError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

// ── Data loading (shared, retried after a failure) ──────────────────────────

let catalogPromise: Promise<Catalog> | undefined;
function loadCatalog(): Promise<Catalog> {
  catalogPromise ??= fetch('/webmcp/index.json')
    .then((r) => {
      if (!r.ok) throw new ToolError('catalog_unavailable', `Catalog request failed (${r.status})`);
      return r.json() as Promise<Catalog>;
    })
    .catch((e) => {
      catalogPromise = undefined;
      throw e;
    });
  return catalogPromise;
}

interface Pagefind {
  search(q: string): Promise<{ results: { data(): Promise<{ url: string; excerpt: string; meta: { title?: string }; sub_results?: { title: string; url: string }[] }> }[] }>;
}
let pagefindPromise: Promise<Pagefind | null> | undefined;
function loadPagefind(): Promise<Pagefind | null> {
  const url = '/pagefind/pagefind.js';
  pagefindPromise ??= import(/* @vite-ignore */ url).catch(() => {
    pagefindPromise = undefined;
    return null;
  });
  return pagefindPromise;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const stripTags = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const norm = (s: string) => s.toLowerCase();
const abs = (site: string, path: string) => (/^https?:/.test(path) ? path : new URL(path, site).toString());

/** Simple relevance: every query word must appear; title hits weigh more. */
function score(query: string, fields: { text: string; weight: number }[]) {
  const words = norm(query).split(/\s+/).filter(Boolean);
  const hay = fields.map((f) => ({ text: norm(f.text), weight: f.weight }));
  const matchesAll = words.every((w) => hay.some((h) => h.text.includes(w)));
  return matchesAll
    ? words.reduce((sum, w) => sum + hay.filter((h) => h.text.includes(w)).reduce((s, h) => s + h.weight, 0), 0)
    : 0;
}

function page<T>(items: T[], input: Json) {
  const limit = (input.limit as number | undefined) ?? DEFAULT_LIMIT;
  const offset = (input.offset as number | undefined) ?? 0;
  const slice = items.slice(offset, offset + limit);
  const hasMore = offset + limit < items.length;
  return { items: slice, total: items.length, hasMore, nextOffset: hasMore ? offset + limit : null };
}

/** Serialize, dropping trailing list items until the response fits. */
function fit(result: Json & { items?: unknown[] }) {
  let text = JSON.stringify(result);
  const items = result.items;
  if (text.length <= MAX_CHARS || !Array.isArray(items)) return text;
  const kept = [...items];
  while (kept.length > 1 && text.length > MAX_CHARS) {
    kept.pop();
    text = JSON.stringify({ ...result, items: kept, trimmed: true, hasMore: true });
  }
  return text;
}

function validate(input: Json, properties: Record<string, Schema>, required: string[]) {
  const unknown = Object.keys(input).filter((k) => !(k in properties));
  if (unknown.length) throw new ToolError('invalid_input', `Unknown input: ${unknown.join(', ')}`);
  const missing = required.filter((k) => input[k] === undefined || input[k] === '');
  if (missing.length) throw new ToolError('invalid_input', `Missing required input: ${missing.join(', ')}`);
  Object.entries(input).forEach(([key, value]) => {
    const schema = properties[key];
    const typeOk = schema.type === 'integer' ? Number.isInteger(value) : typeof value === schema.type;
    if (!typeOk) throw new ToolError('invalid_input', `'${key}' must be a ${schema.type}`);
    if (schema.enum && !schema.enum.includes(value as string))
      throw new ToolError('invalid_input', `'${key}' must be one of: ${schema.enum.join(', ')}`);
    if (schema.minimum !== undefined && (value as number) < schema.minimum)
      throw new ToolError('invalid_input', `'${key}' must be at least ${schema.minimum}`);
    if (schema.maximum !== undefined && (value as number) > schema.maximum)
      throw new ToolError('invalid_input', `'${key}' must be at most ${schema.maximum}`);
  });
}

const limitProps: Record<string, Schema> = {
  limit: { type: 'integer', minimum: 1, maximum: MAX_LIMIT, description: `How many results (default ${DEFAULT_LIMIT}, max ${MAX_LIMIT}).` },
  offset: { type: 'integer', minimum: 0, description: 'Pass back nextOffset from a previous call, with the same other inputs.' },
};

// ── Tools ───────────────────────────────────────────────────────────────────

interface ToolDef {
  name: string;
  description: string;
  properties: Record<string, Schema>;
  required: string[];
  run(input: Json): Promise<Json>;
}

async function searchDocs(input: Json): Promise<Json> {
  const query = (input.query as string).trim();
  const section = input.section as string | undefined;
  const catalog = await loadCatalog();
  const known = new Map(catalog.pages.map((p) => [p.path, p]));
  const inSection = (path: string) => !section || known.get(path)?.section === section;

  const pagefind = await loadPagefind();
  if (pagefind) {
    const offset = (input.offset as number | undefined) ?? 0;
    const limit = (input.limit as number | undefined) ?? DEFAULT_LIMIT;
    const { results } = await pagefind.search(query);
    const matches: Json[] = [];
    // Read one past the page so hasMore is known; skip anything not in the public catalog.
    let i = 0;
    while (i < results.length && matches.length < offset + limit + 1) {
      const data = await results[i].data();
      const path = new URL(data.url, location.origin).pathname;
      if (known.has(path) && inSection(path))
        matches.push({
          title: data.meta.title ?? known.get(path)!.title,
          url: abs(catalog.site, path),
          section: known.get(path)!.section,
          excerpt: stripTags(data.excerpt),
          headings: (data.sub_results ?? []).slice(0, 3).map((s) => ({ title: s.title, url: abs(catalog.site, s.url) })),
        });
      i++;
    }
    const items = matches.slice(offset, offset + limit);
    const hasMore = matches.length > offset + limit;
    return { engine: 'pagefind', query, items, hasMore, nextOffset: hasMore ? offset + limit : null };
  }

  // No Pagefind (dev server): title / description matching over the catalog.
  const ranked = catalog.pages
    .filter((p) => inSection(p.path))
    .map((p) => ({ p, s: score(query, [{ text: p.title, weight: 3 }, { text: p.description, weight: 1 }, { text: p.path, weight: 1 }]) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map(({ p }) => ({ title: p.title, url: abs(catalog.site, p.path), section: p.section, description: p.description }));
  return { engine: 'catalog', query, ...page(ranked, input) };
}

async function readPage(input: Json): Promise<Json> {
  const catalog = await loadCatalog();
  const raw = (input.path as string).trim();
  const url = new URL(raw, location.origin);
  if (url.origin !== location.origin) throw new ToolError('invalid_input', `Only ${location.origin} pages can be read`);
  const path = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  const entry = catalog.pages.find((p) => p.path === path);
  if (!entry) throw new ToolError('not_found', `No published page at ${path}. Use search-docs to find one.`);

  const html = await fetch(path).then((r) => {
    if (!r.ok) throw new ToolError('fetch_failed', `Page request failed (${r.status})`);
    return r.text();
  });
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const main = doc.querySelector('.sl-markdown-content') ?? doc.querySelector('main');
  main?.querySelectorAll('script, style, .expressive-code .copy, .sl-anchor-link, [aria-hidden="true"]').forEach((n) => n.remove());
  // Mark headings and code so the text keeps its shape.
  main?.querySelectorAll('h2, h3, h4').forEach((h) => (h.textContent = `\n${'#'.repeat(Number(h.tagName[1]))} ${h.textContent?.trim()}\n`));
  main?.querySelectorAll('pre').forEach((pre) => (pre.textContent = `\n\`\`\`\n${pre.innerText ?? pre.textContent}\n\`\`\`\n`));
  const text = (main?.textContent ?? '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  const offset = (input.offset as number | undefined) ?? 0;
  const chunk = text.slice(offset, offset + PAGE_CHUNK);
  const hasMore = offset + PAGE_CHUNK < text.length;
  return {
    title: entry.title,
    url: abs(catalog.site, path),
    description: entry.description,
    content: chunk,
    length: text.length,
    hasMore,
    nextOffset: hasMore ? offset + PAGE_CHUNK : null,
  };
}

async function currentPage(): Promise<Json> {
  const catalog = await loadCatalog();
  const path = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
  const entry = catalog.pages.find((p) => p.path === path);
  const headings = Array.from(document.querySelectorAll('.sl-markdown-content :is(h2, h3)[id]'))
    .slice(0, 25)
    .map((h) => ({ level: Number(h.tagName[1]), title: h.textContent?.trim(), url: abs(catalog.site, `${path}#${h.id}`) }));
  const related = entry
    ? catalog.pages.filter((p) => p.section === entry.section && p.path !== path && p.section !== 'blog').slice(0, 8).map((p) => ({ title: p.title, url: abs(catalog.site, p.path) }))
    : [];
  return {
    title: entry?.title ?? document.title,
    url: abs(catalog.site, path),
    description: entry?.description ?? '',
    section: entry?.section ?? null,
    ...(entry?.date ? { date: entry.date } : {}),
    headings,
    related,
    hint: 'Use read-page with this url to get the page text.',
  };
}

async function listSkills(input: Json): Promise<Json> {
  const catalog = await loadCatalog();
  const query = (input.query as string | undefined)?.trim();
  const category = input.category as string | undefined;
  const filtered = catalog.skills
    .filter((s) => !category || norm(s.category) === norm(category))
    .map((s) => ({
      s,
      score: query
        ? score(query, [
            { text: s.name, weight: 4 },
            { text: s.library ?? '', weight: 3 },
            { text: s.keywords.join(' '), weight: 2 },
            { text: s.description, weight: 1 },
          ])
        : 1,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ s }) => ({
      name: s.name,
      category: s.category,
      library: s.library ?? null,
      summary: s.helpsWith ?? s.description.slice(0, 160),
      docs: s.docs ? abs(catalog.site, s.docs) : null,
    }));
  return { ...page(filtered, input), install: catalog.install, hint: 'Use get-skill for a skill\'s full description and SKILL.md link.' };
}

async function getSkill(input: Json): Promise<Json> {
  const catalog = await loadCatalog();
  const name = norm((input.name as string).trim());
  const skill = catalog.skills.find((s) => s.name === name || s.name === `shiny-${name}`);
  if (!skill) throw new ToolError('not_found', `No skill named '${input.name}'. Use list-skills to see them.`);
  return {
    ...skill,
    docs: skill.docs ? abs(catalog.site, skill.docs) : null,
    install: catalog.install,
  };
}

async function listLibraries(input: Json): Promise<Json> {
  const catalog = await loadCatalog();
  const query = (input.query as string | undefined)?.trim();
  const category = input.category as string | undefined;
  const filtered = catalog.libraries
    .filter((l) => !category || norm(l.category) === norm(category))
    .map((l) => ({
      l,
      score: query
        ? score(query, [
            { text: l.name, weight: 4 },
            { text: l.packages.join(' '), weight: 3 },
            { text: l.tagline, weight: 2 },
            { text: l.summary, weight: 1 },
          ])
        : 1,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ l }) => ({ ...l, docs: abs(catalog.site, l.docs) }));
  return page(filtered, input);
}

const TOOLS: ToolDef[] = [
  {
    name: 'search-docs',
    description: 'Full-text search of the Shiny.NET documentation (shinylib.net): .NET libraries for MAUI, Blazor, ASP.NET Core and devices. Returns ranked pages with excerpts and matching headings.',
    properties: {
      query: { type: 'string', description: 'Words to search for, e.g. "background gps" or "IJob".' },
      section: { type: 'string', description: 'Limit to a top-level section, e.g. "client", "controls", "documentdb", "mediator", "blog".' },
      ...limitProps,
    },
    required: ['query'],
    run: searchDocs,
  },
  {
    name: 'read-page',
    description: 'Read the text of a shinylib.net documentation page (headings and code blocks kept), in chunks of about 3000 characters.',
    properties: {
      path: { type: 'string', description: 'Page path or full URL on this site, e.g. "/client/jobs/".' },
      offset: { type: 'integer', minimum: 0, description: 'Character offset; pass back nextOffset to keep reading.' },
    },
    required: ['path'],
    run: readPage,
  },
  {
    name: 'get-current-page',
    description: 'Title, description, headings and related pages for the documentation page open in this tab.',
    properties: {},
    required: [],
    run: currentPage,
  },
  {
    name: 'list-skills',
    description: 'List the Shiny AI coding-assistant skills (for Claude Code and GitHub Copilot), optionally filtered by text or category, with the commands to install them.',
    properties: {
      query: { type: 'string', description: 'Filter by name, library or keyword, e.g. "bluetooth" or "Mediator".' },
      category: { type: 'string', description: 'Exact category, e.g. "Client", "Controls", "Data", "ASP.NET", "Extensions".' },
      ...limitProps,
    },
    required: [],
    run: listSkills,
  },
  {
    name: 'get-skill',
    description: 'Details of one Shiny AI skill: full description, trigger keywords, docs link, SKILL.md links (GitHub and raw) and install commands.',
    properties: {
      name: { type: 'string', description: 'Skill name, e.g. "shiny-bluetoothle" (the "shiny-" prefix is optional).' },
    },
    required: ['name'],
    run: getSkill,
  },
  {
    name: 'list-libraries',
    description: 'List the Shiny.NET libraries with a tagline, summary, docs link and NuGet package ids, optionally filtered by text or category.',
    properties: {
      query: { type: 'string', description: 'Filter by name, NuGet package or description, e.g. "push" or "Shiny.Jobs".' },
      category: { type: 'string', description: 'Exact category label as it appears on the homepage library explorer.' },
      ...limitProps,
    },
    required: [],
    run: listLibraries,
  },
];

// ── Registration ────────────────────────────────────────────────────────────

export async function registerWebMCPTools(api: ModelContext) {
  const controller = new AbortController();
  const registered: string[] = [];
  try {
    for (const def of TOOLS) {
      await api.registerTool(
        {
          name: def.name,
          description: def.description,
          inputSchema: { type: 'object', properties: def.properties, required: def.required, additionalProperties: false },
          annotations: { readOnlyHint: true },
          execute: async (input: Json = {}) => {
            try {
              validate(input ?? {}, def.properties, def.required);
              return fit({ ok: true, ...(await def.run(input ?? {})) });
            } catch (e) {
              const err = e instanceof ToolError ? e : new ToolError('internal_error', e instanceof Error ? e.message : String(e));
              return JSON.stringify({ ok: false, error: { code: err.code, message: err.message } });
            }
          },
        },
        { signal: controller.signal }
      );
      registered.push(def.name);
    }
  } catch (e) {
    // Partial registration helps nobody: take back what was registered.
    controller.abort();
    registered.forEach((name) => {
      try {
        api.unregisterTool?.(name);
      } catch {
        /* already gone */
      }
    });
    console.warn('[webmcp] tool registration failed', e);
  }
}
