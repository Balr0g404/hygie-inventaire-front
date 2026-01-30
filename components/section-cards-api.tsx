"use client"

import {
    IconAlertTriangle,
    IconBox,
    IconCalendarDue,
    IconLoader2,
    IconPackage,
} from "@tabler/icons-react"
import { useItems, useBatches, useSites } from "@/hooks/use-api"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SectionCardsApi() {
    const { data: items, isLoading: itemsLoading } = useItems()
    const { data: batches, isLoading: batchesLoading } = useBatches()
    const { data: sites, isLoading: sitesLoading } = useSites()

    const isLoading = itemsLoading || batchesLoading || sitesLoading

    // Calculate stats
    const totalItems = items?.length || 0
    const totalSites = sites?.length || 0

    // Calculate expiring soon and expired items from batches
    const today = new Date()
    const ninetyDaysFromNow = new Date()
    ninetyDaysFromNow.setDate(today.getDate() + 90)

    let expiringCount = 0
    let expiredCount = 0

    if (batches) {
        for (const batch of batches) {
            if (batch.expires_at) {
                const expiryDate = new Date(batch.expires_at)
                if (expiryDate < today) {
                    expiredCount++
                } else if (expiryDate <= ninetyDaysFromNow) {
                    expiringCount++
                }
            }
        }
    }

    // For low stock alerts, we'd need stock lines with min thresholds
    // For now, show items marked as consumable that might need restocking
    const lowStockCount = items?.filter(item => item.is_consumable && item.requires_expiry).length || 0

    if (isLoading) {
        return (
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="@container/card">
                        <CardHeader>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-16" />
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1.5">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total articles</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {totalItems.toLocaleString("fr-FR")}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="text-[oklch(0.6_0.15_145)]">
                            <IconPackage className="size-3" />
                            Actif
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Articles en inventaire <IconBox className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Repartis sur {totalSites} site{totalSites > 1 ? "s" : ""}
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Alertes stock bas</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {lowStockCount}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className={lowStockCount > 0 ? "text-[oklch(0.55_0.2_25)]" : "text-muted-foreground"}>
                            <IconAlertTriangle className="size-3" />
                            {lowStockCount > 0 ? "Urgent" : "OK"}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Articles sous le seuil minimal <IconAlertTriangle className={`size-4 ${lowStockCount > 0 ? "text-[oklch(0.55_0.2_25)]" : ""}`} />
                    </div>
                    <div className="text-muted-foreground">
                        {lowStockCount > 0 ? "Reassort necessaire" : "Stock suffisant"}
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Expirations proches</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {expiringCount}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className={expiringCount > 0 ? "text-[oklch(0.65_0.15_75)]" : "text-muted-foreground"}>
                            <IconCalendarDue className="size-3" />
                            {"<"} 90 jours
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        A renouveler bientot <IconCalendarDue className={`size-4 ${expiringCount > 0 ? "text-[oklch(0.65_0.15_75)]" : ""}`} />
                    </div>
                    <div className="text-muted-foreground">Verifier les dates de peremption</div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Articles perimes</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {expiredCount}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className={expiredCount > 0 ? "text-[oklch(0.55_0.2_25)]" : "text-[oklch(0.6_0.15_145)]"}>
                            <IconAlertTriangle className="size-3" />
                            {expiredCount > 0 ? "Critique" : "OK"}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {expiredCount > 0 ? "A retirer immediatement" : "Aucun article perime"} <IconAlertTriangle className={`size-4 ${expiredCount > 0 ? "text-[oklch(0.55_0.2_25)]" : ""}`} />
                    </div>
                    <div className="text-muted-foreground">{expiredCount > 0 ? "Mise au rebut obligatoire" : "Inventaire conforme"}</div>
                </CardFooter>
            </Card>
        </div>
    )
}
