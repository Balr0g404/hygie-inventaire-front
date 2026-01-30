"use client"

import { IconPalette, IconCheck } from "@tabler/icons-react"
import { useClientTheme } from "@/lib/themes/context"
import { getAvailableThemes } from "@/lib/themes/registry"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function ThemeSelectorMenuItem() {
    const [open, setOpen] = useState(false)
    const { themeId, setThemeId, theme } = useClientTheme()
    const availableThemes = getAvailableThemes()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <IconPalette className="size-4" />
                    Charte graphique
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Charte graphique</DialogTitle>
                    <DialogDescription>
                        Selectionnez la charte graphique a utiliser pour l'application.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                    {availableThemes.map((t) => (
                        <button
                            type="button"
                            key={t.id}
                            onClick={() => {
                                setThemeId(t.id)
                                setOpen(false)
                            }}
                            className={cn(
                                "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50",
                                themeId === t.id && "border-primary bg-primary/5"
                            )}
                        >
                            <div
                                className="size-10 rounded-lg border"
                                style={{
                                    background: `linear-gradient(135deg, ${t.id === themeId ? theme.brand.primary : getThemePreviewColor(t.id, 'primary')} 50%, ${t.id === themeId ? theme.brand.secondary : getThemePreviewColor(t.id, 'secondary')} 50%)`
                                }}
                            />
                            <div className="flex-1">
                                <div className="font-medium">{t.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {t.id}
                                </div>
                            </div>
                            {themeId === t.id && (
                                <IconCheck className="size-5 text-primary" />
                            )}
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Helper to get preview colors without loading full theme
function getThemePreviewColor(id: string, type: 'primary' | 'secondary'): string {
    const previewColors: Record<string, { primary: string; secondary: string }> = {
        'croix-rouge-francaise': { primary: '#ff010b', secondary: '#1dbfee' },
        'samu': { primary: '#0055a4', secondary: '#13d3aa' },
    }
    return previewColors[id]?.[type] || '#888888'
}
