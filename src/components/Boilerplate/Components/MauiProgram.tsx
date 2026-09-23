import React from 'react';
import { Data, type ShinyComponent } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[]
}

const MauiProgram = (props: Props) => { 
  let src = `
  using Shiny;${Data.hasComponent('httpserver', props.components) ? `
  using System.Net;          // IPAddress
  using Shiny.Net.HttpServer;` : ''}

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
  if (has('beacons')) {
    src += `
      // Foreground ranging - "which beacons are near me and how far?"
      builder.Services.AddBeaconRanging();

      // Background region monitoring - "tell me when I enter or leave"
      builder.Services.AddBeaconMonitoring<ShinyApp.Delegates.MyBeaconMonitorDelegate>();

      // Optional - Eddystone frames (every platform) & becoming a beacon
      // builder.Services.AddEddystoneScanning();
      // builder.Services.AddBeaconBroadcasting();`;
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
      // Register one endpoint per ISyncEntity type — see https://shinylib.net/client/datasync/entity-registration
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
  if (has('discovery')) {
    src += `
      // Registers IMdnsManager - browse, resolve & publish mDNS/DNS-SD (Bonjour) services.
      // Apple platforms go through NSNetService, so every service type you browse or publish
      // MUST be listed in NSBonjourServices (see the Info.plist tab).
      builder.Services.AddMdns();`;
  }
  if (has('wifi')) {
    src += `
      // Registers IWifiManager - scan, connect/disconnect, current network (IP/DNS) & radio.
      // Platform reach is uneven: check IWifiManager.Capabilities before offering a feature.
      builder.Services.AddWifi();

      // Optional - IWifiHotspot (Android local-only, Windows tethering; not on Apple platforms)
      // builder.Services.AddWifiHotspot();

      // Optional - IAirplaneMode (readable on Android/Windows; settable on Windows only)
      // builder.Services.AddAirplaneMode();`;
  }
  // The push providers each replace the native AddPush registration rather than adding to it.
  if (has('pushfirebase')) {
    src += `
      // Reads google-services.json / GoogleService-Info.plist - or pass a FirebaseConfiguration
      builder.Services.AddPushFirebaseMessaging<ShinyApp.Delegates.MyPushDelegate>();`;
  }
  else if (has('pushazure')) {
    src += `
      builder.Services.AddPushAzureNotificationHubs<ShinyApp.Delegates.MyPushDelegate>(
          "Endpoint=sb://your-hub.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=your-key",
          "your-hub-name"
      );`;
  }
  else if (has('push')) {
    src += `
      builder.Services.AddPush<ShinyApp.Delegates.MyPushDelegate>();`;
  }
  if (has('wearables')) {
    src += `
      // Apple Watch (WatchConnectivity) & Wear OS (Data Layer). iOS/Android only - resolve
      // IWearableManager as optional (GetService) in shared code.
      builder.Services.AddWearables<ShinyApp.Delegates.MyWearableDelegate>();`;
  }
  if (has('gamepad') && !has('gamepad-controls')) {
    src += `
      // No permission, entitlement or manifest entry is needed on any platform
      builder.Services.AddGamepads();`;
  }
  if (has('screenrecorder')) {
    src += `
      // Registers IScreenRecorder. Check .Capabilities before offering a feature - what a platform
      // can do differs within a platform, not just between them, so never infer it from the TFM.
      builder.Services.AddScreenRecorder();`;
  }
  if (has('liveactivities')) {
    src += `
      // iOS needs a widget extension of your own - https://shinylib.net/client/liveactivities/widget/
      // Unsupported platforms register a no-op manager, so no #if is needed in shared code.
      builder.Services.AddLiveActivities();
      // OR, when a server pushes updates (the delegate is the only way to learn the tokens):
      // builder.Services.AddLiveActivities<ShinyApp.Delegates.MyLiveActivityDelegate>();`;
  }
  if (has('mediator')) {
    src += `
      builder.Services.AddShinyMediator(cfg => cfg.UseMaui());`;
  }
  if (has('httpserver')) {
    src += `
      builder.Services.AddHttpServer(
          options =>
          {
              // Any, not loopback - the point is for another device to reach this one.
              // Port 0 lets the OS pick, so two copies of the app never collide.
              options.Address = IPAddress.Any;
              options.Port = 0;
          },
          server =>
          {
              server.MapGet("/ping", ctx => ctx.Response.WriteTextAsync("pong"));
              // server.UseEmbeddedFiles(typeof(MauiProgram).Assembly, "ShinyApp.wwwroot");
          },

          // Started from the UI instead, so the app does not open a port before anyone asked it to.
          // Resolve HttpServer from DI and call StartAsync() / StopAsync() from your view model.
          autoStart: false
      );`;
  }
  if (has('shell')) {
    src += `
      // configure your shell pages & view models
      builder.UseShinyShell(x => x
          .Add<MainPage, MainViewModel>(registerRoute: false)
          .Add<AnotherPage, AnotherViewModel>("another")
      );`;
  }
  const usesPackage = (nuget: string) => props.components.some(c => c.nuget === nuget);
  const themes = [
    ['theme-aurora', 'UseAuroraTheme'],
    ['theme-material', 'UseMaterialTheme'],
    ['theme-ocean', 'UseOceanTheme'],
    ['theme-terminal', 'UseTerminalTheme'],
  ].filter(([id]) => has(id));
  if (usesPackage('Shiny.Maui.Controls') || has('markdown') || has('mermaiddiagrams') || themes.length > 0) {
    if (themes.length > 0) {
      src += `
      builder.UseShinyControls(cfg =>
      {${themes.map(([, fn]) => `
          cfg.${fn}();`).join('')}
      });`;
    }
    else {
      src += `
      builder.UseShinyControls();`;
    }
  }
  if (props.components.some(c => c.nuget.startsWith('Shiny.Maui.Controls.Camera'))) {
    src += `
      builder.UseShinyCamera();`;
  }
  if (has('mediaelement')) {
    src += `
      builder.UseShinyMediaElement();`;
  }
  if (usesPackage('Shiny.Maui.Controls.Office')) {
    src += `
      // Registers SkiaSharp - the spreadsheet grid and slide canvases paint onto a Skia surface
      builder.UseShinyOffice();`;
  }
  if (has('gamepad-controls')) {
    src += `
      // Registers Shiny.Gamepad's manager itself and reports on-screen + physical controllers together
      // as IGamepadManager - do NOT also call AddGamepads(), it would replace the wrapper.
      builder.UseShinyGamepad();`;
  }
  if (has('file-drop')) {
    src += `
      builder.UseFileDrop();`;
  }
  if (has('quick-entry')) {
    src += `
      // Desktop only - a borderless window that opens over other applications from a global hotkey
      builder.UseDesktopQuickEntry();`;
  }
  if (has('trayicon')) {
    src += `
      // Desktop only — Android / iOS throw PlatformNotSupportedException on factory.Create()
      builder.UseTrayIcon();`;
  }
  if (has('floorplan')) {
    src += `
      // Not optional - this registers SkiaSharp, without which FloorPlanView paints nothing
      // and logs nothing.
      builder.UseShinyFloorPlan();`;
  }
  if (has('docking')) {
    src += `
      // Desktop docking host — register dockable panels with .AddDockPanel<TView>("panel-id")
      builder.UseShinyDocking();`;
  }
  // Barcodes (Shiny.Maui.Controls.Barcodes) is view-only — no DI registration required.
  if (has('stores')) {
    src += `
      builder.Services.AddShinyStores();`;
  }
  if (has('serialization')) {
    src += `
      // Only needed to resolve ISerializer from DI - [ShinyJsonContext] auto-registers your
      // JsonSerializerContext through a [ModuleInitializer], so Shiny.Json.Default works without this.
      builder.Services.AddJsonSerialization();`;
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
  if (has('calendarstore') || has('calendarstore-ai')) {
    src += `
      builder.Services.AddCalendarStore();`;
  }
  if (has('calendarstore-ai')) {
    src += `

      // Expose ICalendarStore to an LLM as Microsoft.Extensions.AI tools.  You opt-in per
      // operation - this is NOT an OS permission prompt, so call ICalendarStore.RequestAccess
      // from your app first.  Resolve CalendarAITools from DI and pass its .Tools to your
      // IChatClient (ChatOptions.Tools).
      builder.Services.AddCalendarAITools(tools => tools
          .AddCalendar(CalendarAICapabilities.Read | CalendarAICapabilities.Create)
      );`;
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
  if (has('faceintelligence')) {
    src += `

      // The ONNX models are NOT in the packages - bundle them yourself and hand the bytes over.
      // See https://shinylib.net/faceintelligence/models/
      builder.Services.AddFaceIntelligence(face =>
      {
          face.Options.MaxDistance = 0.6f; // cosine distance - lower is stricter

          face.UseOnnxEmbedder(o => o.ModelBytesProvider = () => LoadBundledModel("arcface.onnx"));
          face.UseOnnxDetector(o => o.ModelBytesProvider = () => LoadBundledModel("face_detector.onnx"));
          face.UseSqliteStore(o => o.ConnectionString = $"Data Source={Path.Combine(FileSystem.AppDataDirectory, "faces.db")}");
      });

      // Only needed for the MAUI controls - it holds per-camera state, so it must be transient.
      builder.Services.AddTransient<FaceRecognitionAnalyzer>();`;
  }
  if (has('voiceintelligence')) {
    src += `

      // The ONNX model is NOT in the packages - bundle it yourself and hand the bytes over.
      // See https://shinylib.net/voiceintelligence/models/
      builder.Services.AddVoiceIntelligence(voice =>
      {
          voice.Options.MaxDistance = 0.4f; // MUST be measured against your model + capture path

          voice.UseOnnxEmbedder(o =>
          {
              o.ModelBytesProvider = () => LoadBundledModel("ecapa.onnx");
              o.Dimensions = 512; // MUST match the model
              o.SampleRate = 16000;
          });
          voice.UseSqliteStore(o => o.ConnectionString = $"Data Source={Path.Combine(FileSystem.AppDataDirectory, "voices.db")}");
      });`;
  }
  if (has('documentintelligence')) {
    src += `
      // Registers IDocumentScanner, ITextRecognizer, IBarcodeReader, IDataDetector & IDocumentExtractor
      builder.Services.AddDocumentIntelligence();`;
  }
  if (has('music') || has('music-ai')) {
    src += `
      builder.Services.AddShinyMusic();`;
  }
  if (has('music-ai')) {
    src += `

      // Exposes the music library & player to an LLM as Microsoft.Extensions.AI tools - anything
      // not added stays invisible to the model. Resolve MusicAITools and pass .Tools to your IChatClient.
      builder.Services.AddMusicAITools(tools => tools
          .AddLibrary()
          .AddPlayback()
      );`;
  }
  if (has('contactstore-ai')) {
    src += `
${has('contactstore') ? '' : `
      builder.Services.AddContactStore();`}
      // Exposes IContactStore to an LLM as Microsoft.Extensions.AI tools - call RequestAccess first.
      builder.Services.AddContactsAITools(tools => tools
          .AddContacts(ContactAICapabilities.Read)    // ReadWrite adds create/update/delete
      );`;
  }
  if (has('notifications-ai')) {
    src += `
${has('notifications') ? '' : `
      builder.Services.AddNotifications();`}
      // Exposes local notifications to an LLM as reminder tools (list / create / cancel)
      builder.Services.AddNotificationAITools(tools => tools
          .AddReminders(ReminderAICapabilities.ReadWrite)
      );`;
  }
  if (has('locations-ai')) {
    src += `

      // Exposes the device's current location to an LLM as a Microsoft.Extensions.AI tool
      builder.Services.AddLocationAITool();`;
  }
  if (has('documentdb-ai')) {
    src += `

      // Exposes document store operations to an LLM - see https://shinylib.net/documentdb/ai-tools/
      builder.Services.AddDocumentStoreAITools(tools =>
      {
          // tools.AddType(jsonContext.SomeType, capabilities: DocumentAICapabilities.ReadOnly);
      });`;
  }
  const speechProviders = ['speechazure', 'speechelevenlabs', 'speechtypecast', 'speechopenai'].filter(has);
  if (has('speech') || (has('speechmicrosoftai') && speechProviders.length === 0)) {
    src += `

      // Platform-native speech-to-text, text-to-speech, audio capture & playback
      builder.Services.AddSpeechServices();`;
  }
  if (has('speechazure')) {
    src += `
      builder.Services.AddAzureSpeech("subscription-key", "eastus");`;
  }
  if (has('speechopenai')) {
    src += `
      builder.Services.AddOpenAiSpeech("your-api-key");`;
  }
  if (has('speechelevenlabs')) {
    src += `
      builder.Services.AddElevenLabsSpeech("your-api-key");`;
  }
  if (has('speechtypecast')) {
    src += `
      builder.Services.AddTypecastSpeech("your-api-key");`;
  }
  if (has('speechmicrosoftai')) {
    src += `
      // Adapts the registered speech services to Microsoft.Extensions.AI's
      // ISpeechToTextClient & ITextToSpeechClient
      builder.Services.AddShinySpeechClients();`;
  }
  if (has('aiconversation')) {
    src += `

      // Register an IChatClient (or implement IChatClientProvider) first - see https://shinylib.net/aiconversation/
      builder.Services.AddShinyAiConversation(opts =>
      {
          // opts.SetChatClientProvider<MyChatClientProvider>();
          // opts.SetMessageStore<MyMessageStore>(addAiLookupTool: true); // optional
      });`;
  }
  if (has('spatial')) {
    src += `

      // Shiny.Spatial has no DI registration - open a database where you need it:
      // using var db = new SpatialDatabase(Path.Combine(FileSystem.AppDataDirectory, "spatial.db"));`;
  }
  if (has('appdevicebridge')) {
    src += `

      // Serves your web app (Blazor, React, ...) from the device and exposes native bridges under /_bridge.
      // Each bridge is its own package (Shiny.AppDeviceBridge.Locations, .BluetoothLE, ...) - https://shinylib.net/appdevicebridge/
      builder.UseAppDeviceBridge(
          bridge => bridge
              .Configure(o => o.AppId = "my-app"),
          webApp =>
          {
              webApp.UseBaseline(typeof(App).Assembly, "webapp.zip", "1.0.0");   // runs offline on first launch
              // webApp.UpdateServer = new Uri("https://api.example.com/webapps");
              // webApp.PublicKey = "-----BEGIN PUBLIC KEY----- ...";
          }
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