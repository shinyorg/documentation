---
title: Region Monitoring
---

Monitoring tells you when the device **enters or leaves** a beacon region, including while the app is
backgrounded or has been restarted by the OS. It never reports distance — range the region in the
foreground when you need that.

## Setting up

```csharp
public class MyBeaconMonitorDelegate(
    INotificationManager notifications
) : IBeaconMonitorDelegate
{
    public Task OnStatusChanged(BeaconRegionState newStatus, BeaconRegion region)
        => notifications.Send("Beacons", $"{region.Identifier}: {newStatus}");
}
```

```csharp
services.AddBeaconMonitoring<MyBeaconMonitorDelegate>();
```

```csharp
var access = await monitoring.RequestAccess();
if (access != AccessState.Available)
    return;

await monitoring.StartMonitoring(new BeaconRegion("store-front", uuid, Major: 1));
```

Monitored regions are persisted and re-armed on the next launch. `GetMonitoredRegions()` lists them,
`StopMonitoring(identifier)` drops one, `StopAllMonitoring()` clears everything.

`NotifyOnEntry` and `NotifyOnExit` on the region control which transitions reach your delegate.
Setting both to `false` throws — there would be nothing to monitor.

## Asking for state directly

```csharp
var state = await monitoring.RequestState(region);
// BeaconRegionState.Entered / Exited / Unknown
```

`Unknown` means the region has not been evaluated yet, which is the honest answer on a cold start
before any advertisement has arrived.

## How it works per platform

### iOS and Mac Catalyst

On **iOS 18 / Mac Catalyst 18 and above** monitoring uses `CLMonitor` with
`CLBeaconIdentityCondition` — the same path `Shiny.Locations` takes for geofences, including the
`CLServiceSession` that background delivery requires and the cold-start replay suppression that
stops a re-attached condition from firing a spurious entry.

**Below 18** it uses `CLLocationManager.StartMonitoring(CLBeaconRegion)`.

Either way the OS does the work, so monitoring keeps running with the app closed and iOS will
relaunch the app to deliver a transition.

:::caution[iOS monitors at most 20 regions per app]
That cap is across **every** region type — beacons and geofences share it. On iOS 18+ CoreLocation
manages the limit itself; below that Shiny throws a named error when you cross it, rather than
letting iOS silently drop the excess.
:::

### macOS

CoreLocation on the Mac has beacon *ranging* but **no beacon region API at all**. The monitoring
manager still registers so shared startup code runs, but it reports
`AccessState.NotSupported` and `StartMonitoring` throws `PlatformNotSupportedException`.

Branch on `monitoring.CurrentStatus`, not on `OperatingSystem.IsMacOS()`.

### Android, Windows, Linux and Blazor

None of these has an OS-level beacon region API, so monitoring is a low-power BLE scan with a state
machine on top. **BLE never reports a departure** — all a scanner ever learns is that a beacon was
seen — so exits are inferred from silence: a region that goes `RegionExitTimeout` (30 seconds by
default) without a matching advertisement is treated as exited.

On **Android** a foreground service with a visible notification keeps that scan alive once the app
leaves the foreground. Its service type is `connectedDevice`, not `location`: Android 14 requires the
declared type to match what the service actually does, and a BLE scan is not a location activity.

On desktop, the process simply has to keep running.

## Tuning exit detection

```csharp
services.AddBeaconMonitoring<MyDelegate>(new BeaconRangingOptions
{
    RegionExitTimeout = TimeSpan.FromSeconds(45),
    RegionEvaluationInterval = TimeSpan.FromSeconds(5)
});
```

If regions flap in and out, **raise** the exit timeout rather than lowering it. The 30-second default
already tolerates a beacon advertising at 1 Hz through a throttled background scan; flapping usually
means the beacon's own interval is slower than that, or the scan is being aggressively power-managed.

These settings do nothing on iOS and Mac Catalyst — CoreLocation owns the transition there.

## Permissions

**iOS / Mac Catalyst** — background monitoring needs **always** authorization, so `Info.plist` needs
both `NSLocationWhenInUseUsageDescription` and `NSLocationAlwaysAndWhenInUseUsageDescription`.

Authorization escalates: iOS grants when-in-use first and only offers the "always" upgrade
afterwards, and it presents that prompt **once**. Call `RequestAccess()` from the feature that needs
it — the moment the user turns beacon monitoring on is the only moment you can explain why. Word the
"always" string for what background monitoring actually does rather than reusing the when-in-use
sentence.

**Android**

```xml
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"
                 android:usesPermissionFlags="neverForLocation" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_CONNECTED_DEVICE" />
```

`POST_NOTIFICATIONS` is not strictly required, but without it the foreground service's notification
is invisible, which is a poor experience and looks like the feature is not running.
