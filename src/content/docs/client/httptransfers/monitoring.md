---
title: Monitoring
---

## Overview

Monitor transfer progress in real-time using C# events on `IHttpTransferManager`, the awaitable `WatchTransfer` helper, or the `HttpTransferMonitor` collection helper for UI binding. Rx has been removed from `Shiny.Net.Http` — everything is plain `event EventHandler` or `Task`.

## Watching All Transfers

```csharp
IHttpTransferManager manager; // injected

manager.UpdateReceived += (sender, result) =>
{
    Console.WriteLine($"Transfer: {result.Request.Identifier}");
    Console.WriteLine($"Status: {result.Status}");
    Console.WriteLine($"Progress: {result.Progress.PercentComplete:P0}");
    Console.WriteLine($"Speed: {result.Progress.BytesPerSecond} B/s");
    Console.WriteLine($"ETA: {result.Progress.EstimatedTimeRemaining}");
};

// Don't forget to detach the handler on dispose/disappear
// manager.UpdateReceived -= handler;
```

## Watching a Specific Transfer

`WatchTransfer` returns a `Task<HttpTransferResult>` that completes when the transfer reaches `Completed` or `Canceled`, throws on failure, and unhooks internally.

```csharp
try
{
    var result = await manager.WatchTransfer("upload-1");
    Console.WriteLine($"Completed at {result.Progress.PercentComplete:P0}");
}
catch (Exception ex)
{
    Console.WriteLine($"Failed: {ex.Message}");
}
```

## Watching Transfer Count

```csharp
manager.CountChanged += (sender, count) =>
{
    Console.WriteLine($"Active transfers: {count}");
};
```

## HttpTransferResult

| Property | Type | Description |
|----------|------|-------------|
| `Request` | `HttpTransferRequest` | The original request |
| `Status` | `HttpTransferState` | Current transfer state |
| `Progress` | `TransferProgress` | Progress details |
| `Exception` | `Exception?` | Error details if failed |

## TransferProgress

| Property | Type | Description |
|----------|------|-------------|
| `BytesPerSecond` | `long` | Current transfer speed |
| `BytesToTransfer` | `long?` | Total bytes (null if indeterminate) |
| `BytesTransferred` | `long` | Bytes transferred so far |
| `PercentComplete` | `double` | 0-1 range, or -1 if indeterminate |
| `EstimatedTimeRemaining` | `TimeSpan` | Estimated completion time |

## HttpTransferState

| Value | Description |
|-------|-------------|
| `Pending` | Queued, waiting to start |
| `InProgress` | Currently transferring |
| `Paused` | Paused by user/system |
| `PausedByNoNetwork` | Paused due to no network |
| `PausedByCostedNetwork` | Paused due to metered network |
| `Completed` | Successfully completed |
| `Error` | Failed with error |
| `Canceled` | Cancelled by user |

## Managed Transfer Monitor

`HttpTransferMonitor` provides a `BindingList<HttpTransferObject>` ideal for binding to UI. Pass a `SynchronizationContext` to `Start` if you want collection mutations marshalled to the UI thread.

```csharp
HttpTransferMonitor monitor; // injected (registered by AddHttpTransfers)

// Start monitoring on the UI thread
await monitor.Start(
    SynchronizationContext.Current,
    removeFinished: true,
    removeErrors: true,
    removeCancelled: true
);

// Bind to the collection
var transfers = monitor.Transfers; // BindingList<HttpTransferObject>

// Each HttpTransferObject has:
// - Identifier, Uri, Type
// - Status, PercentComplete, BytesPerSecond
// - BytesToTransfer, BytesTransferred
// - EstimatedTimeRemaining, IsDeterministic

// Stop monitoring
monitor.Stop();

// Clear completed/errored transfers from the list
monitor.Clear(removeFinished: true, removeCancelled: true, removeErrors: true);
```
