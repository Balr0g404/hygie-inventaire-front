"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import {
    IconDotsVertical,
    IconEdit,
    IconPlus,
    IconTrash,
} from "@tabler/icons-react"
import { mutate } from "swr"
import { toast } from "sonner"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    useBatches,
    useItems,
    useLotInstances,
    useStockLines,
    useLotTemplates,
    useContainers,
    useOrganizations,
} from "@/hooks/use-api"
import {
    batchesApi,
    lotInstancesApi,
    stockLinesApi,
    lotTemplatesApi,
} from "@/lib/api/client"
import type { Batch, LotInstance, StockLine, LotTemplate } from "@/lib/api/types"

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { DeleteDialog } from "@/components/dialogs/delete-dialog"
import { BatchDialog } from "@/components/dialogs/batch-dialog"
import { LotInstanceDialog } from "@/components/dialogs/lot-instance-dialog"
import { StockLineDialog } from "@/components/dialogs/stock-line-dialog"
import { LotTemplateDialog } from "@/components/dialogs/lot-template-dialog"

function ActionMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <IconDotsVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={onEdit}>
                    <IconEdit className="size-4" />
                    Modifier
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                    <IconTrash className="size-4" />
                    Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type DeleteTarget =
    | { type: "batch"; item: Batch }
    | { type: "lot-instance"; item: LotInstance }
    | { type: "stock-line"; item: StockLine }
    | { type: "lot-template"; item: LotTemplate }

export default function StockPage() {
    const { data: batches, isLoading: batchesLoading } = useBatches()
    const { data: items, isLoading: itemsLoading } = useItems()
    const { data: lotInstances, isLoading: lotInstancesLoading } = useLotInstances()
    const { data: stockLines, isLoading: stockLinesLoading } = useStockLines()
    const { data: lotTemplates, isLoading: lotTemplatesLoading } = useLotTemplates()
    const { data: containers, isLoading: containersLoading } = useContainers()
    const { data: organizations, isLoading: organizationsLoading } = useOrganizations()

    const isLoading =
        batchesLoading ||
        itemsLoading ||
        lotInstancesLoading ||
        stockLinesLoading ||
        lotTemplatesLoading ||
        containersLoading ||
        organizationsLoading

    const [batchDialogOpen, setBatchDialogOpen] = useState(false)
    const [lotInstanceDialogOpen, setLotInstanceDialogOpen] = useState(false)
    const [stockLineDialogOpen, setStockLineDialogOpen] = useState(false)
    const [lotTemplateDialogOpen, setLotTemplateDialogOpen] = useState(false)

    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
    const [selectedLotInstance, setSelectedLotInstance] = useState<LotInstance | null>(null)
    const [selectedStockLine, setSelectedStockLine] = useState<StockLine | null>(null)
    const [selectedLotTemplate, setSelectedLotTemplate] = useState<LotTemplate | null>(null)

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

    const itemMap = useMemo(
        () => new Map(items?.map((item) => [item.id, item]) || []),
        [items]
    )
    const templateMap = useMemo(
        () => new Map(lotTemplates?.map((template) => [template.id, template]) || []),
        [lotTemplates]
    )
    const containerMap = useMemo(
        () => new Map(containers?.map((container) => [container.id, container]) || []),
        [containers]
    )
    const organizationMap = useMemo(
        () => new Map(organizations?.map((org) => [org.id, org]) || []),
        [organizations]
    )

    const deleteItemName = deleteTarget
        ? deleteTarget.type === "batch"
            ? deleteTarget.item.lot_number || `Lot #${deleteTarget.item.id}`
            : deleteTarget.type === "lot-instance"
                ? `Instance #${deleteTarget.item.id}`
                : deleteTarget.type === "stock-line"
                    ? `Ligne #${deleteTarget.item.id}`
                    : deleteTarget.item.name
        : ""

    const openDeleteDialog = (target: DeleteTarget) => {
        setDeleteTarget(target)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!deleteTarget) return

        try {
            switch (deleteTarget.type) {
                case "batch":
                    await batchesApi.delete(deleteTarget.item.id)
                    await mutate("batches")
                    toast.success("Lot supprime avec succes")
                    break
                case "lot-instance":
                    await lotInstancesApi.delete(deleteTarget.item.id)
                    await mutate("lot-instances")
                    toast.success("Instance de lot supprimee avec succes")
                    break
                case "stock-line":
                    await stockLinesApi.delete(deleteTarget.item.id)
                    await mutate("stock-lines")
                    toast.success("Ligne de stock supprimee avec succes")
                    break
                case "lot-template":
                    await lotTemplatesApi.delete(deleteTarget.item.id)
                    await mutate("lot-templates")
                    toast.success("Modele de lot supprime avec succes")
                    break
                default:
                    break
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression")
            console.error(error)
        } finally {
            setDeleteDialogOpen(false)
            setDeleteTarget(null)
        }
    }

    if (isLoading) {
        return (
            <SidebarProvider
                style={{
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties}
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-7 w-48" />
                                <Skeleton className="h-9 w-32" />
                            </div>
                            <Skeleton className="h-10 w-80" />
                            <div className="space-y-3">
                                {[...Array(5)].map((_, index) => (
                                    <Skeleton key={index} className="h-12 w-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6">
                        <div>
                            <h1 className="text-2xl font-semibold">Gestion du stock</h1>
                            <p className="text-sm text-muted-foreground">
                                Gere les lots, instances et lignes de stock associees.
                            </p>
                        </div>
                        <Tabs defaultValue="batches" className="w-full">
                            <TabsList className="flex flex-wrap">
                                <TabsTrigger value="batches">Lots</TabsTrigger>
                                <TabsTrigger value="lot-instances">Instances de lots</TabsTrigger>
                                <TabsTrigger value="stock-lines">Lignes de stock</TabsTrigger>
                                <TabsTrigger value="lot-templates">Modeles de lots</TabsTrigger>
                            </TabsList>

                            <TabsContent value="batches" className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">Lots</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {batches?.length || 0} lot(s) enregistre(s)
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedBatch(null)
                                            setBatchDialogOpen(true)
                                        }}
                                        disabled={!items?.length}
                                    >
                                        <IconPlus className="size-4" />
                                        Ajouter
                                    </Button>
                                </div>
                                <div className="mt-4 overflow-hidden rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Lot</TableHead>
                                                <TableHead>Article</TableHead>
                                                <TableHead>Peremption</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {batches?.length ? (
                                                batches.map((batch) => (
                                                    <TableRow key={batch.id}>
                                                        <TableCell className="font-medium">
                                                            {batch.lot_number || `Lot #${batch.id}`}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {itemMap.get(batch.item)?.name || "-"}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {batch.expires_at
                                                                ? new Date(batch.expires_at).toLocaleDateString("fr-FR")
                                                                : "N/D"}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <ActionMenu
                                                                onEdit={() => {
                                                                    setSelectedBatch(batch)
                                                                    setBatchDialogOpen(true)
                                                                }}
                                                                onDelete={() =>
                                                                    openDeleteDialog({ type: "batch", item: batch })
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center">
                                                        Aucun lot enregistre.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="lot-instances" className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">Instances de lots</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {lotInstances?.length || 0} instance(s) enregistree(s)
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedLotInstance(null)
                                            setLotInstanceDialogOpen(true)
                                        }}
                                        disabled={!lotTemplates?.length || !containers?.length}
                                    >
                                        <IconPlus className="size-4" />
                                        Ajouter
                                    </Button>
                                </div>
                                <div className="mt-4 overflow-hidden rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Instance</TableHead>
                                                <TableHead>Modele</TableHead>
                                                <TableHead>Conteneur</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>Prochain controle</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {lotInstances?.length ? (
                                                lotInstances.map((instance) => (
                                                    <TableRow key={instance.id}>
                                                        <TableCell className="font-medium">#{instance.id}</TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {templateMap.get(instance.template)?.name || "-"}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {containerMap.get(instance.container)?.identifier || "-"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary">{instance.status}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {instance.next_check_due_at
                                                                ? new Date(instance.next_check_due_at).toLocaleDateString("fr-FR")
                                                                : "N/D"}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <ActionMenu
                                                                onEdit={() => {
                                                                    setSelectedLotInstance(instance)
                                                                    setLotInstanceDialogOpen(true)
                                                                }}
                                                                onDelete={() =>
                                                                    openDeleteDialog({ type: "lot-instance", item: instance })
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-24 text-center">
                                                        Aucune instance enregistree.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="stock-lines" className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">Lignes de stock</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {stockLines?.length || 0} ligne(s) de stock
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedStockLine(null)
                                            setStockLineDialogOpen(true)
                                        }}
                                        disabled={!items?.length || !lotInstances?.length}
                                    >
                                        <IconPlus className="size-4" />
                                        Ajouter
                                    </Button>
                                </div>
                                <div className="mt-4 overflow-hidden rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Article</TableHead>
                                                <TableHead>Quantite</TableHead>
                                                <TableHead>Instance</TableHead>
                                                <TableHead>Lot</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {stockLines?.length ? (
                                                stockLines.map((line) => (
                                                    <TableRow key={line.id}>
                                                        <TableCell className="font-medium">
                                                            {itemMap.get(line.item)?.name || "-"}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {line.quantity}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            #{line.lot_instance}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {line.batch
                                                                ? batches?.find((batch) => batch.id === line.batch)?.lot_number || `#${line.batch}`
                                                                : "-"}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <ActionMenu
                                                                onEdit={() => {
                                                                    setSelectedStockLine(line)
                                                                    setStockLineDialogOpen(true)
                                                                }}
                                                                onDelete={() =>
                                                                    openDeleteDialog({ type: "stock-line", item: line })
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-24 text-center">
                                                        Aucune ligne de stock enregistree.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="lot-templates" className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">Modeles de lots</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {lotTemplates?.length || 0} modele(s) enregistre(s)
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedLotTemplate(null)
                                            setLotTemplateDialogOpen(true)
                                        }}
                                        disabled={!organizations?.length}
                                    >
                                        <IconPlus className="size-4" />
                                        Ajouter
                                    </Button>
                                </div>
                                <div className="mt-4 overflow-hidden rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nom</TableHead>
                                                <TableHead>Code</TableHead>
                                                <TableHead>Organisation</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {lotTemplates?.length ? (
                                                lotTemplates.map((template) => (
                                                    <TableRow key={template.id}>
                                                        <TableCell className="font-medium">{template.name}</TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {template.code}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {organizationMap.get(template.organization)?.name || "-"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={template.is_active ? "default" : "secondary"}>
                                                                {template.is_active ? "Actif" : "Inactif"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <ActionMenu
                                                                onEdit={() => {
                                                                    setSelectedLotTemplate(template)
                                                                    setLotTemplateDialogOpen(true)
                                                                }}
                                                                onDelete={() =>
                                                                    openDeleteDialog({ type: "lot-template", item: template })
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-24 text-center">
                                                        Aucun modele de lot enregistre.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <BatchDialog
                    open={batchDialogOpen}
                    onOpenChange={setBatchDialogOpen}
                    batch={selectedBatch}
                    items={items || []}
                />
                <LotInstanceDialog
                    open={lotInstanceDialogOpen}
                    onOpenChange={setLotInstanceDialogOpen}
                    lotInstance={selectedLotInstance}
                    templates={lotTemplates || []}
                    containers={containers || []}
                />
                <StockLineDialog
                    open={stockLineDialogOpen}
                    onOpenChange={setStockLineDialogOpen}
                    stockLine={selectedStockLine}
                    items={items || []}
                    lotInstances={lotInstances || []}
                    batches={batches || []}
                />
                <LotTemplateDialog
                    open={lotTemplateDialogOpen}
                    onOpenChange={setLotTemplateDialogOpen}
                    template={selectedLotTemplate}
                    organizations={organizations || []}
                />

                <DeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    title="Supprimer"
                    description="Cette action est irreversible."
                    itemName={deleteItemName}
                    onConfirm={confirmDelete}
                />
            </SidebarInset>
        </SidebarProvider>
    )
}
