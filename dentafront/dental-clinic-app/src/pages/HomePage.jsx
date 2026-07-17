import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Star,
  ChevronDown,
  CalendarCheck,
  ShieldCheck,
  Clock,
  Phone,
  MapPin,
  ArrowRight,
  Stethoscope,
  Sparkles,
} from "lucide-react"
import PageWrapper from "../components/PageWrapper"
import { Button } from "../components/ui"
import Avatar from "../components/Avatar"
import { useDoctors, useServices } from "../hooks/usePublicData"
import { CLINIC, SPECIALTIES, FAQ, WORKING_HOURS } from "../lib/data"
import { formatPrice, formatDuration } from "../lib/utils"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
}

function Section({ children, className = "" }) {
  return (
      <section className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
  )
}

function Hero() {
  return (
      <Section className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-muted-foreground">
          <Sparkles size={15} className="text-primary" /> Savremena stomatologija u Požegi
        </span>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            Dr Nenad Zarić
          </h1>
          <p className="mt-3 text-xl font-semibold text-primary">Specijalista protetike</p>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            Zakažite pregled online za nekoliko sekundi. Profesionalna nega, bezbolne procedure i posvećenost svakom pacijentu.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button size="lg">
                <CalendarCheck size={18} /> Zakaži termin
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline">
                Naše usluge <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={18} className="text-warning" fill="currentColor" />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">{CLINIC.googleRating}</span>
              <span className="text-sm text-muted-foreground">Google ocena</span>
            </div>
          </div>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
        >
          <div className="overflow-hidden rounded-3xl border border-border shadow-xl">
            <img
                src="/images/hero.png"
                alt="Dr Nenad Zarić"
                className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-border bg-card p-4 shadow-lg sm:block">
            <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
              <ShieldCheck size={22} />
            </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Sigurno i bezbolno</p>
                <p className="text-xs text-muted-foreground">Savremeni protokoli</p>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>
  )
}

function Stats() {
  const items = [
    { icon: Stethoscope, value: "15+", label: "godina iskustva" },
    { icon: CalendarCheck, value: "20.000+", label: "zadovoljnih pacijenata" },
    { icon: Star, value: CLINIC.googleRating, label: `Google (${CLINIC.googleReviews} recenzija)` },
    { icon: ShieldCheck, value: "100%", label: "posvećenost kvalitetu" },
  ]
  return (
      <Section className="py-6">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-card p-6 md:grid-cols-4">
          {items.map((it, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center">
                <it.icon size={24} className="text-primary" />
                <span className="font-heading text-2xl font-bold text-foreground">{it.value}</span>
                <span className="text-xs text-muted-foreground">{it.label}</span>
              </div>
          ))}
        </div>
      </Section>
  )
}

function ServicesPreview() {
  const { services } = useServices()
  const list = services.length
      ? services.slice(0, 6)
      : SPECIALTIES.map((s, i) => ({ id: `f-${i}`, name: s.name, description: s.short, fallback: true, slug: s.slug }))

  return (
      <Section className="py-16">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Naše usluge</h2>
          <p className="mt-3 text-muted-foreground">Kompletna stomatološka nega na jednom mestu.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
              <motion.div
                  key={s.id}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
              >
                <Link
                    to={s.fallback ? `/services/specialty/${s.slug}` : `/services/${s.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Stethoscope size={22} />
              </span>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{s.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {s.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    {!s.fallback && s.price != null ? (
                        <span className="font-semibold text-primary">{formatPrice(s.price)}</span>
                    ) : (
                        <span className="font-medium text-primary">Saznaj više</span>
                    )}
                    {!s.fallback && s.durationMinutes ? (
                        <span className="text-muted-foreground">{formatDuration(s.durationMinutes)}</span>
                    ) : (
                        <ArrowRight size={16} className="text-primary transition-transform group-hover:translate-x-1" />
                    )}
                  </div>
                </Link>
              </motion.div>
          ))}
        </div>
      </Section>
  )
}

function DoctorSection() {
    const { doctors } = useDoctors()
    const d = doctors[0]
    if (!d) return null
    return (
        <Section className="py-16">
            <div className="mb-10 text-center">
                <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Vaš stomatolog</h2>
                <p className="mt-3 text-muted-foreground">Dr Nenad Zarić – specijalista protetike</p>
            </div>
            <div className="mx-auto max-w-md">
                <Link
                    to={`/doctor/${d.id}`}
                    className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                    {d.profileImage ? (
                        <img
                            src={d.profileImage}
                            alt={`Dr ${d.firstName} ${d.lastName}`}
                            className="h-24 w-24 rounded-full object-cover"
                        />
                    ) : (
                        <Avatar name={`${d.firstName} ${d.lastName}`} size={96} />
                    )}
                    <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                        Dr {d.firstName} {d.lastName}
                    </h3>
                    <p className="mt-1 text-sm text-primary">{d.specialization}</p>
                    <p className="mt-3 text-sm text-muted-foreground">
                        {d.bio || "Stručnjak sa višegodišnjim iskustvom u oblasti protetike i implantologije."}
                    </p>
                </Link>
            </div>
        </Section>
    )
}

function FaqItem({ item, open, onToggle }) {
  return (
      <div className="rounded-2xl border border-border bg-card">
        <button
            onClick={onToggle}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            aria-expanded={open}
        >
          <span className="font-medium text-foreground">{item.q}</span>
          <ChevronDown
              size={20}
              className={`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        <motion.div
            initial={false}
            animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
            className="overflow-hidden"
        >
          <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
        </motion.div>
      </div>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
      <Section className="py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Česta pitanja</h2>
            <p className="mt-3 text-muted-foreground">Sve što treba da znate pre prve posete.</p>
          </div>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
                <FaqItem key={i} item={item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </Section>
  )
}

function ContactStrip() {
  return (
      <Section className="py-16">
        <div className="grid gap-8 rounded-3xl border border-border bg-card p-8 md:grid-cols-2 md:p-10">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Posetite nas</h2>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-primary" /> {CLINIC.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary" />
                <a href={`tel:${CLINIC.phoneHref}`} className="hover:text-primary">{CLINIC.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-primary" /> Pon–Pet 08–19h, Sub 08–12h
              </li>
            </ul>
            <Link to="/contact" className="mt-6 inline-block">
              <Button variant="outline">Mapa i kontakt <ArrowRight size={16} /></Button>
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground">Radno vreme</h3>
            <ul className="mt-4 divide-y divide-border">
              {WORKING_HOURS.map((w) => (
                  <li key={w.day} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="text-foreground">{w.day}</span>
                    <span className={w.closed ? "text-destructive" : "text-muted-foreground"}>{w.hours}</span>
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
  )
}

export default function HomePage() {
  return (
      <PageWrapper
          title="Dr Nenad Zarić"
          description={`${CLINIC.name} — ${CLINIC.tagline}. Zakažite stomatološki pregled online u Požegi.`}
      >
        <Hero />
        <Stats />
        <ServicesPreview />
        <DoctorSection />
        <Faq />
        <ContactStrip />

        <Link
            to="/register"
            className="fixed bottom-5 left-5 z-[80] hidden items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 md:inline-flex"
        >
          <CalendarCheck size={18} /> Zakaži termin
        </Link>
      </PageWrapper>
  )
}