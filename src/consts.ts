
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
    androidIntent?: string;
    foregroundService?: boolean;
    additionalNugets?: { nuget: string; version: string }[];
}

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
        "description": "Mediator",
        "version" : "6.2.1"
    },
    {
        "id": "ble",
        "nuget": "Shiny.BluetoothLE",
        "description": "Bluetooth LE",
        "version": DEFAULT_VERSION
    },
    {
        "id": "blehosting",
        "nuget": "Shiny.BluetoothLE.Hosting",
        "description": "Bluetooth LE Hosting",
        "version": DEFAULT_VERSION
    },
    {
        "id": "jobs",
        "nuget": "Shiny.Jobs",
        "description": "Periodic Jobs",
        "version": DEFAULT_VERSION
    },
    {
        "id": "gps",
        "nuget": "Shiny.Locations",        
        "description": "GPS",
        "foregroundService": true,
        "version": DEFAULT_VERSION
    },
    {
        "id": "geofencing",
        "nuget": "Shiny.Locations",
        "description": "Geofencing",
        "version": DEFAULT_VERSION
    },
    {
        "id": "httptransfers",
        "nuget": "Shiny.Net.Http",
        "description": "HTTP file uploads and downloads",
        "foregroundService": true,
        "version": DEFAULT_VERSION
    },
    {
        "id": "notifications",
        "nuget": "Shiny.Notifications",
        "description": "Local Notifications",
        "androidIntent": "Shiny.ShinyNotificationIntents.NotificationClickAction",
        "version": DEFAULT_VERSION
    },
    {
        "id": "push",
        "nuget": "Shiny.Push",
        "description": "Push Notifications (Native)",
        "androidIntent": "Shiny.ShinyPushIntents.NotificationClickAction",
        "version": DEFAULT_VERSION
    },
    {
        "id": "config",
        "nuget": "Shiny.Extensions.Configuration",
        "description": "Configuration",
        "version": DEFAULT_VERSION
    },
    {
        "id": "shell",
        "nuget": "Shiny.Maui.Shell",
        "description": "MAUI Shell Navigation",
        "version": "3.1.1"
    },
    {
        "id": "tableview",
        "nuget": "Shiny.Maui.TableView",
        "description": "MAUI TableView",
        "version": "1.0.2"
    },
    {
        "id": "stores",
        "nuget": "Shiny.Extensions.Stores",
        "description": "Key/Value Stores",
        "version": "2.0.3"
    },
    {
        "id": "localization",
        "nuget": "Shiny.Extensions.Localization.Generator",
        "description": "Localization",
        "version": "2.0.1",
        "additionalNugets": [
            { "nuget": "Microsoft.Extensions.Localization", "version": "10.0.0" }
        ]
    },
    {
        "id": "documentdb",
        "nuget": "Shiny.DocumentDb.Sqlite",
        "description": "Document DB (SQLite)",
        "version": "3.2",
        "additionalNugets": [
            { "nuget": "Shiny.DocumentDb.Extensions.DependencyInjection", "version": "3.2" }
        ]
    },
    {
        "id": "reflector",
        "nuget": "Shiny.Reflector",
        "description": "Reflector",
        "version": "1.7.1"
    },
    {
        "id": "di",
        "nuget": "Shiny.Extensions.DependencyInjection",
        "description": "Dependency Injection",
        "version": "2.0.3"
    },
    {
        "id": "mauihost",
        "nuget": "Shiny.Extensions.MauiHosting",
        "description": "MAUI Hosting",
        "version": "2.0.3"
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
        const windowsIds = ['ble', 'blehosting', 'gps', 'geofencing', 'httptransfers'];
        return compos.some(x => windowsIds.includes(x.id));
    },

    usesHosting(compos: ShinyComponent[]): boolean {
        const hostingIds = ['ble', 'blehosting', 'jobs', 'gps', 'geofencing', 'httptransfers', 'notifications', 'push'];
        return compos.some(x => hostingIds.includes(x.id));
    }
};