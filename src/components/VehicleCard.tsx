import type { Vehicle } from '../types';
import { autonomyLabelByState, connectionLabelByStatus } from '../ui/statusMaps';

type VehicleCardProps = {
	vehicle: Vehicle;
	missionStatus: string;
	isSelected: boolean;
	unackedCount: number;
	onSelect: () => void;
};

function formatEventTime(atMs: number) {
    return new Date(atMs).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

export default function VehicleCard({
	vehicle,
	missionStatus,
	isSelected,
	unackedCount,
	onSelect,
}: VehicleCardProps) {
	return (
		<button
			type="button"
			className={`vehicle-card ${isSelected ? 'vehicle-card--selected' : ''}`}
			onClick={onSelect}
		>
			<div className="vehicle-card__top">
				<div className="vehicle-card__header">
					{vehicle.id}: {vehicle.name}
				</div>

				<div className="vehicle-card__indicators">
					<span
						className={`vehicle-card__dot vehicle-card__dot--autonomy-${vehicle.autonomyState}`}
						title={autonomyLabelByState[vehicle.autonomyState]}
						aria-hidden
					/>
					<span
						className={`vehicle-card__dot vehicle-card__dot--connection-${vehicle.connection}`}
						title={connectionLabelByStatus[vehicle.connection]}
						aria-hidden
					/>
					{unackedCount > 0 && (
						<div className="vehicle-card__alert-badge">{unackedCount}</div>
					)}
				</div>
			</div>

			<div className="vehicle-card__meta">
				<div className="vehicle-card__meta-row">
					<span className="meta-label">Autonomy</span>
					<span className="meta-value">
						{autonomyLabelByState[vehicle.autonomyState]}
					</span>
				</div>

				<div className="vehicle-card__meta-row">
					<span className="meta-label">Mission</span>
					<span className="meta-value">{missionStatus}</span>
				</div>

				<div className="vehicle-card__meta-row">
					<span className="meta-label">Connection</span>
					<span className="meta-value">
						{connectionLabelByStatus[vehicle.connection]}
					</span>
				</div>

				<div className="vehicle-card__meta-row">
					<span className="meta-label">Battery</span>
					<span className="meta-value">{vehicle.batteryPct}%</span>
				</div>

				<div className="vehicle-card__meta-row">
					<span className="meta-label">Last update</span>
					<span className="meta-value">{formatEventTime(vehicle.lastUpdateMs)}</span>
				</div>
			</div>
		</button>
	);
}