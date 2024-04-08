import React from 'react';
import { type ShinyComponent } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[]
}

const AndroidActivity = (props: Props) => {
  if (props.components.length === 0) 
    return (<div>Nothing Extra Needed</div>);

  const intents = props
    .components
    .filter(x => x.androidIntent !== undefined)
    .map(x => x.androidIntent)
    .join(",\n");
//     #if (usepush || notifications)
//     LaunchMode = LaunchMode.SingleTop,
// #endif  

  let src = `
  using Android.App;
  using Android.Content.PM;
  
  namespace MyNamespace;
  
  
  [Activity(
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