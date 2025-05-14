import React from 'react'
import { motion } from 'framer-motion'
import { Package, Clock, ArrowRight } from 'lucide-react'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'

interface RecentEntry {
    id: number
    storeName: string
    productName: string
    price: number
    quantity: number
    createdAt: string
}

interface RecentEntriesProps {
    entries: RecentEntry[]
    isLoading?: boolean
    onViewAll?: () => void
}

const RecentEntries: React.FC<RecentEntriesProps> = ({
                                                         entries,
                                                         isLoading = false,
                                                         onViewAll
                                                     }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Recent Price Entries
                    </h3>
                    {onViewAll && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onViewAll}
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            View All
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton avatarSize="md" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton width="70%" height="16px" />
                                    <Skeleton width="50%" height="14px" />
                                </div>
                                <Skeleton width="80px" height="24px" />
                            </div>
                        ))}
                    </div>
                ) : entries.length > 0 ? (
                    <div className="space-y-4">
                        {entries.map((entry, index) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ backgroundColor: 'var(--hover-bg)' }}
                                className="flex items-center space-x-4 p-3 rounded-lg transition-colors"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                                        <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {entry.productName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {entry.storeName}
                                    </p>
                                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatDate(entry.createdAt)}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 text-right">
                  <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(entry.price)}
                  </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Qty: {entry.quantity}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No recent entries</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default RecentEntries