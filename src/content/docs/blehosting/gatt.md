---
title: GATT Service
---

## Overview

GATT services define the data your BLE peripheral exposes. Each service contains characteristics that centrals can read from, write to, or subscribe to for notifications.

## Creating a Service (Inline)

Use the builder pattern to create services dynamically.

```csharp
IBleHostingManager hostingManager; // injected

var service = await hostingManager.AddService(
    "Your-Service-UUID",
    true, // primary service
    sb =>
    {
        sb.AddCharacteristic("char-uuid-1", cb =>
        {
            cb.SetRead(request =>
            {
                var data = System.Text.Encoding.UTF8.GetBytes("Hello");
                return Task.FromResult(GattResult.Success(data));
            });

            cb.SetWrite(request =>
            {
                var receivedData = request.Data;
                Console.WriteLine($"Received: {System.Text.Encoding.UTF8.GetString(receivedData)}");
                return Task.CompletedTask;
            });

            cb.SetNotification((subscription) =>
            {
                Console.WriteLine(subscription.IsSubscribing
                    ? "Central subscribed"
                    : "Central unsubscribed");
                return Task.CompletedTask;
            });
        });
    }
);
```

## Characteristic Operations

### Read

Return a `GattResult` with your data or an error status.

```csharp
cb.SetRead(request =>
{
    // request.Peripheral - the connecting central
    // request.Offset - data offset
    var data = GetYourData();
    return Task.FromResult(GattResult.Success(data));
}, encrypted: false);
```

### Write

Handle incoming writes from centrals.

```csharp
cb.SetWrite(request =>
{
    // request.Data - the written bytes
    // request.Peripheral - the connecting central
    // request.IsReplyNeeded - whether a response is expected
    // request.Respond(GattState) - send response if needed

    if (request.IsReplyNeeded)
        request.Respond(GattState.Success);

    return Task.CompletedTask;
}, WriteOptions.Write);
```

`WriteOptions` flags: `Write`, `WriteWithoutResponse`, `AuthenticatedSignedWrites`, `EncryptionRequired`

### Notifications

Send data to subscribed centrals.

```csharp
// After setting up notification on a characteristic:
var characteristic = service.Characteristics.First();

// Notify all subscribed centrals
await characteristic.Notify(data);

// Notify specific centrals
await characteristic.Notify(data, central1, central2);

// Check who is subscribed
var subscribers = characteristic.SubscribedCentrals;
```

`NotificationOptions` flags: `Notify`, `Indicate`, `EncryptionRequired`

## Managing Services

```csharp
// Remove a specific service
hostingManager.RemoveService("Your-Service-UUID");

// Clear all services
hostingManager.ClearServices();

// List active services
var services = hostingManager.Services;
```

## Composing Services in a Class

The reflection-based managed characteristic pattern (`BleGattCharacteristic` base + `[BleGattCharacteristic]` attribute + `AttachRegisteredServices`) was removed for AOT compliance. You have two replacements:

- Declare the service with `[BleService]` on a `partial class` and let the [source generator](./source-generator) emit these calls for you — attribute ergonomics with no reflection. This is the shorter path for anything beyond a characteristic or two.
- Or compose the service in code by registering a hosting class that calls `AddService(...)` on startup:

```csharp
public class MyGattHostingService(IBleHostingManager manager, ILogger<MyGattHostingService> logger) : IShinyStartupTask
{
    public async void Start()
    {
        var access = await manager.RequestAccess(advertise: true, connect: true);
        if (access != AccessState.Available)
            return;

        await manager.AddService("Your-Service-UUID", primary: true, sb =>
        {
            sb.AddCharacteristic("Your-Characteristic-UUID", cb =>
            {
                cb.SetRead(req =>
                {
                    var data = System.Text.Encoding.UTF8.GetBytes("Hello");
                    return Task.FromResult(GattResult.Success(data));
                });

                cb.SetWrite(req =>
                {
                    logger.LogInformation("Received {Bytes} bytes", req.Data.Length);
                    if (req.IsReplyNeeded)
                        req.Respond(GattState.Success);
                    return Task.CompletedTask;
                }, WriteOptions.Write);

                cb.SetNotification(sub =>
                {
                    logger.LogInformation("Subscription change: {Sub}", sub.IsSubscribing);
                    return Task.CompletedTask;
                }, NotificationOptions.Notify);
            });
        });

        await manager.StartAdvertising(new AdvertisementOptions("MyDevice", "Your-Service-UUID"));
    }
}
```

Register it like any other Shiny service:

```csharp
services.AddBluetoothLeHosting();
services.AddSingleton<IShinyStartupTask, MyGattHostingService>();
```

This keeps everything testable (the class can be exercised against a mocked `IBleHostingManager`), preserves AOT-cleanliness, and avoids the runtime attribute scanning the old pattern relied on. The [source generator](./source-generator) produces the same shape from attributes, and additionally hands you a per-connected-central context, generated notify helpers, and compile-time checks on your UUIDs and handler signatures.

:::caution
Write the **full 128-bit UUID** when calling `AddService` / `AddCharacteristic` directly. Short forms like `"180D"` are accepted by Apple's `CBUUID.FromString` but throw on Android, which goes through `java.util.UUID.fromString`. The source generator normalizes them for you; the imperative API does not.
:::
