import React from 'react';
import { Data, type ShinyComponent } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[];
}

const BlazorIndexHtml = (props: Props) => {
  const has = (feature: string): boolean => Data.hasComponent(feature, props.components);

  const scripts: string[] = [];
  if (has('mediator')) {
    scripts.push(`<script src="_content/Shiny.Mediator.Blazor/Mediator.js"></script>`);
  }
  if (has('blazorhost')) {
    scripts.push(`<script src="_content/Shiny.Extensions.BlazorHosting/shiny-appsupport.js"></script>`);
  }

  const src = `<!-- Add to your index.html (or _Host.cshtml for server-side) before _framework/blazor.webassembly.js -->
${scripts.join('\n')}`;

  return (<Syntax source={src} language="xml" />);
};

export default BlazorIndexHtml;
