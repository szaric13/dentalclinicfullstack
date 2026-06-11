import { IconTooth, IconGrid, IconCalendar, IconClock, IconStar, IconUser, IconLogout, IconBell, IconSearch, IconMenu } from './icons';
import '../../styles/dashboard.css';

const NAV = [
    { key: 'overview', label: 'Pregled', icon: IconGrid },
    { key: 'appointments', label: 'Termini', icon: IconCalendar },
    { key: 'patients', label: 'Pacijenti', icon: IconUser },
    { key: 'hours', label: 'Radno vreme', icon: IconClock },
    { key: 'reviews', label: 'Ocene', icon: IconStar },
    { key: 'profile', label: 'Profil', icon: IconUser },
];

const TITLES = {
    overview: 'Pregled',
    appointments: 'Termini',
    patients: 'Pacijenti',
    hours: 'Radno vreme',
    reviews: 'Ocene',
    profile: 'Profil',
};

export default function DashboardLayout({
    profile,
    active,
    onNavigate,
    onLogout,
    pendingCount,
    search,
    onSearch,
    navOpen,
    setNavOpen,
    children,
}) {
    const initials = profile
        ? `${(profile.firstName || '')[0] || ''}${(profile.lastName || '')[0] || ''}`.toUpperCase()
        : 'DR';

    return (
        <div className={`dash${navOpen ? ' nav-open' : ''}`}>
            <div className="dash-scrim" onClick={() => setNavOpen(false)} />

            <aside className="dash-sidebar">
                <div className="dash-brand">
                    <div className="logo"><IconTooth width={24} height={24} /></div>
                    <div>
                        <h1>DentaCare</h1>
                        <small>Clinic Suite</small>
                    </div>
                </div>

                <nav className="dash-nav">
                    <span className="dash-nav-label">Glavni meni</span>
                    {NAV.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            className={`dash-nav-item${active === key ? ' active' : ''}`}
                            onClick={() => { onNavigate(key); setNavOpen(false); }}
                        >
                            <Icon />
                            {label}
                            {key === 'appointments' && pendingCount > 0 && (
                                <span className="badge">{pendingCount}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="dash-userbox">
                    <div className="dash-avatar">{initials}</div>
                    <div className="meta">
                        <strong>dr {profile?.firstName} {profile?.lastName}</strong>
                        <span>{profile?.specialization || 'Stomatolog'}</span>
                    </div>
                    <button className="logout-btn" onClick={onLogout} aria-label="Odjavi se" title="Odjavi se">
                        <IconLogout width={18} height={18} />
                    </button>
                </div>
            </aside>

            <div className="dash-main">
                <header className="dash-topbar">
                    <button className="dash-burger" onClick={() => setNavOpen(true)} aria-label="Otvori meni">
                        <IconMenu width={20} height={20} />
                    </button>
                    <h2>{TITLES[active]}</h2>

                    <div className="dash-search">
                        <IconSearch width={18} height={18} />
                        <input
                            type="search"
                            placeholder="Pretraži pacijente, termine..."
                            value={search}
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                    <button className="dash-icon-btn" aria-label="Obaveštenja">
                        <IconBell width={20} height={20} />
                        {pendingCount > 0 && <span className="dot" />}
                    </button>
                </header>

                <div className="dash-content">{children}</div>
            </div>
        </div>
    );
}
