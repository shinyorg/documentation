---
title: Managing Jobs
---

## Overview

`IJobManager` provides full control over registered jobs -- run them on demand, query their state, and observe their lifecycle.

## Requesting Access

```csharp
IJobManager jobManager; // injected

var access = await jobManager.RequestAccess();
if (access != AccessState.Available)
{
    // Handle denied permissions
}
```

## Running Jobs

### Run All

```csharp
// Run all registered jobs (in parallel by default)
var results = await jobManager.RunAll();

// Run sequentially
var results = await jobManager.RunAll(runSequentially: true);

foreach (var result in results)
{
    if (result.Success)
        Console.WriteLine($"{result.Job?.Identifier} completed");
    else
        Console.WriteLine($"{result.Job?.Identifier} failed: {result.Exception}");
}
```

### Run a Specific Job

```csharp
var result = await jobManager.Run("MyJob");
if (result.Success)
    Console.WriteLine("Job completed successfully");
```

### Run a One-Shot Task (iOS)

On iOS, `RunTask` uses `BGTaskScheduler` to run a one-time background task.

```csharp
jobManager.RunTask("quick-sync", async cancelToken =>
{
    await SyncData(cancelToken);
});
```

## Querying Jobs

```csharp
// Get all registered jobs
var jobs = jobManager.GetJobs();

// Get a specific job
var job = jobManager.GetJob("MyJob");
if (job != null)
{
    Console.WriteLine($"Job: {job.Identifier}, Type: {job.JobType.Name}");
}
```

## Cancelling Jobs

```csharp
// Cancel a specific job
jobManager.Cancel("MyJob");

// Cancel all jobs
jobManager.CancelAll();
```

## Observing Job Lifecycle

```csharp
// Fires just before a job starts
jobManager.JobStarted.Subscribe(job =>
{
    Console.WriteLine($"Starting: {job.Identifier}");
});

// Fires when a job finishes (success or failure)
jobManager.JobFinished.Subscribe(result =>
{
    if (result.Success)
        Console.WriteLine($"Finished: {result.Job?.Identifier}");
    else
        Console.WriteLine($"Failed: {result.Job?.Identifier} - {result.Exception?.Message}");
});

// Check if the job manager is currently running
var isRunning = jobManager.IsRunning;
```
