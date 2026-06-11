import { IconUser, IconCalendar } from './icons';
import { initialsOf, fmtDate } from './helpers';

/* Patients are derived from the doctor's appointments
   (the API returns the patient's name in `doctorName`). */
function buildPatients(appointments) {
    const map = new Map();
    for (const a of appointments) {
        const name = a.doctorName || 'Nepoznat pacijent';
        if (!map.has(name)) {
            map.set(name, { name, visits: 0, last: a.start, services: new Set() });
        }
        const p = map.get(name);
        p.visits += 1;
        if (new Date(a.start) > new Date(p.last)) p.last = a.start;
        if (a.serviceName) p.services.add(a.serviceName);
    }
    return [...map.values()].sort((a, b) => new Date(b.last) - new Date(a.last));
}

export default function PatientsView({ appointments, search }) {
    const term = search.trim().toLowerCase();
    const patients = buildPatients(appointments).filter(
        (p) => !term || p.name.toLowerCase().includes(term)
    );

    return (
        <div className="panel">
            <div className="panel-head">
                <div>
                    <h3>Pacijenti</h3>
                    <div className="sub">{patients.length} jedinstvenih pacijenata</div>
                </div>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
                {patients.length === 0 ? (
                    <div className="empty-state" style={{ margin: 20 }}>
                        <IconUser width={28} height={28} />
                        <p>Još uvek nemate pacijenata.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="dash-table">
                            <thead>
                                <tr>
                                    <th>Pacijent</th>
                                    <th>Poseta</th>
                                    <th>Usluge</th>
                                    <th>Poslednja poseta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((p) => (
                                    <tr key={p.name}>
                                        <td>
                                            <div className="cell-name">
                                                <span className="cell-avatar">{initialsOf(p.name)}</span>
                                                {p.name}
                                            </div>
                                        </td>
                                        <td>{p.visits}</td>
                                        <td style={{ color: 'var(--c-muted)' }}>
                                            {[...p.services].slice(0, 2).join(', ') || '—'}
                                            {p.services.size > 2 && ` +${p.services.size - 2}`}
                                        </td>
                                        <td>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--c-ink-2)' }}>
                                                <IconCalendar width={15} height={15} />
                                                {fmtDate(p.last)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
