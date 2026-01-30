"use client"

import * as React from "react"
import {
    IconArrowDown,
    IconArrowRight,
    IconArrowUp,
    IconArrowsExchange,
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
    IconRefresh,
    IconSearch,
    IconTrash,
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
import { useStockMovements, useItems, useUsers, useLotInstances, useBatches, useStructures } from "@/hooks/use-api"
import { stockMovementsApi } from "@/lib/api/client"
import type { StockMovement, StockMovementType } from "@/lib/api/types"

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
import { MovementDialog } from "@/components/dialogs/movement-dialog"
import { DeleteDialog } from "@/components/dialogs/delete-dialog"

type EnrichedMovement = {
    id: number
    type: string
    typeCode: StockMovementType
    item: string
    itemId: number
    quantity: number
    unit: string
    from: string
    to: string
    date: string
    operator: string
    reason: string
    originalMovement: StockMovement
}

const typeLabels: Record<StockMovementType, string> = {
    IN: "Entree",
    OUT: "Sortie",
    TRANSFER: "Transfert",
    ADJUST: "Ajustement",
    CONSUME: "Consommation",
    RESTOCK: "Reassort",
}

function getTypeIcon(typeCode: StockMovementType) {
    switch (typeCode) {
        case "IN":
        case "RESTOCK":
            return <IconArrowDown className="size-4 text-[oklch(0.6_0.15_145)]" />
        case "OUT":
        case "CONSUME":
            return <IconArrowUp className="size-4 text-[oklch(0.55_0.2_25)]" />
        case "TRANSFER":
            return <IconArrowsExchange className="size-4 text-primary" />
        case "ADJUST":
            return <IconRefresh className="size-4 text-[oklch(0.65_0.15_75)]" />
        default:
            return null
    }
}

function getTypeBadgeColor(typeCode: StockMovementType) {
    switch (typeCode) {
        case "IN":
        case "RESTOCK":
            return "bg-[oklch(0.6_0.15_145)]/10 text-[oklch(0.5_0.15_145)] border-[oklch(0.6_0.15_145)]/20"
        case "OUT":
        case "CONSUME":
            return "bg-[oklch(0.55_0.2_25)]/10 text-[oklch(0.45_0.2_25)] border-[oklch(0.55_0.2_25)]/20"
        case "TRANSFER":
            return "bg-primary/10 text-primary border-primary/20"
        case "ADJUST":
            return "bg-[oklch(0.65_0.15_75)]/10 text-[oklch(0.55_0.15_75)] border-[oklch(0.65_0.15_75)]/20"
        default:
            return ""
    }
}

const columnLabels: Record<string, string> = {
    type: "Type",
    item: "Article",
    quantity: "Quantite",
    from: "De",
    arrow: "Sens",
    to: "Vers",
    date: "Date",
    operator: "Operateur",
    reason: "Motif",
    actions: "Actions",
}

export function MovementsTableApi() {
    const { data: movements, isLoading: movementsLoading } = useStockMovements()
    const { data: items, isLoading: itemsLoading } = useItems()
    const { data: users, isLoading: usersLoading } = useUsers()
    const { data: lotInstances, isLoading: lotInstancesLoading } = useLotInstances()
    const { data: batches, isLoading: batchesLoading } = useBatches()
    const { data: structures } = useStructures()

    const isLoading = movementsLoading || itemsLoading || usersLoading || lotInstancesLoading || batchesLoading

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })

    // Dialog states
    const [movementDialogOpen, setMovementDialogOpen] = React.useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [detailSheetOpen, setDetailSheetOpen] = React.useState(false)
    const [selectedMovement, setSelectedMovement] = React.useState<EnrichedMovement | null>(null)

    // Get first structure ID (simplified - in real app would come from context)
    const structureId = structures?.[0]?.id || 1

    // Build enriched movement data
    const enrichedData = React.useMemo<EnrichedMovement[]>(() => {
        if (!movements) return []

        const itemMap = new Map(items?.map(i => [i.id, i]) || [])
        const userMap = new Map(users?.map(u => [u.id, u]) || [])
        const lotInstanceMap = new Map(lotInstances?.map(li => [li.id, li]) || [])

        return movements.map(movement => {
            const item = itemMap.get(movement.item)
            const user = movement.created_by ? userMap.get(movement.created_by) : null
            const fromLot = movement.from_lot ? lotInstanceMap.get(movement.from_lot) : null
            const toLot = movement.to_lot ? lotInstanceMap.get(movement.to_lot) : null

            return {
                id: movement.id,
                type: typeLabels[movement.type],
                typeCode: movement.type,
                item: item?.name || `Article #${movement.item}`,
                itemId: movement.item,
                quantity: parseFloat(movement.quantity),
                unit: item?.unit || "u.",
                from: fromLot ? `Lot #${fromLot.id}` : (movement.type === "IN" ? "Fournisseur" : "-"),
                to: toLot ? `Lot #${toLot.id}` : (movement.type === "OUT" || movement.type === "CONSUME" ? "Consomme" : "-"),
                date: movement.created_at,
                operator: user?.full_name || user?.email || "Systeme",
                reason: movement.reason,
                originalMovement: movement,
            }
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }, [movements, items, users, lotInstances])

    // Action handlers
    const handleViewDetails = (movement: EnrichedMovement) => {
        setSelectedMovement(movement)
        setDetailSheetOpen(true)
    }

    const handleEditMovement = (movement: EnrichedMovement) => {
        setSelectedMovement(movement)
        setMovementDialogOpen(true)
    }

    const handleDeleteMovement = (movement: EnrichedMovement) => {
        setSelectedMovement(movement)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!selectedMovement) return
        try {
            await stockMovementsApi.delete(selectedMovement.id)
            await mutate("stock-movements")
            await mutate("stock-lines")
            toast.success("Mouvement supprime avec succes")
        } catch (error) {
            toast.error("Erreur lors de la suppression")
            console.error(error)
        }
    }

    const columns: ColumnDef<EnrichedMovement>[] = [
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {getTypeIcon(row.original.typeCode)}
                    <Badge variant="outline" className={getTypeBadgeColor(row.original.typeCode)}>
                        {row.original.type}
                    </Badge>
                </div>
            ),
            enableHiding: false,
        },
        {
            accessorKey: "item",
            header: "Article",
            cell: ({ row }) => (
                <div className="font-medium">{row.original.item}</div>
            ),
        },
        {
            accessorKey: "quantity",
            header: () => <div className="text-right">Qte</div>,
            cell: ({ row }) => {
                const isOut = row.original.typeCode === "OUT" || row.original.typeCode === "CONSUME"
                return (
                    <div className="text-right font-medium tabular-nums">
                        {isOut ? "-" : "+"}{row.original.quantity} {row.original.unit}
                    </div>
                )
            },
        },
        {
            accessorKey: "from",
            header: "De",
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.original.from || "-"}</span>
            ),
        },
        {
            id: "arrow",
            cell: () => <IconArrowRight className="size-4 text-muted-foreground" />,
        },
        {
            accessorKey: "to",
            header: "Vers",
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.original.to || "-"}</span>
            ),
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => {
                const date = new Date(row.original.date)
                return (
                    <div className="flex flex-col">
            <span className="tabular-nums">
              {date.toLocaleDateString("fr-FR", { month: "short", day: "numeric" })}
            </span>
                        <span className="text-xs text-muted-foreground tabular-nums">
              {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </span>
                    </div>
                )
            },
        },
        {
            accessorKey: "operator",
            header: "Operateur",
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.original.operator}</span>
            ),
        },
        {
            accessorKey: "reason",
            header: "Motif",
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground truncate max-w-[150px] block">
          {row.original.reason || "-"}
        </span>
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
                        <DropdownMenuItem onClick={() => handleEditMovement(row.original)}>
                            <IconEdit className="size-4" />
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDeleteMovement(row.original)}
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
                            placeholder="Rechercher les mouvements..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select
                            value={(table.getColumn("type")?.getFilterValue() as string) ?? "all"}
                            onValueChange={(value) =>
                                table.getColumn("type")?.setFilterValue(value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger className="w-[140px]" size="sm">
                                <SelectValue placeholder="Tous les types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                <SelectItem value="Entree">Entree</SelectItem>
                                <SelectItem value="Sortie">Sortie</SelectItem>
                                <SelectItem value="Consommation">Consommation</SelectItem>
                                <SelectItem value="Transfert">Transfert</SelectItem>
                                <SelectItem value="Reassort">Reassort</SelectItem>
                                <SelectItem value="Ajustement">Ajustement</SelectItem>
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
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {columnLabels[column.id] ?? column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            size="sm"
                            onClick={() => { setSelectedMovement(null); setMovementDialogOpen(true); }}
                        >
                            <IconPlus />
                            <span className="hidden lg:inline">Nouveau mouvement</span>
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
                                        Aucun mouvement trouve.
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
                        sur {table.getFilteredRowModel().rows.length} mouvements
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

            {/* Movement Create/Edit Dialog */}
            <MovementDialog
                open={movementDialogOpen}
                onOpenChange={setMovementDialogOpen}
                movement={selectedMovement?.originalMovement}
                structureId={structureId}
                items={items || []}
                lotInstances={lotInstances || []}
                batches={batches || []}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Supprimer le mouvement"
                description="Cette action est irreversible."
                itemName={`${selectedMovement?.type} - ${selectedMovement?.item}`}
                onConfirm={confirmDelete}
            />

            {/* Detail Sheet */}
            <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            {selectedMovement && getTypeIcon(selectedMovement.typeCode)}
                            {selectedMovement?.type}
                        </SheetTitle>
                        <SheetDescription>Details du mouvement de stock</SheetDescription>
                    </SheetHeader>
                    {selectedMovement && (
                        <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Article</p>
                                    <p className="font-medium">{selectedMovement.item}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Quantite</p>
                                    <p className="font-medium tabular-nums">
                                        {selectedMovement.typeCode === "OUT" || selectedMovement.typeCode === "CONSUME" ? "-" : "+"}
                                        {selectedMovement.quantity} {selectedMovement.unit}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">De</p>
                                    <p className="font-medium">{selectedMovement.from}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Vers</p>
                                    <p className="font-medium">{selectedMovement.to}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Date</p>
                                    <p className="font-medium">
                                        {new Date(selectedMovement.date).toLocaleDateString("fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Operateur</p>
                                    <p className="font-medium">{selectedMovement.operator}</p>
                                </div>
                            </div>
                            {selectedMovement.reason && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Motif</p>
                                    <p className="font-medium">{selectedMovement.reason}</p>
                                </div>
                            )}
                            <div className="pt-4 flex gap-2">
                                <Button
                                    className="flex-1"
                                    onClick={() => { setDetailSheetOpen(false); handleEditMovement(selectedMovement); }}
                                >
                                    <IconEdit className="size-4" />
                                    Modifier
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() => { setDetailSheetOpen(false); handleDeleteMovement(selectedMovement); }}
                                >
                                    <IconTrash className="size-4" />
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
