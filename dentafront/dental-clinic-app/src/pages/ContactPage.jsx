import { MapPin, Phone, Mail, Clock } from "lucide-react"
import PageWrapper from "../components/PageWrapper"
import { Card } from "../components/ui"
import { CLINIC, WORKING_HOURS } from "../lib/data"

export default function ContactPage() {
    return (
        <PageWrapper title="Kontakt" description="Kontakt informacije i radno vreme stomatološke ordinacije Denta u Požegi.">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Kontakt</h1>
                    <p className="mt-3 text-muted-foreground">Tu smo za sva vaša pitanja.</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Contact info */}
                    <div className="space-y-5">
                        <Card>
                            <h2 className="font-heading text-xl font-semibold mb-4">Kontakt informacije</h2>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3">
                                    <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
                                    <span>{CLINIC.address}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone size={18} className="shrink-0 text-primary" />
                                    <a href={`tel:${CLINIC.phoneHref}`} className="hover:text-primary">{CLINIC.phone}</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail size={18} className="shrink-0 text-primary" />
                                    <a href={`mailto:${CLINIC.email}`} className="hover:text-primary">{CLINIC.email}</a>
                                </li>
                            </ul>
                        </Card>

                        <Card>
                            <h2 className="font-heading text-xl font-semibold mb-4">Radno vreme</h2>
                            <ul className="divide-y divide-border">
                                {WORKING_HOURS.map(w => (
                                    <li key={w.day} className="flex items-center justify-between py-2.5 text-sm">
                                        <span className="font-medium text-foreground">{w.day}</span>
                                        <span className={w.closed ? "text-destructive font-semibold" : "text-muted-foreground"}>
                      {w.hours}
                    </span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>

                    {/* Map */}
                    <Card className="p-0 overflow-hidden h-[450px] lg:h-auto">
                        <iframe
                            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2878.123456789!2d20.123456!3d43.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDA3JzI0LjQiTiAyMMKwMDcnMjQuNCJF!5e0!3m2!1ssr!2srs!4v1234567890`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            title="Mapa ordinacije"
                        />
                    </Card>
                </div>
            </div>
        </PageWrapper>
    )
}