// Store Types
export default interface Store {
    id: number
    name: string
    address: string
    city: string
    region: string
    country: string
    latitude: number | null
    longitude: number | null
    isActive: boolean
    createdAt: string
    updatedAt: string | null
}

export interface StoreRequest {
    name: string
    address: string
    city: string
    region: string
    country: string
    latitude?: number
    longitude?: number
}

export interface UpdateStoreRequest {
    name?: string
    address?: string
    city?: string
    region?: string
    country?: string
    latitude?: number
    longitude?: number
    isActive?: boolean
}