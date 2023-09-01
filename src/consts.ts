
export const GITHUB_EDIT_URL = `https://github.com/shinyorg/documentation/tree/main/`;
export const COMMUNITY_INVITE_URL = `https://github.com/shinyorg/shiny/discussions/`;
export const SPONSOR_URL = 'https://sponsor.shinylib.net';
export const GITHUB_URL = 'https://github.com/shinyorg';
// description: 'Making all of your .NET Mobile Apps Shiny'

export type ShinyComponent = {
    id: string;
    nuget: string;
    description: string;
    version: string;
    foregroundService?: boolean;
}


export const DEFAULT_VERSION: string = "3.0.0-beta-0305";



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
        "version": DEFAULT_VERSION
    },
    {
        "id": "speech",
        "nuget": "Shiny.SpeechRecognition",
        "description": "Speech Recognition",
        "version": DEFAULT_VERSION
    },
    {
        "id": "push",
        "nuget": "Shiny.Push",
        "description": "Push Notifications (Native)",
        "version": DEFAULT_VERSION
    },
    {
        "id": "config",
        "nuget": "Shiny.Extensions.Configuration",
        "description": "Configuration",
        "version": DEFAULT_VERSION
    },
    {
        "id": "appcenter",
        "nuget": "Shiny.Logging.AppCenter",
        "description": "AppCenter Logging",
        "version": DEFAULT_VERSION
    },
    {
        "id": "sqlite",
        "nuget": "Shiny.Logging.SQLite",
        "description": "SQLite Logging",
        "version": DEFAULT_VERSION
    }    
    // {
    //     "id": "framework",
    //     "nuget": "Shiny.Framework",
    //     "description": "Shiny Framework (Brings Together Prism, ReactiveUI, & Shiny)",
    //     "version": "3.0.0-alpha-0065"
    // }
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
    }
};