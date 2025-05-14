import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { storeService } from '@/services/store'
import { MapPin, Store as StoreIcon, Maximize2, Minimize2 } from 'lucide-react'

interface StoreMapProps {
    height?: string
    showControls?: boolean
}

interface MapStore {
    id: number
    name: string
    address: string
    city: string
    latitude: number
    longitude: number
    isActive: boolean
}

const StoreMap: React.FC<StoreMapProps> = ({
                                               height = 'h-96',
                                               showControls = true
                                           }) => {
    const [selectedStore, setSelectedStore] = useState<MapStore | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const { data: stores, isLoading, error } = useQuery(
        'stores-for-map',
        storeService.getStoresForMap,
        {
            staleTime: 10 * 60 * 1000, // 10 minutes
        }
    )

    // Filter stores with valid coordinates
    const validStores = stores?.filter(store =>
        store.latitude !== null &&
        store.longitude !== null &&
        !isNaN(store.latitude) &&
        !isNaN(store.longitude)
    ) || []

    console.log('ValidStores:', validStores) // Debug log

    // Create a simple custom map visualization
    const renderCustomMap = () => {
        if (!validStores.length) {
            return (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No stores with valid coordinates found</p>
                    </div>
                </div>
            )
        }

        // Calculate bounds with some padding
        const lats = validStores.map(s => s.latitude)
        const lngs = validStores.map(s => s.longitude)
        const minLat = Math.min(...lats)
        const maxLat = Math.max(...lats)
        const minLng = Math.min(...lngs)
        const maxLng = Math.max(...lngs)

        // Add padding to bounds (10% of range)
        const latRange = maxLat - minLat
        const lngRange = maxLng - minLng
        const padding = 0.1

        const paddedMinLat = minLat - (latRange * padding)
        const paddedMaxLat = maxLat + (latRange * padding)
        const paddedMinLng = minLng - (lngRange * padding)
        const paddedMaxLng = maxLng + (lngRange * padding)

        // Normalize coordinates for display (0-100%)
        const normalizeCoords = (lat: number, lng: number) => {
            // Handle single point case
            if (paddedMaxLat === paddedMinLat && paddedMaxLng === paddedMinLng) {
                return { x: 50, y: 50 }
            }

            const x = paddedMaxLng === paddedMinLng ? 50 :
                ((lng - paddedMinLng) / (paddedMaxLng - paddedMinLng)) * 100
            const y = paddedMaxLat === paddedMinLat ? 50 :
                (1 - (lat - paddedMinLat) / (paddedMaxLat - paddedMinLat)) * 100

            return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
        }

        console.log('Bounds:', { minLat, maxLat, minLng, maxLng }) // Debug log

        return (
            <div className="relative w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 overflow-hidden rounded-lg">
                {/* Background grid */}
                <svg className="absolute inset-0 w-full h-full">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-200 dark:text-gray-600 opacity-30"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Latitude labels */}
                <div className="absolute left-2 top-4 text-xs text-gray-500 dark:text-gray-400">
                    {paddedMaxLat.toFixed(2)}°
                </div>
                <div className="absolute left-2 bottom-4 text-xs text-gray-500 dark:text-gray-400">
                    {paddedMinLat.toFixed(2)}°
                </div>

                {/* Longitude labels */}
                <div className="absolute top-2 left-4 text-xs text-gray-500 dark:text-gray-400">
                    {paddedMinLng.toFixed(2)}°
                </div>
                <div className="absolute top-2 right-4 text-xs text-gray-500 dark:text-gray-400">
                    {paddedMaxLng.toFixed(2)}°
                </div>

                {/* Store markers */}
                {validStores.map((store, index) => {
                    const { x, y } = normalizeCoords(store.latitude, store.longitude)

                    console.log(`Store ${store.name}: lat=${store.latitude}, lng=${store.longitude}, x=${x}%, y=${y}%`) // Debug log

                    return (
                        <motion.div
                            key={store.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                            style={{ left: `${x}%`, top: `${y}%` }}
                            onClick={() => setSelectedStore(store)}
                            onMouseEnter={() => setSelectedStore(store)}
                            onMouseLeave={() => setSelectedStore(null)}
                        >
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className={`relative z-10 ${store.isActive ? 'text-green-500' : 'text-red-500'}`}
                            >
                                <MapPin className="w-8 h-8 drop-shadow-lg" fill="currentColor" />
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
                            </motion.div>
                        </motion.div>
                    )
                })}

                {/* Store info popup */}
                {selectedStore && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-20 max-w-sm mx-auto"
                    >
                        <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 p-2 rounded-lg ${selectedStore.isActive ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                                <StoreIcon className={`w-5 h-5 ${selectedStore.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                    {selectedStore.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                    {selectedStore.address}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                    {selectedStore.city}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {selectedStore.latitude.toFixed(4)}, {selectedStore.longitude.toFixed(4)}
                                </p>
                                <p className={`text-xs font-medium mt-1 ${selectedStore.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                    {selectedStore.isActive ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Legend */}
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Legend</h4>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-green-500" fill="currentColor" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Active Store</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-red-500" fill="currentColor" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Inactive Store</span>
                        </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            {validStores.length} stores shown
                        </p>
                    </div>
                </div>

                {/* Zoom level indicator */}
                <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-2 shadow">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Custom Map View
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <div className="text-center py-8">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-red-500">Error loading store locations</p>
                        <p className="text-sm text-gray-500 mt-2">{error.toString()}</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <motion.div
            className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : ''}`}
            layout
        >
            <Card className={isFullscreen ? 'h-full rounded-none' : ''}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Store Locations
                        </h3>
                        {showControls && (
                            <div className="flex space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsFullscreen(!isFullscreen)}
                                    leftIcon={isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                >
                                    {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className={`${isFullscreen ? 'h-[calc(100vh-8rem)]' : height} w-full`}>
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                            </div>
                        ) : (
                            renderCustomMap()
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default StoreMap