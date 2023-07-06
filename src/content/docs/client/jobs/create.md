---
title: Creating a Job
---
## Create your job

The first thing you'll want to do is create your job by implementing the Shiny.Jobs.IJob interface.

```csharp
using Shiny.Jobs;

namespace YourNamespace;

// first define your job
public class YourJob : IJob
{
    public async Task Run(JobInfo jobInfo, CancellationToken cancelToken)
    {
        for (var i = 0; i < loops; i++)
        {
            if (cancelToken.IsCancellationRequested)
                break;

            await Task.Delay(1000, cancelToken).ConfigureAwait(false);
        }
    }
}
```

Next, we need to define our job run parameters by defining a JobInfo. The job info allows you to pass in a dictionary of parameters to use within your job.

```csharp
var job = new JobInfo
{
    Name = "YourJobName",
    Type = typeof(YourJob),

    // these are criteria that must be met in order for your job to run
    BatteryNotLow = true,
    DeviceCharging = false,
    RunInForeground = true,
    NetworkType = NetworkType.Any,
    Repeat = true; //defaults to true, set to false to run once OR set it inside a job to cancel further execution
};

```

Lastly, we need to register our job.  There are two ways to do this

Through the shiny startup process (recommended)

```csharp
services.RegisterJob(yourJobInfo);
```

OR Dynamically in your code - in order to do this, you still have to register the job manager in your startup

```csharp

services.UseJobs();

IJobManager manager; // inject

// lastly, schedule it to go - don't worry about scheduling something more than once, we just update if your job name matches an existing one
manager.RegisterJob(job);
```


## Stateful Jobs

Jobs are stateful.  Please take a look at [Stateful Services](../../other/statefulservices)

## Foreground Jobs

Foreground jobs aren't really anything special.  When your app comes to the foreground, we simply start a timer that schedules a job to run every X seconds.  