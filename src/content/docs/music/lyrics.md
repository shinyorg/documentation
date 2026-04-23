---
title: Lyrics
---

The `ILyricsProvider` interface allows you to fetch lyrics for music tracks. Lyrics may be returned as plain text, synchronized LRC format, or both.

## Setup

`ILyricsProvider` is automatically registered when you call `AddShinyMusic()`. The default implementation uses the [LRCLIB](https://lrclib.net) service, a free public API that provides both plain and synchronized lyrics.

```csharp
public class MyViewModel
{
    readonly ILyricsProvider _lyrics;

    public MyViewModel(ILyricsProvider lyrics)
    {
        _lyrics = lyrics;
    }
}
```

## Fetching Lyrics

```csharp
var result = await _lyrics.GetLyricsAsync(track);

if (result == null)
{
    Console.WriteLine("No lyrics available for this track.");
    return;
}

if (!string.IsNullOrEmpty(result.SyncedLyrics))
{
    // Synchronized lyrics in LRC format
    Console.WriteLine("Synced lyrics available!");
    Console.WriteLine(result.SyncedLyrics);
}
else if (!string.IsNullOrEmpty(result.PlainLyrics))
{
    // Plain text lyrics (no timestamps)
    Console.WriteLine(result.PlainLyrics);
}
```

The method returns `null` if no lyrics are found. It will not throw for missing lyrics — only for unexpected errors.

## LyricsResult

```csharp
public record LyricsResult(string? PlainLyrics, string? SyncedLyrics);
```

| Property | Description |
|---|---|
| `PlainLyrics` | Plain text lyrics without timestamps. May contain newlines for line breaks. |
| `SyncedLyrics` | Synchronized lyrics in LRC format with `[mm:ss.xx]` timestamps per line. |

## LRC Format

Synced lyrics use the standard LRC (LyRiCs) format. Each line is prefixed with a timestamp indicating when it should be displayed during playback:

```
[00:12.00]First line of lyrics
[00:17.50]Second line of lyrics
[00:23.10]Third line of lyrics
```

### Parsing LRC Lyrics

Here's how to parse synced lyrics for timed display:

```csharp
using System.Text.RegularExpressions;

var regex = new Regex(@"\[(\d+):(\d+\.?\d*)\](.*)");
var lines = new List<(TimeSpan Time, string Text)>();

foreach (var line in result.SyncedLyrics!.Split('\n'))
{
    var match = regex.Match(line);
    if (!match.Success) continue;

    var minutes = int.Parse(match.Groups[1].Value);
    var seconds = double.Parse(match.Groups[2].Value);
    var text = match.Groups[3].Value.Trim();

    if (string.IsNullOrEmpty(text)) continue;

    lines.Add((
        TimeSpan.FromMinutes(minutes) + TimeSpan.FromSeconds(seconds),
        text
    ));
}

// Now you can highlight lines based on the current playback position
```

### Highlighting the Active Line

During playback, compare the player's current position against the parsed timestamps to determine which lyric line is active:

```csharp
TimeSpan position = _player.Position;
int activeIndex = -1;

for (int i = lines.Count - 1; i >= 0; i--)
{
    if (position >= lines[i].Time)
    {
        activeIndex = i;
        break;
    }
}
```

## Platform Details

### LRCLIB (Default — Both Platforms)

The default `ILyricsProvider` implementation uses the [LRCLIB](https://lrclib.net) public API. It matches tracks by artist name, track title, and duration. No API key or authentication is required.

- Endpoint: `https://lrclib.net/api/get?artist_name={artist}&track_name={title}&duration={duration}`
- Returns both plain and synced lyrics when available
- AOT-compatible with source-generated JSON serialization

### iOS — MPMediaItem.Lyrics

On iOS, the `IMediaLibrary` implementation also implements `ILyricsProvider`. It reads lyrics directly from `MPMediaItem.Lyrics` for tracks in the local music library. These are typically plain text lyrics embedded in the track's metadata (e.g., from iTunes).

:::note
The default DI registration uses the LRCLIB provider for both platforms. If you prefer to use the iOS-native lyrics on iOS, you can resolve `IMediaLibrary` and cast to `ILyricsProvider`, or register it explicitly.
:::
