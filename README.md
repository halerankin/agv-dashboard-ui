# AGV C2 Dashboard

A React + TypeScript prototype for an autonomous ground vehicle (AGV) command-and-control dashboard.

This dashboard is intended to explore operator-facing UI patterns for:
- fleet awareness
- vehicle selection and status review
- map-based monitoring
- alerts, events, and operator attention management
- docked and expanded vehicle camera feeds

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Tech

* React
* TypeScript
* Vite
* CSS

## Data simulation

This project uses local, in-memory data to simulate a live AGV fleet environment. There are no external services or APIs.

### Vehicles and events
- Initial fleet state, alerts, and events are defined in `src/mockData.ts`
- These provide a consistent baseline for UI rendering and layout validation

### Telemetry simulation (MQTT-style)
- `useMockFleetTelemetry` simulates incoming telemetry similar to an MQTT-based system
- Updates are generated asynchronously and in bursts, rather than on a fixed interval
- Telemetry messages are batched and applied together to mimic ingestion pipelines
- Vehicles receive partial updates (position, heading, status), not full state replacements
- This creates realistic UI conditions such as:
  - rapid successive updates
  - uneven update frequency across vehicles
  - transient states (degraded, offline, recovery)

The goal is not to replicate MQTT exactly, but to reproduce the *behavioral patterns* an operator UI must handle when consuming live telemetry streams.

### Alerts and events
- Alerts are derived from vehicle state and telemetry conditions
- Events are a mix of predefined and simulated updates
- Panels filter and present this data to reflect operator workflows

### Vehicle video
- Each vehicle is assigned a local video asset (`src/assets/vehicle{1-3}.mp4`)
- Videos are loaded lazily and mapped per vehicle
- Docked state: video is paused  
- Expanded state: video plays automatically  
- This simulates a live POV feed without requiring streaming infrastructure

---

This setup allows the dashboard to behave like a live system while remaining fully local and deterministic.