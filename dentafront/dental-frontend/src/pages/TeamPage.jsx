import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function TeamPage() {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        api.get('/public/doctors').then(r => setDoctors(r.data)).catch(() => {});
    }, []);

    return (
        <div>
            <div style={{ background: '#1a5276', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: 36 }}>Naš tim</h1>
                <p style={{ fontSize: 18, marginTop: 10 }}>Stomatolozi koje ćete voleti</p>
            </div>
            <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30 }}>
                {doctors.map(d => (
                    <Link to={`/doctor/${d.id}`} key={d.id} style={{ textDecoration: 'none' }}>
                        <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 15px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'transform 0.3s' }}>
                            <img
                                src={`/doctors/${d.firstName.toLowerCase()}-${d.lastName.toLowerCase()}.jpg`}
                                alt={d.firstName}
                                style={{ width: '100%', height: 280, objectFit: 'cover' }}
                                onError={(e) => { e.target.src = '/doctors/default-doctor.jpg'; }}
                            />
                            <div style={{ padding: 20, textAlign: 'center' }}>
                                <h3 style={{ color: '#1a5276' }}>dr {d.firstName} {d.lastName}</h3>
                                <p style={{ color: '#666', fontSize: 14 }}>{d.specialization}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}