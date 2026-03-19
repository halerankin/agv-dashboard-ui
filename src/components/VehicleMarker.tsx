import * as React from 'react';
import type { Vehicle, Severity, VehicleId } from '../types';
import './VehicleMarker.css';
import MarkerTriangleFilled from '../icons/marker-triangle-filled.svg?react';
import MarkerTriangleOutline from '../icons/marker-triangle-outline.svg?react';

export const VEHICLE_MARKER_DETAIL_SIZE = {
	minimal: 48,
	reduced: 80,
	full: 112,
	close: 128,
} as const;

export type VehicleMarkerDetailMode = 'minimal' | 'reduced' | 'full' | 'close';
export type VehicleMarkerSelectionStyle = 'default' | 'large-triangle';

type VehicleMarkerProps = {
	vehicle: Vehicle;
	topAlertSeverity: Severity | null;
	isSelected: boolean;
	detailMode: VehicleMarkerDetailMode;
	onSelectVehicle: (vehicleId: VehicleId) => void;
	style?: React.CSSProperties;
	selectionStyle?: VehicleMarkerSelectionStyle;
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

const MARKER_DIMENSIONS: Record<
	VehicleMarkerDetailMode,
	{ 
		size: number; 
		ringSize: number; 
		arrowWidth: number; 
		arrowHeight: number
		selectedDotSize: number;
		selectedTriangleSize: number;
	 }
> = {
	minimal: {
		size: VEHICLE_MARKER_DETAIL_SIZE.minimal,
		ringSize: 0,
		arrowWidth: 4,
		arrowHeight: 10,
		selectedDotSize: 6,
		selectedTriangleSize: 0,
	},
	reduced: {
		size: VEHICLE_MARKER_DETAIL_SIZE.reduced,
		ringSize: 64,
		arrowWidth: 5,
		arrowHeight: 12,
		selectedDotSize: 8,
		selectedTriangleSize: 90,
	},
	full: {
		size: VEHICLE_MARKER_DETAIL_SIZE.full,
		ringSize: 96,
		arrowWidth: 7,
		arrowHeight: 16,
		selectedDotSize: 10,
		selectedTriangleSize: 122,
	},
	close: {
		size: VEHICLE_MARKER_DETAIL_SIZE.close,
		ringSize: 108,
		arrowWidth: 8,
		arrowHeight: 18,
		selectedDotSize: 12,
		selectedTriangleSize: 132,
	},
} as const;


function VehicleMarkerInner({
	vehicle,
	topAlertSeverity,
	isSelected,
	detailMode,
	onSelectVehicle,
	style,
	selectionStyle = 'default',
}: VehicleMarkerProps) {
	const status = getStatus(vehicle.connection, topAlertSeverity);
	const dims = MARKER_DIMENSIONS[detailMode];
	const isTriangleSelection =
	selectionStyle === 'large-triangle' && isSelected && dims.selectedTriangleSize > 0;

	const cssVars = {
		'--vehicle-marker-size': `${dims.size}px`,
		'--vehicle-marker-outer-ring-size': `${dims.ringSize}px`,
		'--vehicle-marker-arrow-width': `${dims.arrowWidth}px`,
		'--vehicle-marker-arrow-height': `${dims.arrowHeight}px`,
		'--vehicle-marker-selected-dot-size': `${dims.selectedDotSize}px`,
		'--vehicle-marker-selected-triangle-size': `${dims.selectedTriangleSize}px`,
	} as React.CSSProperties;

	const handleClick = React.useCallback(() => {
		onSelectVehicle(vehicle.id);
	}, [onSelectVehicle, vehicle.id]);

	return (
		<button
			type="button"
			className={[
				'vehicle-marker',
				`vehicle-marker--status-${status}`,
				isSelected ? 'vehicle-marker--selected' : '',
				isTriangleSelection ? 'vehicle-marker--selection-large-triangle' : '',
			]
				.filter(Boolean)
				.join(' ')}
			onClick={handleClick}
			aria-label={`${vehicle.name} marker`}
			style={{ ...cssVars, ...style }}
		>
			<div
				className="vehicle-marker__heading-wedge"
				style={{ transform: `rotate(${vehicle.headingDeg}deg)` }}
				aria-hidden
			>
				<MarkerTriangleFilled />
			</div>
			
			{dims.ringSize > 0 && !isTriangleSelection && (
				<div className="vehicle-marker__ring-outer" />
			)}
		
			{isTriangleSelection && (
				<div
					className="vehicle-marker__selected-triangle"
					style={{ transform: `rotate(${vehicle.headingDeg}deg)` }}
					aria-hidden
				>
					<MarkerTriangleOutline />
				</div>
			)}
		</button>
	);
}

export default React.memo(VehicleMarkerInner);
