import React from 'react'
import { motion } from 'framer-motion'

interface FadeInProps {
    children: React.ReactNode
    delay?: number
    duration?: number
    direction?: 'up' | 'down' | 'left' | 'right'
    className?: string
}

const FadeIn: React.FC<FadeInProps> = ({
                                           children,
                                           delay = 0,
                                           duration = 0.5,
                                           direction = 'up',
                                           className = ''
                                       }) => {
    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { y: 20, opacity: 0 }
            case 'down':
                return { y: -20, opacity: 0 }
            case 'left':
                return { x: -20, opacity: 0 }
            case 'right':
                return { x: 20, opacity: 0 }
            default:
                return { y: 20, opacity: 0 }
        }
    }

    const getFinalPosition = () => {
        switch (direction) {
            case 'up':
            case 'down':
                return { y: 0, opacity: 1 }
            case 'left':
            case 'right':
                return { x: 0, opacity: 1 }
            default:
                return { y: 0, opacity: 1 }
        }
    }

    return (
        <motion.div
            initial={getInitialPosition()}
            animate={getFinalPosition()}
            transition={{ delay, duration, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default FadeIn