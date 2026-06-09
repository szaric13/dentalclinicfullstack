import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function DoctorLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/doctor/login', { email, password });
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('role', 'DOCTOR');
            navigate('/doctor/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Greška pri prijavi');
        }
    };

    return (
        <div className="container" style={{ maxWidth: 450, marginTop: 60 }}>
            <div className="card">
                <h2 className="form-title">🩺 Prijava doktora</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                        <span className="icon">✉️</span>
                    </div>
                    <div className="input-group">
                        <input type={showPassword ? 'text' : 'password'} placeholder="Lozinka" value={password} onChange={e => setPassword(e.target.value)} required />
                        <span className="icon" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                    <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Prijavi se</button>
                </form>
                {error && <p style={{ color: 'var(--danger)', marginTop: 10 }}>{error}</p>}
                <p style={{ marginTop: 15, textAlign: 'center' }}>
                    <Link className="form-link" to="/login">← Prijava za pacijente</Link>
                </p>
            </div>
        </div>
    );
}