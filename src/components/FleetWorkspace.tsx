import * as React from 'react';
import type { 
    Alert,
    EventKind,
    EventLogItem,
    GlobalFilter,
    GlobalSort,
    Route,
    Vehicle,
    VehicleId,
    VehicleAction
} from '../types';
import { initialVehicles, initialAlerts, initialEvents } from '../mockData';
import Filter from './Filter';
import AttentionSummaryBar from './AttentionSummaryBar';
import ContentViewToggle from './ContentViewToggle';
import DashboardMainSection from './DashboardMainSection';
import { useVehicleAlerts } from '../hooks/useVehicleAlerts';
import { useVisibleVehicles } from '../hooks/useVisibleVehicles';
import { useMockFleetTelemetry } from '../hooks/useMockFleetTelemetry';

type FleetWorkspaceProps = {
    paused: boolean;
    filter: GlobalFilter;
    sort: GlobalSort;
    routes: Route[];
    selectedVehicleId: VehicleId | null;
    contentView: 'detail' | 'events';
    onPausedToggle: () => void;
    onFilterChange: (filter: GlobalFilter) => void;
    onSortChange: (sort: GlobalSort) => void;
    onContentViewChange: (value: 'detail' | 'events') => void;
    onSelectVehicle: (vehicleId: VehicleId | null) => void;
}

export default function FleetWorkspace({
    paused,
    filter,
    sort,
    routes,
    selectedVehicleId,
    contentView,
    onPausedToggle,
    onFilterChange,
    onSortChange,
    onContentViewChange,
    onSelectVehicle
}: FleetWorkspaceProps) {
    const [vehicles, setVehicles] = React.useState<Vehicle[]>(initialVehicles);
    const [alerts, setAlerts] = React.useState<Alert[]>(initialAlerts);
    const [events, setEvents] = React.useState<EventLogItem[]>(initialEvents);

    useMockFleetTelemetry({
        paused,
        vehicles,
        setVehicles,
        setEvents,
        setAlerts,
      });

    const { alertsByVehicleId, unackedCountByVehicleId } = useVehicleAlerts(alerts);
    const { visibleVehicles } = useVisibleVehicles({
        vehicles,
        filter,
        sort,
        alertsByVehicleId,
        unackedCountByVehicleId
    });

    const unackedAlerts = alerts.filter(alert => !alert.acked);

    const handleVehicleAction = React.useCallback(
        (vehicleId: VehicleId, action: VehicleAction) => {
            const missionKinds: Record<VehicleAction, EventKind> = {
            pause: 'pause',
            resume: 'resume',
            return: 'ui',
            replan: 'replan',
            };

            const messages: Record<VehicleAction, string> = {
            pause: 'Operator: Paused mission',
            resume: 'Operator: Resume mission',
            return: 'Operator: Return to depot',
            replan: 'Operator: Replan route',
            };

            setEvents((prev) => [
            {
                id: crypto.randomUUID(),
                atMs: Date.now(),
                kind: missionKinds[action],
                message: messages[action],
                vehicleId,
            },
            ...prev,
            ]);
        },[]
    );

    const handleAcknowledgeAlert = React.useCallback(
        (alertId: string) => {
            setAlerts(currentAlerts =>
                currentAlerts.map(alert =>
                    alert.id === alertId
                    ? { ...alert, acked: true }
                    : alert
                )
            );
            setEvents(prev => {
                const alertToAck = alerts.find(alert => alert.id === alertId);

                return [
                {
                    id: crypto.randomUUID(),
                    atMs: Date.now(),
                    kind: 'ack',
                    message: alertToAck
                    ? `Acknowledged: ${alertToAck.message}`
                    : `Alert ${alertId} acknowledged`
                },
                ...prev,
            ];
        });
    },[alerts]);

  return (
    <>
      <div className="app-toolbar-row">
        <Filter
          filter={filter}
          sort={sort}
          paused={paused}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          onPausedToggle={onPausedToggle}
        />

        <AttentionSummaryBar alerts={unackedAlerts} vehicles={vehicles} />

        <div className="app-toolbar-row__right">
          <ContentViewToggle 
            value={contentView} 
            onChange={onContentViewChange} 
          />
        </div>
      </div>

      <div className="app-main">
        <DashboardMainSection
            alerts={alerts}
            events={events}
            vehicles={visibleVehicles}
            allVehicles={vehicles}
            routes={routes}
            selectedVehicleId={selectedVehicleId}
            unackedCountByVehicleId={unackedCountByVehicleId}
            contentView={contentView}
            onSelectVehicle={onSelectVehicle}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onVehicleAction={handleVehicleAction}
        />
      </div>
    </>
  );
}