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

On iOS, `GetAlbumArtPathAsync` returns the MusicKit `Artwork.Url()` for the track at 300x300 pixels. This is a URL string that can be used directly as an image source.

The `AlbumArtUri` property on `MusicMetadata` is also populated with the artwork URL on iOS, unlike the previous implementation where it was `null`.
