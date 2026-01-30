"use client"

import * as React from "react"
import { useState } from "react"
import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface DeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    itemName: string
    onConfirm: () => Promise<void>
}

export function DeleteDialog({
                                 open,
                                 onOpenChange,
                                 title,
                                 description,
                                 itemName,
                                 onConfirm,
                             }: DeleteDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleConfirm = async () => {
        setIsLoading(true)
        try {
            await onConfirm()
            onOpenChange(false)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[oklch(0.55_0.2_25)]/10">
                            <IconAlertTriangle className="size-5 text-[oklch(0.55_0.2_25)]" />
                        </div>
                        <div>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription className="mt-1">{description}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Vous etes sur le point de supprimer{" "}
                        <span className="font-medium text-foreground">{itemName}</span>.
                        Cette action est irreversible.
                    </p>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading && <IconLoader2 className="size-4 animate-spin" />}
                        Supprimer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
