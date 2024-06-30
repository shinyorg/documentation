import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import starlightBlog from 'starlight-blog';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
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
                { 
                    label: 'Middleware', 
                    items:[
                      { label: 'Introduction', link: 'client/mediator/middleware/' },
                      { label: 'REQUESTS - Caching', link: 'client/mediator/middleware/caching' },
                      { label: 'REQUESTS - Resiliency', link: 'client/mediator/middleware/resilience' },
                      { label: 'REQUESTS - Offline', link: 'client/mediator/middleware/offline' },
                      { label: 'REQUESTS - Timed Logging', link: 'client/mediator/middleware/timedlogging' },
                      { label: 'REQUESTS - User Notification Exception Handling', link: 'client/mediator/middleware/usernotifications' },
                      { label: 'REQUESTS/EVENTS - Main Thread', link: 'client/mediator/middleware/mainthread' },
                      { label: 'EVENTS - Exception Handling', link: 'client/mediator/middleware/eventexceptions' },
                      { label: 'STREAMS - Replay', link: 'client/mediator/middleware/replay' },
                      { label: 'STREAMS - Refresh', link: 'client/mediator/middleware/refresh' }
                    ]
                },
                {
                    label: 'Extensions',
                    items:[
                      { label: 'Prism', link: 'client/mediator/extensions/prism' }
                    ]
                },
                { label: 'Advanced', link: 'client/mediator/advanced' }
              ]
            }
          ],
        },
        {
          label: 'Server',
          items:[
              { label: 'Introduction', link: 'server' },
              { label: 'Email', link: 'server/email' },
              { label: 'Push Management', link: 'server/push' }
          ]
        },
        {
          label: 'Releases',
          items:[
            {
              label: 'Client',
              items:[
                { label: 'v4.0', link: 'release-notes/client/v40' },
                { label: 'v3.0', link: 'release-notes/client/v30' },
              ]
            },
            {
              label: 'Mediator',
              items:[
                { label: 'v1.0', link: 'release-notes/mediator/v10' }
              ]
            },
            {
              label: 'Framework',
              items:[
                { label: 'v4.0', link: 'release-notes/framework/v40' }
              ]
            },
            {
              label: 'Server',
              items:[
                { label: 'v2.0', link: 'release-notes/client/v20' },
              ]
            }
          ]
        }
      ],
    }),
  ],
});