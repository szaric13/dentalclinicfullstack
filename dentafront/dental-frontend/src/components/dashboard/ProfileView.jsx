import { IconUser, IconMail, IconPhone, IconStar } from './icons';
import { initialsOf } from './helpers';

function Field({ icon: Icon, label, value }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--c-line)' }}>
            <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: 'var(--c-primary-soft)', color: 'var(--c-primary-dark)',
                display: 'grid', placeItems: 'center',
            }}>
                <Icon width={18} height={18} />
            </div>
            <div>
                <div style={{ fontSize: 12, color: 'var(--c-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{value || '—'}</div>
            </div>
        </div>
    );
}

export default function ProfileView({ profile, avgRating, reviewCount, appointmentCount }) {
    const initials = `${(profile?.firstName || '')[0] || ''}${(profile?.lastName || '')[0] || ''}`.toUpperCase();

    return (
        <div className="dash-cols">
            <div className="panel">
                <div className="panel-head"><h3>Lični podaci</h3></div>
                <div className="panel-body">
                    <Field icon={IconUser} label="Ime i prezime" value={`dr ${profile?.firstName} ${profile?.lastName}`} />
                    <Field icon={IconStar} label="Specijalizacija" value={profile?.specialization} />
                    <Field icon={IconMail} label="Email" value={profile?.email} />
                    <Field icon={IconPhone} label="Telefon" value={profile?.phone} />
                </div>
            </div>

            <div className="panel">
                <div className="panel-head"><h3>Statistika</h3></div>
                <div className="panel-body" style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 84, height: 84, borderRadius: '50%', margin: '8px auto 14px',
                        background: 'linear-gradient(135deg, var(--c-primary), var(--c-accent))',
                        color: '#fff', display: 'grid', placeItems: 'center',
                        fontSize: 30, fontWeight: 800, boxShadow: 'var(--shadow)',
                    }}>
                        {initials}
                    </div>
                    <h3 style={{ margin: 0, fontFamily: "'Fraunces', serif" }}>dr {profile?.firstName} {profile?.lastName}</h3>
                    <p style={{ color: 'var(--c-muted)', margin: '4px 0 18px', fontSize: 14 }}>{profile?.specialization || 'Stomatolog'}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                        <div className="stat-card" style={{ padding: 14 }}>
                            <div className="num" style={{ fontSize: 22, marginTop: 0 }}>{appointmentCount}</div>
                            <div className="lbl" style={{ fontSize: 12 }}>Termina</div>
                        </div>
                        <div className="stat-card" style={{ padding: 14 }}>
                            <div className="num" style={{ fontSize: 22, marginTop: 0 }}>{(avgRating || 0).toFixed(1)}</div>
                            <div className="lbl" style={{ fontSize: 12 }}>Ocena</div>
                        </div>
                        <div className="stat-card" style={{ padding: 14 }}>
                            <div className="num" style={{ fontSize: 22, marginTop: 0 }}>{reviewCount}</div>
                            <div className="lbl" style={{ fontSize: 12 }}>Recenzija</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
