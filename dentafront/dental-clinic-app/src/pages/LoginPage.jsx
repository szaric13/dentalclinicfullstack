import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff, Phone, Lock } from "lucide-react"
import toast from "react-hot-toast"
import PageWrapper from "../components/PageWrapper"
import AuthLayout from "../components/AuthLayout"
import { Button, Input } from "../components/ui"
import { useAuth } from "../context/AuthContext"
import { apiError, isValidPhone } from "../lib/utils"

export default function LoginPage() {
  const { loginPatient } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ phone: "", password: "" })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!isValidPhone(form.phone)) e.phone = "Unesite ispravan broj telefona (9–15 cifara)"
    if (form.password.length < 6) e.password = "Lozinka mora imati najmanje 6 karaktera"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await loginPatient(form)
      toast.success("Dobrodošli nazad!")
      const to = location.state?.from?.pathname || "/patient/dashboard"
      navigate(to, { replace: true })
    } catch (err) {
      toast.error(apiError(err, "Pogrešan broj telefona ili lozinka"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper title="Prijava">
      <AuthLayout
        title="Prijavite se"
        subtitle="Unesite svoje podatke da biste pristupili nalogu."
        footer={
          <>
            Nemate nalog?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Registrujte se
            </Link>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="relative">
            <Phone size={17} className="pointer-events-none absolute left-3.5 top-[2.45rem] text-muted-foreground" />
            <Input
              id="phone"
              name="phone"
              label="Broj telefona"
              placeholder="0641234567"
              value={form.phone}
              onChange={onChange}
              error={errors.phone}
              className="pl-10"
              autoComplete="tel"
            />
          </div>

          <div className="relative">
            <Lock size={17} className="pointer-events-none absolute left-3.5 top-[2.45rem] text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPw ? "text" : "password"}
              label="Lozinka"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              error={errors.password}
              className="px-10"
              autoComplete="current-password"
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

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Zaboravili ste lozinku?
            </Link>
          </div>

          <Button type="submit" className="w-full" loading={loading} size="lg">
            Prijavi se
          </Button>
        </form>
      </AuthLayout>
    </PageWrapper>
  )
}
