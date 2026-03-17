import * as React from 'react';
import type { Alert, VehicleId } from '../types';
import { SeverityRank } from '../types';

export function useVehicleAlerts(alerts: Alert[]) {

    const alertsByVehicleId = React.useMemo(() => {
        const alertsAcc: { [K in VehicleId]?: Alert[] } = {} 

        // For each alert
        for (const alert of alerts) {
        // Grab its vehicleId and ue this as a key
        const key = alert.vehicleId
        // Create array if missing
        if(!alertsAcc[key]) {
            alertsAcc[key] = [];
        }
        // Add alert to accumulator object using the key
        alertsAcc[key].push(alert); 
        }
        // return the accumulator
        return alertsAcc
    },[alerts]);

    const unackedCountByVehicleId = React.useMemo(() => {
        const counts: { [K in VehicleId]?: number } = {};
        const vehicleIds = Object.keys(alertsByVehicleId) as VehicleId[];
                
        for (const vehicleId of vehicleIds) {
          const alertsForVehicle = alertsByVehicleId[vehicleId] ?? [];
          
          const unackedCount = alertsForVehicle.filter(
              (alert) => !alert.acked
          ).length;
    
          counts[vehicleId] = unackedCount;
        }
        
        return counts;
      },[alertsByVehicleId]);

      const topAlert = React.useMemo(() => {
        let best: Alert | null = null;
        
        for (const alert of alerts) {
          if (!alert.acked) {
            if (best === null) {
              best = alert;
            } else {
              if (SeverityRank[alert.severity] > SeverityRank[best.severity]) {
                best = alert
              } else {
                // tie breaker
                if (SeverityRank[alert.severity] === SeverityRank[best.severity]) {
                  // newest alert is kept
                  if (alert.createdAtMs > best.createdAtMs) {
                    best = alert;
                  }
                }
              }
            }
          }
        }
        return best;
      },[alert]);

    return { alertsByVehicleId, unackedCountByVehicleId, topAlert }
}