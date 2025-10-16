"use client"

import { useEffect } from "react"

export default function ClientCleanup() {
  useEffect(() => {
    try {
      if (typeof document !== "undefined" && document.body) {
        document.body.removeAttribute("data-new-gr-c-s-check-loaded")
        document.body.removeAttribute("data-gr-ext-installed")
      }
    } catch (e) {
    }
  }, [])

  return null
}
