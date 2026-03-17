import * as React from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import type { Alert, Route, Vehicle, VehicleId } from '../types';
import { SeverityRank } from '../types';
import type { RouteLineWeight } from './MapControlPanel';
import VehicleMarker, {
	VEHICLE_MARKER_METRICS,
	type VehicleMarkerZoom,
} from './VehicleMarker';
import WaypointMarker from './WaypointMarker';

const ROUTE_WEIGHT: Record<RouteLineWeight, { normal: number; selected: number }> = {
	heavy: { normal: 20, selected: 24 },
	medium: { normal: 12, selected: 16 },
	light: { normal: 6, selected: 8 },
};

const SATELLITE_TILE_URL =
	'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const SATELLITE_ATTRIBUTION =
	'© Esri, Maxar, Earthstar Geographics, and the GIS User Community';

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const LEAFLET_ZOOM_BASE = 12;
const FOCUS_MARGIN = 0.008;

type LeafletMapWorkspaceProps = {
	vehicles: Vehicle[];
	alerts: Alert[];
	routes: Route[];
	selectedVehicleId: VehicleId | null;
	showRoutes: boolean;
	showWaypoints: boolean;
	focusOnSelected: boolean;
	zoom: number;
	routeLineWeight: RouteLineWeight;
	onSelectVehicle: (vehicleId: VehicleId | null) => void;
	onZoomChange: (zoom: number) => void;
	children: React.ReactNode;
};

function getTopUnackedSeverity(
	vehicleId: VehicleId,
	alerts: Alert[]
): Alert['severity'] | null {
	let top: Alert['severity'] | null = null;
	for (const a of alerts) {
		if (a.vehicleId === vehicleId && !a.acked) {
			if (!top || SeverityRank[a.severity] > SeverityRank[top]) {
				top = a.severity;
			}
		}
	}
	return top;
}

/** Small threshold for lat/lng comparison — avoids reframing on floating-point noise. */
const POSITION_EPSILON = 1e-7;

function MapBoundsSync({
	bounds,
	focusOnSelected,
	selectedVehicle,
}: {
	bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
	focusOnSelected: boolean;
	selectedVehicle: Vehicle | null;
}) {
	const map = useMap();
	const lastFocusRef = React.useRef<{ lat: number; lng: number } | null>(null);
	const lastBoundsRef = React.useRef<{
		minLat: number;
		maxLat: number;
		minLng: number;
		maxLng: number;
	} | null>(null);

	React.useEffect(() => {
		if (focusOnSelected && selectedVehicle) {
			const { lat, lng } = selectedVehicle;
			const last = lastFocusRef.current;
			const positionUnchanged =
				last &&
				Math.abs(lat - last.lat) < POSITION_EPSILON &&
				Math.abs(lng - last.lng) < POSITION_EPSILON;
			if (positionUnchanged) return;
			lastFocusRef.current = { lat, lng };
			map.setView([lat, lng], map.getZoom(), { animate: false });
		} else {
			lastFocusRef.current = null;
			const { minLat, maxLat, minLng, maxLng } = bounds;
			const last = lastBoundsRef.current;
			const boundsUnchanged =
				last &&
				Math.abs(minLat - last.minLat) < POSITION_EPSILON &&
				Math.abs(maxLat - last.maxLat) < POSITION_EPSILON &&
				Math.abs(minLng - last.minLng) < POSITION_EPSILON &&
				Math.abs(maxLng - last.maxLng) < POSITION_EPSILON;
			if (boundsUnchanged) return;
			lastBoundsRef.current = { minLat, maxLat, minLng, maxLng };
			const pad = 0.15;
			const sw: LatLngTuple = [
				minLat - (maxLat - minLat || 0.001) * pad,
				minLng - (maxLng - minLng || 0.001) * pad,
			];
			const ne: LatLngTuple = [
				maxLat + (maxLat - minLat || 0.001) * pad,
				maxLng + (maxLng - minLng || 0.001) * pad,
			];
			map.fitBounds([sw, ne], { animate: false, padding: [20, 20] });
		}
	}, [map, bounds, focusOnSelected, selectedVehicle]);

	return null;
}

function MapZoomSync({
	zoom,
	onZoomChange,
}: {
	zoom: number;
	onZoomChange: (zoom: number) => void;
}) {
	const map = useMap();

	React.useEffect(() => {
		const leafletZoom = LEAFLET_ZOOM_BASE + (zoom - 1);
		map.setZoom(leafletZoom, { animate: false });
	}, [map, zoom]);

	React.useEffect(() => {
		const handler = () => {
			const z = map.getZoom();
			const ourZoom = Math.round(
				Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z - LEAFLET_ZOOM_BASE + 1))
			);
			onZoomChange(ourZoom);
		};
		map.on('zoomend', handler);
		return () => {
			map.off('zoomend', handler);
		};
	}, [map, onZoomChange]);

	return null;
}

const MapMarkersOverlay = React.memo(function MapMarkersOverlay({
	vehicles,
	alerts,
	visibleRoutes,
	selectedVehicleId,
	showWaypoints,
	zoom,
	onSelectVehicle,
}: {
	vehicles: Vehicle[];
	alerts: Alert[];
	visibleRoutes: Route[];
	selectedVehicleId: VehicleId | null;
	showWaypoints: boolean;
	zoom: VehicleMarkerZoom;
	onSelectVehicle: (vehicleId: VehicleId | null) => void;
}) {
	const map = useMap();
	const [positions, setPositions] = React.useState<
		Map<string, { x: number; y: number }>
	>(new Map());
	const rafRef = React.useRef<number | null>(null);

	const updatePositions = React.useCallback(() => {
		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current);
		}
		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = null;
			const m = new Map<string, { x: number; y: number }>();
			const container = map.getContainer();
			if (!container) return;

			for (const v of vehicles) {
				const point = map.latLngToContainerPoint([v.lat, v.lng]);
				m.set(v.id, { x: point.x, y: point.y });
			}

			const visibleRouteIds = new Set(vehicles.map((v) => v.id));
			for (const route of visibleRoutes) {
				if (!visibleRouteIds.has(route.vehicleId)) continue;
				route.points.forEach((p, i) => {
					const key = `${route.vehicleId}-wp-${i}`;
					const point = map.latLngToContainerPoint([p.lat, p.lng]);
					m.set(key, { x: point.x, y: point.y });
				});
			}
			setPositions(m);
		});
	}, [map, vehicles, visibleRoutes]);

	React.useEffect(() => {
		updatePositions();
		map.on('moveend', updatePositions);
		map.on('zoomend', updatePositions);
		return () => {
			map.off('moveend', updatePositions);
			map.off('zoomend', updatePositions);
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
		};
	}, [map, updatePositions]);

	return (
		<div
			className="leaflet-map-overlay"
			style={{
				position: 'absolute',
				inset: 0,
				pointerEvents: 'none',
				zIndex: 600,
				contain: 'layout',
			}}
		>
			{showWaypoints &&
				visibleRoutes.flatMap((route) => {
					const isRouteSelected = route.vehicleId === selectedVehicleId;
					return route.points.map((_, i) => {
						const state =
							i === 0
								? 'completed'
								: (route.segmentStates[i - 1] ?? 'planned');
						const pos = positions.get(`${route.vehicleId}-wp-${i}`);
						if (!pos) return null;
						return (
							<div
								key={`${route.vehicleId}-wp-${i}`}
								style={{
									position: 'absolute',
									left: pos.x,
									top: pos.y,
									transform: 'translate(-50%, -50%)',
									pointerEvents: 'auto',
								}}
							>
								<WaypointMarker
									index={i}
									state={state}
									isRouteSelected={isRouteSelected}
								/>
							</div>
						);
					});
				})}
			{vehicles.map((vehicle) => {
				const pos = positions.get(vehicle.id);
				if (!pos) return null;
				const size = VEHICLE_MARKER_METRICS.sizeByZoom[zoom];
				const half = size / 2;
				return (
					<div
						key={vehicle.id}
						style={{
							position: 'absolute',
							left: pos.x - half,
							top: pos.y - half,
							width: size,
							height: size,
							pointerEvents: 'auto',
						}}
					>
						<VehicleMarker
							vehicle={vehicle}
							topAlertSeverity={getTopUnackedSeverity(vehicle.id, alerts)}
							isSelected={vehicle.id === selectedVehicleId}
							zoom={zoom}
							onSelectVehicle={onSelectVehicle}
						/>
					</div>
				);
			})}
		</div>
	);
});

const MapRoutesLayer = React.memo(function MapRoutesLayer({
	visibleRoutes,
	selectedVehicleId,
	vehicles,
	weights,
}: {
	visibleRoutes: Route[];
	selectedVehicleId: VehicleId | null;
	vehicles: Vehicle[];
	weights: { normal: number; selected: number };
}) {
	return (
		<>
			{visibleRoutes.flatMap((route) => {
				const isSelected = route.vehicleId === selectedVehicleId;
				const vehicle = vehicles.find((v) => v.id === route.vehicleId);
				return route.points.slice(0, -1).map((from, i) => {
					const to = route.points[i + 1];
					const state = route.segmentStates[i] ?? 'planned';
					const start =
						i === 0 && vehicle
							? ([vehicle.lat, vehicle.lng] as LatLngTuple)
							: ([from.lat, from.lng] as LatLngTuple);
					const positions: LatLngTuple[] = [start, [to.lat, to.lng]];
					const color =
						state === 'completed'
							? '#a7b6d3'
							: state === 'active'
								? '#69b7ff'
								: '#71819e';
					return (
						<Polyline
							key={`${route.vehicleId}-${i}`}
							positions={positions}
							pathOptions={{
								color: isSelected ? '#69b7ff' : color,
								weight: isSelected ? weights.selected : weights.normal,
								opacity: isSelected ? 1 : state === 'planned' ? 0.55 : 0.75,
							}}
						/>
					);
				});
			})}
		</>
	);
});

export default React.memo(function LeafletMapWorkspace({
	vehicles,
	alerts,
	routes,
	selectedVehicleId,
	showRoutes,
	showWaypoints,
	focusOnSelected,
	zoom,
	routeLineWeight,
	onSelectVehicle,
	onZoomChange,
	children,
}: LeafletMapWorkspaceProps) {
	const weights = ROUTE_WEIGHT[routeLineWeight];
	const visibleVehicleIds = React.useMemo(
		() => new Set(vehicles.map((v) => v.id)),
		[vehicles]
	);
	const visibleRoutes = React.useMemo(
		() => routes.filter((r) => visibleVehicleIds.has(r.vehicleId)),
		[routes, visibleVehicleIds]
	);
	const selectedVehicle = React.useMemo(
		() => vehicles.find((v) => v.id === selectedVehicleId) ?? null,
		[vehicles, selectedVehicleId]
	);

	const bounds = React.useMemo(() => {
		if (focusOnSelected && selectedVehicle) {
			return {
				minLat: selectedVehicle.lat - FOCUS_MARGIN,
				maxLat: selectedVehicle.lat + FOCUS_MARGIN,
				minLng: selectedVehicle.lng - FOCUS_MARGIN,
				maxLng: selectedVehicle.lng + FOCUS_MARGIN,
			};
		}
		const allLats = [
			...vehicles.map((v) => v.lat),
			...visibleRoutes.flatMap((r) => r.points.map((p) => p.lat)),
		];
		const allLngs = [
			...vehicles.map((v) => v.lng),
			...visibleRoutes.flatMap((r) => r.points.map((p) => p.lng)),
		];
		/* Fallback center: Nevada desert (autonomy testing region) */
		return {
			minLat: allLats.length ? Math.min(...allLats) : 36.84,
			maxLat: allLats.length ? Math.max(...allLats) : 36.87,
			minLng: allLngs.length ? Math.min(...allLngs) : -116.04,
			maxLng: allLngs.length ? Math.max(...allLngs) : -116.01,
		};
	}, [vehicles, visibleRoutes, focusOnSelected, selectedVehicle]);

	const center: LatLngTuple = React.useMemo(
		() => [
			(bounds.minLat + bounds.maxLat) / 2,
			(bounds.minLng + bounds.maxLng) / 2,
		],
		[bounds]
	);

	return (
		<div className="leaflet-map-workspace">
			<MapContainer
				center={center}
				zoom={LEAFLET_ZOOM_BASE + zoom - 1}
				className="leaflet-map-container"
				zoomControl={false}
				attributionControl={true}
			>
				<TileLayer
					url={SATELLITE_TILE_URL}
					attribution={SATELLITE_ATTRIBUTION}
					maxZoom={19}
					maxNativeZoom={19}
				/>
				{showRoutes && (
					<MapRoutesLayer
						visibleRoutes={visibleRoutes}
						selectedVehicleId={selectedVehicleId}
						vehicles={vehicles}
						weights={weights}
					/>
				)}
				<MapBoundsSync
					bounds={bounds}
					focusOnSelected={focusOnSelected}
					selectedVehicle={selectedVehicle}
				/>
				<MapZoomSync zoom={zoom} onZoomChange={onZoomChange} />
				<MapMarkersOverlay
					vehicles={vehicles}
					alerts={alerts}
					visibleRoutes={visibleRoutes}
					selectedVehicleId={selectedVehicleId}
					showWaypoints={showWaypoints}
					zoom={Math.max(1, Math.min(3, zoom)) as VehicleMarkerZoom}
					onSelectVehicle={onSelectVehicle}
				/>
			</MapContainer>
			<div className="leaflet-map-overlays">
				{children}
			</div>
		</div>
	);
});
