import { apiService } from './api'
import { PriceEntry, PriceEntryRequest, PriceEntryFilters } from '@/types/priceEntry'

class PriceEntryService {
    async getPriceEntries(filters: PriceEntryFilters = {}): Promise<PriceEntry[]> {
        const params = new URLSearchParams()

        if (filters.userId) params.append('userId', filters.userId.toString())
        if (filters.storeId) params.append('storeId', filters.storeId.toString())
        if (filters.productId) params.append('productId', filters.productId.toString())
        if (filters.startDate) params.append('startDate', filters.startDate)
        if (filters.endDate) params.append('endDate', filters.endDate)

        const queryString = params.toString()
        const url = `/api/price-entries${queryString ? `?${queryString}` : ''}`

        return await apiService.get<PriceEntry[]>(url)
    }

    async createPriceEntry(data: PriceEntryRequest): Promise<PriceEntry> {
        console.log('PriceEntryService - createPriceEntry called with:', data)
        console.log('Data types:', {
            storeId: typeof data.storeId,
            productId: typeof data.productId,
            price: typeof data.price,
            quantity: typeof data.quantity
        })

        const response = await apiService.post<PriceEntry>('/api/price-entries', data)
        console.log('PriceEntryService - createPriceEntry response:', response)
        return response
    }

    async updatePriceEntry(id: number, data: PriceEntryRequest): Promise<PriceEntry> {
        console.log('PriceEntryService - updatePriceEntry called with id:', id, 'data:', data)
        return await apiService.put<PriceEntry>(`/api/price-entries/${id}`, data)
    }

    async deletePriceEntry(id: number): Promise<void> {
        return await apiService.delete(`/api/price-entries/${id}`)
    }

    async getPriceEntryById(id: number): Promise<PriceEntry> {
        return await apiService.get<PriceEntry>(`/api/price-entries/${id}`)
    }

    async getPriceEntriesByStore(storeId: number): Promise<PriceEntry[]> {
        return await apiService.get<PriceEntry[]>(`/api/price-entries/store/${storeId}`)
    }

    async getPriceEntriesByProduct(productId: number): Promise<PriceEntry[]> {
        return await apiService.get<PriceEntry[]>(`/api/price-entries/product/${productId}`)
    }

    async getMyPriceEntries(): Promise<PriceEntry[]> {
        return await apiService.get<PriceEntry[]>('/api/price-entries/my-entries')
    }
}

export const priceEntryService = new PriceEntryService()