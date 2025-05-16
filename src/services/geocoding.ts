// geocoding.ts - Service for converting addresses to coordinates
export interface GeocodeResult {
    latitude: number
    longitude: number
    formattedAddress?: string
    accuracy?: 'rooftop' | 'range_interpolated' | 'geometric_center' | 'approximate'
}

export interface GeocodeError {
    message: string
    code: 'QUOTA_EXCEEDED' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'NOT_FOUND' | 'UNKNOWN_ERROR'
}

class GeocodingService {
    private readonly googleMapsApiKey: string | undefined

    constructor() {
        // Use proper environment variable access for Vite
        this.googleMapsApiKey = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined
    }

    // Primary method using Google Maps API (most accurate)
    async geocodeWithGoogle(address: string, city?: string, region?: string, country?: string): Promise<GeocodeResult> {
        if (!this.googleMapsApiKey) {
            throw new Error('Google Maps API key not configured')
        }

        // Build full address string
        const fullAddress = [address, city, region, country].filter(Boolean).join(', ')
        const encodedAddress = encodeURIComponent(fullAddress)

        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${this.googleMapsApiKey}`

        try {
            const response = await fetch(url)
            const data = await response.json()

            if (data.status === 'OK' && data.results.length > 0) {
                const result = data.results[0]
                return {
                    latitude: result.geometry.location.lat,
                    longitude: result.geometry.location.lng,
                    formattedAddress: result.formatted_address,
                    accuracy: result.geometry.location_type.toLowerCase()
                }
            } else {
                throw new Error(`Geocoding failed: ${data.status}`)
            }
        } catch (error) {
            console.error('Google Maps geocoding error:', error)
            throw error
        }
    }

    // Fallback method using OpenStreetMap Nominatim (free, no API key required)
    async geocodeWithNominatim(address: string, city?: string, region?: string, country?: string): Promise<GeocodeResult> {
        const params = new URLSearchParams({
            format: 'json',
            limit: '1',
            addressdetails: '1'
        })

        // Build structured query
        const queryParts: string[] = []
        if (address) queryParts.push(address)
        if (city) queryParts.push(city)
        if (region) queryParts.push(region)
        if (country) queryParts.push(country)

        params.append('q', queryParts.join(', '))

        const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`

        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'PriceSurvey/1.0'
                }
            })

            const data = await response.json()

            if (data.length > 0) {
                const result = data[0]
                return {
                    latitude: parseFloat(result.lat),
                    longitude: parseFloat(result.lon),
                    formattedAddress: result.display_name,
                    accuracy: result.importance > 0.8 ? 'rooftop' : 'approximate'
                }
            } else {
                throw new Error('No results found')
            }
        } catch (error) {
            console.error('Nominatim geocoding error:', error)
            throw error
        }
    }

    // Main geocoding method with fallback
    async geocodeAddress(address: string, city?: string, region?: string, country?: string): Promise<GeocodeResult> {
        // First try Google Maps if API key is available
        if (this.googleMapsApiKey) {
            try {
                return await this.geocodeWithGoogle(address, city, region, country)
            } catch (error) {
                console.warn('Google Maps geocoding failed, trying fallback...')
            }
        }

        // Fallback to Nominatim
        try {
            return await this.geocodeWithNominatim(address, city, region, country)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            throw new Error(`All geocoding methods failed: ${errorMessage}`)
        }
    }

    // Get current location using browser geolocation API
    getCurrentLocation(): Promise<GeocodeResult> {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'))
                return
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    })
                },
                (error) => {
                    let message = 'Unknown error'
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = 'Geolocation permission denied'
                            break
                        case error.POSITION_UNAVAILABLE:
                            message = 'Location information unavailable'
                            break
                        case error.TIMEOUT:
                            message = 'Location request timed out'
                            break
                    }
                    reject(new Error(message))
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            )
        })
    }
}

export const geocodingService = new GeocodingService()