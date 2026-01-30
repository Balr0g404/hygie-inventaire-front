// Theme system exports
export type { ClientTheme, ClientId, BrandColors, ThemeColors } from "./types"
export { themes, DEFAULT_THEME_ID, getTheme, getAvailableThemes } from "./registry"
export { ClientThemeProvider, useClientTheme } from "./context"
