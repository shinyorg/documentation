import { Data, ShinyComponents } from '../../consts';
import NugetList from './Components/NugetList';
import MauiProgram from './Components/MauiProgram';
import AndroidManifest from './Components/AndroidManifest';
import AppleInfoPlist from './Components/AppleInfoPlist';
import AppleEntitlements from './Components/AppleEntitlements';
import AppleAppDelegate from './Components/AppleAppDelegate';
import ProjectFile from './Components/ProjectFile';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Aside from '../Alert';

interface Props {
    componentName: string;
}

const LibBuilder = (props: Props) => {
  const components = ShinyComponents.filter(x => x.id === props.componentName);
  const { usesPush, usingForeground } = Data;

  return (
    <div>
        {usesPush(components) && (
            <Aside type="caution">
                Using push on iOS/MacCatalyst requires you have an entitlements.plist as well as a provisioning profile that supports push.  If your app is not set to a provisioning profile with push enabled, 
                you will experience build/deployment errors on iOS and startup crashes on MAC Catalyst.
            </Aside>
        )}
        {usingForeground(components) && (
            <Aside type="caution">
                You are using a component that uses an Android foreground service!  You must have an application icon set or a drawable resource called notification in order for this background operation to work
                For additional information, please read <a href="/client/other/androidforeground">Android Foreground Services</a>
            </Aside>
        )}
        <div>
            <Tabs>
                <TabList>
                    <Tab>Nuget</Tab>
                    <Tab>Project File (csproj)</Tab>
                    <Tab>MauiProgram.cs</Tab>
                    <Tab>AndroidManifest.xml</Tab>
                    <Tab>Info.plist</Tab>
                    {usesPush(components) && <Tab>Apple Entitlements.plist</Tab>}
                    {usesPush(components) && <Tab>Apple App Delegate</Tab>}
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
                <TabPanel>
                    <AppleInfoPlist components={components} />
                </TabPanel>
                {usesPush(components) && 
                    <TabPanel><AppleEntitlements /></TabPanel>
                }
                {usesPush(components) && 
                    <TabPanel><AppleAppDelegate /></TabPanel>
                }
            </Tabs>
        </div>
    </div>
  );
};

export default LibBuilder;