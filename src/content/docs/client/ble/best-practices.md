---
title: Best Practices & FAQ
---

## General Rules

:::warning
Always use `.Timeout(TimeSpan.FromSeconds(X))` on BLE observables. Android can hang on certain calls if a connection drops mid-operation.
:::

While Shiny handles many known Android BLE issues internally, following these rules will save you from common pitfalls:

| # | Rule |
|---|------|
| 1 | **Don't hold peripheral references across scans** unless the device is connected. |
| 2 | **Don't scan while connected** to a GATT server — avoid overlapping radio operations. |
| 3 | **Don't overwhelm the radio.** Shiny queues operations internally, but rapid-fire calls still cause issues. |
| 4 | **Expect GATT 133 errors** on connect. Catch exceptions in your observable subscriptions. |
| 5 | **Keep payloads small.** BLE is not designed for large data or JSON — use compact binary formats. |
| 6 | **Always scan with a Service UUID filter.** Unfiltered scans return every BLE device nearby and drain battery. |
| 7 | **Don't discover all services & characteristics.** Only query the ones you need — full discovery has a real performance cost. |

---

## FAQ

:::tip[Can I use `IPeripheral.Uuid` to identify my device across app restarts?]
**If the device is paired** — yes, the UUID is stable.

**If the device is NOT paired** — no. Treat UUIDs as valid only for the current scan session. Use manufacturer data or advertised service UUIDs to identify your peripherals instead.
:::

:::note[Why is there no `IBleManager.WhenStatusChanged` observable for adapter state?]
Adapter state changes typically happen when your app is fully backgrounded (e.g., the user toggled Bluetooth in system settings), not during active use. Observable subscriptions don't survive app sleep/restart cycles.

Use `IBleDelegate.OnAdapterStateChanged` instead — it fires reliably even when your app restarts in the background.
:::

:::note[Why does `RequestAccess` cover both adapter state and permissions?]
You'd always need to check both before starting any BLE operation. `RequestAccess` combines them into a single call, and the `AccessState` result tells you exactly what's happening — whether the adapter is off, permissions are denied, or everything is ready. This pattern is consistent across all Shiny libraries.
:::
