import type { VehicleId } from '../types';

import vehicle1 from '../assets/vehicle1.mp4';
import vehicle2 from '../assets/vehicle2.mp4';
import vehicle3 from '../assets/vehicle3.mp4';

/** Ordered video sources; index maps to vehicle by position. */
export const VEHICLE_VIDEO_SOURCES: readonly [string, string, string] = [
	vehicle1,
	vehicle2,
	vehicle3,
];

/** Stable order for mapping vehicle IDs to video index. */
const VEHICLE_ID_ORDER: readonly VehicleId[] = ['AV-01', 'AV-02', 'AV-03'];

/**
 * Returns the video source URL for a vehicle. Deterministic: same vehicle always
 * gets the same video. 1:1 for 3 vehicles; wraps by index for more.
 */
export function getVehicleVideoSrc(vehicleId: VehicleId): string {
	const idx = VEHICLE_ID_ORDER.indexOf(vehicleId);
	const index = idx >= 0 ? idx : 0;
	return VEHICLE_VIDEO_SOURCES[index % VEHICLE_VIDEO_SOURCES.length];
}
