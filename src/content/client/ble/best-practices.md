---
title: Best Practices
---
# Best Practices

# Android

Android Bluetooth is painful and that's being nice.  This library attempts to deal with the necessary thread handling all internally.


## General Rules

While this library tries to deal with all of the known Android issues to the best of its ability.
You likely will encounter issues if you don't follow the below:

1. Don't scan or do anything with the adapter while connected to the GATT
2. Don't overwhelm the radio. The library now has an internal queue to force operations to finish.
3. GATT 133 will happen on Connect on occasion.  Catch exceptions in the observable subscriptions.
4. Bluetooth LE IS NOT GOOD for large payloads or things like JSON - keep it small and simple
5. Scan for devices YOU work with.  In most apps, you will almost always be scanning with a Service UUID
6. Do NOT discover all services & characteristics.  There is a performance cost with doing this.  You are always best to work with the service/characteristics known to you

## Connection Options

Using androidAutoConnect is suggested in scenarios where you don't know if the device is in-range
This will cause Android to connect when it sees the device.  WARNING: initial connections take much
longer with this option enabled

```csharp

var device = CrossBleAdapter.Current.GetKnownDevice(guid);
device.Connect(new GattConnectionConfig {
	AndroidAutoConnect = true
});
```
