import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function HomePage() {
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        api.get('/public/doctors').then(r => setDoctors(r.data)).catch(() => {});
        api.get('/public/services').then(r => setServices(r.data)).catch(() => {});
    }, []);

    return (
        <div style={{ fontFamily: "'Segoe UI', sans-serif", color: '#333' }}>
            {/* HERO */}
            <div style={{ background: 'linear-gradient(135deg, #1a5276, #2980b9)', color: 'white', padding: '80px 20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: 44, fontWeight: 700, marginBottom: 10 }}>Otkrijte tajnu</h1>
                <h1 style={{ fontSize: 44, fontWeight: 700, marginBottom: 15, color: '#d4af37' }}>blistavog osmeha</h1>
                <p style={{ fontSize: 20, marginBottom: 30 }}>Zakažite svoj termin već danas!</p>
                <div style={{ fontSize: 18, marginBottom: 20 }}>📞 +381 31 71 52 11</div>
                <Link to="/register" style={{ background: '#d4af37', color: '#1a5276', padding: '14px 35px', borderRadius: 30, textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>
                    Zakažite pregled
                </Link>
            </div>

            {/* TRANSFORMATIVNA STOMATOLOGIJA */}
            <div style={{ padding: '60px 20px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ color: '#1a5276', fontSize: 30, marginBottom: 15 }}>Transformativnom stomatologijom do Vašeg osmeha</h2>
                <p style={{ color: '#666', fontSize: 16, lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>
                    Denta je najsavremenija ordinacija u srcu Zapadne Srbije. Pružamo usluge iz oblasti stomatologije, stomatološke estetike i estetske medicine na jednom mestu, u centru Požege.
                </p>
            </div>

            {/* USLUGE */}
            <div style={{ padding: '60px 20px', background: '#f8f9fa' }}>
                <h2 style={{ textAlign: 'center', color: '#1a5276', fontSize: 30, marginBottom: 40 }}>Naše usluge</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 25, maxWidth: 1200, margin: '0 auto' }}>
                    {services.slice(0, 6).map(s => (
                        <div key={s.id} style={{ background: 'white', borderRadius: 12, padding: 30, boxShadow: '0 2px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ color: '#1a5276', marginBottom: 10 }}>{s.name}</h3>
                            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 15 }}>{s.description || 'Opis usluge...'}</p>
                            <Link to="/services" style={{ color: '#d4af37', fontWeight: 600, textDecoration: 'none' }}>Opširnije →</Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* DOKTORI */}
            <div style={{ padding: '60px 20px' }}>
                <h2 style={{ textAlign: 'center', color: '#1a5276', fontSize: 30, marginBottom: 10 }}>Stomatolozi koje ćete voleti</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: 40 }}>Denta Vam pruža najviši nivo stomatološke nege.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 30, maxWidth: 1200, margin: '0 auto' }}>
                    {doctors.map(d => (
                        <Link to={`/doctor/${d.id}`} key={d.id} style={{ textDecoration: 'none' }}>
                            <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 15px rgba(0,0,0,0.05)' }}>
                                <img src={`/doctors/${d.firstName.toLowerCase()}-${d.lastName.toLowerCase()}.jpg`} alt={d.firstName} style={{ width: '100%', height: 260, objectFit: 'cover' }} onError={(e) => { e.target.src = '/doctors/default-doctor.jpg'; }} />
                                <div style={{ padding: 20, textAlign: 'center' }}>
                                    <h3 style={{ color: '#1a5276' }}>dr {d.firstName} {d.lastName}</h3>
                                    <p style={{ color: '#666' }}>{d.specialization}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* RADNO VREME + KONTAKT */}
            <div style={{ background: '#1a5276', color: 'white', padding: '60px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
                    <div>
                        <h3 style={{ color: '#d4af37', marginBottom: 20 }}>Radno vreme</h3>
                        <p>PON 8.00 - 19.00</p>
                        <p>UTO 8.00 - 19.00</p>
                        <p>SRE 8.00 - 19.00</p>
                        <p>ČET 8.00 - 19.00</p>
                        <p>PET 8.00 - 19.00</p>
                        <p>SUB 8.00 - 12.00</p>
                    </div>
                    <div>
                        <h3 style={{ color: '#d4af37', marginBottom: 20 }}>Kontakt informacije</h3>
                        <p><strong>Adresa:</strong> Uče Dimitrijevića 7, Požega</p>
                        <p><strong>Telefon:</strong> +381 31 71 52 11</p>
                        <p><strong>Mobilni:</strong> +381 65 971 52 11</p>
                        <p><strong>E-mail:</strong> dentapozega@gmail.com</p>
                    </div>
                </div>
            </div>

            {/* LEBDEĆE DUGME */}
            <Link to="/login" style={{ position: 'fixed', right: 20, bottom: 30, background: '#d4af37', color: '#1a5276', padding: '14px 24px', borderRadius: 30, textDecoration: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', zIndex: 999, animation: 'pulse 2s infinite' }}>
                📅 Zakažite termin
            </Link>

            <style>{`@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(212,175,55,0.5); } 70% { box-shadow: 0 0 0 20px rgba(212,175,55,0); } 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0); } }`}</style>
        </div>
    );
}