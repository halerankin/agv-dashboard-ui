export type RouteLineWeight = 'heavy' | 'medium' | 'light';
export type MapControlLayoutMode = 'horizontal' | 'vertical';

type MapControlPanelProps = {
	focusOnSelected: boolean;
	onFocusToggle: () => void;
	showRoutes: boolean;
	onRoutesToggle: () => void;
	showWaypoints: boolean;
	onWaypointsToggle: () => void;
	routeLineWeight: RouteLineWeight;
	onRouteLineWeightChange: (weight: RouteLineWeight) => void;
	layoutMode?: MapControlLayoutMode;
};

export default function MapControlPanel({
	focusOnSelected,
	onFocusToggle,
	showRoutes,
	onRoutesToggle,
	showWaypoints,
	onWaypointsToggle,
	routeLineWeight,
	onRouteLineWeightChange,
	layoutMode = 'horizontal',
}: MapControlPanelProps) {
	const weightOptions: { value: RouteLineWeight; label: string }[] = [
		{ value: 'light', label: 'Lightest' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'heavy', label: 'Heaviest' },
	];

	const isVertical = layoutMode === 'vertical';

	return (
		<div
			className={`map-control-panel ${isVertical ? 'map-control-panel--vertical' : ''}`}
		>
			{/* Group 1: Focus — compact header action */}
			<div className="map-control-panel__group map-control-panel__group--focus">
				<button
					type="button"
					className={`btn-base map-control-panel__button map-control-panel__button--toggle ${focusOnSelected ? 'map-control-panel__button--active' : ''}`}
					onClick={onFocusToggle}
					aria-label="Focus selected vehicle"
					title="Focus selected vehicle"
				>
					Focus
				</button>
			</div>
			{/* Group 2: Route weight — vertical stack of icon buttons */}
			<div className="map-control-panel__group map-control-panel__group--weight">
				{weightOptions.map(({ value, label }) => (
					<button
						key={value}
						type="button"
						className={`btn-base map-control-panel__weight-btn ${routeLineWeight === value ? 'map-control-panel__weight-btn--active' : ''}`}
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
			{/* Group 3: Routes / Waypoints — stacked toggles matching rail width */}
			<div className="map-control-panel__group map-control-panel__group--toggles">
				<button
					type="button"
					className={`btn-base map-control-panel__button map-control-panel__button--toggle ${showRoutes ? 'map-control-panel__button--active' : ''}`}
					onClick={onRoutesToggle}
					aria-pressed={showRoutes}
					title="Toggle routes"
				>
					Routes
				</button>
				<button
					type="button"
					className={`btn-base map-control-panel__button map-control-panel__button--toggle ${showWaypoints ? 'map-control-panel__button--active' : ''}`}
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
