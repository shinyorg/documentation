import type { TemplateKind } from '../TemplateBuilder/templateFiles';
import { getBaselineState, type TemplateState } from '../TemplateBuilder/templateData';

/**
 * Maps a ShinyComponent id (used by the Lib Builder via `componentName`) to the
 * Template Builder param(s) that enable it. Components NOT present here have no
 * template equivalent and fall back to the legacy boilerplate engine.
 *
 * - Omit `value` for bool params (set to `true`); supply `value` for choice params.
 * - Multiple entries with the same `kind` are all applied (for dependent params,
 *   e.g. documentdb diagnostics needs the base documentdb param too).
 * Every paramId/value below is verified against templateData.ts.
 */
export interface TemplateParamRef {
    kind: TemplateKind;
    /** Omit when the library is already part of that template's base project (nothing to switch on). */
    paramId?: string;
    value?: string;
}

export const componentTemplateMap: Record<string, TemplateParamRef[]> = {
    // Core / infrastructure
    mediator: [
        { kind: 'shinyapp', paramId: 'shinymediator' },
        { kind: 'shinyaspnet', paramId: 'shinymediator' },
        { kind: 'shinyblazor', paramId: 'shinymediator' },
    ],
    config: [{ kind: 'shinyapp', paramId: 'configuration' }],
    localization: [
        { kind: 'shinyapp', paramId: 'localization' },
        { kind: 'shinyaspnet', paramId: 'localization' },
        { kind: 'shinyblazor', paramId: 'localization' },
    ],

    // Devices / sensors
    ble: [
        { kind: 'shinyapp', paramId: 'bluetoothle' },
        { kind: 'shinyblazor', paramId: 'bluetoothle' },
    ],
    blehosting: [{ kind: 'shinyapp', paramId: 'blehosting' }],
    gps: [
        { kind: 'shinyapp', paramId: 'gps' },
        { kind: 'shinyblazor', paramId: 'gps' },
    ],
    geofencing: [{ kind: 'shinyapp', paramId: 'geofencing' }],
    speech: [
        { kind: 'shinyapp', paramId: 'shinyspeech' },
        { kind: 'shinyblazor', paramId: 'shinyspeech' },
    ],

    // Essentials
    httpserver: [{ kind: 'shinyapp', paramId: 'httpserver' }],
    notifications: [{ kind: 'shinyapp', paramId: 'notifications' }],
    aiconversation: [
        { kind: 'shinyapp', paramId: 'aiconversation' },
        { kind: 'shinyblazor', paramId: 'aiconversation' },
    ],

    // Push (MAUI = a choice; Blazor = a bool)
    push: [
        { kind: 'shinyapp', paramId: 'push', value: 'Native' },
        { kind: 'shinyblazor', paramId: 'push' },
    ],
    pushfirebase: [{ kind: 'shinyapp', paramId: 'push', value: 'Firebase Messaging' }],
    pushazure: [{ kind: 'shinyapp', paramId: 'push', value: 'Azure Notification Hubs' }],

    // Platform data
    health: [{ kind: 'shinyapp', paramId: 'health' }],
    contactstore: [{ kind: 'shinyapp', paramId: 'contactstore' }],
    music: [{ kind: 'shinyapp', paramId: 'music' }],

    // MVVM / Shell
    shell: [{ kind: 'shinyapp', paramId: 'mvvmframework', value: 'Shiny MAUI Shell' }],

    // Controls
    controls: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    'controls-desktop': [{ kind: 'shinyapp', paramId: 'shinydesktopcontrols' }],
    'controls-foldables': [{ kind: 'shinyapp', paramId: 'shinyfoldables' }],
    // Docking ships in Shiny.Maui.Controls.Desktop on MAUI, and inside the main
    // Shiny.Blazor.Controls package on Blazor (there is no Blazor add-on).
    markdown: [
        { kind: 'shinyapp', paramId: 'markdown' },
        { kind: 'shinyblazor', paramId: 'markdown' },
    ],
    mermaiddiagrams: [
        { kind: 'shinyapp', paramId: 'mermaiddiagrams' },
        { kind: 'shinyblazor', paramId: 'mermaiddiagrams' },
    ],
    barcodes: [
        { kind: 'shinyapp', paramId: 'shinybarcodes' },
        { kind: 'shinyblazor', paramId: 'shinybarcodes' },
    ],
    cameraview: [
        { kind: 'shinyapp', paramId: 'shinycameraview' },
        { kind: 'shinyblazor', paramId: 'shinycameraview' },
    ],

    // Storage
    documentdb: [
        { kind: 'shinyapp', paramId: 'documentdb' },
        { kind: 'shinyaspnet', paramId: 'documentdb', value: 'sqlite' },
    ],
    'documentdb-indexeddb': [{ kind: 'shinyblazor', paramId: 'documentdb' }],
    'documentdb-sqlserver': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'sqlserver' }],
    'documentdb-mysql': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'mysql' }],
    'documentdb-postgresql': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'postgresql' }],
    'documentdb-cosmosdb': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'cosmosdb' }],
    'documentdb-mongodb': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'mongodb' }],
    'documentdb-litedb': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'litedb' }],
    'documentdb-duckdb': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'duckdb' }],
    'documentdb-oracle': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'oracle' }],
    'documentdb-mariadb': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'mariadb' }],
    'documentdb-cockroachdb': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'cockroachdb' }],
    'documentdb-azuretable': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'azuretable' }],
    'documentdb-dynamodb': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'dynamodb' }],
    'documentdb-amazondocumentdb': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'amazondocumentdb' }],
    'documentdb-redis': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'redis' }],
    'documentdb-ravendb': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'ravendb' }],
    'documentdb-firestore': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'firestore' }],
    'documentdb-ai': [
        { kind: 'shinyapp', paramId: 'documentdb' },
        { kind: 'shinyapp', paramId: 'aidocumentdb' },
        { kind: 'shinyblazor', paramId: 'documentdb' },
        { kind: 'shinyblazor', paramId: 'aidocumentdb' },
        { kind: 'shinyaspnet', paramId: 'documentdb', value: 'sqlite' },
        { kind: 'shinyaspnet', paramId: 'aidocumentdb' },
    ],
    'documentdb-firestore-mobile': [{ kind: 'shinyapp', paramId: 'firestoremobile' }],
    datasync: [
        { kind: 'shinyapp', paramId: 'datasync' },
        { kind: 'shinyblazor', paramId: 'datasync' },
    ],

    // Hardware & device data
    beacons: [{ kind: 'shinyapp', paramId: 'beacons' }],
    obd: [{ kind: 'shinyapp', paramId: 'obd' }],
    wifi: [{ kind: 'shinyapp', paramId: 'wifi' }],
    discovery: [{ kind: 'shinyapp', paramId: 'discovery' }],
    wearables: [{ kind: 'shinyapp', paramId: 'wearables' }],
    gamepad: [
        { kind: 'shinyapp', paramId: 'gamepad' },
        { kind: 'shinyblazor', paramId: 'gamepad' },
    ],
    gamecenter: [{ kind: 'shinyapp', paramId: 'gamecenter' }],
    'region-geofencing': [{ kind: 'shinyapp', paramId: 'regiongeofencing' }],
    'region-geofencing-docdb': [
        { kind: 'shinyapp', paramId: 'regiongeofencing' },
        { kind: 'shinyapp', paramId: 'regiongeofencingdocdb' },
    ],
    screenrecorder: [
        { kind: 'shinyapp', paramId: 'screenrecord' },
        { kind: 'shinyblazor', paramId: 'screenrecord' },
    ],
    printing: [{ kind: 'shinyapp', paramId: 'printing' }],
    'printers-ble': [{ kind: 'shinyapp', paramId: 'printersble' }],
    'printers-network': [{ kind: 'shinyapp', paramId: 'printersnetwork' }],
    calendarstore: [{ kind: 'shinyapp', paramId: 'calendar' }],
    appstore: [{ kind: 'shinyapp', paramId: 'appstore' }],
    inapppurchases: [{ kind: 'shinyapp', paramId: 'inapppurchases' }],
    calldirectory: [{ kind: 'shinyapp', paramId: 'calldirectory' }],
    vpn: [{ kind: 'shinyapp', paramId: 'vpn' }],
    agesignals: [{ kind: 'shinyapp', paramId: 'agesignals' }],
    actors: [
        { kind: 'shinyapp', paramId: 'actors' },
        { kind: 'shinyblazor', paramId: 'actors' },
    ],
    liveactivities: [{ kind: 'shinyapp', paramId: 'liveactivities' }],
    appfunctions: [{ kind: 'shinyapp', paramId: 'appfunctions' }],
    'appfunctions-ai': [
        { kind: 'shinyapp', paramId: 'appfunctions' },
        { kind: 'shinyapp', paramId: 'aiappfunctions' },
    ],

    // Speech & AI
    audio: [
        { kind: 'shinyapp', paramId: 'audio' },
        { kind: 'shinyblazor', paramId: 'audio' },
    ],
    speechazure: [
        { kind: 'shinyapp', paramId: 'speechazure' },
        { kind: 'shinyblazor', paramId: 'speechazure' },
    ],
    speechelevenlabs: [
        { kind: 'shinyapp', paramId: 'speechelevenlabs' },
        { kind: 'shinyblazor', paramId: 'speechelevenlabs' },
    ],
    speechtypecast: [
        { kind: 'shinyapp', paramId: 'speechtypecast' },
        { kind: 'shinyblazor', paramId: 'speechtypecast' },
    ],
    speechopenai: [
        { kind: 'shinyapp', paramId: 'speechopenai' },
        { kind: 'shinyblazor', paramId: 'speechopenai' },
    ],
    'aiconversation-openai': [
        { kind: 'shinyapp', paramId: 'aiconversation' },
        { kind: 'shinyapp', paramId: 'aichatclient', value: 'OpenAI' },
        { kind: 'shinyblazor', paramId: 'aiconversation' },
        { kind: 'shinyblazor', paramId: 'aichatclient', value: 'OpenAI' },
    ],
    'aiconversation-copilot': [
        { kind: 'shinyapp', paramId: 'aiconversation' },
        { kind: 'shinyapp', paramId: 'aichatclient', value: 'GitHub Copilot' },
    ],
    'aiconversation-ui': [
        { kind: 'shinyapp', paramId: 'aiconversation' },
        { kind: 'shinyapp', paramId: 'aichatui' },
    ],
    'aiconversation-sqlitestore': [
        { kind: 'shinyapp', paramId: 'aiconversation' },
        { kind: 'shinyapp', paramId: 'aimessagestore' },
    ],
    faceintelligence: [{ kind: 'shinyapp', paramId: 'faceintelligence' }],
    voiceintelligence: [{ kind: 'shinyapp', paramId: 'voiceintelligence' }],
    documentintelligence: [{ kind: 'shinyapp', paramId: 'documentintelligence' }],

    // More controls
    diagram: [
        { kind: 'shinyapp', paramId: 'shinydiagram' },
        { kind: 'shinyblazor', paramId: 'shinydiagram' },
    ],

    // Extensions & server
    serialization: [
        { kind: 'shinyapp', paramId: 'serialization' },
        { kind: 'shinyblazor', paramId: 'serialization' },
        { kind: 'shinyaspnet', paramId: 'serialization' },
    ],
    'extensions-push': [{ kind: 'shinyaspnet', paramId: 'extensionspush' }],
    'aspnet-jsonpatch': [{ kind: 'shinyaspnet', paramId: 'aspnetjsonpatch' }],
    'aspnet-idempotency': [{ kind: 'shinyaspnet', paramId: 'aspnetidempotency' }],
    'aspnet-contentdigest': [{ kind: 'shinyaspnet', paramId: 'aspnetcontentdigest' }],
    'aspnet-webhooks': [{ kind: 'shinyaspnet', paramId: 'aspnetwebhooks' }],
    // ---- App Builder parity (every App Builder library maps to its Template Builder option) ----
    tableview: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    scheduler: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    floatingpanel: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    fontpicker: [{ kind: 'shinyapp', paramId: 'shinycontrols' }],
    pillview: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    imageviewer: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    imageeditor: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    chatview: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    trayicon: [{ kind: 'shinyapp', paramId: 'shinydesktopcontrols' }],
    osk: [{ kind: 'shinyblazor', paramId: 'shinycontrols' }],
    addressentry: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    applayout: [{ kind: 'shinyblazor', paramId: 'shinycontrols' }],
    autocomplete: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    badge: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    button: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    captcha: [{ kind: 'shinyblazor', paramId: 'shinycontrols' }],
    carousel: [{ kind: 'shinyblazor', paramId: 'shinycontrols' }],
    'carousel-gallery': [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    colorpicker: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    countrypicker: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    datagrid: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    'button-group': [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    'chip-group': [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    floatingtoolbar: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    gantt: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    kanban: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    'tag-entry': [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    timeline: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    zoompanview: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    dialogs: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    durationpicker: [{ kind: 'shinyapp', paramId: 'shinycontrols' }],
    expander: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    fab: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    feedback: [{ kind: 'shinyapp', paramId: 'shinycontrols' }],
    'file-drop': [
        { kind: 'shinyapp', paramId: 'shinydesktopcontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    'flex-layout': [{ kind: 'shinyapp', paramId: 'shinycontrols' }],
    'yoga-layout': [{ kind: 'shinyapp', paramId: 'shinycontrols' }],
    flyout: [{ kind: 'shinyapp', paramId: 'shinycontrols' }],
    frostedglass: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    layout: [{ kind: 'shinyblazor', paramId: 'shinycontrols' }],
    'media-picker-button': [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    modal: [{ kind: 'shinyblazor', paramId: 'shinycontrols' }],
    'motion-icons': [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    navigationpage: [{ kind: 'shinyapp', paramId: 'shinycontrols' }],
    overlay: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    'parallax-collection-view': [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    passwordstrength: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    progressbar: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    progressline: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    'quick-entry': [
        { kind: 'shinyapp', paramId: 'shinydesktopcontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    rangeslider: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    ribbon: [
        { kind: 'shinyapp', paramId: 'shinydesktopcontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    securitypin: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    sheetview: [{ kind: 'shinyblazor', paramId: 'shinycontrols' }],
    shinyimage: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    signaturepad: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    skeleton: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    slider: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    splashscreen: [{ kind: 'shinyblazor', paramId: 'shinycontrols' }],
    'staggered-grid': [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    stateview: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    tabbedpage: [{ kind: 'shinyapp', paramId: 'shinycontrols' }],
    textentry: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    toast: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    'toolbar-tabbar': [{ kind: 'shinyblazor', paramId: 'shinycontrols' }],
    tooltip: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    treeview: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    'virtualized-grid': [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    walkthrough: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    wizard: [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    office: [
        { kind: 'shinyapp', paramId: 'shinyoffice' },
        { kind: 'shinyblazor', paramId: 'shinyoffice' },
    ],
    spreadsheet: [
        { kind: 'shinyapp', paramId: 'shinyoffice' },
        { kind: 'shinyblazor', paramId: 'shinyoffice' },
    ],
    'document-viewer': [
        { kind: 'shinyapp', paramId: 'shinyoffice' },
        { kind: 'shinyblazor', paramId: 'shinyoffice' },
    ],
    'slide-viewer': [
        { kind: 'shinyapp', paramId: 'shinyoffice' },
        { kind: 'shinyblazor', paramId: 'shinyoffice' },
    ],
    notebook: [
        { kind: 'shinyapp', paramId: 'shinyoffice' },
        { kind: 'shinyblazor', paramId: 'shinyoffice' },
    ],
    'document-editor': [
        { kind: 'shinyapp', paramId: 'shinyoffice' },
        { kind: 'shinyblazor', paramId: 'shinyoffice' },
    ],
    'slide-editor': [
        { kind: 'shinyapp', paramId: 'shinyoffice' },
        { kind: 'shinyblazor', paramId: 'shinyoffice' },
    ],
    'keyboard-shortcuts': [
        { kind: 'shinyapp', paramId: 'shinycontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
    'camera-ai': [
        { kind: 'shinyapp', paramId: 'shinycameraview' },
        { kind: 'shinyapp', paramId: 'cameraai' },
        { kind: 'shinyblazor', paramId: 'shinycameraview' },
        { kind: 'shinyblazor', paramId: 'cameraai' },
    ],
    'camera-barcode': [
        { kind: 'shinyapp', paramId: 'shinycameraview' },
        { kind: 'shinyapp', paramId: 'camerabarcode' },
    ],
    'camera-documents': [
        { kind: 'shinyapp', paramId: 'shinycameraview' },
        { kind: 'shinyapp', paramId: 'cameradocuments' },
    ],
    'camera-face': [
        { kind: 'shinyapp', paramId: 'shinycameraview' },
        { kind: 'shinyapp', paramId: 'cameraface' },
    ],
    'camera-motion': [
        { kind: 'shinyapp', paramId: 'shinycameraview' },
        { kind: 'shinyapp', paramId: 'cameramotion' },
    ],
    'camera-ocr': [
        { kind: 'shinyapp', paramId: 'shinycameraview' },
        { kind: 'shinyapp', paramId: 'cameraocr' },
    ],
    keyframe: [{ kind: 'shinyapp', paramId: 'shinykeyframe' }],
    'keyframe-export': [
        { kind: 'shinyapp', paramId: 'shinykeyframe' },
        { kind: 'shinyapp', paramId: 'shinykeyframeexport' },
    ],
    mediaelement: [
        { kind: 'shinyapp', paramId: 'shinymediaelement' },
        { kind: 'shinyblazor', paramId: 'shinymediaelement' },
    ],
    speechaddins: [
        { kind: 'shinyapp', paramId: 'shinyspeechaddins' },
        { kind: 'shinyblazor', paramId: 'shinyspeechaddins' },
    ],
    'theme-aurora': [
        { kind: 'shinyapp', paramId: 'shinytheme', value: 'Aurora' },
        { kind: 'shinyblazor', paramId: 'shinytheme', value: 'Aurora' },
    ],
    'theme-material': [
        { kind: 'shinyapp', paramId: 'shinytheme', value: 'Material' },
        { kind: 'shinyblazor', paramId: 'shinytheme', value: 'Material' },
    ],
    'theme-ocean': [
        { kind: 'shinyapp', paramId: 'shinytheme', value: 'Ocean' },
        { kind: 'shinyblazor', paramId: 'shinytheme', value: 'Ocean' },
    ],
    'theme-terminal': [
        { kind: 'shinyapp', paramId: 'shinytheme', value: 'Terminal' },
        { kind: 'shinyblazor', paramId: 'shinytheme', value: 'Terminal' },
    ],
    'calendarstore-ai': [
        { kind: 'shinyapp', paramId: 'calendar' },
        { kind: 'shinyapp', paramId: 'aicalendar' },
    ],
    'contactstore-ai': [
        { kind: 'shinyapp', paramId: 'contactstore' },
        { kind: 'shinyapp', paramId: 'aicontacts' },
    ],
    'health-ai': [
        { kind: 'shinyapp', paramId: 'health' },
        { kind: 'shinyapp', paramId: 'aihealth' },
    ],
    'music-ai': [
        { kind: 'shinyapp', paramId: 'music' },
        { kind: 'shinyapp', paramId: 'aimusic' },
    ],
    'locations-ai': [
        { kind: 'shinyapp', paramId: 'gps' },
        { kind: 'shinyapp', paramId: 'ailocations' },
    ],
    'notifications-ai': [
        { kind: 'shinyapp', paramId: 'notifications' },
        { kind: 'shinyapp', paramId: 'ainotifications' },
    ],
    speechmicrosoftai: [{ kind: 'shinyapp', paramId: 'speechmicrosoftai' }],
    'blehubs-host': [{ kind: 'shinyapp', paramId: 'blehubshost' }],
    'blehubs-client': [{ kind: 'shinyapp', paramId: 'blehubsclient' }],
    'universalhubs-host': [{ kind: 'shinyapp', paramId: 'universalhubshost' }],
    'universalhubs-client': [{ kind: 'shinyapp', paramId: 'universalhubsclient' }],
    permissions: [{ kind: 'shinyapp', paramId: 'permissionsmsbuild' }],
    appdevicebridge: [
        { kind: 'shinyapp', paramId: 'appdevicebridge' },
        { kind: 'shinyblazor', paramId: 'appdevicebridge' },
        { kind: 'shinyaspnet', paramId: 'appdevicebridge' },
    ],
    'mediator-resilience': [
        { kind: 'shinyapp', paramId: 'shinymediator' },
        { kind: 'shinyblazor', paramId: 'shinymediator' },
        { kind: 'shinyblazor', paramId: 'mediatorresilience' },
        { kind: 'shinyaspnet', paramId: 'shinymediator' },
        { kind: 'shinyaspnet', paramId: 'mediatorresilience' },
    ],
    'mediator-caching': [
        { kind: 'shinyapp', paramId: 'shinymediator' },
        { kind: 'shinyapp', paramId: 'mediatorcaching' },
        { kind: 'shinyblazor', paramId: 'shinymediator' },
        { kind: 'shinyblazor', paramId: 'mediatorcaching' },
        { kind: 'shinyaspnet', paramId: 'shinymediator' },
        { kind: 'shinyaspnet', paramId: 'mediatorcaching' },
    ],
    'mediator-fluentvalidation': [
        { kind: 'shinyapp', paramId: 'shinymediator' },
        { kind: 'shinyapp', paramId: 'mediatorfluentvalidation' },
        { kind: 'shinyblazor', paramId: 'shinymediator' },
        { kind: 'shinyblazor', paramId: 'mediatorfluentvalidation' },
        { kind: 'shinyaspnet', paramId: 'shinymediator' },
        { kind: 'shinyaspnet', paramId: 'mediatorfluentvalidation' },
    ],
    'mediator-dapper': [
        { kind: 'shinyblazor', paramId: 'shinymediator' },
        { kind: 'shinyblazor', paramId: 'mediatordapper' },
        { kind: 'shinyaspnet', paramId: 'shinymediator' },
        { kind: 'shinyaspnet', paramId: 'mediatordapper' },
    ],
    'mediator-appfunctions': [
        { kind: 'shinyapp', paramId: 'shinymediator' },
        { kind: 'shinyapp', paramId: 'mediatorappfunctions' },
    ],
    'mediator-tickerq': [
        { kind: 'shinyaspnet', paramId: 'shinymediator' },
        { kind: 'shinyaspnet', paramId: 'mediatortickerq' },
    ],
    di: [
        { kind: 'shinyapp' },
        { kind: 'shinyblazor', paramId: 'di' },
        { kind: 'shinyaspnet', paramId: 'di' },
    ],
    webhost: [{ kind: 'shinyaspnet' }],
    'aspnet-acme': [{ kind: 'shinyaspnet', paramId: 'aspnetacme' }],
    'aspnet-caldav': [{ kind: 'shinyaspnet', paramId: 'aspnetcaldav' }],
    'aspnet-discovery': [{ kind: 'shinyaspnet', paramId: 'aspnetdiscovery' }],
    'aspnet-documentdb': [{ kind: 'shinyaspnet', paramId: 'aspnetdocumentdb' }],
    'aspnet-filesync': [{ kind: 'shinyaspnet', paramId: 'aspnetfilesync' }],
    'aspnet-npm': [{ kind: 'shinyaspnet', paramId: 'aspnetnpm' }],
    'aspnet-nuget': [{ kind: 'shinyaspnet', paramId: 'aspnetnuget' }],
    'aspnet-ssh': [{ kind: 'shinyaspnet', paramId: 'aspnetssh' }],
    'aspnet-tunnels': [{ kind: 'shinyaspnet', paramId: 'aspnettunnels' }],
    'aspnet-tus': [{ kind: 'shinyaspnet', paramId: 'aspnettus' }],
    'aspnet-webdav': [{ kind: 'shinyaspnet', paramId: 'aspnetwebdav' }],
    'documentdb-mcp': [
        { kind: 'shinyaspnet', paramId: 'documentdb', value: 'sqlite' },
        { kind: 'shinyaspnet', paramId: 'documentdbmcp' },
    ],
    'documentdb-odata': [
        { kind: 'shinyaspnet', paramId: 'documentdb', value: 'sqlite' },
        { kind: 'shinyaspnet', paramId: 'documentdbodata' },
    ],
    'documentdb-rest': [
        { kind: 'shinyaspnet', paramId: 'documentdb', value: 'sqlite' },
        { kind: 'shinyaspnet', paramId: 'documentdbrest' },
    ],
    'documentdb-sqlitevec': [
        { kind: 'shinyapp', paramId: 'documentdb' },
        { kind: 'shinyapp', paramId: 'documentdbvector' },
        { kind: 'shinyaspnet', paramId: 'documentdb', value: 'sqlite' },
        { kind: 'shinyaspnet', paramId: 'documentdbsqlitevec' },
    ],
    'documentdb-vectordata': [
        { kind: 'shinyapp', paramId: 'documentdb' },
        { kind: 'shinyapp', paramId: 'documentdbvectordata' },
        { kind: 'shinyblazor', paramId: 'documentdb' },
        { kind: 'shinyblazor', paramId: 'documentdbvectordata' },
        { kind: 'shinyaspnet', paramId: 'documentdb', value: 'sqlite' },
        { kind: 'shinyaspnet', paramId: 'documentdbvectordata' },
    ],
    'documentdb-jsonschema': [
        { kind: 'shinyapp', paramId: 'documentdb' },
        { kind: 'shinyapp', paramId: 'documentdbjsonschema' },
        { kind: 'shinyblazor', paramId: 'documentdb' },
        { kind: 'shinyblazor', paramId: 'documentdbjsonschema' },
        { kind: 'shinyaspnet', paramId: 'documentdb', value: 'sqlite' },
        { kind: 'shinyaspnet', paramId: 'documentdbjsonschema' },
    ],
    'documentdb-appdatasync': [
        { kind: 'shinyapp', paramId: 'documentdb' },
        { kind: 'shinyapp', paramId: 'documentdbappdatasync' },
        { kind: 'shinyblazor', paramId: 'documentdb' },
        { kind: 'shinyblazor', paramId: 'documentdbappdatasync' },
    ],
    'documentdb-sqlcipher': [
        { kind: 'shinyapp', paramId: 'documentdb' },
        { kind: 'shinyapp', paramId: 'documentdbsqlcipher' },
        { kind: 'shinyaspnet', paramId: 'documentdb', value: 'sqlcipher' },
    ],
    stores: [
        { kind: 'shinyapp', paramId: 'stores' },
        { kind: 'shinyblazor', paramId: 'stores' },
        { kind: 'shinyaspnet', paramId: 'stores' },
    ],
    reflector: [
        { kind: 'shinyapp', paramId: 'reflector' },
        { kind: 'shinyblazor', paramId: 'reflector' },
        { kind: 'shinyaspnet', paramId: 'reflector' },
    ],
    jobs: [
        { kind: 'shinyapp', paramId: 'jobs' },
        { kind: 'shinyblazor', paramId: 'jobs' },
    ],
    httptransfers: [
        { kind: 'shinyapp', paramId: 'httptransfers' },
        { kind: 'shinyblazor', paramId: 'httptransfers' },
    ],
    floorplan: [
        { kind: 'shinyapp', paramId: 'shinyfloorplan' },
        { kind: 'shinyblazor', paramId: 'shinyfloorplan' },
    ],
    'gamepad-controls': [
        { kind: 'shinyapp', paramId: 'shinygamepadcontrols' },
        { kind: 'shinyblazor', paramId: 'shinygamepadcontrols' },
    ],
    docking: [
        { kind: 'shinyapp', paramId: 'shinydesktopcontrols' },
        { kind: 'shinyblazor', paramId: 'shinycontrols' },
    ],
};

/** Labels for the mode toggle, in display priority order. */
export const KIND_LABELS: Record<TemplateKind, string> = {
    shinyapp: 'MAUI',
    shinyblazor: 'Blazor',
    shinyaspnet: 'ASP.NET',
};

const KIND_ORDER: TemplateKind[] = ['shinyapp', 'shinyblazor', 'shinyaspnet'];

/** Distinct template kinds a component maps to, in display order. */
export function mappedKinds(componentName: string): TemplateKind[] {
    const refs = componentTemplateMap[componentName];
    if (!refs) return [];
    const set = new Set(refs.map(r => r.kind));
    return KIND_ORDER.filter(k => set.has(k));
}

/** Build a minimal template state: baseline (all features off) + this component's param(s) for one kind. */
export function buildSingleLibState(componentName: string, kind: TemplateKind): TemplateState {
    const state = getBaselineState(kind);
    for (const ref of componentTemplateMap[componentName] ?? []) {
        if (ref.kind === kind && ref.paramId) state[ref.paramId] = ref.value ?? true;
    }
    return state;
}
