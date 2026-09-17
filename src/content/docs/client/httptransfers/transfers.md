---
title: Transfers
---

## Overview

`IHttpTransferManager` manages background upload and download operations. Each transfer is defined by an `HttpTransferRequest`.

## HttpTransferRequest

| Property | Type | Description |
|----------|------|-------------|
| `Identifier` | `string` | Unique ID for this transfer |
| `Uri` | `string` | The remote URL |
| `Type` | `TransferType` | `Download`, `UploadRaw`, or `UploadMultipart` |
| `LocalFilePath` | `string` | Path to the local file |
| `UseMeteredConnection` | `bool` | Allow transfer on metered networks (default: `true`) |
| `HttpContent` | `TransferHttpContent?` | Additional content for uploads |
| `Headers` | `IDictionary<string, string>?` | Custom HTTP headers |

## Downloading a File

```csharp
IHttpTransferManager manager; // injected

var request = new HttpTransferRequest(
    Identifier: "download-1",
    Uri: "https://example.com/largefile.zip",
    Type: TransferType.Download,
    LocalFilePath: Path.Combine(FileSystem.AppDataDirectory, "largefile.zip")
);

var transfer = await manager.Queue(request);
```

## Uploading a File (Raw)

```csharp
var request = new HttpTransferRequest(
    Identifier: "upload-1",
    Uri: "https://example.com/upload",
    Type: TransferType.UploadRaw,
    LocalFilePath: "/path/to/file.dat"
);

await manager.Queue(request);
```

## Uploading a File (Multipart)

Send a file with additional form data and headers.

```csharp
var request = new HttpTransferRequest(
    Identifier: "upload-2",
    Uri: "https://example.com/upload",
    Type: TransferType.UploadMultipart,
    LocalFilePath: "/path/to/photo.jpg",
    Headers: new Dictionary<string, string>
    {
        { "Authorization", "Bearer your-token" }
    },
    HttpContent: TransferHttpContent.FromFormData(
        ("description", "My photo"),
        ("category", "images")
    )
);

await manager.Queue(request);
```

### TransferHttpContent Helpers

```csharp
// JSON content
var content = TransferHttpContent.FromJson(new { name = "test", value = 42 });

// Form data
var content = TransferHttpContent.FromFormData(
    ("field1", "value1"),
    ("field2", "value2")
);

// Form data from dictionary
var dict = new Dictionary<string, string> { { "key", "value" } };
var content = TransferHttpContent.FromFormData(dict);
```

## Getting Pending Transfers

```csharp
var transfers = await manager.GetTransfers();
foreach (var transfer in transfers)
{
    Console.WriteLine($"{transfer.Identifier}: {transfer.Status}");
}
```

## Cancelling Transfers

```csharp
// Cancel a specific transfer
await manager.Cancel("upload-1");

// Cancel all transfers
await manager.CancelAll();
```

`Cancel` **removes** the transfer from the queue and deletes a download's partial file. If you want to stop a transfer but keep it for later, use `Pause` instead.

## Pausing & Resuming Transfers

`Pause` stops a transfer **without cancelling it** - the transfer stays in the queue, reports `HttpTransferState.Paused`, and is not auto-resumed when the app relaunches or the network returns. Call `Resume` to continue it.

```csharp
// Stop a transfer but keep it queued
await manager.Pause("download-1");

// Continue it later
await manager.Resume("download-1");
```

Both are no-ops if the transfer doesn't exist, and `Resume` only acts on a transfer that is currently in a paused state.

### Downloads vs. uploads

- **Downloads** resume from where they left off. The partial file on disk is preserved while paused (it is only deleted by `Cancel`), and the transfer continues via an HTTP `Range` request (or native session resume on Apple).
- **Uploads** are stopped but are **not resumable** in general - resuming an upload **restarts it from the beginning**. The exception is iOS/Mac Catalyst, where the native `NSUrlSessionTask` is suspended and resumed in place.

### Platform support

| Platform | Pause / Resume | Interrupts an in-flight transfer? | Download resumes from partial? | Upload on resume |
|----------|----------------|-----------------------------------|-------------------------------|------------------|
| iOS / Mac Catalyst | ✅ native `NSUrlSessionTask.Suspend()`/`Resume()` | ✅ | ✅ (native background session) | ▶️ resumes in place |
| Android | ✅ | ✅ (foreground-service loop) | ✅ HTTP `Range` | 🔁 restarts |
| Windows | ✅ | ✅ | ✅ HTTP `Range` | 🔁 restarts |
| Linux / macOS / plain .NET | ✅ | ✅ | ✅ HTTP `Range` | 🔁 restarts |
| Blazor WASM | ⚠️ best-effort | ❌ (a running Service Worker `fetch()` cannot be aborted) | ❌ (whole-`Blob` fetch → restarts) | 🔁 restarts |

:::caution[Blazor is best-effort]
On Blazor WASM, transfers are executed by a Service Worker via `fetch()`. `Pause` marks the queued entry so the Service Worker's drain skips it, and `Resume` re-queues it - but a transfer that has **already started** cannot be interrupted (it runs to completion), and because the Service Worker receives a whole response `Blob`, downloads are **not** resumable and restart on resume.
:::

### From the monitor

`HttpTransferMonitor` exposes the same operations, so you can wire pause/resume buttons straight to the bound `HttpTransferObject` (whose `Status` reflects `Paused`):

```csharp
await monitor.Pause(item.Identifier);
await monitor.Resume(item.Identifier);
```
