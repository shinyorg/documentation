import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import starlightBlog from 'starlight-blog';
// import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import expressiveCode from "astro-expressive-code";
// import rehypeMermaid from "rehype-mermaid";

// import { defineMiddleware } from "astro:middleware";

// // `context` and `next` are automatically typed
// export const onRequest = defineMiddleware((context, next) => {

// });


export default defineConfig({
  // markdown: {
  //   rehypePlugins: [rehypeMermaid],
  // },
  output: 'static',
  redirects: {
      '/client/mediator/': '/mediator/',
      '/client/mediator/middleware/': '/mediator/middleware/',
      '/client/mediator/extensions/': '/mediator/extensions/',
      '/release-notes/client/v30/' : '/release-notes/client/'
  },
  integrations: [
    react(),
    // tailwind(),
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
      // tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },
      editLink: {
        baseUrl: 'https://github.com/shinyorg/documentation/edit/main/'
      },
      logo: {
        src: '/src/assets/logo.svg',
      },
      customCss: ['/src/styles/custom.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/shinyorg' },
        { icon: 'blueSky', label: 'BlueSky', href: 'https://bsky.app/profile/shinydotnet.bsky.social' },
        { icon: 'x.com', label: 'X', href: 'https://x.com/shinydotnet' }
      ],
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
                label: 'MAUI Shell',
                items:[
                  { label: 'Getting Started', link: 'client/maui/' }
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
            } 
          ],
        },
        {
          label: 'Mediator',
          items:[
            { label: 'Introduction', link: 'mediator/' },
            { label: 'Getting Started', link: 'mediator/getting-started' },
            { label: 'Requests', link: 'mediator/requests' },
            { label: 'Commands', link: 'mediator/commands' },
            { label: 'Streams', link: 'mediator/streams' },
            { label: 'Events', link: 'mediator/events' },
            { label: 'Exception Handling', link: 'mediator/exceptionhandlers' },
            { label: 'Request Keys', link: 'mediator/requestkeys' },
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
                  { label: 'Command Scheduling', link: 'mediator/middleware/scheduling' }
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
          ]
        },
        {
          label: 'Extensions',
          items:[
            { label: 'Reflector', link: 'extensions/reflector' },
            { label: 'Dependency Injection', link: 'extensions/di' },
            { label: 'Stores', link: 'extensions/stores' },
            { label: 'Localization Generator', link: 'extensions/localizegen' }
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
              label: 'Extensions',
              link: 'release-notes/extensions'
            }
          ]
        }
      ],
    }),
  ],
});