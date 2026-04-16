import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://www.shinylib.net';
const PROJECT_NAME = 'Shiny.NET';
const DESCRIPTION =
  'A suite of powerful .NET libraries for mobile, desktop, and server applications. Includes Shiny Client (mobile/desktop services), Shiny Mediator, MAUI Services & Controls, Document DB, Spatial, Aspire integrations, and more.';

const EXCLUDE_PATTERNS = [/^blog\//, /^404$/];

interface Group {
  label: string;
  test: (id: string) => boolean;
}

const GROUPS: Group[] = [
  { label: 'Getting Started', test: (id) => id === '' || id === 'index' },
  { label: 'App Builder', test: (id) => id.startsWith('appbuilder') },
  { label: 'AI Skills', test: (id) => id.startsWith('ai-skills') },
  { label: 'Client', test: (id) => id.startsWith('client/') },
  { label: 'Mediator', test: (id) => id.startsWith('mediator/') || id === 'mediator' },
  { label: 'MAUI', test: (id) => id.startsWith('maui/') },
  { label: 'Data', test: (id) => id.startsWith('data/') },
  { label: 'Extensions', test: (id) => id.startsWith('extensions/') },
  { label: 'Aspire', test: (id) => id.startsWith('aspire/') },
];

const slugToUrl = (id: string): string => {
  const trimmed = id.replace(/\/index$/, '').replace(/^index$/, '');
  return trimmed ? `${SITE}/${trimmed}/` : `${SITE}/`;
};

const titleFor = (entry: { data: { title?: string }; id: string }): string => {
  if (entry.data.title) return entry.data.title;
  const last = entry.id.split('/').pop() || entry.id;
  return last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export const GET: APIRoute = async () => {
  const entries = await getCollection('docs', (entry) => {
    return !EXCLUDE_PATTERNS.some((p) => p.test(entry.id));
  });

  entries.sort((a, b) => a.id.localeCompare(b.id));

  const lines: string[] = [];
  lines.push(`# ${PROJECT_NAME}`);
  lines.push('');
  lines.push(`> ${DESCRIPTION}`);
  lines.push('');
  lines.push(
    'This file lists the available documentation pages so language models can quickly discover and fetch the canonical sources.'
  );
  lines.push('');

  for (const group of GROUPS) {
    const matches = entries.filter((e) => group.test(e.id));
    if (matches.length === 0) continue;
    lines.push(`## ${group.label}`);
    lines.push('');
    for (const entry of matches) {
      const url = slugToUrl(entry.id);
      const title = titleFor(entry);
      const desc = entry.data.description ? `: ${entry.data.description}` : '';
      lines.push(`- [${title}](${url})${desc}`);
    }
    lines.push('');
  }

  const grouped = new Set(
    entries.filter((e) => GROUPS.some((g) => g.test(e.id))).map((e) => e.id)
  );
  const ungrouped = entries.filter((e) => !grouped.has(e.id));
  if (ungrouped.length > 0) {
    lines.push('## Other');
    lines.push('');
    for (const entry of ungrouped) {
      const url = slugToUrl(entry.id);
      const title = titleFor(entry);
      const desc = entry.data.description ? `: ${entry.data.description}` : '';
      lines.push(`- [${title}](${url})${desc}`);
    }
    lines.push('');
  }

  lines.push('## Optional');
  lines.push('');
  lines.push(`- [Full documentation (concatenated markdown)](${SITE}/llms-full.txt)`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
