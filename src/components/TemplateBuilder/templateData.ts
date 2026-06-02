import type { TemplateKind } from './templateFiles';

/**
 * Single source of truth for every NuGet package version surfaced in any of the
 * three template builder tabs (MAUI / ASP.NET / Blazor). Updating a key here
 * propagates to every config that references it.
 */
export const VERSIONS = {
    // Shiny — family-versioned (all *.Maui / *.Blazor / *.AspNet ship together)
    shinyMediator: '6.4.0',
    shinyShell: '6.1.1',
    shinyControls: '1.0.1-beta-0092',
    // Shiny — client packages that share the core release train
    shinyClient: '5.0.0-beta-0121',
    shinyConfiguration: '5.0.0-beta-0121',
    shinyLocalization: '2.0.1',
    shinyStores: '4.1.1',
    shinyReflector: '4.1.1',
    shinyDI: '4.1.1',
    shinySpatial: '1.1.0',
    shinyContactStore: '1.0.1',
    shinySpeech: '2.1.0',
    shinyAiConversation: '1.0.0-beta-0047',
    shinyMusic: '3.0.1',
    shinyHealth: '1.0.0',
    shinyDocumentDb: '6.0.0',
    shinyMauiHosting: '4.1.1',
    shinyWebHosting: '4.1.1',

    // MAUI tooling
    devflow: '0.1.0-preview.10.26274.3',

    // Microsoft + third-party
    ctMvvm: '8.4.2',
    ctMauiMarkup: '7.0.1',
    ctMediaElement: '9.0.0',
    ctCamera: '6.0.1',
    sentry: '6.6.0',
    barcodes: '3.0.4',
    biometric: '2.5.1',
    screenrecord: '1.0.0-preview5',
    ocr: '1.1.1',
    calendar: '5.0.0',
    audio: '4.0.0',
    uraniumUi: '2.16.0',
    alohakit: '1.1.0',
    liveCharts: '2.0.4',
    skia: '3.119.4',
    skiaExtended: '3.0.0',
    ffImageLoading: '1.3.2',
    userDialogs: '9.2.2',
    debugRainbows: '1.2.2',
    mudblazor: '9.5.0',
    radzen: '10.4.7',
    fluentUI: '4.14.2',
    sqliteNetPcl: '1.9.172',
    roomsharp: '0.5.5',
    msExtAi: '10.6.0',
    androidAuto: '1.7.0.3',
    systemReactive: '6.1.0',
    humanizer: '3.0.10',
    unitsNet: '5.75.0',
    sysLinqAsync: '7.0.1',
    refit: '10.1.6',
    orleans: '10.1.0',
    scalar: '2.14.14',
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
    { id: 'framework', title: 'Framework', span: 6 },
    { id: 'markup', title: 'Markup', span: 6 },
    { id: 'configuration', title: 'Configuration', span: 6 },
    { id: 'logging', title: 'Logging', span: 6 },
    { id: 'services', title: 'Services', span: 12 },
    { id: 'code', title: 'Code Generation', span: 12 },
    { id: 'ui', title: 'UI Libraries', span: 12 },
    { id: 'blazor', title: 'Blazor Components', span: 12 },
    { id: 'storage', title: 'Data & Storage', span: 6 },
    { id: 'ai', title: 'AI', span: 6 },
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
        description: 'Debug-only toolkit for visual tree inspection, performance profiling, network monitoring, and AI agent automation. Adds a DevFlow agent to your app that connects to the MAUI CLI (maui devflow) https://github.com/dotnet/maui-labs' },

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
            { value: 'ReactiveUI', label: 'ReactiveUI', description: 'ReactiveUI https://reactiveui.net' },
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
        description: 'Event-driven messaging, middleware, and request/response pipeline https://shinylib.net/mediator/' },

    // Markup
    { id: 'blazor', label: 'Blazor Hybrid', type: 'bool', defaultValue: false, category: 'markup',
        description: 'Add Blazor Hybrid support' },
    { id: 'usecsharpmarkup', label: 'C# Markup (CT)', type: 'bool', defaultValue: false, category: 'markup',
        version: VERSIONS.ctMauiMarkup,
        description: 'Build MAUI UI in C# with fluent syntax https://learn.microsoft.com/en-us/dotnet/communitytoolkit/maui/markup/markup' },

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
    { id: 'notifications', label: 'Local Notifications', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Schedule & manage local notifications https://shinylib.net/client/notifications/' },
    { id: 'health', label: 'Health Data', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyHealth,
        description: 'Cross-platform health data access (HealthKit/Health Connect) https://shinylib.net/health/',
        visibleWhen: noDesktop },
    { id: 'contactstore', label: 'Contact Store', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyContactStore,
        description: 'Full CRUD access to device contacts https://shinylib.net/contactstore/',
        visibleWhen: noDesktop },
    { id: 'shinyspeech', label: 'Speech (STT/TTS)', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'Speech-to-text, text-to-speech, and audio playback https://shinylib.net/speech/' },
    { id: 'aiconversation', label: 'AI Conversation', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyAiConversation,
        description: 'AI Conversation with speech recognition and text-to-speech https://shinylib.net/aiconversation/' },
    { id: 'barcodes', label: 'Barcode Scanning', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.barcodes,
        description: 'Native barcode scanning using MLKit & Vision by afriscic https://github.com/afriscic/BarcodeScanning.Native.Maui',
        visibleWhen: noDesktop },
    { id: 'fingerprint', label: 'Biometric Auth', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.biometric,
        description: 'Fingerprint & face recognition by Oscore (Oscore.Maui.Biometric) https://github.com/oscoreio/Maui.Biometric',
        visibleWhen: noDesktop },
    { id: 'screenrecord', label: 'Screen Recording', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.screenrecord,
        description: 'Record the device screen by Gerald Versluis https://github.com/jfversluis/Plugin.Maui.ScreenRecording',
        visibleWhen: noDesktop },
    { id: 'ocr', label: 'OCR', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.ocr,
        description: 'Optical character recognition by Kori Francis https://github.com/kfrancis/ocr',
        visibleWhen: noDesktop },
    { id: 'calendar', label: 'Calendar Store', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.calendar,
        description: 'Read & write device calendar events by Gerald Versluis https://github.com/jfversluis/Plugin.Maui.CalendarStore',
        visibleWhen: noDesktop },
    { id: 'audio', label: 'Audio', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.audio,
        description: 'Record & play audio by Gerald Versluis https://github.com/jfversluis/Plugin.Maui.Audio',
        visibleWhen: noDesktop },
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
    { id: 'mediaelement', label: 'CT Media Element', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.ctMediaElement,
        description: 'Cross-platform media playback control by Microsoft https://learn.microsoft.com/en-us/dotnet/communitytoolkit/maui/views/mediaelement' },
    { id: 'cameraview', label: 'CT Camera', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.ctCamera,
        description: 'Camera preview & capture control by Microsoft https://learn.microsoft.com/en-us/dotnet/communitytoolkit/maui/views/camera-view' },
    { id: 'uraniumui', label: 'Uranium UI', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.uraniumUi,
        description: 'Material Design component library by Enis Necipoglu https://enisn-projects.io/docs/en/uranium/latest' },
    { id: 'alohakitanimations', label: 'AlohaKit Animations', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.alohakit,
        description: 'Declarative animations library by Javier Suarez https://github.com/jsuarezruiz/AlohaKit.Animations/' },
    { id: 'livecharts', label: 'Live Charts', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.liveCharts,
        description: 'Animated, flexible charts by Alberto Rodriguez https://livecharts.dev/' },
    { id: 'skia', label: 'SkiaSharp', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.skia,
        description: '2D graphics engine powered by Google Skia by Mono https://github.com/mono/SkiaSharp' },
    { id: 'skiaextended', label: 'SkiaSharp Extended (Lottie)', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.skiaExtended,
        description: 'Lottie animations & SVG support for SkiaSharp by Mono https://github.com/mono/SkiaSharp.Extended' },
    { id: 'ffimageloading', label: 'FFImageLoading', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.ffImageLoading,
        description: 'Fast image loading with caching & transformations by microspaze https://github.com/microspaze/FFImageLoading.Maui' },
    { id: 'userdialogs', label: 'ACR User Dialogs', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.userDialogs,
        description: 'Alerts, confirmations, loading indicators & toasts by Allan Ritchie https://github.com/aritchie/userdialogs' },
    { id: 'debugrainbows', label: 'Debug Rainbows', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.debugRainbows,
        description: 'Visual layout debugging overlay (debug only) by Steven Thewissen https://github.com/sthewissen/Plugin.Maui.DebugRainbows' },
    { id: 'markdown', label: 'Shiny Markdown', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Native markdown renderer and editor (no WebView) https://shinylib.net/controls/markdown/' },
    { id: 'mermaiddiagrams', label: 'Shiny Mermaid Diagrams', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyControls,
        description: 'Native Mermaid flowchart rendering (no WebView) https://shinylib.net/controls/mermaid-diagrams/' },
    { id: 'uxdivers', label: 'UX Divers Dialogs', type: 'bool', defaultValue: false, category: 'ui',
        version: VERSIONS.shinyShell,
        description: 'Popups IDialogs implementation for Shiny MAUI Shell https://github.com/shinyorg/mauishell',
        visibleWhen: (s) => s.mvvmframework === 'Shiny MAUI Shell' },

    // Blazor components
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
    { id: 'sqlite', label: 'SQLite-net-pcl', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.sqliteNetPcl,
        description: 'SQLite.NET-PCL by Frank Krueger https://github.com/praeclarum/sqlite-net' },
    { id: 'roomsharp', label: 'RoomSharp', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.roomsharp,
        description: 'SQLite source generated ORM by Safwan Abdulghani https://roomsharp.dev/' },
    { id: 'geospatialdb', label: 'Geospatial DB', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinySpatial,
        description: 'Geospatial database & geofencing https://shinylib.net/spatial/' },

    // AI
    { id: 'msextai', label: 'Microsoft.Extensions.AI', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.msExtAi,
        description: 'Unified abstractions for AI services (IChatClient, IEmbeddingGenerator) https://learn.microsoft.com/en-us/dotnet/ai/ai-extensions' },
    { id: 'aimediator', label: 'Mediator AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyMediator,
        description: 'Source generates AI tools from mediator contracts https://shinylib.net/mediator/extensions/ai/' },
    { id: 'aishinyshell', label: 'Shell AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        description: 'Source generates AI navigation tools from shell maps https://shinylib.net/mauishell/ai/',
        visibleWhen: (s) => s.mvvmframework === 'Shiny MAUI Shell' },
    { id: 'aidocumentdb', label: 'DocumentDB AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyDocumentDb,
        description: 'Exposes document store operations as AI tools https://shinylib.net/documentdb/ai-tools/' },

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
    s.reactiveui = s.mvvmframework === 'ReactiveUI';
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
    s.useblazor = !!(s.blazor || s.radzen || s.mudblazor || s.fluentui);
    s.usemauicontrols = !!s.shinycontrols;
    s.uxdiversdialogs = !!(s.uxdivers && s.shinyshell);
    s.useshinymediator = !!(s.shinymediator || s.aimediator);
    s.usedocumentdb = !!(s.documentdb || s.aidocumentdb);
    s.usemsextai = !!(s.msextai || s.aimediator || s.aishinyshell || s.aidocumentdb || s.aiconversation);
    s.communitytoolkit = !!(s.mediaelement || s.cameraview || s.usecsharpmarkup);
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
    { id: 'connectionstring', label: 'Connection String', type: 'string', defaultValue: '', category: 'data',
        description: 'The database connection string',
        visibleWhen: (s) => s.ef !== 'none' },
    { id: 'efspatial', label: 'EF Spatial (NetTopologySuite)', type: 'bool', defaultValue: false, category: 'data',
        description: 'Adds NetTopologySuite spatial support to your EF Core provider',
        visibleWhen: (s) => s.ef !== 'none' },

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
    { id: 'localization', label: 'Localization', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyLocalization,
        description: 'Source-generated localization https://shinylib.net/extensions/localization/' },
    { id: 'reflector', label: 'Reflector', type: 'bool', defaultValue: false, category: 'extensions',
        version: VERSIONS.shinyReflector,
        description: 'AOT-compatible source-generated reflection https://shinylib.net/extensions/reflector/' },
];

function computeAspNetSymbols(state: TemplateState): Record<string, boolean | string> {
    const s = { ...state } as Record<string, boolean | string>;
    s.efmssql = s.ef === 'sqlserver';
    s.efpostgres = s.ef === 'postgresql';
    s.efnone = s.ef === 'none';
    // Auth handlers (Handlers/Auth/*) use Shiny.Mediator — force it on when jwtauth is enabled.
    s.shinymediator = !!(s.shinymediator || s.jwtauth);
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

    // Services
    { id: 'shinymediator', label: 'Shiny Mediator', type: 'bool', defaultValue: true, category: 'services',
        version: VERSIONS.shinyMediator,
        description: 'Event-driven messaging, middleware, and request/response pipeline https://shinylib.net/mediator/' },
    { id: 'bluetoothle', label: 'Bluetooth LE (Web Bluetooth)', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Web Bluetooth (Chromium browsers only) https://shinylib.net/client/ble/' },
    { id: 'gps', label: 'GPS', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Browser Geolocation https://shinylib.net/client/locations/gps/' },
    { id: 'push', label: 'Push Notifications', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinyClient,
        description: 'Web Push notifications https://shinylib.net/client/push/' },
    { id: 'shinyspeech', label: 'Speech (STT/TTS)', type: 'bool', defaultValue: false, category: 'services',
        version: VERSIONS.shinySpeech,
        description: 'Speech-to-text and text-to-speech (Web Speech API) https://shinylib.net/speech/' },

    // Storage
    { id: 'documentdb', label: 'Document DB (IndexedDB)', type: 'bool', defaultValue: false, category: 'storage',
        version: VERSIONS.shinyDocumentDb,
        description: 'Document-oriented store backed by browser IndexedDB https://shinylib.net/documentdb/' },

    // AI
    { id: 'aiconversation', label: 'AI Conversation', type: 'bool', defaultValue: false, category: 'ai',
        version: VERSIONS.shinyAiConversation,
        description: 'AI Conversation with speech recognition and text-to-speech https://shinylib.net/aiconversation/' },

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
];

function computeBlazorSymbols(state: TemplateState): Record<string, boolean | string> {
    const s = { ...state } as Record<string, boolean | string>;
    s.mudblazor = s.uilibrary === 'MudBlazor';
    s.radzen = s.uilibrary === 'Radzen';
    s.fluentui = s.uilibrary === 'FluentUI';
    s.useui = s.uilibrary !== 'None';
    // AI Conversation pulls in Speech automatically.
    s.shinyspeech = !!(s.shinyspeech || s.aiconversation);
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

/** Convenience: compute symbols for any template kind. */
export function computeSymbols(kind: TemplateKind, state: TemplateState): Record<string, boolean | string> {
    return TEMPLATE_CONFIGS[kind].computeSymbols(state);
}
