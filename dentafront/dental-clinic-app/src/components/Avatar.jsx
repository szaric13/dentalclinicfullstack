import { cn } from "../lib/utils"

const PALETTE = [
  "bg-primary/15 text-primary",
  "bg-success/15 text-success",
  "bg-warning/20 text-warning-foreground",
  "bg-accent text-accent-foreground",
  "bg-secondary text-secondary-foreground",
]

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return Math.abs(h)
}

export default function Avatar({ name = "", src, size = 56, className }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")
  const color = PALETTE[hashString(name) % PALETTE.length]

  if (src) {
    return (
      <img
        src={src || "/placeholder.svg"}
        alt={name}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={cn("rounded-full object-cover", className)}
      />
    )
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-heading font-semibold",
        color,
        className,
      )}
      aria-hidden="true"
    >
      {initials || "Dr"}
    </div>
  )
}
