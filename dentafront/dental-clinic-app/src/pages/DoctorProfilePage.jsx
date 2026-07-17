import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Star, Phone, Mail, Award, BookOpen, Calendar, Stethoscope, Instagram, Clock } from "lucide-react"
import PageWrapper from "../components/PageWrapper"
import { Button, Card } from "../components/ui"
import Avatar from "../components/Avatar"
import { publicApi } from "../lib/services"

export default function DoctorProfilePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [doctor, setDoctor] = useState(null)
    const [reviews, setReviews] = useState([])
    const [avgRating, setAvgRating] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            publicApi.doctors(),
            publicApi.doctorReviews(id),
            publicApi.doctorAverage(id),
        ]).then(([doctors, revs, avg]) => {
            const doc = doctors.find(d => String(d.id) === String(id))
            setDoctor(doc || null)
            setReviews(revs)
            setAvgRating(avg || 0)
        }).catch(() => {}).finally(() => setLoading(false))
    }, [id])

    if (loading) return <PageWrapper title="Doktor"><div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">Učitavanje…</div></PageWrapper>
    if (!doctor) return <PageWrapper title="Doktor nije pronađen"><div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-muted-foreground">
        <Stethoscope size={48} className="text-muted-foreground/30" />
        <p>Doktor nije pronađen.</p>
        <Link to="/team" className="text-primary hover:underline">← Nazad na tim</Link>
    </div></PageWrapper>

    // Helper za radno vreme (parsiranje JSON)
    const renderWorkingHours = () => {
        if (!doctor.workingHours) return null
        try {
            const wh = JSON.parse(doctor.workingHours)
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
    }

    return (
        <PageWrapper title={`dr ${doctor.firstName} ${doctor.lastName}`} description={`Profil doktora ${doctor.firstName} ${doctor.lastName} - ${doctor.specialization}`}>
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft size={16} /> Nazad
                </button>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left – profile card */}
                    <div className="lg:col-span-1">
                        <Card className="text-center p-8">
                            <Avatar name={`${doctor.firstName} ${doctor.lastName}`} size={120} className="mx-auto" />
                            <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">
                                dr {doctor.firstName} {doctor.lastName}
                            </h1>
                            <p className="mt-1 text-sm text-primary font-medium">{doctor.specialization}</p>
                            <div className="mt-3 flex items-center justify-center gap-1">
                                <span className="text-2xl font-bold text-warning">{avgRating.toFixed(1)}</span>
                                <div className="flex">
                                    {[1,2,3,4,5].map(i => (
                                        <Star key={i} size={16} className={i <= Math.round(avgRating) ? "text-warning" : "text-muted-foreground/30"} fill={i <= Math.round(avgRating) ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <span className="text-xs text-muted-foreground">({reviews.length} ocena)</span>
                            </div>

                            {/* Kontakt podaci */}
                            <div className="mt-6 space-y-3 text-left text-sm">
                                {doctor.phone && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone size={14} className="text-primary shrink-0" />
                                        <a href={`tel:${doctor.phone}`} className="hover:text-primary">{doctor.phone}</a>
                                    </div>
                                )}
                                {doctor.phoneOffice && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone size={14} className="text-primary shrink-0" />
                                        <span>Ordinacija: <a href={`tel:${doctor.phoneOffice}`} className="hover:text-primary">{doctor.phoneOffice}</a></span>
                                    </div>
                                )}
                                {doctor.email && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail size={14} className="text-primary shrink-0" />
                                        <a href={`mailto:${doctor.email}`} className="hover:text-primary">{doctor.email}</a>
                                    </div>
                                )}
                                {doctor.instagram && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Instagram size={14} className="text-primary shrink-0" />
                                        <a href={doctor.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Instagram</a>
                                    </div>
                                )}
                            </div>

                            <Link to="/login" className="mt-6 block">
                                <Button className="w-full">
                                    <Calendar size={16} /> Zakažite termin
                                </Button>
                            </Link>
                        </Card>
                    </div>

                    {/* Right – bio + reviews + dodatne informacije */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Biografija */}
                        <Card>
                            <h2 className="font-heading text-xl font-semibold mb-3 flex items-center gap-2">
                                <BookOpen size={20} className="text-primary" /> Biografija
                            </h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {doctor.bio || `Dr ${doctor.firstName} ${doctor.lastName} je stručnjak iz oblasti ${doctor.specialization}. Posvećen pružanju najkvalitetnije stomatološke nege svojim pacijentima.`}
                            </p>
                        </Card>

                        {/* Edukacija, ekspertiza, godine iskustva */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {doctor.education && (
                                <Card>
                                    <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wide">Edukacija</h3>
                                    <p className="mt-2 text-foreground">{doctor.education}</p>
                                </Card>
                            )}
                            {doctor.expertise && (
                                <Card>
                                    <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wide">Ekspertiza</h3>
                                    <p className="mt-2 text-foreground">{doctor.expertise}</p>
                                </Card>
                            )}
                            {doctor.yearsOfExperience && (
                                <Card>
                                    <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wide">Godine prakse</h3>
                                    <p className="mt-2 text-foreground">{doctor.yearsOfExperience} godina</p>
                                </Card>
                            )}
                        </div>

                        {/* Radno vreme */}
                        {doctor.workingHours && (
                            <Card>
                                <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Clock size={20} className="text-primary" /> Radno vreme
                                </h2>
                                <div className="rounded-xl border border-border bg-background p-4">
                                    {renderWorkingHours()}
                                </div>
                            </Card>
                        )}

                        {/* Ocene pacijenata */}
                        <Card>
                            <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                                <Star size={20} className="text-warning" /> Ocene pacijenata
                            </h2>
                            {reviews.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Još uvek nema ocena.</p>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((r, i) => (
                                        <motion.div
                                            key={r.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="rounded-xl border border-border bg-background p-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-0.5">
                                                    {[1,2,3,4,5].map(s => (
                                                        <Star key={s} size={14} className={s <= r.rating ? "text-warning" : "text-muted-foreground/30"} fill={s <= r.rating ? "currentColor" : "none"} />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(r.createdAt).toLocaleDateString("sr-RS")}
                                                </span>
                                            </div>
                                            {r.comment && <p className="mt-2 text-sm text-foreground">{r.comment}</p>}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}