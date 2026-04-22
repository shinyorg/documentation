---
title: Commands
---

OBD commands are objects that know how to send a request and parse the response into a typed result. This design makes it easy to use built-in commands or create your own for custom PIDs.

## Standard Commands

All standard commands are available as singletons via `StandardCommands`:

| Property | Mode | PID | Return Type | Unit |
|----------|------|-----|-------------|------|
| `VehicleSpeed` | 01 | 0D | `int` | km/h |
| `EngineRpm` | 01 | 0C | `int` | RPM |
| `CoolantTemperature` | 01 | 05 | `int` | °C |
| `ThrottlePosition` | 01 | 11 | `double` | % |
| `FuelLevel` | 01 | 2F | `double` | % |
| `CalculatedEngineLoad` | 01 | 04 | `double` | % |
| `IntakeAirTemperature` | 01 | 0F | `int` | °C |
| `RuntimeSinceStart` | 01 | 1F | `TimeSpan` | — |
| `Vin` | 09 | 02 | `string` | — |

```csharp
using Shiny.Obd.Commands;

var speed = await connection.Execute(StandardCommands.VehicleSpeed);
var rpm = await connection.Execute(StandardCommands.EngineRpm);
var coolant = await connection.Execute(StandardCommands.CoolantTemperature);
var throttle = await connection.Execute(StandardCommands.ThrottlePosition);
var fuel = await connection.Execute(StandardCommands.FuelLevel);
var load = await connection.Execute(StandardCommands.CalculatedEngineLoad);
var intakeTemp = await connection.Execute(StandardCommands.IntakeAirTemperature);
var runtime = await connection.Execute(StandardCommands.RuntimeSinceStart);
var vin = await connection.Execute(StandardCommands.Vin);
```

## Creating Custom Commands

There are two approaches depending on whether your command follows the standard OBD-II Mode/PID pattern.

### Extending ObdCommand\<T\> (standard Mode/PID)

Use this for any standard OBD-II PID. The base class automatically generates the command string from Mode + PID, validates the response header, and strips it before calling your `ParseData` method.

```csharp
// Barometric pressure (Mode 01, PID 0x33) — value in kPa
public class BarometricPressureCommand : ObdCommand<int>
{
    public BarometricPressureCommand() : base(0x01, 0x33) { }
    protected override int ParseData(byte[] data) => data[0];
}

// MAF air flow rate (Mode 01, PID 0x10) — value in g/s
public class MafAirFlowCommand : ObdCommand<double>
{
    public MafAirFlowCommand() : base(0x01, 0x10) { }
    protected override double ParseData(byte[] data) => ((data[0] * 256) + data[1]) / 100.0;
}

// Usage
var pressure = await connection.Execute(new BarometricPressureCommand());
var maf = await connection.Execute(new MafAirFlowCommand());
```

**What `ObdCommand<T>` does for you:**
- `RawCommand` is generated as `"{Mode:X2}{Pid:X2}"` (e.g. `"0133"`)
- `Parse` validates `response[0] == Mode + 0x40` and `response[1] == Pid`
- `Parse` strips the 2-byte header, then calls your `ParseData` with just the data bytes
- Throws `ObdException` on mode/PID mismatch

### Implementing IObdCommand\<T\> (full control)

Use this for manufacturer-specific commands, non-standard response formats, or anything that doesn't follow the Mode/PID pattern.

```csharp
// Manufacturer-specific diagnostic command
public class CustomDiagnosticCommand : IObdCommand<string>
{
    public string RawCommand => "2101";

    public string Parse(byte[] data)
    {
        // You receive ALL response bytes — parse however you need
        return BitConverter.ToString(data);
    }
}

// Usage
var result = await connection.Execute(new CustomDiagnosticCommand());
```

## Interfaces

### IObdCommand\<T\>

The core command interface. All commands implement this.

```csharp
public interface IObdCommand<T>
{
    /// <summary>
    /// The raw command string to send (e.g. "010D")
    /// </summary>
    string RawCommand { get; }

    /// <summary>
    /// Parse the response bytes into the result type.
    /// Receives all response bytes including mode+PID header.
    /// </summary>
    T Parse(byte[] data);
}
```

### ObdCommand\<T\>

Abstract base for standard OBD-II Mode/PID commands.

```csharp
public abstract class ObdCommand<T> : IObdCommand<T>
{
    protected ObdCommand(byte mode, byte pid);
    
    public byte Mode { get; }
    public byte Pid { get; }
    public virtual string RawCommand { get; } // auto-generated

    /// <summary>
    /// Parse data bytes AFTER mode+PID header has been stripped
    /// </summary>
    protected abstract T ParseData(byte[] data);
}
```
