---
title: Managed Scans
---

Managed scans is probably one of the most helpful things in BLE if you are running any sort of peripheral scan.  It deals with things like:

* Maintains an observable collection that it makes thread safe and throttled changes to. Most users new to BLE won't do these things out of the box, so let us manage it for you.
* Marshalls changes to the collection to the main thread (or another RX scheduler if necessary) allowing UI's like Xamarin Forms a chance to rerender the contents
* Scan results don't create fresh instances of a scanresult, they update any existing scanresult's for previous found peripherals.  They simply update the new info like RSSI and other advertisement data that can change between results.
* Devices moving out of range - if device isn't heard in X seconds, a remove is triggered


## Creating a Managed scanner

```csharp
var bleManager = ShinyHost.Resolve<IBleManager>();

var scanner = bleManager.CreateManagedScanner(
    RxApp.MainThreadScheduler, // this is from ReactiveUI which is ideal for this scenario as this will put changes on the main thread for your UI to render
    TimeSpan.FromSeconds(3),   // (optional) how long a peripheral can go "underheard" before being removed from the list.  Defaults to 3 seconds
    new ScanConfig()           // (optional) the standard BLE filter used by the regular Shiny scanner
);

// now start the scanner, this will do everything like ensuring the proper permissions
await scanner.Start();

scanner.Peripherals <= this is an observable collection, you can bind it directly to a XF page and watch it update live

// to stop the scan
scanner.Stop();
```