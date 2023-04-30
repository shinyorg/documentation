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

const App = () => {
  const { usesPush } = Data;
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

export default App;