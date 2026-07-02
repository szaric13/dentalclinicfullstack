import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

export default function Navbar() {
    const [showServices, setShowServices] = useState(false);
    const [showTeam, setShowTeam] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/public/doctors')
            .then(r => setDoctors(r.data))
            .catch(() => console.error('Greška pri učitavanju doktora'));
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const specialties = [
        { name: 'Fiksna protetika', path: '/services/specialty/Fiksna stomatološka protetika' },
        { name: 'Ortodoncija', path: '/services/specialty/Ortodoncija' },
        { name: 'Hirurgija i implantologija', path: '/services/specialty/Hirurgija i implantologija' },
        { name: 'Restaurativa i endodoncija', path: '/services/specialty/Restaurativa i endodoncija' },
        { name: 'Dečija stomatologija', path: '/services/specialty/Dečija stomatologija i preventiva' },
        { name: 'Estetska medicina', path: '/services/specialty/Estetska medicina' },
    ];

    const nurses = [
        { name: 'Nadica Vujić', path: '/profile/nadica-vujic' },
        { name: 'Tanja Lekić', path: '/profile/tanja-lekic' },
        { name: 'Danka Matana', path: '/profile/danka-matana' },
    ];

    return (
        <>
            <div style={{ background: '#1a5276', color: 'white', padding: '8px 0', textAlign: 'center', fontSize: 13 }}>
                <span style={{ marginRight: 30 }}>📞 +381 31 71 52 11</span>
                <span>Facebook | Instagram</span>
            </div>
            <nav style={{ background: 'white', padding: '12px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, background: '#1a5276', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>D</div>
                    <span style={{ color: '#1a5276', fontWeight: 700, fontSize: 20 }}>Denta</span>
                </Link>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <Link to="/" style={navLink}>Početna</Link>
                    <div style={dropdownContainer} onMouseEnter={() => setShowServices(true)} onMouseLeave={() => setShowServices(false)}>
                        <Link to="/services" style={navLink}>Usluge ▾</Link>
                        {showServices && (
                            <div style={dropdownMenu}>
                                {specialties.map(s => <Link key={s.name} to={s.path} style={dropdownLink}>{s.name}</Link>)}
                                <Link to="/services" style={{ ...dropdownLink, borderTop: '1px solid #eee', color: '#d4af37', fontWeight: 700 }}>Sve usluge →</Link>
                            </div>
                        )}
                    </div>
                    <div style={dropdownContainer} onMouseEnter={() => setShowTeam(true)} onMouseLeave={() => setShowTeam(false)}>
                        <Link to="/team" style={navLink}>Naš tim ▾</Link>
                        {showTeam && (
                            <div style={dropdownMenu}>
                                {doctors.length > 0 ? (
                                    doctors.map(d => (
                                        <Link key={d.id} to={`/doctor/${d.id}`} style={dropdownLink}>
                                            dr {d.firstName} {d.lastName}
                                        </Link>
                                    ))
                                ) : (
                                    <p style={{ padding: '10px 20px', color: '#666', margin: 0 }}>Učitavanje...</p>
                                )}
                                <div style={{ borderTop: '1px solid #eee', marginTop: 5, paddingTop: 5 }}>
                                    {nurses.map(n => <Link key={n.name} to={n.path} style={dropdownLink}>{n.name}</Link>)}
                                </div>
                                <Link to="/team" style={{ ...dropdownLink, borderTop: '1px solid #eee', color: '#d4af37', fontWeight: 700 }}>Ceo tim →</Link>
                            </div>
                        )}
                    </div>
                    <Link to="/blog" style={navLink}>Blog</Link>
                    <Link to="/contact" style={navLink}>Kontakt</Link>
                    {!role ? (
                        <Link to="/login" style={ctaBtn}>Zakažite termin</Link>
                    ) : role === 'PATIENT' ? (
                        <>
                            <Link to="/patient/dashboard" style={navLink}>Moj profil</Link>
                            <Link to="/patient/book" style={ctaBtn}>Zakaži termin</Link>
                            <button onClick={handleLogout} style={logoutBtn}>Odjavi se</button>
                        </>
                    ) : (
                        <>
                            <Link to="/doctor/dashboard" style={navLink}>Moj profil</Link>
                            <button onClick={handleLogout} style={logoutBtn}>Odjavi se</button>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
}

const navLink = { color: '#1a5276', textDecoration: 'none', fontWeight: 600, fontSize: 14 };
const dropdownContainer = { position: 'relative', display: 'inline-block' };
const dropdownMenu = { position: 'absolute', top: '100%', left: 0, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 8, padding: '10px 0', minWidth: 250, zIndex: 999 };
const dropdownLink = { display: 'block', padding: '8px 20px', color: '#333', textDecoration: 'none', fontSize: 14 };
const ctaBtn = { background: '#d4af37', color: '#1a5276', padding: '8px 20px', borderRadius: 20, textDecoration: 'none', fontWeight: 600 };
const logoutBtn = { ...navLink, background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c' };