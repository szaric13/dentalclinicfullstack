import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

const STAFF_DATA = {
    'nadica-vujic': {
        name: 'Nadica Vujić', title: 'Stomatološka sestra',
        phone: '+381 65 971 52 11', office: '+381 31 715 211', email: 'dentapozega@gmail.com',
        image: '/staff/nadica-vujic.jpg',
        bio: `Nadica je važna članica Denta stomatološkog tima. Ona pruža značajnu podršku našim stomatolozima tokom procedura i brine se o udobnosti pacijenata. Njena uloga obuhvata asistiranje tokom zahvata, održavanje higijene i dezinfekciju instrumenata, kao i pružanje osnovnih informacija i saveta o oralnoj higijeni pacijentima. Njena ljubaznost i strpljenje često umanjuju strahove pacijenata i doprinose prijatnoj atmosferi u ordinaciji.`,
        education: 'Medicinska škola', expertise: 'Stomatološka sestra', experience: '10',
        workingHours: { 'Ponedeljak': '8:00 - 19:00', 'Utorak': '8:00 - 19:00', 'Sreda': '8:00 - 19:00', 'Četvrtak': '8:00 - 19:00', 'Petak': '8:00 - 19:00', 'Subota': '8:00 - 12:00' },
    },
    'tanja-lekic': {
        name: 'Tanja Lekić', title: 'Stomatološka sestra',
        phone: '+381 65 971 52 11', office: '+381 31 715 211', email: 'dentapozega@gmail.com',
        image: '/staff/tanja-lekic.jpg',
        bio: `Veoma profesionalna, sestra Tanja odlikuje se izuzetnim znanjem i veštinama u oblasti stomatologije, pružajući visok nivo brige i pažnje svakom pacijentu. Njen predan rad u održavanju sterilnosti i higijene instrumenata doprinosi bezbednom i efikasnom radu naše ordinacije.`,
        education: 'Medicinska škola', expertise: 'Stomatološka sestra', experience: '10',
        workingHours: { 'Ponedeljak': '8:00 - 19:00', 'Utorak': '8:00 - 19:00', 'Sreda': '8:00 - 19:00', 'Četvrtak': '8:00 - 19:00', 'Petak': '8:00 - 19:00', 'Subota': '8:00 - 12:00' },
    },
    'danka-matana': {
        name: 'Danka Matana', title: 'Stomatološka sestra',
        phone: '+381 65 971 52 11', office: '+381 31 715 211', email: 'dentapozega@gmail.com',
        image: '/staff/danka-matana.jpg',
        bio: `Izuzetno ljubazna, Danka je stomatološka sestra koja osvaja srca pacijenata svojim toplim osmehom i pažljivim pristupom. Njena sposobnost da sasluša pacijente i odgovori na njihova pitanja sa strpljenjem čini posetu stomatologu prijatnom i bezbrižnom.`,
        education: 'Medicinska škola', expertise: 'Stomatološka sestra', experience: '10',
        workingHours: { 'Ponedeljak': '8:00 - 19:00', 'Utorak': '8:00 - 19:00', 'Sreda': '8:00 - 19:00', 'Četvrtak': '8:00 - 19:00', 'Petak': '8:00 - 19:00', 'Subota': '8:00 - 12:00' },
    },
};

export default function ProfilePage() {
    const { slug } = useParams();
    const [person, setPerson] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);

    useEffect(() => {
        if (STAFF_DATA[slug]) {
            setPerson(STAFF_DATA[slug]);
            return;
        }
        api.get('/public/doctors').then(r => {
            const doc = r.data.find(d => `${d.firstName.toLowerCase()}-${d.lastName.toLowerCase()}` === slug);
            if (doc) {
                setPerson({
                    name: `dr ${doc.firstName} ${doc.lastName}`,
                    title: doc.specialization || 'Stomatolog',
                    phone: doc.phone || '+381 31 71 52 11',
                    office: '+381 31 715 211',
                    email: doc.email || 'dentapozega@gmail.com',
                    image: `/doctors/${doc.firstName.toLowerCase()}-${doc.lastName.toLowerCase()}.jpg`,
                    bio: `Doktor ${doc.firstName} ${doc.lastName} je član našeg tima.`,
                    education: 'Stomatološki fakultet',
                    expertise: doc.specialization || 'Stomatologija',
                    experience: '5+',
                    workingHours: { 'Ponedeljak': '8.00 - 19.00', 'Utorak': '8.00 - 19.00', 'Sreda': '8.00 - 19.00', 'Četvrtak': '8.00 - 19.00', 'Petak': '8.00 - 19.00', 'Subota': '8.00 - 12.00' },
                });
                api.get(`/reviews/doctors/${doc.id}/average`).then(r => setAvgRating(r.data || 0)).catch(() => {});
                api.get(`/reviews/doctors/${doc.id}`).then(r => setReviews(r.data)).catch(() => {});
            }
        }).catch(() => {});
    }, [slug]);

    if (!person) return <div className="container" style={{ marginTop: 50 }}><h2>Osoba nije pronađena</h2></div>;

    return (
        <div>
            <div style={{ background: '#1a5276', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: 36 }}>{person.name}</h1>
                <p style={{ fontSize: 18, marginTop: 10 }}>{person.title}</p>
                {avgRating > 0 && (
                    <div className="rating-stars" style={{ marginTop: 10, fontSize: 20 }}>
                        {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))} ({avgRating.toFixed(1)})
                    </div>
                )}
            </div>
            <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 350px', gap: 40 }}>
                <div>
                    <img src={person.image} alt={person.name} style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 12, marginBottom: 20 }} onError={(e) => { e.target.src = '/doctors/default-doctor.jpg'; }} />
                    <h2 style={{ color: '#1a5276', marginBottom: 20 }}>Biografija</h2>
                    <div style={{ lineHeight: 1.8, color: '#444', whiteSpace: 'pre-line' }}>{person.bio}</div>
                    {reviews.length > 0 && (
                        <div style={{ marginTop: 40 }}>
                            <h3 style={{ color: '#1a5276', marginBottom: 20 }}>Ocene pacijenata</h3>
                            {reviews.map(r => (
                                <div key={r.id} style={{ padding: 15, marginBottom: 10, background: '#f8f9fa', borderRadius: 8 }}>
                                    <div className="rating-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                                    <p>{r.comment}</p>
                                    <small style={{ color: '#999' }}>{new Date(r.createdAt).toLocaleDateString('sr-RS')}</small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <div className="card" style={{ padding: 25, marginBottom: 20 }}>
                        <h3 style={{ color: '#1a5276', marginBottom: 15 }}>Kontakt</h3>
                        <p>📞 {person.phone}</p>
                        <p>🏥 {person.office}</p>
                        <p>✉️ {person.email}</p>
                    </div>
                    <div className="card" style={{ padding: 25, marginBottom: 20 }}>
                        <h3 style={{ color: '#1a5276', marginBottom: 15 }}>Radno vreme</h3>
                        {Object.entries(person.workingHours).map(([day, time]) => (
                            <div key={day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <strong>{day}</strong>
                                <span>{time}</span>
                            </div>
                        ))}
                    </div>
                    <div className="card" style={{ padding: 25 }}>
                        <h3 style={{ color: '#1a5276', marginBottom: 15 }}>Edukacija</h3>
                        <p><strong>Fakultet:</strong> {person.education}</p>
                        <p><strong>Ekspertiza:</strong> {person.expertise}</p>
                        <p><strong>Godine prakse:</strong> {person.experience}</p>
                    </div>
                    <Link to="/login" className="btn btn-primary" style={{ display: 'block', marginTop: 20, textAlign: 'center' }}>
                        Zakažite termin
                    </Link>
                </div>
            </div>
        </div>
    );
}