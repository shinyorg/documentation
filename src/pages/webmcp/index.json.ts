/**
 * /webmcp/index.json — the public catalog the WebMCP tools read
 * (`src/scripts/webmcp.ts`). Built once per deploy; browsers fetch it only on
 * the first tool call, and only where `document.modelContext` exists.
 *
 * - pages:     every published doc page and blog post (embargoed posts are
 *              already gone from the collection in production builds)
 * - skills:    src/data/skills.json (generated from shinyorg/skills by
 *              scripts/extract-skills.mjs), joined with the tables on
 *              /foundation/ai-skills/ for category, library and docs link
 * - libraries: src/data/libraryCatalog.ts
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getCatalog } from '../../data/libraryCatalog';
import skills from '../../data/skills.json';
import aiSkillsPage from '../../content/docs/foundation/ai-skills.mdx?raw';

const SKILLS_REPO = 'https://github.com/shinyorg/skills';

const plain = (text = '', max = 300) => {
  const t = text
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
};

const pathFor = (id: string) => {
  const trimmed = id.replace(/\/index$/, '').replace(/^index$/, '');
  return trimmed ? `/${trimmed}/` : '/';
};

/** Rows of the "### Category" tables on the AI Skills page, keyed by skill name. */
function skillRows() {
  const rows = new Map<string, { category: string; library: string; docs: string; helpsWith: string }>();
  let category = '';
  for (const line of aiSkillsPage.split(/\r?\n/)) {
    const heading = /^###\s+(.+)$/.exec(line);
    const row = /^\|\s*\[([^\]]+)\]\([^)]*\)\s*\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|\s*(.+?)\s*\|\s*$/.exec(line);
    if (heading) category = heading[1].trim();
    if (row) rows.set(row[1], { category, library: row[2], docs: row[3], helpsWith: row[4] });
  }
  return rows;
}

export const GET: APIRoute = async () => {
  const entries = await getCollection('docs', (e) => e.id !== '404' && !e.data.draft);

  const pages = entries
    .map((e) => {
      const date = e.data.date instanceof Date ? e.data.date.toISOString().slice(0, 10) : undefined;
      return {
        path: pathFor(e.id),
        title: e.data.title,
        description: plain(e.data.description),
        section: e.id.includes('/') ? e.id.split('/')[0] : 'home',
        ...(date ? { date } : {}),
        ...(e.data.tags?.length ? { tags: e.data.tags.map((t: string | { label: string }) => (typeof t === 'string' ? t : t.label)) } : {}),
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));

  const rows = skillRows();
  const skillList = skills.map((s) => {
    const row = rows.get(s.name);
    return {
      name: s.name,
      description: plain(s.description, 600),
      category: row?.category ?? 'Other',
      ...(row ? { library: row.library, docs: row.docs, helpsWith: plain(row.helpsWith) } : {}),
      skillUrl: `${SKILLS_REPO}/blob/main/plugins/shiny/skills/${s.folder}/SKILL.md`,
      rawUrl: `https://raw.githubusercontent.com/shinyorg/skills/main/plugins/shiny/skills/${s.folder}/SKILL.md`,
      keywords: s.triggers.slice(0, 20),
    };
  });

  const libraries = getCatalog().flatMap((c) =>
    c.libraries.map((l) => ({
      name: l.label,
      category: c.label,
      tagline: plain(l.tagline),
      summary: plain(l.summary, 500),
      docs: l.href,
      packages: l.packages,
    }))
  );

  const catalog = {
    site: 'https://www.shinylib.net',
    generated: new Date().toISOString(),
    install: {
      note: 'One plugin installs every Shiny skill; the agent loads only the skill relevant to the task.',
      claudeCode: ['claude plugin marketplace add shinyorg/skills', 'claude plugin install shiny@shiny'],
      githubCopilot: ['copilot plugin marketplace add https://github.com/shinyorg/skills', 'copilot plugin install shiny@shiny'],
      docs: '/foundation/ai-skills/',
    },
    skills: skillList,
    libraries,
    pages,
  };

  return new Response(JSON.stringify(catalog), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
