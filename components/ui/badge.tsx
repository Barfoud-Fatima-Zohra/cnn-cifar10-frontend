"use client"

import { cn } from "@/lib/utils"
import * as React from "react"

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "destructive" | "outline" }

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  const base = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
  const variants: Record<string, string> = {
    default: "bg-primary text-white",
    secondary: "bg-secondary/20 text-foreground border border-border",
    destructive: "bg-destructive text-white",
    outline: "border border-border text-foreground bg-transparent",
  }

  return (
    <span className={cn(base, variants[variant] || variants.default, className)} {...props}>
      {children}
    </span>
  )
}

export default Badge
