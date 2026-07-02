import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
    LogOut, CheckCircle, XCircle, Clock, CalendarPlus, Star, UserPlus, ChevronDown, ChevronUp, MessageSquare,
} from "lucide-react"
import toast from "react-hot-toast"
import PageWrapper from "../components/PageWrapper"
import { Button, Card, Input, Select } from "../components/ui"
import { StatusBadge } from "../components/StatusBadge"
import Modal from "../components/Modal"
import { useAuth } from "../context/AuthContext"
import { doctorApi, publicApi } from "../lib/services"
import { formatDateTime, formatTime, apiError } from "../lib/utils"    // <-- ISPRAVLJENO
import { WORKING_HOURS_RULES } from "../lib/data"                     // <-- ISPRAVLJENO

const DAYS = ["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"]

export default function DoctorDashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    // Profile & appointments
    const [profile, setProfile] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)

    // Sections toggle
    const [showHours, setShowHours] = useState(false)
    const [showReviews, setShowReviews] = useState(false)
    const [showManual, setShowManual] = useState(false)

    // Working hours
    const [workingHours, setWorkingHours] = useState([])

    // Reviews
    const [reviews, setReviews] = useState([])
    const [avgRating, setAvgRating] = useState(0)

    // Cancel modal
    const [cancelId, setCancelId] = useState(null)
    const [cancelReason, setCancelReason] = useState("")

    // Manual appointment form
    const [manual, setManual] = useState({
        serviceId: "", startDateTime: "", patientPhone: "",
        patientFirstName: "", patientLastName: "", patientNotes: "",
    })

    const fetchData = useCallback(async () => {
        try {
            const [p, a, s] = await Promise.all([
                doctorApi.profile(),
                doctorApi.appointments(),
                publicApi.services(),
            ])
            setProfile(p)
            setAppointments(a)
            setServices(s)
        } catch (err) {
            if (err.response?.status === 403) {
                logout()
            } else {
                toast.error(apiError(err))
            }
        } finally {
            setLoading(false)
        }
    }, [logout])

    useEffect(() => { fetchData() }, [fetchData])

    // Reviews
    useEffect(() => {
        if (!profile) return
        Promise.all([
            publicApi.doctorReviews(profile.id),
            publicApi.doctorAverage(profile.id),
        ]).then(([r, avg]) => {
            setReviews(r)
            setAvgRating(avg || 0)
        }).catch(() => {})
    }, [profile])

    // --- Actions ---
    const handleConfirm = async (id) => {
        try {
            await doctorApi.confirm(id)
            toast.success("Termin potvrđen")
            fetchData()
        } catch (err) { toast.error(apiError(err)) }
    }

    const handleCancel = async () => {
        if (!cancelId) return
        try {
            await doctorApi.cancel(cancelId, cancelReason)
            toast.success("Termin otkazan")
            setCancelId(null)
            setCancelReason("")
            fetchData()
        } catch (err) { toast.error(apiError(err)) }
    }

    const handleManualSubmit = async (e) => {
        e.preventDefault()
        try {
            await doctorApi.manual(manual)
            toast.success("Termin dodat")
            setShowManual(false)
            setManual({ serviceId: "", startDateTime: "", patientPhone: "", patientFirstName: "", patientLastName: "", patientNotes: "" })
            fetchData()
        } catch (err) { toast.error(apiError(err)) }
    }

    const saveWorkingHours = async (dayData) => {
        const day = dayData.dayOfWeek
        const maxEnd = day === 6 ? WORKING_HOURS_RULES.saturday.end : WORKING_HOURS_RULES.weekday.end
        const minStart = WORKING_HOURS_RULES.weekday.start
        if (day === 7) { toast.error("Nedeljom se ne radi"); return }
        if (dayData.startTime && dayData.startTime < minStart) { toast.error(`Početak ne može pre ${minStart}`); return }
        if (dayData.endTime && dayData.endTime > maxEnd) { toast.error(`Kraj ne može posle ${maxEnd}`); return }
        if (dayData.startTime && dayData.endTime && dayData.startTime >= dayData.endTime) { toast.error("Početak mora biti pre kraja"); return }
        try {
            await doctorApi.workingHours({
                doctorId: profile.id,
                dayOfWeek: day,
                startTime: dayData.startTime || null,
                endTime: dayData.endTime || null,
                breakStart: dayData.breakStart || null,
                breakEnd: dayData.breakEnd || null,
            })
            toast.success("Radno vreme sačuvano")
        } catch (err) { toast.error(apiError(err)) }
    }

    if (loading) return <PageWrapper title="Doktor panel"><div className="flex min-h-[60vh] items-center justify-center">Učitavanje…</div></PageWrapper>
    if (!profile) return null

    const statusLabel = (s) => s === "SCHEDULED" ? "Zakazan" : s === "CONFIRMED" ? "Potvrđen" : s === "CANCELLED" ? "Otkazan" : s

    return (
        <PageWrapper title="Doktor panel">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-foreground">
                            dr {profile.firstName} {profile.lastName}
                        </h1>
                        <p className="text-sm text-muted-foreground">{profile.specialization} | {profile.email}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowHours(!showHours)}>
                            <Clock size={14} /> Radno vreme {showHours ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowReviews(!showReviews)}>
                            <Star size={14} /> Ocene {showReviews ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowManual(!showManual)}>
                            <UserPlus size={14} /> Dodaj termin
                        </Button>
                        <Button variant="destructive" size="sm" onClick={logout}><LogOut size={14} /></Button>
                    </div>
                </div>

                {/* Working Hours */}
                {showHours && (
                    <Card className="mb-6">
                        <h3 className="font-heading text-lg font-semibold mb-3">Radno vreme</h3>
                        <p className="text-xs text-muted-foreground mb-4">Pon–Pet 08–19h, Sub 08–12h, Ned zatvoreno.</p>
                        <div className="space-y-3">
                            {DAYS.map((day, i) => {
                                const wh = workingHours[i] || { dayOfWeek: i+1, startTime: "", endTime: "", breakStart: "", breakEnd: "" }
                                return (
                                    <div key={i} className="flex flex-wrap gap-2 items-end p-3 rounded-xl border border-border bg-background">
                                        <span className="w-20 text-sm font-semibold">{day}</span>
                                        <input type="time" className="h-10 rounded-xl border border-input bg-card px-2 text-sm w-28" value={wh.startTime || ""} onChange={e => {
                                            const copy = [...workingHours]; copy[i] = {...wh, startTime: e.target.value}; setWorkingHours(copy)
                                        }} />
                                        <input type="time" className="h-10 rounded-xl border border-input bg-card px-2 text-sm w-28" value={wh.endTime || ""} onChange={e => {
                                            const copy = [...workingHours]; copy[i] = {...wh, endTime: e.target.value}; setWorkingHours(copy)
                                        }} />
                                        <Button size="sm" onClick={() => saveWorkingHours(wh)}>Sačuvaj</Button>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                )}

                {/* Reviews */}
                {showReviews && (
                    <Card className="mb-6">
                        <h3 className="font-heading text-lg font-semibold">Moje ocene</h3>
                        <p className="mt-2 text-2xl font-bold text-warning">
                            {"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))} {avgRating.toFixed(1)}
                        </p>
                        <div className="mt-4 space-y-3">
                            {reviews.length === 0 ? <p className="text-sm text-muted-foreground">Još uvek nema ocena.</p> : reviews.map(r => (
                                <div key={r.id} className="rounded-xl border border-border bg-background p-3">
                                    <p className="text-sm font-medium text-foreground">{r.comment || "Bez komentara"}</p>
                                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                        <span className="text-warning">{"★".repeat(r.rating)}</span>
                                        <span>{new Date(r.createdAt).toLocaleDateString("sr-RS")}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Manual Appointment */}
                {showManual && (
                    <Card className="mb-6">
                        <h3 className="font-heading text-lg font-semibold mb-3">Ručno dodavanje termina</h3>
                        <form onSubmit={handleManualSubmit} className="grid gap-3 sm:grid-cols-2">
                            <Input label="Ime pacijenta" value={manual.patientFirstName} onChange={e => setManual({...manual, patientFirstName: e.target.value})} required />
                            <Input label="Prezime pacijenta" value={manual.patientLastName} onChange={e => setManual({...manual, patientLastName: e.target.value})} required />
                            <Input label="Telefon" value={manual.patientPhone} onChange={e => setManual({...manual, patientPhone: e.target.value})} required />
                            <Select label="Usluga" value={manual.serviceId} onChange={e => setManual({...manual, serviceId: e.target.value})} required>
                                <option value="">-- Izaberite --</option>
                                {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} min)</option>)}
                            </Select>
                            <Input label="Datum i vreme" type="datetime-local" value={manual.startDateTime} onChange={e => setManual({...manual, startDateTime: e.target.value})} required />
                            <Input label="Beleške" value={manual.patientNotes} onChange={e => setManual({...manual, patientNotes: e.target.value})} />
                            <div className="sm:col-span-2">
                                <Button type="submit" className="w-full">Dodaj termin</Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Appointments */}
                <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">Vaši termini</h2>
                {appointments.length === 0 ? (
                    <Card className="text-center text-muted-foreground py-10">Nemate zakazanih termina.</Card>
                ) : (
                    <div className="space-y-3">
                        {appointments.map(app => (
                            <motion.div key={app.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-heading font-semibold text-foreground">{app.serviceName}</h3>
                                        <p className="text-sm text-muted-foreground">Pacijent: {app.doctorName}</p>
                                        <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                                            <Clock size={13} /> {formatDateTime(app.start)} – {formatTime(app.end)}
                                        </p>
                                        {app.cancellationReason && <p className="mt-1 text-xs text-destructive">Razlog: {app.cancellationReason}</p>}
                                    </div>
                                    <StatusBadge status={app.status} />
                                </div>
                                <div className="mt-3 flex gap-2">
                                    {app.status === "SCHEDULED" && (
                                        <Button size="sm" onClick={() => handleConfirm(app.id)}><CheckCircle size={14} /> Potvrdi</Button>
                                    )}
                                    {(app.status === "SCHEDULED" || app.status === "CONFIRMED") && (
                                        <Button size="sm" variant="outline" onClick={() => { setCancelId(app.id); setCancelReason("") }}>
                                            <XCircle size={14} /> Otkaži
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel modal */}
            <Modal open={!!cancelId} onClose={() => setCancelId(null)} title="Otkazivanje termina">
                <p className="text-sm text-muted-foreground mb-3">Unesite razlog otkazivanja:</p>
                <textarea
                    className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm mb-4"
                    rows={3}
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                    placeholder="Razlog otkazivanja…"
                />
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setCancelId(null)}>Odustani</Button>
                    <Button variant="destructive" onClick={handleCancel}>Potvrdi otkazivanje</Button>
                </div>
            </Modal>
        </PageWrapper>
    )
}