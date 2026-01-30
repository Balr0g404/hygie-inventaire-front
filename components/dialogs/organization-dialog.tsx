"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { mutate } from "swr"
import { toast } from "sonner"

import { organizationsApi } from "@/lib/api/client"
import type { Organization } from "@/lib/api/types"
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
import { Checkbox } from "@/components/ui/checkbox"

interface OrganizationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    organization?: Organization | null
}

export function OrganizationDialog({ open, onOpenChange, organization }: OrganizationDialogProps) {
    const isEditing = !!organization
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        is_active: true,
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name,
                slug: organization.slug,
                is_active: organization.is_active,
            })
        } else {
            setFormData({
                name: "",
                slug: "",
                is_active: true,
            })
        }
    }, [organization, open])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            if (isEditing && organization) {
                await organizationsApi.update(organization.id, formData)
                toast.success("Organisation mise a jour avec succes")
            } else {
                await organizationsApi.create(formData as Omit<Organization, "id">)
                toast.success("Organisation creee avec succes")
            }
            await mutate("organizations")
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
                        <DialogTitle>
                            {isEditing ? "Modifier l'organisation" : "Nouvelle organisation"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Modifiez les informations de l'organisation ci-dessous."
                                : "Renseignez les informations pour creer une organisation."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="org-name">Nom *</Label>
                            <Input
                                id="org-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Croix Rouge Francaise"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="org-slug">Slug *</Label>
                            <Input
                                id="org-slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="crf-national"
                                required
                            />
                        </div>
                        {isEditing && (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="org-active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, is_active: checked as boolean })
                                    }
                                />
                                <label htmlFor="org-active" className="text-sm cursor-pointer">
                                    Organisation active
                                </label>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.name || !formData.slug}>
                            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
                            {isEditing ? "Enregistrer" : "Creer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
