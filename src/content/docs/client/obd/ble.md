---
title: BLE Transport
---

The `Shiny.Obd.Ble` package provides a Bluetooth LE transport for communicating with ELM327-compatible OBD adapters using [Shiny.BluetoothLE](https://github.com/shinyorg/shiny).

## Setup

```xml
<PackageReference Include="Shiny.Obd" />
<PackageReference Include="Shiny.Obd.Ble" />
```

## Configuration

OBD BLE adapters expose a GATT service with read (notify) and write characteristics. The UUIDs vary by manufacturer — defaults are set for common ELM327 BLE clones.

```csharp
var config = new BleObdConfiguration
{
    // GATT UUIDs — defaults work for most ELM327 BLE clones
    ServiceUuid = "FFF0",
    ReadCharacteristicUuid = "FFF1",    // notifications (RX from adapter)
    WriteCharacteristicUuid = "FFF2",   // write commands (TX to adapter)

    // Optional: filter scan results by device name
    DeviceNameFilter = "OBDLink",

    // Timeout for a single command response
    CommandTimeout = TimeSpan.FromSeconds(10)
};
```

### Common Adapter UUIDs

| Adapter | Service | Read (RX) | Write (TX) |
|---------|---------|-----------|------------|
| ELM327 BLE clones | `FFF0` | `FFF1` | `FFF2` |
| OBDLink MX+ | Varies | Varies | Varies |
| Vgate iCar Pro | Varies | Varies | Varies |

:::tip
If the defaults don't work, use a BLE scanner app (like nRF Connect) to discover the correct service and characteristic UUIDs for your specific adapter.
:::

## Creating a Transport

### From a Discovered Device (recommended)

Use `BleObdDeviceScanner` to find adapters, then pass the selected device:

```csharp
IBleManager bleManager = /* from DI or Shiny setup */;

var scanner = new BleObdDeviceScanner(bleManager, new BleObdConfiguration
{
    DeviceNameFilter = "OBDII"  // optional: matches any device name containing "OBDII"
});

var cts = new CancellationTokenSource();
var devices = new List<ObdDiscoveredDevice>();

await scanner.Scan(device =>
{
    devices.Add(device);
    Console.WriteLine($"Found: {device.Name} ({device.Id})");
}, cts.Token);

// Connect to a selected device
var transport = new BleObdTransport(devices[0], new BleObdConfiguration());
var connection = new ObdConnection(transport);
await connection.Connect();
```

`BleObdDeviceScanner` deduplicates by peripheral UUID — each device is reported once. Cancel the token to stop scanning.

### Auto-Scan

Let the transport scan for the first device matching your filter:

```csharp
IBleManager bleManager = /* from DI or Shiny setup */;

var transport = new BleObdTransport(bleManager, new BleObdConfiguration
{
    DeviceNameFilter = "OBDII"  // matches any device name containing "OBDII"
});

var connection = new ObdConnection(transport);
await connection.Connect(); // scans, connects, initializes
```

When `DeviceNameFilter` is null, the transport connects to the first BLE device found during scanning.

### Pre-Scanned Peripheral

If you've already discovered the peripheral (e.g. from a scan UI), pass it directly:

```csharp
IPeripheral peripheral = /* from your BLE scan */;

var transport = new BleObdTransport(peripheral, new BleObdConfiguration());
var connection = new ObdConnection(transport);
await connection.Connect(); // connects to known peripheral, initializes
```

## MAUI Setup

Register BLE and the scanner in your `MauiProgram.cs`:

```csharp
using Shiny;
using Shiny.Obd;
using Shiny.Obd.Ble;

var builder = MauiApp.CreateBuilder();
builder.UseMauiApp<App>();

builder.Services.AddBluetoothLE();
builder.Services.AddSingleton(new BleObdConfiguration { DeviceNameFilter = "OBD" });
builder.Services.AddSingleton<IObdDeviceScanner, BleObdDeviceScanner>();
```

:::note
In Shiny.BluetoothLE v4, use `services.AddBluetoothLE()` (namespace `Shiny`). There is no `UseShiny()` or `AddBle()` call needed.
:::

## Full Example

```csharp
using Shiny.Obd;
using Shiny.Obd.Ble;
using Shiny.Obd.Commands;
using Shiny.BluetoothLE;

public class ObdService
{
    readonly IBleManager bleManager;
    IObdConnection? connection;

    public ObdService(IBleManager bleManager)
    {
        this.bleManager = bleManager;
    }

    public async Task Connect(CancellationToken ct = default)
    {
        var transport = new BleObdTransport(this.bleManager, new BleObdConfiguration
        {
            DeviceNameFilter = "OBDLink"
        });
        this.connection = new ObdConnection(transport);
        await this.connection.Connect(ct);
    }

    public async Task<DashboardData> ReadDashboard(CancellationToken ct = default)
    {
        if (this.connection == null || !this.connection.IsConnected)
            throw new InvalidOperationException("Not connected");

        return new DashboardData
        {
            Speed = await this.connection.Execute(StandardCommands.VehicleSpeed, ct),
            Rpm = await this.connection.Execute(StandardCommands.EngineRpm, ct),
            CoolantTemp = await this.connection.Execute(StandardCommands.CoolantTemperature, ct),
            FuelLevel = await this.connection.Execute(StandardCommands.FuelLevel, ct),
            ThrottlePosition = await this.connection.Execute(StandardCommands.ThrottlePosition, ct)
        };
    }

    public async Task Disconnect()
    {
        if (this.connection != null)
        {
            await this.connection.Disconnect();
            await this.connection.DisposeAsync();
            this.connection = null;
        }
    }
}

public class DashboardData
{
    public int Speed { get; set; }
    public int Rpm { get; set; }
    public int CoolantTemp { get; set; }
    public double FuelLevel { get; set; }
    public double ThrottlePosition { get; set; }
}
```

## How It Works

The BLE transport:

1. **Scans** for a peripheral matching the configured service UUID and optional device name filter (or uses a pre-provided peripheral / discovered device)
2. **Connects** using Shiny's task-based `ConnectAsync`
3. **Subscribes** to notifications on the read characteristic via `NotifyCharacteristic`
4. **Sends commands** by writing bytes to the write characteristic via `WriteCharacteristicAsync`
5. **Collects response** bytes from notifications into a buffer until the ELM327 `>` prompt is received
6. **Returns** the complete response string

Commands are serialized with a semaphore — only one command executes at a time, which matches the ELM327's single-threaded request-response protocol.
