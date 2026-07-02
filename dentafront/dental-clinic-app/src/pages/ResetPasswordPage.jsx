import { useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import toast from "react-hot-toast"
import PageWrapper from "../components/PageWrapper"
import AuthLayout from "../components/AuthLayout"
import { Button, Input } from "../components/ui"
import { authApi } from "../lib/services"
import { apiError } from "../lib/utils"

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const tokenFromUrl = searchParams.get("token") || ""

    const [mode, setMode] = useState(tokenFromUrl ? "email" : "phone")
    const [token, setToken] = useState(tokenFromUrl)
    const [phone, setPhone] = useState("")
    const [code, setCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (mode === "email") {
                await authApi.patientResetEmail({ token, newPassword })
            } else {
                await authApi.patientResetPhone({ phone, code, newPassword })
            }
            toast.success("Lozinka uspešno resetovana!")
            setTimeout(() => navigate("/login", { replace: true }), 2000)
        } catch (err) {
            toast.error(apiError(err, "Reset lozinke nije uspeo"))
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageWrapper title="Reset lozinke">
            <AuthLayout
                title="Nova lozinka"
                subtitle="Unesite podatke za reset lozinke."
                footer={
                    <Link to="/login" className="text-sm text-primary hover:underline">
                        ← Nazad na prijavu
                    </Link>
                }
            >
                {!tokenFromUrl && (
                    <div className="flex gap-2 mb-4">
                        <Button variant={mode === "email" ? "primary" : "outline"} size="sm" onClick={() => setMode("email")}>
                            Token (email)
                        </Button>
                        <Button variant={mode === "phone" ? "primary" : "outline"} size="sm" onClick={() => setMode("phone")}>
                            Kod (telefon)
                        </Button>
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    {mode === "email" ? (
                        <Input
                            label="Token iz email-a"
                            value={token}
                            onChange={e => setToken(e.target.value)}
                            required
                            placeholder="Unesite token…"
                        />
                    ) : (
                        <>
                            <Input
                                label="Broj telefona"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                                placeholder="0641234567"
                            />
                            <Input
                                label="Kod iz SMS-a"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                required
                                placeholder="123456"
                            />
                        </>
                    )}
                    <Input
                        label="Nova lozinka"
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        placeholder="Min 6 karaktera"
                    />
                    <Button type="submit" className="w-full" loading={loading} size="lg">
                        Resetuj lozinku
                    </Button>
                </form>
            </AuthLayout>
        </PageWrapper>
    )
}