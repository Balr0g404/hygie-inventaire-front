"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { mutate } from "swr"
import { toast } from "sonner"

import { batchesApi } from "@/lib/api/client"
import type { Batch, Item } from "@/lib/api/types"
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

interface BatchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    batch?: Batch | null
    items: Item[]
}

export function BatchDialog({ open, onOpenChange, batch, items }: BatchDialogProps) {
    const isEditing = !!batch
    const [formData, setFormData] = useState({
        item: "",
        lot_number: "",
        expires_at: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (batch) {
            setFormData({
                item: batch.item.toString(),
                lot_number: batch.lot_number || "",
                expires_at: batch.expires_at || "",
            })
        } else {
            setFormData({
                item: items[0]?.id.toString() || "",
                lot_number: "",
                expires_at: "",
            })
        }
    }, [batch, items, open])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const payload = {
                item: parseInt(formData.item),
                lot_number: formData.lot_number,
                expires_at: formData.expires_at ? formData.expires_at : null,
            }

            if (isEditing && batch) {
                await batchesApi.update(batch.id, payload)
                toast.success("Lot mis a jour avec succes")
            } else {
                await batchesApi.create(payload as Omit<Batch, "id">)
                toast.success("Lot cree avec succes")
            }
            await mutate("batches")
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
                        <DialogTitle>{isEditing ? "Modifier le lot" : "Nouveau lot"}</DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Modifiez les informations du lot."
                                : "Renseignez les informations pour creer un lot."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="batch-item">Article *</Label>
                            <Select
                                value={formData.item}
                                onValueChange={(value) => setFormData({ ...formData, item: value })}
                            >
                                <SelectTrigger id="batch-item">
                                    <SelectValue placeholder="Choisir un article" />
                                </SelectTrigger>
                                <SelectContent>
                                    {items.map((item) => (
                                        <SelectItem key={item.id} value={item.id.toString()}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="batch-lot">Numero de lot *</Label>
                            <Input
                                id="batch-lot"
                                value={formData.lot_number}
                                onChange={(event) => setFormData({ ...formData, lot_number: event.target.value })}
                                placeholder="Ex: LOT-2024-001"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="batch-expiry">Date de peremption</Label>
                            <Input
                                id="batch-expiry"
                                type="date"
                                value={formData.expires_at}
                                onChange={(event) => setFormData({ ...formData, expires_at: event.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.item || !formData.lot_number}>
                            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
                            {isEditing ? "Enregistrer" : "Creer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
