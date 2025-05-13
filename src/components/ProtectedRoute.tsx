import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Spinner from '@/components/ui/Spinner'

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: 'ADMIN' | 'USER'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                           children,
                                                           requiredRole
                                                       }) => {
    const { isAuthenticated, user, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute