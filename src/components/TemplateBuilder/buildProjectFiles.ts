import { templateFilesByKind, templateSourceName, type TemplateKind } from './templateFiles';
import { processTemplate, evaluateExclusionCondition } from './templateEngine';
import { computeSymbols, getBaselineState, type TemplateState } from './templateData';
import { extname } from './utils';

/** A single file in the generated project, fully processed and ready to preview or zip. */
export interface GeneratedFile {
    /** Output path relative to the project root folder (project name already substituted). */
    path: string;
    /** Processed text content; for binary files this is the original base64 string. */
    content: string;
    binary: boolean;
    /** True when this file is added/changed by a feature selection (see setup detection). */
    isSetup: boolean;
}

export interface BuildOptions {
    /** Stable GUID for {APPLICATION_ID_GUID}. Omit to use a fresh random one (zip path). */
    applicationIdGuid?: string;
    /** Compute isSetup flags via baseline diff. Default true. Zip path passes false. */
    computeSetup?: boolean;
}

/** A stable GUID so setup-detection diffs aren't polluted by the random project GUID. */
export const STABLE_GUID = '00000000-0000-4000-8000-000000000000';

/** Params kept identical between baseline and candidate so platform/framework choices never read as "setup". */
const STABLE_PARAM_IDS = ['useios', 'useandroid', 'usemaccatalyst', 'usewindows', 'Framework'];

/** Documentation / boilerplate files the user wouldn't act on — never counted as "changed". */
function isNoise(path: string): boolean {
    const name = path.split('/').pop()!.toLowerCase();
    return (
        name === 'documentation.md' ||
        name === 'readme.md' ||
        name === 'setup.md' ||
        name === 'changelog.md'
    );
}

function generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function buildReplacements(state: TemplateState, projectName: string, guid: string): Record<string, string> {
    return {
        '{APPLICATION_ID}': state.applicationId || 'com.companyname.app',
        '{DOTNET_TFM}': (state.Framework as string) || 'net10.0',
        '{DEEPLINK_HOST}': (state.deeplinks as string) || '',
        '{MSAL_CLIENT_ID}': (state.msalclientid as string) || '',
        '{MAUI_MAPS_ANDROID_KEY}': (state.mapsandroidkey as string) || '',
        '{CONNECTION_STRING}': (state.connectionstring as string) || '',
        '{APPLICATION_ID_GUID}': guid,
    };
}

function applyReplacements(content: string, replacements: Record<string, string>): string {
    let out = content;
    for (const [search, replace] of Object.entries(replacements)) {
        out = out.split(search).join(replace);
    }
    return out;
}

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface RenderedFile {
    path: string;
    content: string;
    binary: boolean;
}

/** Pure render of every (non-excluded) file for a state. No zip, no setup flags. */
function renderFiles(kind: TemplateKind, state: TemplateState, guid: string): RenderedFile[] {
    const symbols = computeSymbols(kind, state);
    const projectName = state.projectName || 'MyApp';
    const sourceName = templateSourceName[kind];
    const sourceNamePattern = new RegExp(escapeRegex(sourceName), 'g');
    // sourceName replacement is applied to paths and as a {replacement} keyed by the literal name.
    const replacements = { [sourceName]: projectName, ...buildReplacements(state, projectName, guid) };

    const out: RenderedFile[] = [];
    for (const file of templateFilesByKind[kind]) {
        if (file.excludeConditions) {
            const excluded = file.excludeConditions.some(cond => evaluateExclusionCondition(cond, symbols));
            if (excluded) continue;
        }

        const outputPath = file.path.replace(sourceNamePattern, projectName);

        if (file.binary) {
            out.push({ path: outputPath, content: file.content, binary: true });
        } else if (file.copyOnly) {
            out.push({ path: outputPath, content: applyReplacements(file.content, replacements), binary: false });
        } else {
            const processed = processTemplate(file.content, symbols, replacements, extname(file.path));
            out.push({ path: outputPath, content: processed, binary: false });
        }
    }
    return out;
}

/** Normalize for diffing: strip leading BOM, normalize EOL, trim trailing whitespace. */
function normalize(s: string): string {
    return s.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trimEnd();
}

/** Render the all-features-off baseline (stable identity) and return content by path. */
function baselineContentByPath(kind: TemplateKind, candidate: TemplateState, guid: string): Map<string, string> {
    const base: TemplateState = { ...getBaselineState(kind) };
    // Share identity + platform/framework with the candidate so only feature-driven diffs remain.
    base.projectName = candidate.projectName;
    base.applicationId = candidate.applicationId;
    for (const id of STABLE_PARAM_IDS) {
        if (id in candidate) base[id] = candidate[id];
    }
    const map = new Map<string, string>();
    for (const f of renderFiles(kind, base, guid)) {
        if (!f.binary) map.set(f.path, normalize(f.content));
    }
    return map;
}

/**
 * Build the full set of generated files for a project. Shared by the zip download
 * (computeSetup: false) and the inline preview (computeSetup: true, stable GUID).
 */
export function buildProjectFiles(kind: TemplateKind, state: TemplateState, options?: BuildOptions): GeneratedFile[] {
    const guid = options?.applicationIdGuid ?? generateGuid();
    const rendered = renderFiles(kind, state, guid);

    if (options?.computeSetup === false) {
        return rendered.map(f => ({ ...f, isSetup: false }));
    }

    const baseline = baselineContentByPath(kind, state, guid);
    return rendered.map(f => {
        // "Setup" = added or changed by a feature selection vs. the all-features-off baseline.
        let isSetup = false;
        if (!f.binary && !isNoise(f.path)) {
            const base = baseline.get(f.path);
            isSetup = base === undefined || base !== normalize(f.content);
        }
        return { ...f, isSetup };
    });
}
