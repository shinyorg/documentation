---
title: Managing Jobs
---

## Overview

`IJobManager` lets you run registered jobs on demand, force-run all of them, and enumerate the current set. Jobs are identified by their CLR `Type`.

```csharp
public interface IJobManager
{
    void RunTask(string taskName, Func<CancellationToken, Task> task);

    Task<JobRunResult> RunJob(
        Type jobType,
        bool runAsTask = false,
        CancellationToken cancellationToken = default
    );

    Task<IEnumerable<JobRunResult>> RunAll(
        CancellationToken cancelToken = default,
        bool runSequentially = false
    );

    IReadOnlyDictionary<Type, JobRegistration> GetJobs();
}
```

## Requesting Access

`RequestAccess()` lives on `AbstractJobManager` (the base class behind the platform managers), not on the `IJobManager` interface. Cast or resolve the concrete manager to call it.

```csharp
IJobManager jobManager; // injected

if (jobManager is AbstractJobManager mgr)
{
    var access = await mgr.RequestAccess();
    if (access != AccessState.Available)
    {
        // Handle: NotSupported, NotSetup, Disabled, Restricted, Denied
    }
}
```

## Running Jobs

### Run All

```csharp
// Run all registered jobs (concurrently by default)
var results = await jobManager.RunAll();

// Or run them sequentially
var results = await jobManager.RunAll(runSequentially: true);

foreach (var result in results)
{
    var name = result.Job?.JobType.FullName ?? "(unknown)";
    if (result.Success)
        Console.WriteLine($"{name} completed");
    else
        Console.WriteLine($"{name} failed: {result.Exception}");
}
```

### Run a Specific Job

Pass the registered `IJob` implementation type. When `runAsTask: true`, the run is wrapped in platform-specific extended-execution semantics (iOS `BeginBackgroundTask`, Android partial wake-lock). When `false` (default), the job runs inline.

```csharp
var result = await jobManager.RunJob(typeof(MySyncJob), runAsTask: true);
if (result.Success)
    Console.WriteLine("Job completed successfully");
```

If the type was never registered, `RunJob` throws `InvalidOperationException`.

### Run an Ad-Hoc Task

`RunTask` is fire-and-forget. Use it for one-off async work that is **not** a registered job; you still get the platform extended-execution wrapping on iOS and Android.

```csharp
jobManager.RunTask("quick-sync", async cancelToken =>
{
    await SyncData(cancelToken);
});
```

## Querying Jobs

```csharp
// Get all registered jobs (keyed by Type)
var jobs = jobManager.GetJobs();

foreach (var (type, reg) in jobs)
{
    Console.WriteLine($"{type.FullName} foreground={reg.RunOnForeground}");
}

// Check whether a specific job is registered
if (jobs.TryGetValue(typeof(MySyncJob), out var registration))
{
    // registration is the JobRegistration record
}
```

## Inspecting the Current Run State

`AbstractJobManager.IsRunning` returns `true` while a `RunAll(...)` batch is in flight.

```csharp
if (jobManager is AbstractJobManager mgr && mgr.IsRunning)
{
    // A batch is already running — skip or defer
}
```
