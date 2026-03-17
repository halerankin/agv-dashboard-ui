import type { Connection, AutonomyState } from '../types';

export const connectionLabelByStatus: Record<Connection, string> = {
    online: '🟢 online',
    degraded: '🟡 degraded',
    offline: '🔴 offline'
};

export const autonomyLabelByState: Record<AutonomyState, string> = {
    idle: 'Idle',
    navigating: 'Navigating',
    charging: 'Charging',
    maintenance: 'Maintenance',
    error: 'Error',
};