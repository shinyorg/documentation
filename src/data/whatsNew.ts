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
    date: "2026-11-27",
    title: "Universal Hubs 3",
    href: "/universalhubs/release-notes/",
    icon: "signal",
    description: "Hubs over transports. <code>Shiny.UniversalHubs</code> is the hub, host, client and source generator, with a package per transport: <code>.BluetoothLE</code>, <code>.Http</code>, <code>.Multipeer</code> and <code>.Nearby</code>, or a transport of your own. Each hub is added by name and picks its transports and serializer, clients turn transports on and off while the app runs, and HTTP is now one WebSocket per hub that resumes like the others. BluetoothLE Hubs is folded in, with an upgrade guide.",
  },
  {
    date: "2026-11-27",
    title: "DocumentDb 15",
    href: "/documentdb/release-notes/",
    icon: "seti:db",
    description: "Schema versioning with upcasters, so old documents read as the current shape. Document expiration (TTL) with a purge sweeper, inheritance with derived types stored under their base type, and <code>Include</code> to load related documents in one batched read. <code>ExecuteUpdate</code> gains <code>Increment</code>, <code>Unset</code>, <code>Push</code>, <code>Pull</code> and <code>AddToSet</code>, and queries understand C# 15 union types. All of it works on every provider. SQLite moves to <code>Microsoft.Data.Sqlite</code> 11, and SQLCipher now runs on SQLite3 Multiple Ciphers.",
  },
  {
    date: "2026-11-22",
    title: "Shiny 7 on .NET 11",
    href: "/client/release-notes/",
    icon: "star",
    description: "The suite moves to .NET 11 and MAUI 11. The client packages go to 7.0, together with HTTP Server 3, BluetoothLE Hubs and Universal Hubs 2, App Device Bridge 4 and MAUI Shell 8, and every one of them now targets <code>net11.0</code> and its platform builds.",
  },
  {
    date: "2026-11-22",
    title: "Passkeys & a Smarter Simulator",
    href: "/appdevicebridge/passkeys/",
    icon: "approve-check",
    description: "App Device Bridge 4 adds <code>AddPasskeysBridge</code>: a web app hosted in your MAUI app creates and signs in with passkeys through Face ID, Touch ID, Android's Credential Manager and Windows Hello, because a page served from loopback can't call <code>navigator.credentials</code> for your domain. The <code>shiny-bridge-sim</code> simulator now plays KML and KMZ walks, answers monitored geofences like a device, and loads Shiny.Obd emulated vehicles.",
  },
  {
    date: "2026-11-15",
    title: "Uno Platform & Avalonia Hosting",
    href: "/client/core/avalonia/",
    icon: "laptop",
    description: "Shiny runs in Uno Platform and Avalonia 12 apps, not just MAUI. <code>Shiny.Hosting.Uno</code> covers Android, iOS, Mac Catalyst, Windows and the Skia desktop with either Uno renderer, <code>Shiny.Hosting.Uno.WebAssembly</code> brings Shiny's browser modules to Uno WebAssembly, and <code>Shiny.Hosting.Avalonia</code> covers Android, iOS, Mac Catalyst and desktop.",
  },
  {
    date: "2026-11-15",
    title: "Controls 2.5",
    href: "/controls/release-notes/",
    icon: "puzzle",
    description: "<code>ResizablePanelGroup</code> splits a layout into panels with draggable handles, and <code>SignatureView</code> puts a signature surface in any form, card or row. <code>MediaElement</code> takes the same analyzers as <code>CameraView</code>, so OCR, barcodes, faces and motion read a playing video, and <code>SpeechCaptionAnalyzer</code> with <code>CaptionView</code> captions what plays or what the camera hears.",
  },
  {
    date: "2026-11-15",
    title: "AG-UI & A2UI Controls",
    href: "/controls/agent-view/",
    icon: "comment",
    description: "<code>AgentView</code> turns any AG-UI agent into a conversation on MAUI and Blazor: streaming markdown, reasoning, live tool-call cards, nested sub-agents, and interrupts answered with approve/reject, choices or a text reply. The agent can ask the user through real Shiny controls (confirm, pickers, date ranges). <code>A2UISurfaceView</code> draws A2UI v1.0 surfaces with native controls, covering the full basic catalog plus a Shiny catalog that adds DataGrid, Gauge, ChipGroup, DateRangePicker, Timeline and more. It works inside a conversation or on its own.",
  },
  {
    date: "2026-11-22",
    title: "Accessory Setup",
    href: "/client/accessorysetup/",
    icon: "signal",
    description: "Let users pick your BLE device in the OS's own setup UI: the AccessorySetupKit half-sheet with your product image on iOS 18+, and the CompanionDeviceManager dialog on Android. The user's choice is the permission, so there is no MFi, no location prompt and, on iOS, no Bluetooth prompt. The accessory opens as a <code>Shiny.BluetoothLE</code> peripheral with no scan, and Android 12+ can wake the app when it comes into range.",
  },
  {
    date: "2026-11-22",
    title: "MCUmgr Firmware Updates",
    href: "/client/ble/mcumgr",
    icon: "rocket",
    description: "Update the firmware of Zephyr, nRF Connect SDK, Mynewt and NuttX devices over BLE. <code>UpgradeFirmwareAsync</code> runs the whole MCUboot update: it uploads in chunks sized to the device's buffer, resumes an interrupted upload, then tests, resets, reconnects and confirms. It reads nRF Connect SDK <code>dfu_application.zip</code> packages, including the nRF5340 network core image, and also covers OS, image, file, shell and stats commands.",
  },
  {
    date: "2026-10-30",
    title: "AI Conversation 3",
    href: "/aiconversation/",
    icon: "comment",
    description: "Rebuilt around sessions. Replies stream as they are written and can be interrupted, and each session persists to SQLite with search, auto titles and context compaction. The assistant keeps its own long-term memory, sees images and can ask to use the camera. Voice is now the separate <code>Shiny.AiConversation.Voice</code> package: push-to-talk, wake word, barge-in, answering a question by voice while the AI is still speaking, and replies spoken sentence by sentence.",
  },
  {
    date: "2026-10-30",
    title: "Speech & Audio 3",
    href: "/speech/",
    icon: "seti:audio",
    description: "Full-duplex audio for calls, overlapping playback, WAV recording, real-time mic effects, VU metering and a live mic monitor. <code>SpeechTone</code> sets emotion and tone once and works across Azure, OpenAI, ElevenLabs and Typecast. Linux gets audio through <code>Shiny.Audio.Linux</code> and offline speech-to-text through <code>Shiny.Speech.Linux.Whisper</code>.",
  },
  {
    date: "2026-10-30",
    title: "Classic Bluetooth",
    href: "/client/bluetooth/",
    icon: "signal",
    description: "RFCOMM serial connections to the classic Bluetooth devices BLE never replaced, such as SPP adapters, printers and scanners. Discover, pair, connect or host a service, and read and write the connection as a <code>Stream</code>. Runs on Android, Windows, macOS and Linux (BlueZ). <code>Shiny.Obd.Bluetooth</code> 1.5 uses it to reach the ELM327 and OBDLink adapters that <code>Shiny.Obd.Ble</code> can't see.",
  },
  {
    date: "2026-10-29",
    title: "Biometrics",
    href: "/client/biometrics/",
    icon: "seti:lock",
    description: "Verify the device owner with the platform's own prompt: Face ID, Touch ID and Optic ID on Apple, AndroidX BiometricPrompt on Android, and Windows Hello, all through one <code>IBiometrics</code>. Check what's available without showing any UI, and fall back to the device passcode or PIN.",
  },
  {
    date: "2026-10-29",
    title: "NFC",
    href: "/client/nfc/",
    icon: "phone",
    description: "Read and write NDEF tags: URLs, text, MIME payloads, smart posters and Android app records. One <code>INfcManager</code> covers Android reader mode, iOS CoreNFC, PC/SC contactless readers on Windows, macOS and Linux, and Web NFC in Blazor WebAssembly.",
  },
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
    href: "/universalhubs/bluetoothle/",
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
