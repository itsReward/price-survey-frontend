import React from 'react'
import { motion } from 'framer-motion'

interface LoadingDotsProps {
    size?: 'sm' | 'md' | 'lg'
    color?: string
    className?: string
}

const LoadingDots: React.FC<LoadingDotsProps> = ({
                                                     size = 'md',
                                                     color = 'bg-emerald-500',
                                                     className = ''
                                                 }) => {
    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    }

    const containerSize = {
        sm: 'w-16 h-4',
        md: 'w-20 h-6',
        lg: 'w-24 h-8'
    }

    const dotClass = `${sizeClasses[size]} ${color} rounded-full`

    return (
        <div className={`flex items-center justify-center ${containerSize[size]} ${className}`}>
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className={dotClass}
                    animate={{
                        y: [-4, 0, -4],
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                    }}
                    style={{ marginRight: i < 2 ? 4 : 0 }}
                />
            ))}
        </div>
    )
}

export default LoadingDots