import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect } from "react"
import PageWrapper from "../components/PageWrapper"
import Avatar from "../components/Avatar"
import { useDoctors } from "../hooks/usePublicData"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
}

export default function TeamPage() {
    const { doctors, loading, refetch } = useDoctors()

    // Automatsko osvežavanje
    useEffect(() => {
        const handleFocus = () => refetch()
        window.addEventListener("focus", handleFocus)
        return () => window.removeEventListener("focus", handleFocus)
    }, [refetch])

    // Uzmemo samo prvog doktora (dr Zarića)
    const doctor = doctors[0]

    return (
        <PageWrapper title="Doktor Nenad Zarić" description="Stomatološka ordinacija dr Nenad Zarić – specijalista protetike.">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Dr Nenad Zarić</h1>
                    <p className="mt-3 text-muted-foreground">Specijalista protetike i implantologije</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 text-muted-foreground">Učitavanje…</div>
                ) : !doctor ? (
                    <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
                        Podaci o doktoru nisu dostupni.
                    </div>
                ) : (
                    <div className="mx-auto max-w-md">
                        <motion.div
                            custom={0}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-60px" }}
                            variants={fadeUp}
                        >
                            <Link
                                to={`/doctor/${doctor.id}`}
                                className="group flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                            >
                                <Avatar name={`${doctor.firstName} ${doctor.lastName}`} size={120} />
                                <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                                    Dr {doctor.firstName} {doctor.lastName}
                                </h3>
                                <p className="mt-1 text-sm text-primary">{doctor.specialization}</p>
                                <p className="mt-3 text-sm text-muted-foreground">
                                    {doctor.bio || "Stručnjak sa višegodišnjim iskustvom u oblasti protetike i implantologije."}
                                </p>
                            </Link>
                        </motion.div>
                    </div>
                )}
            </div>
        </PageWrapper>
    )
}