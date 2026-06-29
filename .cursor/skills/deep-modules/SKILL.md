---
name: deep-modules
description: Applies the deep-module design lens from “A Philosophy of Software Design”—prefer small interfaces that hide rich behavior; flag shallow pass-through APIs. Use when designing modules, classes, repositories, Logic services, route handlers, public APIs, or refactoring surface area.
disable-model-invocation: true
---

# Deep modules

Source: *A Philosophy of Software Design* (John Ousterhout)—**deep module** vs **shallow module**.

## Definitions

**Deep module** — small interface, substantial implementation.

```
┌─────────────────────┐
│   Small Interface   │  ← Few methods, simple params
├─────────────────────┤
│                     │
│                     │
│  Deep Implementation│  ← Complex logic hidden
│                     │
│                     │
└─────────────────────┘
```

**Shallow module** — large interface, thin implementation (usually avoid).

```
┌─────────────────────────────────┐
│       Large Interface           │  ← Many methods, complex params
├─────────────────────────────────┤
│  Thin Implementation            │  ← Just passes through
└─────────────────────────────────┘
```

## When designing or reviewing an interface

Ask:

1. Can I **reduce the number of methods** (merge responsibilities behind one operation when safe)?
2. Can I **simplify parameters** (fewer args, clearer types, defaults at the boundary)?
3. Can I **hide more complexity inside** (callers shouldn’t assemble low-level steps)?

Prefer outcomes where callers write less code and think at a higher level of abstraction.

## Red flags (shallow tendencies)

- Many one-liner methods that only forward to another layer with no added semantics.
- Callers must know ordering, retries, or consistency rules that belong inside the module.
- Parameters that expose internal structure (wide DTOs passed through unchanged).

## React Native alignment (quick check)

- **Thin screens/components**, richer hooks/services: UI stays shallow; data fetching, navigation, and business rules stay deep in hooks (`useX`) and `src/services/**`.
- Shared shapes in `src/types/**`; avoid leaking API response or multi-step orchestration details across every caller.

## Examples

**Deeper:** `useCheckout()` — validates the cart, calls the payment API, and updates local state internally; the screen just calls `checkout()`.

**Shallower:** expose `validateCart`, `postPayment`, `updateOrderState`, `refreshCart` and require every screen to sequence them.
