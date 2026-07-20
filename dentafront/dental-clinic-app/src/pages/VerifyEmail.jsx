import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { api } from "../lib/api"
import PageWrapper from "../components/PageWrapper"
import { Button, Card } from "../components/ui"

export default function VerifyEmail() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const [status, setStatus] = useState("loading")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setMessage("Nedostaje verifikacioni token.")
            return
        }

        api.get(`/auth/verify-email?token=${token}`)
            .then(res => {
                setStatus("success")
                setMessage(res.data)
            })
            .catch(err => {
                setStatus("error")
                setMessage(err.response?.data || "Verifikacija nije uspela.")
            })
    }, [token])

    return (
        <PageWrapper title="Verifikacija emaila">
            <div className="mx-auto max-w-md px-4 py-16">
                <Card>
                    {status === "loading" && <p className="text-center">Verifikujemo...</p>}
                    {status === "success" && (
                        <div className="text-center">
                            <p className="text-success font-semibold">✅ {message}</p>
                            <Link to="/login" className="mt-4 block">
                                <Button className="w-full">Prijavite se</Button>
                            </Link>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="text-center">
                            <p className="text-destructive font-semibold">❌ {message}</p>
                            <Link to="/register" className="mt-4 block">
                                <Button variant="outline" className="w-full">Pokušajte ponovo</Button>
                            </Link>
                        </div>
                    )}
                </Card>
            </div>
        </PageWrapper>
    )
}