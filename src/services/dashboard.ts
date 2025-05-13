import { apiService } from './api'
import { DashboardData, DashboardFilters } from '@/types/dashboard'

class DashboardService {
    async getDashboardData(filters: DashboardFilters): Promise<DashboardData> {
        const params = new URLSearchParams()

        if (filters.storeId) params.append('storeId', filters.storeId.toString())
        if (filters.productId) params.append('productId', filters.productId.toString())
        if (filters.userId) params.append('userId', filters.userId.toString())
        if (filters.startDate) params.append('startDate', filters.startDate)
        if (filters.endDate) params.append('endDate', filters.endDate)

        const queryString = params.toString()
        const url = `/api/dashboard${queryString ? `?${queryString}` : ''}`

        return await apiService.get<DashboardData>(url)
    }
}

export const dashboardService = new DashboardService()