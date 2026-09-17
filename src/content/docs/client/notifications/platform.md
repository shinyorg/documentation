---
title: Platform Specific
---

## Overview

Shiny provides platform-specific notification and channel classes that extend the base types with additional capabilities. Use `AndroidNotification` / `AndroidChannel` on Android and `AppleNotification` / `AppleChannel` on iOS for full platform control.

## AndroidNotification

Extends `Notification` with Android-specific display and behavior options.

```csharp
await notifications.Send(new AndroidNotification
{
    Title = "Download Complete",
    Message = "Your file has been downloaded",
    Channel = "downloads",
    AutoCancel = true,
    UseBigTextStyle = true,
    SmallIconResourceName = "ic_download",
    LargeIconResourceName = "ic_download_large",
    ColorResourceName = "colorPrimary",
    Category = "progress"
});
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `AutoCancel` | `bool` | `true` | Dismiss notification when tapped |
| `OnGoing` | `bool` | `false` | Persistent notification that cannot be swiped away |
| `UseBigTextStyle` | `bool` | `false` | Use expanded text style for long messages |
| `SmallIconResourceName` | `string?` | `null` | Android resource name for the small icon |
| `LargeIconResourceName` | `string?` | `null` | Android resource name for the large icon |
| `ColorResourceName` | `string?` | `null` | Android resource name for the accent color |
| `Category` | `string?` | `null` | Notification category (e.g. `"alarm"`, `"email"`, `"progress"`) |
| `Ticker` | `string?` | `null` | Ticker text shown briefly in the status bar |
| `LaunchActivityType` | `Type?` | `null` | Specific activity to launch when tapped. `null` uses the `AndroidConfiguration` value |
| `LaunchActivityFlags` | `ActivityFlags?` | `null` | Intent flags for the launch activity. `null` uses the `AndroidConfiguration` value |

:::tip
Use `OnGoing = true` for notifications that represent ongoing tasks like music playback or active downloads. The user won't be able to swipe them away.
:::

## AndroidConfiguration

Sets app-wide defaults for how a notification tap launches your app. Register it alongside the notification services; any `AndroidNotification` can still override both values for a single send.

```csharp
#if ANDROID
services.AddNotifications<MyNotificationDelegate>(new AndroidConfiguration(
    ActivityFlags.NewTask | ActivityFlags.ClearTop | ActivityFlags.SingleTop
));
#endif
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `LaunchActivityFlags` | `ActivityFlags` | `NewTask \| ClearTask` | Intent flags applied to the activity launched on tap |
| `LaunchActivityType` | `Type?` | `null` | Activity to launch on tap; `null` uses the package's launcher activity |

### Tapping opens a new copy of the app

The default `NewTask | ClearTask` routes the tap through a `TaskStackBuilder` that clears the app's existing task and starts the activity fresh. If your app is already running, the live activity is destroyed and the app cold starts - splash screen, lost page state, and a second entry in Recents.

To have the tap resume what is already running instead, declare your activity `LaunchMode.SingleTop`:

```csharp
[Activity(
    Theme = "@style/Maui.SplashTheme",
    MainLauncher = true,
    LaunchMode = LaunchMode.SingleTop,
    ConfigurationChanges = ...)]
public class MainActivity : MauiAppCompatActivity { }
```

and register these flags:

```csharp
services.AddNotifications<MyNotificationDelegate>(new AndroidConfiguration(
    ActivityFlags.NewTask | ActivityFlags.ClearTop | ActivityFlags.SingleTop
));
```

The tap now brings the existing task forward and the payload arrives through `OnNewIntent`, which `UseShiny()` already forwards to Shiny's notification processor - so `INotificationDelegate.OnEntry` fires exactly as before.

## AndroidChannel

Extends `Channel` with Android notification channel settings. These map directly to Android's [NotificationChannel](https://developer.android.com/reference/android/app/NotificationChannel) API.

```csharp
notifications.AddChannel(new AndroidChannel
{
    Identifier = "alerts",
    Description = "Important alerts",
    Importance = ChannelImportance.High,
    EnableVibration = true,
    EnableLights = true,
    ShowBadge = true,
    BypassDnd = false,
    LockscreenVisibility = NotificationVisibility.Public
});
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `AllowBubbles` | `bool?` | `null` | Allow bubble notifications |
| `ShowBadge` | `bool?` | `null` | Show badge on app icon for this channel |
| `EnableLights` | `bool?` | `null` | Enable LED indicator |
| `EnableVibration` | `bool?` | `null` | Enable vibration |
| `BypassDnd` | `bool?` | `null` | Bypass Do Not Disturb mode |
| `LockscreenVisibility` | `NotificationVisibility?` | `null` | Visibility on the lock screen |

### NotificationVisibility

| Value | Description |
|-------|-------------|
| `Public` | Full notification content shown on lock screen |
| `Private` | Icon shown but content hidden on lock screen |
| `Secret` | Notification not shown on lock screen at all |

:::caution
Android notification channels are immutable after creation. Once a channel is created with certain settings, the user controls those settings. Your app cannot programmatically change channel behavior after initial creation. To apply new settings, create a new channel with a different identifier.
:::

## AppleNotification

Extends `Notification` with iOS-specific features including subtitles, media attachments, and relevance scoring.

```csharp
await notifications.Send(new AppleNotification
{
    Title = "New Photo",
    Subtitle = "From John",
    Message = "Check out this sunset!",
    Channel = "photos",
    RelevanceScore = 0.8,
    TargetContentIdentifier = "photo-123",
    FilterCriteria = "photos"
});
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Subtitle` | `string?` | `null` | Additional subtitle text displayed below the title |
| `RelevanceScore` | `double` | `0.0` | Relevance score (0.0 to 1.0) for notification summary ranking |
| `FilterCriteria` | `string?` | `null` | Criteria for filtering in Notification Service Extensions |
| `TargetContentIdentifier` | `string?` | `null` | Identifier for the content the notification references |
| `Attachments` | `UNNotificationAttachment[]` | `null` | Media attachments (images, audio, video) |

:::note
`RelevanceScore` is used by iOS to rank notifications in the notification summary (Focus modes). Higher values (closer to 1.0) are more likely to be featured.
:::

## AppleChannel

Extends `Channel` with iOS-specific category options.

```csharp
notifications.AddChannel(new AppleChannel
{
    Identifier = "messages",
    Description = "Chat messages",
    Importance = ChannelImportance.High,
    IntentIdentifiers = new[] { "INSendMessageIntent" },
    CategoryOptions = UNNotificationCategoryOptions.CustomDismissAction
});
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `IntentIdentifiers` | `string[]?` | `null` | SiriKit intent identifiers for this category |
| `CategoryOptions` | `UNNotificationCategoryOptions` | `None` | Category behavior options |

### UNNotificationCategoryOptions

| Value | Description |
|-------|-------------|
| `None` | No special behavior |
| `CustomDismissAction` | Send dismiss actions to your app |
| `AllowInCarPlay` | Show notifications in CarPlay |
| `HiddenPreviewsShowTitle` | Show title even when previews are hidden |
| `HiddenPreviewsShowSubtitle` | Show subtitle even when previews are hidden |
| `AllowAnnouncement` | Allow Siri to announce notifications |

## Cross-Platform Usage

Use `#if` directives to provide platform-specific configuration while keeping shared logic.

```csharp
Notification notification;

#if ANDROID
notification = new AndroidNotification
{
    Title = "Update Available",
    Message = "A new version is ready to install",
    Channel = "updates",
    SmallIconResourceName = "ic_update",
    UseBigTextStyle = true
};
#elif IOS
notification = new AppleNotification
{
    Title = "Update Available",
    Subtitle = "Version 2.0",
    Message = "A new version is ready to install",
    Channel = "updates",
    RelevanceScore = 0.5
};
#else
notification = new Notification
{
    Title = "Update Available",
    Message = "A new version is ready to install",
    Channel = "updates"
};
#endif

await notifications.Send(notification);
```
