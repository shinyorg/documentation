---
title: Querying Music
---

The `IMediaLibrary` interface provides methods to retrieve music metadata from the device library.

## Get All Tracks

Returns every music track on the device:

```csharp
var tracks = await _library.GetAllTracksAsync();

foreach (var track in tracks)
{
    Console.WriteLine($"{track.Title} by {track.Artist} ({track.Duration:mm\\:ss})");
}
```

## Search Tracks

Search by title, artist, or album name:

```csharp
var results = await _library.SearchTracksAsync("beethoven");

foreach (var track in results)
{
    Console.WriteLine($"{track.Title} - {track.Album}");
}
```

The search is case-insensitive and matches partial strings against the title, artist, and album fields.

## MusicMetadata

Each track is represented by a `MusicMetadata` record with the following properties:

| Property | Type | Description |
|---|---|---|
| `Id` | `string` | Platform-specific unique identifier. On Android, this is the MediaStore row ID. On iOS, it is the `MPMediaItem` persistent ID. |
| `Title` | `string` | The track title. |
| `Artist` | `string` | The artist or performer. |
| `Album` | `string` | The album name. |
| `Genre` | `string?` | The genre, or `null` if unavailable. |
| `Duration` | `TimeSpan` | The playback duration. |
| `AlbumArtUri` | `string?` | URI to album artwork. Available on Android via MediaStore; `null` on iOS where artwork is accessed through `MPMediaItem.Artwork`. |
| `ContentUri` | `string` | URI used for playback and file operations. On Android, this is a `content://` URI. On iOS, this is an `ipod-library://` asset URL. **Empty for DRM-protected Apple Music subscription tracks.** |

## ContentUri and DRM

The `ContentUri` property is critical for understanding what operations are available for a track:

```csharp
var tracks = await _library.GetAllTracksAsync();

foreach (var track in tracks)
{
    if (string.IsNullOrEmpty(track.ContentUri))
    {
        // DRM-protected Apple Music track
        // Cannot be played via AVAudioPlayer or copied
        Console.WriteLine($"⚠️ {track.Title} - DRM protected, playback/copy unavailable");
    }
    else
    {
        // Locally synced or purchased track — full access
        Console.WriteLine($"✅ {track.Title} - available for playback and copy");
    }
}
```

:::note
On Android, `ContentUri` is always populated for all music files. The DRM limitation only applies to iOS Apple Music subscription tracks.
:::

## Platform Details

### Android
- Tracks are queried from `MediaStore.Audio.Media` via `ContentResolver`.
- Only items flagged as music (`IsMusic != 0`) are returned — ringtones, notifications, podcasts, and videos are excluded.
- Results are sorted alphabetically by title.

### iOS
- Tracks are queried using `MPMediaQuery` from the `MediaPlayer` framework.
- Only items with `MPMediaType.Music` are returned — podcasts, audiobooks, and movies are excluded.
