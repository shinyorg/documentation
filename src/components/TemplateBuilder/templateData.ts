export type ParamType = 'bool' | 'choice' | 'string';

export interface TemplateChoice {
    value: string;
    label: string;
}

export interface TemplateParam {
    id: string;
    label: string;
    type: ParamType;
    defaultValue: string | boolean;
    category: string;
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

export const TEMPLATE_PARAMS: TemplateParam[] = [
    // Choices (rendered as dropdowns)
    { id: 'Framework', label: 'Target Framework', type: 'choice', defaultValue: 'net10.0', category: 'project', choices: [
        { value: 'net10.0', label: '.NET 10.0' },
    ]},
    { id: 'mvvmframework', label: 'MVVM Framework', type: 'choice', defaultValue: 'Shiny MAUI Shell', category: 'framework', choices: [
        { value: 'None', label: 'None' },
        { value: 'Shiny MAUI Shell', label: 'Shiny MAUI Shell' },
        { value: 'Prism', label: 'Prism' },
        { value: 'ReactiveUI', label: 'ReactiveUI' },
    ]},
    { id: 'push', label: 'Push Notifications', type: 'choice', defaultValue: 'None', category: 'services', choices: [
        { value: 'None', label: 'None' },
        { value: 'Native', label: 'Native (Shiny.Push)' },
        { value: 'Azure Notification Hubs', label: 'Azure Notification Hubs' },
        { value: 'Firebase Messaging', label: 'Firebase Cloud Messaging' },
    ]},
    { id: 'maptype', label: 'Maps', type: 'choice', defaultValue: 'None', category: 'services', choices: [
        { value: 'None', label: 'None' },
        { value: 'MAUI', label: 'MAUI Maps' },
        { value: 'Google Maps', label: 'Google Maps (Android & iOS)' },
    ]},
    { id: 'authtype', label: 'Authentication', type: 'choice', defaultValue: 'None', category: 'code', choices: [
        { value: 'None', label: 'None' },
        { value: 'MAUI Web Authenticator', label: 'MAUI Web Authenticator' },
        { value: 'MSAL Basic', label: 'MSAL - Basic' },
        { value: 'MSAL AzureB2C', label: 'MSAL - Azure B2C' },
        { value: 'MSAL Broker', label: 'MSAL - Broker' },
    ]},

    // String inputs (conditional)
    { id: 'deeplinks', label: 'Deep Link URI', type: 'string', defaultValue: '', category: 'code' },
    { id: 'msalclientid', label: 'MSAL Client ID', type: 'string', defaultValue: '', category: 'code',
        visibleWhen: (s) => s.authtype === 'MSAL Basic' || s.authtype === 'MSAL AzureB2C' || s.authtype === 'MSAL Broker' },
    { id: 'mapsandroidkey', label: 'Android Maps API Key', type: 'string', defaultValue: '', category: 'services',
        visibleWhen: (s) => s.maptype !== 'None' },

    // Framework bools
    { id: 'ctmvvm', label: 'Community Toolkit MVVM', type: 'bool', defaultValue: true, category: 'framework' },
    { id: 'shinymediator', label: 'Shiny Mediator', type: 'bool', defaultValue: true, category: 'framework' },

    // Markup bools
    { id: 'blazor', label: 'Blazor Hybrid', type: 'bool', defaultValue: false, category: 'markup' },
    { id: 'usecsharpmarkup', label: 'C# Markup (CT)', type: 'bool', defaultValue: false, category: 'markup' },

    // Configuration bools
    { id: 'configuration', label: 'AppSettings.json', type: 'bool', defaultValue: true, category: 'configuration' },
    { id: 'localization', label: 'Localization', type: 'bool', defaultValue: false, category: 'configuration' },

    // Logging
    { id: 'sentry', label: 'Sentry.IO', type: 'bool', defaultValue: false, category: 'logging' },

    // Services bools
    { id: 'bluetoothle', label: 'Bluetooth LE', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'blehosting', label: 'Bluetooth LE Hosting', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'jobs', label: 'Background Jobs', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'gps', label: 'GPS', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'geofencing', label: 'Geofencing', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'httptransfers', label: 'HTTP Transfers', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'notifications', label: 'Local Notifications', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'health', label: 'Health Data', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'contactstore', label: 'Contact Store', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'shinyspeech', label: 'Speech (STT/TTS)', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'aiconversation', label: 'AI Conversation', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'barcodes', label: 'Barcode Scanning', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'fingerprint', label: 'Biometric Auth', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'screenrecord', label: 'Screen Recording', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'ocr', label: 'OCR', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'calendar', label: 'Calendar Store', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'audio', label: 'Audio', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'music', label: 'Music Library', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'storereview', label: 'Store Review', type: 'bool', defaultValue: false, category: 'services' },
    { id: 'embedio', label: 'EmbedIO Web Server', type: 'bool', defaultValue: false, category: 'services' },

    // Code generation
    { id: 'settings', label: 'Bound Settings Class', type: 'bool', defaultValue: false, category: 'code' },
    { id: 'authservice', label: 'Sample Auth Service', type: 'bool', defaultValue: false, category: 'code',
        visibleWhen: (s) => s.authtype !== 'None' },
    { id: 'refit', label: 'Refit HTTP Client', type: 'bool', defaultValue: false, category: 'code',
        visibleWhen: (s) => s.authtype !== 'None' },
    { id: 'appactions', label: 'App Actions', type: 'bool', defaultValue: false, category: 'code' },
    { id: 'essentialsmedia', label: 'Media Picker', type: 'bool', defaultValue: false, category: 'code' },
    { id: 'essentialsfilepicker', label: 'File Picker', type: 'bool', defaultValue: false, category: 'code' },

    // UI libs
    { id: 'communitytoolkit', label: 'MAUI Community Toolkit', type: 'bool', defaultValue: true, category: 'ui' },
    { id: 'speechrecognition', label: 'CT Speech-to-Text', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'mediaelement', label: 'CT Media Element', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'cameraview', label: 'CT Camera', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'uraniumui', label: 'Uranium UI', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'skeleton', label: 'Skeleton', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'alohakitanimations', label: 'AlohaKit Animations', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'livecharts', label: 'Live Charts', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'skia', label: 'SkiaSharp', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'skiaextended', label: 'SkiaSharp Extended (Lottie)', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'ffimageloading', label: 'FFImageLoading', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'userdialogs', label: 'ACR User Dialogs', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'debugrainbows', label: 'Debug Rainbows', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'shinycontrols', label: 'Shiny Controls', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'markdown', label: 'Shiny Markdown', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'mermaiddiagrams', label: 'Shiny Mermaid Diagrams', type: 'bool', defaultValue: false, category: 'ui' },
    { id: 'uxdivers', label: 'UX Divers Dialogs', type: 'bool', defaultValue: false, category: 'ui',
        visibleWhen: (s) => s.mvvmframework === 'Shiny MAUI Shell' },
    { id: 'cards', label: 'CardsView', type: 'bool', defaultValue: false, category: 'ui' },

    // Blazor components
    { id: 'mudblazor', label: 'MudBlazor', type: 'bool', defaultValue: false, category: 'blazor' },
    { id: 'radzen', label: 'Radzen.Blazor', type: 'bool', defaultValue: false, category: 'blazor' },
    { id: 'fluentui', label: 'Microsoft FluentUI', type: 'bool', defaultValue: false, category: 'blazor' },

    // Storage
    { id: 'sqlite', label: 'SQLite', type: 'bool', defaultValue: false, category: 'storage' },
    { id: 'roomsharp', label: 'RoomSharp', type: 'bool', defaultValue: false, category: 'storage' },
    { id: 'documentdb', label: 'Document DB', type: 'bool', defaultValue: false, category: 'storage' },
    { id: 'litedb', label: 'LiteDB AOT', type: 'bool', defaultValue: false, category: 'storage' },
    { id: 'geospatialdb', label: 'Geospatial DB', type: 'bool', defaultValue: false, category: 'storage' },

    // AI
    { id: 'msextai', label: 'Microsoft.Extensions.AI', type: 'bool', defaultValue: false, category: 'ai' },
    { id: 'aimediator', label: 'Mediator AI Tools', type: 'bool', defaultValue: false, category: 'ai' },
    { id: 'aishinyshell', label: 'Shell AI Tools', type: 'bool', defaultValue: false, category: 'ai',
        visibleWhen: (s) => s.mvvmframework === 'Shiny MAUI Shell' },
    { id: 'aidocumentdb', label: 'DocumentDB AI Tools', type: 'bool', defaultValue: false, category: 'ai' },

    // Platform
    { id: 'androidauto', label: 'Android Auto', type: 'bool', defaultValue: false, category: 'platform' },
    { id: 'carplay', label: 'iOS CarPlay', type: 'bool', defaultValue: false, category: 'platform' },

    // Utilities
    { id: 'humanizer', label: 'Humanizer', type: 'bool', defaultValue: false, category: 'utility' },
    { id: 'unitsnet', label: 'UnitsNet', type: 'bool', defaultValue: false, category: 'utility' },
    { id: 'syslinqasync', label: 'System.Linq.Async', type: 'bool', defaultValue: false, category: 'utility' },
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
    // Mac catalyst always true for now
    s.usemaccatalyst = true;

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
