---
title: Azure Blob Storage Uploads
---

## Overview

Shiny HTTP Transfers includes a built-in fluent builder for uploading files to Azure Blob Storage. The `AzureBlobStorageUploadRequest` handles all Azure-specific headers and authentication, producing a standard `HttpTransferRequest` that runs as a background transfer.

## Quick Start

```csharp
IHttpTransferManager manager; // injected

var request = new AzureBlobStorageUploadRequest("/path/to/file.pdf")
    .WithBlobContainer("myaccount", "mycontainer")
    .WithSasToken("sv=2023-01-01&ss=b&srt=o&sp=w&se=2026-12-31&sig=...")
    .Build();

await manager.Queue(request);
```

## Authentication

Azure Blob Storage supports two authentication methods.

### SAS Token (Recommended)

A Shared Access Signature provides scoped, time-limited access without exposing your storage account key.

```csharp
var request = new AzureBlobStorageUploadRequest("/path/to/file.pdf")
    .WithBlobContainer("myaccount", "mycontainer")
    .WithSasToken("sv=2023-01-01&ss=b&srt=o&sp=w&se=2026-12-31&sig=abc123")
    .Build();
```

The SAS token is appended as a query string to the blob URL.

### Shared Key

For server-side or trusted environments where the storage key is available.

```csharp
var request = new AzureBlobStorageUploadRequest("/path/to/file.pdf")
    .WithBlobContainer("myaccount", "mycontainer")
    .WithSharedKeyAuthorization("your-shared-key")
    .Build();
```

This adds `Authorization`, `x-ms-date`, and `x-ms-version` headers automatically.

## Builder Methods

| Method | Description |
|--------|-------------|
| `WithBlobContainer(tenant, container)` | Sets the URI to `https://{tenant}.blob.core.windows.net/{container}` |
| `WithCustomUri(uri)` | Use a custom Azure endpoint URL |
| `WithSasToken(token)` | Authenticate with a SAS token |
| `WithSharedKeyAuthorization(key, version?, date?)` | Authenticate with a shared key |
| `WithRemoteFileName(name)` | Set the blob name (defaults to local filename) |
| `WithMeteredConnection()` | Allow upload on metered/cellular networks |
| `WithHeader(key, value)` | Add a custom HTTP header |

## Builder Properties

| Property | Type | Description |
|----------|------|-------------|
| `LocalFilePath` | `string` | Path to the file being uploaded |
| `Identifier` | `string?` | Transfer identifier (auto-generated if not set) |
| `Uri` | `string?` | Target blob URL |
| `RemoteFileName` | `string?` | Blob name (defaults to local filename) |
| `UseMeteredConnection` | `bool` | Allow metered network transfers |
| `Headers` | `Dictionary<string, string>` | Custom headers |

## Auto-Generated Headers

When `Build()` is called, these headers are automatically set:

| Header | Value |
|--------|-------|
| `Content-Length` | File size in bytes |
| `x-ms-blob-type` | `BlockBlob` |
| `Content-Disposition` | `attachment; filename="{name}"` |

## Full Example

```csharp
IHttpTransferManager manager; // injected

var builder = new AzureBlobStorageUploadRequest("/path/to/photo.jpg")
    .WithBlobContainer("mystorageaccount", "uploads")
    .WithSasToken("sv=2023-01-01&ss=b&srt=o&sp=w&se=2026-12-31&sig=abc123")
    .WithRemoteFileName("photos/vacation.jpg")
    .WithMeteredConnection();

var request = builder.Build();
var transfer = await manager.Queue(request);
```

:::tip
Combine Azure uploads with `HttpTransferDelegate` to automatically refresh SAS tokens when they expire. Override `OnAuthorizationFailed` to generate a new token and return an updated request. See the [Delegate](./delegate) documentation for details.
:::

## Refreshing Expired SAS Tokens

Use `HttpTransferDelegate` to handle token expiration during long uploads.

```csharp
public partial class MyTransferDelegate(
    ILogger<MyTransferDelegate> logger,
    IHttpTransferManager manager,
    ISasTokenService tokenService
) : HttpTransferDelegate(logger, manager, maxErrorRetries: 3)
{
    protected override async Task<HttpTransferRequest?> OnAuthorizationFailed(
        HttpTransferRequest request,
        int retries
    )
    {
        if (retries > 3)
            return null; // give up

        var newToken = await tokenService.GetFreshSasTokenAsync();
        // Rebuild the URI with the new token
        var baseUri = request.Uri.Split('?')[0];
        return request with { Uri = $"{baseUri}?{newToken}" };
    }
}
```
