import CopyToClipboardButton from './CopyToClipboardButton';
import Prism from "prismjs";
import "prismjs/components/prism-csharp";
import "prismjs/themes/prism-tomorrow.css";
import React from 'react';
import { useEffect } from 'react';

interface Props {
    source: string;
    language?: "csharp" | "xml";
}

const Syntax = (props: Props) => {
    const lang = props.language || "csharp";
    const cls = `language-${lang}`;
    useEffect(() => Prism.highlightAll());

    return (
    <div className="syntax-block">
        <div className="syntax-block__header">
            <span className="syntax-block__lang">{lang === 'csharp' ? 'C#' : lang.toUpperCase()}</span>
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