import { ShinyComponents, DEFAULT_VERSION } from '../../consts';

/** Look up the version of a Shiny NuGet package from the shared ShinyComponents data. */
function shinyVersion(nuget: string): string {
    const comp = ShinyComponents.find(c =>
        c.nuget === nuget ||
        c.additionalNugets?.some(n => n.nuget === nuget)
    );
    if (comp) {
        if (comp.nuget === nuget) return comp.version;
        const additional = comp.additionalNugets?.find(n => n.nuget === nuget);
        if (additional) return additional.version;
    }
    return DEFAULT_VERSION;
}

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

export interface TemplateState {
    projectName: string;
    applicationId: string;
    [key: string]: string | boolean;
}

export const CATEGORIES = [
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
] as const;

/** Visibility helpers based on selected platforms */
const noDesktop = (s: TemplateState) => !s.usewindows && !s.usemaccatalyst;
const noWindows = (s: TemplateState) => !s.usewindows;
const noMacCatalyst = (s: TemplateState) => !s.usemaccatalyst;

export const TEMPLATE_PARAMS: TemplateParam[] = [
    // Platform targets (rendered specially in the Project section)
    { id: 'useios', label: 'iOS', type: 'bool', defaultValue: true, category: 'project' },
    { id: 'useandroid', label: 'Android', type: 'bool', defaultValue: true, category: 'project' },
    { id: 'usemaccatalyst', label: 'Mac Catalyst', type: 'bool', defaultValue: false, category: 'project' },
    { id: 'usewindows', label: 'Windows', type: 'bool', defaultValue: false, category: 'project' },

    // Developer tools
    { id: 'devflow', label: 'MAUI DevFlow', type: 'bool', defaultValue: true, category: 'project',
        version: '0.1.0-preview.8.26256.5',
        description: 'Debug-only toolkit for visual tree inspection, performance profiling, network monitoring, and AI agent automation. Adds a DevFlow agent to your app that connects to the MAUI CLI (maui devflow) https://github.com/dotnet/maui-labs' },

    // Choices (rendered as dropdowns)
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
        version: '8.4.2',
        description: 'Source-generated MVVM helpers (ObservableProperty, RelayCommand) by Microsoft https://learn.microsoft.com/en-us/dotnet/communitytoolkit/mvvm/' },
    { id: 'shinymediator', label: 'Shiny Mediator', type: 'bool', defaultValue: true, category: 'framework',
        version: shinyVersion('Shiny.Mediator.Maui'),
        description: 'Event-driven messaging, middleware, and request/response pipeline https://shinylib.net/mediator/' },

    // Markup bools
    { id: 'blazor', label: 'Blazor Hybrid', type: 'bool', defaultValue: false, category: 'markup',
        description: 'Add Blazor Hybrid support' },
    { id: 'usecsharpmarkup', label: 'C# Markup (CT)', type: 'bool', defaultValue: false, category: 'markup',
        version: '7.0.1',
        description: 'Build MAUI UI in C# with fluent syntax https://learn.microsoft.com/en-us/dotnet/communitytoolkit/maui/markup/markup' },

    // Configuration bools
    { id: 'configuration', label: 'AppSettings.json', type: 'bool', defaultValue: true, category: 'configuration',
        version: shinyVersion('Shiny.Extensions.Configuration'),
        description: 'App configuration from JSON files https://shinylib.net/extensions/configuration/' },
    { id: 'localization', label: 'Localization', type: 'bool', defaultValue: false, category: 'configuration',
        version: shinyVersion('Shiny.Extensions.Localization.Generator'),
        description: 'Source-generated localization https://shinylib.net/extensions/localization/' },

    // Logging
    { id: 'sentry', label: 'Sentry.IO', type: 'bool', defaultValue: false, category: 'logging',
        version: '6.5.0',
        description: 'Error tracking & performance monitoring https://docs.sentry.io/platforms/dotnet/guides/maui/' },

    // Services bools
    { id: 'bluetoothle', label: 'Bluetooth LE', type: 'bool', defaultValue: false, category: 'services',
        version: shinyVersion('Shiny.BluetoothLE'),
        description: 'BLE client operations https://shinylib.net/client/ble/' },
    { id: 'blehosting', label: 'Bluetooth LE Hosting', type: 'bool', defaultValue: false, category: 'services',
        version: shinyVersion('Shiny.BluetoothLE.Hosting'),
        description: 'BLE peripheral/server hosting https://shinylib.net/client/blehosting/' },
    { id: 'jobs', label: 'Background Jobs', type: 'bool', defaultValue: false, category: 'services',
        version: shinyVersion('Shiny.Jobs'),
        description: 'Periodic background tasks https://shinylib.net/client/jobs/',
        visibleWhen: noDesktop },
    { id: 'gps', label: 'GPS', type: 'bool', defaultValue: false, category: 'services',
        version: shinyVersion('Shiny.Locations'),
        description: 'Foreground & background GPS tracking https://shinylib.net/client/locations/gps/' },
    { id: 'geofencing', label: 'Geofencing', type: 'bool', defaultValue: false, category: 'services',
        version: shinyVersion('Shiny.Locations'),
        description: 'Monitor geofence regions https://shinylib.net/client/locations/geofencing/' },
    { id: 'httptransfers', label: 'HTTP Transfers', type: 'bool', defaultValue: false, category: 'services',
        version: shinyVersion('Shiny.Net.Http'),
        description: 'Background HTTP uploads & downloads https://shinylib.net/client/httptransfers/' },
    { id: 'notifications', label: 'Local Notifications', type: 'bool', defaultValue: false, category: 'services',
        version: shinyVersion('Shiny.Notifications'),
        description: 'Schedule & manage local notifications https://shinylib.net/client/notifications/' },
    { id: 'health', label: 'Health Data', type: 'bool', defaultValue: false, category: 'services',
        version: shinyVersion('Shiny.Health'),
        description: 'Cross-platform health data access (HealthKit/Health Connect) https://shinylib.net/health/',
        visibleWhen: noDesktop },
    { id: 'contactstore', label: 'Contact Store', type: 'bool', defaultValue: false, category: 'services',
        version: shinyVersion('Shiny.Maui.ContactStore'),
        description: 'Full CRUD access to device contacts https://shinylib.net/contactstore/',
        visibleWhen: noDesktop },
    { id: 'shinyspeech', label: 'Speech (STT/TTS)', type: 'bool', defaultValue: false, category: 'services',
        version: shinyVersion('Shiny.Speech'),
        description: 'Speech-to-text, text-to-speech, and audio playback https://shinylib.net/speech/' },
    { id: 'aiconversation', label: 'AI Conversation', type: 'bool', defaultValue: false, category: 'services',
        version: shinyVersion('Shiny.AiConversation'),
        description: 'AI Conversation with speech recognition and text-to-speech https://shinylib.net/aiconversation/' },
    { id: 'barcodes', label: 'Barcode Scanning', type: 'bool', defaultValue: false, category: 'services',
        version: '3.0.3',
        description: 'Native barcode scanning using MLKit & Vision by afriscic https://github.com/afriscic/BarcodeScanning.Native.Maui',
        visibleWhen: noDesktop },
    { id: 'fingerprint', label: 'Biometric Auth', type: 'bool', defaultValue: false, category: 'services',
        version: '2.5.1',
        description: 'Fingerprint & face recognition by Oscore https://github.com/oscoreio/Maui.Biometric',
        visibleWhen: noDesktop },
    { id: 'screenrecord', label: 'Screen Recording', type: 'bool', defaultValue: false, category: 'services',
        version: '1.0.0-preview5',
        description: 'Record the device screen by Gerald Versluis https://github.com/jfversluis/Plugin.Maui.ScreenRecording',
        visibleWhen: noDesktop },
    { id: 'ocr', label: 'OCR', type: 'bool', defaultValue: false, category: 'services',
        version: '1.1.1',
        description: 'Optical character recognition by Kori Francis https://github.com/kfrancis/ocr',
        visibleWhen: noDesktop },
    { id: 'calendar', label: 'Calendar Store', type: 'bool', defaultValue: false, category: 'services',
        version: '5.0.0',
        description: 'Read & write device calendar events by Gerald Versluis https://github.com/jfversluis/Plugin.Maui.CalendarStore',
        visibleWhen: noDesktop },
    { id: 'audio', label: 'Audio', type: 'bool', defaultValue: false, category: 'services',
        version: '4.0.0',
        description: 'Record & play audio by Gerald Versluis https://github.com/jfversluis/Plugin.Maui.Audio',
        visibleWhen: noDesktop },
    { id: 'music', label: 'Music Library', type: 'bool', defaultValue: false, category: 'services',
        version: shinyVersion('Shiny.Music'),
        description: 'Music library & player https://shinylib.net/music/',
        visibleWhen: noDesktop },

    // Code generation
    { id: 'settings', label: 'Bound Settings Class', type: 'bool', defaultValue: false, category: 'code',
        description: 'Reactive object that binds to platform preferences or secure storage' },
    { id: 'authservice', label: 'Sample Auth Service', type: 'bool', defaultValue: false, category: 'code',
        description: 'Creates a sample MSAL or Web Authenticator service',
        visibleWhen: (s) => s.authtype !== 'None' },
    { id: 'refit', label: 'Refit HTTP Client', type: 'bool', defaultValue: false, category: 'code',
        version: '10.1.6',
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
        version: shinyVersion('Shiny.Maui.Controls'),
        description: 'Scheduler, BottomSheet, ImageViewer, PillView, SecurityPin, Fab https://shinylib.net/controls/' },
    { id: 'mediaelement', label: 'CT Media Element', type: 'bool', defaultValue: false, category: 'ui',
        version: '9.0.0',
        description: 'Cross-platform media playback control by Microsoft https://learn.microsoft.com/en-us/dotnet/communitytoolkit/maui/views/mediaelement' },
    { id: 'cameraview', label: 'CT Camera', type: 'bool', defaultValue: false, category: 'ui',
        version: '6.0.1',
        description: 'Camera preview & capture control by Microsoft https://learn.microsoft.com/en-us/dotnet/communitytoolkit/maui/views/camera-view' },
    { id: 'uraniumui', label: 'Uranium UI', type: 'bool', defaultValue: false, category: 'ui',
        version: '2.15.0',
        description: 'Material Design component library by Enis Necipoglu https://enisn-projects.io/docs/en/uranium/latest' },
    { id: 'skeleton', label: 'Skeleton', type: 'bool', defaultValue: false, category: 'ui',
        version: '2.0.0',
        description: 'Loading placeholder animations by Horus Software https://github.com/HorusSoftwareUY/Xamarin.Forms.Skeleton' },
    { id: 'alohakitanimations', label: 'AlohaKit Animations', type: 'bool', defaultValue: false, category: 'ui',
        version: '1.1.0',
        description: 'Declarative animations library by Javier Suarez https://github.com/jsuarezruiz/AlohaKit.Animations/' },
    { id: 'livecharts', label: 'Live Charts', type: 'bool', defaultValue: false, category: 'ui',
        version: '2.0.2',
        description: 'Animated, flexible charts by Alberto Rodriguez https://livecharts.dev/' },
    { id: 'skia', label: 'SkiaSharp', type: 'bool', defaultValue: false, category: 'ui',
        version: '3.119.2',
        description: '2D graphics engine powered by Google Skia by Mono https://github.com/mono/SkiaSharp' },
    { id: 'skiaextended', label: 'SkiaSharp Extended (Lottie)', type: 'bool', defaultValue: false, category: 'ui',
        version: '3.0.0',
        description: 'Lottie animations & SVG support for SkiaSharp by Mono https://github.com/mono/SkiaSharp.Extended' },
    { id: 'ffimageloading', label: 'FFImageLoading', type: 'bool', defaultValue: false, category: 'ui',
        version: '1.3.2',
        description: 'Fast image loading with caching & transformations by microspaze https://github.com/microspaze/FFImageLoading.Maui' },
    { id: 'userdialogs', label: 'ACR User Dialogs', type: 'bool', defaultValue: false, category: 'ui',
        version: '9.2.2',
        description: 'Alerts, confirmations, loading indicators & toasts by Allan Ritchie https://github.com/aritchie/userdialogs' },
    { id: 'debugrainbows', label: 'Debug Rainbows', type: 'bool', defaultValue: false, category: 'ui',
        version: '1.2.2',
        description: 'Visual layout debugging overlay (debug only) by Steven Thewissen https://github.com/sthewissen/Plugin.Maui.DebugRainbows' },
    { id: 'markdown', label: 'Shiny Markdown', type: 'bool', defaultValue: false, category: 'ui',
        version: shinyVersion('Shiny.Maui.Controls.Markdown'),
        description: 'Native markdown renderer and editor (no WebView) https://shinylib.net/controls/markdown/' },
    { id: 'mermaiddiagrams', label: 'Shiny Mermaid Diagrams', type: 'bool', defaultValue: false, category: 'ui',
        version: shinyVersion('Shiny.Maui.Controls.MermaidDiagrams'),
        description: 'Native Mermaid flowchart rendering (no WebView) https://shinylib.net/controls/mermaid-diagrams/' },
    { id: 'uxdivers', label: 'UX Divers Dialogs', type: 'bool', defaultValue: false, category: 'ui',
        version: shinyVersion('Shiny.Maui.Shell'),
        description: 'Popups IDialogs implementation for Shiny MAUI Shell https://github.com/shinyorg/mauishell',
        visibleWhen: (s) => s.mvvmframework === 'Shiny MAUI Shell' },
    { id: 'cards', label: 'CardsView', type: 'bool', defaultValue: false, category: 'ui',
        version: '1.1.2',
        description: 'Swipeable card stack views by Andrei Misiukevich https://www.nuget.org/packages/CardsView.Maui' },

    // Blazor components
    { id: 'mudblazor', label: 'MudBlazor', type: 'bool', defaultValue: false, category: 'blazor',
        version: '9.4.0',
        description: 'Material Design Blazor component library https://mudblazor.com/' },
    { id: 'radzen', label: 'Radzen.Blazor', type: 'bool', defaultValue: false, category: 'blazor',
        version: '10.3.2',
        description: '80+ Blazor UI components by Radzen https://blazor.radzen.com/' },
    { id: 'fluentui', label: 'Microsoft FluentUI', type: 'bool', defaultValue: false, category: 'blazor',
        version: '4.14.1',
        description: 'Fluent Design Blazor components by Microsoft https://www.fluentui-blazor.net/' },

    // Storage
    { id: 'documentdb', label: 'Document DB', type: 'bool', defaultValue: false, category: 'storage',
        version: shinyVersion('Shiny.DocumentDb.Sqlite'),
        description: 'Document-oriented database on SQLite https://shinylib.net/documentdb/' },
    { id: 'sqlite', label: 'SQLite-net-pcl', type: 'bool', defaultValue: false, category: 'storage',
        version: '1.9.172',
        description: 'SQLite.NET-PCL by Frank Krueger https://github.com/praeclarum/sqlite-net' },
    { id: 'roomsharp', label: 'RoomSharp', type: 'bool', defaultValue: false, category: 'storage',
        version: '0.5.4',
        description: 'SQLite source generated ORM by Safwan Abdulghani https://roomsharp.dev/' },
    { id: 'geospatialdb', label: 'Geospatial DB', type: 'bool', defaultValue: false, category: 'storage',
        version: shinyVersion('Shiny.Spatial'),
        description: 'Geospatial database & geofencing https://shinylib.net/spatial/' },

    // AI
    { id: 'msextai', label: 'Microsoft.Extensions.AI', type: 'bool', defaultValue: false, category: 'ai',
        version: '10.5.2',
        description: 'Unified abstractions for AI services (IChatClient, IEmbeddingGenerator) https://learn.microsoft.com/en-us/dotnet/ai/ai-extensions' },
    { id: 'aimediator', label: 'Mediator AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: shinyVersion('Shiny.Mediator.Maui'),
        description: 'Source generates AI tools from mediator contracts https://shinylib.net/mediator/extensions/ai/' },
    { id: 'aishinyshell', label: 'Shell AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        description: 'Source generates AI navigation tools from shell maps https://shinylib.net/mauishell/ai/',
        visibleWhen: (s) => s.mvvmframework === 'Shiny MAUI Shell' },
    { id: 'aidocumentdb', label: 'DocumentDB AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        version: shinyVersion('Shiny.DocumentDb.Sqlite'),
        description: 'Exposes document store operations as AI tools https://shinylib.net/documentdb/ai-tools/' },

    // Platform
    { id: 'androidauto', label: 'Android Auto', type: 'bool', defaultValue: false, category: 'platform',
        version: '1.7.0.3',
        description: 'Add Android Auto support',
        visibleWhen: (s) => !!s.useandroid },
    { id: 'carplay', label: 'iOS CarPlay', type: 'bool', defaultValue: false, category: 'platform',
        description: 'Add iOS CarPlay support',
        visibleWhen: (s) => !!s.useios },

    // Utilities
    { id: 'systemreactive', label: 'System.Reactive', type: 'bool', defaultValue: false, category: 'utility',
        version: '6.1.0',
        description: 'Reactive Extensions for .NET https://github.com/dotnet/reactive' },
    { id: 'humanizer', label: 'Humanizer', type: 'bool', defaultValue: false, category: 'utility',
        version: '3.0.10',
        description: 'String, date, number manipulation & humanization https://github.com/Humanizr/Humanizer' },
    { id: 'unitsnet', label: 'UnitsNet', type: 'bool', defaultValue: false, category: 'utility',
        version: '5.75.0',
        description: 'Unit of measurement conversions https://github.com/angularsen/UnitsNet' },
    { id: 'syslinqasync', label: 'System.Linq.Async', type: 'bool', defaultValue: false, category: 'utility',
        version: '7.0.1',
        description: 'Async LINQ operators for IAsyncEnumerable https://github.com/dotnet/reactive' },
];

/** Compute all derived symbols from the current parameter state */
export function computeSymbols(state: TemplateState): Record<string, boolean | string> {
    const s = { ...state } as Record<string, boolean | string>;

    // Computed booleans from template.json
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
    // Platform targets (usemaccatalyst comes from state directly now)

    return s;
}

export function getDefaultState(): TemplateState {
    const state: TemplateState = {
        projectName: 'MyApp',
        applicationId: 'com.companyname.app',
    };
    for (const p of TEMPLATE_PARAMS) {
        state[p.id] = p.defaultValue;
    }
    return state;
}
