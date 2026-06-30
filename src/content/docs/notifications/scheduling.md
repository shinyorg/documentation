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

## Android Exact Alarms

Scheduled notifications on Android are delivered through the OS `AlarmManager`. Since Android 12 (API 31), firing an alarm at an **exact** time requires the special-access exact alarm permission. Without it, calling for an exact alarm throws a `SecurityException` - which previously meant your scheduled notification was silently dropped and never appeared.

Shiny now degrades gracefully: if exact alarm access has **not** been granted, the notification is scheduled as an **inexact** alarm instead. It will still fire, but the OS may batch or delay it slightly to save power. A warning is logged so you can see this happen during development.

To get exact, on-time delivery, request the `TimeSensitivity` flag. On Android this checks `AlarmManager.CanScheduleExactAlarms()` and, when needed, sends the user to the system settings screen to grant exact alarm access:

```csharp
var access = await notifications.RequestAccess(
    AccessRequestFlags.Notification | AccessRequestFlags.TimeSensitivity
);
```

Declare the matching permission in your `AndroidManifest.xml`. There are two valid setups - pick **one** based on what kind of app you ship.

**Most apps** (notifications are a feature, not the core purpose) - declare `SCHEDULE_EXACT_ALARM` on **all** API levels so the `TimeSensitivity` settings prompt can grant it:

```xml
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

On API 31-32 this is auto-granted; on API 33+ it is user-grantable through the "Alarms & reminders" settings screen that `TimeSensitivity` navigates to.

**Genuine alarm-clock / reminder apps** (core function is alarms, timers, or calendar reminders) - cap `SCHEDULE_EXACT_ALARM` at API 32 and add `USE_EXACT_ALARM`, which is auto-granted and non-revocable on API 33+ without sending the user to settings:

```xml
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.USE_EXACT_ALARM" />
```

:::caution
Do **not** cap `SCHEDULE_EXACT_ALARM` with `android:maxSdkVersion="32"` *unless* you also declare `USE_EXACT_ALARM`. If you do, your app has **no** exact-alarm permission on Android 13+ (API 33+): `CanScheduleExactAlarms()` returns `false`, the "Alarms & reminders" toggle appears **greyed out and unchecked** (the user cannot enable it), and every scheduled notification silently uses the delayed inexact fallback.
:::

:::note
`USE_EXACT_ALARM` is restricted by Google Play to apps whose core function is alarms, timers, or calendar reminders. If your app does not qualify, use the first (uncapped `SCHEDULE_EXACT_ALARM`) setup and rely on the `TimeSensitivity` settings prompt or the inexact fallback.
:::
