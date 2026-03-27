---
title: Scheduling & Triggers
---

## Overview

Notifications can be triggered at a specific time, on a repeating schedule, or when the user enters a geographic area.

:::note
A notification can only have **one** trigger type. You cannot combine `ScheduleDate`, `RepeatInterval`, and `Geofence` on the same notification.
:::

## Scheduled Notifications

Display a notification at a specific date and time.

```csharp
INotificationManager notifications; // injected

await notifications.Send(new Notification
{
    Title = "Reminder",
    Message = "Don't forget your meeting!",
    ScheduleDate = DateTimeOffset.Now.AddHours(1)
});

// Or using the extension method
await notifications.Send(
    "Reminder",
    "Don't forget your meeting!",
    scheduleDate: DateTime.Now.AddHours(1)
);
```

## Repeating Notifications

Use `IntervalTrigger` to create repeating notifications.

```csharp
// Repeat every 4 hours
await notifications.Send(new Notification
{
    Title = "Check In",
    Message = "Time for your health check-in",
    RepeatInterval = new IntervalTrigger
    {
        Interval = TimeSpan.FromHours(4)
    }
});

// Repeat at a specific time of day
await notifications.Send(new Notification
{
    Title = "Daily Digest",
    Message = "Your daily summary is ready",
    RepeatInterval = new IntervalTrigger
    {
        TimeOfDay = new TimeSpan(9, 0, 0)  // 9:00 AM
    }
});

// Repeat on a specific day and time
await notifications.Send(new Notification
{
    Title = "Weekly Report",
    Message = "Your weekly report is ready",
    RepeatInterval = new IntervalTrigger
    {
        DayOfWeek = DayOfWeek.Monday,
        TimeOfDay = new TimeSpan(8, 0, 0)  // Monday at 8:00 AM
    }
});
```

## Geofence Notifications

Trigger a notification when the user enters a geographic area. Requires `AccessRequestFlags.LocationAware`.

```csharp
// First, request location-aware access
await notifications.RequestAccess(
    AccessRequestFlags.Notification | AccessRequestFlags.LocationAware
);

await notifications.Send(new Notification
{
    Title = "Welcome!",
    Message = "You've arrived at the store",
    Geofence = new GeofenceTrigger
    {
        Center = new Position(43.6532, -79.3832),  // latitude, longitude
        Radius = Distance.FromMeters(200),
        Repeat = false  // Fire only once
    }
});
```

## iOS Time Sensitive Notifications

For time-critical notifications on iOS, request the `TimeSensitivity` flag.

:::warning
Time Sensitive notifications require the **Time Sensitive Notifications** entitlement in your Apple Developer account and proper provisioning profile configuration.
:::

```csharp
var access = await notifications.RequestAccess(
    AccessRequestFlags.Notification | AccessRequestFlags.TimeSensitivity
);
```
