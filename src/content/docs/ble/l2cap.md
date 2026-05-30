---
title: L2CAP Channels
---

## Overview

L2CAP Connection-Oriented Channels (CoC) provide a streaming socket-like channel over BLE, suitable for transferring large blobs or high-throughput data without the overhead of GATT characteristic reads/writes.

In Shiny.BluetoothLE the central role exposes L2CAP through the optional `ICanL2Cap` capability on `IPeripheral`. The peripheral must have published a PSM (e.g. via `Shiny.BluetoothLE.Hosting.OpenL2Cap(...)`) — see [BluetoothLE Hosting → L2CAP](../blehosting/l2cap).

## Capability Detection

Not every backend supports L2CAP. Use the helpers in `FeatureL2Cap` to feature-detect at runtime:

```csharp
using Shiny.BluetoothLE;

if (peripheral.IsL2CapAvailable())
{
    // Backend supports L2CAP
}
```

Or call the safe extension that returns an empty observable on unsupported platforms:

```csharp
peripheral
    .TryOpenL2CapChannel(psm: 0x0083, secure: false)
    .Subscribe(channel => { /* ... */ });
```

## Opening a Channel

When the peripheral implements `ICanL2Cap`, you can open a channel directly:

```csharp
if (peripheral is ICanL2Cap l2cap)
{
    l2cap
        .OpenL2CapChannel(psm: 0x0083, secure: false)
        .Subscribe(channel =>
        {
            // channel.Psm           — the PSM the channel was opened on
            // channel.Identifier    — the remote peer identifier
            // channel.DataReceived  — IObservable<byte[]> of incoming bytes
            // channel.Write(bytes)  — IObservable<Unit> that completes when bytes are queued
        });
}
```

The returned `L2CapChannel` is an `IDisposable` record. Disposing it closes the underlying streams (Apple) or socket (Android) and releases platform resources.

## Reading Data

`DataReceived` is a hot observable. Each emission is a right-sized `byte[]` payload as bytes become available from the remote endpoint. It completes when the remote endpoint closes the channel (Apple `EndEncountered`, Android `InputStream` EOF) and surfaces I/O errors via `OnError`.

```csharp
channel.DataReceived.Subscribe(
    payload => Console.WriteLine($"Got {payload.Length} bytes"),
    ex      => Console.WriteLine($"Channel error: {ex.Message}"),
    ()      => Console.WriteLine("Channel closed")
);
```

## Writing Data

`Write` is a `Func<byte[], IObservable<Unit>>` that returns a single-shot observable completing when the bytes have been queued to the platform write buffer. Await it (via `ToTask()`) or chain via Rx.

```csharp
using System.Reactive.Threading.Tasks;

await channel.Write(payload).ToTask();
```

For larger transfers, batch writes through your own back-pressure strategy — the underlying buffer may apply flow control (Apple `HasSpaceAvailable`).

## Closing the Channel

Dispose the `L2CapChannel` to close the channel and release resources:

```csharp
using (var channel = await peripheral
    .TryOpenL2CapChannel(0x0083, secure: false)
    .FirstAsync()
    .ToTask())
{
    // Use the channel
}
```

## Platform Notes

| Platform | API | Notes |
|----------|-----|-------|
| iOS / Mac Catalyst / macOS | `CBPeripheral.OpenL2CapChannel` | The `secure` flag is ignored — security is determined by how the peripheral published the channel. |
| Android | `BluetoothDevice.CreateL2capChannel` / `CreateInsecureL2capChannel` | Requires API 29+. Opening throws `InvalidOperationException` on older versions. The `secure` flag selects between the two APIs. |
| Linux | `AF_BLUETOOTH` / `BTPROTO_L2CAP` / `SOCK_SEQPACKET` socket | BlueZ does not expose CoC over D-Bus, so the implementation opens the kernel socket directly. Peer BD-address and address type are read from `org.bluez.Device1.Address` / `AddressType`. `secure=true` sets `BT_SECURITY_MEDIUM` via `setsockopt(SOL_BLUETOOTH, BT_SECURITY)`; `secure=false` sets `BT_SECURITY_LOW`. LE dynamic PSMs (≥ `0x80`) do **not** require `CAP_NET_RAW` — unprivileged users can open channels. |
| Blazor WASM / Windows | — | Not supported. Web Bluetooth does not expose L2CAP; WinRT has no public LE CoC surface. |

## File Transfer

`L2CapChannelExtensions.SendFile` streams a file (or any `Stream`) over the channel with HTTP-transfer-style progress metrics — bytes-per-second, bytes-transferred, percent-complete, estimated time remaining.

```csharp
using Shiny.BluetoothLE;

await channel.SendFile(
    "/path/to/file.bin",
    bufferSize: 4096,
    onProgress: p => Console.WriteLine(
        $"{p.PercentComplete:P0} ({p.BytesTransferred}/{p.BytesToTransfer}) " +
        $"{p.BytesPerSecond / 1024} KB/s, ETA {p.EstimatedTimeRemaining}"
    ),
    cancellationToken: ct
);
```

The `onProgress` callback fires roughly every two seconds during the transfer (with `BytesPerSecond` computed from the window of bytes written since the last emission) and once more on completion with `BytesPerSecond = 0` and `BytesTransferred = BytesToTransfer`.

A `Stream` overload is available for non-file sources:

```csharp
await channel.SendFile(
    source: networkStream,
    totalBytes: contentLength,     // pass null when the length is unknown
    onProgress: p => ...
);
```

When `totalBytes` is `null`, `TransferProgress.IsDeterministic` is `false`, `PercentComplete` returns `-1`, and `EstimatedTimeRemaining` returns `TimeSpan.Zero`.

### TransferProgress

The progress record mirrors `Shiny.Net.Http.TransferProgress`:

| Member | Description |
|--------|-------------|
| `BytesPerSecond` | Throughput in the most recent ~2s window |
| `BytesToTransfer` | Total bytes expected, or `null` when unknown |
| `BytesTransferred` | Bytes written so far |
| `IsDeterministic` | `true` when `BytesToTransfer` is known |
| `PercentComplete` | `0.0`–`1.0`, or `-1` when not deterministic |
| `EstimatedTimeRemaining` | `TimeSpan` based on current throughput; `Zero` when unknown |

> **Naming collision**: if you reference both `Shiny.BluetoothLE` and `Shiny.Net.Http` in the same compilation, both expose a `TransferProgress` type. Use a file-level `using` alias or fully-qualified name to disambiguate.

## Complete Example

```csharp
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using Shiny.BluetoothLE;

async Task RunSession(IPeripheral peripheral, ushort psm)
{
    if (!peripheral.IsL2CapAvailable())
        throw new PlatformNotSupportedException("L2CAP not supported on this platform.");

    var channel = await peripheral
        .TryOpenL2CapChannel(psm, secure: false)
        .FirstAsync()
        .ToTask();

    using (channel)
    {
        var receiveSub = channel.DataReceived.Subscribe(payload =>
            Console.WriteLine($"<< {payload.Length} bytes")
        );

        await channel.Write(new byte[] { 0x01, 0x02, 0x03 }).ToTask();
        await channel.Write(new byte[] { 0xAA, 0xBB, 0xCC }).ToTask();

        await Task.Delay(TimeSpan.FromSeconds(5));
        receiveSub.Dispose();
    }
}
```
