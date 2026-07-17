import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Clock, Banknote, Stethoscope } from "lucide-react"
import PageWrapper from "../components/PageWrapper"
import { Card } from "../components/ui"
import { useServices } from "../hooks/usePublicData"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
}

export default function ServicesPage() {
    const { services, loading } = useServices()

    // Grupišemo usluge po specijalizaciji – prikazujemo samo one koje su relevantne
    const grouped = services.reduce((acc, s) => {
        const spec = s.specialization || "Ostalo"
        if (!acc[spec]) acc[spec] = []
        acc[spec].push(s)
        return acc
    }, {})

    return (
        <PageWrapper title="Naše usluge" description="Kompletan spisak stomatoloških usluga ordinacije Dr Zarić.">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Naše usluge</h1>
                    <p className="mt-3 text-muted-foreground">Kompletna stomatološka nega na jednom mestu.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 text-muted-foreground">Učitavanje…</div>
                ) : Object.keys(grouped).length === 0 ? (
                    <Card className="text-center text-muted-foreground py-10">Trenutno nema dostupnih usluga.</Card>
                ) : (
                    <div className="space-y-12">
                        {Object.entries(grouped).map(([spec, items]) => (
                            <div key={spec}>
                                <h2 className="mb-4 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Stethoscope size={18} />
                  </span>
                                    {spec}
                                </h2>
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {items.map((s, i) => (
                                        <motion.div
                                            key={s.id}
                                            custom={i}
                                            initial="hidden"
                                            whileInView="show"
                                            viewport={{ once: true, margin: "-60px" }}
                                            variants={fadeUp}
                                        >
                                            <Link
                                                to={`/services/${s.id}`}
                                                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                                            >
                                                <h3 className="font-heading text-lg font-semibold text-foreground">{s.name}</h3>
                                                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                                                    {s.description || "Opis usluge..."}
                                                </p>
                                                <div className="mt-4 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock size={14} /> {s.durationMinutes} min
                          </span>
                                                    <span className="flex items-center gap-1 font-semibold text-primary">
                            <Banknote size={14} /> {s.price ? `${s.price} RSD` : "Na upit"}
                          </span>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageWrapper>
    )
}