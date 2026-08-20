import React from 'react';
import { Data, type ShinyComponent } from '../../../consts';
import Syntax from '../../Syntax';

export interface Props {
  components: ShinyComponent[]
}

const LinuxProgram = (props: Props) => {
  const has = (feature: string): boolean => {
    return Data.hasComponent(feature, props.components);
  };

  let src = `using Platform.Maui.Linux.Gtk4.Essentials.Hosting;
using Platform.Maui.Linux.Gtk4.Hosting;
using Shiny;${has('httpserver') ? `
using System.Net;          // IPAddress
using Shiny.Net.HttpServer;` : ''}

namespace ShinyApp;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiAppLinuxGtk4<App>()
            .AddLinuxGtk4Essentials()${Data.usesHosting(props.components) ? `
            .UseShiny() // <-- add this line` : ''}
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });
`;

  if (has('ble')) {
    src += `
        builder.Services.AddBluetoothLE();`;
  }
  if (has('blehosting')) {
    src += `
        builder.Services.AddBluetoothLeHosting();`;
  }
  if (has('notifications')) {
    src += `
        builder.Services.AddNotifications();`;
  }
  if (has('discovery')) {
    src += `
        // Managed mDNS responder on UDP 5353 - coexists with avahi-daemon, which is not required.
        // Make sure your firewall allows inbound & outbound UDP 5353.
        builder.Services.AddMdns();`;
  }
  if (has('wifi')) {
    src += `
        // NetworkManager over D-Bus. Reading & scanning are unprivileged; connect, disconnect,
        // hotspot and radio toggling go through polkit.
        builder.Services.AddWifi();
        // builder.Services.AddWifiHotspot();   // AP mode with DHCP + NAT
        // builder.Services.AddAirplaneMode();  // WirelessEnabled + WwanEnabled kill switches`;
  }
  if (has('mediator')) {
    src += `
        builder.Services.AddShinyMediator(cfg => cfg.UseMaui());`;
  }
  if (has('httpserver')) {
    src += `
        // No sandbox and no local-network prompt here - make sure the firewall allows the port.
        builder.Services.AddHttpServer(
            options =>
            {
                options.Address = IPAddress.Any;
                options.Port = 8080;
            },
            server => server.MapGet("/ping", ctx => ctx.Response.WriteTextAsync("pong"))
        );`;
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
        builder.Services.AddGeneratedServices();`;
  }
  // Reflector is attribute-based only

  src += `

        return builder.Build();
    }
}`;

  return (<Syntax source={src} language="csharp" />);
};

export default LinuxProgram;
