import CopyToClipboardButton from './CopyToClipboardButton';
import Prism from "prismjs";
import "prismjs/components/prism-csharp";
import "prismjs/themes/prism-tomorrow.css";
import React from 'react';
import { useEffect } from 'react';

interface Props {
    source: string;
    /** Prism language id (e.g. "csharp", "xml"). Unknown/unregistered ids render as plain text. */
    language?: string;
    /** Override the label shown in the header (defaults to a friendly version of the language). */
    label?: string;
}

const LANG_LABELS: Record<string, string> = {
    csharp: 'C#',
    xml: 'XML',
};

const Syntax = (props: Props) => {
    const lang = props.language || "csharp";
    // Only attach a Prism language class when that language is actually registered;
    // otherwise render plain so unknown extensions (json, md, txt) don't break highlighting.
    const isKnown = !!Prism.languages[lang];
    const cls = isKnown ? `language-${lang}` : undefined;
    const headerLabel = props.label || LANG_LABELS[lang] || lang.toUpperCase();
    useEffect(() => Prism.highlightAll());

    return (
    <div className="syntax-block">
        <div className="syntax-block__header">
            <span className="syntax-block__lang">{headerLabel}</span>
            <CopyToClipboardButton text={props.source} />
        </div>
        <pre className="syntax-block__pre">
            <code className={cls}>
            {props.source}
            </code>
        </pre>
    </div>
    );
};

export default Syntax;