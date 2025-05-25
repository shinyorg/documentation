
export const GITHUB_EDIT_URL = `https://github.com/shinyorg/documentation/tree/main/`;
export const COMMUNITY_INVITE_URL = `https://github.com/shinyorg/shiny/discussions/`;
export const SPONSOR_URL = 'https://sponsor.shinylib.net';
export const GITHUB_URL = 'https://github.com/shinyorg';
export const DEFAULT_VERSION: string = "3.3.4";

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
    {
        id: "beaconranging",
        nuget: "Shiny.Beacons",
        description: "Beacon Ranging (Foreground)",
        service: "Shiny.Beacons.IBeaconRangingManager",
        builderCommand: "builder.Services.AddBeaconRanging();",
        version: DEFAULT_VERSION,
        android: {
            permissions: [
                "android.permission.ACCESS_FINE_LOCATION"
            ]
        },
        apple: {

        }
    }
];

// TODO: ranging/monitoring on beacons
export const ShinyComponents: ShinyComponent[] = [
    {
        "id": "mediator",
        "nuget": "Shiny.Mediator.Maui",
        "description": "Mediator",
        "version" : "2.1.1"
    },
    {
        "id": "beacons",
        "nuget": "Shiny.Beacons",
        "description": "Beacons",
        "foregroundService": true,
        "version": DEFAULT_VERSION
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
        "id": "sqlite",
        "nuget": "Shiny.Logging.SQLite",
        "description": "SQLite Logging",
        "version": DEFAULT_VERSION
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
    }
};