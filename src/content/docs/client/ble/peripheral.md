---
title: Peripheral
---

## Overview

`IPeripheral` represents a BLE device discovered during scanning. It provides connection management and GATT operations.

| Property | Type | Description |
|----------|------|-------------|
| `Uuid` | `string` | Unique identifier for this peripheral |
| `Name` | `string?` | Local name (may be null) |
| `Mtu` | `int` | Current MTU size |
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

MTU (Maximum Transmission Unit) determines the maximum data size per packet. The default is typically 20 bytes.

```csharp
// Check if MTU requests are supported
if (peripheral.CanRequestMtu())
{
    var newMtu = await peripheral.TryRequestMtuAsync(512);
    Console.WriteLine($"Negotiated MTU: {newMtu}");
}
```

:::note
MTU negotiation is only available on Android. On iOS, the MTU is negotiated automatically.
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
