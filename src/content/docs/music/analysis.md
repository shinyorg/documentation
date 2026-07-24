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

## Platform notes

- **Android** decodes via `MediaExtractor` + `MediaCodec` to 16-bit PCM.
- **Apple platforms** read the asset's PCM directly via `AVAssetReader` — no export and no playback. DRM-protected assets fail to open and yield `null`.

Both platforms down-mix to a single mono envelope at a fixed rate, so `AudioLevels` is comparable across devices. Analysis decodes the whole track, so it is a background operation — run it off the UI thread (both methods already do their work on a background task) and cache the result if you need it repeatedly.

## Using it from an AI agent

`Shiny.Music.Extensions.AI` surfaces this as the `analyze_song_structure` tool (in the `AddLibrary()` area). An agent calls it to get the instrumental gaps and audio-energy sections in seconds, uses its own knowledge of the song to pick the right one, then calls `play_track` with `start_seconds`. See [AI Tools](/music/ai-tools).
