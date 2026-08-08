---
title: Adapter Emulator (Sample)
---

Testing an OBD app means sitting in a car with the engine running. The sample app in
[shinyorg/obd](https://github.com/shinyorg/obd/tree/main/samples/Sample.Maui) can also be the adapter,
so you can do it at a desk.

It runs both roles at once:

- **Client** — the Scan tab finds a real adapter and reads it, the way any app using this library would.
  From the dashboard it opens onto, **All commands** issues every command in the library against that
  adapter and shows what each one parsed back to.
- **Adapter** — the Adapter, Drive, Values and Faults tabs turn the device into an ELM327-compatible
  OBD-II adapter, reachable over BLE *and* over TCP, answering with whatever values you set — or with a
  scenario driving them for you.

Point one device at another, or point a third-party OBD app at it. Everything a real adapter does —
the AT initialisation handshake, supported-PID discovery, multi-frame VIN reads, freeze frames,
trouble codes — happens for real, against values you control.

## Running it

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

That means the Scan tab of this same app, on a second device, finds it with no configuration at all.

Responses are chunked into 20-byte notifications the way real adapters send them, so a client that
reassembles by watching for the `>` prompt is genuinely exercised.

### TCP and mDNS

A plain TCP server on port 35000 — the first endpoint `WifiObdConfiguration` probes — speaking the
same ELM327 dialect. WiFi OBD adapters are TCP-to-UART bridges and nothing more, so this is
indistinguishable from one.

What real adapters do *not* do is announce themselves, which is why `WifiObdTransport` has to walk a
list of well-known addresses. The sample publishes itself over mDNS with
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

The Adapter tab lists every address the device is reachable on, so you can also just type one into a
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

## Setting values

The Values tab lists every command in the library, searchable by name or by request (`010C`, `0902`).
Each one has:

- a **supported switch** — turn a PID off and it answers `NO DATA`, and it disappears from the
  supported-PID bitmask, so a client walking `0100`/`0120`/`0140` discovers exactly the set you left on
- an **editor** in engineering units — km/h, °C, %, volts — not raw bytes
- a **raw override** — hex typed here replaces the encoder, for composite PIDs or for deliberately
  malformed replies
- a **readback** — the bytes going on the wire, and what a `Shiny.Obd` client decodes from them

That last one is worth dwelling on. The readback runs the emulator's own bytes back through the real
command object, so the app tells you what your client is about to see. An encoder that disagrees with
the library's parser shows up there rather than as a wrong number somewhere else.

## Reading everything back

The Values tab is the adapter half — what the emulator will answer. **All commands**, reached from the
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

Behind them is one model of a car — mass, displacement, gearing, road load — and every parameter is
derived from it. That is what keeps the values consistent with each other: RPM matches the gear the
speed implies, mass air flow matches the load, fuel rate matches the air flow, and the trip counters
integrate the speed. A client that cross-checks two PIDs will not catch the emulator contradicting
itself.

The behaviour worth testing against is in the transitions:

- **Gear changes** put the sawtooth into the RPM trace, with shift points that move with load — a gentle
  pull-away shifts just over 2400 rpm, a hard one hangs on to nearly 5000
- **Deceleration fuel cut** closes the injectors when you lift off with a gear engaged, which swings
  load, mass air flow, fuel rate, short-term trim and the pre-cat oxygen sensor all at once
- **Harsh braking** drops 55 km/h in a couple of seconds, so a client that smooths or rate-limits its
  values has something to smooth
- **Warm-up and heat soak** move coolant, oil and intake temperature on their own time constants, and
  the trip counters, odometer and fuel level keep climbing across laps

A running scenario writes the mode 01 parameters it models — speed, RPM, throttle and pedal positions,
load, air flow, manifold pressure, timing, temperatures, torque, fuel rate and level, the trip counters,
and the bank 1 oxygen sensors. Those are overwritten until you stop the drive. Every other PID, the
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
