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
import { BrandLogo } from "@/components/brand-logo"
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
  ]
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
                <a href="/dashboard">
                  <BrandLogo size="sm" />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={displayUser} isAdmin={user?.is_superuser || false} />
        </SidebarFooter>
      </Sidebar>
  )
}
