---
title: Background Operations
---

## Overview

Shiny BLE supports background operations through delegates. These fire when Bluetooth events occur even when your app is in the background.

## IBleDelegate

The `IBleDelegate` interface receives adapter state and peripheral connection events in the background.

```csharp
public class MyBleDelegate : BleDelegate
{
    readonly ILogger<MyBleDelegate> logger;

    public MyBleDelegate(ILogger<MyBleDelegate> logger)
    {
        this.logger = logger;
    }

    public override Task OnAdapterStateChanged(AccessState state)
    {
        this.logger.LogInformation("BLE Adapter State: {State}", state);
        return Task.CompletedTask;
    }

    public override Task OnPeripheralStateChanged(IPeripheral peripheral)
    {
        this.logger.LogInformation(
            "Peripheral {Name} ({Uuid}) - {Status}",
            peripheral.Name,
            peripheral.Uuid,
            peripheral.Status
        );
        return Task.CompletedTask;
    }
}
```

:::note
`BleDelegate` is a convenience base class that provides virtual no-op implementations. You can implement `IBleDelegate` directly if preferred.
:::

## Registration

Register your delegate during startup:

```csharp
services.AddBluetoothLE<MyBleDelegate>();
```

## When to Use Delegates vs Observables

| Scenario | Use |
|----------|-----|
| Respond to events while app is backgrounded | Delegate |
| Monitor connection state while app is in foreground | `WhenStatusChanged()` observable |
| React to adapter on/off changes globally | Delegate |
| UI-bound connection monitoring | Observable |
