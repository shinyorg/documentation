import React from 'react';
import { type ShinyComponent, Data } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[]
}

const WindowsAppxManifest = (props: Props) => {
  const has = (feature: string): boolean => {
    return Data.hasComponent(feature, props.components);
  };

  const capabilities: string[] = [];

  if (has('ble') || has('blehosting')) {
    capabilities.push('      <DeviceCapability Name="bluetooth" />');
  }
  if (has('gps') || has('geofencing')) {
    capabilities.push('      <DeviceCapability Name="location" />');
  }
  if (has('httptransfers')) {
    capabilities.push('      <Capability Name="internetClient" />');
    capabilities.push('      <Capability Name="internetClientServer" />');
  }

  if (capabilities.length === 0)
    return (<div className="app-builder__empty-tab">No additional Windows capabilities needed.</div>);

  const src = `
  <!-- Add the following capabilities to your Package.appxmanifest -->
  <Capabilities>
${capabilities.join('\n')}
  </Capabilities>`;

  return (<Syntax source={src} language="xml" />);
};

export default WindowsAppxManifest;
