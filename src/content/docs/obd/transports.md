---
title: Custom Transports
---

The `IObdTransport` interface abstracts the communication channel between your app and the OBD adapter. The library ships with [BLE](/client/obd/ble), [WiFi](/client/obd/wifi) and [serial (USB/UART)](/client/obd/serial) — between them they cover every adapter on the market, so reach for a custom transport only for a channel none of them handles: the Android USB Host API, a J2534 pass-thru box, or a replay harness over a recorded session.

For transports that support discovery, implement `IObdDeviceScanner` as well:

```csharp
public interface IObdDeviceScanner
{
    Task Scan(Action<ObdDiscoveredDevice> onDeviceFound, CancellationToken ct = default);
}
```

## IObdTransport Interface

```csharp
public interface IObdTransport : IAsyncDisposable
{
    bool IsConnected { get; }
    Task Connect(CancellationToken ct = default);
    Task Disconnect();
    Task<string> Send(string command, CancellationToken ct = default);
}
```

### Send Contract

The `Send` method must:

1. Write the command string to the adapter (the string already includes the trailing `\r` added by `ObdConnection`)
2. Read the response until the ELM327 `>` prompt character
3. Return the response text **without** the `>` prompt

## Reference implementations

Rather than writing one from scratch, read the shipped transports — they solve the problems a first
implementation usually misses:

| Transport | Package | Worth reading for |
|-----------|---------|-------------------|
| [WiFi](/client/obd/wifi) | `Shiny.Obd.Wifi` | The clearest of the three — a socket, a read pump, prompt framing |
| [Serial](/client/obd/serial) | `Shiny.Obd.Serial` | Device enumeration and connect-time probing |
| [BLE](/client/obd/ble) | `Shiny.Obd.Ble` | Chunked writes and notification reassembly |

## Things a transport has to get right

These are not theoretical — each one is a bug that shipped in an early transport here.

**Read continuously, don't read once per command.** An ELM327 does not answer in a single write. A
multi-frame CAN reply arrives in several chunks, and the adapter emits unsolicited text of its own
(the reset banner, `SEARCHING...`). Run a read pump that appends to a buffer and completes the
pending exchange when it sees `>`.

**Clear the pending exchange when a command ends, however it ends.** If a timed-out command's reply
arrives later and is allowed to complete the *next* command's wait, every response after it is off by
one and the session never recovers on its own. Clear it in a `finally`, before releasing the send
lock.

**Fail the waiter when the link dies.** If the channel drops mid-command, complete the pending
exchange with an exception rather than letting the caller sit out the full command timeout for a
reply that can never arrive.

**Serialise commands.** One exchange at a time, behind a `SemaphoreSlim`. Do not dispose that
semaphore on teardown — a pending `Send` would get an `ObjectDisposedException` in the caller's face.

**Report a timeout as `ObdTimeoutException`, never `OperationCanceledException`.** A polling caller
cannot otherwise tell one slow reply from its own shutdown, and will tear the loop down.

**Implement `IDisposable` as well as `IAsyncDisposable`.** A DI container checks the concrete type for
`IDisposable` on its synchronous teardown path and throws if it finds none.

## Testing with a Fake Transport

Use a fake transport for unit testing your OBD code without a real adapter:

```csharp
public class FakeObdTransport : IObdTransport
{
    readonly Dictionary<string, string> responses = new();
    public bool IsConnected { get; private set; }

    public FakeObdTransport AddResponse(string command, string response)
    {
        this.responses[command.TrimEnd('\r') + "\r"] = response;
        return this;
    }

    public Task Connect(CancellationToken ct = default)
    {
        this.IsConnected = true;
        return Task.CompletedTask;
    }

    public Task Disconnect()
    {
        this.IsConnected = false;
        return Task.CompletedTask;
    }

    public Task<string> Send(string command, CancellationToken ct = default)
    {
        if (this.responses.TryGetValue(command, out var response))
            return Task.FromResult(response);

        return Task.FromResult("OK");
    }

    public ValueTask DisposeAsync() => default;
}
```

### Usage in Tests

```csharp
var transport = new FakeObdTransport()
    .AddResponse("010D", "41 0D 50")       // 80 km/h
    .AddResponse("010C", "41 0C 0B B8")    // 750 RPM
    .AddResponse("ATI", "ELM327 v1.5");

var connection = new ObdConnection(transport);
await connection.Connect();

var speed = await connection.Execute(StandardCommands.VehicleSpeed);
Assert.Equal(80, speed);
```
