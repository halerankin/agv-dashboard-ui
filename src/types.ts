
export type Severity = 'info' | 'warn' | 'crit';
export type GlobalFilter = 'all' | 'hasAlerts' | 'badComms';
export type GlobalSort = 'name' | 'severity' | 'lastUpdate';
export type VehicleId = 'AV-01' | 'AV-02' | 'AV-03';
export type VehicleAction = 'pause' | 'resume' | 'return' | 'replan';
export type Connection = 'online' | 'degraded' | 'offline';
export type AutonomyState = 'idle' | 'navigating' | 'charging' | 'maintenance' | 'error';
export type TelemetryProfile = 'chatty' | 'normal' | 'quiet';

export type Vehicle = {
  id: VehicleId;
	name: string,
	connection: Connection,
	batteryPct: number,
	lastUpdateMs: number,
	autonomyState: AutonomyState,
	missionId: string | null,
	lat: number,
	lng: number,
	headingDeg: number,
	speedMps: number,
	pitchDeg: number,
	rollDeg: number,
	autonomyObjective?: string | null,
	autonomyReason?: string | null,
	autonomyBlocker?: string | null,
	suggestedAction?: string | null,
  telemetryProfile: TelemetryProfile,
}

export type Alert = {
  id: string,
  vehicleId: VehicleId,
  severity: Severity,
  message: string,
  createdAtMs: number,
  acked: boolean
}

export type EventKind =
  | 'telemetry'
  | 'alert'
  | 'ack'
  | 'ui'
  | 'waypoint'
  | 'replan'
  | 'pause'
  | 'resume';

export type EventLogItem = {
  id: string;
  atMs: number;
  kind: EventKind;
  message: string;
  vehicleId?: VehicleId;
};

export type RouteSegmentState = 'planned' | 'active' | 'completed';

export type Route = {
  vehicleId: VehicleId;
  points: { lat: number; lng: number }[];
  segmentStates: RouteSegmentState[];
};

export const SeverityRank: { [K in Severity]: number } = {
    info: 1,
    warn: 2,
    crit: 3
}
