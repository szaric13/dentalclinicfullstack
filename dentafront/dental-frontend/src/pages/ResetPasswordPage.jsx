import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [mode, setMode] = useState(tokenFromUrl ? 'email' : 'phone');
  const [token, setToken] = useState(tokenFromUrl);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (mode === 'email') {
        await api.post('/auth/patient/reset-password', { token, newPassword });
      } else {
        await api.post('/auth/patient/reset-password-phone', { phone, code, newPassword });
      }
      setMessage('Lozinka uspešno resetovana. Preusmeravamo vas na prijavu...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Greška pri resetu lozinke.');
    }
  };

  return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Reset lozinke</h2>

          {!tokenFromUrl && (
              <div style={{ marginBottom: 15 }}>
                <button
                    onClick={() => setMode('email')}
                    style={{ ...styles.tabBtn, background: mode === 'email' ? '#3498db' : '#ddd', color: mode === 'email' ? '#fff' : '#333' }}
                >
                  Token (email)
                </button>
                <button
                    onClick={() => setMode('phone')}
                    style={{ ...styles.tabBtn, background: mode === 'phone' ? '#3498db' : '#ddd', color: mode === 'phone' ? '#fff' : '#333', marginLeft: 10 }}
                >
                  Kod (telefon)
                </button>
              </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'email' ? (
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Token iz email‑a"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    required
                />
            ) : (
                <>
                  <input
                      style={styles.input}
                      type="text"
                      placeholder="Broj telefona"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                  />
                  <input
                      style={styles.input}
                      type="text"
                      placeholder="Kod iz SMS‑a"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      required
                  />
                </>
            )}
            <input
                style={styles.input}
                type="password"
                placeholder="Nova lozinka"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
            />
            <button style={styles.btn} type="submit">Resetuj lozinku</button>
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