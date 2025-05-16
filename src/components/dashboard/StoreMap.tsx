import React, { useState, useEffect, useRef } from 'react'
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

// Global state to track Google Maps loading
let googleMapsPromise: Promise<void> | null = null
let googleMapsLoaded = false

const loadGoogleMaps = async (apiKey: string): Promise<void> => {
    if (googleMapsLoaded) {
        return Promise.resolve()
    }

    if (googleMapsPromise) {
        return googleMapsPromise
    }

    googleMapsPromise = new Promise((resolve, reject) => {
        // Check if Google Maps is already loaded
        if (window.google?.maps) {
            googleMapsLoaded = true
            resolve()
            return
        }

        // Check if the script is already added
        const existingScript = document.querySelector(
            `script[src*="maps.googleapis.com/maps/api/js"]`
        )
        if (existingScript) {
            // Script exists, just wait for it to load
            const checkGoogle = () => {
                if (window.google?.maps) {
                    googleMapsLoaded = true
                    resolve()
                } else {
                    setTimeout(checkGoogle, 100)
                }
            }
            checkGoogle()
            return
        }

        // Create a unique callback name
        const callbackName = `initGoogleMap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        // Add the callback to window
        window[callbackName] = () => {
            googleMapsLoaded = true
            delete window[callbackName] // Clean up
            resolve()
        }

        // Create and add the script
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&loading=async`
        script.async = true
        script.defer = true
        script.onerror = () => {
            delete window[callbackName]
            googleMapsPromise = null
            reject(new Error('Failed to load Google Maps'))
        }

        document.head.appendChild(script)
    })

    return googleMapsPromise
}

const GoogleStoreMap: React.FC<StoreMapProps> = ({
                                                     height = 'h-96',
                                                     showControls = true
                                                 }) => {
    const [selectedStore, setSelectedStore] = useState<MapStore | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [mapsReady, setMapsReady] = useState(googleMapsLoaded)
    const [mapError, setMapError] = useState<string | null>(null)
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<google.maps.Map | null>(null)
    const markersRef = useRef<google.maps.Marker[]>([])
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

    const { data: stores, isLoading, error } = useQuery(
        'stores-for-map',
        storeService.getStoresForMap,
        {
            staleTime: 10 * 60 * 1000,
        }
    )

    // Helper function to properly determine if a store is active
    const isStoreActive = (store: any): boolean => {
        console.log(`Checking store ${store.name}:`, {
            isActive: store.isActive,
            type: typeof store.isActive,
            rawValue: JSON.stringify(store.isActive)
        })

        // Handle different possible formats
        if (typeof store.isActive === 'boolean') {
            return store.isActive
        }

        // Handle string values
        if (typeof store.isActive === 'string') {
            const lowercased = store.isActive.toLowerCase()
            return lowercased === 'true' || lowercased === '1' || lowercased === 'active'
        }

        // Handle numeric values (1 = active, 0 = inactive)
        if (typeof store.isActive === 'number') {
            return store.isActive === 1
        }

        // Handle null/undefined - could check other fields
        if (store.isActive == null) {
            // Maybe check if store has a status field instead
            if (store.status) {
                return store.status.toLowerCase() === 'active'
            }
            // Default to active if we can't determine
            console.warn(`Cannot determine if store ${store.name} is active, defaulting to active`)
            return true
        }

        return Boolean(store.isActive)
    }

    // Load Google Maps API
    useEffect(() => {
        const initGoogleMaps = async () => {
            const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

            if (!GOOGLE_MAPS_API_KEY) {
                setMapError('Google Maps API key not configured')
                return
            }

            try {
                await loadGoogleMaps(GOOGLE_MAPS_API_KEY)
                setMapsReady(true)
            } catch (error) {
                console.error('Failed to load Google Maps:', error)
                setMapError('Failed to load Google Maps')
            }
        }

        initGoogleMaps()
    }, [])

    // Initialize map when Google Maps is loaded
    useEffect(() => {
        if (!mapsReady || !mapContainerRef.current || mapRef.current) return

        mapRef.current = new google.maps.Map(mapContainerRef.current, {
            zoom: 10,
            center: { lat: 0, lng: 0 },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        })

        infoWindowRef.current = new google.maps.InfoWindow()
    }, [mapsReady])

    // Update markers when stores change
    useEffect(() => {
        if (!mapsReady || !mapRef.current || !stores) return

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []

        // Filter valid stores and log their data
        const validStores = stores.filter(store => {
            const hasValidCoords = store.latitude !== null &&
                store.longitude !== null &&
                !isNaN(store.latitude) &&
                !isNaN(store.longitude) &&
                Math.abs(store.latitude) <= 90 &&
                Math.abs(store.longitude) <= 180

            console.log(`Store ${store.name}:`, {
                hasValidCoords,
                isActive: isStoreActive(store),
                rawData: store
            })

            return hasValidCoords
        })

        if (validStores.length === 0) return

        // Create bounds
        const bounds = new google.maps.LatLngBounds()

        // Add markers with proper isActive detection
        validStores.forEach(store => {
            const storeIsActive = isStoreActive(store)

            // Create a custom SVG marker icon (teardrop style like Leaflet)
            const svgIcon = {
                url: `data:image/svg+xml,${encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="40" viewBox="0 0 24 40">
                        <path d="M12 0c-6.6 0-12 5.4-12 12 0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z" 
                              fill="${storeIsActive ? '#10b981' : '#ef4444'}" 
                              stroke="#ffffff" 
                              stroke-width="2"/>
                        <circle cx="12" cy="12" r="6" fill="#ffffff"/>
                    </svg>
                `)}`,
                scaledSize: new google.maps.Size(24, 40),
                anchor: new google.maps.Point(12, 40),
            }

            const marker = new google.maps.Marker({
                position: { lat: store.latitude, lng: store.longitude },
                map: mapRef.current,
                title: store.name,
                icon: svgIcon,
                zIndex: 1,
            })

            // Add click listener for the marker
            marker.addListener('click', () => {
                if (infoWindowRef.current) {
                    const content = `
                        <div style="min-width: 200px; padding: 8px;">
                            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: ${storeIsActive ? '#10b981' : '#ef4444'};">${store.name}</h3>
                            <p style="margin: 4px 0; color: #666; font-size: 14px;">${store.address}</p>
                            <p style="margin: 4px 0; color: #666; font-size: 14px;">${store.city}</p>
                            <p style="margin: 4px 0; font-size: 12px; color: #999;">${store.latitude.toFixed(4)}, ${store.longitude.toFixed(4)}</p>
                            <p style="margin: 4px 0; font-size: 12px; font-weight: bold; color: ${storeIsActive ? '#10b981' : '#ef4444'};">
                                ${storeIsActive ? 'Active' : 'Inactive'}
                            </p>
                        </div>
                    `
                    infoWindowRef.current.setContent(content)
                    infoWindowRef.current.open(mapRef.current, marker)
                }
            })

            markersRef.current.push(marker)
            bounds.extend({ lat: store.latitude, lng: store.longitude })
        })

        // Fit map to bounds
        if (validStores.length > 0) {
            mapRef.current.fitBounds(bounds)

            // Set minimum zoom level
            const listener = google.maps.event.addListener(mapRef.current, 'idle', () => {
                if (mapRef.current!.getZoom()! > 15) {
                    mapRef.current!.setZoom(15)
                }
                google.maps.event.removeListener(listener)
            })
        }
    }, [stores, mapsReady])

    // Handle fullscreen
    useEffect(() => {
        if (mapRef.current) {
            setTimeout(() => {
                google.maps.event.trigger(mapRef.current, 'resize')
            }, 100)
        }
    }, [isFullscreen])

    if (error || mapError) {
        return (
            <Card>
                <CardContent>
                    <div className="text-center py-8">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-red-500">Error loading store locations</p>
                        <p className="text-sm text-gray-500 mt-2">{error?.toString() || mapError}</p>
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
                    <div className={`${isFullscreen ? 'h-[calc(100vh-8rem)]' : height} w-full relative`}>
                        {isLoading || !mapsReady ? (
                            <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {!mapsReady ? 'Loading Google Maps...' : 'Loading store locations...'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div
                                ref={mapContainerRef}
                                className="w-full h-full rounded-lg"
                                style={{ minHeight: '400px' }}
                            />
                        )}

                        {/* Legend overlay */}
                        {mapsReady && (
                            <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg z-10">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Legend</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Active Store</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Inactive Store</span>
                                    </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        {stores?.length || 0} stores
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default GoogleStoreMap