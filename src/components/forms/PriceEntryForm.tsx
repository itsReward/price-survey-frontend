import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Package, Store, DollarSign, Hash, FileText } from 'lucide-react'
import { useQuery } from 'react-query'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import { PriceEntry, PriceEntryRequest } from '@/types/priceEntry'
import { storeService } from '@/services/store'
import { productService } from '@/services/product'

interface PriceEntryFormProps {
    entry?: PriceEntry | null
    onClose: () => void
    onSubmit: (data: PriceEntryRequest) => void
    isLoading: boolean
}

const PriceEntryForm: React.FC<PriceEntryFormProps> = ({
                                                           entry,
                                                           onClose,
                                                           onSubmit,
                                                           isLoading
                                                       }) => {
    const [formData, setFormData] = useState<PriceEntryRequest>({
        storeId: entry?.store.id || 0,
        productId: entry?.product.id || 0,
        price: entry?.price || 0,
        quantity: entry?.quantity || 1,
        notes: entry?.notes || ''
    })

    const [errors, setErrors] = useState<{[key: string]: string}>({})

    // Fetch stores and products

    const { data: stores, isLoading: storesLoading } = useQuery('stores', storeService.getStores)
    const { data: products, isLoading: productsLoading } = useQuery('products', productService.getProducts)


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 :
                name === 'quantity' || name === 'storeId' || name === 'productId' ? parseInt(value) || 0 :
                    value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {}

        if (!formData.storeId || formData.storeId === 0) newErrors['storeId'] = 'Please select a store'
        if (!formData.productId || formData.productId === 0) newErrors['productId'] = 'Please select a product'
        if (!formData.price || formData.price <= 0) newErrors['price'] = 'Please enter a valid price'
        if (!formData.quantity || formData.quantity <= 0) newErrors['quantity'] = 'Please enter a valid quantity'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit(formData)
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
                                {entry ? 'Edit Price Entry' : 'Add Price Entry'}
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
                            {/* Store Selection */}
                            <div>
                                <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Store *
                                </label>
                                <div className="relative">
                                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        id="storeId"
                                        name="storeId"
                                        value={formData.storeId}
                                        onChange={handleInputChange}
                                        disabled={storesLoading}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                            errors['storeId'] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value={0}>
                                            {storesLoading ? 'Loading stores...' : 'Select a store'}
                                        </option>
                                        {stores?.map((store) => (
                                            <option key={store.id} value={store.id}>
                                                {store.name} - {store.city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors['storeId'] && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['storeId']}</p>
                                )}
                            </div>

                            {/* Product Selection */}
                            <div>
                                <label htmlFor="productId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Product *
                                </label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        id="productId"
                                        name="productId"
                                        value={formData.productId}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                            errors['productId'] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value={0}>Select a product</option>
                                        {products?.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} ({product.volumeMl}ml) - {product.category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors['productId'] && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['productId']}</p>
                                )}
                            </div>

                            {/* Price and Quantity */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Price *
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            step="0.01"
                                            min="0"
                                            value={formData.price || ''}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                                errors['price'] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors['price'] && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['price']}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Quantity *
                                    </label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            id="quantity"
                                            name="quantity"
                                            min="1"
                                            value={formData.quantity || ''}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                                errors['quantity'] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="1"
                                        />
                                    </div>
                                    {errors['quantity'] && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['quantity']}</p>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Notes (Optional)
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows={3}
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Add any additional notes..."
                                    />
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
                                    {entry ? 'Update' : 'Save'} Entry
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

export default PriceEntryForm