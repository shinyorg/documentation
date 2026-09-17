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

On iOS, Mac Catalyst and macOS, `Notify` applies CoreBluetooth's back-pressure: when the transmit queue is
full it waits until the queue drains and retries, so the returned task completes once the value is actually
queued. Await it before sending the next notification rather than firing many in parallel.

Pass a `CancellationToken` to stop waiting - it goes before the centrals. If Bluetooth powers off while a
notification is waiting, the task faults with `InvalidOperationException`.

```csharp
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
await characteristic.Notify(data, cts.Token);
await characteristic.Notify(data, cts.Token, central1, central2);
```

An empty centrals list sends to every subscriber; a named list sends only to those centrals. `SubscribedCentrals`
is tracked whether or not you pass a subscribe hook to `SetNotification`.

:::note[Android]
`Notify` waits for each central's `onNotificationSent` before sending that central the next value - Android
refuses a second notification while one is in flight. Centrals are sent to in parallel. A notification Android
refuses or reports as failed throws; a central that disconnects mid-send is skipped.
:::

:::caution[Linux (BlueZ)]
BlueZ tells an external GATT application only *whether* notifications are enabled, not *which* central
enabled them - while any central is subscribed, every connected central is reported in `SubscribedCentrals`. BlueZ
also sends each value to every subscribed central, so the `centrals` you pass cannot narrow the recipients (the
send is skipped only if none of them is subscribed). Don't put per-central data on a notify characteristic shared
by several centrals on Linux.
:::

`NotificationOptions` flags: `Notify`, `Indicate`, `EncryptionRequired`

## Messages Longer Than One Operation

A single write or notification carries at most `Mtu` bytes — 20 on a link that never negotiated more. Anything longer — a JSON command, a certificate, a scan result — has to be split, and the receiver has to know where one message ends and the next begins. `BleMessageFraming` does both, and the same format is spoken by the [central side](../ble/gatt#messages-longer-than-one-operation) (`WriteCharacteristicMessageAsync` / `NotifyCharacteristicMessages`).

Every fragment starts with one header byte:

| Bits | Meaning |
|------|---------|
| 7 | START — first fragment of a message |
| 6 | END — last fragment of a message |
| 0-5 | Sequence number, counting fragments within the message and wrapping at 64 |

A message that fits in one fragment has both START and END set, so a short message costs one byte. The sequence number lets the receiver notice a dropped or reordered fragment and abandon the message rather than hand back garbage.

:::tip
For a generated service, set `Framed = true` on `[RequestResponseCharacteristic]` and the generator does everything below for you — see [Source Generator → Framed messages](./source-generator#framed-messages).
:::

### Sending

`NotifyMessage` splits a message to one central's MTU and sends the fragments one after another, each waiting for the platform to accept the last:

```csharp
using Shiny.BluetoothLE.Hosting;

await characteristic.NotifyMessage(largePayload, central, cancellationToken);
```

It addresses a single central because fragments are sized for that central. Don't send two messages to the same central on the same characteristic concurrently — their fragments would interleave and the central would discard both.

### Receiving

Feed each write into a `BleMessageReassembler`. It holds the partial message between writes, so keep **one per central** — never one shared between them, or two centrals' fragments interleave:

```csharp
using System.Collections.Concurrent;
using Shiny.BluetoothLE;
using Shiny.BluetoothLE.Hosting;

var reassemblers = new ConcurrentDictionary<string, BleMessageReassembler>();

cb.SetWrite(async request =>
{
    var reassembler = reassemblers.GetOrAdd(
        request.Peripheral.Uuid,
        _ => new BleMessageReassembler(maxMessageBytes: 32 * 1024)
    );

    BleMessageFrameResult frame;
    byte[]? message;
    lock (reassembler)
        frame = reassembler.Push(request.Data, out message);

    if (request.IsReplyNeeded)
        request.Respond(frame is BleMessageFrameResult.Partial or BleMessageFrameResult.Complete
            ? GattState.Success
            : GattState.Failure);

    if (frame == BleMessageFrameResult.Complete)
    {
        var reply = await HandleCommand(message!);
        await request.Characteristic.NotifyMessage(reply, request.Peripheral);
    }
}, WriteOptions.Write);
```

| `BleMessageFrameResult` | Meaning |
|--------|-------------|
| `Partial` | The fragment was accepted and more are expected |
| `Complete` | The fragment finished a message — `message` is set |
| `Malformed` | The fragment was too short to carry a header |
| `OutOfSequence` | A fragment was missing, reordered, or arrived with no START before it |
| `TooLarge` | The message grew past `maxMessageBytes` (64 KB by default) |

Every error has already discarded the partial message, so the next START fragment begins cleanly. A START that arrives in the middle of a message means the sender gave up and began again; the partial message is dropped. The size cap matters — without one, an unauthenticated central could stream fragments until the host runs out of memory.

Inside a `[BleService]` class, `context.GetMessageReassembler(characteristicUuid, maxMessageBytes)` hands you the reassembler for that central and characteristic, held on the per-central context so it lives exactly as long as the connection.

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
