"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { mutate } from "swr"
import { toast } from "sonner"

import { locationsApi } from "@/lib/api/client"
import type { Location, Site } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface LocationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    location?: Location | null
    sites: Site[]
}

export function LocationDialog({ open, onOpenChange, location, sites }: LocationDialogProps) {
    const isEditing = !!location
    const [formData, setFormData] = useState({
        site: "",
        name: "",
        location_type: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (location) {
            setFormData({
                site: location.site.toString(),
                name: location.name,
                location_type: location.location_type || "",
            })
        } else {
            setFormData({
                site: sites[0]?.id.toString() || "",
                name: "",
                location_type: "",
            })
        }
    }, [location, sites, open])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const payload = {
                site: parseInt(formData.site),
                name: formData.name,
                location_type: formData.location_type,
            }

            if (isEditing && location) {
                await locationsApi.update(location.id, payload)
                toast.success("Emplacement mis a jour avec succes")
            } else {
                await locationsApi.create(payload as Omit<Location, "id">)
                toast.success("Emplacement cree avec succes")
            }
            await mutate("locations")
            onOpenChange(false)
        } catch (error) {
            toast.error(isEditing ? "Erreur lors de la mise a jour" : "Erreur lors de la creation")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Modifier l'emplacement" : "Nouvel emplacement"}</DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Modifiez les informations de l'emplacement."
                                : "Renseignez les informations pour creer un emplacement."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="location-site">Site *</Label>
                            <Select
                                value={formData.site}
                                onValueChange={(value) => setFormData({ ...formData, site: value })}
                            >
                                <SelectTrigger id="location-site">
                                    <SelectValue placeholder="Choisir un site" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sites.map((site) => (
                                        <SelectItem key={site.id} value={site.id.toString()}>
                                            {site.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location-name">Nom *</Label>
                            <Input
                                id="location-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Salle de stockage"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location-type">Type d'emplacement</Label>
                            <Input
                                id="location-type"
                                value={formData.location_type}
                                onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                                placeholder="Armoire, Reserve, Vehicule..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.name || !formData.site}>
                            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
                            {isEditing ? "Enregistrer" : "Creer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
