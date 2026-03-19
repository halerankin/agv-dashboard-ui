import * as React from 'react';
import type { GlobalFilter, GlobalSort, VehicleId, Route } from './types';
import { initialRoutes } from './mockData';
import FleetWorkspace from './components/FleetWorkspace';
import { prewarmPlaceholderFrames } from './hooks/usePlaceholderFrame';
import { VEHICLE_VIDEO_SOURCES } from './utils/vehicleVideo';
import './App.css';
import './tokens.css';

export default function App() {
	const [routes] = React.useState<Route[]>(initialRoutes);

	React.useEffect(() => {
		prewarmPlaceholderFrames(VEHICLE_VIDEO_SOURCES);
	}, []);
	const [paused, setPaused] = React.useState(false);
	const [filter, setFilter] = React.useState<GlobalFilter>('all');
	const [sort, setSort] = React.useState<GlobalSort>('name');
	const [selectedVehicleId, setSelectedVehicleId] = React.useState<VehicleId | null>(null);
	const [contentView, setContentView] = React.useState<'detail' | 'events'>('events');

	const handleSelectVehicle = React.useCallback(
		(vehicleId: VehicleId | null) => {
			setSelectedVehicleId(vehicleId);
			if (vehicleId) setContentView('detail');
		},
		[]
	);

	return (
		<div className="app-shell">
			<FleetWorkspace
				paused={paused}
				filter={filter}
				sort={sort}
				routes={routes}
				selectedVehicleId={selectedVehicleId}
				contentView={contentView}
				onPausedToggle={() => setPaused((p) => !p)}
				onFilterChange={setFilter}
				onSortChange={setSort}
				onContentViewChange={setContentView}
				onSelectVehicle={handleSelectVehicle}
			/>
		</div>
	);
}
