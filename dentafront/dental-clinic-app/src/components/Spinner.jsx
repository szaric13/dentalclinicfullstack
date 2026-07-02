import { cn } from "../lib/utils"

export default function Spinner({ className, size = 24, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <svg
        className={cn("animate-spin text-primary", className)}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {label ? <span className="text-sm text-muted-foreground">{label}</span> : <span className="sr-only">Učitavanje…</span>}
    </div>
  )
}

export function FullPageSpinner({ label = "Učitavanje…" }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size={36} label={label} />
    </div>
  )
}
