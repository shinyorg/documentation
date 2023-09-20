---
title: BluetoothLE (BLE) Manager
---
The BluetoothLE (BLE) manager is where everything begins.  From here, you can request the necessary access from your user to use the hardware and scan for BLE peripherals around you

## General

Start by resolving, injecting, etc your Shiny.BluetoothLE.IBleManager and as with most modules within Shiny, call RequestAccess to ensure that 
you your platform supports the operation, your user has given you consent to perform the operation, and that all of the necessary hardware is turned on

```csharp
IBleManager bleManager;

var access = await bleManage.RequestAccess();
if (access != AccessState.Available)
{
    // handle accordingly
}
```


## Scan for Peripherals

```csharp
IBleManager bleManager; // injected/resolved
var scanner = bleManager.Scan().Subscribe(scanResult => 
{
    // do something with it
    // the scanresult contains the device, RSSI, and advertisement packet
    scanResult.Rssi
    scanResult.Peripheral
    scanResult.AdvertisementData
});

scanner.Dispose(); // to stop scanning
```

## Scan for "My" Peripherals 

It generally isn't recommended you use an "open" ended scan.  You also don't want to rely on something like a device name or even "manufacturer" data
to find peripherals your app was meant to work with.  It is recommended you ALWAYS use a serviceUiid to scan by

```csharp
IBleManager bleManager; // injected/resolved
bleManager.Scan(new ScanConfig(
    "your uuid here"
))
.Subscribe(scanResult => 
{
})
```


## Get Connected Devices
Returns all devices currently connected to your APP, not the device itself.

Returns a enumerable of peripherals (non async method)

```csharp
var peripherals = bleManager.GetConnectPeripherals();
```

## Get Known Peripheral
Gets a peripheral by a UUID.  This is only available after a scan operation assuming the peripheral was "seen"

Returns null if not found
```csharp
var peripheral = bleManager.GetKnownPeripheral("the peripheral uuid");
```


## Managed Scans

Managed scans is probably one of the most helpful things in BLE in your User Interface if you are running any sort of peripheral scan.  It deals with things like:

* Maintains an observable collection that it makes thread safe and throttled changes to. Most users new to BLE won't do these things out of the box, so let us manage it for you.
* Marshalls changes to the collection to the main thread (or another RX scheduler if necessary) allowing UI's like Xamarin Forms a chance to rerender the contents
* Scan results don't create fresh instances of a scanresult, they update any existing scanresult's for previous found peripherals.  They simply update the new info like RSSI and other advertisement data that can change between results.
* Devices moving out of range - if device isn't heard in X seconds, a remove is triggered


## Creating a Managed scanner

```csharp
IBleManager bleManager; // injected/resolved
var scanner = bleManager.CreateManagedScanner(
    RxApp.MainThreadScheduler, // this is from ReactiveUI which is ideal for this scenario as this will put changes on the main thread for your UI to render
    TimeSpan.FromSeconds(3),   // (optional) how long a peripheral can go "underheard" before being removed from the list.  Defaults to 3 seconds
    new ScanConfig()           // (optional) the standard BLE filter used by the regular Shiny scanner
);

// now start the scanner, this will do everything like ensuring the proper permissions
await scanner.Start();

scanner.Peripherals <= this is an observable collection, you can bind it directly to a page and watch it update live

// to stop the scan
scanner.Stop();
```
