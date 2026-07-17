import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect } from "react"
import PageWrapper from "../components/PageWrapper"
import Avatar from "../components/Avatar"
import { useDoctors, useNurses } from "../hooks/usePublicData"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
}

export default function TeamPage() {
    const { doctors, loading: doctorsLoading, refetch: refetchDoctors } = useDoctors()
    const { nurses, loading: nursesLoading, refetch: refetchNurses } = useNurses()

    useEffect(() => {
        const handleFocus = () => {
            refetchDoctors()
            refetchNurses()
        }
        window.addEventListener("focus", handleFocus)
        return () => window.removeEventListener("focus", handleFocus)
    }, [refetchDoctors, refetchNurses])

    const loading = doctorsLoading || nursesLoading

    return (
        <PageWrapper title="Naš tim" description="Upoznajte naše doktore i medicinsko osoblje.">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Naš tim</h1>
                    <p className="mt-3 text-muted-foreground">Stručnjaci kojima verujete svoj osmeh.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 text-muted-foreground">Učitavanje…</div>
                ) : doctors.length === 0 && nurses.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
                        Trenutno nema podataka o timu.
                    </div>
                ) : (
                    <>
                        {/* DOKTORI */}
                        {doctors.length > 0 && (
                            <div className="mb-12">
                                <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">Doktori</h2>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {doctors.map((d, i) => (
                                        <motion.div
                                            key={d.id}
                                            custom={i}
                                            initial="hidden"
                                            whileInView="show"
                                            viewport={{ once: true, margin: "-60px" }}
                                            variants={fadeUp}
                                        >
                                            <Link
                                                to={`/doctor/${d.id}`}
                                                className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
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
                                                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                                                    Dr {d.firstName} {d.lastName}
                                                </h3>
                                                <p className="mt-1 text-sm text-primary">{d.specialization}</p>
                                                {d.yearsOfExperience && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {d.yearsOfExperience} godina iskustva
                                                    </p>
                                                )}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SESTRE */}
                        {nurses.length > 0 && (
                            <div>
                                <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">Medicinske sestre</h2>
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
                                            <Link
                                                to={`/nurse/${n.id}`}
                                                className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                                            >
                                                {n.profileImage ? (
                                                    <img
                                                        src={n.profileImage}
                                                        alt={`${n.firstName} ${n.lastName}`}
                                                        className="h-24 w-24 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <Avatar name={`${n.firstName} ${n.lastName}`} size={96} />
                                                )}
                                                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                                                    {n.firstName} {n.lastName}
                                                </h3>
                                                <p className="mt-1 text-sm text-primary">{n.role}</p>
                                                {n.yearsOfExperience && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {n.yearsOfExperience} godina iskustva
                                                    </p>
                                                )}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageWrapper>
    )
}