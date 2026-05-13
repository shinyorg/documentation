import React from 'react';
import { type ShinyComponent, Data } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[]
}

const AndroidManifest = (props: Props) => {
  if (props.components.length === 0)
    return (<div className="app-builder__empty-tab">No additional manifest entries needed.</div>);

  let src = `
    <?xml version="1.0" encoding="utf-8"?>
    <manifest xmlns:android="http://schemas.android.com/apk/res/android">
      <application android:allowBackup="true" android:icon="@mipmap/appicon" android:roundIcon="@mipmap/appicon_round" android:supportsRtl="true">
      </application>
      <uses-permission android:name="android.permission.BATTERY_STATS" />
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
      <uses-feature android:name="android.hardware.${feature.toUpperCase()}" android:required="false" />`;
  };
  const has = (feature: string): boolean => {
    return Data.hasComponent(feature, props.components);
  };

  if (has('ble') || has('blehosting') || has('obd')) {
    src += addF('bluetooth_le');
    src += addP('bluetooth', 30);
    src += addP('bluetooth_admin', 30);
    src += addP('bluetooth_connect');
  }
  if (has('ble') || has('obd')) {
    src += `<uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />`;
  }
  if (has('blehosting')) {
    src += addP( 'BLUETOOTH_ADVERTISE');
  }
  
  if (has('gps') || has('geofencing') || has('spatial-geofencing')) {
    src += addP('ACCESS_BACKGROUND_LOCATION');
    src += addF("location.gps");
    src += addF("location.network");
  }

  if (has('ble') || has('obd') || has('gps') || has('geofencing') || has('spatial-geofencing')) {
    src += addP('ACCESS_COARSE_LOCATION');
    src += addP('ACCESS_FINE_LOCATION');
  }

  if (has('contactstore')) {
    src += addP('READ_CONTACTS');
    src += addP('WRITE_CONTACTS');
  }

  if (has('health')) {
    src += addP('ACTIVITY_RECOGNITION');
    src += `
      <uses-permission android:name="android.permission.health.READ_STEPS" />
      <uses-permission android:name="android.permission.health.READ_HEART_RATE" />
      <uses-permission android:name="android.permission.health.READ_TOTAL_ENERGY_BURNED" />
      <uses-permission android:name="android.permission.health.READ_DISTANCE" />
      <uses-permission android:name="android.permission.health.READ_WEIGHT" />
      <uses-permission android:name="android.permission.health.READ_HEIGHT" />
      <uses-permission android:name="android.permission.health.READ_BODY_FAT" />
      <uses-permission android:name="android.permission.health.READ_RESTING_HEART_RATE" />
      <uses-permission android:name="android.permission.health.READ_BLOOD_PRESSURE" />
      <uses-permission android:name="android.permission.health.READ_OXYGEN_SATURATION" />
      <uses-permission android:name="android.permission.health.READ_SLEEP" />
      <uses-permission android:name="android.permission.health.READ_HYDRATION" />

      <!-- Optional: include WRITE permissions for data types your app writes -->
      <uses-permission android:name="android.permission.health.WRITE_STEPS" />
      <uses-permission android:name="android.permission.health.WRITE_HEART_RATE" />
      <uses-permission android:name="android.permission.health.WRITE_TOTAL_ENERGY_BURNED" />
      <uses-permission android:name="android.permission.health.WRITE_DISTANCE" />
      <uses-permission android:name="android.permission.health.WRITE_WEIGHT" />
      <uses-permission android:name="android.permission.health.WRITE_HEIGHT" />
      <uses-permission android:name="android.permission.health.WRITE_BODY_FAT" />
      <uses-permission android:name="android.permission.health.WRITE_RESTING_HEART_RATE" />
      <uses-permission android:name="android.permission.health.WRITE_BLOOD_PRESSURE" />
      <uses-permission android:name="android.permission.health.WRITE_OXYGEN_SATURATION" />
      <uses-permission android:name="android.permission.health.WRITE_SLEEP" />
      <uses-permission android:name="android.permission.health.WRITE_HYDRATION" />

      <queries>
          <package android:name="com.google.android.apps.healthdata" />
      </queries>`;
  }

  if (has('speech') || has('aiconversation')) {
    src += addP('RECORD_AUDIO');
  }

  if (has('music')) {
    src += `
      <!-- Android 13+ (API 33+) -->`;
    src += addP('READ_MEDIA_AUDIO');
    src += `
      <!-- Android 12 and below (API < 33) -->`;
    src += addP('READ_EXTERNAL_STORAGE', 32);
  }

  if (has('notifications') || Data.usesPush(props.components) || has('gps') || has('spatial-geofencing') || has('ble') || has('httptransfers')) {
    src += addP('POST_NOTIFICATIONS');
  }
  if (has('gps') || has('spatial-geofencing') || has('ble') || has('httptransfers')) {
    src += addP('FOREGROUND_SERVICE');
  }
  if (has('gps') || has('spatial-geofencing')) {
    src += addP('FOREGROUND_SERVICE_LOCATION');
  }
  if (has('httptransfers')) {
    src += addP('FOREGROUND_SERVICE_DATA_SYNC');
  }

  src += `
  </manifest>`;
  return (<Syntax source={src} language="xml" />);
};
export default AndroidManifest;