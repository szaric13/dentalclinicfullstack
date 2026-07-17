import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { Phone, Mail, Clock, Award, BookOpen, Stethoscope } from "lucide-react"
import PageWrapper from "../components/PageWrapper"
import Avatar from "../components/Avatar"
import { Card } from "../components/ui"
import { useNurses } from "../hooks/usePublicData"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
}

export default function NursesPage() {
    const { nurses, loading, refetch } = useNurses()

    useEffect(() => {
        const handleFocus = () => refetch()
        window.addEventListener("focus", handleFocus)
        return () => window.removeEventListener("focus", handleFocus)
    }, [refetch])

    return (
        <PageWrapper title="Medicinsko osoblje" description="Upoznajte naše medicinske sestre.">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Medicinsko osoblje</h1>
                    <p className="mt-3 text-muted-foreground">Stručne sestre koje brinu o vašem osmehu.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 text-muted-foreground">Učitavanje…</div>
                ) : nurses.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
                        Trenutno nema medicinskih sestara u bazi.
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {nurses.map((n, i) => (
                            <motion.div
                                key={n.id}
                                custom={i}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: "-60px" }}
                                variants={fadeUp}
                            >
                                <Card className="p-6 h-full flex flex-col">
                                    <div className="flex flex-col items-center text-center">
                                        <Avatar name={`${n.firstName} ${n.lastName}`} size={80} />
                                        <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                                            {n.firstName} {n.lastName}
                                        </h3>
                                        <p className="text-sm text-primary font-medium">{n.role}</p>
                                    </div>

                                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                        {n.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-primary" />
                                                <a href={`tel:${n.phone}`} className="hover:text-primary">
                                                    {n.phone}
                                                </a>
                                            </div>
                                        )}
                                        {n.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-primary" />
                                                <a href={`mailto:${n.email}`} className="hover:text-primary">
                                                    {n.email}
                                                </a>
                                            </div>
                                        )}
                                        {n.yearsOfExperience && (
                                            <div className="flex items-center gap-2">
                                                <Award size={14} className="text-primary" />
                                                <span>{n.yearsOfExperience} godina iskustva</span>
                                            </div>
                                        )}
                                        {n.education && (
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={14} className="text-primary" />
                                                <span>{n.education}</span>
                                            </div>
                                        )}
                                    </div>

                                    {n.bio && (
                                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-4">
                                            {n.bio}
                                        </p>
                                    )}

                                    {n.workingHours && (
                                        <details className="mt-4">
                                            <summary className="cursor-pointer text-sm font-semibold text-primary hover:underline">
                                                <Clock size={14} className="inline mr-1" /> Radno vreme
                                            </summary>
                                            <div className="mt-3 space-y-1 text-sm">
                                                {(() => {
                                                    try {
                                                        const wh = JSON.parse(n.workingHours)
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
                                                            <div key={key} className="flex justify-between text-xs">
                                                                <span className="text-muted-foreground">{label}</span>
                                                                <span className="text-foreground">{wh[key] || "Zatvoreno"}</span>
                                                            </div>
                                                        ))
                                                    } catch {
                                                        return <p className="text-xs text-muted-foreground">Radno vreme nije dostupno</p>
                                                    }
                                                })()}
                                            </div>
                                        </details>
                                    )}
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </PageWrapper>
    )
}