import CopyToClipboardButton from './CopyToClipboardButton';
import Prism from "prismjs";
import "prismjs/components/prism-csharp";
import "prismjs/themes/prism-tomorrow.css";
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
    <div>
        <pre>
            <code className={cls}>
            {props.source}
            </code>
        </pre>
        <CopyToClipboardButton text={props.source} />
    </div>
    );
};

export default Syntax;