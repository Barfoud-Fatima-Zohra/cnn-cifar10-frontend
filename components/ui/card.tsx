"use client"

import { cn } from "@/lib/utils"
import * as React from "react"

export function Card({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-between", className)} {...props} />
}

export function CardTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-sm font-semibold", className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className = "", children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-2", className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-end p-2", className)} {...props}>
      {children}
    </div>
  )
}

export default Card
