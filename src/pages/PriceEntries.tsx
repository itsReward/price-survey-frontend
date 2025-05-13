import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, Edit, Trash2, Package, Store as StoreIcon } from 'lucide-react'
import FadeIn from '@/components/animations/FadeIn'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import PriceEntryForm from '@/components/forms/PriceEntryForm'
import { priceEntryService } from '@/services/priceEntry'
import { PriceEntry, PriceEntryFilters } from '@/types/priceEntry'
import toast from 'react-hot-toast'

const PriceEntries: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedEntry, setSelectedEntry] = useState<PriceEntry | null>(null)
    const [filters] = useState<PriceEntryFilters>({})
    const [searchTerm, setSearchTerm] = useState('')

    const queryClient = useQueryClient()

    const { data: priceEntries, isLoading} = useQuery(
        ['priceEntries', filters],
        () => priceEntryService.getPriceEntries(filters),
        {
            staleTime: 3 * 60 * 1000, // 3 minutes
        }
    )

    const createMutation = useMutation(priceEntryService.createPriceEntry, {
        onSuccess: () => {
            queryClient.invalidateQueries(['priceEntries'])
            toast.success('Price entry created successfully!')
            setIsFormOpen(false)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create price entry')
        },
    })

    const deleteMutation = useMutation(priceEntryService.deletePriceEntry, {
        onSuccess: () => {
            queryClient.invalidateQueries(['priceEntries'])
            toast.success('Price entry deleted successfully!')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete price entry')
        },
    })

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this price entry?')) {
            deleteMutation.mutate(id)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <FadeIn>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Price Entries
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Manage and track price entries across stores
                            </p>
                        </div>
                        <Button
                            onClick={() => setIsFormOpen(true)}
                            leftIcon={<Plus className="w-5 h-5" />}
                            className="bg-emerald-500 hover:bg-emerald-600"
                        >
                            Add Entry
                        </Button>
                    </div>
                </FadeIn>

                {/* Filters */}
                <FadeIn delay={0.1}>
                    <Card className="mb-6">
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search price entries..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                                    Filters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* Price Entries Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        // Loading skeletons
                        Array.from({ length: 6 }).map((_, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <Skeleton avatarSize="md" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton width="70%" height="20px" />
                                            <Skeleton width="50%" height="16px" />
                                        </div>
                                    </div>
                                    <Skeleton lines={3} />
                                    <div className="mt-4 flex justify-between">
                                        <Skeleton width="80px" height="32px" />
                                        <Skeleton width="100px" height="32px" />
                                    </div>
                                </div>
                            </FadeIn>
                        ))
                    ) : priceEntries && priceEntries.length > 0 ? (
                        priceEntries.map((entry, index) => (
                            <FadeIn key={entry.id} delay={index * 0.1}>
                                <motion.div
                                    whileHover={{ y: -4, shadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card hover className="h-full">
                                        <CardContent>
                                            <div className="space-y-4">
                                                {/* Header */}
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                            {entry.product.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {entry.product.category} • {entry.product.volumeMl}ml
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Store Info */}
                                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <StoreIcon className="w-4 h-4" />
                                                    <span>{entry.store.name}</span>
                                                    <span>•</span>
                                                    <span>{entry.store.city}</span>
                                                </div>

                                                {/* Price and Quantity */}
                                                <div className="flex justify-between items-center">
                                                    <div>
                            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(Number(entry.price))}
                            </span>
                                                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                              x{entry.quantity}
                            </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatDate(entry.createdAt)}
                                                        </p>
                                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                                            by {entry.user.firstName} {entry.user.lastName}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                {entry.notes && (
                                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {entry.notes}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedEntry(entry)
                                                            setIsFormOpen(true)
                                                        }}
                                                        leftIcon={<Edit className="w-4 h-4" />}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(entry.id)}
                                                        leftIcon={<Trash2 className="w-4 h-4" />}
                                                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </FadeIn>
                        ))
                    ) : (
                        <FadeIn>
                            <div className="col-span-full text-center py-12">
                                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No price entries found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Get started by adding your first price entry
                                </p>
                                <Button
                                    onClick={() => setIsFormOpen(true)}
                                    leftIcon={<Plus className="w-5 h-5" />}
                                >
                                    Add Entry
                                </Button>
                            </div>
                        </FadeIn>
                    )}
                </div>

                {/* Form Modal */}
                <AnimatePresence>
                    {isFormOpen && (
                        <PriceEntryForm
                            entry={selectedEntry}
                            onClose={() => {
                                setIsFormOpen(false)
                                setSelectedEntry(null)
                            }}
                            onSubmit={(data) => {
                                createMutation.mutate(data)
                            }}
                            isLoading={createMutation.isLoading}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default PriceEntries