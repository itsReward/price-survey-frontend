import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Store as StoreIcon,
    MapPin,
    Eye,
    EyeOff,
    List,
    Grid
} from 'lucide-react'
import FadeIn from '@/components/animations/FadeIn'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import StoreForm from '@/components/forms/StoreForm'
import { storeService } from '@/services/store'
import { Store } from '@/types/store'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const Stores: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedStore, setSelectedStore] = useState<Store | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCity, setSelectedCity] = useState<string>('')
    const [selectedRegion, setSelectedRegion] = useState<string>('')
    const [showInactive, setShowInactive] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const { user } = useAuth()
    const queryClient = useQueryClient()

    const {
        data: stores,
        isLoading: storesLoading,
        isError
    } = useQuery('stores', storeService.getStores, {
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    const createMutation = useMutation(storeService.createStore, {
        onSuccess: () => {
            queryClient.invalidateQueries(['stores'])
            toast.success('Store created successfully!')
            setIsFormOpen(false)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create store')
        },
    })

    const updateMutation = useMutation(
        ({ id, data }: { id: number; data: any }) => storeService.updateStore(id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['stores'])
                toast.success('Store updated successfully!')
                setIsFormOpen(false)
                setSelectedStore(null)
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to update store')
            },
        }
    )

    const deleteMutation = useMutation(storeService.deleteStore, {
        onSuccess: () => {
            queryClient.invalidateQueries(['stores'])
            toast.success('Store deleted successfully!')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete store')
        },
    })

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this store?')) {
            deleteMutation.mutate(id)
        }
    }

    const handleFormSubmit = (data: any) => {
        if (selectedStore) {
            updateMutation.mutate({ id: selectedStore.id, data })
        } else {
            createMutation.mutate(data)
        }
    }

    const filteredStores = stores?.filter(store => {
        const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.city.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCity = !selectedCity || store.city === selectedCity
        const matchesRegion = !selectedRegion || store.region === selectedRegion
        const matchesActive = showInactive || store.isActive

        return matchesSearch && matchesCity && matchesRegion && matchesActive
    })

    // Get unique cities and regions for filters
    const cities = Array.from(new Set(stores?.map(store => store.city) || []))
    const regions = Array.from(new Set(stores?.map(store => store.region) || []))

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatCoordinates = (lat: number | null, lng: number | null) => {
        if (!lat || !lng) return 'No coordinates'
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card>
                    <CardContent>
                        <p className="text-red-500">Error loading stores</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <FadeIn>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Stores
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Manage store locations and information
                            </p>
                            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <span>Total: {stores?.length || 0}</span>
                                <span>•</span>
                                <span>Active: {stores?.filter(s => s.isActive).length || 0}</span>
                                <span>•</span>
                                <span>Cities: {cities.length}</span>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            {user?.role === 'ADMIN' && (
                                <Button
                                    onClick={() => {
                                        setSelectedStore(null)
                                        setIsFormOpen(true)
                                    }}
                                    leftIcon={<Plus className="w-5 h-5" />}
                                    className="bg-emerald-500 hover:bg-emerald-600"
                                >
                                    Add Store
                                </Button>
                            )}
                        </div>
                    </div>
                </FadeIn>

                {/* Filters and View Toggle */}
                <FadeIn delay={0.1}>
                    <Card className="mb-6">
                        <CardContent>
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search stores..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* City Filter */}
                                <div className="w-full lg:w-48">
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="">All Cities</option>
                                        {cities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Region Filter */}
                                <div className="w-full lg:w-48">
                                    <select
                                        value={selectedRegion}
                                        onChange={(e) => setSelectedRegion(e.target.value)}
                                        className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="">All Regions</option>
                                        {regions.map((region) => (
                                            <option key={region} value={region}>
                                                {region}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Show Inactive Toggle */}
                                <Button
                                    variant="outline"
                                    onClick={() => setShowInactive(!showInactive)}
                                    leftIcon={showInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    className={showInactive ? 'border-emerald-500 text-emerald-600' : ''}
                                >
                                    {showInactive ? 'Hide' : 'Show'} Inactive
                                </Button>

                                {/* View Mode Toggle */}
                                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <Button
                                        variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="rounded-none"
                                    >
                                        <Grid className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'primary' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className="rounded-none"
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* Stores Display */}
                {viewMode === 'grid' ? (
                    /* Grid View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {storesLoading ? (
                            // Loading skeletons
                            Array.from({ length: 6 }).map((_, i) => (
                                <FadeIn key={i} delay={i * 0.1}>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <Skeleton avatarSize="md" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton width="70%" height="20px" />
                                                <Skeleton width="50%" height="16px" />
                                            </div>
                                        </div>
                                        <Skeleton lines={2} />
                                        <div className="mt-4 flex justify-between">
                                            <Skeleton width="60px" height="24px" />
                                            <Skeleton width="80px" height="32px" />
                                        </div>
                                    </div>
                                </FadeIn>
                            ))
                        ) : filteredStores && filteredStores.length > 0 ? (
                            filteredStores.map((store, index) => (
                                <FadeIn key={store.id} delay={index * 0.1}>
                                    <motion.div
                                        whileHover={{ y: -4, shadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Card hover className="h-full">
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center space-x-3 flex-1">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                                                                    <StoreIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                                    {store.name}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {store.city}, {store.region}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {!store.isActive && (
                                                            <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900 rounded-full">
                                                                Inactive
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Address */}
                                                    <div className="flex items-start space-x-2">
                                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {store.address}
                                                        </p>
                                                    </div>

                                                    {/* Location Info */}
                                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                                        <div>
                                                            <span className="font-medium text-gray-500 dark:text-gray-400">Country:</span>
                                                            <span className="ml-2 text-gray-700 dark:text-gray-300">{store.country}</span>
                                                        </div>
                                                        {(store.latitude && store.longitude) && (
                                                            <div>
                                                                <span className="font-medium text-gray-500 dark:text-gray-400">Coordinates:</span>
                                                                <span className="ml-2 text-gray-700 dark:text-gray-300">
                                                                    {formatCoordinates(store.latitude, store.longitude)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Created Date */}
                                                    <div className="text-xs text-gray-500 dark:text-gray-500">
                                                        Created {formatDate(store.createdAt)}
                                                    </div>

                                                    {/* Actions */}
                                                    {user?.role === 'ADMIN' && (
                                                        <div className="flex space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedStore(store)
                                                                    setIsFormOpen(true)
                                                                }}
                                                                leftIcon={<Edit className="w-4 h-4" />}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(store.id)}
                                                                leftIcon={<Trash2 className="w-4 h-4" />}
                                                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </FadeIn>
                            ))
                        ) : (
                            <FadeIn>
                                <div className="col-span-full text-center py-12">
                                    <StoreIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        No stores found
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        {searchTerm || selectedCity || selectedRegion ? 'Try adjusting your filters' : 'Get started by adding your first store'}
                                    </p>
                                    {user?.role === 'ADMIN' && !searchTerm && !selectedCity && !selectedRegion && (
                                        <Button
                                            onClick={() => {
                                                setSelectedStore(null)
                                                setIsFormOpen(true)
                                            }}
                                            leftIcon={<Plus className="w-5 h-5" />}
                                        >
                                            Add Store
                                        </Button>
                                    )}
                                </div>
                            </FadeIn>
                        )}
                    </div>
                ) : (
                    /* List View */
                    <div className="space-y-4">
                        {storesLoading ? (
                            // Loading skeletons for list view
                            Array.from({ length: 5 }).map((_, i) => (
                                <FadeIn key={i} delay={i * 0.1}>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                                        <div className="flex items-center space-x-4">
                                            <Skeleton avatarSize="sm" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton width="50%" height="16px" />
                                                <Skeleton width="75%" height="14px" />
                                            </div>
                                            <Skeleton width="100px" height="32px" />
                                        </div>
                                    </div>
                                </FadeIn>
                            ))
                        ) : filteredStores && filteredStores.length > 0 ? (
                            filteredStores.map((store, index) => (
                                <FadeIn key={store.id} delay={index * 0.1}>
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <Card hover>
                                            <CardContent>
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                                                            <StoreIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2">
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                                {store.name}
                                                            </h3>
                                                            {!store.isActive && (
                                                                <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900 rounded-full">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{store.address}, {store.city}, {store.region}</span>
                                                        </div>
                                                    </div>
                                                    {user?.role === 'ADMIN' && (
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedStore(store)
                                                                    setIsFormOpen(true)
                                                                }}
                                                                leftIcon={<Edit className="w-4 h-4" />}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(store.id)}
                                                                leftIcon={<Trash2 className="w-4 h-4" />}
                                                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </FadeIn>
                            ))
                        ) : (
                            <FadeIn>
                                <div className="text-center py-12">
                                    <StoreIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        No stores found
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        {searchTerm || selectedCity || selectedRegion ? 'Try adjusting your filters' : 'Get started by adding your first store'}
                                    </p>
                                    {user?.role === 'ADMIN' && !searchTerm && !selectedCity && !selectedRegion && (
                                        <Button
                                            onClick={() => {
                                                setSelectedStore(null)
                                                setIsFormOpen(true)
                                            }}
                                            leftIcon={<Plus className="w-5 h-5" />}
                                        >
                                            Add Store
                                        </Button>
                                    )}
                                </div>
                            </FadeIn>
                        )}
                    </div>
                )}

                {/* Form Modal */}
                <AnimatePresence>
                    {isFormOpen && (
                        <StoreForm
                            store={selectedStore}
                            onClose={() => {
                                setIsFormOpen(false)
                                setSelectedStore(null)
                            }}
                            onSubmit={handleFormSubmit}
                            isLoading={createMutation.isLoading || updateMutation.isLoading}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Stores