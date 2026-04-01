import * as React from 'react';
import type { Alert, EventLogItem, Vehicle, VehicleId } from '../types';
import maybeTransition from '../utils/maybeTransition';
import { AUTONOMY_TRANSITIONS, CONNECTION_TRANSITIONS } from '../constants';

type UseMockFleetTelemetryArgs = {
  paused: boolean;
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  setEvents: React.Dispatch<React.SetStateAction<EventLogItem[]>>;
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
};

type VehicleTelemetryMessage = {
    vehicleId: VehicleId;
    timestampMs: number;
    batteryDrain?: number;
    connection?: Vehicle['connection'];
    autonomyState?: Vehicle['autonomyState'];
  };

function applyVehicleTelemetryBatch(
  prevVehicles: Vehicle[],
  messages: VehicleTelemetryMessage[]
): {
  nextVehicles: Vehicle[];
  newAlerts: Alert[];
  newEvents: EventLogItem[];
} {
  const latestByVehicleId = new Map<VehicleId, VehicleTelemetryMessage>();

  for (const message of messages) {
    latestByVehicleId.set(message.vehicleId, message);
  }

  const now = Date.now();
  const newAlerts: Alert[] = [];
  const newEvents: EventLogItem[] = [];

  const nextVehicles = prevVehicles.map((vehicle) => {
    const msg = latestByVehicleId.get(vehicle.id);
    if (!msg) return vehicle;

    const nextBatteryPct = Math.max(0, vehicle.batteryPct - (msg.batteryDrain ?? 0));
    const nextConnection = msg.connection ?? vehicle.connection;
    const nextAutonomyState = msg.autonomyState ?? vehicle.autonomyState;

    const crossedLowBatteryThreshold =
      vehicle.batteryPct > 20 && nextBatteryPct <= 20;

    if (crossedLowBatteryThreshold) {
      const message = `Battery low on ${vehicle.name}`;

      newAlerts.push({
        id: crypto.randomUUID(),
        vehicleId: vehicle.id,
        severity: 'warn',
        message,
        createdAtMs: msg.timestampMs,
        acked: false,
      });

      newEvents.push({
        id: crypto.randomUUID(),
        atMs: msg.timestampMs,
        kind: 'alert',
        vehicleId: vehicle.id,
        message,
      });
    }

    if (nextConnection !== vehicle.connection) {
      newEvents.push({
        id: crypto.randomUUID(),
        atMs: msg.timestampMs,
        kind: 'telemetry',
        vehicleId: vehicle.id,
        message: `Connection: ${nextConnection}`,
      });
    }

    if (nextAutonomyState !== vehicle.autonomyState) {
      newEvents.push({
        id: crypto.randomUUID(),
        atMs: msg.timestampMs,
        kind: 'telemetry',
        vehicleId: vehicle.id,
        message: `Autonomy: ${nextAutonomyState}`,
      });
    }

    const nextVehicle: Vehicle = {
      ...vehicle,
      batteryPct: nextBatteryPct,
      connection: nextConnection,
      autonomyState: nextAutonomyState,
      lastUpdateMs: msg.timestampMs,
    };

    const changed =
      nextVehicle.batteryPct !== vehicle.batteryPct ||
      nextVehicle.connection !== vehicle.connection ||
      nextVehicle.autonomyState !== vehicle.autonomyState ||
      nextVehicle.lastUpdateMs !== vehicle.lastUpdateMs;

    return changed ? nextVehicle : vehicle;
  });

  if (messages.length > 0) {
    newEvents.unshift({
      id: crypto.randomUUID(),
      atMs: now,
      kind: 'telemetry',
      message: `Telemetry batch: ${messages.length} message${messages.length === 1 ? '' : 's'}`,
    });
  }

  return { nextVehicles, newAlerts, newEvents };
}

export function useMockFleetTelemetry({
  paused,
  vehicles,
  setVehicles,
  setEvents,
  setAlerts,
}: UseMockFleetTelemetryArgs) {
  const pendingMessagesRef = React.useRef<VehicleTelemetryMessage[]>([]);
  const vehiclesRef = React.useRef<Vehicle[]>(vehicles);
  const generationTimeoutRef = React.useRef<number | null>(null);

  const generateMessages = React.useEffectEvent(() => {
    const vehicles = vehiclesRef.current;
    const eligibleVehicles = getEligibleVehicles(vehicles);
    if (eligibleVehicles.length === 0) return;

    const now = Date.now();
    const messageCount = getBurstMessageCount();

    for (let i = 0; i < messageCount; i += 1) {
      const vehicle = pickVehicleByTelemetryProfile(eligibleVehicles);

      pendingMessagesRef.current.push({
        vehicleId: vehicle.id,
        timestampMs: now,
        batteryDrain: Math.random() < 0.8 ? 1: 0,
        connection:
          Math.random() < 0.15
            ? maybeTransition(
                vehicle.connection,
                CONNECTION_TRANSITIONS[vehicle.connection]
              )
            : undefined,
        autonomyState:
          Math.random() < 0.2
            ? maybeTransition(
                vehicle.autonomyState,
                AUTONOMY_TRANSITIONS[vehicle.autonomyState] ?? []
              )
            : undefined,
      });
    }
  });

  const flushPendingMessages = React.useEffectEvent(() => {
    const pending = pendingMessagesRef.current;
    if (pending.length === 0) return;

    pendingMessagesRef.current = [];

    let batchResult:
      | {
          nextVehicles: Vehicle[];
          newAlerts: Alert[];
          newEvents: EventLogItem[];
        }
      | undefined;

    setVehicles((prevVehicles) => {
        const result = applyVehicleTelemetryBatch(prevVehicles, pending);
        batchResult = result;
        vehiclesRef.current = result.nextVehicles;
        return result.nextVehicles;
      });
      
      if (!batchResult) return; 
      const result = batchResult;

      if (result.newEvents.length > 0) {
      setEvents((prev) => [...result!.newEvents, ...prev]);
      }

      setAlerts((prev) => {
        let next =
          result.newAlerts.length > 0
            ? [...result.newAlerts, ...prev]
            : prev;

        const unacked = next.filter((a) => !a.acked);
        if (unacked.length > 0 && Math.random() < 0.08) {
          const toAck = unacked[Math.floor(Math.random() * unacked.length)];
          next = next.map((a) =>
            a.id === toAck.id ? { ...a, acked: true } : a
          );
        }

        return next;
      }); 
  });

  React.useEffect(() => {
    if (paused) return;

    function scheduleNextGeneration() {
        const delayMs = 150 + Math.floor(Math.random() * 500); // 150-650ms

        generationTimeoutRef.current = window.setTimeout(() => {
            generateMessages();
            scheduleNextGeneration();
        }, delayMs);
    };

    scheduleNextGeneration();

    const flushTimer = window.setInterval(() => {
      flushPendingMessages();
    }, 500);

    return () => {
      if (generationTimeoutRef.current !== null) {
        window.clearTimeout(generationTimeoutRef.current);
      }
      window.clearInterval(flushTimer);
      pendingMessagesRef.current = [];
    };
  }, [paused]);
}

function getEligibleVehicles(vehicles: Vehicle[]) {
    return vehicles.filter((vehicle) => vehicle.connection !== 'offline');
  }
  
  function getBurstMessageCount() {
    const roll = Math.random();
    if (roll < 0.6) return 1;
    if (roll < 0.85) return 2;
    if (roll < 0.95) return 3;
    return 4;
  }
  
  function getProfileWeight(vehicle: Vehicle) {
    switch (vehicle.telemetryProfile) {
      case 'chatty':
        return 3;
      case 'normal':
        return 2;
      case 'quiet':
        return 1;
      default:
        return 1;
    }
  }
  
  function pickVehicleByTelemetryProfile(vehicles: Vehicle[]) {
    const totalWeight = vehicles.reduce(
      (sum, vehicle) => sum + getProfileWeight(vehicle),
      0
    );
  
    let roll = Math.random() * totalWeight;
  
    for (const vehicle of vehicles) {
      roll -= getProfileWeight(vehicle);
      if (roll <= 0) {
        return vehicle;
      }
    }
  
    return vehicles[vehicles.length - 1];
  }
