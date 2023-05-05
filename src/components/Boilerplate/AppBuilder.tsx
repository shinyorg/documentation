import { ShinyComponent, ShinyComponents, Data } from '../../consts';
import { useState } from 'react';
import NugetList from './Components/NugetList';
import MauiProgram from './Components/MauiProgram';
import AndroidManifest from './Components/AndroidManifest';
import AppleInfoPlist from './Components/AppleInfoPlist';
import AppleEntitlements from './Components/AppleEntitlements';
import AppleAppDelegate from './Components/AppleAppDelegate';
import ProjectFile from './Components/ProjectFile';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Alert from '../Alert';

const AppBuilder = () => {
  const { usesPush, usingForeground } = Data;
  const [components, setComponents] = useState<ShinyComponent[]>([]);

  const handleChange = (e: ShinyComponent) => {
    if (isSelected(e)) {
      setComponents(arr => arr.filter(c => c.id !== e.id));
    }
    else {
      setComponents(arr => [...arr, e!]);
    }
  };
  const selectAll = () => setComponents(ShinyComponents);
  const unselectAll = () => setComponents([]);

  const isSelected = (shiny: ShinyComponent): boolean => components.find(c => c.id === shiny.id) !== undefined;

  return (
    <div>
        <table>
        {ShinyComponents.map((item, index) => (
          <tr key={index}>
            <td>{item.description}</td>
            <td><input id={item.id} type="checkbox" checked={isSelected(item)} onChange={() => handleChange(item)} /></td>
          </tr>
        ))}
        </table>
        <div className="btn-container">
          <button onClick={selectAll}>Select All</button>
          <button onClick={unselectAll}>Unselect All</button>
        </div>
        {usesPush(components) && (
            <Alert type="caution">
                Using push on iOS/MacCatalyst requires you have an entitlements.plist as well as a provisioning profile that supports push.  If your app is not set to a provisioning profile with push enabled, 
                you will experience build/deployment errors on iOS and startup crashes on MAC Catalyst.
            </Alert>
        )}
        {usingForeground(components) && (
            <Alert type="caution">
                You are using a component that uses an Android foreground service!  You must have an application icon set or a drawable resource called notification in order for this background operation to work
                For additional information, please read <a href="/client/other/androidforeground">Android Foreground Services</a>
            </Alert>
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

export default AppBuilder;