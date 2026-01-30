"use client"

import * as React from "react"
import {
  IconAlertTriangle,
  IconArrowsExchange,
  IconBuildingWarehouse,
  IconDashboard,
  IconFirstAidKit,
  IconHelp,
  IconMapPin,
  IconReport,
  IconSearch,
  IconSettings,
  IconTruck,
  IconUsers,
} from "@tabler/icons-react"
import { useAuth } from "@/lib/auth/context"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Inventaire",
      url: "/dashboard/inventory",
      icon: IconFirstAidKit,
    },
    {
      title: "Mouvements de stock",
      url: "/dashboard/movements",
      icon: IconArrowsExchange,
    },
    {
      title: "Alertes",
      url: "/dashboard/alerts",
      icon: IconAlertTriangle,
    },
    {
      title: "Organisation",
      url: "/dashboard/organization",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Aide",
      url: "/dashboard/help",
      icon: IconHelp,
    },
    {
      title: "Recherche",
      url: "/dashboard/search",
      icon: IconSearch,
    },
  ],
  locations: [
    {
      name: "Entrepôt principal",
      url: "/dashboard/locations/warehouse",
      icon: IconBuildingWarehouse,
    },
    {
      name: "Unité ambulance 01",
      url: "/dashboard/locations/ambulance-01",
      icon: IconTruck,
    },
    {
      name: "Poste de terrain Alpha",
      url: "/dashboard/locations/field-alpha",
      icon: IconMapPin,
    },
    {
      name: "Rapports",
      url: "/dashboard/reports",
      icon: IconReport,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const displayUser = {
    name: user?.full_name || user?.email?.split("@")[0] || "Utilisateur",
    email: user?.email || "",
  }

  return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                  asChild
                  className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="/dashboard" className="flex items-center gap-2">
                  <svg
                      viewBox="0 0 24 24"
                      className="!size-6"
                      fill="currentColor"
                      aria-label="Croix-Rouge"
                  >
                    <path
                        d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7V2z"
                        fill="#ff010b"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-tight">Croix-Rouge francaise</span>
                    <span className="text-xs text-muted-foreground leading-tight">Hygie inventaire</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavDocuments items={data.locations} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={displayUser} />
        </SidebarFooter>
      </Sidebar>
  )
}
