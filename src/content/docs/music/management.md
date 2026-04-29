---
title: Playlist Management
---

The `IMediaLibrary` interface provides methods to create, remove, and manage playlists and their tracks.

- **iOS**: Playlist operations use MusicKit's `MusicLibrary.Shared` to create and modify real Apple Music playlists that sync across the user's devices.
- **Android**: Playlist operations manage locally-stored custom playlists persisted as JSON. These are merged with platform MediaStore playlists when calling `GetPlaylistsAsync()`.

## Create a Playlist

```csharp
var playlist = await _library.CreatePlaylistAsync("Road Trip");
Console.WriteLine($"Created: {playlist.Name} (ID: {playlist.Id})");
```

Returns a `PlaylistInfo` with the new playlist's ID, name, and song count (initially 0).

## Add Tracks

```csharp
await _library.AddTrackToPlaylistAsync(playlist.Id, track);
```

Adding a track that already exists in the playlist is a no-op.

## Browse Playlists

```csharp
var playlists = await _library.GetPlaylistsAsync();

foreach (var p in playlists)
{
    Console.WriteLine($"{p.Name} ({p.SongCount} songs)");
}
```

On Android, this returns both platform MediaStore playlists and custom playlists, sorted alphabetically. On iOS, this returns all playlists from the user's Apple Music library.

## Get Playlist Tracks

```csharp
var tracks = await _library.GetPlaylistTracksAsync(playlist.Id);

foreach (var track in tracks)
{
    Console.WriteLine($"{track.Title} by {track.Artist}");
}
```

## Remove a Track from a Playlist

```csharp
await _library.RemoveTrackFromPlaylistAsync(playlist.Id, track.Id);
```

## Remove a Playlist

```csharp
await _library.RemovePlaylistAsync(playlist.Id);
```

On iOS, this deletes the playlist from the user's Apple Music library. On Android, this removes it from the local JSON store.

## Playlist CRUD API

| Method | Description |
|---|---|
| `CreatePlaylistAsync(name)` | Creates a new playlist and returns its `PlaylistInfo` |
| `RemovePlaylistAsync(playlistId)` | Removes a playlist |
| `AddTrackToPlaylistAsync(playlistId, track)` | Adds a track to a playlist (no-op if already present) |
| `RemoveTrackFromPlaylistAsync(playlistId, trackId)` | Removes a track from a playlist |
| `GetPlaylistsAsync()` | Returns all playlists (including custom playlists on Android) |
| `GetPlaylistTracksAsync(playlistId)` | Returns all tracks in a playlist |

## PlaylistInfo

```csharp
public record PlaylistInfo(string Id, string Name, int SongCount);
```

| Property | Type | Description |
|---|---|---|
| `Id` | `string` | Platform-specific unique identifier. On Android, MediaStore row ID or `custom:` prefixed ID for custom playlists. On iOS, MusicKit playlist ID. |
| `Name` | `string` | The display name of the playlist. |
| `SongCount` | `int` | The number of tracks in the playlist. |

## Play Counts

Play counts are tracked automatically and available on `MusicMetadata.PlayCount`:

- **iOS**: MusicKit reports plays to Apple Music automatically when using `ApplicationMusicPlayer`. The `PlayCount` on `MusicMetadata` comes from `Song.PlayCount`.
- **Android**: Play counts are incremented internally when `IMusicPlayer.PlayAsync` is called, stored in a local JSON file. The `PlayCount` is merged into `MusicMetadata` when querying tracks.

```csharp
var tracks = await _library.GetAllTracksAsync();
foreach (var track in tracks)
{
    Console.WriteLine($"{track.Title}: played {track.PlayCount} times");
}
```

There is no public API to manually increment play counts — they are managed internally by the player.
