# Dashboard Roadmap — Operator Clarity & Attention Management (v0)

## Purpose

Define the roadmap for evolving the current mock dashboard into an **autonomy operations console** that improves upon the existing Overland AI interface.

The guiding objective is **operator clarity**.

The UI should enable operators to quickly answer the most important operational questions:

- What requires my attention right now?
- Which vehicle is involved?
- Where is it located?
- What is it doing?
- Why is it doing that?

This roadmap prioritizes features that improve:

- **attention management**
- **situational awareness**
- **mission context**
- **explainability of autonomy behavior**

Engineering difficulty is not the primary ordering factor; **operator impact is**.

---

# Priority 1 — Spatial Awareness

The map layer becomes the **primary operational workspace**.

Without spatial context, an autonomy interface cannot support effective supervision.

## MapPanel

Render the operational map environment.

Responsibilities:

- render terrain or satellite map
- support zoom and pan
- host vehicle markers
- display route overlays
- display waypoint markers

This panel becomes the **center column** of the application layout.

---

## VehicleMarker

Represent each vehicle on the map.

Vehicle markers should encode critical information visually so operators can scan the map quickly.

Proposed visual model:

```

vehicle heading arrow

inner ring   → autonomy state
outer ring   → alert severity

glyph        → vehicle condition or mission role

```

Example interpretation:

- green inner ring → executing normally
- blue inner ring → planning
- yellow outer ring → warning state
- red outer ring → critical fault

This enables quick identification of vehicles needing attention.

---

## RouteOverlay

Display mission routes.

Routes should communicate:

- planned path
- completed path
- current active path

This helps operators understand **vehicle intent**.

---

## WaypointMarkers

Render mission waypoints.

Enhancements:

- numbered waypoint labels
- highlight current target waypoint
- visually mark completed waypoints

---

# Priority 2 — Attention Management

Operators must immediately see what requires attention across the fleet.

## AttentionSummaryBar

Fleet-level attention overview.

Example:

```

ATTENTION

2 vehicles degraded
1 mission blocked
1 low battery

```

Purpose:

Allow operators to quickly identify **system-wide issues** without scanning individual vehicles.

---

## Enhanced Alert System

Extend the existing alert strip.

Enhancements:

- group alerts by severity
- allow filtering by vehicle
- allow clicking an alert to focus the vehicle on the map

Example interaction:

```

click alert → map centers on vehicle

```

This connects **alerts with spatial context**.

---

# Priority 3 — Fleet Awareness

The fleet sidebar should clearly communicate system state.

## VehicleCard Extensions

Enhance existing vehicle cards with:

- autonomy state
- mission progress
- current waypoint

Example:

```

Alpha
EXECUTING
Waypoint W3
Battery 23%

```

Goal:

Allow operators to evaluate vehicle status **without opening detail panels**.

---

## FleetSummaryPanel

Optional but recommended.

Displays fleet-wide status counts.

Example:

```

Vehicles online: 5
Vehicles executing: 3
Vehicles paused: 1
Vehicles faulted: 1

```

Provides **high-level fleet health awareness**.

---

# Priority 4 — Vehicle Supervision

When a vehicle is selected, operators should see detailed operational context.

The existing `VehicleDetailsPanel` should evolve into a **VehicleSupervisionPanel**.

---

## AutonomyStatusPanel

Display real-time telemetry and autonomy status.

Example fields:

```

Autonomy Mode
Speed
Heading
Pitch
Roll

```

Optional enhancements:

```

navigation mode
confidence score

```

This answers:

> Is the vehicle operating normally?

---

## MissionPanel

Show the vehicle's current mission state.

Example:

```

Mission: Powerline Inspection

Current waypoint: W3
Next waypoint: W4
Progress: 3 / 8

```

This clarifies **mission intent**.

---

## VehicleCameraPanel

Display the vehicle’s camera feed.

Recommended behavior:

- collapsed by default
- expandable when needed
- dockable within supervision panel

Camera feeds act as **evidence during anomalies**, not constant visual noise.

---

# Priority 5 — Autonomy Explanation Layer

This layer improves understanding of vehicle behavior.

Most autonomy UIs show **state**, but not **reasoning**.

## AutonomyReasonPanel

Explain autonomy decisions.

Example:

```

Mode: Executing

Objective: Reach waypoint W3

Reason: Following mission route

Blocked by: obstacle confidence low

Suggested operator action: inspect camera

```

This significantly improves **operator understanding and trust**.

---

# Priority 6 — Operator Intervention

Operators must be able to intervene during mission execution.

## VehicleActionPanel

Provide vehicle control actions.

Examples:

```

Pause mission
Resume mission
Return to base
Replan route

```

Actions should only appear when relevant.

---

# Priority 7 — Event Intelligence

Extend the current event log to support mission context.

## MissionTimeline

Provide a mission-focused event history.

Example:

```

Waypoint reached
Route replanned
Autonomy paused
Operator resumed mission

```

Operators gain a **narrative understanding** of events rather than raw logs.

---

# Priority 8 — Map Interaction Tools

Lower priority but useful as the system grows.

## MapControlPanel

Controls for interacting with the map.

Examples:

```

zoom
toggle overlays
focus selected vehicle
toggle route visibility

```

---

# Vehicle Marker Encoding Model

Vehicle markers should encode multiple signals visually.

### Inner Ring — Autonomy State

```

green   → executing
blue    → planning
gray    → idle
yellow  → paused
red     → fault

```

### Outer Ring — Alert Severity

```

none    → normal
yellow  → warning
red     → critical

```

### Glyph — Vehicle Condition

Examples:

```

⚡ autonomy executing
⚠ degraded state
🔋 low battery
🛰 communication issue

```

This model allows operators to interpret vehicle state **at a glance**.

---

# Final Layout Direction

The improved dashboard layout should follow this structure.

## Top Layer

```

Toolbar
AttentionSummaryBar
AlertStrip

```

---

## Main Body

```

Left Column   → Fleet Overview
Center Column → MapPanel
Right Column  → Vehicle Supervision

```

---

## Bottom Layer

```

Event Log
Mission Timeline

```

---

# Design Principle

Every UI element should answer one question:

> Does this help the operator notice a problem faster or understand vehicle behavior faster?

If not, it likely does not belong in the interface.
