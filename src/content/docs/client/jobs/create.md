---
title: Create a Job
---

## Implementing IJob

Create a class that implements `IJob`. The `Run` method will be called by the job manager when conditions are met.

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

    public async Task Run(JobInfo jobInfo, CancellationToken cancelToken)
    {
        this.logger.LogInformation("Job {Identifier} running", jobInfo.Identifier);

        // Access job parameters
        if (jobInfo.Parameters?.TryGetValue("key", out var value) == true)
        {
            this.logger.LogInformation("Parameter: {Value}", value);
        }

        // Do your work here
        await Task.Delay(1000, cancelToken);
    }
}
```

## JobInfo

`JobInfo` is a record that configures how and when a job runs.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Identifier` | `string` | required | Unique name for this job |
| `JobType` | `Type` | required | The `IJob` implementation type |
| `RunOnForeground` | `bool` | `false` | Also run when app is in foreground |
| `Parameters` | `Dictionary<string, string>?` | `null` | Key/value pairs passed to the job |
| `RequiredInternetAccess` | `InternetAccess` | `None` | `None`, `Any`, or `Unmetered` |
| `DeviceCharging` | `bool` | `false` | Only run while charging |
| `BatteryNotLow` | `bool` | `false` | Only run when battery is adequate |

## Registration at Startup

Register jobs during service configuration so they are set up when the app starts.

```csharp
// Using JobInfo directly
services.AddJob(new JobInfo(
    "MyJob",
    typeof(MyJob),
    RequiredInternetAccess: InternetAccess.Any,
    BatteryNotLow: true
));

// Using the fluent overload
services.AddJob(
    typeof(MyJob),
    identifier: "MyJob",
    requiredNetwork: InternetAccess.Any
);
```

## Registration at Runtime

If you need to register jobs dynamically after startup, use `IJobManager`.

```csharp
// First, register the job infrastructure during startup
services.AddJobs();

// Then, at runtime:
IJobManager jobManager; // injected

jobManager.Register(new JobInfo(
    "DynamicJob",
    typeof(MyJob),
    Parameters: new Dictionary<string, string>
    {
        { "userId", "123" }
    }
));
```

## Foreground Jobs

When `RunOnForeground` is `true`, the job will also execute periodically while your app is in the foreground (on a timer).

```csharp
services.AddJob(new JobInfo(
    "SyncJob",
    typeof(MySyncJob),
    RunOnForeground: true,
    RequiredInternetAccess: InternetAccess.Any
));
```

## Stateful Jobs

For jobs that need to persist state between runs, see [Stateful Services](../other/statefulservices).
