import React from 'react';
import Syntax from '../../Syntax';

const src = `<!-- Add to your index.html (or _Host.cshtml for server-side) before the closing body tag -->
<script src="_content/Shiny.Mediator.Blazor/Mediator.js"></script>`;

const BlazorIndexHtml = () => {
  return (<Syntax source={src} language="xml" />);
};

export default BlazorIndexHtml;
