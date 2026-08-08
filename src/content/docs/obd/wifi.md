---
title: WiFi Transport (TCP)
---

`Shiny.Obd.Wifi` connects to any ELM327-compatible adapter that exposes a raw TCP socket — OBDLink MX
Wi-Fi, Veepeak WiFi, Vgate iCar, and the many clones built on an ESP8266 or ESP32.

A WiFi OBD adapter is a TCP-to-UART bridge. It runs its own WiFi access point, you join it, and it
hands you the ELM327's serial stream over a socket. There is no framing, no handshake and no protocol
on top — bytes in, bytes out, terminated by the `>` prompt.

:::note[The OBDLink MX+ is Bluetooth, not WiFi]
It is easy to mix up. The **MX+** is BLE plus classic Bluetooth SPP — use the
[BLE transport](/client/obd/ble). The WiFi model in that product line is the **OBDLink MX Wi-Fi**.
:::

## Platform support

This is the only transport with no platform caveats. It is a plain socket, so it behaves identically
everywhere:

| Platform | Supported | Notes |
|----------|-----------|-------|
| iOS | Yes | Needs `NSLocalNetworkUsageDescription` — see below |
| Android | Yes | Needs network binding — see below |
| Windows, Linux, macOS, Mac Catalyst | Yes | |
| Browser / WASM | No | A browser cannot open a raw TCP socket |

Compare: [serial](/client/obd/serial) cannot be used on iOS or Android at all, and
[BLE](/client/obd/ble) requires a BLE adapter and pairing.

## Registration

```csharp
// Probes the well-known adapter addresses and the current network's gateway
services.AddShinyObdWifi();

// Or pin it, skipping detection
services.AddShinyObdWifi("192.168.0.10", 35000);

// Or configure it
services.AddShinyObdWifi(config =>
{
    config.Host = "192.168.0.10";
    config.KeepAliveInterval = TimeSpan.FromSeconds(30);
});
```

This registers `IObdTransport`, `IObdConnection`, `IObdDeviceScanner` and `WifiObdConfiguration` as
singletons, using `TryAdd`.

:::caution[Do not register two transports for a fallback chain]
`TryAdd` means the first registration wins and the rest are silently ignored. If you want to try WiFi
and fall back to BLE, construct the transports yourself and try them in order.
:::

## Direct construction

```csharp
var transport = new WifiObdTransport(new WifiObdConfiguration
{
    // Null discovers the adapter; a value here is simply tried first
    Host = null,
    Port = 35000,

    // Validates a candidate with ATI rather than trusting the TCP connect
    AutoDetectEndpoint = true,

    // Send a cheap ATI when idle this long, so the adapter doesn't drop the socket
    KeepAliveInterval = TimeSpan.FromSeconds(20),

    CommandTimeout = TimeSpan.FromSeconds(10)
});

var connection = new ObdConnection(transport);
await connection.Connect();

var speed = await connection.Execute(StandardCommands.VehicleSpeed);
```

`ConnectedEndpoint` and `DetectedIdentifier` report what was actually reached, which is worth logging
when detection is in play.

## Configuration

| Property | Default | Purpose |
|----------|---------|---------|
| `Host` | `null` | Adapter address. Null discovers one |
| `Port` | `35000` | What nearly every ELM327 WiFi adapter listens on |
| `EndpointCandidates` | see below | Addresses to try when detecting |
| `AutoDetectEndpoint` | `true` | Validate candidates with ATI rather than trusting the connect |
| `IncludeGatewayCandidates` | `true` | Also try each interface's default gateway |
| `ConnectTimeout` | 5s | Per-candidate TCP connect deadline |
| `ProbeTimeout` | 2s | How long a candidate gets to answer ATI |
| `CommandTimeout` | 10s | Deadline for a single OBD command |
| `KeepAliveInterval` | 20s | Idle poll to stop the adapter hanging up. `Zero` disables |
| `NoDelay` | `true` | Disable Nagle's algorithm |
| `ConfigureSocket` | `null` | Hook into the raw socket before it connects |

## Endpoint detection

**A TCP connect proves nothing.** Anything listening on the address accepts — your router on
`192.168.0.1` will happily complete the handshake and then never say a word. So detection validates
each candidate with an `ATI` and only accepts a reply terminated by the `>` prompt, which nothing else
on a home network produces.

Candidates are tried in this order:

| Order | Source | Why |
|-------|--------|-----|
| 1 | `Host`, when set | Costs nothing when it is right — the rest are never tried |
| 2 | Default gateway of each up, non-loopback interface | These adapters run the AP you joined, so they **are** the gateway |
| 3 | `EndpointCandidates` | The well-known addresses |

The built-in candidate list:

| Endpoint | Adapter |
|----------|---------|
| `192.168.0.10:35000` | OBDLink / ScanTool, and most clones that copied them |
| `192.168.4.1:35000` | Stock ESP8266 / ESP32 SoftAP address |
| `192.168.1.5:35000` | Some Vgate / Konnwei units |
| `10.0.0.10:35000` | Less common, still seen |
| `192.168.0.10:23`, `192.168.4.1:23` | Clones that reused a telnet bridge firmware |

Add your own rather than replacing the list if you have an unusual adapter:

```csharp
services.AddShinyObdWifi(config => config.EndpointCandidates =
[
    new WifiObdEndpoint("172.16.0.1", 35000),
    .. config.EndpointCandidates
]);
```

If nothing answers, the exception names every endpoint that was tried — "connect failed" is not
actionable in a car park; a list of what was attempted is.

## Discovery

`WifiObdDeviceScanner` implements `IObdDeviceScanner`, so a "pick your adapter" UI works over WiFi,
serial and BLE without caring which is which.

```csharp
var scanner = new WifiObdDeviceScanner();
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));

await scanner.Scan(device =>
{
    Console.WriteLine($"{device.Name} at {device.Id}");   // "ELM327 v1.5 at 192.168.0.10:35000"
}, cts.Token);
```

`ObdDiscoveredDevice.Name` is the adapter's ATI identity, `Id` is `host:port`, and `NativeDevice` is
the `WifiObdEndpoint`. Pass the device straight to the transport:

```csharp
var transport = new WifiObdTransport(device, new WifiObdConfiguration());
```

The scan re-probes every five seconds so a picker UI stays live, and reports each adapter once.

:::caution[One client per adapter]
Most WiFi adapters accept exactly **one** TCP connection at a time. Each probe therefore closes its
socket before moving on — otherwise the scanner would lock out the transport about to connect for
real. For the same reason, never point two transports at one adapter.
:::

There is deliberately **no subnet sweep**. Scanning a /24 means opening a couple of hundred sockets on
whatever network the user happens to be on, which is slow and rude, and buys nothing: these adapters
run their own access point on a short list of known addresses.

## Joining the adapter's network is your app's job

The transport connects a socket. It cannot join a WiFi network for you, and the OS will not
necessarily route through one that has no internet.

### Android

Android keeps the default route on cellular when the joined network has no internet, so the socket
connects to nothing at all and times out. Pin traffic to the adapter's network:

```csharp
// Process-wide, the simple option
var manager = (ConnectivityManager)context.GetSystemService(Context.ConnectivityService)!;
manager.BindProcessToNetwork(adapterNetwork);
```

Or bind only the OBD socket, via the `ConfigureSocket` hook:

```csharp
services.AddShinyObdWifi(config => config.ConfigureSocket = socket =>
{
    // Bind to a specific Android.Net.Network, set buffer sizes, enable TCP keep-alives…
    socket.ReceiveBufferSize = 8192;
});
```

### iOS

Add `NSLocalNetworkUsageDescription` to `Info.plist` and expect the local network consent prompt. A
denial is **silent** and looks exactly like a dead adapter.

```xml
<key>NSLocalNetworkUsageDescription</key>
<string>Connects to your OBD-II adapter over WiFi to read vehicle data.</string>
```

## Connection failures name the fix

Socket errors are translated rather than passed through, because the socket error code is rarely the
useful part:

| Condition | What you get |
|-----------|--------------|
| Connection refused | "Nothing is listening… this is the wrong port — ELM327 WiFi adapters use 35000, a few clones use 23" |
| Host/network unreachable | "Join the adapter's WiFi network first; on Android also bind to that network…" |
| Access denied | "On iOS this is the local network permission — add `NSLocalNetworkUsageDescription`…" |
| Connect timeout | "Nothing answered… this device is not joined to the adapter's WiFi network — or, on Android, traffic is still being routed to cellular" |

## Keep-alive

Clone firmware commonly closes a socket that has been idle for 30–60 seconds, often without a FIN, so
the first you hear of it is a command timing out. `KeepAliveInterval` sends an `ATI` when the link has
been quiet that long.

`ATI` is answered by the adapter itself and never reaches the vehicle bus, so it cannot disturb a
reading or wake an ECU. The keep-alive also skips itself whenever a real command is in flight — that
traffic *is* the keep-alive.

A tight polling loop never goes idle and never needs this. An app that connects and then waits for the
user does.

## There is no auto-reconnect, on purpose

A dropped socket loses the ELM327's session state — `ATE0`, `ATS1`, the negotiated protocol — because
that state lives in the adapter, not in the socket. Silently redialling would hand you a live
connection with echo back on, whose replies parse as garbage rather than failing outright, which is a
far worse failure than a clean one.

A lost link surfaces as `ObdException`. Recover by calling `ObdConnection.Connect()` again, which
re-runs the adapter profile:

```csharp
try
{
    reading = await connection.Execute(StandardCommands.VehicleSpeed, ct);
}
catch (ObdException) when (!connection.IsConnected)
{
    await connection.Connect(ct);   // re-initialises the adapter, not just the socket
}
```

`IsConnected` is tracked from the transport's read pump rather than read off the socket:
`Socket.Connected` reports the state as of the last I/O, so it still says `true` for a link the
adapter dropped while idle.

## Leave `NoDelay` on

An OBD exchange is a tiny write followed by a tiny reply — precisely the traffic Nagle's algorithm
delays, since it holds a small write back waiting for more data to coalesce with. With Nagle enabled
you pay tens of milliseconds on every single PID read, which is the difference between a usable
live-data gauge and a sluggish one.
