---
title: Getting Started
---

Shiny.Obd is a .NET library for communicating with vehicles through OBD-II (On-Board Diagnostics) adapters. It uses a command-object pattern with generic return types, pluggable transports, and adapter auto-detection.

## Features

- **Command-object pattern** — OBD commands are objects, not methods. Pass built-in commands or create your own for custom PIDs.
- **Generic return types** — each command declares its return type (`int`, `double`, `string`, `TimeSpan`, etc.) with compile-time safety.
- **Pluggable transports** — `IObdTransport` abstracts the communication channel. Ships with BLE; add WiFi or USB later.
- **Adapter auto-detection** — detects ELM327 vs OBDLink (STN) adapters via ATI and runs the appropriate initialization sequence.
- **Task-based async** — fully async/await throughout, no Reactive Extensions required in consuming code.
- **9 standard commands included** — speed, RPM, coolant temp, throttle, fuel level, engine load, intake air temp, runtime, and VIN.

## Packages

| Package | Target | Description |
|---------|--------|-------------|
| `Shiny.Obd` | `netstandard2.1` | Core library — commands, connection, transport abstraction |
| `Shiny.Obd.Ble` | `net10.0` | BLE transport using Shiny.BluetoothLE |

## Quick Start

```xml
<PackageReference Include="Shiny.Obd" />
<PackageReference Include="Shiny.Obd.Ble" />
```

```csharp
using Shiny.Obd;
using Shiny.Obd.Ble;
using Shiny.Obd.Commands;

// Create BLE transport
var transport = new BleObdTransport(bleManager, new BleObdConfiguration
{
    DeviceNameFilter = "OBDLink"
});

// Create connection (auto-detects adapter type)
var connection = new ObdConnection(transport);
await connection.Connect();

// Execute commands
var speed = await connection.Execute(StandardCommands.VehicleSpeed);    // int (km/h)
var rpm = await connection.Execute(StandardCommands.EngineRpm);        // int
var vin = await connection.Execute(StandardCommands.Vin);              // string
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│                 Your App                        │
│   await connection.Execute(StandardCommands.*)  │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              ObdConnection                      │
│  • Adapter detection (ATI probe)                │
│  • Profile-based initialization                 │
│  • ELM327 response parsing (hex → bytes)        │
│  • Error handling (NO DATA, UNABLE TO CONNECT)  │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│             IObdTransport                       │
│  Pluggable transport layer                      │
│  ┌────────────────┐  ┌────────┐  ┌─────────┐   │
│  │ BleObdTransport│  │ WiFi   │  │  USB    │   │
│  │ (Shiny BLE)    │  │(future)│  │(future) │   │
│  └────────────────┘  └────────┘  └─────────┘   │
└─────────────────────────────────────────────────┘
```
