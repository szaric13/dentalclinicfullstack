import { IconCheck, IconClock, IconX } from './icons';

export const STATUS_LABEL = {
    SCHEDULED: 'Zakazan',
    CONFIRMED: 'Potvrđen',
    CANCELLED: 'Otkazan',
};

export function StatusBadge({ status }) {
    return (
        <span className={`status-badge status-${status}`}>
            {status === 'CONFIRMED' && <IconCheck width={13} height={13} />}
            {status === 'SCHEDULED' && <IconClock width={13} height={13} />}
            {status === 'CANCELLED' && <IconX width={13} height={13} />}
            {STATUS_LABEL[status] || status}
        </span>
    );
}

export function initialsOf(name = '') {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
}

const MONTHS_SR = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];

export function dayPart(dateStr) {
    const d = new Date(dateStr);
    return { day: d.getDate(), month: MONTHS_SR[d.getMonth()] };
}

export function fmtTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
}

export function fmtDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('sr-RS', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function isSameDay(a, b) {
    const x = new Date(a), y = new Date(b);
    return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
}
