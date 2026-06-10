import React from 'react';
import { Data, type ShinyComponent } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[]
}

const BlazorProgram = (props: Props) => {
  const has = (feature: string): boolean => {
    return Data.hasComponent(feature, props.components);
  };

  // Source-generated registrations (localization, DI registry) land in the app's own
  // namespace, so they need no using. Everything else maps to its library namespace.
  const usings = new Set<string>([
    'Microsoft.AspNetCore.Components.Web',
    'Microsoft.AspNetCore.Components.WebAssembly.Hosting',
  ]);
  if (has('mediator')) usings.add('Shiny.Mediator');
  if (has('stores')) usings.add('Shiny');
  if (has('ble')) usings.add('Shiny');
  if (has('jobs')) usings.add('Shiny');
  if (has('gps')) usings.add('Shiny');
  if (has('push')) {
    usings.add('Shiny');
    usings.add('Shiny.Push.Blazor');
  }
  if (has('datasync')) {
    usings.add('Shiny');
    usings.add('Shiny.Data.Sync');
    usings.add('Shiny.Data.Sync.Infrastructure');
  }
  if (has('documentdb')) {
    usings.add('Shiny.DocumentDb');
    usings.add('Shiny.DocumentDb.Sqlite');
  }
  if (has('documentdb-indexeddb')) {
    usings.add('Shiny.DocumentDb');
    usings.add('Shiny.DocumentDb.IndexedDb');
  }

  const usingBlock = [...usings].map(u => `using ${u};`).join('\n');

  let src = `${usingBlock}

namespace BlazorApp;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebAssemblyHostBuilder.CreateDefault(args);
        builder.RootComponents.Add<App>("#app");
        builder.RootComponents.Add<HeadOutlet>("head::after");

        builder.Services.AddScoped(sp =>
            new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
`;

  if (has('mediator')) {
    src += `
        builder.Services.AddShinyMediator(cfg => cfg.UseBlazor());`;
  }
  if (has('stores')) {
    src += `
        builder.Services.AddShinyStores();`;
  }
  if (has('docking')) {
    src += `
        // Visual-Studio-style docking host — register dockable components with .AddDockPanel<TComponent>("panel-id")
        builder.Services.AddShinyDocking();`;
  }
  if (has('osk')) {
    src += `
        // Touch / kiosk on-screen keyboard — place <OnScreenKeyboardHost /> in MainLayout.razor
        builder.Services.AddShinyOnScreenKeyboard(opts =>
        {
            opts.AutoShowOnFocus = true;
            opts.PushContent     = true;
        });`;
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
  if (has('documentdb-indexeddb')) {
    src += `
        // IndexedDB-backed document store - browser persistence, no native deps
        builder.Services.AddSingleton(new IndexedDbDocumentStoreOptions { DatabaseName = "MyAppDb" });
        builder.Services.AddSingleton<IDocumentStore, IndexedDbDocumentStore>();`;
  }
  if (has('di')) {
    src += `
        builder.Services.AddGeneratedServices();`;
  }
  if (has('ble')) {
    src += `
        // Web Bluetooth - requires user gesture for scanning, no background access
        builder.Services.AddBluetoothLE();`;
  }
  if (has('jobs')) {
    src += `
        // Foreground only - the browser will not run jobs after the tab is closed.
        // Jobs needs IBattery + IConnectivity from Shiny.Support.DeviceMonitoring.Blazor.
        builder.Services.AddBattery();
        builder.Services.AddConnectivity();
        builder.Services.AddJobs();`;
  }
  if (has('gps')) {
    src += `
        // Foreground GPS only - the browser does not expose background location
        builder.Services.AddGps();`;
  }
  if (has('push')) {
    src += `
        // Web Push via the browser PushManager + a service worker - VAPID key required
        builder.Services.AddPush(new WebPushOptions
        {
            VapidPublicKey = "YOUR_VAPID_PUBLIC_KEY"
        });`;
  }
  if (has('datasync')) {
    src += `
        // Blazor WASM transport — HttpClient + LocalStorage. Sync runs while the tab is open.
        // Register one endpoint per ISyncEntity type — see https://shinylib.net/datasync/entity-registration
        builder.Services.AddBlazorDataSync<BlazorApp.MyDataSyncDelegate>(opts =>
        {
            opts.RegisterEndpoint<BlazorApp.TodoItem>("/api/todos");
        });
        builder.Services.AddHttpClient(RestSyncTransport.HttpClientName, c =>
            c.BaseAddress = new Uri(builder.HostEnvironment.BaseAddress)
        );`;
  }
  // Reflector is attribute-based only, no builder registration needed

  src += `

        await builder.Build().RunAsync();
    }
}`;

  return (<Syntax source={src} language="csharp" />);
};

export default BlazorProgram;
