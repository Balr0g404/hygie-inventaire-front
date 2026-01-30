"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { mutate } from "swr"
import { toast } from "sonner"

import { stockMovementsApi } from "@/lib/api/client"
import type { StockMovement, StockMovementRequest, StockMovementType, Item, LotInstance, Batch } from "@/lib/api/types"
import { StockMovementTypeLabels } from "@/lib/api/types"
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
import { Textarea } from "@/components/ui/textarea"

interface MovementDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    movement?: StockMovement | null
    structureId: number
    items: Item[]
    lotInstances: LotInstance[]
    batches: Batch[]
}

const MOVEMENT_TYPES: StockMovementType[] = ["IN", "OUT", "TRANSFER", "ADJUST", "CONSUME", "RESTOCK"]

export function MovementDialog({
                                   open,
                                   onOpenChange,
                                   movement,
                                   structureId,
                                   items,
                                   lotInstances,
                                   batches,
                               }: MovementDialogProps) {
    const isEditing = !!movement

    const [formData, setFormData] = useState<{
        type: StockMovementType
        item: string
        batch: string
        from_lot: string
        to_lot: string
        quantity: string
        reason: string
    }>({
        type: "IN",
        item: "",
        batch: "",
        from_lot: "",
        to_lot: "",
        quantity: "",
        reason: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (movement) {
            setFormData({
                type: movement.type,
                item: movement.item.toString(),
                batch: movement.batch?.toString() || "",
                from_lot: movement.from_lot?.toString() || "",
                to_lot: movement.to_lot?.toString() || "",
                quantity: movement.quantity,
                reason: movement.reason || "",
            })
        } else {
            setFormData({
                type: "IN",
                item: "",
                batch: "",
                from_lot: "",
                to_lot: "",
                quantity: "",
                reason: "",
            })
        }
    }, [movement, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const requestData: StockMovementRequest = {
                structure: structureId,
                type: formData.type,
                item: parseInt(formData.item),
                quantity: formData.quantity,
                reason: formData.reason,
                batch: formData.batch ? parseInt(formData.batch) : null,
                from_lot: formData.from_lot ? parseInt(formData.from_lot) : null,
                to_lot: formData.to_lot ? parseInt(formData.to_lot) : null,
            }

            if (isEditing && movement) {
                await stockMovementsApi.update(movement.id, requestData)
                toast.success("Mouvement mis a jour avec succes")
            } else {
                await stockMovementsApi.create(requestData)
                toast.success("Mouvement enregistre avec succes")
            }
            await mutate("stock-movements")
            await mutate("stock-lines")
            onOpenChange(false)
        } catch (error) {
            toast.error(isEditing ? "Erreur lors de la mise a jour" : "Erreur lors de l'enregistrement")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    // Filter batches for selected item
    const itemBatches = formData.item
        ? batches.filter((b) => b.item === parseInt(formData.item))
        : []

    // Show lot fields based on movement type
    const showFromLot = ["OUT", "TRANSFER", "CONSUME"].includes(formData.type)
    const showToLot = ["IN", "TRANSFER", "RESTOCK"].includes(formData.type)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Modifier le mouvement" : "Nouveau mouvement de stock"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Modifiez les informations du mouvement ci-dessous."
                                : "Enregistrez une entree, sortie, transfert ou ajustement de stock."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type de mouvement *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value as StockMovementType })}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Choisir un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOVEMENT_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {StockMovementTypeLabels[type]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="item">Article *</Label>
                            <Select
                                value={formData.item}
                                onValueChange={(value) => setFormData({ ...formData, item: value, batch: "" })}
                            >
                                <SelectTrigger id="item">
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
                        {itemBatches.length > 0 && (
                            <div className="grid gap-2">
                                <Label htmlFor="batch">Lot / Numero de serie</Label>
                                <Select
                                    value={formData.batch}
                                    onValueChange={(value) => setFormData({ ...formData, batch: value })}
                                >
                                    <SelectTrigger id="batch">
                                        <SelectValue placeholder="Choisir un lot (optionnel)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Aucun lot</SelectItem>
                                        {itemBatches.map((batch) => (
                                            <SelectItem key={batch.id} value={batch.id.toString()}>
                                                {batch.lot_number}
                                                {batch.expires_at && ` (exp: ${new Date(batch.expires_at).toLocaleDateString("fr-FR")})`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            {showFromLot && (
                                <div className="grid gap-2">
                                    <Label htmlFor="from_lot">Lot source</Label>
                                    <Select
                                        value={formData.from_lot}
                                        onValueChange={(value) => setFormData({ ...formData, from_lot: value })}
                                    >
                                        <SelectTrigger id="from_lot">
                                            <SelectValue placeholder="Lot source" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Non specifie</SelectItem>
                                            {lotInstances.map((lot) => (
                                                <SelectItem key={lot.id} value={lot.id.toString()}>
                                                    Lot #{lot.id}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            {showToLot && (
                                <div className="grid gap-2">
                                    <Label htmlFor="to_lot">Lot destination</Label>
                                    <Select
                                        value={formData.to_lot}
                                        onValueChange={(value) => setFormData({ ...formData, to_lot: value })}
                                    >
                                        <SelectTrigger id="to_lot">
                                            <SelectValue placeholder="Lot destination" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Non specifie</SelectItem>
                                            {lotInstances.map((lot) => (
                                                <SelectItem key={lot.id} value={lot.id.toString()}>
                                                    Lot #{lot.id}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantite *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                placeholder="Ex: 10"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Motif / Commentaire</Label>
                            <Textarea
                                id="reason"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="Ex: Reception commande #1234, Mission DPS..."
                                rows={2}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.item || !formData.quantity}>
                            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
                            {isEditing ? "Enregistrer" : "Creer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
