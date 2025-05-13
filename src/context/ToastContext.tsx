import React, { createContext, useContext, useState, useCallback } from 'react'
import { ToastContainer, ToastProps } from '@/components/ui/Toast'

interface ToastContextType {
    toasts: ToastProps[]
    addToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void
    removeToast: (id: string) => void
    success: (title: string, message?: string, options?: Partial<ToastProps>) => void
    error: (title: string, message?: string, options?: Partial<ToastProps>) => void
    warning: (title: string, message?: string, options?: Partial<ToastProps>) => void
    info: (title: string, message?: string, options?: Partial<ToastProps>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

interface ToastProviderProps {
    children: React.ReactNode
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
    maxToasts?: number
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
                                                                children,
                                                                position = 'top-right',
                                                                maxToasts = 5
                                                            }) => {
    const [toasts, setToasts] = useState<ToastProps[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const addToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast: ToastProps = {
            ...toast,
            id,
            onClose: removeToast
        }

        setToasts((prev) => {
            const newToasts = [newToast, ...prev]
            return newToasts.slice(0, maxToasts)
        })
    }, [removeToast, maxToasts])

    const success = useCallback((title: string, message?: string, options: Partial<ToastProps> = {}) => {
        addToast({
            type: 'success',
            title,
            message,
            ...options
        })
    }, [addToast])

    const error = useCallback((title: string, message?: string, options: Partial<ToastProps> = {}) => {
        addToast({
            type: 'error',
            title,
            message,
            ...options
        })
    }, [addToast])

    const warning = useCallback((title: string, message?: string, options: Partial<ToastProps> = {}) => {
        addToast({
            type: 'warning',
            title,
            message,
            ...options
        })
    }, [addToast])

    const info = useCallback((title: string, message?: string, options: Partial<ToastProps> = {}) => {
        addToast({
            type: 'info',
            title,
            message,
            ...options
        })
    }, [addToast])

    const value: ToastContextType = {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info
    }

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} position={position} />
        </ToastContext.Provider>
    )
}

// Hook for imperative toast API (similar to react-hot-toast)
export const toast = {
    success: (title: string, message?: string, options?: Partial<ToastProps>) => {
        // This will work when used within a ToastProvider
        const event = new CustomEvent('toast', {
            detail: { type: 'success', title, message, ...options }
        })
        window.dispatchEvent(event)
    },
    error: (title: string, message?: string, options?: Partial<ToastProps>) => {
        const event = new CustomEvent('toast', {
            detail: { type: 'error', title, message, ...options }
        })
        window.dispatchEvent(event)
    },
    warning: (title: string, message?: string, options?: Partial<ToastProps>) => {
        const event = new CustomEvent('toast', {
            detail: { type: 'warning', title, message, ...options }
        })
        window.dispatchEvent(event)
    },
    info: (title: string, message?: string, options?: Partial<ToastProps>) => {
        const event = new CustomEvent('toast', {
            detail: { type: 'info', title, message, ...options }
        })
        window.dispatchEvent(event)
    }
}

// Component that listens to toast events
export const ToastEventListener: React.FC = () => {
    const { addToast } = useToast()

    React.useEffect(() => {
        const handleToastEvent = (event: CustomEvent) => {
            addToast(event.detail)
        }

        window.addEventListener('toast', handleToastEvent as EventListener)
        return () => {
            window.removeEventListener('toast', handleToastEvent as EventListener)
        }
    }, [addToast])

    return null
}