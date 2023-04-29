export interface Props {
  name: string;
  label?: string;
  badgeType?: BadgeType;
}

export enum BadgeType {
  Downloads = "dt",
  Preview = "vpre",
  Default = "v"
}
  
const NugetBadge = (props: Props) => {
  let type = props.badgeType || BadgeType.Preview;
  let imgUrl: string = `https://img.shields.io/nuget/${type}/${props.name}?style=for-the-badge`;
  if (props.label !== undefined)
    imgUrl += `&label=${props.label}`;
  const nugetUrl: string = `https://www.nuget.org/packages/${props.name}`;
  return (<a href={nugetUrl} target="_NEWWINDOW"><img src={imgUrl} /></a>);
};
export default NugetBadge;