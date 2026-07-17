import { useEffect, useState, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
    CalendarPlus, LogOut, Trash2, CalendarRange, Star, Download,
    Clock, MapPin, Phone, Mail, ChevronRight, AlertCircle
} from "lucide-react"
import toast from "react-hot-toast"
import PageWrapper from "../components/PageWrapper"
import { Button, Card } from "../components/ui"
import { StatusBadge } from "../components/StatusBadge"
import Modal from "../components/Modal"
import { useAuth } from "../context/AuthContext"
import { patientApi } from "../lib/services"
import { publicApi } from "../lib/services"
import { formatDateTime, formatDayLabel, formatTime, apiError, hoursUntil, toLocalDateInput } from "../lib/utils"
import { CLINIC } from "../lib/data"

export default function PatientDashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    // Cancel modal
    const [cancelId, setCancelId] = useState(null)

    // Reschedule state
    const [rescheduleId, setRescheduleId] = useState(null)
    const [newDate, setNewDate] = useState("")
    const [slots, setSlots] = useState([])
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [loadingSlots, setLoadingSlots] = useState(false)

    // Review state
    const [reviewId, setReviewId] = useState(null)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [submittingReview, setSubmittingReview] = useState(false)

    const fetchData = useCallback(async () => {
        try {
            const [p, a] = await Promise.all([patientApi.profile(), patientApi.appointments()])
            setProfile(p)
            setAppointments(a)
        } catch (err) {
            toast.error(apiError(err))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchData() }, [fetchData])

    // --- Cancel ---
    const handleCancel = async () => {
        if (!cancelId) return
        try {
            await patientApi.cancel(cancelId)
            toast.success("Termin otkazan")
            setCancelId(null)
            fetchData()
        } catch (err) {
            toast.error(apiError(err, "Otkazivanje nije uspelo"))
        }
    }

    // --- Reschedule ---
    const openReschedule = (app) => {
        setRescheduleId(app.id)
        setNewDate("")
        setSlots([])
        setSelectedSlot(null)
    }

    const fetchSlots = async () => {
        if (!newDate || !rescheduleId) return
        const app = appointments.find(a => a.id === rescheduleId)
        if (!app) return
        setLoadingSlots(true)
        try {
            const data = await patientApi.availableSlots(app.doctorId, app.serviceId, newDate)
            setSlots(data)
            setSelectedSlot(null)
        } catch (err) {
            toast.error(apiError(err))
        } finally {
            setLoadingSlots(false)
        }
    }

    const submitReschedule = async () => {
        if (!selectedSlot) return
        try {
            await patientApi.reschedule(rescheduleId, selectedSlot)
            toast.success("Termin pomeren. Doktor mora ponovo da potvrdi.")
            setRescheduleId(null)
            fetchData()
        } catch (err) {
            toast.error(apiError(err, "Pomeranje nije uspelo"))
        }
    }

    // --- Review ---
    const submitReview = async () => {
        if (!reviewId) return
        const app = appointments.find(a => a.id === reviewId)
        if (!app) return
        setSubmittingReview(true)
        try {
            const { reviewApi } = await import("../lib/services")
            await reviewApi.create(app.doctorId, { appointmentId: reviewId, rating, comment })
            toast.success("Ocena poslata!")
            setReviewId(null)
            fetchData()
        } catch (err) {
            toast.error(apiError(err, "Slanje ocene nije uspelo"))
        } finally {
            setSubmittingReview(false)
        }
    }

    // --- ICS Download ---
    const downloadICS = async (app) => {
        const { default: ics } = await import("ics")
        const start = new Date(app.start)
        const end = new Date(app.end)
        const event = {
            start: [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()],
            duration: { minutes: Math.round((end - start) / 60000) },
            title: `${app.serviceName} - ${CLINIC.name}`,
            description: `Stomatološki termin: ${app.serviceName}\nDoktor: ${app.doctorName}`,
            location: CLINIC.address,
        }
        ics.createEvent(event, (err, value) => {
            if (!err) {
                const blob = new Blob([value], { type: "text/calendar;charset=utf-8" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url; a.download = `termin-${app.id}.ics`
                document.body.appendChild(a); a.click(); document.body.removeChild(a)
                URL.revokeObjectURL(url)
            }
        })
    }

    if (loading) return <PageWrapper title="Moj profil"><div className="flex min-h-[60vh] items-center justify-center">Učitavanje…</div></PageWrapper>
    if (!profile) return <PageWrapper title="Moj profil"><div className="flex min-h-[60vh] items-center justify-center">Nije moguće učitati profil.</div></PageWrapper>

    const nextApp = appointments.find(a => a.status === "SCHEDULED" || a.status === "CONFIRMED")

    return (
        <PageWrapper title="Moj profil">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-foreground">
                            Dobrodošli, {profile.firstName} {profile.lastName}
                        </h1>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Phone size={14} /> {profile.phone}</span>
                            {profile.email && <span className="flex items-center gap-1"><Mail size={14} /> {profile.email}</span>}
                            {profile.dateOfBirth && <span className="flex items-center gap-1"><Clock size={14} /> {profile.dateOfBirth}</span>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => navigate("/patient/book")}><CalendarPlus size={16} /> Zakaži novi termin</Button>
                        <Button variant="outline" onClick={logout}><LogOut size={16} /> Odjavi se</Button>
                    </div>
                </div>

                {/* Next appointment */}
                {nextApp && (
                    <Card className="mb-6 border-l-4 border-l-primary">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-primary">Vaš sledeći termin</p>
                                <p className="mt-1 font-heading text-lg font-bold text-foreground">{nextApp.serviceName}</p>
                                <p className="text-sm text-muted-foreground">{nextApp.doctorName} • {formatDateTime(nextApp.start)}</p>
                            </div>
                            <StatusBadge status={nextApp.status} />
                        </div>
                    </Card>
                )}

                {/* Appointments list */}
                <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">Vaši termini</h2>
                {appointments.length === 0 ? (
                    <Card className="text-center text-muted-foreground py-10">
                        <CalendarRange size={40} className="mx-auto mb-3 text-muted-foreground/50" />
                        Nemate zakazanih termina.
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {appointments.map(app => (
                            <motion.div key={app.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-heading font-semibold text-foreground">{app.serviceName}</h3>
                                        <p className="text-sm text-muted-foreground">{app.doctorName}</p>
                                        <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                                            <Clock size={13} /> {formatDateTime(app.start)} – {formatTime(app.end)}
                                        </p>
                                        {app.cancellationReason && <p className="mt-1 text-xs text-destructive">Razlog: {app.cancellationReason}</p>}
                                    </div>
                                    <StatusBadge status={app.status} />
                                </div>

                                {(app.status === "SCHEDULED" || app.status === "CONFIRMED") && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setCancelId(app.id)}>
                                            <Trash2 size={14} /> Otkaži
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => openReschedule(app)}>
                                            <CalendarRange size={14} /> Pomeri
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => downloadICS(app)}>
                                            <Download size={14} /> Kalendar
                                        </Button>
                                        {app.status === "CONFIRMED" && (
                                            <Button variant="outline" size="sm" onClick={() => { setReviewId(app.id); setRating(5); setComment("") }}>
                                                <Star size={14} /> Oceni
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {/* Reschedule form */}
                                {rescheduleId === app.id && (
                                    <div className="mt-4 rounded-xl border border-border bg-background p-4">
                                        <div className="flex flex-wrap gap-3 items-end">
                                            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="h-10 rounded-xl border border-input bg-card px-3 text-sm" />
                                            <Button size="sm" onClick={fetchSlots} loading={loadingSlots}>Prikaži slotove</Button>
                                        </div>
                                        {slots.length > 0 && (
                                            <select className="mt-3 h-10 w-full rounded-xl border border-input bg-card px-3 text-sm" value={selectedSlot || ""} onChange={e => setSelectedSlot(e.target.value)}>
                                                <option value="">-- Izaberite vreme --</option>
                                                {slots.map((s, i) => <option key={i} value={s}>{formatTime(s)}</option>)}
                                            </select>
                                        )}
                                        {selectedSlot && (
                                            <Button className="mt-3" size="sm" onClick={submitReschedule}>Potvrdi pomeranje</Button>
                                        )}
                                        <button className="mt-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setRescheduleId(null)}>Odustani</button>
                                    </div>
                                )}

                                {/* Review form */}
                                {reviewId === app.id && (
                                    <div className="mt-4 rounded-xl border border-border bg-background p-4">
                                        <p className="text-sm font-medium mb-2">Ocena (1-5)</p>
                                        <div className="flex gap-1 mb-3">
                                            {[1,2,3,4,5].map(i => (
                                                <button key={i} onClick={() => setRating(i)} className={`text-2xl ${i <= rating ? "text-warning" : "text-muted-foreground/30"}`}>
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm mb-3"
                                            rows={2}
                                            placeholder="Komentar (opciono)"
                                            value={comment}
                                            onChange={e => setComment(e.target.value)}
                                        />
                                        <Button size="sm" onClick={submitReview} loading={submittingReview}>Pošalji ocenu</Button>
                                        <button className="ml-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setReviewId(null)}>Odustani</button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel modal */}
            <Modal open={!!cancelId} onClose={() => setCancelId(null)} title="Otkazivanje termina">
                <p className="text-sm text-muted-foreground mb-4">Da li ste sigurni da želite da otkažete ovaj termin?</p>
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setCancelId(null)}>Ne</Button>
                    <Button variant="destructive" onClick={handleCancel}>Da, otkaži</Button>
                </div>
            </Modal>
        </PageWrapper>
    )
}