import { useState } from 'react';
import { IconCalendar, IconUser, IconCheck, IconX } from './icons';
import { StatusBadge, dayPart, fmtTime, fmtDate } from './helpers';

const FILTERS = [
    { key: 'ALL', label: 'Svi' },
    { key: 'SCHEDULED', label: 'Na čekanju' },
    { key: 'CONFIRMED', label: 'Potvrđeni' },
    { key: 'CANCELLED', label: 'Otkazani' },
];

export default function AppointmentsView({ appointments, search, onConfirm, onCancel }) {
    const [filter, setFilter] = useState('ALL');

    const term = search.trim().toLowerCase();
    const filtered = appointments
        .filter((a) => (filter === 'ALL' ? true : a.status === filter))
        .filter((a) =>
            !term ||
            a.doctorName?.toLowerCase().includes(term) ||
            a.serviceName?.toLowerCase().includes(term)
        )
        .sort((a, b) => new Date(b.start) - new Date(a.start));

    return (
        <div className="panel">
            <div className="panel-head">
                <div>
                    <h3>Svi termini</h3>
                    <div className="sub">{filtered.length} prikazano</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {FILTERS.map((f) => (
                        <button
                            key={f.key}
                            className={`clinic-btn clinic-btn-sm ${filter === f.key ? 'clinic-btn-primary' : 'clinic-btn-ghost'}`}
                            style={filter === f.key ? { width: 'auto' } : undefined}
                            onClick={() => setFilter(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="panel-body">
                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <IconCalendar width={28} height={28} />
                        <p>Nema termina za odabrani filter.</p>
                    </div>
                ) : (
                    filtered.map((a) => {
                        const { day, month } = dayPart(a.start);
                        return (
                            <div className="appt-row" key={a.id}>
                                <div className="when">
                                    <div className="d">{day}</div>
                                    <div className="m">{month}</div>
                                </div>
                                <div className="info">
                                    <strong>{a.serviceName}</strong>
                                    <span><IconUser width={14} height={14} />{a.doctorName}</span>
                                    <span style={{ color: 'var(--c-ink-2)', fontWeight: 600 }}>
                                        {fmtDate(a.start)} • {fmtTime(a.start)}–{fmtTime(a.end)}
                                    </span>
                                    {a.cancellationReason && (
                                        <span style={{ color: 'var(--c-danger)' }}>Razlog: {a.cancellationReason}</span>
                                    )}
                                </div>
                                <div className="right">
                                    <StatusBadge status={a.status} />
                                    <div className="row-actions">
                                        {a.status === 'SCHEDULED' && (
                                            <button
                                                className="clinic-btn clinic-btn-soft clinic-btn-sm"
                                                onClick={() => onConfirm(a.id)}
                                            >
                                                <IconCheck width={15} height={15} /> Potvrdi
                                            </button>
                                        )}
                                        {(a.status === 'SCHEDULED' || a.status === 'CONFIRMED') && (
                                            <button
                                                className="clinic-btn clinic-btn-danger clinic-btn-sm"
                                                onClick={() => onCancel(a.id)}
                                            >
                                                <IconX width={15} height={15} /> Otkaži
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
