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
| `CommandedAirFuelRatio` | 01 | 44 | `double` | lambda |
| `CommandedEgr` | 01 | 2C | `double` | % |
| `EgrError` | 01 | 2D | `double` | % |
| `CommandedEvaporativePurge` | 01 | 2E | `double` | % |
| `EvapVaporPressure` | 01 | 32 | `double` | Pa (signed) |
| `AbsoluteEvapVaporPressure` | 01 | 53 | `double` | kPa |
| `EvapVaporPressureWideRange` | 01 | 54 | `double` | Pa (signed) |
| `DriverDemandTorque` | 01 | 61 | `int` | % |
| `ActualEngineTorque` | 01 | 62 | `int` | % |
| `ReferenceTorque` | 01 | 63 | `int` | N·m |
| `EnginePercentTorqueData` | 01 | 64 | `EnginePercentTorqueData` | % |
| `FuelPressure` | 01 | 0A | `int` | kPa |
| `FuelRailPressure` | 01 | 22 | `double` | kPa |
| `FuelRailGaugePressure` | 01 | 23 | `int` | kPa |
| `FuelRailAbsolutePressure` | 01 | 59 | `int` | kPa |
| `EthanolFuelPercent` | 01 | 52 | `double` | % |
| `AbsoluteLoadValue` | 01 | 43 | `double` | % |
| `WarmUpsSinceCodesCleared` | 01 | 30 | `int` | count |
| `RelativeThrottlePosition` | 01 | 45 | `double` | % |
| `FuelInjectionTiming` | 01 | 5D | `double` | ° |
| `EngineRunTime` | 01 | 7F | `EngineRunTime` | — |
| `ObdStandards` | 01 | 1C | `byte` | J1979 code |
| `CalibrationVerificationNumber` | 09 | 06 | `IReadOnlyList<string>` | hex |
| `EcuName` | 09 | 0A | `string` | — |

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

### Oxygen sensors

`OxygenSensorVoltageCommand.Sensor(1..8)` for narrowband, `OxygenSensorLambdaCommand.WithVoltage(1..8)`
or `.WithCurrent(1..8)` for wideband. **Read the layout first** — see
[Oxygen Sensors](#oxygen-sensors) below.

### Throttle sensors B and C

`AbsoluteThrottlePositionCommand.B()` (PID 0x47) and `.C()` (0x48) are the redundant drive-by-wire
position sensors. A disagreement between them is what sets the throttle-correlation codes and puts a
car into limp mode.

### Mode 06 monitors

`new OnBoardTestCommand(mid)` and `new OnBoardTestSupportedMidsCommand(block)` — see
[Mode 06](/client/obd/mode06).

### In-use performance tracking

`InUsePerformanceTrackingCommand.Spark()` (mode 09 PID 0x08) or `.Compression()` (0x0B), chosen by
engine type. The wrong one returns NO DATA rather than mislabelled figures.

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

## Oxygen Sensors

Fuel trim reports the ECU's correction; the oxygen sensor reports the measurement causing it. The pair
is what separates a real mixture problem from a failing sensor.

:::danger[Read the layout before any sensor PID]
A vehicle answers **either** PID `0x13` (two banks of four sensors) **or** PID `0x1D` (four banks of
two), never both — and which one it answers changes what every sensor PID means.

| PID `0x16` under… | is |
|---|---|
| `0x13` (two banks of four) | bank 1, sensor 3 |
| `0x1D` (four banks of two) | bank 2, sensor 1 |

Label a reading from the wrong layout and you send someone to replace the downstream sensor on the
wrong bank. `layout.Position(index)` does the mapping so calling code never has to.
:::

```csharp
var layout = await connection.Execute(OxygenSensorsPresentCommand.TwoBanks());   // or .FourBanks()

foreach (var sensor in layout.Sensors)
{
    var reading = await connection.Execute(OxygenSensorVoltageCommand.Sensor(sensor.SensorIndex));
    Console.WriteLine($"{sensor} — {reading.Volts:F3} V, trim {reading.ShortTermFuelTrim:F1}%");
}
```

`OxygenSensorPosition.ToString()` renders the conventional `B1S2` shorthand a repair manual uses.

### Narrowband and wideband are different measurements

| Sensor | Command | PIDs | Reports |
|--------|---------|------|---------|
| Narrowband | `OxygenSensorVoltageCommand` | 0x14–0x1B | voltage + that sensor's short-term trim |
| Wideband | `OxygenSensorLambdaCommand.WithVoltage` | 0x24–0x2B | lambda + voltage |
| Wideband | `OxygenSensorLambdaCommand.WithCurrent` | 0x34–0x3B | lambda + pump current |

Probe with `SupportedPidsCommand` — a vehicle answers one family, and **the voltages are not
comparable between them**.

```csharp
var wide = await connection.Execute(OxygenSensorLambdaCommand.WithCurrent(1));
Console.WriteLine($"Lambda {wide.Lambda:F3} ({wide.PetrolAirFuelRatio:F1}:1), {wide.Milliamps:F1} mA");

var commanded = await connection.Execute(StandardCommands.CommandedAirFuelRatio);  // the target
```

Lambda is the reading that matters: 1.0 is stoichiometric, below is rich, above is lean, and unlike a
narrowband voltage it stays meaningful across the whole range. `PetrolAirFuelRatio` multiplies by 14.7
— correct for petrol only, so check `EthanolFuelPercent` on a flex-fuel vehicle, where E85 is
stoichiometric near 9.8:1.

### Interpreting a narrowband reading

A healthy **upstream** sensor oscillates roughly 0.1–0.9 V several times a second once hot. A reading
parked mid-range is the signature of a lazy or cold sensor, **not** a perfect mixture. A **downstream**
sensor should sit fairly steady around 0.6–0.7 V; when it starts mirroring the upstream swing, the
catalyst has stopped storing oxygen.

One sample is worth very little. Read the shape over several seconds.

`ShortTermFuelTrim` is **null** when the vehicle marks the sensor as not used in the trim calculation.
That marker (`0xFF`) scales to +99.2%, which would otherwise land on a graph looking like a wildly
rich correction.

## EGR and EVAP

The two most common causes of a check engine light.

```csharp
var commanded = await connection.Execute(StandardCommands.CommandedEgr);
var error = await connection.Execute(StandardCommands.EgrError);
```

Read them together. Commanded alone says only what was asked for; the error says whether it happened.
A P0401 with 0% commanded is a different fault from the same code with 40% commanded and a large
negative error — the latter is the classic carbon-clogged passage, visible here long before the code
sets.

:::caution[Three PIDs share the name "evap system vapour pressure"]
They are not interchangeable and must never be converted between.

| PID | Command | Unit | Measured against |
|-----|---------|------|------------------|
| 0x32 | `EvapVaporPressure` | signed Pa, ±8 kPa, fine | atmosphere |
| 0x54 | `EvapVaporPressureWideRange` | signed Pa, ±32 kPa, coarse | atmosphere |
| 0x53 | `AbsoluteEvapVaporPressure` | unsigned kPa | vacuum — ~101 kPa is atmospheric |

Probe with `SupportedPidsCommand` and use whichever the vehicle answers.
:::

Purge command plus tank pressure is what distinguishes a real leak from a valve that will not seal.
P0455 and P0442 ("large" and "small" leak detected) are usually a loose or perished filler cap.

## Torque and Power

Mode 01 reports torque as a **percentage of a reference figure**, so neither PID means anything alone.
`ReferenceTorque` is a constant for the engine — read it once and reuse it rather than paying for it
on every sample of a live gauge.

```csharp
var reference = await connection.Execute(StandardCommands.ReferenceTorque);     // N·m, read once

// then per sample
var percent = await connection.Execute(StandardCommands.ActualEngineTorque);
var rpm = await connection.Execute(StandardCommands.EngineRpm);

var nm = EnginePower.TorqueNm(percent, reference);
var kw = EnginePower.Kilowatts(percent, reference, rpm);
var ps = EnginePower.MetricHorsepower(percent, reference, rpm);
var hp = EnginePower.MechanicalHorsepower(percent, reference, rpm);
```

`MetricHorsepower` (PS, 735.5 W) and `MechanicalHorsepower` (hp, 745.7 W) are both offered rather than
one being called "horsepower". They differ by about 1.4% — small enough to look like measurement
noise, large enough to make two apps disagree about the same car.

Negative torque is normal and means the engine is being driven rather than driving (overrun, engine
braking). `DriverDemandTorque` against `ActualEngineTorque` is the gap between what the pedal asked for
and what the engine delivered — a limp-mode or boost-leak signature no single reading shows.

:::note
This is the **engine's** output, at the flywheel and before the drivetrain. It is not a substitute for
a chassis dyno and will read higher than one.
:::

`EnginePercentTorqueData` (PID 0x64) returns the engine's torque map at idle and four calibration
points. Its chief use is as a fingerprint: the points are fixed by the calibration, so a set that
differs from what the same vehicle reported before means the ECU has been reflashed.

## ECU Identity

`CalibrationId` (mode 09 PID 0x04) and `CalibrationVerificationNumber` (0x06) are a **pair**. The CVN
is a checksum computed over the calibration itself, so a reflash that keeps the same calibration ID
still changes it — together they are how an inspection determines whether a vehicle is running the
software it should be.

```csharp
var ids = await connection.Execute(StandardCommands.CalibrationId);
var cvns = await connection.Execute(StandardCommands.CalibrationVerificationNumber);
var ecu = await connection.Execute(StandardCommands.EcuName);
```

CVNs are returned as uppercase hex strings, not numbers. They have no arithmetic meaning and leading
zeroes are significant, so rendering one as an integer would both lose data and invite someone to sort
or subtract it.

## In-Use Performance Tracking

Not whether a monitor passed, but whether it ever gets the chance to run — the question an in-use
compliance programme audits.

```csharp
var ipt = await connection.Execute(InUsePerformanceTrackingCommand.Spark());   // or .Compression()

Console.WriteLine($"{ipt.IgnitionCycles} ignition cycles");
foreach (var monitor in ipt.Monitors)
    Console.WriteLine($"{monitor.Monitor}: {monitor.Completions}/{monitor.Conditions} = {monitor.Ratio:P1}");
```

Pick by engine type — `MonitorStatus.Ignition` or `ObdStandards.IsHeavyDuty` tells you which. The wrong
one returns NO DATA rather than mislabelled figures.

A ratio persistently near zero on a car with no fault means the monitor's enabling conditions are never
met by how that vehicle is driven, usually short trips. That is the real explanation behind a car that
will not reach emissions readiness no matter how long it is driven, which `MonitorStatus` can only
report as "still incomplete".

`Ratio` is **null** when the denominator is zero. "Never had the opportunity" and "had the opportunity
and never ran" are different findings, and only the second is a problem with the vehicle.

## OBD Standards

`ObdStandards` (PID 0x1C) returns a raw code; `ObdStandards.Describe` names it and answers `null` for
reserved or unassigned values rather than "Unknown".

```csharp
var code = await connection.Execute(StandardCommands.ObdStandards);
Console.WriteLine(ObdStandards.Describe(code));       // "EOBD (Europe)"

if (ObdStandards.IsHeavyDuty(code))
    // expect the compression-ignition monitor layout
```

Read once per vehicle. It tells you which regulatory world a car is from, and that changes what the
rest of the data means — a EOBD vehicle answers a different PID set from a CARB OBD-II one, and a
"not OBD compliant" answer explains a vehicle that connects but reports almost nothing.

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
