import * as React from 'react';

/** Seconds into video to extract placeholder frame (avoids black first frames). */
const PLACEHOLDER_SEEK_TIME = 2;

const SESSION_STORAGE_KEY_PREFIX = 'camera-placeholder:';

/** Module-level cache: videoSrc -> data URL. Reused across vehicle switches. */
const frameCache = new Map<string, string>();

function storageKey(videoSrc: string): string {
	return `${SESSION_STORAGE_KEY_PREFIX}${videoSrc}`;
}

/**
 * Extracts a single frame from the video at ~2s.
 * Checks in-memory cache and sessionStorage first; extracts only if not found.
 * Saves result to both cache and sessionStorage.
 */
export function extractPlaceholderFrame(videoSrc: string): Promise<string | null> {
	const cached = frameCache.get(videoSrc);
	if (cached) return Promise.resolve(cached);

	try {
		const stored = sessionStorage.getItem(storageKey(videoSrc));
		if (stored) {
			frameCache.set(videoSrc, stored);
			return Promise.resolve(stored);
		}
	} catch {
		// sessionStorage may be unavailable (private mode, quota)
	}

	return new Promise((resolve) => {
		const video = document.createElement('video');
		video.muted = true;
		video.playsInline = true;
		video.preload = 'auto';

		const cleanup = () => {
			video.src = '';
			video.load();
		};

		const handleLoadedData = () => {
			const duration = video.duration;
			const seekTime =
				Number.isFinite(duration) && duration > 0
					? Math.min(PLACEHOLDER_SEEK_TIME, duration * 0.5)
					: PLACEHOLDER_SEEK_TIME;
			video.currentTime = seekTime;
		};

		const handleSeeked = () => {
			try {
				const canvas = document.createElement('canvas');
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				if (canvas.width === 0 || canvas.height === 0) {
					cleanup();
					resolve(null);
					return;
				}

				const ctx = canvas.getContext('2d');
				if (!ctx) {
					cleanup();
					resolve(null);
					return;
				}

				ctx.drawImage(video, 0, 0);
				const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
				frameCache.set(videoSrc, dataUrl);
				try {
					sessionStorage.setItem(storageKey(videoSrc), dataUrl);
				} catch {
					// quota or disabled
				}
				cleanup();
				resolve(dataUrl);
			} catch {
				cleanup();
				resolve(null);
			}
		};

		const handleError = () => {
			cleanup();
			resolve(null);
		};

		video.addEventListener('loadeddata', handleLoadedData);
		video.addEventListener('seeked', handleSeeked);
		video.addEventListener('error', handleError);

		video.src = videoSrc;
		video.load();
	});
}

/**
 * Pre-warms placeholder frames for all known video sources.
 * Fire-and-forget; does not block rendering.
 */
export function prewarmPlaceholderFrames(videoSources: readonly string[]): void {
	for (const src of videoSources) {
		extractPlaceholderFrame(src).catch(() => {});
	}
}

/**
 * Returns cached frame for videoSrc. Checks sessionStorage on first access to hydrate cache.
 * Triggers extraction if not found. Used by MapCameraOverlay for loading placeholder.
 */
export function usePlaceholderFrame(videoSrc: string): string | null {
	const [frameUrl, setFrameUrl] = React.useState<string | null>(() => {
		const cached = frameCache.get(videoSrc);
		if (cached) return cached;
		try {
			const stored = sessionStorage.getItem(storageKey(videoSrc));
			if (stored) {
				frameCache.set(videoSrc, stored);
				return stored;
			}
		} catch {
			// sessionStorage unavailable
		}
		return null;
	});

	React.useEffect(() => {
		const cached = frameCache.get(videoSrc);
		if (cached) {
			setFrameUrl(cached);
			return;
		}

		try {
			const stored = sessionStorage.getItem(storageKey(videoSrc));
			if (stored) {
				frameCache.set(videoSrc, stored);
				setFrameUrl(stored);
				return;
			}
		} catch {
			// sessionStorage unavailable
		}

		let cancelled = false;
		extractPlaceholderFrame(videoSrc).then((url) => {
			if (!cancelled && url) setFrameUrl(url);
		});
		return () => {
			cancelled = true;
		};
	}, [videoSrc]);

	return frameUrl;
}
