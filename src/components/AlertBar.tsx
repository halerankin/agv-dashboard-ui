import type { Alert, VehicleId } from '../types';
import { SeverityRank } from '../types';

type AlertBarProps = {
	alerts: Alert[];
	onAcknowledge: (alertId: string) => void;
	onSelectVehicle: (vehicleId: VehicleId) => void;
};

export default function AlertBar({
	alerts,
	onAcknowledge,
	onSelectVehicle,
}: AlertBarProps) {
	if (alerts.length === 0) return <div>No active alerts</div>;

	const sortedAlerts = [...alerts].sort(
		(a, b) => SeverityRank[b.severity] - SeverityRank[a.severity]
	);

	return (
		<div className="alert-strip">
			<div className="alert-strip__header">
				<span className="alert-strip__title">Active Alerts</span>
				<span className="alert-strip__count">{alerts.length}</span>
			</div>

			<div className="alert-strip__list">
				{sortedAlerts.map((alert) => (
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
			</div>
		</div>
	);
}