import React, { useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-csharp';
import 'prismjs/themes/prism-tomorrow.css';
import CopyToClipboardButton from '../CopyToClipboardButton';

interface Props {
    source: string;
    /** Prism language id (e.g. "csharp", "xml"); unknown ids render as plain text. */
    language?: string;
    /** 1-based line numbers to emphasise (added/changed by the selected library). */
    changedLines?: number[];
    label?: string;
}

const LANG_LABELS: Record<string, string> = { csharp: 'C#', xml: 'XML' };

function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Line-by-line code viewer with per-line syntax highlighting and a left-rail
 * highlight on the lines a library selection adds/changes. Per-line highlighting
 * keeps changed-line mapping exact (no token splitting across lines).
 */
const CodeView = ({ source, language, changedLines, label }: Props) => {
    const lang = language || '';
    const grammar = lang ? Prism.languages[lang] : undefined;
    const headerLabel = label || LANG_LABELS[lang] || (lang ? lang.toUpperCase() : 'TEXT');
    const changed = useMemo(() => new Set(changedLines ?? []), [changedLines]);

    const lines = useMemo(() => {
        const raw = source.replace(/\n$/, '').split('\n');
        return raw.map(line => (grammar ? Prism.highlight(line, grammar, lang) : escapeHtml(line)));
    }, [source, grammar, lang]);

    return (
        <div className="syntax-block">
            <div className="syntax-block__header">
                <span className="syntax-block__lang">{headerLabel}</span>
                <CopyToClipboardButton text={source} />
            </div>
            <pre className="syntax-block__pre code-view">
                <code className={grammar ? `language-${lang}` : undefined}>
                    {lines.map((html, i) => (
                        <span
                            key={i}
                            className={`code-view__line${changed.has(i + 1) ? ' code-view__line--changed' : ''}`}
                        >
                            <span className="code-view__gutter">{i + 1}</span>
                            <span className="code-view__code" dangerouslySetInnerHTML={{ __html: html || '​' }} />
                        </span>
                    ))}
                </code>
            </pre>
        </div>
    );
};

export default CodeView;
