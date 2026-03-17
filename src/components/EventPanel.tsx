import type { EventLogItem } from '../types';
import EventItem from './EventItem';

/** Operational event kinds shown in the timeline; telemetry ticks are excluded. */
const OPERATIONAL_KINDS = new Set<EventLogItem['kind']>([
	'waypoint',
	'replan',
	'pause',
	'resume',
	'alert',
	'ack',
	'ui',
]);

type EventPanelProps = {
	events: EventLogItem[];
};

export default function EventPanel({ events }: EventPanelProps) {
	const operationalEvents = events.filter((e) => OPERATIONAL_KINDS.has(e.kind));

	if (operationalEvents.length === 0) {
		return <div className="panel empty-state">No events yet</div>;
	}

	return (
		<div className="panel event-panel">
			<div className="event-list">
				{operationalEvents.map((event) => (
					<EventItem key={event.id} event={event} />
				))}
			</div>
		</div>
	);
}