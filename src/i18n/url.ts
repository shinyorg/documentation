/**
 * Prefix a site-absolute path with the current locale, e.g. `/client/core/` → `/fr/client/core/`.
 * `locale` is Starlight's route locale (`Astro.locals.starlightRoute.locale`), which is
 * `undefined` for English at the root — so English links come back unchanged.
 * External URLs, anchors and relative paths are returned as-is.
 */
export function localeHref(path: string, locale: string | undefined): string {
  if (!locale || !path.startsWith('/') || path.startsWith('//')) return path;
  if (path === `/${locale}` || path.startsWith(`/${locale}/`)) return path;
  return `/${locale}${path}`;
}
