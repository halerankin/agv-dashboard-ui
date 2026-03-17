import type { EventLogItem } from '../types';

type EventItemProps = {
	event: EventLogItem;
};

/** Maps event kind to a category for color-coded row styling. */
function getEventCategory(kind: EventLogItem['kind']): string {
	switch (kind) {
		case 'waypoint':
			return 'waypoint';
		case 'replan':
		case 'pause':
		case 'resume':
			return 'mission';
		case 'alert':
			return 'alert';
		case 'ack':
			return 'ack';
		case 'ui':
			return 'operator';
		default:
			return 'operator';
	}
}

function formatEventTime(atMs: number) {
	return new Date(atMs).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});
}

export default function EventItem({ event }: EventItemProps) {
	const category = getEventCategory(event.kind);

	return (
		<div className={`event-row event-row--${category}`}>
			<div className="event-row__header">
				<span className="event-row__time">{formatEventTime(event.atMs)}</span>
				<span className="event-row__vehicle">{event.vehicleId ?? '—'}</span>
			</div>
			<div className="event-row__message">{event.message}</div>
		</div>
	);
}