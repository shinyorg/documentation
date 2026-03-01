---
title: Playback
---

The `IMusicPlayer` interface provides full playback control for music tracks from the device library.

## Playing a Track

```csharp
var tracks = await _library.GetAllTracksAsync();
await _player.PlayAsync(tracks[0]);
```

Calling `PlayAsync` stops any currently playing track, loads the new one, and begins playback immediately.

:::caution
`PlayAsync` will throw an `InvalidOperationException` if the track's `ContentUri` is empty (DRM-protected on iOS) or if the platform player fails to initialize. Always check `ContentUri` before playing.
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
- Playback uses `AVFoundation.AVAudioPlayer` with the track's `ipod-library://` asset URL.
- The `AVAudioSession` category is set to `Playback` to support background audio (if configured).
- Seeking uses second precision.

:::note
Music library access requires a **physical device**. Simulators and emulators typically have no music content and cannot test playback.
:::
