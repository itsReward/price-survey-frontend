import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export interface ToastProps {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
    onClose: (id: string) => void
    action?: {
        label: string
        onClick: () => void
    }
}

const Toast: React.FC<ToastProps> = ({
                                         id,
                                         type,
                                         title,
                                         message,
                                         duration = 5000,
                                         onClose,
                                         action
                                     }) => {
    // @ts-ignore
    React.useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id)
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [id, duration, onClose])

    const iconMap = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    }

    const colorMap = {
        success: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-200 dark:border-green-800',
            text: 'text-green-800 dark:text-green-200',
            icon: 'text-green-600 dark:text-green-400'
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800',
            text: 'text-red-800 dark:text-red-200',
            icon: 'text-red-600 dark:text-red-400'
        },
        warning: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-200 dark:border-yellow-800',
            text: 'text-yellow-800 dark:text-yellow-200',
            icon: 'text-yellow-600 dark:text-yellow-400'
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-800',
            text: 'text-blue-800 dark:text-blue-200',
            icon: 'text-blue-600 dark:text-blue-400'
        }
    }

    const colors = colorMap[type]

    const toastVariants = {
        hidden: {
            opacity: 0,
            x: 50,
            scale: 0.3
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1
        },
        exit: {
            opacity: 0,
            x: 50,
            scale: 0.5
        }
    }

    return (
        <motion.div
            layout
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`
        max-w-md w-full rounded-lg shadow-lg border p-4
        ${colors.bg} ${colors.border}
      `}
        >
            <div className="flex items-start">
                <div className={`flex-shrink-0 ${colors.icon}`}>
                    {iconMap[type]}
                </div>
                <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${colors.text}`}>
                        {title}
                    </p>
                    {message && (
                        <p className={`mt-1 text-sm ${colors.text} opacity-90`}>
                            {message}
                        </p>
                    )}
                    {action && (
                        <div className="mt-3">
                            <button
                                onClick={action.onClick}
                                className={`
                  text-sm font-medium underline hover:no-underline
                  ${colors.text}
                `}
                            >
                                {action.label}
                            </button>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => onClose(id)}
                    className="ml-4 flex-shrink-0 rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200"
                >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                </button>
            </div>
        </motion.div>
    )
}

// Toast Container Component
interface ToastContainerProps {
    toasts: ToastProps[]
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
                                                                  toasts,
                                                                  position = 'top-right'
                                                              }) => {
    const positionClasses = {
        'top-right': 'top-0 right-0',
        'top-left': 'top-0 left-0',
        'bottom-right': 'bottom-0 right-0',
        'bottom-left': 'bottom-0 left-0',
        'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
        'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2'
    }

    return (
        <div className={`fixed ${positionClasses[position]} p-4 z-50`}>
            <AnimatePresence>
                <div className="space-y-2">
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} />
                    ))}
                </div>
            </AnimatePresence>
        </div>
    )
}

export default Toast