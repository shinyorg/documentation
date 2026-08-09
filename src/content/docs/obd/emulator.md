---
title: Adapter Emulator
---

Testing an OBD app means sitting in a car with the engine running. `Shiny.Obd.Emulator` is the other
side of this library — it *is* the adapter, so you can do it at a desk, or in CI.

It answers the ELM327 dialect over a real socket rather than mocking `IObdConnection`, so the AT
initialisation handshake, supported-PID discovery, multi-frame VIN reads, freeze frames and trouble
codes all happen for real, against values you control. That also means it is just as useful for
testing an app that has nothing to do with .NET — point any third-party OBD app at it.

## Getting started

```bash
dotnet add package Shiny.Obd.Emulator
dotnet add package Shiny.Obd.Emulator.Ble   # optional - also advertise as a BLE adapter
```

```csharp
services.AddMdns();                       // optional - announces the TCP side as _obd._tcp
services.AddObdEmulator();                // vehicle, ELM327 responder, TCP front-end, scenarios
services.AddObdEmulatorBluetoothLE();     // optional
```

```csharp
var host = provider.GetRequiredService<ObdEmulatorHost>();
var state = provider.GetRequiredService<ObdEmulatorState>();

state.Vehicle = VehicleCatalog.NissanLeaf;     // a BEV, with a VIN that decodes
state.Find(0x01, 0x0D)!.Number = 88;           // 88 km/h

await host.Start();                            // nothing listens until you say so
```

Transports are additive and share one vehicle, so a value you set is answered identically over every
one of them. Add your own by implementing `IObdEmulatorTransport`.

:::note[Configuration]
`AddObdEmulator(x => ...)` takes an `ObdEmulatorConfiguration` — the BLE service and characteristic
UUIDs, the advertised local name, the TCP port, and the mDNS service and instance names.
:::

## In a test

There is no UI framework anywhere in the package. `AddObdEmulator` captures whatever
`SynchronizationContext` you register it on — the UI thread in MAUI, WPF and WinForms — and marshals
state changes back to it; in a console or a test host there is none and everything runs inline.

Set `TcpPort = 0` and the OS assigns a free port, so tests can run several emulators at once:

```csharp
var config = new ObdEmulatorConfiguration { TcpPort = 0 };
var state = new ObdEmulatorState();
var server = new TcpObdServer(new Elm327Responder(state), config);

// A null context means "run inline" - there is no UI thread to marshal to here.
var host = new ObdEmulatorHost([server], config, new SynchronizationContextDispatcher(null));
await host.Start();

await using var connection = new ObdConnection(new WifiObdTransport("127.0.0.1", server.BoundPort));
await connection.Connect();

Assert.Equal(88, await connection.Execute(StandardCommands.VehicleSpeed));
```

:::caution[`BoundPort`, not `TcpPort`]
Read the port back off `TcpObdServer.BoundPort`. It is the port actually listening, which is only the
configured one when you configured a non-zero one.
:::

## The sample app

[shinyorg/obd](https://github.com/shinyorg/obd/tree/main/samples/Sample.Maui) wraps the package in a
full front-end and runs both roles at once:

- **Client** — the Scan tab finds a real adapter and reads it, the way any app using this library would.
  From the dashboard it opens onto, **All commands** issues every command in the library against that
  adapter and shows what each one parsed back to.
- **Adapter** — the Adapter, Drive, Values and Faults tabs drive the emulator, answering with whatever
  values you set — or with a scenario driving them for you.

```bash
git clone https://github.com/shinyorg/obd
cd obd
dotnet build samples/Sample.Maui/Sample.Maui.csproj -f net10.0-android   # or -f net10.0-ios
```

Windows is in the target list too (`net10.0-windows10.0.19041.0`, added automatically when building on
Windows).

Hosting starts as soon as the app launches — there is no button to press first. The Adapter tab shows
what it is advertising, who is connected, and every command that has come in.

## What it emulates

### BLE

A GATT service on `FFF0` with `FFF1` for notifications and `FFF2` for writes — the triple used by the
Veepeak OBDCheck BLE and the ELM327 clones built on the same module, and the default in
`BleObdConfiguration`. It advertises as `VEEPEAK`.

That means an unconfigured `Shiny.Obd` client finds it with no setup on either side — including the
sample app's own Scan tab, running on a second device.

Responses are chunked into 20-byte notifications the way real adapters send them, so a client that
reassembles by watching for the `>` prompt is genuinely exercised.

### TCP and mDNS

A plain TCP server on port 35000 — the first endpoint `WifiObdConfiguration` probes — speaking the
same ELM327 dialect. WiFi OBD adapters are TCP-to-UART bridges and nothing more, so this is
indistinguishable from one.

What real adapters do *not* do is announce themselves, which is why `WifiObdTransport` has to walk a
list of well-known addresses. The emulator publishes itself over mDNS with
[Shiny.Net.Discovery](https://www.nuget.org/packages/Shiny.Net.Discovery), so a client can browse
`_obd._tcp` and get the endpoint back directly:

```csharp
await foreach (var result in mdns.Browse("_obd._tcp", ct))
{
    if (result.Status != MdnsBrowseStatus.Found)
        continue;

    var endpoint = result.Service.GetEndPoint();
    var transport = new WifiObdTransport(endpoint!.Address.ToString(), endpoint.Port);
    var connection = new ObdConnection(transport);
    await connection.Connect();
}
```

`TcpObdServer.Endpoints` lists every address the device is reachable on (the sample shows them on its
Adapter tab), so you can also just type one into a
client by hand.

Both transports share one vehicle. A value you change is answered identically over BLE and TCP.

### AT commands

The initialisation sequence `Elm327AdapterProfile` runs is handled in full — `ATZ`, `ATE`, `ATL`,
`ATS`, `ATH`, `ATSP` — along with `ATI`, `AT@1`, `ATRV`, `ATDP` and `ATDPN`. Echo, spaces, headers and
linefeeds are honoured per connection, and the adapter powers up with echo on, exactly as a real one
does.

Anything unrecognised is answered `OK` and flagged in the log rather than rejected — a simulator that
refuses an unfamiliar init string just makes the app under test look broken.

### Modes

| Mode | Behaviour |
|------|-----------|
| 01 | Live data. Every PID the library has a command for, plus computed supported-PID bitmasks |
| 02 | Freeze frames, including the causal DTC at PID 02 |
| 03 / 07 / 0A | Stored, pending and permanent trouble codes |
| 04 | Clears stored and pending codes and drops the MIL; permanent codes survive |
| 06 | On-board monitoring test results with supported-MID bitmasks |
| 09 | VIN, calibration IDs, CVN, ECU name, in-use performance tracking |

Replies longer than one CAN frame get the byte-count line and numbered frames a real adapter sends,
so a VIN read exercises the multi-frame path rather than pretending it away.

## Picking a vehicle

Almost every OBD app keys a vehicle by its VIN, so an emulator answering a made-up one is useless the
moment you try to decode it — and a decoder answers "no such vehicle" rather than failing loudly,
which looks like a bug in your app.

Set `ObdEmulatorState.Vehicle` (the sample has a picker on its Adapter tab). Every VIN in
`VehicleCatalog`  has a real WMI and descriptor, a valid ISO
3779 check digit, and a decode verified against NHTSA vPIC — the registry behind
[`VpicVinDecoder`](/obd/vin) — so `Decode` comes back with a make, model and year rather than null.
Only the serial portion (positions 12–17) is invented, which is the point: a VIN decodes from its WMI
and descriptor, so these identify a real vehicle *specification* without belonging to a car anyone
owns.

| Vehicle | VIN | What it covers |
|---------|-----|----------------|
| 2018 Honda Civic LX | `2HGFC2F51JH542108` | The baseline. Petrol, everything supported |
| 2019 Toyota Camry LE | `4T1B11HK9KU742051` | Eight-speed automatic — a stepped rpm sawtooth |
| 2019 BMW 330i xDrive | `WBA5R1C58KA751236` | Reports EOBD *and* OBD-II on PID 1C |
| 2016 Toyota Prius | `JTDKARFU5G3512804` | Hybrid: fuel type 17 and a live traction battery on PID 5B |
| 2015 VW Golf TDI | `3VWRA7AU1FM024518` | Diesel: compression-ignition monitors, no O2 sensors, no evap |
| 2018 Ram 2500 (Cummins) | `3C6UR5DL7JG264913` | 3.4 tonnes and 6.7 litres — air flow and fuel rate an order of magnitude off the cars |
| 2019 Nissan Leaf | `1N4AZ1CP9KC310468` | BEV: no rpm, no fuel level, no air flow, no O2 |
| 1998 Chevrolet Cavalier | `1G1JC5246W7180425` | Early OBD-II — answers **no mode 09 at all**, so there is no VIN to read |

Picking one rewrites the whole car, not just the VIN:

- the **identity PIDs** — VIN, calibration ID, ECU name, fuel type, OBD standard, ethanol content and
  hybrid battery level
- **which PIDs exist at all.** A diesel drops the narrowband oxygen sensors and the evaporative
  system; the EV drops a third of mode 01. They vanish from the supported-PID masks and answer
  `NO DATA`, which is the most useful thing an emulator can do for you — a dashboard that assumes
  every car reports fuel level breaks on the Leaf, and nothing catches that if the emulator always
  answers
- the **readiness monitor set**, since bytes C and D describe different tests on compression ignition
- the **fault memory**, seeded with codes a vehicle of that kind actually throws — DPF and SCR codes
  on the diesels, `P0A80` on the hybrid and the EV
- the **physical model** a [driving scenario](#driving-scenarios) plays through: mass, displacement,
  power, gearing, shift points, tank size and fuel chemistry

That last one is why the same scenario is not the same drive twice. The Cavalier is 1.2 tonnes on a
three-speed box; the Ram is 3.4 tonnes on a diesel that has shifted by 2900 rpm.

:::note[The Cavalier has a VIN it will not tell you]
Mode 09 only became universal around 2005. That vehicle answers `NO DATA` to mode 09 PID 02, so the
VIN in the table above is unreachable over the bus — which is the case an app that keys vehicles by
VIN has to survive. Pick it deliberately when you want to test that path.
:::

Anything here is still editable by hand afterwards — the VIN is just another mode 09 parameter, so a
VIN off a car you actually own works too. Setting `Vehicle` again resets the lot.

```csharp
state.Find(0x09, 0x02)!.Text = "1HGCM82633A004352";
```

### Adding your own

Take the first eight characters and the last eight from the vehicle you want, leave position 9 as
anything, and ask the library for the check digit:

```csharp
var vin = "3VWRA7AU" + VinNumber.CalculateCheckDigit("3VWRA7AU0FM024518") + "FM024518";
```

Then confirm it against
`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/<vin>?format=json` and keep it only if
`ErrorCode` comes back `"0"`. vPIC is a US registry, so a European-market VIN may decode to a make
and nothing else.

`EmulatedVehicle` is a record, so the quickest way to a new one is usually to take the catalog entry
closest to what you want and change what differs:

```csharp
state.Vehicle = VehicleCatalog.HondaCivic with
{
    Name = "2021 Honda Civic Si",
    Vin = vin,
    StoredDtcs = ["P0301"]
};
```

## Setting values

`ObdEmulatorState.Parameters` holds one `ObdParameter` per command in the library; `state.Find(mode, pid)`
picks one out. The sample's Values tab is a UI over exactly this list, searchable by name or by
request (`010C`, `0902`).

```csharp
state.Find(0x01, 0x05)!.Number = 92;        // coolant, °C
state.Find(0x01, 0x10)!.IsSupported = false; // mass air flow: now answers NO DATA
state.Find(0x01, 0x0C)!.RawOverride = "1F40"; // exact bytes, encoder bypassed
```

Each parameter has:

- a **supported switch** — turn a PID off and it answers `NO DATA`, and it disappears from the
  supported-PID bitmask, so a client walking `0100`/`0120`/`0140` discovers exactly the set you left on
- an **editor** in engineering units — km/h, °C, %, volts — not raw bytes
- a **raw override** — hex typed here replaces the encoder, for composite PIDs or for deliberately
  malformed replies
- a **readback** — the bytes going on the wire, and what a `Shiny.Obd` client decodes from them

That last one is worth dwelling on. `ObdParameter.Readback` runs the emulator's own bytes back through
the real command object, so it tells you what your client is about to see. An encoder that disagrees
with the library's parser shows up there rather than as a wrong number somewhere else.

## Reading everything back

The emulator is the adapter half — what will be answered. **All commands** in the sample, reached from the
dashboard after picking an adapter on the Scan tab, is the client half: it issues every command the
library has against whatever it is connected to and shows what each one parsed back to.

It asks in the order a client should:

1. **Walk the support masks.** `SupportedPidsCommand` over `0100`/`0120`/`0140`… stopping at the first
   block the vehicle does not answer, then `OnBoardTestSupportedMidsCommand` over the mode 06 blocks.
2. **Ask only for what came back.** A PID the mask did not claim is marked *not supported* rather than
   asked — which is the whole point of the masks, since probing blind spends a round trip per PID to be
   told `NO DATA`. A switch turns the gate off when you want to catch an ECU whose mask under-reports
   what it will actually answer.
3. **Check the freeze frame before reading it.** `FreezeFrameCommands.CausalDtc()` runs first; when it
   answers null the rest of mode 02 is skipped, because an unstored frame reads back zero-filled and
   0% engine load at -40 °C looks like a measurement rather than an absent one.
4. **Add the monitors it discovered.** Each supported MID becomes its own `OnBoardTestCommand` row.

Every mode 01 reading is paired with its mode 02 counterpart via `AsFreezeFrame()`, so the sweep covers
both. `ClearDtcCommand` is deliberately left out of it and sits on its own button behind a confirm tap —
it is the one command here that changes the vehicle rather than reading it, and a sweep that ran
everything would wipe fault memory as a side effect of looking at it.

Pointed at the emulator, the two halves check each other: the Values tab says what should come back,
and this says what a client actually got.

## Driving scenarios

Hand-set values are a flat line, and a flat line will not catch a client that mishandles a value going
backwards, a gear change, or an hour of continuous polling. The Drive tab plays a scenario into the
emulator instead — five updates a second, for as long as you leave it running.

| Scenario | What it plays |
|----------|---------------|
| Warm idle | Parked with the engine running — the baseline to compare a drive against |
| City driving | Lights, a school zone, a roundabout, a bus, and one emergency stop. ~8 minutes a lap |
| Busy highway | Merge, overtakes, a truck cutting in, and a stop-and-go jam that clears. ~13 minutes a lap |
| Mixed commute | City, then highway, then city. ~30 minutes a lap — the one to leave running overnight |

Every scenario loops, and the tab shows which leg is playing, how far into the drive it is, and how
many laps it has done.

Behind them is one model of a car — mass, displacement, gearing, road load — taken from the
[vehicle you picked](#picking-a-vehicle), and every parameter is derived from it. That is what keeps
the values consistent with each other: RPM matches the gear the speed implies, mass air flow matches
the load and the engine's own displacement, fuel rate matches the air flow at that fuel's
stoichiometric ratio and density, and the trip counters integrate the speed. A client that
cross-checks two PIDs will not catch the emulator contradicting itself.

The behaviour worth testing against is in the transitions:

- **Gear changes** put the sawtooth into the RPM trace, with shift points that move with load — in the
  Civic a gentle pull-away shifts just over 2100 rpm and a hard one hangs on to nearly 3800, while the
  Cummins is done by 2900 whatever you do
- **Deceleration fuel cut** closes the injectors when you lift off with a gear engaged, which swings
  load, mass air flow, fuel rate, short-term trim and the pre-cat oxygen sensor all at once
- **Harsh braking** drops 55 km/h in a couple of seconds, so a client that smooths or rate-limits its
  values has something to smooth
- **Warm-up and heat soak** move coolant, oil and intake temperature on their own time constants, and
  the trip counters, odometer and fuel level keep climbing across laps

A running scenario writes the mode 01 parameters it models — speed, RPM, throttle and pedal positions,
load, air flow, manifold pressure, timing, temperatures, torque, fuel rate and level, the trip counters,
and the bank 1 oxygen sensors — skipping any of those the chosen vehicle does not have, so the Leaf
never shows a moving air flow reading it would refuse to answer. Those are overwritten until you stop
the drive. Every other PID, the
supported switches, the fault memory and the adapter identity stay exactly where you set them — so a
scenario can be running while you add a trouble code or turn a PID off.

Starting a drive picks up the current values as its starting point, so the odometer, fuel level and
temperatures continue from what is on screen rather than jumping.

## Faults and identity

The Faults tab holds the fault memory and the adapter's identity:

- **MIL** and the stored code count, which together drive PIDs 01 and 41
- **Readiness monitors** complete or still running — the difference between passing and failing an
  emissions inspection
- **Compression ignition**, which changes which monitor set bytes C and D describe
- **Freeze frame** stored or not, and the code that caused it
- **Ignition off**, which makes every OBD request answer `UNABLE TO CONNECT`
- **Trouble codes** for modes 03, 07 and 0A, validated as you add them
- **`ATI` response** — put `STN` in it and `ObdConnection` picks the OBDLink profile instead of the
  ELM327 one, which is how you test that branch without owning an OBDLink

## Permissions

Both roles need permissions the client-only case does not.

- **Android** — `BLUETOOTH_ADVERTISE` for the GATT server, plus `INTERNET` and
  `CHANGE_WIFI_MULTICAST_STATE` for the TCP listener and its mDNS record.
- **iOS** — `NSBluetoothPeripheralUsageDescription`, and for mDNS both `NSLocalNetworkUsageDescription`
  and an `NSBonjourServices` array listing `_obd._tcp`. Without the service listed, iOS 14+ blocks the
  advertisement outright rather than prompting.
- **Windows** — `bluetooth`, `privateNetworkClientServer` and `internetClientServer` capabilities.

:::note[BLE peripheral mode is not universal]
Not every device can advertise as a BLE peripheral. When it cannot, the Adapter tab says so and the
TCP side still comes up on its own — the two transports start independently.
:::
