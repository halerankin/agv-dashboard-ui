import * as React from 'react';
import type { Vehicle } from '../types';

type MapCameraOverlayProps = {
	vehicle: Vehicle;
	/** Video source for this vehicle; only the active vehicle's video is loaded. */
	videoSrc: string;
};

/**
 * Floating camera overlay above the map. Starts paused; click video toggles play/pause.
 * Click header or video to expand. Does not alter map layout or dimensions.
 */
function MapCameraOverlayInner({ vehicle, videoSrc }: MapCameraOverlayProps) {
	const [expanded, setExpanded] = React.useState(false);
	const [expandedSize, setExpandedSize] = React.useState<'default' | 'large'>('default');
	const videoRef = React.useRef<HTMLVideoElement>(null);

	const handleExpand = () => {
		if (!expanded) {
			setExpanded(true);
		}
	};

	const handleToggleExpanded = () => {
		if (expanded) {
		  setExpanded(false);
		  setExpandedSize('default');
		} else {
		  setExpanded(true);
		}
	};

	React.useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
	  
		if (expanded) {
		  video.play().catch(() => {});
		} else {
		  video.pause();
		}
	}, [expanded, videoSrc]);


	return (
		<div
			className={[
				'map-camera-overlay',
				expanded ? 'map-camera-overlay--expanded' : '',
				expanded && expandedSize === 'large' ? 'map-camera-overlay--expanded-large' : '',
			]
				.filter(Boolean)
				.join(' ')}
			role="region"
			aria-label={`${vehicle.name} camera feed`}
			>
			<div className="map-camera-overlay__header">
				<button
					type="button"
					className="map-camera-overlay__headerButton"
					onClick={handleToggleExpanded}
					aria-label={expanded ? 'Dock camera' : 'Expand camera'}
					aria-expanded={expanded}
				>
				<span className="map-camera-overlay__title">
					{vehicle.name} — Camera
				</span>
				</button>

				{expanded && (
				  <div className="map-camera-overlay__controls">
					<button
						type="button"
						className="map-camera-overlay__sizeButton"
						onClick={(e) => {
						e.stopPropagation();
						setExpandedSize('default');
						}}
						aria-pressed={expandedSize !== 'large'}
					>
						2x
					</button>

					<button
						type="button"
						className="map-camera-overlay__sizeButton"
						onClick={(e) => {
						e.stopPropagation();
						setExpandedSize('large');
						}}
						aria-pressed={expandedSize === 'large'}
					>
						3x
					</button>
				</div>
				)}
			</div>

			<div
				className="map-camera-overlay__feed"
				role="button"
				tabIndex={0}
				onClick={handleExpand}
				onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					handleExpand();
				}
				}}
				aria-label={expanded ? 'Camera feed' : 'Expand camera view'}
			>

				<video
				key={vehicle.id}
				ref={videoRef}
				className="map-camera-overlay__video"
				src={videoSrc}
				muted
				loop
				playsInline
				preload="metadata"
				aria-label="Play or pause camera video"
				/>
			</div>
			</div>
	);
}

export default React.memo(MapCameraOverlayInner);
