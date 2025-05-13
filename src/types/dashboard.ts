// Dashboard Types
export interface DashboardFilters {
    storeId?: number
    productId?: number
    userId?: number
    startDate?: string
    endDate?: string
}

export interface DashboardData {
    totalPriceEntries: number
    totalStores: number
    totalProducts: number
    recentEntries: RecentEntry[]
    priceByStore: PriceByStore[]
    priceByProduct: PriceByProduct[]
    priceByDate: PriceByDate[]
    userActivity: UserActivity[]
}

export interface RecentEntry {
    id: number
    storeName: string
    productName: string
    price: number
    quantity: number
    createdAt: string
}

export interface PriceByStore {
    storeId: number
    storeName: string
    averagePrice: number
    entryCount: number
}

export interface PriceByProduct {
    productId: number
    productName: string
    averagePrice: number
    entryCount: number
}

export interface PriceByDate {
    date: string
    averagePrice: number
    entryCount: number
}

export interface UserActivity {
    userId: number
    userEmail: string
    userName: string
    lastLogin: string | null
    entriesCount: number
}