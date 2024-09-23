import React from "react";

export interface Props {
    name: string;
    showPreviewVersion?: boolean;
}

  
const NugetBadge = (props: Props) => {

    let imgUrl: string = `https://img.shields.io/nuget/`;
    imgUrl += props.showPreviewVersion === true ? 'vpre' : 'v';
    imgUrl += `/${props.name}?label=${props.name}&style=for-the-badge`;

    const nugetUrl: string = `https://www.nuget.org/packages/${props.name}`;
    return (<a href={nugetUrl} target="_NEWWINDOW"><img src={imgUrl} /></a>);
};
export default NugetBadge;