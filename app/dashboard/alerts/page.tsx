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
        title: "Article périmé",
        description: "Cet article a dépassé sa date de péremption et doit être éliminé immédiatement.",
        item: "Aspirine 325 mg",
        location: "Unité ambulance 01",
        date: "2024-09-15",
        priority: "critical",
        acknowledged: false,
    },
    {
        id: 2,
        type: "low_stock",
        title: "Alerte de stock bas",
        description: "Le niveau de stock est inférieur au seuil minimum. Réapprovisionnement requis.",
        item: "Épinéphrine 1 mg/ml",
        location: "Unité ambulance 01",
        date: "2024-01-25",
        priority: "critical",
        acknowledged: false,
    },
    {
        id: 3,
        type: "low_stock",
        title: "Alerte de stock bas",
        description: "Le niveau de stock est inférieur au seuil minimum. Réapprovisionnement requis.",
        item: "Électrodes DAE (adulte)",
        location: "Poste de terrain Alpha",
        date: "2024-01-25",
        priority: "critical",
        acknowledged: false,
    },
    {
        id: 4,
        type: "low_stock",
        title: "Alerte de stock bas",
        description: "Le niveau de stock est inférieur au seuil minimum. Réapprovisionnement requis.",
        item: "Atropine 0,5 mg/ml",
        location: "Entrepôt principal",
        date: "2024-01-24",
        priority: "high",
        acknowledged: false,
    },
    {
        id: 5,
        type: "expiring",
        title: "Expiration proche",
        description: "Cet article expirera dans 30 jours. Prévoir la rotation ou l'élimination.",
        item: "Morphine 10 mg/ml",
        location: "Entrepôt principal",
        date: "2025-02-01",
        priority: "high",
        acknowledged: false,
    },
    {
        id: 6,
        type: "expiring",
        title: "Expiration proche",
        description: "Cet article expirera dans 90 jours. Envisager une rotation anticipée.",
        item: "Solution saline 500 ml",
        location: "Poste de terrain Alpha",
        date: "2025-03-15",
        priority: "medium",
        acknowledged: true,
    },
    {
        id: 7,
        type: "expiring",
        title: "Expiration proche",
        description: "Cet article expirera dans 90 jours. Envisager une rotation anticipée.",
        item: "Atropine 0,5 mg/ml",
        location: "Entrepôt principal",
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
            return <Badge className="bg-[oklch(0.55_0.2_25)] text-white">Critique</Badge>
        case "high":
            return <Badge className="bg-[oklch(0.75_0.15_75)] text-[oklch(0.25_0.05_75)]">Élevée</Badge>
        case "medium":
            return <Badge variant="secondary">Moyenne</Badge>
        default:
            return <Badge variant="outline">Faible</Badge>
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
                            Accuser réception
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
                    <div className="flex items-center gap-2">
                        <IconClock className="size-4 text-muted-foreground" />
                        <span className={colors.text}>
              {alert.type === "expired" || alert.type === "expiring"
                  ? expiryDate.toLocaleDateString("fr-FR", { month: "short", day: "numeric", year: "numeric" })
                  : `Détecté le ${new Date(alert.date).toLocaleDateString("fr-FR", { month: "short", day: "numeric" })}`}
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
                                            Articles périmés
                                        </CardDescription>
                                        <CardTitle className="text-2xl tabular-nums">
                                            {alerts.filter(a => a.type === "expired").length}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            À éliminer immédiatement
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
                                            {alerts.filter(a => a.type === "expiring").length}
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
                                            {alerts.filter(a => a.type === "low_stock").length}
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
                                            {unacknowledgedCount} alerte{unacknowledgedCount !== 1 ? "s" : ""} non accusée{unacknowledgedCount !== 1 ? "s" : ""} nécessitant une action
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
                                            Toutes <Badge variant="secondary" className="ml-1.5">{allAlerts.length}</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="critical">
                                            Critiques <Badge variant="secondary" className="ml-1.5">{criticalAlerts.length}</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="high">
                                            Élevées <Badge variant="secondary" className="ml-1.5">{highAlerts.length}</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="medium">
                                            Moyennes <Badge variant="secondary" className="ml-1.5">{mediumAlerts.length}</Badge>
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
                                                    <p className="text-sm text-muted-foreground">Tous les éléments critiques sont dans les paramètres normaux</p>
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
                                                    <p className="text-lg font-medium">Aucune alerte de priorité élevée</p>
                                                    <p className="text-sm text-muted-foreground">Tous les éléments prioritaires sont dans les paramètres normaux</p>
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
                                                    <p className="text-lg font-medium">Aucune alerte de priorité moyenne</p>
                                                    <p className="text-sm text-muted-foreground">Tous les éléments de priorité moyenne sont dans les paramètres normaux</p>
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
