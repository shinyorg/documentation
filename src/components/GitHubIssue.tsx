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
            <a href={`${baseUri}/${props.number}`} target="_blank">[GitHub #{props.number}]</a>
            {props.contributor && <span> by <a href={`https://github.com/${props.contributor}`} target="_blank">{props.contributor}</a></span>}
        </div>
    );    
};

export default GitHubIssue;