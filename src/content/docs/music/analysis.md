---
title: Audio Analysis
---

Shiny.Music can inspect a track's audio **without playing it** — to draw a waveform or VU meter, or to locate a specific part of a song such as an intro, a chorus, or a guitar solo. There are two complementary APIs:

- **`IMediaLibrary.AnalyzeLevelsAsync`** — decodes the track to PCM offline and measures its amplitude.
- **`LyricsExtensions.GetInstrumentalGaps`** — derives the no-vocal stretches of a track from time-synced lyrics, with no audio decode at all.

They pair naturally: the lyric gaps give precise boundaries, and the audio energy tells you which gap is the loud solo versus the quiet intro.

## Offline level analysis

`AnalyzeLevelsAsync` decodes a track to PCM in the background — **nothing is played through the speakers** — and returns per-window amplitude plus a derived song structure.

```csharp
Task<AudioLevels?> AnalyzeLevelsAsync(string trackId, TimeSpan? window = null);
```

- `window` is the analysis resolution — the duration each level entry represents. It defaults to **500&nbsp;ms**. Smaller windows give a finer waveform at the cost of more entries.
- Returns **`null`** when the track cannot be decoded to PCM: DRM-protected Apple Music content and streaming-only catalog items (the same tracks [`CopyTrackAsync`](/music/copying) refuses). **Always null-check the result.**

`AudioLevels` contains:

| Member | Description |
|---|---|
| `Window` | The duration each `Rms`/`Peak` entry represents |
| `Duration` | Total duration of the analyzed track |
| `Rms` | Per-window RMS (average) level, normalized `0.0–1.0` against the loudest sample — the "VU" envelope |
| `Peak` | Per-window peak level, normalized `0.0–1.0`, aligned one-to-one with `Rms` |
| `Sections` | The envelope collapsed into contiguous `AudioSection` runs — the coarse "song structure" |

Each `AudioSection` has `Start`, `Duration`, `End`, an `AverageLevel` (`0.0–1.0`), and an `AudioEnergy` classification relative to the track's own dynamics:

| `AudioEnergy` | Typical part of a song |
|---|---|
| `Silent` | A lead-in, lead-out, or a gap between sections |
| `Quiet` | A sparse intro, a breakdown, or a quiet verse |
| `Moderate` | A typical verse or build |
| `Loud` | A chorus, drop, or a driving instrumental such as a solo |

```csharp
var levels = await library.AnalyzeLevelsAsync(track.Id);
if (levels is null)
{
    // DRM-protected / streaming-only — fall back to lyric gaps (below)
}
else
{
    foreach (var section in levels.Sections)
        Console.WriteLine($"{section.Start:mm\\:ss} {section.Energy} ({section.AverageLevel:P0})");
}
```

### Drawing a waveform

`Rms` (or `Peak`) is ready to plot directly — each value is already normalized `0.0–1.0`:

```csharp
var levels = await library.AnalyzeLevelsAsync(track.Id, TimeSpan.FromMilliseconds(100));
if (levels is not null)
{
    foreach (var value in levels.Rms)
        DrawBar(value); // 0.0 = silence, 1.0 = as loud as the track ever gets
}
```

## Instrumental gaps from lyrics

`GetInstrumentalGaps` (an extension on `LyricsResult`, namespace `Shiny.Music`) turns time-synced lyrics into the **instrumental (no-vocal) sections** of a track — the intro before the first line, any stretch between sung lines longer than the threshold, and the outro after the last line.

```csharp
IReadOnlyList<InstrumentalGap> GetInstrumentalGaps(
    this LyricsResult? lyrics,
    TimeSpan? trackDuration = null,   // enables the trailing (outro) gap
    TimeSpan? minimumGap = null);     // default 8s — excludes ordinary pauses between lines
```

Because it reads lyric timestamps and never decodes audio, **it works even for DRM-protected tracks** where `AnalyzeLevelsAsync` returns `null`. It requires `SyncedLyrics` and returns an empty list for plain-only lyrics. Each `InstrumentalGap` has `Start`, `Duration`, and `End`.

There is also `ParseSyncedLyrics()` if you want the raw `LrcLine` list (`Timestamp` + `Text`).

## Putting it together — "play the famous guitar solo"

A common goal is to start playback at a specific musical moment. The song's structure lives in the two APIs above; *which* section is "the famous solo" is something you (or an LLM) know about the song. Combine both:

```csharp
// 1. Precise instrumental boundaries from synced lyrics (works even for DRM tracks)
var lyrics = await lyricsProvider.GetLyricsAsync(track);
var gaps = lyrics.GetInstrumentalGaps(track.Duration);

// 2. Energy sections to distinguish a loud solo from a quiet intro (null if DRM-protected)
var levels = await library.AnalyzeLevelsAsync(track.Id);
var solo = levels?.Sections
    .Where(s => s.Energy == AudioEnergy.Loud)
    .MaxBy(s => s.Start);                 // the last big loud stretch — the outro solo

var startAt = solo?.Start ?? gaps.LastOrDefault()?.Start ?? TimeSpan.Zero;

// 3. Play from that point
await player.PlayAsync(track);
player.Seek(startAt);
```

## VU metering — `IVuMeter`

For a live meter that updates as the song plays, `IMusicPlayer.CreateVuMeter(...)` returns an `IVuMeter` that raises a plain `LevelChanged` event. The **source of the levels differs by platform** — deliberately:

- **Android** taps the **real audio output** via `android.media.audiofx.Visualizer` attached to the player's audio session (`IsLive == true`). This reflects what's actually being output. It requires the `RECORD_AUDIO` permission (the OS gates output capture like recording): add `<uses-permission android:name="android.permission.RECORD_AUDIO" />` and request it at runtime. Without it, the meter falls back to the implied version.
- **Apple** uses the **implied** meter (`IsLive == false`): it samples the offline `AudioLevels` at the current playback position, because the system player (`MPMusicPlayerController`) plays out of process and exposes no output tap. Pass the `AnalyzeLevelsAsync` result so it has an envelope to read.

```csharp
var levels = await library.AnalyzeLevelsAsync(track.Id);   // used by the implied (Apple) meter
var meter = player.CreateVuMeter(levels);                  // interval defaults to 50ms
meter.LevelChanged += (_, level) =>
{
    // level.Rms / level.Peak are 0.0–1.0. LevelChanged may fire on a background thread.
    MainThread.BeginInvokeOnMainThread(() => DrawVu(level.Rms, level.Peak));
};
meter.Start();
// ...
meter.Dispose();
```

Check `meter.IsLive` if you want to tell the user whether the meter is a true output tap or the implied approximation. The implied meter reflects the *song's* loudness at the play-head (not volume/duck changes); the live Android meter reflects the real output. To sample a single position without a running meter, call `audioLevels.SampleAt(position)`.

## Platform notes

Both platforms copy the track to a **temporary file** and decode that, rather than the live asset:

- **Android** copies the track and decodes it with `MediaExtractor` + `MediaCodec` to 16-bit PCM.
- **Apple platforms** export the track with `AVAssetExportSession` and read it with `AVAssetReader`. DRM-protected tracks aren't exportable and yield `null`.

Decoding a temporary copy is deliberate: while a track is playing, the OS music player holds the live asset (on iOS `MPMusicPlayerController` owns the `ipod-library` asset), and reading it directly would fail — so analysis would only work while stopped. The temp copy keeps analysis working **during playback**, which is exactly what a "now playing" waveform needs.

Both platforms down-mix to a single mono envelope at a fixed rate, so `AudioLevels` is comparable across devices. Analysis copies and decodes the whole track, so it is a background operation — both methods already do their work on a background task; cache the result if you need it repeatedly.

## Using it from an AI agent

`Shiny.Music.Extensions.AI` surfaces this as the `analyze_song_structure` tool (in the `AddLibrary()` area). An agent calls it to get the instrumental gaps and audio-energy sections in seconds, uses its own knowledge of the song to pick the right one, then calls `play_track` with `start_seconds`. See [AI Tools](/music/ai-tools).
