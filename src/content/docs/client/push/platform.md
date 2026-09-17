---
title: Platform Specific
---

## Overview

When a push notification arrives, your `PushDelegate` receives a `PushNotification` object. On each platform, this is actually a platform-specific subclass with additional native capabilities. Cast to `AndroidPushNotification` or `ApplePushNotification` to access them.

## PushNotification (Base)

| Property | Type | Description |
|----------|------|-------------|
| `Data` | `IDictionary<string, string>` | Key/value data payload from the push message |
| `Notification` | `Notification?` | Title and message (null for silent/data-only pushes) |

## AndroidPushNotification

Extends `PushNotification` with access to the native Firebase `RemoteMessage` and helper methods for displaying notifications.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `NativeMessage` | `RemoteMessage` | The raw Firebase Cloud Messaging message |
| `Config` | `FirebaseConfig` | The Firebase configuration used by the app |
| `Platform` | `AndroidPlatform` | Android platform utilities |

### Methods

#### CreateBuilder

Creates a pre-configured `NotificationCompat.Builder` from the push payload. The builder is set up with the title, body, icon, color, channel, and tap intent from the incoming message.

```csharp
public override Task OnReceived(PushNotification notification)
{
    if (notification is AndroidPushNotification android)
    {
        var builder = android.CreateBuilder();

        // Customize further before sending
        builder
            .SetContentTitle("Custom Title")
            .SetContentText("Custom body text")
            .SetSmallIcon(Resource.Mipmap.appicon)
            .SetAutoCancel(true);

        android.Notify(1001, builder);
    }
    return Task.CompletedTask;
}
```

The builder automatically resolves:
- **Title & body** from the notification payload
- **Small icon** from the `notification` drawable resource, falling back to the app icon
- **Color** from the notification color field mapped to an Android color resource
- **Channel** from the notification channel ID or the default channel in `FirebaseConfig`
- **Tap intent** from the click action or the default `ShinyPushIntents.NotificationClickAction`

#### Notify

Sends a notification using the Android `NotificationManager`.

```csharp
android.Notify(notificationId, builder);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `notificationId` | `int` | Unique ID for the notification (use same ID to update) |
| `builder` | `NotificationCompat.Builder` | The configured notification builder |

#### SendDefault

Convenience method that calls `CreateBuilder()` and `Notify()` in one step.

```csharp
android.SendDefault(1001);
```

### Full Android Example

```csharp
#if ANDROID
public override Task OnReceived(PushNotification notification)
{
    if (notification is AndroidPushNotification android)
    {
        // Option 1: Send with all defaults from the push payload
        android.SendDefault(1001);

        // Option 2: Customize the notification before sending
        var builder = android.CreateBuilder();
        builder
            .SetSmallIcon(Resource.Mipmap.appicon)
            .SetPriority(NotificationCompat.PriorityHigh);
        android.Notify(1001, builder);

        // Option 3: Access the raw Firebase message
        var raw = android.NativeMessage;
        var messageId = raw.MessageId;
        var sentTime = raw.SentTime;
    }
    return Task.CompletedTask;
}
#endif
```

## ApplePushNotification

Extends `PushNotification` with access to the raw APNs payload dictionary.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `RawPayload` | `NSDictionary?` | The raw APNs payload as an Objective-C dictionary |

### Accessing the Raw Payload

The `RawPayload` contains the full APNs JSON payload as an `NSDictionary`, giving you access to custom keys, the `aps` dictionary, and any provider-specific data.

```csharp
#if IOS
public override Task OnReceived(PushNotification notification)
{
    if (notification is ApplePushNotification apple)
    {
        if (apple.RawPayload != null)
        {
            // Access the aps dictionary
            var aps = apple.RawPayload["aps"] as NSDictionary;

            // Access custom keys
            if (apple.RawPayload.TryGetValue(new NSString("customKey"), out var value))
            {
                var customValue = value.ToString();
            }
        }
    }
    return Task.CompletedTask;
}
#endif
```

### Common Raw Payload Keys

| Key | Description |
|-----|-------------|
| `aps` | The APNs payload dictionary (alert, badge, sound, content-available, etc.) |
| `aps.alert` | Alert dictionary or string |
| `aps.badge` | Badge count |
| `aps.sound` | Sound file name |
| `aps.content-available` | `1` for silent/background push |
| `aps.mutable-content` | `1` for Notification Service Extension processing |

## Cross-Platform Pattern

```csharp
public override Task OnReceived(PushNotification notification)
{
    // Common data payload - works on all platforms
    foreach (var (key, value) in notification.Data)
    {
        logger.LogInformation("Push data: {Key}={Value}", key, value);
    }

    // Platform-specific handling
#if ANDROID
    if (notification is AndroidPushNotification android)
    {
        android.SendDefault(1001);
    }
#elif IOS
    if (notification is ApplePushNotification apple)
    {
        // Access raw APNs payload if needed
        var raw = apple.RawPayload;
    }
#endif

    return Task.CompletedTask;
}
```
