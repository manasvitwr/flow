export const getTodayKey = (date = new Date()) => date.toISOString().split('T')[0];
export const FOCUS_KEY = (date = new Date()) => `focusTime-${getTodayKey(date)}`;
export const TASKS_KEY = 'tasks';

export function formatFocusTime(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h > 0 ? `${h}h ` : ''}${m}m`;
}
