import * as React from 'react';
import type { Alert, Route, Vehicle, VehicleId } from '../types';
import { type RouteLineWeight } from './MapControlPanel';
import type { VehicleMarkerDetailMode } from './VehicleMarker';
import LeafletMapWorkspace from './LeafletMapWorkspace';

type MapPanelProps = {
	vehicles: Vehicle[];
	alerts: Alert[];
	routes: Route[];
	selectedVehicleId: VehicleId | null;
	onSelectVehicle: (vehicleId: VehicleId | null) => void;
};

function MapPanelInner({
	vehicles,
	alerts,
	routes,
	selectedVehicleId,
	onSelectVehicle,
}: MapPanelProps) {
	const [detailMode, setDetailMode] = React.useState<VehicleMarkerDetailMode>('reduced');
	const [focusOnSelected, setFocusOnSelected] = React.useState(false);
	const [showRoutes, setShowRoutes] = React.useState(true);
	const [showWaypoints, setShowWaypoints] = React.useState(true);
	const [routeLineWeight, setRouteLineWeight] = React.useState<RouteLineWeight>('light');

	return (
		<div className="panel map-panel">
			<div className="map-panel__workspace">
				<LeafletMapWorkspace
					vehicles={vehicles}
					alerts={alerts}
					routes={routes}
					selectedVehicleId={selectedVehicleId}
					showRoutes={showRoutes}
					showWaypoints={showWaypoints}
					focusOnSelected={focusOnSelected}
					onFocusToggle={() => setFocusOnSelected((f) => !f)}
					routeLineWeight={routeLineWeight}
					onRouteLineWeightChange={setRouteLineWeight}
					onRoutesToggle={() => setShowRoutes((s) => !s)}
					onWaypointsToggle={() => setShowWaypoints((s) => !s)}
					onSelectVehicle={onSelectVehicle}
					detailMode={detailMode}
					onDetailModeChange={setDetailMode}
				/>
			</div>
		</div>
	);
}

export default React.memo(MapPanelInner);
