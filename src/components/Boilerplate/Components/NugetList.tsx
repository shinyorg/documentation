import React from 'react';
import { DEFAULT_VERSION, Data, type ShinyComponent } from '../../../consts';
import NugetBadge from '../../NugetBadge';

export interface Props {
  components: ShinyComponent[];
  mode?: 'maui' | 'blazor' | 'aspnet' | 'linux';
}

const getNuget = (c: ShinyComponent, mode?: string): string => {
  if (mode === 'blazor' && c.blazorNuget) return c.blazorNuget;
  if (mode === 'aspnet' && c.aspnetNuget) return c.aspnetNuget;
  if (mode === 'linux' && c.linuxNuget) return c.linuxNuget;
  return c.nuget;
};

const NugetList = (props: Props) => {
  const isMaui = !props.mode || props.mode === 'maui';

  // Collect additional nugets from components that bundle extra packages
  const extras: { id: string; nuget: string; version: string }[] = [];
  props.components.forEach(c => {
    c.additionalNugets?.forEach(a => {
      if (!extras.find(e => e.nuget === a.nuget)) {
        extras.push({ id: `extra-${a.nuget}`, nuget: a.nuget, version: a.version });
      }
    });
  });

  let nugets = [...props.components.map(c => ({ ...c, nuget: getNuget(c, props.mode) })
  ), ...extras as ShinyComponent[]]
    .filter(
      (thing, i, arr) => arr.findIndex(t => t.nuget === thing.nuget) === i
    )
    .sort((a, b) => (
      (a.nuget > b.nuget) ? 1 : ((b.nuget > a.nuget) ? -1 : 0))
    );

  if (isMaui && Data.usesHosting(props.components)) {
    nugets = [...nugets, { id: "hosting", nuget: "Shiny.Hosting.Maui", version: DEFAULT_VERSION } as ShinyComponent];
  }

  return (
    <div className="app-builder__nuget-list">
      {nugets.map(c => (
        <div key={c.id} className="app-builder__nuget-item">
          <code className="app-builder__nuget-name">{c.nuget}</code>
          <NugetBadge name={c.nuget} />
        </div>
      ))}
    </div>
  );
};
export default NugetList;