---
title: Song Identification
---

The `IMusicIdentifier` interface allows you to identify songs by listening to audio through the device microphone. On iOS, this uses Apple's ShazamKit framework. Android does not currently have an implementation.

## Platform Support

| Platform | Supported | Backend |
|---|---|---|
| iOS | ✅ | ShazamKit |
| Android | ❌ | Not yet available |

## Setup

`IMusicIdentifier` is automatically registered when you call `AddShinyMusic()` on iOS. On Android, the service is not registered.

```csharp
public class MyViewModel
{
    readonly IMusicIdentifier _identifier;

    public MyViewModel(IMusicIdentifier identifier)
    {
        _identifier = identifier;
    }
}
```

### iOS Configuration

Add the microphone usage description to your `Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Used to identify songs playing nearby.</string>
```

#### ShazamKit Entitlement

Song identification requires the ShazamKit entitlement. Add it to your project file:

```xml
<ItemGroup Condition="$(TargetFramework.Contains('-ios'))">
    <CustomEntitlements Include="com.apple.developer.shazamkit" Type="Boolean" Value="true" Visible="false" />
</ItemGroup>
```

You must also enable the **ShazamKit** capability in the Apple Developer Portal for your App ID.

The library requests microphone permission automatically before listening.

## Identifying a Song

Call `ListenAsync` to begin listening through the microphone. The method records approximately 5 seconds of audio, generates an audio signature, and matches it against the Shazam catalog.

```csharp
var cts = new CancellationTokenSource();

try
{
    var result = await _identifier.ListenAsync(cts.Token);

    if (result == null)
    {
        Console.WriteLine("No match found.");
        return;
    }

    Console.WriteLine($"Title: {result.Title}");
    Console.WriteLine($"Artist: {result.Artist}");
    Console.WriteLine($"Album: {result.Album}");
    Console.WriteLine($"Genre: {result.Genre}");
    Console.WriteLine($"ISRC: {result.Isrc}");

    if (result.ArtworkUrl != null)
        Console.WriteLine($"Artwork: {result.ArtworkUrl}");

    if (result.MusicUrl != null)
        Console.WriteLine($"Listen: {result.MusicUrl}");
}
catch (InvalidOperationException ex)
{
    // Microphone permission denied
    Console.WriteLine(ex.Message);
}
```

### Cancellation

Pass a `CancellationToken` to stop listening early. Cancelling during the recording phase stops the microphone immediately.

```csharp
var cts = new CancellationTokenSource();

// Cancel after 3 seconds instead of waiting the full duration
cts.CancelAfter(TimeSpan.FromSeconds(3));

try
{
    var result = await _identifier.ListenAsync(cts.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine("Listening was cancelled.");
}
```

### Stopping Playback First

If your app is playing music via `IMusicPlayer`, stop playback before identifying so the microphone picks up external audio:

```csharp
if (_player.State != PlaybackState.Stopped)
    _player.Stop();

var result = await _identifier.ListenAsync();
```

## MusicIdentificationResult

```csharp
public record MusicIdentificationResult(
    string Title,
    string? Artist,
    string? Album,
    string? Genre,
    string? ArtworkUrl,
    string? MusicUrl,
    string? Isrc
);
```

| Property | Description |
|---|---|
| `Title` | The title of the identified track. |
| `Artist` | The artist or performer, or `null` if not available. |
| `Album` | The album name, or `null` if not available. |
| `Genre` | The genre, or `null` if not available. |
| `ArtworkUrl` | A URL pointing to album or track artwork, or `null` if not available. |
| `MusicUrl` | A URL to the track on a music streaming service (e.g. Apple Music), or `null` if not available. |
| `Isrc` | The [International Standard Recording Code](https://en.wikipedia.org/wiki/International_Standard_Recording_Code) for the track, or `null` if not available. |

## Platform Details

### iOS — ShazamKit

The iOS implementation uses `SHSession` from the ShazamKit framework with `AVAudioEngine` for microphone input.

- Records ~5 seconds of audio via `AVAudioEngine`
- Generates a signature via `SHSignatureGenerator`
- Matches against the Shazam catalog via `SHSession.Match`
- Microphone permission is requested automatically via `AVAudioApplication.RequestRecordPermissionAsync`
- The audio session is configured for recording and deactivated after the match completes
- Requires `com.apple.developer.shazamkit` entitlement (see iOS Configuration above)

### Android

No built-in song recognition API is available on Android. Third-party services such as ACRCloud or Gracenote could be used in a future implementation.
