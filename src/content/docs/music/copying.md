---
title: Copying Tracks
---

The `IMediaLibrary.CopyTrackAsync` method allows you to copy a music file from the device library to your app's storage.

## Basic Usage

```csharp
var destPath = Path.Combine(FileSystem.AppDataDirectory, "CopiedMusic", "track.m4a");
var success = await _library.CopyTrackAsync(track, destPath);

if (success)
    Console.WriteLine($"Copied to {destPath}");
else
    Console.WriteLine("Copy failed — track may be DRM-protected");
```

The method creates any missing parent directories automatically.

## Checking if a Track Can Be Copied

Before attempting to copy, check whether the track has a valid `ContentUri`:

```csharp
if (string.IsNullOrEmpty(track.ContentUri))
{
    // DRM-protected — cannot be copied (iOS only)
    Console.WriteLine("This track cannot be copied.");
    return;
}

var success = await _library.CopyTrackAsync(track, destinationPath);
```

## Platform Behavior

### Android

- Copies are performed by reading from the `ContentResolver` input stream and writing to the destination file.
- All locally stored music files can be copied.
- The copied file retains its original format (MP3, M4A, OGG, etc.).

### iOS

- Copies are performed using `AVAssetExportSession` with the `AppleM4A` preset.
- The exported file is always in **M4A format** regardless of the original encoding.
- **DRM restrictions apply**:

| Track Source | Can Copy? | Notes |
|---|---|---|
| iTunes purchases (DRM-free) | ✅ | Full access via `AssetURL` |
| Locally synced from computer | ✅ | Full access via `AssetURL` |
| Apple Music subscription | ❌ | `AssetURL` is `null`; track is DRM-protected |
| iTunes Match (cloud) | ⚠️ | Only if downloaded to device |

:::caution
Apple Music subscription tracks are DRM-protected and expose no `AssetURL`. The `ContentUri` in `MusicMetadata` will be empty for these tracks, and `CopyTrackAsync` will return `false`. This is an iOS platform limitation that cannot be worked around.
:::

## Error Handling

`CopyTrackAsync` returns `false` rather than throwing for expected failures (DRM, missing asset). Unexpected I/O errors are also caught and return `false`:

```csharp
try
{
    var success = await _library.CopyTrackAsync(track, destPath);
    if (!success)
    {
        // DRM-protected or export failed
        await DisplayAlertAsync("Error", "Cannot copy this track.", "OK");
    }
}
catch (Exception ex)
{
    // Unexpected error (e.g., permissions revoked mid-operation)
    await DisplayAlertAsync("Error", $"Error: {ex.Message}", "OK");
}
```
