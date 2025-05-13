import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import Button from './Button'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    closeOnOverlayClick?: boolean
    closeOnEscape?: boolean
    showCloseButton?: boolean
    className?: string
}

const Modal: React.FC<ModalProps> = ({
                                         isOpen,
                                         onClose,
                                         children,
                                         title,
                                         size = 'md',
                                         closeOnOverlayClick = true,
                                         closeOnEscape = true,
                                         showCloseButton = true,
                                         className
                                     }) => {
    useEffect(() => {
        if (closeOnEscape) {
            const handleEscape = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onClose()
                }
            }

            if (isOpen) {
                document.addEventListener('keydown', handleEscape)
                document.body.style.overflow = 'hidden'
            }

            return () => {
                document.removeEventListener('keydown', handleEscape)
                document.body.style.overflow = 'unset'
            }
        }
    }, [isOpen, onClose, closeOnEscape])

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-full mx-4'
    }

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    }

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={overlayVariants}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                    onClick={closeOnOverlayClick ? onClose : undefined}
                >
                    <motion.div
                        variants={modalVariants}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={cn(
                            'relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full',
                            sizeClasses[size],
                            className
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                {title && (
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {title}
                                    </h2>
                                )}
                                {showCloseButton && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onClose}
                                        className="p-2"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                )}
                            </div>
                        )}
                        <div className="p-4">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Confirmation Dialog Component
interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
    loading?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                onConfirm,
                                                                title,
                                                                message,
                                                                confirmText = 'Confirm',
                                                                cancelText = 'Cancel',
                                                                type = 'danger',
                                                                loading = false
                                                            }) => {
    const iconMap = {
        danger: <XCircle className="w-6 h-6 text-red-600" />,
        warning: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
        info: <Info className="w-6 h-6 text-blue-600" />
    }

    const buttonVariantMap = {
        danger: 'destructive' as const,
        warning: 'primary' as const,
        info: 'primary' as const
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    {iconMap[type]}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{message}</p>
                <div className="flex space-x-3 pt-4">
                    <Button
                        variant={buttonVariantMap[type]}
                        onClick={onConfirm}
                        isLoading={loading}
                        className="flex-1"
                    >
                        {confirmText}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1"
                    >
                        {cancelText}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

// Alert Dialog Component
interface AlertDialogProps {
    isOpen: boolean
    onClose: () => void
    title: string
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
                                                            isOpen,
                                                            onClose,
                                                            title,
                                                            message,
                                                            type = 'info'
                                                        }) => {
    const iconMap = {
        success: <CheckCircle className="w-6 h-6 text-green-600" />,
        error: <XCircle className="w-6 h-6 text-red-600" />,
        warning: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
        info: <Info className="w-6 h-6 text-blue-600" />
    }

    const colorMap = {
        success: 'text-green-600',
        error: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600'
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    {iconMap[type]}
                    <h3 className={`text-lg font-semibold ${colorMap[type]}`}>
                        {title}
                    </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{message}</p>
                <div className="pt-4">
                    <Button variant="primary" onClick={onClose} className="w-full">
                        OK
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default Modal