import { type ShinyComponent, ShinyComponents, Data } from '../../consts';
import { useState } from 'react';
import NugetList from './Components/NugetList';
import MauiProgram from './Components/MauiProgram';
import AndroidManifest from './Components/AndroidManifest';
import AppleInfoPlist from './Components/AppleInfoPlist';
import AppleAppDelegate from './Components/AppleAppDelegate';
import ProjectFile from './Components/ProjectFile';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Alert from '../Alert';
import React from 'react';
import AndroidActivity from './Components/AndroidActivity';
import ApplePrivacy from './Components/ApplePrivacy';
import WindowsAppxManifest from './Components/WindowsAppxManifest';

const AppBuilder = () => {
  const { usesPush, usingForeground, usesActivity, usesWindows } = Data;
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
    <div className="app-builder">
        <div className="app-builder__grid">
        {ShinyComponents.map((item, index) => (
          <label
            key={index}
            className={`app-builder__card${isSelected(item) ? ' app-builder__card--selected' : ''}`}
          >
            <input
              id={item.id}
              type="checkbox"
              checked={isSelected(item)}
              onChange={() => handleChange(item)}
              className="app-builder__checkbox"
            />
            <span className="app-builder__checkmark" />
            <span className="app-builder__label">{item.description}</span>
          </label>
        ))}
        </div>
        <div className="app-builder__actions">
          <button className="app-builder__btn app-builder__btn--primary" onClick={selectAll}>Select All</button>
          <button className="app-builder__btn app-builder__btn--secondary" onClick={unselectAll}>Clear All</button>
          <span className="app-builder__count">
            {components.length} of {ShinyComponents.length} selected
          </span>
        </div>
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
        {components.length > 0 && (
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
        )}
        {components.length === 0 && (
          <div className="app-builder__empty">
            Select one or more components above to generate your boilerplate code.
          </div>
        )}
    </div>
  );
};

export default AppBuilder;