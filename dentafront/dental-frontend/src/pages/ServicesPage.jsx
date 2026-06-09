import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const serviceIcons = {
    'Fiksna stomatološka protetika': '🦷',
    'Ortodoncija': '😁',
    'Hirurgija i implantologija': '🏥',
    'Restaurativa i endodoncija': '🔧',
    'Dečija stomatologija i preventiva': '👶',
    'Parodontologija': '🪥',
    'Estetska medicina': '✨',
};

export default function ServicesPage() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        api.get('/public/services').then(r => setServices(r.data)).catch(() => {});
    }, []);

    // Grupiši usluge po specijalizaciji
    const grouped = {};
    services.forEach(s => {
        const spec = s.specialization || 'Ostalo';
        if (!grouped[spec]) grouped[spec] = [];
        grouped[spec].push(s);
    });

    return (
        <div>
            <div style={{ background: '#1a5276', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: 36 }}>Naše usluge</h1>
            </div>
            <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
                {Object.entries(grouped).map(([spec, items]) => (
                    <div key={spec} style={{ marginBottom: 40 }}>
                        <h2 style={{ color: '#1a5276', marginBottom: 20, borderBottom: '2px solid #d4af37', paddingBottom: 10 }}>
                            {serviceIcons[spec] || '🦷'} {spec}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                            {items.map(s => (
                                <Link to={`/services/${s.id}`} key={s.id} style={{ textDecoration: 'none' }}>
                                    <div style={{ background: 'white', borderRadius: 12, padding: 25, boxShadow: '0 2px 15px rgba(0,0,0,0.05)', transition: 'transform 0.3s', cursor: 'pointer' }}>
                                        <div style={{ fontSize: 30, marginBottom: 10 }}>{serviceIcons[spec] || '🦷'}</div>
                                        <h3 style={{ color: '#1a5276', marginBottom: 8 }}>{s.name}</h3>
                                        <p style={{ color: '#666', fontSize: 14 }}>{s.durationMinutes} min | {s.price ? `${s.price} RSD` : 'Cena na upit'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}