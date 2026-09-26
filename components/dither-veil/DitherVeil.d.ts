import type { CSSProperties } from "react"

type DitherFit = "contain" | "cover"
type DitherPattern = "bayer" | "atkinson" | "floyd" | "noise" | "lines"
type DitherPalette = "mono" | "duotone" | "rgb"

export interface DitherVeilProps {
  src?: string
  fit?: DitherFit
  pattern?: DitherPattern
  pixelSize?: number
  levels?: number
  palette?: DitherPalette
  inkColor?: string
  paperColor?: string
  contrast?: number
  brightness?: number
  revealRadius?: number
  softness?: number
  linger?: number
  rimColor?: string
  rim?: number
  reverse?: boolean
  wander?: boolean
  clickBurst?: boolean
  transparent?: boolean
  cursorColorReveal?: boolean
  cursorColorRevealRadius?: number
  className?: string
  style?: CSSProperties
}

declare const DitherVeil: (props: DitherVeilProps) => React.ReactElement

export default DitherVeil
