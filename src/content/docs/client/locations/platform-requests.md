---
title: Platform GPS Requests
---

## Overview

The base `GpsRequest` provides cross-platform defaults, but each platform offers extended request types with additional configuration. Use `AndroidGpsRequest` or `AppleGpsRequest` to fine-tune GPS behavior for each platform.

If you pass a base `GpsRequest`, sensible platform defaults are applied automatically.

## GpsRequest (Base)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `BackgroundMode` | `GpsBackgroundMode` | `None` | Controls background location behavior |
| `RequestPreciseAccuracy` | `bool` | `false` | Request precise GPS accuracy |

### GpsBackgroundMode

| Value | iOS | Android |
|-------|-----|---------|
| `None` | Foreground only | Foreground only |
| `Standard` | Significant location changes | Background updates (~3-4 per hour) |
| `Realtime` | Full background (every ~1 second) | Foreground service (every ~1 second) |

### Factory Methods

```csharp
GpsRequest.Foreground           // No background, no precise accuracy
GpsRequest.Background           // Standard background mode
GpsRequest.Realtime(precise)    // Realtime with optional precise accuracy
```

## AndroidGpsRequest

Extends `GpsRequest` with Android-specific settings from the [Fused Location Provider](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest).

```csharp
await gpsManager.StartListener(new AndroidGpsRequest(
    BackgroundMode: GpsBackgroundMode.Realtime,
    GpsPriority: GpsPriority.HighAccuracy,
    IntervalMillis: 5000,
    DistanceFilterMeters: 10,
    WaitForAccurateLocation: true,
    StopForegroundServiceWithTask: false,
    RequestPreciseAccuracy: true,
    StationaryMetersThreshold: 10,
    StationarySecondsThreshold: 30
));
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `BackgroundMode` | `GpsBackgroundMode` | `None` | Background behavior |
| `GpsPriority` | `GpsPriority` | `Balanced` | Location accuracy/power trade-off |
| `DistanceFilterMeters` | `double` | `0` | Minimum distance change (meters) to trigger an update |
| `IntervalMillis` | `int` | `1000` | Requested update interval in milliseconds |
| `WaitForAccurateLocation` | `bool` | `false` | Wait for an accurate fix before first update |
| `StopForegroundServiceWithTask` | `bool` | `false` | Shut down foreground service when app is swiped away |
| `RequestPreciseAccuracy` | `bool` | `false` | Request precise GPS accuracy |
| `StationaryMetersThreshold` | `int` | `10` | Distance in meters below which the user is considered not moving |
| `StationarySecondsThreshold` | `int` | `30` | Seconds the user must remain within the distance threshold to be marked stationary |

### GpsPriority

| Value | Description |
|-------|-------------|
| `HighAccuracy` | Best accuracy, highest power consumption |
| `Balanced` | Balance between accuracy and power |
| `LowPower` | Coarse accuracy, lower power |
| `Passive` | Only receive updates from other apps' location requests |

:::caution
`StopForegroundServiceWithTask` set to `true` means GPS tracking will stop if the user swipes the app away from the recents screen. Set to `false` (default) to keep tracking even after the app is dismissed.
:::

## AppleGpsRequest

Extends `GpsRequest` with iOS/macOS-specific settings from [CLLocationManager](https://developer.apple.com/documentation/corelocation/cllocationmanager).

```csharp
await gpsManager.StartListener(new AppleGpsRequest(
    BackgroundMode: GpsBackgroundMode.Realtime,
    DistanceFilterMeters: 50,
    ShowsBackgroundLocationIndicator: true,
    PausesLocationUpdatesAutomatically: false,
    ActivityType: CLActivityType.Fitness,
    StationaryMetersThreshold: 10,
    StationarySecondsThreshold: 30
));
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `BackgroundMode` | `GpsBackgroundMode` | `None` | Background behavior |
| `DistanceFilterMeters` | `double` | `0` | Minimum distance change (meters) to trigger an update |
| `ShowsBackgroundLocationIndicator` | `bool` | `true` | Show the blue status bar indicator during background tracking |
| `PausesLocationUpdatesAutomatically` | `bool` | `false` | Let iOS pause updates when location isn't changing significantly |
| `UseSignificantLocationChanges` | `bool` | `false` | Use significant location change monitoring (lower power, less frequent) |
| `ActivityType` | `CLActivityType` | `Other` | Hint to iOS about the type of activity for optimization |
| `StationaryMetersThreshold` | `int` | `10` | Distance in meters below which the user is considered not moving (legacy iOS only — iOS 18+ uses native detection) |
| `StationarySecondsThreshold` | `int` | `30` | Seconds the user must remain within the distance threshold to be marked stationary (legacy iOS only) |

### CLActivityType

| Value | Description |
|-------|-------------|
| `Other` | General purpose |
| `AutomotiveNavigation` | Driving navigation |
| `Fitness` | Walking, running, cycling |
| `OtherNavigation` | Non-automotive navigation (boats, trains) |
| `Airborne` | Flight tracking |

:::tip
Set `PausesLocationUpdatesAutomatically` to `true` for long-running tracking sessions where the user may stop moving for periods. iOS will pause updates to save battery and automatically resume when movement is detected.
:::

## Cross-Platform Usage

On non-matching platforms, platform-specific requests are automatically converted. You can safely pass an `AndroidGpsRequest` on iOS — only the base `GpsRequest` properties will be used.

```csharp
// Platform-specific setup with #if directives
#if ANDROID
var request = new AndroidGpsRequest(
    BackgroundMode: GpsBackgroundMode.Realtime,
    GpsPriority: GpsPriority.HighAccuracy,
    IntervalMillis: 2000,
    StationaryMetersThreshold: 15,
    StationarySecondsThreshold: 60
);
#elif IOS
var request = new AppleGpsRequest(
    BackgroundMode: GpsBackgroundMode.Realtime,
    ActivityType: CLActivityType.Fitness,
    StationaryMetersThreshold: 15,
    StationarySecondsThreshold: 60
);
#else
var request = GpsRequest.Foreground;
#endif

await gpsManager.StartListener(request);
```
