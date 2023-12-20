import React from 'react';

interface Props {
    number: number;
    contributor?: string;
    pr?: boolean;
}

const GitHubIssue = (props: Props) => {
    const isPr = props.pr || false;
    const baseUri = isPr ? 'https://github.com/shinyorg/shiny/pull/' : 'https://github.com/shinyorg/shiny/issues';
    return (
        <div>
            <a href={`${baseUri}/${props.number}`}>[{props.number}]</a>
            {props.contributor && <span> by <a href={`https://github.com/${props.contributor}`}>{props.contributor}</a></span>}
        </div>
    );    
};

export default GitHubIssue;