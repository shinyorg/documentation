/**
 * ShinySoft's own desktop apps, each linking out to its product website.
 * Used by the header "Apps" menu (`ThemeSelect.astro`), the mobile finder
 * (`HomepageNav.astro`) and the homepage section (`ShinyApps.astro`).
 * The longer write-ups live on /foundation/apps/ and in the
 * "Three Desktop Apps, One Stack" blog post.
 */
export interface ShinyApp {
  name: string;
  logo: string;
  tagline: string;
  description: string;
  website: string;
}

export const shinyApps: ShinyApp[] = [
  {
    name: 'Commander',
    logo: '/images/apps/shinycommander.png',
    tagline: 'A keyboard-first, dual-pane file manager',
    description:
      'Two panes, every action on the keyboard, and the same app on macOS, Windows and Linux.',
    website: 'https://shinysoftware.github.io/Commander/',
  },
  {
    name: 'Notcho',
    logo: '/images/apps/notcho.png',
    tagline: 'The MacBook camera notch, turned into a live panel',
    description:
      'Now Playing, weather, a file tray, calendar, timers, a camera mirror and more, tucked into the notch.',
    website: 'https://shinysoftware.github.io/Notcho/',
  },
  {
    name: 'FileServe',
    logo: '/images/apps/shinyfileserve.png',
    tagline: 'A self-hosted file server for a team',
    description:
      'Runs from the system tray and serves a browser portal, with groups, quotas, an audit log and private NuGet and npm feeds.',
    website: 'https://shinysoftware.github.io/ShinyFileServe/',
  },
];
