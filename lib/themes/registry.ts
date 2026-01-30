// Theme registry - Import all client themes here
import type { ClientTheme, ClientId } from "./types"
import { croixRougeFrancaise } from "./clients/croix-rouge-francaise"
import { samu } from "./clients/samu"

// Register all available client themes
export const themes: Record<ClientId, ClientTheme> = {
    "croix-rouge-francaise": croixRougeFrancaise,
    samu: samu,
}

// Default theme to use if none specified
export const DEFAULT_THEME_ID: ClientId = "croix-rouge-francaise"

// Get theme by ID with fallback to default
export function getTheme(id?: ClientId | null): ClientTheme {
    if (id && themes[id]) {
        return themes[id]
    }
    return themes[DEFAULT_THEME_ID]
}

// Get all available theme IDs
export function getAvailableThemes(): { id: ClientId; name: string }[] {
    return Object.values(themes).map((theme) => ({
        id: theme.id,
        name: theme.name,
    }))
}
