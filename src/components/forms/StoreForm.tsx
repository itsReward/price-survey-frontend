import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Store, MapPin, Globe, Navigation, Hash } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import { Store as StoreType, StoreRequest } from '@/types/store'

interface StoreFormProps {
    store?: StoreType | null
    onClose: () => void
    onSubmit: (data: StoreRequest) => void
    isLoading: boolean
}

const StoreForm: React.FC<StoreFormProps> = ({
                                                 store,
                                                 onClose,
                                                 onSubmit,
                                                 isLoading
                                             }) => {
    const [formData, setFormData] = useState<StoreRequest>({
        name: store?.name || '',
        address: store?.address || '',
        city: store?.city || '',
        region: store?.region || '',
        country: store?.country || '',
        latitude: store?.latitude || undefined,
        longitude: store?.longitude || undefined
    })

    const [errors, setErrors] = useState<{[key: string]: string}>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'latitude' || name === 'longitude' ?
                (value === '' ? undefined : parseFloat(value)) : value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {}

        if (!formData.name.trim()) newErrors['name'] = 'Store name is required'
        if (!formData.address.trim()) newErrors['address'] = 'Address is required'
        if (!formData.city.trim()) newErrors['city'] = 'City is required'
        if (!formData.region.trim()) newErrors['region'] = 'Region is required'
        if (!formData.country.trim()) newErrors['country'] = 'Country is required'

        // Validate coordinates if provided
        if (formData.latitude !== undefined) {
            if (formData.latitude < -90 || formData.latitude > 90) {
                newErrors['latitude'] = 'Latitude must be between -90 and 90'
            }
        }
        if (formData.longitude !== undefined) {
            if (formData.longitude < -180 || formData.longitude > 180) {
                newErrors['longitude'] = 'Longitude must be between -180 and 180'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit(formData)
        }
    }

    const handleGetCurrentLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }))
                },
                (error) => {
                    console.error('Error getting location:', error)
                    // You might want to show a toast error here
                }
            )
        }
    }

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
                                {store ? 'Edit Store' : 'Add Store'}
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
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Store Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Store Name *
                                </label>
                                <div className="relative">
                                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                            errors['name'] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter store name"
                                    />
                                </div>
                                {errors['name'] && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-sm text-red-600 dark:text-red-400"
                                    >
                                        {errors['name']}
                                    </motion.p>
                                )}
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Address *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                            errors['address'] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter store address"
                                    />
                                </div>
                                {errors['address'] && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-sm text-red-600 dark:text-red-400"
                                    >
                                        {errors['address']}
                                    </motion.p>
                                )}
                            </div>

                            {/* City and Region */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                            errors['city'] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="City"
                                    />
                                    {errors['city'] && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-1 text-sm text-red-600 dark:text-red-400"
                                        >
                                            {errors['city']}
                                        </motion.p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Region *
                                    </label>
                                    <input
                                        type="text"
                                        id="region"
                                        name="region"
                                        value={formData.region}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                            errors['region'] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Region"
                                    />
                                    {errors['region'] && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-1 text-sm text-red-600 dark:text-red-400"
                                        >
                                            {errors['region']}
                                        </motion.p>
                                    )}
                                </div>
                            </div>

                            {/* Country */}
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Country *
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                            errors['country'] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter country"
                                    />
                                </div>
                                {errors['country'] && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-sm text-red-600 dark:text-red-400"
                                    >
                                        {errors['country']}
                                    </motion.p>
                                )}
                            </div>

                            {/* Coordinates */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Location Coordinates (Optional)
                                    </label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleGetCurrentLocation}
                                        leftIcon={<Navigation className="w-4 h-4" />}
                                    >
                                        Use Current
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="latitude" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Latitude
                                        </label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="number"
                                                id="latitude"
                                                name="latitude"
                                                step="any"
                                                value={formData.latitude || ''}
                                                onChange={handleInputChange}
                                                className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                                    errors['latitude'] ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="-90 to 90"
                                            />
                                        </div>
                                        {errors['latitude'] && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-1 text-xs text-red-600 dark:text-red-400"
                                            >
                                                {errors['latitude']}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="longitude" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Longitude
                                        </label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="number"
                                                id="longitude"
                                                name="longitude"
                                                step="any"
                                                value={formData.longitude || ''}
                                                onChange={handleInputChange}
                                                className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                                    errors['longitude'] ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="-180 to 180"
                                            />
                                        </div>
                                        {errors['longitude'] && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-1 text-xs text-red-600 dark:text-red-400"
                                            >
                                                {errors['longitude']}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex space-x-3 pt-4">
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    isLoading={isLoading}
                                    leftIcon={<Save className="w-5 h-5" />}
                                >
                                    {store ? 'Update' : 'Save'} Store
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}

export default StoreForm