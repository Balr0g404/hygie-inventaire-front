"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    IconDotsVertical,
    IconEdit,
    IconPlus,
    IconTrash,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { mutate } from "swr"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { useOrganizations, useStructures, useSites, useLocations, useContainers } from "@/hooks/use-api"
import { organizationsApi, structuresApi, sitesApi, locationsApi, containersApi } from "@/lib/api/client"
import type { Organization, Structure, Site, Location, Container } from "@/lib/api/types"

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteDialog } from "@/components/dialogs/delete-dialog"
import { OrganizationDialog } from "@/components/dialogs/organization-dialog"
import { StructureDialog } from "@/components/dialogs/structure-dialog"
import { SiteDialog } from "@/components/dialogs/site-dialog"
import { LocationDialog } from "@/components/dialogs/location-dialog"
import { ContainerDialog } from "@/components/dialogs/container-dialog"
import { ContainerTypeLabels } from "@/lib/api/types"

type DeleteTarget =
    | { type: "organization"; item: Organization }
    | { type: "structure"; item: Structure }
    | { type: "site"; item: Site }
    | { type: "location"; item: Location }
    | { type: "container"; item: Container }

function ActionMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <IconDotsVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={onEdit}>
                    <IconEdit className="size-4" />
                    Modifier
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                    <IconTrash className="size-4" />
                    Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function OrganizationPage() {
    const { data: organizations, isLoading: organizationsLoading } = useOrganizations()
    const { data: structures, isLoading: structuresLoading } = useStructures()
    const { data: sites, isLoading: sitesLoading } = useSites()
    const { data: locations, isLoading: locationsLoading } = useLocations()
    const { data: containers, isLoading: containersLoading } = useContainers()

    const isLoading =
        organizationsLoading ||
        structuresLoading ||
        sitesLoading ||
        locationsLoading ||
        containersLoading

    const [organizationDialogOpen, setOrganizationDialogOpen] = useState(false)
    const [structureDialogOpen, setStructureDialogOpen] = useState(false)
    const [siteDialogOpen, setSiteDialogOpen] = useState(false)
    const [locationDialogOpen, setLocationDialogOpen] = useState(false)
    const [containerDialogOpen, setContainerDialogOpen] = useState(false)

    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)
    const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null)
    const [selectedSite, setSelectedSite] = useState<Site | null>(null)
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
    const [selectedContainer, setSelectedContainer] = useState<Container | null>(null)

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

    const deleteItemName = deleteTarget
        ? "name" in deleteTarget.item
            ? deleteTarget.item.name
            : deleteTarget.item.identifier
        : ""

    const organizationMap = useMemo(
        () => new Map(organizations?.map((org) => [org.id, org]) || []),
        [organizations]
    )
    const structureMap = useMemo(
        () => new Map(structures?.map((structure) => [structure.id, structure]) || []),
        [structures]
    )
    const siteMap = useMemo(
        () => new Map(sites?.map((site) => [site.id, site]) || []),
        [sites]
    )
    const locationMap = useMemo(
        () => new Map(locations?.map((location) => [location.id, location]) || []),
        [locations]
    )

    const openDeleteDialog = (target: DeleteTarget) => {
        setDeleteTarget(target)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!deleteTarget) return

        try {
            switch (deleteTarget.type) {
                case "organization":
                    await organizationsApi.delete(deleteTarget.item.id)
                    await mutate("organizations")
                    toast.success("Organisation supprimee avec succes")
                    break
                case "structure":
                    await structuresApi.delete(deleteTarget.item.id)
                    await mutate("structures")
                    toast.success("Structure supprimee avec succes")
                    break
                case "site":
                    await sitesApi.delete(deleteTarget.item.id)
                    await mutate("sites")
                    toast.success("Site supprime avec succes")
                    break
                case "location":
                    await locationsApi.delete(deleteTarget.item.id)
                    await mutate("locations")
                    toast.success("Emplacement supprime avec succes")
                    break
                case "container":
                    await containersApi.delete(deleteTarget.item.id)
                    await mutate("containers")
                    toast.success("Conteneur supprime avec succes")
                    break
                default:
                    break
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression")
            console.error(error)
        } finally {
            setDeleteDialogOpen(false)
            setDeleteTarget(null)
        }
    }

    if (isLoading) {
        return (
            <SidebarProvider
                style={{
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties}
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-7 w-48" />
                                <Skeleton className="h-9 w-32" />
                            </div>
                            <Skeleton className="h-10 w-80" />
                            <div className="space-y-3">
                                {[...Array(5)].map((_, index) => (
                                    <Skeleton key={index} className="h-12 w-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6">
                        <div>
                            <h1 className="text-2xl font-semibold">Organisation</h1>
                            <p className="text-sm text-muted-foreground">
                                Gere les structures, sites, emplacements et conteneurs.
                            </p>
                        </div>
                        <Tabs defaultValue="organizations" className="w-full">
                            <TabsList className="flex flex-wrap">
                                <TabsTrigger value="organizations">Organisations</TabsTrigger>
                                <TabsTrigger value="structures">Structures</TabsTrigger>
                                <TabsTrigger value="sites">Sites</TabsTrigger>
                                <TabsTrigger value="locations">Emplacements</TabsTrigger>
                                <TabsTrigger value="containers">Conteneurs</TabsTrigger>
                            </TabsList>

                            <TabsContent value="organizations" className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">Organisations</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {organizations?.length || 0} organisation(s) enregistree(s)
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedOrganization(null)
                                            setOrganizationDialogOpen(true)
                                        }}
                                    >
                                        <IconPlus className="size-4" />
                                        Ajouter
                                    </Button>
                                </div>
                                <div className="mt-4 overflow-hidden rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nom</TableHead>
                                                <TableHead>Slug</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {organizations?.length ? (
                                                organizations.map((org) => (
                                                    <TableRow key={org.id}>
                                                        <TableCell className="font-medium">{org.name}</TableCell>
                                                        <TableCell className="text-muted-foreground">{org.slug}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={org.is_active ? "default" : "secondary"}>
                                                                {org.is_active ? "Active" : "Inactive"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <ActionMenu
                                                                onEdit={() => {
                                                                    setSelectedOrganization(org)
                                                                    setOrganizationDialogOpen(true)
                                                                }}
                                                                onDelete={() =>
                                                                    openDeleteDialog({ type: "organization", item: org })
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center">
                                                        Aucune organisation enregistree.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="structures" className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">Structures</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {structures?.length || 0} structure(s) enregistree(s)
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedStructure(null)
                                            setStructureDialogOpen(true)
                                        }}
                                        disabled={!organizations?.length}
                                    >
                                        <IconPlus className="size-4" />
                                        Ajouter
                                    </Button>
                                </div>
                                <div className="mt-4 overflow-hidden rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nom</TableHead>
                                                <TableHead>Organisation</TableHead>
                                                <TableHead>Niveau</TableHead>
                                                <TableHead>Code</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {structures?.length ? (
                                                structures.map((structure) => (
                                                    <TableRow key={structure.id}>
                                                        <TableCell className="font-medium">{structure.name}</TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {organizationMap.get(structure.organization)?.name || "-"}
                                                        </TableCell>
                                                        <TableCell>{structure.level}</TableCell>
                                                        <TableCell>{structure.code || "-"}</TableCell>
                                                        <TableCell className="text-right">
                                                            <ActionMenu
                                                                onEdit={() => {
                                                                    setSelectedStructure(structure)
                                                                    setStructureDialogOpen(true)
                                                                }}
                                                                onDelete={() =>
                                                                    openDeleteDialog({ type: "structure", item: structure })
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-24 text-center">
                                                        Aucune structure enregistree.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="sites" className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">Sites</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {sites?.length || 0} site(s) enregistre(s)
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedSite(null)
                                            setSiteDialogOpen(true)
                                        }}
                                        disabled={!structures?.length}
                                    >
                                        <IconPlus className="size-4" />
                                        Ajouter
                                    </Button>
                                </div>
                                <div className="mt-4 overflow-hidden rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nom</TableHead>
                                                <TableHead>Structure</TableHead>
                                                <TableHead>Adresse</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sites?.length ? (
                                                sites.map((site) => (
                                                    <TableRow key={site.id}>
                                                        <TableCell className="font-medium">{site.name}</TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {structureMap.get(site.structure)?.name || "-"}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {site.address || "-"}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <ActionMenu
                                                                onEdit={() => {
                                                                    setSelectedSite(site)
                                                                    setSiteDialogOpen(true)
                                                                }}
                                                                onDelete={() =>
                                                                    openDeleteDialog({ type: "site", item: site })
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center">
                                                        Aucun site enregistre.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="locations" className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">Emplacements</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {locations?.length || 0} emplacement(s) enregistre(s)
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedLocation(null)
                                            setLocationDialogOpen(true)
                                        }}
                                        disabled={!sites?.length}
                                    >
                                        <IconPlus className="size-4" />
                                        Ajouter
                                    </Button>
                                </div>
                                <div className="mt-4 overflow-hidden rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nom</TableHead>
                                                <TableHead>Site</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {locations?.length ? (
                                                locations.map((location) => (
                                                    <TableRow key={location.id}>
                                                        <TableCell className="font-medium">{location.name}</TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {siteMap.get(location.site)?.name || "-"}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {location.location_type || "-"}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <ActionMenu
                                                                onEdit={() => {
                                                                    setSelectedLocation(location)
                                                                    setLocationDialogOpen(true)
                                                                }}
                                                                onDelete={() =>
                                                                    openDeleteDialog({ type: "location", item: location })
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center">
                                                        Aucun emplacement enregistre.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="containers" className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">Conteneurs</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {containers?.length || 0} conteneur(s) enregistre(s)
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedContainer(null)
                                            setContainerDialogOpen(true)
                                        }}
                                        disabled={!structures?.length}
                                    >
                                        <IconPlus className="size-4" />
                                        Ajouter
                                    </Button>
                                </div>
                                <div className="mt-4 overflow-hidden rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Identifiant</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Structure</TableHead>
                                                <TableHead>Emplacement</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {containers?.length ? (
                                                containers.map((container) => (
                                                    <TableRow key={container.id}>
                                                        <TableCell className="font-medium">{container.identifier}</TableCell>
                                                        <TableCell>{ContainerTypeLabels[container.type]}</TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {structureMap.get(container.structure)?.name || "-"}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {container.location
                                                                ? locationMap.get(container.location)?.name || "-"
                                                                : "Non assigne"}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <ActionMenu
                                                                onEdit={() => {
                                                                    setSelectedContainer(container)
                                                                    setContainerDialogOpen(true)
                                                                }}
                                                                onDelete={() =>
                                                                    openDeleteDialog({ type: "container", item: container })
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-24 text-center">
                                                        Aucun conteneur enregistre.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <OrganizationDialog
                    open={organizationDialogOpen}
                    onOpenChange={setOrganizationDialogOpen}
                    organization={selectedOrganization}
                />
                <StructureDialog
                    open={structureDialogOpen}
                    onOpenChange={setStructureDialogOpen}
                    structure={selectedStructure}
                    organizations={organizations || []}
                    structures={structures || []}
                />
                <SiteDialog
                    open={siteDialogOpen}
                    onOpenChange={setSiteDialogOpen}
                    site={selectedSite}
                    structures={structures || []}
                />
                <LocationDialog
                    open={locationDialogOpen}
                    onOpenChange={setLocationDialogOpen}
                    location={selectedLocation}
                    sites={sites || []}
                />
                <ContainerDialog
                    open={containerDialogOpen}
                    onOpenChange={setContainerDialogOpen}
                    container={selectedContainer}
                    structures={structures || []}
                    locations={locations || []}
                />

                <DeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    title="Supprimer"
                    description="Cette action est irreversible."
                    itemName={deleteItemName}
                    onConfirm={confirmDelete}
                />
            </SidebarInset>
        </SidebarProvider>
    )
}
