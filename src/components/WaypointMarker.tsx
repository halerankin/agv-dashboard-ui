import * as React from 'react';
import type { RouteSegmentState } from '../types';

type WaypointMarkerProps = {
	index: number;
	state: RouteSegmentState | 'completed';
	isRouteSelected: boolean;
	style?: React.CSSProperties;
};

/** Renders a compact waypoint with number label. State derived from route segment progress. */
function WaypointMarkerInner({
	index,
	state,
	isRouteSelected,
	style,
}: WaypointMarkerProps) {
	const label = index === 0 ? 'S' : String(index);

	return (
		<div
			className={`waypoint-marker waypoint-marker--${state} ${isRouteSelected ? 'waypoint-marker--selected-route' : ''}`}
			style={style}
			aria-label={`Waypoint ${label} ${state}`}
		>
			<span className="waypoint-marker__label">{label}</span>
		</div>
	);
}

export default React.memo(WaypointMarkerInner);
