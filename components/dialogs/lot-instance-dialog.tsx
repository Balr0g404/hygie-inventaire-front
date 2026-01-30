"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { mutate } from "swr"
import { toast } from "sonner"

import { lotInstancesApi } from "@/lib/api/client"
import type { LotInstance, LotTemplate, Container } from "@/lib/api/types"
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

interface LotInstanceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    lotInstance?: LotInstance | null
    templates: LotTemplate[]
    containers: Container[]
}

function toDateTimeLocal(value: string | null) {
    if (!value) return ""
    const date = new Date(value)
    const offset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function toApiDateTime(value: string) {
    if (!value) return null
    return new Date(value).toISOString()
}

export function LotInstanceDialog({
    open,
    onOpenChange,
    lotInstance,
    templates,
    containers,
}: LotInstanceDialogProps) {
    const isEditing = !!lotInstance
    const [formData, setFormData] = useState({
        template: "",
        container: "",
        status: "",
        last_checked_at: "",
        next_check_due_at: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (lotInstance) {
            setFormData({
                template: lotInstance.template.toString(),
                container: lotInstance.container.toString(),
                status: lotInstance.status || "",
                last_checked_at: toDateTimeLocal(lotInstance.last_checked_at),
                next_check_due_at: toDateTimeLocal(lotInstance.next_check_due_at),
            })
        } else {
            setFormData({
                template: templates[0]?.id.toString() || "",
                container: containers[0]?.id.toString() || "",
                status: "OK",
                last_checked_at: "",
                next_check_due_at: "",
            })
        }
    }, [lotInstance, templates, containers, open])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const payload = {
                template: parseInt(formData.template),
                container: parseInt(formData.container),
                status: formData.status,
                last_checked_at: toApiDateTime(formData.last_checked_at),
                next_check_due_at: toApiDateTime(formData.next_check_due_at),
            }

            if (isEditing && lotInstance) {
                await lotInstancesApi.update(lotInstance.id, payload)
                toast.success("Instance de lot mise a jour avec succes")
            } else {
                await lotInstancesApi.create(payload as Omit<LotInstance, "id">)
                toast.success("Instance de lot creee avec succes")
            }
            await mutate("lot-instances")
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
                        <DialogTitle>{isEditing ? "Modifier l'instance de lot" : "Nouvelle instance de lot"}</DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Modifiez les informations de l'instance de lot."
                                : "Renseignez les informations pour creer une instance de lot."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="lot-template">Modele *</Label>
                            <Select
                                value={formData.template}
                                onValueChange={(value) => setFormData({ ...formData, template: value })}
                            >
                                <SelectTrigger id="lot-template">
                                    <SelectValue placeholder="Choisir un modele" />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates.map((template) => (
                                        <SelectItem key={template.id} value={template.id.toString()}>
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lot-container">Conteneur *</Label>
                            <Select
                                value={formData.container}
                                onValueChange={(value) => setFormData({ ...formData, container: value })}
                            >
                                <SelectTrigger id="lot-container">
                                    <SelectValue placeholder="Choisir un conteneur" />
                                </SelectTrigger>
                                <SelectContent>
                                    {containers.map((container) => (
                                        <SelectItem key={container.id} value={container.id.toString()}>
                                            {container.identifier}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lot-status">Statut *</Label>
                            <Input
                                id="lot-status"
                                value={formData.status}
                                onChange={(event) => setFormData({ ...formData, status: event.target.value })}
                                placeholder="OK, A verifier..."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="lot-last">Dernier controle</Label>
                                <Input
                                    id="lot-last"
                                    type="datetime-local"
                                    value={formData.last_checked_at}
                                    onChange={(event) => setFormData({ ...formData, last_checked_at: event.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lot-next">Prochain controle</Label>
                                <Input
                                    id="lot-next"
                                    type="datetime-local"
                                    value={formData.next_check_due_at}
                                    onChange={(event) => setFormData({ ...formData, next_check_due_at: event.target.value })}
                                />
                            </div>
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
                                !formData.template ||
                                !formData.container ||
                                !formData.status
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
