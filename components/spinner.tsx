import type { CSSProperties } from "react"

/**
 * The fleet's waiting mark — a ring defined once in globals.css as `.spinner`,
 * drawn in the colour of the label beside it. `aria-hidden`: that label, or
 * `aria-busy` on the button owning it, is what carries the meaning.
 */
export function Spinner({
  size = 16,
  className = "",
}: {
  size?: number
  className?: string
}) {
  return (
    <span
      className={`spinner ${className}`}
      style={{ "--spinner-size": `${size}px` } as CSSProperties}
      aria-hidden="true"
    />
  )
}
