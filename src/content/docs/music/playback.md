---
title: Playback
---

The `IMusicPlayer` interface provides full playback control for music tracks from the device library.

On iOS, the player supports two modes that are automatically selected based on the track's properties:
- **Local playback** via `AVAudioPlayer` when `ContentUri` is available (purchased/synced tracks)
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

## Ducking

Ducking temporarily lowers the currently playing music so an announcement — a text-to-speech prompt, a navigation callout, an alert — can be heard clearly over top. `Duck` returns an `IAsyncDisposable` **scope**: the music stays ducked until the scope is disposed, at which point full volume is restored. Wrap the announcement in an `await using` block:

```csharp
await using (_player.Duck(new DuckOptions { Level = 0.2 }))
{
    await TextToSpeech.Default.SpeakAsync("Turn left in 200 meters");
}
// music ramps back to full volume here
```

If nothing is playing, `Duck` returns a harmless no-op scope, so it is always safe to call. Check `_player.IsDucked` to know whether a duck is currently active.

### DuckOptions

```csharp
var options = new DuckOptions
{
    Level = 0.2,                              // target volume (0.0–1.0) while ducked
    FadeIn = TimeSpan.FromMilliseconds(200),  // ramp-down when ducking starts
    FadeOut = TimeSpan.FromMilliseconds(200)  // ramp-up when the scope is disposed
};
```

Passing `null` (or omitting the argument) uses these defaults — 20% level with 200ms fades.

### One duck at a time

Only a single duck is ever active. While one is active, a further `Duck` call returns a harmless **no-op scope** — the existing duck is *not* superseded and keeps running until its own scope is disposed. Dispose the active scope to restore full volume. Enforcing a single duck avoids a superseded duck's restore-fade racing the new duck on the shared volume, which could otherwise leave the music stuck at a lowered level.

:::note
On Apple platforms, `Level` and the fade durations are advisory — the OS controls the duck depth and ramp. On Android they are applied exactly. See [Platform Details](#platform-details) below.
:::

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

## Volume

`Volume` is the **device-wide system media volume**, normalized `0.0`–`1.0`, independent of any active duck. **Reading works on every platform. Setting is Android-only** — always guard with `IsVolumeControlSupported`:

```csharp
// Read anywhere
float level = _player.Volume;

// Set only where supported (Android). On Apple the setter throws NotSupportedException.
if (_player.IsVolumeControlSupported)
    _player.Volume = 0.5f;
```

Setting `Volume` on iOS or Mac Catalyst throws `NotSupportedException`: Apple exposes no supported API to change the system volume (`MPMusicPlayerController.Volume` was deprecated in iOS 7 and is a no-op). On those platforms, let the user adjust volume with the hardware buttons or an `MPVolumeView`. `IsVolumeControlSupported` returns `true` on Android and `false` on Apple platforms.

:::caution
On Android the system music stream is integer-stepped (e.g. 0–15), so a value you set is quantized to the nearest step, and reading `Volume` back can differ slightly from what you assigned.
:::

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

### VolumeChanged

Raised when the device media volume changes — via the hardware volume buttons, Control Center, or a successful `Volume` set. The argument is the new volume normalized `0.0`–`1.0`:

```csharp
_player.VolumeChanged += (sender, volume) =>
{
    Console.WriteLine($"Volume is now {volume:P0}");
};
```

On Android this observes the system music-stream volume; on Apple platforms it comes from KVO on the audio session's output volume.

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
- **Ducking** lowers this player's own track, honoring `DuckOptions.Level`, `FadeIn`, and `FadeOut` exactly.
- **Volume** reads and writes the system `STREAM_MUSIC` level via `AudioManager` (`IsVolumeControlSupported` is `true`). `VolumeChanged` observes system-volume changes through a `ContentObserver`.

### iOS
- **Local tracks** (with `ContentUri`): Playback uses `AVAudioPlayer` with the track's `ipod-library://` asset URL. The `AVAudioSession` category is set to `Playback` to support background audio (if configured). Seeking uses second precision.
- **Streaming tracks** (with `StoreId`): Playback uses `MPMusicPlayerController.SystemMusicPlayer` with the Apple Music catalog ID. This enables playback of DRM-protected Apple Music subscription content. The system player manages its own audio session.
- **Catalog tracks** (with `CatalogId`, from [`SearchCatalogAsync`](/music/querying/#catalog-search-apple-music)): Playback enqueues the track by its Apple Music catalog id via `MPMusicPlayerStoreQueueDescriptor` — no library membership required. An active Apple Music subscription is required; gate playback on `HasStreamingSubscriptionAsync`.
- **Ducking** activates `AVAudioSession` with `DuckOthers`; `Level` and the fade durations are advisory only, as the OS controls duck depth and ramp. Announcement audio played through the app's audio session (an `AVAudioPlayer`, or `AVSpeechSynthesizer` with `UsesApplicationAudioSession = true`) plays at full volume over the ducked music — only other out-of-process audio is ducked.
- **Volume** reads from `AVAudioSession.OutputVolume` (reliable), but **setting is not supported** (`IsVolumeControlSupported` is `false`) — the setter throws `NotSupportedException`, as Apple provides no supported API to change the system volume. `VolumeChanged` fires from KVO on the session's output volume.

:::note
Music library access requires a **physical device**. Simulators and emulators typically have no music content and cannot test playback.
:::
