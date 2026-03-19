import * as React from 'react';
import type { Alert, VehicleId } from '../types';
import { SeverityRank } from '../types';

type MapAlertOverlayProps = {
	alerts: Alert[];
	onAcknowledge: (alertId: string) => void;
	onSelectVehicle: (vehicleId: VehicleId) => void;
};

const VISIBLE_ALERT_COUNT = 5;

/** Floating alert overlay above the map. Fixed height, up to 3 alerts, no scroll. */
function MapAlertOverlayInner({
	alerts,
	onAcknowledge,
	onSelectVehicle,
}: MapAlertOverlayProps) {
	if (alerts.length === 0) return null;

	const sortedAlerts = [...alerts].sort(
		(a, b) => SeverityRank[b.severity] - SeverityRank[a.severity]
	);
	const visibleAlerts = sortedAlerts.slice(0, VISIBLE_ALERT_COUNT);
	const remainingCount = sortedAlerts.length - visibleAlerts.length;

	return (
		<div className="map-alert-overlay">
			<div className="map-alert-overlay__header">
				<span className="map-alert-overlay__title">Active Alerts</span>
				<span className="map-alert-overlay__count">{alerts.length}</span>
			</div>
			<div className="map-alert-overlay__list">
				{visibleAlerts.map((alert) => (
					<div
						role="button"
						tabIndex={0}
						className={`alert-row alert-row--${alert.severity}`}
						key={alert.id}
						onClick={() => onSelectVehicle(alert.vehicleId)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onSelectVehicle(alert.vehicleId);
							}
						}}
					>
						<div className="alert-row__severity">
							{alert.severity.toUpperCase()}
						</div>
						<div className="alert-row__message">{alert.message}</div>
						<button
							type="button"
							className="btn-base alert-row__button"
							onClick={(e) => {
								e.stopPropagation();
								onAcknowledge(alert.id);
							}}
						>
							Ack
						</button>
					</div>
				))}
				{remainingCount > 0 && (
					<div className="map-alert-overlay__more">
						+{remainingCount} more
					</div>
				)}
			</div>
		</div>
	);
}

export default React.memo(MapAlertOverlayInner);
