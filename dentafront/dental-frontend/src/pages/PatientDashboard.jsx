import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function PatientDashboard() {
    const [profile, setProfile] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const [rescheduleId, setRescheduleId] = useState(null);
    const [rescheduleDoctorId, setRescheduleDoctorId] = useState(null);
    const [rescheduleServiceId, setRescheduleServiceId] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newSlots, setNewSlots] = useState([]);
    const [newSlot, setNewSlot] = useState('');

    const [reviewId, setReviewId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const fetchData = async () => {
        try {
            const pRes = await api.get('/patient/profile');
            setProfile(pRes.data);
            const aRes = await api.get('/patient/appointments');
            setAppointments(aRes.data);
        } catch (err) {
            console.error('Greška pri učitavanju:', err);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Sigurno želite da otkažete termin?')) return;
        try {
            await api.delete(`/patient/appointments/${id}`);
            setMessage('Termin otkazan.');
            fetchData();
        } catch (err) {
            setMessage(err.response?.data?.error || 'Greška pri otkazivanju');
        }
    };

    const openReschedule = (app) => {
        setRescheduleId(app.id);
        setRescheduleDoctorId(app.doctorId);
        setRescheduleServiceId(app.serviceId);
        setNewDate('');
        setNewSlots([]);
        setNewSlot('');
    };

    const fetchNewSlots = async () => {
        if (!newDate || !rescheduleDoctorId || !rescheduleServiceId) return;
        try {
            const res = await api.get('/patient/available-slots', {
                params: { doctorId: rescheduleDoctorId, serviceId: rescheduleServiceId, date: newDate },
            });
            setNewSlots(res.data);
        } catch (err) {
            setMessage(err.response?.data?.error || 'Greška pri učitavanju slotova');
        }
    };

    const submitReschedule = async () => {
        if (!newSlot) return;
        try {
            await api.put(`/patient/appointments/${rescheduleId}/reschedule`, { newStartDateTime: newSlot });
            setMessage('Termin pomeren. Doktor mora ponovo da potvrdi.');
            setRescheduleId(null);
            fetchData();
        } catch (err) {
            setMessage(err.response?.data?.error || 'Greška pri pomeranju termina');
        }
    };

    const openReview = (id) => {
        setReviewId(id);
        setRating(5);
        setComment('');
    };

    const submitReview = async (doctorId) => {
        try {
            await api.post(`/reviews/doctors/${doctorId}`, { appointmentId: reviewId, rating, comment });
            setMessage('Ocena uspešno poslata!');
            setReviewId(null);
            fetchData();
        } catch (err) {
            setMessage(err.response?.data?.error || 'Greška pri slanju ocene');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (!profile) return <div style={styles.container}><p>Učitavanje...</p></div>;

    const statusLabel = (s) =>
        s === 'SCHEDULED' ? 'Zakazan' : s === 'CONFIRMED' ? 'Potvrđen' : s === 'CANCELLED' ? 'Otkazan' : s;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2>Dobrodošli, {profile.firstName} {profile.lastName}</h2>
                    <p>📞 {profile.phone} | ✉️ {profile.email}</p>
                    {profile.dateOfBirth && <p>🎂 {profile.dateOfBirth}</p>}
                </div>
                <div>
                    <button style={styles.primaryBtn} onClick={() => navigate('/patient/book')}>Zakaži novi termin</button>
                    <button style={{ ...styles.dangerBtn, marginLeft: 10 }} onClick={handleLogout}>Odjavi se</button>
                </div>
            </div>

            {message && <p style={{ color: message.includes('uspešno') || message.includes('otkazan') || message.includes('pomeren') ? 'green' : 'red' }}>{message}</p>}

            <h3>Vaši termini</h3>
            {appointments.length === 0 ? <p>Nemate zakazanih termina.</p> : (
                <div style={styles.list}>
                    {appointments.map(app => (
                        <div key={app.id} style={styles.card}>
                            <div>
                                <strong>{app.serviceName}</strong> – {app.doctorName}<br />
                                🗓️ {new Date(app.start).toLocaleString('sr-RS')} – {new Date(app.end).toLocaleTimeString('sr-RS')}<br />
                                Status: <span style={{ fontWeight: 'bold', color: app.status === 'CONFIRMED' ? 'green' : app.status === 'CANCELLED' ? 'red' : 'orange' }}>{statusLabel(app.status)}</span>
                            </div>
                            <div style={{ marginTop: 8 }}>
                                {(app.status === 'SCHEDULED' || app.status === 'CONFIRMED') && (
                                    <>
                                        <button style={styles.smallBtn} onClick={() => handleCancel(app.id)}>Otkaži</button>
                                        <button style={{ ...styles.smallBtn, marginLeft: 6 }} onClick={() => openReschedule(app)}>Pomeri</button>
                                    </>
                                )}
                                {app.status === 'CONFIRMED' && (
                                    <button style={{ ...styles.smallBtn, marginLeft: 6, background: '#f1c40f' }} onClick={() => openReview(app.id)}>Oceni</button>
                                )}
                            </div>

                            {rescheduleId === app.id && (
                                <div style={{ marginTop: 10, padding: 10, background: '#f9f9f9', borderRadius: 6 }}>
                                    <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ marginRight: 8 }} />
                                    <button style={styles.smallBtn} onClick={fetchNewSlots}>Prikaži slotove</button>
                                    {newSlots.length > 0 && (
                                        <select value={newSlot} onChange={e => setNewSlot(e.target.value)} style={{ marginLeft: 8 }}>
                                            <option value="">-- Izaberite vreme --</option>
                                            {newSlots.map((s, i) => <option key={i} value={s}>{new Date(s).toLocaleTimeString('sr-RS')}</option>)}
                                        </select>
                                    )}
                                    {newSlot && <button style={{ ...styles.smallBtn, marginLeft: 8, background: '#27ae60' }} onClick={submitReschedule}>Potvrdi pomeranje</button>}
                                    <button style={{ ...styles.smallBtn, marginLeft: 8 }} onClick={() => setRescheduleId(null)}>Odustani</button>
                                </div>
                            )}

                            {reviewId === app.id && (
                                <div style={{ marginTop: 10, padding: 10, background: '#f9f9f9', borderRadius: 6 }}>
                                    <label>Ocena (1-5):</label>
                                    <select value={rating} onChange={e => setRating(Number(e.target.value))} style={{ marginLeft: 8 }}>
                                        {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    <br />
                                    <input placeholder="Komentar" value={comment} onChange={e => setComment(e.target.value)} style={{ width: '100%', marginTop: 6 }} />
                                    <button style={{ ...styles.smallBtn, marginTop: 6 }} onClick={() => submitReview(app.doctorId)}>Pošalji ocenu</button>
                                    <button style={{ ...styles.smallBtn, marginLeft: 8 }} onClick={() => setReviewId(null)}>Odustani</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { maxWidth: 800, margin: '30px auto', padding: '0 20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 },
    primaryBtn: { padding: '10px 20px', background: '#3498db', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
    dangerBtn: { padding: '10px 20px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
    smallBtn: { padding: '4px 10px', border: 'none', borderRadius: 4, cursor: 'pointer', background: '#ddd' },
    list: { display: 'flex', flexDirection: 'column', gap: 12 },
    card: { padding: 15, border: '1px solid #eee', borderRadius: 8, background: '#fff' },
};