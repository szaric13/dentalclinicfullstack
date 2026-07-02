export default function Footer() {
    return (
        <footer style={{ background: '#0d3449', color: '#aaa', padding: '40px 20px 20px', marginTop: 50 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 30, marginBottom: 30 }}>
                <div>
                    <h3 style={{ color: 'white', marginBottom: 15 }}>Denta</h3>
                    <p>Preventiva, dijagnoza i lečenje bolesti usta i zuba.</p>
                </div>
                <div>
                    <h4 style={{ color: 'white', marginBottom: 10 }}>Mapa sajta</h4>
                    <p><a href="/services" style={{ color: '#aaa', textDecoration: 'none' }}>Naše usluge</a></p>
                    <p><a href="/team" style={{ color: '#aaa', textDecoration: 'none' }}>Naš tim</a></p>
                    <p><a href="/blog" style={{ color: '#aaa', textDecoration: 'none' }}>Blog</a></p>
                    <p><a href="/contact" style={{ color: '#aaa', textDecoration: 'none' }}>Kontakt</a></p>
                </div>
                <div>
                    <h4 style={{ color: 'white', marginBottom: 10 }}>Kontakt informacije</h4>
                    <p><strong>Adresa:</strong> Uče Dimitrijevića 7, Požega</p>
                    <p><strong>Telefon:</strong> +381 31 71 52 11</p>
                    <p><strong>Mobilni:</strong> +381 65 971 52 11</p>
                    <p><strong>E-mail:</strong> dentapozega@gmail.com</p>
                </div>
            </div>
            <div style={{ textAlign: 'center', borderTop: '1px solid #1a3a4a', paddingTop: 15, fontSize: 13 }}>
                © 2025 Denta / All Rights Reserved
            </div>
        </footer>
    );
}