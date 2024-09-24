import React from "react";

export interface Props {
    name: string;
    showPreviewVersion?: boolean;
    showLabel?: boolean;
}

  
const NugetBadge = (props: Props) => {
    const v = props.showPreviewVersion === true ? 'vpre' : 'v';
    let imgUrl: string = `https://img.shields.io/nuget/${v}/${props.name}?style=for-the-badge`;
    if (props.showLabel === true) {
        imgUrl += `&label=${props.name}`;
    }
    const nugetUrl: string = `https://www.nuget.org/packages/${props.name}`;
    return (<a href={nugetUrl} target="_NEWWINDOW"><img src={imgUrl} /></a>);
};
export default NugetBadge;