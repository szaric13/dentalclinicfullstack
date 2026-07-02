import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { cn } from "../lib/utils"

export function StarRating({ value = 0, size = 16, className }) {
  const rounded = Math.round(value * 2) / 2
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`Ocena ${value} od 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rounded >= i
        const half = !filled && rounded >= i - 0.5
        return (
          <Star
            key={i}
            size={size}
            className={filled || half ? "text-warning" : "text-muted-foreground/40"}
            fill={filled ? "currentColor" : half ? "url(#half)" : "none"}
          />
        )
      })}
    </div>
  )
}

export function StarInput({ value, onChange, size = 28 }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Ocena">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          aria-label={`${i} ${i === 1 ? "zvezdica" : "zvezdice"}`}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={(hover || value) >= i ? "text-warning" : "text-muted-foreground/40"}
            fill={(hover || value) >= i ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  )
}

export default StarRating
