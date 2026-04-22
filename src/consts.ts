
export const GITHUB_EDIT_URL = `https://github.com/shinyorg/documentation/tree/main/`;
export const COMMUNITY_INVITE_URL = `https://github.com/shinyorg/shiny/discussions/`;
export const SPONSOR_URL = 'https://sponsor.shinylib.net';
export const GITHUB_URL = 'https://github.com/shinyorg';
export const DEFAULT_VERSION: string = "4.0.1";

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
}

export type ShinyCategoryId =
    | 'core'
    | 'essentials'
    | 'devices'
    | 'controls'
    | 'storage';

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

/** Ordered so the grid naturally forms balanced rows (12-col).
 *  Row 1: core (12)
 *  Row 2: essentials (8) + storage (4)
 *  Row 3: devices (12)
 *  Row 4: controls (12)
 */
export const ShinyCategories: ShinyCategory[] = [
    { id: 'core',          title: 'Core & Infrastructure',       span: 12, color: '#9A81EA', tint: '#F1EDFC', tintDark: '#2A2547' },
    { id: 'essentials',    title: 'Mobile Essentials',            span: 8,  color: '#F43F5E', tint: '#FFE7EC', tintDark: '#421824' },
    { id: 'storage',       title: 'Data & Storage',              span: 4,  color: '#F59E0B', tint: '#FEF3C7', tintDark: '#3E2E0F' },
    { id: 'devices',       title: 'Device & Sensors',            span: 12, color: '#22C55E', tint: '#DEFCE9', tintDark: '#10381F' },
    { id: 'controls',      title: 'UI Controls',                 span: 12, color: '#0EA5E9', tint: '#E0F2FE', tintDark: '#0B3A52' },
];

export const BLAZOR_COMPATIBLE_IDS = ['mediator', 'stores', 'localization', 'documentdb', 'reflector', 'di', 'gps', 'ble', 'jobs', 'push', 'tableview', 'scheduler', 'sheetview', 'pillview', 'imageviewer', 'imageeditor', 'chatview', 'markdown', 'mermaiddiagrams'];
export const LINUX_COMPATIBLE_IDS = ['ble', 'blehosting', 'notifications', 'mediator', 'stores', 'localization', 'documentdb', 'reflector', 'di'];
export const ASPNET_COMPATIBLE_IDS = ['mediator', 'stores', 'localization', 'documentdb', 'documentdb-sqlserver', 'documentdb-mysql', 'documentdb-postgresql', 'reflector', 'di', 'webhost'];
export const ASPNET_ONLY_IDS = ['documentdb-sqlserver', 'documentdb-mysql', 'documentdb-postgresql', 'webhost'];

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
        "category": "core",
        "version" : "6.2.1"
    },
    {
        "id": "ble",
        "nuget": "Shiny.BluetoothLE",
        "blazorNuget": "Shiny.BluetoothLE.Blazor",
        "linuxNuget": "Shiny.BluetoothLE.Linux",
        "macOsSupported": true,
        "description": "Bluetooth LE",
        "category": "devices",
        "version": DEFAULT_VERSION
    },
    {
        "id": "blehosting",
        "nuget": "Shiny.BluetoothLE.Hosting",
        "linuxNuget": "Shiny.BluetoothLE.Hosting.Linux",
        "macOsSupported": true,
        "description": "Bluetooth LE Hosting",
        "category": "devices",
        "version": DEFAULT_VERSION
    },
    {
        "id": "obd",
        "nuget": "Shiny.Obd.Ble",
        "description": "OBD Bluetooth LE",
        "category": "devices",
        "version": "1.0.0",
        "additionalNugets": [
            { "nuget": "Shiny.Obd", "version": "1.0.0" }
        ]
    },
    {
        "id": "jobs",
        "nuget": "Shiny.Jobs",
        "description": "Periodic Jobs",
        "category": "essentials",
        "version": DEFAULT_VERSION
    },
    {
        "id": "gps",
        "nuget": "Shiny.Locations",
        "blazorNuget": "Shiny.Locations.Blazor",
        "description": "GPS",
        "category": "devices",
        "foregroundService": true,
        "version": DEFAULT_VERSION
    },
    {
        "id": "geofencing",
        "nuget": "Shiny.Locations",
        "description": "Geofencing",
        "category": "devices",
        "version": DEFAULT_VERSION
    },
    {
        "id": "httptransfers",
        "nuget": "Shiny.Net.Http",
        "description": "HTTP file uploads and downloads",
        "category": "essentials",
        "foregroundService": true,
        "version": DEFAULT_VERSION
    },
    {
        "id": "notifications",
        "nuget": "Shiny.Notifications",
        "linuxNuget": "Shiny.Notifications.Linux",
        "macOsSupported": true,
        "description": "Local Notifications",
        "category": "essentials",
        "androidIntent": "Shiny.ShinyNotificationIntents.NotificationClickAction",
        "version": DEFAULT_VERSION
    },
    {
        "id": "push",
        "nuget": "Shiny.Push",
        "blazorNuget": "Shiny.Push.Blazor",
        "macOsSupported": true,
        "description": "Push Notifications (Native)",
        "category": "essentials",
        "androidIntent": "Shiny.ShinyPushIntents.NotificationClickAction",
        "version": DEFAULT_VERSION
    },
    {
        "id": "pushfirebase",
        "nuget": "Shiny.Push.FirebaseMessaging",
        "description": "Push Notifications - Firebase (iOS)",
        "category": "essentials",
        "androidIntent": "Shiny.ShinyPushIntents.NotificationClickAction",
        "version": DEFAULT_VERSION
    },
    {
        "id": "pushazure",
        "nuget": "Shiny.Push.AzureNotificationHubs",
        "description": "Push Notifications - Azure Notification Hubs",
        "category": "essentials",
        "androidIntent": "Shiny.ShinyPushIntents.NotificationClickAction",
        "version": DEFAULT_VERSION
    },
    {
        "id": "music",
        "nuget": "Shiny.Music",
        "description": "Music Library",
        "category": "devices",
        "version": "1.3.1"
    },
    {
        "id": "health",
        "nuget": "Shiny.Health",
        "description": "Health Data",
        "category": "devices",
        "version": "1.0.0"
    },
    {
        "id": "config",
        "nuget": "Shiny.Extensions.Configuration",
        "description": "Configuration",
        "category": "core",
        "version": DEFAULT_VERSION
    },
    {
        "id": "shell",
        "nuget": "Shiny.Maui.Shell",
        "description": "MAUI Shell Navigation",
        "category": "essentials",
        "version": "5.0.0"
    },
    {
        "id": "tableview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "TableView",
        "category": "controls",
        "version": "1.0.0"
    },
    {
        "id": "scheduler",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "Scheduler",
        "category": "controls",
        "version": "1.0.0"
    },
    {
        "id": "sheetview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "SheetView",
        "category": "controls",
        "version": "1.0.0"
    },
    {
        "id": "pillview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "PillView",
        "category": "controls",
        "version": "1.0.0"
    },
    {
        "id": "imageviewer",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ImageViewer",
        "category": "controls",
        "version": "1.0.0"
    },
    {
        "id": "imageeditor",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ImageEditor",
        "category": "controls",
        "version": "1.0.0"
    },
    {
        "id": "chatview",
        "nuget": "Shiny.Maui.Controls",
        "blazorNuget": "Shiny.Blazor.Controls",
        "description": "ChatView",
        "category": "controls",
        "version": "1.0.0"
    },
    {
        "id": "markdown",
        "nuget": "Shiny.Maui.Controls.Markdown",
        "blazorNuget": "Shiny.Blazor.Controls.Markdown",
        "description": "Markdown",
        "category": "controls",
        "version": "1.0.0"
    },
    {
        "id": "mermaiddiagrams",
        "nuget": "Shiny.Maui.Controls.MermaidDiagrams",
        "blazorNuget": "Shiny.Blazor.Controls.MermaidDiagrams",
        "description": "Mermaid Diagrams",
        "category": "controls",
        "version": "1.0.0"
    },
    {
        "id": "stores",
        "nuget": "Shiny.Extensions.Stores",
        "description": "Key/Value Stores",
        "category": "core",
        "version": "2.0.4"
    },
    {
        "id": "localization",
        "nuget": "Shiny.Extensions.Localization.Generator",
        "description": "Localization",
        "category": "core",
        "version": "2.0.1",
        "additionalNugets": [
            { "nuget": "Microsoft.Extensions.Localization", "version": "10.0.5" }
        ]
    },
    {
        "id": "documentdb",
        "nuget": "Shiny.DocumentDb.Sqlite",
        "description": "Document DB (SQLite)",
        "category": "storage",
        "version": "3.2.0",
        "additionalNugets": [
            { "nuget": "Shiny.DocumentDb.Extensions.DependencyInjection", "version": "3.2.0" }
        ]
    },
    {
        "id": "documentdb-sqlcipher",
        "nuget": "Shiny.DocumentDb.Sqlite.SqlCipher",
        "description": "Document DB (SqlCipher)",
        "category": "storage",
        "version": "3.2.0",
        "additionalNugets": [
            { "nuget": "Shiny.DocumentDb.Extensions.DependencyInjection", "version": "3.2.0" }
        ]
    },
    {
        "id": "documentdb-sqlserver",
        "nuget": "Shiny.DocumentDb.SqlServer",
        "description": "Document DB (SQL Server)",
        "category": "storage",
        "version": "3.2.0",
        "additionalNugets": [
            { "nuget": "Shiny.DocumentDb.Extensions.DependencyInjection", "version": "3.2.0" }
        ]
    },
    {
        "id": "documentdb-mysql",
        "nuget": "Shiny.DocumentDb.MySql",
        "description": "Document DB (MySQL)",
        "category": "storage",
        "version": "3.2.0",
        "additionalNugets": [
            { "nuget": "Shiny.DocumentDb.Extensions.DependencyInjection", "version": "3.2.0" }
        ]
    },
    {
        "id": "documentdb-postgresql",
        "nuget": "Shiny.DocumentDb.PostgreSql",
        "description": "Document DB (PostgreSQL)",
        "category": "storage",
        "version": "3.2.0",
        "additionalNugets": [
            { "nuget": "Shiny.DocumentDb.Extensions.DependencyInjection", "version": "3.2.0" }
        ]
    },
    {
        "id": "reflector",
        "nuget": "Shiny.Reflector",
        "description": "Reflector",
        "category": "core",
        "version": "1.7.2"
    },
    {
        "id": "di",
        "nuget": "Shiny.Extensions.DependencyInjection",
        "description": "Dependency Injection",
        "category": "core",
        "version": "2.0.4"
    },
    {
        "id": "spatial",
        "nuget": "Shiny.Spatial",
        "description": "Spatial Database",
        "category": "storage",
        "version": "1.1.0"
    },
    {
        "id": "spatial-geofencing",
        "nuget": "Shiny.Spatial.Geofencing",
        "description": "Spatial Geofencing",
        "category": "devices",
        "foregroundService": true,
        "version": "1.1.0"
    },
    {
        "id": "contactstore",
        "nuget": "Shiny.Maui.ContactStore",
        "description": "Contact Store",
        "category": "devices",
        "version": "1.0.1"
    },
    {
        "id": "mauihost",
        "nuget": "Shiny.Extensions.MauiHosting",
        "description": "MAUI Hosting",
        "category": "core",
        "version": "2.0.4"
    },
    {
        "id": "webhost",
        "nuget": "Shiny.Extensions.WebHosting",
        "description": "Web Hosting",
        "category": "core",
        "version": "2.0.4"
    }
];

export const Data = {    
    hasComponent(id: string, comps: ShinyComponent[]): boolean {
        return comps.find(c => c.id === id) !== undefined;
    },

    usesPush(compos: ShinyComponent[]): boolean {
        return compos.filter(x => x.id.indexOf('push') > -1).length > 0;
    },

    usingForeground(compos: ShinyComponent[]): boolean {
        return compos.filter(x => x.foregroundService === true).length > 0;
    },

    usesActivity(compos: ShinyComponent[]): boolean {
        return compos.filter(x => x.androidIntent !== undefined).length > 0;
    },

    usesWindows(compos: ShinyComponent[]): boolean {
        const windowsIds = ['ble', 'blehosting', 'obd', 'gps', 'geofencing', 'httptransfers', 'notifications', 'push'];
        return compos.some(x => windowsIds.includes(x.id));
    },

    usesHosting(compos: ShinyComponent[]): boolean {
        const hostingIds = ['ble', 'blehosting', 'obd', 'jobs', 'gps', 'geofencing', 'spatial-geofencing', 'httptransfers', 'notifications', 'push'];
        return compos.some(x => hostingIds.includes(x.id));
    },

    supportsLinux(id: string): boolean {
        return LINUX_COMPATIBLE_IDS.includes(id);
    },

    supportsMacOs(c: ShinyComponent): boolean {
        return c.macOsSupported === true;
    },

    hasPlatformConfig(compos: ShinyComponent[]): boolean {
        const ids = ['ble', 'blehosting', 'obd', 'jobs', 'gps', 'geofencing', 'spatial-geofencing', 'httptransfers', 'notifications', 'push', 'contactstore', 'health'];
        return compos.some(x => ids.includes(x.id));
    }
};