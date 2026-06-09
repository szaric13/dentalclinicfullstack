import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ServiceDetailPage() {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/public/services').then(r => {
            const found = r.data.find(s => String(s.id) === String(id));
            setService(found);
        }).catch(() => {});
    }, [id]);

    if (!service) return <div className="container"><p>Učitavanje...</p></div>;

    return (
        <div>
            <div style={{ background: '#1a5276', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: 36 }}>{service.name}</h1>
                <p style={{ fontSize: 18, marginTop: 10 }}>{service.specialization}</p>
            </div>
            <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
                <div className="card" style={{ padding: 30 }}>
                    <p style={{ fontSize: 16, lineHeight: 1.8, color: '#666', marginBottom: 20 }}>
                        {service.description || 'Sa našim timom učestvujte u planiranju svog budućeg osmeha pomoću digitalnog dizajna i probe modela u ustima. Naši doktori uvek streme ka radu koji ide u korak sa tehnologijom.'}
                    </p>
                    <div style={{ display: 'flex', gap: 30, marginTop: 20 }}>
                        <div>
                            <strong>Trajanje:</strong> {service.durationMinutes} min
                        </div>
                        <div>
                            <strong>Cena:</strong> {service.price ? `${service.price} RSD` : 'Na upit'}
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ marginTop: 25 }} onClick={() => navigate('/login')}>
                        Zakažite termin
                    </button>
                </div>
            </div>
        </div>
    );
}