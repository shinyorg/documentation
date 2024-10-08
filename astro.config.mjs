import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import starlightBlog from 'starlight-blog';
// import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import expressiveCode from "astro-expressive-code";
// import rehypeMermaid from "rehype-mermaid";

export default defineConfig({
  // markdown: {
  //   rehypePlugins: [rehypeMermaid],
  // },
  integrations: [
    react(),
    // tailwind(),
    expressiveCode(), 
    mdx(),
    starlight({
      title: 'Shiny.NET',
      // tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },
      editLink: {
        baseUrl: 'https://github.com/shinyorg/documentation/edit/main/'
      },
      logo: {
        src: '/src/assets/logo.svg',
      },
      social: {
        github: 'https://github.com/shinyorg',
        twitter: 'https://twitter.com/shinydotnet'
      },
      plugins:[
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
      ],
      sidebar: [
        {
          label: 'Client',
          items: [
            { label: 'App Builder', link: 'client/appbuilder' },
            { label: 'Architecture', link: 'client/architecture' },
            { label: 'Logging', link: 'client/logging' },
            {
              label: 'Hosting Models',
              items:[
                { label: 'MAUI', link: 'client/hosting/maui' },
                { label: 'Native', link: 'client/hosting/native' },
                // { label: 'Uno Platform', link: 'client/hosting/uno' },
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
            {
              label: 'Mediator',
              items:[
                { label: 'Introduction', link: 'client/mediator/' },
                { label: 'Quick Start', link: 'client/mediator/quick-start' },
                { label: 'Requests', link: 'client/mediator/requests' },
                { label: 'Streams', link: 'client/mediator/streams' },
                { label: 'Events', link: 'client/mediator/events' },
                { label: 'Request Keys', link: 'client/mediator/requestkeys' },
                { label: 'Execution Context', link: 'client/mediator/context' },
                { label: 'Advanced', link: 'client/mediator/advanced' },
                { label: 'FAQ', link: 'client/mediator/faq' },
                { 
                    label: 'Middleware', 
                    items:[
                      { label: 'Introduction', link: 'client/mediator/middleware/' },
                      { label: 'REQUESTS - Validation', link: 'client/mediator/middleware/validation' },
                      { label: 'REQUESTS - Caching', link: 'client/mediator/middleware/caching' },
                      { label: 'REQUESTS - Resiliency', link: 'client/mediator/middleware/resilience' },
                      { label: 'REQUESTS - Offline', link: 'client/mediator/middleware/offline' },
                      { label: 'REQUESTS - Performance Logging', link: 'client/mediator/middleware/performancelogging' },
                      { label: 'REQUESTS - User Notification Exception Handling', link: 'client/mediator/middleware/usererrornotifications' },
                      { label: 'REQUESTS/EVENTS - Main Thread', link: 'client/mediator/middleware/mainthread' },
                      { label: 'EVENTS - Exception Handling', link: 'client/mediator/middleware/eventexceptions' },
                      { label: 'STREAMS - Replay', link: 'client/mediator/middleware/replay' },
                      { label: 'STREAMS - Refresh', link: 'client/mediator/middleware/refresh' }
                    ]
                },
                {
                    label: 'Extensions',
                    items:[
                      { label: 'HTTP', link: 'client/mediator/extensions/http' },
                      { label: 'Prism', link: 'client/mediator/extensions/prism' },
                      { label: 'ASP.NET Core', link: 'client/mediator/extensions/aspnet' }
                    ]
                },
              ]
            }
          ],
        },
        {
          label: 'Server',
          items:[
              { label: 'Introduction', link: 'server' },
              { label: 'Email', link: 'server/email' },
              { label: 'Push Management', link: 'server/push' },
              { label: 'Entity Framework', link: 'server/ef' },
              { label: 'Web Hosting', link: 'server/webhosting' }
          ]
        },
        {
          label: 'Releases',
          items:[
            {
              label: 'Client',
              link: 'release-notes/client'
            },
            {
              label: 'Mediator',
              link: 'release-notes/mediator'
            },
            {
              label: 'Framework',
              link: 'release-notes/framework'
            },
            {
              label: 'Server',
              link: 'release-notes/client'
            }
          ]
        }
      ],
    }),
  ],
});