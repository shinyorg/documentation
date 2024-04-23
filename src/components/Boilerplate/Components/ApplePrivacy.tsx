import React from "react";
import Syntax from "../../Syntax";
import { Data, type ShinyComponent } from '../../../consts';
export interface Props {
  components: ShinyComponent[]
}

const ApplePrivacy = (props: Props) => {
  const genPrivDataType = (type: string, linked: boolean, tracking: boolean) => {
      return `
      <dict>
          <key>NSPrivacyCollectedDataType</key>
          <string>${type}</string>
          <key>NSPrivacyCollectedDataTypeLinked</key>
          <${linked} />
          <key>NSPrivacyCollectedDataTypeTracking</key>
          <${tracking} />
          <key>NSPrivacyCollectedDataTypePurposes</key>
          <array>
              <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
          </array>
      </dict>
      `;
  };
  const has = (feature: string): boolean => {
    return Data.hasComponent(feature, props.components);
  };

  let location = '';
  if (has('gps') || has('geofencing') || has('beacons')) {
      location += "\n<!--location-->\n";
      location += genPrivDataType('NSPrivacyCollectedDataTypeCoarseLocation', true, true);
      location += genPrivDataType('NSPrivacyCollectedDataTypePreciseLocation', true, true);
  }

  let src = `
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
  <dict>
      <key>NSPrivacyAccessedAPITypes</key>
      <array>
          <dict>
              <key>NSPrivacyAccessedAPIType</key>
              <string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
              <key>NSPrivacyAccessedAPITypeReasons</key>
              <array>
                  <string>C617.1</string>
              </array>
          </dict>
          <dict>
              <key>NSPrivacyAccessedAPIType</key>
              <string>NSPrivacyAccessedAPICategorySystemBootTime</string>
              <key>NSPrivacyAccessedAPITypeReasons</key>
              <array>
                  <string>35F9.1</string>
              </array>
          </dict>
          <dict>
              <key>NSPrivacyAccessedAPIType</key>
              <string>NSPrivacyAccessedAPICategoryDiskSpace</string>
              <key>NSPrivacyAccessedAPITypeReasons</key>
              <array>
                  <string>E174.1</string>
              </array>
          </dict>
          <dict>
              <key>NSPrivacyAccessedAPIType</key>
              <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
              <key>NSPrivacyAccessedAPITypeReasons</key>
              <array>
                  <string>CA92.1</string>
              </array>
          </dict>
      </array>
      <key>NSPrivacyCollectedDataTypes</key>
      <array>
          <!--user info-->
          <dict>
              <key>NSPrivacyCollectedDataTypeUserID</key>
              <string>NSPrivacyCollectedDataTypeLocation</string>
              <key>NSPrivacyCollectedDataTypeLinked</key>
              <true />
              <key>NSPrivacyCollectedDataTypeTracking</key>
              <false />
              <key>NSPrivacyCollectedDataTypePurposes</key>
              <array>
                  <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
              </array>
          </dict>
          <dict>
              <key>NSPrivacyCollectedDataTypeEmailAddress</key>
              <string>NSPrivacyCollectedDataTypeLocation</string>
              <key>NSPrivacyCollectedDataTypeLinked</key>
              <true />
              <key>NSPrivacyCollectedDataTypeTracking</key>
              <false />
              <key>NSPrivacyCollectedDataTypePurposes</key>
              <array>
                  <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
              </array>
          </dict>
          <dict>
              <key>NSPrivacyCollectedDataTypePhoneNumber</key>
              <string>NSPrivacyCollectedDataTypeLocation</string>
              <key>NSPrivacyCollectedDataTypeLinked</key>
              <true />
              <key>NSPrivacyCollectedDataTypeTracking</key>
              <false />
              <key>NSPrivacyCollectedDataTypePurposes</key>
              <array>
                  <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
              </array>
          </dict>

          <!--crashlytics/analytics-->
          <dict>
              <key>NSPrivacyCollectedDataType</key>
              <string>NSPrivacyCollectedDataTypeOtherDiagnosticData</string>
              <key>NSPrivacyCollectedDataTypeLinked</key>
              <false />
              <key>NSPrivacyCollectedDataTypeTracking</key>
              <false />
              <key>NSPrivacyCollectedDataTypePurposes</key>
              <array>
                  <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
              </array>            
          </dict>
          <dict>
              <key>NSPrivacyCollectedDataType</key>
              <string>NSPrivacyCollectedDataTypeCrashData</string>
              <key>NSPrivacyCollectedDataTypeLinked</key>
              <true />
              <key>NSPrivacyCollectedDataTypeTracking</key>
              <false />
              <key>NSPrivacyCollectedDataTypePurposes</key>
              <array>
                  <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
              </array>
          </dict>  
          ${location}
      </array>
  </dict>
  </plist>
  `;
  return (<Syntax source={src} language="xml" />);
};
export default ApplePrivacy;
