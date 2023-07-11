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

* Read/Write/Notify TODO
* BLOB writes TODO - Used for sending larger arrays or streams of data without working with the MTU byte gap

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