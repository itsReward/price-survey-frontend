// Price Entry Types
export interface PriceEntry {
    id: number
    user: {
        id: number
        email: string
        firstName: string
        lastName: string
    }
    store: {
        id: number
        name: string
        address: string
        city: string
    }
    product: {
        id: number
        name: string
        category: string
        volumeMl: number
        brand: string | null
    }
    price: number
    quantity: number
    notes: string | null
    createdAt: string
    updatedAt: string | null
}

export interface PriceEntryRequest {
    storeId: number
    productId: number
    price: number
    quantity: number
    notes?: string
}

export interface PriceEntryFilters {
    userId?: number
    storeId?: number
    productId?: number
    startDate?: string
    endDate?: string
}