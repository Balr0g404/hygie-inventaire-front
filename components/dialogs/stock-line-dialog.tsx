"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { mutate } from "swr"
import { toast } from "sonner"

import { stockLinesApi } from "@/lib/api/client"
import type { Batch, Item, LotInstance, StockLine } from "@/lib/api/types"
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

interface StockLineDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    stockLine?: StockLine | null
    items: Item[]
    lotInstances: LotInstance[]
    batches: Batch[]
}

export function StockLineDialog({
    open,
    onOpenChange,
    stockLine,
    items,
    lotInstances,
    batches,
}: StockLineDialogProps) {
    const isEditing = !!stockLine
    const [formData, setFormData] = useState({
        item: "",
        lot_instance: "",
        batch: "",
        quantity: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (stockLine) {
            setFormData({
                item: stockLine.item.toString(),
                lot_instance: stockLine.lot_instance.toString(),
                batch: stockLine.batch ? stockLine.batch.toString() : "",
                quantity: stockLine.quantity,
            })
        } else {
            setFormData({
                item: items[0]?.id.toString() || "",
                lot_instance: lotInstances[0]?.id.toString() || "",
                batch: "",
                quantity: "",
            })
        }
    }, [stockLine, items, lotInstances, open])

    const availableBatches = useMemo(() => {
        if (!formData.item) return batches
        const selectedItemId = parseInt(formData.item)
        return batches.filter((batch) => batch.item === selectedItemId)
    }, [batches, formData.item])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const payload = {
                item: parseInt(formData.item),
                lot_instance: parseInt(formData.lot_instance),
                batch: formData.batch ? parseInt(formData.batch) : null,
                quantity: formData.quantity,
            }

            if (isEditing && stockLine) {
                await stockLinesApi.update(stockLine.id, payload)
                toast.success("Ligne de stock mise a jour avec succes")
            } else {
                await stockLinesApi.create(payload as Omit<StockLine, "id">)
                toast.success("Ligne de stock creee avec succes")
            }
            await mutate("stock-lines")
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
                        <DialogTitle>{isEditing ? "Modifier la ligne de stock" : "Nouvelle ligne de stock"}</DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Modifiez les informations de la ligne de stock."
                                : "Renseignez les informations pour creer une ligne de stock."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="stock-item">Article *</Label>
                            <Select
                                value={formData.item}
                                onValueChange={(value) => setFormData({ ...formData, item: value, batch: "" })}
                            >
                                <SelectTrigger id="stock-item">
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
                            <Label htmlFor="stock-lot-instance">Instance de lot *</Label>
                            <Select
                                value={formData.lot_instance}
                                onValueChange={(value) => setFormData({ ...formData, lot_instance: value })}
                            >
                                <SelectTrigger id="stock-lot-instance">
                                    <SelectValue placeholder="Choisir une instance" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lotInstances.map((instance) => (
                                        <SelectItem key={instance.id} value={instance.id.toString()}>
                                            #{instance.id} - {instance.status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="stock-batch">Lot / Serie</Label>
                            <Select
                                value={formData.batch}
                                onValueChange={(value) => setFormData({ ...formData, batch: value })}
                            >
                                <SelectTrigger id="stock-batch">
                                    <SelectValue placeholder="Aucun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableBatches.map((batch) => (
                                        <SelectItem key={batch.id} value={batch.id.toString()}>
                                            {batch.lot_number || `Lot #${batch.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="stock-quantity">Quantite *</Label>
                            <Input
                                id="stock-quantity"
                                type="number"
                                step="0.01"
                                value={formData.quantity}
                                onChange={(event) => setFormData({ ...formData, quantity: event.target.value })}
                                placeholder="0"
                                required
                            />
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
                                !formData.item ||
                                !formData.lot_instance ||
                                !formData.quantity
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
