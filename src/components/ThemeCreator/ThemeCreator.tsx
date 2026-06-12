import React, { useMemo, useState } from 'react';
import './ThemeCreator.css';
import { buildThemeData, emitCss, emitJson, emitMauiDictionary, emitMauiTheme } from './emit';
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
    const [tab, setTab] = useState<'json' | 'css' | 'maui'>('json');
    const [copied, setCopied] = useState(false);

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

    const outputs = useMemo(
        () => ({
            json: emitJson(theme),
            css: emitCss(theme),
            maui:
                emitMauiTheme(theme) + '\n' +
                emitMauiDictionary(theme, false) + '\n' +
                emitMauiDictionary(theme, true),
        }),
        [theme],
    );

    const setSeed = (k: SeedKey, v: string) => setSeeds((s) => ({ ...s, [k]: v }));
    const loadPreset = (p: Preset) => {
        setName(p.name);
        setDescription(p.description);
        setSeeds({ ...p.seeds });
    };

    const current = outputs[tab];
    const fileName = tab === 'json' ? `${slug}.json` : tab === 'css' ? `shiny-theme-${slug}.css` : `${slug}-maui-themes.cs`;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(current);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { /* clipboard unavailable */ }
    };
    const download = () => {
        const blob = new Blob([current], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="theme-creator">
            <div className="theme-creator__toolbar">
                <button className={`tc-btn ${mode === 'light' ? 'tc-btn--active' : ''}`} onClick={() => setMode('light')}>Light</button>
                <button className={`tc-btn ${mode === 'dark' ? 'tc-btn--active' : ''}`} onClick={() => setMode('dark')}>Dark</button>
                <span className="theme-creator__presets">
                    <span className="tc-slug" style={{ alignSelf: 'center', marginRight: '0.25rem' }}>Start from:</span>
                    {Object.values(PRESETS).map((p) => (
                        <button key={p.name} className="tc-btn" onClick={() => loadPreset(p)}>{p.name}</button>
                    ))}
                </span>
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
                <div className="theme-creator__tabs">
                    <button className={`tc-btn ${tab === 'json' ? 'tc-btn--active' : ''}`} onClick={() => setTab('json')}>Theme JSON</button>
                    <button className={`tc-btn ${tab === 'css' ? 'tc-btn--active' : ''}`} onClick={() => setTab('css')}>Blazor CSS</button>
                    <button className={`tc-btn ${tab === 'maui' ? 'tc-btn--active' : ''}`} onClick={() => setTab('maui')}>MAUI C#</button>
                </div>
                <div className="theme-creator__code-wrap">
                    <div className="theme-creator__actions">
                        <button className="tc-btn" onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
                        <button className="tc-btn" onClick={download}>Download {fileName}</button>
                    </div>
                    <pre className="theme-creator__code"><code>{current}</code></pre>
                </div>
            </div>
        </div>
    );
}
