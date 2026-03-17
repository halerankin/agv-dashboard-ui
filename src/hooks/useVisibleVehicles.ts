import * as React from 'react';
import type { Alert, VehicleId, Vehicle, GlobalFilter, GlobalSort } from '../types';
import { SeverityRank } from '../types';

type UseVisibleVehiclesArgs = {
    vehicles: Vehicle[],
    filter: GlobalFilter,
    sort: GlobalSort, 
    alertsByVehicleId: {[K in VehicleId]?: Alert[]},
    unackedCountByVehicleId: {[K in VehicleId]?: number}
  }

export function useVisibleVehicles({
    vehicles,
    filter,
    sort,
    alertsByVehicleId,
    unackedCountByVehicleId
}: UseVisibleVehiclesArgs) {
    const visibleVehicles = React.useMemo(() => {
        const visible: Vehicle[] = [];
        
        for (const vehicle of vehicles) {
            // apply filter
            if (filter === 'all') {
                visible.push(vehicle);
            }
            else if (filter === 'badComms') {
                if (vehicle.connection !== 'online') {
                visible.push(vehicle);
                }
            }
            else if (filter === 'hasAlerts') {
                if ((unackedCountByVehicleId[vehicle.id] ?? 0) > 0) {
                visible.push(vehicle);
                }
            }
        }

        // find highest sev among alerts for this vehicle
        function vehicleAlertSevRank(v: VehicleId): number {
            const alertsForVehicle: Alert[] = alertsByVehicleId[v] ?? [];
            let bestRank = 0;
            // scan the alerts and keep the highest rank seen. One pass, no mutation.
            for (const alert of alertsForVehicle) {
            // only unacked alerts
            if (!alert.acked) {
                const currentRank = SeverityRank[alert.severity];
                // store rank each time only if it is higher than the previous
                if (currentRank > bestRank) {
                bestRank = currentRank;
                }
            }
            }
            return bestRank;
        }
        // apply sort
        if (sort === 'name') {
        visible.sort((a, b) => a.name.localeCompare(b.name));
        }
        else if (sort === 'severity') {
        visible.sort((a, b) => vehicleAlertSevRank(b.id) - vehicleAlertSevRank(a.id))
        }
        else if (sort === 'lastUpdate') {
        visible.sort((a, b) => b.lastUpdateMs - a.lastUpdateMs);
        }

    return visible;
    }, [vehicles, filter, sort, alertsByVehicleId, unackedCountByVehicleId])

return { visibleVehicles }
}
