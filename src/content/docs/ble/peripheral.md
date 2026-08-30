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

### Auto Connect

`AutoConnect` (on by default) keeps the peripheral connected for you - the connection is re-established when the
peripheral comes back into range or is power-cycled, without you having to watch `WhenDisconnected()` and call
`Connect()` again.

```csharp
peripheral.Connect(new ConnectionConfig(AutoConnect: true));

// opt out - faster initial connection, but you own reconnecting
peripheral.Connect(new ConnectionConfig(AutoConnect: false));
```

Setting `false` speeds up the initial connection (the OS connects to the peripheral it can see right now instead of
arming a background connect), at the cost of reconnecting yourself.

An explicit `CancelConnection()` is final - it tears the auto-reconnect down, so a deliberate disconnect never
reconnects behind your back. Call `Connect()` again to arm it once more.

:::note[Platform behaviour]
- **Android** - the OS holds a pending background connect that completes whenever the peripheral reappears. Because the
  platform only keeps that pending while the underlying GATT client is open - and the client has to be closed on every
  disconnect to release Android's 7-client limit - Shiny re-issues the connect after a dropped link, throttled to one
  attempt per second so a peripheral that rejects the reconnect cannot spin.
- **Apple (iOS, Mac Catalyst, macOS)** - Shiny retries the connect on a disconnect and on a failed connect attempt,
  cancelling the previous pending connection first (iOS otherwise holds onto its connection slot).
- **Windows** - the connection is held by a `GattSession` with `MaintainConnection` set, so the OS keeps the link up and
  re-establishes it itself.
:::

:::caution
Auto-reconnect restores the *link*, not your GATT state. Characteristic notifications set up through
`NotifyCharacteristic()` re-subscribe themselves as long as the observable subscription is still alive, but anything you
did once at connect time - MTU requests, an authentication handshake, reading a configuration characteristic - has to be
redone. Hook `WhenConnected()` and do that work there rather than after the first `ConnectAsync()`.
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
