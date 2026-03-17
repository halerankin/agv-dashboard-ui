import type { Connection, AutonomyState } from './types';

export const CONNECTION_TRANSITIONS: Record<Connection, Connection[]> = {
    online: ['degraded'],
    degraded: ['online', 'offline'],
    offline: ['degraded'],
};

export const AUTONOMY_TRANSITIONS: Partial<Record<AutonomyState, AutonomyState[]>> = {
    idle: ['navigating'],
    navigating: ['idle', 'charging'],
    charging: ['idle'],
    maintenance: ['idle'],
    error: ['idle'],
};