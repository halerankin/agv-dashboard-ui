We have a 2 second interval running -- src\hooks\useFleetSimulation.ts

With a **2-second interval** in `src/hooks/useFleetSimulation.ts`, these numbers are **not an immediate runtime problem**. They are primarily an **architecture signal**.

## What your numbers mean in context

You found roughly per cycle:

* **App commit:** ~22–35 ms
* **MapMarkersOverlay2 commit:** ~6–12 ms

Combined, call it roughly:

* **~30–40 ms of React work every 2 seconds**

That is a very low duty cycle.

In practical terms:

* the UI is **not under continuous React pressure**
* operators probably won’t feel this from telemetry alone
* the app is currently **performing acceptably**

## So why profile still matters

Because the profile is telling you **how the app scales**, not just how it feels today.

At 1 update every 2 seconds, this is fine.

But if later you move toward:

* faster telemetry
* more vehicles
* more alerts/events
* denser overlays
* smoother real-time simulation

then the current pattern becomes more expensive.

So the conclusion is:

> **This is not a present emergency. It is a future scaling concern and a useful architectural insight.**

## Reframing the result

Your profiling says:

### Current state

* acceptable performance at a 2-second tick
* no catastrophic hotspot
* root-level update breadth exists
* overlay follow-up commit exists

### Future risk

* if tick frequency increases, `App`-level rerender breadth becomes the first thing to tighten up

## The practical takeaway

Because you’re on a 2-second interval, I would **not** stop everything to optimize React render breadth right now.

I would instead treat it like this:

### Worth doing now

* remove blur/glow/pulse that don’t help operators
* keep visual system simple
* note that `App` is the main telemetry update origin
* note that `MapMarkersOverlay2` performs a second localized commit

### Worth postponing unless needed

* major state ownership refactor
* aggressive memoization everywhere
* premature splitting of the dashboard tree

## What I’d tell a team

“At the current 2-second simulation rate, React cost is acceptable. The important finding is that telemetry enters high enough in the tree to trigger broad `App` commits. That isn’t urgent now, but it’s the first place to revisit if update frequency or fleet size increases.”

## How to think about `useFleetSimulation.ts`

Since that hook is the source of the interval, the key questions become:

* does each tick update several pieces of state separately?
* does it replace whole arrays/objects each time?
* does it push data into `App` state that static controls don’t care about?

You don’t need to fix that now unless:

* you plan to increase update rate
* the UI already feels sluggish
* vehicle count is going up soon

## The best next profiling step now

Given what you’ve learned, the highest-value next step is probably **browser Performance profiling while panning/zooming**, because that is more likely to surface user-visible jank than a 2-second React update.

That’s where:

* shadows
* filters
* marker DOM
* layout
* paint

will show up much more clearly.