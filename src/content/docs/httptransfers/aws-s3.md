---
title: AWS S3 Uploads
---

## Overview

Shiny HTTP Transfers includes a built-in fluent builder for uploading files to AWS S3. The `AwsS3UploadRequest` handles all S3-specific headers and AWS Signature V4 authentication using only `HttpClient` and `System.Security.Cryptography` — no AWS SDK required. It produces a standard `HttpTransferRequest` that runs as a background transfer.

## Quick Start

```csharp
IHttpTransferManager manager; // injected

var request = new AwsS3UploadRequest("/path/to/file.pdf")
    .WithBucket("my-bucket", "us-east-1")
    .WithCredentials(accessKeyId, secretAccessKey)
    .Build();

await manager.Queue(request);
```

## Authentication

AWS S3 supports two authentication methods.

### Presigned URL (Recommended for Mobile)

A presigned URL provides scoped, time-limited access without exposing your AWS credentials on the device. Generate it server-side, then pass it to the client.

```csharp
var request = new AwsS3UploadRequest("/path/to/file.pdf")
    .WithPresignedUrl("https://my-bucket.s3.us-east-1.amazonaws.com/file.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&...")
    .Build();
```

### IAM Credentials (Signature V4)

For server-side or trusted environments where AWS credentials are available. Supports temporary credentials via session tokens (e.g. from STS AssumeRole).

```csharp
var request = new AwsS3UploadRequest("/path/to/file.pdf")
    .WithBucket("my-bucket", "us-east-1")
    .WithCredentials(accessKeyId, secretAccessKey, sessionToken)
    .Build();
```

This computes the full AWS Signature V4 authorization header using `UNSIGNED-PAYLOAD`, so large files don't need to be hashed upfront.

## Builder Methods

| Method | Description |
|--------|-------------|
| `WithBucket(bucket, region)` | Sets the URI to `https://{bucket}.s3.{region}.amazonaws.com/{key}` |
| `WithObjectKey(key)` | Set the S3 object key (defaults to local filename) |
| `WithCustomUri(uri)` | Use a custom endpoint (e.g. MinIO, LocalStack, S3-compatible services) |
| `WithPresignedUrl(url)` | Authenticate with a presigned URL |
| `WithCredentials(accessKey, secretKey, sessionToken?)` | Authenticate with IAM credentials (Signature V4) |
| `WithContentType(type)` | Set the Content-Type header (defaults to `application/octet-stream`) |
| `WithStorageClass(class)` | Set the storage class (e.g. `STANDARD_IA`, `GLACIER`, `INTELLIGENT_TIERING`) |
| `WithMeteredConnection()` | Allow upload on metered/cellular networks |
| `WithHeader(key, value)` | Add a custom HTTP header |

## Builder Properties

| Property | Type | Description |
|----------|------|-------------|
| `LocalFilePath` | `string` | Path to the file being uploaded |
| `Identifier` | `string?` | Transfer identifier (auto-generated if not set) |
| `BucketName` | `string?` | S3 bucket name |
| `Region` | `string?` | AWS region (e.g. `us-east-1`) |
| `ObjectKey` | `string?` | S3 object key (defaults to local filename) |
| `UseMeteredConnection` | `bool` | Allow metered network transfers |
| `Headers` | `Dictionary<string, string>` | Custom headers |

## Auto-Generated Headers (Signature V4)

When using `WithCredentials()`, `Build()` automatically sets these headers:

| Header | Value |
|--------|-------|
| `Host` | `{bucket}.s3.{region}.amazonaws.com` |
| `x-amz-date` | Current UTC timestamp in ISO 8601 basic format |
| `x-amz-content-sha256` | `UNSIGNED-PAYLOAD` |
| `Content-Length` | File size in bytes |
| `Content-Type` | MIME type (default: `application/octet-stream`) |
| `x-amz-security-token` | Session token (only if provided) |
| `x-amz-storage-class` | Storage class (only if provided) |
| `Authorization` | `AWS4-HMAC-SHA256 Credential=.../s3/aws4_request, SignedHeaders=..., Signature=...` |

## Full Example

```csharp
IHttpTransferManager manager; // injected

var request = new AwsS3UploadRequest("/path/to/photo.jpg")
    .WithBucket("my-uploads-bucket", "eu-west-1")
    .WithObjectKey("photos/2026/vacation.jpg")
    .WithCredentials(accessKeyId, secretAccessKey, sessionToken)
    .WithContentType("image/jpeg")
    .WithStorageClass("STANDARD_IA")
    .WithMeteredConnection()
    .Build();

var transfer = await manager.Queue(request);
```

:::tip
Combine S3 uploads with `HttpTransferDelegate` to automatically refresh temporary credentials when they expire. Override `OnAuthorizationFailed` to call STS for new credentials and return an updated request. See the [Delegate](./delegate) documentation for details.
:::

## Refreshing Expired Credentials

Use `HttpTransferDelegate` to handle credential expiration during long uploads.

```csharp
public partial class MyTransferDelegate(
    ILogger<MyTransferDelegate> logger,
    IHttpTransferManager manager,
    IAwsCredentialService credentialService
) : HttpTransferDelegate(logger, manager, maxErrorRetries: 3)
{
    protected override async Task<HttpTransferRequest?> OnAuthorizationFailed(
        HttpTransferRequest request,
        int retries
    )
    {
        if (retries > 3)
            return null; // give up

        var creds = await credentialService.GetFreshCredentialsAsync();

        // Rebuild the request with fresh credentials
        return new AwsS3UploadRequest(request.LocalFilePath)
            .WithBucket("my-bucket", "us-east-1")
            .WithObjectKey(request.Uri.Split('/').Last())
            .WithCredentials(creds.AccessKeyId, creds.SecretAccessKey, creds.SessionToken)
            .Build();
    }
}
```

## S3-Compatible Services

The `WithCustomUri()` method supports S3-compatible services like MinIO, LocalStack, or DigitalOcean Spaces.

```csharp
var request = new AwsS3UploadRequest("/path/to/file.pdf")
    .WithCustomUri("https://minio.local:9000/my-bucket/file.pdf")
    .WithBucket("my-bucket", "us-east-1")
    .WithCredentials(accessKeyId, secretAccessKey)
    .Build();
```
