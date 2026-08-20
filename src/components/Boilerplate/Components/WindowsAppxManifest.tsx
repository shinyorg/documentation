import React from 'react';
import { type ShinyComponent, Data } from '../../../consts';
import Syntax from '../../Syntax';
import Alert from '../../Alert';

export interface Props {
  components: ShinyComponent[]
}

const WindowsAppxManifest = (props: Props) => {
  const has = (feature: string): boolean => {
    return Data.hasComponent(feature, props.components);
  };

  const capabilities: string[] = [];
  const notes: React.ReactNode[] = [];

  if (has('ble') || has('blehosting')) {
    capabilities.push('      <DeviceCapability Name="bluetooth" />');
  }
  if (has('speech') || has('aiconversation')) {
    capabilities.push('      <DeviceCapability Name="microphone" />');
  }
  if (has('gps') || has('geofencing')) {
    capabilities.push('      <DeviceCapability Name="location" />');
  }
  if (has('calendarstore') || has('calendarstore-ai')) {
    capabilities.push('      <uap:Capability Name="appointments" />');
  }
  // Push (WNS) and background HTTP transfers both need internet access.
  if (has('httptransfers') || has('push')) {
    if (!capabilities.some(c => c.includes('internetClient"'))) {
      capabilities.push('      <Capability Name="internetClient" />');
    }
  }
  if (has('httptransfers')) {
    capabilities.push('      <Capability Name="internetClientServer" />');
  }
  // The managed mDNS responder sends & receives on the local link (UDP 5353)
  if (has('discovery')) {
    capabilities.push('      <Capability Name="privateNetworkClientServer" />');
    notes.push(
      <p key="discovery">
        <strong>Shiny.Net.Discovery on Windows uses a managed mDNS responder on UDP 5353.</strong>{' '}
        A packaged app needs the <code>privateNetworkClientServer</code> capability, and the first
        run typically raises the Windows Defender Firewall prompt — allow it on private networks or
        discovery silently returns nothing.
      </p>
    );
  }

  if (has('wifi')) {
    capabilities.push('      <DeviceCapability Name="wiFiControl" />');
    capabilities.push('      <DeviceCapability Name="radios" />');
    notes.push(
      <p key="wifi">
        <strong>Shiny.Net.Wifi on Windows uses the WiFiAdapter WinRT API.</strong>{' '}
        <code>wiFiControl</code> is needed to scan and connect, and <code>radios</code> to power the
        adapter or set airplane mode. A packaged app missing <code>wiFiControl</code> gets{' '}
        <code>DeniedBySystem</code> back from the consent prompt rather than an empty scan.
      </p>
    );
  }

  if (has('push')) {
    notes.push(
      <p key="push">
        <strong>Shiny.Push on Windows uses WNS (Windows Push Notification Service).</strong>{' '}
        Your app <em>must</em> be packaged (<code>WindowsPackageType=MSIX</code> or a sparse package){' '}
        <em>and</em> associated with the Microsoft Store — WNS will not issue a channel URI to an
        unpackaged or unassociated build. In Visual Studio: right-click the project →{' '}
        <em>Publish</em> → <em>Associate App with the Store</em>.
      </p>
    );
  }

  if (has('calendarstore') || has('calendarstore-ai')) {
    notes.push(
      <p key="calendarstore">
        <strong>Shiny.Calendar on Windows uses <code>AppointmentStore</code>,</strong>{' '}
        which requires package identity and the <code>appointments</code> capability. Reads and
        queries cover all calendars, but create/update/delete only work inside an app-owned
        calendar — writing to a system calendar throws <code>NotSupportedException</code>.
      </p>
    );
  }

  if (has('notifications')) {
    notes.push(
      <p key="notifications">
        <strong>Shiny.Notifications on Windows uses <code>ToastNotificationManager</code>,</strong>{' '}
        which requires the app to have package identity. Either ship as a packaged MSIX or use a
        sparse package. Toast notifications do not need a capability entry, but they do need a
        valid <code>&lt;Identity&gt;</code> and <code>&lt;Applications&gt;</code> entry in{' '}
        <code>Package.appxmanifest</code> (which the MAUI templates already include).
      </p>
    );
  }

  if (capabilities.length === 0 && notes.length === 0)
    return (<div className="app-builder__empty-tab">No additional Windows capabilities needed.</div>);

  const src = capabilities.length === 0
    ? ''
    : `
  <!-- Add the following capabilities to your Package.appxmanifest -->
  <Capabilities>
${capabilities.join('\n')}
  </Capabilities>`;

  return (
    <>
      {capabilities.length > 0 && <Syntax source={src} language="xml" />}
      {notes.length > 0 && (
        <Alert type="caution" title="Windows Packaging Requirements">
          {notes}
        </Alert>
      )}
    </>
  );
};

export default WindowsAppxManifest;
