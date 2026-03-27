import React from 'react';
import { DEFAULT_VERSION, Data, type ShinyComponent } from '../../../consts';
import NugetBadge from '../../NugetBadge';

export interface Props {
  components: ShinyComponent[]
}

const NugetList = (props: Props) => {
  // Collect additional nugets from components that bundle extra packages
  const extras: { id: string; nuget: string; version: string }[] = [];
  props.components.forEach(c => {
    c.additionalNugets?.forEach(a => {
      if (!extras.find(e => e.nuget === a.nuget)) {
        extras.push({ id: `extra-${a.nuget}`, nuget: a.nuget, version: a.version });
      }
    });
  });

  let nugets = [...props.components, ...extras as ShinyComponent[]]
    .filter(
      (thing, i, arr) => arr.findIndex(t => t.nuget === thing.nuget) === i
    )
    .sort((a, b) => (
      (a.nuget > b.nuget) ? 1 : ((b.nuget > a.nuget) ? -1 : 0))
    );

  if (Data.usesHosting(props.components)) {
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