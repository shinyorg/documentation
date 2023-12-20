import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import starlightBlog from 'starlight-blog';

export default defineConfig({
  integrations: [
    react(),
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
    starlight({
      title: 'Shiny.NET',
      // tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },
      components: {
        MarkdownContent: 'starlight-blog/overrides/MarkdownContent.astro',
        Sidebar: 'starlight-blog/overrides/Sidebar.astro',
        ThemeSelect: 'starlight-blog/overrides/ThemeSelect.astro',
      },      
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
                // { label: 'Background Operations', link: 'client/ble/background' },
                { label: 'BLE Manager', link: 'client/ble/manager' },
                { label: 'Peripheral', link: 'client/ble/peripheral' },
                { label: 'Services/Characteristics/Descriptors', link: 'client/ble/gatt' },
                { label: 'Best Practices', link: 'client/ble/best-practices' },
                // { label: 'Async/Await', link: 'client/ble/async' },
                { label: 'FAQ', link: 'client/ble/faq' }
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
                { label: 'Speech Recognition', link: 'client/other/speechrecognition' },
                { label: 'Stateful Services', link: 'client/other/statefulservices' },
                { label: 'Startup Services', link: 'client/other/startupservices' },
                { label: 'Lifecycle Hooks', link: 'client/other/lifecyclehooks' }
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
                { label: 'v3.0', link: 'release-notes/client/v30' },
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