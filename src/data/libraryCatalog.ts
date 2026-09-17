/**
 * What each Shiny library does, in words a visitor can scan.
 *
 * Structure (which category a library sits in, its order, its link and its sub-pages) comes from
 * `src/sidebar-topics.mjs` — this file only carries the descriptive copy. `getCatalog()` joins the two
 * and throws when a library in the sidebar has no entry here, so a new library can't silently go
 * missing from the homepage explorer and the category pages.
 *
 * Accent colours mirror the finder palette in `HomepageNav.astro` (same topic → same hue).
 */
import { sidebarTopics } from '../sidebar-topics.mjs';

export type Framework = 'dotnet' | 'maui' | 'blazor' | 'aspnet';
export type OperatingSystem = 'android' | 'ios' | 'tvos' | 'windows' | 'linux' | 'macos' | 'web';

export interface LibraryCopy {
    /** Must match the library's `label` in sidebar-topics.mjs */
    label: string;
    /** One line, shown on the homepage explorer */
    tagline: string;
    /** Two or three sentences, shown on the category page */
    summary: string;
    highlights: string[];
    packages: string[];
    frameworks?: Framework[];
    os?: OperatingSystem[];
}

export interface CategoryCopy {
    slug: string;
    /** Must match the topic `id` in sidebar-topics.mjs */
    topicId: string;
    accent: string;
    accentDark: string;
    headline: string;
    intro: string;
    /** Category landing page; defaults to /libraries/<slug>/ */
    page?: string;
    /** Sidebar entries that belong to the category but aren't `jumpTo` libraries */
    includeLabels?: string[];
    /** Guides that aren't libraries (shown as "Start here" links) */
    resources?: LibraryLink[];
    /** Hand-picked highlights for a category whose items are too many to list (UI Controls) */
    featured?: LibraryLink[];
    libraries: LibraryCopy[];
}

export const categories: CategoryCopy[] = [
    {
        slug: 'foundation',
        topicId: 'foundation',
        accent: '#6A3DF0',
        accentDark: '#A98CFF',
        headline: 'The building blocks under every Shiny app — hosting, messaging, DI and source generators that keep you AOT-clean.',
        intro: 'Start here. These libraries have no platform code of their own; they are the patterns the rest of Shiny is built on, and most of them are just as useful in a console app or an ASP.NET service as in a phone app.',
        resources: [
            { label: 'App Builder', href: '/foundation/appbuilder/' },
            { label: 'Architecture', href: '/foundation/architecture/' },
            { label: 'Hosting Models', href: '/foundation/hosting/' },
            { label: 'AI Skills', href: '/foundation/ai-skills/' },
            { label: 'Apps built with Shiny', href: '/foundation/apps/' },
        ],
        libraries: [
            {
                label: 'Core',
                tagline: 'The host, lifecycle hooks and device monitoring every Shiny module builds on',
                summary: '`Shiny.Core` is the package every other Shiny module sits on — you rarely reference it on purpose because Jobs, Locations, BluetoothLE and Push pull it in. It still gives your own code a lot: platform abstractions, lifecycle hooks, startup tasks and device monitoring.',
                highlights: [
                    'Boots a Shiny host with or without .NET MAUI',
                    'Platform abstractions and lifecycle hooks',
                    'Startup tasks and device monitoring',
                    "Shiny's `AccessState` permission model and Android foreground service helpers",
                ],
                packages: ['Shiny.Core'],
                frameworks: ['dotnet', 'maui', 'blazor'],
                os: ['android', 'ios', 'tvos', 'macos', 'windows', 'linux', 'web'],
            },
            {
                label: 'Mediator',
                tagline: 'A source-generated mediator with middleware for offline, caching, validation and resiliency',
                summary: 'A mediator pattern implementation built for every kind of .NET app — mobile, desktop and server. Source-generated and AOT-ready, with middleware you switch on with a single attribute.',
                highlights: [
                    'Offline support, caching, validation and resiliency middleware — one attribute each',
                    'HTTP request handlers generated from contracts',
                    'Expose contracts as AI-callable tools',
                    'Works with MAUI, Blazor, Uno Platform, ASP.NET Core, Prism and Dapper',
                ],
                packages: ['Shiny.Mediator', 'Shiny.Mediator.Maui', 'Shiny.Mediator.Blazor', 'Shiny.Mediator.AspNet'],
                frameworks: ['dotnet', 'maui', 'blazor', 'aspnet'],
                os: ['android', 'ios', 'windows'],
            },
            {
                label: 'Dependency Injection',
                tagline: 'Attribute-driven service registration, generated at compile time',
                summary: 'Stop wiring up every service by hand. Tag a class with an attribute and a source generator writes the registration — no reflection, no startup scan, fully AOT-compatible.',
                highlights: [
                    'Add an attribute, and the service is registered',
                    'Categories and configuration-driven registration',
                    'Generate reflection-free AI tools from service interfaces',
                    'Every registration generated into one readable file',
                ],
                packages: ['Shiny.Extensions.DependencyInjection'],
                frameworks: ['dotnet'],
            },
            {
                label: 'Reflector',
                tagline: 'Reflection-style property access without runtime reflection',
                summary: 'Reflection is powerful but slow, and it breaks AOT. Reflector uses source generators to give you the same dynamic property access at compile time — mark a class `partial`, add an attribute, done.',
                highlights: [
                    'Enumerate, read and write properties with zero reflection',
                    'Records supported',
                    'JSON serialization and assembly-info helpers',
                    'Trimming and Native AOT safe',
                ],
                packages: ['Shiny.Extensions.Reflector'],
                frameworks: ['dotnet'],
            },
            {
                label: 'Serialization',
                tagline: 'Every JsonSerializerContext in your app behind one AOT-safe ISerializer',
                summary: 'Centralize every `JsonSerializerContext` behind a single `ISerializer`. Contexts auto-register, and element types opt into collection support, so lists and arrays round-trip without reflection.',
                highlights: [
                    '`[ShinyJsonContext]` auto-registers a context',
                    '`[ShinyJsonInclude]` makes `List<T>`, `T[]` and friends round-trip',
                    'Compose inline `JsonConverter<T>`s',
                    'DI and static usage patterns, with diagnostics',
                ],
                packages: ['Shiny.Extensions.Serialization'],
                frameworks: ['dotnet', 'blazor'],
                os: ['android', 'ios', 'windows'],
            },
            {
                label: 'Localization Generator',
                tagline: 'Strongly-typed classes generated from your .resx files',
                summary: '`Microsoft.Extensions.Localization` has great abstractions but loses the strong typing `.resx` files used to give you. This generator brings it back — a typed class per resource file, with compile-time safety and IntelliSense.',
                highlights: [
                    'No more typo-prone string lookups',
                    'Compile-time safety and IntelliSense for every key',
                    'Built on Microsoft.Extensions.Localization',
                    'Namespaces follow your directory structure',
                ],
                packages: ['Shiny.Extensions.Localization.Generator'],
                frameworks: ['dotnet'],
            },
        ],
    },
    {
        slug: 'hardware',
        topicId: 'hardware',
        accent: '#0E9F68',
        accentDark: '#45E8AB',
        headline: 'Radios, sensors and the local network — Bluetooth, GPS, beacons, Wi-Fi and discovery behind one API.',
        intro: 'The parts of an app where every platform does it differently and the documentation assumes you already know. Each library owns the native code, the permissions and the background rules, and gives you one API across iOS, Android, Windows, macOS and beyond.',
        libraries: [
            {
                label: 'BluetoothLE',
                tagline: 'Scan, connect and talk to BLE peripherals — reactive and async',
                summary: 'A unified API for the Bluetooth LE central role: scanning, connecting and talking to peripherals. It wraps each platform\'s native BLE stack and gives you a consistent reactive and async experience.',
                highlights: [
                    'Scanning and connection management',
                    'GATT services, characteristics and descriptors',
                    'L2CAP channels and background operations',
                    'Blazor and Linux packages',
                ],
                packages: ['Shiny.BluetoothLE', 'Shiny.BluetoothLE.Blazor', 'Shiny.BluetoothLE.Linux'],
                frameworks: ['dotnet', 'maui', 'blazor'],
                os: ['android', 'ios', 'tvos', 'macos', 'windows', 'linux'],
            },
            {
                label: 'BluetoothLE Hosting',
                tagline: 'Turn your device into a BLE peripheral with custom GATT services',
                summary: 'Let your app act as a BLE peripheral: advertise services, host GATT services with characteristics, and talk to the central devices that connect to you.',
                highlights: [
                    'Advertising',
                    'GATT services and characteristics',
                    'A source generator for GATT services',
                    'L2CAP, plus a Linux package',
                ],
                packages: ['Shiny.BluetoothLE.Hosting', 'Shiny.BluetoothLE.Hosting.Linux'],
                frameworks: ['dotnet', 'maui'],
                os: ['android', 'ios', 'macos', 'windows', 'linux'],
            },
            {
                label: 'Beacons',
                tagline: 'iBeacon and Eddystone — ranging, region monitoring and broadcasting',
                summary: "Both beacon formats that matter — Apple's iBeacon and Google's Eddystone. Range for proximity in the foreground, monitor regions in the background, or broadcast as a beacon yourself.",
                highlights: [
                    'Ranging for live proximity',
                    'Region monitoring',
                    'Eddystone support',
                    'Broadcasting, with distance & accuracy guidance',
                ],
                packages: ['Shiny.Beacons'],
                frameworks: ['dotnet', 'maui', 'blazor'],
                os: ['android', 'ios', 'macos', 'windows', 'linux'],
            },
            {
                label: 'OBD',
                tagline: 'Talk to vehicles through OBD-II adapters',
                summary: 'Communicate with vehicles through OBD-II adapters using a command-object pattern with typed results, pluggable transports and adapter auto-detection.',
                highlights: [
                    'Command objects with generic return types',
                    'BLE, Wi-Fi and serial transports — or write your own',
                    'Mode 06 test results and VIN decoding',
                    'An adapter emulator for testing without a car',
                ],
                packages: ['Shiny.Obd'],
                os: ['android', 'ios', 'windows'],
            },
            {
                label: 'Locations',
                tagline: 'Foreground and background GPS with geofence monitoring',
                summary: 'Two abstractions — `IGpsManager` and `IGeofenceManager` — routed to whatever each OS actually offers. GPS and geofencing share persistence and an access model, and work in the background.',
                highlights: [
                    'Foreground and background GPS modes',
                    'Geofencing with multiple engines, including iOS 18+ `CLMonitor`',
                    'Motion activity',
                    'AI tools for location awareness',
                ],
                packages: ['Shiny.Locations'],
            },
            {
                label: 'Network Discovery',
                tagline: 'Find things on the local network and advertise your own',
                summary: 'Discover printers, casting targets, IoT devices, ONVIF cameras and other instances of your app — and publish your own services — across the three protocols that matter.',
                highlights: [
                    'mDNS / DNS-SD (Bonjour, Zeroconf)',
                    'SSDP / UPnP',
                    'WS-Discovery and ONVIF',
                    'Publish your own service',
                ],
                packages: ['Shiny.Net.Discovery'],
                frameworks: ['maui', 'dotnet'],
                os: ['android', 'ios', 'tvos', 'windows', 'linux', 'macos'],
            },
            {
                label: 'Wi-Fi',
                tagline: 'Scan, join and manage Wi-Fi networks, and host a hotspot',
                summary: "Scan for access points in range, join and leave networks, manage the ones the device has saved, watch the current network's SSID, signal, IP and DNS, and host a hotspot.",
                highlights: [
                    'Scan for networks',
                    'Join, leave and rejoin saved networks',
                    'Watch the current network',
                    'Host a hotspot',
                ],
                packages: ['Shiny.Net.Wifi'],
                frameworks: ['maui', 'dotnet'],
                os: ['android', 'ios', 'windows', 'linux', 'macos'],
            },
            {
                label: 'Screen Recording',
                tagline: 'Record the screen to MP4, with microphone and system audio',
                summary: "Capture the screen with each platform's native recorder, with the microphone and the device's own audio mixed in where the OS allows it.",
                highlights: [
                    'MP4 output with optional mic and system audio',
                    'Pause and resume',
                    'Handles the OS ending a recording for you',
                    'Android, iOS, Mac Catalyst, macOS, Windows, Linux and Blazor WebAssembly',
                ],
                packages: ['Shiny.ScreenRecorder'],
                frameworks: ['maui', 'dotnet', 'blazor'],
                os: ['android', 'ios', 'tvos', 'windows', 'linux', 'macos'],
            },
        ],
    },
    {
        slug: 'device-data',
        topicId: 'device-data',
        accent: '#0077C2',
        accentDark: '#57BCFF',
        headline: 'The data the OS already owns — music, health, contacts and calendars — with permissions handled for you.',
        intro: 'Your users already keep their music, health records, contacts and calendars on the device. These libraries put each store behind one cross-platform API, handle the permission dance, and — where it helps — expose it to an AI agent.',
        libraries: [
            {
                label: 'Music',
                tagline: 'Query, browse and play the device music library',
                summary: 'Query tracks, browse by genre, decade or playlist, and play music from the device library. Mobile-only: there is no equivalent of iOS `MediaPlayer` or Android `MediaStore` elsewhere.',
                highlights: [
                    'Browse by genre, decade and playlist',
                    'Playback and audio output selection',
                    'Lyrics, album art and audio analysis',
                    'AI tools for search, playback and playlists',
                ],
                packages: ['Shiny.Music'],
                frameworks: ['dotnet', 'maui'],
                os: ['android', 'ios'],
            },
            {
                label: 'Health',
                tagline: 'Apple HealthKit and Android Health Connect behind one API',
                summary: 'Unified access to HealthKit and Health Connect — read, write and observe twelve metrics including steps, heart rate, blood pressure and sleep.',
                highlights: [
                    '12 metrics including steps, heart rate, blood pressure and sleep',
                    'Read, write and observe data',
                    'AI tools with opt-in, read-only-by-default capabilities',
                ],
                packages: ['Shiny.Health', 'Shiny.Health.Extensions.AI'],
                frameworks: ['maui'],
                os: ['android', 'ios'],
            },
            {
                label: 'In-App Purchases',
                tagline: 'StoreKit 2 and Google Play Billing 9 behind one API, with the backend included',
                summary: 'Sell consumables, non-consumables and subscriptions through the App Store and Google Play from one `IInAppPurchaseManager`. The server package verifies purchases and turns App Store Server Notifications and Google Play RTDN into one stream of purchase events.',
                highlights: [
                    'StoreKit 2 on iOS, Play Billing 9 on Android',
                    'Subscriptions, offers, free trials and pending purchases',
                    'ASP.NET Core webhooks for renewals, refunds and cancellations',
                ],
                packages: ['Shiny.Mobile.Pay', 'Shiny.Mobile.Pay.Server'],
                frameworks: ['maui', 'aspnet'],
                os: ['android', 'ios'],
            },
            {
                label: 'Contact Store',
                tagline: 'Device contacts with full CRUD and LINQ queries',
                summary: "Access device contacts with full CRUD, a fluent async query builder with native translation, and Shiny's `AccessState` permission model. Runs in any Shiny host, with or without .NET MAUI.",
                highlights: [
                    'Full create, read, update and delete',
                    'LINQ queries translated to the native store',
                    'Photos and thumbnails',
                    'AI tools, read-only by default',
                ],
                packages: ['Shiny.Contacts'],
                frameworks: ['maui', 'dotnet'],
            },
            {
                label: 'Calendar Store',
                tagline: 'Device calendars and events with CRUD and LINQ queries',
                summary: 'Full CRUD on device calendars and events on iOS, Mac Catalyst, macOS, Android and Windows, with a LINQ query that pushes the calendar id and date window down to the native fetch.',
                highlights: [
                    'CRUD on calendars and events',
                    'Attendees, reminders and availability',
                    'iOS 17 write-only access support',
                    'AI tools with per-operation write opt-in',
                ],
                packages: ['Shiny.Calendar'],
                frameworks: ['maui', 'dotnet'],
            },
        ],
    },
    {
        slug: 'ai',
        topicId: 'ai',
        accent: '#D96A00',
        accentDark: '#FFAE52',
        headline: 'Conversation, speech, and on-device recognition of faces, voices and documents.',
        intro: 'The intelligence layer: a complete conversational service, speech in and out with pluggable cloud providers, and recognition that runs entirely on the device — so biometric data and scanned documents never have to leave it.',
        libraries: [
            {
                label: 'AI Conversations',
                tagline: 'Chat, speech, wake word and message history in one service',
                summary: 'A centralized AI conversation service combining `Microsoft.Extensions.AI` chat completions with speech recognition, text-to-speech, wake word detection and audio feedback — text chat, voice chat and hands-free mode behind one interface.',
                highlights: [
                    'Swap OpenAI, Azure, Ollama or Copilot freely',
                    'Text chat, voice chat and hands-free mode',
                    'Wake word detection and audio acknowledgements',
                    'Message store, structured turns and a MAUI chat UI',
                ],
                packages: ['Shiny.AiConversation'],
                frameworks: ['dotnet', 'maui'],
                os: ['android', 'ios', 'windows', 'web'],
            },
            {
                label: 'Speech',
                tagline: 'Speech-to-text, text-to-speech, audio capture and playback',
                summary: 'One API for speech-to-text, text-to-speech, audio capture and playback across Android, iOS, Windows, the browser and Linux, with pluggable cloud providers.',
                highlights: [
                    'Azure AI Speech, OpenAI, ElevenLabs and Typecast providers',
                    'On-device Whisper on Linux',
                    'Continuous sessions and VU meters',
                    'Noise suppression and echo cancellation',
                ],
                packages: ['Shiny.Speech', 'Shiny.Speech.Cloud', 'Shiny.Speech.Azure', 'Shiny.Speech.OpenAI'],
                frameworks: ['dotnet', 'maui'],
                os: ['android', 'ios', 'windows', 'web', 'linux'],
            },
            {
                label: 'Face Intelligence',
                tagline: 'On-device face enrollment and recognition',
                summary: 'Face enrollment and recognition entirely on-device, using ArcFace embeddings and nearest-neighbour vector search — a dependency-free core with swappable models and stores.',
                highlights: [
                    'ArcFace embeddings with vector search',
                    'Swappable ONNX embedder/detector and vector-store packages',
                    'MAUI controls for live recognition',
                    'Guided multi-shot enrollment with quality and novelty gates',
                ],
                packages: ['Shiny.FaceIntelligence'],
                frameworks: ['dotnet', 'maui'],
                os: ['android', 'ios', 'macos', 'windows', 'linux'],
            },
            {
                label: 'Voice Intelligence',
                tagline: 'On-device speaker recognition from voiceprints',
                summary: 'Speaker enrollment and recognition built on the same architecture as Face Intelligence. Capture stays in your app, so it works with any audio pipeline.',
                highlights: [
                    'ECAPA / CAM++ voiceprints with cosine-distance matching',
                    'Guided enrollment checks level, clipping, SNR and agreement',
                    'Never opens a microphone itself',
                    'A MAUI enrollment control',
                ],
                packages: ['Shiny.VoiceIntelligence'],
                frameworks: ['dotnet', 'maui'],
                os: ['android', 'ios', 'macos', 'windows', 'linux'],
            },
            {
                label: 'Document Intelligence',
                tagline: 'Native document scanning plus on-device data extraction',
                summary: 'The native document scanner (VisionKit, ML Kit, Vision) behind one `IDocumentScanner`, plus on-device extraction of structured data from what it scans.',
                highlights: [
                    'Receipts and invoices',
                    "Driver's licenses (AAMVA PDF417) and passports (ICAO 9303 MRZ)",
                    'Payment cards — Luhn-validated, CVV never read, PAN masked in logs',
                    'Everything runs on the device',
                ],
                packages: ['Shiny.DocumentIntelligence'],
                frameworks: ['dotnet', 'maui'],
                os: ['android', 'ios', 'macos'],
            },
        ],
    },
    {
        slug: 'background',
        topicId: 'background',
        accent: '#D81B60',
        accentDark: '#FF7BA8',
        headline: "Work that keeps running when your app isn't on screen, and the notifications that bring users back.",
        intro: 'Every platform has its own rules for what may run in the background and for how long. These libraries follow those rules for you — scheduled jobs, transfers that survive suspension, and local, push and live notifications.',
        libraries: [
            {
                label: 'Jobs',
                tagline: 'Periodic and one-shot background tasks that survive app restarts',
                summary: 'Run periodic background tasks with platform-aware scheduling: WorkManager on Android, BGTaskScheduler on iOS, COM-activated background tasks on Windows, and an in-process manager everywhere else.',
                highlights: [
                    'WorkManager on Android, BGTaskScheduler on iOS',
                    'COM-activated background tasks on Windows',
                    'In-process JobManager on Linux, macOS, Blazor and plain .NET',
                    'Battery-aware scheduling',
                ],
                packages: ['Shiny.Jobs'],
                frameworks: ['dotnet', 'maui', 'blazor'],
                os: ['android', 'ios', 'tvos', 'macos', 'linux', 'windows', 'web'],
            },
            {
                label: 'Local Notifications',
                tagline: 'Rich local notifications with channels and scheduling',
                summary: 'Alert users even when your app is not in the foreground — for completed background work, BLE events, geofence triggers and more.',
                highlights: [
                    'Channels and platform-specific customization',
                    'Scheduling triggers',
                    'Handle notification taps',
                    'AI reminder tools',
                ],
                packages: ['Shiny.Notifications', 'Shiny.Notifications.Linux'],
                frameworks: ['dotnet', 'maui'],
                os: ['android', 'ios', 'macos', 'windows', 'linux'],
            },
            {
                label: 'Push Notifications',
                tagline: 'APNs, FCM, WNS and Web Push behind one delegate model',
                summary: 'Server-driven notifications through the platform services, with a unified API that still gives you native capabilities. To send from a .NET backend, pair it with Push (Server).',
                highlights: [
                    'Native, Firebase and Azure Notification Hubs providers',
                    'One push delegate for every provider',
                    'Tags, plus iOS and Android customization',
                    'Web Push on Blazor',
                ],
                packages: ['Shiny.Push', 'Shiny.Push.Blazor'],
                frameworks: ['dotnet', 'maui', 'blazor'],
                os: ['android', 'ios', 'tvos', 'macos', 'windows'],
            },
            {
                label: 'Live Activities',
                tagline: 'The live, updating status surface on iOS and Android — from C#',
                summary: 'Both phone platforms grew a persistent, updating status surface independently. This library drives both from one C# API, locally or from your server.',
                highlights: [
                    'Start, update and end from C#',
                    'Push tokens and server-side updates',
                    'iOS widget extension guide',
                    'HTTP transfer progress, already wired up',
                ],
                packages: ['Shiny.Mobile.LiveActivities'],
                os: ['ios', 'android'],
            },
            {
                label: 'HTTP Transfers',
                tagline: 'Resumable background uploads and downloads',
                summary: 'Uploads and downloads that keep going when your app is suspended — managed by the OS through `NSURLSession` on iOS, and by a managed client with a foreground service elsewhere.',
                highlights: [
                    'Background `NSURLSession` on iOS, resumed after restarts',
                    'Android foreground service integration',
                    'Azure Blob Storage and AWS S3',
                    'Progress monitoring',
                ],
                packages: ['Shiny.Net.Http', 'Shiny.Net.Http.Blazor'],
                os: ['android', 'ios', 'tvos', 'windows', 'macos', 'linux', 'web'],
            },
        ],
    },
    {
        slug: 'maui',
        topicId: 'maui',
        accent: '#5E9B26',
        accentDark: '#AEDC6C',
        headline: 'Navigation, modular hosting, configuration and permissions — the plumbing of a .NET MAUI app.',
        intro: 'The things every MAUI app needs and nobody enjoys writing: typed navigation with a real ViewModel lifecycle, a `MauiProgram.cs` that stays readable, configuration from the platform and the network, and permissions declared once.',
        libraries: [
            {
                label: 'MAUI Shell',
                tagline: 'Typed Shell navigation with a proper ViewModel lifecycle',
                summary: 'Opinionated Shell navigation with source-generated routes, strongly-typed parameters and ViewModel lifecycle management — no magic strings, no manual wiring, and testable.',
                highlights: [
                    'Source-generated routes and strongly-typed parameters',
                    'ViewModel lifecycle management',
                    'Navigation interceptors, dialogs and tab badges',
                    'App links, app shortcuts and AI navigation tools',
                ],
                packages: ['Shiny.Maui.Shell', 'Shiny.Maui.Shell.UxDiversDialogs'],
                frameworks: ['maui'],
            },
            {
                label: 'MAUI Hosting',
                tagline: 'Break MauiProgram.cs into self-contained modules',
                summary: 'Split a massive `MauiProgram.cs` into `IMauiModule` classes, each responsible for its own registrations and post-build initialization, with static service access and platform lifecycle dispatch.',
                highlights: [
                    '`IMauiModule` classes',
                    'Static `ShinyHost` service access',
                    'App support and app store helpers',
                    'Desktop backends',
                ],
                packages: ['Shiny.Extensions.MauiHosting'],
                frameworks: ['maui'],
            },
            {
                label: 'Configuration',
                tagline: 'Platform preferences, JSON bundles and remote configuration',
                summary: '`Microsoft.Extensions.Configuration` providers for mobile apps: platform preference stores, JSON bundled per platform, and configuration fetched from a server. Works without any other Shiny module.',
                highlights: [
                    'JSON platform bundles',
                    'Platform preferences',
                    'Remote configuration',
                    'No other Shiny module required',
                ],
                packages: ['Shiny.Extensions.Configuration'],
                frameworks: ['dotnet'],
                os: ['android', 'ios', 'windows'],
            },
            {
                label: 'MSBuild Permissions',
                tagline: 'Declare permissions once; MSBuild writes the manifest and Info.plist',
                summary: 'Declare permissions in your project file and let MSBuild generate the Android manifest entries and iOS Info.plist entries. No more editing XML by hand.',
                highlights: [
                    'Android manifest entries generated',
                    'iOS Info.plist entries generated',
                    'MAUI permission classes',
                ],
                packages: ['Shiny.Permissions.MSBuild'],
                frameworks: ['maui'],
                os: ['android', 'ios'],
            },
        ],
    },
    {
        slug: 'controls',
        topicId: 'controls',
        accent: '#3949AB',
        accentDark: '#93A0F0',
        page: '/controls/',
        headline: '70+ native controls for .NET MAUI and Blazor, sharing one theme system — no WebViews.',
        intro: 'One package per host and a shared theme contract across both.',
        featured: [
            { label: 'TableView', href: '/controls/tableview/' },
            { label: 'Scheduler', href: '/controls/scheduler/' },
            { label: 'ChatView', href: '/controls/chatview/' },
            { label: 'DataGrid', href: '/controls/datagrid/' },
            { label: 'Gantt', href: '/controls/gantt/' },
            { label: 'Kanban', href: '/controls/kanban/' },
            { label: 'Timeline', href: '/controls/timeline/' },
            { label: 'Notebook', href: '/controls/notebook/' },
            { label: 'Diagram', href: '/controls/diagram/' },
            { label: 'CameraView', href: '/controls/cameraview/' },
            { label: 'Spreadsheet', href: '/controls/spreadsheet/' },
            { label: 'Floor Plan', href: '/controls/floorplan/' },
            { label: 'MediaElement', href: '/controls/mediaelement/' },
            { label: 'Theming', href: '/controls/theming/' },
        ],
        libraries: [],
    },
    {
        slug: 'data',
        topicId: 'data',
        accent: '#00838F',
        accentDark: '#4FD6E4',
        headline: 'Store, query, sync and persist data — on the device and in the cloud, with no ORM and no migrations.',
        intro: 'Lightweight, AOT-compatible data libraries that run everywhere .NET does: a document database over twenty backends, a geospatial database, a two-way sync engine, and a key/value store abstraction.',
        libraries: [
            {
                label: 'Document DB',
                tagline: 'A schema-free JSON document store on 20 databases — from SQLite to Cosmos DB',
                summary: 'Turn the database you already run into a schema-free document store: save whole object graphs, query them with LINQ, and never write a migration. One API across SQLite, PostgreSQL, SQL Server, Cosmos DB, MongoDB and fifteen more.',
                highlights: [
                    'LINQ over nested object graphs, no migrations',
                    'Vector, full-text and spatial search on native indexes',
                    'Temporal history, field encryption and a transactional outbox',
                    'Orleans, Aspire, REST, MCP and an admin UI',
                ],
                packages: ['Shiny.DocumentDb'],
                frameworks: ['dotnet', 'maui', 'blazor', 'aspnet'],
                os: ['android', 'ios', 'windows'],
            },
            {
                label: 'Spatial',
                tagline: 'A dependency-free geospatial database on SQLite R*Tree',
                summary: 'SQLite R*Tree indexing combined with custom C# geometry algorithms for fast spatial queries. No SpatiaLite, no NetTopologySuite — just SQLite and math.',
                highlights: [
                    'Geometry types and algorithms',
                    'R*Tree-indexed spatial queries',
                    'Pre-built datasets',
                    'Geofencing',
                ],
                packages: ['Shiny.Spatial'],
                frameworks: ['dotnet'],
                os: ['android', 'ios', 'windows'],
            },
            {
                label: 'Data Sync',
                tagline: 'Reliable, bidirectional JSON record sync with an HTTP backend',
                summary: 'A background-capable sync engine between your app and an HTTP backend. A persistent outbox queues creates, updates and deletes; an inbox pulls cursor-based deltas; platform-tier transports drain both.',
                highlights: [
                    'Background `NSURLSession` on iOS, foreground service on Android',
                    'Coalesced batching, tombstones and soft-delete predicates',
                    'Conflict resolution and exponential-backoff retries',
                    'Custom transports and sync interceptors',
                ],
                packages: ['Shiny.Data.Sync'],
                frameworks: ['dotnet', 'maui', 'blazor'],
                os: ['android', 'ios', 'tvos', 'macos', 'windows', 'linux'],
            },
            {
                label: 'Stores',
                tagline: 'One key/value API over Preferences, Secure Storage and browser storage',
                summary: 'Persist class properties across sessions with a single line. Swap between Preferences, Secure Storage, Local Storage and more, all behind the same API.',
                highlights: [
                    'Preferences and Secure Storage',
                    'Local and Session Storage on Blazor',
                    'Persistent services that save their own properties',
                    'Custom stores',
                ],
                packages: ['Shiny.Extensions.Stores'],
                frameworks: ['dotnet', 'blazor'],
                os: ['android', 'ios', 'windows'],
            },
        ],
    },
    {
        slug: 'server',
        topicId: 'server',
        accent: '#8E24AA',
        accentDark: '#DB8CF0',
        headline: 'An HTTP server that runs anywhere .NET does, push dispatch from your backend, and .NET Aspire integrations.',
        intro: 'Server-side .NET without the weight: an embeddable HTTP stack that even runs inside a MAUI app, modular startup for ASP.NET and Blazor, push delivery from your own backend, and Aspire resources for Orleans, VPNs and tunnels.',
        includeLabels: ['Aspire'],
        libraries: [
            {
                label: 'HTTP Server',
                tagline: 'An AOT-clean HTTP/1.1, HTTP/2 and HTTP/3 server — even inside a MAUI app',
                summary: 'ASP.NET Core is heavyweight and does not run on .NET MAUI. This does: a dependency-light server with routing, middleware and typed endpoints generated at compile time, so a route that cannot bind fails your build rather than your deployment.',
                highlights: [
                    'Routing, middleware, DI scopes and compile-time typed endpoints',
                    'WebSockets, Server-Sent Events, OpenAPI, CORS and rate limiting',
                    'Reach it from the internet over SSH, quick tunnels or Azure Relay',
                    'gRPC, MCP, WebDAV, Mediator and DocumentDb add-ons',
                ],
                packages: ['Shiny.Net.HttpServer', 'Shiny.Net.HttpServer.Jwt', 'Shiny.Net.HttpServer.AzureRelay', 'Shiny.Net.HttpServer.Ssh'],
                frameworks: ['dotnet', 'maui'],
                os: ['android', 'ios', 'tvos', 'macos', 'windows', 'linux'],
            },
            {
                label: 'App Device Bridge',
                tagline: 'A web app inside a MAUI app, with typed access to the device',
                summary: 'Ship Blazor, React or any static web app inside a .NET MAUI app — served from the device, updated over the air from a signed release server, and calling native features through bridges with generated C# and TypeScript clients.',
                highlights: [
                    'Served offline from its zip on a loopback server',
                    'Signed over-the-air updates',
                    'Typed C# and TypeScript clients for every bridge',
                    'Location, Bluetooth, notifications, photos, folders, tray icons and more',
                ],
                packages: ['Shiny.AppDeviceBridge.Maui', 'Shiny.AppDeviceBridge.WebView', 'Shiny.AppDeviceBridge.Blazor', 'Shiny.AppDeviceBridge.AspNetCore'],
                frameworks: ['maui', 'blazor'],
                os: ['android', 'ios', 'macos', 'windows', 'linux'],
            },
            {
                label: 'Web Hosting',
                tagline: 'Modular ASP.NET Core startup with IWebModule',
                summary: 'Break a bloated `Program.cs` apart into `IWebModule` classes, each responsible for its own services and middleware — authentication, CORS, Swagger, logging and health checks stop tangling together.',
                highlights: [
                    '`IWebModule` classes',
                    'Automatic module registration',
                    'A clean `Program.cs`',
                ],
                packages: ['Shiny.Extensions.WebHosting'],
                frameworks: ['aspnet'],
            },
            {
                label: 'Blazor Hosting',
                tagline: 'App, browser and culture information for Blazor WebAssembly',
                summary: "An `IAppSupport` service for Blazor WebAssembly — app version, browser user-agent, screen and viewport size, plus live culture and time-zone change notifications. The browser-side sibling of MAUI Hosting.",
                highlights: [
                    'App version and browser user-agent',
                    'Screen and viewport dimensions',
                    'Culture and time-zone change notifications',
                ],
                packages: ['Shiny.Extensions.BlazorHosting'],
                frameworks: ['blazor'],
                os: ['web'],
            },
            {
                label: 'Push (Server)',
                tagline: 'Send push from your backend to APNs, FCM and Web Push',
                summary: 'Server-side push dispatch through one provider-agnostic API — structured targeting, topics, interceptors, automatic dead-token pruning and multi-app keyed registration.',
                highlights: [
                    'APNs direct (.p8 / ES256), FCM and Web Push (VAPID)',
                    'Structured targeting and topics',
                    'Interceptors and automatic dead-token pruning',
                    'Live Activity updates, DocumentDb persistence and metrics',
                ],
                packages: ['Shiny.Extensions.Push', 'Shiny.Extensions.Push.DocumentDb'],
                frameworks: ['dotnet', 'aspnet'],
            },
            {
                label: 'Aspire',
                tagline: 'Orleans, Gluetun VPN and public tunnels as .NET Aspire resources',
                summary: 'Aspire integrations for the pieces that are fiddly to orchestrate: an Orleans cluster with provisioned ADO.NET storage, a VPN container other resources route through, and public addresses for webhooks and demos.',
                highlights: [
                    'Orleans clustering, grain storage and reminders with schema provisioning',
                    'Gluetun VPN with Docker Compose publish support',
                    'Tunnels: quick, SSH, Shiny relay, Azure Relay, Cloudflare and ngrok',
                    'DocumentDb stores and admin UI',
                ],
                packages: ['Shiny.Aspire.Orleans.Hosting', 'Shiny.Aspire.Orleans.Server', 'Shiny.Aspire.Orleans.Client', 'Shiny.Aspire.Hosting.Gluetun', 'Shiny.Aspire.Hosting.Tunnel'],
                frameworks: ['dotnet'],
            },
        ],
    },
];

// ── join with the sidebar ──────────────────────────────────────────────

export interface LibraryLink {
    label: string;
    href: string;
}

export interface Library extends LibraryCopy {
    href: string;
    /** First-level sub-pages from the sidebar, minus the boilerplate ones */
    links: LibraryLink[];
}

export interface Category extends Omit<CategoryCopy, 'libraries'> {
    label: string;
    icon: string;
    page: string;
    libraries: Library[];
}

type SidebarNode = { label?: string; link?: string; items?: SidebarNode[]; jumpTo?: boolean; attrs?: unknown };

const toHref = (link: string) =>
    /^https?:\/\//.test(link) ? link : `/${link.replace(/^\/+/, '').replace(/\/?$/, '/')}`;

const firstLink = (node: SidebarNode): string | undefined =>
    node.link ?? node.items?.map(firstLink).find(Boolean);

const BOILERPLATE = /^(getting started|release notes|blazor playground)$/i;

export function getCatalog(): Category[] {
    return categories.map((cat) => {
        const topic = (sidebarTopics as (SidebarNode & { id?: string; icon: string })[]).find((t) => t.id === cat.topicId);
        if (!topic)
            throw new Error(`libraryCatalog: no sidebar topic with id '${cat.topicId}'`);

        const copyByLabel = new Map(cat.libraries.map((l) => [l.label, l]));
        const sidebarLibs = cat.libraries.length === 0
            ? []
            : (topic.items ?? []).filter((i) => i.label && (i.jumpTo === true || cat.includeLabels?.includes(i.label)));

        for (const node of sidebarLibs) {
            if (!copyByLabel.has(node.label!))
                throw new Error(`libraryCatalog: '${node.label}' is in the '${topic.label}' sidebar but has no entry in src/data/libraryCatalog.ts`);
        }
        for (const copy of cat.libraries) {
            if (!sidebarLibs.some((n) => n.label === copy.label))
                throw new Error(`libraryCatalog: '${copy.label}' has catalog copy but is not a library in the '${topic.label}' sidebar`);
        }

        const libraries = sidebarLibs.map((node) => {
            const copy = copyByLabel.get(node.label!)!;
            const links = (node.items ?? [])
                .filter((c) => c.label && !BOILERPLATE.test(c.label))
                .map((c) => ({ label: c.label!, link: firstLink(c) }))
                .filter((c): c is { label: string; link: string } => !!c.link && !/^https?:/.test(c.link))
                .slice(0, 5)
                .map((c) => ({ label: c.label, href: toHref(c.link) }));
            return { ...copy, href: toHref(firstLink(node)!), links };
        });

        return {
            ...cat,
            label: topic.label!,
            icon: topic.icon,
            page: cat.page ?? `/libraries/${cat.slug}/`,
            libraries,
        };
    });
}

/** Catalog copy is plain text with `backtick` code spans — escape it and render the spans. */
export const inlineCode = (text: string) =>
    text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/`([^`]+)`/g, '<code>$1</code>');

export const getCategory = (slug: string) => {
    const c = getCatalog().find((x) => x.slug === slug);
    if (!c)
        throw new Error(`libraryCatalog: unknown category '${slug}'`);
    return c;
};
