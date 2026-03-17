import type { Vehicle } from '../types';
import { autonomyLabelByState } from '../ui/statusMaps';

type AutonomyReasonPanelProps = {
	vehicle: Vehicle;
};

export default function AutonomyReasonPanel({ vehicle }: AutonomyReasonPanelProps) {
	const { autonomyState, autonomyObjective, autonomyReason, autonomyBlocker, suggestedAction } =
		vehicle;

	return (
		<section className="autonomy-reason-panel">
			<div className="autonomy-reason-panel__list">
				<div className="autonomy-reason-panel__row">
					<span className="autonomy-reason-panel__label">Mode</span>
					<span className="autonomy-reason-panel__value">
						{autonomyLabelByState[autonomyState]}
					</span>
				</div>
				{autonomyObjective && (
					<div className="autonomy-reason-panel__row">
						<span className="autonomy-reason-panel__label">Objective</span>
						<span className="autonomy-reason-panel__value">
							{autonomyObjective}
						</span>
					</div>
				)}
				{autonomyReason && (
					<div className="autonomy-reason-panel__row">
						<span className="autonomy-reason-panel__label">Reason</span>
						<span className="autonomy-reason-panel__value">
							{autonomyReason}
						</span>
					</div>
				)}
				{autonomyBlocker && (
					<div className="autonomy-reason-panel__row autonomy-reason-panel__row--blocker">
						<span className="autonomy-reason-panel__label">Blocker</span>
						<span className="autonomy-reason-panel__value">
							{autonomyBlocker}
						</span>
					</div>
				)}
				{suggestedAction && (
					<div className="autonomy-reason-panel__row autonomy-reason-panel__row--action">
						<span className="autonomy-reason-panel__label">Suggested</span>
						<span className="autonomy-reason-panel__value">
							{suggestedAction}
						</span>
					</div>
				)}
			</div>
		</section>
	);
}
