---
title: Broadcasting
---

Turn the device itself into a beacon.

```csharp
services.AddBeaconBroadcasting();
```

```csharp
var access = await broadcaster.RequestAccess();
if (access != AccessState.Available)
    return;

await broadcaster.StartIBeacon(uuid, major: 1, minor: 2);

// or Eddystone
await broadcaster.StartEddystoneUid(EddystoneUid.Parse("0102030405060708090A", "0B0C0D0E0F10"));
await broadcaster.StartEddystoneUrl("https://shinylib.net/");

broadcaster.Stop();
```

Only one advertisement runs at a time — starting a second replaces the first.

## Transmit power

The optional `txPower` argument is the value a *receiver* calibrates against: "this is how strong I
measure at the reference distance". It does **not** change the radio's actual output power, which no
platform exposes. Getting it wrong skews every receiver's distance estimate.

Defaults are `-59` dBm for iBeacon (measured at 1 metre) and `-18` dBm for Eddystone (measured at
0 metres). If you are broadcasting for real use rather than testing, measure it.

## Platform support

| Platform | iBeacon | Eddystone |
|---|---|---|
| iOS / Mac Catalyst | Yes | **No** |
| macOS | Yes | **No** |
| Android | Yes | Yes |
| Windows | Yes | Yes |
| Linux | Not yet | Not yet |
| Blazor WASM | No | No |

### Apple cannot broadcast Eddystone

CoreBluetooth's `startAdvertising` reads exactly two keys — a local name and a list of service UUIDs
— and silently discards everything else in the dictionary. There is no way to put service data on
the air, and Eddystone *is* service data. `StartEddystoneUid` and `StartEddystoneUrl` throw
`PlatformNotSupportedException` there rather than appearing to succeed.

iBeacon works because Apple exposes a dedicated advertisement key for exactly that purpose.

### Apple stops broadcasting a usable beacon in the background

When the app is backgrounded, iOS moves the advertisement into an "overflow" area that only another
iOS device explicitly scanning for the same service UUID can see. It is no longer a beacon any other
device can decode. Plan for foreground-only broadcasting on Apple platforms.

### Linux

BlueZ is perfectly capable of this — `LEAdvertisement1` has both `ManufacturerData` and
`ServiceData` properties — but Shiny's BlueZ advertising support is not implemented yet, so
broadcasting throws. Beacon **scanning and monitoring** work fine on Linux.

## Building the payload yourself

If you are advertising through `IBleHostingManager` directly rather than through
`IBeaconBroadcaster`, use `IBeaconPacket` (in `Shiny.BluetoothLE`) or `EddystoneBuilder` to build the
bytes:

```csharp
var payload = IBeaconPacket.Build(uuid, major, minor, txPower: -59);

await hosting.StartAdvertising(new AdvertisementOptions
{
    ManufacturerData = new ManufacturerData(IBeaconPacket.AppleCompanyId, payload),
    IsConnectable = false
});
```

:::caution[Never hand-roll an iBeacon payload]
Every multi-byte field in an iBeacon advertisement is **big-endian**. `Guid.ToByteArray()` and
`BitConverter.GetBytes()` are both little-endian on every platform Shiny targets, so building the
packet with them ships a byte-swapped UUID, major and minor that no receiver can match. This is not
hypothetical — it is the bug `AdvertiseBeacon` shipped with before 5.6.0.
:::

## Permissions

- **iOS / Mac Catalyst / macOS** — `NSBluetoothAlwaysUsageDescription` in `Info.plist`
- **Android** — `android.permission.BLUETOOTH_ADVERTISE`
- **Windows** — the `bluetooth` capability for a packaged app, and an adapter that supports the
  peripheral role (`BluetoothAdapter.IsPeripheralRoleSupported`)
