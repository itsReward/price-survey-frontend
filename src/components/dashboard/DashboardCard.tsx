import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import Card, { CardContent } from '@/components/ui/Card'

interface DashboardCardProps {
    title: string
    value: string | number
    change?: string
    changeType?: 'positive' | 'negative'
    icon: LucideIcon
    iconColor?: string
    prefix?: string
    isLoading?: boolean
}

const DashboardCard: React.FC<DashboardCardProps> = ({
                                                         title,
                                                         value,
                                                         change,
                                                         changeType = 'positive',
                                                         icon: Icon,
                                                         iconColor = 'emerald',
                                                         prefix = '',
                                                         isLoading = false
                                                     }) => {
    const colorClasses = {
        emerald: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900',
        blue: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900',
        purple: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900',
        orange: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900',
        red: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900'
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 400 }}
        >
            <Card>
                <CardContent>
                    {isLoading ? (
                        <div className="animate-pulse">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                <div className="ml-4 flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg ${colorClasses[iconColor as keyof typeof colorClasses]}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
                                </p>
                                {change && (
                                    <p className={`text-sm ${
                                        changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {change} from last month
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default DashboardCard