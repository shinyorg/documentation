import { DEFAULT_VERSION, ShinyComponent } from '../../../consts';
import NugetBadge, { BadgeType } from '../../NugetBadge';

export interface Props {
  components: ShinyComponent[]
}

const NugetList = (props: Props) => {
  let nugets = props.components
    .filter(
      (thing, i, arr) => arr.findIndex(t => t.nuget === thing.nuget) === i
    )
    .sort((a, b) => (
      (a.nuget > b.nuget) ? 1 : ((b.nuget > a.nuget) ? -1 : 0))
    );

  nugets = [...nugets, { id: "hosting", nuget: "Shiny.Hosting.Maui", version: DEFAULT_VERSION } as ShinyComponent];
  
  return (
    <table>
      {nugets.map(c => (
        <tr key={c.id}>
          <td>{c.nuget}</td>
          <td><NugetBadge name={c.nuget} /></td>
          <td><NugetBadge name={c.nuget} badgeType={BadgeType.Downloads} /></td>
        </tr>
      ))}
    </table>
  );
};
export default NugetList;