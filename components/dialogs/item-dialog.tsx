"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { mutate } from "swr"
import { toast } from "sonner"

import { itemsApi } from "@/lib/api/client"
import type { Item } from "@/lib/api/types"
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

interface ItemDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    item?: Item | null
    organizationId: number
}

const CATEGORIES = [
    "Medicaments",
    "Consommables",
    "Materiel medical",
    "Protection",
    "Oxygenotherapie",
    "Immobilisation",
    "Reanimation",
    "Hygiene",
    "Divers",
]

const UNITS = [
    { value: "u.", label: "Unite (u.)" },
    { value: "paire", label: "Paire" },
    { value: "boite", label: "Boite" },
    { value: "flacon", label: "Flacon" },
    { value: "ampoule", label: "Ampoule" },
    { value: "poche", label: "Poche" },
    { value: "rouleau", label: "Rouleau" },
    { value: "kit", label: "Kit" },
]

export function ItemDialog({ open, onOpenChange, item, organizationId }: ItemDialogProps) {
    const isEditing = !!item

    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        unit: "u.",
        category: "",
        is_consumable: true,
        requires_expiry: false,
        requires_lot_number: false,
        is_active: true,
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name,
                sku: item.sku || "",
                unit: item.unit || "u.",
                category: item.category || "",
                is_consumable: item.is_consumable,
                requires_expiry: item.requires_expiry,
                requires_lot_number: item.requires_lot_number,
                is_active: item.is_active,
            })
        } else {
            setFormData({
                name: "",
                sku: "",
                unit: "u.",
                category: "",
                is_consumable: true,
                requires_expiry: false,
                requires_lot_number: false,
                is_active: true,
            })
        }
    }, [item, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (isEditing && item) {
                await itemsApi.update(item.id, formData)
                toast.success("Article mis a jour avec succes")
            } else {
                await itemsApi.create({
                    ...formData,
                    organization: organizationId,
                } as Omit<Item, "id">)
                toast.success("Article cree avec succes")
            }
            await mutate("items")
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
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Modifier l'article" : "Nouvel article"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Modifiez les informations de l'article ci-dessous."
                                : "Remplissez les informations pour creer un nouvel article."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nom de l'article *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Compresses steriles 10x10"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sku">Reference / SKU</Label>
                                <Input
                                    id="sku"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    placeholder="Ex: COMP-10X10"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="unit">Unite</Label>
                                <Select
                                    value={formData.unit}
                                    onValueChange={(value) => setFormData({ ...formData, unit: value })}
                                >
                                    <SelectTrigger id="unit">
                                        <SelectValue placeholder="Choisir une unite" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {UNITS.map((unit) => (
                                            <SelectItem key={unit.value} value={unit.value}>
                                                {unit.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Categorie</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Choisir une categorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3 pt-2">
                            <Label className="text-sm font-medium">Options</Label>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_consumable"
                                    checked={formData.is_consumable}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, is_consumable: checked as boolean })
                                    }
                                />
                                <label htmlFor="is_consumable" className="text-sm cursor-pointer">
                                    Article consommable
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="requires_expiry"
                                    checked={formData.requires_expiry}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, requires_expiry: checked as boolean })
                                    }
                                />
                                <label htmlFor="requires_expiry" className="text-sm cursor-pointer">
                                    Necessite une date de peremption
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="requires_lot_number"
                                    checked={formData.requires_lot_number}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, requires_lot_number: checked as boolean })
                                    }
                                />
                                <label htmlFor="requires_lot_number" className="text-sm cursor-pointer">
                                    Necessite un numero de lot
                                </label>
                            </div>
                            {isEditing && (
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, is_active: checked as boolean })
                                        }
                                    />
                                    <label htmlFor="is_active" className="text-sm cursor-pointer">
                                        Article actif
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.name}>
                            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
                            {isEditing ? "Enregistrer" : "Creer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
