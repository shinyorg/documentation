---
title: L2CAP Channels
---

## Overview

L2CAP Connection-Oriented Channels (CoC) let a BLE peripheral publish a PSM that centrals can connect to for streaming data — useful for transferring large blobs or high-throughput data without bouncing through GATT characteristics.

`IBleHostingManager.OpenL2Cap` publishes a PSM and invokes your callback for every accepted central connection. The PSM stays alive until you dispose the returned `L2CapInstance`. Centrals connect to it using [Shiny.BluetoothLE's L2CAP API](../ble/l2cap).

## Opening an L2CAP Listener

```csharp
using Shiny.BluetoothLE;
using Shiny.BluetoothLE.Hosting;

IBleHostingManager hosting; // injected

var instance = await hosting.OpenL2Cap(
    secure: false,
    onOpen: channel =>
    {
        // channel.Psm           — the PSM you were assigned
        // channel.Identifier    — the connecting central's identifier
        // channel.DataReceived  — IObservable<byte[]> of incoming bytes
        // channel.Write(bytes)  — IObservable<Unit> that completes when bytes are queued
    }
);

Console.WriteLine($"Listening on PSM {instance.Psm}");
```

The PSM is platform-assigned and returned via `instance.Psm` — advertise it to centrals out-of-band (e.g. through a GATT characteristic that your service exposes).

Each `L2CapChannel` is an `IDisposable` record. Dispose it to close that specific central's channel; the listener stays open for further connections until `instance.Dispose()` is called.

## Reading Data

`DataReceived` is a hot observable. Each emission is a right-sized `byte[]` payload as bytes become available. It completes when the central closes its end and surfaces I/O errors via `OnError`.

```csharp
channel.DataReceived.Subscribe(
    payload => Console.WriteLine($"<- {payload.Length} bytes from {channel.Identifier}"),
    ex      => Console.WriteLine($"Channel error: {ex.Message}"),
    ()      => Console.WriteLine("Central closed channel")
);
```

## Writing Data

`Write` is a `Func<byte[], IObservable<Unit>>` that completes when the bytes have been queued. Await with `ToTask()` or chain via Rx.

```csharp
using System.Reactive.Threading.Tasks;

await channel.Write(payload).ToTask();
```

For large transfers apply your own back-pressure — the underlying buffer may apply flow control (Apple `HasSpaceAvailable`).

## Closing the Listener

Dispose the `L2CapInstance` to stop accepting and unpublish the PSM:

```csharp
instance.Dispose();
```

This cancels the accept loop on Android and unpublishes the channel on Apple. Already-open per-central `L2CapChannel`s are not closed automatically — dispose them explicitly if needed.

## Platform Notes

| Platform | API | Notes |
|----------|-----|-------|
| iOS / Mac Catalyst / macOS | `CBPeripheralManager.PublishL2CapChannel(encryptionRequired)` | The `secure` flag maps to encryption-required. The PSM is delivered through `DidPublishL2CapChannel`; each accepted connection comes through `DidOpenL2CapChannel`. |
| Android | `BluetoothAdapter.ListenUsingL2capChannel` / `ListenUsingInsecureL2capChannel` | Requires API 29+. Throws `InvalidOperationException` on older versions. A background accept loop calls `onOpen` for each connection until the listener is disposed. |
| Linux | `AF_BLUETOOTH` / `BTPROTO_L2CAP` / `SOCK_SEQPACKET` socket | The PSM is kernel-assigned from the LE dynamic range (≥ `0x80`) by passing `psm=0` to `bind()`. `secure=true` sets `BT_SECURITY_MEDIUM` via `setsockopt(SOL_BLUETOOTH, BT_SECURITY)`; `secure=false` sets `BT_SECURITY_LOW`. An accept loop on a dedicated `Task` invokes `onOpen` for each connection. L2CAP is independent of advertising and GATT on this platform — you can publish a PSM even though Linux GATT-server / LE-advertisement hosting is still a work in progress; centrals must learn the device address out-of-band (e.g. pre-paired via `bluetoothctl`). |
| Blazor WASM / Windows | — | Not supported. Web Bluetooth does not expose L2CAP; WinRT has no public LE CoC surface. Windows hosting throws `NotSupportedException` from `OpenL2Cap`. |

## L2CAP File Server

`OpenL2CapFileServer` turns a PSM into a file server backed by a directory — connected centrals can push files to it and pull files from it using the [client upload/download API](../ble/l2cap#file-upload--download). It handles the accept loop, the request protocol, and the filesystem work for you.

```csharp
using Shiny.BluetoothLE;
using Shiny.BluetoothLE.Hosting;

var instance = await hosting.OpenL2CapFileServer(
    rootDirectory: Path.Combine(FileSystem.AppDataDirectory, "ble-share"),
    secure: false,
    configure: opts =>
    {
        opts.AllowUploads = true;
        opts.AllowDownloads = true;
        opts.MaxUploadSize = 10 * 1024 * 1024;
        opts.OverwriteExistingUploads = false;

        opts.OnProgress = e => Console.WriteLine(
            $"{e.PeerIdentifier} {e.Type} {e.FileName} — {e.Progress.PercentComplete:P0}"
        );
        opts.OnCompleted = e => Console.WriteLine(
            $"{e.PeerIdentifier} finished {e.LocalFilePath} ({e.Result.BytesTransferred} bytes)"
        );
        opts.OnError = (request, ex) => Console.WriteLine(
            $"{request?.FileName ?? "(no request)"} failed: {ex.Message}"
        );
    }
);

Console.WriteLine($"File server listening on PSM {instance.Psm}");
```

The root directory is created if missing. Advertise `instance.Psm` to centrals out-of-band (e.g. through a GATT characteristic). Dispose the returned `L2CapInstance` to unpublish the PSM and drop connected peers.

### Options

| Member | Default | Description |
|--------|---------|-------------|
| `RootDirectory` | *(required)* | Directory downloads are read from and uploads are written to |
| `Secure` | `false` | Requires an encrypted/authenticated channel (Android API 29+) |
| `AllowUploads` | `true` | Accept files pushed by peers |
| `AllowDownloads` | `true` | Serve files requested by peers |
| `OverwriteExistingUploads` | `true` | When `false`, an upload naming an existing file is refused with `NotPermitted` |
| `MaxUploadSize` | `null` (no limit) | Largest upload to accept, in bytes. Anything larger is refused with `TooLarge` **before** a single body byte is read |
| `Transfer` | `L2CapTransferOptions.Default` | Buffer size, progress interval, and idle timeout for every transfer |
| `Authorize` | `null` | Per-request hook, called after the built-in checks pass. Return `false` to refuse with `NotPermitted` |
| `OnProgress` | `null` | Raised as a transfer streams, at `Transfer.ProgressInterval` |
| `OnCompleted` | `null` | Raised once a transfer finishes successfully |
| `OnError` | `null` | Raised when a request is refused or a transfer fails. The request is `null` when the failure wasn't tied to one (e.g. the channel dropped while idle) |

`Authorize` sees the peer identifier and the requested name, so it is the place for per-device rules:

```csharp
opts.Authorize = request =>
    request.Type == L2CapTransferType.Download ||
    this.trustedPeers.Contains(request.PeerIdentifier);
```

### Path Safety

File names arrive from the peer, so they are untrusted. Every requested name is resolved *under* `RootDirectory` and anything that escapes it — an absolute path, a `../` traversal, invalid path characters — is refused with `NotPermitted` before any filesystem access happens.

Sub-paths *inside* the root are allowed (`logs/today.txt` resolves under the root), so lay out the root directory as if peers can name anything within it.

### Custom Serving

When a directory isn't the right shape — serving from a database, generating content on the fly, renaming on the way in — use `HandleL2CapRequests` and answer each request yourself:

```csharp
var instance = await hosting.HandleL2CapRequests(
    secure: false,
    onRequest: async (request, ct) =>
    {
        if (request.Type == L2CapTransferType.Download && request.FileName == "diagnostics.json")
        {
            var json = await this.BuildDiagnostics(ct);
            using var ms = new MemoryStream(Encoding.UTF8.GetBytes(json));
            await request.AcceptDownload(ms, ms.Length, cancellationToken: ct);
        }
        else
        {
            await request.Reject(L2CapTransferError.NotFound, cancellationToken: ct);
        }
    },
    onError: (request, ex) => Console.WriteLine($"Transfer failed: {ex.Message}")
);
```

Requests are served one at a time per peer, and each must be answered before the next is read. If your handler returns without answering, the request is auto-rejected so the peer is never left hanging.

See [BluetoothLE → L2CAP](../ble/l2cap#file-upload--download) for the full `L2CapFileRequest`, `L2CapTransferOptions`, `L2CapTransferResult`, and `L2CapTransferError` surface — the same types are used on both sides of the channel.

## Raw Streaming

`L2CapChannelExtensions.SendFile` streams a file (or any `Stream`) over an accepted channel with HTTP-transfer-style progress metrics. Unlike the file server, there is no handshake — the central receives raw bytes on `DataReceived` and has to know what they mean. Useful for pushing firmware blobs, large config payloads, etc. to a connected central.

```csharp
using Shiny.BluetoothLE;

using var instance = await hosting.OpenL2Cap(secure: false, onOpen: async channel =>
{
    await channel.SendFile(
        "/path/to/firmware.bin",
        bufferSize: 4096,
        onProgress: p => Console.WriteLine(
            $"{p.PercentComplete:P0} {p.BytesPerSecond / 1024} KB/s, ETA {p.EstimatedTimeRemaining}"
        )
    );
    channel.Dispose();
});
```

`onProgress` fires roughly every two seconds during the transfer plus one final emission on completion. A `Stream` overload is available for non-file sources — pass `totalBytes` when known to enable percent-complete and ETA computation. See [BluetoothLE → L2CAP → TransferProgress](../ble/l2cap#transferprogress) for the full `TransferProgress` shape.

## Complete Example

```csharp
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using Shiny.BluetoothLE;
using Shiny.BluetoothLE.Hosting;

public class EchoService(IBleHostingManager hosting)
{
    L2CapInstance? instance;

    public async Task Start()
    {
        var access = await hosting.RequestAccess(advertise: false, connect: true);
        if (access != AccessState.Available)
            throw new InvalidOperationException("BLE hosting access denied.");

        this.instance = await hosting.OpenL2Cap(
            secure: false,
            onOpen: async channel =>
            {
                Console.WriteLine($"Central {channel.Identifier} connected on PSM {channel.Psm}");

                channel.DataReceived.Subscribe(
                    async payload =>
                    {
                        // Echo back
                        await channel.Write(payload).ToTask();
                    },
                    ex => Console.WriteLine($"Channel error: {ex.Message}"),
                    () => channel.Dispose()
                );
            }
        );

        Console.WriteLine($"Echo server listening on PSM {this.instance.Value.Psm}");
    }

    public void Stop()
    {
        this.instance?.Dispose();
        this.instance = null;
    }
}
```
