---
title: Eddystone
---

Eddystone is Google's open beacon format. Unlike iBeacon it travels as **service data** under UUID
`0xFEAA`, which every platform hands to the app untouched — CoreBluetooth included. That makes it the
one beacon format that behaves identically everywhere.

```csharp
services.AddEddystoneScanning();
```

```csharp
var access = await scanner.RequestAccess();
if (access != AccessState.Available)
    return;

var sub = scanner.WhenFrameReceived().Subscribe(frame =>
{
    switch (frame)
    {
        case EddystoneUidFrame uid:
            Console.WriteLine($"{uid.Uid.Namespace}/{uid.Uid.Instance} at {uid.Distance:N1}m");
            break;

        case EddystoneUrlFrame url:
            Console.WriteLine(url.Url);
            break;

        case EddystoneTlmFrame { IsEncrypted: false } tlm:
            Console.WriteLine($"{tlm.BatteryVolts}V {tlm.TemperatureCelsius}°C, up {tlm.Uptime}");
            break;

        case EddystoneEidFrame eid:
            Console.WriteLine($"EID {eid.EphemeralIdHex}");
            break;
    }
});
```

The scan is filtered to `0xFEAA`, which is also what lets it keep delivering results when an iOS app
is backgrounded — CoreBluetooth delivers nothing in the background from an unfiltered scan.

## Frame types

### UID — identity

A 10-byte **namespace** naming the deployment and a 6-byte **instance** naming the individual beacon
within it.

```csharp
var uid = EddystoneUid.Parse("0102030405060708090A", "0B0C0D0E0F10");

// EddystoneUid is a value type - compare it directly
if (frame.Uid == uid) { }
```

`Namespace` is 20 hex characters, `Instance` is 12.

### URL — a compressed web address

Eddystone squeezes a URL into 17 bytes by substituting one byte for the scheme and another for any of
thirteen common top-level-domain endings. Shiny decodes it for you; `EddystoneUrlFrame.Url` is the
expanded form.

`EddystoneUrlCodec` is public if you need the compression directly — `Encode(url)` throws with a
clear message when a URL will not fit, rather than silently truncating.

### TLM — telemetry about the beacon itself

```csharp
case EddystoneTlmFrame tlm when !tlm.IsEncrypted:
    // BatteryVolts is null on a mains-powered beacon, not 0
    // TemperatureCelsius is null when no sensor is fitted, not 128
    Console.WriteLine($"{tlm.BatteryVolts:N3} V");
    Console.WriteLine($"{tlm.TemperatureCelsius:N1} °C");
    Console.WriteLine($"{tlm.AdvertisementCount:N0} advertisements since power-on");
    Console.WriteLine($"up for {tlm.Uptime}");
    break;
```

The spec reserves `0` millivolts for "mains powered" and `0x8000` for "no temperature sensor". Shiny
surfaces both as `null` rather than as a flat battery and a 128°C beacon.

Encrypted TLM (version `0x01`) is handed back intact in `EncryptedPayload` for a caller that holds
the beacon's identity key.

### EID — a rotating identifier

`EddystoneEidFrame.EphemeralId` is the raw 8 bytes, with `EphemeralIdHex` for convenience. Resolving
one back to a registered beacon needs the deployment's identity key and the Curve25519 / AES-EAX
derivation from the Eddystone-EID specification, which **Shiny does not implement**.

## Correlating frames from one beacon

A beacon interleaves frame types — you will see a UID frame, then a TLM frame, then a UID frame
again. The only thing tying them together is the transmitting peripheral:

```csharp
var byBeacon = new Dictionary<string, BeaconHealth>();

scanner.WhenFrameReceived().Subscribe(frame =>
{
    var health = byBeacon.GetOrAdd(frame.PeripheralId);

    if (frame is EddystoneUidFrame uid)
        health.Uid = uid.Uid;

    if (frame is EddystoneTlmFrame tlm)
        health.BatteryVolts = tlm.BatteryVolts;
});
```

## Transmit power and distance

:::note[Eddystone calibrates at 0 metres, iBeacon at 1 metre]
The two formats use different reference distances — a 41 dBm difference. Shiny accounts for it when
estimating distance, so an Eddystone `TxPower` and an iBeacon `TxPower` are **not** comparable
numbers. Do not "fix" one by matching it to the other.
:::

Everything on the [Distance & Accuracy](/beacons/distance) page applies to Eddystone too, including
the RSSI filtering — and unlike iBeacon on Apple platforms, it applies on *every* platform, because
Eddystone always comes through the BLE scan rather than CoreLocation.

## Permissions

Eddystone is a plain BLE scan on every platform:

- **iOS / Mac Catalyst / macOS** — `NSBluetoothAlwaysUsageDescription` in `Info.plist`
- **Android** — `BLUETOOTH_SCAN` with `usesPermissionFlags="neverForLocation"`
- **Windows** — the `bluetooth` capability for a packaged app
