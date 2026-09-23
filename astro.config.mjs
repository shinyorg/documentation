import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import starlightBlog from 'starlight-blog';
import mdx from '@astrojs/mdx';
import expressiveCode from "astro-expressive-code";
import starlightSidebarTopics from 'starlight-sidebar-topics';
import { sidebarTopics, sidebarTopicsOptions, cleanTopicsForStarlight } from './src/sidebar-topics.mjs';

const googleAnalyticsId = 'G-SZKGGX6M5W';

// Giscus comments widget config (https://giscus.app).
// Replace REPLACE_WITH_* values after installing the giscus GitHub App and
// enabling Discussions on the repo — see README "Comments (giscus)" for steps.
const giscusConfig = {
  repo: 'shinyorg/documentation',
  repoId: 'R_kgDOJc3znQ',
  category: 'Announcements',
  categoryId: 'DIC_kwDOJc3znc4C-soD',
  mapping: 'pathname',
  reactionsEnabled: '1',
  inputPosition: 'bottom',
  lang: 'en',
};

// The announcement bar under the header. Rendered by `src/components/Banner.astro`,
// which reads this through Vite's `define` below.
//
// Each entry is `{ id, title, description, href, cta? }`:
//   id          stable slug; it is what a visitor's "dismiss" is remembered
//               against, so changing it makes the announcement reappear for
//               everyone — do that when you rewrite one substantially.
//   title       short and fixed: it never scrolls and never shrinks.
//   description any length — too long to fit and the bar scrolls it marquee-style
//               rather than wrapping, so the bar's height never changes.
//   cta         optional link text before the arrow (hidden on narrow screens).
//
// An empty array hides the bar; a single entry shows it without rotation or dots.
const announcementConfig = {
  // How long a non-scrolling announcement stays up before the next one.
  rotateMs: 6000,
  items: [
    {
      id: 'appdevicebridge-10',
      title: 'App Device Bridge',
      description: 'Release updates without the AppStore on .NET!',
      href: '/appdevicebridge/',
      cta: 'WHAT??!',
    },
    {
      id: 'controls-15',
      title: 'Shiny Controls 1.5',
      description: 'Diagrams, Floor Plans, Kanban, & GamePads!',
      href: '/controls/',
      cta: 'What!?!',
    },
    {
      id: 'docdb-v14',
      title: 'Document DB 14',
      description: 'Joins & Easy Doc Metadata!',
      href: '/documentdb/',
      cta: 'Join Me Too!',
    },
    {
      id: 'client-v580',
      title: 'Shiny Client 5.8',
      description: 'GamePads & Watch Libraries!',
      href: '/client/ble',
      cta: 'Live It Up!',
    },
    {
      id: 'mauishell-7',
      title: 'Shiny MAUI Shell v7',
      description: 'App Links, App Shortcuts, & Navigation Interception!',
      href: '/mauishell/',
      cta: 'Shortcut me to it',
    },
  ],
};


export default defineConfig({
  site: 'https://www.shinylib.net',
  output: 'static',
  vite: {
    define: {
      // Exposed to components as `import.meta.env.GISCUS` at build time.
      'import.meta.env.GISCUS': JSON.stringify(giscusConfig),
      // Same deal for the announcement bar — `src/components/Banner.astro`.
      'import.meta.env.ANNOUNCEMENTS': JSON.stringify(announcementConfig),
    },
  },
  redirects: {
      // Monorepo modules → /client (one shared release notes page)
      '/beacons/': '/client/beacons/',
      '/beacons/broadcasting': '/client/beacons/broadcasting',
      '/beacons/distance': '/client/beacons/distance',
      '/beacons/eddystone': '/client/beacons/eddystone',
      '/beacons/monitoring': '/client/beacons/monitoring',
      '/beacons/ranging': '/client/beacons/ranging',
      '/beacons/release-notes': '/client/release-notes',
      '/ble/': '/client/ble/',
      '/ble/background': '/client/ble/background',
      '/ble/best-practices': '/client/ble/best-practices',
      '/ble/gatt': '/client/ble/gatt',
      '/ble/l2cap': '/client/ble/l2cap',
      '/ble/manager': '/client/ble/manager',
      '/ble/peripheral': '/client/ble/peripheral',
      '/ble/release-notes': '/client/release-notes',
      '/blehosting/': '/client/blehosting/',
      '/blehosting/gatt': '/client/blehosting/gatt',
      '/blehosting/l2cap': '/client/blehosting/l2cap',
      '/blehosting/release-notes': '/client/release-notes',
      '/blehosting/source-generator': '/client/blehosting/source-generator',
      '/calendarstore/': '/client/calendarstore/',
      '/calendarstore/ai-tools': '/client/calendarstore/ai-tools',
      '/calendarstore/permissions': '/client/calendarstore/permissions',
      '/calendarstore/querying': '/client/calendarstore/querying',
      '/calendarstore/release-notes': '/client/release-notes',
      '/configuration/': '/client/configuration/',
      '/configuration/json': '/client/configuration/json',
      '/configuration/preferences': '/client/configuration/preferences',
      '/configuration/release-notes': '/client/release-notes',
      '/configuration/remote': '/client/configuration/remote',
      '/contactstore/': '/client/contactstore/',
      '/contactstore/ai-tools': '/client/contactstore/ai-tools',
      '/contactstore/permissions': '/client/contactstore/permissions',
      '/contactstore/querying': '/client/contactstore/querying',
      '/contactstore/release-notes': '/client/release-notes',
      '/core/': '/client/core/',
      '/core/android-foreground': '/client/core/android-foreground',
      '/core/device-monitoring': '/client/core/device-monitoring',
      '/core/lifecycle': '/client/core/lifecycle',
      '/core/permissions': '/client/core/permissions',
      '/core/platform': '/client/core/platform',
      '/core/release-notes': '/client/release-notes',
      '/core/startup': '/client/core/startup',
      '/core/utilities': '/client/core/utilities',
      '/datasync/': '/client/datasync/',
      '/datasync/architecture': '/client/datasync/architecture',
      '/datasync/conflict-resolution': '/client/datasync/conflict-resolution',
      '/datasync/custom-transports': '/client/datasync/custom-transports',
      '/datasync/entity-registration': '/client/datasync/entity-registration',
      '/datasync/platform-behavior': '/client/datasync/platform-behavior',
      '/datasync/release-notes': '/client/release-notes',
      '/datasync/removal-strategies': '/client/datasync/removal-strategies',
      '/datasync/server-contracts': '/client/datasync/server-contracts',
      '/datasync/sync-interceptor': '/client/datasync/sync-interceptor',
      '/discovery/': '/client/discovery/',
      '/discovery/browsing': '/client/discovery/browsing',
      '/discovery/platform': '/client/discovery/platform',
      '/discovery/publishing': '/client/discovery/publishing',
      '/discovery/release-notes': '/client/release-notes',
      '/discovery/ssdp': '/client/discovery/ssdp',
      '/discovery/wsdiscovery': '/client/discovery/wsdiscovery',
      '/httptransfers/': '/client/httptransfers/',
      '/httptransfers/architecture': '/client/httptransfers/architecture',
      '/httptransfers/aws-s3': '/client/httptransfers/aws-s3',
      '/httptransfers/azure': '/client/httptransfers/azure',
      '/httptransfers/delegate': '/client/httptransfers/delegate',
      '/httptransfers/monitoring': '/client/httptransfers/monitoring',
      '/httptransfers/progress': '/client/httptransfers/progress',
      '/httptransfers/release-notes': '/client/release-notes',
      '/httptransfers/transfers': '/client/httptransfers/transfers',
      '/jobs/': '/client/jobs/',
      '/jobs/architecture': '/client/jobs/architecture',
      '/jobs/create': '/client/jobs/create',
      '/jobs/faq': '/client/jobs/faq',
      '/jobs/managing': '/client/jobs/managing',
      '/jobs/release-notes': '/client/release-notes',
      '/liveactivities/': '/client/liveactivities/',
      '/liveactivities/push': '/client/liveactivities/push',
      '/liveactivities/release-notes': '/client/release-notes',
      '/liveactivities/widget': '/client/liveactivities/widget',
      '/locations/ai-tools': '/client/locations/ai-tools',
      '/locations/architecture': '/client/locations/architecture',
      '/locations/geofencing': '/client/locations/geofencing',
      '/locations/gps': '/client/locations/gps',
      '/locations/motionactivity': '/client/locations/motionactivity',
      '/locations/platform-requests': '/client/locations/platform-requests',
      '/locations/release-notes': '/client/release-notes',
      '/notifications/': '/client/notifications/',
      '/notifications/ai-tools': '/client/notifications/ai-tools',
      '/notifications/channels': '/client/notifications/channels',
      '/notifications/platform': '/client/notifications/platform',
      '/notifications/release-notes': '/client/release-notes',
      '/notifications/scheduling': '/client/notifications/scheduling',
      '/notifications/sending': '/client/notifications/sending',
      '/push/': '/client/push/',
      '/push/architecture': '/client/push/architecture',
      '/push/azure': '/client/push/azure',
      '/push/faq': '/client/push/faq',
      '/push/firebase-ios': '/client/push/firebase-ios',
      '/push/native': '/client/push/native',
      '/push/platform': '/client/push/platform',
      '/push/release-notes': '/client/release-notes',
      '/screenrecorder/': '/client/screenrecorder/',
      '/screenrecorder/platform': '/client/screenrecorder/platform',
      '/screenrecorder/release-notes': '/client/release-notes',
      '/wifi/': '/client/wifi/',
      '/wifi/hotspot': '/client/wifi/hotspot',
      '/wifi/known-networks': '/client/wifi/known-networks',
      '/wifi/networks': '/client/wifi/networks',
      '/wifi/platform': '/client/wifi/platform',
      '/wifi/release-notes': '/client/release-notes',

      // Blog post redirects (flat → date-based)
      '/blog/v3/': '/blog/2023/09/v3/',
      '/blog/v32/': '/blog/2023/12/v32/',
      '/blog/april2024/': '/blog/2024/04/april2024/',
      '/blog/mediator1/': '/blog/2024/06/mediator1/',
      '/blog/mediator2/': '/blog/2024/09/mediator2/',
      '/blog/julyreleases2025/': '/blog/2025/07/julyreleases2025/',
      '/blog/shinymediator-gettingstarted/': '/blog/2026/01/shinymediator-gettingstarted/',
      '/blog/shinymediator-aot/': '/blog/2026/02/shinymediator-aot/',
      '/blog/shinymediator-whats-new-v6/': '/blog/2026/02/shinymediator-whats-new-v6/',
      '/blog/shiny-maui-tableview/': '/blog/2026/02/shiny-maui-tableview/',
      '/blog/shiny-sqlitedocumentdb/': '/blog/2026/02/shiny-sqlitedocumentdb/',
      '/blog/shiny-music/': '/blog/2026/03/shiny-music/',
      '/blog/shiny-spatial/': '/blog/2026/03/shiny-spatial/',
      '/blog/sqlitedocumentdb-v2/': '/blog/2026/03/sqlitedocumentdb-v2/',
      '/blog/documentdb-v3/': '/blog/2026/03/documentdb-v3/',
      '/blog/client-v4/': '/blog/2026/03/client-v4/',

      '/client/mediator/': '/mediator/',
      '/client/mediator/middleware/': '/mediator/middleware/',
      '/client/mediator/extensions/': '/mediator/extensions/',
      '/release-notes/client/v30/' : '/release-notes/',
      '/extensions/sqlite-document-db/': '/documentdb/',
      '/release-notes/client/': '/release-notes/',
      '/release-notes/mediator/': '/mediator/release-notes/',
      '/release-notes/spatial/': '/spatial/release-notes/',
      '/release-notes/sqlite-documentdb/': '/documentdb/release-notes/',
      '/maui/controls/': '/controls/',
      '/maui/controls/release-notes/': '/controls/release-notes/',
      '/release-notes/tableview/': '/controls/tableview/release-notes/',
      '/release-notes/extensions/': '/di/release-notes/',
      '/extensions/release-notes/': '/di/release-notes/',
      '/release-notes/aspire/': '/aspire/orleans/release-notes/',
      '/aspire/release-notes/': '/aspire/orleans/release-notes/',

      // Slide viewer split out of the combined "Document & Slide Viewers" page
      '/controls/document-viewer/presenting/': '/controls/slide-viewer/presenting/',

      // Foundation redirects
      '/client/architecture/': '/foundation/architecture/',
      '/client/hosting/maui/': '/foundation/hosting/maui/',
      '/client/hosting/native/': '/foundation/hosting/native/',
      '/client/hosting/manual/': '/foundation/hosting/manual/',
      '/appbuilder/': '/foundation/appbuilder/',
      '/ai-skills/': '/foundation/ai-skills/',
      // Template Builder merged into the App Builder
      '/templates/builder/': '/foundation/appbuilder/',

      // Shell redirects
      '/client/maui/': '/mauishell/',
      '/client/maui/navigation': '/mauishell/navigation',
      '/client/maui/lifecycle': '/mauishell/lifecycle',
      '/client/maui/sourcegen': '/mauishell/sourcegen',
      '/maui/shell/': '/mauishell/',
      '/maui/shell/navigation': '/mauishell/navigation',
      '/maui/shell/dialogs': '/mauishell/dialogs',
      '/maui/shell/lifecycle': '/mauishell/lifecycle',
      '/maui/shell/sourcegen': '/mauishell/sourcegen',
      '/maui/shell/release-notes': '/mauishell/release-notes',

      // Client → flat redirects
      '/client/ble/release-notes': '/client/release-notes',
      '/client/blehosting/release-notes': '/client/release-notes',
      '/client/obd/': '/obd/',
      '/client/obd/commands': '/obd/commands',
      '/client/obd/connection': '/obd/connection',
      '/client/obd/ble': '/obd/ble',
      '/client/obd/transports': '/obd/transports',
      '/client/obd/release-notes': '/obd/release-notes',
      '/client/jobs/release-notes': '/client/release-notes',
      '/client/httptransfers/release-notes': '/client/release-notes',
      '/client/notifications/release-notes': '/client/release-notes',
      '/client/push/release-notes': '/client/release-notes',
      '/client/locations/release-notes': '/client/release-notes',
      '/client/music/': '/music/',
      '/client/music/permissions': '/music/permissions',
      '/client/music/querying': '/music/querying',
      '/client/music/playback': '/music/playback',
      '/client/music/copying': '/music/copying',
      '/client/music/lyrics': '/music/lyrics',
      '/client/music/album-art': '/music/album-art',
      '/client/music/release-notes': '/music/release-notes',
      '/client/health/': '/health/',
      '/client/configuration/release-notes': '/client/release-notes',
      '/client/permissions/': '/permissions/',
      '/client/permissions/android': '/permissions/android',
      '/client/permissions/ios': '/permissions/ios',
      '/client/other/startupservices': '/client/core/startup',
      '/client/other/lifecyclehooks': '/client/core/lifecycle',
      '/client/other/androidforeground': '/client/core/android-foreground',
      '/other/startupservices': '/client/core/startup',
      '/other/lifecyclehooks': '/client/core/lifecycle',
      '/other/androidforeground': '/client/core/android-foreground',
      '/foundation/release-notes': '/client/release-notes',

      // MAUI → flat redirects
      '/maui/contactstore/': '/client/contactstore/',
      '/maui/contactstore/permissions': '/client/contactstore/permissions',
      '/maui/contactstore/querying': '/client/contactstore/querying',
      '/maui/contactstore/release-notes': '/client/release-notes',

      // Extensions → flat redirects
      '/extensions/reflector/': '/reflector/',
      '/extensions/reflector/json': '/reflector/json',
      '/extensions/reflector/assembly-info': '/reflector/assembly-info',
      '/extensions/reflector/configuration': '/reflector/configuration',
      '/extensions/reflector/release-notes': '/reflector/release-notes',
      '/extensions/di/': '/di/',
      '/extensions/di/advanced': '/di/advanced',
      '/extensions/di/categories': '/di/categories',
      '/extensions/di/configuration': '/di/configuration',
      '/extensions/di/release-notes': '/di/release-notes',
      '/extensions/stores/': '/stores/',
      '/extensions/stores/persistent-services': '/stores/persistent-services',
      '/extensions/stores/release-notes': '/stores/release-notes',
      '/extensions/localizegen/': '/localizegen/',
      '/extensions/localizegen/usage': '/localizegen/usage',
      '/extensions/localizegen/release-notes': '/localizegen/release-notes',
      '/extensions/webhost/': '/webhost/',
      '/extensions/webhost/release-notes': '/webhost/release-notes',
      '/extensions/mauihost/': '/mauihost/',
      '/extensions/mauihost/release-notes': '/mauihost/release-notes',

      // Data → flat redirects
      '/data/documentdb/': '/documentdb/',
      '/data/documentdb/aot': '/documentdb/aot',
      '/data/documentdb/crud': '/documentdb/crud',
      '/data/documentdb/querying': '/documentdb/querying',
      '/data/documentdb/projections': '/documentdb/projections',
      '/data/documentdb/aggregates': '/documentdb/aggregates',
      '/data/documentdb/indexes': '/documentdb/indexes',
      '/data/documentdb/sqlcipher': '/documentdb/sqlcipher',
      '/data/documentdb/release-notes': '/documentdb/release-notes',
      '/data/spatial/': '/spatial/',
      '/data/spatial/geometry': '/spatial/geometry',
      '/data/spatial/database': '/spatial/database',
      '/data/spatial/queries': '/spatial/queries',
      '/data/spatial/algorithms': '/spatial/algorithms',
      '/data/spatial/prebuilt': '/spatial/prebuilt',
      '/data/spatial/geofencing': '/spatial/geofencing',
      '/data/spatial/release-notes': '/spatial/release-notes',


      // Legacy redirects (pre-flat paths)
      '/tableview/': '/controls/tableview/',
      '/tableview/cells': '/controls/tableview/cells',
      '/tableview/sections': '/controls/tableview/sections',
      '/tableview/styling': '/controls/tableview/styling',
      '/tableview/advanced': '/controls/tableview/advanced',
      '/tableview/release-notes': '/controls/tableview/release-notes',
      '/tableview/release-notes-templates': '/controls/tableview/release-notes-templates',
      '/maui/tableview/': '/controls/tableview/',
      '/maui/tableview/cells': '/controls/tableview/cells',
      '/maui/tableview/sections': '/controls/tableview/sections',
      '/maui/tableview/styling': '/controls/tableview/styling',
      '/maui/tableview/advanced': '/controls/tableview/advanced',
      '/maui/tableview/release-notes': '/controls/tableview/release-notes',
      '/maui/scheduler/': '/controls/scheduler/',
      '/maui/scheduler/calendar': '/controls/scheduler/calendar',
      '/maui/scheduler/agenda': '/controls/scheduler/agenda',
      '/maui/scheduler/event-list': '/controls/scheduler/event-list',
      '/maui/scheduler/templates': '/controls/scheduler/templates',
      '/maui/scheduler/release-notes': '/controls/scheduler/release-notes',
      '/maui/bottomsheet/': '/controls/floatingpanel/',
      '/controls/bottomsheet/': '/controls/floatingpanel/',
      '/controls/sheetview/': '/controls/floatingpanel/',
      '/controls/sheetview/properties': '/controls/floatingpanel/properties',
      '/controls/sheetview/examples': '/controls/floatingpanel/examples',
      '/controls/sheetview/blazor': '/controls/floatingpanel/blazor',
      '/maui/fab/': '/controls/fab/',
      '/maui/pillview/': '/controls/pillview/',
      '/maui/securitypin/': '/controls/securitypin/',
      '/maui/imageviewer/': '/controls/imageviewer/',
      '/maui/imageeditor/': '/controls/imageeditor/',
      '/maui/chatview/': '/controls/chatview/',
      '/maui/markdown/': '/controls/markdown/',
      '/maui/mermaid-diagrams/': '/controls/mermaid-diagrams/',
      '/maui/mermaid-diagrams/control': '/controls/mermaid-diagrams/control',
      '/maui/mermaid-diagrams/theming': '/controls/mermaid-diagrams/theming',
      '/maui/mermaid-diagrams/release-notes': '/controls/mermaid-diagrams/release-notes',
      '/sqlite-docdb/': '/documentdb/',
      '/sqlite-docdb/aot': '/documentdb/aot',
      '/sqlite-docdb/crud': '/documentdb/crud',
      '/sqlite-docdb/querying': '/documentdb/querying',
      '/sqlite-docdb/projections': '/documentdb/projections',
      '/sqlite-docdb/aggregates': '/documentdb/aggregates',
      '/sqlite-docdb/indexes': '/documentdb/indexes',
      '/sqlite-docdb/release-notes': '/documentdb/release-notes',
      '/data/sqlite-docdb/': '/documentdb/',
      '/data/sqlite-docdb/aot': '/documentdb/aot',
      '/data/sqlite-docdb/crud': '/documentdb/crud',
      '/data/sqlite-docdb/querying': '/documentdb/querying',
      '/data/sqlite-docdb/projections': '/documentdb/projections',
      '/data/sqlite-docdb/aggregates': '/documentdb/aggregates',
      '/data/sqlite-docdb/indexes': '/documentdb/indexes',
      '/data/sqlite-docdb/release-notes': '/documentdb/release-notes',
      '/mediator/extensions/http': '/mediator/http/',
      '/client/appbuilder': '/foundation/appbuilder/',
      '/client/other/configuration': '/client/configuration/',
  },
  integrations: [
    react(),
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      styleOverrides: {
        borderRadius: '0.5rem',
        frames: {
          frameBoxShadowCssValue: '0 0 0 1px #9A81EA20, 0 5px 17px rgba(0, 0, 0, 0.15)',
        }
      }
    }),
    mdx(),
    starlight({
      title: 'Shiny.NET',
      // Pagefind builds a static full-text index into `dist/pagefind` at build
      // time. The header has no search box of its own (see the `Search`
      // override below) — the finder queries this index directly.
      pagefind: true,
      favicon: '/favicon.png',
      // tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },
      editLink: {
        baseUrl: 'https://github.com/shinyorg/documentation/edit/main/'
      },
      logo: {
        src: '/src/assets/logo.png'
      },
      customCss: ['/src/styles/custom.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/shinyorg' },
        { icon: 'blueSky', label: 'BlueSky', href: 'https://bsky.app/profile/shinylib.net' },
        { icon: 'x.com', label: 'X', href: 'https://x.com/shinydotnet' },
        { icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@GoneDotnet' },
      ],
      head: [
        // Default social share image (Open Graph + Twitter). Per-page frontmatter can override.
        // Bump ?v= whenever og-image.png changes — X, Teams, LinkedIn and Slack
        // cache the card by URL, so the same URL keeps serving the old artwork.
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://www.shinylib.net/og-image.png?v=4' } },
        { tag: 'meta', attrs: { property: 'og:image:secure_url', content: 'https://www.shinylib.net/og-image.png?v=4' } },
        { tag: 'meta', attrs: { property: 'og:image:type', content: 'image/png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: 'Shiny.NET — the hard parts of your app, already solved. 40M+ NuGet downloads, 30+ libraries, 70+ UI controls, AOT trim-clean.' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://www.shinylib.net/og-image.png?v=4' } },
        { tag: 'meta', attrs: { name: 'twitter:image:alt', content: 'Shiny.NET — the hard parts of your app, already solved. 40M+ NuGet downloads, 30+ libraries, 70+ UI controls, AOT trim-clean.' } },
        // Adding google analytics
        {
          tag: 'script',
          attrs: {
            src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
          },
        },
        {
          tag: 'script',
          content: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${googleAnalyticsId}');
          `,
        },
      ],
      components: {
        // Adds a mobile-only dropdown for the header links Starlight hides below 50rem,
        // and mounts the site-wide finder overlay.
        Header: './src/components/Header.astro',
        // Adds the "Browse docs" mega-menu trigger beside the logo.
        SiteTitle: './src/components/SiteTitle.astro',
        // Override the default `Sidebar` component with a custom one.
        Sidebar: './src/components/Sidebar.astro',
        // Inject giscus comments under page content (blog posts + opt-in via `comments: true` frontmatter).
        MarkdownContent: './src/components/MarkdownContent.astro',
        // Adds the ShinySoft header link beside starlight-blog's "Blog" link.
        ThemeSelect: './src/components/ThemeSelect.astro',
        // Renders nothing: the finder is the only search control on the site.
        // Pagefind stays enabled so the finder has an index to query.
        Search: './src/components/Search.astro',
        // Our own announcement bar (title + description, marquee when long).
        // Content is `announcementConfig` at the top of this file.
        Banner: './src/components/Banner.astro',
      },
      plugins:[
        starlightBlog({
          authors: {
            allanritchie: {
              name: 'Allan Ritchie',
              title: 'One of the guys who builds this',
              picture: 'https://avatars.githubusercontent.com/u/1431555', // Images in the `public` directory are supported.
              url: 'https://allanritchie.com'
            }
          }
        }),
        starlightSidebarTopics(cleanTopicsForStarlight(sidebarTopics), sidebarTopicsOptions),
      ],
    }),
  ],
});
