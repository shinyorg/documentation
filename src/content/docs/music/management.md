---
title: Music Management
---

The `IMusicManager` interface provides custom playlist management and play count tracking, independent of the device's native music library. Data is persisted locally using SQLite via `Shiny.DocumentDb`.

:::note
`IMusicManager` playlists are **app-managed** and stored in SQLite. They are separate from the device playlists returned by `IMediaLibrary.GetPlaylistsAsync()`. Use this when you need full control over playlist creation, editing, and deletion — capabilities not exposed by Android or iOS for third-party apps.
:::

## Setup

Install the `Shiny.Music.Sqlite` NuGet package and register the service:

```csharp
builder.Services.AddShinyMusic();
builder.Services.AddMusicManagementSqlite(); // Registers IMusicManager
```

## Play Counts

Track how many times each song has been played:

```csharp
// Increment after playback starts
await _manager.AddPlayCount(track.Id);

// Read the current count
var count = await _manager.GetPlayCount(track.Id);
Console.WriteLine($"Played {count} times");
```

### Get All Play Counts

```csharp
var counts = await _manager.GetAllPlayCounts();

foreach (var pc in counts)
{
    Console.WriteLine($"Track {pc.TrackId}: {pc.Count} plays");
}
```

## Custom Playlists

### Create a Playlist

```csharp
var playlistId = Guid.NewGuid().ToString();
await _manager.CreatePlaylist(playlistId, "Road Trip");
```

If a playlist with the same ID already exists, its name is updated.

### Add Tracks

```csharp
await _manager.AddTrackToPlaylist(playlistId, track);
```

Adding a track that already exists in the playlist is a no-op.

### Browse Playlists

```csharp
var playlists = await _manager.GetAllPlaylists();

foreach (var p in playlists)
{
    Console.WriteLine($"{p.Name} ({p.SongCount} songs)");
}
```

Returns `PlaylistInfo` records — the same type used by `IMediaLibrary.GetPlaylistsAsync()`.

### Get Playlist Tracks

```csharp
var tracks = await _manager.GetPlaylistTracks(playlistId);

foreach (var track in tracks)
{
    Console.WriteLine($"{track.Title} by {track.Artist}");
}
```

### Remove a Playlist

```csharp
await _manager.RemovePlaylist(playlistId);
```

This removes the playlist and all of its track associations.

## IMusicManager API

| Method | Description |
|---|---|
| `AddPlayCount(trackId)` | Increments the play count for the specified track by one |
| `GetPlayCount(trackId)` | Gets the current play count, or 0 if never played |
| `GetAllPlayCounts()` | Returns all recorded play counts |
| `GetAllPlaylists()` | Returns all custom playlists with track counts |
| `CreatePlaylist(playlistId, name)` | Creates a new playlist or updates an existing one's name |
| `RemovePlaylist(playlistId)` | Removes a playlist and all associated tracks |
| `AddTrackToPlaylist(playlistId, metadata)` | Adds a track to a playlist (no-op if already present) |
| `GetPlaylistTracks(playlistId)` | Gets all tracks in the specified playlist |

## PlayCount

```csharp
public record PlayCount(string TrackId, int Count);
```

| Property | Type | Description |
|---|---|---|
| `TrackId` | `string` | The platform-specific unique identifier for the track |
| `Count` | `int` | The total number of times the track has been played |
