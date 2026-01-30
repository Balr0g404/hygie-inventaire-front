"use client"

import * as React from "react"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconDotsVertical,
    IconEdit,
    IconEye,
    IconLayoutColumns,
    IconPlus,
    IconSearch,
    IconTrash,
    IconTruckDelivery,
} from "@tabler/icons-react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table"
import { mutate } from "swr"
import { toast } from "sonner"
import { useItems, useBatches, useStockLines, useSites, useLocations, useLotInstances, useContainers, useStructures } from "@/hooks/use-api"
import { itemsApi } from "@/lib/api/client"
import type { Item } from "@/lib/api/types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ItemDialog } from "@/components/dialogs/item-dialog"
import { DeleteDialog } from "@/components/dialogs/delete-dialog"
import { MovementDialog } from "@/components/dialogs/movement-dialog"

type EnrichedInventoryItem = {
    id: number
    name: string
    category: string
    location: string
    quantity: number
    unit: string
    lot: string
    expiry: string
    status: string
    originalItem: Item
}

function getStatusColor(status: string) {
    switch (status) {
        case "En stock":
            return "bg-[oklch(0.6_0.15_145)] text-white"
        case "Stock bas":
            return "bg-[oklch(0.75_0.15_75)] text-[oklch(0.25_0.05_75)]"
        case "Expiration proche":
            return "bg-[oklch(0.75_0.15_75)] text-[oklch(0.25_0.05_75)]"
        case "Perime":
            return "bg-[oklch(0.55_0.2_25)] text-white"
        case "Rupture":
            return "bg-[oklch(0.55_0.2_25)] text-white"
        default:
            return ""
    }
}

const columnLabels: Record<string, string> = {
    name: "Nom de l'article",
    category: "Categorie",
    location: "Emplacement",
    quantity: "Quantite",
    lot: "Lot/Serie",
    expiry: "Peremption",
    status: "Statut",
    actions: "Actions",
}

export function InventoryTableApi() {
    const { data: items, isLoading: itemsLoading } = useItems()
    const { data: batches, isLoading: batchesLoading } = useBatches()
    const { data: stockLines, isLoading: stockLinesLoading } = useStockLines()
    const { data: sites, isLoading: sitesLoading } = useSites()
    const { data: locations, isLoading: locationsLoading } = useLocations()
    const { data: lotInstances, isLoading: lotInstancesLoading } = useLotInstances()
    const { data: containers, isLoading: containersLoading } = useContainers()
    const { data: structures } = useStructures()

    const isLoading = itemsLoading || batchesLoading || stockLinesLoading || sitesLoading || locationsLoading || lotInstancesLoading || containersLoading

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })

    // Dialog states
    const [itemDialogOpen, setItemDialogOpen] = React.useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [movementDialogOpen, setMovementDialogOpen] = React.useState(false)
    const [detailSheetOpen, setDetailSheetOpen] = React.useState(false)
    const [selectedItem, setSelectedItem] = React.useState<EnrichedInventoryItem | null>(null)

    // Get first organization/structure ID (simplified - in real app would come from context)
    const organizationId = items?.[0]?.organization || 1
    const structureId = structures?.[0]?.id || 1

    // Build enriched inventory data
    const enrichedData = React.useMemo<EnrichedInventoryItem[]>(() => {
        if (!items) return []

        const batchMap = new Map(batches?.map(b => [b.id, b]) || [])
        const stockLinesByItem = new Map<number, typeof stockLines>()
        const lotInstanceMap = new Map(lotInstances?.map(li => [li.id, li]) || [])
        const containerMap = new Map(containers?.map(c => [c.id, c]) || [])
        const locationMap = new Map(locations?.map(l => [l.id, l]) || [])
        const siteMap = new Map(sites?.map(s => [s.id, s]) || [])

        // Group stock lines by item
        stockLines?.forEach(sl => {
            const existing = stockLinesByItem.get(sl.item) || []
            existing.push(sl)
            stockLinesByItem.set(sl.item, existing)
        })

        const today = new Date()
        const ninetyDaysFromNow = new Date()
        ninetyDaysFromNow.setDate(today.getDate() + 90)

        return items.map(item => {
            const itemStockLines = stockLinesByItem.get(item.id) || []
            const totalQuantity = itemStockLines.reduce((sum, sl) => sum + parseFloat(sl.quantity), 0)

            // Get batch info for expiry date
            let earliestExpiry: string | null = null
            let lotNumber = ""

            for (const sl of itemStockLines) {
                if (sl.batch) {
                    const batch = batchMap.get(sl.batch)
                    if (batch) {
                        lotNumber = batch.lot_number || lotNumber
                        if (batch.expires_at) {
                            if (!earliestExpiry || batch.expires_at < earliestExpiry) {
                                earliestExpiry = batch.expires_at
                            }
                        }
                    }
                }
            }

            // Determine location from first stock line
            let locationName = "Non assigne"
            if (itemStockLines.length > 0) {
                const firstLine = itemStockLines[0]
                const lotInstance = lotInstanceMap.get(firstLine.lot_instance)
                if (lotInstance) {
                    const container = containerMap.get(lotInstance.container)
                    if (container?.location) {
                        const location = locationMap.get(container.location)
                        if (location) {
                            const site = siteMap.get(location.site)
                            locationName = site ? `${site.name} - ${location.name}` : location.name
                        }
                    }
                }
            }

            // Determine status
            let status = "En stock"
            if (totalQuantity === 0) {
                status = "Rupture"
            } else if (earliestExpiry) {
                const expiryDate = new Date(earliestExpiry)
                if (expiryDate < today) {
                    status = "Perime"
                } else if (expiryDate <= ninetyDaysFromNow) {
                    status = "Expiration proche"
                }
            }

            return {
                id: item.id,
                name: item.name,
                category: item.category,
                location: locationName,
                quantity: totalQuantity,
                unit: item.unit || "u.",
                lot: lotNumber,
                expiry: earliestExpiry || "N/D",
                status,
                originalItem: item,
            }
        })
    }, [items, batches, stockLines, sites, locations, lotInstances, containers])

    // Action handlers
    const handleViewDetails = (item: EnrichedInventoryItem) => {
        setSelectedItem(item)
        setDetailSheetOpen(true)
    }

    const handleEditItem = (item: EnrichedInventoryItem) => {
        setSelectedItem(item)
        setItemDialogOpen(true)
    }

    const handleDeleteItem = (item: EnrichedInventoryItem) => {
        setSelectedItem(item)
        setDeleteDialogOpen(true)
    }

    const handleAddMovement = (item: EnrichedInventoryItem) => {
        setSelectedItem(item)
        setMovementDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!selectedItem) return
        try {
            await itemsApi.delete(selectedItem.id)
            await mutate("items")
            toast.success("Article supprime avec succes")
        } catch (error) {
            toast.error("Erreur lors de la suppression")
            console.error(error)
        }
    }

    const columns: ColumnDef<EnrichedInventoryItem>[] = [
        {
            accessorKey: "name",
            header: "Nom de l'article",
            cell: ({ row }) => (
                <div className="font-medium">{row.original.name}</div>
            ),
            enableHiding: false,
        },
        {
            accessorKey: "category",
            header: "Categorie",
            cell: ({ row }) => (
                <Badge variant="outline" className="text-muted-foreground">
                    {row.original.category || "Non categorise"}
                </Badge>
            ),
        },
        {
            accessorKey: "location",
            header: "Emplacement",
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.original.location}</span>
            ),
        },
        {
            accessorKey: "quantity",
            header: () => <div className="text-right">Qte</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-right font-medium tabular-nums">
                        {row.original.quantity} {row.original.unit}
                    </div>
                )
            },
        },
        {
            accessorKey: "lot",
            header: "Lot/Serie",
            cell: ({ row }) => (
                <span className="font-mono text-xs text-muted-foreground">
          {row.original.lot || "N/D"}
        </span>
            ),
        },
        {
            accessorKey: "expiry",
            header: "Peremption",
            cell: ({ row }) => {
                const expiry = row.original.expiry
                if (!expiry || expiry === "N/D" || expiry === "N/A") {
                    return <span className="text-muted-foreground">N/D</span>
                }
                const expiryDate = new Date(expiry)
                const today = new Date()
                const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                const isExpired = daysUntilExpiry < 0
                const isExpiringSoon = daysUntilExpiry >= 0 && daysUntilExpiry <= 90

                return (
                    <span className={`tabular-nums ${isExpired ? "text-[oklch(0.55_0.2_25)] font-medium" : isExpiringSoon ? "text-[oklch(0.65_0.15_75)] font-medium" : "text-muted-foreground"}`}>
            {expiryDate.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" })}
          </span>
                )
            },
        },
        {
            accessorKey: "status",
            header: "Statut",
            cell: ({ row }) => (
                <Badge className={getStatusColor(row.original.status)}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                            size="icon"
                        >
                            <IconDotsVertical />
                            <span className="sr-only">Ouvrir le menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleViewDetails(row.original)}>
                            <IconEye className="size-4" />
                            Voir les details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditItem(row.original)}>
                            <IconEdit className="size-4" />
                            Modifier l'article
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddMovement(row.original)}>
                            <IconTruckDelivery className="size-4" />
                            Enregistrer un mouvement
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDeleteItem(row.original)}
                        >
                            <IconTrash className="size-4" />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]

    const table = useReactTable({
        data: enrichedData,
        columns,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            pagination,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 px-4 lg:px-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-72" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                </div>
                <div className="overflow-hidden rounded-lg border">
                    <div className="p-4 space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col gap-4 px-4 lg:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:w-72">
                        <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher l'inventaire..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select
                            value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                            onValueChange={(value) =>
                                table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger className="w-[140px]" size="sm">
                                <SelectValue placeholder="Tous les statuts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="En stock">En stock</SelectItem>
                                <SelectItem value="Stock bas">Stock bas</SelectItem>
                                <SelectItem value="Expiration proche">Expiration proche</SelectItem>
                                <SelectItem value="Perime">Perime</SelectItem>
                                <SelectItem value="Rupture">Rupture</SelectItem>
                            </SelectContent>
                        </Select>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <IconLayoutColumns />
                                    <span className="hidden lg:inline">Colonnes</span>
                                    <IconChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {columnLabels[column.id] ?? column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="sm" onClick={() => { setSelectedItem(null); setItemDialogOpen(true); }}>
                            <IconPlus />
                            <span className="hidden lg:inline">Ajouter un article</span>
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Aucun resultat.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-muted-foreground hidden text-sm lg:block">
                        Affichage de {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}{" "}
                        sur {table.getFilteredRowModel().rows.length} articles
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Lignes par page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => table.setPageSize(Number(value))}
                            >
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount() || 1}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Aller a la premiere page</span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8 bg-transparent"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Aller a la page precedente</span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8 bg-transparent"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Aller a la page suivante</span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex bg-transparent"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Aller a la derniere page</span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Item Create/Edit Dialog */}
            <ItemDialog
                open={itemDialogOpen}
                onOpenChange={setItemDialogOpen}
                item={selectedItem?.originalItem}
                organizationId={organizationId}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Supprimer l'article"
                description="Cette action est irreversible."
                itemName={selectedItem?.name || ""}
                onConfirm={confirmDelete}
            />

            {/* Movement Dialog */}
            <MovementDialog
                open={movementDialogOpen}
                onOpenChange={setMovementDialogOpen}
                structureId={structureId}
                items={selectedItem ? [selectedItem.originalItem] : items || []}
                lotInstances={lotInstances || []}
                batches={batches || []}
            />

            {/* Detail Sheet */}
            <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{selectedItem?.name}</SheetTitle>
                        <SheetDescription>Details de l'article</SheetDescription>
                    </SheetHeader>
                    {selectedItem && (
                        <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Categorie</p>
                                    <p className="font-medium">{selectedItem.category || "Non categorise"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Statut</p>
                                    <Badge className={getStatusColor(selectedItem.status)}>{selectedItem.status}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Quantite en stock</p>
                                    <p className="font-medium">{selectedItem.quantity} {selectedItem.unit}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Emplacement</p>
                                    <p className="font-medium">{selectedItem.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Numero de lot</p>
                                    <p className="font-medium font-mono">{selectedItem.lot || "N/D"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Date de peremption</p>
                                    <p className="font-medium">
                                        {selectedItem.expiry && selectedItem.expiry !== "N/D"
                                            ? new Date(selectedItem.expiry).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })
                                            : "N/D"}
                                    </p>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-2">
                                <Button
                                    className="flex-1"
                                    onClick={() => { setDetailSheetOpen(false); handleEditItem(selectedItem); }}
                                >
                                    <IconEdit className="size-4" />
                                    Modifier
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 bg-transparent"
                                    onClick={() => { setDetailSheetOpen(false); handleAddMovement(selectedItem); }}
                                >
                                    <IconTruckDelivery className="size-4" />
                                    Mouvement
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
