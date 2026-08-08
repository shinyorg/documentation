---
title: Serial Transport (USB / UART)
---

`Shiny.Obd.Serial` connects to any ELM327-compatible adapter that presents as a serial port —
OBDLink SX/EX, ELM327 clones on CH340/FTDI/CP210x bridges, and adapters wired directly to a board's
TX/RX pins.

It is built on `System.IO.Ports`, which is supported on **Windows, Linux, macOS and Mac Catalyst**.

## Platform support

| Platform | Supported | Notes |
|----------|-----------|-------|
| Windows, Linux, macOS | Yes | |
| Mac Catalyst | Yes | Marked `[SupportedOSPlatform]` on the assembly |
| **Android** | **No** | Compiles and loads, but cannot open a port — see below |
| iOS, tvOS, Browser/WASM | No | `[UnsupportedOSPlatform]`; throws `PlatformNotSupportedException` |

:::danger[Android compiles but cannot work]
`System.IO.Ports` is *not* marked unsupported on Android, and its native library really does ship for
the `android-*` RIDs — so a `net10.0-android` project can reference this package and build cleanly.
It then fails at runtime with `UnauthorizedAccessException`, not `PlatformNotSupportedException`,
which looks like a fixable permissions problem and is not.

The kernel does create `/dev/ttyUSB0` when a USB-serial adapter is attached in host mode, but the node
is owned `root:usb` and an app's UID is not in that group. Only a rooted device can open it.

Android's supported route is the **USB Host API** — `UsbManager`, a runtime permission intent,
`openDevice()`, then bulk transfers on the endpoints, with the FTDI/CH340/CP210x/CDC-ACM protocol
implemented in user space. That is a different `IObdTransport`, not a configuration of this one.
**On Android, use [`Shiny.Obd.Ble`](/client/obd/ble).**
:::

:::tip[Prefer serial for fixed installs]
For a permanently installed device — a Raspberry Pi appliance, a fleet tracker, a dashcam — this is
the transport to choose over BLE. There is no pairing, no scan, no reconnect storm after a power
cycle, and a wired adapter cannot wander out of range.
:::

## Installation

```xml
<PackageReference Include="Shiny.Obd" />
<PackageReference Include="Shiny.Obd.Serial" />
```

## Registration

```csharp
services.AddShinyObdSerial(config =>
{
    config.PortNameFilter = "OBDLink";
    config.BaudRate = 115200;
});

// or, against a known port
services.AddShinyObdSerial("/dev/ttyUSB0");
```

`IObdTransport`, `IObdConnection` and `IObdDeviceScanner` are registered as **singletons**. An OBD
adapter is a single physical resource; a scoped or transient registration would leave two consumers
fighting over one serial port.

## Direct construction

```csharp
var transport = new SerialObdTransport(new SerialObdConfiguration
{
    PortName = null,                  // null discovers a port
    PortNameFilter = "OBDLink",
    AutoDetectBaudRate = true,
    CommandTimeout = TimeSpan.FromSeconds(10)
});

var connection = new ObdConnection(transport);
await connection.Connect();

Console.WriteLine($"Opened {transport.ConnectedPortName} at {transport.ConnectedBaudRate} baud");
```

## Configuration

| Property | Default | Notes |
|----------|---------|-------|
| `PortName` | `null` | Null discovers one. Prefer a `/dev/serial/by-id/...` path on Linux |
| `BaudRate` | `38400` | The ELM327 default. OBDLink/STN adapters run happily at 115200 and up |
| `AutoDetectBaudRate` | `true` | Probes `BaudRateCandidates` at connect |
| `BaudRateCandidates` | `38400, 115200, 9600, 500000` | |
| `PortNameFilter` | `null` | Substring match against the port name or description |
| `DtrEnable` / `RtsEnable` | `true` | Most USB bridges hold the adapter in reset until DTR is raised |
| `OpenSettleDelay` | `500ms` | Bridges that reset on DTR swallow anything sent during the reset |
| `CommandTimeout` | `10s` | Per command |

### Baud rate probing

A UART at the wrong baud rate does not go quiet — it returns framing garbage. The probe therefore
checks the *shape* of the `ATI` reply (a known adapter string, or at least mostly-printable ASCII)
rather than merely that a reply arrived. It costs a second or two at connect and removes an entire
category of "it connects but returns nonsense" problem.

## Discovery

```csharp
var scanner = new SerialObdDeviceScanner();
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));

await scanner.Scan(device =>
{
    var info = (SerialPortInfo)device.NativeDevice;
    Console.WriteLine($"{info.PortName} — {info.Description} (likely: {info.IsLikelyAdapter})");
}, cts.Token);
```

Unlike a raw `SerialPort.GetPortNames()`, discovery is platform-aware:

| Platform | Enumerated | Why |
|----------|-----------|-----|
| Linux | `/dev/serial/by-id/*`, then `ttyUSB*` / `ttyACM*` / `ttyAMA*` / `serial*` | `by-id` names are built from the USB descriptor, so they carry the vendor and serial number **and survive a reboot** |
| macOS | `/dev/cu.*` only | Opening the matching `tty.` node blocks until the device asserts carrier detect, which a USB-serial bridge never does |
| Windows | `SerialPort.GetPortNames()` | Backed by the SERIALCOMM device map, and accurate |

Candidates are returned likely-adapter first, matched against known OBD brands (OBDLink, Veepeak,
Vgate, ScanTool) *and* the USB-serial bridge chips they are built on (FTDI, CH340, CP210x, PL2303).
The bridges are included deliberately: a genuine OBDLink SX presents as a stock FTDI device with no
OBD branding anywhere in its USB descriptor, so matching only on "OBD" would skip the best adapter on
the list.

:::caution[Use a by-id path on Linux]
`/dev/ttyUSB0` is assigned in USB enumeration order. A second USB serial device — a GNSS puck, a
cellular modem — can take that name out from under your adapter across a reboot. Use the
`by-id` path (`SerialPortInfo.StablePath`) in any configuration you persist.
:::

## Linux permissions

Opening a serial port requires the `dialout` group:

```bash
sudo usermod -aG dialout $USER   # log out and back in
```

ModemManager also probes every serial device it sees and will hold an OBD adapter open for several
seconds sending AT commands at it, which makes connects fail intermittently and unreproducibly. Tell
it to ignore the bridges:

```
# /etc/udev/rules.d/77-no-modemmanager-obd.rules
ATTRS{idVendor}=="0403", ENV{ID_MM_DEVICE_IGNORE}="1"   # FTDI
ATTRS{idVendor}=="1a86", ENV{ID_MM_DEVICE_IGNORE}="1"   # CH340
ATTRS{idVendor}=="10c4", ENV{ID_MM_DEVICE_IGNORE}="1"   # CP210x
```
