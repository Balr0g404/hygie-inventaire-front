// Theme configuration types for multi-client branding

export interface BrandColors {
    // Primary brand colors
    primary: string
    primaryLight: string
    // Secondary brand colors (for dark mode or accents)
    secondary: string
    secondaryLight: string
    // Additional palette colors
    accent1: string
    accent1Light: string
    accent2: string
    accent2Light: string
}

export interface ThemeColors {
    // Core UI colors
    background: string
    foreground: string
    card: string
    cardForeground: string
    popover: string
    popoverForeground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    destructive: string
    border: string
    input: string
    ring: string
    // Chart colors
    chart1: string
    chart2: string
    chart3: string
    chart4: string
    chart5: string
    // Sidebar colors
    sidebar: string
    sidebarForeground: string
    sidebarPrimary: string
    sidebarPrimaryForeground: string
    sidebarAccent: string
    sidebarAccentForeground: string
    sidebarBorder: string
    sidebarRing: string
    // Status colors
    warning: string
    warningForeground: string
    success: string
    successForeground: string
    critical: string
    criticalForeground: string
}

export interface ClientTheme {
    // Client identification
    id: string
    name: string
    shortName: string
    // Logo configuration
    logo: {
        // SVG path for the logo icon
        svgPath: string
        // Viewbox for the SVG
        viewBox: string
        // Whether to use brand color or keep original
        useBrandColor: boolean
    }
    // Brand color palette
    brand: BrandColors
    // Light mode theme
    light: ThemeColors
    // Dark mode theme
    dark: ThemeColors
    // Font configuration
    fonts?: {
        sans?: string
        mono?: string
    }
}

export type ClientId = string
