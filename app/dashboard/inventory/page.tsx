"use client"

import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { InventoryTableApi } from "@/components/inventory-table-api"
import { SiteHeader } from "@/components/site-header"
import { useSites, useItems, useContainers } from "@/hooks/use-api"
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
    IconBuildingWarehouse,
    IconPackage,
} from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function InventoryPage() {
    const { data: sites, isLoading: sitesLoading } = useSites()
    const { data: items, isLoading: itemsLoading } = useItems()
    const { data: containers, isLoading: containersLoading } = useContainers()

    const isLoading = sitesLoading || itemsLoading || containersLoading

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
                            {/* Location Cards */}
                            <div className="px-4 lg:px-6">
                                <h2 className="mb-4 text-lg font-semibold">Inventaire par site</h2>
                                {isLoading ? (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        {[...Array(4)].map((_, i) => (
                                            <Card key={i}>
                                                <CardHeader className="pb-2">
                                                    <Skeleton className="size-5" />
                                                    <Skeleton className="h-5 w-32" />
                                                    <Skeleton className="h-4 w-24" />
                                                </CardHeader>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        {sites?.map((site) => {
                                            // Count containers for this site
                                            const siteContainers = containers?.filter(c =>
                                                c.is_active
                                            ).length || 0

                                            return (
                                                <Card key={site.id} className="cursor-pointer transition-colors hover:bg-muted/50">
                                                    <CardHeader className="pb-2">
                                                        <div className="flex items-center justify-between">
                                                            <IconBuildingWarehouse className="size-5 text-primary" />
                                                        </div>
                                                        <CardTitle className="text-base">{site.name}</CardTitle>
                                                        <CardDescription className="flex items-center gap-1">
                                                            <IconPackage className="size-3" />
                                                            {site.address || "Adresse non definie"}
                                                        </CardDescription>
                                                    </CardHeader>
                                                </Card>
                                            )
                                        })}
                                        {(!sites || sites.length === 0) && (
                                            <Card className="col-span-full">
                                                <CardHeader>
                                                    <CardTitle className="text-base text-muted-foreground">Aucun site configure</CardTitle>
                                                    <CardDescription>Ajoutez des sites pour organiser votre inventaire</CardDescription>
                                                </CardHeader>
                                            </Card>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Inventory Table */}
                            <div className="flex flex-col gap-4">
                                <div className="px-4 lg:px-6">
                                    <h2 className="text-lg font-semibold">Tous les articles d'inventaire</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Gerer et suivre toutes les fournitures medicales et les equipements
                                    </p>
                                </div>
                                <InventoryTableApi />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
