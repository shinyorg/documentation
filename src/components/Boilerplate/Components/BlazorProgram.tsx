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

  let src = `using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

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
  if (has('di')) {
    src += `
        builder.Services.AddShinyServiceRegistry();`;
  }
  if (has('ble')) {
    src += `
        // Web Bluetooth - requires user gesture for scanning, no background access
        builder.Services.AddBluetoothLE();`;
  }
  if (has('jobs')) {
    src += `
        // Foreground only - the browser will not run jobs after the tab is closed
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
  // Reflector is attribute-based only, no builder registration needed

  src += `

        await builder.Build().RunAsync();
    }
}`;

  return (<Syntax source={src} language="csharp" />);
};

export default BlazorProgram;
