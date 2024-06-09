---
title: Advanced
---

* Covariance with Dependency Injection on Event Handlers & Middleware - NOT request handlers
    * Infrastructure
        * Request Sender
        * Event Publishing
* Shiny.Mediator reference
* IRequestSender
* IEventPublisher

## Request Sender (IRequestSender)
TODO

## Event Publisher (IEventPublisher)

Our default event publisher pulls in all event handlers that are registered with the dependency injection container including any event collectors that are registered.

From there, we wrap each call to each event handler in any registered event middleware.  

Lastly, we execute these using Task.WhenAll to ensure all event handlers are executed in parallel. 

## Event Collectors

### What are they?
Event collectors allow you to bring in event handlers that may not be participating in the dependency injection lifecycle or perhaps they simply have a different scope outside of where you are IN the DI lifecycle.

Traditionally, in classic Xamarin Forms and even some .NET MAUI apps tend not to register their viewmodels or pages with the DI lifecycle, however, all of these apps participate in the navigation stack.  Thus, we have an 
event collector for MAUI that simply traverses to find any pages or viewmodels that implement the IEventHandler at the time of the event publish.  What this means is that if you pop a page/viewmodel off the stack
before the publish is called, it will no longer participate in the event collector.

:::note
It is possible to have the event collector return an item that is both DI aware AND event collector aware.  We do instance comparison under the hood to ensure we only register a particular handler once
:::


### Creating an Event Collector

```csharp
public class MyEventCollector : IEventCollector
{
    public IReadOnlyList<IEventHandler<TEvent>> GetHandlers<TEvent>() where TEvent : IEvent
    {
        // return any handlers in your required scope
    }
}
```

### Registering Event Collectors

```csharp
builder.Services.AddShinyMediator(cfg => 
{
    cfg.AddEventCollector<MyEventCollector>();
});
```

:::caution
Event Collectors are registered as singletons in the DI container
:::

### MAUI & Blazor Event Collectors
TODO
    
## Project Structure

Project structure is an important to helping with large applications.  This is where 'vertical slicing' and cross team implementation really gets good!

First off, let's define some template rules/knowledge that we can apply

### Contract Library Layout Template
* Install Shiny.Mediator.Contracts nuget
* Contains simple POCOs (plain old C# classes) or records that implements (logic does not belong here)
    * Shiny.Mediator.IEvent
    * Shiny.Mediator.IRequest (or with result)
* Should not cross reference any other contract libraries

### Module Layout Template
<ul class="list-inside list-disc">
<li>Install Shiny.Mediator to be able to use the IMediator (Shiny.Mediator.IMediator) service where all things begin!</li>
<li>Create Any
    <ul class="list-inside list-disc">
        <li>Request Handlers (Shiny.Mediator.IRequestHandler)</li>
        <li>Event Handlers (Shiny.Mediator.IEventHandler)</li>
        <li>Your extension method to install these services into the dependency injection container (or use the source generator) - Refer to registration documentation</li>
    </ul>
</li>
</ul>

Now, lets take our template from approve and apply to an overall solution


- Main App
    - Setup
        - Install Shiny.Mediator
            - If using .NET MAUI - Install Shiny.Mediator.Maui
            - If using Blazor - Install Shiny.Mediator.Blazor
            - If using Blazor Hybrid - Install Both
        - Reference all modules & contracts defined below
    - Responsibilities
        - Registers the Mediator services using `builder.Services.AddShinyMediator(cfg => ...)`
        - References all Module and Contract Libraries we define below
        - Registers all source generated or manually created extension methods to register your handlers & middleware from your Modules
- Module 1 Contracts
    - Follow 'Contract Library Layout Template'
- Module 1
    - Follow 'Module Layout Template'
    - References
        - Module 1 Contracts
        - Module 2 Contracts (Any other module CONTRACTs - not the module libraries as this will lead to circulator references)
- Module 2
    - Follow 'Module Layout Template'
    - References
        - Module 2 Contracts
        - Module 1 Contracts (Any other module CONTRACTs - not the module libraries as this will lead to circulator references)

## Advanced Dependency Injection

Dependency Injection is pluggable as we use the Microsoft.Extension.DependencyInjection setup to provide our servicing.
That being said, your mileage will vary depending on what your container will support.  We test our apps with 
* DryIoc
* Microsoft Dependency Injection

If you use DI containers outside of this, you will need to do your own test cases!

One of the big value adds for middleware & events is that they support covariance.

```csharp
public record ChildEvent : IEvent;
public record ParentEvent : ChildEvent;
public record GrandParentEvent : ParentEvent;


public class AllFamilyEventHandler : IEventHandler<GrandParentEvent> 
{
    public async Task Handle(GrandParentEvent @event, CancellationToken cancellationToken) 
    {
        // this can actually be 
    }
}


var services = new ServiceCollection();
services.AddSingleton<IEventHandler<>>

```


## Additional Registration Methods (Out of the Box)

We have several methods to help deliver easier registration experiences

You may have an event handler or request handler that handles multiple commands, but you want this "service" to hold state.
Thus, we offer some simple methods to hold that state in scope of a request or publish.

```csharp
using Shiny.Mediator;
using Microsoft.Extensions.DependencyInjection;


public class YourImplementation : IEventHandler<SomeEvent>, IEventHandler<SomeOtherEvent>, IRequestHandler<MyRequest>, IRequestHandler<AnotherRequest> {
    // .. left empty for brevity
}

var services = new ServiceCollection();

services.AddSingletonAsImplementedInterfaces<YourImplementation>();
services.AddScopedAsImplementedInterfaces<YourImplementation>();
services.AddShinyMediator();

var services.BuildServiceProvider();

var e1 = sp.GetRequiredService<IEventHandler<SomeEvent>>();
var e2 = sp.GetRequiredService<IEventHandler<SomeOtherEvent>>();

e1 == e2 // same instance

```

## Suggestions
* You should event/request handlers AND middleware as singletons in apps!
