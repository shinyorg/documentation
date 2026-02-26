import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import starlightBlog from 'starlight-blog';
import mdx from '@astrojs/mdx';
import expressiveCode from "astro-expressive-code";
import starlightDocSearch from '@astrojs/starlight-docsearch';
import starlightSidebarTopics from 'starlight-sidebar-topics';

const googleAnalyticsId = 'G-SZKGGX6M5W';


export default defineConfig({
  site: 'https://www.shinylib.net',
  output: 'static',
  redirects: {
      '/client/mediator/': '/mediator/',
      '/client/mediator/middleware/': '/mediator/middleware/',
      '/client/mediator/extensions/': '/mediator/extensions/',
      '/release-notes/client/v30/' : '/client/release-notes/',
      '/extensions/sqlite-document-db/': '/data/sqlite-docdb/',
      '/release-notes/client/': '/client/release-notes/',
      '/release-notes/mediator/': '/mediator/release-notes/',
      '/release-notes/spatial/': '/data/spatial/release-notes/',
      '/release-notes/sqlite-documentdb/': '/data/sqlite-docdb/release-notes/',
      '/release-notes/tableview/': '/maui/tableview/release-notes/',
      '/release-notes/templates/': '/maui/tableview/release-notes-templates/',
      '/release-notes/extensions/': '/extensions/release-notes/',
      '/release-notes/aspire/': '/aspire/release-notes/',

      '/client/maui/': '/maui/shell/',
      '/client/maui/navigation': '/maui/shell/navigation',
      '/client/maui/lifecycle': '/maui/shell/lifecycle',
      '/client/maui/sourcegen': '/maui/shell/sourcegen',
      '/tableview/': '/maui/tableview/',
      '/tableview/cells': '/maui/tableview/cells',
      '/tableview/sections': '/maui/tableview/sections',
      '/tableview/styling': '/maui/tableview/styling',
      '/tableview/advanced': '/maui/tableview/advanced',
      '/tableview/release-notes': '/maui/tableview/release-notes',
      '/tableview/release-notes-templates': '/maui/tableview/release-notes-templates',

      '/sqlite-docdb/': '/data/sqlite-docdb/',
      '/sqlite-docdb/aot': '/data/sqlite-docdb/aot',
      '/sqlite-docdb/crud': '/data/sqlite-docdb/crud',
      '/sqlite-docdb/querying': '/data/sqlite-docdb/querying',
      '/sqlite-docdb/projections': '/data/sqlite-docdb/projections',
      '/sqlite-docdb/aggregates': '/data/sqlite-docdb/aggregates',
      '/sqlite-docdb/indexes': '/data/sqlite-docdb/indexes',
      '/sqlite-docdb/release-notes': '/data/sqlite-docdb/release-notes',
      '/spatial/': '/data/spatial/',
      '/spatial/geometry': '/data/spatial/geometry',
      '/spatial/database': '/data/spatial/database',
      '/spatial/queries': '/data/spatial/queries',
      '/spatial/algorithms': '/data/spatial/algorithms',
      '/spatial/prebuilt': '/data/spatial/prebuilt',
      '/spatial/release-notes': '/data/spatial/release-notes',
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
      plugins:[
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
              url: 'https://allanritchie.com',
            }
          }
        }),
        starlightSidebarTopics([
          {
            id: 'client',
            label: 'Client',
            link: '/client/appbuilder/',
            icon: 'rocket',
            items: [
              { label: 'Getting Started', link: 'client/getting-started' },
              { label: 'App Builder', link: 'client/appbuilder' },
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
                  { label: 'Best Practice/FAQ', link: 'client/ble/best-practices' }
                ]
              },
              {
                label: 'BluetoothLE Hosting',
                items: [
                  { label: 'Getting Started', link: 'client/blehosting' },
                  { label: 'GATT Service', link: 'client/blehosting/gatt' }
                ]
              },
              {
                label: 'Jobs',
                items:[
                  { label: 'Getting Started', link: 'client/jobs/' },
                  { label: 'Create a Job', link: 'client/jobs/create' },
                  { label: 'Additional Functions', link: 'client/jobs/functions' },
                  { label: 'Testing', link: 'client/jobs/testing' },
                  { label: 'FAQ', link: 'client/jobs/faq' }
                ]
              },
              {
                label: 'Locations',
                items:[
                  { label: 'GPS', link: 'client/locations/gps' },
                  { label: 'Geofencing', link: 'client/locations/geofencing' }
                ]
              },
              {
                label: 'HTTP Transfers',
                items: [
                  { label: 'How To', link: 'client/httptransfers/' }
                ]
              },
              {
                label: 'Beacons',
                items:[
                  { label: 'Ranging', link: 'client/beacons/ranging' },
                  { label: 'Monitoring', link: 'client/beacons/monitoring' },
                ]
              },
              {
                label: 'Local Notifications',
                items:[
                  { label: 'Getting Started', link: 'client/notifications/' },
                  { label: 'Channels', link: 'client/notifications/channels' }
                ]
              },
              {
                label: 'Push Notifications',
                items:[
                    { label: 'Getting Started', link: 'client/push/' },
                    { label: 'Providers', link: 'client/push/providers/' },
                    { label: 'FAQ', link: 'client/push/faq' }
                ]
              },
              {
                label: 'Other',
                items: [
                  { label: 'Configuration Extensions', link: 'client/other/configuration' },
                  { label: 'Stateful Services', link: 'client/other/statefulservices' },
                  { label: 'Startup Services', link: 'client/other/startupservices' },
                  { label: 'Lifecycle Hooks', link: 'client/other/lifecyclehooks' }
                ]
              },
              { label: 'Release Notes', link: 'client/release-notes' }
            ],
          },
          {
            label: 'Mediator',
            link: '/mediator/',
            icon: 'puzzle',
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
                    { label: 'Event Throttle', link: 'mediator/middleware/throttle' },
                    { label: 'Command Scheduling', link: 'mediator/middleware/scheduling' },
                    { label: 'Middleware Ordering', link: 'mediator/middleware/ordering' }
                  ]
              },
              {
                  label: 'Extensions',
                  items:[
                    { label: 'MAUI', link: 'mediator/extensions/maui' },
                    { label: 'Blazor', link: 'mediator/extensions/blazor' },
                    { label: 'Uno Platform', link: 'mediator/extensions/unoplatform' },
                    { label: 'ASP.NET Core', link: 'mediator/extensions/aspnet' },
                    { label: 'HTTP', link: 'mediator/extensions/http' },
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
                  { label: 'ViewModel Lifecycle', link: 'maui/shell/lifecycle' },
                  { label: 'Source Generation', link: 'maui/shell/sourcegen' }
                ]
              },
              {
                label: 'TableView',
                items:[
                  { label: 'Getting Started', link: 'maui/tableview/' },
                  { label: 'Cell Types', link: 'maui/tableview/cells' },
                  { label: 'Sections & Dynamic Content', link: 'maui/tableview/sections' },
                  { label: 'Styling', link: 'maui/tableview/styling' },
                  { label: 'Advanced Features', link: 'maui/tableview/advanced' }
                ]
              },

              {
                label: 'Release Notes',
                items:[
                  { label: 'TableView', link: 'maui/tableview/release-notes' },
                  { label: 'Templates', link: 'maui/release-notes-templates' }
                ]
              }
            ]
          },
          {
            label: 'Data',
            link: '/data/sqlite-docdb/',
            icon: 'document',
            items:[
              {
                label: 'SQLite Document DB',
                items:[
                  { label: 'Getting Started', link: 'data/sqlite-docdb/' },
                  { label: 'AOT Setup', link: 'data/sqlite-docdb/aot' },
                  { label: 'CRUD Operations', link: 'data/sqlite-docdb/crud' },
                  { label: 'Querying', link: 'data/sqlite-docdb/querying' },
                  { label: 'Projections & Streaming', link: 'data/sqlite-docdb/projections' },
                  { label: 'Aggregates', link: 'data/sqlite-docdb/aggregates' },
                  { label: 'Indexes & Transactions', link: 'data/sqlite-docdb/indexes' },
                  { label: 'Release Notes', link: 'data/sqlite-docdb/release-notes' }
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
              { label: 'Reflector', link: 'extensions/reflector' },
              { label: 'Dependency Injection', link: 'extensions/di' },
              { label: 'Stores', link: 'extensions/stores' },
              { label: 'Localization Generator', link: 'extensions/localizegen' },
              { label: 'Web Hosting', link: 'extensions/webhost' },
              { label: 'Release Notes', link: 'extensions/release-notes' }
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
                  { label: 'Client', link: 'aspire/orleans/client' }
                ]
              },
              { label: 'Release Notes', link: 'aspire/release-notes' }
            ]
          }
        ], {
          exclude: [
            '/blog',
            '/blog/**/*',
            '/client/hosting/uno',
            '/client/other/androidforeground',
            '/mediator/extensions',
          ],
          topics: {
            client: ['/'],
          },
        }),
      ],
    }),
  ],
});
