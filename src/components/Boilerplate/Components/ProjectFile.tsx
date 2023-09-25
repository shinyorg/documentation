import React from 'react';
import { DEFAULT_VERSION, type ShinyComponent } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[]
}

const ProjectFile = (props: Props) => { 
    let nugets = props.components
        .filter(
            (thing, i, arr) => arr.findIndex(t => t.nuget === thing.nuget) === i
        )
        .sort((a, b) => (
            (a.nuget > b.nuget) ? 1 : ((b.nuget > a.nuget) ? -1 : 0))
        );

    nugets = [...nugets, { id: "hosting", nuget: "Shiny.Hosting.Maui", version: DEFAULT_VERSION } as ShinyComponent];
    let pr = "<ItemGroup>\r\n";
    nugets.map(c => {
        pr += `\t<PackageReference Include="${c.nuget}" version="${c.version}" />\r\n`;
    });
    pr += "</ItemGroup>";

    if (nugets.find(x => x.nuget === "Shiny.Extensions.Configuration") !== undefined) {
        pr += "\r\n<ItemGroup>\r\n";
        pr += "\t<!-- Add these to your project file if you are using Shiny.Extensions.Configuration, mix & match your requirements based on platform specific configs -->\r\n";
        pr += "\t<MauiAsset Include=\"appsettings.json\" LogicalName=\"appsettings.json\" />\r\n";
        pr += "\t<MauiAsset Include=\"appsettings.apple.json\" LogicalName=\"appsettings.apple.json\" />\r\n";
        pr += "\t<MauiAsset Include=\"appsettings.ios.json\" LogicalName=\"appsettings.ios.json\" />\r\n";
        pr += "\t<MauiAsset Include=\"appsettings.maccatalyst.json\" LogicalName=\"appsettings.maccatalyst.json\" />\r\n";
        pr += "\t<MauiAsset Include=\"appsettings.android.json\" LogicalName=\"appsettings.android.json\" />\r\n";
        pr += "</ItemGroup>";
    }

    return (<Syntax source={pr} language="xml" />);
}

export default ProjectFile;