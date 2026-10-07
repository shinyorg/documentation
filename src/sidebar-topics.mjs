/**
 * Shared sidebar topics configuration.
 * Used by both astro.config.mjs (for navigation) and the JumpTo component (for the homepage dropdown).
 *
 * Add `jumpTo: true` to any item that should appear in the homepage "Jump to a library…" dropdown.
 * The item's `label` is used as the display text, and its `link` (or first child link) is used as the URL.
 *
 * Add `expandInHomenav: true` to a grouping node (e.g. "Aspire") so the homepage nav
 * panel lists its child libraries instead of the group itself.
 *
 * Add `featuredInHomenav: [{ label, link, note }]` to a *topic* to give it a row of highlighted
 * links at the top of its block in the homepage nav panel — for pages that matter more than their
 * place in the tree suggests (e.g. Theming, which isn't a control and so never appears in the
 * flattened control catalogue).
 *
 * Add `platform: 'maui'` or `platform: 'blazor'` to any item that only exists on that host.
 * `cleanTopicsForStarlight` turns it into a pill in the sidebar — on its own when the item has
 * no other badge, or as a second pill beside an existing one (e.g. `Flyout [New] [MAUI]`).
 * Prefer this over spelling "(MAUI Only)" out in the label.
 *
 * `dateCreated: 'YYYY-MM-DD'` records when an item's page first landed (seeded from git history —
 * the first commit that added the file). It shows as a hover tooltip on the sidebar link.
 *
 * `dateUpdated: 'YYYY-MM-DD'` marks the last *major* change to an item — always set it (a new page
 * starts with `dateUpdated` equal to `dateCreated`). An item is "New" (pill in the sidebar and in the
 * header finder) while its `dateUpdated` falls inside the last `NEW_BADGE_DAYS` days, so a big update
 * brings the pill back. Don't hand-write `badge: { text: 'New' }`; bump `dateUpdated` instead.
 *
 * `showNew: false` hides an item's own pill but its `dateUpdated` still counts toward its parents.
 * Use it when all/most of a library's pages are New at once (e.g. App Device Bridge) so only the
 * library node carries the pill instead of every child.
 *
 * Only libraries are ever New: an item flagged `jumpTo: true`, anything beneath one, or a page listed
 * beside one inside a category group. Site pages (NuGets, Getting Help, AI Skills…), Theming, and
 * category groups (Office, Images…) never get the pill.
 *
 * A group (no `link`) takes its `dateCreated` from its landing page (first child) unless it sets its
 * own, and turns New when it or any descendant (including `showNew: false` ones) has a recent
 * `dateUpdated`.
 */
export const sidebarTopics = [
  {
    id: 'foundation',
    label: 'Foundation',
    link: '/foundation/appbuilder/',
    icon: 'open-book',
    items: [
      { label: 'App Builder', link: 'foundation/appbuilder', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
      { label: 'Architecture', link: 'foundation/architecture', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
      {
        label: 'Hosting Models',
        items:[
          { label: 'Getting Started', link: 'foundation/hosting/', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
          { label: 'MAUI', link: 'foundation/hosting/maui', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
          { label: 'Native', link: 'foundation/hosting/native', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
          { label: 'Manual', link: 'foundation/hosting/manual', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' }
        ]
      },
      {
        label: 'Core',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'client/core/', dateCreated: '2026-09-11', dateUpdated: '2026-09-11' },
          { label: 'Platform', link: 'client/core/platform', dateCreated: '2026-09-11', dateUpdated: '2026-09-11' },
          { label: 'Lifecycle Hooks', link: 'client/core/lifecycle', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Startup Tasks', link: 'client/core/startup', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Device Monitoring', link: 'client/core/device-monitoring', dateCreated: '2026-09-11', dateUpdated: '2026-09-11' },
          { label: 'Access & Permissions', link: 'client/core/permissions', dateCreated: '2026-09-11', dateUpdated: '2026-09-11' },
          { label: 'Android Foreground Service', link: 'client/core/android-foreground', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Utilities', link: 'client/core/utilities', dateCreated: '2026-09-11', dateUpdated: '2026-09-11' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Mediator',
        jumpTo: true,
        items:[
          {
              label: 'General',
              collapsed: true,
              items:[
                { label: 'Introduction', link: 'mediator/', dateCreated: '2024-06-08', dateUpdated: '2024-06-08' },
                { label: 'Getting Started', link: 'mediator/getting-started', dateCreated: '2024-06-08', dateUpdated: '2024-06-08' },
                { label: 'Requests', link: 'mediator/requests', dateCreated: '2024-06-26', dateUpdated: '2024-06-26' },
                { label: 'Commands', link: 'mediator/commands', dateCreated: '2025-01-22', dateUpdated: '2025-01-22' },
                { label: 'Streams', link: 'mediator/streams', dateCreated: '2024-06-26', dateUpdated: '2024-06-26' },
                { label: 'Events', link: 'mediator/events', dateCreated: '2024-06-26', dateUpdated: '2024-06-26' },
                { label: 'Exception Handling', link: 'mediator/exceptionhandlers', dateCreated: '2025-01-29', dateUpdated: '2025-01-29' },
                { label: 'Contract Keys', link: 'mediator/contractkeys', dateCreated: '2024-07-06', dateUpdated: '2024-07-06' },
                { label: 'Source Generation (AOT)', link: 'mediator/sourcegeneration', dateCreated: '2025-10-27', dateUpdated: '2025-10-27' },
                { label: 'Execution Contexts', link: 'mediator/context', dateCreated: '2024-09-28', dateUpdated: '2024-09-28' },
                { label: 'Advanced', link: 'mediator/advanced', dateCreated: '2024-06-09', dateUpdated: '2024-06-09' },
              ]
          },
          {
              label: 'Middleware',
              collapsed: true,
              items:[
                { label: 'Introduction', link: 'mediator/middleware/', dateCreated: '2024-06-08', dateUpdated: '2024-06-08' },
                { label: 'Validation', link: 'mediator/middleware/validation', dateCreated: '2024-07-20', dateUpdated: '2024-07-20' },
                { label: 'Caching', link: 'mediator/middleware/caching', dateCreated: '2024-06-26', dateUpdated: '2024-06-26' },
                { label: 'Resiliency', link: 'mediator/middleware/resilience', dateCreated: '2024-06-26', dateUpdated: '2024-06-26' },
                { label: 'Offline', link: 'mediator/middleware/offline', dateCreated: '2024-06-26', dateUpdated: '2024-06-26' },
                { label: 'Performance Logging', link: 'mediator/middleware/performancelogging', dateCreated: '2024-06-26', dateUpdated: '2024-06-26' },
                { label: 'Main Thread', link: 'mediator/middleware/mainthread', dateCreated: '2024-06-26', dateUpdated: '2024-06-26' },
                { label: 'Replay', link: 'mediator/middleware/replay', dateCreated: '2024-06-26', dateUpdated: '2024-06-26' },
                { label: 'Refresh Timer', link: 'mediator/middleware/refresh', dateCreated: '2024-06-26', dateUpdated: '2024-06-26' },
                { label: 'Event Sample', link: 'mediator/middleware/sample', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
                { label: 'Event Throttle', link: 'mediator/middleware/throttle', dateCreated: '2026-02-08', dateUpdated: '2026-02-08' },
                { label: 'Command Scheduling', link: 'mediator/middleware/scheduling', dateCreated: '2025-01-22', dateUpdated: '2025-01-22' },
                { label: 'Middleware Ordering', link: 'mediator/middleware/ordering', dateCreated: '2026-02-08', dateUpdated: '2026-02-08' }
              ]
          },
          {
              label: 'HTTP',
              collapsed: true,
              items:[
                { label: 'Getting Started', link: 'mediator/http/', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
                { label: 'Request Contracts', link: 'mediator/http/contracts', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
                { label: 'Decorators', link: 'mediator/http/decorators', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
                { label: 'OpenAPI Generation', link: 'mediator/http/openapi', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
                { label: 'Configuration & AOT', link: 'mediator/http/configuration', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
              ]
          },
          {
              label: 'Extensions',
              collapsed: true,
              items:[
                { label: 'AI Tools', link: 'mediator/extensions/ai', dateCreated: '2026-04-27', dateUpdated: '2026-04-27' },
                { label: 'App Functions', link: 'mediator/extensions/appfunctions', dateCreated: '2026-09-30', dateUpdated: '2026-09-30' },
                { label: 'MAUI', link: 'mediator/extensions/maui', dateCreated: '2025-01-22', dateUpdated: '2025-01-22' },
                { label: 'Blazor', link: 'mediator/extensions/blazor', dateCreated: '2025-01-22', dateUpdated: '2025-01-22' },
                { label: 'Uno Platform', link: 'mediator/extensions/unoplatform', dateCreated: '2025-02-08', dateUpdated: '2025-02-08' },
                { label: 'ASP.NET Core', link: 'mediator/extensions/aspnet', dateCreated: '2024-07-05', dateUpdated: '2024-07-05' },
                { label: 'Prism', link: 'mediator/extensions/prism', dateCreated: '2024-06-30', dateUpdated: '2024-06-30' },
                { label: 'Dapper', link: 'mediator/extensions/dapper', dateCreated: '2025-01-22', dateUpdated: '2025-01-22' }
              ]
          },
          { label: 'Blazor Playground', link: 'https://shinyorg.github.io/mediator/', attrs: { target: '_blank' } },
          { label: 'Release Notes', link: 'mediator/release-notes', dateCreated: '2024-06-14', dateUpdated: '2024-06-14' }
        ]
      },
      {
        label: 'Actors',
        jumpTo: true,
        dateUpdated: '2026-10-03',
        items:[
          { label: 'Getting Started', link: 'actors/', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Actors & Lifecycle', link: 'actors/lifecycle', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'State', link: 'actors/state', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Concurrency', link: 'actors/concurrency', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Event Sourcing', link: 'actors/event-sourcing', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Streams', link: 'actors/streams', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Reminders', link: 'actors/reminders', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Filters, Context & Telemetry', link: 'actors/filters', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Remoting', link: 'actors/remoting', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'MAUI & Blazor', link: 'actors/platforms', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Testing', link: 'actors/testing', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Build Diagnostics', link: 'actors/diagnostics', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Release Notes', link: 'actors/release-notes', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' }
        ]
      },
      {
        label: 'Dependency Injection',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'di/', dateCreated: '2025-07-03', dateUpdated: '2025-07-03' },
          { label: 'AI Tools', link: 'di/ai-tools', dateCreated: '2026-04-29', dateUpdated: '2026-04-29' },
          { label: 'Advanced Registration', link: 'di/advanced', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
          { label: 'Categories', link: 'di/categories', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
          { label: 'Configuration', link: 'di/configuration', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
          { label: 'Release Notes', link: 'di/release-notes', dateCreated: '2025-07-03', dateUpdated: '2025-07-03' }
        ]
      },
      {
        label: 'Reflector',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'reflector/', dateCreated: '2025-07-03', dateUpdated: '2025-07-03' },
          { label: 'JSON Serialization', link: 'reflector/json', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
          { label: 'Assembly Info', link: 'reflector/assembly-info', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
          { label: 'Configuration', link: 'reflector/configuration', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
          { label: 'Release Notes', link: 'reflector/release-notes', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' }
        ]
      },
      {
        label: 'Serialization',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'serialization/', dateCreated: '2026-06-07', dateUpdated: '2026-06-07' },
          { label: 'Release Notes', link: 'serialization/release-notes', dateCreated: '2026-06-07', dateUpdated: '2026-06-07' }
        ]
      },
      {
        label: 'Localization Generator',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'localizegen/', dateCreated: '2025-07-03', dateUpdated: '2025-07-03' },
          { label: 'Usage Examples', link: 'localizegen/usage', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
          { label: 'Release Notes', link: 'localizegen/release-notes', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' }
        ]
      },
      { label: 'AI Skills', link: 'foundation/ai-skills', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
      { label: 'Apps & Samples Built with Shiny', link: 'foundation/apps', dateCreated: '2026-06-11', dateUpdated: '2026-06-11' },
      { label: 'NuGets', link: 'foundation/nugets', dateCreated: '2026-09-23', dateUpdated: '2026-09-23' },
      { label: 'Getting Help', link: 'foundation/support', dateCreated: '2026-09-04', dateUpdated: '2026-09-04' },
    ],
  },
  {
    id: 'hardware',
    label: 'Hardware & Connectivity',
    link: '/client/ble/',
    icon: 'link',
    items: [
      {
        label: 'BluetoothLE',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'client/ble/', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'BLE Manager', link: 'client/ble/manager', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Peripheral', link: 'client/ble/peripheral', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Services/Characteristics/Descriptors', link: 'client/ble/gatt', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'L2CAP', link: 'client/ble/l2cap', dateCreated: '2026-05-29', dateUpdated: '2026-05-29' },
          { label: 'Background Operations', link: 'client/ble/background', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Best Practice/FAQ', link: 'client/ble/best-practices', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Blazor Playground', link: 'https://shinyorg.github.io/shiny/', attrs: { target: '_blank' } },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'BluetoothLE Hosting',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'client/blehosting/', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'GATT Service', link: 'client/blehosting/gatt', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Source Generator', link: 'client/blehosting/source-generator', dateCreated: '2026-08-11', dateUpdated: '2026-08-11' },
          { label: 'L2CAP', link: 'client/blehosting/l2cap', dateCreated: '2026-05-29', dateUpdated: '2026-05-29' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'BluetoothLE Hubs',
        jumpTo: true,
        dateUpdated: '2026-10-03',
        items: [
          { label: 'Getting Started', link: 'blehubs/', dateCreated: '2026-10-02', dateUpdated: '2026-10-02' },
          { label: 'Contracts & Source Generator', link: 'blehubs/contracts', dateCreated: '2026-10-02', dateUpdated: '2026-10-02' },
          { label: 'Hosting Hubs', link: 'blehubs/hosting', dateCreated: '2026-10-02', dateUpdated: '2026-10-02' },
          { label: 'Connecting Clients', link: 'blehubs/client', dateCreated: '2026-10-02', dateUpdated: '2026-10-02' },
          { label: 'File Transfers', link: 'blehubs/files', dateCreated: '2026-10-02', dateUpdated: '2026-10-02' },
          { label: 'How It Works', link: 'blehubs/how-it-works', dateCreated: '2026-10-02', dateUpdated: '2026-10-02' },
          { label: 'Release Notes', link: 'blehubs/release-notes', dateCreated: '2026-10-02', dateUpdated: '2026-10-02' }
        ]
      },
      {
        label: 'Beacons',
        jumpTo: true,
        dateUpdated: '2026-09-17',
        items: [
          { label: 'Getting Started', link: 'client/beacons/', dateCreated: '2026-09-09', dateUpdated: '2026-09-09' },
          { label: 'Ranging', link: 'client/beacons/ranging', dateCreated: '2026-09-09', dateUpdated: '2026-09-09' },
          { label: 'Region Monitoring', link: 'client/beacons/monitoring', dateCreated: '2026-09-09', dateUpdated: '2026-09-09' },
          { label: 'Eddystone', link: 'client/beacons/eddystone', dateCreated: '2026-09-09', dateUpdated: '2026-09-09' },
          { label: 'Broadcasting', link: 'client/beacons/broadcasting', dateCreated: '2026-09-09', dateUpdated: '2026-09-09' },
          { label: 'Distance & Accuracy', link: 'client/beacons/distance', dateCreated: '2026-09-09', dateUpdated: '2026-09-09' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'OBD',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'obd/', dateCreated: '2026-03-01', dateUpdated: '2026-03-01' },
          { label: 'Commands', link: 'obd/commands', dateCreated: '2026-03-01', dateUpdated: '2026-03-01' },
          { label: 'Mode 06 Test Results', link: 'obd/mode06', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
          { label: 'VIN Decoding', link: 'obd/vin', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
          { label: 'Connection & Adapters', link: 'obd/connection', dateCreated: '2026-03-01', dateUpdated: '2026-03-01' },
          { label: 'BLE Transport', link: 'obd/ble', dateCreated: '2026-03-01', dateUpdated: '2026-03-01' },
          { label: 'WiFi Transport', link: 'obd/wifi', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
          { label: 'Serial Transport', link: 'obd/serial', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
          { label: 'Custom Transports', link: 'obd/transports', dateCreated: '2026-03-01', dateUpdated: '2026-03-01' },
          { label: 'Adapter Emulator', link: 'obd/emulator', dateCreated: '2026-08-08', dateUpdated: '2026-09-02' },
          { label: 'Release Notes', link: 'obd/release-notes', dateCreated: '2026-03-01', dateUpdated: '2026-03-01' }
        ]
      },
      {
        label: 'Locations',
        jumpTo: true,
        items:[
          { label: 'Architecture', link: 'client/locations/architecture', dateCreated: '2026-06-09', dateUpdated: '2026-06-09' },
          { label: 'GPS', link: 'client/locations/gps', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Platform GPS Requests', link: 'client/locations/platform-requests', dateCreated: '2026-03-28', dateUpdated: '2026-03-28' },
          { label: 'Geofencing', link: 'client/locations/geofencing', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Reverse Geocoding', link: 'client/locations/geocoding', dateCreated: '2026-09-26', dateUpdated: '2026-10-04' },
          { label: 'Motion Activity', link: 'client/locations/motionactivity', dateCreated: '2026-04-23', dateUpdated: '2026-04-23' },
          { label: 'AI Tools', link: 'client/locations/ai-tools', dateCreated: '2026-07-06', dateUpdated: '2026-09-17' },
          { label: 'Blazor Playground', link: 'https://shinyorg.github.io/shiny/', attrs: { target: '_blank' } },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Network Discovery',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'client/discovery/', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
          { label: 'Browsing & Resolving', link: 'client/discovery/browsing', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
          { label: 'Publishing', link: 'client/discovery/publishing', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
          { label: 'SSDP & UPnP', link: 'client/discovery/ssdp', dateCreated: '2026-08-08', dateUpdated: '2026-08-08' },
          { label: 'WS-Discovery & ONVIF', link: 'client/discovery/wsdiscovery', dateCreated: '2026-08-08', dateUpdated: '2026-08-08' },
          { label: 'Platform Setup', link: 'client/discovery/platform', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Wi-Fi',
        jumpTo: true,
        dateUpdated: '2026-09-02',
        items: [
          { label: 'Getting Started', link: 'client/wifi/', dateCreated: '2026-08-20', dateUpdated: '2026-08-20' },
          { label: 'Networks', link: 'client/wifi/networks', dateCreated: '2026-08-20', dateUpdated: '2026-08-20' },
          { label: 'Known Networks', link: 'client/wifi/known-networks', dateCreated: '2026-08-20', dateUpdated: '2026-08-20' },
          { label: 'Hotspot', link: 'client/wifi/hotspot', dateCreated: '2026-08-20', dateUpdated: '2026-08-20' },
          { label: 'Platform Setup', link: 'client/wifi/platform', dateCreated: '2026-08-20', dateUpdated: '2026-08-20' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Wearables',
        jumpTo: true,
        dateUpdated: '2026-09-19',
        items: [
          { label: 'Getting Started', link: 'client/wearables/', dateCreated: '2026-09-18', dateUpdated: '2026-09-18' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Screen Recording',
        jumpTo: true,
        dateUpdated: '2026-09-02',
        items: [
          { label: 'Getting Started', link: 'client/screenrecorder/', dateCreated: '2026-08-31', dateUpdated: '2026-08-31' },
          { label: 'Platform Setup', link: 'client/screenrecorder/platform', dateCreated: '2026-08-31', dateUpdated: '2026-08-31' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Gamepads',
        jumpTo: true,
        dateUpdated: '2026-09-21',
        items: [
          { label: 'Getting Started', link: 'client/gamepad/', dateCreated: '2026-09-20', dateUpdated: '2026-09-20' },
          { label: 'Platform Setup', link: 'client/gamepad/platform', dateCreated: '2026-09-20', dateUpdated: '2026-09-20' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Game Center',
        jumpTo: true,
        dateUpdated: '2026-10-06',
        items: [
          { label: 'Getting Started', link: 'client/gamecenter/', dateCreated: '2026-10-06', dateUpdated: '2026-10-06' },
          { label: 'Platform Setup', link: 'client/gamecenter/platform', dateCreated: '2026-10-06', dateUpdated: '2026-10-06' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Printing',
        jumpTo: true,
        dateUpdated: '2026-10-03',
        items: [
          { label: 'Getting Started', link: 'client/printing/', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Thermal & Receipt Printers', link: 'client/printing/thermal', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Native Printing', link: 'client/printing/native', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Blazor', link: 'client/printing/blazor', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Platform Setup', link: 'client/printing/platform', dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
    ]
  },
  {
    id: 'device-data',
    label: 'Device Data',
    link: '/music/',
    icon: 'mobile-android',
    items: [
      {
        label: 'Music',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'music/', dateCreated: '2026-03-01', dateUpdated: '2026-03-01' },
          { label: 'Permissions', link: 'music/permissions', dateCreated: '2026-03-01', dateUpdated: '2026-03-01' },
          { label: 'Querying Music', link: 'music/querying', dateCreated: '2026-03-01', dateUpdated: '2026-03-01' },
          { label: 'Playback', link: 'music/playback', dateCreated: '2026-03-01', dateUpdated: '2026-03-01' },
          { label: 'Audio Output', link: 'music/output-devices', dateCreated: '2026-07-26', dateUpdated: '2026-07-26' },
          { label: 'Lyrics', link: 'music/lyrics', dateCreated: '2026-04-23', dateUpdated: '2026-04-23' },
          { label: 'Album Art', link: 'music/album-art', dateCreated: '2026-04-23', dateUpdated: '2026-04-23' },
          { label: 'Copying Tracks', link: 'music/copying', dateCreated: '2026-03-01', dateUpdated: '2026-03-01' },
          { label: 'Audio Analysis', link: 'music/analysis', dateCreated: '2026-07-24', dateUpdated: '2026-07-24' },
          { label: 'AI Tools', link: 'music/ai-tools', dateCreated: '2026-07-07', dateUpdated: '2026-07-07' },
          { label: 'Release Notes', link: 'music/release-notes', dateCreated: '2026-03-01', dateUpdated: '2026-03-01' }
        ]
      },
      {
        label: 'Health',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'health/', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
          { label: 'Reading Data', link: 'health/reading', dateCreated: '2026-04-23', dateUpdated: '2026-04-23' },
          { label: 'Writing Data', link: 'health/writing', dateCreated: '2026-04-23', dateUpdated: '2026-04-23' },
          { label: 'Observing Data', link: 'health/observing', dateCreated: '2026-04-27', dateUpdated: '2026-04-27' },
          { label: 'AI Tools', link: 'health/ai-tools', dateCreated: '2026-06-15', dateUpdated: '2026-06-15' },
          { label: 'Platform Notes', link: 'health/platform-notes', dateCreated: '2026-04-23', dateUpdated: '2026-04-23' },
          { label: 'Release Notes', link: 'health/release-notes', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' }
        ]
      },
      {
        label: 'In-App Purchases',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'client/inapppurchases/', dateCreated: '2026-09-15', dateUpdated: '2026-10-04' },
          { label: 'Store Setup', link: 'client/inapppurchases/store-setup', dateCreated: '2026-09-15', dateUpdated: '2026-10-04' },
          { label: 'Server', link: 'client/inapppurchases/server', dateCreated: '2026-09-15', dateUpdated: '2026-10-04' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Contact Store',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'client/contactstore/', dateCreated: '2026-03-24', dateUpdated: '2026-03-24' },
          { label: 'Permissions', link: 'client/contactstore/permissions', dateCreated: '2026-03-24', dateUpdated: '2026-03-24' },
          { label: 'Querying', link: 'client/contactstore/querying', dateCreated: '2026-03-24', dateUpdated: '2026-03-24' },
          { label: 'AI Tools', link: 'client/contactstore/ai-tools', dateCreated: '2026-07-06', dateUpdated: '2026-09-17' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Calendar Store',
        jumpTo: true,
        dateUpdated: '2026-09-02',
        items:[
          { label: 'Getting Started', link: 'client/calendarstore/', dateCreated: '2026-07-24', dateUpdated: '2026-07-24' },
          { label: 'Permissions', link: 'client/calendarstore/permissions', dateCreated: '2026-07-24', dateUpdated: '2026-07-24' },
          { label: 'Querying', link: 'client/calendarstore/querying', dateCreated: '2026-07-24', dateUpdated: '2026-07-24' },
          { label: 'AI Tools', link: 'client/calendarstore/ai-tools', dateCreated: '2026-07-24', dateUpdated: '2026-09-17' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
    ]
  },
  {
    id: 'ai',
    label: 'AI & Intelligence',
    link: '/aiconversation/',
    icon: 'star',
    items: [
      {
        label: 'AI Conversations',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'aiconversation/', dateCreated: '2026-05-06', dateUpdated: '2026-05-06' },
          { label: 'Architecture', link: 'aiconversation/architecture', dateCreated: '2026-06-09', dateUpdated: '2026-06-09' },
          { label: 'Chat Client Provider', link: 'aiconversation/chat-client-provider', dateCreated: '2026-05-06', dateUpdated: '2026-05-06' },
          { label: 'Message Store', link: 'aiconversation/message-store', dateCreated: '2026-05-06', dateUpdated: '2026-05-06' },
          { label: 'Acknowledgements & Sound', link: 'aiconversation/acknowledgements', dateCreated: '2026-05-06', dateUpdated: '2026-05-06' },
          { label: 'Structured Turns & Questions', link: 'aiconversation/structured-turns', dateCreated: '2026-07-31', dateUpdated: '2026-07-31' },
          { label: 'Wake Word', link: 'aiconversation/wake-word', dateCreated: '2026-05-06', dateUpdated: '2026-05-06' },
          { label: 'AI Tools', link: 'aiconversation/ai-tools', dateCreated: '2026-05-06', dateUpdated: '2026-05-06' },
          { label: 'MAUI Chat UI', link: 'aiconversation/chat-view', dateCreated: '2026-07-31', dateUpdated: '2026-07-31' },
          { label: 'Blazor Playground', link: 'https://shinyorg.github.io/speech/', attrs: { target: '_blank' } },
        ]
      },
      {
        label: 'Speech',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'speech/', dateCreated: '2026-05-02', dateUpdated: '2026-05-02' },
          { label: 'Architecture', link: 'speech/architecture', dateCreated: '2026-06-09', dateUpdated: '2026-06-09' },
          { label: 'Audio (Monitor & Devices)', link: 'speech/audio', dateCreated: '2026-07-09', dateUpdated: '2026-07-09' },
          { label: 'Effects & Recording', link: 'speech/audio-effects', dateCreated: '2026-08-02', dateUpdated: '2026-08-02' },
          { label: 'Emotion & Tone', link: 'speech/emotion', dateCreated: '2026-08-05', dateUpdated: '2026-08-05' },
          { label: 'Azure AI Speech', link: 'speech/azure', dateCreated: '2026-05-02', dateUpdated: '2026-05-02' },
          { label: 'ElevenLabs', link: 'speech/elevenlabs', dateCreated: '2026-05-02', dateUpdated: '2026-05-02' },
          { label: 'OpenAI', link: 'speech/openai', dateCreated: '2026-05-11', dateUpdated: '2026-05-11' },
          { label: 'Typecast', link: 'speech/typecast', dateCreated: '2026-07-05', dateUpdated: '2026-07-05' },
          { label: 'Microsoft.Extensions.AI', link: 'speech/microsoft-ai', dateCreated: '2026-05-11', dateUpdated: '2026-05-11' },
          { label: 'Whisper (Linux, On-Device)', link: 'speech/whisper', dateCreated: '2026-07-30', dateUpdated: '2026-07-30' },
          { label: 'Custom Provider', link: 'speech/custom-provider', dateCreated: '2026-05-02', dateUpdated: '2026-05-02' },
          { label: 'Blazor Playground', link: 'https://shinyorg.github.io/speech/', attrs: { target: '_blank' } },
          { label: 'Release Notes', link: 'speech/release-notes', dateCreated: '2026-05-02', dateUpdated: '2026-05-02' }
        ]
      },
      {
        label: 'Face Intelligence',
        jumpTo: true,
        dateUpdated: '2026-09-02',
        items: [
          { label: 'Getting Started', link: 'faceintelligence/', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'Architecture', link: 'faceintelligence/architecture', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'Enrollment', link: 'faceintelligence/enrollment', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'Recognition & Tuning', link: 'faceintelligence/recognition', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'MAUI Controls', link: 'faceintelligence/controls', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'ONNX Models', link: 'faceintelligence/models', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'Stores', link: 'faceintelligence/stores', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'Release Notes', link: 'faceintelligence/release-notes', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' }
        ]
      },
      {
        label: 'Voice Intelligence',
        jumpTo: true,
        dateUpdated: '2026-09-02',
        items: [
          { label: 'Getting Started', link: 'voiceintelligence/', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'Guided Enrollment', link: 'voiceintelligence/enrollment', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'Recognition & Tuning', link: 'voiceintelligence/recognition', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'Audio Capture', link: 'voiceintelligence/capture', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'MAUI Control', link: 'voiceintelligence/controls', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'ONNX Models', link: 'voiceintelligence/models', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'Release Notes', link: 'voiceintelligence/release-notes', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' }
        ]
      },
      {
        label: 'Document Intelligence',
        jumpTo: true,
        dateUpdated: '2026-09-02',
        items: [
          { label: 'Getting Started', link: 'documentintelligence/', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'Scanning', link: 'documentintelligence/scanning', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'Extraction', link: 'documentintelligence/extraction', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'Release Notes', link: 'documentintelligence/release-notes', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' }
        ]
      },
    ]
  },
  {
    id: 'background',
    label: 'Background & Delivery',
    link: '/client/jobs/',
    icon: 'clock',
    items: [
      {
        label: 'Jobs',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'client/jobs/', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Architecture', link: 'client/jobs/architecture', dateCreated: '2026-06-09', dateUpdated: '2026-06-09' },
          { label: 'Create a Job', link: 'client/jobs/create', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Managing Jobs', link: 'client/jobs/managing', dateCreated: '2026-03-26', dateUpdated: '2026-03-26' },
          { label: 'FAQ', link: 'client/jobs/faq', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Local Notifications',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'client/notifications/', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Sending Notifications', link: 'client/notifications/sending', dateCreated: '2026-03-26', dateUpdated: '2026-03-26' },
          { label: 'Channels', link: 'client/notifications/channels', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Platform Specific', link: 'client/notifications/platform', dateCreated: '2026-03-28', dateUpdated: '2026-03-28' },
          { label: 'Scheduling & Triggers', link: 'client/notifications/scheduling', dateCreated: '2026-03-26', dateUpdated: '2026-03-26' },
          { label: 'AI Tools', link: 'client/notifications/ai-tools', dateCreated: '2026-07-06', dateUpdated: '2026-09-17' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Push Notifications',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'client/push/', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Architecture', link: 'client/push/architecture', dateCreated: '2026-06-09', dateUpdated: '2026-06-09' },
          { label: 'Native', link: 'client/push/native', dateCreated: '2026-03-27', dateUpdated: '2026-03-27' },
          { label: 'Platform Specific', link: 'client/push/platform', dateCreated: '2026-03-28', dateUpdated: '2026-03-28' },
          { label: 'Azure Push Notifications', link: 'client/push/azure', dateCreated: '2026-03-27', dateUpdated: '2026-03-27' },
          { label: 'Firebase (iOS)', link: 'client/push/firebase-ios', dateCreated: '2026-03-27', dateUpdated: '2026-03-27' },
          { label: 'FAQ', link: 'client/push/faq', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Blazor Playground', link: 'https://shinyorg.github.io/shiny/', attrs: { target: '_blank' } },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Live Activities',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'client/liveactivities/', dateCreated: '2026-07-31', dateUpdated: '2026-09-17' },
          { label: 'iOS Widget Extension', link: 'client/liveactivities/widget', dateCreated: '2026-09-06', dateUpdated: '2026-09-06' },
          { label: 'Push Tokens & Server Updates', link: 'client/liveactivities/push', dateCreated: '2026-07-31', dateUpdated: '2026-07-31' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'App Functions',
        jumpTo: true,
        dateUpdated: '2026-09-29',
        items: [
          { label: 'Getting Started', link: 'client/appfunctions/', dateCreated: '2026-09-29', dateUpdated: '2026-09-29' },
          { label: 'Delegates & In-App Calls', link: 'client/appfunctions/delegates', dateCreated: '2026-09-29', dateUpdated: '2026-09-29' },
          { label: 'Platform & Testing', link: 'client/appfunctions/platform', dateCreated: '2026-09-29', dateUpdated: '2026-09-29' },
          { label: 'AI Tools', link: 'client/appfunctions/ai-tools', dateCreated: '2026-09-30', dateUpdated: '2026-09-30' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'HTTP Transfers',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'client/httptransfers/', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' },
          { label: 'Architecture', link: 'client/httptransfers/architecture', dateCreated: '2026-06-09', dateUpdated: '2026-06-09' },
          { label: 'Transfers', link: 'client/httptransfers/transfers', dateCreated: '2026-03-26', dateUpdated: '2026-03-26' },
          { label: 'Azure Blob Storage', link: 'client/httptransfers/azure', dateCreated: '2026-03-28', dateUpdated: '2026-03-28' },
          { label: 'AWS S3', link: 'client/httptransfers/aws-s3', dateCreated: '2026-04-24', dateUpdated: '2026-04-24' },
          { label: 'Resumable Uploads (tus)', link: 'client/httptransfers/tus', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Transfer Delegate', link: 'client/httptransfers/delegate', dateCreated: '2026-03-28', dateUpdated: '2026-03-28' },
          { label: 'Monitoring', link: 'client/httptransfers/monitoring', dateCreated: '2026-03-26', dateUpdated: '2026-03-26' },
          { label: 'Transfer Progress', link: 'client/httptransfers/progress', dateCreated: '2026-08-21', dateUpdated: '2026-08-21' },
          { label: 'Blazor Playground', link: 'https://shinyorg.github.io/shiny/', attrs: { target: '_blank' } },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
    ]
  },
  {
    id: 'maui',
    label: 'MAUI App',
    link: '/mauishell/',
    icon: 'rocket',
    items: [
      {
        label: 'MAUI Shell',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'mauishell/', dateCreated: '2025-06-03', dateUpdated: '2025-06-03' },
          { label: 'Navigation', link: 'mauishell/navigation', dateCreated: '2026-02-25', dateUpdated: '2026-02-25' },
          { label: 'Navigation Interceptors', link: 'mauishell/interceptors', dateCreated: '2026-09-06', dateUpdated: '2026-09-06' },
          { label: 'Dialogs', link: 'mauishell/dialogs', dateCreated: '2026-03-11', dateUpdated: '2026-03-11' },
          { label: 'ViewModel Lifecycle', link: 'mauishell/lifecycle', dateCreated: '2026-02-25', dateUpdated: '2026-02-25' },
          { label: 'Source Generation', link: 'mauishell/sourcegen', dateCreated: '2026-02-25', dateUpdated: '2026-02-25' },
          { label: 'App Links', link: 'mauishell/applinks', dateCreated: '2026-09-04', dateUpdated: '2026-09-04' },
          { label: 'App Shortcuts', link: 'mauishell/appshortcuts', dateCreated: '2026-09-04', dateUpdated: '2026-09-04' },
          { label: 'AI Integration', link: 'mauishell/ai', dateCreated: '2026-04-26', dateUpdated: '2026-04-26' },
          { label: 'Release Notes', link: 'mauishell/release-notes', dateCreated: '2026-03-04', dateUpdated: '2026-03-04' }
        ]
      },
      {
        label: 'MAUI Hosting',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'mauihost/', dateCreated: '2026-03-09', dateUpdated: '2026-03-09' },
          { label: 'App Support', link: 'mauihost/appsupport', dateCreated: '2026-05-29', dateUpdated: '2026-05-29' },
          { label: 'App Store', link: 'mauihost/appstore', dateCreated: '2026-05-29', dateUpdated: '2026-05-29' },
          { label: 'Startup Service', link: 'mauihost/startup', dateCreated: '2026-09-19', dateUpdated: '2026-09-19' },
          { label: 'Desktop Backends', link: 'mauihost/desktop', dateCreated: '2026-09-08', dateUpdated: '2026-09-08' },
          { label: 'Release Notes', link: 'mauihost/release-notes', dateCreated: '2026-03-09', dateUpdated: '2026-03-09' }
        ]
      },
      {
        label: 'Configuration',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'client/configuration/', dateCreated: '2026-03-27', dateUpdated: '2026-03-27' },
          { label: 'JSON Platform Bundle', link: 'client/configuration/json', dateCreated: '2026-03-27', dateUpdated: '2026-03-27' },
          { label: 'Platform Preferences', link: 'client/configuration/preferences', dateCreated: '2026-03-27', dateUpdated: '2026-03-27' },
          { label: 'Remote Configuration', link: 'client/configuration/remote', dateCreated: '2026-03-27', dateUpdated: '2026-03-27' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'MSBuild Permissions',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'permissions/', dateCreated: '2026-04-02', dateUpdated: '2026-04-02' },
          { label: 'Android', link: 'permissions/android', dateCreated: '2026-04-02', dateUpdated: '2026-04-02' },
          { label: 'iOS', link: 'permissions/ios', dateCreated: '2026-04-02', dateUpdated: '2026-04-02' }
        ]
      },
      {
        label: 'App Device Bridge',
        jumpTo: true,
        dateUpdated: '2026-09-30',
        items:[
          { label: 'Getting Started', link: 'appdevicebridge/', showNew: false, dateCreated: '2026-09-16', dateUpdated: '2026-09-16' },
          { label: 'vs. Blazor Hybrid', link: 'appdevicebridge/vs-blazor-hybrid', showNew: false, dateCreated: '2026-09-19', dateUpdated: '2026-09-19' },
          { label: 'Hosting', link: 'appdevicebridge/hosting', showNew: false, dateCreated: '2026-09-16', dateUpdated: '2026-09-16' },
          { label: 'Updates', link: 'appdevicebridge/updates', showNew: false, dateCreated: '2026-09-16', dateUpdated: '2026-09-16' },
          { label: 'Security', link: 'appdevicebridge/security', showNew: false, dateCreated: '2026-09-16', dateUpdated: '2026-09-16' },
          { label: 'Typed Clients', link: 'appdevicebridge/clients', showNew: false, dateCreated: '2026-09-16', dateUpdated: '2026-09-16' },
          {
            label: 'Bridges',
            showNew: false,
            items: [
              { label: 'Overview', link: 'appdevicebridge/bridges', showNew: false, dateCreated: '2026-09-16', dateUpdated: '2026-09-16' },
              { label: 'App Links', link: 'appdevicebridge/app-links', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'App Support', link: 'appdevicebridge/app-support', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Beacons', link: 'appdevicebridge/beacons', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Bluetooth LE', link: 'appdevicebridge/bluetoothle', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Calendar', link: 'appdevicebridge/calendar', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Contacts', link: 'appdevicebridge/contacts', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Device Camera', link: 'appdevicebridge/camera', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Discovery', link: 'appdevicebridge/discovery', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Document Geofencing', link: 'appdevicebridge/document-geofencing', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Folders', link: 'appdevicebridge/folders', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Geofencing', link: 'appdevicebridge/geofencing', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'GPS & Motion', link: 'appdevicebridge/gps', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Health', link: 'appdevicebridge/health', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'HTTP Transfers', link: 'appdevicebridge/http-transfers', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'In-App Purchases', link: 'appdevicebridge/inapppurchases', showNew: true, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Live Activities', link: 'appdevicebridge/liveactivities', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Maps & Directions', link: 'appdevicebridge/maps', showNew: false, dateCreated: '2026-09-22', dateUpdated: '2026-10-06' },
              { label: 'Notifications', link: 'appdevicebridge/notifications', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'OBD-II', link: 'appdevicebridge/obd', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Photos', link: 'appdevicebridge/photos', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Pi Camera', link: 'appdevicebridge/rpicamera', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Printing', link: 'appdevicebridge/printing', showNew: false, dateCreated: '2026-10-03', dateUpdated: '2026-10-03' },
              { label: 'Push', link: 'appdevicebridge/push', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Screen Recorder', link: 'appdevicebridge/screenrecorder', showNew: false, dateCreated: '2026-09-24', dateUpdated: '2026-09-24' },
              { label: 'Sensors', link: 'appdevicebridge/sensors', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Speech', link: 'appdevicebridge/speech', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Tray Icon & Quick Entry', link: 'appdevicebridge/desktop', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' },
              { label: 'Wearables', link: 'appdevicebridge/wearables', showNew: false, dateCreated: '2026-09-18', dateUpdated: '2026-09-18' },
              { label: 'Wi-Fi', link: 'appdevicebridge/wifi', showNew: false, dateCreated: '2026-10-04', dateUpdated: '2026-10-04' }
            ]
          },
          { label: 'Settings, Files & Folders', link: 'appdevicebridge/storage', showNew: false, dateCreated: '2026-09-16', dateUpdated: '2026-09-16' },
          { label: 'Native Calls & Background', link: 'appdevicebridge/background', showNew: false, dateCreated: '2026-09-16', dateUpdated: '2026-09-16' },
          { label: 'Simulator', link: 'appdevicebridge/simulator', showNew: false, dateCreated: '2026-09-18', dateUpdated: '2026-09-18' },
          { label: 'Release Notes', link: 'appdevicebridge/release-notes', showNew: false, dateCreated: '2026-09-16', dateUpdated: '2026-09-16' }
        ]
      },
    ]
  },
  {
    id: 'controls',
    label: 'UI Controls',
    link: '/controls/',
    icon: 'seti:html',
    flattenInHomenav: true,
    // Theming isn't a control, so the flattened catalogue below would never list it —
    // but it's the first thing you need before any control looks right.
    featuredInHomenav: [
      { label: 'Theming', link: 'controls/theming/', dateCreated: '2026-06-12', dateUpdated: '2026-06-12', note: 'Tokens, colour roles & theme packs' },
      { label: 'Theme Composer', link: 'controls/theming/creator', dateCreated: '2026-06-12', dateUpdated: '2026-06-12', note: 'Design a theme live, take the CSS or XAML' },
      { label: 'Office Suite', link: 'controls/office-shell/', dateCreated: '2026-09-28', dateUpdated: '2026-09-28', note: 'Word, Excel & PowerPoint-style editors' },
    ],
    items:[
      { label: 'Getting Started', link: 'controls/', dateCreated: '2026-04-15', dateUpdated: '2026-04-15' },
      {
        label: 'Theming',
        items:[
          { label: 'Overview', link: 'controls/theming/', dateCreated: '2026-06-12', dateUpdated: '2026-06-12' },
          { label: 'Theme Packs', link: 'controls/theming/packs', dateCreated: '2026-08-13', dateUpdated: '2026-08-13' },
          { label: 'Theme Composer', link: 'controls/theming/creator', dateCreated: '2026-06-12', dateUpdated: '2026-09-12' },
          { label: 'Dark Mode', link: 'controls/theming/dark-mode', dateCreated: '2026-08-29', dateUpdated: '2026-08-29' },
        ],
      },
      {
        label: 'Barcodes & QR Codes',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/barcodes/', dateCreated: '2026-06-05', dateUpdated: '2026-06-05' },
          { label: '.NET MAUI Usage', link: 'controls/barcodes/maui', dateCreated: '2026-06-26', dateUpdated: '2026-06-26' },
          { label: 'Blazor Usage', link: 'controls/barcodes/blazor', dateCreated: '2026-06-26', dateUpdated: '2026-06-26' },
          { label: 'Headless Rendering', link: 'controls/barcodes/rendering', dateCreated: '2026-06-26', dateUpdated: '2026-06-26' },
          { label: 'Symbologies', link: 'controls/barcodes/symbologies', dateCreated: '2026-06-26', dateUpdated: '2026-06-26' },
        ]
      },
      {
        label: 'CameraView',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/cameraview/', dateCreated: '2026-06-13', dateUpdated: '2026-06-13' },
          { label: 'Frame Analyzers', link: 'controls/cameraview/analyzers', dateCreated: '2026-06-13', dateUpdated: '2026-06-13' },
          { label: 'Effects & Filters', link: 'controls/cameraview/effects', dateCreated: '2026-08-04', dateUpdated: '2026-08-04' },
          { label: 'Face Masks', link: 'controls/cameraview/face-masks', dateCreated: '2026-08-04', dateUpdated: '2026-08-04' },
          { label: 'AI Document Scanner', link: 'controls/cameraview/ai', dateCreated: '2026-06-30', dateUpdated: '2026-06-30' },
          { label: 'AI Photo Stylizer', link: 'controls/cameraview/ai-stylize', dateCreated: '2026-08-04', dateUpdated: '2026-08-04' },
          { label: 'Blazor Usage', link: 'controls/cameraview/blazor', dateCreated: '2026-06-13', dateUpdated: '2026-06-13' },
          { label: 'Blazor Media Service', link: 'controls/cameraview/media-service-blazor', dateCreated: '2026-09-18', dateUpdated: '2026-09-18' },
        ]
      },
      {
        label: 'MediaElement',
        jumpTo: true,
        dateUpdated: '2026-08-12',
        items:[
          { label: 'Getting Started', link: 'controls/mediaelement/', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
          { label: 'Transport Bar', link: 'controls/mediaelement/transport-bar', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
          { label: 'Background Playback & PiP', link: 'controls/mediaelement/background-playback', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
          { label: 'Blazor Usage', link: 'controls/mediaelement/blazor', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
        ]
      },
      {
        label: 'ChatView',
        jumpTo: true,
        items:[
          { label: 'Overview', link: 'controls/chatview/', dateCreated: '2026-04-21', dateUpdated: '2026-04-21' },
          { label: 'Getting Started', link: 'controls/chatview/getting-started', dateCreated: '2026-05-04', dateUpdated: '2026-05-04' },
          { label: 'The Provider Interface', link: 'controls/chatview/the-provider', dateCreated: '2026-06-27', dateUpdated: '2026-06-27' },
          { label: 'Messages & Paging', link: 'controls/chatview/messages-paging', dateCreated: '2026-06-27', dateUpdated: '2026-06-27' },
          { label: 'Permissions', link: 'controls/chatview/permissions', dateCreated: '2026-06-27', dateUpdated: '2026-06-27' },
          { label: 'Reactions & Read Receipts', link: 'controls/chatview/reactions-receipts', dateCreated: '2026-06-27', dateUpdated: '2026-06-27' },
          { label: 'The Composer', link: 'controls/chatview/composer', dateCreated: '2026-08-09', dateUpdated: '2026-08-09' },
          { label: 'Markdown & Input Bar', link: 'controls/chatview/markdown-input', dateCreated: '2026-06-27', dateUpdated: '2026-06-27' },
          { label: 'Images & Attachments', link: 'controls/chatview/images-attachments', dateCreated: '2026-06-27', dateUpdated: '2026-06-27' },
          { label: 'Typing & Connection', link: 'controls/chatview/typing-connection', dateCreated: '2026-06-27', dateUpdated: '2026-06-27' },
          { label: 'Message Templates', link: 'controls/chatview/message-templates', dateCreated: '2026-05-04', dateUpdated: '2026-05-04' },
          { label: 'Custom Actions', link: 'controls/chatview/custom-actions', dateCreated: '2026-06-27', dateUpdated: '2026-06-27' },
          { label: 'Scenarios', link: 'controls/chatview/scenarios', dateCreated: '2026-05-04', dateUpdated: '2026-05-04' },
          { label: 'API Reference', link: 'controls/chatview/api-reference', dateCreated: '2026-05-04', dateUpdated: '2026-05-04' },
        ]
      },
      {
        label: 'DataGrid',
        jumpTo: true,
        items:[
          { label: 'Overview', link: 'controls/datagrid/', dateCreated: '2026-06-17', dateUpdated: '2026-06-17' },
          { label: 'Getting Started', link: 'controls/datagrid/getting-started', dateCreated: '2026-08-24', dateUpdated: '2026-08-24' },
          { label: 'Column Formatting', link: 'controls/datagrid/column-formatting', dateCreated: '2026-08-24', dateUpdated: '2026-08-24' },
          { label: 'Conditional Cell Styling', link: 'controls/datagrid/cell-styling', dateCreated: '2026-08-24', dateUpdated: '2026-08-24' },
          { label: 'Column Widths', link: 'controls/datagrid/column-widths', dateCreated: '2026-08-24', dateUpdated: '2026-08-24' },
          { label: 'Column Ordering', link: 'controls/datagrid/column-ordering', dateCreated: '2026-08-24', dateUpdated: '2026-08-24' },
          { label: 'Column Resizing', link: 'controls/datagrid/column-resizing', dateCreated: '2026-08-24', dateUpdated: '2026-08-24' },
          { label: 'Grouping & Summary Rows', link: 'controls/datagrid/grouping', dateCreated: '2026-08-26', dateUpdated: '2026-08-26' },
          { label: 'Frozen Header & Columns', link: 'controls/datagrid/frozen-columns', dateCreated: '2026-08-24', dateUpdated: '2026-08-24' },
          { label: 'Detail (Breakdown) Rows', link: 'controls/datagrid/detail-rows', dateCreated: '2026-08-24', dateUpdated: '2026-08-24' },
          { label: 'Async Detail & IsBusy', link: 'controls/datagrid/async-detail', dateCreated: '2026-08-24', dateUpdated: '2026-08-24' },
          { label: 'TreeDataGrid', link: 'controls/datagrid/tree-data-grid', dateCreated: '2026-08-24', dateUpdated: '2026-08-24' },
        ]
      },
      {
        label: 'Gantt',
        jumpTo: true,
        dateUpdated: '2026-09-07',
        items:[
          { label: 'Overview', link: 'controls/gantt/', dateCreated: '2026-09-07', dateUpdated: '2026-09-07' },
          { label: 'Scheduling', link: 'controls/gantt/scheduling', dateCreated: '2026-09-07', dateUpdated: '2026-09-07' },
        ]
      },
      {
        label: 'Kanban',
        jumpTo: true,
        dateUpdated: '2026-09-16',
        items:[
          { label: 'Overview', link: 'controls/kanban/', dateCreated: '2026-09-15', dateUpdated: '2026-09-15' },
        ]
      },
      {
        label: 'Floor Plan',
        jumpTo: true,
        dateUpdated: '2026-09-07',
        items:[
          { label: 'Overview', link: 'controls/floorplan/', dateCreated: '2026-09-07', dateUpdated: '2026-09-07' },
        ]
      },
      {
        label: 'Diagram',
        jumpTo: true,
        dateUpdated: '2026-09-07',
        items:[
          { label: 'Overview', link: 'controls/diagram/', dateCreated: '2026-09-07', dateUpdated: '2026-09-07' },
          { label: 'Layouts', link: 'controls/diagram/layouts', dateCreated: '2026-09-07', dateUpdated: '2026-09-07' },
          { label: 'Editing & Undo', link: 'controls/diagram/editing', dateCreated: '2026-09-07', dateUpdated: '2026-09-07' },
        ]
      },
      {
        label: 'Office',
        items:[
          { label: 'Spreadsheet', link: 'controls/spreadsheet/', dateCreated: '2026-08-24', dateUpdated: '2026-08-24', jumpTo: true },
          { label: 'Spreadsheet Formatting', link: 'controls/spreadsheet/formatting', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Spreadsheet Sort, Filter & Validation', link: 'controls/spreadsheet/data', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Spreadsheet Formulas', link: 'controls/spreadsheet/formulas', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Spreadsheet Charts', link: 'controls/spreadsheet/charts', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Document Viewer', link: 'controls/document-viewer/', dateCreated: '2026-08-24', dateUpdated: '2026-08-24', jumpTo: true },
          { label: 'Slide Viewer', link: 'controls/slide-viewer/', dateCreated: '2026-09-04', dateUpdated: '2026-09-04', jumpTo: true },
          { label: 'Presenting Mode', link: 'controls/slide-viewer/presenting', dateCreated: '2026-09-01', dateUpdated: '2026-09-04' },
          { label: 'Office Shell', link: 'controls/office-shell/', dateCreated: '2026-09-28', jumpTo: true, dateUpdated: '2026-09-28' },
          { label: 'Document Editor', link: 'controls/document-editor/', dateCreated: '2026-08-24', jumpTo: true, dateUpdated: '2026-09-28' },
          { label: 'Document Objects & Highlighting', link: 'controls/document-editor/objects', dateCreated: '2026-08-26', dateUpdated: '2026-08-26' },
          { label: 'Document Lists', link: 'controls/document-editor/lists', dateCreated: '2026-08-28', dateUpdated: '2026-08-28' },
          { label: 'Document Formatting & Editing', link: 'controls/document-editor/formatting', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Document Tables', link: 'controls/document-editor/tables', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Document References & Links', link: 'controls/document-editor/references', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Document Comments & Track Changes', link: 'controls/document-editor/review', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Document Page Layout & Views', link: 'controls/document-editor/page-layout', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Slide Editor', link: 'controls/slide-editor/', dateCreated: '2026-08-24', jumpTo: true, dateUpdated: '2026-09-28' },
          { label: 'Slide Objects, Groups & Tables', link: 'controls/slide-editor/objects', dateCreated: '2026-08-26', dateUpdated: '2026-09-23' },
          { label: 'Slide Bullets & Numbering', link: 'controls/slide-editor/lists', dateCreated: '2026-08-28', dateUpdated: '2026-08-28' },
          { label: 'Slides, Layouts & Notes', link: 'controls/slide-editor/slides', dateCreated: '2026-09-22', dateUpdated: '2026-09-23' },
          { label: 'Slide Shape Format & Text', link: 'controls/slide-editor/format', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Slide Design', link: 'controls/slide-editor/design', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Slide Transitions & Animations', link: 'controls/slide-editor/transitions-animations', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Slide Charts, Icons & Media', link: 'controls/slide-editor/insert', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Slide Show & Presenter View', link: 'controls/slide-editor/presenting', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
          { label: 'Notebook', link: 'controls/notebook/', dateCreated: '2026-09-01', jumpTo: true, dateUpdated: '2026-09-17' },
          { label: 'Find', link: 'controls/office-find', dateCreated: '2026-08-30', dateUpdated: '2026-08-30' },
        ]
      },
      {
        label: 'Expander & Accordion',
        jumpTo: true,
        dateUpdated: '2026-08-26',
        items:[
          { label: 'Getting Started', link: 'controls/expander/', dateCreated: '2026-08-26', dateUpdated: '2026-08-26' },
          { label: 'Accordion', link: 'controls/expander/accordion', dateCreated: '2026-08-26', dateUpdated: '2026-08-26' },
          { label: 'Blazor Usage', link: 'controls/expander/blazor', dateCreated: '2026-08-26', dateUpdated: '2026-08-26' },
        ]
      },
      {
        label: 'Collections & Grids',
        items:[
          { label: 'VirtualizedGrid', link: 'controls/virtualized-grid/', dateCreated: '2026-05-13', dateUpdated: '2026-05-13', jumpTo: true },
          { label: 'StaggeredGrid', link: 'controls/staggered-grid/', dateCreated: '2026-05-13', dateUpdated: '2026-05-13', jumpTo: true },
          { label: 'ParallaxCollectionView', link: 'controls/parallax-collection-view/', dateCreated: '2026-06-05', dateUpdated: '2026-06-05', jumpTo: true },
          { label: 'CarouselGallery', link: 'controls/carousel-gallery/', dateCreated: '2026-05-13', dateUpdated: '2026-05-13', jumpTo: true },
          { label: 'Carousel', link: 'controls/carousel/', dateCreated: '2026-06-15', dateUpdated: '2026-06-15', jumpTo: true, platform: 'blazor' },
        ]
      },
      {
        label: 'Desktop',
        items:[
          { label: 'Tray Icon', link: 'controls/trayicon/', dateCreated: '2026-06-01', dateUpdated: '2026-06-01', jumpTo: true, platform: 'maui' },
          { label: 'Docking', link: 'controls/docking/', dateCreated: '2026-06-07', dateUpdated: '2026-06-07', jumpTo: true },
          { label: 'On-Screen Keyboard', link: 'controls/onscreen-keyboard/', dateCreated: '2026-06-07', dateUpdated: '2026-06-07', jumpTo: true, platform: 'blazor' },
        ]
      },
      {
        label: 'ShinyButton',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/button/', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
          { label: 'States & Commands', link: 'controls/button/states', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
          { label: 'Blazor Usage', link: 'controls/button/blazor', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
        ]
      },
      {
        label: 'Fab & FabMenu',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/fab/', dateCreated: '2026-04-16', dateUpdated: '2026-04-16' },
          { label: 'Fab', link: 'controls/fab/fab', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
          { label: 'FabMenu', link: 'controls/fab/fabmenu', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
          { label: 'Blazor Usage', link: 'controls/fab/blazor', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
        ]
      },
      {
        label: 'Services',
        items:[
          { label: 'Dialog Service', link: 'controls/dialogs/', dateCreated: '2026-06-17', dateUpdated: '2026-06-17', jumpTo: true },
          { label: 'Feedback Service', link: 'controls/feedback/', dateCreated: '2026-05-03', dateUpdated: '2026-05-03', jumpTo: true, platform: 'maui' },
          { label: 'Media Service', link: 'controls/cameraview/media-service', dateCreated: '2026-09-02', jumpTo: true, platform: 'maui', dateUpdated: '2026-09-07' },
          { label: 'Media Service', link: 'controls/cameraview/media-service-blazor', dateCreated: '2026-09-18', jumpTo: true, platform: 'blazor', dateUpdated: '2026-09-18' },
        ]
      },
      {
        label: 'Flyout',
        jumpTo: true,
        platform: 'maui',
        dateUpdated: '2026-08-26',
        items:[
          { label: 'Getting Started', link: 'controls/flyout/', dateCreated: '2026-08-25', dateUpdated: '2026-08-25' },
          { label: 'Shell & App-Wide', link: 'controls/flyout/shell', dateCreated: '2026-08-25', dateUpdated: '2026-08-25' },
          { label: 'Properties & Events', link: 'controls/flyout/properties', dateCreated: '2026-08-25', dateUpdated: '2026-08-25' },
        ]
      },
      {
        label: 'TabbedPage',
        jumpTo: true,
        platform: 'maui',
        dateUpdated: '2026-08-26',
        items:[
          { label: 'Getting Started', link: 'controls/tabbedpage/', dateCreated: '2026-08-25', dateUpdated: '2026-08-25' },
          { label: 'Shell', link: 'controls/tabbedpage/shell', dateCreated: '2026-08-25', dateUpdated: '2026-08-25' },
          { label: 'Properties & Events', link: 'controls/tabbedpage/properties', dateCreated: '2026-08-25', dateUpdated: '2026-08-25' },
        ]
      },
      {
        label: 'NavigationPage',
        jumpTo: true,
        platform: 'maui',
        dateUpdated: '2026-08-26',
        items:[
          { label: 'Getting Started', link: 'controls/navigationpage/', dateCreated: '2026-08-25', dateUpdated: '2026-08-25' },
          { label: 'Items & Overflow', link: 'controls/navigationpage/items', dateCreated: '2026-08-25', dateUpdated: '2026-08-25' },
          { label: 'Status Bar & Safe Area', link: 'controls/navigationpage/status-bar', dateCreated: '2026-09-07', dateUpdated: '2026-09-07' },
          { label: 'Properties & Events', link: 'controls/navigationpage/properties', dateCreated: '2026-08-25', dateUpdated: '2026-08-25' },
        ]
      },
      {
        label: 'Floating Panels',
        jumpTo: true,
        platform: 'maui',
        items:[
          { label: 'Getting Started', link: 'controls/floatingpanel/', dateCreated: '2026-04-25', dateUpdated: '2026-04-25' },
          { label: 'Properties & Events', link: 'controls/floatingpanel/properties', dateCreated: '2026-04-25', dateUpdated: '2026-04-25' },
          { label: 'Examples', link: 'controls/floatingpanel/examples', dateCreated: '2026-04-25', dateUpdated: '2026-04-25' },
          {
            label: 'Derived Controls',
            items:[
              { label: 'Overlay', link: 'controls/overlay/', dateCreated: '2026-05-04', dateUpdated: '2026-05-04', jumpTo: true },
              { label: 'SignaturePad', link: 'controls/signaturepad/', dateCreated: '2026-04-30', dateUpdated: '2026-04-30', jumpTo: true },
              { label: 'DurationPicker', link: 'controls/durationpicker/', dateCreated: '2026-06-26', dateUpdated: '2026-06-26', jumpTo: true, platform: 'maui' },
              { label: 'Sheet View', link: 'controls/sheetview/', dateCreated: '2026-04-15', dateUpdated: '2026-04-15', jumpTo: true, platform: 'blazor' },
            ]
          },
        ]
      },
      { label: 'Quick Entry', link: 'controls/quick-entry/', dateCreated: '2026-08-23', jumpTo: true, dateUpdated: '2026-08-23' },
      { label: 'File Drop', link: 'controls/file-drop/', dateCreated: '2026-08-28', jumpTo: true, dateUpdated: '2026-08-28' },
      { label: 'Keyboard Shortcuts', link: 'controls/keyboard-shortcuts/', dateCreated: '2026-10-02', jumpTo: true, dateUpdated: '2026-10-03' },
      { label: 'FrostedGlassView', link: 'controls/frostedglass/', dateCreated: '2026-07-31', dateUpdated: '2026-07-31', jumpTo: true },
      {
        label: 'Images',
        items:[
          {
            label: 'ShinyImage',
            jumpTo: true,
            dateUpdated: '2026-08-26',
            items:[
              { label: 'Getting Started', link: 'controls/shinyimage/', dateCreated: '2026-08-13', dateUpdated: '2026-08-13' },
              { label: 'Image Sources', link: 'controls/shinyimage/sources', dateCreated: '2026-08-26', dateUpdated: '2026-08-26' },
              { label: 'SVG', link: 'controls/shinyimage/svg', dateCreated: '2026-08-26', dateUpdated: '2026-08-26' },
              { label: 'Progress & Templates', link: 'controls/shinyimage/progress', dateCreated: '2026-08-26', dateUpdated: '2026-08-26' },
              { label: 'Caching & ImageService', link: 'controls/shinyimage/imageservice', dateCreated: '2026-08-26', dateUpdated: '2026-08-26' },
              { label: 'Blazor', link: 'controls/shinyimage/blazor', dateCreated: '2026-08-26', dateUpdated: '2026-08-26' },
              { label: 'Properties & Events', link: 'controls/shinyimage/properties', dateCreated: '2026-08-26', dateUpdated: '2026-08-26' },
            ]
          },
          { label: 'ImageViewer', link: 'controls/imageviewer/', dateCreated: '2026-04-15', dateUpdated: '2026-04-15', jumpTo: true },
          { label: 'ZoomPanView', link: 'controls/zoompanview/', dateCreated: '2026-09-09', jumpTo: true, dateUpdated: '2026-09-17' },
          { label: 'FloatingToolbar', link: 'controls/floatingtoolbar/', dateCreated: '2026-09-09', jumpTo: true, dateUpdated: '2026-09-17' },
          {
            label: 'ImageEditor',
            jumpTo: true,
            items:[
              { label: 'Getting Started', link: 'controls/imageeditor/', dateCreated: '2026-04-21', dateUpdated: '2026-04-21' },
              { label: 'Zoom & Pan', link: 'controls/imageeditor/zoom', dateCreated: '2026-08-09', dateUpdated: '2026-08-26' },
              { label: 'Shapes', link: 'controls/imageeditor/shapes', dateCreated: '2026-08-26', dateUpdated: '2026-08-26' },
              { label: 'Properties & Commands', link: 'controls/imageeditor/properties', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
              { label: 'Save & Export', link: 'controls/imageeditor/save-export', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
            ]
          },
          { label: 'MediaPickerButton', link: 'controls/media-picker-button/', dateCreated: '2026-07-12', dateUpdated: '2026-07-12', jumpTo: true },
        ]
      },
      {
        label: 'Input Controls',
        items:[
          { label: 'AutoCompleteEntry', link: 'controls/autocomplete/', dateCreated: '2026-04-23', dateUpdated: '2026-04-23', jumpTo: true },
          { label: 'CountryPicker', link: 'controls/countrypicker/', dateCreated: '2026-04-23', dateUpdated: '2026-04-23', jumpTo: true },
          { label: 'AddressEntry', link: 'controls/addressentry/', dateCreated: '2026-04-23', dateUpdated: '2026-04-23', jumpTo: true },
          {
            label: 'TextEntry',
            jumpTo: true,
            items: [
              { label: 'Getting Started', link: 'controls/textentry/', dateCreated: '2026-05-04', dateUpdated: '2026-05-04' },
              { label: 'Keyboard Accessory', link: 'controls/textentry/keyboard-accessory', dateCreated: '2026-08-09', dateUpdated: '2026-08-09' },
            ]
          },
          { label: 'Speech Add-ins', link: 'controls/speech-addins/', dateCreated: '2026-08-14', jumpTo: true, dateUpdated: '2026-08-14' },
          { label: 'Captcha', link: 'controls/captcha/', dateCreated: '2026-08-28', jumpTo: true, platform: 'blazor', dateUpdated: '2026-09-07' },
          {
            label: 'Gamepad',
            jumpTo: true,
            dateUpdated: '2026-09-23',
            items: [
              { label: 'Getting Started', link: 'controls/gamepad/', dateCreated: '2026-09-22', dateUpdated: '2026-09-22' },
              { label: 'Layouts & Customizing', link: 'controls/gamepad/customizing', dateCreated: '2026-09-22', dateUpdated: '2026-09-22' },
            ]
          },
        ]
      },
      { label: 'ShinyFlexLayout', link: 'controls/flex-layout/', dateCreated: '2026-09-25', jumpTo: true, platform: 'maui', dateUpdated: '2026-09-25' },
      { label: 'YogaLayout', link: 'controls/yoga-layout/', dateCreated: '2026-09-25', jumpTo: true, dateUpdated: '2026-09-25' },
      {
        label: 'Layout',
        platform: 'blazor',
        dateUpdated: '2026-08-13',
        items:[
          { label: 'Stacks & Grid', link: 'controls/layout/', dateCreated: '2026-08-13', dateUpdated: '2026-08-13', jumpTo: true },
          { label: 'AppLayout', link: 'controls/applayout/', dateCreated: '2026-08-13', dateUpdated: '2026-08-13', jumpTo: true },
        ]
      },
      {
        label: 'Keyframe Animation',
        jumpTo: true,
        platform: 'maui',
        dateUpdated: '2026-08-07',
        items:[
          { label: 'Getting Started', link: 'controls/keyframe/', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
          { label: 'XAML Animations', link: 'controls/keyframe/xaml', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
          { label: 'Easing Curves', link: 'controls/keyframe/easing', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
          { label: 'Timelines & Playback', link: 'controls/keyframe/timelines', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
          { label: 'Drawn Scenes', link: 'controls/keyframe/scenes', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
          { label: 'Offscreen Export', link: 'controls/keyframe/export', dateCreated: '2026-08-07', dateUpdated: '2026-08-07' },
        ]
      },
      {
        label: 'Motion Icons',
        jumpTo: true,
        dateUpdated: '2026-08-12',
        items:[
          { label: 'Getting Started', link: 'controls/motion-icons/', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
          { label: 'Triggers', link: 'controls/motion-icons/triggers', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
          { label: 'The Icon Set', link: 'controls/motion-icons/icons', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
          { label: 'Presets', link: 'controls/motion-icons/presets', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
          { label: 'Custom Artwork', link: 'controls/motion-icons/custom', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
        ]
      },
      {
        label: 'Mermaid Diagrams',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/mermaid-diagrams/', dateCreated: '2026-03-31', dateUpdated: '2026-03-31' },
          { label: 'Control Properties', link: 'controls/mermaid-diagrams/control', dateCreated: '2026-03-31', dateUpdated: '2026-03-31' },
          { label: 'Theming', link: 'controls/mermaid-diagrams/theming', dateCreated: '2026-03-31', dateUpdated: '2026-03-31' },
          { label: 'Blazor Usage', link: 'controls/mermaid-diagrams/blazor', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
        ]
      },
      {
        label: 'Scheduler',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/scheduler/', dateCreated: '2026-03-31', dateUpdated: '2026-03-31' },
          { label: 'Calendar View', link: 'controls/scheduler/calendar', dateCreated: '2026-03-31', dateUpdated: '2026-03-31' },
          { label: 'Agenda View', link: 'controls/scheduler/agenda', dateCreated: '2026-03-31', dateUpdated: '2026-03-31' },
          { label: 'Drag & Drop Editing', link: 'controls/scheduler/drag-drop', dateCreated: '2026-08-05', dateUpdated: '2026-08-05' },
          { label: 'Event List', link: 'controls/scheduler/event-list', dateCreated: '2026-03-31', dateUpdated: '2026-03-31' },
          { label: 'Custom Templates', link: 'controls/scheduler/templates', dateCreated: '2026-03-31', dateUpdated: '2026-03-31' },
          { label: 'Blazor Usage', link: 'controls/scheduler/blazor', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
        ]
      },
      {
        label: 'TableView',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/tableview/', dateCreated: '2026-02-18', dateUpdated: '2026-02-18' },
          { label: 'Cell Types', link: 'controls/tableview/cells', dateCreated: '2026-02-18', dateUpdated: '2026-02-18' },
          { label: 'Sections & Dynamic Content', link: 'controls/tableview/sections', dateCreated: '2026-02-18', dateUpdated: '2026-02-18' },
          { label: 'Styling', link: 'controls/tableview/styling', dateCreated: '2026-02-18', dateUpdated: '2026-02-18' },
          { label: 'Advanced Features', link: 'controls/tableview/advanced', dateCreated: '2026-02-18', dateUpdated: '2026-02-18' },
          { label: 'Blazor Usage', link: 'controls/tableview/blazor', dateCreated: '2026-04-22', dateUpdated: '2026-04-22' },
        ]
      },
      {
        label: 'Toolbar & TabBar',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/toolbar-tabbar/', dateCreated: '2026-06-11', dateUpdated: '2026-06-11' },
          { label: 'ShinyToolbar', link: 'controls/toolbar-tabbar/toolbar', dateCreated: '2026-06-26', dateUpdated: '2026-06-26', platform: 'blazor' },
          { label: 'ShinyTabBar', link: 'controls/toolbar-tabbar/tabbar', dateCreated: '2026-06-26', dateUpdated: '2026-06-26', platform: 'blazor' },
          { label: 'Ribbon', link: 'controls/ribbon/', dateCreated: '2026-08-28', dateUpdated: '2026-08-28', jumpTo: true },
        ]
      },
      {
        label: 'TreeView',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'controls/treeview/', dateCreated: '2026-05-25', dateUpdated: '2026-05-25' },
          { label: 'Blazor Usage', link: 'controls/treeview/blazor', dateCreated: '2026-05-25', dateUpdated: '2026-05-25' },
        ]
      },
      {
        label: 'Wizard & StateView',
        jumpTo: true,
        dateUpdated: '2026-08-13',
        items:[
          { label: 'StateView', link: 'controls/stateview/', dateCreated: '2026-08-13', dateUpdated: '2026-08-13' },
          { label: 'Wizard', link: 'controls/wizard/', dateCreated: '2026-08-13', dateUpdated: '2026-08-13' },
          { label: 'Timeline', link: 'controls/timeline/', dateCreated: '2026-09-01', jumpTo: true, dateUpdated: '2026-09-17' },
        ]
      },
      {
        label: 'Guidance',
        jumpTo: true,
        dateUpdated: '2026-08-14',
        items:[
          { label: 'Walkthrough', link: 'controls/walkthrough/', dateCreated: '2026-08-14', dateUpdated: '2026-08-14' },
          { label: 'Tooltip', link: 'controls/tooltip/', dateCreated: '2026-08-14', dateUpdated: '2026-08-14' },
        ]
      },
      {
        label: 'Other Controls',
        items:[
          { label: 'ColorPicker', link: 'controls/colorpicker/', dateCreated: '2026-04-22', dateUpdated: '2026-04-22', jumpTo: true },
          { label: 'FontPicker', link: 'controls/fontpicker/', dateCreated: '2026-04-25', dateUpdated: '2026-04-25', jumpTo: true },
          { label: 'Slider', link: 'controls/slider/', dateCreated: '2026-05-04', dateUpdated: '2026-05-04', jumpTo: true },
          { label: 'RangeSlider', link: 'controls/rangeslider/', dateCreated: '2026-07-07', dateUpdated: '2026-07-07', jumpTo: true },
          { label: 'Markdown', link: 'controls/markdown/', dateCreated: '2026-04-15', dateUpdated: '2026-04-15', jumpTo: true },
          { label: 'SkeletonView', link: 'controls/skeleton/', dateCreated: '2026-05-29', dateUpdated: '2026-05-29', jumpTo: true },
          { label: 'Splash Screen', link: 'controls/splashscreen/', dateCreated: '2026-08-02', jumpTo: true, platform: 'blazor', dateUpdated: '2026-09-07' },
          { label: 'ButtonGroup', link: 'controls/button-group/', dateCreated: '2026-09-12', jumpTo: true, dateUpdated: '2026-09-12' },
          { label: 'TagEntry', link: 'controls/tag-entry/', dateCreated: '2026-09-12', jumpTo: true, dateUpdated: '2026-09-12' },
          { label: 'ChipGroup', link: 'controls/chip-group/', dateCreated: '2026-09-12', jumpTo: true, dateUpdated: '2026-09-12' },
          { label: 'PillView', link: 'controls/pillview/', dateCreated: '2026-04-15', dateUpdated: '2026-04-15', jumpTo: true },
          { label: 'BadgeView', link: 'controls/badge/', dateCreated: '2026-05-29', dateUpdated: '2026-05-29', jumpTo: true },
          { label: 'ProgressBar', link: 'controls/progressbar/', dateCreated: '2026-05-04', dateUpdated: '2026-05-04', jumpTo: true },
          { label: 'ProgressLine', link: 'controls/progressline/', dateCreated: '2026-08-26', jumpTo: true, dateUpdated: '2026-08-26' },
          { label: 'Confetti', link: 'controls/confetti/', dateCreated: '2026-10-03', jumpTo: true, dateUpdated: '2026-10-03' },
          { label: 'Marquee', link: 'controls/marquee/', dateCreated: '2026-10-03', jumpTo: true, dateUpdated: '2026-10-03' },
          { label: 'Range Pickers', link: 'controls/range-pickers/', dateCreated: '2026-10-03', jumpTo: true, dateUpdated: '2026-10-03' },
          { label: 'SecurityPin', link: 'controls/securitypin/', dateCreated: '2026-04-16', dateUpdated: '2026-04-16', jumpTo: true },
          { label: 'PasswordStrength', link: 'controls/passwordstrength/', dateCreated: '2026-08-26', jumpTo: true, dateUpdated: '2026-08-26' },
          { label: 'Toast', link: 'controls/toast/', dateCreated: '2026-05-03', dateUpdated: '2026-05-03', jumpTo: true },
          { label: 'Modal', link: 'controls/modal/', dateCreated: '2026-08-28', jumpTo: true, platform: 'blazor', dateUpdated: '2026-09-07' },
        ]
      },
      { label: 'Blazor Playground', link: 'https://shinyorg.github.io/controls/', attrs: { target: '_blank' } },
      { label: 'Release Notes', link: 'controls/release-notes', dateCreated: '2026-04-15', dateUpdated: '2026-04-15' },
    ]
  },
  {
    id: 'data',
    label: 'Data & Storage',
    link: '/documentdb/',
    icon: 'seti:db',
    items:[
      {
        label: 'Document DB',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'documentdb/', dateCreated: '2026-03-23', dateUpdated: '2026-03-23' },
          { label: 'What It Does', link: 'documentdb/overview', dateCreated: '2026-09-13', dateUpdated: '2026-09-13' },
          { label: 'Why DocumentDb', link: 'documentdb/comparison', dateCreated: '2026-06-14', dateUpdated: '2026-06-14' },
          { label: 'Migrating v12 → v13', link: 'documentdb/migrating-v12-v13', dateCreated: '2026-08-04', dateUpdated: '2026-08-04' },
          { label: 'AOT Setup', link: 'documentdb/aot', dateCreated: '2026-02-23', dateUpdated: '2026-02-23' },
          { label: 'CRUD Operations', link: 'documentdb/crud', dateCreated: '2026-02-23', dateUpdated: '2026-02-23' },
          { label: 'JSON Collections', link: 'documentdb/json-collections', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
          { label: 'Typed Context', link: 'documentdb/context', dateCreated: '2026-06-29', dateUpdated: '2026-06-29' },
          { label: 'Bulk Export & Import', link: 'documentdb/backup', dateCreated: '2026-06-26', dateUpdated: '2026-06-26' },
          { label: 'Querying', link: 'documentdb/querying', dateCreated: '2026-02-23', dateUpdated: '2026-02-23' },
          { label: 'Projections & Streaming', link: 'documentdb/projections', dateCreated: '2026-02-23', dateUpdated: '2026-02-23' },
          { label: 'Aggregates', link: 'documentdb/aggregates', dateCreated: '2026-02-24', dateUpdated: '2026-02-24' },
          { label: 'Indexes & Transactions', link: 'documentdb/indexes', dateCreated: '2026-02-23', dateUpdated: '2026-02-23' },
          { label: 'Change Monitoring', link: 'documentdb/change-monitoring', dateCreated: '2026-05-31', dateUpdated: '2026-05-31' },
          { label: 'Write Interceptors', link: 'documentdb/interceptors', dateCreated: '2026-06-19', dateUpdated: '2026-06-19' },
          { label: 'Query Filters', link: 'documentdb/query-filters', dateCreated: '2026-06-01', dateUpdated: '2026-06-01' },
          { label: 'Multi-Tenancy', link: 'documentdb/multi-tenancy', dateCreated: '2026-08-04', dateUpdated: '2026-08-04' },
          { label: 'Soft Delete', link: 'documentdb/soft-delete', dateCreated: '2026-07-25', dateUpdated: '2026-07-25' },
          { label: 'Document Metadata', link: 'documentdb/metadata', dateCreated: '2026-09-21', dateUpdated: '2026-09-21' },
          { label: 'Transactional Outbox', link: 'documentdb/outbox', dateCreated: '2026-08-04', dateUpdated: '2026-08-04' },
          { label: 'Field-Level Encryption', link: 'documentdb/encryption', dateCreated: '2026-08-04', dateUpdated: '2026-08-04' },
          { label: 'Telemetry & Diagnostics', link: 'documentdb/diagnostics', dateCreated: '2026-06-12', dateUpdated: '2026-06-12' },
          { label: 'AI Tools', link: 'documentdb/ai-tools', dateCreated: '2026-04-30', dateUpdated: '2026-04-30' },
          { label: 'MCP Server', link: 'documentdb/mcp', dateCreated: '2026-08-04', dateUpdated: '2026-08-04' },
          { label: 'REST & Live Queries', link: 'documentdb/rest-endpoints', dateCreated: '2026-08-04', dateUpdated: '2026-08-04' },
          { label: 'Blazor Playground', link: 'https://docdbmyadmin.acrhome.ca/', attrs: { target: '_blank' } },
          {
            label: 'Spatial, Vector & Temporal',
            collapsed: true,
            items: [
              { label: 'Spatial', link: 'documentdb/spatial', dateCreated: '2026-05-03', dateUpdated: '2026-05-03' },
              { label: 'Reference Geo Data', link: 'documentdb/geo-reference', dateCreated: '2026-07-13', dateUpdated: '2026-07-13' },
              { label: 'Geofencing', link: 'documentdb/geofencing', dateCreated: '2026-08-15', dateUpdated: '2026-08-15' },
              { label: 'Vector / ANN Search', link: 'documentdb/vector', dateCreated: '2026-06-01', dateUpdated: '2026-06-01' },
              { label: 'VectorData Connector', link: 'documentdb/vectordata', dateCreated: '2026-08-04', dateUpdated: '2026-08-04' },
              { label: 'Full-Text Search', link: 'documentdb/full-text', dateCreated: '2026-06-24', dateUpdated: '2026-06-24' },
              { label: 'Computed Properties', link: 'documentdb/computed-columns', dateCreated: '2026-06-26', dateUpdated: '2026-06-26' },
              { label: 'Blobs', link: 'documentdb/blobs', dateCreated: '2026-07-21', dateUpdated: '2026-07-21' },
              { label: 'Temporal Support', link: 'documentdb/temporal', dateCreated: '2026-06-12', dateUpdated: '2026-06-12' },
            ]
          },
          {
            label: 'Providers',
            collapsed: true,
            items: [
              { label: 'Provider Reference', link: 'documentdb/providers', dateCreated: '2026-05-29', dateUpdated: '2026-05-29' },
              { label: 'SQLite', link: 'documentdb/sqlite', dateCreated: '2026-05-31', dateUpdated: '2026-05-31' },
              { label: 'SQLCipher (Encrypted)', link: 'documentdb/sqlcipher', dateCreated: '2026-03-26', dateUpdated: '2026-03-26' },
              { label: 'PostgreSQL', link: 'documentdb/postgresql', dateCreated: '2026-05-31', dateUpdated: '2026-05-31' },
              { label: 'CockroachDB', link: 'documentdb/cockroachdb', dateCreated: '2026-07-11', dateUpdated: '2026-07-11' },
              { label: 'SQL Server', link: 'documentdb/sqlserver', dateCreated: '2026-05-31', dateUpdated: '2026-05-31' },
              { label: 'MySQL', link: 'documentdb/mysql', dateCreated: '2026-05-31', dateUpdated: '2026-05-31' },
              { label: 'MariaDB', link: 'documentdb/mariadb', dateCreated: '2026-07-11', dateUpdated: '2026-07-11' },
              { label: 'Oracle', link: 'documentdb/oracle', dateCreated: '2026-06-10', dateUpdated: '2026-06-10' },
              { label: 'DuckDB', link: 'documentdb/duckdb', dateCreated: '2026-05-31', dateUpdated: '2026-05-31' },
              { label: 'Azure Cosmos DB', link: 'documentdb/cosmosdb', dateCreated: '2026-05-31', dateUpdated: '2026-05-31' },
              { label: 'Azure Table Storage', link: 'documentdb/azure-table', dateCreated: '2026-07-02', dateUpdated: '2026-07-02' },
              { label: 'Amazon DynamoDB', link: 'documentdb/dynamodb', dateCreated: '2026-07-02', dateUpdated: '2026-07-02' },
              { label: 'MongoDB', link: 'documentdb/mongodb', dateCreated: '2026-05-31', dateUpdated: '2026-05-31' },
              { label: 'Amazon DocumentDB', link: 'documentdb/amazon-documentdb', dateCreated: '2026-07-12', dateUpdated: '2026-07-12' },
              { label: 'Redis', link: 'documentdb/redis', dateCreated: '2026-07-12', dateUpdated: '2026-07-12' },
              { label: 'RavenDB', link: 'documentdb/ravendb', dateCreated: '2026-07-12', dateUpdated: '2026-07-12' },
              { label: 'Google Firestore', link: 'documentdb/firestore', dateCreated: '2026-07-12', dateUpdated: '2026-07-12' },
              { label: 'Firestore Mobile (on-device)', link: 'documentdb/firestore-mobile', dateCreated: '2026-07-16', dateUpdated: '2026-07-16' },
              { label: 'LiteDB', link: 'documentdb/litedb', dateCreated: '2026-05-31', dateUpdated: '2026-05-31' },
              { label: 'IndexedDB (Blazor WASM)', link: 'documentdb/indexeddb', dateCreated: '2026-05-06', dateUpdated: '2026-05-06' },
            ]
          },
          {
            label: 'Admin UI',
            collapsed: true,
            items: [
              { label: 'Overview', link: 'documentdb/admin/', dateCreated: '2026-07-27', dateUpdated: '2026-07-27' },
              { label: 'Connections', link: 'documentdb/admin/connections', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'Browse & Edit', link: 'documentdb/admin/browse', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'Structure & Indexes', link: 'documentdb/admin/structure', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'Query Console', link: 'documentdb/admin/query-console', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'History', link: 'documentdb/admin/history', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'Geometry', link: 'documentdb/admin/geometry', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'Full Text', link: 'documentdb/admin/full-text', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'Vectors', link: 'documentdb/admin/vectors', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'Blobs', link: 'documentdb/admin/blobs', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'Encrypted Fields', link: 'documentdb/admin/encrypted-fields', dateCreated: '2026-08-04', dateUpdated: '2026-08-04' },
              { label: 'Outbox', link: 'documentdb/admin/outbox', dateCreated: '2026-08-04', dateUpdated: '2026-08-04' },
              { label: 'Generate Test Data', link: 'documentdb/admin/generate', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'Import & Export', link: 'documentdb/admin/import-export', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'AI Assistant', link: 'documentdb/admin/assistant', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'Terminal UI', link: 'documentdb/admin/terminal', dateCreated: '2026-08-02', dateUpdated: '2026-08-02' },
              { label: 'Docker Desktop', link: 'documentdb/admin/docker-desktop', dateCreated: '2026-08-05', dateUpdated: '2026-08-05' },
              { label: 'Aspire AppHost', link: 'documentdb/admin/aspire', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'Configuration & Security', link: 'documentdb/admin/configuration', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
              { label: 'Demo Mode', link: 'documentdb/admin/demo-mode', dateCreated: '2026-08-01', dateUpdated: '2026-08-01' },
            ]
          },
          {
            label: 'Integrations',
            items: [
              { label: 'JSON Schema Validation', link: 'documentdb/validation', dateCreated: '2026-06-23', dateUpdated: '2026-06-23' },
              { label: 'OData Endpoints', link: 'documentdb/odata', dateCreated: '2026-06-23', dateUpdated: '2026-06-23' },
              { label: 'Offline Sync (Shiny.Data.Sync)', link: 'documentdb/data-sync', dateCreated: '2026-06-23', dateUpdated: '2026-06-23' },
              { label: 'Orleans Persistence', link: 'documentdb/orleans', dateCreated: '2026-06-13', dateUpdated: '2026-06-13' },
              { label: 'Orleans Streams', link: 'documentdb/orleans-streams', dateCreated: '2026-08-11', dateUpdated: '2026-08-11' },
              { label: 'Aspire', link: 'documentdb/aspire', dateCreated: '2026-06-23', dateUpdated: '2026-06-23' },
            ]
          },
          {
            label: 'Reference & Support',
            collapsed: true,
            items: [
              { label: 'Performance', link: 'documentdb/performance', dateCreated: '2026-05-29', dateUpdated: '2026-05-29' },
              { label: 'FAQ & Decision Trees', link: 'documentdb/faq', dateCreated: '2026-06-19', dateUpdated: '2026-06-19' },
              { label: 'Limitations', link: 'documentdb/limitations', dateCreated: '2026-05-29', dateUpdated: '2026-05-29' },
              { label: 'Release Notes', link: 'documentdb/release-notes', dateCreated: '2026-02-23', dateUpdated: '2026-02-23' },
            ]
          }
        ]
      },
      {
        label: 'Spatial',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'spatial/', dateCreated: '2026-02-23', dateUpdated: '2026-02-23' },
          { label: 'Geometry Types', link: 'spatial/geometry', dateCreated: '2026-02-23', dateUpdated: '2026-02-23' },
          { label: 'Database Operations', link: 'spatial/database', dateCreated: '2026-02-23', dateUpdated: '2026-02-23' },
          { label: 'Querying', link: 'spatial/queries', dateCreated: '2026-02-23', dateUpdated: '2026-02-23' },
          { label: 'Algorithms & Serialization', link: 'spatial/algorithms', dateCreated: '2026-02-23', dateUpdated: '2026-02-23' },
          { label: 'Pre-built Databases', link: 'spatial/prebuilt', dateCreated: '2026-02-23', dateUpdated: '2026-02-23' },
          { label: 'Geofencing', link: 'spatial/geofencing', dateCreated: '2026-03-01', dateUpdated: '2026-03-01' },
          { label: 'Release Notes', link: 'spatial/release-notes', dateCreated: '2026-02-23', dateUpdated: '2026-02-23' }
        ]
      },
      {
        label: 'Data Sync',
        jumpTo: true,
        items: [
          { label: 'Getting Started', link: 'client/datasync/', dateCreated: '2026-05-02', dateUpdated: '2026-05-02' },
          { label: 'Architecture', link: 'client/datasync/architecture', dateCreated: '2026-06-09', dateUpdated: '2026-06-09' },
          { label: 'Entity Registration', link: 'client/datasync/entity-registration', dateCreated: '2026-05-02', dateUpdated: '2026-05-02' },
          { label: 'Conflict Resolution', link: 'client/datasync/conflict-resolution', dateCreated: '2026-06-09', dateUpdated: '2026-06-09' },
          { label: 'Removal Strategies', link: 'client/datasync/removal-strategies', dateCreated: '2026-05-02', dateUpdated: '2026-05-02' },
          { label: 'Sync Interceptors', link: 'client/datasync/sync-interceptor', dateCreated: '2026-05-02', dateUpdated: '2026-05-02' },
          { label: 'Server API Contracts', link: 'client/datasync/server-contracts', dateCreated: '2026-05-02', dateUpdated: '2026-05-02' },
          { label: 'Platform Behavior', link: 'client/datasync/platform-behavior', dateCreated: '2026-06-09', dateUpdated: '2026-06-09' },
          { label: 'Custom Transports', link: 'client/datasync/custom-transports', dateCreated: '2026-06-09', dateUpdated: '2026-06-09' },
          { label: 'Release Notes', link: 'client/release-notes', dateCreated: '2023-07-06', dateUpdated: '2023-07-06' }
        ]
      },
      {
        label: 'Stores',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'stores/', dateCreated: '2025-07-03', dateUpdated: '2025-07-03' },
          { label: 'Persistent Services', link: 'stores/persistent-services', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
          { label: 'Release Notes', link: 'stores/release-notes', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' }
        ]
      },
    ]
  },
  {
    id: 'server',
    label: 'Server & Cloud',
    link: '/httpserver/',
    icon: 'cloud-download',
    items:[
      {
        label: 'HTTP Server',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'httpserver/', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
          { label: 'FAQ', link: 'httpserver/faq', dateCreated: '2026-09-28', dateUpdated: '2026-09-28', showNew: false },
          { label: 'Hosting & Lifecycle', link: 'httpserver/hosting', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
          { label: 'Configuration', link: 'httpserver/configuration', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
          {
            label: 'Handling Requests',
            items:[
              { label: 'Routing', link: 'httpserver/routing', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Middleware', link: 'httpserver/middleware', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Typed Endpoints', link: 'httpserver/endpoints', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Results & JSON', link: 'httpserver/results', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Serialization & Formats', link: 'httpserver/serialization', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'JSON Patch', link: 'httpserver/json-patch', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
              { label: 'Errors & Problem Details', link: 'httpserver/errors', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Sessions', link: 'httpserver/sessions', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Localization', link: 'httpserver/localization', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
              { label: 'Request Timeouts', link: 'httpserver/timeouts', dateCreated: '2026-08-23', dateUpdated: '2026-08-23', showNew: false },
              { label: 'Idempotency Keys', link: 'httpserver/idempotency', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
              { label: 'OpenAPI', link: 'httpserver/openapi', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'API Versioning', link: 'httpserver/api-versioning', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' }
            ]
          },
          {
            label: 'Content',
            items:[
              { label: 'Static Files', link: 'httpserver/static-files', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Blazor WebAssembly', link: 'httpserver/blazor', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Uploads & Downloads', link: 'httpserver/files', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'File Browser', link: 'httpserver/file-browser', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'WebDAV', link: 'httpserver/webdav', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Resumable Uploads (tus)', link: 'httpserver/tus', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
              { label: 'CalDAV & CardDAV', link: 'httpserver/caldav', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
              { label: 'NuGet Feed', link: 'httpserver/nuget', dateCreated: '2026-10-06', dateUpdated: '2026-10-06' },
              { label: 'npm Registry', link: 'httpserver/npm', dateCreated: '2026-10-06', dateUpdated: '2026-10-06' },
              { label: 'File Sync', link: 'httpserver/filesync', dateCreated: '2026-10-06', dateUpdated: '2026-10-06' },
              { label: 'Compression', link: 'httpserver/compression', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Content Digests', link: 'httpserver/content-digest', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
              { label: 'Caching & Conditional Requests', link: 'httpserver/caching', dateCreated: '2026-08-23', dateUpdated: '2026-08-23', showNew: false }
            ]
          },
          {
            label: 'Protocols & Realtime',
            items:[
              { label: 'Protocols', link: 'httpserver/protocols', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'WebSockets', link: 'httpserver/websockets', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Server-Sent Events', link: 'httpserver/sse', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Switchboard', link: 'httpserver/switchboard', dateCreated: '2026-09-29', dateUpdated: '2026-09-29' },
              { label: 'gRPC & gRPC-Web', link: 'httpserver/grpc', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false }
            ]
          },
          {
            label: 'Security',
            items:[
              { label: 'Authentication', link: 'httpserver/authentication', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Authorization', link: 'httpserver/authorization', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'JWT', link: 'httpserver/jwt', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'OAuth Loopback Sign-in', link: 'httpserver/oauth-loopback', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
              { label: 'TLS & Certificates', link: 'httpserver/tls', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Automatic HTTPS (ACME)', link: 'httpserver/acme', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
              { label: 'CORS', link: 'httpserver/cors', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Rate Limiting', link: 'httpserver/rate-limiting', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'IP Filtering', link: 'httpserver/ip-filtering', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Host Filtering', link: 'httpserver/host-filtering', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' },
              { label: 'Antiforgery & Headers', link: 'httpserver/antiforgery', dateCreated: '2026-08-23', dateUpdated: '2026-08-23', showNew: false },
              { label: 'Webhooks', link: 'httpserver/webhooks', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' }
            ]
          },
          {
            label: 'Connectivity',
            items:[
              { label: 'Tunnelling', link: 'httpserver/tunneling', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'SSH & Quick Tunnels', link: 'httpserver/ssh', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Cloudflare, ngrok & Tailscale', link: 'httpserver/tunnel-agents', dateCreated: '2026-08-23', dateUpdated: '2026-08-23', showNew: false },
              { label: 'Azure Relay', link: 'httpserver/azure-relay', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Discovery (mDNS)', link: 'httpserver/discovery', dateCreated: '2026-08-23', dateUpdated: '2026-08-23', showNew: false },
              { label: 'Reverse Proxy', link: 'httpserver/proxy', dateCreated: '2026-08-23', dateUpdated: '2026-08-23', showNew: false },
              { label: 'PROXY Protocol', link: 'httpserver/proxy-protocol', dateCreated: '2026-09-28', dateUpdated: '2026-09-28' }
            ]
          },
          {
            label: 'Integrations',
            showNew: false,
            items:[
              { label: 'Mobile', link: 'httpserver/maui', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'tvOS', link: 'httpserver/tvos', dateCreated: '2026-09-05', dateUpdated: '2026-09-05', showNew: false },
              { label: 'Shiny.Mediator', link: 'httpserver/mediator', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Shiny.DocumentDb', link: 'httpserver/documentdb', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false },
              { label: 'Model Context Protocol', link: 'httpserver/mcp', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false }
            ]
          },
          {
            label: 'Operations',
            showNew: false,
            items:[
              { label: 'Health & Telemetry', link: 'httpserver/diagnostics', dateCreated: '2026-08-23', dateUpdated: '2026-08-23', showNew: false },
              { label: 'W3C Access Logs', link: 'httpserver/logging', dateCreated: '2026-08-23', dateUpdated: '2026-08-23', showNew: false },
              { label: 'Testing', link: 'httpserver/testing', dateCreated: '2026-08-23', dateUpdated: '2026-08-23', showNew: false },
              { label: 'Command Line Tool', link: 'httpserver/cli', dateCreated: '2026-08-20', dateUpdated: '2026-08-20', showNew: false }
            ]
          },
          { label: 'Release Notes', link: 'httpserver/release-notes', dateCreated: '2026-08-11', dateUpdated: '2026-08-11', showNew: false }
        ]
      },
      {
        label: 'Web Hosting',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'webhost/', dateCreated: '2025-07-03', dateUpdated: '2025-07-03' },
          { label: 'Release Notes', link: 'webhost/release-notes', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' }
        ]
      },
      {
        label: 'Blazor Hosting',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'blazorhost/', dateCreated: '2026-06-11', dateUpdated: '2026-06-11' },
          { label: 'Release Notes', link: 'blazorhost/release-notes', dateCreated: '2026-06-14', dateUpdated: '2026-06-14' }
        ]
      },
      {
        label: 'Push (Server)',
        jumpTo: true,
        items:[
          { label: 'Getting Started', link: 'extensions-push/', dateCreated: '2026-06-20', dateUpdated: '2026-06-20' },
          { label: 'Sending', link: 'extensions-push/sending', dateCreated: '2026-06-20', dateUpdated: '2026-06-20' },
          { label: 'APNs', link: 'extensions-push/apns', dateCreated: '2026-06-20', dateUpdated: '2026-06-20' },
          { label: 'Live Activities', link: 'extensions-push/live-activities', dateCreated: '2026-07-31', dateUpdated: '2026-07-31' },
          { label: 'Persistence', link: 'extensions-push/persistence', dateCreated: '2026-06-20', dateUpdated: '2026-06-20' },
          { label: 'Metrics', link: 'extensions-push/metrics', dateCreated: '2026-06-20', dateUpdated: '2026-06-20' },
          { label: 'Release Notes', link: 'extensions-push/release-notes', dateCreated: '2026-06-20', dateUpdated: '2026-06-20' }
        ]
      },
      {
        label: 'Aspire',
        expandInHomenav: true,
        items:[
          {
            label: 'Orleans Database Providers',
            jumpTo: true,
            items:[
              { label: 'Getting Started', link: 'aspire/orleans/', dateCreated: '2026-02-25', dateUpdated: '2026-02-25' },
              { label: 'Hosting (AppHost)', link: 'aspire/orleans/hosting', dateCreated: '2026-02-25', dateUpdated: '2026-02-25' },
              { label: 'Server (Silo)', link: 'aspire/orleans/server', dateCreated: '2026-02-25', dateUpdated: '2026-02-25' },
              { label: 'Client', link: 'aspire/orleans/client', dateCreated: '2026-02-25', dateUpdated: '2026-02-25' },
              { label: 'Release Notes', link: 'aspire/orleans/release-notes', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' }
            ]
          },
          {
            label: 'Aspire Gluetun VPN',
            jumpTo: true,
            items:[
              { label: 'Getting Started', link: 'aspire/gluetun/', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
              { label: 'Configuration', link: 'aspire/gluetun/configuration', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
              { label: 'Container Routing', link: 'aspire/gluetun/routing', dateCreated: '2026-02-26', dateUpdated: '2026-02-26' },
              { label: 'Release Notes', link: 'aspire/gluetun/release-notes', dateCreated: '2026-02-25', dateUpdated: '2026-02-25' }
            ]
          },
          {
            label: 'Aspire Tunnelling',
            jumpTo: true,
            items:[
              { label: 'Getting Started', link: 'aspire/tunnel/', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
              { label: 'Providers', link: 'aspire/tunnel/providers', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
              { label: 'The Shiny Relay', link: 'aspire/tunnel/relay', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
              { label: 'Port Forwarding', link: 'aspire/tunnel/port-forward', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
              { label: 'How It Works', link: 'aspire/tunnel/custom-providers', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' },
              { label: 'Release Notes', link: 'aspire/tunnel/release-notes', dateCreated: '2026-08-12', dateUpdated: '2026-08-12' }
            ]
          },
          {
            label: 'DocumentDB',
            items:[
              { label: 'Aspire', link: 'documentdb/aspire', dateCreated: '2026-06-23', dateUpdated: '2026-06-23', attrs: { target: '_blank' } },
              { label: 'Orleans', link: 'documentdb/orleans', dateCreated: '2026-06-13', dateUpdated: '2026-06-13', attrs: { target: '_blank' } }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'Blazor Playgrounds',
    link: '/playground/index.html',
    icon: 'laptop',
    homeNavOnly: true,
    items: [
      { label: 'AI Conversation + Speech', link: 'https://shinyorg.github.io/speech/', attrs: { target: '_blank' } },
      { label: 'Controls',        link: 'https://shinyorg.github.io/controls/',       attrs: { target: '_blank' } },
      { label: 'DocumentDb',      link: 'https://docdbmyadmin.acrhome.ca/',          attrs: { target: '_blank' } },
      { label: 'Mediator',        link: 'https://shinyorg.github.io/mediator/',       attrs: { target: '_blank' } },
      { label: 'Shiny Core',      link: 'https://shinyorg.github.io/shiny/',          attrs: { target: '_blank' } },
    ],
  }
];

/** How long after `dateUpdated` an item keeps its "New" pill. */
export const NEW_BADGE_DAYS = 60;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Every library node (`jumpTo: true`) and everything beneath one — the only items allowed to be New.
 * Inside a category group (e.g. Office) a plain page listed beside its library counts too, since
 * that's how library feature pages like "Spreadsheet Formatting" are laid out. Top-level site pages
 * (NuGets, Getting Help) and the category groups themselves never count.
 */
const libraryItems = new WeakSet();
(function markLibraries(items, inLibrary, nested) {
  const besideLibrary = nested && items.some((item) => item.jumpTo === true);
  for (const item of items) {
    const isLibrary = inLibrary || item.jumpTo === true || (besideLibrary && !item.items);
    if (isLibrary) libraryItems.add(item);
    if (item.items?.length) markLibraries(item.items, isLibrary, true);
  }
})(sidebarTopics.flatMap((topic) => topic.items || []), false, false);

const parseDate = (value) => (value ? Date.parse(`${value}T00:00:00Z`) : NaN);

/** A group's landing page: the first linked item, depth-first — same page its sidebar entry opens. */
function firstLinked(item) {
  if (item.link) return item;
  for (const child of item.items || []) {
    const found = firstLinked(child);
    if (found) return found;
  }
  return undefined;
}

/** The most recent `dateUpdated` on the item or anything beneath it. */
function latestUpdate(item) {
  let latest = parseDate(item.dateUpdated);
  for (const child of item.items || []) {
    const childLatest = latestUpdate(child);
    if (Number.isFinite(childLatest) && !(latest >= childLatest)) latest = childLatest;
  }
  return latest;
}

/**
 * True when the item's last major update (`dateUpdated`, or the latest beneath a group) is within
 * the last `NEW_BADGE_DAYS` days (relative to build time) and it hasn't opted out with
 * `showNew: false`. See the header comment for group rules.
 */
export function isNewItem(item, now = Date.now()) {
  if (!item || item.showNew === false || !libraryItems.has(item)) return false;
  const updated = item.items ? latestUpdate(item) : parseDate(item.dateUpdated);
  return Number.isFinite(updated) && now - updated <= NEW_BADGE_DAYS * DAY_MS;
}

/** "Mar 4, 2026" from a `YYYY-MM-DD` string. */
export function formatItemDate(value) {
  const d = new Date(`${value}T00:00:00Z`);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

const NEW_BADGE = { text: 'New', variant: 'success' };

/**
 * Returns a deep copy of the topics with all `jumpTo` properties removed,
 * so the config passes Starlight's schema validation. Any node flagged
 * `homeNavOnly` is dropped entirely — it stays in the homepage menu
 * (which reads the raw topics) but is excluded from the main sidebar.
 */
/**
 * The pill each `platform` value renders as.
 * Keep in sync with `PLATFORM_PILLS` in src/components/SidebarSublist.astro.
 */
const PLATFORM_BADGES = {
  maui: { text: 'MAUI', variant: 'tip' },
  blazor: { text: 'Blazor', variant: 'note' },
};

export function cleanTopicsForStarlight(topics) {
  const stripHomeNavOnly = (nodes) =>
    nodes
      .filter(node => !node.homeNavOnly)
      .map(node => (node.items ? { ...node, items: stripHomeNavOnly(node.items) } : node));

  // Turn `platform` into a badge. Starlight's sidebar schema only carries one badge per entry,
  // so when the item already has one (usually "New") the platform rides along as a marker class
  // that our SidebarSublist override expands into a second pill.
  // `dateUpdated` → "New" pill; `dateCreated` → hover tooltip on links (groups have no attrs).
  const now = Date.now();
  const applyDates = (nodes) =>
    nodes.map(node => {
      const next = node.items ? { ...node, items: applyDates(node.items) } : { ...node };
      // Checked against the original node — `isNewItem` only recognises the raw tree's objects.
      if (!next.badge && isNewItem(node, now)) next.badge = { ...NEW_BADGE };
      if (next.dateCreated && next.link) {
        next.attrs = { title: `Added ${formatItemDate(next.dateCreated)}`, ...(next.attrs || {}) };
      }
      return next;
    });

  const applyPlatformBadges = (nodes) =>
    nodes.map(node => {
      const next = node.items ? { ...node, items: applyPlatformBadges(node.items) } : { ...node };
      const platform = PLATFORM_BADGES[next.platform];
      if (platform) {
        next.badge = next.badge
          ? { ...next.badge, class: [next.badge.class, `sl-platform-${next.platform}`].filter(Boolean).join(' ') }
          : { ...platform };
      }
      return next;
    });

  return JSON.parse(JSON.stringify(applyPlatformBadges(stripHomeNavOnly(applyDates(topics))), (key, value) => {
    if (key === 'jumpTo') return undefined;
    if (key === 'expandInHomenav') return undefined;
    if (key === 'flattenInHomenav') return undefined;
    if (key === 'featuredInHomenav') return undefined;
    if (key === 'homeNavOnly') return undefined;
    if (key === 'platform') return undefined;
    if (key === 'dateCreated') return undefined;
    if (key === 'dateUpdated') return undefined;
    if (key === 'showNew') return undefined;
    return value;
  }));
}

export const sidebarTopicsOptions = {
  exclude: [
    '/blog',
    '/blog/**/*',
    '/foundation/hosting/uno',
    '/client/core/android-foreground',
    '/mediator/extensions',
    '/controls/tableview/release-notes',
    '/controls/scheduler/release-notes',
    '/controls/mermaid-diagrams/release-notes',
  ],
  topics: {
    foundation: ['/', '/libraries/foundation'],
    hardware: ['/libraries/hardware'],
    'device-data': ['/libraries/device-data'],
    ai: ['/libraries/ai'],
    background: ['/libraries/background'],
    maui: ['/libraries/maui'],
    data: ['/libraries/data'],
    server: ['/libraries/server'],
  },
};
