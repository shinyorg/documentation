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

## File Upload & Download

`SendFile` (below) just pushes bytes — the peer has to already know what it is receiving. The upload/download helpers add a small framed protocol on top of the channel so both peers agree on the **file name** and the **exact byte count** before a single body byte moves. That agreement is what makes percent-complete and ETA real on both ends.

The peripheral must be serving the same protocol — see [BluetoothLE Hosting → L2CAP File Server](../blehosting/l2cap#l2cap-file-server).

### One-Shot Transfers

`UploadFile` / `DownloadFile` on `IPeripheral` open a channel, run the transfer, and close the channel again:

```csharp
using Shiny.BluetoothLE;

var result = await peripheral.UploadFile(
    psm: 0x0083,
    localFilePath: "/path/to/reading.csv",
    remoteFileName: "reading.csv",   // optional - defaults to the local file name
    secure: false,
    onProgress: p => Console.WriteLine(
        $"{p.PercentComplete:P0} {p.BytesPerSecond / 1024} KB/s, ETA {p.EstimatedTimeRemaining}"
    ),
    cancellationToken: ct
);

Console.WriteLine($"Sent {result.BytesTransferred} bytes in {result.Elapsed} ({result.BytesPerSecond / 1024} KB/s)");
```

```csharp
var result = await peripheral.DownloadFile(
    psm: 0x0083,
    remoteFileName: "firmware.bin",
    localFilePath: Path.Combine(FileSystem.AppDataDirectory, "firmware.bin"),
    onProgress: p => Console.WriteLine($"{p.PercentComplete:P0}")
);
```

The download path is created (and overwritten) for you, and truncated to the received length. If the transfer fails, the partial file is deleted rather than left behind.

### Rx Variants

`UploadFileWithProgress` / `DownloadFileWithProgress` return `IObservable<TransferProgress>` — progress emissions as the body streams, a final 100% emission, then completion. Disposing the subscription cancels the transfer and closes the channel.

```csharp
peripheral
    .DownloadFileWithProgress(0x0083, "firmware.bin", localPath)
    .Subscribe(
        p  => this.Percent = p.PercentComplete,
        ex => Console.WriteLine($"Failed: {ex.Message}"),
        () => Console.WriteLine("Done")
    );
```

### Several Files Over One Channel

The one-shot methods open and close a channel per file. To move several files over a single channel, open it yourself and call the same helpers on the `L2CapChannel`:

```csharp
using var channel = await peripheral.OpenL2CapChannelAsync(psm: 0x0083, secure: false, cancellationToken: ct);

await channel.UploadFile("/path/to/a.bin", cancellationToken: ct);
await channel.UploadFile("/path/to/b.bin", cancellationToken: ct);
await channel.DownloadFile("config.json", localConfigPath, cancellationToken: ct);
```

`OpenL2CapChannelAsync` is the awaitable form of `ICanL2Cap.OpenL2CapChannel` — it throws `NotSupportedException` on platforms without L2CAP rather than returning an empty observable.

Stream overloads exist on both sides for non-file sources. Uploads require the exact `length` up front — the peer preallocates against it and uses it for percent-complete:

```csharp
await channel.UploadFile(sourceStream, "reading.csv", length: sourceStream.Length, cancellationToken: ct);
await channel.DownloadFile("config.json", destinationStream, cancellationToken: ct);
```

:::caution
Transfers are **sequential** on a given channel — run one at a time, and do not subscribe to `channel.DataReceived` yourself while a transfer is in flight. The helpers consume that stream to read the protocol frames.
:::

### Serving Requests

A central can also be the *serving* side — useful when the peripheral drives the exchange. `ReadFileRequest` waits for the peer's next request and hands back an `L2CapFileRequest` to accept or reject:

```csharp
var request = await channel.ReadFileRequest(cancellationToken: ct);
if (request == null)
    return; // peer closed the channel

if (request.Type == L2CapTransferType.Upload)
{
    // peer wants to send us request.FileName (request.Size bytes)
    await request.AcceptUpload(Path.Combine(inboxDir, "inbound.bin"), cancellationToken: ct);
}
else
{
    // peer wants request.FileName from us
    await request.AcceptDownload("/path/to/local.bin", cancellationToken: ct);
}
```

Every request must be answered — with one of the accept methods or `Reject(...)` — before the next one is read; the peer is blocked waiting on the answer.

```csharp
await request.Reject(L2CapTransferError.NotPermitted, "Not accepting uploads right now");
```

`request.FileName` comes straight off the wire — treat it as untrusted input and never hand it to the filesystem unresolved.

| `L2CapFileRequest` member | Description |
|--------|-------------|
| `Type` | `Upload` (the peer wants to send you a file) or `Download` (it wants one from you) |
| `FileName` | The name the peer asked for — untrusted |
| `Size` | Bytes the peer intends to send; `0` on a download request, where you supply the size |
| `PeerIdentifier` | The remote peer identifier |
| `Psm` | The PSM the channel is running on |
| `IsAnswered` | Whether the request has already been accepted or rejected |

### Tuning

`L2CapTransferOptions` is accepted by every transfer method:

| Member | Default | Description |
|--------|---------|-------------|
| `BufferSize` | `4096` | Bytes read/written per chunk. Larger values mean fewer syscalls but coarser progress |
| `ProgressInterval` | 2 seconds | How often `onProgress` fires while the body streams. A completion event always fires regardless |
| `IdleTimeout` | 30 seconds | How long a read may stall before the transfer is abandoned. Use `Timeout.InfiniteTimeSpan` to wait forever |

```csharp
var options = new L2CapTransferOptions
{
    BufferSize = 16 * 1024,
    ProgressInterval = TimeSpan.FromMilliseconds(500),
    IdleTimeout = TimeSpan.FromMinutes(2)
};

await peripheral.DownloadFile(psm, "firmware.bin", localPath, options: options);
```

### Results & Errors

A completed transfer returns an `L2CapTransferResult`:

| Member | Description |
|--------|-------------|
| `Type` | `Upload` or `Download`, as named by the peer that initiated it — both peers report the same value |
| `FileName` | The file name agreed with the peer |
| `BytesTransferred` | Total bytes moved |
| `Elapsed` | Wall-clock duration |
| `BytesPerSecond` | Average throughput across the whole transfer |

A refusal or failure throws `L2CapTransferException` (a `BleException`) carrying an `L2CapTransferError`:

| Error | Meaning |
|-------|---------|
| `NotFound` | The requested file does not exist on the peer |
| `NotPermitted` | The peer refused it — uploads/downloads disabled, or the name was rejected |
| `TooLarge` | The upload exceeds what the peer will accept |
| `IoError` | The peer hit an IO error reading or writing the file |
| `ProtocolError` | The peers fell out of sync, or the channel is not speaking this protocol |
| `Cancelled` | The peer cancelled the transfer |
| `Unknown` | No cause was reported |

```csharp
try
{
    await peripheral.DownloadFile(psm, "firmware.bin", localPath);
}
catch (L2CapTransferException ex) when (ex.Error == L2CapTransferError.NotFound)
{
    Console.WriteLine("The peripheral doesn't have that file");
}
```

A rejection leaves the channel usable for further requests. A `ProtocolError` does not — open a new channel.

## Raw Streaming

`L2CapChannelExtensions.SendFile` streams a file (or any `Stream`) over the channel with HTTP-transfer-style progress metrics — bytes-per-second, bytes-transferred, percent-complete, estimated time remaining. There is no handshake and no framing: the receiver gets raw bytes on `DataReceived` and is responsible for knowing what they mean. Use the [upload/download helpers](#file-upload--download) when you want the peers to agree on a name and length.

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

## TransferProgress

Every progress callback on this page — `SendFile`, the upload/download helpers, and the hosting file server — reports the same record, which mirrors `Shiny.Net.Http.TransferProgress`:

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
