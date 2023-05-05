export const SITE = {
	title: 'Shiny .NET',
	description: 'Making all of your .NET Mobile Apps Shiny'
	// defaultLanguage: 'en-us',
} as const;

export const OPEN_GRAPH = {
	image: {
		src: 'https://github.com/shinyorg/shiny/blob/master/art/logo.svg',
		alt: 'Shiny Logo'
	},
	twitter: 'shinydotnet',
};

export const SECTIONS = {
    Client: 'client',
    Server: 'server',
    Releases: 'releases'
} as const;

export const GITHUB_EDIT_URL = `https://github.com/shinyorg/documentation/tree/main/`;
export const COMMUNITY_INVITE_URL = `https://github.com/shinyorg/shiny/discussions/`;
export const SPONSOR_URL = 'https://sponsor.shinylib.net';
export const GITHUB_URL = 'https://github.com/shinyorg';

export type Sidebar = Record<
	// (typeof SECTIONS)[number],
    string,
	Record<string, { text: string; link: string }[]>
>;

export const SIDEBAR: Sidebar = {
	client: {
		'Getting Started': [
			{ text: 'Introduction', link: 'client/index' },
            { text: 'App Builder', link: 'client/appbuilder' },
			{ text: 'Architecture', link: 'client/architecture' },
		],
        'Beacons':[
            { text: 'Ranging', link: 'client/beacons/ranging' },
            { text: 'Monitoring', link: 'client/beacons/monitoring' },
        ],
        'BluetoothLE':[
            { text: 'Getting Started', link: 'client/ble/' },
            { text: 'Background Operations', link: 'client/ble/background' },
            { text: 'Scanning', link: 'client/ble/scanning' },
            { text: 'Peripheral', link: 'client/ble/peripheral' },
            { text: 'GATT', link: 'client/ble/gatt' },
            { text: 'Best Practices', link: 'client/ble/best-practices' },
            { text: 'FAQ', link: 'client/ble/faq' }
        ],
        'BluetoothLE Hosting':[
            { text: 'Getting Started', link: 'client/blehosting/' },
            { text: 'Advertising', link: 'client/blehosting/advertising' },
            { text: 'GATT Service', link: 'client/blehosting/gatt' }
        ],
        'HTTP Transfers':[
            { text: 'How To', link: 'client/httptransfers/' },
        ], 
        'Jobs':[
            { text: 'Getting Started', link: 'client/jobs/' },
            { text: 'Create a Job', link: 'client/jobs/create' },
            { text: 'Additional Functions', link: 'client/jobs/functions' },
            { text: 'FAQ', link: 'client/jobs/faq' }
        ], 
        'Locations':[
            { text: 'GPS', link: 'client/locations/gps' },
            { text: 'Geofencing', link: 'client/locations/geofencing' }
        ],
        'Local Notifications':[
            { text: 'Getting Started', link: 'client/notifications/' },
            { text: 'Channels', link: 'client/notifications/channels' },
            { text: 'Platform Specifics', link: 'client/notifications/platformspecifics' }
        ],
        'Push Notifications':[
            { text: 'Getting Started', link: 'client/push/' },
            { text: 'FAQ', link: 'client/push/faq' }
        ],
        'Other': [
            { text: 'Configuration Extensions', link: 'client/other/configuration' },
            { text: 'AppCenter Logging', link: 'client/other/appcenter' },
            { text: 'Speech Recognition', link: 'client/other/speechrecognition' },
            { text: 'Stateful Services', link: 'client/other/statefulservices' },
            { text: 'Startup Services', link: 'client/other/startupservices' },
            { text: 'Lifecycle Hooks', link: 'client/other/lifecyclehooks' }
        ]
	},

	server: {
		'Server Side': [
			{ text: 'Introduction', link: 'server/index' },
			{ text: 'Email', link: 'server/email' },
			{ text: 'Localization', link: 'server/localization' },
            { text: 'Push Management', link: 'server/push' },
		]
	},

	releases: { 
		'Client': [
			{ text: '3.0.0', link: 'releases/client/30' }
        ],
        'Server':[
            { text: '2.0.0', link: 'releases/server/20' }
        ]
	},
};

export type ShinyComponent = {
    id: string;
    nuget: string;
    description: string;
    version: string;
    foregroundService?: boolean;
}


export const DEFAULT_VERSION: string = "3.0.0-beta-0026";

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