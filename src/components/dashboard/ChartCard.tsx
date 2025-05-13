import React from 'react'
import { motion } from 'framer-motion'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'

interface ChartCardProps {
    title: string
    children: React.ReactNode
    className?: string
    isLoading?: boolean
    action?: React.ReactNode
}

const ChartCard: React.FC<ChartCardProps> = ({
                                                 title,
                                                 children,
                                                 className = '',
                                                 isLoading = false,
                                                 action
                                             }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400 }}
        >
            <Card className={className}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        {action && <div>{action}</div>}
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="h-80 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : (
                        children
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default ChartCard