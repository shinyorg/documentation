---
title: Sending Notifications
---

## Overview

The `INotificationManager` provides methods to send, query, and cancel notifications.

## Sending a Notification

```csharp
INotificationManager notifications; // injected

// Simple notification
await notifications.Send(
    title: "Hello",
    message: "This is a notification"
);

// Full notification with all options
await notifications.Send(new Notification
{
    Id = 1,
    Title = "Order Shipped",
    Message = "Your order #12345 has shipped!",
    Channel = "Orders",
    BadgeCount = 3,
    Thread = "order-updates",
    Payload = new Dictionary<string, string>
    {
        { "orderId", "12345" },
        { "action", "shipped" }
    }
});
```

## Notification Properties

| Property | Type | Description |
|----------|------|-------------|
| `Id` | `int` | Unique notification ID |
| `Title` | `string?` | Notification title |
| `Message` | `string?` | Notification body (required) |
| `Channel` | `string?` | Channel identifier |
| `Payload` | `IDictionary<string, string>` | Custom key/value data |
| `ImageUri` | `string?` | Image to show: an https URL, a `file://` URI or a local path ([Images](#images)) |
| `BadgeCount` | `int?` | App icon badge number |
| `Thread` | `string?` | Thread ID for grouping |
| `ScheduleDate` | `DateTimeOffset?` | When to display |
| `RepeatInterval` | `IntervalTrigger?` | Repeating schedule |
| `Geofence` | `GeofenceTrigger?` | Location-based trigger |

## Images

Set `ImageUri` to show an image with the notification:

```csharp
await notificationManager.Send(new Notification
{
    Title = "Your order shipped",
    Message = "Arriving Thursday",
    ImageUri = "https://cdn.example.com/orders/1234.jpg",
    ScheduleDate = DateTimeOffset.Now.AddHours(1)
});
```

`ImageUri` takes an http(s) URL, a `file://` URI or a local file path. The image is downloaded or copied into the app's
own storage when `Send` runs, so a scheduled, repeating or geofence notification needs no network when it fires. It
shows the image as it was at send time. Your source file is never moved or changed.

| Platform | How it appears |
|---|---|
| iOS / Mac Catalyst / macOS | An attachment: a thumbnail that expands when long-pressed (JPEG, PNG, GIF, HEIC, up to 10 MB) |
| Android | A big picture with the image as the large icon. This takes the place of `UseBigTextStyle` |
| Windows | The toast's hero image |
| Linux | Ignored |

If the image can't be read (a missing file, an HTTP error, an unrecognized type, more than 10 MB), a warning is logged
and the notification is sent without it. `Send` never fails because of the image. For an image that needs
authentication, download it yourself and pass the local path.

For images on push notifications, see [Push Images](/client/push/images/).

## Getting Pending Notifications

```csharp
var pending = await notifications.GetPendingNotifications();
foreach (var notification in pending)
{
    Console.WriteLine($"{notification.Id}: {notification.Title}");
}

// Get a specific notification
var notification = await notifications.GetNotification(1);
```

## Cancelling Notifications

```csharp
// Cancel a specific notification
await notifications.Cancel(1);

// Cancel by scope
await notifications.Cancel(CancelScope.All);            // Everything
await notifications.Cancel(CancelScope.DisplayedOnly);   // Only displayed notifications
await notifications.Cancel(CancelScope.Pending);          // Only pending (scheduled/triggered)
```

## Badge Management

Badge count management is platform-dependent. iOS and Mac Catalyst set the app icon badge, and macOS sets the Dock tile badge. Android and Windows have no app-wide badge to set, so `TrySetBadge` returns `false` and `TryGetBadge` returns `(false, null)` there.

```csharp
// Check if badges are supported and set
var success = await notifications.TrySetBadge(5);

// Get current badge count
var (supported, count) = await notifications.TryGetBadge();
if (supported)
    Console.WriteLine($"Badge: {count}");
```
