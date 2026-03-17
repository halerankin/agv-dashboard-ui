import * as React from 'react';
import type { Vehicle, Severity, VehicleId } from '../types';

/** Single source of truth for marker geometry — used by placement and styling. */
export const VEHICLE_MARKER_METRICS = {
	size: 112,
	centerBodySize: 28,
	outerRingSize: 96,
	headingOffset: 18,
	/** Container size per zoom level (1=far, 2=mid, 3=close) for cheaper far-zoom rendering. */
	sizeByZoom: { 1: 48, 2: 80, 3: 112 } as const,
} as const;

export type VehicleMarkerZoom = 1 | 2 | 3;

type VehicleMarkerProps = {
	vehicle: Vehicle;
	topAlertSeverity: Severity | null;
	isSelected: boolean;
	zoom: VehicleMarkerZoom;
	onSelectVehicle: (vehicleId: VehicleId) => void;
	style?: React.CSSProperties;
};

/** Derives halo status from connection + alert severity for visual hierarchy. */
function getStatus(
	connection: Vehicle['connection'],
	topAlertSeverity: Severity | null
): 'normal' | 'degraded' | 'critical' | 'offline' {
	if (connection === 'offline') return 'offline';
	if (topAlertSeverity === 'crit') return 'critical';
	if (connection === 'degraded' || topAlertSeverity === 'warn')
		return 'degraded';
	return 'normal';
}

/** Zoom-level dimensions: far=minimal, mid=reduced, full=complete. */
const ZOOM_DIMENSIONS: Record<
	VehicleMarkerZoom,
	{ size: number; ringSize: number; arrowWidth: number; arrowHeight: number }
> = {
	1: { size: 48, ringSize: 0, arrowWidth: 4, arrowHeight: 10 },
	2: { size: 80, ringSize: 64, arrowWidth: 5, arrowHeight: 12 },
	3: { size: 112, ringSize: 96, arrowWidth: 7, arrowHeight: 16 },
};

function VehicleMarkerInner({
	vehicle,
	topAlertSeverity,
	isSelected,
	zoom,
	onSelectVehicle,
	style,
}: VehicleMarkerProps) {
	const status = getStatus(vehicle.connection, topAlertSeverity);
	const dims = ZOOM_DIMENSIONS[zoom];

	const cssVars = {
		'--vehicle-marker-size': `${dims.size}px`,
		'--vehicle-marker-outer-ring-size': `${dims.ringSize}px`,
		'--vehicle-marker-arrow-width': `${dims.arrowWidth}px`,
		'--vehicle-marker-arrow-height': `${dims.arrowHeight}px`,
	} as React.CSSProperties;

	const handleClick = React.useCallback(() => {
		onSelectVehicle(vehicle.id);
	}, [onSelectVehicle, vehicle.id]);

	return (
		<button
			type="button"
			className={`vehicle-marker vehicle-marker--zoom-${zoom} ${isSelected ? 'vehicle-marker--selected' : ''} vehicle-marker--status-${status}`}
			onClick={handleClick}
			aria-label={`${vehicle.name} marker`}
			style={{ ...cssVars, ...style }}
		>
			<div
				className="vehicle-marker__heading-wedge"
				style={{ transform: `rotate(${vehicle.headingDeg}deg)` }}
				aria-hidden
			/>
			{dims.ringSize > 0 && <div className="vehicle-marker__ring-outer" />}
		</button>
	);
}

export default React.memo(VehicleMarkerInner);
