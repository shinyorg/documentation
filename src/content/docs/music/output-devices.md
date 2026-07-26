---
title: Audio Output
---

The `IAudioOutputDevices` service tells you **where the music is going** — the built-in speaker, wired or USB headphones, a Bluetooth speaker, the car, HDMI or AirPlay — and raises an event when that route changes, such as when the user unplugs their headphones or a Bluetooth speaker connects.

It is registered by `AddShinyMusic()`, so resolve it from DI like any other service:

```csharp
public class NowPlayingViewModel(IAudioOutputDevices outputs, IMusicPlayer player)
{
    // ...
}
```

:::note
This is **output only** and **read-only**. Capture devices (microphones) are out of scope for a music library, and choosing the output route is the user's job — through the OS route picker, Control Center, or the system audio settings. No permission is required.
:::

## The Current Route

`Current` returns the route music is playing through, or `null` when the platform reports none:

```csharp
var current = outputs.Current;

if (current != null)
    Console.WriteLine($"Playing on {current.Name} ({current.Type})");
    // e.g. "Playing on JBL Flip 5 (BluetoothA2dp)"
```

Each route is an `AudioOutputDevice`:

| Property | Type | Description |
|---|---|---|
| `Id` | `string` | Stable platform identifier (Apple port UID / Android `AudioDeviceInfo.Id`) |
| `Name` | `string` | Human-friendly name, e.g. `"JBL Flip 5"` or `"Speaker"` |
| `Type` | `AudioOutputType` | Normalized route type |
| `IsCurrent` | `bool` | Whether this is the route in use right now |

`AudioOutputType` normalizes what each platform reports into one set of values:

`Unknown`, `BuiltInSpeaker`, `BuiltInReceiver`, `WiredHeadphones`, `WiredHeadset`, `Bluetooth` (hands-free HFP/SCO/LE), `BluetoothA2dp` (stereo — the normal music route), `Usb`, `CarAudio`, `Hdmi`, `AirPlay`.

## Classifying the Route

Rather than switching on every `AudioOutputType` value, use the helpers in `AudioOutputExtensions`. Each has an overload for both `AudioOutputDevice` and `AudioOutputType`:

| Method | `true` for | Use it for |
|---|---|---|
| `IsWired()` | `WiredHeadphones`, `WiredHeadset`, `Usb` | "is something plugged in" |
| `IsBluetooth()` | `Bluetooth`, `BluetoothA2dp` | showing a Bluetooth badge |
| `IsBuiltIn()` | `BuiltInSpeaker`, `BuiltInReceiver` | nothing is plugged in or paired |
| `IsHeadphones()` | wired or Bluetooth headphones/headsets | "audio is private to the user" |
| `IsExternalSystem()` | `CarAudio`, `Hdmi`, `AirPlay` | playback has left the device |

```csharp
var current = outputs.Current;

if (current?.IsBluetooth() == true)
    ShowBluetoothIcon();
else if (current?.IsWired() == true)
    ShowWiredIcon();
else
    ShowSpeakerIcon();
```

:::tip
`IsWired()` includes `Usb` on purpose: on handsets with no 3.5&nbsp;mm jack, the wired option *is* USB-C. The trade-off is that a USB audio interface or DAC also answers `true` — use `IsHeadphones()` when you specifically mean something worn on the head, at the cost of missing USB-C earbuds.
:::

## Reacting to Route Changes

`Changed` fires whenever the active output route changes. The argument is the new `Current` value, which may be `null`:

```csharp
outputs.Changed += (sender, device) =>
{
    // Classic behavior: the user yanked the headphones out and audio fell back
    // to the loudspeaker — pause rather than blast the room.
    if (device?.IsBuiltIn() == true)
        MainThread.BeginInvokeOnMainThread(_player.Pause);
};
```

:::caution
`Changed` is raised on whatever thread the OS delivers the route notification on. Marshal to the UI thread (`MainThread.BeginInvokeOnMainThread`) before touching UI state.
:::

## Listing Routes

`GetOutputs()` returns the output routes the OS reports, with `IsCurrent` set on the active one:

```csharp
foreach (var device in outputs.GetOutputs())
    Console.WriteLine($"{device.Name} — {device.Type}{(device.IsCurrent ? " (current)" : "")}");
```

What this contains differs by platform — see below. It is **not** a device picker: no platform here lets an app switch the route.

## Platform Behavior

### Android

`GetOutputs()` returns **every connected output** from `AudioManager.GetDevices(Outputs)`.

Android's `AudioDeviceInfo` carries no "active" flag, so `Current` is a **derived** value: the connected outputs are ranked the way the platform's own media routing policy does and the winner is reported.

| Priority | Route |
|---|---|
| 1 | Bluetooth A2DP |
| 2 | Bluetooth hands-free (SCO/LE) |
| 3 | Wired headset |
| 4 | Wired headphones |
| 5 | USB |
| 6 | Car audio (Automotive bus) |
| 7 | HDMI |
| 8 | Built-in speaker |
| 9 | Earpiece |

That's a very good approximation for media playback — but it is derived, not a platform guarantee. Route changes come from an `AudioDeviceCallback` registered on the first `Changed` subscription.

### iOS and Mac Catalyst

`Current` comes straight from `AVAudioSession.CurrentRoute` — the OS reports the active route directly, so nothing is inferred.

The OS exposes **only the active route's ports**; discovering every reachable AirPlay or Bluetooth destination is owned by the system route picker (`AVRoutePickerView` / Control Center). So `GetOutputs()` returns the current route — usually a single entry — rather than a full list of destinations.

A mic-equipped wired headset reports as `WiredHeadphones`, because Apple only surfaces the headset microphone on the *input* side. Use `IsWired()` or `IsHeadphones()` instead of testing for `WiredHeadset` directly.

Route changes come from the `AVAudioSession` route-change notification, observed on the first `Changed` subscription.

:::note
Route detection needs a **physical device**. Simulators and emulators report a single built-in route and never raise a change.
:::
