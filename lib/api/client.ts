import type {
    User,
    UserCreate,
    TokenPair,
    LoginRequest,
    RegisterRequest,
    Organization,
    Structure,
    Site,
    Location,
    Container,
    Item,
    Batch,
    StockLine,
    StockMovement,
    StockMovementRequest,
    LotTemplate,
    LotTemplateItem,
    LotInstance,
    InventorySession,
    InventoryLine,
    Membership,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message)
        this.name = 'ApiError'
    }
}

function getStoredTokens(): TokenPair | null {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('auth_tokens')
    if (!stored) return null
    try {
        return JSON.parse(stored)
    } catch {
        return null
    }
}

function setStoredTokens(tokens: TokenPair | null) {
    if (typeof window === 'undefined') return
    if (tokens) {
        localStorage.setItem('auth_tokens', JSON.stringify(tokens))
    } else {
        localStorage.removeItem('auth_tokens')
    }
}

async function refreshAccessToken(): Promise<string | null> {
    const tokens = getStoredTokens()
    if (!tokens?.refresh) return null

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/jwt/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: tokens.refresh }),
        })

        if (!response.ok) {
            setStoredTokens(null)
            return null
        }

        const data = await response.json()
        const newTokens: TokenPair = {
            access: data.access,
            refresh: tokens.refresh,
        }
        setStoredTokens(newTokens)
        return data.access
    } catch {
        setStoredTokens(null)
        return null
    }
}

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retry = true
): Promise<T> {
    const tokens = getStoredTokens()
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    }

    if (tokens?.access) {
        headers['Authorization'] = `Bearer ${tokens.access}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (response.status === 401 && retry) {
        const newAccessToken = await refreshAccessToken()
        if (newAccessToken) {
            return apiRequest<T>(endpoint, options, false)
        }
        throw new ApiError(401, 'Session expirée. Veuillez vous reconnecter.')
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const message = errorData.detail || errorData.message || 'Une erreur est survenue'
        throw new ApiError(response.status, message)
    }

    if (response.status === 204) {
        return {} as T
    }

    return response.json()
}

// Auth API
export const authApi = {
    login: async (credentials: LoginRequest): Promise<TokenPair> => {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/jwt/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new ApiError(
                response.status,
                errorData.detail || 'Email ou mot de passe incorrect'
            )
        }

        const tokens = await response.json()
        setStoredTokens(tokens)
        return tokens
    },

    register: async (data: RegisterRequest): Promise<UserCreate> => {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new ApiError(
                response.status,
                errorData.detail || errorData.email?.[0] || "Erreur lors de l'inscription"
            )
        }

        return response.json()
    },

    logout: async (): Promise<void> => {
        try {
            await apiRequest('/api/v1/auth/jwt/logout/', { method: 'POST' })
        } finally {
            setStoredTokens(null)
        }
    },

    getTokens: getStoredTokens,
    setTokens: setStoredTokens,
}

// Users API
export const usersApi = {
    list: () => apiRequest<User[]>('/api/v1/users/'),
    get: (id: number) => apiRequest<User>(`/api/v1/users/${id}/`),
    getMe: () => apiRequest<User>('/api/v1/users/me/'),
    update: (id: number, data: Partial<User>) =>
        apiRequest<User>(`/api/v1/users/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
}

// Organizations API
export const organizationsApi = {
    list: () => apiRequest<Organization[]>('/api/v1/organizations/'),
    get: (id: number) => apiRequest<Organization>(`/api/v1/organizations/${id}/`),
    create: (data: Omit<Organization, 'id'>) =>
        apiRequest<Organization>('/api/v1/organizations/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<Organization>) =>
        apiRequest<Organization>(`/api/v1/organizations/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/organizations/${id}/`, { method: 'DELETE' }),
}

// Structures API
export const structuresApi = {
    list: () => apiRequest<Structure[]>('/api/v1/structures/'),
    get: (id: number) => apiRequest<Structure>(`/api/v1/structures/${id}/`),
    create: (data: Omit<Structure, 'id'>) =>
        apiRequest<Structure>('/api/v1/structures/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<Structure>) =>
        apiRequest<Structure>(`/api/v1/structures/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/structures/${id}/`, { method: 'DELETE' }),
}

// Sites API
export const sitesApi = {
    list: () => apiRequest<Site[]>('/api/v1/sites/'),
    get: (id: number) => apiRequest<Site>(`/api/v1/sites/${id}/`),
    create: (data: Omit<Site, 'id'>) =>
        apiRequest<Site>('/api/v1/sites/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<Site>) =>
        apiRequest<Site>(`/api/v1/sites/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/sites/${id}/`, { method: 'DELETE' }),
}

// Locations API
export const locationsApi = {
    list: () => apiRequest<Location[]>('/api/v1/locations/'),
    get: (id: number) => apiRequest<Location>(`/api/v1/locations/${id}/`),
    create: (data: Omit<Location, 'id'>) =>
        apiRequest<Location>('/api/v1/locations/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<Location>) =>
        apiRequest<Location>(`/api/v1/locations/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/locations/${id}/`, { method: 'DELETE' }),
}

// Containers API
export const containersApi = {
    list: () => apiRequest<Container[]>('/api/v1/containers/'),
    get: (id: number) => apiRequest<Container>(`/api/v1/containers/${id}/`),
    create: (data: Omit<Container, 'id'>) =>
        apiRequest<Container>('/api/v1/containers/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<Container>) =>
        apiRequest<Container>(`/api/v1/containers/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/containers/${id}/`, { method: 'DELETE' }),
}

// Items API
export const itemsApi = {
    list: () => apiRequest<Item[]>('/api/v1/items/'),
    get: (id: number) => apiRequest<Item>(`/api/v1/items/${id}/`),
    create: (data: Omit<Item, 'id'>) =>
        apiRequest<Item>('/api/v1/items/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<Item>) =>
        apiRequest<Item>(`/api/v1/items/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/items/${id}/`, { method: 'DELETE' }),
}

// Batches API
export const batchesApi = {
    list: () => apiRequest<Batch[]>('/api/v1/batches/'),
    get: (id: number) => apiRequest<Batch>(`/api/v1/batches/${id}/`),
    create: (data: Omit<Batch, 'id'>) =>
        apiRequest<Batch>('/api/v1/batches/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<Batch>) =>
        apiRequest<Batch>(`/api/v1/batches/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/batches/${id}/`, { method: 'DELETE' }),
}

// Stock Lines API
export const stockLinesApi = {
    list: () => apiRequest<StockLine[]>('/api/v1/stock-lines/'),
    get: (id: number) => apiRequest<StockLine>(`/api/v1/stock-lines/${id}/`),
    create: (data: Omit<StockLine, 'id'>) =>
        apiRequest<StockLine>('/api/v1/stock-lines/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<StockLine>) =>
        apiRequest<StockLine>(`/api/v1/stock-lines/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/stock-lines/${id}/`, { method: 'DELETE' }),
}

// Stock Movements API
export const stockMovementsApi = {
    list: () => apiRequest<StockMovement[]>('/api/v1/stock-movements/'),
    get: (id: number) => apiRequest<StockMovement>(`/api/v1/stock-movements/${id}/`),
    create: (data: StockMovementRequest) =>
        apiRequest<StockMovement>('/api/v1/stock-movements/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<StockMovementRequest>) =>
        apiRequest<StockMovement>(`/api/v1/stock-movements/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/stock-movements/${id}/`, { method: 'DELETE' }),
}

// Lot Templates API
export const lotTemplatesApi = {
    list: () => apiRequest<LotTemplate[]>('/api/v1/lot-templates/'),
    get: (id: number) => apiRequest<LotTemplate>(`/api/v1/lot-templates/${id}/`),
    create: (data: Omit<LotTemplate, 'id'>) =>
        apiRequest<LotTemplate>('/api/v1/lot-templates/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<LotTemplate>) =>
        apiRequest<LotTemplate>(`/api/v1/lot-templates/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/lot-templates/${id}/`, { method: 'DELETE' }),
}

// Lot Template Items API
export const lotTemplateItemsApi = {
    list: () => apiRequest<LotTemplateItem[]>('/api/v1/lot-template-items/'),
    get: (id: number) => apiRequest<LotTemplateItem>(`/api/v1/lot-template-items/${id}/`),
    create: (data: Omit<LotTemplateItem, 'id'>) =>
        apiRequest<LotTemplateItem>('/api/v1/lot-template-items/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<LotTemplateItem>) =>
        apiRequest<LotTemplateItem>(`/api/v1/lot-template-items/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/lot-template-items/${id}/`, { method: 'DELETE' }),
}

// Lot Instances API
export const lotInstancesApi = {
    list: () => apiRequest<LotInstance[]>('/api/v1/lot-instances/'),
    get: (id: number) => apiRequest<LotInstance>(`/api/v1/lot-instances/${id}/`),
    create: (data: Omit<LotInstance, 'id'>) =>
        apiRequest<LotInstance>('/api/v1/lot-instances/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<LotInstance>) =>
        apiRequest<LotInstance>(`/api/v1/lot-instances/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/lot-instances/${id}/`, { method: 'DELETE' }),
}

// Inventory Sessions API
export const inventorySessionsApi = {
    list: () => apiRequest<InventorySession[]>('/api/v1/inventory-sessions/'),
    get: (id: number) => apiRequest<InventorySession>(`/api/v1/inventory-sessions/${id}/`),
    create: (data: Omit<InventorySession, 'id' | 'created_at' | 'updated_at'>) =>
        apiRequest<InventorySession>('/api/v1/inventory-sessions/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<InventorySession>) =>
        apiRequest<InventorySession>(`/api/v1/inventory-sessions/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/inventory-sessions/${id}/`, { method: 'DELETE' }),
}

// Inventory Lines API
export const inventoryLinesApi = {
    list: () => apiRequest<InventoryLine[]>('/api/v1/inventory-lines/'),
    get: (id: number) => apiRequest<InventoryLine>(`/api/v1/inventory-lines/${id}/`),
    create: (data: Omit<InventoryLine, 'id'>) =>
        apiRequest<InventoryLine>('/api/v1/inventory-lines/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<InventoryLine>) =>
        apiRequest<InventoryLine>(`/api/v1/inventory-lines/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/inventory-lines/${id}/`, { method: 'DELETE' }),
}

// Memberships API
export const membershipsApi = {
    list: () => apiRequest<Membership[]>('/api/v1/memberships/'),
    get: (id: number) => apiRequest<Membership>(`/api/v1/memberships/${id}/`),
    create: (data: Omit<Membership, 'id' | 'created_at'>) =>
        apiRequest<Membership>('/api/v1/memberships/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: Partial<Membership>) =>
        apiRequest<Membership>(`/api/v1/memberships/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiRequest<void>(`/api/v1/memberships/${id}/`, { method: 'DELETE' }),
}

export { ApiError }
