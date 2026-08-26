---
title: Peripheral
---

## Overview

`IPeripheral` represents a BLE device discovered during scanning. It provides connection management and GATT operations.

| Property | Type | Description |
|----------|------|-------------|
| `Uuid` | `string` | Unique identifier for this peripheral |
| `Name` | `string?` | Local name (may be null) |
| `Mtu` | `int` | Usable payload per GATT operation - the negotiated ATT MTU minus the 3-byte ATT header. Starts at `20` |
| `Status` | `ConnectionState` | Current connection state |

## Connecting

```csharp
IPeripheral peripheral; // from scan result

// Fire and forget - connects when in range
peripheral.Connect();

// Async - waits for connection to establish
await peripheral.ConnectAsync(cancelToken: cts.Token, timeout: TimeSpan.FromSeconds(10));
```

### Auto Connect (Android)

On Android, `AutoConnect` controls whether the system should automatically connect when the peripheral comes into range.

```csharp
peripheral.Connect(new ConnectionConfig(AutoConnect: true));
```

:::note
On iOS, `AutoConnect` controls whether the system will attempt to reconnect if the connection drops.
:::

## Disconnecting

```csharp
peripheral.CancelConnection();

// or async
await peripheral.DisconnectAsync();
```

:::warning
Always call `CancelConnection()` when you're done with a peripheral. Not doing so will leave the connection open and drain the device battery.
:::

## Monitoring Connection Status

```csharp
peripheral
    .WhenStatusChanged()
    .Subscribe(state =>
    {
        // ConnectionState: Connecting, Connected, Disconnecting, Disconnected
    });

// Convenience extensions
peripheral.WhenConnected().Subscribe(p => { /* connected */ });
peripheral.WhenDisconnected().Subscribe(p => { /* disconnected */ });
```

### Connection Failures

```csharp
peripheral
    .WhenConnectionFailed()
    .Subscribe(ex =>
    {
        // BleException with details about the failure
    });
```

## MTU Negotiation

The ATT MTU (Maximum Transmission Unit) determines how much data fits in a single GATT operation. Every
BLE link starts at the spec minimum of 23 bytes, of which 3 are the ATT header - so 20 bytes of payload.

:::caution[`Mtu` is the payload, not the ATT MTU]
`IPeripheral.Mtu` - and the value emitted by `RequestMtu` / `TryRequestMtu` / `TryRequestMtuAsync` - is
the **usable payload**: the negotiated ATT MTU with the 3-byte ATT header already removed. Fragment your
writes to `peripheral.Mtu` directly. Subtracting 3 yourself removes the header twice; passing the value
to an API that genuinely expects an ATT MTU overshoots the link by 3 bytes, which some stacks silently
truncate rather than reject.

Note the deliberate asymmetry in a single call: the value you *pass in* is an ATT MTU (it goes straight
to the platform's negotiation API), while the value you *get back* is the payload. Requesting `512`
typically yields `509`.
:::

```csharp
// Check if ATT MTU requests are supported
if (peripheral.CanRequestMtu())
{
    // 512 is the requested ATT MTU; the result is the usable payload
    var payloadSize = await peripheral.TryRequestMtuAsync(512);
    Console.WriteLine($"Usable payload: {payloadSize} bytes"); // 509 when 512 is granted
}

// Fragment to this value as-is
foreach (var chunk in data.Chunk(peripheral.Mtu))
    await peripheral.WriteCharacteristicAsync(serviceUuid, charUuid, chunk);
```

Need the ATT MTU itself - to hand to a peer protocol that negotiates its own framing, for example?
Add the header back:

```csharp
var attMtu = peripheral.Mtu + BleConstants.AttHeaderSize;
```

:::note
MTU negotiation is only available on Android. On iOS and macOS the MTU is negotiated automatically, and
`Mtu` reflects whatever CoreBluetooth settled on. Windows does not expose the client-side negotiated
value and reports the default `20`; Linux (BlueZ) negotiates internally and reports `509`.
:::

## Pairing

```csharp
// Check if pairing is available
if (peripheral.IsPairingRequestsAvailable())
{
    var result = await peripheral
        .TryPairingRequest()
        .ToTask();

    if (result == true)
        Console.WriteLine("Paired successfully");
}

// Check current pairing status
var status = peripheral.TryGetPairingStatus();
// PairingState: NotPaired, Paired
```

:::note
Programmatic pairing is only available on Android.
:::

## Reading RSSI

```csharp
var rssi = await peripheral.ReadRssiAsync();
Console.WriteLine($"RSSI: {rssi} dBm");
```
