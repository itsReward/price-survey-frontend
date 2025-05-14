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
        store.latitude && store.longitude
    ) || []

    // Generate Google Maps embed URL with markers
    const generateMapUrl = () => {
        if (!validStores.length) return ''

        // Calculate center based on store locations
        const avgLat = validStores.reduce((sum, store) => sum + store.latitude, 0) / validStores.length
        const avgLng = validStores.reduce((sum, store) => sum + store.longitude, 0) / validStores.length

        // Create markers for each store
        const markers = validStores.map(store => {
            const color = store.isActive ? 'green' : 'red'
            return `${encodeURIComponent(`${store.name} (${store.city})`)};${store.latitude},${store.longitude};${color}`
        }).join('|')

        return `https://maps.google.com/maps/api/staticmap?center=${avgLat},${avgLng}&zoom=10&size=800x400&scale=2&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}&markers=${markers}&map_style=feature:poi|visibility:off`
    }

    const mapUrl = generateMapUrl()

    // Alternative: Create a simple custom map visualization
    const renderCustomMap = () => {
        if (!validStores.length) return <div>No stores with valid coordinates found</div>

        // Calculate bounds
        const lats = validStores.map(s => s.latitude)
        const lngs = validStores.map(s => s.longitude)
        const minLat = Math.min(...lats)
        const maxLat = Math.max(...lats)
        const minLng = Math.min(...lngs)
        const maxLng = Math.max(...lngs)

        // Normalize coordinates for display
        const normalizeCoords = (lat: number, lng: number) => ({
            x: ((lng - minLng) / (maxLng - minLng)) * 100,
            y: (1 - (lat - minLat) / (maxLat - minLat)) * 100
        })

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

                {/* Store markers */}
                {validStores.map((store, index) => {
                    const { x, y } = normalizeCoords(store.latitude, store.longitude)
                    return (
                        <motion.div
                            key={store.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer"
                            style={{ left: `${x}%`, top: `${y}%` }}
                            onClick={() => setSelectedStore(store)}
                            onMouseEnter={() => setSelectedStore(store)}
                        >
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className={`relative z-10 ${store.isActive ? 'text-green-500' : 'text-red-500'}`}
                            >
                                <MapPin className="w-8 h-8 drop-shadow-lg" />
                                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${store.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                            </motion.div>
                        </motion.div>
                    )
                })}

                {/* Store info popup */}
                {selectedStore && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-20"
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
                            <MapPin className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Active Store</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Inactive Store</span>
                        </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            {validStores.length} stores shown
                        </p>
                    </div>
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