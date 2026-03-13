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

Returns all distinct genre names from the user's music library with track counts, sorted alphabetically:

```csharp
var genres = await _library.GetGenresAsync();

foreach (var genre in genres)
{
    Console.WriteLine($"{genre.Value} ({genre.Count} tracks)");
}
```

Tracks with no genre are excluded from the results. On Android, genres are queried from `MediaStore.Audio.Genres`. On iOS, genres are enumerated via `MPMediaQuery.GenresQuery`.

You can optionally pass a `MusicFilter` to narrow results — for example, genres within a specific decade:

```csharp
var rockGenresIn90s = await _library.GetGenresAsync(new MusicFilter { Decade = 1990 });
```

## Get Years

Returns all distinct release years with track counts, sorted in ascending order:

```csharp
var years = await _library.GetYearsAsync();

foreach (var year in years)
{
    Console.WriteLine($"{year.Value} ({year.Count} tracks)");
}
```

Tracks with no year metadata are excluded. Accepts an optional `MusicFilter`:

```csharp
// Years that have Rock tracks
var rockYears = await _library.GetYearsAsync(new MusicFilter { Genre = "Rock" });
```

## Get Decades

Returns all distinct decades with track counts, sorted in ascending order. Each decade is represented by its starting year (e.g., 1990 for the 1990s):

```csharp
var decades = await _library.GetDecadesAsync();

foreach (var decade in decades)
{
    Console.WriteLine($"{decade.Value}s ({decade.Count} tracks)");
}
```

Accepts an optional `MusicFilter`:

```csharp
// Decades that have Jazz tracks
var jazzDecades = await _library.GetDecadesAsync(new MusicFilter { Genre = "Jazz" });
```

## Filtering with MusicFilter

The `MusicFilter` class lets you combine multiple criteria to query tracks. All specified properties are combined with AND logic.

```csharp
public class MusicFilter
{
    public string? Genre { get; init; }       // Case-insensitive genre match
    public int? Year { get; init; }           // Exact release year
    public int? Decade { get; init; }         // Decade start year (e.g., 1990)
    public string? SearchQuery { get; init; } // Matches title, artist, or album
}
```

:::note
If both `Year` and `Decade` are set, `Year` takes precedence and `Decade` is ignored.
:::

### Get Filtered Tracks

```csharp
// Rock tracks from the 1990s
var tracks = await _library.GetTracksAsync(new MusicFilter
{
    Genre = "Rock",
    Decade = 1990
});

// Tracks from 2015 matching "love"
var tracks2 = await _library.GetTracksAsync(new MusicFilter
{
    Year = 2015,
    SearchQuery = "love"
});
```

### Cross-Dimensional Browsing

The filter parameter on grouping methods enables powerful cross-dimensional queries:

```csharp
// What genres exist in my 1980s music?
var genresIn80s = await _library.GetGenresAsync(new MusicFilter { Decade = 1980 });

// What decades have Rock tracks?
var rockDecades = await _library.GetDecadesAsync(new MusicFilter { Genre = "Rock" });

// What years have Jazz tracks?
var jazzYears = await _library.GetYearsAsync(new MusicFilter { Genre = "Jazz" });

// Genres in a specific year with a search term
var filtered = await _library.GetGenresAsync(new MusicFilter
{
    Year = 2020,
    SearchQuery = "remix"
});
```

## GroupedCount&lt;T&gt;

All grouping methods (`GetGenresAsync`, `GetYearsAsync`, `GetDecadesAsync`) return `IReadOnlyList<GroupedCount<T>>`:

```csharp
public record GroupedCount<T>(T Value, int Count);
```

- `GetGenresAsync` returns `GroupedCount<string>` — the genre name and its track count
- `GetYearsAsync` returns `GroupedCount<int>` — the year and its track count
- `GetDecadesAsync` returns `GroupedCount<int>` — the decade start year and its track count

## Playlists

### Get All Playlists

Returns all playlists from the device music library with their song counts, sorted alphabetically:

```csharp
var playlists = await _library.GetPlaylistsAsync();

foreach (var playlist in playlists)
{
    Console.WriteLine($"{playlist.Name} ({playlist.SongCount} songs)");
}
```

On Android, playlists are queried from `MediaStore.Audio.Playlists`. On iOS, playlists are queried via `MPMediaQuery.PlaylistsQuery`.

### Get Playlist Tracks

Returns all tracks in a specific playlist, in playlist order:

```csharp
var playlists = await _library.GetPlaylistsAsync();
var tracks = await _library.GetPlaylistTracksAsync(playlists[0].Id);

foreach (var track in tracks)
{
    Console.WriteLine($"{track.Title} by {track.Artist}");
}
```

The `playlistId` parameter is the platform-specific identifier from `PlaylistInfo.Id`.

### PlaylistInfo

Each playlist is represented by a `PlaylistInfo` record:

| Property | Type | Description |
|---|---|---|
| `Id` | `string` | Platform-specific unique identifier. On Android, this is the MediaStore playlist row ID. On iOS, it is the persistent ID. |
| `Name` | `string` | The display name of the playlist. |
| `SongCount` | `int` | The number of tracks in the playlist. |

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
| `Year` | `int?` | The release year of the track. On Android from `MediaStore.Audio.Media.YEAR`; on iOS from `MPMediaItem.ReleaseDate`. `null` if unavailable. |

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
