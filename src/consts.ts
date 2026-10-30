import { VERSIONS } from './components/TemplateBuilder/templateData';


export const GITHUB_EDIT_URL = `https://github.com/shinyorg/documentation/tree/main/`;
export const COMMUNITY_INVITE_URL = `https://github.com/shinyorg/shiny/discussions/`;
export const SPONSOR_URL = 'https://sponsor.shinylib.net';
export const GITHUB_URL = 'https://github.com/shinyorg';
export const DEFAULT_VERSION: string = VERSIONS.shinyClient;
/** Recognition IQ (shinyorg/recogintelligence) — Face / Voice / Document Intelligence ship together. */
export const RECOGNITION_VERSION: string = VERSIONS.shinyRecognition;

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

export const ShinyComponents: ShinyComponent[] = [
    {
        "id": "mediator",
        "nuget": "Shiny.Mediator.Maui",
        "blazorNuget": "Shiny.Mediator.Blazor",
        "aspnetNuget": "Shiny.Mediator.AspNet",
        "description": "Mediator",
        "category": "foundation",
        "version": VERSIONS.shinyMediator
    },
    {
        "id": "mediator-resilience",
        "nuget": "Shiny.Mediator.Resilience",
        "description": "Mediator - Resilience (Polly) Middleware",
        "category": "foundation",
        "version": VERSIONS.shinyMediator
    },
    {
        "id": "mediator-caching",
        "nuget": "Shiny.Mediator.Caching.MicrosoftMemoryCache",
        "description": "Mediator - Memory Caching Middleware",
        "category": "foundation",
        "version": VERSIONS.shinyMediator
    },
    {
        "id": "mediator-fluentvalidation",
        "nuget": "Shiny.Mediator.FluentValidation",
        "description": "Mediator - FluentValidation Middleware",
        "category": "foundation",
        "version": VERSIONS.shinyMediator
    },
    {
        "id": "mediator-dapper",
        "nuget": "Shiny.Mediator.DapperRequests",
        "description": "Mediator - Dapper Requests",
        "category": "foundation",
        "version": VERSIONS.shinyMediator
    },
    {
        // Exposes mediator contracts as app functions - rides on Shiny.AppFunctions (see IMPLIED_COMPONENTS)
        "id": "mediator-appfunctions",
        "nuget": "Shiny.Mediator.AppFunctions",
        "description": "Mediator - App Functions (Siri & Gemini)",
        "category": "foundation",
        "version": VERSIONS.shinyMediator
    },
    {
        "id": "mediator-tickerq",
        "nuget": "Shiny.Mediator.TickerQ",
        "description": "Mediator - TickerQ Command Scheduling",
        "category": "foundation",
        "version": VERSIONS.shinyMediator
    },
    {
        "id": "ble",
        "nuget": "Shiny.BluetoothLE",
        "linuxNuget": "Shiny.BluetoothLE.Linux",
        "macOsSupported": true,
        "description": "Bluetooth LE",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "blehosting",
        "nuget": "Shiny.BluetoothLE.Hosting",
        "linuxNuget": "Shiny.BluetoothLE.Hosting.Linux",
        "macOsSupported": true,
        "description": "Bluetooth LE Hosting",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        // SignalR-style hubs over BLE. Host rides on blehosting, client on ble - see IMPLIED_COMPONENTS.
        "id": "blehubs-host",
        "nuget": "Shiny.BluetoothLE.Hubs.Host",
        "macOsSupported": true,
        "description": "Bluetooth LE Hubs - Host",
        "category": "hardware",
        "version": VERSIONS.shinyBleHubs
    },
    {
        "id": "blehubs-client",
        "nuget": "Shiny.BluetoothLE.Hubs.Client",
        "macOsSupported": true,
        "description": "Bluetooth LE Hubs - Client",
        "category": "hardware",
        "version": VERSIONS.shinyBleHubs
    },
    {
        // shinyorg/hubs - ships with BluetoothLE Hubs, one version from 1.5
        "id": "universalhubs-host",
        "nuget": "Shiny.UniversalHubs.Host",
        "description": "Universal Hubs - Host (BLE + Wi-Fi)",
        "category": "hardware",
        "version": VERSIONS.shinyUniversalHubs
    },
    {
        "id": "universalhubs-client",
        "nuget": "Shiny.UniversalHubs.Client",
        "description": "Universal Hubs - Client (BLE + Wi-Fi)",
        "category": "hardware",
        "version": VERSIONS.shinyUniversalHubs
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
        "version": VERSIONS.shinyClient
    },
    {
        "id": "obd",
        "nuget": "Shiny.Obd.Ble",
        "description": "OBD Bluetooth LE",
        "category": "hardware",
        "version": VERSIONS.shinyObd,
        "additionalNugets": [
            { "nuget": "Shiny.Obd", "version": VERSIONS.shinyObd },
            { "nuget": "Shiny.Obd.Bluetooth", "version": VERSIONS.shinyObd },
            { "nuget": "Shiny.Obd.Wifi", "version": VERSIONS.shinyObd },
            { "nuget": "Shiny.Obd.Serial", "version": VERSIONS.shinyObd }
        ]
    },
    {
        "id": "jobs",
        "nuget": "Shiny.Jobs",
        "description": "Periodic Jobs",
        "category": "background",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "gps",
        "nuget": "Shiny.Gps",
        "blazorNuget": "Shiny.Gps",
        "description": "GPS",
        "category": "hardware",
        "foregroundService": true,
        "version": VERSIONS.shinyClient
    },
    {
        "id": "geofencing",
        "nuget": "Shiny.Geofencing",
        "description": "Geofencing",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        // Rides on Shiny.Gps - it owns the GPS listener, so it implies the gps platform setup (see IMPLIED_COMPONENTS)
        "id": "region-geofencing",
        "nuget": "Shiny.Geofencing.Regions",
        "description": "Region Geofencing (unlimited polygon, radius & geocoder regions)",
        "category": "hardware",
        "foregroundService": true,
        "version": VERSIONS.shinyClient
    },
    {
        // Region sets backed by a SQLite document store, plus the bundled US/Canada region data
        "id": "region-geofencing-docdb",
        "nuget": "Shiny.Geofencing.Regions.DocumentDb",
        "description": "Region Geofencing - DocumentDb & North American Regions",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "locations-ai",
        "nuget": "Shiny.Locations.Extensions.AI",
        "description": "Locations - AI Tools",
        "category": "hardware",
        "foregroundService": true,
        "version": VERSIONS.shinyClient
    },
    {
        "id": "httptransfers",
        "nuget": "Shiny.Net.Http",
        "description": "HTTP file uploads and downloads",
        "category": "background",
        "foregroundService": true,
        "version": VERSIONS.shinyClient
    },
    {
        "id": "discovery",
        "nuget": "Shiny.Net.Discovery",
        "linuxNuget": "Shiny.Net.Discovery",
        "macOsSupported": true,
        "description": "Network Discovery (mDNS/Bonjour)",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "wifi",
        "nuget": "Shiny.Net.Wifi",
        "linuxNuget": "Shiny.Net.Wifi.Linux",
        "macOsSupported": true,
        "description": "Wi-Fi (scan, connect, hotspot, airplane mode)",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        // Android promotes a media-projection foreground service for the duration of a capture.
        // The net10.0 build picks the Blazor recorder at runtime; Linux is its own package so its D-Bus
        // dependency stays out of WebAssembly apps.
        "id": "screenrecorder",
        "nuget": "Shiny.ScreenRecorder",
        "linuxNuget": "Shiny.ScreenRecorder.Linux",
        "macOsSupported": true,
        "foregroundService": true,
        "description": "Screen Recording",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        // iOS (WatchConnectivity) + Android (Wear OS Data Layer) only - nothing is registered elsewhere.
        "id": "wearables",
        "nuget": "Shiny.Wearables",
        "description": "Wearables (Apple Watch & Wear OS)",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        // Like ScreenRecorder, one package everywhere - net10.0 picks the browser or evdev backend.
        "id": "gamepad",
        "nuget": "Shiny.Gamepad",
        "macOsSupported": true,
        "description": "Gamepads",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        // Apple Game Center / Google Play Games v2. Windows & Linux get a local-only manager.
        "id": "gamecenter",
        "nuget": "Shiny.GameCenter",
        "macOsSupported": true,
        "description": "Game Center (achievements & leaderboards)",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        // OS print system - AirPrint, PrintManager, Windows, CUPS (macOS/Linux)
        "id": "printing",
        "nuget": "Shiny.Printing",
        "linuxNuget": "Shiny.Printing",
        "macOsSupported": true,
        "description": "Native Printing (PDF, image & HTML)",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "printers-ble",
        "nuget": "Shiny.Printers.BluetoothLE",
        "linuxNuget": "Shiny.Printers.BluetoothLE",
        "macOsSupported": true,
        "description": "Thermal Printers - Bluetooth LE (ESC/POS, TSPL)",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "printers-network",
        "nuget": "Shiny.Printers.Network",
        "linuxNuget": "Shiny.Printers.Network",
        "macOsSupported": true,
        "description": "Thermal Printers - Network (TCP 9100)",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "notifications",
        "nuget": "Shiny.Notifications",
        "linuxNuget": "Shiny.Notifications.Linux",
        "macOsSupported": true,
        "description": "Local Notifications",
        "category": "background",
        "androidIntent": "Shiny.ShinyNotificationIntents.NotificationClickAction",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "notifications-ai",
        "nuget": "Shiny.Notifications.Extensions.AI",
        "description": "Local Notifications - AI Tools",
        "category": "background",
        "androidIntent": "Shiny.ShinyNotificationIntents.NotificationClickAction",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "push",
        "nuget": "Shiny.Push",
        "macOsSupported": true,
        "description": "Push Notifications (Native)",
        "category": "background",
        "androidIntent": "Shiny.ShinyPushIntents.NotificationClickAction",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "pushfirebase",
        "nuget": "Shiny.Push.FirebaseMessaging",
        "description": "Push Notifications - Firebase (iOS)",
        "category": "background",
        "androidIntent": "Shiny.ShinyPushIntents.NotificationClickAction",
        "version": VERSIONS.shinyPushFirebase
    },
    {
        "id": "pushazure",
        "nuget": "Shiny.Push.AzureNotificationHubs",
        "description": "Push Notifications - Azure Notification Hubs",
        "category": "background",
        "androidIntent": "Shiny.ShinyPushIntents.NotificationClickAction",
        "version": VERSIONS.shinyClient
    },
    {
        // iOS/iPadOS 16.2+ via ActivityKit (widget extension built by ShinyLiveActivityWidget), Android 16 Live
        // Updates, ordinary ongoing notification on Android 8-15, no-op everywhere else.
        "id": "liveactivities",
        "nuget": "Shiny.Mobile.LiveActivities",
        "description": "Live Activities / Live Updates",
        "category": "background",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "appfunctions",
        "nuget": "Shiny.AppFunctions",
        "description": "App Functions (Siri & Gemini)",
        "category": "background",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "appfunctions-ai",
        "nuget": "Shiny.AppFunctions.Extensions.AI",
        "description": "App Functions - AI Tools",
        "category": "background",
        "additionalNugets": [{ "nuget": "Shiny.AppFunctions", "version": VERSIONS.shinyClient }],
        "version": VERSIONS.shinyClient
    },
    {
        "id": "music",
        "nuget": "Shiny.Music",
        "description": "Music Library",
        "category": "devicedata",
        "version": VERSIONS.shinyMusic
    },
    {
        "id": "music-ai",
        "nuget": "Shiny.Music.Extensions.AI",
        "description": "Music Library - AI Tools",
        "category": "devicedata",
        "version": VERSIONS.shinyMusic
    },
    {
        "id": "health",
        "nuget": "Shiny.Health",
        "description": "Health Data",
        "category": "devicedata",
        "version": VERSIONS.shinyHealth
    },
    {
        "id": "health-ai",
        "nuget": "Shiny.Health.Extensions.AI",
        "description": "Health Data - AI Tools",
        "category": "devicedata",
        "version": VERSIONS.shinyHealth
    },
    {
        "id": "config",
        "nuget": "Shiny.Extensions.Configuration",
        "description": "Configuration",
        "category": "mauiapp",
        "version": VERSIONS.shinyConfiguration
    },
    {
        // Build-time only - generates the Android manifest + iOS Info.plist entries from
        // <MauiPermission> items, which the Project File tab derives from the other selections.
        "id": "permissions",
        "nuget": "Shiny.Permissions.MSBuild",
        "description": "MSBuild Permissions",
        "category": "mauiapp",
        "version": VERSIONS.shinyPermissions
    },
    {
        "id": "shell",
        "nuget": "Shiny.Maui.Shell",
        "description": "MAUI Shell Navigation",
        "category": "mauiapp",
        "version": VERSIONS.shinyShell
    },
    {
        "id": "controls",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Shiny Controls",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        "id": "controls-desktop",
        "nuget": "Shiny.Maui.Controls.Desktop",
        "description": "Desktop Controls",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        "id": "controls-foldables",
        "nuget": "Shiny.Maui.Controls.Foldables",
        "description": "Foldables",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        "id": "tableview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "TableView",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "scheduler",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Scheduler",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "floatingpanel",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "FloatingPanel",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "fontpicker",
        "nuget": "Shiny.Maui.Controls",
        "description": "FontPicker",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "pillview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "PillView",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "imageviewer",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ImageViewer",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "imageeditor",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ImageEditor",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "chatview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ChatView",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "markdown",
        "nuget": "Shiny.Maui.Controls.Markdown",
        "blazorNuget": "Shiny.Blazor.Controls.Markdown",
        "description": "Markdown",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        "id": "mermaiddiagrams",
        "nuget": "Shiny.Maui.Controls.MermaidDiagrams",
        "blazorNuget": "Shiny.Blazor.Controls.MermaidDiagrams",
        "description": "Mermaid Diagrams",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        "id": "barcodes",
        "nuget": "Shiny.Maui.Controls.Barcodes",
        "blazorNuget": "Shiny.Blazor.Controls.Barcodes",
        "description": "Barcodes",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        // On-screen virtual gamepad. Registers Shiny.Gamepad's platform manager itself (and wraps it),
        // so it must NOT be combined with a bare AddGamepads() call.
        "id": "gamepad-controls",
        "nuget": "Shiny.Maui.Controls.Gamepad",
        "blazorNuget": "Shiny.Blazor.Controls.Gamepad",
        "description": "Virtual Gamepad",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        "id": "cameraview",
        "nuget": "Shiny.Maui.Controls.Camera",
        "blazorNuget": "Shiny.Blazor.Controls.Camera",
        "description": "CameraView",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        "id": "camera-motion",
        "nuget": "Shiny.Maui.Controls.Camera.Motion",
        "description": "CameraView Motion Analyzer",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "camera-barcode",
        "nuget": "Shiny.Maui.Controls.Camera.Barcode",
        "description": "CameraView Barcode Analyzer",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "camera-face",
        "nuget": "Shiny.Maui.Controls.Camera.Face",
        "description": "CameraView Face Analyzer",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "camera-documents",
        "nuget": "Shiny.Maui.Controls.Camera.Documents",
        "description": "CameraView Document Analyzers (invoice, receipt, licence, passport, cards)",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "camera-ai",
        "nuget": "Shiny.Maui.Controls.Camera.Ai",
        "blazorNuget": "Shiny.Blazor.Controls.Camera.Ai",
        "description": "CameraView AI Document Scanner & Photo Stylizer",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "camera-ocr",
        "nuget": "Shiny.Maui.Controls.Camera.Ocr",
        "description": "CameraView OCR Analyzer",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "trayicon",
        "nuget": "Shiny.Maui.Controls.Desktop",
        "description": "Tray Icon (Desktop)",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "docking",
        "nuget": "Shiny.Maui.Controls.Desktop",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Docking (Desktop)",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "osk",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "On-Screen Keyboard (Touch / Kiosk)",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "addressentry",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "AddressEntry",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "applayout",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "AppLayout",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "autocomplete",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "AutoCompleteEntry",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "badge",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "BadgeView",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "button",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ShinyButton",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "captcha",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Captcha",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "carousel",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Carousel",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "carousel-gallery",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "CarouselGallery",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "colorpicker",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ColorPicker",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "countrypicker",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "CountryPicker",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "datagrid",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "DataGrid",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "button-group",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ButtonGroup",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "chip-group",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ChipGroup",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "floatingtoolbar",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "FloatingToolbar",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "gantt",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Gantt",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "kanban",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Kanban",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "tag-entry",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "TagEntry",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "timeline",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Timeline",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "zoompanview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ZoomPanView",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "dialogs",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Dialogs",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "durationpicker",
        "nuget": "Shiny.Maui.Controls",
        "description": "DurationPicker",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "expander",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Expander & Accordion",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "fab",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Fab & FabMenu",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "feedback",
        "nuget": "Shiny.Maui.Controls",
        "description": "Feedback Service",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "file-drop",
        "nuget": "Shiny.Maui.Controls.Desktop",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "File Drop",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "flex-layout",
        "nuget": "Shiny.Maui.Controls",
        "description": "ShinyFlexLayout",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "yoga-layout",
        "nuget": "Shiny.Maui.Controls",
        "description": "YogaLayout",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "flyout",
        "nuget": "Shiny.Maui.Controls",
        "description": "Flyout",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "frostedglass",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "FrostedGlassView",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "layout",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Stacks & Grid",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "media-picker-button",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "MediaPickerButton",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "modal",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Modal",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "motion-icons",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Motion Icons",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "navigationpage",
        "nuget": "Shiny.Maui.Controls",
        "description": "NavigationPage",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "overlay",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Overlay & LoadingOverlay",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "parallax-collection-view",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ParallaxCollectionView",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "passwordstrength",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "PasswordStrength",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "progressbar",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ProgressBar",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "progressline",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ProgressLine",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "quick-entry",
        "nuget": "Shiny.Maui.Controls.Desktop",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Quick Entry",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "rangeslider",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "RangeSlider",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "ribbon",
        "nuget": "Shiny.Maui.Controls.Desktop",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Ribbon",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "securitypin",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "SecurityPin",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "sheetview",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "SheetView",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "shinyimage",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ShinyImage",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "signaturepad",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "SignaturePad",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "skeleton",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "SkeletonView",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "slider",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Slider",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "splashscreen",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Splash Screen",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "staggered-grid",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "StaggeredGrid",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "stateview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "StateView",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "tabbedpage",
        "nuget": "Shiny.Maui.Controls",
        "description": "TabbedPage",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "textentry",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "TextEntry",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "toast",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Toast",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "toolbar-tabbar",
        "nuget": "Shiny.Blazor.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Toolbar & TabBar",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "tooltip",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Tooltip",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "treeview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "TreeView",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "virtualized-grid",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "VirtualizedGrid",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "walkthrough",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Walkthrough",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "wizard",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Wizard",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "office",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Office Documents (Word, Excel, PowerPoint)",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        "id": "spreadsheet",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Spreadsheet (.xlsx viewer/editor)",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "document-viewer",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Document Viewer (.docx)",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "slide-viewer",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Slide Viewer (.pptx)",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "notebook",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Notebook (OneNote-style canvas)",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "document-editor",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Document Editor (.docx)",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "slide-editor",
        "nuget": "Shiny.Maui.Controls.Office",
        "blazorNuget": "Shiny.Blazor.Controls.Office",
        "description": "Slide Editor (.pptx)",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "mediaelement",
        "nuget": "Shiny.Maui.Controls.MediaElement",
        "blazorNuget": "Shiny.Blazor.Controls.MediaElement",
        "description": "MediaElement (audio & video playback)",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        "id": "speechaddins",
        "nuget": "Shiny.Maui.Controls.SpeechAddins",
        "blazorNuget": "Shiny.Blazor.Controls.SpeechAddins",
        "description": "Speech Add-ins (speech-to-text tools)",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        "id": "keyboard-shortcuts",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Keyboard Shortcuts",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "keyframe",
        "nuget": "Shiny.Maui.Controls.Keyframe",
        "description": "Keyframe Animation",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        "id": "keyframe-export",
        "nuget": "Shiny.Maui.Controls.Keyframe.Export",
        "description": "Keyframe Animation - Frame/GIF Export",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "diagram",
        "nuget": "Shiny.Maui.Controls.Diagram",
        "blazorNuget": "Shiny.Blazor.Controls.Diagram",
        "description": "Diagram (graph, org chart, flowchart)",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        "id": "floorplan",
        "nuget": "Shiny.Maui.Controls.FloorPlan",
        "blazorNuget": "Shiny.Blazor.Controls.FloorPlan",
        "description": "Floor Plan / Seating Chart",
        "category": "controls",
        "version": VERSIONS.shinyControls
    },
    {
        "id": "theme-aurora",
        "nuget": "Shiny.Maui.Controls.Themes.Aurora",
        "blazorNuget": "Shiny.Blazor.Controls.Themes.Aurora",
        "description": "Aurora Theme Pack",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "theme-material",
        "nuget": "Shiny.Maui.Controls.Themes.Material",
        "blazorNuget": "Shiny.Blazor.Controls.Themes.Material",
        "description": "Material Theme Pack",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "theme-ocean",
        "nuget": "Shiny.Maui.Controls.Themes.Ocean",
        "blazorNuget": "Shiny.Blazor.Controls.Themes.Ocean",
        "description": "Ocean Theme Pack",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "theme-terminal",
        "nuget": "Shiny.Maui.Controls.Themes.Terminal",
        "blazorNuget": "Shiny.Blazor.Controls.Themes.Terminal",
        "description": "Terminal Theme Pack",
        "category": "controls",
        "version": VERSIONS.shinyControls,
        "hideFromAppBuilder": true
    },
    {
        "id": "stores",
        "nuget": "Shiny.Extensions.Stores",
        "description": "Key/Value Stores",
        "category": "storage",
        "version": VERSIONS.shinyStores
    },
    {
        "id": "localization",
        "nuget": "Shiny.Extensions.Localization.Generator",
        "description": "Localization",
        "category": "foundation",
        "version": VERSIONS.shinyLocalization,
        "additionalNugets": [
            { "nuget": "Microsoft.Extensions.Localization", "version": VERSIONS.microsoftExtensions }
        ]
    },
    {
        "id": "documentdb",
        "nuget": "Shiny.DocumentDb.Sqlite",
        "description": "Document DB (SQLite)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-ai",
        "nuget": "Shiny.DocumentDb.Extensions.AI",
        "blazorNuget": "Shiny.DocumentDb.Extensions.AI",
        "aspnetNuget": "Shiny.DocumentDb.Extensions.AI",
        "description": "Document DB - AI Tools",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-sqlcipher",
        "nuget": "Shiny.DocumentDb.Sqlite.SqlCipher",
        "description": "Document DB (SqlCipher)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-sqlserver",
        "nuget": "Shiny.DocumentDb.SqlServer",
        "description": "Document DB (SQL Server)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-mysql",
        "nuget": "Shiny.DocumentDb.MySql",
        "description": "Document DB (MySQL)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-postgresql",
        "nuget": "Shiny.DocumentDb.PostgreSql",
        "description": "Document DB (PostgreSQL)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-cosmosdb",
        "nuget": "Shiny.DocumentDb.CosmosDb",
        "description": "Document DB (Cosmos DB)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-mongodb",
        "nuget": "Shiny.DocumentDb.MongoDb",
        "description": "Document DB (MongoDB)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-litedb",
        "nuget": "Shiny.DocumentDb.LiteDb",
        "description": "Document DB (LiteDB)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-duckdb",
        "nuget": "Shiny.DocumentDb.DuckDb",
        "description": "Document DB (DuckDB)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-oracle",
        "nuget": "Shiny.DocumentDb.Oracle",
        "description": "Document DB (Oracle)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-mariadb",
        "nuget": "Shiny.DocumentDb.MariaDb",
        "description": "Document DB (MariaDB)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-cockroachdb",
        "nuget": "Shiny.DocumentDb.CockroachDb",
        "description": "Document DB (CockroachDB)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-azuretable",
        "nuget": "Shiny.DocumentDb.AzureTable",
        "description": "Document DB (Azure Table Storage)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-dynamodb",
        "nuget": "Shiny.DocumentDb.DynamoDb",
        "description": "Document DB (Amazon DynamoDB)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-amazondocumentdb",
        "nuget": "Shiny.DocumentDb.DocumentDb",
        "description": "Document DB (Amazon DocumentDB)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-redis",
        "nuget": "Shiny.DocumentDb.Redis",
        "description": "Document DB (Redis Stack)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-ravendb",
        "nuget": "Shiny.DocumentDb.RavenDb",
        "description": "Document DB (RavenDB)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-firestore",
        "nuget": "Shiny.DocumentDb.Firestore",
        "description": "Document DB (Google Firestore)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-indexeddb",
        "nuget": "Shiny.DocumentDb.IndexedDb",
        "blazorNuget": "Shiny.DocumentDb.IndexedDb",
        "description": "Document DB (IndexedDB)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        // iOS & Android only - its own version line (4.x), not the DocumentDb 14.x train
        "id": "documentdb-firestore-mobile",
        "nuget": "Shiny.DocumentDb.Firestore.Mobile",
        "description": "Document DB - Firestore Mobile (on-device, offline-first)",
        "category": "storage",
        "version": VERSIONS.shinyFirestoreMobile
    },
    {
        "id": "documentdb-vectordata",
        "nuget": "Shiny.DocumentDb.Extensions.VectorData",
        "description": "Document DB - VectorData (MEAI VectorStore)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-sqlitevec",
        "nuget": "Shiny.DocumentDb.Sqlite.VectorSupport",
        "description": "Document DB - SQLite Vector Search (sqlite-vec)",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-jsonschema",
        "nuget": "Shiny.DocumentDb.JsonSchema",
        "description": "Document DB - JSON Schema Validation",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        // Makes the store the local cache that Shiny.Data.Sync keeps in step with an HTTP backend
        "id": "documentdb-appdatasync",
        "nuget": "Shiny.DocumentDb.AppDataSync",
        "description": "Document DB - Offline-First App Data Sync",
        "category": "storage",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-rest",
        "nuget": "Shiny.DocumentDb.AspNetCore",
        "description": "Document DB - REST & Live Query Endpoints",
        "category": "server",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-odata",
        "nuget": "Shiny.DocumentDb.AspNetCore.OData",
        "description": "Document DB - OData Endpoints",
        "category": "server",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "documentdb-mcp",
        "nuget": "Shiny.DocumentDb.Mcp",
        "description": "Document DB - MCP Server",
        "category": "server",
        "version": VERSIONS.shinyDocumentDb
    },
    {
        "id": "reflector",
        "nuget": "Shiny.Extensions.Reflector",
        "description": "Reflector",
        "category": "foundation",
        "version": VERSIONS.shinyReflector
    },
    {
        "id": "di",
        "nuget": "Shiny.Extensions.DependencyInjection",
        "description": "Dependency Injection",
        "category": "foundation",
        "version": VERSIONS.shinyDI
    },
    {
        // One package everywhere - the mode lists below are what gate where it shows up.
        "id": "serialization",
        "nuget": "Shiny.Extensions.Serialization",
        "macOsSupported": true,
        "description": "AOT-safe JSON Serialization",
        "category": "foundation",
        "version": VERSIONS.shinySerialization
    },
    {
        "id": "contactstore",
        "nuget": "Shiny.Contacts",
        "description": "Contact Store",
        "category": "devicedata",
        "macOsSupported": true,
        "version": VERSIONS.shinyContactStore
    },
    {
        "id": "contactstore-ai",
        "nuget": "Shiny.Contacts.Extensions.AI",
        "description": "Contact Store - AI Tools",
        "category": "devicedata",
        "macOsSupported": true,
        "version": VERSIONS.shinyContactStore
    },
    {
        "id": "calendarstore",
        "nuget": "Shiny.Calendar",
        "description": "Calendar Store",
        "category": "devicedata",
        "macOsSupported": true,
        "version": VERSIONS.shinyCalendar
    },
    {
        "id": "calendarstore-ai",
        "nuget": "Shiny.Calendar.Extensions.AI",
        "description": "Calendar Store - AI Tools",
        "category": "devicedata",
        "macOsSupported": true,
        "version": VERSIONS.shinyCalendar
    },
    {
        "id": "appstore",
        "nuget": "Shiny.AppStore",
        "linuxNuget": "Shiny.AppStore",
        "macOsSupported": true,
        "description": "App Store (version checks, store page & reviews)",
        "category": "devicedata",
        "version": VERSIONS.shinyClient
    },
    {
        // StoreKit 2 / Google Play Billing - iOS & Android only (no-op elsewhere)
        "id": "inapppurchases",
        "nuget": "Shiny.Mobile.InAppPurchases",
        "description": "In-App Purchases & Subscriptions",
        "category": "devicedata",
        "version": VERSIONS.shinyClient
    },
    {
        // iOS CallKit extension (built by the csproj properties) / Android CallScreeningService
        "id": "calldirectory",
        "nuget": "Shiny.Mobile.CallDirectory",
        "description": "Call Directory (caller ID & call blocking)",
        "category": "devicedata",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "vpn",
        "nuget": "Shiny.Net.Vpn",
        "description": "VPN (OS IKEv2 client)",
        "category": "hardware",
        "linuxNuget": "Shiny.Net.Vpn.Linux",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "agesignals",
        "nuget": "Shiny.AgeSignals",
        "description": "Age Signals",
        "category": "devicedata",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "biometrics",
        "nuget": "Shiny.Biometrics",
        "macOsSupported": true,
        "description": "Biometrics (Face ID, Touch ID, BiometricPrompt, Windows Hello)",
        "category": "devicedata",
        "version": VERSIONS.shinyClient
    },
    {
        // PC/SC readers on Windows / macOS / Linux, CoreNFC on iOS, reader mode on Android
        "id": "nfc",
        "nuget": "Shiny.Nfc",
        "macOsSupported": true,
        "description": "NFC (NDEF tags)",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        // classic Bluetooth (BR/EDR) - Android, Windows, macOS (AppKit) and Linux; no iOS / Mac Catalyst
        "id": "bluetooth",
        "nuget": "Shiny.Bluetooth",
        "macOsSupported": true,
        "linuxNuget": "Shiny.Bluetooth.Linux",
        "description": "Classic Bluetooth (RFCOMM / SPP)",
        "category": "hardware",
        "version": VERSIONS.shinyClient
    },
    {
        "id": "actors",
        "nuget": "Shiny.Actors",
        "description": "Actors",
        "category": "foundation",
        "version": VERSIONS.shinyActors
    },
    {
        "id": "aiconversation",
        "nuget": "Shiny.AiConversation",
        "description": "AI Conversations",
        "category": "intelligence",
        "version": VERSIONS.shinyAiConversation
    },
    {
        "id": "aiconversation-ui",
        "nuget": "Shiny.AiConversation.Maui",
        "description": "AI Conversation - MAUI Chat UI",
        "category": "intelligence",
        "version": VERSIONS.shinyAiConversation
    },
    {
        "id": "aiconversation-openai",
        "nuget": "Shiny.AiConversation.OpenAi",
        "description": "AI Conversation - OpenAI Chat Client",
        "category": "intelligence",
        "version": VERSIONS.shinyAiConversation
    },
    {
        "id": "aiconversation-copilot",
        "nuget": "Shiny.AiConversation.Maui.GithubCopilot",
        "description": "AI Conversation - GitHub Copilot Chat Client",
        "category": "intelligence",
        "version": VERSIONS.shinyAiConversation
    },
    {
        "id": "aiconversation-sqlitestore",
        "nuget": "Shiny.AiConversation.Stores.SqliteDocDb",
        "description": "AI Conversation - SQLite Session Store",
        "category": "intelligence",
        "version": VERSIONS.shinyAiConversation
    },
    {
        "id": "aiconversation-voice",
        "nuget": "Shiny.AiConversation.Voice",
        "description": "AI Conversation - Voice",
        "category": "intelligence",
        "version": VERSIONS.shinyAiConversation
    },
    {
        "id": "aiconversation-camera",
        "nuget": "Shiny.AiConversation.Maui.Camera",
        "description": "AI Conversation - MAUI Camera Tool",
        "category": "intelligence",
        "version": VERSIONS.shinyAiConversation
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
        "version": VERSIONS.shinySpeech
    },
    {
        "id": "speechazure",
        "nuget": "Shiny.Speech.Azure",
        "description": "Speech - Azure AI Speech",
        "category": "intelligence",
        "version": VERSIONS.shinySpeech
    },
    {
        "id": "speechelevenlabs",
        "nuget": "Shiny.Speech.ElevenLabs",
        "description": "Speech - ElevenLabs TTS",
        "category": "intelligence",
        "version": VERSIONS.shinySpeech
    },
    {
        "id": "speechtypecast",
        "nuget": "Shiny.Speech.Typecast",
        "description": "Speech - Typecast TTS",
        "category": "intelligence",
        "version": VERSIONS.shinySpeech
    },
    {
        "id": "speechopenai",
        "nuget": "Shiny.Speech.OpenAI",
        "description": "Speech - OpenAI",
        "category": "intelligence",
        "version": VERSIONS.shinySpeech
    },
    {
        // Adapts whichever ISpeechToText / ITextToSpeech is registered to Microsoft.Extensions.AI's
        // ISpeechToTextClient / ITextToSpeechClient.
        "id": "speechmicrosoftai",
        "nuget": "Shiny.Speech.MicrosoftAI",
        "description": "Speech - Microsoft.Extensions.AI Clients",
        "category": "intelligence",
        "version": VERSIONS.shinySpeech
    },
    {
        // Shiny.Speech brings the source + player only; AddAudioServices adds the recorder, monitor & device list
        "id": "audio",
        "nuget": "Shiny.Audio",
        "blazorNuget": "Shiny.Audio",
        "linuxNuget": "Shiny.Audio.Linux",
        "macOsSupported": true,
        "description": "Audio (capture, playback, recording & monitor)",
        "category": "intelligence",
        "version": VERSIONS.shinySpeech
    },
    {
        "id": "datasync",
        "nuget": "Shiny.Data.Sync",
        "description": "Data Sync",
        "category": "storage",
        "version": VERSIONS.shinyDataSync
    },
    {
        "id": "webhost",
        "nuget": "Shiny.AspNet.WebHosting",
        "description": "Web Hosting",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-webdav",
        "nuget": "Shiny.AspNet.WebDav",
        "description": "WebDAV Server",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-caldav",
        "nuget": "Shiny.AspNet.CalDav",
        "description": "CalDAV & CardDAV Server",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-tus",
        "nuget": "Shiny.AspNet.Tus",
        "description": "Resumable Uploads (tus)",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-filesync",
        "nuget": "Shiny.AspNet.FileSync",
        "description": "File Sync",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-nuget",
        "nuget": "Shiny.AspNet.NuGet",
        "description": "Private NuGet Feed",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-npm",
        "nuget": "Shiny.AspNet.Npm",
        "description": "Private npm Registry",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-documentdb",
        "nuget": "Shiny.AspNet.DocumentDb",
        "description": "DocumentDb REST + SSE Endpoints",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-jsonpatch",
        "nuget": "Shiny.AspNet.JsonPatch",
        "description": "JSON Patch",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-webhooks",
        "nuget": "Shiny.AspNet.Webhooks",
        "description": "Webhook Verification & Signing",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-idempotency",
        "nuget": "Shiny.AspNet.Idempotency",
        "description": "Idempotency Keys",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-contentdigest",
        "nuget": "Shiny.AspNet.ContentDigest",
        "description": "Content Digest",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-acme",
        "nuget": "Shiny.AspNet.Acme",
        "description": "Automatic TLS (ACME)",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-discovery",
        "nuget": "Shiny.AspNet.Discovery",
        "description": "mDNS Discovery",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-ssh",
        "nuget": "Shiny.AspNet.Ssh",
        "description": "SSH & Quick Tunnels",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        "id": "aspnet-tunnels",
        "nuget": "Shiny.AspNet.Tunnels",
        "description": "Cloudflare, ngrok & Tailscale Tunnels",
        "category": "server",
        "version": VERSIONS.shinyAspNet
    },
    {
        // The SERVER side that sends push - not Shiny.Push, which is the on-device client.
        // APNs, FCM, Web Push & WNS all ship in the core package.
        "id": "extensions-push",
        "nuget": "Shiny.Extensions.Push",
        "aspnetNuget": "Shiny.Extensions.Push",
        "description": "Push (Server dispatch - APNs, FCM, Web Push, WNS)",
        "category": "server",
        "version": VERSIONS.shinyExtensionsPush,
        "additionalNugets": [
            { "nuget": "Shiny.Extensions.Push.DocumentDb", "version": VERSIONS.shinyExtensionsPush }
        ]
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
        "version": VERSIONS.shinyHttpServer
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
        "version": VERSIONS.shinyAppDeviceBridge
    }
];
