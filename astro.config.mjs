import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import starlightBlog from 'starlight-blog';
import mdx from '@astrojs/mdx';
import expressiveCode from "astro-expressive-code";
import starlightDocSearch from '@astrojs/starlight-docsearch';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import starlightAnnouncement from 'starlight-announcement'
import { sidebarTopics, sidebarTopicsOptions, cleanTopicsForStarlight } from './src/sidebar-topics.mjs';

const googleAnalyticsId = 'G-SZKGGX6M5W';


export default defineConfig({
  site: 'https://www.shinylib.net',
  output: 'static',
  redirects: {
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
      '/release-notes/templates/': '/templates/release-notes/',
      '/release-notes/extensions/': '/di/release-notes/',
      '/extensions/release-notes/': '/di/release-notes/',
      '/release-notes/aspire/': '/aspire/orleans/release-notes/',
      '/aspire/release-notes/': '/aspire/orleans/release-notes/',

      // Foundation redirects
      '/client/architecture/': '/foundation/architecture/',
      '/client/hosting/maui/': '/foundation/hosting/maui/',
      '/client/hosting/native/': '/foundation/hosting/native/',
      '/client/hosting/manual/': '/foundation/hosting/manual/',
      '/appbuilder/': '/foundation/appbuilder/',
      '/ai-skills/': '/foundation/ai-skills/',

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
      '/client/ble/': '/ble/',
      '/client/ble/manager': '/ble/manager',
      '/client/ble/peripheral': '/ble/peripheral',
      '/client/ble/gatt': '/ble/gatt',
      '/client/ble/background': '/ble/background',
      '/client/ble/best-practices': '/ble/best-practices',
      '/client/ble/release-notes': '/ble/release-notes',
      '/client/blehosting/': '/blehosting/',
      '/client/blehosting/gatt': '/blehosting/gatt',
      '/client/blehosting/release-notes': '/blehosting/release-notes',
      '/client/obd/': '/obd/',
      '/client/obd/commands': '/obd/commands',
      '/client/obd/connection': '/obd/connection',
      '/client/obd/ble': '/obd/ble',
      '/client/obd/transports': '/obd/transports',
      '/client/obd/release-notes': '/obd/release-notes',
      '/client/jobs/': '/jobs/',
      '/client/jobs/create': '/jobs/create',
      '/client/jobs/managing': '/jobs/managing',
      '/client/jobs/faq': '/jobs/faq',
      '/client/jobs/release-notes': '/jobs/release-notes',
      '/client/httptransfers/': '/httptransfers/',
      '/client/httptransfers/transfers': '/httptransfers/transfers',
      '/client/httptransfers/azure': '/httptransfers/azure',
      '/client/httptransfers/delegate': '/httptransfers/delegate',
      '/client/httptransfers/monitoring': '/httptransfers/monitoring',
      '/client/httptransfers/release-notes': '/httptransfers/release-notes',
      '/client/notifications/': '/notifications/',
      '/client/notifications/sending': '/notifications/sending',
      '/client/notifications/channels': '/notifications/channels',
      '/client/notifications/platform': '/notifications/platform',
      '/client/notifications/scheduling': '/notifications/scheduling',
      '/client/notifications/release-notes': '/notifications/release-notes',
      '/client/push/': '/push/',
      '/client/push/native': '/push/native',
      '/client/push/platform': '/push/platform',
      '/client/push/azure': '/push/azure',
      '/client/push/firebase-ios': '/push/firebase-ios',
      '/client/push/faq': '/push/faq',
      '/client/push/release-notes': '/push/release-notes',
      '/client/locations/gps': '/locations/gps',
      '/client/locations/platform-requests': '/locations/platform-requests',
      '/client/locations/geofencing': '/locations/geofencing',
      '/client/locations/motionactivity': '/locations/motionactivity',
      '/client/locations/release-notes': '/locations/release-notes',
      '/client/music/': '/music/',
      '/client/music/permissions': '/music/permissions',
      '/client/music/querying': '/music/querying',
      '/client/music/playback': '/music/playback',
      '/client/music/copying': '/music/copying',
      '/client/music/lyrics': '/music/lyrics',
      '/client/music/album-art': '/music/album-art',
      '/client/music/identification': '/music/identification',
      '/client/music/management': '/music/management',
      '/client/music/release-notes': '/music/release-notes',
      '/client/health/': '/health/',
      '/client/configuration/': '/configuration/',
      '/client/configuration/json': '/configuration/json',
      '/client/configuration/preferences': '/configuration/preferences',
      '/client/configuration/remote': '/configuration/remote',
      '/client/configuration/release-notes': '/configuration/release-notes',
      '/client/permissions/': '/permissions/',
      '/client/permissions/android': '/permissions/android',
      '/client/permissions/ios': '/permissions/ios',
      '/client/other/statefulservices': '/other/statefulservices',
      '/client/other/startupservices': '/other/startupservices',
      '/client/other/lifecyclehooks': '/other/lifecyclehooks',
      '/client/other/androidforeground': '/other/androidforeground',
      '/client/release-notes/': '/release-notes/',

      // MAUI → flat redirects
      '/maui/contactstore/': '/contactstore/',
      '/maui/contactstore/permissions': '/contactstore/permissions',
      '/maui/contactstore/querying': '/contactstore/querying',
      '/maui/contactstore/release-notes': '/contactstore/release-notes',
      '/maui/templates/': '/templates/',
      '/maui/templates/shiny-libraries': '/templates/shiny-libraries',
      '/maui/templates/third-party': '/templates/third-party',
      '/maui/templates/release-notes': '/templates/release-notes',

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
      '/client/other/configuration': '/configuration/',
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
      pagefind: false,
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
        // Override the default `Sidebar` component with a custom one.
        Sidebar: './src/components/Sidebar.astro',
      },
      plugins:[
        //https://frostybee.github.io/starlight-announcement/
        starlightAnnouncement({
          displayMode: 'rotate', 
          rotateInterval: 5000,
          showRotateIndicator: true,
          announcements: [
            {
              id: 'mauishell-60',
              content: 'Shiny.Maui.Shell v6 support for AI routing tools',
              variant: 'tip',
              link: { text: 'Learn More', href: '/mauishell/ai/' },
              dismissable: false
            },
            {
              id: 'mediator63-1',
              content: 'Mediator 6.3 Beta with AI Tool Generation!',
              variant: 'tip',
              link: { text: 'Check It Out', href: '/mediator/extensions/ai/' },
              dismissable: false
            },
            {
              id: 'mobilev4-1',
              content: 'Shiny v4.1 BETA - BLE, BLE Hosting, HTTP, Jobs - Linux, MacOS, & Blazor Support! Full AOT support and MANY other features!',
              variant: 'tip',
              link: { text: 'Check It Out', href: '/ble' },
              dismissable: false
            },
            {
              id: 'controls1-1',
              content : 'Shiny .NET Controls: TableView, Scheduler, ChatView, ImageEditor, and more!',
              variant: 'tip',
              link: { text: 'Learn More', href: '/controls/' },
              dismissable: false
            },
            {
              id: 'health1beta-1',
              content: 'Shiny .NET Health Beta v1 - Cross-platform /w Read, Write, & Monitor for steps, heart rate, sleep, and more.',
              variant: 'tip',
              link: { text: 'Learn More', href: '/health/' },
              dismissable: false
            },
            {
              id: 'music2-1',
              content: 'Shiny.Music v2 Volume, Lyrics, Album Art, Custom Playlists, and more!',
              variant: 'tip',
              link: { text: 'Check It Out', href: '/music' },
              dismissable: false
            }
          ]
        }),
        starlightDocSearch({
          appId: 'JHE1F0X28B',
          apiKey: '92258958b2d4448dc6b24bf03f14b97b',
          indexName: 'Shiny .NET',
        }),
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
