export type ContentView = 'detail' | 'events';

type ContentViewToggleProps = {
	value: ContentView;
	onChange: (value: ContentView) => void;
};

export default function ContentViewToggle({
	value,
	onChange,
}: ContentViewToggleProps) {
	return (
		<div className="toolbar">
			<div className="toolbar__group">
				<span className="toolbar__label">View</span>
				<div className="toolbar__view-buttons">
					<button
						type="button"
						className={`toolbar__view-btn ${value === 'detail' ? 'toolbar__view-btn--active' : ''}`}
						onClick={() => onChange('detail')}
					>
						Vehicle
					</button>
					<button
						type="button"
						className={`toolbar__view-btn ${value === 'events' ? 'toolbar__view-btn--active' : ''}`}
						onClick={() => onChange('events')}
					>
						Events
					</button>
				</div>
			</div>
		</div>
	);
}
