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

## Get Genres

Returns all distinct genre names from the user's music library, sorted alphabetically:

```csharp
var genres = await _library.GetGenresAsync();

foreach (var genre in genres)
{
    Console.WriteLine(genre);
}
```

Tracks with no genre are excluded from the results. On Android, genres are queried from `MediaStore.Audio.Genres`. On iOS, genres are enumerated via `MPMediaQuery.GenresQuery`.

## MusicMetadata

Each track is represented by a `MusicMetadata` record with the following properties:

| Property | Type | Description |
|---|---|---|
| `Id` | `string` | Platform-specific unique identifier. On Android, this is the MediaStore row ID. On iOS, it is the `MPMediaItem` persistent ID. |
| `Title` | `string?` | The track title, or `null` if not available. |
| `Artist` | `string?` | The artist or performer, or `null` if not available. |
| `Album` | `string?` | The album name, or `null` if not available. |
| `Genre` | `string?` | The genre, or `null` if unavailable. |
| `Duration` | `TimeSpan` | The playback duration. |
| `AlbumArtUri` | `string?` | URI to album artwork. Available on Android via MediaStore; `null` on iOS where artwork is accessed through `MPMediaItem.Artwork`. |
| `IsExplicit` | `bool?` | Whether the track is marked as explicit content. iOS only via `MPMediaItem.IsExplicitItem`; always `null` on Android. |
| `ContentUri` | `string` | URI used for playback and file operations. On Android, this is a `content://` URI. On iOS, this is an `ipod-library://` asset URL. **Empty for DRM-protected Apple Music subscription tracks.** |
| `StoreId` | `string?` | Apple Music catalog ID (from `PlayParams.Id`). Enables streaming playback via `MPMusicPlayerController` on iOS. Always `null` on Android. |

## ContentUri, StoreId, and DRM

The `ContentUri` and `StoreId` properties determine what operations are available for a track:

```csharp
var tracks = await _library.GetAllTracksAsync();

foreach (var track in tracks)
{
    if (!string.IsNullOrEmpty(track.ContentUri))
    {
        // Locally synced or purchased track — full access
        Console.WriteLine($"✅ {track.Title} - available for local playback and copy");
    }
    else if (!string.IsNullOrEmpty(track.StoreId))
    {
        // Apple Music subscription track with catalog ID — streaming playback only
        Console.WriteLine($"🎧 {track.Title} - available for streaming playback (no copy)");
    }
    else
    {
        // No playback or copy available
        Console.WriteLine($"⚠️ {track.Title} - not playable or copyable");
    }
}
```

:::note
On Android, `ContentUri` is always populated for all music files. `StoreId` is always `null` on Android. The DRM and streaming distinction only applies to iOS Apple Music subscription tracks.
:::

## Platform Details

### Android
- Tracks are queried from `MediaStore.Audio.Media` via `ContentResolver`.
- Only items flagged as music (`IsMusic != 0`) are returned — ringtones, notifications, podcasts, and videos are excluded.
- Results are sorted alphabetically by title.

### iOS
- Tracks are queried using `MPMediaQuery` from the `MediaPlayer` framework.
- Only items with `MPMediaType.Music` are returned — podcasts, audiobooks, and movies are excluded.
