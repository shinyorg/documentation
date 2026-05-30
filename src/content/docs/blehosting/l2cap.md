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

## File Transfer

`L2CapChannelExtensions.SendFile` streams a file (or any `Stream`) over an accepted channel with HTTP-transfer-style progress metrics. Useful for pushing firmware blobs, large config payloads, etc. to a connected central.

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

`onProgress` fires roughly every two seconds during the transfer plus one final emission on completion. A `Stream` overload is available for non-file sources — pass `totalBytes` when known to enable percent-complete and ETA computation. See [BluetoothLE → L2CAP → File Transfer](../ble/l2cap#file-transfer) for the full `TransferProgress` shape.

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
