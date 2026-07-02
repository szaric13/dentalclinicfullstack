export function cn(...inputs) {
  return inputs.flat().filter(Boolean).join(" ")
}

export function formatPrice(value) {
  if (value == null) return ""
  const num = Number(value)
  if (Number.isNaN(num)) return value
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDuration(minutes) {
  if (!minutes) return ""
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}min` : `${h}h`
}

const MONTHS_SR = [
  "januar", "februar", "mart", "april", "maj", "jun",
  "jul", "avgust", "septembar", "oktobar", "novembar", "decembar",
]
const DAYS_SR = ["nedelja", "ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota"]

export function formatDateTime(iso) {
  if (!iso) return ""
  const d = new Date(iso)
  const day = d.getDate()
  const month = MONTHS_SR[d.getMonth()]
  const year = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${day}. ${month} ${year}. u ${hh}:${mm}`
}

export function formatDate(iso) {
  if (!iso) return ""
  const d = new Date(iso)
  return `${d.getDate()}. ${MONTHS_SR[d.getMonth()]} ${d.getFullYear()}.`
}

export function formatDayLabel(iso) {
  if (!iso) return ""
  const d = new Date(iso)
  return `${DAYS_SR[d.getDay()]}, ${d.getDate()}. ${MONTHS_SR[d.getMonth()]}`
}

export function formatTime(iso) {
  if (!iso) return ""
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

export function toLocalDateInput(date) {
  const d = date instanceof Date ? date : new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function hoursUntil(iso) {
  const target = new Date(iso).getTime()
  return (target - Date.now()) / (1000 * 60 * 60)
}

export function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function apiError(err, fallback = "Došlo je do greške. Pokušajte ponovo.") {
  const data = err?.response?.data
  if (typeof data === "string" && data) return data
  return data?.message || data?.error || err?.message || fallback
}

export function isValidPhone(phone) {
  return /^[0-9+]{9,15}$/.test(String(phone || "").replace(/\s/g, ""))
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""))
}
