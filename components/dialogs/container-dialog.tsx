"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { mutate } from "swr"
import { toast } from "sonner"

import { containersApi } from "@/lib/api/client"
import type { Container, ContainerType, Location, Structure } from "@/lib/api/types"
import { ContainerTypeLabels } from "@/lib/api/types"
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
import { Checkbox } from "@/components/ui/checkbox"

interface ContainerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    container?: Container | null
    structures: Structure[]
    locations: Location[]
}

const CONTAINER_TYPES: ContainerType[] = [
    "BAG_INTERVENTION",
    "BAG_OXY",
    "BAG_FIRST_AID",
    "VEHICLE_VPSP",
    "OXYGEN_CYLINDER",
    "RESERVE_CASE",
    "OTHER",
]

export function ContainerDialog({
                                    open,
                                    onOpenChange,
                                    container,
                                    structures,
                                    locations,
                                }: ContainerDialogProps) {
    const isEditing = !!container
    const [formData, setFormData] = useState({
        structure: "",
        location: "",
        type: "BAG_FIRST_AID" as ContainerType,
        identifier: "",
        label: "",
        is_active: true,
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (container) {
            setFormData({
                structure: container.structure.toString(),
                location: container.location ? container.location.toString() : "",
                type: container.type,
                identifier: container.identifier,
                label: container.label || "",
                is_active: container.is_active,
            })
        } else {
            setFormData({
                structure: structures[0]?.id.toString() || "",
                location: "",
                type: "BAG_FIRST_AID",
                identifier: "",
                label: "",
                is_active: true,
            })
        }
    }, [container, structures, open])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const payload = {
                structure: parseInt(formData.structure),
                location: formData.location ? parseInt(formData.location) : null,
                type: formData.type,
                identifier: formData.identifier,
                label: formData.label,
                is_active: formData.is_active,
            }

            if (isEditing && container) {
                await containersApi.update(container.id, payload)
                toast.success("Conteneur mis a jour avec succes")
            } else {
                await containersApi.create(payload as Omit<Container, "id">)
                toast.success("Conteneur cree avec succes")
            }
            await mutate("containers")
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
            <DialogContent className="sm:max-w-[520px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Modifier le conteneur" : "Nouveau conteneur"}</DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Modifiez les informations du conteneur."
                                : "Renseignez les informations pour creer un conteneur."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="container-structure">Structure *</Label>
                            <Select
                                value={formData.structure}
                                onValueChange={(value) => setFormData({ ...formData, structure: value })}
                            >
                                <SelectTrigger id="container-structure">
                                    <SelectValue placeholder="Choisir une structure" />
                                </SelectTrigger>
                                <SelectContent>
                                    {structures.map((structure) => (
                                        <SelectItem key={structure.id} value={structure.id.toString()}>
                                            {structure.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="container-location">Emplacement</Label>
                            <Select
                                value={formData.location}
                                onValueChange={(value) => setFormData({ ...formData, location: value })}
                            >
                                <SelectTrigger id="container-location">
                                    <SelectValue placeholder="Non assigne" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Non assigne</SelectItem>
                                    {locations.map((location) => (
                                        <SelectItem key={location.id} value={location.id.toString()}>
                                            {location.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="container-type">Type *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, type: value as ContainerType })
                                }
                            >
                                <SelectTrigger id="container-type">
                                    <SelectValue placeholder="Choisir un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CONTAINER_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {ContainerTypeLabels[type]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="container-identifier">Identifiant *</Label>
                                <Input
                                    id="container-identifier"
                                    value={formData.identifier}
                                    onChange={(e) =>
                                        setFormData({ ...formData, identifier: e.target.value })
                                    }
                                    placeholder="VPSP-01"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="container-label">Label</Label>
                                <Input
                                    id="container-label"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    placeholder="Sac intervention 1"
                                />
                            </div>
                        </div>
                        {isEditing && (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="container-active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, is_active: checked as boolean })
                                    }
                                />
                                <label htmlFor="container-active" className="text-sm cursor-pointer">
                                    Conteneur actif
                                </label>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !formData.identifier || !formData.structure}
                        >
                            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
                            {isEditing ? "Enregistrer" : "Creer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
