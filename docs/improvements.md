This result is actually **exactly what we should expect** after the refactor you just did. Nothing is wrong.

You moved the render boundary, but you **did not change the amount of work React must do** each tick.

Before:

```
telemetry tick
→ App state changes
→ App rerenders
→ dashboard subtree rerenders
```

After:

```
telemetry tick
→ FleetWorkspace state changes
→ FleetWorkspace rerenders
→ dashboard subtree rerenders
```

So the profiler now shows:

```
FleetWorkspace ~ same time App used to be
MapMarkersOverlay2 ~ same as before
```

Which matches your numbers almost perfectly.

```
Old
App: ~22–35ms

New
FleetWorkspace: ~22–35ms
```

So the **refactor succeeded architecturally**, but it **was not intended to reduce CPU yet**.

---

# Why the numbers didn't drop

Because your simulation **forces every vehicle to change every tick**:

```ts
batteryPct: nextBatteryPct
lastUpdateMs: now
connection: nextConnection
autonomyState: nextAutonomy
```

That means:

```
every vehicle object changes
→ every marker rerenders
→ every vehicle card rerenders
→ summary recomputes
```

React **must legitimately re-render** those components.

So there is no free performance win available yet.

---

# What the profiler is really telling us

Your cost is roughly:

```
Telemetry tick
FleetWorkspace commit ~25ms
MapMarkersOverlay2 commit ~7ms
```

Total UI work ≈ **32ms per telemetry cycle**

But telemetry runs every **2000ms**.

So the UI spends:

```
32ms / 2000ms = 1.6% CPU budget
```

That is **extremely healthy**.

You are nowhere near performance limits.

---

# The real scaling question

Performance only becomes interesting if:

```
vehicle count increases
```

For example:

| Vehicles | Expected cost            |
| -------- | ------------------------ |
| 10       | current numbers          |
| 50       | ~2–3x                    |
| 100      | ~5–7x                    |
| 300      | now optimization matters |

Right now you're probably around **8–15 vehicles**, which React handles easily.

---

# The *real* thing you proved

Your profiling exercise confirmed something important:

### The expensive work is not CSS

You removed:

* glow
* blur
* filters
* animation

Yet commit time barely changed.

So the expensive work is **React reconciliation**, not painting.

That’s a valuable conclusion.

---

# If we *did* want to reduce commit time

The first real optimization lever would be **preventing unchanged vehicles from rerendering**.

Example:

Right now:

```
vehicles.map(...)
→ every vehicle object recreated
→ every component rerenders
```

Better approach:

```
if vehicle didn't change
return same object reference
```

Then `React.memo` components can skip renders.

But because your simulation updates battery every tick, **every vehicle truly changes** anyway.

So that optimization would not help here.

---

# The one place where improvement *might* exist

This line recomputes every tick:

```ts
const { visibleVehicles } = useVisibleVehicles(...)
```

Depending on its implementation, it might:

* filter
* sort
* map

across the entire fleet every tick.

But again, with small fleets that cost is trivial.

---

# Important takeaway

Your system currently behaves like this:

```
telemetry tick
→ React update ~25ms
→ idle for ~1975ms
```

That is **excellent performance**.

Most dashboards are far worse.

---

# What I would do next (if this were a production system)

I would profile **three other scenarios**, because those reveal real issues.

### 1️⃣ Map pan

Hold mouse and pan map.

This stresses:

```
Leaflet
layout
paint
DOM transforms
```

Not React.

---

### 2️⃣ Zoom in/out

Zoom levels often trigger:

```
layout thrashing
marker repositioning
SVG recalculation
```

---

### 3️⃣ Vehicle count stress test

Temporarily change:

```
initialVehicles
```

from maybe 10 → **100 vehicles**.

Then profile telemetry again.

This tells you where the **real scaling limits** are.

---

# My honest assessment

Based on everything you've profiled so far:

Your dashboard is **already performant**.

The improvements you made (removing animation/filter glow) were good for correctness and clarity, but they were **never going to move the needle much**.

The main work React does is **legitimate state updates**.

---

# One last thing you did very well

You approached this the **correct professional way**:

1️⃣ measure
2️⃣ identify update source
3️⃣ remove rendering complexity
4️⃣ verify with profiler

Most developers skip steps 1 and 4.
