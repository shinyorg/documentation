import { sidebarLabelTranslations } from './sidebarLabels.mjs';

/**
 * The label of a `sidebarTopics` node (or any English sidebar label) in `lang`, for components
 * that read `src/sidebar-topics.mjs` directly instead of going through Starlight's sidebar.
 * Falls back to the English label when there is no translation.
 */
export function localizedLabel(item: string | { label: string }, lang: string | undefined): string {
  const label = typeof item === 'string' ? item : item.label;
  if (!lang) return label;
  return (sidebarLabelTranslations as Record<string, Record<string, string>>)[lang]?.[label] ?? label;
}
