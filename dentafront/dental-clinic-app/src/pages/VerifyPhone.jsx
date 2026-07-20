import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import api from "../lib/api"
import PageWrapper from "../components/PageWrapper"
import { Button, Card, Input } from "../components/ui"
import toast from "react-hot-toast"

export default function VerifyPhone() {
    const navigate = useNavigate()
    const location = useLocation()
    const prefillPhone = location.state?.phone || ""
    const [phone, setPhone] = useState(prefillPhone)
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)

    const handleVerify = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post("/auth/patient/verify-phone", { phone, code })
            toast.success("Telefon uspešno verifikovan!")
            navigate("/login")
        } catch (err) {
            toast.error(err.response?.data || "Verifikacija nije uspela.")
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setResending(true)
        try {
            await api.post("/auth/patient/resend-phone", { phone })
            toast.success("Kod je ponovo poslat.")
        } catch (err) {
            toast.error(err.response?.data || "Nije moguće ponovo poslati kod.")
        } finally {
            setResending(false)
        }
    }

    return (
        <PageWrapper title="Verifikacija telefona">
            <div className="mx-auto max-w-md px-4 py-16">
                <Card>
                    <h2 className="text-xl font-bold mb-4 text-center">Verifikujte broj telefona</h2>
                    <p className="text-sm text-muted-foreground text-center mb-6">
                        Unesite 6-cifreni kod koji ste dobili SMS-om.
                    </p>
                    <form onSubmit={handleVerify} className="space-y-4">
                        <Input
                            label="Broj telefona"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+381 65 971 52 11"
                            required
                        />
                        <Input
                            label="Verifikacioni kod"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="123456"
                            required
                            maxLength={6}
                        />
                        <Button type="submit" loading={loading} className="w-full">
                            Verifikuj
                        </Button>
                        <div className="flex items-center justify-between text-sm">
                            <Link to="/login" className="text-muted-foreground hover:text-foreground">
                                ← Nazad na prijavu
                            </Link>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending}
                                className="text-primary hover:underline disabled:opacity-60"
                            >
                                {resending ? "Slanje…" : "Pošalji ponovo"}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </PageWrapper>
    )
}