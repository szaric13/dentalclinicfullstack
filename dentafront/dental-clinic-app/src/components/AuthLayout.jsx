import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { CLINIC } from "../lib/data"

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
      <div className="grid w-full overflow-hidden rounded-3xl border border-border bg-card shadow-xl lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2c2.5 0 4 1.5 5 1.5S19.5 3 21 4c0 5-1 9-2.5 13-.7 1.9-1.3 3-2.5 3s-1.5-2.5-2-4.5c-.4-1.6-.8-2.5-2-2.5s-1.6.9-2 2.5C9.5 17.5 9.2 20 8 20s-1.8-1.1-2.5-3C4 13 3 9 3 4c1.5-1 2.5-.5 3-1.5S9.5 2 12 2Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            {CLINIC.name}
          </Link>
          <div>
            <h2 className="font-heading text-3xl font-bold leading-tight text-balance">
              {CLINIC.tagline}
            </h2>
            <p className="mt-4 max-w-sm leading-relaxed text-primary-foreground/80">
              Pristupite svom nalogu i upravljajte terminima brzo i jednostavno, bilo kada i bilo gde.
            </p>
          </div>
          <p className="text-sm text-primary-foreground/70">{CLINIC.address}</p>
        </div>

        {/* Form panel */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-center p-8 sm:p-10"
        >
          <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </motion.div>
      </div>
    </div>
  )
}
