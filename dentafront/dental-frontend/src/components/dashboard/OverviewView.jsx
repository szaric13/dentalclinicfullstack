import { IconCalendar, IconCheck, IconClock, IconUser, IconTrend, IconStar } from './icons';
import { StatusBadge, dayPart, fmtTime, isSameDay, initialsOf } from './helpers';

function StatCard({ icon: Icon, tone, value, label, trend }) {
    return (
        <div className="stat-card">
            <div className="top">
                <div className={`ic ${tone}`}><Icon width={22} height={22} /></div>
                {trend && <span className="pill"><IconTrend width={12} height={12} />{trend}</span>}
            </div>
            <div className="num">{value}</div>
            <div className="lbl">{label}</div>
        </div>
    );
}

export default function OverviewView({ appointments, avgRating, reviewCount, profile, onGoTo }) {
    const now = new Date();
    const today = appointments.filter((a) => isSameDay(a.start, now) && a.status !== 'CANCELLED');
    const pending = appointments.filter((a) => a.status === 'SCHEDULED');
    const confirmed = appointments.filter((a) => a.status === 'CONFIRMED');
    const uniquePatients = new Set(appointments.map((a) => a.doctorName)).size;

    const upcoming = appointments
        .filter((a) => a.status !== 'CANCELLED' && new Date(a.start) >= new Date(now.toDateString()))
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, 6);

    return (
        <>
            <div className="dash-grid">
                <StatCard icon={IconCalendar} tone="" value={today.length} label="Termina danas" trend="Aktivno" />
                <StatCard icon={IconClock} tone="amber" value={pending.length} label="Čeka potvrdu" />
                <StatCard icon={IconCheck} tone="teal" value={confirmed.length} label="Potvrđenih termina" />
                <StatCard icon={IconUser} tone="rose" value={uniquePatients} label="Pacijenata ukupno" />
            </div>

            <div className="dash-cols">
                <div className="panel">
                    <div className="panel-head">
                        <div>
                            <h3>Nadolazeći termini</h3>
                            <div className="sub">Sledećih {upcoming.length} zakazanih poseta</div>
                        </div>
                        <button className="clinic-btn clinic-btn-soft clinic-btn-sm" onClick={() => onGoTo('appointments')}>
                            Svi termini
                        </button>
                    </div>
                    <div className="panel-body">
                        {upcoming.length === 0 ? (
                            <div className="empty-state">
                                <IconCalendar width={28} height={28} />
                                <p>Trenutno nemate nadolazećih termina.</p>
                            </div>
                        ) : (
                            upcoming.map((a) => {
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
                                        </div>
                                        <div className="right">
                                            <StatusBadge status={a.status} />
                                            <span className="appt-time">{fmtTime(a.start)}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-head">
                        <h3>Ocena ordinacije</h3>
                    </div>
                    <div className="panel-body">
                        <div className="rating-big">
                            <div className="score">{(avgRating || 0).toFixed(1)}</div>
                            <div>
                                <div className="review-stars">
                                    {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                                </div>
                                <small style={{ color: 'var(--c-muted)' }}>{reviewCount} ocena pacijenata</small>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--c-line)', paddingTop: 16, marginTop: 4 }}>
                            <div className="flex-between" style={{ marginBottom: 10 }}>
                                <span style={{ fontSize: 13, color: 'var(--c-muted)', fontWeight: 600 }}>Specijalizacija</span>
                                <strong style={{ fontSize: 14 }}>{profile?.specialization || '—'}</strong>
                            </div>
                            <div className="flex-between" style={{ marginBottom: 10 }}>
                                <span style={{ fontSize: 13, color: 'var(--c-muted)', fontWeight: 600 }}>Email</span>
                                <strong style={{ fontSize: 14 }}>{profile?.email}</strong>
                            </div>
                            <button className="clinic-btn clinic-btn-soft" style={{ marginTop: 8 }} onClick={() => onGoTo('reviews')}>
                                <IconStar width={16} height={16} /> Pogledaj sve ocene
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
