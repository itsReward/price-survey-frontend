import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypewriterTextProps {
    text: string
    speed?: number
    delay?: number
    className?: string
    showCursor?: boolean
    cursorColor?: string
    onComplete?: () => void
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
                                                           text,
                                                           speed = 100,
                                                           delay = 0,
                                                           className = '',
                                                           showCursor = true,
                                                           cursorColor = 'text-emerald-500',
                                                           onComplete
                                                       }) => {
    const [displayText, setDisplayText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isComplete, setIsComplete] = useState(false)

    // @ts-ignore
    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex])
                setCurrentIndex(currentIndex + 1)
            }, currentIndex === 0 ? delay : speed)

            return () => clearTimeout(timeout)
        } else if (!isComplete) {
            setIsComplete(true)
            onComplete?.()
        }
    }, [currentIndex, text, speed, delay, isComplete, onComplete])

    return (
        <span className={className}>
            {displayText}
            {showCursor && (
                <motion.span
                    className={`ml-1 ${cursorColor}`}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.75, repeat: Infinity }}
                >
                    |
                </motion.span>
            )}
        </span>
    )
}

export default TypewriterText