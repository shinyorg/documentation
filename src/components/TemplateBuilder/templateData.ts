import type { TemplateKind } from './templateFiles';

/**
 * Single source of truth for every NuGet package version surfaced in any of the
 * three template builder tabs (MAUI / ASP.NET / Blazor). Updating a key here
 * propagates to every config that references it.
 */
export const VERSIONS = {
    // Shiny — family-versioned (all *.Maui / *.Blazor / *.AspNet ship together)
    shinyMediator: '6.12.0',
    shinyShell: '7.0.3',
    shinyControls: '2.1.0',
    // Shiny — client packages that share the core release train (the default Shiny version).
    // The client Microsoft.Extensions.AI tool packages (Contacts / Locations / Notification reminders)
    // ship on this same train, so they track this key too.
    shinyClient: '6.4.0',
    shinyConfiguration: '6.4.0',
    shinyLocalization: '2.0.1',
    shinyStores: '6.0.1',
    shinyReflector: '6.0.1',
    shinyDI: '6.0.1',
    shinySerialization: '6.0.1',
    shinyContactStore: '6.4.0',
    shinyCalendar: '6.4.0',
    shinySpeech: '3.0.0-beta-0036',
    shinyAiConversation: '3.0.0-beta-0036',
    shinyMusic: '4.1.0',
    shinyHealth: '2.0.1',
    shinyDocumentDb: '14.1.0',
    shinyHttpServer: '2.2.1',
    shinyDataSync: '6.4.0',
    shinyObd: '1.4.0',
    /** Recognition IQ (Face / Voice / Document Intelligence) ships as one train — no stable release yet. */
    shinyRecognition: '1.0.0-beta-0007',
    /** Shiny.AspNet.* server libraries (WebHosting, JsonPatch, Idempotency, ...) ship together. */
    shinyAspNet: '1.0.0',
    shinyExtensionsPush: '3.0.0-beta-0008',
    shinyFirestoreMobile: '4.0.1',
    /** Shiny.Push.FirebaseMessaging is off the core train */
    shinyPushFirebase: '6.0.0',
    shinyBleHubs: '1.5.0-beta-0004',
    /** shinyorg/hubs - ships with BluetoothLE Hubs, one version from 1.5 */
    shinyUniversalHubs: '1.5.0-beta-0004',
    shinyAppDeviceBridge: '2.1.0',
    shinyPermissions: '1.0.0-beta-0009',
    /** shinyorg/actors - Shiny.Actors and its add-ons ship together */
    shinyActors: '1.0.0-beta.11',

    // MAUI tooling
    devflow: '0.1.0-preview.13.26526.5',

    // Microsoft + third-party
    /** The MicrosoftVersion MSBuild property - Microsoft.Extensions.* / ASP.NET Core, kept on the TFM's major */
    microsoftExtensions: '10.0.14',
    ctMvvm: '8.4.2',
    sentry: '6.12.1',
    biometric: '2.5.1',
    liveCharts: '2.0.5',
    skia: '4.153.1',
    skiaExtended: '3.0.0',
    userDialogs: '9.2.2',
    mudblazor: '9.11.0',
    radzen: '12.1.7',
    fluentUI: '5.0.1',
    sqliteNetPcl: '1.11.285',
    roomsharp: '0.5.5',
    msExtAi: '10.11.0',
    androidAuto: '1.7.0.4',
    systemReactive: '7.0.0',
    humanizer: '3.0.10',
    unitsNet: '5.75.1',
    sysLinqAsync: '7.0.1',
    refit: '16.4.0',
    orleans: '10.4.0',
    scalar: '2.18.3',
} as const;

export type ParamType = 'bool' | 'choice' | 'string';

export interface TemplateChoice {
    value: string;
    label: string;
    description?: string;
}

export interface TemplateParam {
    id: string;
    label: string;
    type: ParamType;
    defaultValue: string | boolean;
    category: string;
    description?: string;
    /** NuGet package version installed by this option */
    version?: string;
    choices?: TemplateChoice[];
    /** Shown conditionally when this evaluates to true */
    visibleWhen?: (state: TemplateState) => boolean;
}

export interface TemplateCategory {
    id: string;
    title: string;
    span: 4 | 6 | 8 | 12;
}

export interface TemplateState {
    projectName: string;
    applicationId: string;
    [key: string]: string | boolean;
}

export interface TemplateConfig {
    kind: TemplateKind;
    label: string;
    blurb: string;
    /** Whether this kind exposes the Application ID field (mostly relevant to MAUI). */
    showApplicationId: boolean;
    categories: readonly TemplateCategory[];
    params: TemplateParam[];
    computeSymbols: (state: TemplateState) => Record<string, boolean | string>;
}

// ---------------------------------------------------------------------------
// MAUI (ShinyApp)
// ---------------------------------------------------------------------------

const MAUI_CATEGORIES: readonly TemplateCategory[] = [
    { id: 'project', title: 'Project', span: 12 },
    { id: 'framework', title: 'Framework', span: 12 },
    { id: 'configuration', title: 'Configuration', span: 6 },
    { id: 'logging', title: 'Logging', span: 6 },
    { id: 'services', title: 'Services', span: 12 },
    { id: 'code', title: 'Code Generation', span: 12 },
    { id: 'ui', title: 'UI Libraries', span: 12 },
    { id: 'blazor', title: 'Blazor Components', span: 12 },
    { id: 'storage', title: 'Data & Storage', span: 6 },
    { id: 'ai', title: 'AI', span: 6 },
    { id: 'extensions', title: 'Shiny Extensions', span: 6 },
    { id: 'platform', title: 'Platform', span: 6 },
    { id: 'utility', title: 'Utilities', span: 6 },
];

const noDesktop = (s: TemplateState) => !s.usewindows && !s.usemaccatalyst;

const MAUI_PARAMS: TemplateParam[] = [
    // Platform targets
    { id: 'useios', label: 'iOS', type: 'bool', defaultValue: true, category: 'project' },
    { id: 'useandroid', label: 'Android', type: 'bool', defaultValue: true, category: 'project' },
    { id: 'usemaccatalyst', label: 'Mac Catalyst', type: 'bool', defaultValue: false, category: 'project' },
    { id: 'usewindows', label: 'Windows', type: 'bool', defaultValue: false, category: 'project' },

    // Developer tools
    { id: 'devflow', label: 'MAUI DevFlow', type: 'bool', defaultValue: true, category: 'project',
        version: VERSIONS.devflow,
        description: 'Debug-only toolkit for visual tree inspection, performance profiling, network monitoring, and AI agent automation. Adds Microsoft.Maui.DevFlow.Agent to your app, which connects to the MAUI CLI (maui devflow) https://github.com/dotnet/maui-labs' },

    // Choices
    { id: 'Framework', label: 'Target Framework', type: 'choice', defaultValue: 'net10.0', category: 'project',
        description: 'The target framework for the project',
        choices: [
            { value: 'net10.0', label: '.NET 10.0', description: 'Target .NET 10.0' },
        ],
    },
    { id: 'mvvmframework', label: 'MVVM Framework', type: 'choice', defaultValue: 'Shiny MAUI Shell', category: 'framework',
        choices: [
            { value: 'None', label: 'None', description: 'No MVVM framework' },
            { value: 'Shiny MAUI Shell', label: 'Shiny MAUI Shell', description: 'Shiny MAUI Shell https://shinylib.net/mauishell/' },
            { value: 'Prism', label: 'Prism', description: 'Prism https://prismlibrary.com' },
        ],
    },
    { id: 'push', label: 'Push Notifications', type: 'choice', defaultValue: 'None', category: 'services',
        description: 'Wires up permissions & libraries for the selected push option. Configure API keys in appsettings.json or MauiProgram.cs',
        choices: [
            { value: 'None', label: 'None', description: 'No push library is installed' },
            { value: 'Native', label: 'Native (Shiny.Push)', description: 'Native push notifications (Shiny.Push)' },
            { value: 'Azure Notification Hubs', label: 'Azure Notification Hubs', description: 'Azure Notification Hubs (Shiny.Push.AzureNotificationHubs)' },
            { value: 'Firebase Messaging', label: 'Firebase Cloud Messaging', description: 'Firebase Cloud Messaging (Shiny.Push.FirebaseMessaging)' },
        ],
    },
    { id: 'maptype', label: 'Maps', type: 'choice', defaultValue: 'None', category: 'services',
        choices: [
            { value: 'None', label: 'None', description: 'No map support' },
            { value: 'MAUI', label: 'MAUI Maps', description: 'MAUI Maps' },
            { value: 'Google Maps', label: 'Google Maps (Android & iOS)', description: 'Google Maps for Android & iOS' },
        ],
    },
    { id: 'authtype', label: 'Authentication', type: 'choice', defaultValue: 'None', category: 'code',
        description: 'MSAL https://devblogs.microsoft.com/dotnet/authentication-in-dotnet-maui-apps-msal/ | MAUI WebAuthenticator https://learn.microsoft.com/en-us/dotnet/maui/platform-integration/communication/authentication',
        choices: [
            { value: 'None', label: 'None', description: 'No authentication setup' },
            { value: 'MAUI Web Authenticator', label: 'MAUI Web Authenticator', description: 'MAUI Web Authenticator' },
            { value: 'MSAL Basic', label: 'MSAL - Basic', description: 'Microsoft Authentication Library - Basic' },
            { value: 'MSAL AzureB2C', label: 'MSAL - Azure B2C', description: 'Microsoft Authentication Library - Azure B2C' },
            { value: 'MSAL Broker', label: 'MSAL - Broker', description: 'Microsoft Authentication Library - Broker' },
        ],
    },

    // String inputs (conditional)
    { id: 'deeplinks', label: 'Deep Link URI', type: 'string', defaultValue: '', category: 'code',
        description: 'Setup initial deep link support URI' },
    { id: 'msalclientid', label: 'MSAL Client ID', type: 'string', defaultValue: '', category: 'code',
        description: 'Microsoft Authentication Library (MSAL) Client ID',
        visibleWhen: (s) => s.authtype === 'MSAL Basic' || s.authtype === 'MSAL AzureB2C' || s.authtype === 'MSAL Broker' },
    { id: 'mapsandroidkey', label: 'Android Maps API Key', type: 'string', defaultValue: '', category: 'services',
        description: 'Google Maps API Key for Android https://learn.microsoft.com/en-us/xamarin/xamarin-forms/user-interface/map/setup',
        visibleWhen: (s) => s.maptype !== 'None' },

    // Framework bools
    { id: 'ctmvvm', label: 'Community Toolkit MVVM', type: 'bool', defaultValue: true, category: 'framework',
        version: VERSIONS.ctMvvm,
        description: 'Source-generated MVVM helpers (ObservableProperty, RelayCommand) by Microsoft https://learn.microsoft.com/en-us/dotnet/communitytoolkit/mvvm/' },
    { id: 'shinymediator', label: 'Shiny Mediator', type: 'bool', defaultValue: true, category: 'framework',
        version: VERSIONS.shinyMediator,
        description: 'Event-driven messaging, middleware, and request/response pipeline (includes Resilience) https://shinylib.net/mediator/' },
    { id: 'mediatorcaching', label: 'Mediator Caching', type: 'bool', defaultValue: false, category: 'framework',
        version: VERSIONS.shinyMediator,
        description: 'Memory caching for handlers marked [Cache] (Shiny.Mediator.Caching.MicrosoftMemoryCache) https://shinylib.net/mediator/middleware/caching/', visibleWhen: (s) => !!s.shinymediator },
    { id: 'mediatorfluentvalidation', label: 'Mediator FluentValidation', type: 'bool', defaultValue: false, category: 'framework',
        version: VERSIONS.shinyMediator,
        description: 'FluentValidation for contracts marked [Validate] (Shiny.Mediator.FluentValidation) https://shinylib.net/mediator/middleware/validation/', visibleWhen: (s) => !!s.shinymediator },
    { id: 'mediatorappfunctions', label: 'Mediator App Functions', type: 'bool', defaultValue: false, category: 'framework',
        version: VERSIONS.shinyMediator,
        description: 'Expose mediator contracts as Siri / Gemini app functions (Shiny.Mediator.AppFunctions) https://shinylib.net/mediator/extensions/appfunctions/', visibleWhen: (s) => !!s.shinymediator },

    // Configuration
    { id: 'configuration', label: 'AppSettings.json', type: 'bool', defaultValue: true, category: 'configuration',
        version: VERSIONS.shinyConfiguration,
        description: 'App configuration from JSON files https://shinylib.net/extensions/configuration/' },
    { id: 'localization', label: 'Localization', type: 'bool', defaultValue: false, category: 'configuration',
        version: VERSIONS.shinyLocalization,
        description: 'Source-generated localization https://shinylib.net/extensions/localization/' },

    // Logging
    { id: 'sentry', label: 'Sentry.IO', type: 'bool', defaultValue: false, category: 'logging',
        version: VERSIONS.sentry,
        description: 'Error tracking & performance monitoring https://docs.sentry.io/platforms/dotnet/guides/maui/' },

    // Services
    { id: 'bluetoothle', label: 'Bluetooth LE', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'BLE client operations https://shinylib.net/client/ble/' },
    { id: 'blehosting', label: 'Bluetooth LE Hosting', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'BLE peripheral/server hosting https://shinylib.net/client/blehosting/' },
    { id: 'jobs', label: 'Background Jobs', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Periodic background tasks https://shinylib.net/client/jobs/',
        visibleWhen: noDesktop },
    { id: 'gps', label: 'GPS', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Foreground & background GPS tracking https://shinylib.net/client/locations/gps/' },
    { id: 'geofencing', label: 'Geofencing', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Monitor geofence regions https://shinylib.net/client/locations/geofencing/' },
    { id: 'httptransfers', label: 'HTTP Transfers', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Background HTTP uploads & downloads https://shinylib.net/client/httptransfers/' },
    { id: 'datasync', label: 'Data Sync', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyDataSync,
        description: 'Bidirectional JSON sync \u2014 outbox/inbox over HTTP with platform-tier background transports https://shinylib.net/client/datasync/' },
    { id: 'wifi', label: 'Wi-Fi', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Wi-Fi scan, connect, hotspot & airplane mode https://shinylib.net/client/wifi/' },
    { id: 'discovery', label: 'Network Discovery', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'mDNS/Bonjour, SSDP and WS-Discovery browsing & publishing https://shinylib.net/client/discovery/' },
    { id: 'obd', label: 'OBD (Bluetooth LE)', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyObd,
        description: 'Vehicle OBD-II diagnostics over Bluetooth LE https://shinylib.net/obd/',
        visibleWhen: noDesktop },
    { id: 'httpserver', label: 'HTTP Server', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyHttpServer,
        description: 'Host HTTP/1.1, HTTP/2 & HTTP/3, WebSockets and SSE inside the app, where ASP.NET Core cannot run https://shinylib.net/httpserver/maui/' },
    { id: 'regiongeofencing', label: 'Region Geofencing', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Unlimited polygon, radius & reverse-geocoded regions driven by GPS (Shiny.Geofencing.Regions) https://shinylib.net/client/locations/region-geofencing/' },
    { id: 'regiongeofencingdocdb', label: 'Region Geofencing - DocumentDb', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Region sets read from a SQLite document store, plus bundled US & Canada regions (Shiny.Geofencing.Regions.DocumentDb) https://shinylib.net/client/locations/region-geofencing/',
        visibleWhen: (s) => !!s.regiongeofencing },
    { id: 'blehubshost', label: 'BLE Hubs - Host', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyBleHubs,
        description: 'SignalR-style hubs served over Bluetooth LE (Shiny.BluetoothLE.Hubs.Host) https://shinylib.net/blehubs/hosting/' },
    { id: 'blehubsclient', label: 'BLE Hubs - Client', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyBleHubs,
        description: 'Typed client for BLE hubs (Shiny.BluetoothLE.Hubs.Client) https://shinylib.net/blehubs/client/' },
    { id: 'universalhubshost', label: 'Universal Hubs - Host (Preview)', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyUniversalHubs,
        description: 'The same hub over BLE and Wi-Fi at once - replaces the BLE Hubs host registration (Shiny.UniversalHubs.Host, not on nuget.org yet) https://shinylib.net/universalhubs/hosting/' },
    { id: 'universalhubsclient', label: 'Universal Hubs - Client (Preview)', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyUniversalHubs,
        description: 'Discovers hubs over BLE and mDNS, connects over Wi-Fi first with BLE fallback (Shiny.UniversalHubs.Client, not on nuget.org yet) https://shinylib.net/universalhubs/client/' },
    { id: 'beacons', label: 'Beacons', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'iBeacon ranging & monitoring plus Eddystone (Shiny.Beacons) https://shinylib.net/client/beacons/' },
    { id: 'wearables', label: 'Wearables', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Apple Watch (WatchConnectivity) & Wear OS (Data Layer) messaging (Shiny.Wearables) https://shinylib.net/client/wearables/',
        visibleWhen: noDesktop },
    { id: 'gamepad', label: 'Gamepads', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Game controllers - buttons, sticks, triggers, rumble & hotplug (Shiny.Gamepad) https://shinylib.net/client/gamepad/' },
    { id: 'gamecenter', label: 'Game Center', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Achievements & leaderboards over Apple Game Center / Google Play Games (Shiny.GameCenter) https://shinylib.net/client/gamecenter/' },
    { id: 'liveactivities', label: 'Live Activities', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'iOS Live Activities & Android 16 Live Updates (Shiny.Mobile.LiveActivities) https://shinylib.net/client/liveactivities/',
        visibleWhen: noDesktop },
    { id: 'appfunctions', label: 'App Functions', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Expose app actions to Siri, Spotlight, Shortcuts & Gemini (Shiny.AppFunctions) https://shinylib.net/client/appfunctions/' },
    { id: 'appstore', label: 'App Store', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Store version checks, open the store page & in-app review prompts (Shiny.AppStore) https://shinylib.net/client/appstore/' },
    { id: 'inapppurchases', label: 'In-App Purchases', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'StoreKit 2 / Google Play Billing purchases & subscriptions (Shiny.Mobile.InAppPurchases) https://shinylib.net/client/inapppurchases/',
        visibleWhen: noDesktop },
    { id: 'calldirectory', label: 'Call Directory', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Caller ID & call blocking - iOS CallKit extension / Android CallScreeningService (Shiny.Mobile.CallDirectory) https://shinylib.net/client/calldirectory/',
        visibleWhen: noDesktop },
    { id: 'vpn', label: 'VPN', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Install, connect & monitor a profile in the OS\'s built-in IKEv2 VPN client - iOS, Mac Catalyst, Android 11+ (Shiny.Net.Vpn) https://shinylib.net/client/vpn/' },
    { id: 'agesignals', label: 'Age Signals', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'The user\'s age range from Apple Declared Age Range (iOS 26+) / Google Play Age Signals (Shiny.AgeSignals) https://shinylib.net/client/agesignals/' },
    { id: 'actors', label: 'Actors', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyActors,
        description: 'Orleans-style virtual actors in-process - one call at a time, persisted state, streams & reminders (Shiny.Actors) https://shinylib.net/actors/' },
    { id: 'printing', label: 'Native Printing', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Print PDF, image & HTML through the OS print system (Shiny.Printing) https://shinylib.net/client/printing/native/' },
    { id: 'printersble', label: 'Thermal Printers (Bluetooth LE)', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'ESC/POS & TSPL receipt printers over Bluetooth LE (Shiny.Printers.BluetoothLE) https://shinylib.net/client/printing/thermal/' },
    { id: 'printersnetwork', label: 'Thermal Printers (Network)', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'ESC/POS & TSPL receipt printers over TCP 9100 with mDNS discovery (Shiny.Printers.Network) https://shinylib.net/client/printing/thermal/' },
    { id: 'notifications', label: 'Local Notifications', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Schedule & manage local notifications https://shinylib.net/client/notifications/' },
    { id: 'health', label: 'Health Data', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyHealth,
        description: 'Cross-platform health data access (HealthKit/Health Connect) https://shinylib.net/health/',
        visibleWhen: noDesktop },
    { id: 'contactstore', label: 'Contact Store', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyContactStore,
        description: 'Full CRUD access to device contacts (Shiny.Contacts) https://shinylib.net/client/contactstore/',
        visibleWhen: noDesktop },
    { id: 'calendar', label: 'Calendar Store', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyCalendar,
        description: 'Full CRUD access to device calendars & events with LINQ querying (Shiny.Calendar) https://shinylib.net/client/calendarstore/' },
    { id: 'shinyspeech', label: 'Speech (STT/TTS)', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'Speech-to-text, text-to-speech, and audio playback https://shinylib.net/speech/' },
    { id: 'speechazure', label: 'Azure AI Speech', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'Azure AI Speech provider for Shiny.Speech (pulls in Speech) https://shinylib.net/speech/microsoft-ai/' },
    { id: 'speechelevenlabs', label: 'ElevenLabs Speech', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'ElevenLabs STT/TTS provider for Shiny.Speech (pulls in Speech) https://shinylib.net/speech/elevenlabs/' },
    { id: 'speechtypecast', label: 'Typecast Speech', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'Typecast text-to-speech provider for Shiny.Speech (pulls in Speech) https://shinylib.net/speech/' },
    { id: 'speechopenai', label: 'OpenAI Speech', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'OpenAI Whisper STT & TTS provider for Shiny.Speech (pulls in Speech) https://shinylib.net/speech/openai/' },
    { id: 'audio', label: 'Audio', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'Microphone capture, playback, WAV recording, mic monitor & audio routes (Shiny.Audio) https://shinylib.net/speech/audio/' },
    { id: 'speechmicrosoftai', label: 'Speech - Microsoft.Extensions.AI', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'ISpeechToTextClient & ITextToSpeechClient over Shiny.Speech (Shiny.Speech.MicrosoftAI) https://shinylib.net/speech/microsoft-ai/' },
    { id: 'appdevicebridge', label: 'App Device Bridge', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyAppDeviceBridge,
        description: 'Host your web app on the device with native bridges (Shiny.AppDeviceBridge.WebView) https://shinylib.net/appdevicebridge/' },
    { id: 'aiconversation', label: 'AI Conversation', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyAiConversation,
        description: 'AI Conversation with speech recognition and text-to-speech https://shinylib.net/aiconversation/' },
    { id: 'aichatclient', label: 'AI Conversation Chat Client', type: 'choice', defaultValue: 'None', category: 'services',
        version: VERSIONS.shinyAiConversation,
        description: 'The chat client AI Conversation talks to https://shinylib.net/aiconversation/chat-client-provider/',
        visibleWhen: (s) => !!s.aiconversation,
        choices: [
            { value: 'None', label: 'None', description: 'Implement IChatClientProvider yourself' },
            { value: 'OpenAI', label: 'OpenAI', description: 'Shiny.AiConversation.OpenAi - any OpenAI-compatible endpoint with an API key' },
            { value: 'GitHub Copilot', label: 'GitHub Copilot', description: 'Shiny.AiConversation.Maui.GithubCopilot - device-code sign in, no key in the app' },
        ],
    },
    { id: 'aichatui', label: 'AI Conversation Chat UI', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyAiConversation,
        description: 'AiChatView - a drop-in chat screen wired to AI Conversation (Shiny.AiConversation.Maui) https://shinylib.net/aiconversation/chat-view/',
        visibleWhen: (s) => !!s.aiconversation },
    { id: 'aimessagestore', label: 'AI Conversation Message Store', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyAiConversation,
        description: 'Persist conversations to SQLite (Shiny.AiConversation.MessageStores.SqliteDocDb) https://shinylib.net/aiconversation/message-store/',
        visibleWhen: (s) => !!s.aiconversation },
    { id: 'faceintelligence', label: 'Face Intelligence', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyRecognition,
        description: 'On-device face recognition & enrollment (Recognition IQ, ONNX) https://shinylib.net/faceintelligence/' },
    { id: 'voiceintelligence', label: 'Voice Intelligence', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyRecognition,
        description: 'On-device speaker recognition & enrollment (Recognition IQ, ONNX) https://shinylib.net/voiceintelligence/' },
    { id: 'documentintelligence', label: 'Document Intelligence', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyRecognition,
        description: 'On-device ID document scanning & extraction (Recognition IQ) https://shinylib.net/documentintelligence/' },
    { id: 'fingerprint', label: 'Biometric Auth', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.biometric,
        description: 'Fingerprint & face recognition by Oscore (Oscore.Maui.Biometric) https://github.com/oscoreio/Maui.Biometric',
        visibleWhen: noDesktop },
    { id: 'screenrecord', label: 'Screen Recording', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Record the device screen (Shiny.ScreenRecorder) https://shinylib.net/client/screenrecorder/' },
    { id: 'music', label: 'Music Library', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyMusic,
        description: 'Music library & player https://shinylib.net/music/',
        visibleWhen: noDesktop },

    // Code generation
    { id: 'settings', label: 'Bound Settings Class', type: 'bool', defaultValue: false, category: 'code',
        description: 'Reactive object that binds to platform preferences or secure storage' },
    { id: 'authservice', label: 'Sample Auth Service', type: 'bool', defaultValue: false, category: 'code',
        description: 'Creates a sample MSAL or Web Authenticator service',
        visibleWhen: (s) => s.authtype !== 'None' },
    { id: 'refit', label: 'Refit HTTP Client', type: 'bool', defaultValue: false, category: 'code',
        version: VERSIONS.refit,
        description: 'Type-safe REST client from interfaces by Paul Betts https://github.com/reactiveui/refit',
        visibleWhen: (s) => s.authtype !== 'None' },
    { id: 'appactions', label: 'App Actions', type: 'bool', defaultValue: false, category: 'code',
        description: 'Setup MAUI Essentials App Actions' },
    { id: 'essentialsmedia', label: 'Media Picker', type: 'bool', defaultValue: false, category: 'code',
        description: 'Setup MAUI Essentials Media Picker' },
    { id: 'essentialsfilepicker', label: 'File Picker', type: 'bool', defaultValue: false, category: 'code',
        description: 'Setup MAUI Essentials File Picker' },

    // UI libs
    { id: 'shinycontrols', label: 'Shiny Controls', type: 'bool', defaultValue: true, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Scheduler, BottomSheet, ImageViewer, PillView, SecurityPin, Fab https://shinylib.net/controls/' },
    { id: 'livecharts', label: 'Live Charts', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.liveCharts,
        description: 'Animated, flexible charts by Alberto Rodriguez https://livecharts.dev/' },
    { id: 'skia', label: 'SkiaSharp', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.skia,
        description: '2D graphics engine powered by Google Skia by Mono https://github.com/mono/SkiaSharp' },
    { id: 'skiaextended', label: 'SkiaSharp Extended (Lottie)', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.skiaExtended,
        description: 'Lottie animations & SVG support for SkiaSharp by Mono https://github.com/mono/SkiaSharp.Extended' },
    { id: 'userdialogs', label: 'ACR User Dialogs', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.userDialogs,
        description: 'Alerts, confirmations, loading indicators & toasts by Allan Ritchie https://github.com/aritchie/userdialogs' },
    { id: 'markdown', label: 'Shiny Markdown', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Native markdown renderer and editor (no WebView) https://shinylib.net/controls/markdown/' },
    { id: 'mermaiddiagrams', label: 'Shiny Mermaid Diagrams', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Native Mermaid flowchart rendering (no WebView) https://shinylib.net/controls/mermaid-diagrams/' },
    { id: 'shinybarcodes', label: 'Shiny Barcodes & QR Codes', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Pure-managed 1D/2D barcode & QR code renderer (ZXing.Net, no SkiaSharp) https://shinylib.net/controls/barcodes/' },
    { id: 'shinycameraview', label: 'Shiny CameraView', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Cross-platform camera preview with photo/video capture, live filters & a pluggable frame-analysis pipeline (barcode, face, motion, OCR) https://shinylib.net/controls/cameraview/' },
    { id: 'camerabarcode', label: 'CameraView Barcode Analyzer', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Barcode & QR frame analyzer for CameraView https://shinylib.net/controls/cameraview/analyzers/',
        visibleWhen: (s) => !!s.shinycameraview },
    { id: 'cameraface', label: 'CameraView Face Analyzer', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Face detection frame analyzer & face masks for CameraView https://shinylib.net/controls/cameraview/face-masks/',
        visibleWhen: (s) => !!s.shinycameraview },
    { id: 'cameramotion', label: 'CameraView Motion Analyzer', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Motion / presence frame analyzer for CameraView https://shinylib.net/controls/cameraview/analyzers/',
        visibleWhen: (s) => !!s.shinycameraview },
    { id: 'cameraocr', label: 'CameraView OCR Analyzer', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'On-device text recognition frame analyzer for CameraView https://shinylib.net/controls/cameraview/analyzers/',
        visibleWhen: (s) => !!s.shinycameraview },
    { id: 'cameradocuments', label: 'CameraView Document Analyzer', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Document edge detection frame analyzer for CameraView https://shinylib.net/controls/cameraview/analyzers/',
        visibleWhen: (s) => !!s.shinycameraview },
    { id: 'cameraai', label: 'CameraView AI', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'AI document scanner & photo stylizer for CameraView https://shinylib.net/controls/cameraview/ai/',
        visibleWhen: (s) => !!s.shinycameraview },
    { id: 'shinydesktopcontrols', label: 'Shiny Desktop Controls', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Shiny.Maui.Controls.Desktop — Tray Icon, Visual-Studio-style window Docking, and Touch / Kiosk On-Screen Keyboard for Windows, macOS, MacCatalyst, and Linux. https://shinylib.net/controls/' },
    { id: 'shinymediaelement', label: 'Shiny MediaElement', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Local & remote audio/video with a themed transport bar, background audio with OS lock-screen controls, and Picture-in-Picture https://shinylib.net/controls/mediaelement/' },
    { id: 'shinyoffice', label: 'Shiny Office Documents', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Word, Excel & PowerPoint document viewers and editors (Shiny.Maui.Controls.Office) https://shinylib.net/controls/document-viewer/' },
    { id: 'shinyfoldables', label: 'Shiny Foldables', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Fold & hinge posture for Android foldables and iPhone Duo, feeding the fold-aware Shiny Controls (Shiny.Maui.Controls.Foldables) https://shinylib.net/controls/foldables/' },
    { id: 'shinykeyframe', label: 'Shiny Keyframe Animation', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Declarative XAML timelines with seekable, reversible playback https://shinylib.net/controls/keyframe/' },
    { id: 'shinykeyframeexport', label: 'Shiny Keyframe Export', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Export keyframe timelines to GIF / video (requires Keyframe Animation) https://shinylib.net/controls/keyframe/',
        visibleWhen: (s) => !!s.shinykeyframe },
    { id: 'shinydiagram', label: 'Shiny Diagram', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Graphs, org charts & flowcharts (Shiny.Maui.Controls.Diagram) https://shinylib.net/controls/diagram/' },
    { id: 'shinyfloorplan', label: 'Shiny Floor Plan', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Interactive floor plans with zones, seats & wayfinding (Shiny.Maui.Controls.FloorPlan) https://shinylib.net/controls/floorplan/' },
    { id: 'shinygamepadcontrols', label: 'Shiny On-Screen Gamepad', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'On-screen sticks & buttons reported alongside physical controllers (Shiny.Maui.Controls.Gamepad) https://shinylib.net/controls/gamepad/' },
    { id: 'shinyspeechaddins', label: 'Shiny Speech Add-ins', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Speech-to-text add-ins for the Shiny entry controls https://shinylib.net/controls/speech-addins/' },
    { id: 'shinytheme', label: 'Shiny Theme Pack', type: 'choice', defaultValue: 'None', category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'A Shiny Controls theme pack (Shiny.Maui.Controls.Themes.*) https://shinylib.net/controls/theming/packs/',
        choices: [
            { value: 'None', label: 'None', description: 'Use the default Shiny theme' },
            { value: 'Aurora', label: 'Aurora', description: 'Vivid violet & cyan with glow elevation' },
            { value: 'Material', label: 'Material', description: 'Material Design palette & shape scale' },
            { value: 'Ocean', label: 'Ocean', description: 'Cool blues and teals' },
            { value: 'Terminal', label: 'Terminal', description: 'Monospace, high-contrast terminal look' },
        ],
    },
    { id: 'uxdivers', label: 'UX Divers Dialogs', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyShell,
        description: 'Popups IDialogs implementation for Shiny MAUI Shell https://github.com/shinyorg/mauishell',
        visibleWhen: (s) => s.mvvmframework === 'Shiny MAUI Shell' },

    // Blazor components
    { id: 'blazor', label: 'Blazor Hybrid', type: 'bool', defaultValue: false, category: 'blazor',
        description: 'Add Blazor Hybrid support (BlazorWebView)' },
    { id: 'shinyblazorcontrols', label: 'Shiny Blazor Controls', type: 'bool', defaultValue: false, category: 'blazor',
        version: VERSIONS.shinyControls,
        description: 'Shiny.Blazor.Controls \u2014 the Blazor control set, usable from Blazor Hybrid https://shinylib.net/controls/' },
    { id: 'mudblazor', label: 'MudBlazor', type: 'bool', defaultValue: false, category: 'blazor',
        version: VERSIONS.mudblazor,
        description: 'Material Design Blazor component library https://mudblazor.com/' },
    { id: 'radzen', label: 'Radzen.Blazor', type: 'bool', defaultValue: false, category: 'blazor',
        version: VERSIONS.radzen,
        description: '80+ Blazor UI components by Radzen https://blazor.radzen.com/' },
    { id: 'fluentui', label: 'Microsoft FluentUI', type: 'bool', defaultValue: false, category: 'blazor',
        version: VERSIONS.fluentUI,
        description: 'Fluent Design Blazor components by Microsoft https://www.fluentui-blazor.net/' },

    // Storage
    { id: 'documentdb', label: 'Document DB', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinyDocumentDb,
        description: 'Document-oriented database on SQLite https://shinylib.net/documentdb/' },
    { id: 'documentdbsqlcipher', label: 'Document DB Encryption (SqlCipher)', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinyDocumentDb,
        description: 'Encrypted SQLite document store (Shiny.DocumentDb.Sqlite.SqlCipher) https://shinylib.net/documentdb/sqlcipher/',
        visibleWhen: (s) => !!s.documentdb },
    { id: 'documentdbvector', label: 'Document DB Vector Search', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinyDocumentDb,
        description: 'On-device vector search with sqlite-vec (Shiny.DocumentDb.Sqlite.VectorSupport) https://shinylib.net/documentdb/vector/',
        visibleWhen: (s) => !!s.documentdb },
    { id: 'documentdbvectordata', label: 'Document DB VectorData', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinyDocumentDb,
        description: 'A Microsoft.Extensions.VectorData VectorStore over the document store (Shiny.DocumentDb.Extensions.VectorData) https://shinylib.net/documentdb/vectordata/', visibleWhen: (s) => !!s.documentdb },
    { id: 'documentdbjsonschema', label: 'Document DB JSON Schema', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinyDocumentDb,
        description: 'Validate documents against a JSON Schema before they are written (Shiny.DocumentDb.JsonSchema) https://shinylib.net/documentdb/validation/', visibleWhen: (s) => !!s.documentdb },
    { id: 'documentdbappdatasync', label: 'Document DB App Data Sync', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinyDocumentDb,
        description: 'Offline-first: the store syncs with your API through Shiny.Data.Sync (Shiny.DocumentDb.AppDataSync) https://shinylib.net/documentdb/data-sync/', visibleWhen: (s) => !!s.documentdb },
    { id: 'firestoremobile', label: 'Firestore (on-device)', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinyFirestoreMobile,
        description: 'Offline-first Firestore document store with security rules (Shiny.DocumentDb.Firestore.Mobile) https://shinylib.net/documentdb/firestore-mobile/',
        visibleWhen: noDesktop },
    { id: 'sqlite', label: 'SQLite-net-pcl', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.sqliteNetPcl,
        description: 'SQLite.NET-PCL by Frank Krueger https://github.com/praeclarum/sqlite-net' },
    { id: 'roomsharp', label: 'RoomSharp', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.roomsharp,
        description: 'SQLite source generated ORM by Safwan Abdulghani https://roomsharp.dev/' },

    // AI
    { id: 'aihealth', label: 'Health AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyHealth,
        description: 'Exposes health data as Microsoft.Extensions.AI tools (requires Health Data) https://shinylib.net/health/ai-tools/',
        visibleWhen: noDesktop },
    { id: 'aicalendar', label: 'Calendar AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyCalendar,
        description: 'Exposes device calendars & events as Microsoft.Extensions.AI tools (requires Calendar Store) https://shinylib.net/client/calendarstore/ai-tools/' },
    { id: 'aimusic', label: 'Music AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyMusic,
        description: 'Exposes the music library & player as Microsoft.Extensions.AI tools (requires Music Library) https://shinylib.net/music/ai-tools/',
        visibleWhen: noDesktop },
    { id: 'aicontacts', label: 'Contacts AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyClient,
        description: 'Exposes device contacts as Microsoft.Extensions.AI tools (requires Contact Store) https://shinylib.net/client/contactstore/ai-tools/',
        visibleWhen: noDesktop },
    { id: 'ainotifications', label: 'Reminder AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyClient,
        description: 'Exposes local notifications as reminder Microsoft.Extensions.AI tools (requires Local Notifications) https://shinylib.net/client/notifications/ai-tools/' },
    { id: 'ailocations', label: 'Location AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyClient,
        description: 'Exposes read-only GPS as Microsoft.Extensions.AI tools (requires GPS) https://shinylib.net/client/locations/ai-tools/' },
    { id: 'aiappfunctions', label: 'App Functions AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyClient,
        description: 'Your app functions as Microsoft.Extensions.AI tools for an in-app LLM (requires App Functions) https://shinylib.net/client/appfunctions/ai-tools/' },
    { id: 'msextai', label: 'Microsoft.Extensions.AI', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.msExtAi,
        description: 'Unified abstractions for AI services (IChatClient, IEmbeddingGenerator) https://learn.microsoft.com/en-us/dotnet/ai/ai-extensions' },
    { id: 'aimediator', label: 'Mediator AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyMediator,
        description: 'Source generates AI tools from mediator contracts https://shinylib.net/mediator/extensions/ai/' },
    { id: 'aishinyshell', label: 'Shell AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyShell,
        description: 'Source generates AI navigation tools from shell maps https://shinylib.net/mauishell/ai/',
        visibleWhen: (s) => s.mvvmframework === 'Shiny MAUI Shell' },
    { id: 'aidocumentdb', label: 'DocumentDB AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyDocumentDb,
        description: 'Exposes document store operations as AI tools https://shinylib.net/documentdb/ai-tools/' },

    // Shiny Extensions
    { id: 'stores', label: 'Stores', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyStores,
        description: 'Key/value store abstractions with persistent, bindable settings objects https://shinylib.net/extensions/stores/' },
    { id: 'reflector', label: 'Reflector', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyReflector,
        description: 'AOT-compatible source-generated reflection https://shinylib.net/extensions/reflector/' },
    { id: 'serialization', label: 'Serialization', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyDI,
        description: 'Source-generated System.Text.Json setup - [ShinyJsonContext] & ISerializer https://shinylib.net/serialization/' },
    { id: 'permissionsmsbuild', label: 'MSBuild Permissions', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyPermissions,
        description: 'Generate AndroidManifest & Info.plist entries from <MauiPermission> presets (Shiny.Permissions.MSBuild) https://shinylib.net/permissions/' },

    // Platform
    { id: 'androidauto', label: 'Android Auto', type: 'bool', defaultValue: false, category: 'platform',
        version: VERSIONS.androidAuto,
        description: 'Add Android Auto support (Xamarin.AndroidX.Car.App.App)',
        visibleWhen: (s) => !!s.useandroid },
    { id: 'carplay', label: 'iOS CarPlay', type: 'bool', defaultValue: false, category: 'platform',
        description: 'Add iOS CarPlay support',
        visibleWhen: (s) => !!s.useios },

    // Utilities
    { id: 'systemreactive', label: 'System.Reactive', type: 'bool', defaultValue: false, category: 'utility',
        version: VERSIONS.systemReactive,
        description: 'Reactive Extensions for .NET https://github.com/dotnet/reactive' },
    { id: 'humanizer', label: 'Humanizer', type: 'bool', defaultValue: false, category: 'utility',
        version: VERSIONS.humanizer,
        description: 'String, date, number manipulation & humanization https://github.com/Humanizr/Humanizer' },
    { id: 'unitsnet', label: 'UnitsNet', type: 'bool', defaultValue: false, category: 'utility',
        version: VERSIONS.unitsNet,
        description: 'Unit of measurement conversions https://github.com/angularsen/UnitsNet' },
    { id: 'syslinqasync', label: 'System.Linq.Async', type: 'bool', defaultValue: false, category: 'utility',
        version: VERSIONS.sysLinqAsync,
        description: 'Async LINQ operators for IAsyncEnumerable https://github.com/dotnet/reactive' },
];

function computeMauiSymbols(state: TemplateState): Record<string, boolean | string> {
    const s = { ...state } as Record<string, boolean | string>;
    s.usewebauthenticator = s.authtype === 'MAUI Web Authenticator';
    s.usemsal = s.authtype === 'MSAL Basic' || s.authtype === 'MSAL AzureB2C' || s.authtype === 'MSAL Broker';
    s.usemsalbasic = s.authtype === 'MSAL Basic';
    s.usemsalb2c = s.authtype === 'MSAL AzureB2C';
    s.usemsalbroker = s.authtype === 'MSAL Broker';
    s.shinyshell = s.mvvmframework === 'Shiny MAUI Shell';
    s.prism = s.mvvmframework === 'Prism';
    s.usemaps = s.maptype !== 'None';
    s.usemauimaps = s.maptype === 'MAUI';
    s.usegooglemaps = s.maptype === 'Google Maps';
    s.usepushnative = s.push === 'Native';
    s.usepushanh = s.push === 'Azure Notification Hubs';
    s.usepushfcm = s.push === 'Firebase Messaging';
    s.usepush = s.push !== 'None';
    s.useconfig = !!(s.configuration || s.push !== 'None' || s.authtype !== 'None');
    s.usedeeplinks = s.deeplinks !== '';
    s.usehttp = !!(s.authservice && s.refit);
    s.useblazor = !!(s.blazor || s.radzen || s.mudblazor || s.fluentui || s.shinyblazorcontrols);
    s.usemauicontrols = !!(s.aichatui || s.shinycontrols || s.shinyspeechaddins || s.shinycameraview || s.shinymediaelement || s.shinyoffice || s.shinykeyframe || s.shinyfoldables || s.shinytheme !== 'None');
    s.themeaurora = s.shinytheme === 'Aurora';
    s.themematerial = s.shinytheme === 'Material';
    s.themeocean = s.shinytheme === 'Ocean';
    s.themeterminal = s.shinytheme === 'Terminal';
    s.useshinyspeech = !!(s.shinyspeech || s.aiconversation || s.speechazure || s.speechelevenlabs || s.speechtypecast || s.speechopenai);
    s.aichatopenai = !!s.aiconversation && s.aichatclient === 'OpenAI';
    s.aichatcopilot = !!s.aiconversation && s.aichatclient === 'GitHub Copilot';
    s.useaichatui = !!(s.aiconversation && s.aichatui);
    s.useaimessagestore = !!(s.aiconversation && s.aimessagestore);
    // Region Geofencing owns the GPS listener and the DocumentDb add-on needs Region Geofencing
    s.useregiongeofencing = !!(s.regiongeofencing || s.regiongeofencingdocdb);
    s.regiongeofencingdocdb = !!(s.regiongeofencing && s.regiongeofencingdocdb);
    s.useappfunctions = !!(s.appfunctions || s.aiappfunctions);
    // BLE Hubs and Universal Hubs share the ChatHub sample and the BLE permissions; Universal Hubs replaces
    // the BLE Hubs registration for its role (AddUniversalServer registers the BLE hub server itself)
    s.universalhubs = !!(s.universalhubshost || s.universalhubsclient);
    s.usehubshost = !!(s.blehubshost || s.universalhubshost);
    s.usehubsclient = !!(s.blehubsclient || s.universalhubsclient);
    s.usehubs = !!(s.usehubshost || s.usehubsclient);
    s.usedocumentdbvector = !!(s.documentdb && s.documentdbvector);
    s.uxdiversdialogs = !!(s.uxdivers && s.shinyshell);
    s.useshinymediator = !!(s.shinymediator || s.aimediator);
    s.usedocumentdb = !!(s.documentdb || s.aidocumentdb || s.documentdbsqlcipher);
    // AI tool packages are added on top of their base module - the base is selected
    // independently (no auto-enable), so Health AI Tools requires Health Data, etc.
    s.usehealth = !!s.health;
    s.usemsextai = !!(s.msextai || s.aimediator || s.aishinyshell || s.aidocumentdb || s.aihealth || s.aiconversation || s.aicontacts || s.aicalendar || s.ainotifications || s.ailocations || s.aimusic || s.aiappfunctions);
    return s;
}

// ---------------------------------------------------------------------------
// ASP.NET (ShinyAspNet)
// ---------------------------------------------------------------------------

const ASPNET_CATEGORIES: readonly TemplateCategory[] = [
    { id: 'project', title: 'Project', span: 12 },
    { id: 'data', title: 'Data', span: 6 },
    { id: 'auth', title: 'Authentication', span: 6 },
    { id: 'features', title: 'Features', span: 12 },
    { id: 'aspnet', title: 'Shiny ASP.NET', span: 12 },
    { id: 'extensions', title: 'Shiny Extensions', span: 12 },
];

const ASPNET_PARAMS: TemplateParam[] = [
    { id: 'Framework', label: 'Target Framework', type: 'choice', defaultValue: 'net10.0', category: 'project',
        description: 'The target framework for the project',
        choices: [
            { value: 'net10.0', label: '.NET 10.0', description: 'Target .NET 10.0' },
        ],
    },

    // Data
    { id: 'ef', label: 'Entity Framework', type: 'choice', defaultValue: 'none', category: 'data',
        description: 'Adds Entity Framework Core with the chosen provider',
        choices: [
            { value: 'none', label: 'None', description: 'No EF Core provider' },
            { value: 'sqlserver', label: 'SQL Server', description: 'Microsoft.EntityFrameworkCore.SqlServer' },
            { value: 'postgresql', label: 'PostgreSQL', description: 'Npgsql.EntityFrameworkCore.PostgreSQL' },
        ],
    },
    { id: 'efspatial', label: 'EF Spatial (NetTopologySuite)', type: 'bool', defaultValue: false, category: 'data',
        description: 'Adds NetTopologySuite spatial support to your EF Core provider',
        visibleWhen: (s) => s.ef !== 'none' },
    { id: 'documentdb', label: 'Shiny.DocumentDb Provider', type: 'choice', defaultValue: 'none', category: 'data',
        description: 'Adds Shiny.DocumentDb with the chosen storage provider https://shinylib.net/documentdb/',
        version: VERSIONS.shinyDocumentDb,
        choices: [
            { value: 'none', label: 'None', description: 'No DocumentDb provider' },
            { value: 'sqlite', label: 'SQLite', description: 'Shiny.DocumentDb.Sqlite' },
            { value: 'sqlcipher', label: 'SQLite (SqlCipher)', description: 'Shiny.DocumentDb.Sqlite.SqlCipher' },
            { value: 'sqlserver', label: 'SQL Server', description: 'Shiny.DocumentDb.SqlServer' },
            { value: 'mysql', label: 'MySQL', description: 'Shiny.DocumentDb.MySql' },
            { value: 'postgresql', label: 'PostgreSQL', description: 'Shiny.DocumentDb.PostgreSql' },
            { value: 'cosmosdb', label: 'Cosmos DB', description: 'Shiny.DocumentDb.CosmosDb' },
            { value: 'mongodb', label: 'MongoDB', description: 'Shiny.DocumentDb.MongoDb' },
            { value: 'litedb', label: 'LiteDB', description: 'Shiny.DocumentDb.LiteDb' },
            { value: 'duckdb', label: 'DuckDB', description: 'Shiny.DocumentDb.DuckDb' },
            { value: 'oracle', label: 'Oracle', description: 'Shiny.DocumentDb.Oracle' },
            { value: 'mariadb', label: 'MariaDB', description: 'Shiny.DocumentDb.MariaDb' },
            { value: 'cockroachdb', label: 'CockroachDB', description: 'Shiny.DocumentDb.CockroachDb' },
            { value: 'azuretable', label: 'Azure Table Storage', description: 'Shiny.DocumentDb.AzureTable' },
            { value: 'dynamodb', label: 'Amazon DynamoDB', description: 'Shiny.DocumentDb.DynamoDb' },
            { value: 'amazondocumentdb', label: 'Amazon DocumentDB', description: 'Shiny.DocumentDb.DocumentDb' },
            { value: 'redis', label: 'Redis', description: 'Shiny.DocumentDb.Redis' },
            { value: 'ravendb', label: 'RavenDB', description: 'Shiny.DocumentDb.RavenDb' },
            { value: 'firestore', label: 'Google Firestore', description: 'Shiny.DocumentDb.Firestore' },
        ],
    },
    { id: 'aidocumentdb', label: 'DocumentDB AI Tools', type: 'bool', defaultValue: false, category: 'data',
        version: VERSIONS.shinyDocumentDb,
        description: 'Exposes document store operations as AI tools https://shinylib.net/documentdb/ai-tools/',
        visibleWhen: (s) => s.documentdb !== 'none' },
    { id: 'documentdbvectordata', label: 'Document DB VectorData', type: 'bool', defaultValue: false, category: 'data',
        version: VERSIONS.shinyDocumentDb,
        description: 'A Microsoft.Extensions.VectorData VectorStore over the document store (Shiny.DocumentDb.Extensions.VectorData) https://shinylib.net/documentdb/vectordata/', visibleWhen: (s) => s.documentdb !== 'none' },
    { id: 'documentdbjsonschema', label: 'Document DB JSON Schema', type: 'bool', defaultValue: false, category: 'data',
        version: VERSIONS.shinyDocumentDb,
        description: 'Validate documents against a JSON Schema before they are written (Shiny.DocumentDb.JsonSchema) https://shinylib.net/documentdb/validation/', visibleWhen: (s) => s.documentdb !== 'none' },
    { id: 'documentdbsqlitevec', label: 'Document DB SQLite Vector Search', type: 'bool', defaultValue: false, category: 'data',
        version: VERSIONS.shinyDocumentDb,
        description: 'Vector search with sqlite-vec (Shiny.DocumentDb.Sqlite.VectorSupport) https://shinylib.net/documentdb/vector/', visibleWhen: (s) => s.documentdb === 'sqlite' || s.documentdb === 'sqlcipher' },
    { id: 'documentdbrest', label: 'Document DB REST Endpoints', type: 'bool', defaultValue: false, category: 'data',
        version: VERSIONS.shinyDocumentDb,
        description: 'REST & live-query (SSE) endpoints for a document type (Shiny.DocumentDb.AspNetCore) https://shinylib.net/documentdb/rest-endpoints/', visibleWhen: (s) => s.documentdb !== 'none' },
    { id: 'documentdbodata', label: 'Document DB OData', type: 'bool', defaultValue: false, category: 'data',
        version: VERSIONS.shinyDocumentDb,
        description: 'OData v4 entity sets over the store (Shiny.DocumentDb.AspNetCore.OData) https://shinylib.net/documentdb/odata/', visibleWhen: (s) => s.documentdb !== 'none' },
    { id: 'documentdbmcp', label: 'Document DB MCP Server', type: 'bool', defaultValue: false, category: 'data',
        version: VERSIONS.shinyDocumentDb,
        description: 'Point MCP clients at the store (Shiny.DocumentDb.Mcp) https://shinylib.net/documentdb/mcp/', visibleWhen: (s) => s.documentdb !== 'none' },
    { id: 'connectionstring', label: 'Connection String', type: 'string', defaultValue: '', category: 'data',
        description: 'The database connection string',
        visibleWhen: (s) => s.ef !== 'none' || (s.documentdb !== 'none' && s.documentdb !== 'litedb' && s.documentdb !== 'firestore' && s.documentdb !== 'dynamodb') },

    // Auth
    { id: 'jwtauth', label: 'JWT Authentication', type: 'bool', defaultValue: true, category: 'auth',
        description: 'JWT bearer authentication with refresh tokens & sample sign-in/out handlers' },
    { id: 'google', label: 'Google Authentication', type: 'bool', defaultValue: false, category: 'auth',
        description: 'Microsoft.AspNetCore.Authentication.Google' },
    { id: 'facebook', label: 'Facebook Authentication', type: 'bool', defaultValue: false, category: 'auth',
        description: 'Microsoft.AspNetCore.Authentication.Facebook' },
    { id: 'apple', label: 'Apple Authentication', type: 'bool', defaultValue: false, category: 'auth',
        description: 'AspNet.Security.OAuth.Apple' },

    // Features
    { id: 'orleans', label: 'Microsoft Orleans', type: 'bool', defaultValue: true, category: 'features',
        version: VERSIONS.orleans,
        description: 'Distributed actor model framework with sample grain. https://learn.microsoft.com/en-us/dotnet/orleans/' },
    { id: 'signalr', label: 'SignalR', type: 'bool', defaultValue: false, category: 'features',
        description: 'Real-time messaging with a sample hub' },
    { id: 'scalar', label: 'Scalar API Docs', type: 'bool', defaultValue: true, category: 'features',
        version: VERSIONS.scalar,
        description: 'OpenAPI documentation UI https://github.com/scalar/scalar' },
    { id: 'deeplinks', label: 'Mobile Deep Link Files', type: 'bool', defaultValue: true, category: 'features',
        description: 'Sample apple-app-site-association and assetlinks.json under wwwroot/.well-known' },

    // Shiny Extensions
    { id: 'shinymediator', label: 'Shiny Mediator', type: 'bool', defaultValue: true, category: 'extensions',
        version: VERSIONS.shinyMediator,
        description: 'Source-generated mediator with endpoints, middleware, and handlers https://shinylib.net/mediator/' },
    { id: 'mediatorresilience', label: 'Mediator Resilience', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyMediator,
        description: 'Polly retry/timeout pipelines for handlers marked [Resilient] (Shiny.Mediator.Resilience) https://shinylib.net/mediator/middleware/resilience/', visibleWhen: (s) => !!s.shinymediator },
    { id: 'mediatorcaching', label: 'Mediator Caching', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyMediator,
        description: 'Memory caching for handlers marked [Cache] (Shiny.Mediator.Caching.MicrosoftMemoryCache) https://shinylib.net/mediator/middleware/caching/', visibleWhen: (s) => !!s.shinymediator },
    { id: 'mediatorfluentvalidation', label: 'Mediator FluentValidation', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyMediator,
        description: 'FluentValidation for contracts marked [Validate] (Shiny.Mediator.FluentValidation) https://shinylib.net/mediator/middleware/validation/', visibleWhen: (s) => !!s.shinymediator },
    { id: 'mediatordapper', label: 'Mediator Dapper', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyMediator,
        description: 'Dapper query requests through the mediator (Shiny.Mediator.DapperRequests) https://shinylib.net/mediator/extensions/dapper/', visibleWhen: (s) => !!s.shinymediator },
    { id: 'mediatortickerq', label: 'Mediator TickerQ Scheduling', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyMediator,
        description: 'Persisted command scheduling on TickerQ (Shiny.Mediator.TickerQ) https://shinylib.net/mediator/middleware/scheduling/', visibleWhen: (s) => !!s.shinymediator },
    { id: 'di', label: 'Shiny DI', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyDI,
        description: 'Attribute-driven, source-generated DI registration https://shinylib.net/extensions/di/' },
    { id: 'localization', label: 'Localization', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyLocalization,
        description: 'Source-generated localization https://shinylib.net/extensions/localization/' },
    { id: 'reflector', label: 'Reflector', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyReflector,
        description: 'AOT-compatible source-generated reflection https://shinylib.net/extensions/reflector/' },
    { id: 'stores', label: 'Stores', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyStores,
        description: 'Key/value store abstractions with persistent, bindable settings objects https://shinylib.net/extensions/stores/' },
    { id: 'serialization', label: 'Serialization', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyDI,
        description: 'Source-generated System.Text.Json setup - [ShinyJsonContext] & ISerializer https://shinylib.net/serialization/' },
    { id: 'extensionspush', label: 'Push Notifications (Server)', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyExtensionsPush,
        description: 'Send push from the server - APNs, FCM, Web Push & WNS (Shiny.Extensions.Push) https://shinylib.net/extensions-push/' },

    // Shiny ASP.NET
    { id: 'aspnetjsonpatch', label: 'JSON Patch', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'RFC 6902 JSON Patch bodies for minimal APIs, AOT-clean (Shiny.AspNet.JsonPatch) https://shinylib.net/aspnet/json-patch/' },
    { id: 'aspnetidempotency', label: 'Idempotency', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'Idempotency-Key replay protection for unsafe requests (Shiny.AspNet.Idempotency) https://shinylib.net/aspnet/idempotency/' },
    { id: 'aspnetcontentdigest', label: 'Content Digest', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'RFC 9530 Content-Digest & Repr-Digest headers (Shiny.AspNet.ContentDigest) https://shinylib.net/aspnet/content-digest/' },
    { id: 'aspnetwebdav', label: 'WebDAV', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'Serve a folder over WebDAV (Shiny.AspNet.WebDav) https://shinylib.net/aspnet/webdav/' },
    { id: 'aspnetcaldav', label: 'CalDAV & CardDAV', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'Calendar & contact sync server (Shiny.AspNet.CalDav) https://shinylib.net/aspnet/caldav/' },
    { id: 'aspnettus', label: 'tus Uploads', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'Resumable uploads over the tus protocol (Shiny.AspNet.Tus) https://shinylib.net/aspnet/tus/' },
    { id: 'aspnetfilesync', label: 'File Sync', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'Two-way file sync endpoint (Shiny.AspNet.FileSync) https://shinylib.net/aspnet/filesync/' },
    { id: 'aspnetnuget', label: 'NuGet Feed', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'A private NuGet package feed (Shiny.AspNet.NuGet) https://shinylib.net/aspnet/nuget/' },
    { id: 'aspnetnpm', label: 'npm Registry', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'A private npm registry (Shiny.AspNet.Npm) https://shinylib.net/aspnet/npm/' },
    { id: 'aspnetdocumentdb', label: 'DocumentDb Endpoints', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'REST, JSON Patch & live SSE endpoints for documents (Shiny.AspNet.DocumentDb) https://shinylib.net/aspnet/documentdb/' },
    { id: 'aspnetacme', label: 'ACME Certificates', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'Automatic Let’s Encrypt certificates (Shiny.AspNet.Acme) https://shinylib.net/aspnet/acme/' },
    { id: 'aspnetdiscovery', label: 'Server Discovery', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'Advertise the server over mDNS / DNS-SD (Shiny.AspNet.Discovery) https://shinylib.net/aspnet/discovery/' },
    { id: 'aspnetssh', label: 'SSH Quick Tunnel', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'Zero-account public URL over SSH (Shiny.AspNet.Ssh) https://shinylib.net/aspnet/ssh/' },
    { id: 'aspnettunnels', label: 'Tunnels', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'Cloudflare / ngrok / Tailscale tunnel agents (Shiny.AspNet.Tunnels) https://shinylib.net/aspnet/tunnel-agents/' },
    { id: 'appdevicebridge', label: 'App Device Bridge Releases', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAppDeviceBridge,
        description: 'Serve signed web app releases to App Device Bridge hosts (Shiny.AppDeviceBridge.AspNetCore) https://shinylib.net/appdevicebridge/updates/' },
    { id: 'aspnetwebhooks', label: 'Webhooks', type: 'bool', defaultValue: false, category: 'aspnet',
        version: VERSIONS.shinyAspNet,
        description: 'Signature-verified webhook receivers - GitHub, Stripe, Standard Webhooks (Shiny.AspNet.Webhooks) https://shinylib.net/aspnet/webhooks/' },
];

function computeAspNetSymbols(state: TemplateState): Record<string, boolean | string> {
    const s = { ...state } as Record<string, boolean | string>;
    // Entity Framework
    s.efnone = s.ef === 'none';
    s.efmssql = s.ef === 'sqlserver';
    s.efpostgres = s.ef === 'postgresql';
    // Shiny.DocumentDb
    s.docdbnone = s.documentdb === 'none';
    s.usedocumentdb = s.documentdb !== 'none';
    s.docdbsqlite = s.documentdb === 'sqlite';
    s.docdbsqlcipher = s.documentdb === 'sqlcipher';
    s.docdbsqlserver = s.documentdb === 'sqlserver';
    s.docdbmysql = s.documentdb === 'mysql';
    s.docdbpostgres = s.documentdb === 'postgresql';
    s.docdbcosmos = s.documentdb === 'cosmosdb';
    s.docdbmongo = s.documentdb === 'mongodb';
    s.docdblitedb = s.documentdb === 'litedb';
    s.docdbduckdb = s.documentdb === 'duckdb';
    s.docdboracle = s.documentdb === 'oracle';
    s.docdbmariadb = s.documentdb === 'mariadb';
    s.docdbcockroach = s.documentdb === 'cockroachdb';
    s.docdbazuretable = s.documentdb === 'azuretable';
    s.docdbdynamo = s.documentdb === 'dynamodb';
    s.docdbamazondocdb = s.documentdb === 'amazondocumentdb';
    s.docdbredis = s.documentdb === 'redis';
    s.docdbravendb = s.documentdb === 'ravendb';
    s.docdbfirestore = s.documentdb === 'firestore';
    // Any data layer active (EF or DocumentDB) — used by auth handlers
    s.useanydata = s.ef !== 'none' || s.documentdb !== 'none';
    // Auth handlers (Handlers/Auth/*) use Shiny.Mediator — force it on when jwtauth is enabled.
    s.shinymediator = !!(s.shinymediator || s.jwtauth);
    // MediatorModule.cs + the Shiny.Mediator.AspNet reference are keyed on this symbol
    s.usemediator = s.shinymediator;
    return s;
}

// ---------------------------------------------------------------------------
// Blazor WASM (ShinyBlazor)
// ---------------------------------------------------------------------------

const BLAZOR_CATEGORIES: readonly TemplateCategory[] = [
    { id: 'project', title: 'Project', span: 12 },
    { id: 'ui', title: 'UI Library', span: 12 },
    { id: 'extensions', title: 'Shiny Extensions', span: 6 },
    { id: 'services', title: 'Services', span: 6 },
    { id: 'storage', title: 'Storage', span: 6 },
    { id: 'ai', title: 'AI', span: 6 },
    { id: 'components', title: 'Components', span: 12 },
];

const BLAZOR_PARAMS: TemplateParam[] = [
    { id: 'Framework', label: 'Target Framework', type: 'choice', defaultValue: 'net10.0', category: 'project',
        description: 'The target framework for the project',
        choices: [
            { value: 'net10.0', label: '.NET 10.0', description: 'Target .NET 10.0' },
        ],
    },
    { id: 'uilibrary', label: 'UI Component Library', type: 'choice', defaultValue: 'None', category: 'ui',
        description: 'Pick one component library — registration is wired in Program.cs & wwwroot/index.html',
        choices: [
            { value: 'None', label: 'None', description: 'No UI component library' },
            { value: 'MudBlazor', label: 'MudBlazor', description: 'MudBlazor https://mudblazor.com/' },
            { value: 'Radzen', label: 'Radzen.Blazor', description: 'Radzen.Blazor https://blazor.radzen.com/' },
            { value: 'FluentUI', label: 'Microsoft FluentUI', description: 'Microsoft FluentUI https://www.fluentui-blazor.net/' },
        ],
    },

    // Shiny extensions
    { id: 'localization', label: 'Localization', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyLocalization,
        description: 'Source-generated localization https://shinylib.net/extensions/localization/' },
    { id: 'stores', label: 'Stores', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyStores,
        description: 'Key/value store abstractions with persistent service binding https://shinylib.net/extensions/stores/' },
    { id: 'reflector', label: 'Reflector', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyReflector,
        description: 'AOT-compatible source-generated reflection https://shinylib.net/extensions/reflector/' },
    { id: 'di', label: 'Shiny DI', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyDI,
        description: 'Attribute-driven, source-generated DI registration https://shinylib.net/extensions/di/' },
    { id: 'serialization', label: 'Serialization', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyDI,
        description: 'Source-generated System.Text.Json setup - [ShinyJsonContext] & ISerializer https://shinylib.net/serialization/' },

    // Services
    { id: 'shinymediator', label: 'Shiny Mediator', type: 'bool', defaultValue: true, category: 'services',
        version: VERSIONS.shinyMediator,
        description: 'Event-driven messaging, middleware, and request/response pipeline https://shinylib.net/mediator/' },
    { id: 'mediatorresilience', label: 'Mediator Resilience', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyMediator,
        description: 'Polly retry/timeout pipelines for handlers marked [Resilient] (Shiny.Mediator.Resilience) https://shinylib.net/mediator/middleware/resilience/', visibleWhen: (s) => !!s.shinymediator },
    { id: 'mediatorcaching', label: 'Mediator Caching', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyMediator,
        description: 'Memory caching for handlers marked [Cache] (Shiny.Mediator.Caching.MicrosoftMemoryCache) https://shinylib.net/mediator/middleware/caching/', visibleWhen: (s) => !!s.shinymediator },
    { id: 'mediatorfluentvalidation', label: 'Mediator FluentValidation', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyMediator,
        description: 'FluentValidation for contracts marked [Validate] (Shiny.Mediator.FluentValidation) https://shinylib.net/mediator/middleware/validation/', visibleWhen: (s) => !!s.shinymediator },
    { id: 'mediatordapper', label: 'Mediator Dapper', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyMediator,
        description: 'Dapper query requests through the mediator (Shiny.Mediator.DapperRequests) https://shinylib.net/mediator/extensions/dapper/', visibleWhen: (s) => !!s.shinymediator },
    { id: 'jobs', label: 'Background Jobs', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'In-process jobs while the tab is open (Shiny.Jobs) https://shinylib.net/client/jobs/' },
    { id: 'appdevicebridge', label: 'App Device Bridge Client', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyAppDeviceBridge,
        description: 'Typed native-bridge clients when a MAUI App Device Bridge hosts this app (Shiny.AppDeviceBridge.Blazor) https://shinylib.net/appdevicebridge/clients/' },
    { id: 'bluetoothle', label: 'Bluetooth LE (Web Bluetooth)', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Web Bluetooth (Chromium browsers only) https://shinylib.net/client/ble/' },
    { id: 'gps', label: 'GPS', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Browser Geolocation https://shinylib.net/client/locations/gps/' },
    { id: 'push', label: 'Push Notifications', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Web Push notifications https://shinylib.net/client/push/' },
    { id: 'httptransfers', label: 'HTTP Transfers', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Background uploads & downloads over Service Worker Background Sync + IndexedDB https://shinylib.net/client/httptransfers/' },
    { id: 'datasync', label: 'Data Sync', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyDataSync,
        description: 'Bidirectional JSON sync with the outbox & cursors persisted to LocalStorage https://shinylib.net/client/datasync/' },
    { id: 'actors', label: 'Actors', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyActors,
        description: 'Orleans-style virtual actors in the browser - one call at a time, persisted state, streams & reminders (Shiny.Actors) https://shinylib.net/actors/' },
    { id: 'shinyspeech', label: 'Speech (STT/TTS)', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'Speech-to-text and text-to-speech (Web Speech API) https://shinylib.net/speech/' },
    { id: 'speechazure', label: 'Azure AI Speech', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'Azure AI Speech provider for Shiny.Speech (pulls in Speech) https://shinylib.net/speech/microsoft-ai/' },
    { id: 'speechelevenlabs', label: 'ElevenLabs Speech', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'ElevenLabs STT/TTS provider for Shiny.Speech (pulls in Speech) https://shinylib.net/speech/elevenlabs/' },
    { id: 'speechtypecast', label: 'Typecast Speech', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'Typecast text-to-speech provider for Shiny.Speech (pulls in Speech) https://shinylib.net/speech/' },
    { id: 'speechopenai', label: 'OpenAI Speech', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'OpenAI Whisper STT & TTS provider for Shiny.Speech (pulls in Speech) https://shinylib.net/speech/openai/' },
    { id: 'audio', label: 'Audio', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'Microphone capture & playback over Web Audio (Shiny.Audio) https://shinylib.net/speech/audio/' },
    { id: 'screenrecord', label: 'Screen Recording', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Record the screen with getDisplayMedia + MediaRecorder (Shiny.ScreenRecorder) https://shinylib.net/client/screenrecorder/' },
    { id: 'gamepad', label: 'Gamepads', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Game controllers over the W3C Gamepad API (Shiny.Gamepad) https://shinylib.net/client/gamepad/' },

    // Storage
    { id: 'documentdb', label: 'Document DB (IndexedDB)', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinyDocumentDb,
        description: 'Document-oriented store backed by browser IndexedDB https://shinylib.net/documentdb/' },
    { id: 'aidocumentdb', label: 'DocumentDB AI Tools', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinyDocumentDb,
        description: 'Exposes document store operations as AI tools https://shinylib.net/documentdb/ai-tools/',
        visibleWhen: (s) => !!s.documentdb },
    { id: 'documentdbvectordata', label: 'Document DB VectorData', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinyDocumentDb,
        description: 'A Microsoft.Extensions.VectorData VectorStore over the document store (Shiny.DocumentDb.Extensions.VectorData) https://shinylib.net/documentdb/vectordata/', visibleWhen: (s) => !!s.documentdb },
    { id: 'documentdbjsonschema', label: 'Document DB JSON Schema', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinyDocumentDb,
        description: 'Validate documents against a JSON Schema before they are written (Shiny.DocumentDb.JsonSchema) https://shinylib.net/documentdb/validation/', visibleWhen: (s) => !!s.documentdb },
    { id: 'documentdbappdatasync', label: 'Document DB App Data Sync', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinyDocumentDb,
        description: 'Offline-first: the IndexedDB store syncs with your API (Shiny.DocumentDb.AppDataSync) https://shinylib.net/documentdb/data-sync/', visibleWhen: (s) => !!s.documentdb },

    // AI
    { id: 'aiconversation', label: 'AI Conversation', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyAiConversation,
        description: 'AI Conversation with speech recognition and text-to-speech https://shinylib.net/aiconversation/' },
    { id: 'aichatclient', label: 'AI Conversation Chat Client', type: 'choice', defaultValue: 'None', category: 'ai',
        version: VERSIONS.shinyAiConversation,
        description: 'The chat client AI Conversation talks to https://shinylib.net/aiconversation/chat-client-provider/',
        visibleWhen: (s) => !!s.aiconversation,
        choices: [
            { value: 'None', label: 'None', description: 'Implement IChatClientProvider yourself' },
            { value: 'OpenAI', label: 'OpenAI', description: 'Shiny.AiConversation.OpenAi - any OpenAI-compatible endpoint' },
        ],
    },

    // Components
    { id: 'shinycontrols', label: 'Shiny Blazor Controls', type: 'bool', defaultValue: false, category: 'components',
        version: VERSIONS.shinyControls,
        description: 'Shiny component library for Blazor https://shinylib.net/controls/' },
    { id: 'markdown', label: 'Shiny Markdown', type: 'bool', defaultValue: false, category: 'components',
        version: VERSIONS.shinyControls,
        description: 'Native markdown renderer & editor https://shinylib.net/controls/markdown/' },
    { id: 'mermaiddiagrams', label: 'Shiny Mermaid Diagrams', type: 'bool', defaultValue: false, category: 'components',
        version: VERSIONS.shinyControls,
        description: 'Mermaid flowchart rendering https://shinylib.net/controls/mermaid-diagrams/' },
    { id: 'shinybarcodes', label: 'Shiny Barcodes & QR Codes', type: 'bool', defaultValue: false, category: 'components',
        version: VERSIONS.shinyControls,
        description: 'Pure-managed 1D/2D barcode & QR code renderer (SVG or PNG data-URI) https://shinylib.net/controls/barcodes/' },
    { id: 'shinycameraview', label: 'Shiny CameraView', type: 'bool', defaultValue: false, category: 'components',
        version: VERSIONS.shinyControls,
        description: 'getUserMedia camera preview, capture & in-browser barcode scanning https://shinylib.net/controls/cameraview/' },
    { id: 'shinyfloorplan', label: 'Shiny Floor Plan', type: 'bool', defaultValue: false, category: 'components',
        version: VERSIONS.shinyControls,
        description: 'Interactive floor plans & seating charts (Shiny.Blazor.Controls.FloorPlan) https://shinylib.net/controls/floorplan/' },
    { id: 'shinygamepadcontrols', label: 'Shiny On-Screen Gamepad', type: 'bool', defaultValue: false, category: 'components',
        version: VERSIONS.shinyControls,
        description: 'On-screen sticks & buttons alongside physical controllers (Shiny.Blazor.Controls.Gamepad) https://shinylib.net/controls/gamepad/' },
    { id: 'shinydiagram', label: 'Shiny Diagram', type: 'bool', defaultValue: false, category: 'components',
        version: VERSIONS.shinyControls,
        description: 'Graphs, org charts & flowcharts (Shiny.Blazor.Controls.Diagram) https://shinylib.net/controls/diagram/' },
    { id: 'cameraai', label: 'CameraView AI', type: 'bool', defaultValue: false, category: 'components',
        version: VERSIONS.shinyControls,
        description: 'AI document scanner & photo stylizer for CameraView https://shinylib.net/controls/cameraview/ai/',
        visibleWhen: (s) => !!s.shinycameraview },
    { id: 'shinymediaelement', label: 'Shiny MediaElement', type: 'bool', defaultValue: false, category: 'components',
        version: VERSIONS.shinyControls,
        description: 'HTML5 audio/video with a drawn transport bar, Fullscreen, Picture-in-Picture and navigator.mediaSession https://shinylib.net/controls/mediaelement/blazor/' },
    { id: 'shinyoffice', label: 'Shiny Office Documents', type: 'bool', defaultValue: false, category: 'components',
        version: VERSIONS.shinyControls,
        description: 'Word, Excel & PowerPoint document viewers and editors (Shiny.Blazor.Controls.Office) https://shinylib.net/controls/document-viewer/' },
    { id: 'shinyspeechaddins', label: 'Shiny Speech Add-ins', type: 'bool', defaultValue: false, category: 'components',
        version: VERSIONS.shinyControls,
        description: 'Web Speech API speech-to-text add-ins for the Shiny entry controls https://shinylib.net/controls/speech-addins/' },
    { id: 'shinytheme', label: 'Shiny Theme Pack', type: 'choice', defaultValue: 'None', category: 'components',
        version: VERSIONS.shinyControls,
        description: 'A Shiny Controls theme pack (Shiny.Blazor.Controls.Themes.*) - linked after the core theme in index.html https://shinylib.net/controls/theming/packs/',
        choices: [
            { value: 'None', label: 'None', description: 'Use the default Shiny theme' },
            { value: 'Aurora', label: 'Aurora', description: 'Vivid violet & cyan with glow elevation' },
            { value: 'Material', label: 'Material', description: 'Material Design palette & shape scale' },
            { value: 'Ocean', label: 'Ocean', description: 'Cool blues and teals' },
            { value: 'Terminal', label: 'Terminal', description: 'Monospace, high-contrast terminal look' },
        ],
    },
];

function computeBlazorSymbols(state: TemplateState): Record<string, boolean | string> {
    const s = { ...state } as Record<string, boolean | string>;
    s.mudblazor = s.uilibrary === 'MudBlazor';
    s.radzen = s.uilibrary === 'Radzen';
    s.fluentui = s.uilibrary === 'FluentUI';
    s.useui = s.uilibrary !== 'None';
    // AI Conversation and the cloud providers pull in Speech automatically.
    s.useshinyspeech = !!(s.shinyspeech || s.aiconversation || s.speechazure || s.speechelevenlabs || s.speechtypecast || s.speechopenai);
    s.shinyspeech = !!s.useshinyspeech;
    s.aichatopenai = !!s.aiconversation && s.aichatclient === 'OpenAI';
    s.themeaurora = s.shinytheme === 'Aurora';
    s.themematerial = s.shinytheme === 'Material';
    s.themeocean = s.shinytheme === 'Ocean';
    s.themeterminal = s.shinytheme === 'Terminal';
    s.usetheme = s.shinytheme !== 'None';
    return s;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const TEMPLATE_CONFIGS: Record<TemplateKind, TemplateConfig> = {
    shinyapp: {
        kind: 'shinyapp',
        label: '.NET MAUI',
        blurb: 'Cross-platform iOS, Android, Mac Catalyst, and Windows app powered by the Shiny stack.',
        showApplicationId: true,
        categories: MAUI_CATEGORIES,
        params: MAUI_PARAMS,
        computeSymbols: computeMauiSymbols,
    },
    shinyaspnet: {
        kind: 'shinyaspnet',
        label: 'ASP.NET',
        blurb: 'ASP.NET Core API + service host with Mediator, EF Core, JWT auth, Orleans, SignalR, and Scalar wired in.',
        showApplicationId: false,
        categories: ASPNET_CATEGORIES,
        params: ASPNET_PARAMS,
        computeSymbols: computeAspNetSymbols,
    },
    shinyblazor: {
        kind: 'shinyblazor',
        label: 'Blazor WASM',
        blurb: 'Standalone Blazor WebAssembly app targeting .NET 10 with optional Shiny libraries and a UI component library.',
        showApplicationId: false,
        categories: BLAZOR_CATEGORIES,
        params: BLAZOR_PARAMS,
        computeSymbols: computeBlazorSymbols,
    },
};

export function getDefaultState(kind: TemplateKind): TemplateState {
    const cfg = TEMPLATE_CONFIGS[kind];
    const state: TemplateState = {
        projectName: 'MyApp',
        applicationId: 'com.companyname.app',
    };
    for (const p of cfg.params) {
        state[p.id] = p.defaultValue;
    }
    return state;
}

/** Params that describe project identity/targets rather than features — kept as-is in the baseline. */
const BASELINE_STABLE_PARAM_IDS = new Set(['useios', 'useandroid', 'usemaccatalyst', 'usewindows', 'Framework']);

/**
 * State with every optional feature forced off (bool -> false, choice -> first/"none" value,
 * string -> ''), while keeping platform targets and framework at their defaults. Used as the
 * reference point for "which files change because of a library selection".
 */
export function getBaselineState(kind: TemplateKind): TemplateState {
    const cfg = TEMPLATE_CONFIGS[kind];
    const state = getDefaultState(kind);
    for (const p of cfg.params) {
        if (BASELINE_STABLE_PARAM_IDS.has(p.id)) continue;
        if (p.type === 'bool') state[p.id] = false;
        else if (p.type === 'choice') state[p.id] = p.choices?.[0]?.value ?? '';
        else if (p.type === 'string') state[p.id] = '';
    }
    return state;
}

/** Convenience: compute symbols for any template kind. */
export function computeSymbols(kind: TemplateKind, state: TemplateState): Record<string, boolean | string> {
    return TEMPLATE_CONFIGS[kind].computeSymbols(state);
}
