---
title: Best Practices
---
# Best Practices

:::warning
When using observables within BluetoothLE, you should always use .Timeout(TimeSpan.FromSeconds(X)) to kill tasks that take too long.  Android
tends to hang on certain calls if a connection is broken during certain operations.
:::


## General Rules

While this library tries to deal with all of the known Android issues to the best of its ability.
You likely will encounter issues if you don't follow the below:

1. DO NOT hold a reference to an IPeripheral across scans UNLESS it is connected
2. Don't scan or do anything with the adapter while connected to the GATT
3. Don't overwhelm the radio. The library now has an internal queue to force operations to finish.
4. GATT 133 will happen on Connect on occasion.  Catch exceptions in the observable subscriptions.
5. Bluetooth LE IS NOT GOOD for large payloads or things like JSON - keep it small and simple
6. Scan for devices YOU work with.  In most apps, you will almost always be scanning with a Service UUID
7. Do NOT discover all services & characteristics.  There is a performance cost with doing this.  You are always best to work with the service/characteristics known to you

## FAQ
:::note[Can I use IPeripheral.UUID to refer to my device across app restarts?]
NO - if your device is not paired. Treat UUIDs as a "per scan" basis.  The UUID is not guaranteed to be the same across app restarts
YES - if your device is paired.  It is usually better to use manufacturer data or advertised service UUIDs to identify your peripheral(s).
:::

:::note[Why is there no way to active monitor status of the Bluetooth adapter (IBleManager.WhenStatusChanged)?]
In a lot of cases, state changes to the Bluetooth adapter happen when your app is fully backgrounded, not the settings flip that developers
like to test with.  Observable subscriptions do NOT survive app sleeps/restarts.  For this scenario, you must use the IBleDelegate.OnAdapterStatusChanged
:::

:::note[Why does RequestAccess cover the Bluetooth adapter state and the permissions?]
You would be making these same 2 calls under every start scenario.  We wanted a one-stop shop.  The AccessState is a great combination that covers
all states we tend to come across when dealing with device permissions and availability.  This allowed us to keep a consistent API in RequestAccess across
all Shiny libraries
:::