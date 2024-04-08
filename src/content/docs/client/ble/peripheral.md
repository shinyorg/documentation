---
title: Peripheral
---

This section deals with gatt connections and state monitoring for a peripheral.
You should maintain a reference to a peripheral if you intend to connect to it.

Once you have scanned and found your peripheral, you can move on to connecting to it.  BLE operates on something called GATT (Generic Attributes).  

GATT is composed of 3 components
1. Services - this is a logical grouping of characteristics
2. Characteristics - this is the MAIN area of things that you will work with.  This is where the reading, writing, & notifications take place
3. Descriptors - these are less important in terms of use cases, but do support read/write scenarios.  They are grouped under each characteristic

## Connecting

Connect simply issues a request to connect.  It may connect now or days from now when the peripheral is nearby.  You should use IBleCentralDelegate when using this method.  We'll talk more about that later

```csharp
peripheral.Connect();
```

If you need to wait for a connection and you know your peripheral is nearby, you can use 

```csharp
await peripheral.ConnectAsync();
```

It is important to put your own timeout on these things using RX Timeout or supplying a cancellation token as shown below

```csharp
// this will throw an exception if it times out
await peripheral.Timeout(TimeSpan.FromSeconds(10)).WithConnectIf();

// or supply your own cancellation token
var cancelSource = new CancellationTokenSource();
await peripheral.ConnectAsync(cancelSource.Token);

cancelSource.Cancel();
```

### Android Connection Control

Using AutoConnect is suggested in scenarios where you don't know if the device is in-range
This will cause Android to connect when it sees the device.  WARNING: initial connections take much
longer with this option enabled

```csharp


IPeripheral peripheral; // scanned peripheral
device.Connect(new AndroidConnectionConfig {
	AutoConnect = true,
    ConnectionPriority = Android.Bluetooth.GattConnectionPriority.Balanced
});
```

## Cancelling Connection
Even if you are not connected, it is especially important to cancel the connection request or the peripheral will continue to try to connect.

```csharp
// this will disconnect a current connection, cancel a connection attempt, and
// remove persistent connections
peripheral.CancelConnection();
```

## Reliable Write Transactions (Android Only)


```csharp
using (var trans = peripheral.BeginReliableWriteTransaction()) 
{
    await trans.Write(theCharacteristicToWriteTo, bytes);
    // you should do multiple writes here as that is the reason for this mechanism
    trans.Commit();
}
```


## Pairing (Android Only)

```csharp
if (peripheral.IsPairingRequestSupported && peripheral.PairingStatus != PairingStatus.Paired) 
{
    // there is an optional argument to pass a PIN in PairRequest as well
    peripheral.PairRequest().Subscribe(isSuccessful => {});
}
```
## Request MTU (Max Transmission Unit)
If MTU requests are available (Android Only - API 21+)

This is specific to Android only where this negotiation is not automatic.
The size can be up to 512, but you should be careful with anything above 255 in practice
```csharp
// iOS will return current, Android will return 20 unless changes are observed
await peripheral.TryRequestMtuAsync(255);

// iOS will return current value and return, Android will continue to monitor changes
peripheral.TryRequestMtu(255).Subscribe(x => {});
```

## Monitor Connection Status Changes

```csharp
// this will watch the connection states to the peripheral
peripheral.WhenConnected().Subscribe(x => {});
peripheral.WhenDisconnected().Subscribe(x => {});
peripheral.WhenStatusChanged().Subscribe(connectionState => {});

```