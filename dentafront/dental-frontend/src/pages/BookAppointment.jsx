import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../api/axios';

const localizer = momentLocalizer(moment);

export default function BookAppointment() {
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [doctorId, setDoctorId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [events, setEvents] = useState([]);
    const [patientNotes, setPatientNotes] = useState('');
    const [message, setMessage] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/public/doctors').then(r => setDoctors(r.data)).catch(() => {});
        api.get('/public/services').then(r => setServices(r.data)).catch(() => {});
    }, []);

    const selectedDoctor = doctors.find(d => String(d.id) === String(doctorId));

    const filteredServices = selectedDoctor
        ? services.filter(s => {
            if (!selectedDoctor.specialization || !s.specialization) return true;
            const specs = selectedDoctor.specialization.split(',').map(sp => sp.trim().toLowerCase());
            return specs.includes(s.specialization.toLowerCase());
        })
        : services;

    const fetchSlots = useCallback(async (date) => {
        if (!doctorId || !serviceId) return;
        const dateStr = moment(date).format('YYYY-MM-DD');
        try {
            const res = await api.get('/patient/available-slots', { params: { doctorId, serviceId, date: dateStr } });
            const slots = res.data;
            const newEvents = slots.map(slot => ({
                start: new Date(slot),
                end: new Date(new Date(slot).getTime() + 30 * 60000),
                title: 'Slobodno',
                free: true,
            }));
            setEvents(newEvents);
            setMessage('');
            setSelectedSlot(null);
            if (slots.length === 0) setMessage('Nema slobodnih termina za izabrani dan. Pozovite ordinaciju na 011/123-456.');
        } catch (err) {
            setMessage(err.response?.data?.error || 'Greška pri učitavanju slotova');
        }
    }, [doctorId, serviceId]);

    const handleBook = async () => {
        if (!selectedSlot) return;
        try {
            await api.post('/patient/appointments', {
                doctorId: Number(doctorId),
                serviceId: Number(serviceId),
                startDateTime: selectedSlot.start,
                patientNotes,
            });
            setMessage('Termin uspešno zakazan! Preusmeravamo vas...');
            setTimeout(() => navigate('/patient/dashboard'), 2000);
        } catch (err) {
            setMessage(err.response?.data?.error || 'Greška pri zakazivanju');
        }
    };

    const handleSelectSlot = (slotInfo) => {
        setSelectedSlot(slotInfo);
    };

    const eventPropGetter = (event) => ({
        style: {
            backgroundColor: event.free ? 'var(--success)' : 'var(--danger)',
            color: 'white',
            border: 'none',
            cursor: event.free ? 'pointer' : 'default',
        },
    });

    return (
        <div className="container" style={{ maxWidth: 1000, marginTop: 30 }}>
            <div className="card">
                <h2 className="form-title">📅 Zakazivanje termina</h2>

                <div style={{ display: 'flex', gap: 15, marginBottom: 20, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <label style={{ fontWeight: 600 }}>1. Izaberite doktora</label>
                        <select
                            style={{ width: '100%', padding: 10, borderRadius: 8, border: '2px solid var(--border)' }}
                            value={doctorId}
                            onChange={e => { setDoctorId(e.target.value); setServiceId(''); setEvents([]); }}
                        >
                            <option value="">-- Izaberite doktora --</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>dr {d.firstName} {d.lastName} – {d.specialization || 'Opšta praksa'}</option>
                            ))}
                        </select>
                        {selectedDoctor && (
                            <Link to={`/doctor/${selectedDoctor.id}`} className="form-link" style={{ fontSize: 13 }}>
                                Pogledaj profil doktora →
                            </Link>
                        )}
                    </div>

                    <div style={{ flex: 1, minWidth: 200 }}>
                        <label style={{ fontWeight: 600 }}>2. Izaberite uslugu</label>
                        <select
                            style={{ width: '100%', padding: 10, borderRadius: 8, border: '2px solid var(--border)' }}
                            value={serviceId}
                            onChange={e => { setServiceId(e.target.value); setEvents([]); }}
                            disabled={!doctorId}
                        >
                            <option value="">-- Izaberite uslugu --</option>
                            {filteredServices.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} min) {s.price ? `– ${s.price} RSD` : ''}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="input-group">
                    <textarea
                        placeholder="Beleške (alergije, posebne napomene...)"
                        value={patientNotes}
                        onChange={e => setPatientNotes(e.target.value)}
                        rows={2}
                        style={{ width: '100%', padding: 10, borderRadius: 8, border: '2px solid var(--border)' }}
                    />
                </div>

                {message && (
                    <p style={{ color: message.includes('uspešno') ? 'var(--success)' : 'var(--danger)', marginBottom: 10 }}>
                        {message}
                    </p>
                )}

                {doctorId && serviceId && (
                    <div style={{ marginTop: 20 }}>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500 }}
                            views={['week', 'day']}
                            defaultView="week"
                            onNavigate={(date) => fetchSlots(date)}
                            onSelectSlot={handleSelectSlot}
                            selectable
                            eventPropGetter={eventPropGetter}
                            min={new Date(2025, 0, 1, 8, 0)}
                            max={new Date(2025, 0, 1, 20, 0)}
                            culture="sr"
                            messages={{
                                today: 'Danas',
                                previous: '←',
                                next: '→',
                                month: 'Mesec',
                                week: 'Nedelja',
                                day: 'Dan',
                                agenda: 'Agenda',
                                date: 'Datum',
                                time: 'Vreme',
                                event: 'Termin',
                            }}
                        />
                    </div>
                )}

                {selectedSlot && (
                    <button className="btn btn-success" style={{ marginTop: 15, width: '100%' }} onClick={handleBook}>
                        ✅ Potvrdi zakazivanje za {moment(selectedSlot.start).format('DD.MM.YYYY. HH:mm')}
                    </button>
                )}

                <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => navigate('/patient/dashboard')}>
                    ← Nazad na dashboard
                </button>
            </div>
        </div>
    );
}