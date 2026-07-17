import { Link } from "react-router-dom"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { CLINIC, SPECIALTIES } from "../lib/data"
import { useTheme } from "../context/ThemeContext"

export default function Footer() {
  const { theme } = useTheme()
  const logoSrc = theme === "dark" ? "/images/logonzdark.png" : "/images/logonz.png"

  return (
      <footer className="mt-auto border-t border-border bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-2 font-heading text-xl font-bold">
              <img
                  src={logoSrc}
                  alt={CLINIC.name}
                  className="h-9 w-9 object-contain"
              />
              {CLINIC.name}
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-background/70">
              {CLINIC.tagline}. Savremena stomatološka ordinacija posvećena vašem osmehu.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-background/60">
              Usluge
            </h4>
            <ul className="space-y-2.5 text-sm">
              {SPECIALTIES.map((s) => (
                  <li key={s.slug}>
                    <Link
                        to={`/services/specialty/${s.slug}`}
                        className="text-background/75 transition-colors hover:text-background"
                    >
                      {s.name}
                    </Link>
                  </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-background/60">
              Kontakt
            </h4>
            <ul className="space-y-3 text-sm text-background/75">
              <li className="flex items-start gap-2.5">
                <MapPin size={17} className="mt-0.5 shrink-0 text-primary" />
                {CLINIC.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={17} className="shrink-0 text-primary" />
                <a href={`tel:${CLINIC.phoneHref}`} className="hover:text-background">
                  {CLINIC.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={17} className="shrink-0 text-primary" />
                <a href={`mailto:${CLINIC.email}`} className="hover:text-background">
                  {CLINIC.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={17} className="mt-0.5 shrink-0 text-primary" />
                <span>
                Pon–Pet: 08–19h
                <br />
                Sub: 08–12h · Ned: zatvoreno
              </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10">
          <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-background/60 sm:px-6 lg:px-8">
            © {new Date().getFullYear()} {CLINIC.name}. Sva prava zadržana.
          </div>
        </div>
      </footer>
  )
}