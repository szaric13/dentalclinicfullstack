import { useState } from 'react';
import { IconClock } from './icons';

const DAYS = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];

const emptyHours = () =>
    [1, 2, 3, 4, 5, 6].map((d) => ({ dayOfWeek: d, startTime: '', endTime: '', breakStart: '', breakEnd: '' }));

export default function HoursView({ onSave }) {
    const [hours, setHours] = useState(emptyHours);

    const update = (day, field, value) =>
        setHours((prev) => prev.map((h) => (h.dayOfWeek === day ? { ...h, [field]: value } : h)));

    return (
        <div className="panel">
            <div className="panel-head">
                <div>
                    <h3>Radno vreme</h3>
                    <div className="sub">Pon–Pet 08:00–19:00 • Subota 08:00–12:00 • Nedelja zatvoreno</div>
                </div>
            </div>
            <div className="panel-body">
                {hours.map((h) => {
                    const maxEnd = h.dayOfWeek === 6 ? '12:00' : '19:00';
                    return (
                        <div className="wh-day" key={h.dayOfWeek}>
                            <strong>{DAYS[h.dayOfWeek - 1]}</strong>
                            <div className="wh-field">
                                <label>Početak</label>
                                <input type="time" min="08:00" max={maxEnd} value={h.startTime}
                                    onChange={(e) => update(h.dayOfWeek, 'startTime', e.target.value)} />
                            </div>
                            <div className="wh-field">
                                <label>Kraj</label>
                                <input type="time" min="08:00" max={maxEnd} value={h.endTime}
                                    onChange={(e) => update(h.dayOfWeek, 'endTime', e.target.value)} />
                            </div>
                            <div className="wh-field">
                                <label>Pauza od</label>
                                <input type="time" value={h.breakStart}
                                    onChange={(e) => update(h.dayOfWeek, 'breakStart', e.target.value)} />
                            </div>
                            <div className="wh-field">
                                <label>Pauza do</label>
                                <input type="time" value={h.breakEnd}
                                    onChange={(e) => update(h.dayOfWeek, 'breakEnd', e.target.value)} />
                            </div>
                            <button
                                className="clinic-btn clinic-btn-soft clinic-btn-sm"
                                style={{ marginBottom: 1 }}
                                onClick={() => onSave(h)}
                            >
                                <IconClock width={15} height={15} /> Sačuvaj
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
