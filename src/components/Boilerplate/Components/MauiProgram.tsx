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
          .UseMauiApp<App>()${Data.usesHosting(props.components) ? `
          .UseShiny() // <-- add this line (this is important)` : ''}
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
  if (has('obd')) {
    src += `
      builder.Services.AddBluetoothLE();
      builder.Services.AddShinyObdBluetoothLE(new BleObdConfiguration
      {
          DeviceNameFilter = "OBD"
      });`;
  }
  if (has('gps')) {
    src += `
      builder.Services.AddGps<ShinyApp.Delegates.YourGpsDelegate>();`;
  }
  if (has('geofencing')) {
    src += `
      builder.Services.AddGeofencing<ShinyApp.Delegates.YourGeofenceDelegate>();`;
  }
  if (has('spatial-geofencing')) {
    src += `
      builder.Services.AddSpatialGps<ShinyApp.Delegates.YourSpatialGeofenceDelegate>(config =>
      {
          config.MinimumDistance = Distance.FromMeters(300);
          config.MinimumTime = TimeSpan.FromMinutes(1);
      });`;
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
    src += `
      builder.Services.AddShinyMediator(cfg => cfg.UseMaui());`;
  }
  if (has('shell')) {
    src += `
      // configure your shell pages & view models
      builder.UseShinyShell(x => x
          .Add<MainPage, MainViewModel>(registerRoute: false)
          .Add<AnotherPage, AnotherViewModel>("another")
      );`;
  }
  if (has('tableview')) {
    src += `
      builder.UseShinyTableView();`;
  }
  if (has('scheduler')) {
    src += `
      builder.UseShinyScheduler();`;
  }
  if (has('stores')) {
    src += `
      builder.Services.AddShinyStores();`;
  }
  if (has('localization')) {
    src += `
      builder.Services.AddStronglyTypedLocalizations();`;
  }
  if (has('documentdb')) {
    src += `
      builder.Services.AddDocumentStore(opts =>
      {
          opts.DatabaseProvider = new SqliteDatabaseProvider("Data Source=mydata.db");
      });`;
  }
  if (has('documentdb-sqlcipher')) {
    src += `
      builder.Services.AddDocumentStore(opts =>
      {
          opts.DatabaseProvider = new SqlCipherDatabaseProvider("mydata.db", "mySecretKey");
      });`;
  }
  if (has('contactstore')) {
    src += `
      builder.Services.AddContactStore();`;
  }
  if (has('di')) {
    src += `
      builder.Services.AddShinyServiceRegistry();`;
  }
  if (has('mauihost')) {
    src += `
      builder.AddInfrastructureModules(new YourModule());`;
  }
  // Reflector is attribute-based only, no builder registration needed
  src += `
      return builder.Build();
    }
  }`;
  return (<Syntax source={src} language="csharp" />);
};

export default MauiProgram;