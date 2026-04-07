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
using Shiny;

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
  if (has('mediator')) {
    src += `
        builder.Services.AddShinyMediator(cfg => cfg.UseMaui());`;
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
  // Reflector is attribute-based only

  src += `

        return builder.Build();
    }
}`;

  return (<Syntax source={src} language="csharp" />);
};

export default LinuxProgram;
