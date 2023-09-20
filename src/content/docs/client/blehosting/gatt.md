---
title: GATT Service
---

# Peripheral Manager (GATT Server)

This allows you to accept client connections

Each OS has different limitations and functions

**On iOS - you need to advertise as well as create a gatt server**

# Services

Services are nothing more than categories in the overall perspective of BluetoothLE.  You should be aware that
you must setup all characters & descriptors that belong to a service BEFORE starting advertising or adding a service
to a running server!

You should always know your service UUID for future client consumption!

From a functionality perspective, there is not a lot you do with services

## General Setup

After creating your server instance and a service, you can do the following:

You should always assign a known GUID ID to your characteristic in order for your GATT service to be consumed by a client.

Below are examples of a basic read/write characteristic and a notification characteristic setup

```csharp
var service = CrossBleAdapter.Current.AddService(new Guid(...));

var characteristic = service.AddCharacteristic(
    Guid.NewGuid(),
    CharacteristicProperties.Read | CharacteristicProperties.Write | CharacteristicProperties.WriteWithoutResponse,
    GattPermissions.Read | GattPermissions.Write
);

var notifyCharacteristic = service.AddCharacteristic
(
    Guid.NewGuid(),
    CharacteristicProperties.Indicate | CharacteristicProperties.Notify,
    GattPermissions.Read | GattPermissions.Write
);

```

## Setup a Service

These are the heart and soul of BLE.  This is where data is exchanged between client & server

```csharp
 await hostingManager.AddService(
    "Your Service UUID",
    true,
    sb =>
    {
        byte[]? currentData = null;

        var notifier = sb.AddCharacteristic("Your NotifyCharacteristicUuid" , x => x.SetNotification(sub =>
        {
            var smsg = sub.IsSubscribing ? "Subscribed" : "UnSubscribed";
            this.Log($"{sub.Peripheral.Uuid} {smsg} to Characteristic");

            return Task.CompletedTask;
        }));

        sb.AddCharacteristic(BleConfiguration.ReadCharacteristicUuid, x => x.SetRead(request =>
        {
            var data = currentData ?? new byte[] { 0x0 };
            this.Log($"{request.Peripheral.Uuid} Read Characteristic", data);

            return Task.FromResult(GattResult.Success(data));
        }));

        sb.AddCharacteristic(BleConfiguration.WriteCharacteristicUuid, cb => cb.SetWrite(async request =>
        {
            currentData = request.Data;
            this.Log($"{request.Peripheral.Uuid} Wrote to Characteristic", request.Data);

            if (notifier.SubscribedCentrals.Count > 0)
            {
                await notifier.Notify(request.Data);
                this.Log("Notification Broadcasted to subscribers");
            }
        }, WriteOptions.Write | WriteOptions.WriteWithoutResponse));
    }
);

```


## Managed Characteristic

A managed characteristic as shown below, respresents a single characteristic but multiple operations

```csharp
[BleGattCharacteristic("Your Service UUID", "Your Characteristic UUID")]
public class MyManagedCharacteristics : BleGattCharacteristic
{
    readonly SampleSqliteConnection conn;

    public MyManagedCharacteristics(SampleSqliteConnection conn)
        => this.conn = conn;

    // setup any initial wiring before the characteristic is started
    public override Task OnStart()
    {
        return Task.Completed;
    }

    // cleanup any resources/timers/etc you may have had running
    public override void OnStop() => base.OnStop();

    // override this to make your characteristic readable
    public override Task<GattResult> OnRead(ReadRequest request) => base.OnRead(request);

    // override this to make your characteristic writeable
    public override Task OnWrite(WriteRequest request) => base.OnWrite(request);

    // override this to make your characteristic notify based
    public override Task OnSubscriptionChanged(IPeripheral peripheral, bool subscribed) => base.OnSubscriptionChanged(peripheral, subscribed);
}

```

To register your managed characteristic, during your host building operation (ie. MauiProgram.cs), add the following:

```csharp
builder.Services.AddBleHostedCharacteristic<MyManagedCharacteristics>();
```

And lastly to start/stop your managed characteristic
```csharp
// now inject/resolve the Shiny.BluetoothLE.Hosting.IBleHostingManager and now you can toggle on/off
Shiny.BluetoothLE.Hosting.IBleHostingManager hostingManager;
if (hostingManager.IsRegisteredServicesAttached)
{
    hostingManager.DetachRegisteredServices();
}
else
{
    await hostingManager.AttachRegisteredServices();
}
```