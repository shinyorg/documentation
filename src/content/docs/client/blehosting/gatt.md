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

## Managed Characteristics

For more complex scenarios, use the managed characteristic pattern with dependency injection.

### 1. Create the Characteristic Class

```csharp
[BleGattCharacteristic(
    "Your-Service-UUID",
    "Your-Characteristic-UUID",
    Notifications = NotificationOptions.Notify,
    Write = WriteOptions.Write
)]
public class MyCharacteristic : BleGattCharacteristic
{
    readonly ILogger<MyCharacteristic> logger;

    public MyCharacteristic(ILogger<MyCharacteristic> logger)
    {
        this.logger = logger;
    }

    public override Task OnStart()
    {
        this.logger.LogInformation("Characteristic started");
        return Task.CompletedTask;
    }

    public override void OnStop()
    {
        this.logger.LogInformation("Characteristic stopped");
    }

    public override Task<GattResult> OnRead(ReadRequest request)
    {
        var data = System.Text.Encoding.UTF8.GetBytes("Hello from managed");
        return Task.FromResult(GattResult.Success(data));
    }

    public override Task OnWrite(WriteRequest request)
    {
        this.logger.LogInformation("Received: {Data}", request.Data.Length);
        return Task.CompletedTask;
    }

    public override Task OnSubscriptionChanged(IPeripheral peripheral, bool subscribed)
    {
        this.logger.LogInformation("Subscription: {Subscribed}", subscribed);
        return Task.CompletedTask;
    }
}
```

### 2. Register

```csharp
services.AddBleHostedCharacteristic<MyCharacteristic>();
```

### 3. Attach/Detach

```csharp
IBleHostingManager hostingManager; // injected

// Attach all registered managed characteristics as GATT services
await hostingManager.AttachRegisteredServices();

// Detach when done
hostingManager.DetachRegisteredServices();

// Check if attached
var isAttached = hostingManager.IsRegisteredServicesAttached;
```
