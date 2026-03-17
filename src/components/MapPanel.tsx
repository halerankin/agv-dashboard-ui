import * as React from 'react';
import type { Alert, Route, Vehicle, VehicleId } from '../types';
import MapControlPanel, { type RouteLineWeight } from './MapControlPanel';
import MapAlertOverlay from './MapAlertOverlay';
import LeafletMapWorkspace from './LeafletMapWorkspace';

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;

type MapPanelProps = {
	vehicles: Vehicle[];
	alerts: Alert[];
	routes: Route[];
	selectedVehicleId: VehicleId | null;
	onSelectVehicle: (vehicleId: VehicleId | null) => void;
	onAcknowledgeAlert: (alertId: string) => void;
};

function MapPanelInner({
	vehicles,
	alerts,
	routes,
	selectedVehicleId,
	onSelectVehicle,
	onAcknowledgeAlert,
}: MapPanelProps) {
	const [zoom, setZoom] = React.useState(1);
	const [focusOnSelected, setFocusOnSelected] = React.useState(false);
	const [showRoutes, setShowRoutes] = React.useState(true);
	const [showWaypoints, setShowWaypoints] = React.useState(true);
	const [routeLineWeight, setRouteLineWeight] = React.useState<RouteLineWeight>('medium');
	const selectedVehicle = React.useMemo(
		() => vehicles.find((v) => v.id === selectedVehicleId) ?? null,
		[vehicles, selectedVehicleId]
	);
	const unackedAlerts = React.useMemo(
		() => alerts.filter((a) => !a.acked),
		[alerts]
	);
	const mapOverlayChildren = React.useMemo(
		() => (
			<>
				<MapAlertOverlay
					alerts={unackedAlerts}
					onAcknowledge={onAcknowledgeAlert}
					onSelectVehicle={onSelectVehicle}
				/>
			</>
		),
		[unackedAlerts, onAcknowledgeAlert, onSelectVehicle, selectedVehicle]
	);

	return (
		<div className="panel map-panel">
			<div className="map-panel__toolbar">
				<MapControlPanel
					zoom={zoom}
					onZoomIn={() => setZoom((z) => Math.min(z + 1, ZOOM_MAX))}
					onZoomOut={() => setZoom((z) => Math.max(z - 1, ZOOM_MIN))}
					selectedVehicleId={selectedVehicleId}
					focusOnSelected={focusOnSelected}
					onFocusToggle={() => setFocusOnSelected((f) => !f)}
					showRoutes={showRoutes}
					onRoutesToggle={() => setShowRoutes((s) => !s)}
					showWaypoints={showWaypoints}
					onWaypointsToggle={() => setShowWaypoints((s) => !s)}
					routeLineWeight={routeLineWeight}
					onRouteLineWeightChange={setRouteLineWeight}
				/>
				<span className="map-panel__count">{vehicles.length} vehicles</span>
			</div>
			
			<div className="map-panel__workspace">
				<LeafletMapWorkspace
					vehicles={vehicles}
					alerts={alerts}
					routes={routes}
					selectedVehicleId={selectedVehicleId}
					showRoutes={showRoutes}
					showWaypoints={showWaypoints}
					focusOnSelected={focusOnSelected}
					zoom={zoom}
					routeLineWeight={routeLineWeight}
					onSelectVehicle={onSelectVehicle}
					onZoomChange={setZoom}
				>
					{mapOverlayChildren}
				</LeafletMapWorkspace>
			</div>
		</div>
	);
}

export default React.memo(MapPanelInner);
