---
title: Create a Job
---

## Implementing IJob

Create a class that implements `IJob`. The `Run` method receives only a `CancellationToken` — there is no per-run info argument. Inject any configuration or services your job needs through the constructor.

```csharp
public class MyJob : IJob
{
    readonly ILogger<MyJob> logger;
    readonly IConnectivity connectivity;

    public MyJob(ILogger<MyJob> logger, IConnectivity connectivity)
    {
        // Full dependency injection support
        this.logger = logger;
        this.connectivity = connectivity;
    }

    public async Task Run(CancellationToken cancelToken)
    {
        this.logger.LogInformation("MyJob running");

        // Do your work here
        await Task.Delay(1000, cancelToken);
    }
}
```

A job's identity is its CLR `Type` — there is no separate string identifier.

## JobRegistration

`JobRegistration` is the record that describes how and when a job runs.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `JobType` | `Type` | required | The `IJob` implementation type (the unique identity) |
| `RunOnForeground` | `bool` | `false` | Also run on a foreground timer while the app is active |
| `RequiredInternetAccess` | `InternetAccess` | `None` | `None`, `Any`, or `Unmetered` |
| `DeviceCharging` | `bool` | `false` | Only run while the device is charging |
| `BatteryNotLow` | `bool` | `false` | Only run when the battery is not low |

## Registration at Startup

Register jobs during service configuration using the generic `AddJob<TJob>` extension. The optional configure delegate uses fluent extension methods to refine the `JobRegistration`.

```csharp
using Shiny;
using Shiny.Jobs;

services.AddJob<MyJob>(r => r
    .WithInternet(InternetAccess.Any)
    .WithBatteryNotLow()
);
```

The first `AddJob<...>` call also wires up the job manager infrastructure (and, on platform builds, the foreground `JobLifecycleTask` plus `IBattery`/`IConnectivity`).

### Fluent Extensions

| Method | Effect |
|--------|--------|
| `WithForeground(bool = true)` | Allow the job to run while the app is in the foreground |
| `WithInternet(InternetAccess)` | Require connectivity (`Any`, `Unmetered`, or `None`) |
| `WithCharging(bool = true)` | Only run while the device is charging |
| `WithBatteryNotLow(bool = true)` | Only run when the battery is adequate |

## Foreground Jobs

When `WithForeground()` is applied, the job also runs periodically while your app is in the foreground. The foreground driver is `JobLifecycleTask` on platform builds (default interval 1 minute, range 15s–5min via `JobLifecycleTask.Interval`); on plain .NET it is the in-process `JobManager` timer (default 30s, range 15s–5min via `JobManager.Interval`).

```csharp
services.AddJob<MySyncJob>(r => r
    .WithForeground()
    .WithInternet(InternetAccess.Any)
);
```

## The `Job` Base Class

For jobs that should not fire more often than a minimum interval, inherit from the abstract `Job` base class. Override `RunJob(CancellationToken)` (not `Run`) and set `MinimumTime`. Last-run tracking is in-memory and resets on process restart.

```csharp
public class CleanupJob : Job
{
    readonly IMyLocalDb db;

    public CleanupJob(ILogger<CleanupJob> logger, IMyLocalDb db) : base(logger)
    {
        this.db = db;
        this.MinimumTime = TimeSpan.FromHours(6);
    }

    protected override Task RunJob(CancellationToken cancelToken)
        => this.db.PurgeOldRecords(cancelToken);
}
```

## Stateful Jobs

For jobs that need to persist state between runs, see [Stateful Services](../other/statefulservices).
