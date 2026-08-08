---
title: Mode 06 — On-Board Test Results
---

Mode 06 is the deepest data OBD-II exposes, and the only mode that answers **"how close is this to
failing"**.

Everything else reports a state: a code is set or it is not, a monitor is complete or it is not. Mode
06 reports the measurement the monitor actually took and the limits it was judged against. A catalyst
sitting at 92% of its failure threshold looks perfectly healthy to
[`MonitorStatus`](/client/obd/commands#emissions-monitor-readiness) and is visibly on its way out here.

## Discovery first

There are 224 monitor IDs and an unsupported one returns NO DATA, so read the supported-MID bitmask
blocks rather than walking the range.

```csharp
var supported = new List<byte>();
foreach (var block in MonitorIds.BlockMids)          // 00, 20, 40, 60, 80, A0
{
    foreach (var mid in await connection.Execute(new OnBoardTestSupportedMidsCommand(block)))
        supported.Add(mid);
}
```

The layout is the same MSB-first bitmask as
[`SupportedPidsCommand`](/client/obd/commands#supported-pids): each block reports the 32 MIDs that
follow it.

## Reading results

```csharp
foreach (var mid in supported)
{
    foreach (var test in await connection.Execute(new OnBoardTestCommand(mid)))
    {
        Console.WriteLine(
            $"{test.Monitor ?? $"MID {test.Mid:X2}"} test {test.TestId:X2}: " +
            $"{test.Value:F2} {test.Unit} " +
            $"(limits {test.Minimum:F2}–{test.Maximum:F2}) " +
            $"{(test.Passed == true ? "PASS" : "FAIL")} — {test.BandPosition:P0} of band"
        );
    }
}
```

A single MID commonly answers with **several records** — one per test the monitor runs — which is why
the result is a list rather than a single reading.

## `BandPosition` is the point

```csharp
var atRisk = results
    .Where(x => x.Passed == true && x.BandPosition > 0.85)
    .ToList();
```

0 sits at the lower limit, 1 at the upper. A result that passes tells you nothing about trend; a result
sitting at 95% of its band, compared against the same reading six months ago, is a component you can
**schedule** rather than wait to fail. This is the number the whole mode exists for, and building a
bare pass/fail UI on top of mode 06 throws away most of its value.

## Unit and scaling

Mode 06 does not fix a unit per test. Every value carries a one-byte **unit and scaling identifier**
(UASID) saying how to scale it and what it then means — the same 16-bit number is 0.25 rpm per bit
under one identifier and 0.122 millivolts under another.

`OnBoardTestResult.Value`, `.Minimum` and `.Maximum` apply it for you. `UnitAndScaling.Lookup` exposes
the table directly if you need it.

:::danger[Identifiers at 0x80 and above are signed]
This is the distinction that matters most. A small negative test value read as unsigned becomes a
number near 65,535 — turning a comfortably passing test into a spectacular failure.

```csharp
UnitAndScaling.Lookup(0x0C)!.Value.Apply(0xFFFF);   // 655.35 V   (unsigned)
UnitAndScaling.Lookup(0x8C)!.Value.Apply(0xFFFF);   //  -0.01 V   (signed)
```
:::

### When the identifier is unknown

`Value`, `Unit`, `Passed` and `BandPosition` are all **null**, while `RawValue`, `RawMinimum` and
`RawMaximum` remain.

`Passed` is deliberately null rather than falling back to a raw comparison: without the scaling there
is no way to know whether the value is signed, and comparing a two's complement negative as unsigned
inverts the answer. The raw comparison is still yours to make — the library just will not guess at
signedness on your behalf.

## Monitor names

`MonitorIds.Describe` names the standardised MIDs:

| Range | Monitor |
|-------|---------|
| 0x01–0x10 | Oxygen sensor, B1S1 through B4S4 |
| 0x21–0x24 | Catalyst, banks 1–4 |
| 0x31–0x34 | EGR, banks 1–4 |
| 0x35–0x38 | VVT, banks 1–4 |
| 0x39–0x3C | EVAP leak tests — 0.150" (cap off), 0.090", 0.040", 0.020" |
| 0x3D | Purge flow |
| 0x41–0x50 | Oxygen sensor heater, B1S1 through B4S4 |
| 0x61–0x64 | Heated catalyst, banks 1–4 |
| 0x71–0x74 | Secondary air, 1–4 |
| 0x81–0x84 | Fuel system, banks 1–4 |
| 0x85–0x86 | Boost pressure, banks 1–2 |
| 0x90–0x91 | NOx adsorber, banks 1–2 |
| 0x98–0x99 | NOx catalyst, banks 1–2 |
| 0xA1 | Misfire (general) |
| 0xA2–0xAD | Misfire, cylinders 1–12 |
| 0xB0–0xB1 | PM filter, banks 1–2 |

The four EVAP MIDs are the leak sizes the monitor tests for, in inches of orifice diameter — 0.020" is
the small-leak test that catches a loose filler cap.

MIDs above 0xDF are manufacturer-defined, so `Describe` answers `null` rather than inventing a name.
Manufacturers also publish their own definitions for the standardised ranges (GM's are the best known),
which is worth knowing when a result carries a name from here but a value that only makes sense
against their documentation.

## CAN only

Mode 06 as decoded here is the CAN (ISO 15765-4) format: a 9-byte record per test, made of MID, test
ID, unit/scaling ID, and three 16-bit values.

Pre-CAN protocols used a different and largely manufacturer-specific format. On such a vehicle the
response will not divide into whole records, and `OnBoardTestCommand` throws an `ObdException` naming
that as the likely cause — rather than decoding into confident nonsense.

## Worked example

Finding the emissions components most at risk on a vehicle that currently passes everything:

```csharp
var results = new List<OnBoardTestResult>();

foreach (var block in MonitorIds.BlockMids)
{
    foreach (var mid in await connection.Execute(new OnBoardTestSupportedMidsCommand(block)))
        results.AddRange(await connection.Execute(new OnBoardTestCommand(mid)));
}

var failing = results.Where(x => x.Passed == false);
var marginal = results
    .Where(x => x.Passed == true && x.BandPosition >= 0.85)
    .OrderByDescending(x => x.BandPosition);

foreach (var x in failing)
    Console.WriteLine($"FAIL  {x.Monitor}: {x.Value:F2} {x.Unit}");

foreach (var x in marginal)
    Console.WriteLine($"WATCH {x.Monitor}: {x.BandPosition:P0} of band");
```
