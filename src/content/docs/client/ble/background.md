---
title: Background
---

IBleDelegate

* Monitor the status of the BLE radio
* Monitor connections to peripherals in the background



```csharp
using Shiny.BluetoothLE;

namespace Sample.BleClient;


public class MyBleDelegate : BleDelegate // or IBleDelegate
{
    // full dependency injection supported here
    public MyBleDelegate() 
    {

    }


    public override Task OnAdapterStateChanged(AccessState state) 
    {
        // trigger a notification to a user
        // you can do a scan but it needs to follow some background rules like a service UUID - please review BLE manager for more info
        if (state == AccessState.Available)
        {
            
        }
    }

    public override Task OnPeripheralStateChanged(IPeripheral peripheral)
    {
        if (peripheral.Status == ConnectionState.Connected)
        {
            // you can hook some characteristics here if you want
        }
    }
}

```