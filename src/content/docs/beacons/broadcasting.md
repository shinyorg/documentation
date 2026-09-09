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
| Linux | Yes | Yes |
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

BlueZ inverts the model every other platform uses. Rather than handing a payload to an API, the
application **exports a D-Bus object** describing the advertisement and registers its path with
`org.bluez.LEAdvertisingManager1`; BlueZ then calls *back into your process* to read the properties,
and calls `Release()` on that object when it drops the advertisement. Shiny does all of that for you,
but two consequences leak through and are worth planning for:

- **The process has to stay alive and connected to the system bus** for the advertisement to keep
  running. There is no fire-and-forget: if your app exits, BlueZ has nothing left to read from.
- **BlueZ can stop the advertisement on its own** — the adapter powering down, `bluetoothd`
  restarting, or another client taking the last advertising slot. Shiny honours the resulting
  `Release()`, so `IsAdvertising` goes false rather than getting stuck on, and you can start again.

The adapter caps how many advertising instances run at once
(`LEAdvertisingManager1.SupportedInstances`). When it is full, `RegisterAdvertisement` fails and the
exception carries BlueZ's own reason.

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
