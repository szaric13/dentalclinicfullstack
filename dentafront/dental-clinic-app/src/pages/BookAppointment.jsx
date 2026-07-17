import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, User, Stethoscope, FileText, Phone, ChevronLeft, ChevronRight } from "lucide-react"
import toast from "react-hot-toast"
import PageWrapper from "../components/PageWrapper"
import { Button, Card } from "../components/ui"
import Avatar from "../components/Avatar"
import Modal from "../components/Modal"
import { useAuth } from "../context/AuthContext"
import { patientApi, publicApi } from "../lib/services"
import { apiError, toLocalDateInput, formatDateTime } from "../lib/utils"

export default function BookAppointment() {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const [doctors, setDoctors] = useState([])
    const [services, setServices] = useState([])
    const [doctorId, setDoctorId] = useState("")
    const [serviceId, setServiceId] = useState("")
    const [notes, setNotes] = useState("")
    const [date, setDate] = useState(toLocalDateInput(new Date()))
    const [slots, setSlots] = useState([])
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [chosen, setChosen] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [alt, setAlt] = useState([])
    const [profileDoctor, setProfileDoctor] = useState(null)

    useEffect(() => {
        publicApi.doctors().then(setDoctors).catch(() => {})
        publicApi.services().then(setServices).catch(() => {})
    }, [])

    // Automatski izaberi prvog doktora (dr Zarića) kada se učita
    useEffect(() => {
        if (doctors.length && !doctorId) {
            setDoctorId(String(doctors[0].id))
        }
    }, [doctors])

    const doctor = useMemo(() => doctors.find(d => String(d.id) === String(doctorId)), [doctors, doctorId])

    const filteredServices = useMemo(() => {
        if (!doctor || !doctor.specialization) return services
        const specs = doctor.specialization.split(",").map(s => s.trim().toLowerCase())
        return services.filter(s => !s.specialization || specs.includes(s.specialization.toLowerCase()))
    }, [services, doctor])

    useEffect(() => {
        if (serviceId && !filteredServices.some(s => String(s.id) === String(serviceId))) {
            setServiceId("")
        }
    }, [filteredServices, serviceId])

    async function loadSlots() {
        if (!doctorId || !serviceId) { setSlots([]); return }
        setLoadingSlots(true); setChosen(null); setAlt([])
        try {
            const s = await patientApi.availableSlots(doctorId, serviceId, date)
            setSlots(s || [])
            if (!s || s.length === 0) {
                try {
                    const a = await patientApi.alternativeDates(doctorId, serviceId, date)
                    setAlt(a || [])
                } catch {}
            }
        } catch { setSlots([]) } finally { setLoadingSlots(false) }
    }

    useEffect(() => { loadSlots() }, [doctorId, serviceId, date])

    const slotsByHour = useMemo(() => {
        const g = {}
        slots.forEach(s => {
            const h = new Date(s).getHours()
            if (!g[h]) g[h] = []
            g[h].push(s)
        })
        return g
    }, [slots])

    async function book() {
        if (!chosen) return
        setSubmitting(true)
        try {
            await patientApi.book({
                doctorId: Number(doctorId),
                serviceId: Number(serviceId),
                startDateTime: chosen,
                patientNotes: notes || undefined,
            })
            toast.success("Termin uspešno zakazan")
            navigate("/patient/dashboard")
        } catch (err) {
            toast.error(apiError(err, "Zakazivanje nije uspelo"))
        } finally { setSubmitting(false) }
    }

    return (
        <PageWrapper title="Zakazivanje termina">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center gap-3">
                    <button onClick={() => navigate("/patient/dashboard")} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="font-heading text-3xl font-bold text-foreground">Zakazivanje termina</h1>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Leva kolona */}
                    <div className="space-y-4 lg:col-span-1">
                        <Card>
                            <label className="mb-2 block text-sm font-semibold"><User size={14} className="inline mr-1" /> Doktor</label>
                            <select className="input h-11 w-full rounded-xl border border-input bg-card px-3 text-sm" value={doctorId} onChange={e => setDoctorId(e.target.value)}>
                                {doctors.map(d => (
                                    <option key={d.id} value={d.id}>Dr {d.firstName} {d.lastName} — {d.specialization}</option>
                                ))}
                            </select>
                            {doctor && (
                                <button onClick={() => setProfileDoctor(doctor)} className="mt-2 text-sm text-primary hover:underline">
                                    <Avatar name={`${doctor.firstName} ${doctor.lastName}`} size={20} className="inline mr-1" /> Pregled profila →
                                </button>
                            )}
                        </Card>

                        <Card>
                            <label className="mb-2 block text-sm font-semibold"><Stethoscope size={14} className="inline mr-1" /> Usluga</label>
                            <select className="input h-11 w-full rounded-xl border border-input bg-card px-3 text-sm" value={serviceId} onChange={e => setServiceId(e.target.value)}>
                                <option value="">— Izaberite —</option>
                                {filteredServices.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} {s.durationMinutes ? `(${s.durationMinutes} min)` : ""}</option>
                                ))}
                            </select>
                        </Card>

                        <Card>
                            <label className="mb-2 block text-sm font-semibold"><FileText size={14} className="inline mr-1" /> Napomena</label>
                            <textarea className="input w-full rounded-xl border border-input bg-card px-3 py-2 text-sm" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Posebni zahtevi, alergije…" />
                        </Card>
                    </div>

                    {/* Desna kolona – kalendar */}
                    <div className="lg:col-span-2">
                        {!doctorId || !serviceId ? (
                            <Card className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                                <Calendar size={48} className="mb-3 opacity-30" />
                                <p>Izaberite doktora i uslugu da vidite slobodne termine.</p>
                            </Card>
                        ) : (
                            <Card>
                                <div className="mb-4 flex items-center justify-between">
                                    <button
                                        onClick={() => {
                                            const d = new Date(date)
                                            d.setDate(d.getDate() - 1)
                                            if (d >= new Date(new Date().toDateString())) setDate(toLocalDateInput(d))
                                        }}
                                        className="rounded-lg p-2 hover:bg-secondary transition"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <input
                                        className="rounded-xl border border-input bg-card px-4 py-2 text-center text-sm"
                                        type="date"
                                        min={toLocalDateInput(new Date())}
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                    />
                                    <button
                                        onClick={() => {
                                            const d = new Date(date)
                                            d.setDate(d.getDate() + 1)
                                            setDate(toLocalDateInput(d))
                                        }}
                                        className="rounded-lg p-2 hover:bg-secondary transition"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>

                                {loadingSlots ? (
                                    <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
                                ) : slots.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">Nema slobodnih termina za ovaj datum.</p>
                                        {alt.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm font-semibold mb-2">Predlozi alternativnih datuma:</p>
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    {alt.slice(0, 7).map(d => (
                                                        <button
                                                            key={d}
                                                            onClick={() => setDate(d.split("T")[0])}
                                                            className="rounded-full border border-border bg-card px-3 py-1 text-sm hover:bg-secondary transition"
                                                        >
                                                            {new Date(d).toLocaleDateString("sr-RS")}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {Object.keys(slotsByHour)
                                            .sort((a, b) => Number(a) - Number(b))
                                            .map(h => (
                                                <div key={h}>
                                                    <p className="mb-1 text-xs text-muted-foreground">{h}:00</p>
                                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                                        {slotsByHour[h].map(s => (
                                                            <button
                                                                key={s}
                                                                onClick={() => setChosen(s)}
                                                                className={`rounded-lg border px-2 py-2 text-sm font-medium transition ${
                                                                    chosen === s
                                                                        ? "border-primary bg-primary text-primary-foreground"
                                                                        : "border-success/50 bg-success/10 text-success hover:bg-success/20"
                                                                }`}
                                                            >
                                                                {new Date(s).toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        <div className="border-t border-border pt-4 mt-4">
                                            {chosen && <p className="mb-3 text-sm">Izabrano: <strong>{formatDateTime(chosen)}</strong></p>}
                                            <Button className="w-full" onClick={book} disabled={!chosen || submitting} loading={submitting}>
                                                <Calendar size={16} /> Potvrdi zakazivanje
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <Modal open={!!profileDoctor} onClose={() => setProfileDoctor(null)} title={profileDoctor ? `Dr ${profileDoctor.firstName} ${profileDoctor.lastName}` : ""}>
                {profileDoctor && (
                    <div className="space-y-3 text-center">
                        {profileDoctor.profileImage ? (
                            <img
                                src={profileDoctor.profileImage}
                                alt={`Dr ${profileDoctor.firstName} ${profileDoctor.lastName}`}
                                className="h-20 w-20 rounded-full object-cover mx-auto"
                            />
                        ) : (
                            <Avatar name={`${profileDoctor.firstName} ${profileDoctor.lastName}`} size={80} className="mx-auto" />
                        )}
                        <p className="font-semibold text-primary">{profileDoctor.specialization}</p>
                        <p className="text-sm text-muted-foreground">
                            {profileDoctor.yearsOfExperience ? `${profileDoctor.yearsOfExperience} godina iskustva` : ''}
                        </p>
                    </div>
                )}
            </Modal>
        </PageWrapper>
    )
}