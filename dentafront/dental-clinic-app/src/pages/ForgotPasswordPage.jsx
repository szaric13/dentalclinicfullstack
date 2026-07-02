import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, Phone, ArrowRight } from "lucide-react"
import toast from "react-hot-toast"
import PageWrapper from "../components/PageWrapper"
import AuthLayout from "../components/AuthLayout"
import { Button, Input } from "../components/ui"
import { authApi } from "../lib/services"
import { apiError } from "../lib/utils"

export default function ForgotPasswordPage() {
    const [mode, setMode] = useState("email") // email | phone
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (mode === "email") {
                await authApi.patientForgotEmail(email)
                toast.success("Link za reset lozinke je poslat na email (proverite konzolu)")
            } else {
                await authApi.patientForgotPhone(phone)
                toast.success("Kod za reset lozinke je poslat na telefon")
            }
            setSent(true)
        } catch (err) {
            toast.error(apiError(err, "Slanje nije uspelo"))
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageWrapper title="Zaboravljena lozinka">
            <AuthLayout
                title="Zaboravljena lozinka"
                subtitle={sent ? "Proverite vaš email ili telefon." : "Unesite email ili broj telefona za reset lozinke."}
                footer={
                    <Link to="/login" className="text-sm text-primary hover:underline">
                        ← Nazad na prijavu
                    </Link>
                }
            >
                {!sent && (
                    <div className="flex gap-2 mb-4">
                        <Button variant={mode === "email" ? "primary" : "outline"} size="sm" onClick={() => setMode("email")}>
                            <Mail size={14} /> Email
                        </Button>
                        <Button variant={mode === "phone" ? "primary" : "outline"} size="sm" onClick={() => setMode("phone")}>
                            <Phone size={14} /> Telefon
                        </Button>
                    </div>
                )}

                {!sent ? (
                    <form onSubmit={onSubmit} className="space-y-4">
                        {mode === "email" ? (
                            <Input
                                id="email"
                                type="email"
                                label="Email adresa"
                                placeholder="vi@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        ) : (
                            <Input
                                id="phone"
                                type="tel"
                                label="Broj telefona"
                                placeholder="0641234567"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                            />
                        )}
                        <Button type="submit" className="w-full" loading={loading} size="lg">
                            {mode === "email" ? "Pošalji link" : "Pošalji kod"}
                        </Button>
                    </form>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground">
                            {mode === "email"
                                ? "Ako email postoji u našoj bazi, dobićete link za reset lozinke."
                                : "Ako broj postoji u našoj bazi, dobićete SMS sa kodom."}
                        </p>
                        <Link to="/reset-password" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                            Već imate kod? Resetujte lozinku <ArrowRight size={14} />
                        </Link>
                    </div>
                )}
            </AuthLayout>
        </PageWrapper>
    )
}