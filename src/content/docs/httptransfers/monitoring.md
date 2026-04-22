---
title: Monitoring
---

## Overview

Monitor transfer progress in real-time using observables or the managed monitor for UI binding.

## Watching All Transfers

```csharp
IHttpTransferManager manager; // injected

manager
    .WhenUpdateReceived()
    .Subscribe(result =>
    {
        Console.WriteLine($"Transfer: {result.Request.Identifier}");
        Console.WriteLine($"Status: {result.Status}");
        Console.WriteLine($"Progress: {result.Progress.PercentComplete:P0}");
        Console.WriteLine($"Speed: {result.Progress.BytesPerSecond} B/s");
        Console.WriteLine($"ETA: {result.Progress.EstimatedTimeRemaining}");
    });
```

## Watching a Specific Transfer

```csharp
manager
    .WatchTransfer("upload-1")
    .Subscribe(
        result =>
        {
            Console.WriteLine($"Progress: {result.Progress.PercentComplete:P0}");
        },
        error =>
        {
            Console.WriteLine($"Failed: {error.Message}");
        },
        () =>
        {
            Console.WriteLine("Transfer completed!");
        }
    );
```

## Watching Transfer Count

```csharp
manager
    .WatchCount()
    .Subscribe(count =>
    {
        Console.WriteLine($"Active transfers: {count}");
    });
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

`HttpTransferMonitor` provides an observable collection ideal for binding to UI.

```csharp
HttpTransferMonitor monitor; // injected (registered by AddHttpTransfers)

// Start monitoring
await monitor.Start(
    removeFinished: true,
    removeErrors: true,
    removeCancelled: true
);

// Bind to the collection
var transfers = monitor.Transfers; // INotifyReadOnlyCollection<HttpTransferObject>

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
