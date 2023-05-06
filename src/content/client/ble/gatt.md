---
title: Services, Characteristics, & Descriptors
---

* [Services](#services)
* [Characteristics](#characteristics)
* [Descriptors](#descriptors)

## Services

Once connected to a device, you can initiate service discovery (it is pretty much all you can do against services).  It is important
not to hold a reference to a service in your code as it will be invalidated with new connections.  You can called for WhenServicesDiscovered() 
with or without a connection.  When the device becomes connected, it will initiate the discovery process.  Note that you can call WhenServicesDiscovered() repeatedly
and it will simply replay what has been discovered since the connection occurred.

* Get characteristics

## Characteristics

* Read/Write/Notify TODO
* BLOB writes TODO - Used for sending larger arrays or streams of data without working with the MTU byte gap

## Descriptors
* Read/Write
