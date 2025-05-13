import { apiService } from './api'
import { User, UpdateUserRequest, UserRequest } from '@/types/auth'

class UserService {
    async getUsers(): Promise<User[]> {
        return await apiService.get<User[]>('/api/admin/users')
    }

    async getUserById(id: number): Promise<User> {
        return await apiService.get<User>(`/api/admin/users/${id}`)
    }

    async createUser(data: UserRequest): Promise<User> {
        return await apiService.post<User>('/api/admin/users', data)
    }

    async updateUser(id: number, data: UpdateUserRequest): Promise<User> {
        return await apiService.put<User>(`/api/admin/users/${id}`, data)
    }

    async deleteUser(id: number): Promise<void> {
        return await apiService.delete(`/api/admin/users/${id}`)
    }

    async getCurrentUser(): Promise<User> {
        return await apiService.get<User>('/api/auth/me')
    }

    async updateProfile(data: UpdateUserRequest): Promise<User> {
        return await apiService.put<User>('/api/auth/me', data)
    }

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        return await apiService.post('/api/users/change-password', {
            currentPassword,
            newPassword
        })
    }

    async uploadAvatar(file: File): Promise<{ url: string }> {
        return await apiService.uploadFile<{ url: string }>('/api/users/avatar', file)
    }

    async getAssignedStores(userId: number): Promise<any[]> {
        return await apiService.get<any[]>(`/api/admin/users/${userId}/stores`)
    }

    async assignStoresToUser(userId: number, storeIds: number[]): Promise<void> {
        return await apiService.put(`/api/admin/users/${userId}/stores`, { storeIds })
    }

    async removeStoreFromUser(userId: number, storeId: number): Promise<void> {
        return await apiService.delete(`/api/admin/users/${userId}/stores/${storeId}`)
    }

    // User activity tracking
    async getUserActivity(userId: number, dateRange?: { startDate: string; endDate: string }): Promise<any[]> {
        const params = new URLSearchParams()
        if (dateRange?.startDate) params.append('startDate', dateRange.startDate)
        if (dateRange?.endDate) params.append('endDate', dateRange.endDate)

        const queryString = params.toString()
        const url = `/api/admin/users/${userId}/activity${queryString ? `?${queryString}` : ''}`

        return await apiService.get<any[]>(url)
    }

    // User permissions
    async getUserPermissions(userId: number): Promise<string[]> {
        return await apiService.get<string[]>(`/api/admin/users/${userId}/permissions`)
    }

    async updateUserPermissions(userId: number, permissions: string[]): Promise<void> {
        return await apiService.put(`/api/admin/users/${userId}/permissions`, { permissions })
    }

    // User roles
    async getRoles(): Promise<Array<{ id: number; name: string; permissions: string[] }>> {
        return await apiService.get<Array<{ id: number; name: string; permissions: string[] }>>('/api/admin/roles')
    }
}

export const userService = new UserService()