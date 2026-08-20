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
      <application android:allowBackup="true" android:icon="@mipmap/appicon" android:roundIcon="@mipmap/appicon_round" android:supportsRtl="true">{{APP_NODES}}
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

  // nodes that must live inside <application>
  let appNodes = '';

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

  if (has('calendarstore') || has('calendarstore-ai')) {
    src += addP('READ_CALENDAR');
    src += addP('WRITE_CALENDAR');
  }

  if (has('health') || has('health-ai')) {
    src += addP('ACTIVITY_RECOGNITION');
    src += `
      <!-- Trim these to the data types your app actually uses -->
      <uses-permission android:name="android.permission.health.READ_STEPS" />
      <uses-permission android:name="android.permission.health.READ_HEART_RATE" />
      <uses-permission android:name="android.permission.health.READ_TOTAL_CALORIES_BURNED" />
      <uses-permission android:name="android.permission.health.READ_DISTANCE" />
      <uses-permission android:name="android.permission.health.READ_WEIGHT" />
      <uses-permission android:name="android.permission.health.READ_HEIGHT" />
      <uses-permission android:name="android.permission.health.READ_BODY_FAT" />
      <uses-permission android:name="android.permission.health.READ_RESTING_HEART_RATE" />
      <uses-permission android:name="android.permission.health.READ_BLOOD_PRESSURE" />
      <uses-permission android:name="android.permission.health.READ_OXYGEN_SATURATION" />
      <uses-permission android:name="android.permission.health.READ_SLEEP" />
      <uses-permission android:name="android.permission.health.READ_HYDRATION" />
      <uses-permission android:name="android.permission.health.READ_MENSTRUATION" />
      <uses-permission android:name="android.permission.health.READ_BLOOD_GLUCOSE" />
      <uses-permission android:name="android.permission.health.READ_BODY_TEMPERATURE" />
      <uses-permission android:name="android.permission.health.READ_BASAL_BODY_TEMPERATURE" />
      <uses-permission android:name="android.permission.health.READ_RESPIRATORY_RATE" />
      <uses-permission android:name="android.permission.health.READ_VO2_MAX" />
      <uses-permission android:name="android.permission.health.READ_HEART_RATE_VARIABILITY" />
      <uses-permission android:name="android.permission.health.READ_LEAN_BODY_MASS" />
      <uses-permission android:name="android.permission.health.READ_BASAL_METABOLIC_RATE" />
      <uses-permission android:name="android.permission.health.READ_ACTIVE_CALORIES_BURNED" />
      <uses-permission android:name="android.permission.health.READ_FLOORS_CLIMBED" />
      <uses-permission android:name="android.permission.health.READ_WHEELCHAIR_PUSHES" />
      <uses-permission android:name="android.permission.health.READ_SPEED" />
      <uses-permission android:name="android.permission.health.READ_POWER" />
      <uses-permission android:name="android.permission.health.READ_SEXUAL_ACTIVITY" />
      <uses-permission android:name="android.permission.health.READ_OVULATION_TEST" />
      <uses-permission android:name="android.permission.health.READ_CERVICAL_MUCUS" />
      <uses-permission android:name="android.permission.health.READ_INTERMENSTRUAL_BLEEDING" />
      <uses-permission android:name="android.permission.health.READ_EXERCISE" />
      <uses-permission android:name="android.permission.health.READ_NUTRITION" />

      <!-- Optional: include WRITE permissions for data types your app writes -->
      <uses-permission android:name="android.permission.health.WRITE_STEPS" />
      <uses-permission android:name="android.permission.health.WRITE_HEART_RATE" />
      <uses-permission android:name="android.permission.health.WRITE_TOTAL_CALORIES_BURNED" />
      <uses-permission android:name="android.permission.health.WRITE_DISTANCE" />
      <uses-permission android:name="android.permission.health.WRITE_WEIGHT" />
      <uses-permission android:name="android.permission.health.WRITE_HEIGHT" />
      <uses-permission android:name="android.permission.health.WRITE_BODY_FAT" />
      <uses-permission android:name="android.permission.health.WRITE_RESTING_HEART_RATE" />
      <uses-permission android:name="android.permission.health.WRITE_BLOOD_PRESSURE" />
      <uses-permission android:name="android.permission.health.WRITE_OXYGEN_SATURATION" />
      <uses-permission android:name="android.permission.health.WRITE_SLEEP" />
      <uses-permission android:name="android.permission.health.WRITE_HYDRATION" />
      <uses-permission android:name="android.permission.health.WRITE_MENSTRUATION" />
      <uses-permission android:name="android.permission.health.WRITE_BLOOD_GLUCOSE" />
      <uses-permission android:name="android.permission.health.WRITE_BODY_TEMPERATURE" />
      <uses-permission android:name="android.permission.health.WRITE_BASAL_BODY_TEMPERATURE" />
      <uses-permission android:name="android.permission.health.WRITE_RESPIRATORY_RATE" />
      <uses-permission android:name="android.permission.health.WRITE_VO2_MAX" />
      <uses-permission android:name="android.permission.health.WRITE_HEART_RATE_VARIABILITY" />
      <uses-permission android:name="android.permission.health.WRITE_LEAN_BODY_MASS" />
      <uses-permission android:name="android.permission.health.WRITE_BASAL_METABOLIC_RATE" />
      <uses-permission android:name="android.permission.health.WRITE_ACTIVE_CALORIES_BURNED" />
      <uses-permission android:name="android.permission.health.WRITE_FLOORS_CLIMBED" />
      <uses-permission android:name="android.permission.health.WRITE_WHEELCHAIR_PUSHES" />
      <uses-permission android:name="android.permission.health.WRITE_SPEED" />
      <uses-permission android:name="android.permission.health.WRITE_POWER" />
      <uses-permission android:name="android.permission.health.WRITE_SEXUAL_ACTIVITY" />
      <uses-permission android:name="android.permission.health.WRITE_OVULATION_TEST" />
      <uses-permission android:name="android.permission.health.WRITE_CERVICAL_MUCUS" />
      <uses-permission android:name="android.permission.health.WRITE_INTERMENSTRUAL_BLEEDING" />
      <uses-permission android:name="android.permission.health.WRITE_EXERCISE" />
      <uses-permission android:name="android.permission.health.WRITE_NUTRITION" />

      <queries>
          <package android:name="com.google.android.apps.healthdata" />
      </queries>`;

    // Android 14+ (API 34) ships Health Connect in the platform and will not grant health
    // permissions unless the app exposes this alias.  android:targetActivity must match the
    // android:name on your MainActivity's [Activity] attribute.
    appNodes += `
        <activity-alias
            android:name="ViewPermissionUsageActivity"
            android:exported="true"
            android:targetActivity="com.companyname.myapp.MainActivity"
            android:permission="android.permission.START_VIEW_PERMISSION_USAGE">
          <intent-filter>
            <action android:name="android.intent.action.VIEW_PERMISSION_USAGE" />
            <category android:name="android.intent.category.HEALTH_PERMISSIONS" />
          </intent-filter>
        </activity-alias>`;
  }

  if (has('discovery')) {
    src += `
      <!-- mDNS/DNS-SD runs through NsdManager, so INTERNET & ACCESS_NETWORK_STATE (declared above) are all
           that is required.  No CHANGE_WIFI_MULTICAST_STATE and no WifiManager.MulticastLock needed. -->`;
  }

  if (has('wifi')) {
    src += addP('ACCESS_WIFI_STATE');
    src += addP('CHANGE_WIFI_STATE');
    // ACCESS_FINE_LOCATION is NOT optional on API 33+.  NEARBY_WIFI_DEVICES unlocks scanning
    // without location, but the SSID of the joined network still requires location.
    src += addP('ACCESS_FINE_LOCATION');
    src += `
      <uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES" android:usesPermissionFlags="neverForLocation" />`;
    src += `
      <!-- Without location granted, a scan returns an EMPTY list and the SSID reads "<unknown ssid>" -
           neither fails.  Call IWifiManager.RequestAccess() before scanning. -->`;
  }

  if (has('speech') || has('aiconversation')) {
    src += addP('RECORD_AUDIO');
    src += addP('MODIFY_AUDIO_SETTINGS');
  }

  if (has('voiceintelligence')) {
    src += addP('RECORD_AUDIO');
  }

  // Note: documentintelligence is deliberately NOT here. The ML Kit document scanner runs its UI in the
  // Google Play services process under that process' own camera permission, so the app must not request it.
  if (has('faceintelligence')) {
    src += addP('CAMERA');
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
  src = src.replace('{{APP_NODES}}', appNodes);
  return (<Syntax source={src} language="xml" />);
};
export default AndroidManifest;