import { Link, useParams } from "react-router-dom"
import { Stethoscope } from "lucide-react"
import PageWrapper from "../components/PageWrapper"
import { Button } from "../components/ui"
import { SPECIALTIES } from "../lib/data"

export default function SpecialtyPage() {
    const { specialty: slug } = useParams()
    const specialty = SPECIALTIES.find(s => s.slug === slug)

    return (
        <PageWrapper title={specialty?.name || "Specijalizacija"}>
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                {specialty ? (
                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Sidebar */}
                        <aside className="w-full shrink-0 lg:w-64">
                            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
                                <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Specijalizacije
                                </h3>
                                <nav className="space-y-1.5">
                                    {SPECIALTIES.map(s => (
                                        <Link
                                            key={s.slug}
                                            to={`/services/specialty/${s.slug}`}
                                            className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                                s.slug === slug
                                                    ? "bg-primary text-primary-foreground shadow-sm"
                                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                            }`}
                                        >
                                            {s.name}
                                        </Link>
                                    ))}
                                </nav>
                                <hr className="my-4 border-border" />
                                <Link to="/services" className="text-sm font-semibold text-primary hover:underline">
                                    Sve usluge →
                                </Link>
                            </div>
                        </aside>

                        {/* Main */}
                        <main className="flex-1">
                            <div className="rounded-2xl border border-border bg-card p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Stethoscope size={24} />
                </span>
                                <h1 className="font-heading text-3xl font-bold text-foreground">{specialty.name}</h1>
                                <p className="mt-4 leading-relaxed text-muted-foreground whitespace-pre-line">
                                    {specialty.description}
                                </p>
                                <Link to="/login" className="mt-6 inline-block">
                                    <Button>
                                        <Stethoscope size={16} /> Zakažite termin
                                    </Button>
                                </Link>
                            </div>
                        </main>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-foreground">Specijalizacija nije pronađena</h2>
                        <p className="mt-2 text-muted-foreground">Izaberite jednu od specijalizacija iz menija.</p>
                        <Link to="/services" className="mt-4 inline-block text-primary hover:underline">← Nazad na usluge</Link>
                    </div>
                )}
            </div>
        </PageWrapper>
    )
}