import type { Vehicle, VehicleId, VehicleAction } from '../types';

type VehicleActionPanelProps = {
	vehicle: Vehicle;
	onAction: (vehicleId: VehicleId, action: VehicleAction) => void;
};

const ACTION_LABELS: Record<VehicleAction, string> = {
	pause: 'Pause',
	resume: 'Resume',
	return: 'Return',
	replan: 'Replan',
};

/** Returns which actions are relevant for the given autonomy state. */
function getRelevantActions(autonomyState: Vehicle['autonomyState']): VehicleAction[] {
	switch (autonomyState) {
		case 'navigating':
			return ['pause', 'return', 'replan'];
		case 'idle':
		case 'charging':
		case 'maintenance':
		case 'error':
			return ['resume', 'return', 'replan'];
		default:
			return ['return', 'replan'];
	}
}

export default function VehicleActionPanel({
	vehicle,
	onAction,
}: VehicleActionPanelProps) {
	const actions = getRelevantActions(vehicle.autonomyState);

	return (
		<section className="vehicle-action-panel">
			<div className="vehicle-action-panel__buttons">
				{actions.map((action) => (
					<button
						key={action}
						type="button"
						className="vehicle-action-panel__button"
						onClick={() => onAction(vehicle.id, action)}
					>
						{ACTION_LABELS[action]}
					</button>
				))}
			</div>
		</section>
	);
}
