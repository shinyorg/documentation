---
title: Source Generator
---

## Overview

`Shiny.BluetoothLE.Hosting` ships a Roslyn source generator that turns attributes on a `partial class`
into the imperative `AddService(...)` / `OpenL2Cap(...)` calls described on the [GATT Service](./gatt)
and [L2CAP](./l2cap) pages. It emits no reflection, so it stays AOT- and trim-safe.

The generator is inside the same NuGet package under `analyzers/dotnet/cs` — there is nothing extra
to install.

It replaces the old reflection-based managed pattern (`BleGattCharacteristic`,
`[BleGattCharacteristic]`, `AddBleHostedCharacteristic<T>`, `AttachRegisteredServices`) that was
removed in 5.0.0.

## A GATT service

```csharp
using Shiny.BluetoothLE.Hosting;

[BleService("180D", Advertise = true, Name = "HeartRate")]
public partial class HeartRateService(IHeartRateSensor sensor)
{
    [ReadCharacteristic("2A37")]
    Task<byte[]> ReadMeasurement(HeartRateServiceContext context)
        => Task.FromResult(new byte[] { 0x00, sensor.Read(context.User) });

    [NotifyCharacteristic("2A37", Name = "Measurement", Indicate = true)]
    Task OnMeasurementSubscription(BleSubscription subscription, HeartRateServiceContext context)
        => Task.CompletedTask;

    [WriteCharacteristic("2A39")]
    Task<GattState> ControlPoint(byte[] data, int offset, HeartRateServiceContext context)
        => Task.FromResult(offset == 0 ? GattState.Success : GattState.InvalidOffset);

    [RequestResponseCharacteristic("2A3B", Name = "Command")]
    Task<byte[]> Exchange(byte[] request, CancellationToken cancellationToken) => Handle(request);
}
```

Generated onto the class:

```csharp
public const string BleServiceUuid;
public CancellationToken BleHostToken { get; }   // cancelled on teardown
public IGattService? BleService { get; }

// one trio per notify-capable characteristic
public Task NotifyMeasurement(byte[] data, params IPeripheral[] centrals);
public IReadOnlyList<IPeripheral> MeasurementSubscribers { get; }
public bool HasMeasurementSubscribers { get; }

// opt-in: implement in your half of the class, or the compiler drops the call
partial void OnBleHandlerError(string characteristicUuid, Exception exception);
partial void OnBleResponseDropped(string characteristicUuid, IPeripheral peripheral, byte[] data);
```

## Registration

```csharp
builder.Services.AddBluetoothLeHosting();
builder.Services.AddBleHostedServices();          // generated

// at runtime
await using var session = await hosting.AttachBleHostedServices(serviceProvider);
await hosting.StartBleHostedAdvertising("MyDevice");
```

`AttachBleHostedServices` opens the L2CAP listeners, issues one `AddService` per distinct service
UUID, and returns a `BleHostedServiceSession`. Disposing it cancels in-flight handlers, closes the
listeners, and removes the services.

A-la-carte overloads are generated too — `AddHeartRate(manager, …)` per service and
`AddEchoStream(manager, streamService)` per L2CAP listener. The DI members are only emitted when your
project references `Microsoft.Extensions.DependencyInjection.Abstractions`.

## Handler signatures

Parameters bind **by type, in any order, any subset** — none are required. Every return may be
wrapped in `Task<>` or `ValueTask<>`.

| Kind | Bindable parameters | Allowed returns |
|---|---|---|
| Read | `ReadRequest`, `{Service}Context`, `IPeripheral`, `IGattCharacteristic`, `int` (offset), `CancellationToken` | `byte[]`, `GattResult` |
| Write | `byte[]` (data), `WriteRequest`, `{Service}Context`, `IPeripheral`, `IGattCharacteristic`, `int` (offset), `bool` (IsReplyNeeded), `CancellationToken` | `void`, `GattState` |
| RequestResponse | same as Write | `byte[]`, `GattResult` |
| Notify hook | `BleSubscription`, `CharacteristicSubscription`, `{Service}Context`, `IPeripheral`, `IGattCharacteristic`, `bool` (IsSubscribing), `CancellationToken` | `void` |
| `[OnChannelOpened]` | `L2CapChannel`, `BleL2CapContext`, `CancellationToken` | `void` |

### Responses and offsets

- A read returning `byte[]` is wrapped in `GattResult.Success`. Returning `GattResult` passes through
  so you own the `GattState`. An unhandled exception becomes `GattResult.Error(GattState.Failure)`.
- A write returning nothing responds `GattState.Success`, or `Failure` if it threw — but **only when
  `WriteRequest.IsReplyNeeded`**. Returning `GattState` responds that value instead.
- Declaring an `int` parameter binds the request offset; declaring the full `ReadRequest` /
  `WriteRequest` gives you everything including `Respond`.
- To answer the central yourself, set `[WriteCharacteristic(..., ManualRespond = true)]` and take a
  `WriteRequest`. It is opt-in rather than inferred, because responding twice to one request is
  undefined across platforms.

### Request/response

A GATT write response cannot carry a payload, so the handler's result is pushed back to the writing
central as a notification on the same characteristic (registered `Write | Notify`). That central must
be subscribed before writing — otherwise `OnBleResponseDropped` fires and the reply is discarded.

## The per-central context

One `{ServiceClass}Context` is generated per `[BleService]` class, created lazily the first time a
central touches the service and held for as long as Shiny caches that `IPeripheral`. It is a
`partial class`, so you stamp your own properties onto it and they flow through every handler:

```csharp
public partial class HeartRateServiceContext
{
    public AuthUser? User { get; set; }
}
```

The generated half gives you `Peripheral`, `ConnectionId`, `Mtu` (the usable payload per GATT
operation - the negotiated ATT MTU minus the 3-byte ATT header, so cap notifications at it directly
rather than subtracting the header again), `ServiceUuid`, `Service`, and a loosely typed `Items` bag. Handlers opt in by declaring it as a parameter — no `AsyncLocal`, nothing
reflective. You do not have to declare your own half for the parameter to bind.

## L2CAP listeners

```csharp
[L2CapService(Secure = false, PsmService = "180D", PsmCharacteristic = "2ABC", Name = "EchoStream")]
public partial class StreamService
{
    [OnChannelOpened]
    async Task Echo(L2CapChannel channel, BleL2CapContext context, CancellationToken cancellationToken)
    {
        await foreach (var buffer in channel.ReadAll(cancellationToken))
            await channel.Write(buffer).ToTask(cancellationToken);
    }
}
```

The generator owns the listener, runs one handler per accepted central, disposes the channel when the
handler returns, and exposes `Psm` / `IsListening`. `OnL2CapChannelError` is an opt-in `partial void`.

`PsmService` + `PsmCharacteristic` publish the assigned PSM as a read characteristic (two
little-endian bytes) on a `[BleService]` in the same compilation — a central has no other in-band way
to learn it. Listeners are opened **before** `AddService`, so an immediate read returns a live value.

`channel.ReadAll(cancellationToken)` is an `IAsyncEnumerable` convenience over the Rx `DataReceived`
observable. L2CAP CoC is a byte stream, not a message bus — frame it yourself if you need boundaries.

## Sharing a service UUID

`BleHostingManager` keys its services by UUID, so the same UUID cannot be registered twice at runtime.
Several classes **may** declare the same service UUID — the generator merges them into one
`AddService` call:

```csharp
[BleService("180D", Advertise = true, Name = "HeartRate")]
public partial class HeartRateService { /* 2A37, 2A39 */ }

[BleService("180D")]
public partial class HeartExtras { /* 2A38 */ }
```

Declaring the same characteristic UUID in two merged classes is a compile error (`SBH010`). An
explicit `Name` on any member names the whole group.

## UUID normalization

Every UUID is emitted in the full 128-bit form. Shiny's Apple backend goes through
`CBUUID.FromString`, which accepts short forms, but the Android backend goes through
`java.util.UUID.fromString`, which does not — a `"180D"` that works on iOS throws on Android. The
generator normalizes for you; if you call `AddService` directly, always write the full 128-bit UUID.

## Diagnostics

| ID | Severity | Rule |
|---|---|---|
| SBH001 | Error | Type must be a top-level, non-generic, non-static `partial class` |
| SBH002 | Error | Invalid Bluetooth UUID |
| SBH003 | Error | Characteristic handler on a type with no `[BleService]` |
| SBH004 | Error | Two handlers of the same kind for one characteristic |
| SBH005 | Error | `[RequestResponseCharacteristic]` collides with a write or notify handler |
| SBH006 | Error | Unsupported handler signature |
| SBH007 | Error | Handler is static, abstract, generic, or uses `ref`/`out`/`in` |
| SBH008 | Error | Invalid or dangling L2CAP PSM publication |
| SBH009 | Error | `[L2CapService]` needs exactly one `[OnChannelOpened]` |
| SBH010 | Error | One characteristic declared by two classes merging into one service |
| SBH011 | Warning | Merged services disagree on `Primary` — the first declaration wins |
| SBH012 | Warning | Write/notify option combination is not expressible |
| SBH013 | Error | `ManualRespond` needs a `WriteRequest` parameter and no `GattState` return |
| SBH014 | Error | Class-level `[NotifyCharacteristic]` needs a `Name` |

Read + notify on one UUID is legal and expected (battery level is the canonical case) — `SBH004` is
per handler *kind*, not per UUID.

`SBH012` exists because `WriteOptions` and `NotificationOptions` are `[Flags]` enums whose members
have no explicit values (`Write = 0`, `Notify = 0`), so only one member can actually be selected. The
attributes therefore expose booleans and the generator picks a single enum value, preferring the
security flag — quietly dropping encryption is worse than the wrong write mode, which a central
notices immediately.
