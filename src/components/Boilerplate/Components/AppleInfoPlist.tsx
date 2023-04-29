import { Data, ShinyComponent } from '../../../consts';
import CopyToClipboardButton from './CopyToClipboardButton';

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
  //     <!--#if (gps || geofencing || beacons)-->
  //     <string>location</string>
  //     <!--#endif-->
  //     <!--#if (bluetoothle || beacons)-->
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
  
  if (has('gps') || has('geofencing') || has('beacons')) {
    addKey('NSLocationAlwaysUsageDescription');
    addKey('NSLocationAlwaysAndWhenInUseUsageDescription');
    addKey('NSLocationWhenInUseUsageDescription');
  }
  if (has('ble')) {
    addKey('NSBluetoothAlwaysUsageDescription');
  }
  if (has('blehosting') || has('ble')) {
    addKey('NSBluetoothPeripheralUsageDescription');
  }
  if (has('speech')) {
    addKey('NSSpeechRecognitionUsageDescription');
  }
  if (has('jobs') || Data.usesPush(props.components) || has('gps') || has('geofencing') || has('beacons') || has('bluetoothle') || has('blehosting')) {
    src += `
        <key>UIBackgroundModes</key>
        <array>
        `;
    if (Data.usesPush(props.components)) {
      src += `
            <string>remote-notification</string>
            `;
    }
    if (has('gps') || has('geofencing') || has('beacons')) {
      src += `
            <string>location</string>
            `;
    }
    if (has('bluetoothle') || has('beacons')) {
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
  return (
    <>
      <div>{src}</div>
      <CopyToClipboardButton text={src} />
    </>
  );
};

export default AppleInfoPlist;