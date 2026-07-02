const badgeStyles = {
    SCHEDULED: "bg-warning/15 text-warning-foreground border border-warning/40",
    CONFIRMED: "bg-success/15 text-success border border-success/40",
    CANCELLED: "bg-destructive/15 text-destructive border border-destructive/40",
    COMPLETED: "bg-secondary text-secondary-foreground border border-border",
    default: "bg-secondary text-secondary-foreground border border-border",
}

const badgeLabels = {
    SCHEDULED: "Na čekanju",
    CONFIRMED: "Potvrđeno",
    CANCELLED: "Otkazano",
    COMPLETED: "Završeno",
}

export function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                badgeStyles[status] || badgeStyles.default
            }`}
        >
      {badgeLabels[status] || status}
    </span>
    )
}