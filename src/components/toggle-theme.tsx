"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // after first render on client, flip mounted = true
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // only valid once mounted
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-5 w-5 transition duration-200" />
        ) : (
          <Moon className="h-5 w-5 transition duration-200" />
        )
      ) : (
        // placeholder to reserve the same SVG shape as Sun (so server/client match)
        <Sun className="h-5 w-5 opacity-0" />
      )}
    </Button>
  )
}
