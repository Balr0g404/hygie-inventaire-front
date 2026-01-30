"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { mutate } from "swr"
import { toast } from "sonner"

import { lotTemplatesApi } from "@/lib/api/client"
import type { LotTemplate, Organization, LotCode } from "@/lib/api/types"
import { LotCodeLabels } from "@/lib/api/types"
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

interface LotTemplateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    template?: LotTemplate | null
    organizations: Organization[]
}

const LOT_CODES: LotCode[] = ["LOT_A", "LOT_B", "LOT_C", "VPSP"]

export function LotTemplateDialog({
    open,
    onOpenChange,
    template,
    organizations,
}: LotTemplateDialogProps) {
    const isEditing = !!template
    const [formData, setFormData] = useState({
        organization: "",
        code: "LOT_A" as LotCode,
        name: "",
        version: "",
        is_active: true,
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (template) {
            setFormData({
                organization: template.organization.toString(),
                code: template.code,
                name: template.name,
                version: template.version || "",
                is_active: template.is_active,
            })
        } else {
            setFormData({
                organization: organizations[0]?.id.toString() || "",
                code: "LOT_A",
                name: "",
                version: "",
                is_active: true,
            })
        }
    }, [template, organizations, open])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const payload = {
                organization: parseInt(formData.organization),
                code: formData.code,
                name: formData.name,
                version: formData.version,
                is_active: formData.is_active,
            }

            if (isEditing && template) {
                await lotTemplatesApi.update(template.id, payload)
                toast.success("Modele de lot mis a jour avec succes")
            } else {
                await lotTemplatesApi.create(payload as Omit<LotTemplate, "id">)
                toast.success("Modele de lot cree avec succes")
            }
            await mutate("lot-templates")
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
                        <DialogTitle>{isEditing ? "Modifier le modele de lot" : "Nouveau modele de lot"}</DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Modifiez les informations du modele."
                                : "Renseignez les informations pour creer un modele de lot."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="template-org">Organisation *</Label>
                            <Select
                                value={formData.organization}
                                onValueChange={(value) => setFormData({ ...formData, organization: value })}
                            >
                                <SelectTrigger id="template-org">
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
                        <div className="grid gap-2">
                            <Label htmlFor="template-code">Code *</Label>
                            <Select
                                value={formData.code}
                                onValueChange={(value) => setFormData({ ...formData, code: value as LotCode })}
                            >
                                <SelectTrigger id="template-code">
                                    <SelectValue placeholder="Choisir un code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOT_CODES.map((code) => (
                                        <SelectItem key={code} value={code}>
                                            {LotCodeLabels[code]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="template-name">Nom *</Label>
                            <Input
                                id="template-name"
                                value={formData.name}
                                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                                placeholder="Nom du lot"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="template-version">Version</Label>
                            <Input
                                id="template-version"
                                value={formData.version}
                                onChange={(event) => setFormData({ ...formData, version: event.target.value })}
                                placeholder="Ex: v1"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="template-active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, is_active: checked as boolean })
                                }
                            />
                            <Label htmlFor="template-active" className="text-sm cursor-pointer">
                                Modele actif
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                isLoading ||
                                !formData.organization ||
                                !formData.code ||
                                !formData.name
                            }
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
