---
title: VIN Decoding
---

The ECU reports its VIN on mode 09 PID 0x02, and a VIN is a licence plate for a *specification*:
make, model, year, and — where the registry has it — the engine, drivetrain and body. None of that
last group exists on the OBD-II bus at any PID, so a registry lookup is the only way to get it.

```csharp
var vin = await connection.Execute(StandardCommands.Vin);
var vehicle = await vinDecoder.Decode(vin);

if (vehicle != null)
    Console.WriteLine($"{vehicle.ModelYear} {vehicle.Make} {vehicle.Model} {vehicle.Trim}");
```

## Registration

```csharp
services.AddVinDecoder();
```

That registers `IVinDecoder` backed by **NHTSA vPIC** — free, keyless, and requiring no registration
or API key. It also calls `AddHttpClient()`, since the decoder resolves an `IHttpClientFactory`.

### Using your own provider

vPIC is a US federal registry: excellent for North American vehicles and thinner elsewhere. Register
your own implementation to use a commercial provider, a regional registry, or an offline table.

```csharp
services.AddVinDecoder<MyRegistryVinDecoder>();
```

Registration uses `TryAddSingleton`, so the first one wins — a host that has already supplied its own
decoder is never overwritten by a library registering one on its behalf.

Whatever you register must honour the contract:

:::caution[IVinDecoder never throws]
Callers are background enrichment, not features. A vehicle whose VIN cannot be decoded is one the
user can still name by hand, and being out of signal is the ordinary case in a car rather than an
error worth surfacing. Return `null` rather than guessing, and never throw.
:::

## What comes back

`VinVehicle` is provider-neutral — nothing about it is shaped by NHTSA's wire format, so swapping the
provider is invisible to callers.

| Property | Type | Notes |
|----------|------|-------|
| `Make` / `Model` / `Trim` | `string?` | |
| `ModelYear` | `int?` | Bounded 1900-2100 |
| `FuelType` | `string?` | Also available off the bus on PID 0x51 |
| `Electrification` | `string?` | Null on an ordinary combustion car |
| `EngineCylinders` | `int?` | Bounded 1-16 |
| `EngineDisplacementLitres` | `double?` | Bounded 0-20 |
| `EngineHorsepower` | `int?` | Bounded 1-2000 |
| `DriveType` / `BodyClass` / `TransmissionStyle` | `string?` | |
| `IsUsable` | `bool` | Whether make or model was identified at all |

Three things about that shape are deliberate:

- **The numbers arrive as numbers.** Registries send them as strings with an invariant decimal point,
  so a naive parse on a comma-decimal machine reads `"3.5"` as thirty-five and reports a 35-litre
  engine. Parsing is a rule the library owns rather than one every consumer repeats.
- **Every field is nullable, and null means the registry had nothing.** A blank is an absence, never
  a claim — which matters because these values commonly end up in front of a user or in an AI prompt,
  where "Unknown" reads as a fact about the car. The placeholders registries use in place of an empty
  string (`"Not Applicable"`, `"Not Available"`, `"N/A"`) are stripped to null.
- **Values are bounded, and out-of-range is dropped to null.** A garbled decode yielding "402
  cylinders" or model year 3 would otherwise travel wherever the caller sends its vehicle
  description.

Coverage falls off outside North America — plenty of VINs decode cleanly to a make and model and
nothing else. That is not a failure, and a missing displacement should not be treated as one.

## Checking a VIN before spending a request

`VinNumber` is the pure half, and is worth calling before any lookup — a VIN read over a serial link
through an adapter of unknown quality is commonly short, padded with nulls, or carrying a stray
prompt character.

```csharp
if (VinNumber.IsPlausible(vin))
    vehicle = await vinDecoder.Decode(vin);
```

`Decode` applies this itself, so calling it directly is only useful when you want to know *why*
nothing came back.

- `Normalize` strips control characters and whitespace and upper-cases; null when nothing usable
  remains.
- `IsPlausible` requires exactly 17 characters from the VIN alphabet. I, O and Q are excluded from
  that alphabet precisely because they are confusable with 1 and 0, so seeing one means the read is
  wrong rather than that the vehicle is unusual.

:::note[`IsPlausible` deliberately does not validate the check digit]
It is only mandatory in North America, so rejecting a legitimate non-NA VIN would cost more than one
wasted request. The check digit is available separately — see below.
:::

## The check digit

Position 9 of a VIN is an ISO 3779 check digit computed from the other sixteen characters.
`VinNumber` exposes it as an opt-in pair:

```csharp
VinNumber.CalculateCheckDigit("2HGFC2F51JH542108");   // '1'
VinNumber.IsCheckDigitValid("2HGFC2F51JH542108");     // true
```

`CalculateCheckDigit` returns `'0'`–`'9'` or `'X'` (which stands in for a remainder of ten), or
`null` when the input is not plausible to begin with. Whatever character currently sits in position 9
is ignored — its weight in the formula is zero — so a VIN carrying the wrong check digit still
computes the right one.

:::caution[Do not use `IsCheckDigitValid` to reject a VIN read off a vehicle]
The check digit is mandatory in North America and merely conventional elsewhere, so plenty of
legitimate European and Asian VINs fail it. That is why `IsPlausible` — the gate `Decode` applies —
leaves it out.
:::

Its two honest uses run the other way:

- **Catching a typo** in a VIN a *user* entered by hand. Transposing two characters is exactly the
  error the check digit exists to detect.
- **Generating VINs that a decoder will accept.** Take a real WMI and descriptor, compute position 9,
  and you have a VIN that decodes to a real make, model and year without belonging to anyone's car —
  which is how the [sample emulator](/obd/emulator#picking-a-vehicle) builds its vehicles.

## The bus outranks the registry for fuel type

Mode 01 PID 0x51 answers the same question as `VinVehicle.FuelType`, and where the two disagree the
bus is the better source: on a rebadged or grey-import vehicle the ECU is in the car in front of you
and the registry is not. It also needs no network, so it lands on a drive where the decode never
does.

```csharp
var fromBus = FuelTypes.Describe(await connection.Execute(StandardCommands.FuelType));
var fuelType = fromBus ?? vehicle?.FuelType;
```
