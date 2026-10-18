"use client"

import { useEffect, useSyncExternalStore } from "react"
import { Laptop, Moon, Sun } from "lucide-react"

import {
  applyTheme,
  readTheme,
  subscribeTheme,
  DEFAULT_THEME,
  type ThemeId,
} from "@/lib/theme"

const ORDER: ThemeId[] = ["system", "dark", "light"]
const ICON = { system: Laptop, dark: Moon, light: Sun }
const LABEL = { system: "Auto", dark: "Dark", light: "Light" }

export function ThemeToggle() {
  /* The saved choice lives in localStorage — an external store. Reading it
     through useSyncExternalStore keeps server and client markup identical
     (the server snapshot is the default) and re-renders on every
     `applyTheme` without a setState inside an effect. */
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => DEFAULT_THEME)

  // The palette is applied on mount so a stale `data-theme` (e.g. a saved
  // choice from another Tirbeo app on the same origin) is corrected even
  // when nothing dispatches a change.
  useEffect(() => {
    applyTheme(readTheme())
  }, [])

  function cycle() {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]
    applyTheme(next)
  }

  const Icon = ICON[theme]

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${LABEL[theme]}. Click to change.`}
      className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-fill hover:text-foreground"
    >
      <Icon className="size-[18px]" aria-hidden="true" />
    </button>
  )
}
