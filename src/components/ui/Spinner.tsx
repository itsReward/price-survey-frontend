import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    color?: string
    className?: string
}

const Spinner: React.FC<SpinnerProps> = ({
                                             size = 'md',
                                             color = 'text-emerald-500',
                                             className = ''
                                         }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    }

    return (
        <motion.div
            className={`${sizeClasses[size]} ${color} ${className}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
            <Loader2 className="w-full h-full" />
        </motion.div>
    )
}

export default Spinner