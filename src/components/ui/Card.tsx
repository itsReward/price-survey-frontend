import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface CardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
    onClick?: () => void
}

const Card: React.FC<CardProps> = ({
                                       children,
                                       className,
                                       hover = false,
                                       onClick
                                   }) => {
    return (
        <motion.div
            className={cn(
                "bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                hover && "transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer",
                className
            )}
            whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
            transition={{ duration: 0.2 }}
            onClick={onClick}
        >
            {children}
        </motion.div>
    )
}
interface CardHeaderProps {
    children: React.ReactNode
    className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
    return (
        <div className={cn("px-4 py-3 border-b border-gray-200 dark:border-gray-700", className)}>
            {children}
        </div>
    )
}

interface CardContentProps {
    children: React.ReactNode
    className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
    return (
        <div className={cn("p-4", className)}>
            {children}
        </div>
    )
}

interface CardFooterProps {
    children: React.ReactNode
    className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
    return (
        <div className={cn("px-4 py-3 border-t border-gray-200 dark:border-gray-700", className)}>
            {children}
        </div>
    )
}

export default Card