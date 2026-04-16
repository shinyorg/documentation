import { type ShinyComponent, ShinyComponents, ShinyCategories, BLAZOR_COMPATIBLE_IDS, ASPNET_COMPATIBLE_IDS, ASPNET_ONLY_IDS, Data } from '../../consts';
import { useState } from 'react';
import NugetList from './Components/NugetList';
import MauiProgram from './Components/MauiProgram';
import AndroidManifest from './Components/AndroidManifest';
import AppleInfoPlist from './Components/AppleInfoPlist';
import AppleAppDelegate from './Components/AppleAppDelegate';
import ProjectFile from './Components/ProjectFile';
import BlazorProgram from './Components/BlazorProgram';
import BlazorIndexHtml from './Components/BlazorIndexHtml';
import AspNetProgram from './Components/AspNetProgram';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Alert from '../Alert';
import React from 'react';
import AndroidActivity from './Components/AndroidActivity';
import ApplePrivacy from './Components/ApplePrivacy';
import WindowsAppxManifest from './Components/WindowsAppxManifest';

type AppMode = 'maui' | 'blazor' | 'aspnet';

const AppBuilder = () => {
  const { usesPush, usingForeground, usesActivity, usesWindows, hasPlatformConfig } = Data;
  const [components, setComponents] = useState<ShinyComponent[]>([]);
  const [mode, setMode] = useState<AppMode>('maui');

  const isMaui = mode === 'maui';
  const showPlatformConfig = hasPlatformConfig(components);
  const hasMediator = Data.hasComponent('mediator', components);

  const availableComponents = isMaui
    ? ShinyComponents.filter(c => !ASPNET_ONLY_IDS.includes(c.id))
    : mode === 'blazor'
      ? ShinyComponents.filter(c => BLAZOR_COMPATIBLE_IDS.includes(c.id))
      : ShinyComponents.filter(c => ASPNET_COMPATIBLE_IDS.includes(c.id));

  const handleModeChange = (newMode: AppMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setComponents([]);
  };

  const handleChange = (e: ShinyComponent) => {
    if (isSelected(e)) {
      setComponents(arr => arr.filter(c => c.id !== e.id));
    }
    else {
      setComponents(arr => [...arr, e!]);
    }
  };
  const selectAll = () => setComponents(availableComponents);
  const unselectAll = () => setComponents([]);

  const isSelected = (shiny: ShinyComponent): boolean => components.find(c => c.id === shiny.id) !== undefined;

  const renderTabs = () => {
    if (mode === 'blazor') {
      return (
        <Tabs className="app-builder__tabs">
          <TabList className="app-builder__tablist">
            <Tab>NuGet Packages</Tab>
            <Tab>Project File</Tab>
            <Tab>Program.cs</Tab>
            {hasMediator && <Tab>index.html</Tab>}
          </TabList>
          <TabPanel>
            <NugetList components={components} mode="blazor" />
          </TabPanel>
          <TabPanel>
            <ProjectFile components={components} mode="blazor" />
          </TabPanel>
          <TabPanel>
            <BlazorProgram components={components} />
          </TabPanel>
          {hasMediator &&
            <TabPanel><BlazorIndexHtml /></TabPanel>
          }
        </Tabs>
      );
    }
    if (mode === 'aspnet') {
      return (
        <Tabs className="app-builder__tabs">
          <TabList className="app-builder__tablist">
            <Tab>NuGet Packages</Tab>
            <Tab>Project File</Tab>
            <Tab>Program.cs</Tab>
          </TabList>
          <TabPanel>
            <NugetList components={components} mode="aspnet" />
          </TabPanel>
          <TabPanel>
            <ProjectFile components={components} mode="aspnet" />
          </TabPanel>
          <TabPanel>
            <AspNetProgram components={components} />
          </TabPanel>
        </Tabs>
      );
    }
    return (
      <Tabs className="app-builder__tabs">
        <TabList className="app-builder__tablist">
          <Tab>NuGet Packages</Tab>
          <Tab>Project File</Tab>
          <Tab>MauiProgram.cs</Tab>
          {showPlatformConfig && <Tab>AndroidManifest.xml</Tab>}
          {usesActivity(components) && <Tab>Android Activity</Tab>}
          {showPlatformConfig && <Tab>Info.plist</Tab>}
          {showPlatformConfig && <Tab>PrivacyInfo.xcprivacy</Tab>}
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
        {showPlatformConfig &&
          <TabPanel><AndroidManifest components={components} /></TabPanel>
        }
        {usesActivity(components) &&
          <TabPanel><AndroidActivity components={components} /></TabPanel>
        }
        {showPlatformConfig &&
          <TabPanel><AppleInfoPlist components={components} /></TabPanel>
        }
        {showPlatformConfig &&
          <TabPanel><ApplePrivacy components={components} /></TabPanel>
        }
        {usesPush(components) &&
          <TabPanel><AppleAppDelegate /></TabPanel>
        }
        {usesWindows(components) &&
          <TabPanel><WindowsAppxManifest components={components} /></TabPanel>
        }
      </Tabs>
    );
  };

  return (
    <div className="app-builder">
        <div className="app-builder__mode-toggle">
          <button
            className={`app-builder__mode-btn${mode === 'maui' ? ' app-builder__mode-btn--active' : ''}`}
            onClick={() => handleModeChange('maui')}
          >
            MAUI
          </button>
          <button
            className={`app-builder__mode-btn${mode === 'blazor' ? ' app-builder__mode-btn--active' : ''}`}
            onClick={() => handleModeChange('blazor')}
          >
            Blazor
          </button>
          <button
            className={`app-builder__mode-btn${mode === 'aspnet' ? ' app-builder__mode-btn--active' : ''}`}
            onClick={() => handleModeChange('aspnet')}
          >
            ASP.NET
          </button>
        </div>
        <div className="app-builder__categories">
        {ShinyCategories.map(cat => {
          const items = availableComponents.filter(c => c.category === cat.id);
          if (items.length === 0) return null;
          const style = {
            '--cat-color': cat.color,
            '--cat-tint': cat.tint,
            '--cat-tint-dark': cat.tintDark,
          } as React.CSSProperties;
          return (
            <section
              key={cat.id}
              className={`app-builder__category app-builder__category--span-${cat.span}`}
              style={style}
            >
              <header className="app-builder__category-header">
                <span className="app-builder__category-title">{cat.title}</span>
                <span className="app-builder__category-count">{items.length}</span>
              </header>
              <div className="app-builder__category-items">
                {items.map(item => (
                  <label
                    key={item.id}
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
            </section>
          );
        })}
        </div>
        <div className="app-builder__actions">
          <button className="app-builder__btn app-builder__btn--primary" onClick={selectAll}>Select All</button>
          <button className="app-builder__btn app-builder__btn--secondary" onClick={unselectAll}>Clear All</button>
          <span className="app-builder__count">
            {components.length} of {availableComponents.length} selected
          </span>
        </div>
        {isMaui && usesPush(components) && (
            <Alert type="caution">
                Using push on iOS/MacCatalyst requires you have an entitlements.plist as well as a provisioning profile that supports push.  If your app is not set to a provisioning profile with push enabled,
                you will experience build/deployment errors on iOS and startup crashes on MAC Catalyst.
            </Alert>
        )}
        {isMaui && usingForeground(components) && (
            <Alert type="caution">
                You are using a component that uses an Android foreground service!  You must have an application icon set or a drawable resource called notification in order for this background operation to work.
                For additional information, please read <a href="/client/other/androidforeground">Android Foreground Services</a>
            </Alert>
        )}
        {components.length > 0 && (
          <div className="app-builder__output">
            {renderTabs()}
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
