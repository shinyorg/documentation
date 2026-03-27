import { Data, ShinyComponents } from '../../consts';
import NugetList from './Components/NugetList';
import MauiProgram from './Components/MauiProgram';
import AndroidManifest from './Components/AndroidManifest';
import AndroidActivity from './Components/AndroidActivity';
import AppleInfoPlist from './Components/AppleInfoPlist';
import AppleAppDelegate from './Components/AppleAppDelegate';
import ProjectFile from './Components/ProjectFile';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Alert from '../Alert';
import React from 'react';
import ApplePrivacy from './Components/ApplePrivacy';
import WindowsAppxManifest from './Components/WindowsAppxManifest';

interface Props {
    componentName: string;
}

const LibBuilder = (props: Props) => {
  const components = ShinyComponents.filter(x => x.id === props.componentName);
  const { usesPush, usesActivity, usingForeground, usesWindows } = Data;

  return (
    <div className="app-builder">
        {usesPush(components) && (
            <Alert type="caution">
                Using push on iOS/MacCatalyst requires you have an entitlements.plist as well as a provisioning profile that supports push.  If your app is not set to a provisioning profile with push enabled,
                you will experience build/deployment errors on iOS and startup crashes on MAC Catalyst.
            </Alert>
        )}
        {usingForeground(components) && (
            <Alert type="caution">
                You are using a component that uses an Android foreground service!  You must have an application icon set or a drawable resource called notification in order for this background operation to work.
                For additional information, please read <a href="/client/other/androidforeground">Android Foreground Services</a>
            </Alert>
        )}
        <div className="app-builder__output">
            <Tabs className="app-builder__tabs">
                <TabList className="app-builder__tablist">
                    <Tab>NuGet Packages</Tab>
                    <Tab>Project File</Tab>
                    <Tab>MauiProgram.cs</Tab>
                    <Tab>AndroidManifest.xml</Tab>
                    {usesActivity(components) && <Tab>Android Activity</Tab>}
                    <Tab>Info.plist</Tab>
                    <Tab>PrivacyInfo.xcprivacy</Tab>
                    {usesPush(components) && <Tab>AppDelegate</Tab>}
                    {usesWindows(components) && <Tab>Package.appxmanifest</Tab>}
                </TabList>
                <TabPanel>
                    <NugetList components={components} />
                </TabPanel>
                <TabPanel>
                    <ProjectFile components={components} />
                </TabPanel>
                <TabPanel>
                    <MauiProgram components={components} />
                </TabPanel>
                <TabPanel>
                    <AndroidManifest components={components} />
                </TabPanel>
                {usesActivity(components) &&
                    <TabPanel><AndroidActivity components={components} /></TabPanel>
                }
                <TabPanel>
                    <AppleInfoPlist components={components} />
                </TabPanel>
                <TabPanel>
                    <ApplePrivacy components={components} />
                </TabPanel>
                {usesPush(components) &&
                    <TabPanel><AppleAppDelegate /></TabPanel>
                }
                {usesWindows(components) &&
                    <TabPanel><WindowsAppxManifest components={components} /></TabPanel>
                }
            </Tabs>
        </div>
    </div>
  );
};

export default LibBuilder;