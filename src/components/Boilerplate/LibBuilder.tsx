import { Data, BLAZOR_COMPATIBLE_IDS, ASPNET_COMPATIBLE_IDS, ShinyComponents } from '../../consts';
import { useState } from 'react';
import NugetList from './Components/NugetList';
import MauiProgram from './Components/MauiProgram';
import AndroidManifest from './Components/AndroidManifest';
import AndroidActivity from './Components/AndroidActivity';
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
import ApplePrivacy from './Components/ApplePrivacy';
import WindowsAppxManifest from './Components/WindowsAppxManifest';

type AppMode = 'maui' | 'blazor' | 'aspnet';

interface Props {
    componentName: string;
}

const LibBuilder = (props: Props) => {
  const components = ShinyComponents.filter(x => x.id === props.componentName);
  const { usesPush, usesActivity, usingForeground, usesWindows, hasPlatformConfig } = Data;
  const isBlazorCompatible = BLAZOR_COMPATIBLE_IDS.includes(props.componentName);
  const isAspNetCompatible = ASPNET_COMPATIBLE_IDS.includes(props.componentName);
  const [mode, setMode] = useState<AppMode>('maui');

  const isMaui = mode === 'maui';
  const showPlatformConfig = hasPlatformConfig(components);
  const hasMediator = props.componentName === 'mediator';

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
        {(isBlazorCompatible || isAspNetCompatible) && (
          <div className="app-builder__mode-toggle">
            <button
              className={`app-builder__mode-btn${mode === 'maui' ? ' app-builder__mode-btn--active' : ''}`}
              onClick={() => setMode('maui')}
            >
              MAUI
            </button>
            {isBlazorCompatible && (
              <button
                className={`app-builder__mode-btn${mode === 'blazor' ? ' app-builder__mode-btn--active' : ''}`}
                onClick={() => setMode('blazor')}
              >
                Blazor
              </button>
            )}
            {isAspNetCompatible && (
              <button
                className={`app-builder__mode-btn${mode === 'aspnet' ? ' app-builder__mode-btn--active' : ''}`}
                onClick={() => setMode('aspnet')}
              >
                ASP.NET
              </button>
            )}
          </div>
        )}
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
        <div className="app-builder__output">
          {renderTabs()}
        </div>
    </div>
  );
};

export default LibBuilder;
