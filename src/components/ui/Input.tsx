import React, { useState, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'style'> {
    label?: string
    error?: string | undefined  // Make explicit that undefined is allowed
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    helperText?: string
    isPassword?: boolean
    showPasswordToggle?: boolean
    variant?: 'default' | 'filled' | 'underlined'
    size?: 'sm' | 'md' | 'lg'  // Override the HTML size attribute
    style?: React.CSSProperties
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type = 'text',
            label,
            error,
            leftIcon,
            rightIcon,
            helperText,
            isPassword = false,
            showPasswordToggle = true,
            variant = 'default',
            size = 'md',
            disabled,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false)
        const [isFocused, setIsFocused] = useState(false)

        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-3 py-2 text-base',
            lg: 'px-4 py-3 text-lg'
        }

        const variantClasses = {
            default: 'border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700',
            filled: 'border-0 bg-gray-100 dark:bg-gray-700 rounded-lg',
            underlined: 'border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent rounded-none'
        }

        const baseClasses = cn(
            'w-full transition-all duration-200 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
            sizeClasses[size],
            variantClasses[variant],
            leftIcon && 'pl-10',
            (rightIcon || (isPassword && showPasswordToggle)) && 'pr-10',
            error
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20'
                : 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20',
            disabled && 'opacity-50 cursor-not-allowed',
            className
        )

        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {leftIcon}
                        </div>
                    )}

                    <motion.input
                        ref={ref}
                        type={inputType}
                        className={baseClasses}
                        onFocus={(e) => {
                            setIsFocused(true)
                            props.onFocus?.(e)
                        }}
                        onBlur={(e) => {
                            setIsFocused(false)
                            props.onBlur?.(e)
                        }}
                        disabled={disabled}
                        {...(props as any)}  // Cast to any to avoid style conflict
                        whileFocus={{ scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />

                    {(rightIcon || (isPassword && showPasswordToggle)) && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            {isPassword && showPasswordToggle ? (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            ) : (
                                rightIcon
                            )}
                        </div>
                    )}

                    {variant === 'underlined' && (
                        <motion.div
                            className="absolute bottom-0 left-0 h-0.5 bg-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: isFocused ? '100%' : 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    )}
                </div>

                {(error !== undefined || helperText) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center space-x-1"
                    >
                        {error !== undefined && <AlertCircle className="w-4 h-4 text-red-500" />}
                        <p className={`text-sm ${error !== undefined ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {error ?? helperText}
                        </p>
                    </motion.div>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

// Textarea component with similar styling
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    helperText?: string
    variant?: 'default' | 'filled' | 'underlined'
    resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            variant = 'default',
            resize = 'vertical',
            disabled,
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false)

        const variantClasses = {
            default: 'border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700',
            filled: 'border-0 bg-gray-100 dark:bg-gray-700 rounded-lg',
            underlined: 'border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent rounded-none'
        }

        const resizeClasses = {
            none: 'resize-none',
            vertical: 'resize-y',
            horizontal: 'resize-x',
            both: 'resize'
        }

        const baseClasses = cn(
            'w-full px-3 py-2 transition-all duration-200 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
            variantClasses[variant],
            resizeClasses[resize],
            error
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20'
                : 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20',
            disabled && 'opacity-50 cursor-not-allowed',
            className
        )

        // @ts-ignore
        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    <motion.textarea
                        ref={ref}
                        className={baseClasses}
                        onFocus={(e) => {
                            setIsFocused(true)
                            props.onFocus?.(e)
                        }}
                        onBlur={(e) => {
                            setIsFocused(false)
                            props.onBlur?.(e)
                        }}
                        disabled={disabled}
                        {...(props as any)}  // Cast to any to avoid style conflict
                        whileFocus={{ scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />

                    {variant === 'underlined' && (
                        <motion.div
                            className="absolute bottom-0 left-0 h-0.5 bg-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: isFocused ? '100%' : 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    )}
                </div>

                {(error || helperText) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center space-x-1"
                    >
                        {error && <AlertCircle className="w-4 h-4 text-red-500" />}
                        <p className={`text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {error || helperText}
                        </p>
                    </motion.div>
                )}
            </div>
        )
    }
)

Textarea.displayName = 'Textarea'

export default Input