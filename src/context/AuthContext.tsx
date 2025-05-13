import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types/auth'
import { authService } from '@/services/auth'
import toast from 'react-hot-toast'

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token')
            if (storedToken) {
                try {
                    const userData = await authService.getCurrentUser()
                    setUser(userData)
                    setToken(storedToken)
                } catch (error) {
                    console.error('Failed to get current user:', error)
                    localStorage.removeItem('token')
                    setToken(null)
                }
            }
            setIsLoading(false)
        }

        initAuth()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true)
            const response = await authService.login(email, password)
            setUser(response.user)
            setToken(response.token)
            localStorage.setItem('token', response.token)
            toast.success(`Welcome back, ${response.user.firstName}!`)
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        toast.success('Logged out successfully')
    }

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token && !!user,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}