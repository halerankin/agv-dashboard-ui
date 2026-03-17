import * as React from 'react';
import type { Alert, Vehicle, VehicleId, Severity } from '../types';

type AttentionSummaryBarProps = {
	alerts: Alert[];
	vehicles: Vehicle[];
};

/** Derives fleet-level attention counts: vehicles needing attention and breakdown by severity/bad comms. */
function useAttentionSummary(alerts: Alert[], vehicles: Vehicle[]) {
	return React.useMemo(() => {

		const vehicleIdsWithUnackedAlerts = new Set<VehicleId>();
		const countsBySeverity: Record<Severity, number> = {
			info: 0,
			warn: 0,
			crit: 0,
		};

		for (const alert of alerts) {
			if (!alert.acked) {
				vehicleIdsWithUnackedAlerts.add(alert.vehicleId);
				countsBySeverity[alert.severity]++;
			}
		}

		const vehicleIdsWithBadComms = new Set<VehicleId>();
		for (const v of vehicles) {
			if (v.connection === 'degraded' || v.connection === 'offline') {
				vehicleIdsWithBadComms.add(v.id);
			}
		}

		const vehiclesNeedingAttention = new Set([
			...vehicleIdsWithUnackedAlerts,
			...vehicleIdsWithBadComms,
		]);

		return {
			totalVehicles: vehiclesNeedingAttention.size,
			crit: countsBySeverity.crit,
			warn: countsBySeverity.warn,
			info: countsBySeverity.info,
			badComms: vehicleIdsWithBadComms.size,
		};
	}, [alerts, vehicles]);
}

export default function AttentionSummaryBar({
	alerts,
	vehicles,
}: AttentionSummaryBarProps) {
	const { totalVehicles, crit, warn, info, badComms } = useAttentionSummary(
		alerts,
		vehicles
	);

	const severity = crit > 0 ? 'critical' : warn > 0 || badComms > 0 ? 'warning' : 'info';

	if (totalVehicles === 0) {
		return (
		  <div
			className="attention-summary-bar attention-summary-bar--clear"
			role="status"
			aria-live="polite"
		  >
			<span className="attention-summary-bar__eyebrow">Status</span>
			<span className="attention-summary-bar__message">
			  All vehicles nominal
			</span>
		  </div>
		);
	  }
	
	const parts: string[] = [];
	if (crit > 0) parts.push(`Crit ${crit}`);
	if (warn > 0) parts.push(`Warn ${warn}`);
	if (info > 0) parts.push(`Info ${info}`);
	if (badComms > 0) parts.push(`Bad comms ${badComms}`);

	return (
	<div
		className={`attention-summary-bar attention-summary-bar--${severity}`}
		role="status"
		aria-live="polite"
	>
		<span className="attention-summary-bar__eyebrow">Attention</span>

		<span className="attention-summary-bar__message">
		{totalVehicles} vehicle{totalVehicles !== 1 ? 's' : ''} need attention
		</span>

		<span className="attention-summary-bar__counts">{parts.join(' · ')}</span>
	</div>
	);
}
