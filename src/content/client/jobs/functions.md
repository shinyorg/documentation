# Querying, Cancelling, and Adhoc


## Cancelling Jobs

Sometimes it is necessary to cancel job functionality.  We don't generally recommend doing this.  It is better to check criteria in your job thus allowing the operating system to keep your
job relevant in the scheduling process.

However, some may want jobs to start/stop running in certain circumstances (ie. User logs in/out).  

```csharp
IJobManager manager; // inject
// Cancelling A Job
manager.Cancel("YourJobName");

// Cancelling All Jobs
manager.CancelAll();
```

## Running Jobs Adhoc/OnDemand

There will be cases where you want to manually run a job.  An example of this is a story like the following:

1. User logs in
2. Background data sync logic is within a job
3. Don't want to wait for a job to run just to sync data the first time

Thus, we can run a specific job and wait for it to complete

```csharp
IJobManager manager; // inject

// Run All Jobs On-Demand
var results = await manager.RunAll();

// Run A Specific Job On-Demand
var result = await manager.Run("YourJobName");
```

## Querying Jobs

The job manager allows you to query registered jobs.  This is useful for debugging and testing.

```csharp
IJobManager manager; // inject

// get a list of jobs
var jobs = await manager.GetJobs();

var job = await manager.GetJob("YourJobName"); // returns null if not found
```