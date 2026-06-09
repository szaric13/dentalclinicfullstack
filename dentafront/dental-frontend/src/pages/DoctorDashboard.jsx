import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DAYS = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'];

export default function DoctorDashboard() {
    const [profile, setProfile] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState('');
    const [showHours, setShowHours] = useState(false);
    const [workingHours, setWorkingHours] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [showReviews, setShowReviews] = useState(false);

    const [cancelModal, setCancelModal] = useState({ show: false, id: null });
    const [cancelReason, setCancelReason] = useState('');

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const pRes = await api.get('/doctor/profile');
            setProfile(pRes.data);
            const aRes = await api.get('/doctor/appointments');
            setAppointments(aRes.data);
        } catch (err) {
            console.error('Greška pri učitavanju:', err);
            if (err.response?.status === 403) {
                localStorage.clear();
                navigate('/doctor');
            }
        }
    };

    const fetchReviews = async () => {
        if (!profile) return;
        try {
            const res = await api.get(`/reviews/doctors/${profile.id}`);
            setReviews(res.data);
            const avgRes = await api.get(`/reviews/doctors/${profile.id}/average`);
            setAvgRating(avgRes.data || 0);
        } catch {}
    };

    useEffect(() => { fetchData(); }, []);
    useEffect(() => { fetchReviews(); }, [profile]);

    const handleConfirm = async (id) => {
        try {
            await api.put(`/doctor/appointments/${id}/confirm`);
            setMessage('Termin potvrđen.');
            fetchData();
        } catch (err) {
            setMessage(err.response?.data?.error || 'Greška pri potvrdi');
        }
    };

    const openCancelModal = (id) => {
        setCancelModal({ show: true, id });
        setCancelReason('');
    };

    const handleCancel = async () => {
        if (!cancelModal.id) return;
        try {
            await api.delete(`/doctor/appointments/${cancelModal.id}`, { data: { reason: cancelReason } });
            setMessage('Termin otkazan.');
            setCancelModal({ show: false, id: null });
            fetchData();
        } catch (err) {
            setMessage(err.response?.data?.error || 'Greška pri otkazivanju');
        }
    };

    const initWorkingHours = () => {
        // Inicijalizuj radne dane sa praznim vrednostima
        setWorkingHours([1,2,3,4,5,6].map(d => ({ dayOfWeek: d, startTime: '', endTime: '', breakStart: '', breakEnd: '' })));
        setShowHours(!showHours);
    };

    const saveWorkingHours = async (dayData) => {
        const day = dayData.dayOfWeek;
        const minStart = '08:00';
        const maxEnd = (day === 6) ? '12:00' : '19:00'; // Subota do 12h

        if (day === 7) {
            setMessage('Nedeljom se ne radi.');
            return;
        }

        if (dayData.startTime && dayData.startTime < minStart) {
            setMessage('Početak radnog vremena ne može biti pre 08:00.');
            return;
        }
        if (dayData.endTime && dayData.endTime > maxEnd) {
            setMessage(`Kraj radnog vremena ne može biti posle ${maxEnd}.`);
            return;
        }
        if (dayData.startTime && dayData.endTime && dayData.startTime >= dayData.endTime) {
            setMessage('Vreme početka mora biti pre vremena kraja (min 1 sat razlike).');
            return;
        }
        if (dayData.breakStart && dayData.breakEnd && dayData.breakStart >= dayData.breakEnd) {
            setMessage('Početak pauze mora biti pre kraja pauze.');
            return;
        }

        try {
            await api.put('/doctor/working-hours', {
                doctorId: profile.id,
                dayOfWeek: dayData.dayOfWeek,
                startTime: dayData.startTime || null,
                endTime: dayData.endTime || null,
                breakStart: dayData.breakStart || null,
                breakEnd: dayData.breakEnd || null,
            });
            setMessage('Radno vreme sačuvano.');
        } catch (err) {
            setMessage(err.response?.data?.error || 'Greška pri čuvanju radnog vremena');
        }
    };

    const updateHour = (dayOfWeek, field, value) => {
        setWorkingHours(prev => prev.map(h => h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h));
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/doctor');
    };

    if (!profile) return <div className="container"><p>Učitavanje...</p></div>;

    const statusLabel = (s) =>
        s === 'SCHEDULED' ? 'Zakazan' : s === 'CONFIRMED' ? 'Potvrđen' : s === 'CANCELLED' ? 'Otkazan' : s;

    return (
        <div className="container" style={{ maxWidth: 900, marginTop: 30 }}>
            {/* Header */}
            <div className="header-bar" style={{ borderRadius: 'var(--radius)', marginBottom: 20 }}>
                <div>
                    <h2 style={{ color: 'var(--primary)' }}>🩺 dr {profile.firstName} {profile.lastName}</h2>
                    <p style={{ color: 'var(--text-light)' }}>{profile.specialization || 'Specijalizacija nije uneta'} | ✉️ {profile.email}</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-outline" onClick={initWorkingHours}>
                        {showHours ? 'Sakrij radno vreme' : '⏰ Radno vreme'}
                    </button>
                    <button className="btn btn-outline" onClick={() => setShowReviews(!showReviews)}>
                        {showReviews ? 'Sakrij ocene' : '⭐ Moje ocene'}
                    </button>
                    <button className="btn btn-danger" onClick={handleLogout}>Odjavi se</button>
                </div>
            </div>

            {message && (
                <p style={{
                    color: message.includes('sačuvano') || message.includes('potvrđen') || message.includes('otkazan') ? 'var(--success)' : 'var(--danger)',
                    marginBottom: 10, fontWeight: 600
                }}>
                    {message}
                </p>
            )}

            {/* Radno vreme */}
            {showHours && (
                <div className="card" style={{ marginBottom: 20 }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: 15 }}>⏰ Radno vreme</h3>
                    <p style={{ color: 'var(--text-light)', marginBottom: 15 }}>
                        Radno vreme ordinacije: Pon–Pet 08:00–19:00, Subota 08:00–12:00, Nedelja zatvoreno.
                    </p>
                    {workingHours.map(h => (
                        <div key={h.dayOfWeek} style={{ marginBottom: 15, padding: 15, background: 'var(--bg)', borderRadius: 8 }}>
                            <strong>{DAYS[h.dayOfWeek - 1]}</strong>
                            <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                                <label>Od: <input type="time" value={h.startTime || ''} onChange={e => updateHour(h.dayOfWeek, 'startTime', e.target.value)} min="08:00" max={h.dayOfWeek === 6 ? '12:00' : '19:00'} /></label>
                                <label>Do: <input type="time" value={h.endTime || ''} onChange={e => updateHour(h.dayOfWeek, 'endTime', e.target.value)} min="08:00" max={h.dayOfWeek === 6 ? '12:00' : '19:00'} /></label>
                                <label>Pauza od: <input type="time" value={h.breakStart || ''} onChange={e => updateHour(h.dayOfWeek, 'breakStart', e.target.value)} /></label>
                                <label>Pauza do: <input type="time" value={h.breakEnd || ''} onChange={e => updateHour(h.dayOfWeek, 'breakEnd', e.target.value)} /></label>
                                <button className="btn btn-primary btn-sm" onClick={() => saveWorkingHours(h)} style={{ padding: '6px 14px' }}>Sačuvaj</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ocene */}
            {showReviews && (
                <div className="card" style={{ marginBottom: 20 }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: 15 }}>⭐ Moje ocene</h3>
                    <p>Prosečna ocena: <span className="rating-stars">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))} ({avgRating.toFixed(1)})</span></p>
                    {reviews.length === 0 ? <p>Još uvek nemate ocena.</p> : (
                        reviews.map(r => (
                            <div key={r.id} style={{ padding: 12, marginTop: 8, background: 'var(--bg)', borderRadius: 8 }}>
                                <div className="rating-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                                <p>{r.comment || 'Bez komentara'}</p>
                                <small style={{ color: 'var(--text-light)' }}>{new Date(r.createdAt).toLocaleDateString('sr-RS')}</small>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Termini */}
            <div className="card">
                <h3 style={{ color: 'var(--primary)', marginBottom: 15 }}>📋 Vaši termini</h3>
                {appointments.length === 0 ? <p>Nemate zakazanih termina.</p> : (
                    appointments.map(app => (
                        <div key={app.id} className={`appointment-card ${app.status.toLowerCase()}`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <div>
                                    <strong>{app.serviceName}</strong> – Pacijent: {app.doctorName}<br />
                                    🗓️ {new Date(app.start).toLocaleString('sr-RS')} – {new Date(app.end).toLocaleTimeString('sr-RS')}
                                </div>
                                <span className={`status-badge status-${app.status.toLowerCase()}`}>{statusLabel(app.status)}</span>
                            </div>
                            {app.cancellationReason && <p style={{ marginTop: 5, color: 'var(--text-light)', fontSize: 13 }}>Razlog: {app.cancellationReason}</p>}
                            <div style={{ marginTop: 10 }}>
                                {app.status === 'SCHEDULED' && (
                                    <button className="btn btn-success btn-sm" style={{ marginRight: 8, padding: '6px 14px' }} onClick={() => handleConfirm(app.id)}>Potvrdi</button>
                                )}
                                {(app.status === 'SCHEDULED' || app.status === 'CONFIRMED') && (
                                    <button className="btn btn-danger btn-sm" style={{ padding: '6px 14px' }} onClick={() => openCancelModal(app.id)}>Otkaži</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal za otkazivanje */}
            {cancelModal.show && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: 400, padding: 25 }}>
                        <h3 style={{ color: 'var(--danger)' }}>Otkazivanje termina</h3>
                        <p style={{ marginTop: 10 }}>Unesite razlog otkazivanja:</p>
                        <textarea
                            style={{ width: '100%', padding: 10, marginTop: 10, borderRadius: 8, border: '2px solid var(--border)' }}
                            rows={3}
                            placeholder="Razlog otkazivanja..."
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                        />
                        <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                            <button className="btn btn-danger" onClick={handleCancel}>Potvrdi otkazivanje</button>
                            <button className="btn btn-outline" onClick={() => setCancelModal({ show: false, id: null })}>Odustani</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}