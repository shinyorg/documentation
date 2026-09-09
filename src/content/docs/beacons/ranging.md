---
title: Ranging
---

Ranging answers "which beacons can I see right now, and how far away are they?". It is a
**foreground** activity — it needs the app in front of the user. Use
[monitoring](/beacons/monitoring) for anything that has to work with the app closed.

## Basic usage

```csharp
var access = await ranging.RequestAccess();
if (access != AccessState.Available)
    return;

var region = new BeaconRegion("store-front", uuid);

var sub = ranging
    .WhenBeaconRanged(region)
    .Subscribe(beacon =>
    {
        Console.WriteLine($"{beacon.Uuid} {beacon.Major}/{beacon.Minor}");
        Console.WriteLine($"  {beacon.Distance:N2} m ({beacon.Proximity}) at {beacon.Rssi} dBm");
    });

// ranging runs until the last subscription is disposed
sub.Dispose();
```

Ranging starts on the first subscription and stops when the last one is disposed. Leaving a
subscription alive keeps the radio busy — and on Apple platforms, keeps CoreLocation running.

## Regions

A `BeaconRegion` is a filter, not a place:

```csharp
new BeaconRegion("all", uuid);                       // every beacon with this UUID
new BeaconRegion("floor-2", uuid, Major: 2);         // ...and this major
new BeaconRegion("till-7", uuid, Major: 2, Minor: 7); // ...and this minor
```

`Minor` requires `Major`. **`0` is a legal value for both** — do not treat it as "unset". The
identifier must be unique and is what you get back in monitoring callbacks.

Narrow the region as far as the use case allows. A UUID-only region matches every beacon in the
deployment, which means more work for the scanner and more results to sift.

## The `Beacon` record

| Member | Notes |
|---|---|
| `Uuid`, `Major`, `Minor` | The identity |
| `Identity` | The three above as a `BeaconIdentity` value — use this to compare observations |
| `Distance` | Estimated metres. **A negative value means unknown**, not "very close" |
| `Proximity` | `Immediate` (&lt;0.5m), `Near` (&lt;3m), `Far`, or `Unknown` |
| `Rssi` | The raw single-packet signal strength. Very noisy — prefer `Distance` in UI |
| `TxPower` | The beacon's calibrated power at 1m. **Null on Apple platforms** |
| `Timestamp` | When the observation was taken |

Never compare two `Beacon` records for identity — every observation differs in RSSI and timestamp.
Compare `Beacon.Identity`.

`TxPower` is null on Apple because CoreLocation never hands the raw advertisement to the app. Do not
write cross-platform code that depends on it.

## Binding a list to the UI

`WhenBeaconRanged` emits once per advertisement, which is far too chatty to bind a list to.
`ManagedBeaconScan` keeps one entry per beacon and updates it in place, so a row follows a beacon
rather than being replaced:

```csharp
var scan = ranging.CreateManagedScan();

await scan.Start(
    region,
    scheduler,                              // marshals list updates onto the UI thread
    bufferTime: TimeSpan.FromSeconds(2),
    clearTime: TimeSpan.FromSeconds(15)     // drop beacons that stop advertising
);

// scan.Beacons is an INotifyReadOnlyCollection<ManagedBeacon>
foreach (var beacon in scan.Beacons)
    Console.WriteLine($"{beacon.Identity}: {beacon.Distance:N1}m, last seen {beacon.LastSeen}");

scan.Stop();
```

`ManagedBeacon` raises `PropertyChanged` for `Proximity`, `Distance`, `Rssi` and `LastSeen`. Without
`clearTime`, beacons accumulate for the life of the scan; with it, the list reflects what is
actually in range.

## Permissions

**iOS / Mac Catalyst / macOS** — ranging goes through CoreLocation, so it needs
`NSLocationWhenInUseUsageDescription` in `Info.plist`. When-in-use is enough; only monitoring needs
"always".

**Android / Windows / Linux / Blazor** — ranging is a BLE scan, so it needs the Bluetooth
permissions:

```xml
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"
                 android:usesPermissionFlags="neverForLocation" />
```

## Platform behaviour

On Apple platforms CoreLocation does its own signal smoothing and hands back a distance directly, so
Shiny's RSSI filter and distance estimator are deliberately bypassed — fighting the OS produces
worse numbers, not better ones. Only the proximity thresholds apply. Everywhere else the full
[filtering and estimation pipeline](/beacons/distance) runs.

On Android ranging uses `ScanMode.LowLatency` and disables scan batching — averaging works better
with more samples, and batched results arrive with stale, coalesced RSSI values.
