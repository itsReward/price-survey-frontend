import { apiService } from './api'
import { User, UserRequest, UpdateUserRequest, UserStatusRequest, AssignStoresRequest } from '@/types/auth'

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

    async updateUserStatus(id: number, isActive: boolean): Promise<User> {
        return await apiService.put<User>(`/api/admin/users/${id}/status`, { isActive })
    }

    async assignStoresToUser(id: number, storeIds: number[]): Promise<User> {
        return await apiService.put<User>(`/api/admin/users/${id}/stores`, { storeIds })
    }

    async deleteUser(id: number): Promise<void> {
        return await apiService.delete(`/api/admin/users/${id}`)
    }

    async getPendingUsers(): Promise<User[]> {
        return await apiService.get<User[]>('/api/admin/users/pending')
    }

    async approveUser(id: number): Promise<User> {
        return await apiService.put<User>(`/api/admin/users/${id}/approve`, {})
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
}

export const userService = new UserService()