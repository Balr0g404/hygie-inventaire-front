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
  user: {
    name: "Marco Rossi",
    email: "m.rossi@civilprotection.org",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
      icon: IconFirstAidKit,
    },
    {
      title: "Stock Movements",
      url: "/dashboard/movements",
      icon: IconArrowsExchange,
    },
    {
      title: "Alerts",
      url: "/dashboard/alerts",
      icon: IconAlertTriangle,
    },
    {
      title: "Organization",
      url: "/dashboard/organization",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "/dashboard/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/dashboard/search",
      icon: IconSearch,
    },
  ],
  locations: [
    {
      name: "Main Warehouse",
      url: "/dashboard/locations/warehouse",
      icon: IconBuildingWarehouse,
    },
    {
      name: "Ambulance Unit 01",
      url: "/dashboard/locations/ambulance-01",
      icon: IconTruck,
    },
    {
      name: "Field Post Alpha",
      url: "/dashboard/locations/field-alpha",
      icon: IconMapPin,
    },
    {
      name: "Reports",
      url: "/dashboard/reports",
      icon: IconReport,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                  <IconFirstAidKit className="!size-5 text-primary" />
                  <span className="text-base font-semibold">EmergencyStock</span>
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
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
  )
}
