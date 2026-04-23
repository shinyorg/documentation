---
title: Album Art
---

The `IMediaLibrary.GetAlbumArtPathAsync` method retrieves album artwork for a track and returns it as a file path that can be used directly as an image source.

## Basic Usage

```csharp
var artPath = await _library.GetAlbumArtPathAsync(track.Id);

if (artPath != null)
{
    // Use in MAUI
    var imageSource = ImageSource.FromFile(artPath);
}
```

The method returns `null` if no artwork is available for the track.

## Using in XAML

You can bind album art in your view model and use it as an `ImageSource`:

```csharp
// In your ViewModel
public async Task LoadAlbumArt(string trackId)
{
    var path = await _library.GetAlbumArtPathAsync(trackId);
    AlbumArtSource = path != null ? ImageSource.FromFile(path) : null;
}
```

```xml
<!-- In your XAML -->
<Image Source="{Binding AlbumArtSource}"
       WidthRequest="300"
       HeightRequest="300"
       Aspect="AspectFill" />
```

## Platform Behavior

### Android

Returns the content URI for the album art from MediaStore (`content://media/external/audio/albumart/{albumId}`). This URI can be used directly with MAUI's image loading.

### iOS

iOS does not expose album art as a URI. Instead, `GetAlbumArtPathAsync`:

1. Retrieves the `MPMediaItem.Artwork` image object
2. Renders it at 600x600 pixels
3. Encodes it as JPEG (85% quality)
4. Saves it to the app's caches directory (`Library/Caches/albumart/{trackId}.jpg`)
5. Returns the cached file path

Subsequent calls for the same track return the cached file without re-rendering.

:::note
The artwork is cached in the system caches directory, which iOS may purge when storage is low. This is the correct behavior — artwork can always be re-generated from the media library.
:::
