---
title: Classic Bluetooth Transport (SPP)
---

`Shiny.Obd.Bluetooth` connects to ELM327-compatible adapters over **classic** Bluetooth (BR/EDR) —
RFCOMM and the Serial Port Profile. That is what the ELM327 v1.5 "Bluetooth" clones, the OBDLink LX,
Vgate iCar BT and Veepeak BT speak. They are not BLE devices, so [`Shiny.Obd.Ble`](/client/obd/ble)
never sees them in a scan, however long it runs.

It is built on [Shiny.Bluetooth](https://github.com/shinyorg/shiny) (6.5.1+).

## Platform support

| Platform | Supported | Manager registration |
|----------|-----------|----------------------|
| Android | Yes | Automatic — `AddShinyObdBluetooth()` registers it |
| Windows | Yes | `services.AddBluetooth()` from `Shiny.Bluetooth` |
| macOS | Yes | `services.AddBluetooth()` from `Shiny.Bluetooth` |
| Linux | Yes | `services.AddLinuxBluetooth()` from `Shiny.Bluetooth.Linux` (BlueZ) |
| **iOS, Mac Catalyst** | **No** | — |

:::caution[No classic Bluetooth on iOS]
Classic Bluetooth on Apple mobile is ExternalAccessory, which only reaches MFi-certified accessories —
and no ELM327 clone is one. On iOS use a [BLE](/client/obd/ble) or [WiFi](/client/obd/wifi) adapter.
Dual-mode adapters such as the OBDLink MX+ answer over BLE on iOS and over either radio elsewhere.
:::

## Installation

```xml
<PackageReference Include="Shiny.Obd" />
<PackageReference Include="Shiny.Obd.Bluetooth" />

<!-- Linux only -->
<PackageReference Include="Shiny.Bluetooth.Linux" />
```

## Registration

```csharp
// picks the first paired device whose name looks like an OBD adapter
services.AddShinyObdBluetooth();

// or, against a known adapter address
services.AddShinyObdBluetooth("00:1D:A5:68:98:8B");

// with configuration
services.AddShinyObdBluetooth(config =>
{
    config.DeviceNameFilters = ["OBDLink"];
    config.ConnectAttempts = 3;
});
```

On Windows and macOS also call `services.AddBluetooth()`; on Linux `services.AddLinuxBluetooth()`.
This library cannot do it for you there — only the app knows which platform assembly it is running —
and forgetting it throws an `ObdException` naming the call to add, rather than a bare DI failure.

`IObdTransport`, `IObdConnection` and `IObdDeviceScanner` are registered as **singletons** with
`TryAdd`, like every other transport: calling this alongside `AddShinyObdBluetoothLE()` leaves
whichever ran first in place.

### Android manifest

```xml
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" android:maxSdkVersion="30" />
```

On macOS add `NSBluetoothAlwaysUsageDescription` to Info.plist (and
`com.apple.security.device.bluetooth` when sandboxed). `Connect` and `Scan` both call
`RequestAccess` themselves, so there is no separate permission step to remember.

## Direct construction

```csharp
var transport = new BluetoothObdTransport(bluetoothManager, new BluetoothObdConfiguration
{
    Address = null,          // null picks from the paired devices
    Secure = true,
    CommandTimeout = TimeSpan.FromSeconds(10)
});

var connection = new ObdConnection(transport);
await connection.Connect();

Console.WriteLine($"Connected to {transport.ConnectedDevice?.Name} ({transport.ConnectedDevice?.Address})");
```

## Picking the adapter

Classic Bluetooth has no service UUID to scan for. Finding out whether a device publishes SPP takes a
baseband connection and an SDP lookup per device, so the adapter is chosen by **address**, or failing
that by **name**:

1. `Address` set — that device, whether paired or not.
2. `Address` null — the first **paired** device whose name contains any of `DeviceNameFilters`. The
   defaults (`OBD`, `ELM`, `V-LINK`, `VLINK`, `VGATE`, `VEEPEAK`, `KONNWEI`, `ICAR`) cover the names the
   common adapters ship with, and keep the headphones paired on every phone from being mistaken for
   one. When nothing matches, the exception lists what *is* paired.

`Connect` never runs an inquiry itself — it takes about 12 seconds and an adapter that has never been
paired needs the user's attention anyway. Use the scanner for that, and persist
`ConnectedDevice.Address` once a user has picked an adapter.

## Discovery

```csharp
var scanner = new BluetoothObdDeviceScanner(bluetoothManager);
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));

await scanner.Scan(device =>
{
    var native = (IBluetoothDevice)device.NativeDevice;
    Console.WriteLine($"{device.Name} {device.Id} paired: {native.IsPaired}");
}, cts.Token);

// later, with the one the user tapped
var transport = new BluetoothObdTransport(bluetoothManager, selected, new BluetoothObdConfiguration());
```

Matching **paired** devices are reported immediately. With `DiscoverUnpaired` on (the default),
inquiries then run back to back until the token is cancelled, reporting adapters that have never been
paired. Each device is reported once; `Id` is its address.

:::tip[Cancel the scan before connecting]
An inquiry in progress slows RFCOMM connections on the same radio considerably. Stop scanning as soon
as the user picks an adapter.
:::

## Pairing

With `Secure` on (the default) the link is authenticated, and an unpaired adapter is **paired on the
way in** — the OS shows its own PIN or confirmation prompt. Most clones use PIN `1234` or `0000`. If
your users find the prompt confusing, have them pair once in the system Bluetooth settings; after that
the adapter appears in the paired list and connects without asking.

Turn `Secure` off only for a clone that refuses to pair at all: Android then opens an "insecure"
socket and Windows a `PlainSocket`. macOS always lets the system decide.

## Configuration

| Property | Default | Notes |
|----------|---------|-------|
| `Address` | `null` | `AA:BB:CC:DD:EE:FF`. Null picks from the paired devices |
| `DeviceNameFilters` | common adapter names | Case-insensitive substrings. Empty matches every device, unnamed ones included |
| `ServiceUuid` | SPP (`0x1101`) | `BluetoothServiceUuids.SerialPort` |
| `Secure` | `true` | Authenticated, encrypted link |
| `ConnectTimeout` | `20s` | Per attempt, SDP lookup included |
| `ConnectAttempts` | `2` | Android's first connect after an adapter powers up fails routinely |
| `ConnectRetryDelay` | `1s` | |
| `CommandTimeout` | `10s` | Per command |
| `DiscoverUnpaired` | `true` | Scanner runs inquiries after listing paired devices |

## Connection lifetime

`IsConnected` is tracked from the read pump, so it goes false as soon as the adapter drops the link —
most often because the ignition turned off and took the adapter's power with it — and a command in
flight fails immediately with `ObdException` instead of sitting out its timeout.

There is deliberately **no auto-reconnect**. A dropped RFCOMM link takes the ELM327's session state
(`ATE0`, `ATS1`, the negotiated protocol) with it, so a silent redial would hand back a connection whose
replies parse as garbage. Call `ObdConnection.Connect()` again; it re-initialises the adapter.
