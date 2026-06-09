import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function LoginPage() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/patient/login', { phone, password });
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('role', 'PATIENT');
            navigate('/patient/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Greška pri prijavi');
        }
    };

    return (
        <div className="container" style={{ maxWidth: 450, marginTop: 60 }}>
            <div className="card">
                <h2 className="form-title">🦷 Prijava pacijenta</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input type="text" placeholder="Broj telefona" value={phone} onChange={e => setPhone(e.target.value)} required />
                        <span className="icon">📱</span>
                    </div>
                    <div className="input-group">
                        <input type={showPassword ? 'text' : 'password'} placeholder="Lozinka" value={password} onChange={e => setPassword(e.target.value)} required />
                        <span className="icon" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                    <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Prijavi se</button>
                </form>
                {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
                <p style={{ marginTop: 15, textAlign: 'center' }}>
                    <Link className="form-link" to="/register">Registrujte se</Link> |{' '}
                    <Link className="form-link" to="/forgot-password">Zaboravljena lozinka?</Link>
                </p>
                <p style={{ textAlign: 'center', marginTop: 10 }}>
                    <Link className="form-link" to="/doctor">🔐 Prijava za doktore</Link>
                </p>
            </div>
        </div>
    );
}