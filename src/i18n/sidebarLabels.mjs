import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { extraLangs } from './locales.mjs';

/**
 * Sidebar label dictionaries, `{ [lang]: { [englishLabel]: translatedLabel } }`, read from
 * `i18n/sidebar.<lang>.json` at the repo root for every non-default language. A language
 * without a file yet gets an empty dictionary, so every label falls back to English.
 *
 * Read from disk (not imported) so it works both in `astro.config.mjs` and in components
 * rendered at build time — builds always run from the repo root.
 */
export const sidebarLabelTranslations = Object.fromEntries(
  extraLangs.map((lang) => {
    const file = join(process.cwd(), 'i18n', `sidebar.${lang}.json`);
    return [lang, existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}];
  }),
);
