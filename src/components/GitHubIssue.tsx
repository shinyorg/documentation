import React from 'react';

interface Props {
    number: number;
    contributor?: string;
    pr?: boolean;
    repo?: string
}

const GitHubIssue = (props: Props) => {
    const isPr = props.pr || false;
    const repo = props.repo || 'shiny';
    const baseUri = isPr ? `https://github.com/shinyorg/${repo}/pull/` : `https://github.com/shinyorg/${repo}/issues`;
    return (
        <div>
            <a href={`${baseUri}/${props.number}`} target="_blank">[GitHub #{props.number}]</a>
            {props.contributor && <span> by <a href={`https://github.com/${props.contributor}`} target="_blank">{props.contributor}</a></span>}
        </div>
    );    
};

export default GitHubIssue;