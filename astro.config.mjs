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
      '/release-notes/client/v30/' : '/client/release-notes/',
      '/extensions/sqlite-document-db/': '/data/documentdb/',
      '/release-notes/client/': '/client/release-notes/',
      '/release-notes/mediator/': '/mediator/release-notes/',
      '/release-notes/spatial/': '/data/spatial/release-notes/',
      '/release-notes/sqlite-documentdb/': '/data/documentdb/release-notes/',
      '/maui/controls/': '/controls/',
      '/maui/controls/release-notes/': '/controls/release-notes/',
      '/release-notes/tableview/': '/controls/tableview/release-notes/',
      '/release-notes/templates/': '/maui/templates/release-notes/',
      '/release-notes/extensions/': '/extensions/di/release-notes/',
      '/extensions/release-notes/': '/extensions/di/release-notes/',
      '/release-notes/aspire/': '/aspire/orleans/release-notes/',
      '/aspire/release-notes/': '/aspire/orleans/release-notes/',

      '/client/maui/': '/maui/shell/',
      '/client/maui/navigation': '/maui/shell/navigation',
      '/client/maui/lifecycle': '/maui/shell/lifecycle',
      '/client/maui/sourcegen': '/maui/shell/sourcegen',
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

      '/sqlite-docdb/': '/data/documentdb/',
      '/sqlite-docdb/aot': '/data/documentdb/aot',
      '/sqlite-docdb/crud': '/data/documentdb/crud',
      '/sqlite-docdb/querying': '/data/documentdb/querying',
      '/sqlite-docdb/projections': '/data/documentdb/projections',
      '/sqlite-docdb/aggregates': '/data/documentdb/aggregates',
      '/sqlite-docdb/indexes': '/data/documentdb/indexes',
      '/sqlite-docdb/release-notes': '/data/documentdb/release-notes',
      '/data/sqlite-docdb/': '/data/documentdb/',
      '/data/sqlite-docdb/aot': '/data/documentdb/aot',
      '/data/sqlite-docdb/crud': '/data/documentdb/crud',
      '/data/sqlite-docdb/querying': '/data/documentdb/querying',
      '/data/sqlite-docdb/projections': '/data/documentdb/projections',
      '/data/sqlite-docdb/aggregates': '/data/documentdb/aggregates',
      '/data/sqlite-docdb/indexes': '/data/documentdb/indexes',
      '/data/sqlite-docdb/release-notes': '/data/documentdb/release-notes',
      '/spatial/': '/data/spatial/',
      '/spatial/geometry': '/data/spatial/geometry',
      '/spatial/database': '/data/spatial/database',
      '/spatial/queries': '/data/spatial/queries',
      '/spatial/algorithms': '/data/spatial/algorithms',
      '/spatial/prebuilt': '/data/spatial/prebuilt',
      '/spatial/release-notes': '/data/spatial/release-notes',
      '/mediator/extensions/http': '/mediator/http/',
      '/client/appbuilder': '/appbuilder/',
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
          announcements: [
            {
              id: 'welcome',
              content: 'Welcome to our documentation!',
              variant: 'tip',
              dismissable: true
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
            label: 'App Builder',
            link: '/appbuilder/',
            icon: 'star',
            items: [
              { label: 'App Builder', link: 'appbuilder/' }
            ],
          },
          {
            label: 'AI Skills',
            link: '/ai-skills/',
            icon: 'puzzle',
            items: [
              { label: 'AI Skills', link: 'ai-skills/' }
            ],
          },
          {
            id: 'client',
            label: 'Client',
            link: '/client/architecture/',
            icon: 'rocket',
            items: [
              { label: 'Architecture', link: 'client/architecture' },
              {
                label: 'Hosting Models',
                items:[
                  { label: 'MAUI', link: 'client/hosting/maui' },
                  { label: 'Native', link: 'client/hosting/native' },
                  { label: 'Manual', link: 'client/hosting/manual' }
                ]
              },
              {
                label: 'BluetoothLE',
                items:[
                  { label: 'Getting Started', link: 'client/ble' },
                  { label: 'BLE Manager', link: 'client/ble/manager' },
                  { label: 'Peripheral', link: 'client/ble/peripheral' },
                  { label: 'Services/Characteristics/Descriptors', link: 'client/ble/gatt' },
                  { label: 'Background Operations', link: 'client/ble/background' },
                  { label: 'Best Practice/FAQ', link: 'client/ble/best-practices' },
                  { label: 'Release Notes', link: 'client/ble/release-notes' }
                ]
              },
              {
                label: 'BluetoothLE Hosting',
                items: [
                  { label: 'Getting Started', link: 'client/blehosting' },
                  { label: 'GATT Service', link: 'client/blehosting/gatt' },
                  { label: 'Release Notes', link: 'client/blehosting/release-notes' }
                ]
              },
              {
                label: 'Jobs',
                items:[
                  { label: 'Getting Started', link: 'client/jobs/' },
                  { label: 'Create a Job', link: 'client/jobs/create' },
                  { label: 'Managing Jobs', link: 'client/jobs/managing' },
                  { label: 'FAQ', link: 'client/jobs/faq' },
                  { label: 'Release Notes', link: 'client/jobs/release-notes' }
                ]
              },
              {
                label: 'Locations',
                items:[
                  { label: 'GPS', link: 'client/locations/gps' },
                  { label: 'Platform GPS Requests', link: 'client/locations/platform-requests' },
                  { label: 'Geofencing', link: 'client/locations/geofencing' },
                  { label: 'Release Notes', link: 'client/locations/release-notes' }
                ]
              },
              {
                label: 'HTTP Transfers',
                items: [
                  { label: 'Getting Started', link: 'client/httptransfers/' },
                  { label: 'Transfers', link: 'client/httptransfers/transfers' },
                  { label: 'Azure Blob Storage', link: 'client/httptransfers/azure' },
                  { label: 'Transfer Delegate', link: 'client/httptransfers/delegate' },
                  { label: 'Monitoring', link: 'client/httptransfers/monitoring' },
                  { label: 'Release Notes', link: 'client/httptransfers/release-notes' }
                ]
              },
              {
                label: 'Local Notifications',
                items:[
                  { label: 'Getting Started', link: 'client/notifications/' },
                  { label: 'Sending Notifications', link: 'client/notifications/sending' },
                  { label: 'Channels', link: 'client/notifications/channels' },
                  { label: 'Platform Specific', link: 'client/notifications/platform' },
                  { label: 'Scheduling & Triggers', link: 'client/notifications/scheduling' },
                  { label: 'Release Notes', link: 'client/notifications/release-notes' }
                ]
              },
              {
                label: 'Push Notifications',
                items:[
                    { label: 'Getting Started', link: 'client/push/' },
                    { label: 'Native', link: 'client/push/native' },
                    { label: 'Platform Specific', link: 'client/push/platform' },
                    { label: 'Azure Push Notifications', link: 'client/push/azure' },
                    { label: 'Firebase (iOS)', link: 'client/push/firebase-ios' },
                    { label: 'FAQ', link: 'client/push/faq' },
                    { label: 'Release Notes', link: 'client/push/release-notes' }
                ]
              },
 {
                label: 'OBD',
                items: [
                  { label: 'Getting Started', link: 'client/obd' },
                  { label: 'Commands', link: 'client/obd/commands' },
                  { label: 'Connection & Adapters', link: 'client/obd/connection' },
                  { label: 'BLE Transport', link: 'client/obd/ble' },
                  { label: 'Custom Transports', link: 'client/obd/transports' },
                  { label: 'Release Notes', link: 'client/obd/release-notes' }
                ]
              },

              {
                label: 'Music',
                items: [
                  { label: 'Getting Started', link: 'client/music/' },
                  { label: 'Permissions', link: 'client/music/permissions' },
                  { label: 'Querying Music', link: 'client/music/querying' },
                  { label: 'Playback', link: 'client/music/playback' },
                  { label: 'Copying Tracks', link: 'client/music/copying' },
                  { label: 'Release Notes', link: 'client/music/release-notes' }
                ]
              },              
              {
                label: 'Configuration',
                items: [
                  { label: 'Getting Started', link: 'client/configuration/' },
                  { label: 'JSON Platform Bundle', link: 'client/configuration/json' },
                  { label: 'Platform Preferences', link: 'client/configuration/preferences' },
                  { label: 'Remote Configuration', link: 'client/configuration/remote' },
                  { label: 'Release Notes', link: 'client/configuration/release-notes' }
                ]
              },
              {
                label: 'MSBuild Permissions',
                items: [
                  { label: 'Getting Started', link: 'client/permissions/' },
                  { label: 'Android', link: 'client/permissions/android' },
                  { label: 'iOS', link: 'client/permissions/ios' }
                ]
              },
              {
                label: 'Other',
                items: [
                  { label: 'Stateful Services', link: 'client/other/statefulservices' },
                  { label: 'Startup Services', link: 'client/other/startupservices' },
                  { label: 'Lifecycle Hooks', link: 'client/other/lifecyclehooks' },
                  { label: 'Android Foreground Service', link: 'client/other/androidforeground' },
                ]
              },
              { label: 'Core Release Notes', link: 'client/release-notes' }
            ],
          },
          {
            label: 'Mediator',
            link: '/mediator/',
            icon: 'puzzle',
            items:[
              {
                  label: 'General',
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
            label: 'MAUI',
            link: '/maui/shell/',
            icon: 'laptop',
            items:[
              {
                label: 'Shell',
                items:[
                  { label: 'Getting Started', link: 'maui/shell/' },
                  { label: 'Navigation', link: 'maui/shell/navigation' },
                  { label: 'Dialogs', link: 'maui/shell/dialogs' },
                  { label: 'ViewModel Lifecycle', link: 'maui/shell/lifecycle' },
                  { label: 'Source Generation', link: 'maui/shell/sourcegen' },
                  { label: 'Release Notes', link: 'maui/shell/release-notes' }
                ]
              },
              {
                label: 'Contact Store',
                items:[
                  { label: 'Getting Started', link: 'maui/contactstore/' },
                  { label: 'Permissions', link: 'maui/contactstore/permissions' },
                  { label: 'Querying', link: 'maui/contactstore/querying' },
                  { label: 'Release Notes', link: 'maui/contactstore/release-notes' }
                ]
              },
              {
                label: 'Templates',
                items:[
                  { label: 'Getting Started', link: 'maui/templates/' },
                  { label: 'Shiny Libraries', link: 'maui/templates/shiny-libraries' },
                  { label: '3rd Party Libraries', link: 'maui/templates/third-party' },
                  { label: 'Release Notes', link: 'maui/templates/release-notes' }
                ]
              }
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
                ]
              },
              { label: 'SheetView', link: 'controls/sheetview/' },
              { label: 'Fab & FabMenu', link: 'controls/fab/' },
              { label: 'PillView', link: 'controls/pillview/' },
              { label: 'SecurityPin', link: 'controls/securitypin/' },
              { label: 'ImageViewer', link: 'controls/imageviewer/' },
              { label: 'ImageEditor', link: 'controls/imageeditor/' },
              { label: 'ChatView', link: 'controls/chatview/' },
              { label: 'Markdown', link: 'controls/markdown/' },
              {
                label: 'Mermaid Diagrams',
                items:[
                  { label: 'Getting Started', link: 'controls/mermaid-diagrams/' },
                  { label: 'Control Properties', link: 'controls/mermaid-diagrams/control' },
                  { label: 'Theming', link: 'controls/mermaid-diagrams/theming' },
                ]
              },
              { label: 'Release Notes', link: 'controls/release-notes' }
            ]
          },
          {
            label: 'Data',
            link: '/data/documentdb/',
            icon: 'document',
            items:[
              {
                label: 'Document DB',
                items:[
                  { label: 'Getting Started', link: 'data/documentdb/' },
                  { label: 'AOT Setup', link: 'data/documentdb/aot' },
                  { label: 'CRUD Operations', link: 'data/documentdb/crud' },
                  { label: 'Querying', link: 'data/documentdb/querying' },
                  { label: 'Projections & Streaming', link: 'data/documentdb/projections' },
                  { label: 'Aggregates', link: 'data/documentdb/aggregates' },
                  { label: 'Indexes & Transactions', link: 'data/documentdb/indexes' },
                  { label: 'SQLCipher (Encrypted)', link: 'data/documentdb/sqlcipher' },
                  { label: 'Release Notes', link: 'data/documentdb/release-notes' }
                ]
              },
              {
                label: 'Spatial',
                items:[
                  { label: 'Getting Started', link: 'data/spatial/' },
                  { label: 'Geometry Types', link: 'data/spatial/geometry' },
                  { label: 'Database Operations', link: 'data/spatial/database' },
                  { label: 'Querying', link: 'data/spatial/queries' },
                  { label: 'Algorithms & Serialization', link: 'data/spatial/algorithms' },
                  { label: 'Pre-built Databases', link: 'data/spatial/prebuilt' },
                  { label: 'Geofencing', link: 'data/spatial/geofencing' },
                  { label: 'Release Notes', link: 'data/spatial/release-notes' }
                ]
              }
            ]
          },
          {
            label: 'Extensions',
            link: '/extensions/reflector/',
            icon: 'setting',
            items:[
              {
                label: 'Reflector',
                items:[
                  { label: 'Getting Started', link: 'extensions/reflector/' },
                  { label: 'JSON Serialization', link: 'extensions/reflector/json' },
                  { label: 'Assembly Info', link: 'extensions/reflector/assembly-info' },
                  { label: 'Configuration', link: 'extensions/reflector/configuration' },
                  { label: 'Release Notes', link: 'extensions/reflector/release-notes' }
                ]
              },
              {
                label: 'Dependency Injection',
                items:[
                  { label: 'Getting Started', link: 'extensions/di/' },
                  { label: 'Advanced Registration', link: 'extensions/di/advanced' },
                  { label: 'Categories', link: 'extensions/di/categories' },
                  { label: 'Configuration', link: 'extensions/di/configuration' },
                  { label: 'Release Notes', link: 'extensions/di/release-notes' }
                ]
              },
              {
                label: 'Stores',
                items:[
                  { label: 'Getting Started', link: 'extensions/stores/' },
                  { label: 'Persistent Services', link: 'extensions/stores/persistent-services' },
                  { label: 'Release Notes', link: 'extensions/stores/release-notes' }
                ]
              },
              {
                label: 'Localization Generator',
                items:[
                  { label: 'Getting Started', link: 'extensions/localizegen/' },
                  { label: 'Usage Examples', link: 'extensions/localizegen/usage' },
                  { label: 'Release Notes', link: 'extensions/localizegen/release-notes' }
                ]
              },
              {
                label: 'Web Hosting',
                items:[
                  { label: 'Getting Started', link: 'extensions/webhost/' },
                  { label: 'Release Notes', link: 'extensions/webhost/release-notes' }
                ]
              },
              {
                label: 'MAUI Hosting',
                items:[
                  { label: 'Getting Started', link: 'extensions/mauihost/' },
                  { label: 'Release Notes', link: 'extensions/mauihost/release-notes' }
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
            '/client/hosting/uno',
            '/client/other/androidforeground',
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
