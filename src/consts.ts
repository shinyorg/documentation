
export const GITHUB_EDIT_URL = `https://github.com/shinyorg/documentation/tree/main/`;
export const COMMUNITY_INVITE_URL = `https://github.com/shinyorg/shiny/discussions/`;
export const SPONSOR_URL = 'https://sponsor.shinylib.net';
export const GITHUB_URL = 'https://github.com/shinyorg';
export const DEFAULT_VERSION: string = "5.8.0-beta-0005";
/** Recognition IQ (shinyorg/recogintelligence) — Face / Voice / Document Intelligence ship together. */
export const RECOGNITION_VERSION: string = "1.0.0-beta-0006";

// Brand colors from logo
export const BRAND_COLORS = {
    purple: '#9A81EA',
    green: '#91F5AD',
    lime: '#CFFA12',
    white: '#FFFFFF',
    // Derived colors for contrast and accessibility
    purpleDark: '#6347c9',
    purpleLight: '#c3b5f5',
    greenDark: '#40d172',
    greenLight: '#b5f8ca', 
    limeDark: '#abcb00',
    limeLight: '#e4fa7b'
};

export type ShinyComponent = {
    id: string;
    nuget: string;
    description: string;
    version: string;
    category: ShinyCategoryId;
    androidIntent?: string;
    foregroundService?: boolean;
    blazorNuget?: string;
    aspnetNuget?: string;
    linuxNuget?: string;
    macOsSupported?: boolean;
    additionalNugets?: { nuget: string; version: string }[];
    /** Individual controls that share a parent library — hidden in AppBuilder so users pick the library instead. Still discoverable by LibBuilder for per-control doc pages. */
    hideFromAppBuilder?: boolean;
}

/** Mirrors the top-level documentation sections in `src/sidebar-topics.mjs`. */
export type ShinyCategoryId =
    | 'foundation'
    | 'hardware'
    | 'devicedata'
    | 'intelligence'
    | 'background'
    | 'mauiapp'
    | 'controls'
    | 'storage'
    | 'server';

export type ShinyCategory = {
    id: ShinyCategoryId;
    title: string;
    /** Column span out of 12 used by the category grid */
    span: 4 | 6 | 8 | 12;
    /** Bright, light accent color shown in the category header + border */
    color: string;
    /** Very light background tint for the category card */
    tint: string;
    /** Slightly darker tint used for dark theme backgrounds */
    tintDark: string;
}

/** One row per documentation section, in the same order as the sidebar topics. */
export const ShinyCategories: ShinyCategory[] = [
    { id: 'foundation',    title: 'Foundation',                  span: 12, color: '#9A81EA', tint: '#F1EDFC', tintDark: '#2A2547' },
    { id: 'hardware',      title: 'Hardware & Connectivity',     span: 12, color: '#22C55E', tint: '#DEFCE9', tintDark: '#10381F' },
    { id: 'devicedata',    title: 'Device Data',                 span: 12, color: '#06B6D4', tint: '#CFFAFE', tintDark: '#0B3B43' },
    { id: 'intelligence',  title: 'AI & Intelligence',           span: 12, color: '#EC4899', tint: '#FCE7F3', tintDark: '#4A1030' },
    { id: 'background',    title: 'Background & Delivery',       span: 12, color: '#F97316', tint: '#FFEDD5', tintDark: '#45250A' },
    { id: 'mauiapp',       title: 'MAUI App',                    span: 12, color: '#6366F1', tint: '#E0E7FF', tintDark: '#1E2352' },
    { id: 'controls',      title: 'UI Controls',                 span: 12, color: '#0EA5E9', tint: '#E0F2FE', tintDark: '#0B3A52' },
    { id: 'storage',       title: 'Data & Storage',              span: 12, color: '#F59E0B', tint: '#FEF3C7', tintDark: '#3E2E0F' },
    { id: 'server',        title: 'Server & Cloud',              span: 12, color: '#14B8A6', tint: '#CCFBF1', tintDark: '#0C3B36' },
];

export const BLAZOR_COMPATIBLE_IDS = ['mediator', 'stores', 'localization', 'documentdb', 'documentdb-indexeddb', 'reflector', 'di', 'serialization', 'blazorhost', 'gps', 'ble', 'jobs', 'push', 'datasync', 'screenrecorder', 'controls', 'diagram', 'floorplan', 'tableview', 'scheduler', 'floatingpanel', 'pillview', 'imageviewer', 'imageeditor', 'chatview', 'markdown', 'mermaiddiagrams', 'barcodes', 'cameraview', 'camera-ai', 'aiconversation', 'docking', 'osk', 'addressentry', 'applayout', 'autocomplete', 'badge', 'button', 'captcha', 'carousel', 'carousel-gallery', 'colorpicker', 'countrypicker', 'datagrid', 'dialogs', 'expander', 'fab', 'file-drop', 'frostedglass', 'layout', 'media-picker-button', 'modal', 'motion-icons', 'overlay', 'parallax-collection-view', 'passwordstrength', 'progressbar', 'progressline', 'quick-entry', 'rangeslider', 'ribbon', 'securitypin', 'sheetview', 'shinyimage', 'signaturepad', 'skeleton', 'slider', 'splashscreen', 'staggered-grid', 'stateview', 'textentry', 'toast', 'toolbar-tabbar', 'tooltip', 'treeview', 'virtualized-grid', 'walkthrough', 'wizard', 'office', 'spreadsheet', 'document-viewer', 'document-editor', 'slide-editor', 'mediaelement', 'speechaddins', 'theme-aurora', 'theme-material', 'theme-ocean', 'theme-terminal', 'httptransfers', 'documentdb-ai', 'button-group', 'chip-group', 'floatingtoolbar', 'gantt', 'kanban', 'tag-entry', 'timeline', 'zoompanview', 'notebook', 'gamepad', 'gamepad-controls', 'appdevicebridge'];
export const LINUX_COMPATIBLE_IDS = ['ble', 'blehosting', 'notifications', 'discovery', 'wifi', 'screenrecorder', 'mediator', 'stores', 'localization', 'documentdb', 'reflector', 'di', 'serialization', 'httpserver', 'documentdb-ai', 'gamepad'];
export const ASPNET_COMPATIBLE_IDS = ['mediator', 'stores', 'localization', 'serialization', 'extensions-push', 'documentdb', 'documentdb-sqlcipher', 'documentdb-sqlserver', 'documentdb-mysql', 'documentdb-postgresql', 'documentdb-cosmosdb', 'documentdb-mongodb', 'documentdb-litedb', 'documentdb-duckdb', 'documentdb-oracle', 'documentdb-mariadb', 'documentdb-cockroachdb', 'documentdb-azuretable', 'documentdb-dynamodb', 'documentdb-amazondocumentdb', 'documentdb-redis', 'documentdb-ravendb', 'documentdb-firestore', 'reflector', 'di', 'webhost', 'documentdb-ai', 'appdevicebridge'];
export const ASPNET_ONLY_IDS = ['extensions-push', 'documentdb-sqlserver', 'documentdb-mysql', 'documentdb-postgresql', 'documentdb-cosmosdb', 'documentdb-mongodb', 'documentdb-litedb', 'documentdb-duckdb', 'documentdb-oracle', 'documentdb-mariadb', 'documentdb-cockroachdb', 'documentdb-azuretable', 'documentdb-dynamodb', 'documentdb-amazondocumentdb', 'documentdb-redis', 'documentdb-ravendb', 'documentdb-firestore', 'webhost'];
export const BLAZOR_ONLY_IDS = ['documentdb-indexeddb', 'blazorhost', 'applayout', 'captcha', 'carousel', 'layout', 'modal', 'sheetview', 'splashscreen', 'toolbar-tabbar', 'osk'];

export type AndroidConfig = {
    usesJobs?: boolean;
    locations?: "bg" | "fg" | "both";
    foregroundService?: boolean;
    permissions?: string[];
};

export type AppleConfig = {
    usesJobs?: boolean;
    usesPush?: boolean;
    locations?: "bg" | "fg" | "both";
    backgroundModes?: string[];
    permissions?: string[];
};

export type ShinyModule = {
    id: string;
    nuget: string;
    description: string;
    version: string;
    service: string;
    builderCommand?: string;
    builderCommandBg?: string;
    android?: AndroidConfig;
    apple?: AppleConfig;
};

export const ShinyModules: ShinyModule[] = [
];

export const ShinyComponents: ShinyComponent[] = [
    {
        "id": "mediator",
        "nuget": "Shiny.Mediator.Maui",
        "blazorNuget": "Shiny.Mediator.Blazor",
        "aspnetNuget": "Shiny.Mediator.AspNet",
        "description": "Mediator",
        "category": "foundation",
        "version" : "6.9.0-beta-0001"
    },
    {
        "id": "ble",
        "nuget": "Shiny.BluetoothLE",
        "blazorNuget": "Shiny.BluetoothLE.Blazor",
        "linuxNuget": "Shiny.BluetoothLE.Linux",
        "macOsSupported": true,
        "description": "Bluetooth LE",
        "category": "hardware",
        "version": DEFAULT_VERSION
    },
    {
        "id": "blehosting",
        "nuget": "Shiny.BluetoothLE.Hosting",
        "linuxNuget": "Shiny.BluetoothLE.Hosting.Linux",
        "macOsSupported": true,
        "description": "Bluetooth LE Hosting",
        "category": "hardware",
        "version": DEFAULT_VERSION
    },
    {
        // iBeacon ranging/monitoring + Eddystone. Apple routes iBeacon through CoreLocation (location
        // permission); everywhere else it is a BLE scan. Android monitoring runs a connectedDevice
        // foreground service.
        "id": "beacons",
        "nuget": "Shiny.Beacons",
        "macOsSupported": true,
        "description": "Beacons (iBeacon & Eddystone)",
        "category": "hardware",
        "version": DEFAULT_VERSION
    },
    {
        "id": "obd",
        "nuget": "Shiny.Obd.Ble",
        "description": "OBD Bluetooth LE",
        "category": "hardware",
        "version": "1.2.1-beta-0001",
        "additionalNugets": [
            { "nuget": "Shiny.Obd", "version": "1.2.1-beta-0001" },
            { "nuget": "Shiny.Obd.Wifi", "version": "1.2.1-beta-0001" },
            { "nuget": "Shiny.Obd.Serial", "version": "1.2.1-beta-0001" }
        ]
    },
    {
        "id": "jobs",
        "nuget": "Shiny.Jobs",
        "description": "Periodic Jobs",
        "category": "background",
        "version": DEFAULT_VERSION
    },
    {
        "id": "gps",
        "nuget": "Shiny.Locations",
        "blazorNuget": "Shiny.Locations.Blazor",
        "description": "GPS",
        "category": "hardware",
        "foregroundService": true,
        "version": DEFAULT_VERSION
    },
    {
        "id": "geofencing",
        "nuget": "Shiny.Locations",
        "description": "Geofencing",
        "category": "hardware",
        "version": DEFAULT_VERSION
    },
    {
        "id": "locations-ai",
        "nuget": "Shiny.Locations.Extensions.AI",
        "description": "Locations - AI Tools",
        "category": "hardware",
        "foregroundService": true,
        "version": DEFAULT_VERSION
    },
    {
        "id": "httptransfers",
        "nuget": "Shiny.Net.Http",
        "blazorNuget": "Shiny.Net.Http.Blazor",
        "description": "HTTP file uploads and downloads",
        "category": "background",
        "foregroundService": true,
        "version": DEFAULT_VERSION
    },
    {
        "id": "discovery",
        "nuget": "Shiny.Net.Discovery",
        "linuxNuget": "Shiny.Net.Discovery",
        "macOsSupported": true,
        "description": "Network Discovery (mDNS/Bonjour)",
        "category": "hardware",
        "version": DEFAULT_VERSION
    },
    {
        "id": "wifi",
        "nuget": "Shiny.Net.Wifi",
        "linuxNuget": "Shiny.Net.Wifi.Linux",
        "macOsSupported": true,
        "description": "Wi-Fi (scan, connect, hotspot, airplane mode)",
        "category": "hardware",
        "version": DEFAULT_VERSION
    },
    {
        // Android promotes a media-projection foreground service for the duration of a capture.
        // Blazor and Linux ship their own real implementation, so they replace the base package
        // rather than adding to it.
        "id": "screenrecorder",
        "nuget": "Shiny.ScreenRecorder",
        "blazorNuget": "Shiny.ScreenRecorder.Blazor",
        "linuxNuget": "Shiny.ScreenRecorder.Linux",
        "macOsSupported": true,
        "foregroundService": true,
        "description": "Screen Recording",
        "category": "hardware",
        "version": DEFAULT_VERSION
    },
    {
        // iOS (WatchConnectivity) + Android (Wear OS Data Layer) only - nothing is registered elsewhere.
        "id": "wearables",
        "nuget": "Shiny.Wearables",
        "description": "Wearables (Apple Watch & Wear OS)",
        "category": "hardware",
        "version": DEFAULT_VERSION
    },
    {
        // Like ScreenRecorder, Blazor and Linux ship their own implementation under the same
        // AddGamepads() name, so they replace the base package rather than adding to it.
        "id": "gamepad",
        "nuget": "Shiny.Gamepad",
        "blazorNuget": "Shiny.Gamepad.Blazor",
        "linuxNuget": "Shiny.Gamepad.Linux",
        "macOsSupported": true,
        "description": "Gamepads",
        "category": "hardware",
        "version": DEFAULT_VERSION
    },
    {
        "id": "notifications",
        "nuget": "Shiny.Notifications",
        "linuxNuget": "Shiny.Notifications.Linux",
        "macOsSupported": true,
        "description": "Local Notifications",
        "category": "background",
        "androidIntent": "Shiny.ShinyNotificationIntents.NotificationClickAction",
        "version": DEFAULT_VERSION
    },
    {
        "id": "notifications-ai",
        "nuget": "Shiny.Notifications.Extensions.AI",
        "description": "Local Notifications - AI Tools",
        "category": "background",
        "androidIntent": "Shiny.ShinyNotificationIntents.NotificationClickAction",
        "version": DEFAULT_VERSION
    },
    {
        "id": "push",
        "nuget": "Shiny.Push",
        "blazorNuget": "Shiny.Push.Blazor",
        "macOsSupported": true,
        "description": "Push Notifications (Native)",
        "category": "background",
        "androidIntent": "Shiny.ShinyPushIntents.NotificationClickAction",
        "version": DEFAULT_VERSION
    },
    {
        "id": "pushfirebase",
        "nuget": "Shiny.Push.FirebaseMessaging",
        "description": "Push Notifications - Firebase (iOS)",
        "category": "background",
        "androidIntent": "Shiny.ShinyPushIntents.NotificationClickAction",
        "version": "5.1.0"
    },
    {
        "id": "pushazure",
        "nuget": "Shiny.Push.AzureNotificationHubs",
        "description": "Push Notifications - Azure Notification Hubs",
        "category": "background",
        "androidIntent": "Shiny.ShinyPushIntents.NotificationClickAction",
        "version": DEFAULT_VERSION
    },
    {
        // iOS/iPadOS 16.2+ via ActivityKit (needs your own widget extension), Android 16 Live
        // Updates, ordinary ongoing notification on Android 8-15, no-op everywhere else.
        "id": "liveactivities",
        "nuget": "Shiny.Mobile.LiveActivities",
        "description": "Live Activities / Live Updates",
        "category": "background",
        "version": DEFAULT_VERSION
    },
    {
        "id": "music",
        "nuget": "Shiny.Music",
        "description": "Music Library",
        "category": "devicedata",
        "version": "4.1.0"
    },
    {
        "id": "music-ai",
        "nuget": "Shiny.Music.Extensions.AI",
        "description": "Music Library - AI Tools",
        "category": "devicedata",
        "version": "4.1.0"
    },
    {
        "id": "health",
        "nuget": "Shiny.Health",
        "description": "Health Data",
        "category": "devicedata",
        "version": "2.0.1"
    },
    {
        "id": "health-ai",
        "nuget": "Shiny.Health.Extensions.AI",
        "description": "Health Data - AI Tools",
        "category": "devicedata",
        "version": "2.0.1"
    },
    {
        "id": "config",
        "nuget": "Shiny.Extensions.Configuration",
        "description": "Configuration",
        "category": "mauiapp",
        "version": DEFAULT_VERSION
    },
    {
        // Build-time only - generates the Android manifest + iOS Info.plist entries from
        // <MauiPermission> items, which the Project File tab derives from the other selections.
        "id": "permissions",
        "nuget": "Shiny.Permissions.MSBuild",
        "description": "MSBuild Permissions",
        "category": "mauiapp",
        "version": "1.0.0-beta-0009"
    },
    {
        "id": "shell",
        "nuget": "Shiny.Maui.Shell",
        "description": "MAUI Shell Navigation",
        "category": "mauiapp",
        "version": "7.0.1"
    },
    {
        "id": "controls",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Shiny Controls",
        "category": "controls",
        "version": "1.5.0-beta-0004"
    },
    {
        "id": "controls-desktop",
        "nuget": "Shiny.Maui.Controls.Desktop",
        "description": "Desktop Controls",
        "category": "controls",
        "version": "1.5.0-beta-0004"
    },
    {
        "id": "tableview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "TableView",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "scheduler",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Scheduler",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "floatingpanel",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "FloatingPanel",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "fontpicker",
        "nuget": "Shiny.Maui.Controls",
        "description": "FontPicker",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "pillview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "PillView",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "imageviewer",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ImageViewer",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "imageeditor",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ImageEditor",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "chatview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ChatView",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "markdown",
        "nuget": "Shiny.Maui.Controls.Markdown",
        "blazorNuget": "Shiny.Blazor.Controls.Markdown",
        "description": "Markdown",
        "category": "controls",
        "version": "1.5.0-beta-0004"
    },
    {
        "id": "mermaiddiagrams",
        "nuget": "Shiny.Maui.Controls.MermaidDiagrams",
        "blazorNuget": "Shiny.Blazor.Controls.MermaidDiagrams",
        "description": "Mermaid Diagrams",
        "category": "controls",
        "version": "1.5.0-beta-0004"
    },
    {
        "id": "barcodes",
        "nuget": "Shiny.Maui.Controls.Barcodes",
        "blazorNuget": "Shiny.Blazor.Controls.Barcodes",
        "description": "Barcodes",
        "category": "controls",
        "version": "1.5.0-beta-0004"
    },
    {
        // On-screen virtual gamepad. Registers Shiny.Gamepad's platform manager itself (and wraps it),
        // so it must NOT be combined with a bare AddGamepads() call.
        "id": "gamepad-controls",
        "nuget": "Shiny.Maui.Controls.Gamepad",
        "blazorNuget": "Shiny.Blazor.Controls.Gamepad",
        "description": "Virtual Gamepad",
        "category": "controls",
        "version": "1.5.0-beta-0004"
    },
    {
        "id": "cameraview",
        "nuget": "Shiny.Maui.Controls.Camera",
        "blazorNuget": "Shiny.Blazor.Controls.Camera",
        "description": "CameraView",
        "category": "controls",
        "version": "1.5.0-beta-0004"
    },
    {
        "id": "camera-motion",
        "nuget": "Shiny.Maui.Controls.Camera.Motion",
        "description": "CameraView Motion Analyzer",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "camera-barcode",
        "nuget": "Shiny.Maui.Controls.Camera.Barcode",
        "description": "CameraView Barcode Analyzer",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "camera-face",
        "nuget": "Shiny.Maui.Controls.Camera.Face",
        "description": "CameraView Face Analyzer",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "camera-documents",
        "nuget": "Shiny.Maui.Controls.Camera.Documents",
        "description": "CameraView Document Analyzers (invoice, receipt, licence, passport, cards)",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "camera-ai",
        "nuget": "Shiny.Maui.Controls.Camera.Ai",
        "blazorNuget": "Shiny.Blazor.Controls.Camera.Ai",
        "description": "CameraView AI Document Scanner & Photo Stylizer",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "camera-ocr",
        "nuget": "Shiny.Maui.Controls.Camera.Ocr",
        "description": "CameraView OCR Analyzer",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "trayicon",
        "nuget": "Shiny.Maui.Controls.Desktop",
        "description": "Tray Icon (Desktop)",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "docking",
        "nuget": "Shiny.Maui.Controls.Desktop",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Docking (Desktop)",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "osk",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "On-Screen Keyboard (Touch / Kiosk)",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "addressentry",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "AddressEntry",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "applayout",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "AppLayout",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "autocomplete",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "AutoCompleteEntry",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "badge",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "BadgeView",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "button",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ShinyButton",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "captcha",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Captcha",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "carousel",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Carousel",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "carousel-gallery",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "CarouselGallery",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "colorpicker",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ColorPicker",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "countrypicker",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "CountryPicker",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "datagrid",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "DataGrid",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "button-group",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ButtonGroup",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "chip-group",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ChipGroup",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "floatingtoolbar",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "FloatingToolbar",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "gantt",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Gantt",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "kanban",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Kanban",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "tag-entry",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "TagEntry",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "timeline",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Timeline",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "zoompanview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ZoomPanView",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "dialogs",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Dialogs",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "durationpicker",
        "nuget": "Shiny.Maui.Controls",
        "description": "DurationPicker",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "expander",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Expander & Accordion",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "fab",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Fab & FabMenu",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "feedback",
        "nuget": "Shiny.Maui.Controls",
        "description": "Feedback Service",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "file-drop",
        "nuget": "Shiny.Maui.Controls.Desktop",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "File Drop",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "flyout",
        "nuget": "Shiny.Maui.Controls",
        "description": "Flyout",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "frostedglass",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "FrostedGlassView",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "layout",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Stacks & Grid",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "media-picker-button",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "MediaPickerButton",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "modal",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Modal",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "motion-icons",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Motion Icons",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "navigationpage",
        "nuget": "Shiny.Maui.Controls",
        "description": "NavigationPage",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "overlay",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Overlay & LoadingOverlay",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "parallax-collection-view",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ParallaxCollectionView",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "passwordstrength",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "PasswordStrength",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "progressbar",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ProgressBar",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "progressline",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ProgressLine",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "quick-entry",
        "nuget": "Shiny.Maui.Controls.Desktop",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Quick Entry",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "rangeslider",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "RangeSlider",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "ribbon",
        "nuget": "Shiny.Maui.Controls.Desktop",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Ribbon",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "securitypin",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "SecurityPin",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "sheetview",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "SheetView",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "shinyimage",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ShinyImage",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "signaturepad",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "SignaturePad",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "skeleton",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "SkeletonView",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "slider",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Slider",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "splashscreen",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Splash Screen",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "staggered-grid",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "StaggeredGrid",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "stateview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "StateView",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "tabbedpage",
        "nuget": "Shiny.Maui.Controls",
        "description": "TabbedPage",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "textentry",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "TextEntry",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "toast",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Toast",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "toolbar-tabbar",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Toolbar & TabBar",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "tooltip",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Tooltip",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "treeview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "TreeView",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "virtualized-grid",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "VirtualizedGrid",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "walkthrough",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Walkthrough",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "wizard",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Wizard",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "office",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Office Documents (Word, Excel, PowerPoint)",
        "category": "controls",
        "version": "1.5.0-beta-0004"
    },
    {
        "id": "spreadsheet",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Spreadsheet (.xlsx viewer/editor)",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "document-viewer",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Document Viewer (.docx)",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "slide-viewer",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Slide Viewer (.pptx)",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "notebook",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Notebook (OneNote-style canvas)",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "document-editor",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Document Editor (.docx)",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "slide-editor",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Slide Editor (.pptx)",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "mediaelement",
        "nuget": "Shiny.Maui.Controls.MediaElement",
        "blazorNuget": "Shiny.Blazor.Controls.MediaElement",
        "description": "MediaElement (audio & video playback)",
        "category": "controls",
        "version": "1.5.0-beta-0004"
    },
    {
        "id": "speechaddins",
        "nuget": "Shiny.Maui.Controls.SpeechAddins",
        "blazorNuget": "Shiny.Blazor.Controls.SpeechAddins",
        "description": "Speech Add-ins (speech-to-text tools)",
        "category": "controls",
        "version": "1.5.0-beta-0004"
    },
    {
        "id": "keyframe",
        "nuget": "Shiny.Maui.Controls.Keyframe",
        "description": "Keyframe Animation",
        "category": "controls",
        "version": "1.5.0-beta-0004"
    },
    {
        "id": "keyframe-export",
        "nuget": "Shiny.Maui.Controls.Keyframe.Export",
        "description": "Keyframe Animation - Frame/GIF Export",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "diagram",
        "nuget": "Shiny.Maui.Controls.Diagram",
        "blazorNuget": "Shiny.Blazor.Controls.Diagram",
        "description": "Diagram (graph, org chart, flowchart)",
        "category": "controls",
        "version": "1.5.0-beta-0004"
    },
    {
        "id": "floorplan",
        "nuget": "Shiny.Maui.Controls.FloorPlan",
        "blazorNuget": "Shiny.Blazor.Controls.FloorPlan",
        "description": "Floor Plan / Seating Chart",
        "category": "controls",
        "version": "1.5.0-beta-0004"
    },
    {
        "id": "theme-aurora",
        "nuget": "Shiny.Maui.Controls.Themes.Aurora",
        "blazorNuget": "Shiny.Blazor.Controls.Themes.Aurora",
        "description": "Aurora Theme Pack",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "theme-material",
        "nuget": "Shiny.Maui.Controls.Themes.Material",
        "blazorNuget": "Shiny.Blazor.Controls.Themes.Material",
        "description": "Material Theme Pack",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "theme-ocean",
        "nuget": "Shiny.Maui.Controls.Themes.Ocean",
        "blazorNuget": "Shiny.Blazor.Controls.Themes.Ocean",
        "description": "Ocean Theme Pack",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "theme-terminal",
        "nuget": "Shiny.Maui.Controls.Themes.Terminal",
        "blazorNuget": "Shiny.Blazor.Controls.Themes.Terminal",
        "description": "Terminal Theme Pack",
        "category": "controls",
        "version": "1.5.0-beta-0004",
        "hideFromAppBuilder": true
    },
    {
        "id": "stores",
        "nuget": "Shiny.Extensions.Stores",
        "blazorNuget": "Shiny.Extensions.Stores.Web",
        "description": "Key/Value Stores",
        "category": "storage",
        "version": "5.3.0"
    },
    {
        "id": "localization",
        "nuget": "Shiny.Extensions.Localization.Generator",
        "description": "Localization",
        "category": "foundation",
        "version": "2.0.1",
        "additionalNugets": [
            { "nuget": "Microsoft.Extensions.Localization", "version": "10.0.12" }
        ]
    },
    {
        "id": "documentdb",
        "nuget": "Shiny.DocumentDb.Sqlite",
        "description": "Document DB (SQLite)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-ai",
        "nuget": "Shiny.DocumentDb.Extensions.AI",
        "blazorNuget": "Shiny.DocumentDb.Extensions.AI",
        "aspnetNuget": "Shiny.DocumentDb.Extensions.AI",
        "description": "Document DB - AI Tools",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-sqlcipher",
        "nuget": "Shiny.DocumentDb.Sqlite.SqlCipher",
        "description": "Document DB (SqlCipher)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-sqlserver",
        "nuget": "Shiny.DocumentDb.SqlServer",
        "description": "Document DB (SQL Server)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-mysql",
        "nuget": "Shiny.DocumentDb.MySql",
        "description": "Document DB (MySQL)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-postgresql",
        "nuget": "Shiny.DocumentDb.PostgreSql",
        "description": "Document DB (PostgreSQL)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-cosmosdb",
        "nuget": "Shiny.DocumentDb.CosmosDb",
        "description": "Document DB (Cosmos DB)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-mongodb",
        "nuget": "Shiny.DocumentDb.MongoDb",
        "description": "Document DB (MongoDB)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-litedb",
        "nuget": "Shiny.DocumentDb.LiteDb",
        "description": "Document DB (LiteDB)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-duckdb",
        "nuget": "Shiny.DocumentDb.DuckDb",
        "description": "Document DB (DuckDB)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-oracle",
        "nuget": "Shiny.DocumentDb.Oracle",
        "description": "Document DB (Oracle)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-mariadb",
        "nuget": "Shiny.DocumentDb.MariaDb",
        "description": "Document DB (MariaDB)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-cockroachdb",
        "nuget": "Shiny.DocumentDb.CockroachDb",
        "description": "Document DB (CockroachDB)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-azuretable",
        "nuget": "Shiny.DocumentDb.AzureTable",
        "description": "Document DB (Azure Table Storage)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-dynamodb",
        "nuget": "Shiny.DocumentDb.DynamoDb",
        "description": "Document DB (Amazon DynamoDB)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-amazondocumentdb",
        "nuget": "Shiny.DocumentDb.DocumentDb",
        "description": "Document DB (Amazon DocumentDB)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-redis",
        "nuget": "Shiny.DocumentDb.Redis",
        "description": "Document DB (Redis Stack)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-ravendb",
        "nuget": "Shiny.DocumentDb.RavenDb",
        "description": "Document DB (RavenDB)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-firestore",
        "nuget": "Shiny.DocumentDb.Firestore",
        "description": "Document DB (Google Firestore)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "documentdb-indexeddb",
        "nuget": "Shiny.DocumentDb.IndexedDb",
        "blazorNuget": "Shiny.DocumentDb.IndexedDb",
        "description": "Document DB (IndexedDB)",
        "category": "storage",
        "version": "14.0.0"
    },
    {
        "id": "reflector",
        "nuget": "Shiny.Extensions.Reflector",
        "description": "Reflector",
        "category": "foundation",
        "version": "5.3.0"
    },
    {
        "id": "di",
        "nuget": "Shiny.Extensions.DependencyInjection",
        "description": "Dependency Injection",
        "category": "foundation",
        "version": "5.3.0"
    },
    {
        // One package everywhere - the mode lists below are what gate where it shows up.
        "id": "serialization",
        "nuget": "Shiny.Extensions.Serialization",
        "macOsSupported": true,
        "description": "AOT-safe JSON Serialization",
        "category": "foundation",
        "version": "5.3.0"
    },
    {
        "id": "spatial",
        "nuget": "Shiny.Spatial",
        "description": "Spatial Database",
        "category": "storage",
        "version": "2.0.0"
    },
    {
        "id": "spatial-geofencing",
        "nuget": "Shiny.Spatial.Geofencing",
        "description": "Spatial Geofencing",
        "category": "hardware",
        "foregroundService": true,
        "version": "2.0.0"
    },
    {
        "id": "contactstore",
        "nuget": "Shiny.Contacts",
        "description": "Contact Store",
        "category": "devicedata",
        "version": DEFAULT_VERSION
    },
    {
        "id": "contactstore-ai",
        "nuget": "Shiny.Contacts.Extensions.AI",
        "description": "Contact Store - AI Tools",
        "category": "devicedata",
        "version": DEFAULT_VERSION
    },
    {
        "id": "calendarstore",
        "nuget": "Shiny.Calendar",
        "description": "Calendar Store",
        "category": "devicedata",
        "macOsSupported": true,
        "version": DEFAULT_VERSION
    },
    {
        "id": "calendarstore-ai",
        "nuget": "Shiny.Calendar.Extensions.AI",
        "description": "Calendar Store - AI Tools",
        "category": "devicedata",
        "macOsSupported": true,
        "version": DEFAULT_VERSION
    },
    {
        "id": "aiconversation",
        "nuget": "Shiny.AiConversation",
        "description": "AI Conversations",
        "category": "intelligence",
        "version": "3.0.0-beta-0030"
    },
    {
        "id": "faceintelligence",
        "nuget": "Shiny.FaceIntelligence.Onnx",
        "description": "Face Recognition",
        "category": "intelligence",
        "version": RECOGNITION_VERSION,
        "additionalNugets": [
            { "nuget": "Shiny.FaceIntelligence.DocumentDb.Sqlite", "version": RECOGNITION_VERSION },
            { "nuget": "Shiny.FaceIntelligence.Maui", "version": RECOGNITION_VERSION }
        ]
    },
    {
        "id": "voiceintelligence",
        "nuget": "Shiny.VoiceIntelligence.Onnx",
        "description": "Voice / Speaker Recognition",
        "category": "intelligence",
        "version": RECOGNITION_VERSION,
        "additionalNugets": [
            { "nuget": "Shiny.VoiceIntelligence.DocumentDb.Sqlite", "version": RECOGNITION_VERSION },
            { "nuget": "Shiny.VoiceIntelligence.Maui", "version": RECOGNITION_VERSION }
        ]
    },
    {
        "id": "documentintelligence",
        "nuget": "Shiny.DocumentIntelligence",
        "description": "Document Scanning & Extraction",
        "category": "intelligence",
        "macOsSupported": true,
        "version": RECOGNITION_VERSION
    },
    {
        "id": "speech",
        "nuget": "Shiny.Speech",
        "description": "Speech (STT/TTS)",
        "category": "intelligence",
        "version": "3.0.0-beta-0030"
    },
    {
        "id": "speechazure",
        "nuget": "Shiny.Speech.Azure",
        "description": "Speech - Azure AI Speech",
        "category": "intelligence",
        "version": "3.0.0-beta-0030"
    },
    {
        "id": "speechelevenlabs",
        "nuget": "Shiny.Speech.ElevenLabs",
        "description": "Speech - ElevenLabs TTS",
        "category": "intelligence",
        "version": "3.0.0-beta-0030"
    },
    {
        "id": "speechtypecast",
        "nuget": "Shiny.Speech.Typecast",
        "description": "Speech - Typecast TTS",
        "category": "intelligence",
        "version": "3.0.0-beta-0030"
    },
    {
        "id": "speechopenai",
        "nuget": "Shiny.Speech.OpenAI",
        "description": "Speech - OpenAI",
        "category": "intelligence",
        "version": "3.0.0-beta-0030"
    },
    {
        // Adapts whichever ISpeechToText / ITextToSpeech is registered to Microsoft.Extensions.AI's
        // ISpeechToTextClient / ITextToSpeechClient.
        "id": "speechmicrosoftai",
        "nuget": "Shiny.Speech.MicrosoftAI",
        "description": "Speech - Microsoft.Extensions.AI Clients",
        "category": "intelligence",
        "version": "3.0.0-beta-0030"
    },
    {
        "id": "datasync",
        "nuget": "Shiny.Data.Sync",
        "blazorNuget": "Shiny.Data.Sync.Blazor",
        "description": "Data Sync",
        "category": "storage",
        "version": DEFAULT_VERSION
    },
    {
        "id": "mauihost",
        "nuget": "Shiny.Extensions.MauiHosting",
        "description": "MAUI Hosting",
        "category": "mauiapp",
        "version": "5.3.0"
    },
    {
        "id": "webhost",
        "nuget": "Shiny.Extensions.WebHosting",
        "description": "Web Hosting",
        "category": "server",
        "version": "5.3.0"
    },
    {
        // The SERVER side that sends push - not Shiny.Push, which is the on-device client.
        // APNs, FCM, Web Push & WNS all ship in the core package.
        "id": "extensions-push",
        "nuget": "Shiny.Extensions.Push",
        "aspnetNuget": "Shiny.Extensions.Push",
        "description": "Push (Server dispatch - APNs, FCM, Web Push, WNS)",
        "category": "server",
        "version": "3.0.0-beta-0006",
        "additionalNugets": [
            { "nuget": "Shiny.Extensions.Push.DocumentDb", "version": "3.0.0-beta-0006" }
        ]
    },
    {
        "id": "blazorhost",
        "nuget": "Shiny.Extensions.BlazorHosting",
        "blazorNuget": "Shiny.Extensions.BlazorHosting",
        "description": "Blazor App Support (device/browser info, culture & time-zone changes)",
        "category": "server",
        "version": "5.3.0"
    },
    {
        // Runs anywhere .NET runs, which is the point of it — including inside a MAUI app, where
        // ASP.NET Core cannot. No aspnetNuget: this is the alternative to ASP.NET Core, not an
        // add-on for it. No blazorNuget either — a WASM app in the browser cannot listen on a
        // socket; serving a Blazor app *from* this server is a different thing entirely.
        "id": "httpserver",
        "nuget": "Shiny.Net.HttpServer",
        "linuxNuget": "Shiny.Net.HttpServer",
        "macOsSupported": true,
        "description": "HTTP Server (HTTP/1.1, HTTP/2 & HTTP/3, WebSockets, SSE, tunnelling)",
        "category": "server",
        "version": "1.3.0"
    },
    {
        // Three sides of one system: the MAUI app hosts the web app + bridges (WebView package),
        // the Blazor WASM page calls the bridges, and an ASP.NET server hands out signed releases.
        "id": "appdevicebridge",
        "nuget": "Shiny.AppDeviceBridge.WebView",
        "blazorNuget": "Shiny.AppDeviceBridge.Blazor",
        "aspnetNuget": "Shiny.AppDeviceBridge.AspNetCore",
        "description": "App Device Bridge (web app host + native bridges)",
        "category": "server",
        "version": "1.0.0-beta.35"
    }
];

export const Data = {    
    hasComponent(id: string, comps: ShinyComponent[]): boolean {
        return comps.find(c => c.id === id) !== undefined;
    },

    usesPush(compos: ShinyComponent[]): boolean {
        // 'extensions-push' is the server dispatcher, not an on-device push client - it must not
        // pull in the Android/Apple push plumbing.
        return compos.filter(x => x.id !== 'extensions-push' && x.id.indexOf('push') > -1).length > 0;
    },

    usingForeground(compos: ShinyComponent[]): boolean {
        return compos.filter(x => x.foregroundService === true).length > 0;
    },

    usesActivity(compos: ShinyComponent[]): boolean {
        // health needs the Health Connect permissions-rationale intent filter on MainActivity
        return compos.some(x => x.androidIntent !== undefined || x.id === 'health' || x.id === 'health-ai');
    },

    usesWindows(compos: ShinyComponent[]): boolean {
        const windowsIds = ['ble', 'blehosting', 'beacons', 'obd', 'gps', 'geofencing', 'locations-ai', 'httptransfers', 'notifications', 'notifications-ai', 'discovery', 'wifi', 'screenrecorder', 'push', 'speech', 'speechazure', 'speechelevenlabs', 'speechtypecast', 'aiconversation', 'calendarstore', 'calendarstore-ai'];
        return compos.some(x => windowsIds.includes(x.id));
    },

    usesHosting(compos: ShinyComponent[]): boolean {
        const hostingIds = ['ble', 'wearables', 'gamepad', 'gamepad-controls', 'blehosting', 'beacons', 'obd', 'jobs', 'gps', 'geofencing', 'locations-ai', 'spatial-geofencing', 'httptransfers', 'notifications', 'notifications-ai', 'push', 'liveactivities', 'screenrecorder', 'datasync', 'calendarstore', 'calendarstore-ai'];
        return compos.some(x => hostingIds.includes(x.id));
    },

    supportsLinux(id: string): boolean {
        return LINUX_COMPATIBLE_IDS.includes(id);
    },

    supportsMacOs(c: ShinyComponent): boolean {
        return c.macOsSupported === true;
    },

    hasPlatformConfig(compos: ShinyComponent[]): boolean {
        const ids = ['ble', 'blehosting', 'beacons', 'obd', 'jobs', 'gps', 'geofencing', 'locations-ai', 'spatial-geofencing', 'httptransfers', 'notifications', 'notifications-ai', 'discovery', 'wifi', 'screenrecorder', 'push', 'liveactivities', 'contactstore', 'contactstore-ai', 'calendarstore', 'calendarstore-ai', 'health', 'health-ai', 'music', 'speech', 'aiconversation', 'faceintelligence', 'voiceintelligence', 'documentintelligence', 'httpserver'];
        return compos.some(x => ids.includes(x.id));
    }
};