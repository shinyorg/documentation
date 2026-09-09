---
title: Distance & Accuracy
---

Beacon distance is an **estimate derived from signal strength**, not a measurement. Understanding
what that means is the difference between a feature that works and one that looks broken.

## Why raw RSSI is unusable

BLE signal strength swings wildly. Two consecutive advertisements from a beacon sitting perfectly
still on a table routinely differ by 10 dBm or more — reflections, someone walking past, the phone
rotating in a hand, another radio sharing the 2.4 GHz band. Feeding each advertisement straight into
a distance formula turns that into metres of jitter: a stationary beacon that reads 1.2 m, then
4.7 m, then 0.9 m.

So Shiny never does that. Every sample goes through a filter first.

## The pipeline

```
advertisement ──► RssiFilter ──► IBeaconDistanceEstimator ──► Proximity
                (trimmed mean      (path loss model)          (thresholds)
                 over a window)
```

**`RssiFilter`** keeps every sample inside a time window (20 seconds by default), sorts them,
discards a fraction from each end — dropping reflections and dropouts — and averages what is left.
This is the same approach AltBeacon's `RunningAverageRssiFilter` takes, and it is the single biggest
contributor to a reading that settles.

**`IBeaconDistanceEstimator`** converts the filtered signal into metres.

**Thresholds** map that distance onto a `Proximity` bucket.

:::note[On Apple platforms, only the last step runs]
CoreLocation does its own smoothing and hands back `CLBeacon.Accuracy` directly. Running Shiny's
filter and estimator on top of that would be fighting the OS with worse inputs, so for **iBeacon on
iOS, Mac Catalyst and macOS** the platform's distance is used as-is and only the proximity thresholds
apply. Eddystone always goes through the full pipeline, on every platform.
:::

## Configuring it

```csharp
services.AddBeaconRanging(new BeaconRangingOptions
{
    DistanceEstimator = new PathLossDistanceEstimator(3.0),
    RssiFilterWindow = TimeSpan.FromSeconds(10),
    RssiTrimFraction = 0.1,
    DefaultTxPower = -59,
    ImmediateThreshold = 0.5,
    NearThreshold = 3.0,
    RegionExitTimeout = TimeSpan.FromSeconds(30),
    RegionEvaluationInterval = TimeSpan.FromSeconds(5),
    AllowNonAppleCompanyId = false
});
```

| Option | Default | What it does |
|---|---|---|
| `DistanceEstimator` | `PathLossDistanceEstimator(2.0)` | The signal → metres model |
| `RssiFilterWindow` | 20s | Shorter reacts faster to movement; longer reads more steadily when still |
| `RssiTrimFraction` | 0.1 | Fraction discarded from each end of the sorted window |
| `DefaultTxPower` | -59 dBm | Used when a beacon advertises no calibration value |
| `ImmediateThreshold` | 0.5 m | Below this is `Proximity.Immediate` |
| `NearThreshold` | 3.0 m | Below this is `Near`, above is `Far` |
| `RegionExitTimeout` | 30s | Silence before a monitored region counts as exited |
| `AllowNonAppleCompanyId` | `false` | Accept iBeacon-shaped payloads sent under another company id |

## The estimators

### `PathLossDistanceEstimator` (default)

The log-distance path loss model:

```
d = 10 ^ ((txPower - rssi) / (10 · n))
```

`n` is the environmental attenuation factor. `2.0` is free space, where every 6 dB of loss is a
doubling of distance. Raise it towards **3.0–4.0** for a cluttered indoor environment, where the
signal decays faster than the inverse square law predicts.

This is the default because it has no hardware-specific magic numbers: it behaves identically on
every platform and degrades predictably as the environment changes.

### `CurveFitDistanceEstimator`

```
d = 0.89976 · (rssi/txPower)^7.7095 + 0.111
```

The empirical curve fit published by Radius Networks and carried by the AltBeacon library. Its
constants were fitted against one specific phone and one specific beacon, so accuracy varies with
the receiving hardware. It is shipped for **parity** — if you are comparing readings against another
Android beacon stack, this is what that stack is doing.

### Your own

```csharp
public class MyEstimator : IBeaconDistanceEstimator
{
    public double Estimate(double rssi, sbyte txPower)
    {
        if (rssi == 0)
            return -1;    // negative means "cannot estimate"

        return /* your model */;
    }
}
```

It is handed **filtered** RSSI, never a single raw advertisement.

## Calibration is the part that actually matters

The largest error source is not the model — it is `txPower`, the beacon's claimed signal strength at
the reference distance. If a beacon advertises a value that does not match its real output, every
distance derived from it is wrong by a constant factor no amount of filtering will fix.

- Most commercial beacons advertise a sensible calibrated value. Use it.
- A beacon advertising `0` is not calibrated. Shiny substitutes `DefaultTxPower`; set that from a
  measurement of your actual hardware.
- To measure it: put the beacon exactly 1 m away in an open space, read `Beacon.Rssi` for 30 seconds,
  and take the average. That number is the beacon's measured power.

## Designing around the error

Even filtered and calibrated, expect metres of error at any real distance, and worse through a body
or a wall. Design accordingly:

- **Good:** "which of these beacons is closest?", "is the user in the `Immediate` bucket?",
  "did they enter the region?"
- **Bad:** "the user is 2.4 m from the display", anything that draws a position on a floor plan,
  anything that switches state at a hard distance boundary

If a value crosses a threshold and flips your UI back and forth, add hysteresis on your side — widen
the band for leaving a state relative to entering it. Filtering reduces jitter; it does not remove it.

## Reading the low-level pieces directly

Everything is public and unit-tested, so you can use the parsing and filtering without the managers:

```csharp
// parse or build a raw iBeacon payload (Shiny.BluetoothLE)
var parsed = IBeaconPacket.Read(manufacturerData.Data);
var payload = IBeaconPacket.Build(uuid, major, minor, txPower);

// decode an Eddystone service data payload
var frame = EddystoneParser.Parse(serviceData.Data, peripheralId, rssi, options);

// filter a signal yourself
var filter = new RssiFilter(TimeSpan.FromSeconds(20), trimFraction: 0.1);
filter.Add(-70);
var smoothed = filter.Value;
```
