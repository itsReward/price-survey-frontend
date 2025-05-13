import React from 'react'
import { cn } from '@/utils/cn'

interface SkeletonProps {
    className?: string
    width?: string | number
    height?: string | number
    rounded?: boolean
    lines?: number
    avatarSize?: 'sm' | 'md' | 'lg'
}

const Skeleton: React.FC<SkeletonProps> = ({
                                               className,
                                               width,
                                               height,
                                               rounded = false,
                                               lines,
                                               avatarSize
                                           }) => {
    if (lines) {
        return (
            <div className="space-y-2">
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse",
                            i === lines - 1 && "w-3/4",
                            className
                        )}
                    />
                ))}
            </div>
        )
    }

    if (avatarSize) {
        const sizes = {
            sm: "w-8 h-8",
            md: "w-12 h-12",
            lg: "w-16 h-16"
        }
        return (
            <div
                className={cn(
                    "bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse",
                    sizes[avatarSize],
                    className
                )}
            />
        )
    }

    return (
        <div
            className={cn(
                "bg-gray-200 dark:bg-gray-700 animate-pulse",
                rounded ? "rounded-full" : "rounded",
                className
            )}
            style={{ width, height }}
        />
    )
}

// Common skeleton patterns
export const SkeletonCard: React.FC = () => (
    <div className="card p-6 space-y-4">
        <div className="flex items-center space-x-4">
            <Skeleton avatarSize="md" />
            <div className="space-y-2 flex-1">
                <Skeleton width="70%" height="20px" />
                <Skeleton width="40%" height="16px" />
            </div>
        </div>
        <Skeleton lines={3} />
    </div>
)

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
                                                                              rows = 5,
                                                                              cols = 4
                                                                          }) => (
    <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex space-x-4">
                {Array.from({ length: cols }).map((_, j) => (
                    <Skeleton key={j} className="flex-1" height="40px" />
                ))}
            </div>
        ))}
    </div>
)

export default Skeleton