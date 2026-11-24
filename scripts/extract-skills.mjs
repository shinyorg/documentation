#!/usr/bin/env node
/**
 * Generates src/data/skills.json from the sibling skills repo
 * (~/Desktop/dev/shinyorg/skills by default, or the path passed as the first
 * argument). Reads each plugins/shiny/skills/<name>/SKILL.md frontmatter:
 * name, description and triggers.
 *
 * The WebMCP catalog (`src/pages/webmcp/index.json.ts`) joins this with the
 * tables on /foundation/ai-skills/ for category and docs links.
 *
 *   node scripts/extract-skills.mjs [path-to-skills-repo]
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = process.argv[2] ?? join(homedir(), 'Desktop/dev/shinyorg/skills');
const skillsDir = join(repo, 'plugins/shiny/skills');
const out = join(here, '../src/data/skills.json');

if (!existsSync(skillsDir)) {
  console.error(`No skills folder at ${skillsDir}`);
  process.exit(1);
}

const unquote = (v) => v.trim().replace(/^(['"])(.*)\1$/, '$2');

function parseFrontmatter(text, folder) {
  // Tolerates a malformed `--` opener, but says so: agents may skip that skill.
  const match = /^(-{2,3})\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) {
    console.warn(`WARNING ${folder}/SKILL.md: no frontmatter, skipped`);
    return null;
  }
  if (match[1] !== '---') console.warn(`WARNING ${folder}/SKILL.md: frontmatter opens with '${match[1]}', not '---'`);
  const data = { triggers: [] };
  let inTriggers = false;
  for (const line of match[2].split(/\r?\n/)) {
    const list = /^\s+-\s+(.*)$/.exec(line);
    const field = /^([A-Za-z_]+):\s*(.*)$/.exec(line);
    if (list && inTriggers) data.triggers.push(unquote(list[1]));
    if (field) {
      inTriggers = field[1] === 'triggers';
      if (field[1] === 'name' || field[1] === 'description') data[field[1]] = unquote(field[2]);
    }
  }
  return data;
}

const skills = readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(skillsDir, d.name, 'SKILL.md')))
  .map((d) => ({ folder: d.name, fm: parseFrontmatter(readFileSync(join(skillsDir, d.name, 'SKILL.md'), 'utf8'), d.name) }))
  .filter((s) => s.fm?.name && s.fm?.description)
  .map((s) => ({ name: s.fm.name, folder: s.folder, description: s.fm.description, triggers: s.fm.triggers }))
  .sort((a, b) => a.name.localeCompare(b.name));

writeFileSync(out, JSON.stringify(skills, null, 2) + '\n');
console.log(`Wrote ${skills.length} skills to ${out}`);
