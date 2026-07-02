import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Clock, Banknote, ArrowLeft, CalendarCheck } from "lucide-react"
import PageWrapper from "../components/PageWrapper"
import { Button, Card } from "../components/ui"
import { publicApi } from "../lib/services"

export default function ServiceDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [service, setService] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        publicApi.services()
            .then(data => setService(data.find(s => String(s.id) === String(id)) || null))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <PageWrapper title="Usluga"><div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">Učitavanje…</div></PageWrapper>
    if (!service) return <PageWrapper title="Usluga nije pronađena"><div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">Usluga nije pronađena.</div></PageWrapper>

    return (
        <PageWrapper title={service.name} description={service.description?.slice(0, 150)}>
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft size={16} /> Nazad
                </button>

                <Card className="p-8">
                    <div className="mb-2 inline-block rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                        {service.specialization || "Stomatologija"}
                    </div>
                    <h1 className="mt-3 font-heading text-3xl font-bold text-foreground">{service.name}</h1>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        {service.description || "Opis usluge nije dostupan."}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                            <Clock size={18} className="text-primary" />
                            <span>Trajanje: <strong>{service.durationMinutes} min</strong></span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                            <Banknote size={18} className="text-primary" />
                            <span>Cena: <strong>{service.price ? `${service.price} RSD` : "Na upit"}</strong></span>
                        </div>
                    </div>
                    <div className="mt-8">
                        <Link to="/login">
                            <Button size="lg">
                                <CalendarCheck size={18} /> Zakažite termin
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </PageWrapper>
    )
}