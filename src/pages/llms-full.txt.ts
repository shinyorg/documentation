import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://www.shinylib.net';
const PROJECT_NAME = 'Shiny.NET';

const EXCLUDE_PATTERNS = [/^blog\//, /^404$/];

// Strip MDX-only constructs (imports, JSX components) so the output is
// plain markdown that's friendly to LLM consumption.
const stripMdx = (body: string): string => {
  let s = body;
  // Drop import statements at the top of the file.
  s = s.replace(/^\s*import\s+[^;]+;?\s*$/gm, '');
  // Drop export statements.
  s = s.replace(/^\s*export\s+[^;]+;?\s*$/gm, '');
  // Drop self-closing JSX tags: <Tag ... />
  s = s.replace(/<[A-Z][A-Za-z0-9]*\b[^>]*\/>/g, '');
  // Drop opening + closing JSX component tags but keep inner text:
  // <Tag ...>inner</Tag>  →  inner
  s = s.replace(
    /<([A-Z][A-Za-z0-9]*)\b[^>]*>([\s\S]*?)<\/\1>/g,
    (_m, _tag, inner) => inner
  );
  // Collapse runs of 3+ blank lines.
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim();
};

const slugToUrl = (id: string): string => {
  const trimmed = id.replace(/\/index$/, '').replace(/^index$/, '');
  return trimmed ? `${SITE}/${trimmed}/` : `${SITE}/`;
};

export const GET: APIRoute = async () => {
  const entries = await getCollection('docs', (entry) => {
    return !EXCLUDE_PATTERNS.some((p) => p.test(entry.id));
  });

  entries.sort((a, b) => a.id.localeCompare(b.id));

  const parts: string[] = [];
  parts.push(`# ${PROJECT_NAME} — Full Documentation`);
  parts.push('');
  parts.push(
    'Concatenated markdown for every documentation page. Each section starts with the page title and source URL.'
  );
  parts.push('');

  for (const entry of entries) {
    const title = entry.data.title || entry.id;
    const url = slugToUrl(entry.id);
    parts.push('---');
    parts.push('');
    parts.push(`# ${title}`);
    parts.push('');
    parts.push(`Source: ${url}`);
    if (entry.data.description) {
      parts.push('');
      parts.push(`> ${entry.data.description}`);
    }
    parts.push('');
    parts.push(stripMdx(entry.body || ''));
    parts.push('');
  }

  return new Response(parts.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
