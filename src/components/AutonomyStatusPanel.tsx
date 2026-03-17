import type { Vehicle } from '../types';
import { autonomyLabelByState } from '../ui/statusMaps';

type AutonomyStatusPanelProps = {
	vehicle: Vehicle;
};

export default function AutonomyStatusPanel({ vehicle }: AutonomyStatusPanelProps) {
	return (
		<section className="autonomy-status-panel">
			<div className="autonomy-status-panel__grid">
				<div className="autonomy-status-panel__item">
					<span className="autonomy-status-panel__label">Mode</span>
					<span className="autonomy-status-panel__value">
						{autonomyLabelByState[vehicle.autonomyState]}
					</span>
				</div>
				<div className="autonomy-status-panel__item">
					<span className="autonomy-status-panel__label">Speed</span>
					<span className="autonomy-status-panel__value">
						{vehicle.speedMps.toFixed(1)} m/s
					</span>
				</div>
				<div className="autonomy-status-panel__item">
					<span className="autonomy-status-panel__label">Heading</span>
					<span className="autonomy-status-panel__value">
						{vehicle.headingDeg}°
					</span>
				</div>
				<div className="autonomy-status-panel__item">
					<span className="autonomy-status-panel__label">Pitch</span>
					<span className="autonomy-status-panel__value">
						{vehicle.pitchDeg}°
					</span>
				</div>
				<div className="autonomy-status-panel__item">
					<span className="autonomy-status-panel__label">Roll</span>
					<span className="autonomy-status-panel__value">
						{vehicle.rollDeg}°
					</span>
				</div>
			</div>
		</section>
	);
}
