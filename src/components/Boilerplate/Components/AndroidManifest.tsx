import { ShinyComponent, Data } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[]
}

const AndroidManifest = (props: Props) => {
  if (props.components.length === 0) 
    return (<div>Nothing Extra Needed</div>);

  let src = `
    <?xml version="1.0" encoding="utf-8"?>
    <manifest xmlns:android="http://schemas.android.com/apk/res/android">
      <application android:allowBackup="true" android:icon="@mipmap/appicon" android:roundIcon="@mipmap/appicon_round" android:supportsRtl="true">
      </application>
      <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
      <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
      <uses-permission android:name="android.permission.INTERNET" />      
    `;

  const addP = (perm:  string, maxSdk?: number) => {
    let s = `
      <uses-permission android:name="android.permission.${perm.toUpperCase()}" `;
    if (maxSdk !== undefined) {
      s += `android:maxSdkVersion="${maxSdk}" `;
    }
    s += `/>`;
    return s;
  };
  const addF = (feature:  string) => {
    return `
      <uses-feature android:name="android.permission.${feature.toUpperCase()}" android:required="false" />`;
  };
  const has = (feature: string): boolean => {
    return Data.hasComponent(feature, props.components);
  };

  if (has('ble') || has('blehosting') || has('beacons')) {
    src += addF('bluetooth_le');
    src += addP('bluetooth', 30);
    src += addP('bluetooth_admin', 30);
    src += addP('bluetooth_connect');
  }
  if (has('ble') && !has('beacons')) {
    src += `<uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />`;
  }
  if (!has('ble') && has('beacons')) {
    src += `<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />`;
  } 
  if (has('blehosting')) {
    src += addP( 'BLUETOOTH_ADVERTISE');
  }
  
  if (has('gps') || has('geofencing')) {
    src += addP('ACCESS_BACKGROUND_LOCATION');
    src += addF("location.gps");
    src += addF("location.network");
  }

  if (has('ble') || has('gps') || has('geofencing') || has('beacons')) {
    src += addP('ACCESS_COARSE_LOCATION');
    src += addP('ACCESS_FINE_LOCATION');
  }  

  if (has('notifications') || Data.usesPush(props.components) || has('gps') || has('ble') || has('beacons') || has('httptransfers')) {
    src += addP('POST_NOTIFICATIONS');
  }  
  if (has('gps') || has('ble') || has('beacons') || has('httptransfers')) {
    src += addP('FOREGROUND_SERVICE');
  }
  if (has('speech')) {
    src += addP("MICROPHONE");
  }

  src += `
  </manifest>`;
  return (<Syntax source={src} language="xml" />);
};
export default AndroidManifest;