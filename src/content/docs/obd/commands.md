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
| `Odometer` | 01 | A6 | `double` | km |
| `DistanceSinceCodesCleared` | 01 | 31 | `int` | km |
| `ControlModuleVoltage` | 01 | 42 | `double` | V |
| `MassAirFlow` | 01 | 10 | `double` | g/s |
| `EngineFuelRate` | 01 | 5E | `double` | L/h |
| `EngineOilTemperature` | 01 | 5C | `int` | °C |
| `FuelType` | 01 | 51 | `byte` | J1979 code |
| `HybridBatteryLife` | 01 | 5B | `double` | % |
| `MonitorStatus` | 01 | 01 | `MonitorStatus` | MIL, code count, readiness |
| `MonitorStatusThisDriveCycle` | 01 | 41 | `MonitorStatus` | readiness, this cycle |
| `FuelSystemStatus` | 01 | 03 | `FuelSystemStatus` | loop state |
| `IntakeManifoldPressure` | 01 | 0B | `int` | kPa |
| `BarometricPressure` | 01 | 33 | `int` | kPa |
| `TimingAdvance` | 01 | 0E | `double` | ° BTDC |
| `AmbientAirTemperature` | 01 | 46 | `int` | °C |
| `RelativeAcceleratorPedalPosition` | 01 | 5A | `double` | % |
| `CommandedThrottleActuator` | 01 | 4C | `double` | % |
| `DistanceWithMilOn` | 01 | 21 | `int` | km |
| `TimeRunWithMilOn` | 01 | 4D | `TimeSpan` | minutes |
| `TimeSinceCodesCleared` | 01 | 4E | `TimeSpan` | minutes |
| `CalibrationId` | 09 | 04 | `IReadOnlyList<string>` | — |

:::caution[Two pairs that are easy to mix up]
PIDs `4D` and `4E` are **minutes**; `RuntimeSinceStart` (`1F`) is **seconds**.

`AmbientAirTemperature` (`46`) is the air outside the vehicle; `IntakeAirTemperature` (`0F`) is what
the engine is breathing, measured after the engine bay has warmed it and a turbo has compressed it.
It reads well above ambient at a standstill and swings with load.
:::

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

// The check-engine light and how many confirmed codes are behind it
var status = await connection.Execute(StandardCommands.MonitorStatus);
Console.WriteLine($"MIL: {status.MilOn}, {status.DtcCount} stored code(s)");
```

`FuelType` (PID 0x51) returns a raw SAE J1979 code; `FuelTypes.Describe` names it. It answers
`null` for `0x00` ("not available") and for anything outside the table rather than the string
"Unknown", so a caller can tell an absent answer from a claim about the vehicle. Read it once per
connection — a vehicle does not change what it burns between polls.

```csharp
var fuelType = FuelTypes.Describe(await connection.Execute(StandardCommands.FuelType));
```

## Commands That Take Construction Data

These are not on `StandardCommands` because they need a bank or a block, or they carry their own
shared instances.

### Fuel trim

128 is zero correction. Positive means the ECU is adding fuel (it reads the mixture as lean),
negative means it is pulling fuel out — sustained drift either way is an early signal of a vacuum
leak, a lazy oxygen sensor or a fuel delivery problem, often long before a code is set.

```csharp
var shortTerm = await connection.Execute(FuelTrimCommand.ShortTermBank1());   // 0106
var longTerm = await connection.Execute(FuelTrimCommand.LongTermBank1());     // 0107
// ShortTermBank2() / LongTermBank2() cover PIDs 0108 / 0109
```

Read `FuelSystemStatus` (PID 0x03) alongside it. Trims are only meaningful in closed loop — in open
loop the ECU is running a fixed map with no oxygen sensor feedback, so a trim figure there says
nothing about a leak or a lazy sensor and must not be trended as though it did.

```csharp
var fuelSystem = await connection.Execute(StandardCommands.FuelSystemStatus);
if (fuelSystem.IsClosedLoop)
    RecordTrim(await connection.Execute(FuelTrimCommand.ShortTermBank1()));
```

### Accelerator pedal position

```csharp
var pedal = await connection.Execute(AcceleratorPedalPositionCommand.D());   // 0149, or .E() / .F()
```

D, E and F are redundant sensors on the same pedal; most vehicles report D and E. This is the
driver's **input**, which is what makes it worth reading separately from `ThrottlePosition` (PID
0x11) — that one is absolute throttle plate position, the drive-by-wire system's *output*, and it
carries a closed-pedal floor of 12–18% that varies by vehicle. Anything measuring how hard a car is
being driven from PID 0x11 has to discover that floor for itself first.

`RelativeAcceleratorPedalPosition` (PID 0x5A) is the same signal with the ECU's learned rest
position already subtracted, so a released pedal reads 0. Prefer it where it is supported.

### Supported PIDs

Querying an unsupported PID just returns NO DATA, so read the mode 01 bitmask blocks once per
connection and only poll what the vehicle answers. Each block reports the 32 PIDs that follow it.

```csharp
var supported = new HashSet<byte>();
foreach (var block in SupportedPidsCommand.BlockPids)   // 00, 20, 40, 60, 80, A0, C0
{
    foreach (var pid in await connection.Execute(new SupportedPidsCommand(block)))
        supported.Add(pid);
}

if (supported.Contains(0xA6))
    odometerKm = await connection.Execute(StandardCommands.Odometer);
```

Surface an unsupported reading to your users as **missing, not zero**. The odometer PID is absent on
most vehicles and `HybridBatteryLife` on every vehicle without a pack, and a zero there is
indistinguishable from a dead battery.

## Diagnostic Trouble Codes

`DtcReadCommand` returns SAE J2012 code strings such as `"P0301"`. Modes 03/07/0A/04 carry no PID,
so these implement `IObdCommand<T>` directly rather than extending `ObdCommand<T>`.

```csharp
var stored = await connection.Execute(DtcReadCommand.Stored);        // mode 03 — these turn the MIL on
var pending = await connection.Execute(DtcReadCommand.Pending);      // mode 07 — current/last drive cycle
var permanent = await connection.Execute(DtcReadCommand.Permanent);  // mode 0A — only the ECU clears these
```

`DtcDecoder` is the public parser behind them, and is usable on its own. It strips the mode echo,
then uses payload **parity** to tell a CAN reply (`43 <count> <pairs>`) from a pre-CAN one
(`43 <pairs>`) rather than assuming a transport, and drops the `0x0000` padding that fills out a
fixed-size frame.

```csharp
var codes = DtcDecoder.Decode([0x43, 0x02, 0x03, 0x01, 0x04, 0x20], 0x43);   // ["P0301", "P0420"]
```

Mode 04 clears stored codes and freeze-frame data:

```csharp
var cleared = await connection.Execute(ClearDtcCommand.Instance);
```

:::caution
Clearing codes also resets the emissions readiness monitors, which then take several drive cycles to
re-run and will fail an emissions test in the meantime. Only ever issue mode 04 from an explicitly
confirmed user action that says so — never as part of a connect or refresh routine.
:::

## Emissions Monitor Readiness

`MonitorStatusCommand` (PID 0x01) decodes all four bytes of the reply, not just the lamp. Beyond the
check-engine light and the stored code count, it reports every emissions monitor the vehicle
supports and whether each has finished running — which is the question an emissions inspection
actually asks.

```csharp
var status = await connection.Execute(StandardCommands.MonitorStatus);

Console.WriteLine($"MIL: {status.MilOn}, {status.DtcCount} stored code(s)");
Console.WriteLine($"Ignition: {status.Ignition}");   // Spark or Compression

if (status.IsReadyForInspection == false)
    Console.WriteLine($"Still running: {String.Join(", ", status.Incomplete.Select(x => x.Monitor))}");
```

Three things about the shape of this data are worth knowing:

- **`Monitors` lists only what the vehicle supports.** A monitor that does not exist on a car has no
  readiness state, so it is left out rather than reported as incomplete — otherwise
  `IsReadyForInspection` could never come true.
- **Which monitors bytes C and D describe depends on the ignition type**, taken from bit 3 of byte
  B. The same bit is the oxygen sensor heater on a petrol car and the particulate filter on a
  diesel. `MonitorStatusDecoder` handles the selection; it is public and testable without a
  transport, the same way `DtcDecoder` is.
- **The raw completion bits are inverted** — a set bit means the test is still running.
  `MonitorReadiness.Complete` has already flipped it.

:::note
A vehicle whose codes were recently cleared reads not-ready for several drive cycles with nothing
wrong with it. `StandardCommands.TimeSinceCodesCleared` (PID 0x4E) is what tells you which case you
are looking at before you report a problem to anyone.
:::

`MonitorStatusThisDriveCycle` (PID 0x41) reports the same monitors for the current drive cycle only,
which is how you watch one complete while driving. Its byte A is reserved, so its `MilOn` and
`DtcCount` are always false and zero.

## Freeze Frames (Mode 02)

A freeze frame is the snapshot of conditions the ECU stored at the instant a trouble code was set.
Mode 02 accepts the same PIDs as mode 01 and scales them identically, so there is no separate
command per reading — call `AsFreezeFrame()` on the mode 01 command you already have.

```csharp
var causal = await connection.Execute(FreezeFrameCommands.CausalDtc());
if (causal != null)
{
    Console.WriteLine($"{causal} was set under these conditions:");
    Console.WriteLine(await connection.Execute(StandardCommands.EngineRpm.AsFreezeFrame()));
    Console.WriteLine(await connection.Execute(StandardCommands.CalculatedEngineLoad.AsFreezeFrame()));
    Console.WriteLine(await connection.Execute(StandardCommands.CoolantTemperature.AsFreezeFrame()));
}
```

:::danger[Check CausalDtc first]
When `CausalDtc` answers null there is no stored snapshot, and every other mode 02 reading is
meaningless rather than merely absent — the frame is zero-filled, so an engine load of 0% and a
coolant temperature of -40 °C come back looking like measurements.
:::

The request carries a frame number and the response echoes it, which makes the mode 02 header three
bytes rather than two. Vehicles almost always store only frame 0. `AsFreezeFrame` throws
`ObdException` on a command that is not a mode 01 PID — a mode 09 identifier is not sampled at a
moment, so it has no frame.

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

// Fuel rail gauge pressure (Mode 01, PID 0x23) — 10 kPa per bit
public class FuelRailPressureCommand : ObdCommand<int>
{
    public FuelRailPressureCommand() : base(0x01, 0x23) { }
    protected override int ParseData(byte[] data) => ((data[0] * 256) + data[1]) * 10;
}

// Usage
var pressure = await connection.Execute(new BarometricPressureCommand());
var railPressure = await connection.Execute(new FuelRailPressureCommand());
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
