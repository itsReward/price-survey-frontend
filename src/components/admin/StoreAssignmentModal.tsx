import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Store, Check } from 'lucide-react'
import { useQuery } from 'react-query'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import { storeService } from '@/services/store'
import { userService } from '@/services/user'
import { User } from '@/types/auth'

interface StoreAssignmentModalProps {
    user: User
    onClose: () => void
    onSuccess: () => void
    isLoading?: boolean
}

const StoreAssignmentModal: React.FC<StoreAssignmentModalProps> = ({
                                                                       user,
                                                                       onClose,
                                                                       onSuccess,
                                                                       isLoading = false
                                                                   }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedStoreIds, setSelectedStoreIds] = useState<number[]>([])

    // Initialize selectedStoreIds when user data is available
    React.useEffect(() => {
        if (user?.assignedStores) {
            setSelectedStoreIds(user.assignedStores.map(store => store.id))
        }
    }, [user])

    const { data: stores, isLoading: storesLoading } = useQuery(
        'stores-for-assignment',
        storeService.getStores
    )

    const toggleStoreSelection = (storeId: number) => {
        setSelectedStoreIds(prev =>
            prev.includes(storeId)
                ? prev.filter(id => id !== storeId)
                : [...prev, storeId]
        )
    }

    const handleSave = async () => {
        if (!user) return

        setIsSubmitting(true)
        try {
            // Call the userService to update store assignments
            await userService.assignStoresToUser(user.id, selectedStoreIds)
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Failed to assign stores:', error)
            // Handle error - you might want to show a toast here
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!user) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Assign Stores
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="p-2"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Select stores for {user?.firstName} {user?.lastName}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {storesLoading ? (
                                // Loading skeleton
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                                        <Skeleton avatarSize="sm" />
                                        <div className="flex-1 space-y-1">
                                            <Skeleton width="70%" height="16px" />
                                            <Skeleton width="50%" height="14px" />
                                        </div>
                                    </div>
                                ))
                            ) : stores && stores.length > 0 ? (
                                stores.filter(store => store.isActive).map((store) => {
                                    const isSelected = selectedStoreIds.includes(store.id)

                                    return (
                                        <motion.div
                                            key={store.id}
                                            whileHover={{ backgroundColor: 'var(--hover-bg)' }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <button
                                                onClick={() => toggleStoreSelection(store.id)}
                                                className={`w-full flex items-center space-x-3 p-3 border rounded-lg transition-all ${
                                                    isSelected
                                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                        isSelected
                                                            ? 'bg-emerald-500 text-white'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        {isSelected ? (
                                                            <Check className="w-5 h-5" />
                                                        ) : (
                                                            <Store className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {store.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {store.city}, {store.region}
                                                    </p>
                                                </div>
                                            </button>
                                        </motion.div>
                                    )
                                })
                            ) : (
                                <div className="text-center py-8">
                                    <Store className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400">No stores available</p>
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                onClick={handleSave}
                                className="flex-1"
                                isLoading={isSubmitting || isLoading}
                            >
                                Save Assignment
                            </Button>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting || isLoading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}

export default StoreAssignmentModal