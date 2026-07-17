import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Globe,
  CalendarPlus,
  LayoutDashboard,
  LogOut,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"
import { useAuth } from "../context/AuthContext"
import { useDoctors, useNurses } from "../hooks/usePublicData"
import { SPECIALTIES, CLINIC } from "../lib/data"
import { Button } from "./ui"
import { cn } from "../lib/utils"
import toast from "react-hot-toast"

function Dropdown({ label, children, width = "w-64" }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const timer = useRef(null)

  const enter = () => {
    clearTimeout(timer.current)
    setOpen(true)
  }
  const leave = () => {
    timer.current = setTimeout(() => setOpen(false), 120)
  }

  return (
      <div className="relative" ref={ref} onMouseEnter={enter} onMouseLeave={leave}>
        <button
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
        >
          {label}
          <ChevronDown size={15} className={cn("transition-transform", open && "rotate-180")} />
        </button>
        <AnimatePresence>
          {open && (
              <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.16 }}
                  className={cn(
                      "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2",
                      width,
                  )}
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-popover p-2 shadow-xl">
                  {children}
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  )
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { lang, toggleLang, t } = useLanguage()
  const { isAuthenticated, role, logout } = useAuth()
  const { doctors } = useDoctors()
  const { nurses, loading: nursesLoading } = useNurses()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    toast.success("Uspešno ste se odjavili")
    navigate("/")
    setMobileOpen(false)
  }

  const dashboardLink = role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard"

  const onSearch = (e) => {
    e.preventDefault()
    const q = query.trim().toLowerCase()
    if (!q) return
    setSearchOpen(false)
    setQuery("")
    const spec = SPECIALTIES.find((s) => s.name.toLowerCase().includes(q))
    if (spec) return navigate(`/services/specialty/${spec.slug}`)
    if ("kontakt".includes(q) || q.includes("adres")) return navigate("/contact")
    if ("blog".includes(q)) return navigate("/blog")
    navigate("/services")
  }

  return (
      <header
          className={cn(
              "sticky top-0 z-50 w-full border-b transition-all duration-300",
              scrolled
                  ? "border-border bg-background/85 backdrop-blur-xl"
                  : "border-transparent bg-background/60 backdrop-blur-md",
          )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo – sada koristi sliku iz public/images/logonz */}
          <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
            <img
                src="/images/logonz.png"
                alt={CLINIC.name}
                className="h-9 w-9 object-contain"
            />
            {CLINIC.name}
          </Link>

          {/* Center nav – isti */}
          <div className="hidden items-center gap-1 lg:flex">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    cn(
                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                        isActive ? "text-foreground" : "text-foreground/80",
                    )
                }
            >
              {t("home")}
            </NavLink>

            <Dropdown label={t("services")} width="w-72">
              <Link
                  to="/services"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Sve usluge
              </Link>
              <div className="my-1 h-px bg-border" />
              {SPECIALTIES.map((s) => (
                  <Link
                      key={s.slug}
                      to={`/services/specialty/${s.slug}`}
                      className="block rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {s.name}
                  </Link>
              ))}
            </Dropdown>

            <Dropdown label={t("team")} width="w-72">
              {doctors.slice(0, 6).map((d) => (
                  <Link
                      key={d.id}
                      to={`/doctor/${d.id}`}
                      className="block rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    Dr {d.firstName} {d.lastName}
                    <span className="block text-xs text-muted-foreground">{d.specialization}</span>
                  </Link>
              ))}
              <div className="my-1 h-px bg-border" />

              {nursesLoading ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">Učitavanje...</div>
              ) : nurses.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">Nema medicinskih sestara</div>
              ) : (
                  <>
                    {nurses.slice(0, 6).map((n) => (
                        <Link
                            key={n.id}
                            to={`/nurse/${n.id}`}
                            className="block rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          {n.firstName} {n.lastName}
                          <span className="block text-xs text-muted-foreground">{n.role}</span>
                        </Link>
                    ))}
                  </>
              )}

              <div className="my-1 h-px bg-border" />
              <Link
                  to="/team"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-secondary"
              >
                {t("allTeam")} →
              </Link>
            </Dropdown>

            <NavLink
                to="/blog"
                className={({ isActive }) =>
                    cn(
                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                        isActive ? "text-foreground" : "text-foreground/80",
                    )
                }
            >
              {t("blog")}
            </NavLink>
            <NavLink
                to="/contact"
                className={({ isActive }) =>
                    cn(
                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                        isActive ? "text-foreground" : "text-foreground/80",
                    )
                }
            >
              {t("contact")}
            </NavLink>
          </div>

          {/* Right actions – isti */}
          <div className="flex items-center gap-1">
            <button
                onClick={() => setSearchOpen((o) => !o)}
                className="rounded-lg p-2 text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Pretraga"
            >
              <Search size={19} />
            </button>
            <button
                onClick={toggleTheme}
                className="rounded-lg p-2 text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Promeni temu"
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button
                onClick={toggleLang}
                className="hidden items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground sm:flex"
                aria-label="Promeni jezik"
            >
              <Globe size={17} />
              <span className="uppercase">{lang}</span>
            </button>

            <div className="ml-1 hidden items-center gap-2 lg:flex">
              {isAuthenticated ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => navigate(dashboardLink)}>
                      <LayoutDashboard size={16} /> Profil
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut size={16} /> {t("logout")}
                    </Button>
                  </>
              ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                      {t("login")}
                    </Button>
                    <Button size="sm" onClick={() => navigate("/register")}>
                      <CalendarPlus size={16} /> {t("bookNow")}
                    </Button>
                  </>
              )}
            </div>

            <button
                onClick={() => setMobileOpen((o) => !o)}
                className="rounded-lg p-2 text-foreground/70 transition-colors hover:bg-secondary lg:hidden"
                aria-label="Meni"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Search bar – isti */}
        <AnimatePresence>
          {searchOpen && (
              <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-border bg-background"
              >
                <form onSubmit={onSearch} className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
                  <Search size={18} className="text-muted-foreground" />
                  <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Pretražite usluge, specijalnosti…"
                      className="h-9 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <Button size="sm" type="submit">
                    Traži
                  </Button>
                </form>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu – isti */}
        <AnimatePresence>
          {mobileOpen && (
              <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-border bg-background lg:hidden"
              >
                <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
                  {[
                    { to: "/", label: t("home") },
                    { to: "/services", label: t("services") },
                    { to: "/team", label: t("team") },
                    { to: "/blog", label: t("blog") },
                    { to: "/contact", label: t("contact") },
                  ].map((l) => (
                      <NavLink
                          key={l.to}
                          to={l.to}
                          onClick={() => setMobileOpen(false)}
                          className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary"
                      >
                        {l.label}
                      </NavLink>
                  ))}
                  <div className="my-2 h-px bg-border" />
                  {isAuthenticated ? (
                      <>
                        <Button variant="outline" onClick={() => { navigate(dashboardLink); setMobileOpen(false) }}>
                          Moj profil
                        </Button>
                        <Button variant="ghost" onClick={handleLogout}>
                          {t("logout")}
                        </Button>
                      </>
                  ) : (
                      <>
                        <Button variant="outline" onClick={() => { navigate("/login"); setMobileOpen(false) }}>
                          {t("login")}
                        </Button>
                        <Button onClick={() => { navigate("/register"); setMobileOpen(false) }}>
                          {t("bookNow")}
                        </Button>
                      </>
                  )}
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </header>
  )
}