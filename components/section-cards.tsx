import {
  IconAlertTriangle,
  IconBox,
  IconCalendarDue,
  IconPackage,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total articles</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              1 634
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
              Repartis sur 4 sites
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Alertes stock bas</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              7
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-[oklch(0.55_0.2_25)]">
                <IconAlertTriangle className="size-3" />
                Urgent
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Articles sous le seuil minimal <IconAlertTriangle className="size-4 text-[oklch(0.55_0.2_25)]" />
            </div>
            <div className="text-muted-foreground">
              Reassort necessaire
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Expirations proches</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              12
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-[oklch(0.65_0.15_75)]">
                <IconCalendarDue className="size-3" />
                {"<"} 90 jours
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              A renouveler bientot <IconCalendarDue className="size-4 text-[oklch(0.65_0.15_75)]" />
            </div>
            <div className="text-muted-foreground">Verifier les dates de peremption</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Articles perimes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              1
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-[oklch(0.55_0.2_25)]">
                <IconAlertTriangle className="size-3" />
                Critique
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              A retirer immediatement <IconAlertTriangle className="size-4 text-[oklch(0.55_0.2_25)]" />
            </div>
            <div className="text-muted-foreground">Mise au rebut obligatoire</div>
          </CardFooter>
        </Card>
      </div>
  )
}
