# Push

Native OS Push Providers


|Area|Value|
|----|-----|
|NuGet|[![Shiny.Push](https://img.shields.io/nuget/v/Shiny.Push.svg?style=for-the-badge)](https://www.nuget.org/packages/Shiny.Push/)|
|Service|Shiny.Push.IPushManager|
|Auto-Register|NO|
|Delegate|Shiny.Push.IPushDelegate|
|Static Class|ShinyPush|


## Startup File

```csharp
using Microsoft.Extensions.DependencyInjection;
using Shiny;

namespace YourNamespace
{
    public class YourShinyStartup : ShinyStartup
    {
        public override void ConfigureServices(IServiceCollection services, IPlatform platform)
        {
            services.UsePush<MyPushDelegate>()
        }
    }
}
```

## Platform Setup

# [iOS](#tab/ios)



Minimum Version: 12

## AppDelegate

```csharp
using System;
using Foundation;
using Xamarin.Forms.Platform.iOS;
using Shiny;

namespace YourIosApp
{
    [Register("AppDelegate")]
    public partial class AppDelegate : FormsApplicationDelegate
    {
        public override bool FinishedLaunching(UIApplication app, NSDictionary options)
        {
            this.ShinyFinishedLaunching(new Samples.SampleStartup(), options);
            global::Xamarin.Forms.Forms.Init();
            this.LoadApplication(new Samples.App());
        }
    }

    public override void RegisteredForRemoteNotifications(UIApplication application, NSData deviceToken)
        => this.ShinyRegisteredForRemoteNotifications(deviceToken);

    public override void FailedToRegisterForRemoteNotifications(UIApplication application, NSError error)
        => this.ShinyFailedToRegisterForRemoteNotifications(error);

    public override void DidReceiveRemoteNotification(UIApplication application, NSDictionary userInfo, Action<UIBackgroundFetchResult> completionHandler)
        => this.ShinyDidReceiveRemoteNotification(userInfo, completionHandler);
}
```


## Info.plist

```xml
<!DOCTYPE plist PUBLIC " -//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version=\"1.0\">
    <dict>
        <key>UIBackgroundModes</key>
        <array>
            <string>remote-notification</string>
        </array>
    </dict>
</plist>
```

## Entitlements.plist

```xml
<!DOCTYPE plist PUBLIC " -//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version=\"1.0\">
    <dict>
        <key>aps-environment</key>
        <string>development OR production</string>
    </dict>
</plist>
```

# [Android](#tab/android)


### Minimum Version: 8.0
### Target Version: 12

***

## Samples

* [https://github.com/shinyorg/samples/tree/main/Push](https://github.com/shinyorg/samples/tree/main/Push)

