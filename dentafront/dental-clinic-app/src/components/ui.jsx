import { forwardRef } from "react"
import { cn } from "../lib/utils"

const variants = {
  primary:
      "bg-primary text-primary-foreground hover:opacity-90 shadow-sm shadow-primary/20",
  secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
  outline: "border border-border bg-transparent text-foreground hover:bg-secondary",
  ghost: "bg-transparent text-foreground hover:bg-secondary",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  success: "bg-success text-success-foreground hover:opacity-90",
}

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
  icon: "h-10 w-10",
}

export const Button = forwardRef(function Button(
    { className, variant = "primary", size = "md", loading, disabled, children, ...props },
    ref,
) {
  return (
      <button
          ref={ref}
          disabled={disabled || loading}
          className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]",
              variants[variant],
              sizes[size],
              className,
          )}
          {...props}
      >
        {loading && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
              <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
        )}
        {children}
      </button>
  )
})

export const Input = forwardRef(function Input({ className, label, error, id, ...props }, ref) {
  return (
      <div className="flex flex-col gap-1.5">
        {label && (
            <label htmlFor={id} className="text-sm font-medium text-foreground">
              {label}
            </label>
        )}
        <input
            ref={ref}
            id={id}
            className={cn(
                "h-11 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40",
                error && "border-destructive focus:border-destructive focus:ring-destructive/30",
                className,
            )}
            {...props}
        />
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
  )
})

export const Textarea = forwardRef(function Textarea({ className, label, id, ...props }, ref) {
  return (
      <div className="flex flex-col gap-1.5">
        {label && (
            <label htmlFor={id} className="text-sm font-medium text-foreground">
              {label}
            </label>
        )}
        <textarea
            ref={ref}
            id={id}
            className={cn(
                "min-h-[96px] w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40",
                className,
            )}
            {...props}
        />
      </div>
  )
})

export const Select = forwardRef(function Select({ className, label, id, children, ...props }, ref) {
  return (
      <div className="flex flex-col gap-1.5">
        {label && (
            <label htmlFor={id} className="text-sm font-medium text-foreground">
              {label}
            </label>
        )}
        <select
            ref={ref}
            id={id}
            className={cn(
                "h-11 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40",
                className,
            )}
            {...props}
        >
          {children}
        </select>
      </div>
  )
})

export function Card({ className, children, ...props }) {
  return (
      <div
          className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm", className)}
          {...props}
      >
        {children}
      </div>
  )
}

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
          className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
              badgeStyles[status] || badgeStyles.default,
          )}
      >
      {badgeLabels[status] || status}
    </span>
  )
}