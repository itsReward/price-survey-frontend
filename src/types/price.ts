// Price entry related types
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
    minPrice?: number
    maxPrice?: number
    search?: string
}

export interface PriceEntryUpdate {
    price?: number
    quantity?: number
    notes?: string
}

// Price statistics and analytics
export interface PriceStatistics {
    average: number
    minimum: number
    maximum: number
    median: number
    standardDeviation: number
    count: number
    trend: 'up' | 'down' | 'stable'
    percentageChange: number
}

export interface PriceTrend {
    date: string
    averagePrice: number
    entryCount: number
    minPrice: number
    maxPrice: number
}

export interface PriceComparison {
    storeId: number
    storeName: string
    averagePrice: number
    lowestPrice: number
    highestPrice: number
    entryCount: number
    lastUpdated: string
}

// Bulk operations
export interface BulkPriceEntry {
    storeId: number
    productId: number
    price: number
    quantity: number
    notes?: string
}

export interface BulkPriceEntryRequest {
    entries: BulkPriceEntry[]
    skipDuplicates?: boolean
    updateExisting?: boolean
}

export interface BulkPriceEntryResponse {
    successCount: number
    failureCount: number
    errors: Array<{
        index: number
        error: string
        entry: BulkPriceEntry
    }>
}

// Price alerts and notifications
export interface PriceAlert {
    id: number
    userId: number
    productId: number
    storeId?: number
    condition: 'below' | 'above' | 'change'
    targetPrice: number
    percentage?: number
    isActive: boolean
    createdAt: string
    lastTriggered?: string
}

export interface PriceAlertRequest {
    productId: number
    storeId?: number
    condition: 'below' | 'above' | 'change'
    targetPrice: number
    percentage?: number
}

// Price history and tracking
export interface PriceHistory {
    date: string
    price: number
    storeId: number
    storeName: string
    userId: number
    userName: string
}

export interface PriceTrackingData {
    productId: number
    productName: string
    currentPrice: number
    priceHistory: PriceHistory[]
    statistics: PriceStatistics
    trends: PriceTrend[]
}

// Price prediction and forecasting
export interface PricePrediction {
    productId: number
    storeId?: number
    predictedPrice: number
    confidence: number
    timeframe: string
    factors: string[]
}

// Export/Import related types
export interface PriceEntryExportOptions {
    format: 'csv' | 'xlsx' | 'json'
    includeFields: string[]
    dateRange?: {
        startDate: string
        endDate: string
    }
    filters?: PriceEntryFilters
}

export interface PriceEntryImportOptions {
    format: 'csv' | 'xlsx'
    hasHeaders: boolean
    columnMapping: Record<string, string>
    skipDuplicates: boolean
    updateExisting: boolean
}

// Price analysis types
export interface PriceAnalysis {
    productId: number
    productName: string
    analysis: {
        averagePrice: number
        priceRange: {
            min: number
            max: number
        }
        volatility: number
        bestValue: {
            storeId: number
            storeName: string
            price: number
        }
        worstValue: {
            storeId: number
            storeName: string
            price: number
        }
        trend: {
            direction: 'up' | 'down' | 'stable'
            percentage: number
            period: string
        }
    }
    recommendations: string[]
}

// Market research types
export interface MarketData {
    category: string
    averagePrice: number
    priceRange: {
        min: number
        max: number
    }
    topBrands: Array<{
        brand: string
        averagePrice: number
        marketShare: number
    }>
    priceDistribution: Array<{
        range: string
        count: number
        percentage: number
    }>
}

// Price validation types
export interface PriceValidationRule {
    id: number
    name: string
    description: string
    condition: string
    threshold: number
    isActive: boolean
}

export interface PriceValidationResult {
    isValid: boolean
    warnings: string[]
    errors: string[]
    suggestedPrice?: number
}

// Utility types for forms and UI
export interface PriceFormData {
    storeId: number | null
    productId: number | null
    price: string
    quantity: string
    notes: string
}

export interface PriceDisplayOptions {
    showCurrency: boolean
    currencySymbol: string
    decimalPlaces: number
    thousandsSeparator: string
    decimalSeparator: string
}

// Type guards and utility functions
export const isPriceEntry = (obj: any): obj is PriceEntry => {
    return obj && typeof obj === 'object' && 'id' in obj && 'price' in obj && 'product' in obj
}

export const formatPrice = (
    price: number,
    options: Partial<PriceDisplayOptions> = {}
): string => {
    const {
        showCurrency = true,
        currencySymbol = '$',
        decimalPlaces = 2,
        thousandsSeparator = ',',
        decimalSeparator = '.'
    } = options

    const formattedNumber = price.toFixed(decimalPlaces)
    const parts = formattedNumber.split('.')
    const integerPart = parts[0] || ''
    const decimalPart = parts[1] || ''

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)
    const result = decimalPart ? `${formattedInteger}${decimalSeparator}${decimalPart}` : formattedInteger

    return showCurrency ? `${currencySymbol}${result}` : result
}

export const calculatePriceChange = (currentPrice: number, previousPrice: number): {
    change: number
    percentage: number
    direction: 'up' | 'down' | 'stable'
} => {
    const change = currentPrice - previousPrice
    const percentage = previousPrice > 0 ? (change / previousPrice) * 100 : 0

    let direction: 'up' | 'down' | 'stable' = 'stable'
    if (Math.abs(percentage) > 0.01) {
        direction = percentage > 0 ? 'up' : 'down'
    }

    return { change, percentage, direction }
}