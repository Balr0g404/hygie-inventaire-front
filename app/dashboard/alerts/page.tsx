"use client"

import React from "react"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

type Alert = {
    id: number
    type: "expired" | "expiring" | "low_stock" | "critical"
    title: string
    description: string
    item: string
    location: string
    date: string
    priority: "critical" | "high" | "medium"
    acknowledged: boolean
}

const alertsData: Alert[] = [
    {
        id: 1,
        type: "expired",
        title: "Expired Item",
        description: "This item has passed its expiration date and should be disposed of immediately.",
        item: "Aspirin 325mg",
        location: "Ambulance Unit 01",
        date: "2024-09-15",
        priority: "critical",
        acknowledged: false,
    },
    {
        id: 2,
        type: "low_stock",
        title: "Low Stock Alert",
        description: "Stock level is below minimum threshold. Reorder required.",
        item: "Epinephrine 1mg/ml",
        location: "Ambulance Unit 01",
        date: "2024-01-25",
        priority: "critical",
        acknowledged: false,
    },
    {
        id: 3,
        type: "low_stock",
        title: "Low Stock Alert",
        description: "Stock level is below minimum threshold. Reorder required.",
        item: "AED Pads (Adult)",
        location: "Field Post Alpha",
        date: "2024-01-25",
        priority: "critical",
        acknowledged: false,
    },
    {
        id: 4,
        type: "low_stock",
        title: "Low Stock Alert",
        description: "Stock level is below minimum threshold. Reorder required.",
        item: "Atropine 0.5mg/ml",
        location: "Main Warehouse",
        date: "2024-01-24",
        priority: "high",
        acknowledged: false,
    },
    {
        id: 5,
        type: "expiring",
        title: "Expiring Soon",
        description: "This item will expire within 30 days. Plan for rotation or disposal.",
        item: "Morphine 10mg/ml",
        location: "Main Warehouse",
        date: "2025-02-01",
        priority: "high",
        acknowledged: false,
    },
    {
        id: 6,
        type: "expiring",
        title: "Expiring Soon",
        description: "This item will expire within 90 days. Consider early rotation.",
        item: "Saline Solution 500ml",
        location: "Field Post Alpha",
        date: "2025-03-15",
        priority: "medium",
        acknowledged: true,
    },
    {
        id: 7,
        type: "expiring",
        title: "Expiring Soon",
        description: "This item will expire within 90 days. Consider early rotation.",
        item: "Atropine 0.5mg/ml",
        location: "Main Warehouse",
        date: "2025-01-10",
        priority: "high",
        acknowledged: false,
    },
]

function getAlertIcon(type: string) {
    switch (type) {
        case "expired":
            return <IconX className="size-5" />
        case "expiring":
            return <IconCalendarDue className="size-5" />
        case "low_stock":
        case "critical":
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
        case "critical":
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
            return <Badge className="bg-[oklch(0.55_0.2_25)] text-white">Critical</Badge>
        case "high":
            return <Badge className="bg-[oklch(0.75_0.15_75)] text-[oklch(0.25_0.05_75)]">High</Badge>
        case "medium":
            return <Badge variant="secondary">Medium</Badge>
        default:
            return <Badge variant="outline">Low</Badge>
    }
}

function AlertCard({ alert, onAcknowledge }: { alert: Alert; onAcknowledge: (id: number) => void }) {
    const colors = getAlertColor(alert.type)
    const expiryDate = new Date(alert.date)

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
                            Acknowledge
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Item:</span>
                        <span className="font-medium">{alert.item}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconClock className="size-4 text-muted-foreground" />
                        <span className={colors.text}>
              {alert.type === "expired" || alert.type === "expiring"
                  ? expiryDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Detected " + new Date(alert.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState(alertsData)
    const [showAcknowledged, setShowAcknowledged] = useState(false)

    const handleAcknowledge = (id: number) => {
        setAlerts(alerts.map(alert =>
            alert.id === id ? { ...alert, acknowledged: true } : alert
        ))
    }

    const criticalAlerts = alerts.filter(a => a.priority === "critical" && (!a.acknowledged || showAcknowledged))
    const highAlerts = alerts.filter(a => a.priority === "high" && (!a.acknowledged || showAcknowledged))
    const mediumAlerts = alerts.filter(a => a.priority === "medium" && (!a.acknowledged || showAcknowledged))
    const allAlerts = alerts.filter(a => !a.acknowledged || showAcknowledged)

    const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length

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
                            {/* Alert Summary Cards */}
                            <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 lg:px-6">
                                <Card className="border-l-4 border-l-[oklch(0.55_0.2_25)]">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="flex items-center gap-2">
                                            <IconX className="size-4 text-[oklch(0.55_0.2_25)]" />
                                            Expired Items
                                        </CardDescription>
                                        <CardTitle className="text-2xl tabular-nums">
                                            {alerts.filter(a => a.type === "expired").length}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Require immediate disposal
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-[oklch(0.75_0.15_75)]">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="flex items-center gap-2">
                                            <IconCalendarDue className="size-4 text-[oklch(0.75_0.15_75)]" />
                                            Expiring Soon
                                        </CardDescription>
                                        <CardTitle className="text-2xl tabular-nums">
                                            {alerts.filter(a => a.type === "expiring").length}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Within 90 days
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-primary">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="flex items-center gap-2">
                                            <IconPackage className="size-4 text-primary" />
                                            Low Stock
                                        </CardDescription>
                                        <CardTitle className="text-2xl tabular-nums">
                                            {alerts.filter(a => a.type === "low_stock").length}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Below minimum threshold
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Alerts List */}
                            <div className="flex flex-col gap-4 px-4 lg:px-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">Active Alerts</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {unacknowledgedCount} unacknowledged alert{unacknowledgedCount !== 1 ? "s" : ""} requiring attention
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
                                            Show acknowledged
                                        </label>
                                    </div>
                                </div>

                                <Tabs defaultValue="all" className="w-full">
                                    <TabsList>
                                        <TabsTrigger value="all">
                                            All <Badge variant="secondary" className="ml-1.5">{allAlerts.length}</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="critical">
                                            Critical <Badge variant="secondary" className="ml-1.5">{criticalAlerts.length}</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="high">
                                            High <Badge variant="secondary" className="ml-1.5">{highAlerts.length}</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="medium">
                                            Medium <Badge variant="secondary" className="ml-1.5">{mediumAlerts.length}</Badge>
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="all" className="mt-4 flex flex-col gap-4">
                                        {allAlerts.length > 0 ? (
                                            allAlerts.map((alert) => (
                                                <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                                            ))
                                        ) : (
                                            <Card>
                                                <CardContent className="flex flex-col items-center justify-center py-12">
                                                    <IconCheck className="size-12 text-[oklch(0.6_0.15_145)] mb-4" />
                                                    <p className="text-lg font-medium">All clear!</p>
                                                    <p className="text-sm text-muted-foreground">No alerts at this time</p>
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
                                                    <p className="text-lg font-medium">No critical alerts</p>
                                                    <p className="text-sm text-muted-foreground">All critical items are within normal parameters</p>
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
                                                    <p className="text-lg font-medium">No high priority alerts</p>
                                                    <p className="text-sm text-muted-foreground">All high priority items are within normal parameters</p>
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
                                                    <p className="text-lg font-medium">No medium priority alerts</p>
                                                    <p className="text-sm text-muted-foreground">All medium priority items are within normal parameters</p>
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
