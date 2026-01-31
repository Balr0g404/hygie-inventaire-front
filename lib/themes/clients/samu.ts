import type { ClientTheme } from "../types"

// Example theme for SAMU (Service d'Aide Medicale Urgente)
// This demonstrates how to create additional client themes

export const samu: ClientTheme = {
    id: "samu",
    name: "Service d'Aide Medicale Urgente",
    shortName: "SAMU",

    logo: {
        // Star of Life symbol path
        svgPath: "M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z",
        viewBox: "0 0 24 24",
        useBrandColor: true,
    },

    brand: {
        primary: "#0066cc",
        primaryLight: "#cce0ff",
        secondary: "#ff6600",
        secondaryLight: "#ffe0cc",
        accent1: "#00aa66",
        accent1Light: "#ccf2e0",
        accent2: "#6600cc",
        accent2Light: "#e0ccff",
    },

    light: {
        // Light theme - blanc et bleu dominant
        background: "#fefefe",
        foreground: "#1a1a1a",
        card: "#ffffff",
        cardForeground: "#1a1a1a",
        popover: "#ffffff",
        popoverForeground: "#1a1a1a",
        primary: "#0066cc",
        primaryForeground: "#ffffff",
        secondary: "#cce0ff",
        secondaryForeground: "#1a1a1a",
        muted: "#f5f5f5",
        mutedForeground: "#525252",
        accent: "#cce0ff",
        accentForeground: "#1a1a1a",
        destructive: "#dc2626",
        border: "#e5e5e5",
        input: "#e5e5e5",
        ring: "#0066cc",
        // Chart colors
        chart1: "#0066cc",
        chart2: "#00aa66",
        chart3: "#ff6600",
        chart4: "#6600cc",
        chart5: "#cce0ff",
        // Sidebar
        sidebar: "#fefefe",
        sidebarForeground: "#1a1a1a",
        sidebarPrimary: "#0066cc",
        sidebarPrimaryForeground: "#ffffff",
        sidebarAccent: "#cce0ff",
        sidebarAccentForeground: "#1a1a1a",
        sidebarBorder: "#e5e5e5",
        sidebarRing: "#0066cc",
        // Status
        warning: "#f59e0b",
        warningForeground: "#1a1a1a",
        success: "#00aa66",
        successForeground: "#ffffff",
        critical: "#dc2626",
        criticalForeground: "#ffffff",
    },

    dark: {
        // Dark theme - noir et orange dominant
        background: "#0a0a0a",
        foreground: "#fefefe",
        card: "#141414",
        cardForeground: "#fefefe",
        popover: "#141414",
        popoverForeground: "#fefefe",
        primary: "#ff6600",
        primaryForeground: "#000000",
        secondary: "#ffe0cc",
        secondaryForeground: "#000000",
        muted: "#1f1f1f",
        mutedForeground: "#a3a3a3",
        accent: "#ffe0cc",
        accentForeground: "#000000",
        destructive: "#ef4444",
        border: "#2a2a2a",
        input: "#2a2a2a",
        ring: "#ff6600",
        // Chart colors
        chart1: "#ff6600",
        chart2: "#00cc77",
        chart3: "#3399ff",
        chart4: "#9966ff",
        chart5: "#ffe0cc",
        // Sidebar
        sidebar: "#0a0a0a",
        sidebarForeground: "#fefefe",
        sidebarPrimary: "#ff6600",
        sidebarPrimaryForeground: "#000000",
        sidebarAccent: "#3d2200",
        sidebarAccentForeground: "#fefefe",
        sidebarBorder: "#2a2a2a",
        sidebarRing: "#ff6600",
        // Status
        warning: "#fbbf24",
        warningForeground: "#000000",
        success: "#00cc77",
        successForeground: "#000000",
        critical: "#ef4444",
        criticalForeground: "#ffffff",
    },
}
