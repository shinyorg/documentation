---
title: Transfer Delegate
---

## Overview

The `HttpTransferDelegate` abstract class extends `IHttpTransferDelegate` with built-in error retry logic and authorization refresh handling. It provides a structured way to handle transfer failures without writing manual retry loops.

## Basic Setup

```csharp
public partial class MyTransferDelegate(
    ILogger<MyTransferDelegate> logger,
    IHttpTransferManager manager
) : HttpTransferDelegate(logger, manager, maxErrorRetries: 3)
{
    public override Task OnCompleted(HttpTransferRequest request)
    {
        logger.LogInformation("Transfer completed: {Id}", request.Identifier);
        return Task.CompletedTask;
    }
}
```

Register it the same way as `IHttpTransferDelegate`:

```csharp
services.AddHttpTransfers<MyTransferDelegate>();
```

## Constructor Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `logger` | `ILogger` | required | Logger for structured logging |
| `manager` | `IHttpTransferManager` | required | Transfer manager for re-queuing retries |
| `maxErrorRetries` | `int` | `0` | Maximum retry attempts for non-auth errors |

## Error Retries

Override `OnBeforeRetry` to control behavior before each retry attempt. Return `null` to cancel the retry.

```csharp
public partial class MyTransferDelegate(
    ILogger<MyTransferDelegate> logger,
    IHttpTransferManager manager
) : HttpTransferDelegate(logger, manager, maxErrorRetries: 5)
{
    protected override Task<HttpTransferRequest?> OnBeforeRetry(
        HttpTransferRequest request,
        int retries
    )
    {
        logger.LogWarning("Retry attempt {Attempt} for {Id}", retries, request.Identifier);
        // Return the request to proceed with the retry
        // Return null to cancel
        return Task.FromResult<HttpTransferRequest?>(request);
    }
}
```

The retry flow:
1. Transfer fails with a non-401 status code
2. If `retries < MaxErrorRetryAttempts`, `OnBeforeRetry` is called
3. If it returns a request, the transfer is re-queued
4. If it returns `null` or max retries exceeded, the transfer stops

## Authorization Refresh

Override `OnAuthorizationFailed` to handle 401 Unauthorized responses. This is useful for refreshing expired tokens or rotating credentials. Auth retries are tracked independently from error retries and have no maximum limit.

```csharp
public partial class MyTransferDelegate(
    ILogger<MyTransferDelegate> logger,
    IHttpTransferManager manager,
    IAuthService authService
) : HttpTransferDelegate(logger, manager, maxErrorRetries: 3)
{
    protected override async Task<HttpTransferRequest?> OnAuthorizationFailed(
        HttpTransferRequest request,
        int retries
    )
    {
        if (retries > 3)
            return null; // stop trying

        var newToken = await authService.RefreshTokenAsync();
        var headers = request.Headers ?? new Dictionary<string, string>();
        headers["Authorization"] = $"Bearer {newToken}";

        return request with { Headers = headers };
    }
}
```

The authorization flow:
1. Transfer fails with HTTP 401
2. `OnAuthorizationFailed` is called with the request and retry count
3. If it returns a modified request, the transfer is re-queued with new credentials
4. If it returns `null`, the transfer stops

## Request Mutation

Both `OnBeforeRetry` and `OnAuthorizationFailed` receive the failed request and can return a modified copy. Since `HttpTransferRequest` is a record, use the `with` expression to create modified copies.

```csharp
// Change the target URL
return request with { Uri = "https://backup-server.com/upload" };

// Update headers
var headers = request.Headers ?? new Dictionary<string, string>();
headers["Authorization"] = $"Bearer {newToken}";
return request with { Headers = headers };
```

## Retry State Tracking

The delegate tracks retry counts using internal headers on the request:
- **Error retries** are incremented on each non-401 failure
- **Auth retries** are incremented on each 401 failure
- Both counters are independent of each other

## Structured Logging

All error handling includes a logging scope with full context:

| Scope Key | Description |
|-----------|-------------|
| `RequestId` | Transfer identifier |
| `Uri` | Target URL |
| `Method` | HTTP method |
| `Type` | Transfer type |
| `HttpStatusCode` | Response status code |
| `ErrorRetries` | Current error retry count |
| `AuthRetries` | Current auth retry count |

## Android Foreground Service

On Android, `HttpTransferDelegate` also implements `IAndroidForegroundServiceDelegate`. You must provide the foreground service notification configuration.

```csharp
#if ANDROID
public partial class MyTransferDelegate : IAndroidForegroundServiceDelegate
{
    public void Configure(AndroidX.Core.App.NotificationCompat.Builder builder)
    {
        builder
            .SetContentTitle("My App")
            .SetContentText("Transferring files...")
            .SetSmallIcon(Resource.Mipmap.appicon);
    }
}
#endif
```

## Full Example

```csharp
public partial class MyTransferDelegate(
    ILogger<MyTransferDelegate> logger,
    IHttpTransferManager manager,
    IAuthService authService
) : HttpTransferDelegate(logger, manager, maxErrorRetries: 3)
{
    protected override async Task<HttpTransferRequest?> OnAuthorizationFailed(
        HttpTransferRequest request,
        int retries
    )
    {
        if (retries > 5)
            return null;

        var token = await authService.RefreshTokenAsync();
        var headers = request.Headers ?? new Dictionary<string, string>();
        headers["Authorization"] = $"Bearer {token}";
        return request with { Headers = headers };
    }

    protected override Task<HttpTransferRequest?> OnBeforeRetry(
        HttpTransferRequest request,
        int retries
    )
    {
        // Allow all retries up to the max
        return Task.FromResult<HttpTransferRequest?>(request);
    }

    public override Task OnCompleted(HttpTransferRequest request)
    {
        logger.LogInformation("Transfer completed: {Id}", request.Identifier);
        return Task.CompletedTask;
    }
}

#if ANDROID
public partial class MyTransferDelegate
{
    public override void Configure(AndroidX.Core.App.NotificationCompat.Builder builder)
    {
        builder
            .SetContentTitle("File Transfer")
            .SetContentText("Uploading...")
            .SetSmallIcon(Resource.Mipmap.appicon);
    }
}
#endif
```
