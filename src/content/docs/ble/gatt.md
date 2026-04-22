---
title: Services, Characteristics, & Descriptors
---

## Overview

GATT (Generic Attribute Profile) defines how BLE devices exchange data. The hierarchy is:
- **Service** — A collection of related characteristics
- **Characteristic** — A data value with read/write/notify properties
- **Descriptor** — Metadata about a characteristic

In Shiny v4, all GATT operations are performed directly on `IPeripheral` using service and characteristic UUIDs — no need to dig through nested GATT objects.

## Service Discovery

```csharp
IPeripheral peripheral; // connected peripheral

// Get all services
var services = await peripheral.GetServicesAsync();
foreach (var svc in services)
{
    Console.WriteLine($"Service: {svc.Uuid}");
}

// Get a specific service
var service = await peripheral.GetServiceAsync("180D");
```

## Characteristics

### Discovering Characteristics

```csharp
// Get all characteristics for a service
var characteristics = await peripheral.GetCharacteristicsAsync("180D");
foreach (var ch in characteristics)
{
    Console.WriteLine($"Char: {ch.Uuid}, Properties: {ch.Properties}");
}

// Get all characteristics across all services
var all = await peripheral.GetAllCharacteristicsAsync();
```

### Reading

```csharp
// Reactive
peripheral
    .ReadCharacteristic("180D", "2A37")
    .Subscribe(result =>
    {
        var data = result.Data;
    });

// Async
var result = await peripheral.ReadCharacteristicAsync("180D", "2A37");
var data = result.Data;
```

### Writing

```csharp
var data = new byte[] { 0x01, 0x02 };

// Write with response (default)
peripheral
    .WriteCharacteristic("service-uuid", "char-uuid", data, withResponse: true)
    .Subscribe(result => { });

// Write without response
peripheral
    .WriteCharacteristic("service-uuid", "char-uuid", data, withResponse: false)
    .Subscribe(result => { });

// Async
await peripheral.WriteCharacteristicAsync("service-uuid", "char-uuid", data);
```

### BLOB Writes

For writing data larger than the MTU, use blob writes which automatically chunk the data.

```csharp
using var stream = File.OpenRead("data.bin");

peripheral
    .WriteCharacteristicBlob("service-uuid", "char-uuid", stream)
    .Subscribe(segment =>
    {
        Console.WriteLine($"Sent {segment.Position}/{segment.TotalLength}");
    });
```

### Notifications

Subscribe to characteristic value changes.

```csharp
// Subscribe to notifications (auto-reconnects if observable stays hooked)
peripheral
    .NotifyCharacteristic("180D", "2A37")
    .Subscribe(result =>
    {
        var data = result.Data;
        // Process incoming notification data
    });
```

:::note
Notifications auto-reconnect if the connection drops and the observable subscription is still active.
:::

### Subscription Changes

Watch when notification subscriptions change on a characteristic.

```csharp
peripheral
    .WhenCharacteristicSubscriptionChanged("service-uuid", "char-uuid")
    .Subscribe(info =>
    {
        Console.WriteLine($"IsNotifying: {info.IsNotifying}");
    });
```

### Checking Characteristic Properties

```csharp
var ch = await peripheral.GetCharacteristicAsync("service-uuid", "char-uuid");

if (ch.CanRead()) { /* read supported */ }
if (ch.CanWrite()) { /* write supported */ }
if (ch.CanWriteWithoutResponse()) { /* write without response */ }
if (ch.CanNotifyOrIndicate()) { /* notifications supported */ }
```

## Descriptors

```csharp
// Get descriptors for a characteristic
var descriptors = await peripheral.GetDescriptorsAsync("service-uuid", "char-uuid");

// Read a descriptor
var result = await peripheral.ReadDescriptorAsync("service-uuid", "char-uuid", "descriptor-uuid");
var data = result.Data;

// Write a descriptor
await peripheral.WriteDescriptorAsync("service-uuid", "char-uuid", "descriptor-uuid", new byte[] { 0x01 });
```

## Standard Services

Shiny provides built-in helpers for common BLE services.

```csharp
// Read device information (service 180A)
var deviceInfo = await peripheral.ReadDeviceInformationAsync();
Console.WriteLine($"Manufacturer: {deviceInfo.ManufacturerName}");
Console.WriteLine($"Model: {deviceInfo.ModelNumber}");
Console.WriteLine($"Firmware: {deviceInfo.FirmwareRevision}");

// Read battery level (service 180F)
var battery = await peripheral.ReadBatteryInformation().ToTask();
Console.WriteLine($"Battery: {battery}%");

// Heart rate sensor (service 180D)
peripheral
    .HeartRateSensor()
    .Subscribe(bpm => Console.WriteLine($"Heart Rate: {bpm} BPM"));
```

## Reliable Write Transactions (Android Only)

```csharp
var transaction = peripheral.TryBeginTransaction();
if (transaction != null)
{
    await transaction
        .Write(peripheral, "service-uuid", "char-uuid", data1)
        .ToTask();
    await transaction
        .Write(peripheral, "service-uuid", "char-uuid2", data2)
        .ToTask();

    // Commit all writes atomically
    await transaction.Commit().ToTask();

    // Or abort
    // transaction.Abort();

    transaction.Dispose();
}
```
