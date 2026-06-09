import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPasswordPage() {
    const [mode, setMode] = useState('email'); // 'email' ili 'phone'
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            if (mode === 'email') {
                await api.post('/auth/patient/forgot-password', { email });
                setMessage('Link za reset lozinke je poslat na vaš email (proverite konzolu).');
            } else {
                await api.post('/auth/patient/forgot-password-phone', { phone });
                setMessage('Kod za reset lozinke je poslat na vaš telefon.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Greška pri slanju zahteva.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Zaboravljena lozinka</h2>

                <div style={{ marginBottom: 15 }}>
                    <button
                        onClick={() => setMode('email')}
                        style={{ ...styles.tabBtn, background: mode === 'email' ? '#3498db' : '#ddd', color: mode === 'email' ? '#fff' : '#333' }}
                    >
                        Preko email‑a
                    </button>
                    <button
                        onClick={() => setMode('phone')}
                        style={{ ...styles.tabBtn, background: mode === 'phone' ? '#3498db' : '#ddd', color: mode === 'phone' ? '#fff' : '#333', marginLeft: 10 }}
                    >
                        Preko telefona
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {mode === 'email' ? (
                        <input
                            style={styles.input}
                            type="email"
                            placeholder="Unesite vaš email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    ) : (
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Unesite vaš broj telefona"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                        />
                    )}
                    <button style={styles.btn} type="submit">
                        {mode === 'email' ? 'Pošalji link' : 'Pošalji kod'}
                    </button>
                </form>

                {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
                {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

                <p style={{ marginTop: 15 }}>
                    <Link to="/login">Nazad na prijavu</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', marginTop: 50 },
    card: { width: 400, padding: 30, border: '1px solid #ddd', borderRadius: 8 },
    input: { display: 'block', width: '100%', padding: 8, marginBottom: 10, boxSizing: 'border-box' },
    btn: { padding: '10px 20px', background: '#3498db', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 4 },
    tabBtn: { padding: '8px 16px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' },
};