import React from 'react'
import { motion } from 'framer-motion'

interface SlideInProps {
    children: React.ReactNode
    delay?: number
    duration?: number
    direction?: 'left' | 'right' | 'up' | 'down'
    distance?: number
    className?: string
}

const SlideIn: React.FC<SlideInProps> = ({
                                             children,
                                             delay = 0,
                                             duration = 0.5,
                                             direction = 'left',
                                             distance = 20,
                                             className = ''
                                         }) => {
    const getInitialPosition = () => {
        switch (direction) {
            case 'left':
                return { x: -distance, opacity: 0 }
            case 'right':
                return { x: distance, opacity: 0 }
            case 'up':
                return { y: -distance, opacity: 0 }
            case 'down':
                return { y: distance, opacity: 0 }
            default:
                return { x: -distance, opacity: 0 }
        }
    }

    const getFinalPosition = () => {
        switch (direction) {
            case 'left':
            case 'right':
                return { x: 0, opacity: 1 }
            case 'up':
            case 'down':
                return { y: 0, opacity: 1 }
            default:
                return { x: 0, opacity: 1 }
        }
    }

    return (
        <motion.div
            initial={getInitialPosition()}
            animate={getFinalPosition()}
            transition={{
                delay,
                duration,
                ease: 'easeOut',
                type: 'spring',
                stiffness: 100,
                damping: 10
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default SlideIn