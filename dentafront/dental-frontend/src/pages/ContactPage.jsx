export default function ContactPage() {
    return (
        <div>
            <div style={{ background: '#1a5276', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: 36 }}>Kontakt</h1>
            </div>
            <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                <div>
                    <h2 style={{ color: '#1a5276', marginBottom: 20 }}>Kontakt informacije</h2>
                    <div style={contactItem}>
                        <span style={{ fontSize: 24 }}>📍</span>
                        <div>
                            <strong>Adresa:</strong>
                            <p>Uče Dimitrijevića 7, Požega</p>
                        </div>
                    </div>
                    <div style={contactItem}>
                        <span style={{ fontSize: 24 }}>📞</span>
                        <div>
                            <strong>Telefon:</strong>
                            <p>+381 31 71 52 11</p>
                        </div>
                    </div>
                    <div style={contactItem}>
                        <span style={{ fontSize: 24 }}>📱</span>
                        <div>
                            <strong>Mobilni:</strong>
                            <p>+381 65 971 52 11</p>
                        </div>
                    </div>
                    <div style={contactItem}>
                        <span style={{ fontSize: 24 }}>✉️</span>
                        <div>
                            <strong>E-mail:</strong>
                            <p>dentapozega@gmail.com</p>
                        </div>
                    </div>
                    <h3 style={{ color: '#1a5276', marginTop: 30, marginBottom: 15 }}>Radno vreme</h3>
                    <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
                        <p>Ponedeljak – Petak: 08:00 – 19:00</p>
                        <p>Subota: 08:00 – 12:00</p>
                        <p style={{ color: '#d4af37', fontWeight: 600 }}>Nedelja: Zatvoreno</p>
                    </div>
                </div>
                <div>
                    <h2 style={{ color: '#1a5276', marginBottom: 20 }}>Gde nas možete naći</h2>
                    <div style={{ background: '#f8f9fa', height: 400, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p>📍 Mapa će biti ovde</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const contactItem = {
    display: 'flex',
    gap: 15,
    alignItems: 'flex-start',
    marginBottom: 20,
};