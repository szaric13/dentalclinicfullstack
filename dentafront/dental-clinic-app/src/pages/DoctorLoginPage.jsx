import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import toast from "react-hot-toast"
import PageWrapper from "../components/PageWrapper"
import AuthLayout from "../components/AuthLayout"
import { Button, Input } from "../components/ui"
import { useAuth } from "../context/AuthContext"
import { apiError } from "../lib/utils"

export default function DoctorLoginPage() {
    const { loginDoctor } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: "", password: "" })
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)

    const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await loginDoctor(form)
            toast.success("Dobrodošli!")
            navigate("/doctor/dashboard", { replace: true })
        } catch (err) {
            toast.error(apiError(err, "Pogrešan email ili lozinka"))
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageWrapper title="Prijava doktora">
            <AuthLayout title="Prijava za doktore" subtitle="Pristupite svom lekarskom panelu.">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail size={17} className="pointer-events-none absolute left-3.5 top-[2.45rem] text-muted-foreground" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Email adresa"
                            placeholder="doktor@denta.rs"
                            value={form.email}
                            onChange={onChange}
                            className="pl-10"
                            required
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
                            className="pl-10 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(s => !s)}
                            className="absolute right-3.5 top-[2.45rem] text-muted-foreground hover:text-foreground"
                            aria-label={showPw ? "Sakrij lozinku" : "Prikaži lozinku"}
                        >
                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <Button type="submit" className="w-full" loading={loading} size="lg">
                        Prijavi se
                    </Button>
                </form>
            </AuthLayout>
        </PageWrapper>
    )
}