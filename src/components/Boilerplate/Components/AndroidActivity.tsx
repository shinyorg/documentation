import React from 'react';
import { type ShinyComponent } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[]
}

const AndroidActivity = (props: Props) => {
  if (props.components.length === 0)
    return (<div className="app-builder__empty-tab">No additional activity configuration needed.</div>);

  const usesHealth = props.components.some(x => x.id === 'health' || x.id === 'health-ai');

  const intentActions = props
    .components
    .filter(x => x.androidIntent !== undefined)
    .map(x => x.androidIntent!);

  // Health Connect links to your privacy policy from the permission dialog and will not grant health
  // permissions unless this activity handles the rationale action
  if (usesHealth)
    intentActions.push('"androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE"');

  const intents = intentActions.map(x => `          ${x}`).join(",\n");
//     #if (usepush || notifications)
//     LaunchMode = LaunchMode.SingleTop,
// #endif

  // Android 14+ needs a ViewPermissionUsageActivity activity-alias pointing at this activity, which
  // requires a stable android:name
  const activityName = usesHealth
    ? `\n      Name = "com.companyname.myapp.MainActivity", // TODO: must match the activity-alias android:targetActivity`
    : '';

  let src = `
  using Android.App;
  using Android.Content.PM;

  namespace MyNamespace;


  [Activity(${activityName}
      LaunchMode = LaunchMode.SingleTop, // TODO: if using local notifications or push
      Theme = "@style/Maui.SplashTheme",
      MainLauncher = true,
      ConfigurationChanges =
          ConfigChanges.ScreenSize |
          ConfigChanges.Orientation |
          ConfigChanges.UiMode |
          ConfigChanges.ScreenLayout |
          ConfigChanges.SmallestScreenSize |
          ConfigChanges.Density
  )]
  [IntentFilter(
      new[] {
${intents}
      },
      Categories = new[] {
          "android.intent.category.DEFAULT"
      }
  )]
  public class MainActivity : MauiAppCompatActivity
  {
  }
    `;
  // src += `
  // </manifest>`;
  return (<Syntax source={src} language="csharp" />);
};
export default AndroidActivity;