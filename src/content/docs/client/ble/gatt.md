---
title: Services, Characteristics, & Descriptors
---

GATT collections are all based off the peripheral and are used after you have a connection.

* [Services](#services)
* [Characteristics](#characteristics)
* [Descriptors](#descriptors)

## Services

Once connected to a device, you can initiate service discovery (it is pretty much all you can do against services). 

## Characteristics

This is the main operation points within BLE GATT


### Read Characteristic
```csharp
//TODO
```

### Write Characteristic
```csharp
//TODO
```

### Binary Large Objects (BLOBS) Writes

Generally, writing anything large over BLE is not recommended due to the maximum transmission unit (MTU)

```csharp
//TODO
```

### Notifications

```csharp
// TODO
```

Waiting or checking if a notification is hooked
```csharp
// TODO
```

:::warning
Notifications will stay hooked as long as you hold a subscription to it.  Make sure you dispose of it when you are done
:::

:::note
Unlike previous versions of shiny, we now deal with "rehooking" your subscriptions across connections.  As long as you hold a subscription to a notification characteristic, we'll deal with the junk of restoring it properly.
:::

## Descriptors

Descriptors generally aren't used by Bluetooth LE applications.  They are a child collection off each characterisitcs and have read/write operations
just like characteristics.

#### Read Descriptor
```csharp
//TODO
```


#### Write Descriptor
```csharp
//TODO
```


## Async Methods

TODO