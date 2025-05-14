import { apiService } from './api'
import { LoginRequest, LoginResponse, User, RegisterRequest, GoogleAuthRequest } from '@/types/auth'

class AuthService {
    async login(email: string, password: string): Promise<LoginResponse> {
        const loginRequest: LoginRequest = { email, password }
        return await apiService.post<LoginResponse>('/api/auth/login', loginRequest)
    }

    async register(registerData: RegisterRequest): Promise<LoginResponse> {
        return await apiService.post<LoginResponse>('/api/auth/register', registerData)
    }

    async googleAuth(googleData: GoogleAuthRequest): Promise<LoginResponse> {
        return await apiService.post<LoginResponse>('/api/auth/google', googleData)
    }

    async getCurrentUser(): Promise<User> {
        return await apiService.get<User>('/api/auth/me')
    }

    async logout(): Promise<void> {
        // Clear token from localStorage
        localStorage.removeItem('token')
        // You could also call a backend logout endpoint if you maintain a token blacklist
        await apiService.post('/api/auth/logout')
    }
}

export const authService = new AuthService()