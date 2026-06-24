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
    paramId: string;
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
    stores: [{ kind: 'shinyblazor', paramId: 'stores' }],
    reflector: [
        { kind: 'shinyaspnet', paramId: 'reflector' },
        { kind: 'shinyblazor', paramId: 'reflector' },
    ],
    di: [{ kind: 'shinyblazor', paramId: 'di' }],
    blazorhost: [{ kind: 'shinyblazor', paramId: 'blazorhost' }],

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
    jobs: [{ kind: 'shinyapp', paramId: 'jobs' }],
    httptransfers: [{ kind: 'shinyapp', paramId: 'httptransfers' }],
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
    'controls-kiosk': [{ kind: 'shinyblazor', paramId: 'shinykiosk' }],
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
    spatial: [{ kind: 'shinyapp', paramId: 'geospatialdb' }],
    documentdb: [
        { kind: 'shinyapp', paramId: 'documentdb' },
        { kind: 'shinyaspnet', paramId: 'documentdb', value: 'sqlite' },
    ],
    'documentdb-indexeddb': [{ kind: 'shinyblazor', paramId: 'documentdb' }],
    'documentdb-sqlcipher': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'sqlcipher' }],
    'documentdb-sqlserver': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'sqlserver' }],
    'documentdb-mysql': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'mysql' }],
    'documentdb-postgresql': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'postgresql' }],
    'documentdb-cosmosdb': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'cosmosdb' }],
    'documentdb-mongodb': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'mongodb' }],
    'documentdb-litedb': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'litedb' }],
    'documentdb-duckdb': [{ kind: 'shinyaspnet', paramId: 'documentdb', value: 'duckdb' }],
    'documentdb-diagnostics': [
        { kind: 'shinyapp', paramId: 'documentdb' },
        { kind: 'shinyapp', paramId: 'documentdbdiagnostics' },
        { kind: 'shinyblazor', paramId: 'documentdb' },
        { kind: 'shinyblazor', paramId: 'documentdbdiagnostics' },
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
        if (ref.kind === kind) state[ref.paramId] = ref.value ?? true;
    }
    return state;
}
