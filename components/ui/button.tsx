"use client"

import { cn } from "@/lib/utils"
import * as React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
}

export const buttonVariants = (variant = "default", size = "default") =>
    cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none",
        variant === "default" && "bg-primary text-white hover:bg-primary/90",
        variant === "outline" && "border border-border bg-transparent",
        variant === "secondary" && "bg-secondary text-foreground",
        variant === "ghost" && "bg-transparent",
        size === "sm" && "px-2 py-1 text-xs",
        size === "lg" && "px-4 py-2 text-base",
        size === "icon" && "p-2"
    )

export function Button({ className = "", variant = "default", size = "default", ...props }: ButtonProps) {
    return <button className={cn(buttonVariants(variant, size), className)} {...props} />
}

export default Button
