// Product Types
export interface Product {
    id: number
    name: string
    description: string | null
    category: string
    volumeMl: number
    brand: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string | null
}

export interface ProductRequest {
    name: string
    description?: string
    category: string
    volumeMl: number
    brand?: string
}

export interface UpdateProductRequest {
    name?: string
    description?: string
    category?: string
    volumeMl?: number
    brand?: string
    isActive?: boolean
}