/**
 * Shared sidebar topics configuration.
 * Used by both astro.config.mjs (for navigation) and the JumpTo component (for the homepage dropdown).
 *
 * Add `jumpTo: true` to any item that should appear in the homepage "Jump to a library…" dropdown.
 * The item's `label` is used as the display text, and its `link` (or first child link) is used as the URL.
 */
export const sidebarTopics = [
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
    label: 'App Essentials',
    link: '/mauishell/',
    icon: 'rocket',
    items: [
      {
        label: 'MAUI Shell',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'mauishell/' },
          { label: 'Navigation', link: 'mauishell/navigation' },
          { label: 'Dialogs', link: 'mauishell/dialogs' },
          { label: 'ViewModel Lifecycle', link: 'mauishell/lifecycle' },
          { label: 'Source Generation', link: 'mauishell/sourcegen' },
          { label: 'AI Integration', link: 'mauishell/ai' },
          { label: 'Release Notes', link: 'mauishell/release-notes' }
        ]
      },
      {
        label: 'Jobs',
        jumpTo: true,
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
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'httptransfers/' },
          { label: 'Transfers', link: 'httptransfers/transfers' },
          { label: 'Azure Blob Storage', link: 'httptransfers/azure' },
          { label: 'AWS S3', link: 'httptransfers/aws-s3' },
          { label: 'Transfer Delegate', link: 'httptransfers/delegate' },
          { label: 'Monitoring', link: 'httptransfers/monitoring' },
          { label: 'Release Notes', link: 'httptransfers/release-notes' }
        ]
      },
      {
        label: 'Local Notifications',
        jumpTo: true,
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
        jumpTo: true,
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
        jumpTo: true,
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
        jumpTo: true,
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
        label: 'Data Sync',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'datasync/' },
          { label: 'Entity Registration', link: 'datasync/entity-registration' },
          { label: 'Removal Strategies', link: 'datasync/removal-strategies' },
          { label: 'Sync Interceptor', link: 'datasync/sync-interceptor' },
          { label: 'Server API Contracts', link: 'datasync/server-contracts' },
          { label: 'Release Notes', link: 'datasync/release-notes' }
        ]
      },
      {
        label: 'Templates',
        jumpTo: true,
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
        jumpTo: true,
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
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'blehosting/' },
          { label: 'GATT Service', link: 'blehosting/gatt' },
          { label: 'Release Notes', link: 'blehosting/release-notes' }
        ]
      },
      {
        label: 'OBD',
        jumpTo: true,
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
        jumpTo: true,
        items:[
          { label: 'GPS', link: 'locations/gps' },
          { label: 'Platform GPS Requests', link: 'locations/platform-requests' },
          { label: 'Geofencing', link: 'locations/geofencing' },
          { label: 'Motion Activity', link: 'locations/motionactivity' },
          { label: 'Release Notes', link: 'locations/release-notes' }
        ]
      },
      {
        label: 'Speech',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'speech/' },
          { label: 'Azure AI Speech', link: 'speech/azure' },
          { label: 'ElevenLabs', link: 'speech/elevenlabs' },
          { label: 'Custom Provider', link: 'speech/custom-provider' },
          { label: 'Release Notes', link: 'speech/release-notes' }
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
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'music/' },
          { label: 'Permissions', link: 'music/permissions' },
          { label: 'Querying Music', link: 'music/querying' },
          { label: 'Playback', link: 'music/playback' },
          { label: 'Lyrics', link: 'music/lyrics' },
          { label: 'Album Art', link: 'music/album-art' },
          { label: 'Copying Tracks', link: 'music/copying' },
          { label: 'Song Identification', link: 'music/identification' },
          { label: 'Music Management', link: 'music/management' },
          { label: 'Release Notes', link: 'music/release-notes' }
        ]
      },
      {
        label: 'Health',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'health/' },
          { label: 'Reading Data', link: 'health/reading' },
          { label: 'Writing Data', link: 'health/writing' },
          { label: 'Observing Data', link: 'health/observing' },
          { label: 'Platform Notes', link: 'health/platform-notes' },
          { label: 'Release Notes', link: 'health/release-notes' }
        ]
      },
      {
        label: 'Contact Store',
        jumpTo: true,
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
        jumpTo: true,
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
        jumpTo: true,
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
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/chatview/' },
          { label: 'Data Models', link: 'controls/chatview/data-models' },
          { label: 'Properties & Commands', link: 'controls/chatview/configuration' },
        ]
      },
      {
        label: 'ImageEditor',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/imageeditor/' },
          { label: 'Properties & Commands', link: 'controls/imageeditor/properties' },
          { label: 'Save & Export', link: 'controls/imageeditor/save-export' },
        ]
      },
      {
        label: 'FloatingPanel',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/floatingpanel/' },
          { label: 'Properties & Events', link: 'controls/floatingpanel/properties' },
          { label: 'Examples', link: 'controls/floatingpanel/examples' },
          { label: 'Blazor Usage', link: 'controls/floatingpanel/blazor' },
        ]
      },
      {
        label: 'Fab & FabMenu',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/fab/' },
          { label: 'Fab', link: 'controls/fab/fab' },
          { label: 'FabMenu', link: 'controls/fab/fabmenu' },
          { label: 'Blazor Usage', link: 'controls/fab/blazor' },
        ]
      },
      {
        label: 'Mermaid Diagrams',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/mermaid-diagrams/' },
          { label: 'Control Properties', link: 'controls/mermaid-diagrams/control' },
          { label: 'Theming', link: 'controls/mermaid-diagrams/theming' },
          { label: 'Blazor Usage', link: 'controls/mermaid-diagrams/blazor' },
        ]
      },
      {
        label: 'Input Controls',
        items:[
          { label: 'AutoCompleteEntry', link: 'controls/autocomplete/', jumpTo: true },
          { label: 'CountryPicker', link: 'controls/countrypicker/', jumpTo: true },
          { label: 'AddressEntry', link: 'controls/addressentry/', jumpTo: true },
        ]
      },
      { label: 'Feedback Service', link: 'controls/feedback/', jumpTo: true },
      {
        label: 'Other Controls',
        items:[
          { label: 'ColorPicker', link: 'controls/colorpicker/', jumpTo: true },
          { label: 'FontPicker', link: 'controls/fontpicker/', jumpTo: true },
          { label: 'ImageViewer', link: 'controls/imageviewer/', jumpTo: true },
          { label: 'Markdown', link: 'controls/markdown/', jumpTo: true },
          { label: 'PillView', link: 'controls/pillview/', jumpTo: true },
          { label: 'SecurityPin', link: 'controls/securitypin/', jumpTo: true },
          { label: 'SignaturePad', link: 'controls/signaturepad/', jumpTo: true },
          { label: 'Toast', link: 'controls/toast/', jumpTo: true },
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
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'documentdb/' },
          { label: 'AOT Setup', link: 'documentdb/aot' },
          { label: 'CRUD Operations', link: 'documentdb/crud' },
          { label: 'Querying', link: 'documentdb/querying' },
          { label: 'Projections & Streaming', link: 'documentdb/projections' },
          { label: 'Aggregates', link: 'documentdb/aggregates' },
          { label: 'Indexes & Transactions', link: 'documentdb/indexes' },
          { label: 'Spatial', link: 'documentdb/spatial' },
          { label: 'AI Tools', link: 'documentdb/ai-tools' },
          { label: 'SQLCipher (Encrypted)', link: 'documentdb/sqlcipher' },
          { label: 'Release Notes', link: 'documentdb/release-notes' }
        ]
      },
      {
        label: 'Spatial',
        jumpTo: true,
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
        jumpTo: true,
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
                { label: 'AI Tools', link: 'mediator/extensions/ai' },
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
        jumpTo: true,
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
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'di/' },
          { label: 'AI Tools', link: 'di/ai-tools' },
          { label: 'Advanced Registration', link: 'di/advanced' },
          { label: 'Categories', link: 'di/categories' },
          { label: 'Configuration', link: 'di/configuration' },
          { label: 'Release Notes', link: 'di/release-notes' }
        ]
      },
      {
        label: 'Stores',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'stores/' },
          { label: 'Persistent Services', link: 'stores/persistent-services' },
          { label: 'Release Notes', link: 'stores/release-notes' }
        ]
      },
      {
        label: 'Localization Generator',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'localizegen/' },
          { label: 'Usage Examples', link: 'localizegen/usage' },
          { label: 'Release Notes', link: 'localizegen/release-notes' }
        ]
      },
      {
        label: 'Web Hosting',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'webhost/' },
          { label: 'Release Notes', link: 'webhost/release-notes' }
        ]
      },
      {
        label: 'MAUI Hosting',
        jumpTo: true,
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
        jumpTo: true,
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
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'aspire/gluetun/' },
          { label: 'Configuration', link: 'aspire/gluetun/configuration' },
          { label: 'Container Routing', link: 'aspire/gluetun/routing' },
          { label: 'Release Notes', link: 'aspire/gluetun/release-notes' }
        ]
      }
    ]
  }
];

/**
 * Returns a deep copy of the topics with all `jumpTo` properties removed,
 * so the config passes Starlight's schema validation.
 */
export function cleanTopicsForStarlight(topics) {
  return JSON.parse(JSON.stringify(topics, (key, value) => {
    if (key === 'jumpTo') return undefined;
    return value;
  }));
}

export const sidebarTopicsOptions = {
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
};
