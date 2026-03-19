import type { Alert, EventLogItem, Route, Vehicle, VehicleId, VehicleAction } from '../types';
import type { ContentView } from './ContentViewToggle';
import FleetSummaryPanel from '../components/FleetSummaryPanel';
import VehicleListPanel from '../components/VehicleListPanel';
import MapPanel from '../components/MapPanel';
import VehicleDetailsPanel from '../components/VehicleDetailsPanel';
import MapCameraOverlay from '../components/MapCameraOverlay';
import EventPanel from '../components/EventPanel';
import { getVehicleVideoSrc } from '../utils/vehicleVideo';

type DashboardMainSectionProps = {
    alerts: Alert[];
    events: EventLogItem[];
    vehicles: Vehicle[];
    allVehicles: Vehicle[];
    routes: Route[];
    selectedVehicleId: VehicleId | null;
    unackedCountByVehicleId: { [K in VehicleId]?: number };
    contentView: ContentView;
    onSelectVehicle: (vehicleId: VehicleId | null) => void;
    onVehicleAction: (vehicleId: VehicleId, action: VehicleAction) => void;
};

export default function DashboardMainSection({
    alerts,
    events,
    vehicles,
    allVehicles,
    routes,
    selectedVehicleId,
    unackedCountByVehicleId,
    contentView,
    onSelectVehicle,
    onVehicleAction,
}: DashboardMainSectionProps) {
    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) ?? null;

    return (
        <div className="layout">
            <div className="layout__sidebar">
                <FleetSummaryPanel
                    vehicles={allVehicles}
                    unackedCountByVehicleId={unackedCountByVehicleId}
                />
                <VehicleListPanel
                    vehicles={vehicles}
                    routes={routes}
                    selectedVehicleId={selectedVehicleId}
                    unackedCountByVehicleId={unackedCountByVehicleId}
                    onSelectVehicle={onSelectVehicle}
                />
            </div>

            <div className="layout__map">
                <MapPanel
                    vehicles={vehicles}
                    alerts={alerts}
                    routes={routes}
                    selectedVehicleId={selectedVehicleId}
                    onSelectVehicle={onSelectVehicle}
                />
            </div>

            <div className="layout__content">
                <div className="content-panel">
                    <div className="content-panel__body">
                        {contentView === 'detail' ? (
                            selectedVehicle ? (
                                <div className="content-panel__detailLayout">
                                    <div className="content-panel__detailScroll">
                                        <VehicleDetailsPanel
                                            alerts={alerts}
                                            events={events}
                                            vehicle={selectedVehicle}
                                            routes={routes}
                                            onVehicleAction={onVehicleAction}
                                        />
                                    </div>

                                    <div className="content-panel__cameraDock">
                                        <MapCameraOverlay
                                            vehicle={selectedVehicle}
                                            videoSrc={getVehicleVideoSrc(selectedVehicle.id)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="panel content-panel__empty">
                                    Select a vehicle to view details
                                </div>
                            )
                        ) : (
                            <EventPanel events={events} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}