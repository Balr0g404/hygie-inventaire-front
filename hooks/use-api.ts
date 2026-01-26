"use client"

import useSWR from "swr"
import {
    itemsApi,
    stockMovementsApi,
    containersApi,
    sitesApi,
    locationsApi,
    batchesApi,
    stockLinesApi,
    lotInstancesApi,
    inventorySessionsApi,
    usersApi,
    structuresApi,
} from "@/lib/api/client"
import type {
    Item,
    StockMovement,
    Container,
    Site,
    Location,
    Batch,
    StockLine,
    LotInstance,
    InventorySession,
    User,
    Structure,
} from "@/lib/api/types"

// Items
export function useItems() {
    return useSWR<Item[]>("items", () => itemsApi.list())
}

export function useItem(id: number | null) {
    return useSWR<Item>(
        id ? `items/${id}` : null,
        id ? () => itemsApi.get(id) : null
    )
}

// Stock Movements
export function useStockMovements() {
    return useSWR<StockMovement[]>("stock-movements", () =>
        stockMovementsApi.list()
    )
}

export function useStockMovement(id: number | null) {
    return useSWR<StockMovement>(
        id ? `stock-movements/${id}` : null,
        id ? () => stockMovementsApi.get(id) : null
    )
}

// Containers
export function useContainers() {
    return useSWR<Container[]>("containers", () => containersApi.list())
}

export function useContainer(id: number | null) {
    return useSWR<Container>(
        id ? `containers/${id}` : null,
        id ? () => containersApi.get(id) : null
    )
}

// Sites
export function useSites() {
    return useSWR<Site[]>("sites", () => sitesApi.list())
}

export function useSite(id: number | null) {
    return useSWR<Site>(
        id ? `sites/${id}` : null,
        id ? () => sitesApi.get(id) : null
    )
}

// Locations
export function useLocations() {
    return useSWR<Location[]>("locations", () => locationsApi.list())
}

export function useLocation(id: number | null) {
    return useSWR<Location>(
        id ? `locations/${id}` : null,
        id ? () => locationsApi.get(id) : null
    )
}

// Batches
export function useBatches() {
    return useSWR<Batch[]>("batches", () => batchesApi.list())
}

export function useBatch(id: number | null) {
    return useSWR<Batch>(
        id ? `batches/${id}` : null,
        id ? () => batchesApi.get(id) : null
    )
}

// Stock Lines
export function useStockLines() {
    return useSWR<StockLine[]>("stock-lines", () => stockLinesApi.list())
}

export function useStockLine(id: number | null) {
    return useSWR<StockLine>(
        id ? `stock-lines/${id}` : null,
        id ? () => stockLinesApi.get(id) : null
    )
}

// Lot Instances
export function useLotInstances() {
    return useSWR<LotInstance[]>("lot-instances", () => lotInstancesApi.list())
}

export function useLotInstance(id: number | null) {
    return useSWR<LotInstance>(
        id ? `lot-instances/${id}` : null,
        id ? () => lotInstancesApi.get(id) : null
    )
}

// Inventory Sessions
export function useInventorySessions() {
    return useSWR<InventorySession[]>("inventory-sessions", () =>
        inventorySessionsApi.list()
    )
}

export function useInventorySession(id: number | null) {
    return useSWR<InventorySession>(
        id ? `inventory-sessions/${id}` : null,
        id ? () => inventorySessionsApi.get(id) : null
    )
}

// Users
export function useUsers() {
    return useSWR<User[]>("users", () => usersApi.list())
}

export function useUser(id: number | null) {
    return useSWR<User>(
        id ? `users/${id}` : null,
        id ? () => usersApi.get(id) : null
    )
}

export function useCurrentUser() {
    return useSWR<User>("users/me", () => usersApi.getMe())
}

// Structures
export function useStructures() {
    return useSWR<Structure[]>("structures", () => structuresApi.list())
}

export function useStructure(id: number | null) {
    return useSWR<Structure>(
        id ? `structures/${id}` : null,
        id ? () => structuresApi.get(id) : null
    )
}
