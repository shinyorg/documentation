---
title: BLE Manager
---

## Overview

`IBleManager` is the main entry point for scanning and managing BLE peripherals. Inject it via dependency injection.

## Requesting Access

Before scanning, request the necessary permissions. This also checks the Bluetooth adapter state.

```csharp
IBleManager bleManager; // injected

var access = await bleManager.RequestAccessAsync();
if (access != AccessState.Available)
{
    // Bluetooth is not available - show a message
}
```

:::caution[Android: scans return nothing?]
On Android 12+ Shiny requests `BLUETOOTH_SCAN` / `BLUETOOTH_CONNECT` at runtime — **not** `ACCESS_FINE_LOCATION`. If your `AndroidManifest.xml` declares `BLUETOOTH_SCAN` *without* the `neverForLocation` flag, Android silently withholds **all** scan results unless fine location is also granted. Unless your app derives physical location from BLE, declare:

```xml
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"
                 android:usesPermissionFlags="neverForLocation" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
```
:::

## Scanning for Peripherals

Scanning returns an `IObservable<ScanResult>` that emits each time a peripheral advertisement is detected.

:::caution
Only one scan can be active at a time. Disposing the subscription — or calling `StopScan()` — stops the scan and releases the slot.
:::

:::note[You do not have to wait for the adapter]
On Apple platforms a `CBCentralManager` reports `Unknown` for a moment after it is created and CoreBluetooth drops any scan issued in that window. Shiny parks the request instead: `Scan()` starts the native scan the instant the central reports powered on, so subscribing before `RequestAccessAsync()` has completed still discovers peripherals — including ones that only begin advertising later. The same applies to an adapter power cycle mid-scan; the scan resumes on its own when Bluetooth comes back, and `IsScanning` reports `false` for the window in between. You should still call `RequestAccessAsync()` — it is how you surface a denied permission or a disabled adapter to the user, and a scan parked against an adapter that never powers on simply never emits.
:::

### Open Scan

```csharp
var scanSub = bleManager
    .Scan()
    .Subscribe(scanResult =>
    {
        var peripheral = scanResult.Peripheral;
        var name = peripheral.Name;
        var rssi = scanResult.Rssi;
        var serviceUuids = scanResult.AdvertisementData.ServiceUuids;
    });

// To stop scanning
scanSub.Dispose();
// or
bleManager.StopScan();
```

### Filtered Scan (Recommended)

Filtering by service UUID is more efficient and is **required** for background scanning on iOS.

```csharp
var scanSub = bleManager
    .Scan(new ScanConfig("Your-Service-UUID"))
    .Subscribe(scanResult =>
    {
        // Only peripherals advertising this service UUID
    });
```

### Scan Helpers

```csharp
// Scan until a peripheral with a specific name is found
var peripheral = await bleManager
    .ScanUntilPeripheralFound("MyDevice")
    .ToTask();

// Scan until the first peripheral with a service UUID is found
var peripheral = await bleManager
    .ScanUntilFirstPeripheralFound("Your-Service-UUID")
    .ToTask();

// Get only unique peripherals (no duplicate emissions)
bleManager
    .ScanForUniquePeripherals()
    .Subscribe(peripheral => { });
```

## Getting Connected Peripherals

```csharp
var connected = bleManager.GetConnectedPeripherals();
foreach (var peripheral in connected)
{
    Console.WriteLine($"{peripheral.Name} - {peripheral.Uuid}");
}
```

## Getting a Known Peripheral

If you have a peripheral UUID from a previous scan, you can retrieve it without scanning.

```csharp
var peripheral = bleManager.GetKnownPeripheral("peripheral-uuid");
if (peripheral != null)
{
    peripheral.Connect();
}
```

## Managed Scanner

The managed scanner maintains an observable collection of scan results, handling duplicates, UI thread marshaling, and automatic cleanup of stale results.

```csharp
var scanner = bleManager.CreateManagedScanner();

// Start scanning
await scanner.Start(
    scanConfig: new ScanConfig("Your-Service-UUID"),
    bufferTime: TimeSpan.FromSeconds(1),
    clearTime: TimeSpan.FromSeconds(10)  // Remove peripherals not seen in 10 seconds
);

// Bind to the collection (great for MAUI ListView/CollectionView)
var peripherals = scanner.Peripherals; // INotifyReadOnlyCollection<ManagedScanResult>

// Each ManagedScanResult has:
// - Peripheral (IPeripheral)
// - Name, Uuid, Rssi, IsConnected
// - ManufacturerData, ServiceUuids, LastSeen

// Watch for changes
scanner.WhenScan().Subscribe(change =>
{
    // change.Action: Add, Update, Remove, Clear
    // change.ScanResult: the affected ManagedScanResult
});

// Stop scanning
scanner.Stop();
scanner.Dispose();
```
