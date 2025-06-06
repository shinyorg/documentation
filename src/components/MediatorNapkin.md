Mediator is a behavioral design pattern that lets you reduce chaotic dependencies between objects. The pattern restricts direct communications between the objects and forces them to collaborate only via a mediator object.

Shiny Mediator is a mediator pattern implementation, but for built with ALL .NET apps in mind.  We provide a TON of middleware out-of-box to get you up and rolling with
hardly any effort whatsoever.  Checkout our [Getting Started](/mediator/getting-started) guide to see how easy it is.  Imagine using 1 line of code to add offline, caching, or validation to your code!

## Features
- A Mediator for your ALL .NET Apps
- [Request/Response Handling](/mediator/requests)
- [Event Publication](/mediator/events)
- [Async Enumerable Stream Requests](/mediator/streams)
- Request & event middleware with some great "out of the box" scenarios for your app
- Instead of Assembly Scanning, we have source generators to automatically wireup the necessary registrations for you!
- Think of "weak" message subscriptions without the fuss or mess to cleanup
- Lightweight, No external dependencies, tiny bit of reflection 
- Help remove service overrun and reduce your constructor fat
- Easy to Unit Test
- Built-In Telemetry & Observability via Microsoft.Extensions.Diagnostics
- Checkout our [MAUI](/mediator/extensions/maui), [Blazor](/mediator//extensions/blazor), & [Uno Platform](/mediator/extensions/unoplatform)
    - Integrations allow your viewmodels or pages to implement an IEventHandler interface(s) without them having to participate in the dependency injection provider
    - Middleware built for apps including caching, offline support, & more
    - We still have a "messagingcenter" type subscribe off IMediator for cases where you can't have your current type implement an interface
- Save the Boilerplate + Receive the Power of Middleware
    - [Dapper Extension](/mediator/extensions/dapper) for Easy Query Handling
    - [HTTP Extension](/mediator/extensions/http) for Easy API handling - OpenAPI Contract Generation takes it even one step further
    - Map contracts directly to handlers with our [ASP.NET Extension](/mediator/extensions/aspnet)
    - Plug-in Observability & Telemetry with [Sentry](/mediator/extensions/sentry)     
- [Epic Out-of-the-Box Middleware](/mediator/middleware/)
    - [Offline Data](/mediator/middleware/offline)
    - [Caching](/mediator/middleware/caching)
    - [Resiliency](/mediator/middleware/resilience)
    - [User Exception Handling notifications](/mediator/middleware/usererrornotifications)
    - [Exception Handling](/mediator/exceptionhandlers)
    - [Performance Time Logging](/mediator/middleware/performancelogging)
    - [Main Thread Dispatching](/mediator/middleware/mainthread)
    - [Replayable Streams](/mediator/middleware/replay)
    - [Refresh Timer Streams](/mediator/middleware/refresh)
    - [Command Scheduling](/mediator/middleware/scheduling)

## Works With
- .NET MAUI - all platforms
- Uno Platform - all platforms
- Dapper, ASP.NET, and more
- MVVM Frameworks like Prism, ReactiveUI, & .NET MAUI Shell
- Blazor - Work In Progress
- Any other .NET platform - but you'll have to come up with your own "event collector" for the out-of-state stuff 