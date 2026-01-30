"use client"

import React, { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { useBatches, useItems, useStockLines, useSites, useLocations, useLotInstances, useContainers } from "@/hooks/use-api"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
    IconAlertTriangle,
    IconCalendarDue,
    IconPackage,
    IconCheck,
    IconX,
    IconClock,
} from "@tabler/icons-react"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

type ComputedAlert = {
    id: string
    type: "expired" | "expiring" | "low_stock"
    title: string
    description: string
    item: string
    itemId: number
    location: string
    date: string
    priority: "critical" | "high" | "medium"
    acknowledged: boolean
    batchId?: number
    quantity?: number
}

function getAlertIcon(type: string) {
    switch (type) {
        case "expired":
            return <IconX className="size-5" />
        case "expiring":
            return <IconCalendarDue className="size-5" />
        case "low_stock":
            return <IconPackage className="size-5" />
        default:
            return <IconAlertTriangle className="size-5" />
    }
}

function getAlertColor(type: string) {
    switch (type) {
        case "expired":
            return {
                bg: "bg-[oklch(0.55_0.2_25)]/10",
                text: "text-[oklch(0.55_0.2_25)]",
                border: "border-[oklch(0.55_0.2_25)]/20",
            }
        case "expiring":
            return {
                bg: "bg-[oklch(0.75_0.15_75)]/10",
                text: "text-[oklch(0.65_0.15_75)]",
                border: "border-[oklch(0.75_0.15_75)]/20",
            }
        case "low_stock":
            return {
                bg: "bg-[oklch(0.55_0.2_25)]/10",
                text: "text-[oklch(0.55_0.2_25)]",
                border: "border-[oklch(0.55_0.2_25)]/20",
            }
        default:
            return {
                bg: "bg-muted",
                text: "text-muted-foreground",
                border: "border-border",
            }
    }
}

function getPriorityBadge(priority: string) {
    switch (priority) {
        case "critical":
            return <Badge className="bg-[oklch(0.55_0.2_25)] text-white">Critique</Badge>
        case "high":
            return <Badge className="bg-[oklch(0.75_0.15_75)] text-[oklch(0.25_0.05_75)]">Elevee</Badge>
        case "medium":
            return <Badge variant="secondary">Moyenne</Badge>
        default:
            return <Badge variant="outline">Faible</Badge>
    }
}

function AlertCard({
                       alert,
                       onAcknowledge
                   }: {
    alert: ComputedAlert
    onAcknowledge: (id: string) => void
}) {
    const colors = getAlertColor(alert.type)
    const alertDate = new Date(alert.date)

    return (
        <Card className={`${alert.acknowledged ? "opacity-60" : ""} transition-opacity`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className={`rounded-lg p-2 ${colors.bg}`}>
                            <span className={colors.text}>{getAlertIcon(alert.type)}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base">{alert.title}</CardTitle>
                                {getPriorityBadge(alert.priority)}
                            </div>
                            <CardDescription>{alert.description}</CardDescription>
                        </div>
                    </div>
                    {!alert.acknowledged && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAcknowledge(alert.id)}
                            className="shrink-0"
                        >
                            <IconCheck className="size-4" />
                            Accuser reception
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Article :</span>
                        <span className="font-medium">{alert.item}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Emplacement :</span>
                        <span>{alert.location}</span>
                    </div>
                    {alert.quantity !== undefined && (
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Quantite :</span>
                            <span className="font-medium">{alert.quantity}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <IconClock className="size-4 text-muted-foreground" />
                        <span className={colors.text}>
              {alert.type === "expired" || alert.type === "expiring"
                  ? alertDate.toLocaleDateString("fr-FR", { month: "short", day: "numeric", year: "numeric" })
                  : `Detecte le ${alertDate.toLocaleDateString("fr-FR", { month: "short", day: "numeric" })}`}
            </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function AlertsSkeleton() {
    return (
        <div className="flex flex-col gap-6 py-4 md:py-6">
            <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 lg:px-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-8 w-16" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-40" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="flex flex-col gap-4 px-4 lg:px-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-10 w-80" />
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                ))}
            </div>
        </div>
    )
}

export default function AlertsPage() {
    const { data: batches, isLoading: batchesLoading } = useBatches()
    const { data: items, isLoading: itemsLoading } = useItems()
    const { data: stockLines, isLoading: stockLinesLoading } = useStockLines()
    const { data: sites, isLoading: sitesLoading } = useSites()
    const { data: locations, isLoading: locationsLoading } = useLocations()
    const { data: lotInstances, isLoading: lotInstancesLoading } = useLotInstances()
    const { data: containers, isLoading: containersLoading } = useContainers()

    const isLoading = batchesLoading || itemsLoading || stockLinesLoading || sitesLoading || locationsLoading || lotInstancesLoading || containersLoading

    const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set())
    const [showAcknowledged, setShowAcknowledged] = useState(false)

    // Compute alerts from API data
    const computedAlerts = useMemo<ComputedAlert[]>(() => {
        if (!batches || !items || !stockLines) return []

        const alerts: ComputedAlert[] = []
        const today = new Date()
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(today.getDate() + 30)
        const ninetyDaysFromNow = new Date()
        ninetyDaysFromNow.setDate(today.getDate() + 90)

        const itemMap = new Map(items.map(i => [i.id, i]))
        const batchMap = new Map(batches.map(b => [b.id, b]))
        const lotInstanceMap = new Map(lotInstances?.map(li => [li.id, li]) || [])
        const containerMap = new Map(containers?.map(c => [c.id, c]) || [])
        const locationMap = new Map(locations?.map(l => [l.id, l]) || [])
        const siteMap = new Map(sites?.map(s => [s.id, s]) || [])

        // Get location name helper
        const getLocationName = (stockLineId: number): string => {
            const stockLine = stockLines.find(sl => sl.id === stockLineId)
            if (!stockLine) return "Inconnu"
            const lotInstance = lotInstanceMap.get(stockLine.lot_instance)
            if (!lotInstance) return "Inconnu"
            const container = containerMap.get(lotInstance.container)
            if (!container?.location) return "Non assigne"
            const location = locationMap.get(container.location)
            if (!location) return "Inconnu"
            const site = siteMap.get(location.site)
            return site ? `${site.name} - ${location.name}` : location.name
        }

        // Group stock lines by item
        const stockLinesByItem = new Map<number, typeof stockLines>()
        stockLines.forEach(sl => {
            const existing = stockLinesByItem.get(sl.item) || []
            existing.push(sl)
            stockLinesByItem.set(sl.item, existing)
        })

        // Check batches for expiry alerts
        batches.forEach(batch => {
            if (!batch.expires_at) return

            const expiryDate = new Date(batch.expires_at)
            const item = itemMap.get(batch.item)
            if (!item) return

            // Find stock lines with this batch to get location
            const relatedStockLines = stockLines.filter(sl => sl.batch === batch.id)
            const locationName = relatedStockLines.length > 0
                ? getLocationName(relatedStockLines[0].id)
                : "Inconnu"
            const totalQty = relatedStockLines.reduce((sum, sl) => sum + parseFloat(sl.quantity), 0)

            if (expiryDate < today) {
                // Expired
                alerts.push({
                    id: `expired-${batch.id}`,
                    type: "expired",
                    title: "Article perime",
                    description: "Cet article a depasse sa date de peremption et doit etre elimine immediatement.",
                    item: item.name,
                    itemId: item.id,
                    location: locationName,
                    date: batch.expires_at,
                    priority: "critical",
                    acknowledged: acknowledgedIds.has(`expired-${batch.id}`),
                    batchId: batch.id,
                    quantity: totalQty,
                })
            } else if (expiryDate <= thirtyDaysFromNow) {
                // Expiring within 30 days - high priority
                alerts.push({
                    id: `expiring-${batch.id}`,
                    type: "expiring",
                    title: "Expiration proche",
                    description: "Cet article expirera dans moins de 30 jours. Prevoir la rotation ou l'elimination.",
                    item: item.name,
                    itemId: item.id,
                    location: locationName,
                    date: batch.expires_at,
                    priority: "high",
                    acknowledged: acknowledgedIds.has(`expiring-${batch.id}`),
                    batchId: batch.id,
                    quantity: totalQty,
                })
            } else if (expiryDate <= ninetyDaysFromNow) {
                // Expiring within 90 days - medium priority
                alerts.push({
                    id: `expiring-${batch.id}`,
                    type: "expiring",
                    title: "Expiration proche",
                    description: "Cet article expirera dans 90 jours. Envisager une rotation anticipee.",
                    item: item.name,
                    itemId: item.id,
                    location: locationName,
                    date: batch.expires_at,
                    priority: "medium",
                    acknowledged: acknowledgedIds.has(`expiring-${batch.id}`),
                    batchId: batch.id,
                    quantity: totalQty,
                })
            }
        })

        // Check for low stock (items with 0 or very low quantity)
        items.forEach(item => {
            const itemStockLines = stockLinesByItem.get(item.id) || []
            const totalQty = itemStockLines.reduce((sum, sl) => sum + parseFloat(sl.quantity), 0)

            // Consider low stock if quantity is 0 or less than 5 for consumables
            if (totalQty === 0 || (item.is_consumable && totalQty < 5)) {
                const locationName = itemStockLines.length > 0
                    ? getLocationName(itemStockLines[0].id)
                    : "Non assigne"

                alerts.push({
                    id: `low-stock-${item.id}`,
                    type: "low_stock",
                    title: totalQty === 0 ? "Rupture de stock" : "Alerte de stock bas",
                    description: totalQty === 0
                        ? "Cet article est en rupture de stock. Reapprovisionnement urgent requis."
                        : "Le niveau de stock est inferieur au seuil minimum. Reapprovisionnement requis.",
                    item: item.name,
                    itemId: item.id,
                    location: locationName,
                    date: new Date().toISOString(),
                    priority: totalQty === 0 ? "critical" : "high",
                    acknowledged: acknowledgedIds.has(`low-stock-${item.id}`),
                    quantity: totalQty,
                })
            }
        })

        // Sort by priority
        const priorityOrder = { critical: 0, high: 1, medium: 2 }
        alerts.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

        return alerts
    }, [batches, items, stockLines, sites, locations, lotInstances, containers, acknowledgedIds])

    const handleAcknowledge = (id: string) => {
        setAcknowledgedIds(prev => new Set([...prev, id]))
    }

    const displayedAlerts = computedAlerts.filter(a => !a.acknowledged || showAcknowledged)
    const criticalAlerts = displayedAlerts.filter(a => a.priority === "critical")
    const highAlerts = displayedAlerts.filter(a => a.priority === "high")
    const mediumAlerts = displayedAlerts.filter(a => a.priority === "medium")

    const unacknowledgedCount = computedAlerts.filter(a => !a.acknowledged).length
    const expiredCount = computedAlerts.filter(a => a.type === "expired").length
    const expiringCount = computedAlerts.filter(a => a.type === "expiring").length
    const lowStockCount = computedAlerts.filter(a => a.type === "low_stock").length

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
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <AlertsSkeleton />
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
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-6 py-4 md:py-6">
                            {/* Alert Summary Cards */}
                            <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 lg:px-6">
                                <Card className="border-l-4 border-l-[oklch(0.55_0.2_25)]">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="flex items-center gap-2">
                                            <IconX className="size-4 text-[oklch(0.55_0.2_25)]" />
                                            Articles perimes
                                        </CardDescription>
                                        <CardTitle className="text-2xl tabular-nums">
                                            {expiredCount}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            A eliminer immediatement
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-[oklch(0.75_0.15_75)]">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="flex items-center gap-2">
                                            <IconCalendarDue className="size-4 text-[oklch(0.75_0.15_75)]" />
                                            Expiration proche
                                        </CardDescription>
                                        <CardTitle className="text-2xl tabular-nums">
                                            {expiringCount}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Sous 90 jours
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-primary">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="flex items-center gap-2">
                                            <IconPackage className="size-4 text-primary" />
                                            Stock bas
                                        </CardDescription>
                                        <CardTitle className="text-2xl tabular-nums">
                                            {lowStockCount}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Sous le seuil minimum
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Alerts List */}
                            <div className="flex flex-col gap-4 px-4 lg:px-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">Alertes actives</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {unacknowledgedCount} alerte{unacknowledgedCount !== 1 ? "s" : ""} non accusee{unacknowledgedCount !== 1 ? "s" : ""} necessitant une action
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="show-acknowledged"
                                            checked={showAcknowledged}
                                            onCheckedChange={(checked) => setShowAcknowledged(checked as boolean)}
                                        />
                                        <label
                                            htmlFor="show-acknowledged"
                                            className="text-sm font-medium leading-none cursor-pointer"
                                        >
                                            Afficher les alertes reconnues
                                        </label>
                                    </div>
                                </div>

                                <Tabs defaultValue="all" className="w-full">
                                    <TabsList>
                                        <TabsTrigger value="all">
                                            Toutes <Badge variant="secondary" className="ml-1.5">{displayedAlerts.length}</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="critical">
                                            Critiques <Badge variant="secondary" className="ml-1.5">{criticalAlerts.length}</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="high">
                                            Elevees <Badge variant="secondary" className="ml-1.5">{highAlerts.length}</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="medium">
                                            Moyennes <Badge variant="secondary" className="ml-1.5">{mediumAlerts.length}</Badge>
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="all" className="mt-4 flex flex-col gap-4">
                                        {displayedAlerts.length > 0 ? (
                                            displayedAlerts.map((alert) => (
                                                <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                                            ))
                                        ) : (
                                            <Card>
                                                <CardContent className="flex flex-col items-center justify-center py-12">
                                                    <IconCheck className="size-12 text-[oklch(0.6_0.15_145)] mb-4" />
                                                    <p className="text-lg font-medium">Tout est en ordre !</p>
                                                    <p className="text-sm text-muted-foreground">Aucune alerte pour le moment</p>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="critical" className="mt-4 flex flex-col gap-4">
                                        {criticalAlerts.length > 0 ? (
                                            criticalAlerts.map((alert) => (
                                                <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                                            ))
                                        ) : (
                                            <Card>
                                                <CardContent className="flex flex-col items-center justify-center py-12">
                                                    <IconCheck className="size-12 text-[oklch(0.6_0.15_145)] mb-4" />
                                                    <p className="text-lg font-medium">Aucune alerte critique</p>
                                                    <p className="text-sm text-muted-foreground">Tous les elements critiques sont dans les parametres normaux</p>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="high" className="mt-4 flex flex-col gap-4">
                                        {highAlerts.length > 0 ? (
                                            highAlerts.map((alert) => (
                                                <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                                            ))
                                        ) : (
                                            <Card>
                                                <CardContent className="flex flex-col items-center justify-center py-12">
                                                    <IconCheck className="size-12 text-[oklch(0.6_0.15_145)] mb-4" />
                                                    <p className="text-lg font-medium">Aucune alerte de priorite elevee</p>
                                                    <p className="text-sm text-muted-foreground">Tous les elements prioritaires sont dans les parametres normaux</p>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="medium" className="mt-4 flex flex-col gap-4">
                                        {mediumAlerts.length > 0 ? (
                                            mediumAlerts.map((alert) => (
                                                <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                                            ))
                                        ) : (
                                            <Card>
                                                <CardContent className="flex flex-col items-center justify-center py-12">
                                                    <IconCheck className="size-12 text-[oklch(0.6_0.15_145)] mb-4" />
                                                    <p className="text-lg font-medium">Aucune alerte de priorite moyenne</p>
                                                    <p className="text-sm text-muted-foreground">Tout fonctionne comme prevu</p>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
