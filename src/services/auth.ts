import { apiService } from './api'
import { LoginRequest, LoginResponse, User } from '@/types/auth'

class AuthService {
    async login(email: string, password: string): Promise<LoginResponse> {
        const loginRequest: LoginRequest = { email, password }
        return await apiService.post<LoginResponse>('/api/auth/login', loginRequest)
    }

    async getCurrentUser(): Promise<User> {
        return await apiService.get<User>('/api/auth/me')
    }

    async logout(): Promise<void> {
        // Clear token from localStorage
        localStorage.removeItem('token')
    }
}

export const authService = new AuthService()