---
title: Playback
---

The `IMusicPlayer` interface provides full playback control for music tracks from the device library.

On iOS, the player supports two modes that are automatically selected based on the track's properties:
- **Local playback** via `AVPlayer` when `ContentUri` is available (purchased/synced tracks)
- **Streaming playback** via `MPMusicPlayerController.SystemMusicPlayer` when `StoreId` is available (Apple Music subscription tracks)

## Playing a Track

```csharp
var tracks = await _library.GetAllTracksAsync();
await _player.PlayAsync(tracks[0]);
```

Calling `PlayAsync` stops any currently playing track, loads the new one, and begins playback immediately. The player automatically selects the appropriate playback engine based on whether `StoreId` or `ContentUri` is available.

:::caution
`PlayAsync` will throw an `InvalidOperationException` if both `ContentUri` and `StoreId` are empty, or if the platform player fails to initialize.
:::

## Pause, Resume, and Stop

```csharp
// Pause the current track
_player.Pause();

// Resume from where it was paused
_player.Resume();

// Stop completely — releases the track
_player.Stop();
```

- `Pause()` has no effect if the player is not in the `Playing` state.
- `Resume()` has no effect if the player is not in the `Paused` state.
- `Stop()` returns the player to the `Stopped` state and releases the current track.

## Seeking

```csharp
// Seek to 1 minute 30 seconds
_player.Seek(TimeSpan.FromMinutes(1.5));
```

## Reading Playback State

```csharp
// Current state: Stopped, Playing, or Paused
PlaybackState state = _player.State;

// Currently loaded track (null if stopped)
MusicMetadata? track = _player.CurrentTrack;

// Current position and total duration
TimeSpan position = _player.Position;
TimeSpan duration = _player.Duration;
```

## Events

### StateChanged

Raised whenever the playback state transitions:

```csharp
_player.StateChanged += (sender, newState) =>
{
    Console.WriteLine($"Playback state: {newState}");
    // e.g., Playing → Paused, Paused → Playing, Playing → Stopped
};
```

### PlaybackCompleted

Raised when a track finishes playing naturally (i.e., reaches the end). This is **not** raised when you call `Stop()` manually.

```csharp
_player.PlaybackCompleted += (sender, args) =>
{
    Console.WriteLine("Track finished — play the next one?");
};
```

## Disposing

`IMusicPlayer` implements `IDisposable`. Call `Dispose()` to stop playback and release all platform resources:

```csharp
_player.Dispose();
```

If you register the player as a singleton in DI, it will be disposed when the app shuts down.

## Platform Details

### Android
- Playback uses `Android.Media.MediaPlayer` with content URIs from MediaStore.
- Audio attributes are set to `ContentType.Music` with `Usage.Media`.
- Seeking uses millisecond precision.

### iOS
- **Local tracks** (with `ContentUri`): Playback uses `AVPlayer` with the track's `ipod-library://` asset URL. The `AVAudioSession` category is set to `Playback` to support background audio (if configured). Seeking uses second precision.
- **Streaming tracks** (with `StoreId`): Playback uses `MPMusicPlayerController.SystemMusicPlayer` with the Apple Music catalog ID. This enables playback of DRM-protected Apple Music subscription content. The system player manages its own audio session.

:::note
Music library access requires a **physical device**. Simulators and emulators typically have no music content and cannot test playback.
:::
