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
peripheral comes back into range, is power-cycled, or the user toggles Bluetooth off and on, without you having to
watch `WhenDisconnected()` and call `Connect()` again.

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
- **Linux (BlueZ)** - Shiny re-issues the connect on a disconnect, but the adapter's own `Powered` state is not tracked,
  so the Bluetooth off/on handling described below does not apply there.
:::

### Bluetooth turned off and on

Applies to **iOS, Mac Catalyst, macOS, and Android**. Users toggle Bluetooth in Settings - often *because* something is
misbehaving - and neither OS reports the resulting drop per peripheral. CoreBluetooth does not call
`didDisconnectPeripheral` when the adapter powers down, and several Android devices deliver no GATT connection-state
callback either. Shiny watches the adapter itself and treats a power-down as a disconnect:

- Every peripheral that was `Connected` or `Connecting` gets the full teardown a real disconnect gets - notifiers
  cleared, in-flight operations broken so the operation queue is not left holding its lock, and on Android the GATT
  client closed and service discovery re-armed.
- `WhenStatusChanged()` emits `Disconnected`, so the status stream agrees with `IPeripheral.Status` (which reads the
  platform live and reported `Disconnected` all along).
- When the adapter comes back, every peripheral connected with `AutoConnect: true` is reconnected.

Connects issued while the adapter is off are **parked**, not dropped. `ConnectPeripheral` below `PoweredOn` on Apple
and `ConnectGatt` with the adapter off on Android are silent no-ops that never report back, so Shiny holds the request
and replays it when the adapter returns - your own `Connect()` from `OnAdapterStateChanged` included. A
`CancelConnection()` discards anything parked, as you would expect.

Starting a scan while a peripheral is waiting to reconnect is safe: `Scan()` prunes the manager's peripheral cache, but
it no longer evicts a peripheral with an armed auto-reconnect or a parked connect. Scanning as a fallback while the link
is down - a natural thing to do - will not quietly cancel the reconnect.

:::caution[Behaviour change in 5.6]
Before 5.6 an adapter power cycle produced no status change at all. If you drive your own reconnect off
`WhenDisconnected()`, you will now see a `Disconnected` when the user turns Bluetooth off - gate that handler on the
adapter being available, or let `AutoConnect: true` handle the cycle for you.
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

## Native Platform Objects

Diagnostics and inspection tools (a debug overlay, an agent such as MAUI DevFlow) can get the platform object behind the manager or a peripheral without casting to each platform's class:

```csharp
object? central = bleManager.GetNativeObject();
object? device = peripheral.GetNativeObject();

// or typed, in platform code
var cb = peripheral.GetNativeObject<CoreBluetooth.CBPeripheral>();
```

| Platform | `IBleManager` | `IPeripheral` |
|---|---|---|
| iOS, Mac Catalyst, macOS | `CBCentralManager` (null until Bluetooth is first used) | `CBPeripheral` |
| Android | `BluetoothManager` | `BluetoothDevice` |
| Windows | `BluetoothAdapter` of the selected radio (null until a radio is resolved) | `BluetoothLEDevice` (null once the connection is cancelled) |
| Linux | BlueZ adapter object path, e.g. `/org/bluez/hci0` (null until the bus is first used) | BlueZ device object path, e.g. `/org/bluez/hci0/dev_AA_BB_CC_DD_EE_FF` |
| Blazor WebAssembly | null | null |

Reading these never creates anything: on Apple it doesn't create the `CBCentralManager` or raise the Bluetooth permission prompt. They come from `INativeBleManager` and `INativePeripheral`, and `GetNativeObject()` returns null when the platform has neither.

To find out when the manager's object appears, subscribe to `WhenNativeObjectLoaded()`. It emits the object straight away if it already exists, then again when the platform creates it. That happens the first time the app uses Bluetooth on Apple and Linux, and each time a radio is selected on Windows. Subscribing doesn't create the object, and on Blazor WebAssembly the observable completes without emitting.

```csharp
bleManager
    .WhenNativeObjectLoaded()
    .Subscribe(native => inspector.Attach(native));
```

The observable wraps the `INativeBleManager.NativeObjectLoaded` event. If you use the event directly, hook it before reading `NativeObject`, because it never fires on Android: the `BluetoothManager` exists from the moment the manager is constructed. An exception thrown by a handler is logged and doesn't affect the Bluetooth call that created the object.

Each platform class also has typed properties. Android has `Native` and `Gatt`. Apple has `Manager` and `Native`, and reading `Manager` does create the central. Windows has `SelectedRadio`, `SelectedAdapter`, `Watcher`, `Native` and `DeviceInfo`. Linux has `Connection`, `AdapterObjectPath` and `ObjectPath`.

### Supplying your own native manager

:::danger[Experts only]
Do this only if you know the platform's Bluetooth stack in depth. Shiny assumes it created the native object itself. An object configured differently, with another delegate, dispatch queue, restore identifier, connection or adapter, can silently break scanning, connections, background restoration and `IBleDelegate`. This is an escape hatch, not a configuration option, and problems it causes aren't treated as Shiny bugs.
:::

`SetNativeObjectAsync` hands Shiny a native object you created yourself. Call it before the app first uses Bluetooth: once the manager exists it throws `InvalidOperationException`, and the wrong type throws `ArgumentException`. It raises `NativeObjectLoaded` and logs a warning.

```csharp
// before anything scans, connects or requests access
await bleManager.SetNativeObjectAsync(myCentralManager);
```

| Platform | Accepts | Typed method on `BleManager` | Notes |
|---|---|---|---|
| iOS, Mac Catalyst | `CBCentralManager` | `SetManager(central)` | Shiny becomes its delegate. With an `IBleDelegate` registered, create it with a restore identifier, or background restoration is lost. |
| macOS | `CBCentralManager` | `SetManager(central)` | Shiny becomes its delegate. |
| Android | `BluetoothManager` | `SetNative(manager)` | Only before the first scan or peripheral. |
| Windows | `BluetoothAdapter` | `SetAdapterAsync(adapter)` | Must support Low Energy, and can't be set while scanning. It selects where access and radio state come from. The advertisement watcher always scans on the system default adapter. |
| Linux | Adapter object path string, or `DBusConnection` | `SetConnection(connection, adapterObjectPath)` | Use the path to pick another adapter, such as `/org/bluez/hci1`. The connection must already be connected, and Shiny won't dispose it. |
| Blazor WebAssembly | — | — | Throws `NotSupportedException`. |

:::caution
Use the native object to inspect, not to run GATT. Shiny is the `CBPeripheral` delegate and the Android `BluetoothGattCallback`, and replacing either breaks every Shiny operation on that peripheral.
:::
