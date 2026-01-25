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

type Movement = {
    id: number
    type: string
    item: string
    quantity: number
    unit: string
    from: string
    to: string
    date: string
    operator: string
    reference: string
}

function getTypeIcon(type: string) {
    switch (type) {
        case "Incoming":
            return <IconArrowDown className="size-4 text-[oklch(0.6_0.15_145)]" />
        case "Consumption":
            return <IconArrowUp className="size-4 text-[oklch(0.55_0.2_25)]" />
        case "Transfer":
            return <IconArrowsExchange className="size-4 text-primary" />
        default:
            return null
    }
}

function getTypeBadgeColor(type: string) {
    switch (type) {
        case "Incoming":
            return "bg-[oklch(0.6_0.15_145)]/10 text-[oklch(0.5_0.15_145)] border-[oklch(0.6_0.15_145)]/20"
        case "Consumption":
            return "bg-[oklch(0.55_0.2_25)]/10 text-[oklch(0.45_0.2_25)] border-[oklch(0.55_0.2_25)]/20"
        case "Transfer":
            return "bg-primary/10 text-primary border-primary/20"
        default:
            return ""
    }
}

const columns: ColumnDef<Movement>[] = [
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                {getTypeIcon(row.original.type)}
                <Badge variant="outline" className={getTypeBadgeColor(row.original.type)}>
                    {row.original.type}
                </Badge>
            </div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "item",
        header: "Item",
        cell: ({ row }) => (
            <div className="font-medium">{row.original.item}</div>
        ),
    },
    {
        accessorKey: "quantity",
        header: () => <div className="text-right">Qty</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium tabular-nums">
                {row.original.type === "Consumption" ? "-" : "+"}{row.original.quantity} {row.original.unit}
            </div>
        ),
    },
    {
        accessorKey: "from",
        header: "From",
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.from}</span>
        ),
    },
    {
        id: "arrow",
        cell: () => <IconArrowRight className="size-4 text-muted-foreground" />,
    },
    {
        accessorKey: "to",
        header: "To",
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.to}</span>
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
            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
            {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
                </div>
            )
        },
    },
    {
        accessorKey: "operator",
        header: "Operator",
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.operator}</span>
        ),
    },
    {
        accessorKey: "reference",
        header: "Reference",
        cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground">
        {row.original.reference}
      </span>
        ),
    },
    {
        id: "actions",
        cell: () => (
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
                    <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Reverse</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

export function MovementsTable({ data: initialData }: { data: Movement[] }) {
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
                        placeholder="Search movements..."
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
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Incoming">Incoming</SelectItem>
                            <SelectItem value="Consumption">Consumption</SelectItem>
                            <SelectItem value="Transfer">Transfer</SelectItem>
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
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm">
                        <IconPlus />
                        <span className="hidden lg:inline">New Movement</span>
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
                                    No movements found.
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
                    of {table.getFilteredRowModel().rows.length} movements
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
