import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { CLINIC } from "../lib/data"

const QUICK = [
  { key: "cene", label: "Cene usluga" },
  { key: "radno", label: "Radno vreme" },
  { key: "zakazivanje", label: "Kako zakazati?" },
  { key: "lokacija", label: "Gde se nalazite?" },
]

function botAnswer(text) {
  const q = text.toLowerCase()
  if (q.includes("cen") || q.includes("košt") || q.includes("kost") || q.includes("price")) {
    return {
      text: "Cene zavise od usluge. Kompletan cenovnik možete pogledati na stranici Usluge — svaka usluga ima prikazanu cenu i trajanje.",
      action: { label: "Pogledaj cenovnik", to: "/services" },
    }
  }
  if (q.includes("radn") || q.includes("vreme") || q.includes("otvor") || q.includes("hour")) {
    return {
      text: "Radimo radnim danima 08:00–19:00, subotom 08:00–12:00. Nedeljom ne radimo.",
    }
  }
  if (q.includes("zakaz") || q.includes("termin") || q.includes("book") || q.includes("appoint")) {
    return {
      text: "Termin zakazujete online: registrujte se, izaberite lekara, uslugu i slobodan termin u kalendaru.",
      action: { label: "Zakaži termin", to: "/register" },
    }
  }
  if (q.includes("lokac") || q.includes("adres") || q.includes("gde") || q.includes("map")) {
    return {
      text: `Nalazimo se na adresi ${CLINIC.address}. Na stranici Kontakt imate i mapu.`,
      action: { label: "Otvori kontakt", to: "/contact" },
    }
  }
  if (q.includes("zdravo") || q.includes("cao") || q.includes("ćao") || q.includes("hi") || q.includes("hello")) {
    return { text: "Zdravo! Ja sam Dentko, vaš asistent. Pitajte me o cenama, radnom vremenu ili zakazivanju." }
  }
  return {
    text: "Mogu da pomognem oko cena, radnog vremena, lokacije i zakazivanja. Probajte jedno od brzih pitanja ispod, ili nas pozovite na " + CLINIC.phone + ".",
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    { from: "bot", text: "Zdravo! Ja sam Dentko 🦷 Kako mogu da pomognem?" },
  ])
  const endRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  const send = (text) => {
    const value = (text || input).trim()
    if (!value) return
    const reply = botAnswer(value)
    setMessages((m) => [...m, { from: "user", text: value }, { from: "bot", ...reply }])
    setInput("")
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Otvori chat"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed bottom-24 right-5 z-[90] flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
                <Bot size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold">Dentko asistent</p>
                <p className="text-xs opacity-80">Obično odgovara odmah</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div key={i} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.from === "user"
                        ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground"
                        : "max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary px-3.5 py-2 text-sm text-secondary-foreground"
                    }
                  >
                    <p className="leading-relaxed">{m.text}</p>
                    {m.action && (
                      <button
                        onClick={() => { navigate(m.action.to); setOpen(false) }}
                        className="mt-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                      >
                        {m.action.label}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-2">
              {QUICK.map((q) => (
                <button
                  key={q.key}
                  onClick={() => send(q.label)}
                  className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-secondary-foreground transition-colors hover:bg-muted"
                >
                  {q.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send() }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Napišite poruku…"
                className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
                aria-label="Pošalji"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
