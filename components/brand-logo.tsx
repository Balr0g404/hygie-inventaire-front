"use client"

import { useClientTheme } from "@/lib/themes/context"

interface BrandLogoProps {
    size?: "sm" | "md" | "lg"
    showText?: boolean
    className?: string
}

const sizes = {
    sm: "size-5",
    md: "size-8",
    lg: "size-12",
}

export function BrandLogo({ size = "md", showText = true, className = "" }: BrandLogoProps) {
    const { theme } = useClientTheme()

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                viewBox={theme.logo.viewBox}
                className={sizes[size]}
                fill="currentColor"
                aria-label={theme.name}
            >
                <path
                    d={theme.logo.svgPath}
                    fill={theme.logo.useBrandColor ? theme.brand.primary : "currentColor"}
                />
            </svg>
            {showText && (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-tight">{theme.name}</span>
                    <span className="text-xs text-muted-foreground leading-tight">Hygie inventaire</span>
                </div>
            )}
        </div>
    )
}

export function BrandLogoCompact({ className = "" }: { className?: string }) {
    const { theme } = useClientTheme()

    return (
        <div className={`flex flex-col items-center gap-3 ${className}`}>
            <svg
                viewBox={theme.logo.viewBox}
                className="size-12"
                fill="currentColor"
                aria-label={theme.name}
            >
                <path
                    d={theme.logo.svgPath}
                    fill={theme.logo.useBrandColor ? theme.brand.primary : "currentColor"}
                />
            </svg>
            <div className="flex flex-col items-center">
                <span className="text-xl font-semibold">{theme.name}</span>
                <span className="text-sm text-muted-foreground">Hygie inventaire</span>
            </div>
        </div>
    )
}
