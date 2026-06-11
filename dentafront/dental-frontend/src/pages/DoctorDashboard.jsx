import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import OverviewView from '../components/dashboard/OverviewView';
import AppointmentsView from '../components/dashboard/AppointmentsView';
import PatientsView from '../components/dashboard/PatientsView';
import HoursView from '../components/dashboard/HoursView';
import ReviewsView from '../components/dashboard/ReviewsView';
import ProfileView from '../components/dashboard/ProfileView';
import { IconCheck, IconX } from '../components/dashboard/icons';

export default function DoctorDashboard() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [loading, setLoading] = useState(true);

    const [active, setActive] = useState('overview');
    const [search, setSearch] = useState('');
    const [navOpen, setNavOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [cancelModal, setCancelModal] = useState({ show: false, id: null });
    const [cancelReason, setCancelReason] = useState('');

    const notify = (text, type = 'success') => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 3200);
    };

    const fetchData = async () => {
        try {
            const [pRes, aRes] = await Promise.all([
                api.get('/doctor/profile'),
                api.get('/doctor/appointments'),
            ]);
            setProfile(pRes.data);
            setAppointments(aRes.data);
        } catch (err) {
            console.error('Greška pri učitavanju:', err);
            if (err.response?.status === 403) {
                localStorage.clear();
                navigate('/doctor');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (doctorId) => {
        try {
            const [rRes, avgRes] = await Promise.all([
                api.get(`/reviews/doctors/${doctorId}`),
                api.get(`/reviews/doctors/${doctorId}/average`),
            ]);
            setReviews(rRes.data || []);
            setAvgRating(avgRes.data || 0);
        } catch {
            /* reviews are optional */
        }
    };

    useEffect(() => { fetchData(); }, []);
    useEffect(() => { if (profile?.id) fetchReviews(profile.id); }, [profile?.id]);

    const handleConfirm = async (id) => {
        try {
            await api.put(`/doctor/appointments/${id}/confirm`);
            notify('Termin je potvrđen.');
            fetchData();
        } catch (err) {
            notify(err.response?.data?.error || err.response?.data || 'Greška pri potvrdi', 'error');
        }
    };

    const openCancel = (id) => { setCancelModal({ show: true, id }); setCancelReason(''); };

    const submitCancel = async () => {
        if (!cancelModal.id) return;
        try {
            await api.delete(`/doctor/appointments/${cancelModal.id}`, { data: { reason: cancelReason } });
            notify('Termin je otkazan.');
            setCancelModal({ show: false, id: null });
            fetchData();
        } catch (err) {
            notify(err.response?.data?.error || 'Greška pri otkazivanju', 'error');
        }
    };

    const saveHours = async (dayData) => {
        const day = dayData.dayOfWeek;
        const maxEnd = day === 6 ? '12:00' : '19:00';
        if (dayData.startTime && dayData.startTime < '08:00') return notify('Početak ne može biti pre 08:00.', 'error');
        if (dayData.endTime && dayData.endTime > maxEnd) return notify(`Kraj ne može biti posle ${maxEnd}.`, 'error');
        if (dayData.startTime && dayData.endTime && dayData.startTime >= dayData.endTime) return notify('Početak mora biti pre kraja.', 'error');
        if (dayData.breakStart && dayData.breakEnd && dayData.breakStart >= dayData.breakEnd) return notify('Pauza: početak mora biti pre kraja.', 'error');
        try {
            await api.put('/doctor/working-hours', {
                doctorId: profile.id,
                dayOfWeek: dayData.dayOfWeek,
                startTime: dayData.startTime || null,
                endTime: dayData.endTime || null,
                breakStart: dayData.breakStart || null,
                breakEnd: dayData.breakEnd || null,
            });
            notify('Radno vreme je sačuvano.');
        } catch (err) {
            notify(err.response?.data?.error || 'Greška pri čuvanju radnog vremena', 'error');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/doctor');
    };

    if (loading) {
        return (
            <div className="clinic-loading">
                <span className="spinner" /> Učitavanje kontrolne table...
            </div>
        );
    }

    const pendingCount = appointments.filter((a) => a.status === 'SCHEDULED').length;

    return (
        <DashboardLayout
            profile={profile}
            active={active}
            onNavigate={setActive}
            onLogout={handleLogout}
            pendingCount={pendingCount}
            search={search}
            onSearch={setSearch}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
        >
            {active === 'overview' && (
                <OverviewView
                    appointments={appointments}
                    avgRating={avgRating}
                    reviewCount={reviews.length}
                    profile={profile}
                    onGoTo={setActive}
                />
            )}
            {active === 'appointments' && (
                <AppointmentsView
                    appointments={appointments}
                    search={search}
                    onConfirm={handleConfirm}
                    onCancel={openCancel}
                />
            )}
            {active === 'patients' && (
                <PatientsView appointments={appointments} search={search} />
            )}
            {active === 'hours' && <HoursView onSave={saveHours} />}
            {active === 'reviews' && <ReviewsView reviews={reviews} avgRating={avgRating} />}
            {active === 'profile' && (
                <ProfileView
                    profile={profile}
                    avgRating={avgRating}
                    reviewCount={reviews.length}
                    appointmentCount={appointments.length}
                />
            )}

            {cancelModal.show && (
                <div className="modal-overlay" onClick={() => setCancelModal({ show: false, id: null })}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3>Otkazivanje termina</h3>
                        <p>Unesite razlog otkazivanja kako bi pacijent bio obavešten.</p>
                        <textarea
                            rows={3}
                            placeholder="Razlog otkazivanja..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button className="clinic-btn clinic-btn-danger" onClick={submitCancel}>
                                <IconX width={16} height={16} /> Potvrdi otkazivanje
                            </button>
                            <button className="clinic-btn clinic-btn-ghost" onClick={() => setCancelModal({ show: false, id: null })}>
                                Odustani
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.type === 'success' ? <IconCheck width={18} height={18} /> : <IconX width={18} height={18} />}
                    {toast.text}
                </div>
            )}
        </DashboardLayout>
    );
}
