---
title: Resumable Uploads (tus)
---

## Overview

Ordinary uploads can't continue after an interruption. If the connection drops at 90%, the upload starts again from zero. [tus](https://tus.io) is an open protocol for resumable uploads: the client creates the upload on the server, sends the file with `PATCH` requests, and after any interruption asks the server how many bytes it already has and continues from that offset.

`TusUploadRequest` builds a standard `HttpTransferRequest` of type `TransferType.UploadTus`, so a tus upload is queued, monitored, paused and cancelled like any other transfer. It works with any tus 1.0.0 server that supports the **creation** extension, such as [tusd](https://github.com/tus/tusd), [tusdotnet](https://github.com/tusdotnet/tusdotnet), Uppy Companion, Cloudflare Stream, Vimeo and Supabase Storage.

## Quick Start

```csharp
IHttpTransferManager manager; // injected

var request = new TusUploadRequest("/path/to/video.mp4")
    .WithEndpoint("https://tusd.example.com/files/")
    .WithBearerToken(token)
    .WithMetadata("filetype", "video/mp4")
    .WithChunkSize(5 * 1024 * 1024) // optional
    .Build();

await manager.Queue(request);
```

No extra registration is needed. `AddHttpTransfers<TDelegate>()` / `AddHttpClientTransfers<TDelegate>()` handle tus uploads alongside every other transfer, and `IHttpTransferDelegate.OnCompleted` / `OnError` fire as usual.

## How it works

1. **Create** - `POST` to the endpoint with `Upload-Length` and `Upload-Metadata`. The server's `Location` (resolved if relative) is saved on the transfer (`HttpTransfer.TusUploadUri`), so it survives app restarts.
2. **Send** - `PATCH` the file (or one chunk of it) with `Upload-Offset` and `Content-Type: application/offset+octet-stream`.
3. **Resume** - after a pause, a dropped connection or an app restart, `HEAD` the upload URL to read the server's `Upload-Offset`, then continue sending from there.

Other behaviour:

- A dropped connection **does not fail the transfer**. It moves to `HttpTransferState.PausedByNoNetwork` and continues on its own. HTTP error responses (4xx/5xx) still fail it through `OnError`.
- If the server no longer knows the upload (`404`, `410` or `403` from `HEAD`, usually because it expired), the upload is created again and sent from the beginning.
- A `409 Conflict` (the server's offset differs from the one sent) triggers a `HEAD`, and sending continues from the server's offset.
- User headers (`WithHeader`, `WithBearerToken`) are sent on every tus request. `Tus-Resumable: 1.0.0` is added for you.

## Chunk size

By default the rest of the file goes in a single `PATCH`. The server keeps whatever arrived before an interruption, so nothing is lost. `WithChunkSize(bytes)` caps each `PATCH`. Use it when a proxy or CDN limits request body size (Cloudflare, for example, allows 100 MB), or on iOS to limit how much is copied to a temp file at a time (see below). Smaller chunks cost one round trip each.

## Platform behaviour

| Platform | How it runs |
|----------|-------------|
| Android, Windows, Linux, macOS, plain .NET | The managed `HttpClient` loop (inside the foreground service on Android) runs create, `HEAD` and `PATCH`. Pause interrupts the `PATCH` in flight, and resume continues from the server's offset. |
| iOS / Mac Catalyst / tvOS | Each `PATCH` runs as its own **background `NSURLSession` upload task**, sent from a temp file holding that chunk, so chunks keep uploading while the app is suspended. The `POST`/`HEAD` requests go over `HttpClient`, and when one chunk finishes the next is started. A network error retries after 30 seconds while the app is alive, and on the next app start otherwise. |
| Blazor WebAssembly | Not supported. `Queue` throws `NotSupportedException`, because the Service Worker sends each transfer as one request. |

:::note
On iOS the whole remaining file is copied to a temp file when no chunk size is set. For very large files, set `WithChunkSize` to keep that copy small.
:::

## Cancelling

`Cancel` / `CancelAll` stop the upload and remove the transfer. Shiny does not send a termination `DELETE`, so the server discards the incomplete upload when it expires.

## Builder Methods

| Method | Description |
|--------|-------------|
| `WithEndpoint(uri)` | The server's tus creation endpoint (required) |
| `WithMetadata(key, value)` | Adds an `Upload-Metadata` entry (keys may not contain spaces or commas) |
| `WithoutFileName()` | Stops the local file name being sent as the `filename` metadata entry (sent by default) |
| `WithChunkSize(bytes)` | Caps each `PATCH` at this many bytes |
| `WithHeader(key, value)` | Adds a header sent on every tus request |
| `WithBearerToken(token)` | Shortcut for `Authorization: Bearer {token}` |
| `WithMeteredConnection()` | Allow the upload on metered/cellular networks |

The builder sets `Identifier` to a new GUID unless you set it first.

## Building the request by hand

`TusUploadRequest` is only a convenience. The same transfer can be described directly:

```csharp
var request = new HttpTransferRequest(
    "upload-1",
    "https://tusd.example.com/files/",
    TransferType.UploadTus,
    "/path/to/video.mp4"
)
{
    TusMetadata = new Dictionary<string, string> { ["filename"] = "video.mp4" },
    TusChunkSize = 5 * 1024 * 1024
};
```

`HttpContent` cannot be used with tus uploads. Send extra values as metadata instead.
