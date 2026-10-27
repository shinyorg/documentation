// Homepage "What's New" cards. The homepage shows the newest entries; /whats-new/ lists every one.
// `date` is when the feature shipped (YYYY-MM-DD); `description` is HTML.

export interface WhatsNewItem {
  date: string;
  title: string;
  tag?: string;
  href: string;
  icon: string;
  description: string;
}

export const whatsNew: WhatsNewItem[] = [
  {
    date: "2026-10-22",
    title: "EF Core Extensions",
    tag: "coming in 1.0",
    href: "/efcore/",
    icon: "seti:db",
    description: "The DocumentDb features EF Core 10 is missing. Spatial, vector (sqlite-vec) and FTS5 full-text search for SQLite that work on iOS and Android with no <code>mod_spatialite</code>. A transactional outbox with retries and dead letters. Temporal history on SQLite, PostgreSQL, SQL Server and MySQL. Scoped AI tools and an MCP server over a <code>DbContext</code>, plus versioned seeding and an Aspire seed gate. All of it plugs in through EF's own extension points, with no base <code>DbContext</code> to derive from.",
  },
  {
    date: "2026-10-12",
    title: "ASP.NET Extensions",
    href: "/aspnet/",
    icon: "laptop",
    description: "The HTTP Server add-ons, re-hosted on Kestrel. WebDAV, CalDAV &amp; CardDAV, tus resumable uploads and Dropbox-style file sync. Private NuGet and npm feeds inside your app. Automatic HTTPS from Let's Encrypt, plus webhook verification, idempotency keys, Content-Digest and JSON Patch. Publish over SSH quick tunnels, cloudflared, ngrok or Tailscale. One package per concern, each <code>Map…</code> takes <code>RequireAuthorization</code> and rate limiting, and all of it is Native AOT clean.",
  },
  {
    date: "2026-10-12",
    title: "Shiny 6",
    href: "/client/release-notes/",
    icon: "star",
    description: "One package per feature on every platform — the Blazor and Linux backends are merged into Shiny.Core, BluetoothLE, GPS, Screen Recorder and Gamepad. <code>IPlatform</code> reports device, app, culture and time zone natively, alongside new <code>IScreenInfo</code> and launch-at-login, and <code>UseShiny()</code> now runs in macOS, Linux GTK and Blazor WebAssembly apps.",
  },
  {
    date: "2026-10-14",
    title: "New Controls",
    href: "/controls/video-text/",
    icon: "puzzle",
    description: "VideoText plays a looping video inside your letters, BorderBeam and ShineBorder run animated light around a card's outline, AnimatedBackground puts aurora, snow, meteors or a starfield behind any content, Avatar and AvatarGroup draw profile pictures, initials, presence dots and facepiles, and NotchView is a Dynamic Island that morphs to fit any content (and on macOS lives in the camera notch) — joining Confetti, Marquees, Range Pickers and Keyboard Shortcuts, on both MAUI and Blazor.",
  },
  {
    date: "2026-10-23",
    title: "VPN",
    href: "/client/vpn/",
    icon: "padlock",
    description: "Put your IKEv2 VPN into the operating system's own client, then connect, disconnect and watch it from code. Shared secret, username and password, or a client certificate on iOS, Mac Catalyst, macOS, Android and Linux. The OS runs the tunnel, so it keeps going after your app closes.",
  },
  {
    date: "2026-10-14",
    title: "Call Directory",
    href: "/client/calldirectory/",
    icon: "phone",
    description: "Block and identify incoming calls from a list your app owns — applied by the phone even when your app isn't running. A CallKit extension built during <code>dotnet build</code> on iOS, with no Xcode project, and the call screening role on Android.",
  },
  {
    date: "2026-10-12",
    title: "Region Geofencing",
    href: "/client/locations/region-geofencing/",
    icon: "magnifier",
    description: "GPS-driven geofencing with no region limit — polygons, radius regions, or regions resolved by reverse geocoding, with a Shiny.DocumentDb SQLite source and a built-in seeder for US states, Canadian provinces and cities.",
  },
  {
    date: "2026-10-12",
    title: "Universal Hubs",
    href: "/universalhubs/",
    icon: "signal",
    description: "BluetoothLE Hubs over Wi-Fi as well as Bluetooth LE — write the hub once and clients connect over whichever link they can reach. BLE and mDNS discovery in one list, Wi-Fi first with BLE fallback, and resume across short drops.",
  },
  {
    date: "2026-10-12",
    title: "App Store",
    href: "/client/appstore/",
    icon: "cloud-download",
    description: "Check the store for a newer version of the running app, deep-link to its store and review pages, and request the native in-app review prompt — implemented natively on every platform, no MAUI required.",
  },
  {
    date: "2026-10-07",
    title: "Game Center",
    href: "/client/gamecenter/",
    icon: "star",
    description: "Achievements, leaderboards and friends over Apple Game Center and Google Play Games with one set of keys. Progress is queued on the device, survives restarts and offline play, and can never count twice.",
  },
  {
    date: "2026-09-29",
    title: "App Device Bridge",
    href: "/appdevicebridge/",
    icon: "rocket",
    description: "Ship Blazor, React or any web app inside a MAUI app — served offline, updated over the air, and now selling through the App Store and Google Play, querying on-device SQLite, posting to Game Center and Play Games, and blocking calls through the Call Directory — all through typed C# and TypeScript clients.",
  },
  {
    date: "2026-09-28",
    title: "HTTP Server",
    href: "/httpserver/",
    icon: "laptop",
    description: "SignalR-shaped real-time calls over Server-Sent Events, private NuGet and npm feeds, Dropbox-style two-way File Sync that moves only changed bytes, plus automatic HTTPS, tus uploads, CalDAV &amp; CardDAV and webhooks.",
  },
  {
    date: "2026-10-03",
    title: "Printing",
    href: "/client/printing/",
    icon: "notes",
    description: "Build a receipt once and stream it as ESC/POS to a thermal printer over Bluetooth LE, WiFi or the browser — or hand a PDF, image or HTML to AirPrint, Android, Windows or CUPS for any installed printer.",
  },
  {
    date: "2026-10-03",
    title: "BluetoothLE Hubs",
    href: "/blehubs/",
    icon: "signal",
    description: "SignalR-style hubs between nearby devices over Bluetooth LE — strongly typed, source-generated proxies, pushes to everyone, one client or a group, and L2CAP file transfers. No server or network required.",
  },
  {
    date: "2026-10-03",
    title: "Actors",
    href: "/actors/",
    icon: "random",
    description: "Orleans-style virtual actors in one process — even inside a MAUI or Blazor app. One call at a time so there are no locks to write, with persisted state, event sourcing, streams, reminders and remoting over HTTP, all AOT-clean.",
  },
  {
    date: "2026-09-29",
    title: "App Functions",
    href: "/client/appfunctions/",
    icon: "star",
    description: "Declare your app's functions once in C# and expose them to Siri, Spotlight, Shortcuts and Apple Intelligence as App Intents, and to Gemini as Android AppFunctions — no Swift, Kotlin or manifest entries. Hand the same functions to your own in-app LLM as AI tools.",
  },
  {
    date: "2026-09-28",
    title: "Office Suite",
    href: "/controls/office-shell/",
    icon: "document",
    description: "Edit real .docx, .pptx and .xlsx files in .NET MAUI and Blazor — Document Editor, Slide Editor and Spreadsheet inside a Word / PowerPoint / Excel-style shell with ribbon, backstage, track changes, formulas, charts and presenter view.",
  },
  {
    date: "2026-09-28",
    title: "Resumable Uploads",
    href: "/client/httptransfers/tus/",
    icon: "cloud-download",
    description: "HTTP Transfers now speak tus — a dropped upload resumes from the last byte the server kept, against tusd, Cloudflare Stream, Vimeo, Supabase or Shiny's own HTTP Server.",
  },
];

/** Newest first; entries sharing a date keep their listed order. */
export const whatsNewByDate = (): WhatsNewItem[] =>
  whatsNew
    .map((item, i) => ({ item, i }))
    .sort((a, b) => b.item.date.localeCompare(a.item.date) || a.i - b.i)
    .map(({ item }) => item);
