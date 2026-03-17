import type {
	Alert,
	EventLogItem,
	Route,
	Vehicle,
	VehicleId,
    VehicleAction
} from '../types';
import { connectionLabelByStatus } from '../ui/statusMaps';
import AutonomyReasonPanel from './AutonomyReasonPanel';
import AutonomyStatusPanel from './AutonomyStatusPanel';
import MissionPanel from './MissionPanel';
import EventItem from './EventItem';
import VehicleActionPanel from './VehicleActionPanel';

type VehicleDetailsPanelProps = {
    alerts: Alert[];
    events: EventLogItem[];
    vehicle: Vehicle | null;
    routes: Route[];
    onVehicleAction: (vehicleId: VehicleId, action: VehicleAction) => void;
};

export default function VehicleDetailsPanel({
    alerts,
    events,
    vehicle,
    routes,
    onVehicleAction,
}: VehicleDetailsPanelProps) {
    if (!vehicle) return <div>No vehicle selected</div>;

    const vehicleRoute = routes.find((r) => r.vehicleId === vehicle.id) ?? null;
    const vehicleAlerts = alerts.filter(
        (alert) => alert.vehicleId === vehicle.id && !alert.acked
    );

    const vehicleEvents = events.filter(
        (event) => event.vehicleId === vehicle.id
    );

    return (
    <div className="panel vehicle-panel">

        <header className="vehicle-panel__header">
            <div className="vehicle-panel__title">{vehicle.name}</div>
            <div className="vehicle-panel__id">{vehicle.id}</div>
        </header>

        <div className="vehicle-panel__status-row">
            <span className="vehicle-panel__status-item">
                {connectionLabelByStatus[vehicle.connection]}
            </span>
            <span className="vehicle-panel__status-sep">·</span>
            <span className="vehicle-panel__status-item">
                {vehicle.batteryPct}%
            </span>
        </div>

        <AutonomyStatusPanel vehicle={vehicle} />

        <AutonomyReasonPanel vehicle={vehicle} />

        <MissionPanel vehicle={vehicle} route={vehicleRoute} />

        <VehicleActionPanel vehicle={vehicle} onAction={onVehicleAction} />

        <section className="vehicle-panel__section">
            <div className="section-title">Active Alerts</div>

            {vehicleAlerts.length === 0 ? (
                <div className="section-empty">No active alerts</div>
            ) : (
                <div className="alert-list">
                {vehicleAlerts.map(alert => (
                    <div className={`alert-row alert-row--${alert.severity}`} key={alert.id}>
                    <span className="alert-row__severity">
                        {alert.severity.toUpperCase()}
                    </span>

                    <span className="alert-message">
                        {alert.message}
                    </span>
                    </div>
                ))}
                </div>
            )}
        </section>

        <section className="vehicle-panel__section">
            <div className="section-title">Recent Events</div>

            {(() => {
                const operationalKinds = new Set<EventLogItem['kind']>([
                    'waypoint',
                    'replan',
                    'pause',
                    'resume',
                    'alert',
                    'ack',
                    'ui',
                    'telemetry',
                ]);
                const operationalEvents = vehicleEvents.filter((e) =>
                    operationalKinds.has(e.kind)
                );
                if (operationalEvents.length === 0) {
                    return <div className="section-empty">No recent vehicle events</div>;
                }
                return (
                    <div className="event-list">
                        {operationalEvents.map((event) => (
                            <EventItem key={event.id} event={event} />
                        ))}
                    </div>
                );
            })()}
        </section>

    </div>
    );
}
