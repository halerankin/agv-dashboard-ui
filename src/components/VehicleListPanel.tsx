import type { Route, Vehicle, VehicleId } from '../types';
import VehicleCard from './VehicleCard';

type VehicleListPanelProps = {
    vehicles: Vehicle[];
    routes: Route[];
    selectedVehicleId: VehicleId | null;
    unackedCountByVehicleId: { [K in VehicleId]?: number };
    onSelectVehicle: (vehicleId: VehicleId | null) => void;
};

/** Derives concise mission progress from route: "M-001 · 2/3" or "M-001" or "—". */
function getMissionStatus(vehicleId: VehicleId, missionId: string | null, routes: Route[]): string {
    const route = routes.find((r) => r.vehicleId === vehicleId);
    if (!missionId) return '—';
    if (!route || route.points.length < 2) return missionId;
    const completed = route.segmentStates.filter((s) => s === 'completed').length;
    const current = completed + 1;
    const total = route.points.length;
    return `${missionId} · ${current}/${total}`;
}

export default function VehicleListPanel({
    vehicles,
    routes,
    selectedVehicleId,
    unackedCountByVehicleId,
    onSelectVehicle,
}: VehicleListPanelProps) {
    return (
        <div className="panel vehicle-list-panel">
            <div className="vehicle-list">
                {vehicles.map((vehicle) => (
                    <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        missionStatus={getMissionStatus(vehicle.id, vehicle.missionId, routes)}
                        isSelected={vehicle.id === selectedVehicleId}
                        onSelect={() =>
                            onSelectVehicle(
                                vehicle.id === selectedVehicleId ? null : vehicle.id
                            )
                        }
                        unackedCount={unackedCountByVehicleId[vehicle.id] ?? 0}
                    />
                ))}
            </div>
        </div>
    );
}