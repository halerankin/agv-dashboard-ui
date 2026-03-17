import { describe, expect, it } from 'vitest';
import { getVehicleVideoSrc, VEHICLE_VIDEO_SOURCES } from './vehicleVideo';

describe('getVehicleVideoSrc', () => {
	it('assigns deterministic video per vehicle - same vehicle returns same source', () => {
		expect(getVehicleVideoSrc('AV-01')).toBe(getVehicleVideoSrc('AV-01'));
		expect(getVehicleVideoSrc('AV-02')).toBe(getVehicleVideoSrc('AV-02'));
		expect(getVehicleVideoSrc('AV-03')).toBe(getVehicleVideoSrc('AV-03'));
	});

	it('assigns unique video to each of the three vehicles', () => {
		const src1 = getVehicleVideoSrc('AV-01');
		const src2 = getVehicleVideoSrc('AV-02');
		const src3 = getVehicleVideoSrc('AV-03');
		expect(src1).not.toBe(src2);
		expect(src1).not.toBe(src3);
		expect(src2).not.toBe(src3);
	});

	it('returns a valid source from the known pool', () => {
		const sources = [...VEHICLE_VIDEO_SOURCES];
		expect(sources).toContain(getVehicleVideoSrc('AV-01'));
		expect(sources).toContain(getVehicleVideoSrc('AV-02'));
		expect(sources).toContain(getVehicleVideoSrc('AV-03'));
	});

	it('maps AV-01 to first video, AV-02 to second, AV-03 to third (1:1)', () => {
		expect(getVehicleVideoSrc('AV-01')).toBe(VEHICLE_VIDEO_SOURCES[0]);
		expect(getVehicleVideoSrc('AV-02')).toBe(VEHICLE_VIDEO_SOURCES[1]);
		expect(getVehicleVideoSrc('AV-03')).toBe(VEHICLE_VIDEO_SOURCES[2]);
	});
});
