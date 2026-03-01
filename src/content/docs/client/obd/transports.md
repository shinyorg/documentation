---
title: Custom Transports
---

The `IObdTransport` interface abstracts the communication channel between your app and the OBD adapter. The library ships with BLE, but you can implement WiFi, USB, or any other transport.

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

## WiFi Transport Example

Many ELM327 adapters expose a TCP socket (typically `192.168.0.10:35000`):

```csharp
using System.Net.Sockets;
using System.Text;

public class WifiObdTransport : IObdTransport
{
    readonly string host;
    readonly int port;
    TcpClient? client;
    NetworkStream? stream;

    public WifiObdTransport(string host = "192.168.0.10", int port = 35000)
    {
        this.host = host;
        this.port = port;
    }

    public bool IsConnected => this.client?.Connected ?? false;

    public async Task Connect(CancellationToken ct = default)
    {
        this.client = new TcpClient();
        await this.client.ConnectAsync(this.host, this.port, ct);
        this.stream = this.client.GetStream();
    }

    public Task Disconnect()
    {
        this.stream?.Dispose();
        this.client?.Dispose();
        this.stream = null;
        this.client = null;
        return Task.CompletedTask;
    }

    public async Task<string> Send(string command, CancellationToken ct = default)
    {
        if (this.stream == null)
            throw new ObdException("Not connected");

        var bytes = Encoding.ASCII.GetBytes(command);
        await this.stream.WriteAsync(bytes, ct);

        var buffer = new StringBuilder();
        var readBuffer = new byte[1024];

        while (true)
        {
            var count = await this.stream.ReadAsync(readBuffer, ct);
            var text = Encoding.ASCII.GetString(readBuffer, 0, count);
            buffer.Append(text);

            if (text.Contains('>'))
            {
                return buffer.ToString().Replace(">", "").Trim();
            }
        }
    }

    public ValueTask DisposeAsync()
    {
        this.stream?.Dispose();
        this.client?.Dispose();
        return default;
    }
}
```

### Usage

```csharp
var transport = new WifiObdTransport("192.168.0.10", 35000);
var connection = new ObdConnection(transport);
await connection.Connect();

var speed = await connection.Execute(StandardCommands.VehicleSpeed);
```

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
