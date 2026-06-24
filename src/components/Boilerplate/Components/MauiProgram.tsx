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
  if (has('datasync')) {
    src += `
      // Auto-picks the right transport: NSURLSession on Apple, foreground service on Android, HttpClient elsewhere.
      // Register one endpoint per ISyncEntity type — see https://shinylib.net/datasync/entity-registration
      builder.Services.AddDataSync<ShinyApp.Delegates.MyDataSyncDelegate>(opts =>
      {
          opts.RegisterEndpoint<ShinyApp.Models.TodoItem>("https://api.example.com/todos");
      });
      builder.Services.AddHttpClient(Shiny.Data.Sync.Infrastructure.RestSyncTransport.HttpClientName, c =>
          c.BaseAddress = new Uri("https://api.example.com")
      );`;
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
  if (has('tableview') || has('scheduler') || has('sheetview') || has('pillview') || has('imageviewer') || has('markdown') || has('mermaiddiagrams')) {
    src += `
      builder.UseShinyControls();`;
  }
  if (has('trayicon')) {
    src += `
      // Desktop only — Android / iOS throw PlatformNotSupportedException on factory.Create()
      builder.UseTrayIcon();`;
  }
  if (has('docking')) {
    src += `
      // Desktop docking host — register dockable panels with .AddDockPanel<TView>("panel-id")
      builder.UseShinyDocking();`;
  }
  if (has('osk')) {
    src += `
      // Touch / kiosk on-screen keyboard — auto-shows when an Entry / Editor gains focus
      builder.UseOnScreenKeyboard(opts =>
      {
          opts.AutoShowOnFocus = true;
          opts.PushContent     = true;
      });`;
  }
  // Barcodes (Shiny.Maui.Controls.Barcodes) is view-only — no DI registration required.
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
  if (has('documentdb-diagnostics')) {
    src += `
      // OpenTelemetry metrics + tracing — call AFTER registering a store.
      // Subscribe from your OTel pipeline with .AddMeter("Shiny.DocumentDb") / .AddSource("Shiny.DocumentDb")
      builder.Services.AddDocumentStoreInstrumentation();`;
  }
  if (has('contactstore')) {
    src += `
      builder.Services.AddContactStore();`;
  }
  if (has('health') || has('health-ai')) {
    src += `
      builder.Services.AddHealthIntegration();`;
  }
  if (has('health-ai')) {
    src += `

      // Expose a curated, opt-in slice of the health store to an LLM as Microsoft.Extensions.AI
      // tools. Permissions are NOT requested by the tools - call IHealthService.RequestPermissions
      // first. Resolve HealthAITools from DI and pass its .Tools to your IChatClient (ChatOptions.Tools).
      builder.Services.AddHealthAITools(tools => tools
          .AddMetric(DataType.StepCount)
          .AddMetric(DataType.HeartRate)
          .AddWorkouts()
          .AddNutrition(HealthAICapabilities.ReadWrite)
      );`;
  }
  if (has('di')) {
    src += `
      builder.Services.AddGeneratedServices();`;
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