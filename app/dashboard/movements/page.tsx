"use client"

import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { MovementsTableApi } from "@/components/movements-table-api"
import { useStockMovements } from "@/hooks/use-api"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    IconArrowDown,
    IconArrowUp,
    IconArrowsExchange,
    IconTruck,
} from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { StockMovementType } from "@/lib/api/types"

export default function MovementsPage() {
    const { data: movements, isLoading } = useStockMovements()

    // Calculate today's stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayMovements = movements?.filter(m => {
        const movementDate = new Date(m.created_at)
        movementDate.setHours(0, 0, 0, 0)
        return movementDate.getTime() === today.getTime()
    }) || []

    const entriesCount = todayMovements.filter(m => m.type === "IN" || m.type === "RESTOCK").length
    const consumedCount = todayMovements.filter(m => m.type === "OUT" || m.type === "CONSUME").length
    const transfersCount = todayMovements.filter(m => m.type === "TRANSFER").length
    const adjustCount = todayMovements.filter(m => m.type === "ADJUST").length

    const movementStats = [
        {
            title: "Entrees aujourd'hui",
            value: entriesCount.toString(),
            description: "Articles recus",
            icon: IconArrowDown,
            color: "text-[oklch(0.6_0.15_145)]",
            bgColor: "bg-[oklch(0.6_0.15_145)]/10",
        },
        {
            title: "Consommes aujourd'hui",
            value: consumedCount.toString(),
            description: "Articles utilises",
            icon: IconArrowUp,
            color: "text-[oklch(0.55_0.2_25)]",
            bgColor: "bg-[oklch(0.55_0.2_25)]/10",
        },
        {
            title: "Transferts aujourd'hui",
            value: transfersCount.toString(),
            description: "Entre sites",
            icon: IconArrowsExchange,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            title: "Ajustements",
            value: adjustCount.toString(),
            description: "Corrections de stock",
            icon: IconTruck,
            color: "text-[oklch(0.75_0.15_75)]",
            bgColor: "bg-[oklch(0.75_0.15_75)]/10",
        },
    ]

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-6 py-4 md:py-6">
                            {/* Movement Stats */}
                            <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
                                {isLoading ? (
                                    [...Array(4)].map((_, i) => (
                                        <Card key={i}>
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between">
                                                    <Skeleton className="size-9 rounded-lg" />
                                                    <Skeleton className="h-8 w-12" />
                                                </div>
                                                <Skeleton className="h-5 w-32" />
                                                <Skeleton className="h-4 w-24" />
                                            </CardHeader>
                                        </Card>
                                    ))
                                ) : (
                                    movementStats.map((stat) => (
                                        <Card key={stat.title}>
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between">
                                                    <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                                                        <stat.icon className={`size-5 ${stat.color}`} />
                                                    </div>
                                                    <span className="text-2xl font-bold tabular-nums">
                            {stat.value}
                          </span>
                                                </div>
                                                <CardTitle className="text-base">{stat.title}</CardTitle>
                                                <CardDescription>{stat.description}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    ))
                                )}
                            </div>

                            {/* Movements Table */}
                            <div className="flex flex-col gap-4">
                                <div className="px-4 lg:px-6">
                                    <h2 className="text-lg font-semibold">Mouvements recents</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Suivez tous les mouvements : entrees, consommations et transferts
                                    </p>
                                </div>
                                <MovementsTableApi />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
