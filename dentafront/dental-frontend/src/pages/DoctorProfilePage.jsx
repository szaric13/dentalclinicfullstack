import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DOCTOR_IMAGES = {
    'dusica-kotarac': 'https://denta.rs/wp-content/uploads/2021/03/dusica-kotarac.jpg',
    'nenad-zaric': 'https://denta.rs/wp-content/uploads/2021/03/nenad-zaric.jpg',
    'luka-kotarac': 'https://denta.rs/wp-content/uploads/2021/03/luka-kotarac.jpg',
    'jelena-arsovic': 'https://denta.rs/wp-content/uploads/2021/03/jelena-arsovic.jpg',
};

const DOCTOR_DESCRIPTIONS = {
    'Dušica Kotarac': 'Dr Dušica Kotarac je specijalista ortodoncije sa višegodišnjim iskustvom. Njena uža oblast rada obuhvata ortodonciju, protetiku i estetsku medicinu. Redovno prati svetske kongrese iz oblasti stomatologije.',
    'Nenad Zarić': 'Dr Nenad Zarić je stručnjak za protetiku. Svestan je važnosti praćenja najnovijih dostignuća u stomatologiji kako bi pružio najbolju moguću negu pacijentima.',
    'Luka Kotarac': 'Dr Luka Kotarac aktivno učestvuje u edukacijama iz područja fiksne protetike i implantologije. Ova stalna edukacija omogućava mu da prati najnovije trendove u stomatologiji.',
    'Jelena Arsović': 'Dr Jelena Arsović je specijalista dečije stomatologije. Njeno angažovanje doprinosi visokom nivou posvećenosti prema pacijentima i stručnosti u stomatološkoj praksi.',
};

export default function DoctorProfilePage() {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await api.get('/public/doctors');
                const doc = res.data.find(d => String(d.id) === String(id));
                setDoctor(doc);
            } catch {}
        };
        const fetchReviews = async () => {
            try {
                const res = await api.get(`/reviews/doctors/${id}`);
                setReviews(res.data);
                const avgRes = await api.get(`/reviews/doctors/${id}/average`);
                setAvgRating(avgRes.data || 0);
            } catch {}
        };
        fetchDoctor();
        fetchReviews();
    }, [id]);

    if (!doctor) return <div className="container"><p>Učitavanje...</p></div>;

    const fullName = `${doctor.firstName} ${doctor.lastName}`;
    const imageKey = fullName.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const imageUrl = DOCTOR_IMAGES[imageKey] || 'https://via.placeholder.com/300';
    const description = DOCTOR_DESCRIPTIONS[fullName] || 'Stručnjak sa višegodišnjim iskustvom.';

    return (
        <div className="container" style={{ maxWidth: 800, marginTop: 30 }}>
            <div className="card">
                <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', alignItems: 'center' }}>
                    <img src={imageUrl} alt={fullName} style={{ width: 200, height: 200, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--accent)' }} />
                    <div>
                        <h2 style={{ color: 'var(--primary)' }}>dr {fullName}</h2>
                        <p style={{ color: 'var(--text-light)', fontSize: 16 }}>{doctor.specialization}</p>
                        <div className="rating-stars">
                            {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))} ({avgRating.toFixed(1)})
                        </div>
                        <p style={{ marginTop: 15, lineHeight: 1.8 }}>{description}</p>
                    </div>
                </div>

                <h3 style={{ marginTop: 30, color: 'var(--primary)' }}>Ocene pacijenata</h3>
                {reviews.length === 0 ? <p>Još uvek nema ocena.</p> : (
                    reviews.map(r => (
                        <div key={r.id} style={{ padding: 15, marginTop: 10, background: 'var(--bg)', borderRadius: 8 }}>
                            <div className="rating-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                            <p>{r.comment}</p>
                            <small style={{ color: 'var(--text-light)' }}>{new Date(r.createdAt).toLocaleDateString('sr-RS')}</small>
                        </div>
                    ))
                )}
            </div>
            <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => navigate(-1)}>← Nazad</button>
        </div>
    );
}