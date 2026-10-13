---
title: Channels
---

## Overview

Channels group notifications by type and control their behavior (sound, importance, actions). On Android, channels map directly to system notification channels. On iOS, Shiny manages channels internally.

## Channel Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Identifier` | `string` | required | Unique channel ID |
| `Description` | `string?` | `null` | Human-readable description |
| `Importance` | `ChannelImportance` | `Normal` | Priority level |
| `Sound` | `ChannelSound` | `Default` | Sound setting |
| `CustomSoundPath` | `string?` | `null` | Path for custom sounds |
| `Actions` | `List<ChannelAction>` | empty | Action buttons |

## Default Channel

Shiny provides a built-in default channel.

```csharp
var defaultChannel = Channel.Default;
// Identifier: "Notifications", Importance: Low
```

## Creating Channels

```csharp
INotificationManager notifications; // injected

// Simple channel
notifications.AddChannel(new Channel
{
    Identifier = "orders",
    Description = "Order notifications",
    Importance = ChannelImportance.High,
    Sound = ChannelSound.Default
});

// Channel with action buttons
var channel = Channel.Create("messages",
    ChannelAction.Create("reply", "Reply", ChannelActionType.TextReply),
    ChannelAction.Create("dismiss", "Dismiss", ChannelActionType.Destructive)
);
notifications.AddChannel(channel);
```

## ChannelImportance

| Value | Description |
|-------|-------------|
| `Low` | No sound, minimal visual |
| `Normal` | Default sound and visual |
| `High` | Sound, may peek on screen |
| `Critical` | Urgent, may override DND |

## ChannelSound

| Value | Description |
|-------|-------------|
| `None` | Silent |
| `Default` | System default sound |
| `High` | High-priority sound |
| `Custom` | Custom sound file (set `CustomSoundPath`) |

## Channel Actions

Action buttons appear on the notification, allowing quick interaction.

```csharp
// Text reply action
ChannelAction.Create("reply", "Reply", ChannelActionType.TextReply);

// Destructive action (red on iOS)
ChannelAction.Create("delete", "Delete", ChannelActionType.Destructive);

// Opens the app
ChannelAction.Create("open", "View", ChannelActionType.OpenApp);

// Default (no special behavior)
ChannelAction.Create("ack", "OK", ChannelActionType.None);
```

### Requiring an unlock

An action runs straight from the lock screen by default. For an action with a real-world effect, such as "Close Garage" or "Disarm", set `RequiresUnlock`. The user has to unlock the device before the action reaches your `INotificationDelegate`, and the app is not brought to the foreground. It combines with any action type.

```csharp
var channel = Channel.Create("garage",
    ChannelAction.Create("close", "Close Garage", ChannelActionType.None, requiresUnlock: true),
    ChannelAction.Create("ignore", "Ignore")
);
notifications.AddChannel(channel);
```

| Platform | Behavior |
|----------|----------|
| iOS / Mac Catalyst / macOS | `UNNotificationActionOptions.AuthenticationRequired` |
| Android 12+ (API 31) | `NotificationCompat.Action.Builder.setAuthenticationRequired(true)` |
| Android 11 and below | Not supported - the action runs without prompting |
| Windows / Linux | Ignored |

:::caution
On Android 11 and below the action still runs from a locked device. If it must never run while the device is locked, check for that in your delegate.
:::

## Managing Channels

```csharp
// Get a specific channel
var channel = notifications.GetChannel("orders");

// Get all channels
var channels = notifications.GetChannels();

// Remove a channel
notifications.RemoveChannel("orders");

// Clear all channels
notifications.ClearChannels();
```

:::caution
On Android, once a channel is created with a certain importance level, the user controls it. Your app cannot programmatically change the importance after creation.
:::
