import { useParams, Link } from "react-router-dom"
import { Phone, Mail, Clock, Award, BookOpen } from "lucide-react"
import PageWrapper from "../components/PageWrapper"
import { Card } from "../components/ui"
import Avatar from "../components/Avatar"
import { NURSES } from "../lib/data"

export default function ProfilePage() {
    const { slug } = useParams()
    const person = NURSES.find(n => n.slug === slug)

    if (!person) {
        return (
            <PageWrapper title="Osoba nije pronađena">
                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-muted-foreground">
                    <p>Osoba nije pronađena.</p>
                    <Link to="/team" className="text-primary hover:underline">← Nazad na tim</Link>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper title={person.name} description={`Profil - ${person.name}, ${person.role}`}>
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    <Card className="text-center p-8 lg:col-span-1">
                        <Avatar name={person.name} size={120} className="mx-auto" />
                        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">{person.name}</h1>
                        <p className="mt-1 text-sm text-primary font-medium">{person.role}</p>
                        <div className="mt-4 text-sm text-muted-foreground">📞 {person.phone || "—"}</div>
                    </Card>

                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <h2 className="font-heading text-xl font-semibold mb-3 flex items-center gap-2">
                                <BookOpen size={20} className="text-primary" /> Biografija
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">{person.bio}</p>
                        </Card>
                        <Card>
                            <h2 className="font-heading text-xl font-semibold mb-3 flex items-center gap-2">
                                <Award size={20} className="text-primary" /> Edukacija
                            </h2>
                            <p className="text-muted-foreground">{person.education}</p>
                        </Card>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}