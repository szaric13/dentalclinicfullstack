/* Lightweight inline SVG icon set for the dashboard (no external icon dependency). */

const base = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

export function IconGrid(props) {
    return (
        <svg {...base} {...props}>
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
    );
}

export function IconCalendar(props) {
    return (
        <svg {...base} {...props}>
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M3 9h18M8 2v4M16 2v4" />
        </svg>
    );
}

export function IconList(props) {
    return (
        <svg {...base} {...props}>
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
    );
}

export function IconStar(props) {
    return (
        <svg {...base} {...props}>
            <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.8 6.2 21.9l1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
        </svg>
    );
}

export function IconClock(props) {
    return (
        <svg {...base} {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    );
}

export function IconUser(props) {
    return (
        <svg {...base} {...props}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
    );
}

export function IconCheck(props) {
    return (
        <svg {...base} {...props}>
            <path d="M5 12l5 5L20 7" />
        </svg>
    );
}

export function IconX(props) {
    return (
        <svg {...base} {...props}>
            <path d="M6 6l12 12M18 6L6 18" />
        </svg>
    );
}

export function IconLogout(props) {
    return (
        <svg {...base} {...props}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5M21 12H9" />
        </svg>
    );
}

export function IconTooth(props) {
    return (
        <svg {...base} {...props}>
            <path d="M12 5.5c-1.6-1.6-4-2-5.6-1C4.4 5.7 4 8 4.6 10.6c.4 1.7.6 3 .9 4.6.3 1.7.6 4.3 1.8 4.7 1.3.4 1.7-1.6 2-3 .3-1.2.5-2.4 1.7-2.4s1.4 1.2 1.7 2.4c.3 1.4.7 3.4 2 3 1.2-.4 1.5-3 1.8-4.7.3-1.6.5-2.9.9-4.6C20.6 8 20.2 5.7 18.6 4.5c-1.6-1-4-.6-5.6 1" />
        </svg>
    );
}

export function IconBell(props) {
    return (
        <svg {...base} {...props}>
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
    );
}

export function IconSearch(props) {
    return (
        <svg {...base} {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
        </svg>
    );
}

export function IconTrend(props) {
    return (
        <svg {...base} {...props}>
            <path d="M3 17l6-6 4 4 8-8" />
            <path d="M21 7v5h-5" />
        </svg>
    );
}

export function IconMail(props) {
    return (
        <svg {...base} {...props}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
        </svg>
    );
}

export function IconPhone(props) {
    return (
        <svg {...base} {...props}>
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
        </svg>
    );
}

export function IconMenu(props) {
    return (
        <svg {...base} {...props}>
            <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
    );
}
