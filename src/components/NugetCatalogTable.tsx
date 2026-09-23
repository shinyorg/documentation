import React, { useEffect, useMemo, useState } from 'react';

export interface CatalogPackage {
    id: string;
    family: string;
    /** Docs page that references the package, when there is one */
    doc?: string;
}

interface NugetInfo {
    latest?: string;
    stable?: string;
    downloads?: number;
}

type Status = 'loading' | 'ok' | 'missing' | 'error';
type SortKey = 'name' | 'downloads';

const SEARCH = 'https://azuresearch-usnc.nuget.org/query';
const BATCH = 20;       // packageid: terms are OR'd, so one request covers a whole batch
const CONCURRENCY = 4;

const isPre = (v: string) => v.includes('-');

async function fetchBatch(ids: string[]): Promise<Map<string, NugetInfo>> {
    const q = ids.map(id => `packageid:${id}`).join(' ');
    const url = `${SEARCH}?q=${encodeURIComponent(q)}&prerelease=true&semVerLevel=2.0.0&take=${ids.length}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`NuGet search returned ${res.status}`);
    const json = await res.json();
    const map = new Map<string, NugetInfo>();
    for (const d of json.data ?? []) {
        // versions are listed oldest-first
        const versions: string[] = (d.versions ?? []).map((x: { version: string }) => x.version);
        const stable = [...versions].reverse().find(v => !isPre(v));
        map.set(String(d.id).toLowerCase(), { latest: d.version, stable, downloads: d.totalDownloads });
    }
    return map;
}

const fmt = new Intl.NumberFormat('en-US');

const NugetCatalogTable = ({ packages }: { packages: CatalogPackage[] }) => {
    const [info, setInfo] = useState<Record<string, NugetInfo>>({});
    const [status, setStatus] = useState<Record<string, Status>>({});
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState<SortKey>('name');
    const [hideMissing, setHideMissing] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const batches: string[][] = [];
        for (let i = 0; i < packages.length; i += BATCH) batches.push(packages.slice(i, i + BATCH).map(p => p.id));

        let next = 0;
        const worker = async () => {
            while (!cancelled && next < batches.length) {
                const ids = batches[next++];
                try {
                    const found = await fetchBatch(ids);
                    if (cancelled) return;
                    setInfo(prev => {
                        const n = { ...prev };
                        for (const id of ids) {
                            const f = found.get(id.toLowerCase());
                            if (f) n[id] = f;
                        }
                        return n;
                    });
                    setStatus(prev => {
                        const n = { ...prev };
                        for (const id of ids) n[id] = found.has(id.toLowerCase()) ? 'ok' : 'missing';
                        return n;
                    });
                } catch {
                    if (cancelled) return;
                    setStatus(prev => {
                        const n = { ...prev };
                        for (const id of ids) n[id] = 'error';
                        return n;
                    });
                }
            }
        };
        Promise.all(Array.from({ length: CONCURRENCY }, worker));
        return () => { cancelled = true; };
    }, [packages]);

    const loaded = Object.keys(status).length;
    const done = loaded >= packages.length;
    const missingCount = Object.values(status).filter(s => s === 'missing').length;
    const total = Object.values(info).reduce((sum, i) => sum + (i.downloads ?? 0), 0);

    const rows = useMemo(() => {
        const f = filter.trim().toLowerCase();
        let list = packages.filter(p =>
            (!f || p.id.toLowerCase().includes(f) || p.family.toLowerCase().includes(f)) &&
            !(hideMissing && status[p.id] === 'missing')
        );
        if (sort === 'downloads') {
            list = [...list].sort((a, b) => (info[b.id]?.downloads ?? -1) - (info[a.id]?.downloads ?? -1));
        }
        return list;
    }, [packages, filter, sort, hideMissing, status, info]);

    const renderVersion = (p: CatalogPackage) => {
        const s = status[p.id];
        if (!s || s === 'loading') return <span className="nuget-catalog__muted">…</span>;
        if (s === 'missing') return <span className="nuget-catalog__muted">not published</span>;
        if (s === 'error') return <span className="nuget-catalog__muted">unavailable</span>;
        const i = info[p.id];
        return (
            <>
                <code>{i.latest}</code>
                {i.latest && isPre(i.latest) && <span className="nuget-catalog__pill">beta</span>}
                {i.stable && i.stable !== i.latest && (
                    <div className="nuget-catalog__muted nuget-catalog__stable">stable <code>{i.stable}</code></div>
                )}
            </>
        );
    };

    const renderDownloads = (p: CatalogPackage) => {
        const d = info[p.id]?.downloads;
        return d === undefined ? <span className="nuget-catalog__muted">—</span> : fmt.format(d);
    };

    let lastFamily = '';

    return (
        <div className="nuget-catalog not-content">
            <div className="nuget-catalog__stats">
                <div><strong>{packages.length - (done ? missingCount : 0)}</strong><span>packages</span></div>
                <div><strong>{fmt.format(total)}</strong><span>total downloads{done ? '' : ' (loading…)'}</span></div>
            </div>
            <div className="nuget-catalog__controls">
                <input
                    type="search"
                    placeholder="Filter packages…"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    aria-label="Filter packages"
                />
                <label>
                    <input type="checkbox" checked={hideMissing} onChange={e => setHideMissing(e.target.checked)} />
                    Hide unpublished{missingCount > 0 ? ` (${missingCount})` : ''}
                </label>
            </div>
            <div className="nuget-catalog__scroll">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <button type="button" onClick={() => setSort('name')} aria-pressed={sort === 'name'}>
                                    Package {sort === 'name' ? '▲' : ''}
                                </button>
                            </th>
                            <th>Latest version</th>
                            <th className="nuget-catalog__num">
                                <button type="button" onClick={() => setSort('downloads')} aria-pressed={sort === 'downloads'}>
                                    Downloads {sort === 'downloads' ? '▼' : ''}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(p => {
                            const header = sort === 'name' && p.family !== lastFamily;
                            lastFamily = p.family;
                            return (
                                <React.Fragment key={p.id}>
                                    {header && (
                                        <tr className="nuget-catalog__group"><th colSpan={3}>{p.family}</th></tr>
                                    )}
                                    <tr>
                                        <td>
                                            <a href={`https://www.nuget.org/packages/${p.id}`} target="_blank" rel="noopener noreferrer">{p.id}</a>
                                            {p.doc && <a className="nuget-catalog__doc" href={p.doc}>docs</a>}
                                        </td>
                                        <td>{renderVersion(p)}</td>
                                        <td className="nuget-catalog__num">{renderDownloads(p)}</td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                        {rows.length === 0 && (
                            <tr><td colSpan={3} className="nuget-catalog__muted">No packages match “{filter}”.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <style>{`
.nuget-catalog { margin-top: 1rem; }
.nuget-catalog__stats { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; }
.nuget-catalog__stats > div { flex: 1 1 10rem; padding: .75rem 1rem; border: 1px solid var(--sl-color-gray-5); border-radius: .5rem; background: var(--sl-color-gray-7, var(--sl-color-black)); display: flex; flex-direction: column; }
.nuget-catalog__stats strong { font-size: 1.5rem; color: var(--sl-color-white); font-variant-numeric: tabular-nums; }
.nuget-catalog__stats span { font-size: .85rem; color: var(--sl-color-gray-3); }
.nuget-catalog__controls { display: flex; flex-wrap: wrap; gap: .75rem 1rem; align-items: center; margin-bottom: .75rem; }
.nuget-catalog__controls input[type=search] { flex: 1 1 14rem; padding: .45rem .7rem; border-radius: .4rem; border: 1px solid var(--sl-color-gray-5); background: var(--sl-color-black); color: var(--sl-color-white); font: inherit; }
.nuget-catalog__controls label { display: inline-flex; gap: .4rem; align-items: center; font-size: .9rem; color: var(--sl-color-gray-2); }
.nuget-catalog__scroll { overflow-x: auto; border: 1px solid var(--sl-color-gray-5); border-radius: .5rem; }
.nuget-catalog table { width: 100%; border-collapse: collapse; font-size: .9rem; }
.nuget-catalog th, .nuget-catalog td { padding: .45rem .75rem; text-align: left; border-bottom: 1px solid var(--sl-color-gray-6); vertical-align: top; }
.nuget-catalog thead th { background: var(--sl-color-gray-6); white-space: nowrap; }
.nuget-catalog thead button { all: unset; cursor: pointer; font-weight: 600; color: var(--sl-color-white); }
.nuget-catalog thead button:focus-visible { outline: 2px solid var(--sl-color-accent); }
.nuget-catalog__group th { background: var(--sl-color-accent-low); color: var(--sl-color-accent-high); font-size: .8rem; text-transform: uppercase; letter-spacing: .04em; }
.nuget-catalog td a { color: var(--sl-color-text-accent); text-decoration: none; word-break: break-word; }
.nuget-catalog td a:hover { text-decoration: underline; }
.nuget-catalog__doc { margin-left: .5rem; font-size: .75rem; padding: 0 .4rem; border: 1px solid var(--sl-color-gray-5); border-radius: 999px; }
.nuget-catalog__num { text-align: right !important; font-variant-numeric: tabular-nums; white-space: nowrap; }
.nuget-catalog code { font-size: .85em; white-space: nowrap; }
.nuget-catalog__pill { margin-left: .4rem; font-size: .7rem; padding: .05rem .4rem; border-radius: 999px; background: var(--sl-color-orange-low, #fde68a); color: var(--sl-color-orange-high, #92400e); }
.nuget-catalog__stable { font-size: .8rem; margin-top: .15rem; }
.nuget-catalog__muted { color: var(--sl-color-gray-3); }
`}</style>
        </div>
    );
};

export default NugetCatalogTable;
