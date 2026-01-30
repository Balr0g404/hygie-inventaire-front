"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { mutate } from "swr"
import { toast } from "sonner"

import { sitesApi } from "@/lib/api/client"
import type { Site, Structure } from "@/lib/api/types"
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

interface SiteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    site?: Site | null
    structures: Structure[]
}

export function SiteDialog({ open, onOpenChange, site, structures }: SiteDialogProps) {
    const isEditing = !!site
    const [formData, setFormData] = useState({
        structure: "",
        name: "",
        address: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (site) {
            setFormData({
                structure: site.structure.toString(),
                name: site.name,
                address: site.address || "",
            })
        } else {
            setFormData({
                structure: structures[0]?.id.toString() || "",
                name: "",
                address: "",
            })
        }
    }, [site, structures, open])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const payload = {
                structure: parseInt(formData.structure),
                name: formData.name,
                address: formData.address,
            }

            if (isEditing && site) {
                await sitesApi.update(site.id, payload)
                toast.success("Site mis a jour avec succes")
            } else {
                await sitesApi.create(payload as Omit<Site, "id">)
                toast.success("Site cree avec succes")
            }
            await mutate("sites")
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
                        <DialogTitle>{isEditing ? "Modifier le site" : "Nouveau site"}</DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Modifiez les informations du site."
                                : "Renseignez les informations pour creer un site."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="site-structure">Structure *</Label>
                            <Select
                                value={formData.structure}
                                onValueChange={(value) => setFormData({ ...formData, structure: value })}
                            >
                                <SelectTrigger id="site-structure">
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
                            <Label htmlFor="site-name">Nom *</Label>
                            <Input
                                id="site-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Entrepot principal"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="site-address">Adresse</Label>
                            <Input
                                id="site-address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="10 rue de Paris, 75000 Paris"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.name || !formData.structure}>
                            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
                            {isEditing ? "Enregistrer" : "Creer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
