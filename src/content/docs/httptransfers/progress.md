---
title: Transfer Progress
---

## Overview

Background transfers are the most obvious thing to put in front of a user who has left your app: an iOS
**Live Activity** on the Lock Screen and in the Dynamic Island, or the Android **foreground-service
notification** upgraded to an Android 16 live update with a status bar chip.

`AddTransferProgress()` does both from one manager, so the two platforms cannot drift in what they say.
Nothing goes in your transfer delegate.

```csharp
builder.Services.AddHttpTransfers<MyTransferDelegate>();
builder.Services.AddTransferProgress(opts =>
{
    opts.Scope       = TransferProgressScope.Summary;      // one surface for all, or PerTransfer
    opts.Fields      = TransferProgressFields.Default;     // file, direction, %, bytes, speed, ETA
    opts.ShortStatus = TransferProgressShortStatus.Percent;
});
```

`TransferProgressManager` subscribes to `IHttpTransferManager.UpdateReceived` at app startup, coalesces the
progress firehose down to one update a second, aggregates a batch into a single figure, and starts, updates
and retires the surface — including when iOS relaunches your app in the background to finish a transfer.

## Platform behaviour

| Platform | Surface |
|----------|---------|
| Android 16+ | The foreground-service notification, promoted ongoing: status bar chip, always-on display |
| Android 8–15 | The foreground-service notification with a determinate progress bar |
| iOS 16.2+ | A Live Activity — Lock Screen and Dynamic Island (add `Shiny.Mobile.LiveActivities.HttpTransfers`) |
| Everything else | No renderer available; the manager does nothing |

:::note[One notification on Android, not two]
Android requires a foreground service to move bytes in the background, and a foreground service requires a
notification. `ForegroundNotificationRenderer` re-posts *that* notification rather than adding a second one,
so the user no longer sees a progress notification alongside a redundant "Shiny service is continuing to
transfer data in the background".

The older `PerTransferNotificationStrategy` — which posted the second notification — is obsolete. Remove it
when you adopt `AddTransferProgress()`.
:::

iOS ships no renderer in `Shiny.Net.Http` itself, because ActivityKit needs a Swift widget extension.
Add the [`Shiny.Mobile.LiveActivities.HttpTransfers`](https://github.com/shinyorg/liveactivities) package
and call `AddHttpTransferLiveActivities()` alongside; it registers an `ITransferProgressRenderer` and the
same manager drives it.

## Configuring what shows

`Fields` is a `[Flags]` enum gating the human-readable title and body. Unselected fields are simply not
written, and each renderer draws only what it is given — so turning one off removes it from the Lock Screen
without touching any Swift.

| Flag | Example |
|------|---------|
| `FileName` | `receipt.pdf` |
| `Direction` | `Uploading` / `Downloading` |
| `Percent` | `41%` |
| `TransferredBytes` | `12 MB of 48 MB` |
| `Speed` | `1.5 MB/s` |
| `TimeRemaining` | `4m 12s left` |
| `Host` | `uploads.example.com` |

`ShortStatus` picks the single value for the tightest surfaces — the Dynamic Island compact view and the
Android status bar chip. Percent is left out of the body when it is already the short status, so it never
prints twice.

Raw, culture-invariant values (`bytes`, `total`, `percent`, `bps`, `etaSeconds`, `state`, `direction`,
`transferId`, `fileName`, `uri`) always ride in `TransferProgressContent.Data` for a custom iOS widget to
format itself, unless you set `IncludeRawData = false`.

## Custom wording

For localization, or wording the built-ins do not cover, implement `ITransferProgressDelegate` — or subclass
`TransferProgressDelegate` and override only what you need. Returning `null` keeps the built-in string.

```csharp
public class MyProgressText(IStringLocalizer localizer) : TransferProgressDelegate
{
    public override string? GetTitle(TransferProgressSnapshot snapshot)
        => snapshot.IsUpload ? localizer["Sending"] : null;   // null => keep the built-in
}

builder.Services.AddTransferProgress<MyProgressText>();
```

## The iOS suspension gap

A background `NSURLSession` delivers **no** progress callbacks while your app is suspended:
`DidWriteData`/`DidSendBodyData` stop firing and iOS only wakes the app when the transfer completes. A
fraction-based bar therefore freezes for most of a long transfer.

That is why `ProjectTimeRemaining` is on by default. Progress is emitted as a **time range** rather than a
fraction, which the system animates on its own — anchored in the *past*, at the point a constant-rate
transfer would have begun, so the bar already sits at the true fraction. (Anchoring at "now" would snap the
bar back to zero on every update.) Every real callback re-anchors it.

It falls back to a plain fraction when the transfer is stalled, paused, of unknown size, or when the
estimate exceeds `MaximumProjection` (one hour by default). Android resolves the range straight back to a
fraction — its foreground service is alive throughout, so real progress keeps arriving and the bar never has
to coast.

For **uploads** you can go further: set `RequestPushToken = true` on the Live Activities package's options
and your server, which knows how many bytes actually landed, can push byte-accurate progress through the
whole suspended window. It buys nothing for downloads, where no server knows how far the device has got.

## Options

| Option | Default | What it does |
|--------|---------|--------------|
| `Scope` | `Summary` | One surface for all transfers, or one per transfer |
| `Fields` | `Default` | Which fields the title/body may mention |
| `ShortStatus` | `Percent` | The single value for the Dynamic Island / status chip |
| `MinimumUpdateInterval` | 1s | Floor between two rendered updates |
| `MinimumPercentChange` | 1% | How far progress must move to be worth redrawing |
| `ProjectTimeRemaining` | `true` | Emit a self-animating time range instead of a fraction |
| `MaximumProjection` | 1h | Beyond this the estimate is nonsense; fall back to a fraction |
| `IncludeRawData` | `true` | Also emit machine-readable values for custom renderers |
| `StaleAfter` | 30s | When content should be treated as out of date |
| `DismissCompletedAfter` | 4s | How long the final state lingers |
| `AlertOnCompletion` | `false` | Alert rather than refresh silently when a batch finishes |
| `RankByProgress` | `true` | Rank iOS activities by completion fraction |

## Writing your own renderer

Register an `ITransferProgressRenderer` and the same manager drives it — you get the aggregation,
coalescing and lifetime for free and only implement the drawing.

```csharp
public class MyRenderer : ITransferProgressRenderer
{
    public bool IsAvailable => true;

    public Task Show(string key, TransferProgressContent content) { /* draw */ return Task.CompletedTask; }
    public Task Hide(string key, TransferProgressContent content, DateTimeOffset dismissAt) { /* remove */ return Task.CompletedTask; }
    public Task Reconcile(IReadOnlyCollection<string> activeKeys) { /* clean up leftovers */ return Task.CompletedTask; }
}

builder.Services.AddSingleton<ITransferProgressRenderer, MyRenderer>();
```

`TransferProgressContentBuilder` is public and static, so `FormatBytes`, `FormatRate`, `FormatDuration` and
`FormatPercent` are reusable anywhere — including in ordinary in-app progress UI.
