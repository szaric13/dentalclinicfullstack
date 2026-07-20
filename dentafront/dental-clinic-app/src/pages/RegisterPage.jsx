import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react"
import toast from "react-hot-toast"
import PageWrapper from "../components/PageWrapper"
import AuthLayout from "../components/AuthLayout"
import { Button, Input, Textarea } from "../components/ui"
import { authApi } from "../lib/services"
import { apiError, isValidPhone, isValidEmail } from "../lib/utils"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState("form") // form | verify
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    notes: "",
    password: "",
  })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState("")
  const [resending, setResending] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = "Obavezno polje"
    if (!form.lastName.trim()) e.lastName = "Obavezno polje"
    if (!isValidPhone(form.phone)) e.phone = "Unesite ispravan broj (9–15 cifara)"
    if (!isValidEmail(form.email)) e.email = "Unesite ispravnu email adresu"
    if (form.password.length < 6) e.password = "Najmanje 6 karaktera"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const payload = { ...form }
      if (!payload.dateOfBirth) delete payload.dateOfBirth
      if (!payload.notes) delete payload.notes
      await authApi.patientRegister(payload)
      toast.success("Registracija uspešna! Proverite SMS za verifikacioni kod.")
      // Redirect to phone verification with phone pre-filled
      navigate("/verify-phone", { state: { phone: form.phone } })
    } catch (err) {
      toast.error(apiError(err, "Registracija nije uspela"))
    } finally {
      setLoading(false)
    }
  }

  // Legacy verify step – we keep it as fallback but we now redirect to /verify-phone
  // We can keep it if you want, but it's redundant.
  const onVerify = async (e) => {
    e.preventDefault()
    if (!code.trim()) return toast.error("Unesite kod iz SMS poruke")
    setLoading(true)
    try {
      await authApi.patientVerify({ phone: form.phone, code: code.trim() })
      toast.success("Nalog je verifikovan! Možete se prijaviti.")
      navigate("/login", { replace: true })
    } catch (err) {
      toast.error(apiError(err, "Pogrešan ili istekao kod"))
    } finally {
      setLoading(false)
    }
  }

  const onResend = async () => {
    setResending(true)
    try {
      await authApi.patientResend(form.phone)
      toast.success("Novi kod je poslat")
    } catch (err) {
      toast.error(apiError(err, "Slanje koda nije uspelo"))
    } finally {
      setResending(false)
    }
  }

  // Show verify step if we're in that mode (kept for backward compatibility)
  if (step === "verify") {
    return (
        <PageWrapper title="Verifikacija">
          <AuthLayout
              title="Potvrdite broj telefona"
              subtitle={`Unesite šestocifreni kod koji smo poslali na ${form.phone}.`}
          >
            <form onSubmit={onVerify} className="space-y-5">
              <div className="flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck size={28} />
              </span>
              </div>
              <Input
                  id="code"
                  label="Verifikacioni kod"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  inputMode="numeric"
                  maxLength={6}
                  className="text-center text-lg tracking-[0.5em]"
              />
              <Button type="submit" className="w-full" loading={loading} size="lg">
                Potvrdi
              </Button>
              <div className="flex items-center justify-between text-sm">
                <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft size={15} /> Nazad
                </button>
                <button
                    type="button"
                    onClick={onResend}
                    disabled={resending}
                    className="font-semibold text-primary hover:underline disabled:opacity-60"
                >
                  {resending ? "Slanje…" : "Pošalji ponovo"}
                </button>
              </div>
            </form>
          </AuthLayout>
        </PageWrapper>
    )
  }

  return (
      <PageWrapper title="Registracija">
        <AuthLayout
            title="Kreirajte nalog"
            subtitle="Registrujte se da biste zakazivali termine online."
            footer={
              <>
                Već imate nalog?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Prijavite se
                </Link>
              </>
            }
        >
          <form onSubmit={onSubmitForm} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <Input id="firstName" name="firstName" label="Ime" value={form.firstName} onChange={onChange} error={errors.firstName} />
              <Input id="lastName" name="lastName" label="Prezime" value={form.lastName} onChange={onChange} error={errors.lastName} />
            </div>
            <Input id="phone" name="phone" label="Broj telefona" placeholder="0641234567" value={form.phone} onChange={onChange} error={errors.phone} autoComplete="tel" />
            <Input id="email" name="email" type="email" label="Email adresa" placeholder="vi@email.com" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
            <Input id="dateOfBirth" name="dateOfBirth" type="date" label="Datum rođenja (opciono)" value={form.dateOfBirth} onChange={onChange} />
            <div className="relative">
              <Input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  label="Lozinka"
                  placeholder="Najmanje 6 karaktera"
                  value={form.password}
                  onChange={onChange}
                  error={errors.password}
                  className="pr-10"
                  autoComplete="new-password"
              />
              <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3.5 top-[2.45rem] text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Sakrij lozinku" : "Prikaži lozinku"}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Textarea id="notes" name="notes" label="Napomena (opciono)" placeholder="Alergije, posebni zahtevi…" value={form.notes} onChange={onChange} />
            <Button type="submit" className="w-full" loading={loading} size="lg">
              Registruj se
            </Button>
          </form>
        </AuthLayout>
      </PageWrapper>
  )
}