import { useEffect, useState } from 'react'

export interface UseAuthOptions {
    autoCheckAuth?: boolean
    redirectOnExpiry?: string
}

export interface UseAuthState {
    isAuthenticated: boolean
    user: any | null
    token: string | null
    isLoading: boolean
    error: string | null
}

export function useAuth(options: UseAuthOptions = {}) {
    const [state, setState] = useState<UseAuthState>({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: true,
        error: null
    })

    const {
        autoCheckAuth = true,
        redirectOnExpiry = '/login'
    } = options

    // Check if token exists and is valid
    const checkAuthStatus = async () => {
        const token = localStorage.getItem('token')

        if (!token) {
            setState(prev => ({ ...prev, isLoading: false }))
            return
        }

        try {
            // Decode token to check expiry
            const tokenPayload = JSON.parse(atob(token.split('.')[1]))
            const isExpired = Date.now() >= tokenPayload.exp * 1000

            if (isExpired) {
                localStorage.removeItem('token')
                setState(prev => ({
                    ...prev,
                    isAuthenticated: false,
                    token: null,
                    user: null,
                    isLoading: false,
                    error: 'Token expired'
                }))

                if (redirectOnExpiry) {
                    window.location.href = redirectOnExpiry
                }
                return
            }

            // Fetch user data
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const user = await response.json()
                setState(prev => ({
                    ...prev,
                    isAuthenticated: true,
                    user,
                    token,
                    isLoading: false
                }))
            } else {
                throw new Error('Failed to get user info')
            }
        } catch (error) {
            localStorage.removeItem('token')
            setState(prev => ({
                ...prev,
                isAuthenticated: false,
                token: null,
                user: null,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Authentication failed'
            }))
        }
    }

    useEffect(() => {
        if (autoCheckAuth) {
            checkAuthStatus()
        }
    }, [autoCheckAuth])

    // Login function
    const login = async (credentials: { email: string; password: string }) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            })

            if (!response.ok) {
                throw new Error('Login failed')
            }

            const data = await response.json()
            localStorage.setItem('token', data.token)

            setState(prev => ({
                ...prev,
                isAuthenticated: true,
                user: data.user,
                token: data.token,
                isLoading: false
            }))

            return data
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Login failed'
            }))
            throw error
        }
    }

    // Logout function
    const logout = () => {
        localStorage.removeItem('token')
        setState({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
            error: null
        })
    }

    // Update user function
    const updateUser = (userData: any) => {
        setState(prev => ({
            ...prev,
            user: { ...prev.user, ...userData }
        }))
    }

    // Check permissions
    const hasPermission = (permission: string): boolean => {
        if (!state.user || !state.user.permissions) return false
        return state.user.permissions.includes(permission)
    }

    // Check role
    const hasRole = (role: string): boolean => {
        if (!state.user || !state.user.role) return false
        return state.user.role === role
    }

    return {
        ...state,
        login,
        logout,
        updateUser,
        hasPermission,
        hasRole,
        checkAuthStatus
    }
}