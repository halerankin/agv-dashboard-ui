import type { Vehicle } from '../types';

type AutonomyStatusPanelProps = {
	vehicle: Vehicle;
};

export default function AutonomyStatusPanel({ vehicle }: AutonomyStatusPanelProps) {
	return (
		<section className="autonomy-status-panel">
			<div className="autonomy-status-panel__grid">
				<div className="panel-item-base autonomy-status-panel__item">
					<span className="label-base">Speed</span>
					<span className="autonomy-status-panel__value">
						{vehicle.speedMps.toFixed(1)} m/s
					</span>
				</div>
				<div className="panel-item-base autonomy-status-panel__item">
					<span className="label-base">Heading</span>
					<span className="autonomy-status-panel__value">
						{vehicle.headingDeg}°
					</span>
				</div>
				<div className="panel-item-base autonomy-status-panel__item">
					<span className="label-base">Pitch</span>
					<span className="autonomy-status-panel__value">
						{vehicle.pitchDeg}°
					</span>
				</div>
				<div className="panel-item-base autonomy-status-panel__item">
					<span className="label-base">Roll</span>
					<span className="autonomy-status-panel__value">
						{vehicle.rollDeg}°
					</span>
				</div>
			</div>
		</section>
	);
}
