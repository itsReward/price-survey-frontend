import { apiService } from './api'
import { Store, StoreRequest, UpdateStoreRequest } from '@/types/store'

class StoreService {
    async getStores(): Promise<Store[]> {
        return await apiService.get<Store[]>('/api/stores')
    }

    async getStoreById(id: number): Promise<Store> {
        return await apiService.get<Store>(`/api/stores/${id}`)
    }

    async createStore(data: StoreRequest): Promise<Store> {
        return await apiService.post<Store>('/api/stores', data)
    }

    async updateStore(id: number, data: UpdateStoreRequest): Promise<Store> {
        return await apiService.put<Store>(`/api/stores/${id}`, data)
    }

    async deleteStore(id: number): Promise<void> {
        return await apiService.delete(`/api/stores/${id}`)
    }

    async getStoresByCity(city: string): Promise<Store[]> {
        return await apiService.get<Store[]>(`/api/stores/city/${city}`)
    }

    async getStoresByRegion(region: string): Promise<Store[]> {
        return await apiService.get<Store[]>(`/api/stores/region/${region}`)
    }

    async getStoresForMap(): Promise<Array<{
        id: number;
        name: string;
        address: string;
        city: string;
        latitude: number;
        longitude: number;
        isActive: boolean;
    }>> {
        try {
            // First try the dedicated map endpoint
            return await apiService.get<any[]>('/api/stores/map')
        } catch (error) {
            // Fallback to all stores if map endpoint doesn't exist
            console.warn('Map endpoint not available, falling back to all stores')
            const allStores = await this.getStores()

            // Filter and transform stores with valid coordinates
            return allStores
                .filter(store => store.latitude !== null && store.longitude !== null)
                .map(store => ({
                    id: store.id,
                    name: store.name,
                    address: store.address,
                    city: store.city,
                    latitude: store.latitude!,
                    longitude: store.longitude!,
                    isActive: store.isActive
                }))
        }
    }
}

export const storeService = new StoreService()