import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { InventoryTable } from "@/components/inventory-table"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    IconBuildingWarehouse,
    IconTruck,
    IconMapPin,
    IconPackage,
} from "@tabler/icons-react"

import data from "../data.json"

const locationStats = [
    {
        name: "Entrepôt principal",
        icon: IconBuildingWarehouse,
        items: 1247,
        alerts: 2,
    },
    {
        name: "Unité ambulance 01",
        icon: IconTruck,
        items: 156,
        alerts: 3,
    },
    {
        name: "Unité ambulance 02",
        icon: IconTruck,
        items: 142,
        alerts: 1,
    },
    {
        name: "Poste de terrain Alpha",
        icon: IconMapPin,
        items: 89,
        alerts: 1,
    },
]

export default function InventoryPage() {
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
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {locationStats.map((location) => (
                                        <Card key={location.name} className="cursor-pointer transition-colors hover:bg-muted/50">
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between">
                                                    <location.icon className="size-5 text-primary" />
                                                    {location.alerts > 0 && (
                                                        <span className="flex size-5 items-center justify-center rounded-full bg-[oklch(0.55_0.2_25)] text-xs font-medium text-white">
                              {location.alerts}
                            </span>
                                                    )}
                                                </div>
                                                <CardTitle className="text-base">{location.name}</CardTitle>
                                                <CardDescription className="flex items-center gap-1">
                                                    <IconPackage className="size-3" />
                                                    {location.items.toLocaleString()} articles
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Inventory Table */}
                            <div className="flex flex-col gap-4">
                                <div className="px-4 lg:px-6">
                                    <h2 className="text-lg font-semibold">Tous les articles d'inventaire</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Gérer et suivre toutes les fournitures médicales et les équipements
                                    </p>
                                </div>
                                <InventoryTable data={data} />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
