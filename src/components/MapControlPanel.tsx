import type { VehicleId } from '../types';

export type RouteLineWeight = 'heavy' | 'medium' | 'light';

type MapControlPanelProps = {
	zoom: number;
	onZoomIn: () => void;
	onZoomOut: () => void;
	selectedVehicleId: VehicleId | null;
	focusOnSelected: boolean;
	onFocusToggle: () => void;
	showRoutes: boolean;
	onRoutesToggle: () => void;
	showWaypoints: boolean;
	onWaypointsToggle: () => void;
	routeLineWeight: RouteLineWeight;
	onRouteLineWeightChange: (weight: RouteLineWeight) => void;
};

export default function MapControlPanel({
	zoom,
	onZoomIn,
	onZoomOut,
	selectedVehicleId,
	focusOnSelected,
	onFocusToggle,
	showRoutes,
	onRoutesToggle,
	showWaypoints,
	onWaypointsToggle,
	routeLineWeight,
	onRouteLineWeightChange,
}: MapControlPanelProps) {
	const weightOptions: { value: RouteLineWeight; label: string }[] = [
		{ value: 'heavy', label: 'Heaviest' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'light', label: 'Lightest' },
	];

	return (
		<div className="map-control-panel">
			<div className="map-control-panel__group">
				<button
					type="button"
					className="map-control-panel__button"
					onClick={onZoomOut}
					aria-label="Zoom out"
				>
					−
				</button>
				<span className="map-control-panel__zoom">{zoom}</span>
				<button
					type="button"
					className="map-control-panel__button"
					onClick={onZoomIn}
					aria-label="Zoom in"
				>
					+
				</button>
			</div>
			<div className="map-control-panel__group">
				<button
					type="button"
					className={`map-control-panel__button map-control-panel__button--toggle ${focusOnSelected ? 'map-control-panel__button--active' : ''}`}
					onClick={onFocusToggle}
					disabled={!selectedVehicleId}
					aria-label="Focus selected vehicle"
					title="Focus selected vehicle"
				>
					Focus
				</button>
			</div>
			<div className="map-control-panel__group map-control-panel__group--weight">
				{weightOptions.map(({ value, label }) => (
					<button
						key={value}
						type="button"
						className={`map-control-panel__weight-btn ${routeLineWeight === value ? 'map-control-panel__weight-btn--active' : ''}`}
						onClick={() => onRouteLineWeightChange(value)}
						aria-pressed={routeLineWeight === value}
						title={`Route line: ${label}`}
						aria-label={`Route line ${label}`}
					>
						<span
							className="map-control-panel__weight-icon"
							style={{ height: value === 'heavy' ? 4 : value === 'medium' ? 2.5 : 1.5 }}
						/>
					</button>
				))}
			</div>
			<div className="map-control-panel__group">
				<button
					type="button"
					className={`map-control-panel__button map-control-panel__button--toggle ${showRoutes ? 'map-control-panel__button--active' : ''}`}
					onClick={onRoutesToggle}
					aria-pressed={showRoutes}
					title="Toggle routes"
				>
					Routes
				</button>
				<button
					type="button"
					className={`map-control-panel__button map-control-panel__button--toggle ${showWaypoints ? 'map-control-panel__button--active' : ''}`}
					onClick={onWaypointsToggle}
					aria-pressed={showWaypoints}
					title="Toggle waypoints"
				>
					Waypoints
				</button>
			</div>
		</div>
	);
}
