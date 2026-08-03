import React, { useMemo, useState } from 'react';
import Prism from '../prism';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism-tomorrow.css';
import './ThemeCreator.css';
import { buildThemeData, buildThemeFiles } from './emit';
import { generateThemeZip } from './generateZip';
import { kebab, type SeedKey, type Seeds } from './tokens';

interface Preset {
    name: string;
    description: string;
    seeds: Seeds;
}

const PRESETS: Record<string, Preset> = {
    Basic: {
        name: 'Basic',
        description: 'A clean, modern blue-accented neutral palette.',
        seeds: {
            primary: '#2563EB', secondary: '#5B6472', tertiary: '#7C5CBF',
            neutral: '#5F6368', neutralVariant: '#5C6370', error: '#DC2626',
            success: '#16A34A', info: '#2563EB', warning: '#D97706', caution: '#EA580C', critical: '#DC2626',
        },
    },
    Ocean: {
        name: 'Ocean',
        description: 'A cool, calm teal/cyan palette inspired by deep water and Nordic tones.',
        seeds: {
            primary: '#0E7490', secondary: '#0F766E', tertiary: '#1D4ED8',
            neutral: '#475569', neutralVariant: '#3F5560', error: '#BE123C',
            success: '#0D9488', info: '#0891B2', warning: '#CA8A04', caution: '#C2410C', critical: '#BE123C',
        },
    },
    Material: {
        name: 'Material',
        description: 'A Material Design 3 inspired palette built around the signature M3 purple.',
        seeds: {
            primary: '#6750A4', secondary: '#625B71', tertiary: '#7D5260',
            neutral: '#605D62', neutralVariant: '#605D66', error: '#B3261E',
            success: '#2E7D32', info: '#1565C0', warning: '#F9A825', caution: '#EF6C00', critical: '#B3261E',
        },
    },
};

const SEED_GROUPS: { title: string; keys: SeedKey[] }[] = [
    { title: 'Accents', keys: ['primary', 'secondary', 'tertiary'] },
    { title: 'Neutrals', keys: ['neutral', 'neutralVariant'] },
    { title: 'Status', keys: ['success', 'info', 'warning', 'caution', 'critical', 'error'] },
];

const SEED_LABELS: Record<SeedKey, string> = {
    primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary',
    neutral: 'Neutral', neutralVariant: 'Neutral Variant', error: 'Error',
    success: 'Success', info: 'Info', warning: 'Warning', caution: 'Caution', critical: 'Critical',
};

const ACCENT_PAIRS: [string, string][] = [
    ['Primary', 'OnPrimary'], ['PrimaryContainer', 'OnPrimaryContainer'],
    ['Secondary', 'OnSecondary'], ['SecondaryContainer', 'OnSecondaryContainer'],
    ['Tertiary', 'OnTertiary'], ['TertiaryContainer', 'OnTertiaryContainer'],
];
const STATUS_PAIRS: [string, string][] = [
    ['SuccessContainer', 'OnSuccessContainer'], ['InfoContainer', 'OnInfoContainer'],
    ['WarningContainer', 'OnWarningContainer'], ['CautionContainer', 'OnCautionContainer'],
    ['CriticalContainer', 'OnCriticalContainer'], ['ErrorContainer', 'OnErrorContainer'],
];
const SURFACE_ROLES = [
    'Background', 'Surface', 'SurfaceVariant', 'SurfaceContainerLowest', 'SurfaceContainerLow',
    'SurfaceContainer', 'SurfaceContainerHigh', 'SurfaceContainerHighest', 'Outline', 'OutlineVariant',
];
const PILL_TYPES: { label: string; container: string; on: string; role: string }[] = [
    { label: 'Success', container: 'SuccessContainer', on: 'OnSuccessContainer', role: 'Success' },
    { label: 'Info', container: 'InfoContainer', on: 'OnInfoContainer', role: 'Info' },
    { label: 'Warning', container: 'WarningContainer', on: 'OnWarningContainer', role: 'Warning' },
    { label: 'Caution', container: 'CautionContainer', on: 'OnCautionContainer', role: 'Caution' },
    { label: 'Critical', container: 'CriticalContainer', on: 'OnCriticalContainer', role: 'Critical' },
];

function toSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'custom';
}

const MIME: Record<string, string> = {
    json: 'application/json',
    css: 'text/css',
    csharp: 'text/plain',
    markdown: 'text/markdown',
};

function saveAs(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}

const Icon = {
    copy: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    ),
    check: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    download: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    ),
    file: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    ),
};

function pickText(hex: string): string {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16) / 255;
    const g = parseInt(h.substring(2, 4), 16) / 255;
    const b = parseInt(h.substring(4, 6), 16) / 255;
    const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    return lum > 0.4 ? '#000000' : '#FFFFFF';
}

export default function ThemeCreator() {
    const [name, setName] = useState('My Theme');
    const [description, setDescription] = useState('A custom Shiny Controls theme.');
    const [seeds, setSeeds] = useState<Seeds>({ ...PRESETS.Basic.seeds });
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const [platformId, setPlatformId] = useState('json');
    const [fileIndex, setFileIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [zipping, setZipping] = useState(false);

    const slug = toSlug(name);
    const theme = useMemo(
        () => buildThemeData(name, slug, description, seeds),
        [name, slug, description, seeds],
    );
    const roles = mode === 'dark' ? theme.dark : theme.light;
    const roleMap = useMemo(() => Object.fromEntries(roles) as Record<string, string>, [roles]);
    const cssVars = useMemo(() => {
        const o: Record<string, string> = {};
        for (const [r, h] of roles) o['--shiny-color-' + kebab(r)] = h;
        return o as React.CSSProperties;
    }, [roles]);

    const platforms = useMemo(() => buildThemeFiles(theme), [theme]);
    const platform = platforms.find((p) => p.id === platformId) ?? platforms[0];
    const file = platform.files[Math.min(fileIndex, platform.files.length - 1)];
    const highlighted = useMemo(() => {
        const grammar = Prism.languages[file.language];
        return grammar ? Prism.highlight(file.content, grammar, file.language) : null;
    }, [file]);

    const setSeed = (k: SeedKey, v: string) => setSeeds((s) => ({ ...s, [k]: v }));
    const loadPreset = (p: Preset) => {
        setName(p.name);
        setDescription(p.description);
        setSeeds({ ...p.seeds });
    };

    const selectPlatform = (id: string) => {
        setPlatformId(id);
        setFileIndex(0);
        setCopied(false);
    };
    const selectFile = (i: number) => {
        setFileIndex(i);
        setCopied(false);
    };

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(file.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { /* clipboard unavailable */ }
    };
    const downloadFile = () => {
        saveAs(new Blob([file.content], { type: MIME[file.language] ?? 'text/plain' }), file.fileName);
    };
    const downloadZip = async () => {
        setZipping(true);
        try {
            saveAs(await generateThemeZip(slug, platforms), `${slug}-theme.zip`);
        } finally {
            setZipping(false);
        }
    };

    // `not-content` opts out of Starlight's markdown styles — its adjacent-sibling rule
    // otherwise drops a 1rem margin-top on every button after the first, which wrecks
    // the alignment of every toolbar, tab strip and segmented control below.
    return (
        <div className="theme-creator not-content">
            <div className="theme-creator__toolbar">
                <div className="tc-segment" role="group" aria-label="Preview scheme">
                    {(['light', 'dark'] as const).map((m) => (
                        <button
                            key={m}
                            className={`tc-segment__btn ${mode === m ? 'tc-segment__btn--active' : ''}`}
                            aria-pressed={mode === m}
                            onClick={() => setMode(m)}
                        >
                            {m === 'light' ? 'Light' : 'Dark'}
                        </button>
                    ))}
                </div>
                <div className="theme-creator__presets">
                    <span className="tc-label">Start from</span>
                    {Object.values(PRESETS).map((p) => (
                        <button key={p.name} className="tc-chip-btn" onClick={() => loadPreset(p)}>{p.name}</button>
                    ))}
                </div>
            </div>

            <div className="theme-creator__grid">
                {/* Controls */}
                <div className="theme-creator__panel">
                    <div className="tc-field">
                        <label htmlFor="tc-name">Theme name</label>
                        <input id="tc-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        <div className="tc-slug">slug: <code>{slug}</code></div>
                    </div>
                    <div className="tc-field">
                        <label htmlFor="tc-desc">Description</label>
                        <input id="tc-desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    {SEED_GROUPS.map((group) => (
                        <div className="tc-seed-group" key={group.title}>
                            <p className="tc-seed-group__title">{group.title}</p>
                            {group.keys.map((k) => (
                                <div className="tc-seed" key={k}>
                                    <input
                                        className="tc-seed__swatch"
                                        type="color"
                                        value={seeds[k]}
                                        aria-label={SEED_LABELS[k]}
                                        onChange={(e) => setSeed(k, e.target.value.toUpperCase())}
                                    />
                                    <span className="tc-seed__label">{SEED_LABELS[k]}</span>
                                    <input
                                        className="tc-seed__hex"
                                        type="text"
                                        value={seeds[k]}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setSeed(k, v.startsWith('#') ? v : '#' + v);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Preview */}
                <div className="tc-preview" style={cssVars}>
                    <div className="tc-preview__section">
                        <p className="tc-preview__section-title">Accent roles</p>
                        <div className="tc-chips">
                            {ACCENT_PAIRS.map(([bg, on]) => (
                                <div className="tc-chip" key={bg} style={{ background: roleMap[bg], color: roleMap[on] }}>
                                    {bg}<br /><code>{roleMap[bg]}</code>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="tc-preview__section">
                        <p className="tc-preview__section-title">Status roles</p>
                        <div className="tc-chips">
                            {STATUS_PAIRS.map(([bg, on]) => (
                                <div className="tc-chip" key={bg} style={{ background: roleMap[bg], color: roleMap[on] }}>
                                    {bg.replace('Container', '')}<br /><code>{roleMap[bg]}</code>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="tc-preview__section">
                        <p className="tc-preview__section-title">Surfaces</p>
                        <div className="tc-chips">
                            {SURFACE_ROLES.map((r) => (
                                <div className="tc-chip" key={r} style={{ background: roleMap[r], color: pickText(roleMap[r]) }}>
                                    {r}<br /><code>{roleMap[r]}</code>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="tc-preview__section">
                        <p className="tc-preview__section-title">Sample controls</p>
                        <div className="tc-row" style={{ marginBottom: '0.85rem' }}>
                            {PILL_TYPES.map((p) => (
                                <span
                                    key={p.label}
                                    className="tc-pill"
                                    style={{ background: roleMap[p.container], color: roleMap[p.on], borderColor: roleMap[p.role] }}
                                >
                                    {p.label}
                                </span>
                            ))}
                        </div>
                        <div className="tc-row" style={{ marginBottom: '0.85rem' }}>
                            <button className="tc-fab">✦ Primary</button>
                            <button className="tc-button tc-button--filled">Filled</button>
                            <button className="tc-button tc-button--tonal">Tonal</button>
                            <button className="tc-button tc-button--outline">Outlined</button>
                        </div>
                        <div className="tc-row">
                            <div className="tc-card" style={{ flex: '1 1 220px' }}>
                                <h4>Surface card</h4>
                                <p>Body text uses on-surface-variant on a surface container.</p>
                            </div>
                            <div className="tc-field-mock">Outlined text field</div>
                            <div className="tc-snackbar">Saved <a>Undo</a></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export */}
            <div className="theme-creator__export">
                <div className="tc-tabbar">
                    <div className="tc-tabs" role="tablist" aria-label="Target platform">
                        {platforms.map((p) => (
                            <button
                                key={p.id}
                                role="tab"
                                aria-selected={p.id === platform.id}
                                className={`tc-tab ${p.id === platform.id ? 'tc-tab--active' : ''}`}
                                onClick={() => selectPlatform(p.id)}
                            >
                                {p.label}
                                {p.files.length > 1 && <span className="tc-tab__count">{p.files.length}</span>}
                            </button>
                        ))}
                    </div>
                    <button className="tc-action" onClick={downloadZip} disabled={zipping}>
                        {Icon.download}
                        {zipping ? 'Generating…' : 'Download all (.zip)'}
                    </button>
                </div>

                <p className="tc-export-blurb">{platform.blurb}</p>

                {platform.files.length > 1 && (
                    <div className="tc-segment tc-segment--files" role="tablist" aria-label="Generated files">
                        {platform.files.map((f, i) => (
                            <button
                                key={f.path}
                                role="tab"
                                aria-selected={f === file}
                                className={`tc-segment__btn ${f === file ? 'tc-segment__btn--active' : ''}`}
                                onClick={() => selectFile(i)}
                            >
                                {f.fileName}
                            </button>
                        ))}
                    </div>
                )}

                <div className="tc-code-wrap">
                    <div className="tc-code-header">
                        <span className="tc-code-icon">{Icon.file}</span>
                        <code className="tc-code-path">{file.path}</code>
                        <button
                            className={`tc-ghost-btn ${copied ? 'tc-ghost-btn--ok' : ''}`}
                            onClick={copy}
                            title="Copy to clipboard"
                        >
                            {copied ? Icon.check : Icon.copy}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                        <button className="tc-ghost-btn" onClick={downloadFile} title={`Download ${file.fileName}`}>
                            {Icon.download}
                            Download
                        </button>
                    </div>
                    <pre className="tc-code">
                        {highlighted !== null
                            ? <code className={`language-${file.language}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
                            : <code>{file.content}</code>}
                    </pre>
                </div>
                <p className="tc-code-hint">{file.hint}</p>
            </div>
        </div>
    );
}
