import type { Vehicle, Alert, EventLogItem, Route } from './types.ts';

const now = Date.now();

export const initialVehicles: Vehicle[] = [
  {
    id: 'AV-01',
    name: 'Alpha',
    connection: 'online',
    batteryPct: 64,
    lastUpdateMs: now - 1200,
    autonomyState: 'navigating',
    missionId: 'M-001',
    lat: 36.8519,
    lng: -116.0264,
    headingDeg: 45,
    speedMps: 2.5,
    pitchDeg: -1.2,
    rollDeg: 0.3,
    autonomyObjective: 'Reach WP 2',
    autonomyReason: 'En route to next waypoint',
    autonomyBlocker: null,
    suggestedAction: null,
    telemetryProfile: 'chatty',
  },
  {
    id: 'AV-02',
    name: 'Bravo',
    connection: 'degraded',
    batteryPct: 28,
    lastUpdateMs: now - 3500,
    autonomyState: 'idle',
    missionId: null,
    lat: 36.8619,
    lng: -116.0154,
    headingDeg: 180,
    speedMps: 0,
    pitchDeg: 0,
    rollDeg: 0,
    autonomyObjective: 'Stand by',
    autonomyReason: 'Awaiting dispatch',
    autonomyBlocker: 'Comms degraded',
    suggestedAction: 'Check connection',
    telemetryProfile: 'normal',
  },
  {
    id: 'AV-03',
    name: 'Charlie',
    connection: 'offline',
    batteryPct: 18,
    lastUpdateMs: now - 18000,
    autonomyState: 'maintenance',
    missionId: 'M-002',
    lat: 36.8419,
    lng: -116.0364,
    headingDeg: 270,
    speedMps: 0,
    pitchDeg: 0.5,
    rollDeg: -0.2,
    autonomyObjective: 'Return to depot',
    autonomyReason: 'Maintenance required',
    autonomyBlocker: 'Offline — no telemetry',
    suggestedAction: 'Investigate connectivity',
    telemetryProfile: 'quiet',
  },
];

export const initialRoutes: Route[] = [
  {
    vehicleId: 'AV-01',
    points: [
      { lat: 36.8519, lng: -116.0264 },
      { lat: 36.8559, lng: -116.0224 },
      { lat: 36.8599, lng: -116.0184 },
    ],
    segmentStates: ['completed', 'active'],
  },
];

export const initialAlerts: Alert[] = [
  {
    id: 'al-001',
    vehicleId: 'AV-02',
    severity: 'warn',
    message: 'Comms degraded',
    createdAtMs: now - 50000,
    acked: false,
  },
  {
    id: 'al-002',
    vehicleId: 'AV-03',
    severity: 'warn',
    message: 'Offline — no telemetry',
    createdAtMs: now - 42000,
    acked: false,
  },
  {
    id: 'al-003',
    vehicleId: 'AV-03',
    severity: 'info',
    message: 'Maintenance required',
    createdAtMs: now - 30000,
    acked: false,
  },
];

export const initialEvents: EventLogItem[] = [
  {
    id: 'ev-001',
    vehicleId: 'AV-01',
    atMs: now - 60000,
    kind: 'telemetry',
    message: 'Connection: online',
  },
  {
    id: 'ev-002',
    vehicleId: 'AV-01',
    atMs: now - 45000,
    kind: 'waypoint',
    message: 'WP 1 reached',
  },
  {
    id: 'ev-003',
    vehicleId: 'AV-02',
    atMs: now - 30000,
    kind: 'telemetry',
    message: 'Connection: degraded',
  },
  {
    id: 'ev-004',
    vehicleId: 'AV-03',
    atMs: now - 20000,
    kind: 'telemetry',
    message: 'Connection: offline',
  },
  {
    id: 'ev-005',
    vehicleId: 'AV-03',
    atMs: now - 15000,
    kind: 'telemetry',
    message: 'Autonomy: maintenance',
  },
];