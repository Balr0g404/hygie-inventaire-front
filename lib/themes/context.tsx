"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { ClientTheme, ClientId } from "./types"
import { getTheme, DEFAULT_THEME_ID } from "./registry"

interface ClientThemeContextType {
    theme: ClientTheme
    themeId: ClientId
    setThemeId: (id: ClientId) => void
}

const ClientThemeContext = createContext<ClientThemeContextType | undefined>(undefined)

// Convert theme colors to CSS custom properties
function applyThemeColors(theme: ClientTheme) {
    const root = document.documentElement

    // Apply brand colors
    root.style.setProperty("--brand-primary", theme.brand.primary)
    root.style.setProperty("--brand-primary-light", theme.brand.primaryLight)
    root.style.setProperty("--brand-secondary", theme.brand.secondary)
    root.style.setProperty("--brand-secondary-light", theme.brand.secondaryLight)
    root.style.setProperty("--brand-accent1", theme.brand.accent1)
    root.style.setProperty("--brand-accent1-light", theme.brand.accent1Light)
    root.style.setProperty("--brand-accent2", theme.brand.accent2)
    root.style.setProperty("--brand-accent2-light", theme.brand.accent2Light)

    // Apply light theme colors to :root
    const lightColors = theme.light
    root.style.setProperty("--light-background", lightColors.background)
    root.style.setProperty("--light-foreground", lightColors.foreground)
    root.style.setProperty("--light-card", lightColors.card)
    root.style.setProperty("--light-card-foreground", lightColors.cardForeground)
    root.style.setProperty("--light-popover", lightColors.popover)
    root.style.setProperty("--light-popover-foreground", lightColors.popoverForeground)
    root.style.setProperty("--light-primary", lightColors.primary)
    root.style.setProperty("--light-primary-foreground", lightColors.primaryForeground)
    root.style.setProperty("--light-secondary", lightColors.secondary)
    root.style.setProperty("--light-secondary-foreground", lightColors.secondaryForeground)
    root.style.setProperty("--light-muted", lightColors.muted)
    root.style.setProperty("--light-muted-foreground", lightColors.mutedForeground)
    root.style.setProperty("--light-accent", lightColors.accent)
    root.style.setProperty("--light-accent-foreground", lightColors.accentForeground)
    root.style.setProperty("--light-destructive", lightColors.destructive)
    root.style.setProperty("--light-border", lightColors.border)
    root.style.setProperty("--light-input", lightColors.input)
    root.style.setProperty("--light-ring", lightColors.ring)
    root.style.setProperty("--light-chart-1", lightColors.chart1)
    root.style.setProperty("--light-chart-2", lightColors.chart2)
    root.style.setProperty("--light-chart-3", lightColors.chart3)
    root.style.setProperty("--light-chart-4", lightColors.chart4)
    root.style.setProperty("--light-chart-5", lightColors.chart5)
    root.style.setProperty("--light-sidebar", lightColors.sidebar)
    root.style.setProperty("--light-sidebar-foreground", lightColors.sidebarForeground)
    root.style.setProperty("--light-sidebar-primary", lightColors.sidebarPrimary)
    root.style.setProperty("--light-sidebar-primary-foreground", lightColors.sidebarPrimaryForeground)
    root.style.setProperty("--light-sidebar-accent", lightColors.sidebarAccent)
    root.style.setProperty("--light-sidebar-accent-foreground", lightColors.sidebarAccentForeground)
    root.style.setProperty("--light-sidebar-border", lightColors.sidebarBorder)
    root.style.setProperty("--light-sidebar-ring", lightColors.sidebarRing)
    root.style.setProperty("--light-warning", lightColors.warning)
    root.style.setProperty("--light-warning-foreground", lightColors.warningForeground)
    root.style.setProperty("--light-success", lightColors.success)
    root.style.setProperty("--light-success-foreground", lightColors.successForeground)
    root.style.setProperty("--light-critical", lightColors.critical)
    root.style.setProperty("--light-critical-foreground", lightColors.criticalForeground)

    // Apply dark theme colors
    const darkColors = theme.dark
    root.style.setProperty("--dark-background", darkColors.background)
    root.style.setProperty("--dark-foreground", darkColors.foreground)
    root.style.setProperty("--dark-card", darkColors.card)
    root.style.setProperty("--dark-card-foreground", darkColors.cardForeground)
    root.style.setProperty("--dark-popover", darkColors.popover)
    root.style.setProperty("--dark-popover-foreground", darkColors.popoverForeground)
    root.style.setProperty("--dark-primary", darkColors.primary)
    root.style.setProperty("--dark-primary-foreground", darkColors.primaryForeground)
    root.style.setProperty("--dark-secondary", darkColors.secondary)
    root.style.setProperty("--dark-secondary-foreground", darkColors.secondaryForeground)
    root.style.setProperty("--dark-muted", darkColors.muted)
    root.style.setProperty("--dark-muted-foreground", darkColors.mutedForeground)
    root.style.setProperty("--dark-accent", darkColors.accent)
    root.style.setProperty("--dark-accent-foreground", darkColors.accentForeground)
    root.style.setProperty("--dark-destructive", darkColors.destructive)
    root.style.setProperty("--dark-border", darkColors.border)
    root.style.setProperty("--dark-input", darkColors.input)
    root.style.setProperty("--dark-ring", darkColors.ring)
    root.style.setProperty("--dark-chart-1", darkColors.chart1)
    root.style.setProperty("--dark-chart-2", darkColors.chart2)
    root.style.setProperty("--dark-chart-3", darkColors.chart3)
    root.style.setProperty("--dark-chart-4", darkColors.chart4)
    root.style.setProperty("--dark-chart-5", darkColors.chart5)
    root.style.setProperty("--dark-sidebar", darkColors.sidebar)
    root.style.setProperty("--dark-sidebar-foreground", darkColors.sidebarForeground)
    root.style.setProperty("--dark-sidebar-primary", darkColors.sidebarPrimary)
    root.style.setProperty("--dark-sidebar-primary-foreground", darkColors.sidebarPrimaryForeground)
    root.style.setProperty("--dark-sidebar-accent", darkColors.sidebarAccent)
    root.style.setProperty("--dark-sidebar-accent-foreground", darkColors.sidebarAccentForeground)
    root.style.setProperty("--dark-sidebar-border", darkColors.sidebarBorder)
    root.style.setProperty("--dark-sidebar-ring", darkColors.sidebarRing)
    root.style.setProperty("--dark-warning", darkColors.warning)
    root.style.setProperty("--dark-warning-foreground", darkColors.warningForeground)
    root.style.setProperty("--dark-success", darkColors.success)
    root.style.setProperty("--dark-success-foreground", darkColors.successForeground)
    root.style.setProperty("--dark-critical", darkColors.critical)
    root.style.setProperty("--dark-critical-foreground", darkColors.criticalForeground)
}

const STORAGE_KEY = "hygie-client-theme"

export function ClientThemeProvider({
                                        children,
                                        defaultThemeId,
                                    }: {
    children: React.ReactNode
    defaultThemeId?: ClientId
}) {
    const [themeId, setThemeIdState] = useState<ClientId>(
        defaultThemeId || DEFAULT_THEME_ID
    )
    const [mounted, setMounted] = useState(false)

    // Load saved theme from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            setThemeIdState(saved)
        }
        setMounted(true)
    }, [])

    // Apply theme when it changes
    useEffect(() => {
        if (mounted) {
            const theme = getTheme(themeId)
            applyThemeColors(theme)
            localStorage.setItem(STORAGE_KEY, themeId)
        }
    }, [themeId, mounted])

    const setThemeId = (id: ClientId) => {
        setThemeIdState(id)
    }

    const theme = getTheme(themeId)

    return (
        <ClientThemeContext.Provider value={{ theme, themeId, setThemeId }}>
            {children}
        </ClientThemeContext.Provider>
    )
}

export function useClientTheme() {
    const context = useContext(ClientThemeContext)
    if (context === undefined) {
        throw new Error("useClientTheme must be used within a ClientThemeProvider")
    }
    return context
}
