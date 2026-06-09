import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function RegisterPage() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [notes, setNotes] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Verifikacija
    const [verifyCode, setVerifyCode] = useState('');
    const [showVerify, setShowVerify] = useState(false);
    const [verifiedMessage, setVerifiedMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const response = await api.post('/auth/patient/register', {
                phone,
                password,
                firstName,
                lastName,
                email,
                dateOfBirth: dateOfBirth || null,
                notes: notes || null,
            });
            setMessage(response.data);
            setShowVerify(true);
        } catch (err) {
            setError(err.response?.data || 'Greška pri registraciji');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setVerifiedMessage('');
        try {
            const response = await api.post('/auth/patient/verify', {
                phone,
                code: verifyCode,
            });
            setVerifiedMessage(response.data);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data || 'Greška pri verifikaciji');
        }
    };

    const handleResendCode = async () => {
        try {
            await api.post('/auth/patient/resend-verification', { phone });
            setMessage('Novi verifikacioni kod je poslat.');
            setError('');
        } catch (err) {
            setError(err.response?.data || 'Greška pri ponovnom slanju koda.');
        }
    };

    return (
        <div className="container" style={{ maxWidth: 500, marginTop: 40 }}>
            <div className="card">
                <h2 className="form-title">🦷 Registracija pacijenta</h2>

                {!showVerify ? (
                    <form onSubmit={handleRegister}>
                        <div className="grid-2">
                            <div className="input-group">
                                <input placeholder="Ime *" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <input placeholder="Prezime *" value={lastName} onChange={e => setLastName(e.target.value)} required />
                            </div>
                        </div>
                        <div className="input-group">
                            <input type="text" placeholder="Broj telefona *" value={phone} onChange={e => setPhone(e.target.value)} required />
                            <span className="icon">📱</span>
                        </div>
                        <div className="input-group">
                            <input type="email" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} required />
                            <span className="icon">✉️</span>
                        </div>
                        <div className="input-group">
                            <input type="date" placeholder="Datum rođenja" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                            <span className="icon">🎂</span>
                        </div>
                        <div className="input-group">
                            <textarea placeholder="Beleške (alergije, napomene...)" value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
                        </div>
                        <div className="input-group">
                            <input type={showPassword ? 'text' : 'password'} placeholder="Lozinka * (min 6 karaktera)" value={password} onChange={e => setPassword(e.target.value)} required />
                            <span className="icon" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                {showPassword ? '🙈' : '👁️'}
                            </span>
                        </div>
                        <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Registruj se</button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify}>
                        <p style={{ marginBottom: 10 }}>Unesite verifikacioni kod koji ste dobili putem SMS‑a:</p>
                        <div className="input-group">
                            <input type="text" placeholder="Kod (npr. 123456)" value={verifyCode} onChange={e => setVerifyCode(e.target.value)} required />
                        </div>
                        <button className="btn btn-success" type="submit" style={{ width: '100%' }}>Verifikuj</button>
                        <p style={{ marginTop: 10, textAlign: 'center' }}>
                            <button type="button" onClick={handleResendCode} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', textDecoration: 'underline', cursor: 'pointer' }}>
                                Pošalji ponovo kod
                            </button>
                        </p>
                    </form>
                )}

                {message && <p style={{ color: 'var(--success)', marginTop: 10 }}>{message}</p>}
                {verifiedMessage && <p style={{ color: 'var(--success)', marginTop: 10 }}>{verifiedMessage}</p>}
                {error && <p style={{ color: 'var(--danger)', marginTop: 10 }}>{error}</p>}

                <p style={{ marginTop: 20, textAlign: 'center' }}>
                    Već imate nalog? <Link className="form-link" to="/login">Prijavite se</Link>
                </p>
            </div>
        </div>
    );
}