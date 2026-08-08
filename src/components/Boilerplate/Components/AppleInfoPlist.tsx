import { Data, type ShinyComponent } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[]
}


const AppleInfoPlist = (props: Props) => {
  let src = `
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
  <dict>
  `;

  //
  //   <key>UIBackgroundModes</key>
  //   <array>
  //     <!--#if (jobs || usepush)-->
  //     <string>processing</string>
  //     <string>fetch</string>
  //     <!--#endif-->
  //     <!--#if (gps || geofencing)-->
  //     <string>location</string>
  //     <!--#endif-->
  //     <!--#if (bluetoothle)-->
  //     <string>bluetooth-central</string>
  //     <!--#endif-->
  //     <!--#if (blehosting)-->
  //     <string>bluetooth-peripheral</string>
  //     <!--#endif-->
  //     <!--#if (usepush)-->
  //     <string>remote-notification</string>
  //     <!--#endif-->
  //   </array>
  //   <!--#endif--> 

  const has = (feature: string): boolean => {
    return Data.hasComponent(feature, props.components);
  };

  const addKey = (key: string) => {
    src += `
        <key>${key}</key>
        <string>Say something useful here that your users will understand</string>
        `;
  };
  
  if (has('contactstore')) {
    addKey('NSContactsUsageDescription');
  }
  if (has('calendarstore') || has('calendarstore-ai')) {
    // iOS 17+ / Mac Catalyst / macOS.  NSCalendarsUsageDescription is the legacy (iOS < 17) key.
    addKey('NSCalendarsFullAccessUsageDescription');
    // Only needed if you request CalendarAccessType.WriteOnly (add-only) access
    addKey('NSCalendarsWriteOnlyAccessUsageDescription');
    addKey('NSCalendarsUsageDescription');
  }
  if (has('health') || has('health-ai')) {
    addKey('NSHealthShareUsageDescription');
    addKey('NSHealthUpdateUsageDescription');
    src += `
        <key>UIRequiredDeviceCapabilities</key>
        <array>
            <string>healthkit</string>
        </array>
        `;
  }
  if (has('gps') || has('geofencing') || has('spatial-geofencing')) {
    addKey('NSLocationAlwaysUsageDescription');
    addKey('NSLocationAlwaysAndWhenInUseUsageDescription');
    addKey('NSLocationWhenInUseUsageDescription');
  }
  if (has('gps')) {
    src += `
        <key>NSLocationTemporaryUsageDescriptionDictionary</key>
        <dict>
            <key>shinygps</key>
            <string>This app wants to know EXACTLY where you are</string>
        </dict>
        `;
  }
  if (has('ble') || has('obd')) {
    addKey('NSBluetoothAlwaysUsageDescription');
  }
  if (has('blehosting') || has('ble') || has('obd')) {
    addKey('NSBluetoothPeripheralUsageDescription');
  }
  if (has('discovery')) {
    // Browsing silently returns NOTHING if the service type is missing from NSBonjourServices - there
    // is no error.  List every type you browse for AND every type you publish.
    addKey('NSLocalNetworkUsageDescription');
    src += `
        <key>NSBonjourServices</key>
        <array>
            <!-- Replace these with every service type your app browses for or publishes -->
            <string>_myapp._tcp</string>
            <string>_http._tcp</string>
        </array>
        `;
  }
  if (has('speech') || has('aiconversation')) {
    addKey('NSSpeechRecognitionUsageDescription');
    addKey('NSMicrophoneUsageDescription');
  }
  if (has('music')) {
    addKey('NSAppleMusicUsageDescription');
  }
  if (has('voiceintelligence')) {
    addKey('NSMicrophoneUsageDescription');
  }
  if (has('faceintelligence') || has('documentintelligence')) {
    addKey('NSCameraUsageDescription');
  }
  if (has('jobs') || Data.usesPush(props.components) || has('gps') || has('geofencing') || has('spatial-geofencing') || has('bluetoothle') || has('blehosting')) {
    src += `
        <key>UIBackgroundModes</key>
        <array>
        `;
    if (Data.usesPush(props.components)) {
      src += `
            <string>remote-notification</string>
            `;
    }
    if (has('gps') || has('geofencing') || has('spatial-geofencing')) {
      src += `
            <string>location</string>
            `;
    }
    if (has('bluetoothle')) {
      src += `
            <string>bluetooth-central</string>
            `;
    }
    if (has('blehosting')) {
      src += `
            <string>bluetooth-peripheral</string>
            `;
    }
    if (has('jobs')) {
      src += `
            <string>processing</string>
            <string>fetch</string>
            `;
    }
    src += `
        </array>
        `;
  }
  if (has('jobs')) {
    src += `
        <key>BGTaskSchedulerPermittedIdentifiers</key>
        <array>
            <string>com.shiny.job</string>
            <string>com.shiny.jobpower</string>
            <string>com.shiny.jobnet</string>
            <string>com.shiny.jobpowernet</string>
        </array>    
        `;
  }
  src += `  
</dict>
</plist>
`;
  return (<Syntax source={src} language="xml" />);
};

export default AppleInfoPlist;