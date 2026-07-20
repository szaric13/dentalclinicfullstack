import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../lib/api"
import PageWrapper from "../components/PageWrapper"
import { Button, Card, Input } from "../components/ui"
import toast from "react-hot-toast"

export default function VerifyPhone() {
    const navigate = useNavigate()
    const [phone, setPhone] = useState("")
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)

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
        try {
            await api.post("/auth/patient/resend-phone-verification", { phone })
            toast.success("Kod je ponovo poslat.")
        } catch (err) {
            toast.error(err.response?.data || "Nije moguće ponovo poslati kod.")
        }
    }

    return (
        <PageWrapper title="Verifikacija telefona">
            <div className="mx-auto max-w-md px-4 py-16">
                <Card>
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
                            placeholder="Unesite 6-cifreni kod"
                            required
                        />
                        <Button type="submit" loading={loading} className="w-full">
                            Verifikuj
                        </Button>
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-sm text-primary hover:underline"
                        >
                            Ponovo pošalji kod
                        </button>
                    </form>
                </Card>
            </div>
        </PageWrapper>
    )
}