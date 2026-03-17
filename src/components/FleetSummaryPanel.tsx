import type { Vehicle, VehicleId } from '../types';

type FleetSummaryPanelProps = {
	vehicles: Vehicle[];
	unackedCountByVehicleId: { [K in VehicleId]?: number };
};

/** Derives fleet-level counts for operator scanability. */
function useFleetSummary(
	vehicles: Vehicle[],
	unackedCountByVehicleId: { [K in VehicleId]?: number }
) {
	const total = vehicles.length;
	const badComms = vehicles.filter(
		(v) => v.connection === 'degraded' || v.connection === 'offline'
	).length;
	const withAlerts = vehicles.filter(
		(v) => (unackedCountByVehicleId[v.id] ?? 0) > 0
	).length;
	const unackedTotal = Object.values(unackedCountByVehicleId).reduce(
		(sum, n) => sum + (n ?? 0),
		0
	);
	const navigating = vehicles.filter((v) => v.autonomyState === 'navigating').length;
	const error = vehicles.filter((v) => v.autonomyState === 'error').length;

	return { total, badComms, withAlerts, unackedTotal, navigating, error };
}

export default function FleetSummaryPanel({
	vehicles,
	unackedCountByVehicleId,
}: FleetSummaryPanelProps) {
	const { total, badComms, withAlerts, unackedTotal, navigating, error } =
		useFleetSummary(vehicles, unackedCountByVehicleId);

	return (
		<div className="panel fleet-summary-panel">
			<div className="fleet-summary-panel__header">
				<span className="fleet-summary-panel__title">Fleet</span>
			</div>
			<div className="fleet-summary-panel__grid">
				<div className="panel-item-base fleet-summary-panel__item">
					<span className="fleet-summary-panel__value">{total}</span>
					<span className="label-base">vehicles</span>
				</div>
				<div className="panel-item-base fleet-summary-panel__item">
					<span className="fleet-summary-panel__value">{badComms}</span>
					<span className="label-base">bad comms</span>
				</div>
				<div className="panel-item-base fleet-summary-panel__item">
					<span className="fleet-summary-panel__value">{withAlerts}</span>
					<span className="label-base">with alerts</span>
				</div>
				<div className="panel-item-base fleet-summary-panel__item">
					<span className="fleet-summary-panel__value">{unackedTotal}</span>
					<span className="label-base">unacked</span>
				</div>
				<div className="panel-item-base fleet-summary-panel__item">
					<span className="fleet-summary-panel__value">{navigating}</span>
					<span className="label-base">navigating</span>
				</div>
				<div className="panel-item-base fleet-summary-panel__item">
					<span className="fleet-summary-panel__value">{error}</span>
					<span className="label-base">error</span>
				</div>
			</div>
		</div>
	);
}
