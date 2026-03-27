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
| `BadgeCount` | `int?` | App icon badge number |
| `Thread` | `string?` | Thread ID for grouping |
| `ScheduleDate` | `DateTimeOffset?` | When to display |
| `RepeatInterval` | `IntervalTrigger?` | Repeating schedule |
| `Geofence` | `GeofenceTrigger?` | Location-based trigger |

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

Badge count management is platform-dependent.

```csharp
// Check if badges are supported and set
var success = await notifications.TrySetBadge(5);

// Get current badge count
var (supported, count) = await notifications.TryGetBadge();
if (supported)
    Console.WriteLine($"Badge: {count}");
```
