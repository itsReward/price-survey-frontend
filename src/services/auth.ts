import { apiService } from './api'
import { LoginRequest, LoginResponse, User, RegisterRequest, GoogleAuthRequest } from '@/types/auth'

class AuthService {
    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            console.log('AuthService - starting login for:', email)

            const loginRequest: LoginRequest = { email, password }
            console.log('AuthService - sending login request:', loginRequest)

            // Make the API call
            const response = await apiService.post<LoginResponse>('/api/auth/login', loginRequest)
            console.log('AuthService - login response:', response)

            // Check if response has the expected structure
            if (!response || !response.token || !response.user) {
                console.error('AuthService - Invalid response structure:', response)
                throw new Error('Invalid server response. Please try again.')
            }

            // Validate user object
            if (!response.user.firstName || !response.user.lastName) {
                console.error('AuthService - Missing user data in response:', response.user)
                throw new Error('Incomplete user information received from server.')
            }

            console.log('AuthService - login successful for user:', response.user.email)
            return response
        } catch (error: any) {
            console.error('AuthService - login error:', error)

            // If it's a response error with status
            if (error.response) {
                console.error('AuthService - error response:', error.response)
                console.error('AuthService - error response data:', error.response.data)
                console.error('AuthService - error response status:', error.response.status)

                // Handle specific error statuses
                switch (error.response.status) {
                    case 401:
                        throw new Error('Invalid username or password')
                    case 403:
                        throw new Error('Account is disabled. Please contact admin.')
                    case 429:
                        throw new Error('Too many login attempts. Please try again later.')
                    default:
                        throw new Error(error.response.data?.message || 'Login failed. Please try again.')
                }
            } else if (error.request) {
                // Network error
                console.error('AuthService - network error:', error.request)
                throw new Error('Network error. Please check your connection and try again.')
            } else {
                // Other error
                console.error('AuthService - unexpected error:', error.message)
                throw new Error(error.message || 'An unexpected error occurred during login.')
            }
        }
    }

    async register(registerData: RegisterRequest): Promise<LoginResponse> {
        try {
            console.log('AuthService - starting registration for:', registerData.email)
            const response = await apiService.post<LoginResponse>('/api/auth/register', registerData)
            console.log('AuthService - registration response:', response)
            return response
        } catch (error: any) {
            console.error('AuthService - registration error:', error)
            throw error
        }
    }

    async googleAuth(googleData: GoogleAuthRequest): Promise<LoginResponse> {
        try {
            console.log('AuthService - starting Google auth for:', googleData.email)
            const response = await apiService.post<LoginResponse>('/api/auth/google', googleData)
            console.log('AuthService - Google auth response:', response)
            return response
        } catch (error: any) {
            console.error('AuthService - Google auth error:', error)
            throw error
        }
    }

    async getCurrentUser(): Promise<User> {
        try {
            console.log('AuthService - getting current user')
            const response = await apiService.get<User>('/api/auth/me')
            console.log('AuthService - current user response:', response)

            // Type guard for user response
            if (!response || !response.id || !response.email) {
                throw new Error('Invalid user data received from server')
            }

            return response
        } catch (error: any) {
            console.error('AuthService - getCurrentUser error:', error)
            throw error
        }
    }

    async logout(): Promise<void> {
        try {
            console.log('AuthService - logging out')
            // Clear token from localStorage first
            localStorage.removeItem('token')
            // Call backend logout endpoint
            await apiService.post('/api/auth/logout')
            console.log('AuthService - logout successful')
        } catch (error: any) {
            console.error('AuthService - logout error:', error)
            // Even if the API call fails, we've cleared the local token
            // so the user is effectively logged out
        }
    }
}

export const authService = new AuthService()