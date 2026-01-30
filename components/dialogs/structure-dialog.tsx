"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { mutate } from "swr"
import { toast } from "sonner"

import { structuresApi } from "@/lib/api/client"
import type { Organization, Structure } from "@/lib/api/types"
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

interface StructureDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    structure?: Structure | null
    organizations: Organization[]
    structures: Structure[]
}

const LEVELS = [
    { value: "NATIONAL", label: "National" },
    { value: "TERRITORIAL", label: "Territorial" },
    { value: "LOCAL", label: "Local" },
]

export function StructureDialog({
                                    open,
                                    onOpenChange,
                                    structure,
                                    organizations,
                                    structures,
                                }: StructureDialogProps) {
    const isEditing = !!structure
    const [formData, setFormData] = useState({
        organization: "",
        level: "LOCAL",
        name: "",
        parent: "",
        code: "",
        is_active: true,
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (structure) {
            setFormData({
                organization: structure.organization.toString(),
                level: structure.level,
                name: structure.name,
                parent: structure.parent ? structure.parent.toString() : "",
                code: structure.code || "",
                is_active: structure.is_active,
            })
        } else {
            setFormData({
                organization: organizations[0]?.id.toString() || "",
                level: "LOCAL",
                name: "",
                parent: "",
                code: "",
                is_active: true,
            })
        }
    }, [structure, organizations, open])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const payload = {
                organization: parseInt(formData.organization),
                level: formData.level as Structure["level"],
                name: formData.name,
                parent: formData.parent ? parseInt(formData.parent) : null,
                code: formData.code,
                is_active: formData.is_active,
            }

            if (isEditing && structure) {
                await structuresApi.update(structure.id, payload)
                toast.success("Structure mise a jour avec succes")
            } else {
                await structuresApi.create(payload as Omit<Structure, "id">)
                toast.success("Structure creee avec succes")
            }
            await mutate("structures")
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
                        <DialogTitle>
                            {isEditing ? "Modifier la structure" : "Nouvelle structure"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Modifiez les informations de la structure."
                                : "Renseignez les informations pour creer une structure."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="structure-org">Organisation *</Label>
                            <Select
                                value={formData.organization}
                                onValueChange={(value) => setFormData({ ...formData, organization: value })}
                            >
                                <SelectTrigger id="structure-org">
                                    <SelectValue placeholder="Choisir une organisation" />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizations.map((org) => (
                                        <SelectItem key={org.id} value={org.id.toString()}>
                                            {org.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="structure-level">Niveau *</Label>
                                <Select
                                    value={formData.level}
                                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                                >
                                    <SelectTrigger id="structure-level">
                                        <SelectValue placeholder="Niveau" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LEVELS.map((level) => (
                                            <SelectItem key={level.value} value={level.value}>
                                                {level.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="structure-code">Code</Label>
                                <Input
                                    id="structure-code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="CRF-75"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="structure-name">Nom *</Label>
                            <Input
                                id="structure-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Delegation territoriale"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="structure-parent">Structure parente</Label>
                            <Select
                                value={formData.parent}
                                onValueChange={(value) => setFormData({ ...formData, parent: value })}
                            >
                                <SelectTrigger id="structure-parent">
                                    <SelectValue placeholder="Aucune" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Aucune</SelectItem>
                                    {structures
                                        .filter((item) => item.id !== structure?.id)
                                        .map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {isEditing && (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="structure-active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, is_active: checked as boolean })
                                    }
                                />
                                <label htmlFor="structure-active" className="text-sm cursor-pointer">
                                    Structure active
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
                            disabled={isLoading || !formData.name || !formData.organization}
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
