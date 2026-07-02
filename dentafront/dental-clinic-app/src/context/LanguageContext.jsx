import { createContext, useContext, useState } from "react"

const STRINGS = {
  sr: {
    home: "Početna",
    services: "Usluge",
    team: "Naš tim",
    blog: "Blog",
    contact: "Kontakt",
    login: "Prijava",
    register: "Registracija",
    bookNow: "Zakaži termin",
    logout: "Odjavi se",
    allTeam: "Ceo tim",
  },
  en: {
    home: "Home",
    services: "Services",
    team: "Our Team",
    blog: "Blog",
    contact: "Contact",
    login: "Login",
    register: "Register",
    bookNow: "Book now",
    logout: "Log out",
    allTeam: "Full team",
  },
}

const LanguageContext = createContext({ lang: "sr", toggleLang: () => {}, t: (k) => k })

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "sr")

  const toggleLang = () => {
    setLang((l) => {
      const next = l === "sr" ? "en" : "sr"
      localStorage.setItem("lang", next)
      return next
    })
  }

  const t = (key) => STRINGS[lang]?.[key] ?? key

  return <LanguageContext.Provider value={{ lang, toggleLang, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
