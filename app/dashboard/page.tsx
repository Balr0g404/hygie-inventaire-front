"use client"

import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { InventoryTableApi } from "@/components/inventory-table-api"
import { SectionCardsApi } from "@/components/section-cards-api"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Page() {
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
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCardsApi />
                <div className="px-4 lg:px-6">
                </div>
                <div className="flex flex-col gap-4">
                  <div className="px-4 lg:px-6">
                    <h2 className="text-lg font-semibold">Apercu de l&apsos;inventaire</h2>
                    <p className="text-sm text-muted-foreground">
                      Vue rapide de tous les articles par site
                    </p>
                  </div>
                  <InventoryTableApi />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
  )
}
