import React from 'react';
import { Data, type ShinyComponent } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[]
}

const MauiProgram = (props: Props) => { 
  let src = `
  using Shiny;

  namespace ShinyApp;
  
  
  public static class MauiProgram
  {
      public static MauiApp CreateMauiApp() 
      {
        var builder = MauiApp
          .CreateBuilder()
          .UseMauiApp<App>()
          .UseShiny() // <-- add this line (this is important)
          .ConfigureFonts(fonts =>
          {
              fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
              fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
          });

`;
  const has = (feature: string): boolean => {
    return Data.hasComponent(feature, props.components);
  };
        
  if (has('config')) {
    src += `
      builder.Configuration.AddJsonPlatformBundle();`;
  }
  if (has('jobs')) {
    src += `
      builder.Services.AddJob(typeof(ShinyApp.Delegates.YourJob));
      // OR 
      builder.Services.AddJobs();
      `;
  }
  if (has('ble')) {
    src += `
      builder.Services.AddBluetoothLE();
      `;
  }
  if (has('blehosting')) {
    src += `
      builder.Services.AddBluetoothLeHosting();`;
  }
  if (has('beacons')) {
    src += `
      builder.Services.AddBeaconRanging();
      builder.Services.AddBeaconMonitoring<ShinyApp.Delegates.YourBeaconMonitorDelegate>();`;
  }
  if (has('gps')) {
    src += `
      builder.Services.AddGps<ShinyApp.Delegates.YourGpsDelegate>();`;
  }
  if (has('geofencing')) {
    src += `
      builder.Services.AddGeofencing<ShinyApp.Delegates.YourGeofenceDelegate>();`;
  }
  if (has('httptransfers')) {
    src += `
      builder.Services.AddHttpTransfers<ShinyApp.Delegates.MyHttpTransferDelegate>();`;
  }
  if (has('notifications')) {
    src += `
      builder.Services.AddNotifications();`;
  }
  if (has('push')) {
    src += `
      builder.Services.AddPush<ShinyApp.Delegates.MyPushDelegate>();`;
  }
  if (has('mediator')) {
    src += `builder.Services.AddShinyMediator(cfg => cfg.UseMaui());`;    
  }
  src += `
      return builder.Build();
    }
  }`;
  return (<Syntax source={src} language="csharp" />);
};

export default MauiProgram;