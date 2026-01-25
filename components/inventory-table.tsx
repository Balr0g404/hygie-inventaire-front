"use client"

import * as React from "react"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconDotsVertical,
    IconLayoutColumns,
    IconPlus,
    IconSearch,
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
import { z } from "zod"

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

export const inventorySchema = z.object({
    id: z.number(),
    name: z.string(),
    category: z.string(),
    location: z.string(),
    quantity: z.number(),
    minStock: z.number(),
    unit: z.string(),
    lot: z.string(),
    expiry: z.string(),
    status: z.string(),
})

type InventoryItem = z.infer<typeof inventorySchema>

function getStatusVariant(status: string) {
    switch (status) {
        case "In Stock":
            return "default"
        case "Low Stock":
            return "secondary"
        case "Expiring Soon":
            return "outline"
        case "Expired":
            return "destructive"
        default:
            return "outline"
    }
}

function getStatusColor(status: string) {
    switch (status) {
        case "In Stock":
            return "bg-[oklch(0.6_0.15_145)] text-white"
        case "Low Stock":
            return "bg-[oklch(0.75_0.15_75)] text-[oklch(0.25_0.05_75)]"
        case "Expiring Soon":
            return "bg-[oklch(0.75_0.15_75)] text-[oklch(0.25_0.05_75)]"
        case "Expired":
            return "bg-[oklch(0.55_0.2_25)] text-white"
        default:
            return ""
    }
}

const columns: ColumnDef<InventoryItem>[] = [
    {
        accessorKey: "name",
        header: "Item Name",
        cell: ({ row }) => (
            <div className="font-medium">{row.original.name}</div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-muted-foreground">
                {row.original.category}
            </Badge>
        ),
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.location}</span>
        ),
    },
    {
        accessorKey: "quantity",
        header: () => <div className="text-right">Qty</div>,
        cell: ({ row }) => {
            const isLow = row.original.quantity < row.original.minStock
            return (
                <div className={`text-right font-medium tabular-nums ${isLow ? "text-[oklch(0.55_0.2_25)]" : ""}`}>
                    {row.original.quantity} {row.original.unit}
                </div>
            )
        },
    },
    {
        accessorKey: "lot",
        header: "Lot/Batch",
        cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground">
        {row.original.lot}
      </span>
        ),
    },
    {
        accessorKey: "expiry",
        header: "Expiry",
        cell: ({ row }) => {
            const expiry = row.original.expiry
            if (expiry === "N/A") {
                return <span className="text-muted-foreground">N/A</span>
            }
            const expiryDate = new Date(expiry)
            const today = new Date()
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            const isExpired = daysUntilExpiry < 0
            const isExpiringSoon = daysUntilExpiry >= 0 && daysUntilExpiry <= 90

            return (
                <span className={`tabular-nums ${isExpired ? "text-[oklch(0.55_0.2_25)] font-medium" : isExpiringSoon ? "text-[oklch(0.65_0.15_75)] font-medium" : "text-muted-foreground"}`}>
          {expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </span>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
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
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Item</DropdownMenuItem>
                    <DropdownMenuItem>Record Movement</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

export function InventoryTable({
                                   data: initialData,
                               }: {
    data: InventoryItem[]
}) {
    const [data] = React.useState(() => initialData)
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const table = useReactTable({
        data,
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

    return (
        <div className="flex flex-col gap-4 px-4 lg:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-72">
                    <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search inventory..."
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
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="In Stock">In Stock</SelectItem>
                            <SelectItem value="Low Stock">Low Stock</SelectItem>
                            <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconLayoutColumns />
                                <span className="hidden lg:inline">Columns</span>
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
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm">
                        <IconPlus />
                        <span className="hidden lg:inline">Add Item</span>
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-muted-foreground hidden text-sm lg:block">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{" "}
                    of {table.getFilteredRowModel().rows.length} items
                </div>
                <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            Rows per page
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
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <IconChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8 bg-transparent"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <IconChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8 bg-transparent"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <IconChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex bg-transparent"
                            size="icon"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <IconChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
