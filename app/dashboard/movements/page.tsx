import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { MovementsTable } from "@/components/movements-table"
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

const movementStats = [
    {
        title: "Entrées aujourd'hui",
        value: "34",
        description: "Articles reçus",
        icon: IconArrowDown,
        color: "text-[oklch(0.6_0.15_145)]",
        bgColor: "bg-[oklch(0.6_0.15_145)]/10",
    },
    {
        title: "Consommés aujourd'hui",
        value: "67",
        description: "Articles utilisés",
        icon: IconArrowUp,
        color: "text-[oklch(0.55_0.2_25)]",
        bgColor: "bg-[oklch(0.55_0.2_25)]/10",
    },
    {
        title: "Transferts aujourd'hui",
        value: "12",
        description: "Entre sites",
        icon: IconArrowsExchange,
        color: "text-primary",
        bgColor: "bg-primary/10",
    },
    {
        title: "Missions actives",
        value: "3",
        description: "En cours",
        icon: IconTruck,
        color: "text-[oklch(0.75_0.15_75)]",
        bgColor: "bg-[oklch(0.75_0.15_75)]/10",
    },
]

const movementsData = [
    {
        id: 1,
        type: "Entrée",
        item: "Compresses de gaze stériles 4x4",
        quantity: 100,
        unit: "u.",
        from: "Fournisseur - MedEquip Co.",
        to: "Entrepôt principal",
        date: "2024-01-25T09:30:00",
        operator: "Marco Rossi",
        reference: "PO-2024-0125",
    },
    {
        id: 2,
        type: "Consommation",
        item: "Gants en nitrile (M)",
        quantity: 50,
        unit: "u.",
        from: "Unité ambulance 01",
        to: "Mission #1247",
        date: "2024-01-25T08:45:00",
        operator: "Anna Bianchi",
        reference: "MIS-2024-1247",
    },
    {
        id: 3,
        type: "Transfert",
        item: "Solution saline 500 ml",
        quantity: 10,
        unit: "poches",
        from: "Entrepôt principal",
        to: "Poste de terrain Alpha",
        date: "2024-01-25T07:15:00",
        operator: "Luigi Verdi",
        reference: "TRF-2024-0089",
    },
    {
        id: 4,
        type: "Consommation",
        item: "Épinéphrine 1 mg/ml",
        quantity: 2,
        unit: "flacons",
        from: "Unité ambulance 01",
        to: "Mission #1246",
        date: "2024-01-24T22:30:00",
        operator: "Anna Bianchi",
        reference: "MIS-2024-1246",
    },
    {
        id: 5,
        type: "Entrée",
        item: "Électrodes DAE (adulte)",
        quantity: 6,
        unit: "paires",
        from: "Fournisseur - CardioTech",
        to: "Entrepôt principal",
        date: "2024-01-24T14:00:00",
        operator: "Marco Rossi",
        reference: "PO-2024-0124",
    },
    {
        id: 6,
        type: "Transfert",
        item: "Morphine 10 mg/ml",
        quantity: 5,
        unit: "ampoules",
        from: "Entrepôt principal",
        to: "Unité ambulance 02",
        date: "2024-01-24T11:30:00",
        operator: "Luigi Verdi",
        reference: "TRF-2024-0088",
    },
    {
        id: 7,
        type: "Consommation",
        item: "Masque chirurgical N95",
        quantity: 20,
        unit: "u.",
        from: "Poste de terrain Alpha",
        to: "Mission #1245",
        date: "2024-01-24T09:00:00",
        operator: "Sofia Romano",
        reference: "MIS-2024-1245",
    },
    {
        id: 8,
        type: "Entrée",
        item: "Cathéter IV 18G",
        quantity: 50,
        unit: "u.",
        from: "Fournisseur - MedEquip Co.",
        to: "Entrepôt principal",
        date: "2024-01-23T16:45:00",
        operator: "Marco Rossi",
        reference: "PO-2024-0123",
    },
]

export default function MovementsPage() {
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
                                {movementStats.map((stat) => (
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
                                ))}
                            </div>

                            {/* Movements Table */}
                            <div className="flex flex-col gap-4">
                                <div className="px-4 lg:px-6">
                                    <h2 className="text-lg font-semibold">Mouvements récents</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Suivez tous les mouvements : entrées, consommations et transferts
                                    </p>
                                </div>
                                <MovementsTable data={movementsData} />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
