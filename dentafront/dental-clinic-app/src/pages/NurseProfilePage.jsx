import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Phone, Mail, Award, BookOpen, Clock } from "lucide-react"
import PageWrapper from "../components/PageWrapper"
import { Card } from "../components/ui"
import Avatar from "../components/Avatar"
import { publicApi } from "../lib/services"

export default function NurseProfilePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [nurse, setNurse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        publicApi.nurse(id)
            .then(data => setNurse(data))
            .catch(() => setError("Sestra nije pronađena"))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <PageWrapper title="Sestra"><div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">Učitavanje…</div></PageWrapper>
    if (error || !nurse) return <PageWrapper title="Sestra nije pronađena">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-muted-foreground">
            <p>{error || "Sestra nije pronađena."}</p>
            <Link to="/nurses" className="text-primary hover:underline">← Nazad na spisak sestara</Link>
        </div>
    </PageWrapper>

    return (
        <PageWrapper title={`${nurse.firstName} ${nurse.lastName}`}>
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft size={16} /> Nazad
                </button>

                <Card className="p-8">
                    <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-6">
                        {nurse.profileImage ? (
                            <img
                                src={nurse.profileImage}
                                alt={`${nurse.firstName} ${nurse.lastName}`}
                                className="h-30 w-30 rounded-full object-cover shrink-0"
                            />
                        ) : (
                            <Avatar name={`${nurse.firstName} ${nurse.lastName}`} size={120} className="shrink-0" />
                        )}
                        <div className="mt-4 md:mt-0">
                            <h1 className="font-heading text-3xl font-bold text-foreground">
                                {nurse.firstName} {nurse.lastName}
                            </h1>
                            <p className="text-lg text-primary font-medium">{nurse.role}</p>
                            {nurse.phone && (
                                <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                                    <Phone size={16} className="text-primary" />
                                    <a href={`tel:${nurse.phone}`} className="hover:text-primary">{nurse.phone}</a>
                                </div>
                            )}
                            {nurse.email && (
                                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                                    <Mail size={16} className="text-primary" />
                                    <a href={`mailto:${nurse.email}`} className="hover:text-primary">{nurse.email}</a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        {nurse.yearsOfExperience && (
                            <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
                                <Award size={20} className="text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Iskustvo</p>
                                    <p className="font-semibold text-foreground">{nurse.yearsOfExperience} godina</p>
                                </div>
                            </div>
                        )}
                        {nurse.education && (
                            <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
                                <BookOpen size={20} className="text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Edukacija</p>
                                    <p className="font-semibold text-foreground">{nurse.education}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {nurse.bio && (
                        <div className="mt-8">
                            <h2 className="font-heading text-xl font-semibold mb-3">Biografija</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{nurse.bio}</p>
                        </div>
                    )}

                    {nurse.workingHours && (
                        <div className="mt-8">
                            <h2 className="font-heading text-xl font-semibold mb-3 flex items-center gap-2">
                                <Clock size={20} className="text-primary" /> Radno vreme
                            </h2>
                            <div className="rounded-xl border border-border bg-background p-4">
                                {(() => {
                                    try {
                                        const wh = JSON.parse(nurse.workingHours)
                                        const days = {
                                            ponedeljak: "Ponedeljak",
                                            utorak: "Utorak",
                                            sreda: "Sreda",
                                            cetvrtak: "Četvrtak",
                                            petak: "Petak",
                                            subota: "Subota",
                                            nedelja: "Nedelja"
                                        }
                                        return Object.entries(days).map(([key, label]) => (
                                            <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                                                <span className="text-foreground">{label}</span>
                                                <span className="text-muted-foreground">{wh[key] || "Zatvoreno"}</span>
                                            </div>
                                        ))
                                    } catch {
                                        return <p className="text-sm text-muted-foreground">Radno vreme nije dostupno</p>
                                    }
                                })()}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </PageWrapper>
    )
}