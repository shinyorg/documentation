/**
 * Site locales — the single place a language is switched on.
 *
 * English lives at the root (`/`), so no English URL or redirect changes when another
 * language is added. To add one (see I18N_PLAN.md), add an entry here, e.g.
 *   fr: { label: 'Français', lang: 'fr' },
 * then add `src/content/i18n/fr.json` (UI strings) and `i18n/sidebar.fr.json` (sidebar labels).
 * Starlight shows its language picker automatically once there is more than one locale.
 */
export const defaultLang = 'en';

export const locales = {
  root: { label: 'English', lang: defaultLang },
};

/** BCP-47 tags of every non-default language, e.g. `['fr']`. */
export const extraLangs = Object.entries(locales)
  .filter(([key]) => key !== 'root')
  .map(([, locale]) => locale.lang);
