import React from "react";

export interface Props {
    name: string;
    showPreviewVersion?: boolean;
}

  
// https://github.com/dustinmoris/CI-BuildStats?tab=readme-ov-file#nuget-badges
const NugetBadge = (props: Props) => {
  
  let imgUrl: string = `https://buildstats.info/nuget/${props.name}`;
  if (props.showPreviewVersion === true)
        imgUrl += `?includePreReleases=true`;

    const nugetUrl: string = `https://www.nuget.org/packages/${props.name}`;
    return (<a href={nugetUrl} target="_NEWWINDOW"><img src={imgUrl} /></a>);
};
export default NugetBadge;