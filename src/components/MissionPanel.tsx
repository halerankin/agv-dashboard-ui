import type { Route, Vehicle } from '../types';

type MissionPanelProps = {
	vehicle: Vehicle;
	route: Route | null;
};

/** Derives current waypoint, next waypoint, and progress from route. */
function useMissionProgress(route: Route | null) {
	if (!route || route.points.length < 2) {
		return { currentWaypoint: null, nextWaypoint: null, progress: null };
	}

	const total = route.points.length;
	const activeIdx = route.segmentStates.findIndex((s) => s === 'active');
	const completedCount = route.segmentStates.filter((s) => s === 'completed').length;

	let current: number;
	let next: number | null;

	if (activeIdx >= 0) {
		current = activeIdx + 1;
		next = activeIdx + 2 <= total ? activeIdx + 2 : null;
	} else if (completedCount >= total - 1) {
		current = total;
		next = null;
	} else {
		current = completedCount + 1;
		next = completedCount + 2 <= total ? completedCount + 2 : null;
	}

	return {
		currentWaypoint: current,
		nextWaypoint: next,
		progress: `${current}/${total}`,
	};
}

export default function MissionPanel({ vehicle, route }: MissionPanelProps) {
	const { currentWaypoint, nextWaypoint, progress } = useMissionProgress(route);

	if (!vehicle.missionId && !route) {
		return (
			<section className="mission-panel">
				<div className="mission-panel__empty">No active mission</div>
			</section>
		);
	}

	return (
		<section className="mission-panel">
			<div className="mission-panel__grid">
				<div className="mission-panel__item">
					<span className="mission-panel__label">Mission</span>
					<span className="mission-panel__value">
						{vehicle.missionId ?? '—'}
					</span>
				</div>
				<div className="mission-panel__item">
					<span className="mission-panel__label">Current</span>
					<span className="mission-panel__value">
						{currentWaypoint != null ? `WP ${currentWaypoint}` : '—'}
					</span>
				</div>
				<div className="mission-panel__item">
					<span className="mission-panel__label">Next</span>
					<span className="mission-panel__value">
						{nextWaypoint != null ? `WP ${nextWaypoint}` : '—'}
					</span>
				</div>
				<div className="mission-panel__item">
					<span className="mission-panel__label">Progress</span>
					<span className="mission-panel__value">{progress ?? '—'}</span>
				</div>
			</div>
		</section>
	);
}
