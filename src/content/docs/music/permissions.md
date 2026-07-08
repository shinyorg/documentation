---
title: Permissions
---

Music library access requires runtime permissions on both platforms. The `IMediaLibrary` interface provides methods to check and request these permissions.

## Checking Permission Status

```csharp
var status = await _library.CheckPermissionAsync();
// Returns the current status without prompting the user
```

## Requesting Permission

```csharp
var status = await _library.RequestPermissionAsync();

switch (status)
{
    case PermissionStatus.Granted:
        // Access allowed — you can now query and play tracks
        break;
    case PermissionStatus.Denied:
        // User denied access — consider showing a rationale
        break;
    case PermissionStatus.Restricted:
        // iOS only — access restricted by system policy (e.g., parental controls)
        break;
    case PermissionStatus.Unknown:
        // Status could not be determined
        break;
}
```

## Android Configuration

### AndroidManifest.xml

Add these permissions to your `Platforms/Android/AndroidManifest.xml`:

```xml
<!-- Android 13+ (API 33+) -->
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />

<!-- Android 12 and below (API < 33) -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
                 android:maxSdkVersion="32" />
```

### Shiny hosting is required (v4+)

Android permission checks run on **Shiny.Core**'s `AndroidPlatform` (`GetCurrentPermissionStatus` / `RequestAccess`). Your app must be running under Shiny hosting so Shiny can track the current activity and route the permission result. In MAUI, add `.UseShiny()`:

```csharp
builder
    .UseMauiApp<App>()
    .UseShiny();          // required on Android for permission checks

builder.Services.AddShinyMusic();
```

For a native (non-MAUI) Android app, use `ShinyAndroidApplication` + `ShinyAndroidActivity` instead. Without Shiny hosting, `IMediaLibrary` cannot resolve `AndroidPlatform` and permission requests will fail.

:::note
This is a **v4 breaking change** — earlier versions used a self-contained activity provider and required no host. See the [release notes](/music/release-notes/).
:::

### How It Works
- **API 33+**: The library requests the granular `READ_MEDIA_AUDIO` permission, which grants access only to audio files.
- **API < 33**: Falls back to `READ_EXTERNAL_STORAGE`, which grants broader file access.
- Runtime permission is requested through Shiny.Core's `AndroidPlatform.RequestAccess`, which uses `ActivityCompat.RequestPermissions` on the current activity and routes the result via Shiny's activity lifecycle.

## iOS Configuration

### Info.plist

Add this key to your `Platforms/iOS/Info.plist`:

```xml
<key>NSAppleMusicUsageDescription</key>
<string>This app needs access to your music library to browse and play your music.</string>
```

:::caution
This key is **mandatory**. Your app will crash on launch if you attempt to access the music library without it. Customize the description string to explain why your app needs music access.
:::

### How It Works
- Permission is requested via `MPMediaLibrary.RequestAuthorization` from the `MediaPlayer` framework.
- iOS may return `Restricted` if access is blocked by device management or parental controls — this is distinct from the user denying access.

### Entitlements
No special entitlements are required. The `MediaPlayer` and `AVFoundation` frameworks are standard iOS frameworks included with the platform.

## Best Practices

1. **Always check before querying** — Call `RequestPermissionAsync()` or `CheckPermissionAsync()` before calling `GetAllTracksAsync()` or `SearchTracksAsync()`.
2. **Handle denial gracefully** — If the user denies permission, show UI explaining why the permission is needed and how to grant it in Settings.
3. **Don't call repeatedly** — On iOS, after the user has responded to the permission prompt once, subsequent calls to `RequestPermissionAsync()` will return the cached result without re-prompting. The user must go to Settings to change the permission.
