"use client"

import { usePathname } from "next/navigation"
import { IconBell } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"

const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/dashboard/inventory": "Gestion de l'inventaire",
  "/dashboard/movements": "Mouvements de stock",
  "/dashboard/alerts": "Alertes et notifications",
  "/dashboard/organization": "Organisation",
  "/dashboard/settings": "Paramètres",
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || "Tableau de bord"

  return (
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <IconBell className="size-5" />
              <Badge className="absolute -top-1 -right-1 size-5 justify-center rounded-full p-0 text-xs bg-[oklch(var(--warning))] text-[oklch(var(--warning-foreground))]">
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
  )
}
