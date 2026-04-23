import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import starlightBlog from 'starlight-blog';
import mdx from '@astrojs/mdx';
import expressiveCode from "astro-expressive-code";
import starlightDocSearch from '@astrojs/starlight-docsearch';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import starlightAnnouncement from 'starlight-announcement'

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
      '/client/locations/release-notes': '/locations/release-notes',
      '/client/music/': '/music/',
      '/client/music/permissions': '/music/permissions',
      '/client/music/querying': '/music/querying',
      '/client/music/playback': '/music/playback',
      '/client/music/copying': '/music/copying',
      '/client/music/lyrics': '/music/lyrics',
      '/client/music/album-art': '/music/album-art',
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
      '/maui/bottomsheet/': '/controls/sheetview/',
      '/controls/bottomsheet/': '/controls/sheetview/',
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
          displayMode: 'rotate', // stack
          rotateInterval: 5000,
          showRotateIndicator: true,
          announcements: [
            {
              id: 'mobilev4',
              content: 'Shiny .NET v4 is here with BLE Windows Support, Improved GPS, & More!',
              variant: 'tip',
              link: { text: 'Check It Out', href: '/ble' },
              dismissable: false
            },
            {
              id: 'controls1',
              content : 'Introducing Shiny .NET Controls: TableView, Scheduler, ChatView, ImageEditor, and more!',
              variant: 'tip',
              link: { text: 'Learn More', href: '/controls/' },
              dismissable: false
            },
            {
              id: 'health1beta',
              content: 'Shiny .NET Health Beta is now available!',
              variant: 'tip',
              link: { text: 'Learn More', href: '/health/' },
              dismissable: false
            },
            {
              id: 'music2',
              content: 'Shiny.Music v2 is here with Volume Control, Lyrics, Album Art, and more!',
              variant: 'tip',
              link: { text: 'Check It Out', href: '/music' },
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
        starlightSidebarTopics([
          {
            label: 'Foundation',
            link: '/foundation/appbuilder/',
            icon: 'open-book',
            items: [
              { label: 'App Builder', link: 'foundation/appbuilder' },
              { label: 'Architecture', link: 'foundation/architecture' },
              {
                label: 'Hosting Models',
                items:[
                  { label: 'Getting Started', link: 'foundation/hosting/' },
                  { label: 'MAUI', link: 'foundation/hosting/maui' },
                  { label: 'Native', link: 'foundation/hosting/native' },
                  { label: 'Manual', link: 'foundation/hosting/manual' }
                ]
              },
              { label: 'AI Skills', link: 'foundation/ai-skills' },
            ],
          },
          {
            id: 'client',
            label: 'Mobile Essentials',
            link: '/mauishell/',
            icon: 'rocket',
            items: [
              {
                label: 'MAUI Shell',
                items:[
                  { label: 'Getting Started', link: 'mauishell/' },
                  { label: 'Navigation', link: 'mauishell/navigation' },
                  { label: 'Dialogs', link: 'mauishell/dialogs' },
                  { label: 'ViewModel Lifecycle', link: 'mauishell/lifecycle' },
                  { label: 'Source Generation', link: 'mauishell/sourcegen' },
                  { label: 'Release Notes', link: 'mauishell/release-notes' }
                ]
              },
              {
                label: 'Jobs',
                items:[
                  { label: 'Getting Started', link: 'jobs/' },
                  { label: 'Create a Job', link: 'jobs/create' },
                  { label: 'Managing Jobs', link: 'jobs/managing' },
                  { label: 'FAQ', link: 'jobs/faq' },
                  { label: 'Release Notes', link: 'jobs/release-notes' }
                ]
              },
              {
                label: 'HTTP Transfers',
                items: [
                  { label: 'Getting Started', link: 'httptransfers/' },
                  { label: 'Transfers', link: 'httptransfers/transfers' },
                  { label: 'Azure Blob Storage', link: 'httptransfers/azure' },
                  { label: 'Transfer Delegate', link: 'httptransfers/delegate' },
                  { label: 'Monitoring', link: 'httptransfers/monitoring' },
                  { label: 'Release Notes', link: 'httptransfers/release-notes' }
                ]
              },
              {
                label: 'Local Notifications',
                items:[
                  { label: 'Getting Started', link: 'notifications/' },
                  { label: 'Sending Notifications', link: 'notifications/sending' },
                  { label: 'Channels', link: 'notifications/channels' },
                  { label: 'Platform Specific', link: 'notifications/platform' },
                  { label: 'Scheduling & Triggers', link: 'notifications/scheduling' },
                  { label: 'Release Notes', link: 'notifications/release-notes' }
                ]
              },
              {
                label: 'Push Notifications',
                items:[
                  { label: 'Getting Started', link: 'push/' },
                  { label: 'Native', link: 'push/native' },
                  { label: 'Platform Specific', link: 'push/platform' },
                  { label: 'Azure Push Notifications', link: 'push/azure' },
                  { label: 'Firebase (iOS)', link: 'push/firebase-ios' },
                  { label: 'FAQ', link: 'push/faq' },
                  { label: 'Release Notes', link: 'push/release-notes' }
                ]
              },
              {
                label: 'Configuration',
                items: [
                  { label: 'Getting Started', link: 'configuration/' },
                  { label: 'JSON Platform Bundle', link: 'configuration/json' },
                  { label: 'Platform Preferences', link: 'configuration/preferences' },
                  { label: 'Remote Configuration', link: 'configuration/remote' },
                  { label: 'Release Notes', link: 'configuration/release-notes' }
                ]
              },
              {
                label: 'MSBuild Permissions',
                items: [
                  { label: 'Getting Started', link: 'permissions/' },
                  { label: 'Android', link: 'permissions/android' },
                  { label: 'iOS', link: 'permissions/ios' }
                ]
              },
              {
                label: 'Other',
                items: [
                  { label: 'Stateful Services', link: 'other/statefulservices' },
                  { label: 'Startup Services', link: 'other/startupservices' },
                  { label: 'Lifecycle Hooks', link: 'other/lifecyclehooks' },
                  { label: 'Android Foreground Service', link: 'other/androidforeground' },
                ]
              },
              {
                label: 'Templates',
                items:[
                  { label: 'Getting Started', link: 'templates/' },
                  { label: 'Shiny Libraries', link: 'templates/shiny-libraries' },
                  { label: '3rd Party Libraries', link: 'templates/third-party' },
                  { label: 'Release Notes', link: 'templates/release-notes' }
                ]
              }
            ],
          },
          {
            label: 'Device & Sensors',
            link: '/ble/',
            icon: 'seti:smarty',
            items: [
              {
                label: 'BluetoothLE',
                items:[
                  { label: 'Getting Started', link: 'ble/' },
                  { label: 'BLE Manager', link: 'ble/manager' },
                  { label: 'Peripheral', link: 'ble/peripheral' },
                  { label: 'Services/Characteristics/Descriptors', link: 'ble/gatt' },
                  { label: 'Background Operations', link: 'ble/background' },
                  { label: 'Best Practice/FAQ', link: 'ble/best-practices' },
                  { label: 'Release Notes', link: 'ble/release-notes' }
                ]
              },
              {
                label: 'BluetoothLE Hosting',
                items: [
                  { label: 'Getting Started', link: 'blehosting/' },
                  { label: 'GATT Service', link: 'blehosting/gatt' },
                  { label: 'Release Notes', link: 'blehosting/release-notes' }
                ]
              },
              {
                label: 'OBD',
                items: [
                  { label: 'Getting Started', link: 'obd/' },
                  { label: 'Commands', link: 'obd/commands' },
                  { label: 'Connection & Adapters', link: 'obd/connection' },
                  { label: 'BLE Transport', link: 'obd/ble' },
                  { label: 'Custom Transports', link: 'obd/transports' },
                  { label: 'Release Notes', link: 'obd/release-notes' }
                ]
              },
              {
                label: 'Locations',
                items:[
                  { label: 'GPS', link: 'locations/gps' },
                  { label: 'Platform GPS Requests', link: 'locations/platform-requests' },
                  { label: 'Geofencing', link: 'locations/geofencing' },
                  { label: 'Release Notes', link: 'locations/release-notes' }
                ]
              },
            ]
          },
          {
            label: 'Platform Data',
            link: '/music/',
            icon: 'seti:db',
            items: [
              {
                label: 'Music',
                items: [
                  { label: 'Getting Started', link: 'music/' },
                  { label: 'Permissions', link: 'music/permissions' },
                  { label: 'Querying Music', link: 'music/querying' },
                  { label: 'Playback', link: 'music/playback' },
                  { label: 'Lyrics', link: 'music/lyrics' },
                  { label: 'Album Art', link: 'music/album-art' },
                  { label: 'Copying Tracks', link: 'music/copying' },
                  { label: 'Release Notes', link: 'music/release-notes' }
                ]
              },
              {
                label: 'Health',
                items: [
                  { label: 'Getting Started', link: 'health/' },
                  { label: 'Release Notes', link: 'health/release-notes' }
                ]
              },
              {
                label: 'Contact Store',
                items:[
                  { label: 'Getting Started', link: 'contactstore/' },
                  { label: 'Permissions', link: 'contactstore/permissions' },
                  { label: 'Querying', link: 'contactstore/querying' },
                  { label: 'Release Notes', link: 'contactstore/release-notes' }
                ]
              },
            ]
          },
          {
            label: 'Controls',
            link: '/controls/',
            icon: 'seti:html',
            items:[
              { label: 'Getting Started', link: 'controls/' },
              {
                label: 'TableView',
                items:[
                  { label: 'Getting Started', link: 'controls/tableview/' },
                  { label: 'Cell Types', link: 'controls/tableview/cells' },
                  { label: 'Sections & Dynamic Content', link: 'controls/tableview/sections' },
                  { label: 'Styling', link: 'controls/tableview/styling' },
                  { label: 'Advanced Features', link: 'controls/tableview/advanced' },
                  { label: 'Blazor Usage', link: 'controls/tableview/blazor' },
                ]
              },
              {
                label: 'Scheduler',
                items:[
                  { label: 'Getting Started', link: 'controls/scheduler/' },
                  { label: 'Calendar View', link: 'controls/scheduler/calendar' },
                  { label: 'Agenda View', link: 'controls/scheduler/agenda' },
                  { label: 'Event List', link: 'controls/scheduler/event-list' },
                  { label: 'Custom Templates', link: 'controls/scheduler/templates' },
                  { label: 'Blazor Usage', link: 'controls/scheduler/blazor' },
                ]
              },
              {
                label: 'ChatView',
                items:[
                  { label: 'Getting Started', link: 'controls/chatview/' },
                  { label: 'Data Models', link: 'controls/chatview/data-models' },
                  { label: 'Properties & Commands', link: 'controls/chatview/configuration' },
                ]
              },
              {
                label: 'ImageEditor',
                items:[
                  { label: 'Getting Started', link: 'controls/imageeditor/' },
                  { label: 'Properties & Commands', link: 'controls/imageeditor/properties' },
                  { label: 'Save & Export', link: 'controls/imageeditor/save-export' },
                ]
              },
              {
                label: 'SheetView',
                items:[
                  { label: 'Getting Started', link: 'controls/sheetview/' },
                  { label: 'Properties & Events', link: 'controls/sheetview/properties' },
                  { label: 'Examples', link: 'controls/sheetview/examples' },
                  { label: 'Blazor Usage', link: 'controls/sheetview/blazor' },
                ]
              },
              {
                label: 'Fab & FabMenu',
                items:[
                  { label: 'Getting Started', link: 'controls/fab/' },
                  { label: 'Fab', link: 'controls/fab/fab' },
                  { label: 'FabMenu', link: 'controls/fab/fabmenu' },
                  { label: 'Blazor Usage', link: 'controls/fab/blazor' },
                ]
              },
              {
                label: 'Mermaid Diagrams',
                items:[
                  { label: 'Getting Started', link: 'controls/mermaid-diagrams/' },
                  { label: 'Control Properties', link: 'controls/mermaid-diagrams/control' },
                  { label: 'Theming', link: 'controls/mermaid-diagrams/theming' },
                  { label: 'Blazor Usage', link: 'controls/mermaid-diagrams/blazor' },
                ]
              },
              {
                label: 'Other Controls',
                items:[
                  { label: 'ColorPicker', link: 'controls/colorpicker/' },
                  { label: 'ImageViewer', link: 'controls/imageviewer/' },
                  { label: 'Markdown', link: 'controls/markdown/' },
                  { label: 'PillView', link: 'controls/pillview/' },
                  { label: 'SecurityPin', link: 'controls/securitypin/' },
                ]
              },
              { label: 'Release Notes', link: 'controls/release-notes' }
            ]
          },
          {
            label: 'Database',
            link: '/documentdb/',
            icon: 'document',
            items:[
              {
                label: 'Document DB',
                items:[
                  { label: 'Getting Started', link: 'documentdb/' },
                  { label: 'AOT Setup', link: 'documentdb/aot' },
                  { label: 'CRUD Operations', link: 'documentdb/crud' },
                  { label: 'Querying', link: 'documentdb/querying' },
                  { label: 'Projections & Streaming', link: 'documentdb/projections' },
                  { label: 'Aggregates', link: 'documentdb/aggregates' },
                  { label: 'Indexes & Transactions', link: 'documentdb/indexes' },
                  { label: 'SQLCipher (Encrypted)', link: 'documentdb/sqlcipher' },
                  { label: 'Release Notes', link: 'documentdb/release-notes' }
                ]
              },
              {
                label: 'Spatial',
                items:[
                  { label: 'Getting Started', link: 'spatial/' },
                  { label: 'Geometry Types', link: 'spatial/geometry' },
                  { label: 'Database Operations', link: 'spatial/database' },
                  { label: 'Querying', link: 'spatial/queries' },
                  { label: 'Algorithms & Serialization', link: 'spatial/algorithms' },
                  { label: 'Pre-built Databases', link: 'spatial/prebuilt' },
                  { label: 'Geofencing', link: 'spatial/geofencing' },
                  { label: 'Release Notes', link: 'spatial/release-notes' }
                ]
              }
            ]
          },
          {
            label: 'Core & Infrastructure',
            link: '/mediator/',
            icon: 'setting',
            items:[
              {
                label: 'Mediator',
                items:[
                  {
                      label: 'General',
                      collapsed: true,
                      items:[
                        { label: 'Introduction', link: 'mediator/' },
                        { label: 'Getting Started', link: 'mediator/getting-started' },
                        { label: 'Requests', link: 'mediator/requests' },
                        { label: 'Commands', link: 'mediator/commands' },
                        { label: 'Streams', link: 'mediator/streams' },
                        { label: 'Events', link: 'mediator/events' },
                        { label: 'Exception Handling', link: 'mediator/exceptionhandlers' },
                        { label: 'Contract Keys', link: 'mediator/contractkeys' },
                        { label: 'Source Generation (AOT)', link: 'mediator/sourcegeneration' },
                        { label: 'Execution Contexts', link: 'mediator/context' },
                        { label: 'Advanced', link: 'mediator/advanced' },
                      ]
                  },
                  {
                      label: 'Middleware',
                      collapsed: true,
                      items:[
                        { label: 'Introduction', link: 'mediator/middleware/' },
                        { label: 'Validation', link: 'mediator/middleware/validation' },
                        { label: 'Caching', link: 'mediator/middleware/caching' },
                        { label: 'Resiliency', link: 'mediator/middleware/resilience' },
                        { label: 'Offline', link: 'mediator/middleware/offline' },
                        { label: 'Performance Logging', link: 'mediator/middleware/performancelogging' },
                        { label: 'Main Thread', link: 'mediator/middleware/mainthread' },
                        { label: 'Replay', link: 'mediator/middleware/replay' },
                        { label: 'Refresh Timer', link: 'mediator/middleware/refresh' },
                        { label: 'Event Sample', link: 'mediator/middleware/sample' },
                        { label: 'Event Throttle', link: 'mediator/middleware/throttle' },
                        { label: 'Command Scheduling', link: 'mediator/middleware/scheduling' },
                        { label: 'Middleware Ordering', link: 'mediator/middleware/ordering' }
                      ]
                  },
                  {
                      label: 'HTTP',
                      collapsed: true,
                      items:[
                        { label: 'Getting Started', link: 'mediator/http/' },
                        { label: 'Request Contracts', link: 'mediator/http/contracts' },
                        { label: 'Decorators', link: 'mediator/http/decorators' },
                        { label: 'OpenAPI Generation', link: 'mediator/http/openapi' },
                        { label: 'Configuration & AOT', link: 'mediator/http/configuration' },
                      ]
                  },
                  {
                      label: 'Extensions',
                      collapsed: true,
                      items:[
                        { label: 'MAUI', link: 'mediator/extensions/maui' },
                        { label: 'Blazor', link: 'mediator/extensions/blazor' },
                        { label: 'Uno Platform', link: 'mediator/extensions/unoplatform' },
                        { label: 'ASP.NET Core', link: 'mediator/extensions/aspnet' },
                        { label: 'Prism', link: 'mediator/extensions/prism' },
                        { label: 'Dapper', link: 'mediator/extensions/dapper' }
                      ]
                  },
                  { label: 'Release Notes', link: 'mediator/release-notes' }
                ]
              },
              {
                label: 'Reflector',
                items:[
                  { label: 'Getting Started', link: 'reflector/' },
                  { label: 'JSON Serialization', link: 'reflector/json' },
                  { label: 'Assembly Info', link: 'reflector/assembly-info' },
                  { label: 'Configuration', link: 'reflector/configuration' },
                  { label: 'Release Notes', link: 'reflector/release-notes' }
                ]
              },
              {
                label: 'Dependency Injection',
                items:[
                  { label: 'Getting Started', link: 'di/' },
                  { label: 'Advanced Registration', link: 'di/advanced' },
                  { label: 'Categories', link: 'di/categories' },
                  { label: 'Configuration', link: 'di/configuration' },
                  { label: 'Release Notes', link: 'di/release-notes' }
                ]
              },
              {
                label: 'Stores',
                items:[
                  { label: 'Getting Started', link: 'stores/' },
                  { label: 'Persistent Services', link: 'stores/persistent-services' },
                  { label: 'Release Notes', link: 'stores/release-notes' }
                ]
              },
              {
                label: 'Localization Generator',
                items:[
                  { label: 'Getting Started', link: 'localizegen/' },
                  { label: 'Usage Examples', link: 'localizegen/usage' },
                  { label: 'Release Notes', link: 'localizegen/release-notes' }
                ]
              },
              {
                label: 'Web Hosting',
                items:[
                  { label: 'Getting Started', link: 'webhost/' },
                  { label: 'Release Notes', link: 'webhost/release-notes' }
                ]
              },
              {
                label: 'MAUI Hosting',
                items:[
                  { label: 'Getting Started', link: 'mauihost/' },
                  { label: 'Release Notes', link: 'mauihost/release-notes' }
                ]
              }
            ]
          },
          {
            label: 'Aspire',
            link: '/aspire/orleans/',
            icon: 'cloud-download',
            items:[
              {
                label: 'Orleans',
                items:[
                  { label: 'Getting Started', link: 'aspire/orleans/' },
                  { label: 'Hosting (AppHost)', link: 'aspire/orleans/hosting' },
                  { label: 'Server (Silo)', link: 'aspire/orleans/server' },
                  { label: 'Client', link: 'aspire/orleans/client' },
                  { label: 'Release Notes', link: 'aspire/orleans/release-notes' }
                ]
              },
              {
                label: 'Gluetun VPN',
                items:[
                  { label: 'Getting Started', link: 'aspire/gluetun/' },
                  { label: 'Configuration', link: 'aspire/gluetun/configuration' },
                  { label: 'Container Routing', link: 'aspire/gluetun/routing' },
                  { label: 'Release Notes', link: 'aspire/gluetun/release-notes' }
                ]
              }
            ]
          }
        ], {
          exclude: [
            '/blog',
            '/blog/**/*',
            '/foundation/hosting/uno',
            '/other/androidforeground',
            '/mediator/extensions',
            '/controls/tableview/release-notes',
            '/controls/scheduler/release-notes',
            '/controls/mermaid-diagrams/release-notes',
          ],
          topics: {
            client: ['/'],
          },
        }),
      ],
    }),
  ],
});
