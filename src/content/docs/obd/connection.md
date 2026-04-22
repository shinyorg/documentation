---
title: Connection & Adapters
---

The `ObdConnection` class is the main entry point for communicating with a vehicle. It handles adapter detection, initialization, command execution, and ELM327 response parsing.

## Creating a Connection

### Auto-Detection (recommended)

When no adapter profile is specified, `Connect` sends an ATI command to identify the adapter and selects the appropriate initialization profile.

```csharp
var connection = new ObdConnection(transport);
await connection.Connect();

// Check what was detected
Console.WriteLine(connection.DetectedAdapter?.RawIdentifier); // "ELM327 v1.5"
Console.WriteLine(connection.DetectedAdapter?.Type);          // Elm327
```

| ATI Response Contains | Detected As | Profile Used |
|----------------------|-------------|--------------|
| `"ELM327"` | `ObdAdapterType.Elm327` | `Elm327AdapterProfile` |
| `"STN"` | `ObdAdapterType.ObdLink` | `ObdLinkAdapterProfile` |
| Anything else | `ObdAdapterType.Unknown` | `Elm327AdapterProfile` |

### Explicit Profile

Skip detection by providing a profile to the constructor:

```csharp
var connection = new ObdConnection(transport, new ObdLinkAdapterProfile());
await connection.Connect(); // uses OBDLink init sequence, no ATI probe
```

## Executing Commands

```csharp
// Typed command execution
var speed = await connection.Execute(StandardCommands.VehicleSpeed);

// Raw AT/OBD commands
var version = await connection.SendRaw("ATI");      // "ELM327 v1.5"
var protocol = await connection.SendRaw("ATDPN");   // current protocol number
var voltage = await connection.SendRaw("ATRV");     // battery voltage
var pids = await connection.SendRaw("0100");         // supported PIDs [01-20]
```

## Adapter Profiles

### Built-in Profiles

**Elm327AdapterProfile** — Standard ELM327 initialization:

| Command | Description |
|---------|-------------|
| `ATZ` | Reset adapter |
| `ATE0` | Echo off |
| `ATL0` | Linefeed off |
| `ATS1` | Spaces on |
| `ATH0` | Headers off |
| `ATSP0` | Auto protocol selection |

**ObdLinkAdapterProfile** — Extends ELM327 with STN optimizations:

| Command | Description |
|---------|-------------|
| *(all ELM327 commands)* | Standard initialization |
| `STFAC` | Reset to STN factory defaults |
| `ATCAF1` | CAN auto formatting on |

### Custom Profiles

Implement `IObdAdapterProfile` for adapters with special initialization needs:

```csharp
public class MyAdapterProfile : IObdAdapterProfile
{
    public string Name => "MyAdapter";

    public async Task Initialize(IObdConnection connection, CancellationToken ct = default)
    {
        await connection.SendRaw("ATZ", ct);
        await Task.Delay(500, ct);
        await connection.SendRaw("ATE0", ct);
        await connection.SendRaw("ATSP6", ct);  // force CAN 11-bit 500kbaud
    }
}

var connection = new ObdConnection(transport, new MyAdapterProfile());
```

## Error Handling

`ObdException` is thrown for adapter-level and protocol errors:

```csharp
try
{
    var speed = await connection.Execute(StandardCommands.VehicleSpeed);
}
catch (ObdException ex) when (ex.Message.Contains("No data"))
{
    // Vehicle not responding (engine off, unsupported PID, etc.)
}
catch (ObdException ex) when (ex.Message.Contains("Unable to connect"))
{
    // Adapter can't reach the vehicle ECU
}
```

The connection automatically handles these ELM327 error responses:

| Response | Exception Message |
|----------|-------------------|
| `NO DATA` | No data received from vehicle |
| `UNABLE TO CONNECT` | Unable to connect to vehicle |
| `BUS INIT: ...ERROR` | Bus initialization error |
| `?` | Unknown command |
| *(empty)* | Empty response received |

Informational prefixes like `SEARCHING...` and `BUS INIT: ...OK` are stripped automatically before parsing.

## IObdConnection Interface

```csharp
public interface IObdConnection : IAsyncDisposable
{
    bool IsConnected { get; }
    Task Connect(CancellationToken ct = default);
    Task Disconnect();
    Task<T> Execute<T>(IObdCommand<T> command, CancellationToken ct = default);
    Task<string> SendRaw(string command, CancellationToken ct = default);
}
```

:::note
`SendRaw` automatically appends a carriage return (`\r`) to the command before sending it to the transport.
:::
