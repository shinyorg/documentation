import React from 'react';
import { DEFAULT_VERSION, Data, type ShinyComponent } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[];
  mode?: 'maui' | 'blazor' | 'aspnet' | 'linux';
}

const getNuget = (c: ShinyComponent, mode?: string): string => {
    if (mode === 'blazor' && c.blazorNuget) return c.blazorNuget;
    if (mode === 'aspnet' && c.aspnetNuget) return c.aspnetNuget;
    if (mode === 'linux' && c.linuxNuget) return c.linuxNuget;
    return c.nuget;
};

// TODO: usepush or local notifications
const ProjectFile = (props: Props) => {
    const { usesPush, usesHosting } = Data;
    const isMaui = !props.mode || props.mode === 'maui';

    // Collect additional nugets from components that bundle extra packages
    const extras: { id: string; nuget: string; version: string }[] = [];
    props.components.forEach(c => {
        c.additionalNugets?.forEach(a => {
            if (!extras.find(e => e.nuget === a.nuget)) {
                extras.push({ id: `extra-${a.nuget}`, nuget: a.nuget, version: a.version });
            }
        });
    });

    let nugets = [...props.components.map(c => ({ ...c, nuget: getNuget(c, props.mode) })
    ), ...extras as ShinyComponent[]]
        .filter(
            (thing, i, arr) => arr.findIndex(t => t.nuget === thing.nuget) === i
        )
        .sort((a, b) => (
            (a.nuget > b.nuget) ? 1 : ((b.nuget > a.nuget) ? -1 : 0))
        );

    const hasNotifications = nugets.find(x => x.nuget === "Shiny.Notifications") !== undefined;
    const hasPush = usesPush(props.components);

    if (isMaui && usesHosting(props.components)) {
        nugets = [...nugets, { id: "hosting", nuget: "Shiny.Hosting.Maui", version: DEFAULT_VERSION } as ShinyComponent];
    }
    if (props.mode === 'linux' && usesHosting(props.components)) {
        nugets = [...nugets, { id: "hosting", nuget: "Shiny.Hosting.Maui", version: DEFAULT_VERSION } as ShinyComponent];
    }
    let pr = "<ItemGroup>\r\n";
    nugets.map(c => {
        pr += `\t<PackageReference Include="${c.nuget}" version="${c.version}" />\r\n`;
    });
    pr += "</ItemGroup>\r\n";

    if (isMaui && nugets.find(x => x.nuget === "Shiny.Extensions.Configuration") !== undefined) {
        pr += "\r\n<ItemGroup>\r\n";
        pr += "\t<!-- Add these to your project file if you are using Shiny.Extensions.Configuration, mix & match your requirements based on platform specific configs -->\r\n";
        pr += "\t<MauiAsset Include=\"appsettings.json\" LogicalName=\"appsettings.json\" />\r\n";
        pr += "\t<MauiAsset Include=\"appsettings.apple.json\" LogicalName=\"appsettings.apple.json\" />\r\n";
        pr += "\t<MauiAsset Include=\"appsettings.ios.json\" LogicalName=\"appsettings.ios.json\" />\r\n";
        pr += "\t<MauiAsset Include=\"appsettings.maccatalyst.json\" LogicalName=\"appsettings.maccatalyst.json\" />\r\n";
        pr += "\t<MauiAsset Include=\"appsettings.android.json\" LogicalName=\"appsettings.android.json\" />\r\n";
        pr += "\t<Content Remove=\"**\appsettings.json\" />\r\n";
        pr += "\t<Content Remove=\"**\appsettings.*.json\" />\r\n";
        pr += "</ItemGroup>\r\n";
    }

    const hasHealth = nugets.find(x => x.nuget === "Shiny.Health") !== undefined;
    if (isMaui && hasHealth) {
        pr += "\r\n<ItemGroup Condition=\"$(TargetFramework.Contains('-ios'))\">\r\n";
        pr += "\t<CustomEntitlements Include=\"com.apple.developer.healthkit\" Type=\"Boolean\" Value=\"true\" Visible=\"false\" />\r\n";
        pr += "\t<CustomEntitlements Include=\"com.apple.developer.healthkit.background-delivery\" Type=\"Boolean\" Value=\"true\" Visible=\"false\" />\r\n";
        pr += "</ItemGroup>\r\n";
    }

    if (isMaui && (hasNotifications || hasPush)) {
        pr += "\r\n<ItemGroup Condition=\"$(TargetFramework.Contains('-ios'))\">\r\n";
        if (hasNotifications) {
            pr += "\t<!--\r\n";
            pr += "\t// For scheduled notifications, you need to setup \"Time Sensitive Notifications\" in the Apple Developer Portal for your app provisioning and uncomment below\r\n";
            pr += "\t// <CustomEntitlements Include=\"com.apple.developer.usernotifications.time-sensitive\" Type=\"Boolean\" Value=\"true\" Visible=\"false\" />\r\n";
            pr += "\t-->\r\n";
        }
        if (hasPush) {
            pr += "\t<CustomEntitlements Include=\"aps-environment\" Type=\"string\" Value=\"development\" Condition=\"'$(Configuration)' == 'Debug'\" Visible=\"false\" />\r\n"
            pr += "\t<CustomEntitlements Include=\"aps-environment\" Type=\"string\" Value=\"production\" Condition=\"'$(Configuration)' == 'Release'\" Visible=\"false\" />\r\n"
        }
        pr += "</ItemGroup>";
    }

    if (isMaui) {
        pr += "\r\n<ItemGroup Condition=\"$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'ios' OR $([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'maccatalyst'\">";
        pr += "\r\n\t<BundleResource Include=\"Platforms\\iOS\\PrivacyInfo.xcprivacy\" LogicalName=\"PrivacyInfo.xcprivacy\" />";
        pr += "\r\n</ItemGroup>";
    }
    

    return (<Syntax source={pr} language="xml" />);
}

export default ProjectFile;