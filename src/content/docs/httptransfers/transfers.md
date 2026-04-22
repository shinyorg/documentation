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
