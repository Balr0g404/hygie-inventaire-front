// API Types based on OpenAPI specification

export interface User {
    id: number
    email: string
    full_name: string
    role: string
    is_active: boolean
    is_staff: boolean
    is_superuser: boolean
}

export interface UserCreate {
    id: number
    email: string
    full_name: string
}

export interface TokenPair {
    access: string
    refresh: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    full_name?: string
}

export interface Organization {
    id: number
    name: string
    slug: string
    is_active: boolean
}

export interface Structure {
    id: number
    organization: number
    level: 'NATIONAL' | 'TERRITORIAL' | 'LOCAL'
    name: string
    parent: number | null
    code: string
    is_active: boolean
}

export interface Site {
    id: number
    structure: number
    name: string
    address: string
}

export interface Location {
    id: number
    site: number
    name: string
    location_type: string
}

export type ContainerType =
    | 'BAG_INTERVENTION'
    | 'BAG_OXY'
    | 'BAG_FIRST_AID'
    | 'VEHICLE_VPSP'
    | 'OXYGEN_CYLINDER'
    | 'RESERVE_CASE'
    | 'OTHER'

export const ContainerTypeLabels: Record<ContainerType, string> = {
    BAG_INTERVENTION: "Sac d'intervention",
    BAG_OXY: "Sac d'oxygenotherapie",
    BAG_FIRST_AID: "Sac de premiers secours",
    VEHICLE_VPSP: "VPSP",
    OXYGEN_CYLINDER: "Bouteille O2",
    RESERVE_CASE: "Malle/Sac reserve",
    OTHER: "Autre",
}

export interface Container {
    id: number
    structure: number
    location: number | null
    type: ContainerType
    identifier: string
    label: string
    is_active: boolean
}

export interface Item {
    id: number
    organization: number
    name: string
    sku: string
    unit: string
    category: string
    is_consumable: boolean
    requires_expiry: boolean
    requires_lot_number: boolean
    is_active: boolean
}

export interface Batch {
    id: number
    item: number
    lot_number: string
    expires_at: string | null
}

export interface StockLine {
    id: number
    lot_instance: number
    item: number
    batch: number | null
    quantity: string
}

export type StockMovementType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUST' | 'CONSUME' | 'RESTOCK'

export const StockMovementTypeLabels: Record<StockMovementType, string> = {
    IN: 'Entree',
    OUT: 'Sortie',
    TRANSFER: 'Transfert',
    ADJUST: 'Ajustement',
    CONSUME: 'Consommation mission',
    RESTOCK: 'Reassort',
}

export interface StockMovement {
    id: number
    structure: number
    created_by: number | null
    type: StockMovementType
    from_lot: number | null
    to_lot: number | null
    item: number
    batch: number | null
    quantity: string
    reason: string
    created_at: string
    updated_at: string
}

export interface StockMovementRequest {
    structure: number
    created_by?: number | null
    type: StockMovementType
    from_lot?: number | null
    to_lot?: number | null
    item: number
    batch?: number | null
    quantity: string
    reason?: string
}

export type LotCode = 'LOT_A' | 'LOT_B' | 'LOT_C' | 'VPSP'

export const LotCodeLabels: Record<LotCode, string> = {
    LOT_A: 'Lot A (secours)',
    LOT_B: 'Lot B (1er secours)',
    LOT_C: 'Lot C (intervention)',
    VPSP: 'VPSP',
}

export interface LotTemplate {
    id: number
    organization: number
    code: LotCode
    name: string
    version: string
    is_active: boolean
}

export type ItemGroup =
    | 'ADMIN_DOCS'
    | 'COMMS'
    | 'PROTECTION'
    | 'VITALS'
    | 'WOUNDS'
    | 'TRAUMA'
    | 'RESUSC'
    | 'DIVERS'
    | 'SPECIFIC_KITS'

export const ItemGroupLabels: Record<ItemGroup, string> = {
    ADMIN_DOCS: 'Administratif/Documents',
    COMMS: 'Communication',
    PROTECTION: 'Protection/Hygiene/Securite',
    VITALS: 'Bilans',
    WOUNDS: 'Hemorragies/Plaies',
    TRAUMA: 'Immobilisations/Trauma',
    RESUSC: 'Reanimation',
    DIVERS: 'Divers',
    SPECIFIC_KITS: 'Kits specifiques',
}

export interface LotTemplateItem {
    id: number
    template: number
    group: ItemGroup
    item: number
    expected_qty: string
    notes: string
}

export interface LotInstance {
    id: number
    template: number
    container: number
    last_checked_at: string | null
    next_check_due_at: string | null
    status: string
}

export interface InventorySession {
    id: number
    structure: number
    container: number
    validated_at: string | null
    validated_by: number | null
    created_at: string
    updated_at: string
}

export interface InventoryLine {
    id: number
    session: number
    item: number
    expected_qty: string
    counted_qty: string
}

export type MembershipRole = 'VIEWER' | 'REFERENT' | 'ADMIN'

export const MembershipRoleLabels: Record<MembershipRole, string> = {
    VIEWER: 'Lecteur',
    REFERENT: 'Referent materiel',
    ADMIN: 'Admin structure',
}

export type MembershipGrade = 'STAGIAIRE' | 'PSE1' | 'PSE2' | 'CI' | 'CDPE' | 'CDMGE'

export const MembershipGradeLabels: Record<MembershipGrade, string> = {
    STAGIAIRE: 'Stagiaire',
    PSE1: 'PSE1',
    PSE2: 'PSE2',
    CI: "Chef d'Intervention",
    CDPE: 'Chef DPS petite envergure',
    CDMGE: 'Chef DPS moyenne/grande envergure',
}

export interface Membership {
    id: number
    user: number
    structure: number
    role: MembershipRole
    grade: MembershipGrade
    is_fc_up_to_date: boolean
    is_active: boolean
    created_at: string
}
