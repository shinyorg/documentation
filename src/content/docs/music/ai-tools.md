---
title: AI Tools
---

`Shiny.Music.Extensions.AI` exposes the device music library and player as [Microsoft.Extensions.AI](https://learn.microsoft.com/dotnet/ai/) tool functions, so an LLM chat agent can search and browse the library, pick a track for a mood, control playback, and manage playlists — all through natural language.

It ships as a **separate NuGet package** on top of `Shiny.Music`, depends only on `Microsoft.Extensions.AI.Abstractions`, and is fully AOT-compatible (the tool schemas are hand-authored — no reflection).

```bash
dotnet add package Shiny.Music.Extensions.AI
```

## Registration

Register `Shiny.Music` as usual, then opt-in to the tool areas you want the model to see. Anything you don't add stays invisible to the LLM.

```csharp
using Shiny.Music.Extensions.AI;

builder.Services.AddShinyMusic();
builder.Services.AddMusicAITools(tools => tools
    .AddLibrary()             // search / browse / genres / playlists / lyrics / song structure (read-only)
    .AddPlayback()            // play, pause, resume, stop, seek, now-playing
    .AddPlaylistManagement()  // create / modify / delete custom playlists
);
// or expose everything at once:
// builder.Services.AddMusicAITools(tools => tools.AddAll());
```

`AddMusicAITools` requires `AddShinyMusic()` to have registered `IMediaLibrary`, `IMusicPlayer`, and `ILyricsProvider`. `AddPlayback()` throws at registration time if no `IMusicPlayer` is available (i.e. you're not on a platform target).

### Apple Music catalog search (opt-in, Apple-only)

`AddCatalog()` exposes the `search_catalog` tool, letting the agent search the **Apple Music streaming catalog** — songs that need not be in the user's library — and play them via `play_track` (an active subscription is required). It is **not** part of `AddAll()` because it only works on Apple platforms; on Android the underlying call throws and the tool reports an error to the model.

Guard the opt-in with `#if IOS` (or `#if IOS || MACCATALYST`) so the tool is only offered where it works:

```csharp
builder.Services.AddMusicAITools(tools =>
{
    tools.AddLibrary()
         .AddPlayback()
         .AddPlaylistManagement();

#if IOS || MACCATALYST
    tools.AddCatalog();   // Apple Music catalog search — Apple platforms only
#endif
});
```

:::note
`AddAll()` covers the three cross-platform areas (library, playback, playlist management). Add `AddCatalog()` explicitly — behind an `#if IOS || MACCATALYST` guard — when you want catalog search on Apple targets.
:::

## Handing the tools to a chat client

Resolve the `MusicAITools` bundle from DI and pass its `.Tools` to any `IChatClient` call:

```csharp
var tools = serviceProvider.GetRequiredService<MusicAITools>().Tools;

var response = await chatClient.GetResponseAsync(
    messages,
    new ChatOptions { Tools = [.. tools] }
);
```

The library never references a specific model provider — only `Microsoft.Extensions.AI.Abstractions`. Use it with whichever `IChatClient` you already have.

## Generated tools

Only the areas you opt-in to produce tools.

| Tool | Area | Arguments | Purpose |
|---|---|---|---|
| `search_tracks` | Library | `query` (required), `limit` | Free-text search over title/artist/album |
| `browse_tracks` | Library | `genre`, `year`, `decade`, `query`, `limit` | Filter the library — the "pick a song for the mood" path |
| `list_music_categories` | Library | `kind` (`genres`\|`years`\|`decades`, required), `genre` | Distinct categories with track counts |
| `list_playlists` | Library | — | All playlists with ids and song counts |
| `get_playlist_tracks` | Library | `playlist_id` (required), `limit` | Tracks in a playlist |
| `analyze_song_structure` | Library | `track_id` (required) | Instrumental gaps (from synced lyrics — DRM-safe) and audio-energy sections (offline scan; `null` for DRM tracks), in seconds, to start playback at a solo or chorus. No audio is played |
| `get_lyrics` | Library | `track_id` (required) | Plain and/or synced lyrics |
| `search_catalog` | Catalog *(Apple-only)* | `query` (required), `limit` | Search the Apple Music streaming catalog (not just the local library); returns ids usable with `play_track` |
| `play_track` | Playback | `track_id` (required), `start_seconds` | Load and play a track by id (local or catalog); optionally start partway in (e.g. at a solo from `analyze_song_structure`) |
| `control_playback` | Playback | `action` (`pause`\|`resume`\|`stop`\|`seek`, required), `position_seconds` | Transport control |
| `get_now_playing` | Playback | — | Current state, track, position, duration |
| `create_playlist` | Playlist management | `name` (required) | Create a custom playlist |
| `modify_playlist` | Playlist management | `action` (`add_track`\|`remove_track`), `playlist_id`, `track_id` (all required) | Add/remove a track |
| `delete_playlist` | Playlist management | `playlist_id` (required) | Delete a custom playlist |

Track ids flow between tools: `search_tracks`, `browse_tracks`, `get_playlist_tracks`, and `search_catalog` return `id`s that `play_track`, `get_lyrics`, and `modify_playlist` consume. Catalog results (from `search_catalog`) carry a `catalogId` and aren't in the local library — `play_track` remembers them from the search so it can stream them by id.

## Picking a track for a mood

### Playing a specific part of a song

`analyze_song_structure` lets an agent start playback at a musical moment rather than the top of a track — *"play the famous guitar solo from November Rain"* or *"skip to the final chorus"*. The tool returns the track's **instrumental gaps** (stretches with no sung lyrics, derived from time-synced lyrics — available even for DRM tracks) and its **audio-energy sections** (loud/quiet regions from an offline scan; `null` for DRM-protected tracks), all in seconds. The model brings its own knowledge of the song to choose which section is the one requested, then calls `play_track` with `start_seconds` set to that section's start. No audio is played by the analysis itself. See [Audio Analysis](/music/analysis) for the underlying APIs.

There is no dedicated "mood" tool — instead the model reasons about mood using `browse_tracks` and `list_music_categories`. Given a prompt like *"play me something mellow"*, the agent typically calls `list_music_categories` to see which genres exist, then `browse_tracks` with a fitting genre (e.g. `Jazz` or `Acoustic`), and finally `play_track` with the id it chose. Filtering by `decade` handles era-based requests like *"put on some 80s music"*.

## Permissions

The generated tools **assume music-library permission is already granted**. They never trigger the platform permission prompt, which requires a foreground activity. Request permission from your app before invoking the agent:

```csharp
var status = await library.RequestPermissionAsync();
if (status == PermissionStatus.Granted)
{
    // safe to run the agent with the music tools
}
```

## Error handling

Every tool returns a structured JSON object. Failures come back as `{ "error": "..." }` rather than throwing, so the model can read the problem and recover (for example, when a `track_id` doesn't resolve or a track is DRM-protected and not playable).
