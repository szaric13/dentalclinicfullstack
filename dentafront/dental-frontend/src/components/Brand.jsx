// Mali reusable brand header za auth stranice
// Kopirajte u: src/components/Brand.jsx
export default function Brand() {
    return (
        <div className="clinic-brand" data-testid="clinic-brand">
            <div className="logo" aria-hidden="true">
                {/* Tooth SVG icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5.5c-2 -2 -6 -2 -7 1c-1 3 0 7 1.5 10c.8 1.6 1.5 4 2.5 4s1.2 -3 3 -3s2 3 3 3s1.7 -2.4 2.5 -4c1.5 -3 2.5 -7 1.5 -10c-1 -3 -5 -3 -7 -1z"/>
                </svg>
            </div>
            <div>
                <small>Stomatološka ordinacija</small>
                <h1>DentaCare</h1>
            </div>
        </div>
    );
}
